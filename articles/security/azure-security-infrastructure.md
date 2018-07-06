---
title: Azure Infrastructure Security | Microsoft Docs
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
ms.date: 07/06/2018
ms.author: terrylan

---

# Azure Infrastructure Security
Microsoft Azure runs in datacenters managed and operated by Microsoft. These geographically dispersed datacenters comply with key industry standards, such as ISO/IEC 27001:2013 and NIST SP 800-53, for security and reliability. The datacenters are managed, monitored, and administered by Microsoft operations staff. The operations staff has years of experience in delivering the world’s largest online services with 24 x 7 continuity.

This series of articles provides information on what Microsoft does to secure the Azure infrastructure. The articles address:

- [Physical Security](azure-physical-security.md)
- [Availability](azure-infrastructure-availability.md)
- [Components and boundaries](azure-infrastructure-components.md)
- [Network architecture](azure-infrastructure-network.md)
- [Production network](azure-production-network.md)
- [SQL Database](azure-infrastructure-sql.md)
- [Operations](azure-infrastructure-operations.md)
- [Monitoring](azure-infrastructure-monitoring.md)
- [Integrity](azure-infrastructure-integrity.md)
- [Data protection](azure-protection-of-customer-data.md)

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
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure infrastructure availability](azure-infrastructure-availability.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Microsoft Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Monitoring of Azure infrastructure](azure-infrastructure-monitoring.md)
- [Azure infrastructure integrity](azure-infrastructure-integrity.md)
- [Protection of customer data in Azure](azure-protection-of-customer-data.md)

<!--Image references-->
[1]: ./media/azure-security-infrastructure/responsibility-zones.png
