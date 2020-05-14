---
author: v-demjoh
ms.service: cognitive-services
ms.topic: include
ms.date: 05/13/2020
ms.author: v-demjoh
---

## Enable microphone

Plug in and turn on your PC microphone, and turn off any apps that might also use the microphone. Some computers have a built-in microphone,
while others require configuration of a Bluetooth device.

## Run the SPX tool

Now you're ready to run the SPX tool to recognize speech from your microphone.

1. **Start your app** - From the command line, change to the directory that contains spx.exe, and type:
    ```bash
    spx recognize --microphone
    ```

    > [!NOTE]
    > The SPX tool defaults to English. You can also choose [a language from the Speech-to-text table](../../../language-support.md).
    > For example, add `--source de-DE` to recognize German speech.

2. **Start recognition** - Speak into the microphone. You will see transcription of your words into text in real-time. The SPX tool will stop after a period of silence, or when you press ctrl-C.
