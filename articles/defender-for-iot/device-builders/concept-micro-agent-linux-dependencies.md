---
title: Micro agent Linux dependencies  
description: This article describes the different Linux OS dependencies for the Defender for IoT micro agent. 
ms.topic: conceptual
ms.date: 01/01/2023
---

# Micro agent Linux dependencies

This article describes the different Linux OS dependencies for the Defender for IoT micro agent.

## Linux dependencies

The table below shows the Linux dependencies for each component.

| Component | Dependency | Type | Required by IoT SDK | Notes |
|--|--|--|--|--|
| **Core** |  |  |  |  |
|  | libcurl-openssl (libcurl) | Library | ✔ |  |
|  | libssl | Library | ✔ |  |
|  | uuid | Library | ✔ |  |
|  | pthread | ulibc compilation flag | ✔ |  |
|  | libuv1 | Library |  |  |
|  | sudo | Package |  |  |
|  | uuid-runtime | Package |  |  |
| **System information collector** |  |  |  |  |
|  | uname | System call |  |  |
| **Baseline collector** |  |  |  |  |
|  | BusyBox | Linux compilation flag |  |  |
|  | Bash | Linux compilation flag |  |  |
| **Process collector** |  |  |  |  |
|  | CONFIG_CONNECTOR=y | Kernel config |  |  |
|  | CONFIG_PROC_EVENTS=y | Kernel config |  |  |
| **Network collector** |  |  |  |  |
|  | libpcap | Library |  |  |
|  | CONFIG_PACKET=y | Kernel config |  |  |
|  | CONFIG_NETFILTER =y | Kernel config |  | Optional – Performance improvement |
| **Login collector** |  |  |  |  |
|  | Wtmp, btmp | Log files |  | [utmp](https://en.wikipedia.org/wiki/Utmp) |

## Next steps

[Install the Defender for IoT micro agent](quickstart-standalone-agent-binary-installation.md).
