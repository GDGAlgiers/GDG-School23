// Activity 3: Print: “Hi! I’m YOURNAME ” on LCD

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD address to 0x27 for a 16 chars and 2 line display

void setup() {
  lcd.init();                       // Initialize the LCD
  lcd.backlight();                  // Turn on the backlight
  lcd.clear();  
  lcd.print("Hi! I’m Rahma");     // Print "Hi! I’m YOURNAME"
}
void loop() {
  
}