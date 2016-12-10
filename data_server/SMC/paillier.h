

#ifndef PAILLIER_H
#define PAILLIER_H

#include <gmpxx.h>
#include <time.h>

//  Class designed to hold the public key used to encrypt data
class Paillier_Public_Key
{
    public:
        //  Defualt constructor for setting up a public key
        //  Pre:    N/A
        //  Post:   Creates a public key with n and g equal to 1
        Paillier_Public_Key():m_n(1),m_g(1){}
        
        //  Creates a public key class using known key values
        //  Pre:    n and g must be valid values for a Paillier public key
        //  Post:   public key class containing the specified n and g values
        Paillier_Public_Key(const mpz_class& n, const mpz_class& g):m_n(n),m_g(g){}
        
        mpz_class m_n;
        mpz_class m_g;
};

//  Class designed to hold the Paillier private key used to decrypt data
class Paillier_Private_Key
{
    public:
        //  Defualt constructor for setting up a private key
        //  Pre:    N/A
        //  Post:   Creates a private key with lambda and mu equal to 1    
        Paillier_Private_Key():m_lambda(1),m_mu(1){}
        
        //  Creates a private key class using known key values
        //  Pre:    lambda and mu must be valid values for a Paillier private key
        //  Post:   private key class containing the specified lambda and mu values        
        Paillier_Private_Key(const mpz_class& lambda, const mpz_class& mu):
            m_lambda(lambda),m_mu(mu){}
        mpz_class m_lambda;
        mpz_class m_mu;
};

//  Class that using known private/public keys can encrypt/decrypt data
class Paillier
{
    public:
        Paillier(){}
        
        //  Constructs a Paillier class that can be used to ONLY encrypt data 
        //  Pre:    Provided public key "public_k" must be a valid Paillier public key
        //  Post:   A Paillier class that can ONLY encrypt data. Unknown results if decryption
        //          is performed
        Paillier(const Paillier_Public_Key& public_k);
        
        //  Constructs a Paillier class that can be used to both encrypt data and decrypt data
        //  Pre:    Provided public key "public_k" must be a valid Paillier public key
        //          Provided private key "private_k" must be valid Paillier private key
        //          Both the private and public key must the associated key pair
        //  Post:   A Paillier class that can encrypt data and decrypt it.
        Paillier(const Paillier_Public_Key& public_k, const Paillier_Private_Key& private_k);
        
        
        ~Paillier(){}
        
        //  Function to encrypt plaintext into cipher text
        //  Pre:    Must be provided a location "cipher" to store the cipher text
        //  Post:   The value at "cipher" will be overwritten with the encrypted version of 
        //          "mesg"
        void encrypt(const mpz_class& mesg, mpz_class& cipher);
        
        //  Function to decrypt a given cipher text back into plain text
        //  Pre:    The cipehr text "cipher" must have been encrypted with the public key
        //          stored in the class. Another instance of the Paillier class is allowed 
        //          to encrypt the data if it used the same public key as this instance.
        //  Post:   The value at "mesg" will be overwritten with the decrypted version of 
        //          "cipher"
        void decrypt(const mpz_class& cipher, mpz_class& mesg);
        
        //  Accesssor to retrieve the stored n value
        //  Pre:    N/A
        //  Post:   returns the value of n
        mpz_class get_n()const{return m_public_k.m_n;}
        
    private:
        //  Function to set varibles used by both constructions of the Paillier class
        //  Pre:    Paillier class must have been set up with a proper public key
        //  Post:   Computes the square of n stored as "m_n_square"
        //          Seeds the random number genrator using the current system time.
        void set_up_var();
        
        mpz_class m_n_square;
        Paillier_Public_Key m_public_k;
        Paillier_Private_Key m_private_k;
        gmp_randclass m_random_num{gmp_randinit_default};
        
        
};



#endif