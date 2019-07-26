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

> [!NOTE]
> The current version of the Azure IoT SDK for Python is a wrapper over our C SDK. It is generated using the Boost library. Because of that, it comes with several significant limitations.
>
> There have been several reports of errors when importing iothub_client in a sample. Here are some ways to troubleshoot that problem.
>
> **Windows**
>
> 1 - Check that you have the right version of Python. Be aware that only certain versions work for the samples. 
>
> 2 - Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.
>
> 3 - Check that you have the right version of C++ runtime [Microsoft Visual C++ Redistributable](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads). We recommend you use the latest version.
>
> 4 - Verify that you have installed the iothub client: `pip install azure-iothub-device-client`
>
> The *pip* packages for `azure-iothub-service-client` and `azure-iothub-device-client` are currently available only for Windows OS. For Linux/Mac OS, please refer to the Linux and Mac OS-specific sections on the [Prepare your development environment for Python](https://github.com/Azure/azure-iot-sdk-python/blob/master/doc/python-devbox-setup.md) post.
>
> **Mac OS**
> 
> For Mac OS, you need Python 3.7.0 (or 2.7) + libboost-1.67 + curl 7.61.1 (all installed via homebrew). Any other distribution/OS will probably embed different versions of boost & dependencies which won't work and will result in an ImportError at runtime.
>
> We are fully aware that this is a less than ideal situation and we are currently working on a full Python implementation that will have the wide platform support that is expected of any respectable Python library. While we intend to support this wrapper-based version of the SDK until the new one is full-featured, we will be deprecating it shortly thereafter. We will update this with the link to the new preview version when it is available.
>