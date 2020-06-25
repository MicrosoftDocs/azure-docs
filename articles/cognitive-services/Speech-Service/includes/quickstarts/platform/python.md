---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/04/2020
ms.author: trbye
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Python. If you just want the package name to get started on your own, run `pip install azure-cognitiveservices-speech`.

[!INCLUDE [License Notice](~/includes/cognitive-services-speech-service-license-notice.md)]

## Supported operating systems

- The Python Speech SDK package is available for these operating systems:
  - Windows: x64 and x86
  - Mac: macOS X version 10.12 or later
  - Linux: Ubuntu 16.04/18.04, Debian 9, RHEL 7/8, CentOS 7/8 on x64

## Prerequisites

- Supported Linux platforms will require certain libraries installed (`libssl` for secure sockets layer support and `libasound2` for sound support). Refer to your distribution below for the commands needed to install the correct versions of these libraries.

  - On Ubuntu, run the following commands to install the required packages:

        ```sh
        sudo apt-get update
        sudo apt-get install build-essential libssl1.0.0 libasound2
        ```

  - On Debian 9, run the following commands to install the required packages:

        ```sh
        sudo apt-get update
        sudo apt-get install build-essential libssl1.0.2 libasound2
        ```

  - On RHEL/CentOS, run the following commands to install the required packages:

        ```sh
        sudo yum update
        sudo yum install alsa-lib openssl python3
        ```

> [!NOTE]
> - On RHEL/CentOS 7, follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).
> - On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

- On Windows, you need the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Note that installing this for the first time may require you to restart Windows before continuing with this guide.
- And finally, you'll need [Python 3.5 to 3.8](https://www.python.org/downloads/). To check your installation, open a command prompt and type the command `python --version` and check the result. If it's installed properly, you'll get a response "Python 3.5.1" or similar.

## Install the Speech SDK from PyPI

If you're using your own environment or build tools, run the following command to install the Speech SDK from [PyPI](https://pypi.org/). For users of Visual Studio Code, skip to the next sub-section for guided installation.

```sh
pip install azure-cognitiveservices-speech
```

If you are on macOS, you may need to run the following command to get the `pip` command above to work:

```sh
python3 -m pip install --upgrade pip
```

Once you've successfully used `pip` to install `azure-cognitiveservices-speech`, you can use the Speech SDK by importing the namespace into your Python projects.

```py
import azure.cognitiveservices.speech as speechsdk
```

## Install the Speech SDK using Visual Studio Code

1. Download and install the latest supported version of [Python](https://www.python.org/downloads/) for your platform, 3.5 to 3.8.
   - Windows users make sure to select "Add Python to your PATH" during the installation process.
1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Open Visual Studio Code and install the Python extension. Select **File** > **Preferences** > **Extensions** from the menu. Search for **Python** and click **Install**.

   ![Install the Python extension](~/articles/cognitive-services/speech-service/media/sdk/qs-python-vscode-python-extension.png)

1. Also from within Visual Studio Code, install the Speech SDK Python package from the integrated command line:
   1. Open a terminal (from the drop-down menus, **Terminal** > **New Terminal**)
   1. In the terminal that opens, enter the command `python -m pip install azure-cognitiveservices-speech`

If you are new to Visual Studio Code, refer to the more extensive [Visual Studio Code Documentation](https://code.visualstudio.com/docs). For more information about Visual Studio Code and Python, see [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

## Support and updates

Updates to the Speech SDK Python package are distributed via PyPI and announced in the [Release notes](~/articles/cognitive-services/speech-service/releasenotes.md).
If a new version is available, you can update to it with the command `pip install --upgrade azure-cognitiveservices-speech`.
Check which version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable.

If you have a problem, or you're missing a feature, see [Support and help options](~/articles/cognitive-services/speech-service/support.md).

## Next steps

[!INCLUDE [windows](../quickstart-list.md)]
