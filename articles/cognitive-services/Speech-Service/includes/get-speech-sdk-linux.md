---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 04/03/2020
ms.author: eur
---

:::row:::
    :::column span="3":::
        The Speech SDK only supports **Ubuntu 18.04/20.04**, **Debian 9/10**, **Red Hat Enterprise Linux (RHEL) 7/8**, and **CentOS 7/8** on the following target architectures when used with Linux:
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Linux" src="/media/logos/logo_linux.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

- x86 (Debian/Ubuntu), x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for C++ development
- x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for Java
- x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for .NET Core
- x64 for Python

> [!IMPORTANT]
> For C# on Linux ARM64, the .NET Core 3.x (dotnet-sdk-3.x package) is required.

To use the Speech SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

### System requirements

For a native application, the Speech SDK relies on `libMicrosoft.CognitiveServices.Speech.core.so`. Make sure the target architecture (x86, x64) matches the application. Depending on the Linux version, more dependencies might be required:

- The shared libraries of the GNU C library, including the POSIX Threads Programming library, `libpthreads`
- The OpenSSL library (`libssl`)
- The shared library for ALSA applications (`libasound`)

# [Ubuntu 18.04/20.04](#tab/ubuntu)

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev libasound2 wget
```

# [Debian 9/10](#tab/debian)

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev libasound2 wget
```

# [RHEL 7/8 and CentOS 7/8](#tab/rhel-centos)

```Bash
sudo yum update
sudo yum groupinstall "Development tools"
sudo yum install alsa-lib openssl wget
```

> [!IMPORTANT]
> - On RHEL/CentOS 7, follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).
> - On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

---

### C#

[!INCLUDE [Get .NET Speech SDK](get-speech-sdk-dotnet.md)]

### C++

[!INCLUDE [Get C++ Speech SDK](get-speech-sdk-cpp.md)]

### Python

[!INCLUDE [Get Python Speech SDK](get-speech-sdk-python.md)]

### Java

[!INCLUDE [Get Java Speech SDK](get-speech-sdk-java.md)]
