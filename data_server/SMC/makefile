#File        :  makefile
#Programmer  :  Christian Storer
#ID          :  cs9yb
#Course      :  CS328
#DateCreated :  Apr 5, 2014
#DateModified:  Oct 14, 2014
#A makefile to make the program driver
#Updated to include gmp library flags


.PHONY: all clean

CXX = g++
CXXFLAGS = -g -Wall -W -pedantic-errors -std=c++11
GMPGLAGS = -lgmp -lgmpxx

SOURCES = $(wildcard *.cpp)
HEADERS = $(wildcard *.h)

OBJECTS = $(SOURCES:%.cpp=%.o)

default: driver

%.out: %.cpp
	@echo "Compiling $<"
	@$(CXX) $(CXXFLAGS) -c $< -o $@

driver: $(OBJECTS)
	@echo "Building $@"
	@$(CXX) $(CXXFLAGS) $(OBJECTS) $(GMPGLAGS) -o $@
	@echo ""
	@echo "Everything worked... I think"
	@echo ""

clean:
	-@rm -f core
	-@rm -f driver
	-@rm -f $(OBJECTS)

# Automatically generate dependencies and include them in Makefile
depend: $(SOURCES) $(HEADERS)
	@echo "Generating dependencies"
	@$(CXX) -MM *.cpp > $@

-include depend