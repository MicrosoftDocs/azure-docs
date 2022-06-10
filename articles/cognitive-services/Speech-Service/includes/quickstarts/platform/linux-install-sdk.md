---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/14/2022
ms.author: eur
---

### System requirements

The Speech SDK only supports **Ubuntu 16.04** (until September 2021), **Ubuntu 18.04/20.04**, **Debian 9/10**, **Red Hat Enterprise Linux (RHEL) 7/8**, and **CentOS 7/8** on the following target architectures when used with Linux:

- x86 (Debian/Ubuntu), x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for C++ development
- x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for Java
- x64, ARM32 (Debian/Ubuntu), and ARM64 (Debian/Ubuntu) for .NET Core
- x64 for Python

> [!IMPORTANT]
> For C# on Linux ARM64, the .NET Core 3.x (dotnet-sdk-3.x package) is required.

To use the Speech SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

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

### Install the Speech SDK

Use the following procedure to download and install the SDK. The steps include downloading the required libraries and header files as a .tar file from https://aka.ms/csspeech/linuxbinary.

1. Choose a directory to which the Speech SDK files should be extracted, and set the `SPEECHSDK_ROOT` environment variable to point to that directory. This variable makes it easy to refer to the directory in future commands. 

   For example, if you want to use the directory `speechsdk` in your home directory, use a command like the following:

   ```sh
   export SPEECHSDK_ROOT="$HOME/speechsdk"
   ```

1. Create the directory if it doesn't exist yet:

   ```sh
   mkdir -p "$SPEECHSDK_ROOT"
   ```

1. Download and extract the `.tar.gz` archive that contains the Speech SDK binaries:

   ```sh
   wget -O SpeechSDK-Linux.tar.gz https://aka.ms/csspeech/linuxbinary
   tar --strip 1 -xzf SpeechSDK-Linux.tar.gz -C "$SPEECHSDK_ROOT"
   ```

1. Validate the contents of the top-level directory of the extracted package:

   ```sh
   ls -l "$SPEECHSDK_ROOT"
   ```

   The directory listing should contain the third-party notice and license files. The listing should also contain an `include` directory that holds header (`.h`) files and a `lib` directory that holds libraries for arm32, arm64, x64, and x86.

   [!INCLUDE [Linux Binary Archive Content](~/includes/cognitive-services-speech-service-linuxbinary-content.md)]
