---
title: 'Quickstart: Speech SDK for Python platform setup - Speech service'
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Python with the Speech Services SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 10/09/2019
ms.author: erhopf
---

# Quickstart: Speech SDK for Python platform setup - Speech service

This article shows how to use the Speech Services through the Speech SDK for Python. It illustrates how to recognize speech from microphone input.

[!INCLUDE [License Notice](../../../includes/cognitive-services-speech-service-license-notice.md)]

## Supported operating systems

* The Python Speech SDK package is available for these operating systems:
    * Windows: x64 and x86.
    * Mac: macOS X version 10.12 or later.
    * Linux: Ubuntu 16.04, Ubuntu 18.04, Debian 9 on x64.

## Prerequisites

* Supported Linux platforms will require certain libraries, `libssl` for secure sockets layer support and `libasound2` for sound support. See your distribution below for specific commands.
    * On Ubuntu, run these commands to install the required packages:
    
          ```sh
          sudo apt-get update
          sudo apt-get install build-essential libssl1.0.0 libasound2
          ```
        
    * On Debian 9, run these commands to install the required packages:
    
          ```sh
          sudo apt-get update
          sudo apt-get install build-essential libssl1.0.2 libasound2
          ```
        
* On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Note that installing this for the first time may require you to restart Windows.
* And finally, you'll need [Python 3.5 or later](https://www.python.org/downloads/). To check your installation, open a command prompt and type the command `python --version`. If it's installed properly, you'll get a response "Python 3.5.1" or similar. 
    * Make sure have Python in your PATH. 

##  Install the Speech SDK from Visual Studio Code

1. Download and install a 64-bit version of [Python](https://www.python.org/downloads/), 3.5 or later. Make sure to select "Add Python to your PATH" during the installation process (Windows only).
1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Open Visual Studio Code and install the Python extension. Select **File** > **Preferences** > **Extensions** from the menu. Search for **Python** and click **Install**.

   ![Install the Python extension](media/sdk/qs-python-vscode-python-extension.png)

1. Also from within Visual Studio Code, install the Speech SDK Python package from the integrated command line:
    1. Open a terminal (from the drop-down menus, **Terminal** > **New Terminal**)
    1. In the terminal that opens, enter the command `python -m pip install azure-cognitiveservices-speech`

If you have issues following these instructions, refer to the more extensive [Visual Studio Code Documentation](https://code.visualstudio.com/docs). For more information about VS Code and Python, see [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

##  Install the Speech SDK from the command line

If you are not using Visual Studio Code, this command installs the Python package from [PyPI](https://pypi.org/) for the Speech SDK. For users of Visual Studio Code, skip to the next sub-section.

```sh
pip install azure-cognitiveservices-speech
```

You can now use the Speech SDK import within your Python projects. For example:

```py
import azure.cognitiveservices.speech as speechsdk
```

## Support and updates

Updates to the Speech SDK Python package are distributed via PyPI and announced in the [Release notes](./releasenotes.md).
If a new version is available, you can update to it with the command `pip install --upgrade azure-cognitiveservices-speech`.
Check which version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable.

If you have a problem, or you're missing a feature, see [Support and help options](./support.md).

## Next steps

* [Quickstart: Recognize speech from a microphone]()
* [Quickstart: Synthesize speech from a file]()
* [Quickstart: Translate speech-to-text]()