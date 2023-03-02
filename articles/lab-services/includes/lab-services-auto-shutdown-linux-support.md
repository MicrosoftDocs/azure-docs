---
ms.service: lab-services
ms.topic: include
author: ntrogh
ms.author: nicktrog
ms.date: 03/01/2023
---

Azure Lab Services supports automatic shutdown for many Linux distristributions and versions. The following list provides the supported Linux distribution Azure Marketplace images:

- CentOS-based 7.8 (Gen2)
- CentOS-based 7.9
- CentOS-based 7.9 (Gen2)
- CentOS-based 8.4 (Gen2)
- CentOS-based 8.5 (Gen2)
- Debian 11 "Bullseye"
- Debian 11 "Bullseye"(Gen2)
- Ubuntu Minimal 18.04 LTS
- Ubuntu Minimal 20.04 LTS (Gen2)
- Ubuntu Server 18.04 LTS (Gen2)
- Ubuntu Server 20.04 LTS
- Ubuntu Server 20.04 LTS (Gen2)
- Ubuntu-HPC 20.04 (Gen2)

> [!IMPORTANT]
> Prior to the [August 2022 Update](../lab-services-whats-new.md), Linux-based labs only support automatic shut down when users disconnect and when VMs are started but users don't connect. Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu](https://azuremarketplace.microsoft.com/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) image.
