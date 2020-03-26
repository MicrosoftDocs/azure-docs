---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: dapine
---


> [!WARNING]
> The Speech SDK supports Windows 10 and Windows Server 2016, or later versions. Earlier versions are **not supported**.

The Speech SDK requires the <a href="https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads" target="_blank">Microsoft Visual C++ Redistributable for Visual Studio 2019 <span class="docon docon-navigate-external x-hidden-focus"></span></a> on the system.

- <a href="https://aka.ms/vs/16/release/vc_redist.x86.exe" target="_blank">Install for x86 <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://aka.ms/vs/16/release/vc_redist.x64.exe" target="_blank">Install for x64 <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://aka.ms/vs/16/release/vc_redist.arm64.exe" target="_blank">Install for ARMx64 <span class="docon docon-navigate-external x-hidden-focus"></span></a>

For microphone input, the Media Foundation libraries must be installed. These libraries are part of Windows 10 and Windows Server 2016. It's possible to use the Speech SDK without these libraries, as long as a microphone isn't used as the audio input device.

The required Speech SDK files can be deployed in the same directory as your application. This way your application can directly access the libraries. Make sure you select the correct version (x86/x64) that matches your application.

| Name                                            | Function                                             |
|-------------------------------------------------|------------------------------------------------------|
| `Microsoft.CognitiveServices.Speech.core.dll`   | Core SDK, required for native and managed deployment |
| `Microsoft.CognitiveServices.Speech.csharp.dll` | Required for managed deployment                      |

> [!NOTE]
> Starting with the release 1.3.0 the file `Microsoft.CognitiveServices.Speech.csharp.bindings.dll` (shipped in previous releases) isn't needed anymore. The functionality is now integrated in the core SDK.

> [!NOTE]
> For the Windows Forms App (.NET Framework) C# project, make sure the libraries are included in your project's deployment settings. You can check this under `Properties -> Publish Section`. Click the `Application Files` button and find corresponding libraries from the scroll down list. Make sure the value is set to `Included`. Visual Studio will include the file when project is published/deployed.

For Windows, we support the following languages:

* C# (UWP and .NET), C++:
  You can reference and use the latest version of our Speech SDK NuGet package. The package includes 32-bit and 64-bit client libraries and managed (.NET) libraries. The SDK can be installed in Visual Studio by using NuGet, [Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech).

* Java:
  You can reference and use the latest version of our Speech SDK Maven package, which supports only Windows x64. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.8.0` as a dependency.
