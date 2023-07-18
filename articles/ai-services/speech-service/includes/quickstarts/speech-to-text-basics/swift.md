---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/swift.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK for Swift is distributed as a framework bundle. The framework supports both Objective-C and Swift on both iOS and macOS.

The Speech SDK can be used in Xcode projects as a [CocoaPod](https://cocoapods.org/), or downloaded directly [here](https://aka.ms/csspeech/macosbinary) and linked manually. This guide uses a CocoaPod. Install the CocoaPod dependency manager as described in its [installation instructions](https://guides.cocoapods.org/using/getting-started.html).

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Recognize speech from a microphone

Follow these steps to recognize speech in a macOS application.

1. Clone the [Azure-Samples/cognitive-services-speech-sdk](https://github.com/Azure-Samples/cognitive-services-speech-sdk) repository to get the [Recognize speech from a microphone in Swift on macOS](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/swift/macos/from-microphone) sample project. The repository also has iOS samples. 
1. Navigate to the directory of the downloaded sample app (`helloworld`) in a terminal. 
1. Run the command `pod install`. This will generate a `helloworld.xcworkspace` Xcode workspace containing both the sample app and the Speech SDK as a dependency. 
1. Open the `helloworld.xcworkspace` workspace in Xcode.
1. Open the file named `AppDelegate.swift` and locate the `applicationDidFinishLaunching` and `recognizeFromMic` methods as shown here.

    ```swift
    import Cocoa

    @NSApplicationMain
    class AppDelegate: NSObject, NSApplicationDelegate {
        var label: NSTextField!
        var fromMicButton: NSButton!

        var sub: String!
        var region: String!

        @IBOutlet weak var window: NSWindow!

        func applicationDidFinishLaunching(_ aNotification: Notification) {
            print("loading")
            // load subscription information
            sub = ProcessInfo.processInfo.environment["SPEECH_KEY"]
            region = ProcessInfo.processInfo.environment["SPEECH_REGION"]

            label = NSTextField(frame: NSRect(x: 100, y: 50, width: 200, height: 200))
            label.textColor = NSColor.black
            label.lineBreakMode = .byWordWrapping

            label.stringValue = "Recognition Result"
            label.isEditable = false

            self.window.contentView?.addSubview(label)

            fromMicButton = NSButton(frame: NSRect(x: 100, y: 300, width: 200, height: 30))
            fromMicButton.title = "Recognize"
            fromMicButton.target = self
            fromMicButton.action = #selector(fromMicButtonClicked)
            self.window.contentView?.addSubview(fromMicButton)
        }

        @objc func fromMicButtonClicked() {
            DispatchQueue.global(qos: .userInitiated).async {
                self.recognizeFromMic()
            }
        }

        func recognizeFromMic() {
            var speechConfig: SPXSpeechConfiguration?
            do {
                try speechConfig = SPXSpeechConfiguration(subscription: sub, region: region)
            } catch {
                print("error \(error) happened")
                speechConfig = nil
            }
            speechConfig?.speechRecognitionLanguage = "en-US"

            let audioConfig = SPXAudioConfiguration()

            let reco = try! SPXSpeechRecognizer(speechConfiguration: speechConfig!, audioConfiguration: audioConfig)

            reco.addRecognizingEventHandler() {reco, evt in
                print("intermediate recognition result: \(evt.result.text ?? "(no result)")")
                self.updateLabel(text: evt.result.text, color: .gray)
            }

            updateLabel(text: "Listening ...", color: .gray)
            print("Listening...")

            let result = try! reco.recognizeOnce()
            print("recognition result: \(result.text ?? "(no result)"), reason: \(result.reason.rawValue)")
            updateLabel(text: result.text, color: .black)

            if result.reason != SPXResultReason.recognizedSpeech {
                let cancellationDetails = try! SPXCancellationDetails(fromCanceledRecognitionResult: result)
                print("cancelled: \(result.reason), \(cancellationDetails.errorDetails)")
                print("Did you set the speech resource key and region values?")
                updateLabel(text: "Error: \(cancellationDetails.errorDetails)", color: .red)
            }
        }

        func updateLabel(text: String?, color: NSColor) {
            DispatchQueue.main.async {
                self.label.stringValue = text!
                self.label.textColor = color
            }
        }
    }
    ```

1. In `AppDelegate.m`, use the [environment variables that you previously set](#set-environment-variables) for your Speech resource key and region.
    
    ```swift
    sub = ProcessInfo.processInfo.environment["SPEECH_KEY"]
    region = ProcessInfo.processInfo.environment["SPEECH_REGION"]
    ```

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/ai-services/speech-service/language-support.md). For example, `es-ES` for Spanish (Spain). The default language is `en-US` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/ai-services/speech-service/language-identification.md). 
1. Make the debug output visible by selecting **View** > **Debug Area** > **Activate Console**.
1. Build and run the example code by selecting **Product** > **Run** from the menu or selecting the **Play** button.

> [!IMPORTANT]
> Make sure that you set the `SPEECH__KEY` and `SPEECH__REGION` environment variables as described [above](#set-environment-variables). If you don't set these variables, the sample will fail with an error message.

After you select the button in the app and say a few words, you should see the text you have spoken on the lower part of the screen. When you run the app for the first time, you should be prompted to give the app access to your computer's microphone.

## Remarks
Now that you've completed the quickstart, here are some additional considerations:

This example uses the `recognizeOnce` operation to transcribe utterances of up to 30 seconds, or until silence is detected. For information about continuous recognition for longer audio, including multi-lingual conversations, see [How to recognize speech](~/articles/ai-services/speech-service/how-to-recognize-speech.md).

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]


