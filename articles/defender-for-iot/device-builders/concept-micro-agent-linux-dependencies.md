---
title: Micro agent Linux dependencies (Preview)  
description: 
ms.topic: conceptual
ms.date: 07/08/2021
---

# Micro agent Linux dependencies (Preview)

This guide describes the different Defender for IoT micro agent for Linux OS dependencies. 

The table below shows the dependencies for each component in it. 

|--|--|--|--|--|
| -- | -- | -- | -- | -- |
| **Core** |  |  |  |  |
|  | libcurl-openssl (libcurl) | Library | ✔ |  |
|  | libssl | Library | ✔ |  |
|  | uuid | Library | ✔ |  |
|  | pthread | ulibc compilation flag | ✔ |  |
|  | libuv1 | Library |  |  |
|  | sudo | Package |  |  |
|  | uuid-runtime | Package |  |  |
| **System information collector** | uname | System call |  |  |
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