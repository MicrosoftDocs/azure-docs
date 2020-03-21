---
title: How to configure RHEL/CentOS 7
titleSuffix: Azure Cognitive Services
description: Learn how to configure RHEL/CentOS 7 so that SpeechSDK can be used.
services: cognitive-services
author: pankopon
manager: jhakulin
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/20/2020
ms.author: pankopon
---

# Configure RHEL/CentOS 7 for Speech SDK

Red Hat Enterprise Linux (RHEL) 8 x64 and CentOS 8 x64 are officially supported from Speech SDK version 1.10.0 onwards.

It is also possible to use Speech SDK on RHEL/CentOS 7 x64, but this requires updating the C++ compiler (for C++ development) and the shared C++ runtime library on the system.

To check the C++ compiler version, run a command:

```bash
g++ --version
```

If the compiler is installed, the output on vanilla RHEL/CentOS 7 should be like:

```
g++ (GCC) 4.8.5 20150623 (Red Hat 4.8.5-39)
```

i.e. GCC major version 4. This does not have full support for the C\+\+11 standard that Speech SDK uses, and an attempt to compile a C++ program with Speech SDK headers will result in compilation errors.

Another thing to check is the version of the shared C++ runtime library (libstdc++). Most of Speech SDK is implemented as native C++ libraries, thus it depends on libstdc++ regardless of the actual application development language.

To find the location of libstdc++ on the system, run a command:

```bash
ldconfig -p | grep libstdc++
```

The output on vanilla RHEL/CentOS 7 (x64) is:

```
libstdc++.so.6 (libc6,x86-64) => /lib64/libstdc++.so.6
```

Based on the above, check the version definitions with a command:

```bash
strings /lib64/libstdc++.so.6 | egrep "GLIBCXX_|CXXABI_"
```

The output on vanilla RHEL/CentOS 7 (with only the highest version definitions shown):

```
...
GLIBCXX_3.4.19
...
CXXABI_1.3.7
...
```

Speech SDK requires **CXXABI_1.3.9** and **GLIBCXX_3.4.21**. (This can be seen e.g. by running `ldd libMicrosoft.CognitiveServices.Speech.core.so` on Speech SDK libraries from the Linux package.)

It is recommended that the version of GCC installed on the system is at least **5.4.0**, with matching runtime libraries.

## Example

The following is a full set of commands to configure RHEL/CentOS 7 x64 for development (C++, C#, Java, Python) with SpeechSDK 1.10.0 or later.

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

# Build GCC 5.4.0 and runtimes and install them under /usr/local
sudo yum install -y gmp-devel mpfr-devel libmpc-devel
curl https://ftp.gnu.org/gnu/gcc/gcc-5.4.0/gcc-5.4.0.tar.bz2 -O
tar jxf gcc-5.4.0.tar.bz2
mkdir gcc-5.4.0-build && cd gcc-5.4.0-build
../gcc-5.4.0/configure --enable-languages=c,c++ --disable-bootstrap --disable-multilib --prefix=/usr/local
make -j$(nproc)
sudo make install-strip

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
