---
title: 'Connect Arduino (C) to Azure IoT - Lesson 4: Modify app | Microsoft Docs'
description: Customize the messages to change the LED’s on and off behavior.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'control led with arduino'

ROBOTS: NOINDEX
redirect_url: /azure/iot-hub/iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started

ms.assetid: d7a25430-450e-43c4-a3ed-1eed995b8b7e
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/21/2017
ms.author: xshi

---
# Change the on and off behavior of the LED
## What you will do
Customize the messages to change the LED’s on and off behavior. If you have any problems, look for solutions on the [troubleshooting page](iot-hub-adafruit-feather-m0-wifi-kit-arduino-troubleshooting.md) for your Adafruit Feather M0 WiFi Arduino board.

## What you will learn
Use additional Arduino functions to change the LED’s on and off behavior.

## What you need
You must have successfully completed [Run a sample application on your Arduino board to receive cloud to device messages][receive-cloud-to-device-messages].

## Add functions to main.c and gulpfile.js
1. Open the sample application in Visual Studio code by running the following commands:

   ```bash
   cd Lesson4
   code .
   ```
2. Open the `app.ino` file, and then add the following functions after blinkLED() function:

   ```arduino
   static void turnOnLED()
   {
     digitalWrite(LED_PIN, HIGH);
   }

   static void turnOffLED()
   {
     digitalWrite(LED_PIN, LOW);
   }
   ```

   ![app.ino file with added functions][app-ino-file]
3. Add the following conditions before the `else if` block of the `receiveMessageCallback` function:

   ```arduino
   else if (strcmp((const char*)value, "\"on\"") == 0)
   {
       turnOnLED();
   }
   else if (0 == strcmp((const char*)value, "\"off\"") == 0)
   {
       turnOffLED();
   }
   ```

   Now you’ve configured the sample application to respond to more instructions through messages. The "on" instruction turns on the LED, and the "off" instruction turns off the LED.
4. Open the gulpfile.js file, and then add a new function before the function `sendMessage`:

   ```javascript
   var buildCustomMessage = function (messageId) {
     if ((messageId & 1) && (messageId < MAX_MESSAGE_COUNT)) {
       return new Message(JSON.stringify({ command: 'on', messageId: messageId }));
     } else if (messageId < MAX_MESSAGE_COUNT) {
       return new Message(JSON.stringify({ command: 'off', messageId: messageId }));
     } else {
       return new Message(JSON.stringify({ command: 'stop', messageId: messageId }));
     }
   };
   ```

   ![Gulpfile.js file with added function][gulp-file-js]
5. In the `sendMessage` function, replace the line `var message = buildMessage(sentMessageCount);` with the new line shown in the following snippet:

   ```javascript
   var message = buildCustomMessage(sentMessageCount);
   ```
6. Save all the changes.

### Deploy and run the sample application
Deploy and run the sample application on your Arduino board by running the following command:

```bash
gulp run
# You can monitor the serial port by running listen task:
gulp listen

# Or you can combine above two gulp tasks into one:
gulp run --listen
```

You should see the LED turn on for two seconds, and then turn off for another two seconds. The last "stop" message stops the sample application from running.

![on and off][on-and-off]

Congratulations! You’ve successfully customized the messages that are sent to your Arduino board from your IoT hub.

### Summary
This optional section demonstrates how to customize messages so that the sample application can control the on and off behavior of the LED in a different way.

<!-- Images and links -->

[receive-cloud-to-device-messages]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-lesson4-send-cloud-to-device-messages.md
[app-ino-file]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/updated_app_ino.png
[gulp-file-js]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/updated_gulpfile_js.png
[on-and-off]: media/iot-hub-adafruit-feather-m0-wifi-lessons/lesson4/gulp_on_and_off_arduino.png