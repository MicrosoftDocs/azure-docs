---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: dapine
---

:::row:::
    :::column span="3":::
        Currently, the Speech SDK only supports **Ubuntu 16.04**, **Ubuntu 18.04**, **Debian 9**, **Red Hat Enterprise Linux (RHEL) 8**, and **CentOS 8** on the following target architectures:
        - x86 (Debian/Ubuntu), x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for C++ development
        - x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for Java
        - x64 for .NET Core and Python
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Android" src="https://docs.microsoft.com/media/logos/logo_linux-color.svg">
        </div>
    :::column-end:::
:::row-end:::




Make sure you have the required libraries installed by running the following shell commands:

On Ubuntu:

```Bash
sudo apt-get update
sudo apt-get install libssl1.0.0 libasound2
```

On Debian 9:

```Bash
sudo apt-get update
sudo apt-get install libssl1.0.2 libasound2
```

On RHEL/CentOS 8:

```Bash
sudo yum update
sudo yum install alsa-lib openssl
```

> [!TIP]
> On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](../how-to-configure-openssl-linux.md).

* Java:
  You can reference and use the latest version of our Speech SDK Maven package. In your Maven project, add `https://csspeechstorage.blob.core.windows.net/maven/` as an additional repository and reference `com.microsoft.cognitiveservices.speech:client-sdk:1.7.0` as a dependency.

* C++: Download the SDK as a <a href="https://aka.ms/csspeech/linuxbinary" target="_blank">.tar package <span class="docon docon-navigate-external x-hidden-focus"></span></a> and unpack the files in a directory of your choice. The following table shows the SDK folder structure:

  | Path                   | Description                                          |
  |------------------------|------------------------------------------------------|
  | `license.md`           | License                                              |
  | `ThirdPartyNotices.md` | Third-party notices                                  |
  | `include`              | Header files for C++                                 |
  | `lib/x64`              | Native x64 library for linking with your application |
  | `lib/x86`              | Native x86 library for linking with your application |

  To create an application, copy or move the required binaries (and libraries) into your development environment. Include them as required in your build process.

The Speech SDK currently supports the Ubuntu 16.04, Ubuntu 18.04, Debian 9, RHEL 8, CentOS 8 distributions.
For a native application, you need to ship the Speech SDK library, `libMicrosoft.CognitiveServices.Speech.core.so`.
Make sure you select the version (x86, x64) that matches your application. Depending on the Linux version, you also might need to include the following dependencies:

- The shared libraries of the GNU C library (including the POSIX Threads Programming library, `libpthreads`)
- The OpenSSL library (`libssl.so.1.0.0` or `libssl.so.1.0.2`)
- The shared library for ALSA applications (`libasound.so.2`)

