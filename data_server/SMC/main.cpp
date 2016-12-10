


#include <vector>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <cstdlib>
#include <ctime>
#include <chrono>
#include <gmpxx.h>
#include <bitset>
#include <cmath>
#include <algorithm>
#include <sstream>


//#include "dot.c"
#include "server1.h"
#include "server2.h"
#include "paillier.h"
#include "circuit_gen.h"

//#include "histogram_intersection.h"
//#include "chi_square_alt.h"





class Not_Enough_Inputs
{
    public:
        Not_Enough_Inputs(){}
};

struct Scores
{
    std::string file = "";
    long double score = 0;
};



/*
void sample_input(const int num_histo, const int bin_size, std::string filename, 
    const Paillier_Public_Key& key, const int entry_size = 1024);
    
mpz_class histo_inter_plain(const std::string testfile, const std::string basefile,
    const int histograms);
void build_circuit(const int size);

void test_decrypt(std::string filename, const Paillier_Private_Key& private_k, const Paillier_Public_Key& public_k, const int num_entries);
*/


/*
**Purpose: Take in a collection of histograms and compute the normalized
**         intersection
**Pre:  
**      
**      argv[1] must be the baseline entry data
**      argv[2] the test entry data to intersect with the baseline
**      argv[3] the size of the base/stored facial info in pixels
**      
**Post: Output the results of each intersection
*/
int main(int argc, char *argv[])
{
    try
    {
        //if(4 > argc) throw Not_Enough_Inputs();
        srand (time(NULL));
        //int histo_size = std::atoi(argv[1]); //Old variable value
        int histo_size = 16;
        
        mpz_class max_rand(0);
        mpz_class two(2);
        mpz_pow_ui(max_rand.get_mpz_t(), two.get_mpz_t(), 1024);
        
        //std::string key_file = argv[2];
        std::string key_file = "key.txt";
        std::string base_file = argv[1];  
        std::string test_file = argv[2];
        int picture_size = std::atoi(argv[3]);
        std::string output_dir = argv[4];
        //std::cout << argv[4] << std::endl;
        //int bits_per_bin = std::atoi(argv[5]);
        int bits_per_bin = 13;
        
        
        std::ifstream file_in;
        Paillier_Public_Key pu_k;
        Paillier_Private_Key pr_k;
        
        file_in.open(key_file);
        file_in >> pu_k.m_n >> pu_k.m_g >> pr_k.m_lambda >> pr_k.m_mu;
        file_in.close();
        
        int entry_size = 1024;
        
        int bins_per_entry = entry_size / bits_per_bin;
        int num_bins = 59 * histo_size;
        int num_entries = (num_bins / bins_per_entry) +1; 
        
        
        Server_One server1(pu_k, base_file, test_file, max_rand, num_entries, picture_size);
        Server_Two server2(pu_k, pr_k, max_rand, num_entries);
        
        Circuit_Gen circuit(histo_size,bits_per_bin);
        circuit.build();
        
        
        
        server1.step_one();
        server2.step_one();
        mpz_class sum;
        sum = server2.step_two();
        std::string result = server1.step_three_str(sum);
        //std::cout << "Result(Test): " << result << std::endl;
        std::cout << result;// << std::endl;
        
        
        /*
        std::chrono::time_point<std::chrono::system_clock> right_now;
        right_now = std::chrono::system_clock::now();
        std::time_t tt = std::chrono::system_clock::to_time_t( right_now );
        */
        auto t = std::time(nullptr);
        auto tm = *std::localtime(&t);
        
        std::ostringstream oss;
        oss << std::put_time(&tm, "%Y-%m-%d_%H-%M-%S");// << std::endl;
        std::string time_stamp = oss.str();
        std::string output_file = output_dir+"/siserverout-"+time_stamp;
        //std::cout << output_file << std::endl;
        
        
        std::ifstream src("results/siserverout", std::ios::binary);
        std::ofstream dst( output_file, std::ios::binary);
        dst << src.rdbuf();
        
        
        
        
    }
    catch(Not_Enough_Inputs& e)
    {
        std::cout << "Need more inputs" << std::endl;
        return 1;
    }
    /*
    catch(Time_err& e)
    {
        std::cout << "Outdated timestamp" << std::endl;
        return 1;
    }
    */
    
    return 0;
}


/*
void test_decrypt(std::string filename, const Paillier_Private_Key& private_k, const Paillier_Public_Key& public_k, const int num_entries)
{
    std::ifstream input(filename);
    std::ofstream output("plaintext.txt");
    mpz_class cipher;
    mpz_class plain;
    Paillier decryptor(public_k,private_k);
    for(int i=0; i<num_entries; i++)
    {
        input >> cipher;
        decryptor.decrypt(cipher, plain);
        output << plain;
    }
    output.close();
    input.close();
}
*/

