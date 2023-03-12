/*
 4x4 matrix keypad amd a 20 x 4 LCD. 
 Edit StepsPerRotation & TableRatio(# of turns for 360 degrees)in line 29
 A4988 Stepstick/Pololu driver 
 5/2/2015
 */

 #define _LCD_TYPE 1
 #include <Wire.h> 
 #include <LiquidCrystal_I2C.h>
 #include <Keypad.h>
 #include <LCD_1602_RUS_ALL.h>
 #include <font_LCD_1602_RUS.h>

 const byte ROWS = 4;
 const byte COLS = 4;
 char keys[ROWS][COLS] = {
 {'1','2','3','A'},
 {'4','5','6','B'},
 {'7','8','9','C'},
 {'.','0','#','D'}
 };

 byte rowPINS[ROWS] = {11,10,9,8};
 byte colPINS[COLS] = {7,6,5,4};

 Keypad kpd = Keypad(makeKeymap(keys),rowPINS,colPINS, ROWS, COLS);
 LCD_1602_RUS lcd(0x27,20,4); // set the LCD address to 0x20 for a 16 chars and 4 line display
                                   // SCL - A5, SDA - A4, VCC - +5, Gnd - Gnd 
 //setup vars
 const int stp = 2;               // connect pin 2 to step
 const int dir = 3;               // connect pin 3 to dir
 const int StepsPerRotation = 400; // Set Steps per rotation of stepper NOTE the driver is set to Half step
 const int TableRatio = 36;        // ratio of rotary table
 const int Multiplier = (StepsPerRotation * TableRatio)/360;  // 200*90=18000/360 = 50
 const int stepdelay = 1;
 float Degrees = 0;                // Degrees from Serial input
 float ToMove = 0;                 // Steps to move
 float bob = 0;
 int cho = 0;

 void setup()
 {
 lcd.init();      // initialize the lcd 
 pinMode(stp, OUTPUT);
 pinMode(dir, OUTPUT); 

 // Print welcome message to the LCD.
 lcd.backlight();
 lcd.print("Электронная делительная головка");
 lcd.setCursor(4,2);
 lcd.print(" ");
 lcd.setCursor(3,3);
 lcd.print("обновлено 2016");
 delay(2000);
 lcd.init();
   cho = 0;
   char key = kpd.getKey();
   lcd.print("Введите Выбор:");   
   lcd.setCursor(0,1);
   lcd.print("Градусов   = A");
   lcd.setCursor(0,2);
   lcd.print("Делений = B");
   lcd.setCursor(0,3);
   lcd.print("Сдвиг     = C");
   while(cho == 0)
   {
     key = kpd.getKey();
     switch (key)
     {
     case NO_KEY:
      break;
     case 'A':
       Degrees=getdegrees();
       lcd.clear();
       cho = 1;
       break; 
     case 'B':
       Degrees=getdivisions();  
       cho=2;
       break;
     case 'C':
       Degrees=getjog();
       lcd.clear();
       cho=3;
       break;
       }      // end case
     }      // end while cho=0
 }    // end setup
 
 void loop()      // MAIN LOOP
 {
   lcd.clear();  
   char key = kpd.getKey();
     bob = 0;
     lcd.setCursor(7,0);lcd.print("Всего:  ");lcd.print(bob,2);   // total steps
     lcd.setCursor(0,3);lcd.print("ВПРД=A  НАЗ=B   ВЫХ=C");
   while(key != 'C')    // C will return to start menu
   {
     lcd.setCursor(0,0);lcd.print(abs(Degrees),2);lcd.print("223");
     key = kpd.getKey();
     if(key == 'A')            // FORWARD
       {
        bob = bob + Degrees;
        ToMove = (Degrees*Multiplier);
        digitalWrite(dir, LOW);
        printadvance();
       }
     if(key=='B')              // REVERSE
       {
        bob = bob - Degrees;  
        ToMove = (Degrees*Multiplier);
        digitalWrite(dir, HIGH);    // pin 13
        printadvance();
       }
   }      // end while not C loop
   lcd.init();
  setup();
 }      // end main VOID
 

