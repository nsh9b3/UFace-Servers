#include "paillier.h"

Paillier::Paillier(const Paillier_Public_Key& public_k):m_public_k(public_k)
{
    set_up_var();
}


Paillier::Paillier(const Paillier_Public_Key& public_k, const Paillier_Private_Key& private_k):
    m_public_k(public_k),m_private_k(private_k)
{
    set_up_var();
}

void Paillier::set_up_var()
{
    m_n_square = m_public_k.m_n * m_public_k.m_n;
    m_random_num.seed(time(NULL));
}


void Paillier::encrypt(const mpz_class& mesg, mpz_class& cipher)
{
    mpz_class r_pow_n;
    mpz_class g_pow_m;
    //  generate random num 1 to n-1
    //  first generate random value 0 to n-2 (how get_z_range() works)
    //  then add 1 to make it 1 to n-1    
    mpz_class r(m_random_num.get_z_range((m_public_k.m_n)-1)+1);
    
    //compute r^n mod n^2
    mpz_powm(r_pow_n.get_mpz_t(), r.get_mpz_t(), m_public_k.m_n.get_mpz_t(), m_n_square.get_mpz_t());
    
    //compute g^m mod n^2
    mpz_powm(g_pow_m.get_mpz_t(), m_public_k.m_g.get_mpz_t(), mesg.get_mpz_t(), m_n_square.get_mpz_t());
    
    cipher = (g_pow_m * r_pow_n) % m_n_square;
}

void Paillier::decrypt(const mpz_class& cipher, mpz_class& mesg)
{
    mpz_class temp;
    
    //compute temp = c^lambda mod n^2
    mpz_powm(temp.get_mpz_t(), cipher.get_mpz_t(), m_private_k.m_lambda.get_mpz_t(),
        m_n_square.get_mpz_t());
        
    //compute temp = ((c^lambda mod n^2) - 1) / n
    temp = (temp-1) / m_public_k.m_n;
    
    mesg = (temp * m_private_k.m_mu) % m_public_k.m_n;
    
}