/**
void sample_input(const int num_histo, const int bin_size, std::string filename,
    const Paillier_Public_Key& key, const int entry_size)
{
    const long int window_size = pow(2, (bin_size-1));
    const int total_bins = 59*num_histo;
    std::vector<int> histo(total_bins);
    
    std::string newfilename = filename + "plain";
    std::ofstream file(newfilename);
    int bin_val = (window_size / 59) *2;
    
    file << "";
    int bin=0;
    for(int j=0; j < num_histo; j++, bin++)
    {
        long int pixels = window_size;
        int temp;
        for(int i=0; i<58; i++,bin++)
        {
            temp = rand() % bin_val;
            if(pixels < temp)
            {
                temp = 0;
            }
            //histo[(i*j)] = rand() % bin_val;
            histo[bin] = temp;
            pixels -= histo[bin];
            file << histo[bin] << std::endl;
        }
        histo[bin] = pixels;
        file << histo[bin] << std::endl;
        
    }
    file.close();
    
    
    
    
    const int bins_p_entry = entry_size / bin_size;
    //const int offset= entry_size - (bins_p_entry * bin_size);
    //const int max_bit = (bins_p_entry * bin_size);
    const int total_entry = (total_bins / bins_p_entry) + 1;
    Paillier encryptor(key);
    newfilename = filename + "entryplain";
    std::ofstream strfile(newfilename);
    file.open(filename);
    file << "1111" << std::endl;
    bin=0;
    std::string temp("");
    for(int i=0; i<total_entry ; i++)
    {
        std::string entrystr("");
        for (int j=0; bins_p_entry > j; j++, bin++)
        {
            if(total_bins > bin)
            {
                std::bitset<20> foo(histo[bin]);
                //strfile << foo << std::endl;
                temp = foo.to_string();
            }
            else
            {
                std::bitset<20> foo;
                //strfile << foo << std::endl;
                temp = foo.to_string();
            }
            //strfile << temp << std::endl << temp.substr(20-bin_size) << std::endl;
            entrystr += temp.substr(20-bin_size);
            
        }
        strfile << entrystr << std::endl;
        mpz_class entryp;
        mpz_set_str(entryp.get_mpz_t(),entrystr.c_str(),2);
        strfile << entryp << std::endl;
        mpz_class entryenc;
        encryptor.encrypt(entryp, entryenc);
        file << entryenc << std::endl;
    }
    
}
*/
/*
mpz_class histo_inter_plain(const std::string testfile, const std::string basefile, 
    const int num_entries)
{
    
    
    //const int num_bins = 59*num_histo;
    //std::vector<int> test(num_bins);
    //std::vector<int> base(num_bins);
    //long int result = 0;
    std::ifstream baseinput(basefile);
    std::ifstream testinput(testfile);
    std::ofstream testser("servertest");
    std::string sampleval;
    baseinput >> sampleval;
    testinput >> sampleval;
    
    //int temptest, tempbase;
    for(int i=0; i< num_entries; i++)
    {
        //baseinput >> tempbase;
        testinput >> sampleval;
        testser << "s2test" << i << " " << sampleval << std::endl;
        baseinput >> sampleval;
        testser << "s2base" << i << " " << sampleval << std::endl;
       
    }
    
    testser.close();
    //return result;
    
    std::ifstream filein;
    //std::string cmd = "./runtestgcparser circuit.cir " + testfile + " " + basefile;
    system("./runtestgcparser circuit.cir servertest clienttest");
    //system(cmd.c_str());
    
    std::this_thread::sleep_for(std::chrono::milliseconds(8000));
    filein.open("results/siserverout");
    
    std::string contents;
    filein.seekg(0, std::ios::end);
    contents.resize(filein.tellg());
    filein.seekg(0, std::ios::beg);
    filein.read(&contents[0], contents.size());
    filein.close();
    
    
    
    std::string delim("result = ");
    std::size_t pos = contents.find(delim) + 8;
    //std::cout << "Pos: " << pos << std::endl;
    std::string result_str = contents.substr(pos);
    //std::cout << result_str << std::endl;
    
    mpz_class temp(result_str);
    //std::cout << "Temp: " << temp << std::endl;
    //m_result_sum = (m_result_sum + temp);
    
    //mpz_class result;
    //m_decryptor.encrypt(m_result_sum, result);
    //return result;
    //return m_result_sum;
    
    //mpz_class temp;
    //temp=2;
    return temp;
}
*/





