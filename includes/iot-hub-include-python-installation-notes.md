---
 title: include file
 description: include file
 services: iot-hub
 author: robinsh
 ms.service: iot-hub
 ms.topic: include
 ms.date: 07/24/2019
 ms.author: robinsh
 ms.custom: include file
---

* An active Azure account. (If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.)

* **Windows**

    * [Python  2.x or 3.x](https://www.python.org/downloads/). Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable. If you are using Python 2.x, you may need to [install or upgrade *pip*, the Python package management system](https://pip.pypa.io/en/stable/installing/).

    * If you are using Windows OS, be sure you have the right version of the [Visual C++ redistributable package](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) to allow the use of native DLLs from Python. We recommend you use the latest version.

    * If needed, install the [azure-iothub-device-client](https://pypi.org/project/azure-iothub-device-client/) package, using the command
        `pip install azure-iothub-device-client`

    * If needed, install the [azure-iothub-service-client](https://pypi.org/project/azure-iothub-service-client/) package, using the command
        `pip install azure-iothub-service-client`

* **Mac OS**

    For Mac OS, you need Python 3.7.0 (or 2.7) + libboost-1.67 + curl 7.61.1 (all installed via homebrew). Any other distribution/OS will probably embed different versions of boost & dependencies which won't work and will result in an ImportError at runtime.

    The *pip* packages for `azure-iothub-service-client` and `azure-iothub-device-client` are currently available only for Windows OS. For Linux/Mac OS, please refer to the Linux and Mac OS-specific sections on the [Prepare your development environment for Python](https://github.com/Azure/azure-iot-sdk-python/blob/master/doc/python-devbox-setup.md) post.

> [!NOTE]
> There have been several reports of errors when importing iothub_client in a sample. For more information on dealing with **ImportError** issues, please see [Dealing with ImportError issues](https://github.com/Azure/azure-iot-sdk-python#important-installation-notes---dealing-with-importerror-issues).
