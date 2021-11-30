---
title: How to configure RHEL/CentOS for C++ - Speech service
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

# Configure RHEL/CentOS for C++

To use the Speech SDK for C++ development on Red Hat Enterprise Linux (RHEL) 8 x64 and CentOS 8 x64, update the C++ compiler and the shared C++ runtime library on your system.

## Install dependencies

First install all general dependencies:

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/7/packages-microsoft-prod.rpm

# Install development tools and libraries
sudo yum update -y
sudo yum groupinstall -y "Development tools"
sudo yum install -y alsa-lib dotnet-sdk-2.1 java-1.8.0-openjdk-devel openssl
sudo yum install -y gstreamer1 gstreamer1-plugins-base gstreamer1-plugins-good gstreamer1-plugins-bad-free gstreamer1-plugins-ugly-free
```

## C/C++ compiler and runtime libraries

Install the prerequisite packages with this command:

```bash
sudo yum install -y gmp-devel mpfr-devel libmpc-devel
```

Next update the compiler and runtime libraries:

```bash
# Build GCC 7.5.0 and runtimes and install them under /usr/local
curl https://ftp.gnu.org/gnu/gcc/gcc-7.5.0/gcc-7.5.0.tar.bz2 -O
tar jxf gcc-7.5.0.tar.bz2
mkdir gcc-7.5.0-build && cd gcc-7.5.0-build
../gcc-7.5.0/configure --enable-languages=c,c++ --disable-bootstrap --disable-multilib --prefix=/usr/local
make -j$(nproc)
sudo make install-strip
```

If the updated compiler and libraries need to be deployed on several machines, you can simply copy them from under `/usr/local` to other machines. If only the runtime libraries are needed then the files in `/usr/local/lib64` will be enough.

## Environment settings

Run the following commands to complete the configuration:

```bash
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
export LD_LIBRARY_PATH=/path/to/extracted/SpeechSDK-Linux-<version>/lib/x64:$LD_LIBRARY_PATH
```

## Next steps

> [!div class="nextstepaction"]
> [About the Speech SDK](speech-sdk.md)
