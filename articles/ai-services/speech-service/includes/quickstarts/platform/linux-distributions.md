---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/02/2024
ms.author: eur
---

> [!IMPORTANT]
> Use the most recent LTS release of the Linux distribution. For example, if you are using Ubuntu 20.04 LTS, use the latest release of Ubuntu 20.04.X.

The Speech SDK depends on the following Linux system libraries:

- The shared libraries of the GNU C library, including the POSIX Threads Programming library, `libpthreads`.
- The OpenSSL library (`libssl`) version 1.x and certificates (`ca-certificates`).
- The shared library for ALSA applications (`libasound`).

You should also install `ca-certificates` to establish a secure websocket and avoid the `WS_OPEN_ERROR_UNDERLYING_IO_OPEN_FAILED` error.

> [!IMPORTANT]
> The Speech SDK does not yet support OpenSSL 3.0, which is the default in Ubuntu 22.04 and Debian 12.

# [Ubuntu 18.04/20.04](#tab/ubuntu)

Run these commands:

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

# [Debian 10/11](#tab/debian)

To use the Speech SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

# [RHEL 7/8 and CentOS 7](#tab/rhel-centos)

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Install the development tools and libraries:

```Bash
sudo yum update
sudo yum groupinstall "Development tools"
sudo yum install alsa-lib openssl wget
```

> [!IMPORTANT]
>
> - On RHEL/CentOS 7, follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/ai-services/speech-service/how-to-configure-rhel-centos-7.md).
> - On RHEL, follow the instructions on [how to configure OpenSSL for Linux](~/articles/ai-services/speech-service/how-to-configure-openssl-linux.md).

---
