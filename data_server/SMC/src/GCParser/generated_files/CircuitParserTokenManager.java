/* Generated By:JavaCC: Do not edit this line. CircuitParserTokenManager.java */
package GCParser;
import java.util.*;
import java.math.BigInteger;
import YaoGC.State;
import GCParser.Operation.*;
import java.io.*;

public class CircuitParserTokenManager implements CircuitParserConstants
{
  public  java.io.PrintStream debugStream = System.out;
  public  void setDebugStream(java.io.PrintStream ds) { debugStream = ds; }
private final int jjStopStringLiteralDfa_0(int pos, long active0)
{
   switch (pos)
   {
      case 0:
         if ((active0 & 0x9000L) != 0L)
         {
            jjmatchedKind = 19;
            return 4;
         }
         return -1;
      case 1:
         if ((active0 & 0x9000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 1;
            return 4;
         }
         return -1;
      case 2:
         if ((active0 & 0x9000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 2;
            return 4;
         }
         return -1;
      case 3:
         if ((active0 & 0x9000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 3;
            return 4;
         }
         return -1;
      case 4:
         if ((active0 & 0x9000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 4;
            return 4;
         }
         return -1;
      case 5:
         if ((active0 & 0x1000L) != 0L)
            return 4;
         if ((active0 & 0x8000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 5;
            return 4;
         }
         return -1;
      case 6:
         if ((active0 & 0x8000L) != 0L)
         {
            jjmatchedKind = 19;
            jjmatchedPos = 6;
            return 4;
         }
         return -1;
      case 7:
         if ((active0 & 0x8000L) != 0L)
            return 4;
         return -1;
      default :
         return -1;
   }
}
private final int jjStartNfa_0(int pos, long active0)
{
   return jjMoveNfa_0(jjStopStringLiteralDfa_0(pos, active0), pos + 1);
}
private final int jjStopAtPos(int pos, int kind)
{
   jjmatchedKind = kind;
   jjmatchedPos = pos;
   return pos + 1;
}
private final int jjStartNfaWithStates_0(int pos, int kind, int state)
{
   jjmatchedKind = kind;
   jjmatchedPos = pos;
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) { return pos + 1; }
   return jjMoveNfa_0(state, pos + 1);
}
private final int jjMoveStringLiteralDfa0_0()
{
   switch(curChar)
   {
      case 10:
         return jjStopAtPos(0, 7);
      case 40:
         return jjStopAtPos(0, 8);
      case 41:
         return jjStopAtPos(0, 9);
      case 44:
         return jjStopAtPos(0, 6);
      case 46:
         jjmatchedKind = 5;
         return jjMoveStringLiteralDfa1_0(0x36c00L);
      case 58:
         return jjStopAtPos(0, 4);
      case 83:
      case 115:
         return jjMoveStringLiteralDfa1_0(0x1000L);
      case 85:
      case 117:
         return jjMoveStringLiteralDfa1_0(0x8000L);
      default :
         return jjMoveNfa_0(0, 0);
   }
}
private final int jjMoveStringLiteralDfa1_0(long active0)
{
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(0, active0);
      return 1;
   }
   switch(curChar)
   {
      case 69:
      case 101:
         return jjMoveStringLiteralDfa2_0(active0, 0x20000L);
      case 73:
      case 105:
         return jjMoveStringLiteralDfa2_0(active0, 0x3400L);
      case 78:
      case 110:
         return jjMoveStringLiteralDfa2_0(active0, 0x8000L);
      case 79:
      case 111:
         return jjMoveStringLiteralDfa2_0(active0, 0x800L);
      case 83:
      case 115:
         return jjMoveStringLiteralDfa2_0(active0, 0x10000L);
      case 86:
      case 118:
         return jjMoveStringLiteralDfa2_0(active0, 0x4000L);
      default :
         break;
   }
   return jjStartNfa_0(0, active0);
}
private final int jjMoveStringLiteralDfa2_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(0, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(1, active0);
      return 2;
   }
   switch(curChar)
   {
      case 69:
      case 101:
         return jjMoveStringLiteralDfa3_0(active0, 0x4000L);
      case 71:
      case 103:
         return jjMoveStringLiteralDfa3_0(active0, 0x1000L);
      case 78:
      case 110:
         return jjMoveStringLiteralDfa3_0(active0, 0x22400L);
      case 83:
      case 115:
         return jjMoveStringLiteralDfa3_0(active0, 0x8000L);
      case 84:
      case 116:
         return jjMoveStringLiteralDfa3_0(active0, 0x10000L);
      case 85:
      case 117:
         return jjMoveStringLiteralDfa3_0(active0, 0x800L);
      default :
         break;
   }
   return jjStartNfa_0(1, active0);
}
private final int jjMoveStringLiteralDfa3_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(1, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(2, active0);
      return 3;
   }
   switch(curChar)
   {
      case 65:
      case 97:
         return jjMoveStringLiteralDfa4_0(active0, 0x10000L);
      case 67:
      case 99:
         return jjMoveStringLiteralDfa4_0(active0, 0x2000L);
      case 68:
      case 100:
         return jjMoveStringLiteralDfa4_0(active0, 0x20000L);
      case 73:
      case 105:
         return jjMoveStringLiteralDfa4_0(active0, 0x8000L);
      case 78:
      case 110:
         return jjMoveStringLiteralDfa4_0(active0, 0x1000L);
      case 80:
      case 112:
         return jjMoveStringLiteralDfa4_0(active0, 0x400L);
      case 82:
      case 114:
         return jjMoveStringLiteralDfa4_0(active0, 0x4000L);
      case 84:
      case 116:
         return jjMoveStringLiteralDfa4_0(active0, 0x800L);
      default :
         break;
   }
   return jjStartNfa_0(2, active0);
}
private final int jjMoveStringLiteralDfa4_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(2, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(3, active0);
      return 4;
   }
   switch(curChar)
   {
      case 69:
      case 101:
         return jjMoveStringLiteralDfa5_0(active0, 0x1000L);
      case 71:
      case 103:
         return jjMoveStringLiteralDfa5_0(active0, 0x8000L);
      case 76:
      case 108:
         return jjMoveStringLiteralDfa5_0(active0, 0x2000L);
      case 80:
      case 112:
         return jjMoveStringLiteralDfa5_0(active0, 0x20800L);
      case 82:
      case 114:
         return jjMoveStringLiteralDfa5_0(active0, 0x10000L);
      case 83:
      case 115:
         return jjMoveStringLiteralDfa5_0(active0, 0x4000L);
      case 85:
      case 117:
         return jjMoveStringLiteralDfa5_0(active0, 0x400L);
      default :
         break;
   }
   return jjStartNfa_0(3, active0);
}
private final int jjMoveStringLiteralDfa5_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(3, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(4, active0);
      return 5;
   }
   switch(curChar)
   {
      case 65:
      case 97:
         return jjMoveStringLiteralDfa6_0(active0, 0x20000L);
      case 68:
      case 100:
         if ((active0 & 0x1000L) != 0L)
            return jjStartNfaWithStates_0(5, 12, 4);
         break;
      case 73:
      case 105:
         return jjMoveStringLiteralDfa6_0(active0, 0x4000L);
      case 78:
      case 110:
         return jjMoveStringLiteralDfa6_0(active0, 0x8000L);
      case 84:
      case 116:
         if ((active0 & 0x400L) != 0L)
            return jjStopAtPos(5, 10);
         return jjMoveStringLiteralDfa6_0(active0, 0x10000L);
      case 85:
      case 117:
         return jjMoveStringLiteralDfa6_0(active0, 0x2800L);
      default :
         break;
   }
   return jjStartNfa_0(4, active0);
}
private final int jjMoveStringLiteralDfa6_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(4, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(5, active0);
      return 6;
   }
   switch(curChar)
   {
      case 68:
      case 100:
         return jjMoveStringLiteralDfa7_0(active0, 0x2000L);
      case 69:
      case 101:
         return jjMoveStringLiteralDfa7_0(active0, 0x8000L);
      case 79:
      case 111:
         return jjMoveStringLiteralDfa7_0(active0, 0x4000L);
      case 80:
      case 112:
         return jjMoveStringLiteralDfa7_0(active0, 0x10000L);
      case 82:
      case 114:
         return jjMoveStringLiteralDfa7_0(active0, 0x20000L);
      case 84:
      case 116:
         if ((active0 & 0x800L) != 0L)
            return jjStopAtPos(6, 11);
         break;
      default :
         break;
   }
   return jjStartNfa_0(5, active0);
}
private final int jjMoveStringLiteralDfa7_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(5, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(6, active0);
      return 7;
   }
   switch(curChar)
   {
      case 65:
      case 97:
         return jjMoveStringLiteralDfa8_0(active0, 0x10000L);
      case 68:
      case 100:
         if ((active0 & 0x8000L) != 0L)
            return jjStartNfaWithStates_0(7, 15, 4);
         break;
      case 69:
      case 101:
         if ((active0 & 0x2000L) != 0L)
            return jjStopAtPos(7, 13);
         break;
      case 78:
      case 110:
         if ((active0 & 0x4000L) != 0L)
            return jjStopAtPos(7, 14);
         break;
      case 84:
      case 116:
         return jjMoveStringLiteralDfa8_0(active0, 0x20000L);
      default :
         break;
   }
   return jjStartNfa_0(6, active0);
}
private final int jjMoveStringLiteralDfa8_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(6, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(7, active0);
      return 8;
   }
   switch(curChar)
   {
      case 82:
      case 114:
         return jjMoveStringLiteralDfa9_0(active0, 0x10000L);
      case 89:
      case 121:
         if ((active0 & 0x20000L) != 0L)
            return jjStopAtPos(8, 17);
         break;
      default :
         break;
   }
   return jjStartNfa_0(7, active0);
}
private final int jjMoveStringLiteralDfa9_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(7, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(8, active0);
      return 9;
   }
   switch(curChar)
   {
      case 84:
      case 116:
         return jjMoveStringLiteralDfa10_0(active0, 0x10000L);
      default :
         break;
   }
   return jjStartNfa_0(8, active0);
}
private final int jjMoveStringLiteralDfa10_0(long old0, long active0)
{
   if (((active0 &= old0)) == 0L)
      return jjStartNfa_0(8, old0); 
   try { curChar = input_stream.readChar(); }
   catch(java.io.IOException e) {
      jjStopStringLiteralDfa_0(9, active0);
      return 10;
   }
   switch(curChar)
   {
      case 89:
      case 121:
         if ((active0 & 0x10000L) != 0L)
            return jjStopAtPos(10, 16);
         break;
      default :
         break;
   }
   return jjStartNfa_0(9, active0);
}
private final void jjCheckNAdd(int state)
{
   if (jjrounds[state] != jjround)
   {
      jjstateSet[jjnewStateCnt++] = state;
      jjrounds[state] = jjround;
   }
}
private final void jjAddStates(int start, int end)
{
   do {
      jjstateSet[jjnewStateCnt++] = jjnextStates[start];
   } while (start++ != end);
}
private final void jjCheckNAddTwoStates(int state1, int state2)
{
   jjCheckNAdd(state1);
   jjCheckNAdd(state2);
}
private final void jjCheckNAddStates(int start, int end)
{
   do {
      jjCheckNAdd(jjnextStates[start]);
   } while (start++ != end);
}
private final void jjCheckNAddStates(int start)
{
   jjCheckNAdd(jjnextStates[start]);
   jjCheckNAdd(jjnextStates[start + 1]);
}
static final long[] jjbitVec0 = {
   0x0L, 0x0L, 0xffffffffffffffffL, 0xffffffffffffffffL
};
private final int jjMoveNfa_0(int startState, int curPos)
{
   int[] nextStates;
   int startsAt = 0;
   jjnewStateCnt = 10;
   int i = 1;
   jjstateSet[0] = startState;
   int j, kind = 0x7fffffff;
   for (;;)
   {
      if (++jjround == 0x7fffffff)
         ReInitRounds();
      if (curChar < 64)
      {
         long l = 1L << curChar;
         MatchLoop: do
         {
            switch(jjstateSet[--i])
            {
               case 0:
                  if ((0x3ff000000000000L & l) != 0L)
                  {
                     if (kind > 20)
                        kind = 20;
                     jjCheckNAdd(6);
                  }
                  else if (curChar == 47)
                     jjstateSet[jjnewStateCnt++] = 7;
                  else if (curChar == 45)
                     jjCheckNAdd(6);
                  else if (curChar == 60)
                     jjCheckNAddTwoStates(1, 2);
                  break;
               case 1:
                  if ((0xbffffffffffffbffL & l) != 0L)
                     jjCheckNAddTwoStates(1, 2);
                  break;
               case 2:
                  if (curChar == 62 && kind > 18)
                     kind = 18;
                  break;
               case 4:
                  if ((0x3ff000000000000L & l) == 0L)
                     break;
                  if (kind > 19)
                     kind = 19;
                  jjstateSet[jjnewStateCnt++] = 4;
                  break;
               case 5:
                  if (curChar == 45)
                     jjCheckNAdd(6);
                  break;
               case 6:
                  if ((0x3ff000000000000L & l) == 0L)
                     break;
                  if (kind > 20)
                     kind = 20;
                  jjCheckNAdd(6);
                  break;
               case 7:
                  if (curChar != 47)
                     break;
                  if (kind > 21)
                     kind = 21;
                  jjCheckNAdd(8);
                  break;
               case 8:
                  if ((0xfffffffffffffbffL & l) == 0L)
                     break;
                  if (kind > 21)
                     kind = 21;
                  jjCheckNAdd(8);
                  break;
               case 9:
                  if (curChar == 47)
                     jjstateSet[jjnewStateCnt++] = 7;
                  break;
               default : break;
            }
         } while(i != startsAt);
      }
      else if (curChar < 128)
      {
         long l = 1L << (curChar & 077);
         MatchLoop: do
         {
            switch(jjstateSet[--i])
            {
               case 0:
               case 4:
                  if ((0x7fffffe07fffffeL & l) == 0L)
                     break;
                  if (kind > 19)
                     kind = 19;
                  jjCheckNAdd(4);
                  break;
               case 1:
                  jjAddStates(0, 1);
                  break;
               case 8:
                  if (kind > 21)
                     kind = 21;
                  jjstateSet[jjnewStateCnt++] = 8;
                  break;
               default : break;
            }
         } while(i != startsAt);
      }
      else
      {
         int i2 = (curChar & 0xff) >> 6;
         long l2 = 1L << (curChar & 077);
         MatchLoop: do
         {
            switch(jjstateSet[--i])
            {
               case 1:
                  if ((jjbitVec0[i2] & l2) != 0L)
                     jjAddStates(0, 1);
                  break;
               case 8:
                  if ((jjbitVec0[i2] & l2) == 0L)
                     break;
                  if (kind > 21)
                     kind = 21;
                  jjstateSet[jjnewStateCnt++] = 8;
                  break;
               default : break;
            }
         } while(i != startsAt);
      }
      if (kind != 0x7fffffff)
      {
         jjmatchedKind = kind;
         jjmatchedPos = curPos;
         kind = 0x7fffffff;
      }
      ++curPos;
      if ((i = jjnewStateCnt) == (startsAt = 10 - (jjnewStateCnt = startsAt)))
         return curPos;
      try { curChar = input_stream.readChar(); }
      catch(java.io.IOException e) { return curPos; }
   }
}
static final int[] jjnextStates = {
   1, 2, 
};
public static final String[] jjstrLiteralImages = {
"", null, null, null, "\72", "\56", "\54", "\12", "\50", "\51", null, null, 
null, null, null, null, null, null, null, null, null, null, };
public static final String[] lexStateNames = {
   "DEFAULT", 
};
static final long[] jjtoToken = {
   0x3ffff1L, 
};
static final long[] jjtoSkip = {
   0xeL, 
};
protected SimpleCharStream input_stream;
private final int[] jjrounds = new int[10];
private final int[] jjstateSet = new int[20];
protected char curChar;
public CircuitParserTokenManager(SimpleCharStream stream){
   if (SimpleCharStream.staticFlag)
      throw new Error("ERROR: Cannot use a static CharStream class with a non-static lexical analyzer.");
   input_stream = stream;
}
public CircuitParserTokenManager(SimpleCharStream stream, int lexState){
   this(stream);
   SwitchTo(lexState);
}
public void ReInit(SimpleCharStream stream)
{
   jjmatchedPos = jjnewStateCnt = 0;
   curLexState = defaultLexState;
   input_stream = stream;
   ReInitRounds();
}
private final void ReInitRounds()
{
   int i;
   jjround = 0x80000001;
   for (i = 10; i-- > 0;)
      jjrounds[i] = 0x80000000;
}
public void ReInit(SimpleCharStream stream, int lexState)
{
   ReInit(stream);
   SwitchTo(lexState);
}
public void SwitchTo(int lexState)
{
   if (lexState >= 1 || lexState < 0)
      throw new TokenMgrError("Error: Ignoring invalid lexical state : " + lexState + ". State unchanged.", TokenMgrError.INVALID_LEXICAL_STATE);
   else
      curLexState = lexState;
}

