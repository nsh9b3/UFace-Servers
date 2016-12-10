#ifndef CIRCUIT_GEN_H
#define CIRCUIT_GEN_H

#include <fstream>
#include <cstdlib>
#include <iostream>

class Circuit_Gen
{
    public:
        Circuit_Gen(){}
        Circuit_Gen(const int num_histo,const int bits_per_bin, const int entry_size=1024);
        ~Circuit_Gen(){}
        
        void build(const std::string filename="circuit.cir");
    private:
        int m_num_histo;
        int m_bits_per_bin;        
        int m_entry_size;
        int m_num_entries;
        int m_num_bins;
        int m_max_bit_pos;
};


#endif