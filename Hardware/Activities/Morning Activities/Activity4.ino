// Activity 4: Turn on the Buzzer for 1s with a frequency of 2000 Hz when the button is pressed

const int buttonPin = 22;  // the number of the pushbutton pin
const int buzzerPin = 23;    // the number of the buzzer pin

// variables will change:
int buttonState = 0;  // variable for reading the pushbutton status

void setup() {
  // initialize the buzzer pin as an output:
  pinMode(buzzerPin, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
}

void loop() {
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);
  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // turn buzzer on:
    tone(buzzerPin, 2000);
  } else {
    // turn buzzer off:
    noTone(buzzerPin);
  }
}
