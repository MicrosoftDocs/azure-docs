---
title: Get started with the Speech Devices SDK
description: Prerequisites and instructions for getting started with the Speech Devices SDK.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: erhopf

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 05/18/2018
ms.author: erhopf
---

# Get started with the Speech Devices SDK

This article describes how to configure your development PC and Speech device development kit for developing speech-enabled devices by using the Speech Devices SDK. Then you build and deploy a sample application to the device. 

The source code for the sample application is included with the Speech Devices SDK. It's also [available on GitHub](https://github.com/Azure-Samples/Cognitive-Services-Speech-Devices-SDK).

## Prerequisites

Before you begin developing with the Speech Devices SDK, gather the information and software you need:

* Get a [development kit from ROOBO](http://ddk.roobo.com/). Kits are available with linear or circular microphone array configurations. Choose the correct configuration for your needs.

    |Development kit configuration|Speaker location|
    |-----------------------------|------------|
    |Circular|Any direction from the device|
    |Linear|In front of the device|

* Get the latest version of the Speech Devices SDK, which includes an Android sample app, from the [Speech Devices SDK download site](https://shares.datatransfer.microsoft.com/). Extract the .zip file to a local folder, like C:\SDSDK.

* Install [Android Studio](https://developer.android.com/studio/) and [Vysor](http://vysor.io/download/) on your PC.

* Get a [Speech service subscription key](get-started.md). You can get a 30-day free trial or get a key from your Azure dashboard.

* If you want to use the Speech service's intent recognition, subscribe to the [Language Understanding service](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) (LUIS) and [get a subscription key](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/azureibizasubscription). 

    You can [create a simple LUIS model](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/) or use the sample LUIS model, LUIS-example.json. The sample LUIS model is available from the [Speech Devices SDK download site](https://shares.datatransfer.microsoft.com/). To upload your model's JSON file to the [LUIS portal](https://www.luis.ai/home), select **Import new app**, and then select the JSON file.

## Set up the development kit

1. Connect the development kit to a PC or power adapter by using a mini USB cable. When the kit is connected, a green power indicator lights up under the top board.

1. Connect the development kit to a computer by using a second mini USB cable.

    ![Connecting the dev kit](media/speech-devices-sdk/qsg-1.png)

1. Orient your development kit for either the circular or linear configuration.

    |Development kit configuration|Orientation|
    |-----------------------------|------------|
    |Circular|Upright, with microphones facing the ceiling|
    |Linear|On its side, with microphones facing you (shown in the following image)|

    ![Linear dev kit orientation](media/speech-devices-sdk/qsg-2.png)

1. Install the certificates and the wake word (keyword) table file, and set the permissions of the sound device. Type the following commands in a Command Prompt window:

   ```
   adb push C:\SDSDK\Android-Sample-Release\scripts\roobo_setup.sh /data/ 
   adb shell
   cd /data/ 
   chmod 777 roobo_setup.sh
   ./roobo_setup.sh
   exit
   ```

    > [!NOTE]
    > These commands use the Android Debug Bridge, `adb.exe`, which is part of the Android Studio installation. This tool is located in C:\Users\[user name]\AppData\Local\Android\Sdk\platform-tools. You can add this directory to your path to make it more convenient to invoke `adb`. Otherwise, you must specify the full path to your installation of adb.exe in every command that invokes `adb`.

    > [!TIP]
    > Mute your PC's microphone and speaker to be sure you are working with the development kit's microphones. This way, you won't accidentally trigger the device with audio from the PC.
    
1.	Start Vysor on your computer.

    ![Vysor](media/speech-devices-sdk/qsg-3.png)

1.	Your device should be listed under **Choose a device**. Select the **View** button next to the device. 
 
1.	Connect to your wireless network by selecting the folder icon, and then select **Settings** > **WLAN**.

    ![Vysor WLAN](media/speech-devices-sdk/qsg-4.png)
 
    > [!NOTE]
    > If your company has policies about connecting devices to its Wi-Fi system, you need to obtain the MAC address and contact your IT department about how to connect it to your company's Wi-Fi. 
    >
    > To find the MAC address of the dev kit, select the file folder icon on the desktop of the dev kit.
    >
    >  ![Vysor file folder](media/speech-devices-sdk/qsg-10.png)
    >
    > Select **Settings**. Search for "mac address", and then select **Mac address** > **Advanced WLAN**. Write down the MAC address that appears near the bottom of the dialog box. 
    >
    > ![Vysor MAC address](media/speech-devices-sdk/qsg-11.png)
    >
    > Some companies might have a time limit on how long a device can be connected to their Wi-Fi system. You might need to extend the dev kit's registration with your Wi-Fi system after a specific number of days.
    > 
    > If you want to attach a speaker to the dev kit, you can connect it to the audio line out. You should choose a good-quality, 3.5-mm speaker.
    >
    > ![Vysor audio](media/speech-devices-sdk/qsg-14.png)
 
## Run a sample application

To run the ROOBO tests and validate your development kit setup, build and install the sample application:

1.	Start Android Studio.

1.	Select **Open an existing Android Studio project**.

    ![Android Studio - Open an existing project](media/speech-devices-sdk/qsg-5.png)
 
1.	Go to C:\SDSDK\Android-Sample-Release\example. Select **OK** to open the example project.
 
1.	Add your Speech subscription key to the source code. If you want to try intent recognition, also add your [Language Understanding service](https://azure.microsoft.com/services/cognitive-services/language-understanding-intelligent-service/) subscription key and application ID. 

    Your keys and application information go in the following lines in the source file MainActivity.java:

    ```java
    // Subscription
    private static final String SpeechSubscriptionKey = "[your speech key]";
    private static final String SpeechRegion = "westus";
    private static final String LuisSubscriptionKey = "[your LUIS key]";
    private static final String LuisRegion = "westus2.api.cognitive.microsoft.com";
    private static final String LuisAppId = "[your LUIS app ID]"
    ```

1. The default wake word (keyword) is "Computer". You can also try one of the other provided wake words, like "Machine" or "Assistant". The resource files for these alternate wake words are in the Speech Devices SDK, in the keyword folder. For example, C:\SDSDK\Android-Sample-Release\keyword\Computer contains the files used for the wake word "Computer".

    You can also [create a custom wake word](speech-devices-sdk-create-kws.md).

    To install the wake word you want to use:
 
    * Create a keyword folder in the data folder on the device by running the following commands in a Command Prompt window:

        ```
        adb shell
        cd /data
        mkdir keyword
        exit
        ```

    * Copy the files kws.table, kws_g.fst, kws_k.fst, and words_kw.txt to the device's \data\keyword folder. Run the following commands in a Command Prompt window. If you created a [custom wake word](speech-devices-sdk-create-kws.md), the kws.table file generated from the web is in the same directory as the kws.table, kws_g.fst, kws_k.fst, and words_kw.txt files. For a custom wake word, use the `adb push C:\SDSDK\Android-Sample-Release\keyword\[wake_word_name]\kws.table /data/keyword` command to push the kws.table file to the dev kit:

        ```
        adb push C:\SDSDK\Android-Sample-Release\keyword\kws.table /data/keyword
        adb push C:\SDSDK\Android-Sample-Release\keyword\Computer\kws_g.fst /data/keyword
        adb push C:\SDSDK\Android-Sample-Release\keyword\Computer\kws_k.fst /data/keyword
        adb push C:\SDSDK\Android-Sample-Release\keyword\Computer\words_kw.txt /data/keyword
        ```
    
    * Reference these files in the sample application. Find the following lines in MainActivity.java. Make sure that the keyword specified is the one you're using, and that the path points to the `kws.table` file that you pushed to the device.
        
        ```java
        private static final String Keyword = "Computer";
        private static final String KeywordModel = "/data/keyword/kws.table";
        ```

        > [!NOTE]
        > In your own code, you can use the kws.table file to create a keyword model instance and start recognition:
        >
        > ```java
    	> KeywordRecognitionModel km = KeywordRecognitionModel.fromFile(KeywordModel);
        > final Task<?> task = reco.startKeywordRecognitionAsync(km);
        > ```

1.	Update the following lines, which contain the microphone array geometry settings:

    ```java
    private static final String DeviceGeometry = "Circular6+1";
    private static final String SelectedGeometry = "Circular6+1";
    ```
    The following table describes the available values:
    
    |Variable|Meaning|Available values|
    |--------|-------|----------------|
    |`DeviceGeometry`|Physical mic configuration|For a circular dev kit: `Circular6+1` |
    |||For a linear dev kit: `Linear4`|
    |`SelectedGeometry`|Software mic configuration|For a circular dev kit that uses all mics: `Circular6+1`|
    |||For a circular dev kit that uses four mics: `Circular3+1`|
    |||For a linear dev kit that uses all mics: `Linear4`|
    |||For a linear dev kit that uses two mics: `Linear2`|


1.	To build the application, on the **Run** menu, select **Run 'app'**. The **Select Deployment Target** dialog box appears. 

1. Select your device, and then select **OK** to deploy the application to the device.

    ![Select Deployment Target dialog box](media/speech-devices-sdk/qsg-7.png)
 
1.	The Speech Devices SDK example application starts and displays the following options:

    ![Sample Speech Devices SDK example application and options](media/speech-devices-sdk/qsg-8.png)

1. Experiment!

## Troubleshooting

### Certificate failures

If you get certificate failures when you use the Speech service, make sure that your device has the correct date and time:

1. Go to **Settings**. Under **System**, select **Date & time**.

    ![Under Settings, select Date & time](media/speech-devices-sdk/qsg-12.png)

1. Keep the **Automatic date & time** option selected. Under **Select time zone**, select your current time zone. 

    ![Select date and time zone options](media/speech-devices-sdk/qsg-13.png)

    When you see that the dev kit's time matches the time on your PC, the dev kit is connected to the internet. 
    
    For more development information, see the [ROOBO development guide](http://dwn.roo.bo/server_upload/ddk/ROOBO%20Dev%20Kit-User%20Guide.pdf).

### Audio

ROOBO provides a tool that captures all audio to flash memory. It might help you troubleshoot audio issues. A version of the tool is provided for each development kit configuration. On the  [ROOBO site](http://ddk.roobo.com/), select your device, and then select the **ROOBO Tools** link at the bottom of the page.
