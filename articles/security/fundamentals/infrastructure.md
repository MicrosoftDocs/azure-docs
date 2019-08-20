---
title: Azure infrastructure security | Microsoft Docs
description: The article describes how Microsoft works to secure our Azure datacenters.
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/06/2018
ms.author: terrylan

---

# Azure infrastructure security
Microsoft Azure runs in datacenters managed and operated by Microsoft. These geographically dispersed datacenters comply with key industry standards, such as ISO/IEC 27001:2013 and NIST SP 800-53, for security and reliability. The datacenters are managed, monitored, and administered by Microsoft operations staff. The operations staff has years of experience in delivering the world’s largest online services with 24 x 7 continuity.

This series of articles provides information about what Microsoft does to secure the Azure infrastructure. The articles address:

- [Physical security](physical-security.md)
- [Availability](infrastructure-availability.md)
- [Components and boundaries](infrastructure-components.md)
- [Network architecture](infrastructure-network.md)
- [Production network](production-network.md)
- [SQL Database](infrastructure-sql.md)
- [Operations](infrastructure-operations.md)
- [Monitoring](infrastructure-monitoring.md)
- [Integrity](infrastructure-integrity.md)
- [Data protection](protection-customer-data.md)

## Shared responsibility model
It’s important to understand the division of responsibility between you and Microsoft. On-premises, you own the whole stack, but as you move to the cloud, some responsibilities transfer to Microsoft. The following graphic illustrates the areas of responsibility, according to the type of deployment of your stack (software as a service [SaaS], platform as a service [PaaS], infrastructure as a service [IaaS], and on-premises).

![Graphic showing responsibilities](./media/infrastructure/responsibility-zones.png)

You are always responsible for the following, regardless of the type of deployment:

- Data
- Endpoints
- Account
- Access management

Be sure that you understand the division of responsibility between you and Microsoft in a SaaS, PaaS, and IaaS deployment. For more information, see [Shared responsibilities for cloud computing](https://gallery.technet.microsoft.com/Shared-Responsibilities-81d0ff91/file/153019/1/Shared%20responsibilities%20for%20cloud%20computing.pdf).

## Next steps
To learn more about what Microsoft does to help secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure information system components and boundaries](infrastructure-components.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure production operations and management](infrastructure-operations.md)
- [Azure infrastructure monitoring](infrastructure-monitoring.md)
- [Azure infrastructure integrity](infrastructure-integrity.md)
- [Azure customer data protection](protection-customer-data.md)


