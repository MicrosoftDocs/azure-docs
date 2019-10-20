---
title: 'Quickstart: Recognize speech from an audio file, Python - Speech Service'
titleSuffix: Azure Cognitive Services
description: Use this guide to create a speech-to-text console application that uses the Speech SDK for Python. When finished, you can use your computer's microphone to transcribe speech to text in real time.
services: cognitive-services
author: chlandsi
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: chlandsi
---

## Prerequisites

* An Azure subscription key for the Speech Services. [Get one for free](~/articles/cognitive-services/Speech-Service/get-started.md).
* [Python 3.5 or later](https://www.python.org/downloads/).
* The Python Speech SDK package is available for these operating systems:
    * Windows: x64 and x86.
    * Mac: macOS X version 10.12 or later.
    * Linux: Ubuntu 16.04, Ubuntu 18.04, Debian 9 on x64.
* On Linux, run these commands to install the required packages:

  * On Ubuntu:

    ```sh
    sudo apt-get update
    sudo apt-get install build-essential libssl1.0.0 libasound2
    ```

  * On Debian 9:

    ```sh
    sudo apt-get update
    sudo apt-get install build-essential libssl1.0.2 libasound2
    ```

* On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform.

## Install the Speech SDK

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

This command installs the Python package from [PyPI](https://pypi.org/) for the Speech SDK:

```sh
pip install azure-cognitiveservices-speech
```

## Support and updates

Updates to the Speech SDK Python package are distributed via PyPI and announced in the [Release notes](~/articles/cognitive-services/Speech-Service/releasenotes.md).
If a new version is available, you can update to it with the command `pip install --upgrade azure-cognitiveservices-speech`.
Check which version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable.

If you have a problem, or you're missing a feature, see [Support and help options](~/articles/cognitive-services/Speech-Service/support.md).

## Create a Python application that uses the Speech SDK

### Run the sample

You can copy the [sample code](#sample-code) from this quickstart to a source file `quickstart.py` and run it in your IDE or in the console:

```sh
python quickstart.py
```

Or you can download this quickstart tutorial as a [Jupyter](https://jupyter.org) notebook from the [Speech SDK sample repository](https://github.com/Azure-Samples/cognitive-services-speech-sdk/) and run it as a notebook.

### Sample code

````Python

import azure.cognitiveservices.speech as speechsdk

# Creates an instance of a speech config with specified subscription key and service region.
# Replace with your own subscription key and service region (e.g., "westus").
speech_key, service_region = "YourSubscriptionKey", "YourServiceRegion"
speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

# Creates an audio configuration that points to 
# Replace with your own audio filename.
audio_filename = "whatstheweatherlike.wav"
audio_input = speechsdk.AudioConfig(filename=audio_filename)

# Creates a recognizer with the given settings
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)

print("Recognizing first result...")


# Starts speech recognition, and returns after a single utterance is recognized. The end of a
# single utterance is determined by listening for silence at the end or until a maximum of 15
# seconds of audio is processed.  The task returns the recognition text as result. 
# Note: Since recognize_once() returns only a single utterance, it is suitable only for single
# shot recognition like command or query. 
# For long-running multi-utterance recognition, use start_continuous_recognition() instead.
result = speech_recognizer.recognize_once()

# Checks result.
if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    print("Recognized: {}".format(result.text))
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No speech could be recognized: {}".format(result.no_match_details))
elif result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = result.cancellation_details
    print("Speech Recognition canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        print("Error details: {}".format(cancellation_details.error_details))

````

### Install and use the Speech SDK with Visual Studio Code

1. Download and install a 64-bit version of [Python](https://www.python.org/downloads/), 3.5 or later, on your computer.
1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Open Visual Studio Code and install the Python extension. Select **File** > **Preferences** > **Extensions** from the menu. Search for **Python**.

   ![Install the Python extension](~/articles/cognitive-services/Speech-Service/media/sdk/qs-python-vscode-python-extension.png)

1. Create a folder to store the project in. An example is by using Windows Explorer.
1. In Visual Studio Code, select the **File** icon. Then open the folder you created.

   ![Open a folder](~/articles/cognitive-services/Speech-Service/media/sdk/qs-python-vscode-python-open-folder.png)

1. Create a new Python source file, `speechsdk.py`, by selecting the new file icon.

   ![Create a file](~/articles/cognitive-services/Speech-Service/media/sdk/qs-python-vscode-python-newfile.png)

1. Copy, paste, and save the [Python code](#sample-code) to the newly created file.
1. Insert your Speech Services subscription information.
1. If selected, a Python interpreter displays on the left side of the status bar at the bottom of the window.
   Otherwise, bring up a list of available Python interpreters. Open the command palette (Ctrl+Shift+P) and enter **Python: Select Interpreter**. Choose an appropriate one.
1. You can install the Speech SDK Python package from within Visual Studio Code. Do that if it's not installed yet for the Python interpreter you selected.
   To install the Speech SDK package, open a terminal. Bring up the command palette again (Ctrl+Shift+P) and enter **Terminal: Create New Integrated Terminal**.
   In the terminal that opens, enter the command `python -m pip install azure-cognitiveservices-speech` or the appropriate command for your system.
1. To run the sample code, right-click somewhere inside the editor. Select **Run Python File in Terminal**.
   The first 15 seconds of speech input from your audio file will be recognized and logged in the console window.

   ```text
   Recognizing first result...
   We recognized: What's the weather like?
   ```

If you have issues following these instructions, refer to the more extensive [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

## Next steps

> [!div class="nextstepaction"]
> [Explore Python samples on GitHub](https://aka.ms/csspeech/samples)
