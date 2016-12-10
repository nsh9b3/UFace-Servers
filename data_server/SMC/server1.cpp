#include "server1.h"


Server_One::Server_One(const Paillier_Public_Key& key, const std::string &base_file, 
                       const std::string &test_file, const mpz_class& max_rand_size,
                       const int& num_entry, const int& picture_size):m_encryptor(key)
{
    m_num_entry = num_entry;
    m_max_rand_size = max_rand_size;
    m_n = key.m_n;
    m_histo_test.resize(m_num_entry);
    m_histo_base.resize(m_num_entry);
    m_threshold = .89 * picture_size;
    m_picture_size = picture_size;
    
    
    std::ifstream histo_file;
    histo_file.open(base_file);
    
    //  read in the ID associated with the base(existing)
    //  profile.
    //  Currently ignored
    //histo_file >> m_id_base;
    
    //  Read in the entries stored in the base file
    //std::ofstream debugfilebase("debugbase.txt");
    for(int i=0; i<num_entry; i++)
    {
        histo_file >> m_histo_base[i];
        //debugfilebase << m_histo_base[i] << std::endl;
    }
    //debugfilebase.close();
    
    histo_file.close();
    
    //  read in the histogram to try authentication with
    histo_file.open(test_file);
    
    //  Read in the ID that currently is not used for anything
    //histo_file >> m_id_test;
    
    //std::ofstream debugfiletest("debugtest.txt");
    //  Read in the entries stored in the test file
    for(int i=0; i<num_entry; i++)
    {
        histo_file >> m_histo_test[i];
        //debugfiletest << m_histo_test[i] << std::endl;
    }
    //debugfiletest.close();
    
    histo_file.close();
    
    
    // Calculate current system time. Currently ignored
    //std::chrono::system_clock::time_point tp_now = std::chrono::system_clock::now();
    //tt_now = std::chrono::system_clock::to_time_t(tp_now);

    

    //three vectors(now two) of random numbers for base, test, and other use
    m_random_vals_b.resize(m_num_entry);
    m_random_vals_t.resize(m_num_entry);
    //m_random_vals_r.resize(m_num_entry);
    
    
    //  Generate a random bit
    m_random_bit = m_random_num.get_z_bits(1);
    
    // Generate a random number for each of entry of base and test
    for(int i=0; i<m_num_entry; i++)
    {   
        m_random_vals_t[i] = m_random_num.get_z_range(m_n);
        m_random_vals_b[i] = m_random_num.get_z_range(m_n);
        //m_random_vals_r[i] = m_random_num.get_z_bits(20);
        
    }
}

void Server_One::step_one(std::string filename)
{
    std::ofstream file;
    
    //Prep the circuit's client input file;
    file.open("client");
    file << "s1randombit " << m_random_bit << std::endl;// << std::endl;
    file << "s1threshold " << m_threshold << std::endl;
    file << "picturesize " << m_picture_size << std::endl;
    file << "nval " << m_n << std::endl;
    file.close();

    
    file.open(filename);
    Pair temp;
    //  Output randomized entries for use by server 2 to a file
    for(int i=0; i<m_num_entry; i++)
    {
        step_one_i(i,temp);
        file << temp.m_test << std::endl << temp.m_base << std::endl;
    }
    file.close();
}

Pair Server_One::step_one_i(const int element)
{
    Pair pair_i;
    step_one_i(element, pair_i);
    return pair_i;
}

void Server_One::step_one_i(const int element, Pair& pair_i)
{
    mpz_class temp;
    mpz_class temp2;
    
    //[test_i + r]
    m_encryptor.encrypt(m_random_vals_t[element], temp);
    pair_i.m_test = temp * m_histo_test[element];
    
    //[base_i + r]
    m_encryptor.encrypt(m_random_vals_b[element], temp2);
    pair_i.m_base = temp2 * m_histo_base[element];
    
    //  Append the negative (unsigned) random values to the circuit input file
    std::ofstream file;
    file.open("client", std::ofstream::out | std::ofstream::app);

    //file << "s1testr" << element << " " << (m_max_rand_size - m_random_vals_t[element]) <<"\n";
    //file << "s1baser" << element << " " << (m_max_rand_size - m_random_vals_b[element]) <<"\n";
    file << "s1testr" << element << " " << (m_n - m_random_vals_t[element]) <<"\n";
    file << "s1baser" << element << " " << (m_n - m_random_vals_b[element]) <<"\n";
    file.close();
}


/*
Pair Server_One::step_one_id()
{
    Pair pair_id;
    step_one_id(pair_id);
    return pair_id;
       
}

void Server_One::step_one_id(Pair& pair_id)
{
    mpz_class temp;
    mpz_class temp2;
    
    //[id_test + r]
    m_encryptor.encrypt(m_random_vals_r[1], temp);
    pair_id.m_test = temp * m_id_test;
    
    //[id_base + r]
    m_encryptor.encrypt(m_random_vals_r[2], temp2);
    pair_id.m_base = temp2 * m_id_base;
    
}
*/


/*
mpz_class Server_One::step_one_time()
{
    mpz_class temp;
    mpz_class time_r;
    
    //[time_test + r]
    m_encryptor.encrypt(m_random_vals_r[3], temp);
    time_r = temp * m_time_test;
    std::ofstream file;
    file.open("client", std::ofstream::out | std::ofstream::app);
    file << "timenow " << tt_now << "\n";
    file << "timetestrval " << m_random_vals_r[3] << "\n";
    return time_r;
}
*/

/*
mpz_class Server_One::step_two()
{
    mpz_class sum_b = m_histo_base[0];
    for (int i=1; i<m_num_entry; i++)
    {
        sum_b = (sum_b * m_histo_base[i]);
    }
    m_r = (m_random_num.get_z_range(1000000000000));
    //m_r = 1;
    mpz_class r_e;
    m_encryptor.encrypt(m_r, r_e);
    mpz_class sum_b_r = (sum_b * r_e);// % m_max_rand_size;
    //std::cout << sum_b_r << std::endl << std::endl;
    return sum_b_r;
    
}
*/

/*
double Server_One::step_three(const mpz_class& base_r, const mpz_class& inter)
{
    //std::cout << inter << std::endl;
    
    //m_class percent(0) ;
    //mpz_class test = (base_r-m_r);
    //std::cout << test << std::endl;
    //mpz_class temp = inter - m_random_vals_r[0];
    mpz_class temp = (inter + m_random_bit) % 2;
    //std::cout << temp << std::endl;
    mpz_class temp2 = base_r-m_r;
    //std::cout << (base_r-m_r) << std::endl;
    
    double temp3 = mpz_get_d(temp.get_mpz_t());
    double temp4 = mpz_get_d(temp2.get_mpz_t());
    double percent = (temp3* 100) / temp4;
    return percent;
    
    
}
*/


int Server_One::step_three(const mpz_class& intersection)
{
    //  Quick XOR operation
    mpz_class temp = (intersection + m_random_bit) % 2;
    
    int temp3 = mpz_get_ui(temp.get_mpz_t());
    return temp3;
    
    
}

std::string Server_One::step_three_str(const mpz_class& intersection)
{
    //  Quick XOR operation
    mpz_class temp = (intersection + m_random_bit) % 2;
    std::string result;
    result = (1==temp) ? "Pass" : "Fail";
    
    return result;
    
    
}
