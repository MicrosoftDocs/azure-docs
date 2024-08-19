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

# [Ubuntu 20.04/22.04/24.04](#tab/ubuntu)

Run these commands:

```Bash
sudo apt-get update
sudo apt-get install build-essential ca-certificates libasound2-dev libssl-dev wget
```

# [Debian 11/12](#tab/debian)

Run these commands:

```Bash
sudo apt-get update
sudo apt-get install build-essential ca-certificates libasound2-dev libssl-dev wget
```

---
