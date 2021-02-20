---
title: How to configure RHEL/CentOS 7 - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to configure RHEL/CentOS 7 so that the Speech SDK can be used.
services: cognitive-services
author: pankopon
manager: jhakulin
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/02/2020
ms.author: pankopon
---

# Configure RHEL/CentOS 7 for Speech SDK

Red Hat Enterprise Linux (RHEL) 8 x64 and CentOS 8 x64 are officially supported by the Speech SDK version 1.10.0 and later. It is also possible to use the Speech SDK on RHEL/CentOS 7 x64, but this requires updating the C++ compiler (for C++ development) and the shared C++ runtime library on your system.

To check the C++ compiler version, run:

```bash
g++ --version
```

If the compiler is installed, the output should look like this:

```bash
g++ (GCC) 4.8.5 20150623 (Red Hat 4.8.5-39)
```

This message lets you know that GCC major version 4 is installed. This version doesn't have full support for the C++ 11 standard, which the Speech SDK uses. Trying to compile a C++ program with this GCC version and the Speech SDK headers will result in compilation errors.

It's also important to check the version of the shared C++ runtime library (libstdc++). Most of the Speech SDK is implemented as native C++ libraries, meaning it depends on libstdc++ regardless of the language you use to develop applications.

To find the location of libstdc++ on your system, run:

```bash
ldconfig -p | grep libstdc++
```

The output on vanilla RHEL/CentOS 7 (x64) is:

```bash
libstdc++.so.6 (libc6,x86-64) => /lib64/libstdc++.so.6
```

Based on this message, you'll want to check the version definitions with this command:

```bash
strings /lib64/libstdc++.so.6 | egrep "GLIBCXX_|CXXABI_"
```

The output should be:

```bash
...
GLIBCXX_3.4.19
...
CXXABI_1.3.7
...
```

The Speech SDK requires **CXXABI_1.3.9** and **GLIBCXX_3.4.21**. You can find this information by running `ldd libMicrosoft.CognitiveServices.Speech.core.so` on  the Speech SDK libraries from the Linux package.

> [!NOTE]
> It is recommended that the version of GCC installed on the system is at least **5.4.0**, with matching runtime libraries.

## Example

This is a sample command set that illustrates how to configure RHEL/CentOS 7 x64 for development (C++, C#, Java, Python) with the Speech SDK 1.10.0 or later:

### 1. General setup

First install all general dependencies:

```bash
# Only run ONE of the following two commands
# - for CentOS 7:
sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
# - for RHEL 7:
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm

# Install development tools and libraries
sudo yum update -y
sudo yum groupinstall -y "Development tools"
sudo yum install -y alsa-lib dotnet-sdk-2.1 java-1.8.0-openjdk-devel openssl python3
sudo yum install -y gstreamer1 gstreamer1-plugins-base gstreamer1-plugins-good gstreamer1-plugins-bad-free gstreamer1-plugins-ugly-free
```

### 2. C/C++ compiler and runtime libraries

Install the prerequisite packages with this command:

```bash
sudo yum install -y gmp-devel mpfr-devel libmpc-devel
```

> [!NOTE]
> The libmpc-devel package has been deprecated in the RHEL 7.8 update. If the output of the previous command includes a message
>
> ```bash
> No package libmpc-devel available.
> ```
>
> then the necessary files need to be installed from original sources. Run the following commands:
>
> ```bash
> curl https://ftp.gnu.org/gnu/mpc/mpc-1.1.0.tar.gz -O
> tar zxf mpc-1.1.0.tar.gz
> mkdir mpc-1.1.0-build && cd mpc-1.1.0-build
> ../mpc-1.1.0/configure --prefix=/usr/local --libdir=/usr/local/lib64
> make -j$(nproc)
> sudo make install-strip
> ```

Next update the compiler and runtime libraries:

```bash
# Build GCC 5.4.0 and runtimes and install them under /usr/local
curl https://ftp.gnu.org/gnu/gcc/gcc-5.4.0/gcc-5.4.0.tar.bz2 -O
tar jxf gcc-5.4.0.tar.bz2
mkdir gcc-5.4.0-build && cd gcc-5.4.0-build
../gcc-5.4.0/configure --enable-languages=c,c++ --disable-bootstrap --disable-multilib --prefix=/usr/local
make -j$(nproc)
sudo make install-strip
```

If the updated compiler and libraries need to be deployed on several machines, you can simply copy them from under `/usr/local` to other machines. If only the runtime libraries are needed then the files in `/usr/local/lib64` will be enough.

### 3. Environment settings

Run the following commands to complete the configuration:

```bash
# Set SSL cert file location
# (this is required for any development/testing with Speech SDK)
export SSL_CERT_FILE=/etc/pki/tls/certs/ca-bundle.crt

# Add updated C/C++ runtimes to the library path
# (this is required for any development/testing with Speech SDK)
export LD_LIBRARY_PATH=/usr/local/lib64:$LD_LIBRARY_PATH

# For C++ development only:
# - add the updated compiler to PATH
#   (note, /usr/local/bin should be already first in PATH on vanilla systems)
# - add Speech SDK libraries from the Linux tar package to LD_LIBRARY_PATH
#   (note, use the actual path to extracted files!)
export PATH=/usr/local/bin:$PATH
hash -r # reset cached paths in the current shell session just in case
export LD_LIBRARY_PATH=/path/to/extracted/SpeechSDK-Linux-1.10.0/lib/x64:$LD_LIBRARY_PATH

# For Python: install the Speech SDK module
python3 -m pip install azure-cognitiveservices-speech --user
```

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)
