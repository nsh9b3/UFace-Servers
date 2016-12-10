
#ifndef SERVER_1_H
#define SERVER_1_H

#include <vector>
#include <gmpxx.h>
#include <fstream>
#include <chrono>
#include <ctime>

#include "pair.h"
#include "paillier.h"
/*
class Time_err
{
    public:
        Time_err(){}        
};
*/

class Server_One
{
    public:
        Server_One(){}
        
        //  Set up a simulated server 1 that holds the encrypted version of the image.
        //  Pre:    "base_file" is the name of the file that represents the data already
        //              stored on Sever1.
        //          "test_file is the name of the file that represents the data submitted
        //              by the Client to authenticate.
        //          The format of both the base and test file is as follows:
        //          -Both contain encypted circuit entries where the first entry is a 
        //              id/time stamp entry that is currently not used. The time stamp for the
        //              base file will be recalutated at run time as the current system time.
        //          -The follow up entries will the encrypted version of the concatenated histogram
        //              bins. 
        //          -The values in each file should be encrypted using the same public key.    
        //          -Both files should hav ethe same number of encrypted entries    
        //          "key" should be the public key that was used to encrypt the entries in the
        //              test and base files
        //          "max_rand_size" is the maximum possible value based on the encryption key size
        //              used. i.e if the key is 1024-bits, the value is 2^1024;
        //          "num_entry" should be the number of entries in the base and test files that
        //              contain concatenated bins. The ID/timestamp entry is EXCLUDED from this count 
        //  Post:   An instance of the "Server_One" class capable of carring out the intersection of 
        //              the base and test histograms with the assistance of a "Server_Two" class. See
        //              "server2.h" for reference.
        Server_One(const Paillier_Public_Key& key, const std::string &base_file, 
                   const std::string &test_file,
                   const mpz_class& max_rand_size, const int& num_entry, const int& picture_size);
        ~Server_One(){}
        
        
        //  The first step in performing distributed histogram intersection
        //  Pre:    The "filename" value should be the name of the file that is to be used
        //          by "Server_Two::step_one"(server2.h) as input.
        //  Post:   The file(filename) contains the encrypted randomized values of the entries
        //          provided by the origianl base and test files needed by server 2.
        //          Creates a file called "client" that conains server 1's inputs to the garbeled
        //          circuit. The input contains the threshold value, a random bit, and the random
        //          values used to randomize the entries.
        void step_one(std::string filename="server2input");
        
        //returns [base_i+r1] and [test_i+r2]
        //  Non-void version of "step_one_i"
        //  Pre:    "element" should be between 0 inclusive and the number of entries exclusive
        //  Post:   Returns the encrypted randomized values of the "element"th entry from both 
        //          the base and test input data.
        Pair step_one_i(const int element);
        
        //  Computes the encrypted randomized values of a given entry number from both the base
        //      and test input data. 
        //  Pre:    "element" should be between 0 inclusive and the number of entries exclusive.
        //  Post:   Returns the encrypted randomized values of the "element"th entry from both 
        //          the base and test input data by storing them in "Pair" at "pair_i".
        void step_one_i(const int element, Pair& pair_i);
        
        
        //  The following ID/timestamp functions are outdated and non working. Kept for the
        //  purpose of potential future implementation.
        /*
        Pair step_one_id();
        
        void step_one_id(Pair& pair_id);
        */
        /*
        mpz_class step_one_time();
        */
       
        
        //  Outdated function that originally calculated the self intersection of 
        //      the base data.
        //  Kept in the code to answer the question of why there is a step 1 & 3 but not 2.
        //mpz_class step_two();
        
        // Old and outdated step 3
        //double step_three(const mpz_class& base_r, const mpz_class& inter);
        
        //  Unrandomize the circuit output and determine the intersection result.
        //  Pre:    "intersection" should be a single bit representing the randomized output
        //          of the circuit.
        //          Uses an "mpz_class" due the original implementation of the step.
        //  Post:   Returns a integer that equals 1 is the authentication passed and a zero
        //          if it failed
        int step_three(const mpz_class& intersection);
        
        //  Unrandomize the circuit output and determine the intersection result that is human readable.
        //  Pre:    "intersection" should be a single bit representing the randomized output
        //          of the circuit.
        //          Uses an "mpz_class" due the original implementation of the step.
        //  Post:   Returns a string that equals "Pass" is the authentication passed and "Fail"
        //          if it failed 
        std::string step_three_str(const mpz_class& intersection);
        
        
        
        
    private:
        Paillier m_encryptor;
        std::vector<mpz_class> m_histo_test;
        std::vector<mpz_class> m_histo_base;
        std::vector<mpz_class> m_random_vals_t;
        std::vector<mpz_class> m_random_vals_b;
        //std::vector<mpz_class> m_random_vals_r;
        mpz_class m_random_bit;
        int m_num_entry;
        int m_picture_size;
        gmp_randclass m_random_num{gmp_randinit_default};
        mpz_class m_max_rand_size;
        mpz_class m_r;
        mpz_class m_id_test;
        mpz_class m_id_base;
        //mpz_class m_time_test;
        mpz_class m_n;
        int m_threshold;
        //time_t tt_now;
        
        
};



#endif