protected Token jjFillToken()
{
   Token t = Token.newToken(jjmatchedKind);
   t.kind = jjmatchedKind;
   String im = jjstrLiteralImages[jjmatchedKind];
   t.image = (im == null) ? input_stream.GetImage() : im;
   t.beginLine = input_stream.getBeginLine();
   t.beginColumn = input_stream.getBeginColumn();
   t.endLine = input_stream.getEndLine();
   t.endColumn = input_stream.getEndColumn();
   return t;
}

int curLexState = 0;
int defaultLexState = 0;
int jjnewStateCnt;
int jjround;
int jjmatchedPos;
int jjmatchedKind;

public Token getNextToken() 
{
  int kind;
  Token specialToken = null;
  Token matchedToken;
  int curPos = 0;

  EOFLoop :
  for (;;)
  {   
   try   
   {     
      curChar = input_stream.BeginToken();
   }     
   catch(java.io.IOException e)
   {        
      jjmatchedKind = 0;
      matchedToken = jjFillToken();
      return matchedToken;
   }

   try { input_stream.backup(0);
      while (curChar <= 32 && (0x100002200L & (1L << curChar)) != 0L)
         curChar = input_stream.BeginToken();
   }
   catch (java.io.IOException e1) { continue EOFLoop; }
   jjmatchedKind = 0x7fffffff;
   jjmatchedPos = 0;
   curPos = jjMoveStringLiteralDfa0_0();
   if (jjmatchedKind != 0x7fffffff)
   {
      if (jjmatchedPos + 1 < curPos)
         input_stream.backup(curPos - jjmatchedPos - 1);
      if ((jjtoToken[jjmatchedKind >> 6] & (1L << (jjmatchedKind & 077))) != 0L)
      {
         matchedToken = jjFillToken();
         return matchedToken;
      }
      else
      {
         continue EOFLoop;
      }
   }
   int error_line = input_stream.getEndLine();
   int error_column = input_stream.getEndColumn();
   String error_after = null;
   boolean EOFSeen = false;
   try { input_stream.readChar(); input_stream.backup(1); }
   catch (java.io.IOException e1) {
      EOFSeen = true;
      error_after = curPos <= 1 ? "" : input_stream.GetImage();
      if (curChar == '\n' || curChar == '\r') {
         error_line++;
         error_column = 0;
      }
      else
         error_column++;
   }
   if (!EOFSeen) {
      input_stream.backup(1);
      error_after = curPos <= 1 ? "" : input_stream.GetImage();
   }
   throw new TokenMgrError(EOFSeen, curLexState, error_line, error_column, error_after, curChar, TokenMgrError.LEXICAL_ERROR);
  }
}

}
