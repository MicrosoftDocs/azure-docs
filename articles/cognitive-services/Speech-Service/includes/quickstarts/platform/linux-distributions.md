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
- The OpenSSL library (`libssl`) version 1.x
- The shared library for ALSA applications (`libasound`)

# [Ubuntu 18.04/20.04/22.04](#tab/ubuntu)

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev libasound2 wget
```

> [!IMPORTANT]
> On Ubuntu 22.04, install `libssl1.1` either as a [binary package](http://security.ubuntu.com/ubuntu/pool/main/o/openssl/) such as `libssl1.1_1.1.1l-1ubuntu1.3_amd64.deb`, or by compiling it from sources. The Speech SDK does not support OpenSSL 3.0, which is the default in Ubuntu 22.04.

Here's an example of installing `libssl1.1` on Ubuntu 22.04:
```Bash
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1l-1ubuntu1.3_amd64.deb
sudo dpkg -i libssl1.1_1.1.1l-1ubuntu1.3_amd64.deb
```

# [Debian 9/10/11](#tab/debian)

To use the Speech SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev libasound2 wget
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
