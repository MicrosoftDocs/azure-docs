

# Get started with Bing speech recognition in C&#35; for .NET on Windows Phone 8.1

Develop a basic Windows Phone 8.1 application that uses the [Windows.Media.SpeechRecognition API client library](https://msdn.microsoft.com/en-us/library/windows.media.speechrecognition.aspx) to convert spoken audio input into text by sending audio to Microsoft's servers in the cloud.

Using the Windows.Media.SpeechRecognition API client library allows for real-time streaming. Thus, at the same time your client application sends audio to the service, it simultaneously and asynchronously receives partial recognition results. This tutorial describes the use of the [Windows.Media.SpeechRecognition API client library](https://msdn.microsoft.com/en-us/library/windows.media.speechrecognition.aspx).

## <a name="Prerequisites">Prerequisites</a>

### Platform requirements
The following example was developed for the .NET Framework using [Microsoft Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs).

### Access the client library, and download the example
You can access the Windows.Media.SpeechRecognition [client library](https://msdn.microsoft.com/en-us/library/windows.media.speechrecognition.aspx). Download the example application for a Windows Phone 8.1 Universal [project](https://github.com/microsoft/cognitive-speech-stt-windows).

Extract the downloaded zip file to a folder of your choice. Many users choose the Visual Studio 2015 folder. If the Windows Phone tools isn't already installed, you also might need to download this optional add-on to Visual Studio.

### Subscribe to the Bing Speech API, and get a free-trial subscription key
Before you create the example, you must subscribe to the Bing Speech API, which is part of Azure Cognitive Services (previously Project Oxford). For subscription and key management details, see [Subscription](https://www.microsoft.com/cognitive-services/en-us/sign-up). Both the primary and secondary key can be used in this example.

## <a name="Step1">Step 1: Install the Windows Phone 8.1 example application</a>
1. Start Visual Studio 2015, and select **File** > **Open** > **Project/Solution**.

2. Browse to the folder where you saved the downloaded **SpeechRecognitionExample.WindowsPhone8.1** files. Click to open the **SpeechRecognitionExample.WindowsPhone8.1** folder.

3. Double-click to open the Visual Studio 2015 Solution (.sln) file named **SpeechRecognitionExample.WindowsPhone8.1.sln** in Visual Studio.

## <a name="Step2">Step 2: Build the example application</a>
1. Press Ctrl+Shift+B, or select **Build** on the ribbon menu. Select **Build Solution**.

2. If the **SpeechRecognitionExample.WindowsPhone8.1.csproj** file doesn't run automatically, you might have to specifically add it to the solution. The .csproj file can be found in the same folder as SpeechRecognitionExample.WindowsPhone8.1.sln.

## <a name="Step3">Step 3: Run the example application</a>
1. Before you run the example application, you must decide whether to use a device or a phone emulator to run your example application. If you choose the emulator, make sure your system allows virtualization and has virtualization software, such as Hyper-V, installed to simulate the phone hardware. 

    >[!NOTE]
    >Virtualization is turned off by default in Windows 8, Windows 8.1, and Windows 10.

2. Select **Start** on the ribbon menu, and then select **Device** or one of the **Emulators** to run the example.

3. Locate the **Windows Phone** window on your chosen device, and scroll the apps. Find the **Speech Recognition Example** under "S".

    ![Windows Phone demo](../Images/WindowsPhone_demo.png)

4. Tap the app to open a simple user interface. Tap the **Listen** button, and speak a sentence or two. (Make sure the microphone is on.) The spoken audio returns as text and appears in the square window immediately after your speech. A confidence level accompanies the returned text.

<a name="Review"> </a>
## Review and learn
One SpeechRecognizer object can be used for multiple recognition sessions.


```
protected async override void OnNavigatedTo(NavigationEventArgs e)
![WindowsPhone code](./Images/WindowsPhone-codeSample.PNG)
```
![Windows Phone code](../Images/WindowsPhone_codeSample.png)
A speech recognition session can be started by calling the SpeechRecognizer.RecognizeAsync method. This method returns an IAsyncOperation <SpeechRecognitionResult> object, which provides the Completed event that is triggered upon completion of the recognition session. The session is terminated, and the recognition results are returned when a pause is detected by the recognizer. The results are passed as an argument to any handlers attached to the Completed event.

The results are available in a SpeechRecognitionResult object accessible through the arguments of the Completed event handler. This object provides n-best alternatives in decreasing order of quality. (Results with the highest recognition confidence level come first followed by results with decreasing recognition confidence levels.)

<a name="Summary"> </a>
## Summary  
This "Get started" introduction and the provided example application illustrate only basic functionality of the Windows Media Speech Recognition API. The API offers a rich set of features that we encourage you to explore through the API documentation on MSDN and further experimentation.


<a name="Related"> </a>
## Related topics 
 * [Get started with Bing speech recognition in C Sharp for .NET on Windows Desktop](GetStartedCSharpDesktop.md)
 * [Get started with Bing speech recognition in Java on Android](GetStartedJavaAndroid.md)
 * [Get started with Bing speech recognition in Objective-C on iOS](Get-Started-ObjectiveC-iOS.md)
 * [Get started with the Bing Speech API in JavaScript](GetStartedJS.md)
 * [Get started with the Bing Speech API in cURL](GetStarted-cURL.md)

