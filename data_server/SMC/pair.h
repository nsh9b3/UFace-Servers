#ifndef PAIR_H
#define PAIR_H

#include <gmpxx.h>

//template <class T>
class Pair
{
    public:
        Pair(){}
        Pair(const mpz_class& t, const mpz_class& b):m_test(t),m_base(b){}
        ~Pair(){}
        
        mpz_class m_test;
        mpz_class m_base;
    
};




#endif