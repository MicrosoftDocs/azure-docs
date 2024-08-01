---
author: eric-urban
ms.service: azure-ai-speech
ms.custom: linux-related-content
ms.topic: include
ms.date: 02/02/2024
ms.author: eur
---

> [!IMPORTANT]
> Use the most recent LTS release of the Linux distribution. For example, if you are using Ubuntu 20.04 LTS, use the latest release of Ubuntu 20.04.X.

The Speech SDK depends on the following Linux system libraries:

- The shared libraries of the GNU C library, including the POSIX Threads Programming library, `libpthreads`.
- The OpenSSL library, version 1.x (`libssl1`) or 3.x (`libssl3`), and certificates (`ca-certificates`).
- The shared library for ALSA applications (`libasound2`).

# [Ubuntu 20.04/22.04](#tab/ubuntu)

Run these commands:

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

# [Debian 11/12](#tab/debian)

Run these commands:

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev ca-certificates libasound2 wget
```

# [RHEL/CentOS 7](#tab/rhel-centos)

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Install the development tools and libraries:

```Bash
sudo yum update
sudo yum groupinstall "Development tools"
sudo yum install alsa-lib openssl wget
```

> [!IMPORTANT]
>
> - Follow the instructions on [how to configure RHEL/CentOS 7 for Speech SDK](~/articles/ai-services/speech-service/how-to-configure-rhel-centos-7.md) and [how to configure OpenSSL for Linux](~/articles/ai-services/speech-service/how-to-configure-openssl-linux.md).
> - Support for RHEL/CentOS 7 will be removed from Speech SDK releases after June 30, 2024 ([CentOS 7 EOL](https://www.redhat.com/topics/linux/centos-linux-eol) and [the end of RHEL 7 Maintenance Support 2](https://access.redhat.com/product-life-cycles?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204)).

---
