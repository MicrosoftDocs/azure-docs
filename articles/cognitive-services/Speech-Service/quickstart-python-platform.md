---
title: 'Quickstart: Set up the Speech SDK for Python - Speech Service'
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Python with the Speech Services SDK.
services: cognitive-services
author: v-ammark
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 10/09/2019
ms.author: erhopf
---

# Quickstart: Set up the Speech SDK for Python

Quickstarts are also available for [speech-synthesis](quickstart-text-to-speech-python.md)

This article shows how to use the Speech Services through the Speech SDK for Python. It illustrates how to recognize speech from microphone input.

## Prerequisites

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

* On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Note that installing this for the first time may require you to restart Windows.
* And finally, you'll need [Python 3.5 or later](https://www.python.org/downloads/). To check your installation, open a command prompt and type the command `python --version`. If it's installed properly, you'll get a response "Python 3.5.1" or similar. 
    * Make sure have Python in your PATH. 

## Install the Speech SDK

Choose one of the installation options below.

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

### Option 1: Install from the command line

If you are not using Visual Studio Code, this command installs the Python package from [PyPI](https://pypi.org/) for the Speech SDK. For users of Visual Studio Code, skip to the next sub-section.

```sh
pip install azure-cognitiveservices-speech
```

Now you can use the Speech SDK in your Python projects. For example:

```py
import azure.cognitiveservices.speech as speechsdk
```

### Option 2: Install from Visual Studio Code

1. Download and install a 64-bit version of [Python](https://www.python.org/downloads/), 3.5 or later, on your computer. Make sure to select "Add Python to your PATH" during the installation process.
1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Open Visual Studio Code and install the Python extension. Select **File** > **Preferences** > **Extensions** from the menu. Search for **Python**.

   ![Install the Python extension](media/sdk/qs-python-vscode-python-extension.png)

1. You can install the Speech SDK Python package from within Visual Studio Code. Do that if it's not installed yet for the Python interpreter you selected.
   To install the Speech SDK package, open a terminal (bring up the command palette again (Ctrl+Shift+P) and enter **Terminal: Create New Integrated Terminal**).
   In the terminal that opens, enter the command `python -m pip install azure-cognitiveservices-speech` or the appropriate command for your system.

If you have issues following these instructions, refer to the more extensive [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

## Support and updates

Updates to the Speech SDK Python package are distributed via PyPI and announced in the [Release notes](./releasenotes.md).
If a new version is available, you can update to it with the command `pip install --upgrade azure-cognitiveservices-speech`.
Check which version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable.

If you have a problem, or you're missing a feature, see [Support and help options](./support.md).

## Next steps

* [Quickstart: Recognize speech from a microphone]()
* [Quickstart: Synthesize speech from a file]()
* [Quickstart: Translate speech-to-text]()
