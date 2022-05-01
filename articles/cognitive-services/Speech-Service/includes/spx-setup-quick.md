---
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/28/2021
ms.author: eur
ms.custom: ignite-fall-2021
---

#### [Windows installation](#tab/windowsinstall)

Follow these steps to install the Speech CLI:

1. Install the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) for your platform. Installing it for the first time might require a restart.
1. Install [.NET Core 3.1 SDK](/dotnet/core/install/windows).
2. Install the Speech CLI via NuGet by entering this command:
   ```console
   dotnet tool install --global Microsoft.CognitiveServices.Speech.CLI
   ```
1. Install [GStreamer](../how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

Enter `spx` to confirm the installation and see help for the Speech CLI.

#### [Linux installation](#tab/linuxinstall)

Follow these steps to install the Speech CLI on Linux on an x64 CPU:

1. Install the [.NET Core 3.1 SDK](/dotnet/core/install/linux).
1. Install the Speech CLI via NuGet by entering this command:
   ```console
   dotnet tool install --global Microsoft.CognitiveServices.Speech.CLI
   ```
1. Install [GStreamer](../how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.
1. On RHEL/CentOS Linux, [Configure OpenSSL for Linux](../how-to-configure-openssl-linux.md).

Enter `spx` to confirm the installation and see help for the Speech CLI.

#### [Docker installation (Windows, Linux, macOS)](#tab/dockerinstall)

> [!IMPORTANT]
> The following example pulls a public container image from Docker Hub. We recommend that you authenticate with your Docker Hub account (`docker login`) first instead of making an anonymous pull request. To improve reliability when you're using public content, import and manage the image in a private Azure container registry. [Learn more about working with public images](../../../container-registry/buffer-gate-public-content.md).

Follow these steps to install the Speech CLI in a Docker container:

1. <a href="https://www.docker.com/get-started" target="_blank">Install Docker Desktop</a> for your platform if it isn't already installed.
1. In a new command prompt or terminal, enter this command:
   ```console   
   docker pull msftspeech/spx
   ```
Enter this command to display help information for the Speech CLI:

```console 
docker run -it --rm msftspeech/spx help
```
***