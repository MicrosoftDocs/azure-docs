---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/14/2022
ms.author: eur
---

> [!IMPORTANT]
> Use the most recent LTS release of the Linux distribution. For example, if you are using Ubuntu 20.04 LTS, use the latest release of Ubuntu 20.04.X.

The Speech SDK depends on the following Linux system libraries:

- The shared libraries of the GNU C library, including the POSIX Threads Programming library, `libpthreads`
- The OpenSSL library (`libssl`) version 1.x and certificates (`ca-certificates`)
- The shared library for ALSA applications (`libasound`)
- You should also install `ca-certificates` to establish a secure websocket and avoid the `WS_OPEN_ERROR_UNDERLYING_IO_OPEN_FAILED` error.

# [Ubuntu 18.04/20.04/22.04](#tab/ubuntu)

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

> [!IMPORTANT]
> The Speech SDK does not support OpenSSL 3.0, which is the default in Ubuntu 22.04. 

On Ubuntu 22.04 only, install the latest libssl1.1 either as a [binary package](http://security.ubuntu.com/ubuntu/pool/main/o/openssl/), or by compiling it from sources.

# [Debian 9/10/11](#tab/debian)

To use the Speech SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

# [RHEL 7/8 and CentOS 7/8](#tab/rhel-centos)

Install the development tools and libraries:

```Bash
sudo yum update
sudo yum groupinstall "Development tools"
sudo yum install alsa-lib openssl wget
```

> [!IMPORTANT]
> - On RHEL/CentOS 7, follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/cognitive-services/speech-service/how-to-configure-rhel-centos-7.md).
> - On RHEL/CentOS 8, follow the instructions on [how to configure OpenSSL for Linux](~/articles/cognitive-services/speech-service/how-to-configure-openssl-linux.md).

---
