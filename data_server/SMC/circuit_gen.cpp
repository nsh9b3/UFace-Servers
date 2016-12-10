#include "circuit_gen.h"


Circuit_Gen::Circuit_Gen(const int num_histo,const int bits_per_bin, const int entry_size):
    m_num_histo(num_histo), m_bits_per_bin(bits_per_bin), m_entry_size(entry_size)
{
    int bins_per_entry = m_entry_size / m_bits_per_bin;
    m_num_bins = 59 * m_num_histo;
    m_num_entries = (m_num_bins / bins_per_entry) +1;
    m_max_bit_pos = bins_per_entry * m_bits_per_bin;
}
                    


void Circuit_Gen::build(const std::string filename)
{
    std::ofstream cir(filename);
    //int num_bins=0;
    //cir << ".input idbaserval 1 20\n";
    //cir << ".input idbasewithr 2 20\n";
    //cir << ".input idtestrval 1 20\n";
    //cir << ".input idtestwithr 2 20\n";
    //cir << ".input timenow 1 20\n";
    //cir << ".input timetestrval 1 20\n";
    //cir << ".input timetestwithr 2 20\n";
    cir << ".input s1randombit 1 1\n";
    cir << ".input s1threshold 1 25\n";
    cir << ".input picturesize 1 25\n";
    cir << ".input nval 1 1024\n";
    
    for(int i=0; i<m_num_entries; i++)
    {
        cir << ".input s1testr" << i << " 1 " << m_entry_size << std::endl;
        cir << ".input s1baser" << i << " 1 " << m_entry_size << std::endl;
        //cir << ".input a3" << i << " 1 2048\n";
        cir << ".input s2test" << i << " 2 " << m_entry_size << std::endl;
        cir << ".input s2base" << i << " 2 " << m_entry_size << std::endl;   
    }
    /*
    for(int i=0; i<m_num_entries; i++)
    {
        cir << ".output entry" << i << std::endl;
    }
    */
    
    cir << ".output sizecheck\n";
    cir << ".output testresult\n";
    cir << ".output result\n";
    //cir <<".output compareresult\n";
    //cir <<".output finalcheck\n";
    //cir <<".output passcheck\n";
    //cir <<".output threstest\n";
    /*
    cir <<".output debug01\n";
    cir <<".output debugcheck0\n";
    cir <<".output debugcheck1\n";
    cir <<".output debugcheck2\n";
    cir <<".output debugcheck3\n";
    cir <<".output debugcheck4\n";
    cir <<".output debugcheck5\n";
    cir <<".output debugcheck6\n";
    cir <<".output debugcheck7\n";
    cir <<".output debugcheck8\n";
    cir <<".output debugcheck9\n";
    cir <<".output debugcheck10\n";
    */
    
    //cir << "timetest sub timetestwithr timetestrval\n";
    //cir << "idbase sub idbasewithr idbaserval\n";
    //cir << "idtest sub idtestwithr idtestrval\n";
    for(int i=0; i<m_num_entries; i++)
    {
        //cir << "test" << i << " add s2test" << i << " s1testr" << i << std::endl;
        cir << "testorig" << i << " add s2test" << i << " s1testr" << i << std::endl;
        //cir << "entry" << i << " concat test" << i << std::endl;
        //cir << "base" << i << " add s2base" << i << " s1baser" << i << std::endl;
        cir << "baseorig" << i << " add s2base" << i << " s1baser" << i << std::endl;
        
        cir << "checktest" << i << "v0 gteu testorig" << i << " nval" << std::endl;
        cir << "checkbase" << i << "v0 gteu testorig" << i << " nval" << std::endl;
        
        
        for(int j=1; j<6; j++)
        {
            cir << "checktest" << i << "v" << j << " concat checktest" << i << "v" << j-1 
                << " checktest" << i << "v" << j-1 << " checktest" << i << "v" << j-1 
                << " checktest" << i << "v" << j-1 << std::endl;
            cir << "checkbase" << i << "v" << j << " concat checkbase" << i << "v" << j-1 
                << " checkbase" << i << "v" << j-1 << " checkbase" << i << "v" << j-1 
                << " checkbase" << i << "v" << j-1 << std::endl;                
        }
        
        cir << "correcttest" << i << " and checktest" << i << "v5 nval" << std::endl;
        cir << "correctbase" << i << " and checkbase" << i << "v5 nval" << std::endl;
        
        cir << "test" << i << " sub testorig" << i << " correcttest" << i << std::endl;
        cir << "base" << i << " sub baseorig" << i << " correctbase" << i << std::endl;
    }
    
    
    for(int i=0, bin=0; i<m_num_entries; i++)
    {       
        for(int index=m_max_bit_pos; 0 < index && bin < m_num_bins; index-=m_bits_per_bin, bin++)
        {
            cir << "testbin" << bin << " select test" << i << " " << (index-m_bits_per_bin)
                << " " << index << std::endl;
            cir << "basebin" << bin << " select base" << i << " " << (index-m_bits_per_bin)
                << " " << index << std::endl;
        }
    }
    
    for(int i=0; i<m_num_bins; i++)
    {
        cir << "bin" << i << "min min testbin" << i << " basebin" << i << std::endl;
    }
    
    
    for(int histo=0, bin=1; histo < m_num_histo; histo++)
    {
        cir << "sum" << histo << "b1 add bin" << bin << "min bin" << bin-1 << "min\n";
        bin++;
        for (int j=2; j < 59; j++,bin++)
        {
            cir << "sum" << histo << "b" << j << " add bin" << bin << "min sum" << histo << "b" << (j-1) << std::endl;
        }
        cir << "histo" << histo << " concat 0:" << 25-m_bits_per_bin << " sum" << histo << "b58\n";
        bin++;
    }
    
    cir << "fsum0 concat histo0\n";
    for(int histo=1; histo < m_num_histo; histo++)
    {
        cir << "fsum" << histo << " add fsum" << histo-1 << " histo" << histo << std::endl;
    }
    
    
    
    //New size test
    for(int histo=0, bin=1; histo < m_num_histo; histo++)
    {
        cir << "sumtest" << histo << "b1 add testbin" << bin << " testbin" << bin-1 << "\n";
        bin++;
        for (int j=2; j < 59; j++,bin++)
        {
            cir << "sumtest" << histo << "b" << j << " add testbin" << bin << " sumtest" << histo << "b" << (j-1) << std::endl;
        }
        cir << "histotest" << histo << " concat 0:" << 25-m_bits_per_bin << " sumtest" << histo << "b58\n";
        bin++;
    }
    
    cir << "ftestsum0 concat histotest0\n";
    for(int histo=1; histo < m_num_histo; histo++)
    {
        cir << "ftestsum" << histo << " add ftestsum" << histo-1 << " histotest" << histo << std::endl;
    }    
    
    //cir << "result concat fsum" << m_num_histo-1 << std::endl;
    cir << "passcheck gteu fsum" << m_num_histo-1 << " s1threshold\n";
    cir << "compareresult gteu picturesize ftestsum" << m_num_histo-1 << std::endl;
    cir << "finalcheck and passcheck compareresult\n";
    //cir << "result xor passcheck s1randombit\n";
    cir << "result xor finalcheck s1randombit\n";
    //cir << "result concat finalcheck\n";
    

    
    //cir << "threstest concat s1threshold\n";
    cir << "sizecheck  concat ftestsum" << m_num_histo-1 << std::endl;
    cir << "testresult concat fsum" << m_num_histo-1 << std::endl;
    /*
    cir << "debug01 concat basebin0\n";
    cir << "debugcheck0 concat histo0"<< std::endl;
    cir << "debugcheck1 concat histo1"<< std::endl;
    cir << "debugcheck2 concat histo2"<< std::endl;
    cir << "debugcheck3 concat histo3"<< std::endl;
    cir << "debugcheck4 concat histo4"<< std::endl;
    cir << "debugcheck5 concat histo5"<< std::endl;
    cir << "debugcheck6 concat histo6"<< std::endl;
    cir << "debugcheck7 concat histo7"<< std::endl;
    cir << "debugcheck8 concat histo8"<< std::endl;
    cir << "debugcheck9 concat histo9"<< std::endl;
    cir << "debugcheck10 concat histo10"<< std::endl;
    */
    //cir << "compareresult gteu picturesize ftestsum" << m_num_histo-1 << std::endl; 
    
    /*
    //int hist=0;
    for(int i=2, hist=0; i<m_num_bins; hist++ )
    {
        cir << "sum" << hist << "1 add bin1 bin0" << std::endl;
        for (int j=2; j<59; j++, i++)
        {
            cir << "sum" << hist << j << " add bin" << i << " sum" << hist << (i-1) << std::endl;
            //cir << "sum" << hist << " "
        }
        cir << "hist" << hist << " sextend sum" << hist << "58 20\n";  
    }
    */
    
    
    
    
    
    
    
    
    
    /*
    for(int i=0; i<size; i++)
    {
        cir << "histtest" << i << " sub s2test" << i << " s1testr" << i << "\n";
        cir << "histbase" << i << " sub bb" << i << " ab" << i << "\n";
    }
    for(int i=0; i<size; i++)
    {
        cir << "minhist" << i << " min histt" << i << " histb" << i << "\n";
    }
    /*
    int i=0;
    if(0 == (size%2))
    {
        i=0;
    }
    */
    /*
    cir << "sum1 add minhist1 minhist0\n";
    for(int i=2; i<size; i++)
    {
        cir << "sum" << i << " add sum" << i-1 << " minhist" << i << "\n";
    }
    
    cir << "idcheck equ idbase idtest\n";
    cir << "timediff sub timenow timetest";
    cir << "timecheck gts 30 timediff\n";
    
    cir << "maskbit and timemask idmask\n";
    
    /*
    cir << "idmask concat ";
    for(int i=0; i<20; i++)
    {
        cir << "idcheck:1 ";
    }
    cir << "\n";
    
    cir << "timemask concat ";
    for(int i=0; i<20; i++)
    {
        cir << "timecheck:1 ";
    }
    cir << "\n";
    */
    /*
    cir << "mask concat ";
    for(int i=0; i<20; i++)
    {
        cir << "maskbit:1 ";
    }
    cir << "\n";
    
    //cir << "maskbit and timemask idmask\n";
    
    cir << "initialresult add sum" << (size-1) << " ar\n";
    cir << "result and mask initialresult\n";
    //cir << "result add sum" << (size-1) << " ar\n";
    */
    
}
