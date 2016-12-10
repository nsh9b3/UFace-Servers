#include "server2.h"


void Server_Two::step_one(const std::string filename)
{
    //Prep the circuit input file;
    std::ofstream serv;
    serv.open("server");
    serv << "";
    serv.close();
    
    
    std::ifstream file;
    file.open(filename);
    
    Pair temp;
    //file >> temp.m_test;
    //file >> temp.m_base;
    //step_one_id(temp);
    
    //file >> temp.m_test;
    //step_one_time(temp.m_test);
    
    for(int i=0; i<m_num_entry; i++)
    {
        file >> temp.m_test;
        file >> temp.m_base;
        step_one_i(i,temp);        
    }
    file.close();    
}


void Server_Two::step_one_i(const int& i, const Pair& bt_pair_r)
{
    mpz_class base_r;
    mpz_class test_r;
    m_decryptor.decrypt(bt_pair_r.m_base, base_r);
    m_decryptor.decrypt(bt_pair_r.m_test, test_r);
    std::ifstream filein;
    std::ofstream fileout;
    
    fileout.open("server", std::ofstream::out | std::ofstream::app);
    fileout << "s2test" << i << " " << test_r <<"\n";
    fileout << "s2base" << i << " " << base_r <<"\n";
    fileout.close();
    
    
    
    
    
}


/*
void Server_Two::step_one_id(const Pair& id_pair_r)
{
    mpz_class base_id_r;
    mpz_class test_id_r;
    m_decryptor.decrypt(id_pair_r.m_base, base_id_r);
    m_decryptor.decrypt(id_pair_r.m_test, test_id_r);
    std::ofstream fileout;
    
    fileout.open("server");    
    fileout << "idbasewithr " << base_id_r << "\n";
    fileout << "idtestwithr " << test_id_r << "\n";
    fileout.close();
}

void Server_Two::step_one_time(const mpz_class time_test_r)
{
    mpz_class temp;
    m_decryptor.decrypt(time_test_r, temp);
    std::ofstream fileout;
    fileout.open("server", std::ofstream::out | std::ofstream::app);
    fileout << "timetestwithr " << temp << "\n";
    fileout.close();
}
*/


mpz_class Server_Two::step_two()
{
    
    std::ifstream filein;
    system("./runtestgcparser circuit.cir server client");
    
    //  Sleep to allow the circuit time to run.
    std::this_thread::sleep_for(std::chrono::milliseconds(5000));
    filein.open("results/siserverout");
    
    //  Read in the result file into a single string
    std::string contents;
    filein.seekg(0, std::ios::end);
    contents.resize(filein.tellg());
    filein.seekg(0, std::ios::beg);
    filein.read(&contents[0], contents.size());
    filein.close();
    
    
    //  Parse the result file string to find the actual result
    std::string delim("result = ");
    std::size_t pos1 = contents.find(delim) + 8;
    std::size_t pos2 = contents.find("\n", pos1);
    std::string result_str = contents.substr(pos1, (pos2-pos1));
    mpz_class temp(result_str);
    //mpz_class temp(0);
    return temp;
}

/*
mpz_class Server_Two::step_three(const mpz_class& base_r_e)
{
    mpz_class base_r;
    m_decryptor.decrypt(base_r_e, base_r);
    return base_r;
}
*/
