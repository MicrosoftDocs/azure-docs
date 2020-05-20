---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: trbye
---

:::row:::
    :::column span="3":::
        The C++ Speech SDK is available on Windows, Linux, and macOS. For more information, see <a href="https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech" target="_blank">Microsoft.CognitiveServices.Speech <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="C++" src="https://docs.microsoft.com/media/logos/logo_Cplusplus.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

#### C++ NuGet package

The C++ Speech SDK can be installed from the **Package Manager** with the following `Install-Package` command.

```powershell
Install-Package Microsoft.CognitiveServices.Speech
```

#### C++ binaries and header files

Alternatively, the C++ Speech SDK can be installed from binaries. Download the SDK as a <a href="https://aka.ms/csspeech/linuxbinary" target="_blank">.tar package <span class="docon docon-navigate-external x-hidden-focus"></span></a> and unpack the files in a directory of your choice. The contents of this package (which include header files for both x86 and x64 target architectures) are structured as follows:

  | Path                   | Description                                          |
  |------------------------|------------------------------------------------------|
  | `license.md`           | License                                              |
  | `ThirdPartyNotices.md` | Third-party notices                                  |
  | `include`              | Header files for C++                                 |
  | `lib/x64`              | Native x64 library for linking with your application |
  | `lib/x86`              | Native x86 library for linking with your application |

  To create an application, copy or move the required binaries (and libraries) into your development environment. Include them as required in your build process.

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/cpp" target="_blank">Windows, Linux, and macOS quickstart C++ source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>