float getjog()
{
  float Degrees = 0;
  float num = 0.00;
   char key = kpd.getKey();
   lcd.clear();
   lcd.setCursor(6,0);lcd.print("Сдвиг");
   lcd.setCursor(0,1);lcd.print("A=1 B=10 C=100 Шагов");
   lcd.setCursor(0,2);lcd.print("Введите Угол");lcd.setCursor(0,3);lcd.print("OK = #       ");lcd.print("60");lcd.print("45");lcd.print(" НАЗ");
while(key != '#')
   {
      switch (key)
      {
         case NO_KEY:
            break;
         case 'A':
            Degrees = 1;      
            lcd.setCursor(14,2);lcd.printf("%f ", Degrees);
            break;
         case 'B':
            Degrees = 10;
            lcd.setCursor(14,2);lcd.printf("%f ", Degrees);
            break;
         case 'C':
            Degrees = 100;
            lcd.setCursor(14,2);lcd.printf("%f ", Degrees);
            break;
         case 'D':
          num=0.00;
          lcd.setCursor(14,2);lcd.print("     ");
          lcd.setCursor(14,2);
          break;
      }
      key = kpd.getKey();
   }
  return Degrees; 
}

 
float getdivisions()
{
  float Degrees = 0; 
  float num = 0.00;
   char key = kpd.getKey();
   lcd.clear();
   lcd.setCursor(0,1);lcd.print("Введите деления:");lcd.setCursor(0,3);lcd.print("ОК = #       ");lcd.print("60");lcd.print("45");lcd.print(" НАЗ");
   lcd.setCursor(16,1);

   while(key != '#')
   {
      switch (key)
      {
         case NO_KEY:
            break;
            
         case '0': case '1': case '2': case '3': case '4':
         case '5': case '6': case '7': case '8': case '9':
            num = num * 10 + (key - '0');
            lcd.print(key);
            break;
        
        case 'D':
          num=0.00;
          lcd.setCursor(16,1);lcd.print("     ");
          lcd.setCursor(16,1);
          break;
      }
      Degrees = 360/num;
      key = kpd.getKey();
   }
  return Degrees;  //num;
}


float getdegrees()
{ 
   //int key = 0;
   float num = 0.00;
   float decimal = 0.00;
   float decnum = 0.00;
   int counter = 0;
   lcd.clear();
   //lcd.init();
   char key = kpd.getKey();
   lcd.setCursor(0,1);lcd.print("Введите Угол:");lcd.setCursor(0,3);lcd.print("OK = #       ");lcd.print("60");lcd.print("45");lcd.print(" НАЗ");
   lcd.setCursor(15,1);
   bool decOffset = false;

   while(key != '#')
   {
      switch (key)
      {
         case NO_KEY:
            break;
            
         case '.':
           if(!decOffset)
           {
             decOffset = true;
           }
            lcd.print(key);
            break;   
         
         case 'D':
          num=0.00;
          lcd.setCursor(15,1);lcd.print("     ");
          lcd.setCursor(15,1);
          break;
         
         case '0': case '1': case '2': case '3': case '4':
         case '5': case '6': case '7': case '8': case '9':
         if(!decOffset)
         {
            num = num * 10 + (key - '0');
            lcd.print(key);
         }
         else if((decOffset) && (counter <= 1))
         {
            num = num * 10 + (key - '0');
            lcd.print(key);
            counter++;
         }
            break;
      }    //end case
      decnum = num / pow(10, counter);
      key = kpd.getKey();
   }    //end while not #
    return decnum;
}      // end getdegrees
 
 void printadvance()      // print function
   {
     lcd.setCursor(6,1);lcd.print("Движение");
     lcd.setCursor(4,2);lcd.print("Шагов  ");lcd.print(ToMove,0); 
     lcd.setCursor(13,0);lcd.print(bob,2);
     rotation(ToMove,0);
     lcd.setCursor(6,1);lcd.print("      "); 
  } 

 void rotation(float tm, int d)
   { 
     for(int i = 0; i < tm; i++) 
       { 
       digitalWrite(stp, HIGH); 
       delay(stepdelay); 
       digitalWrite(stp, LOW); 
       delay(stepdelay); 
       }
   }

void software_Reset() // Restarts program from beginning but does not reset the peripherals and registers
  {
  asm volatile ("  прж 0");  
  }
