---
title: Security of Azure infrastructure | Microsoft Docs
description: The article describes how Microsoft ensures security of our Azure datacenters.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/25/2018
ms.author: terrylan

---

# Security of Azure infrastructure
Microsoft Azure runs in datacenters managed and operated by Azure. These geographically-dispersed datacenters comply with key industry standards, such as ISO/IEC 27001:2013 and NIST SP 800-53, for security and reliability. The datacenters are managed, monitored, and administered by Microsoft operations staff that have years of experience in delivering the world’s largest online services with 24 x 7 continuity. In addition to datacenter, network, and personnel security practices, Azure incorporates security practices at the application and platform layers to enhance security for application developers and service administrators.

This series of articles provides information on what Microsoft does to secure the physical datacenter. The articles address physical security, availability, datacenter components, network and production architectures, operations, monitoring, integrity, and data protection.

## Shared responsibility model
It’s important to understand the division of responsibility between you and Microsoft. On-premises, you own the whole stack but as you move to the cloud some responsibilities transfer to Microsoft. The following responsibility matrix shows the areas of the stack in a software as a service (SaaS), platform as a service (PaaS), and infrastructure as a service (IaaS) deployment that you are responsible for and Microsoft is responsible for.

![Shared responsibility][1]

Responsibilities that are always retained by you, regardless of the type of deployment, are:

- Data
- Endpoints
- Account
- Access management

Be sure that you understand the division of responsibility between you and Microsoft in a SaaS, PaaS, and IaaS deployment. See [Shared Responsibilities for Cloud Computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91/file/153019/1/Shared%20responsibilities%20for%20cloud%20computing.pdf) for more detail.

## Next steps

<!--Image references-->
[1]: ./media/azure-security-infrastructure/responsibility-zones.png
