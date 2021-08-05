---
title: Azure Government DoD Overview | Microsoft Docs
description: Features and guidance for using Azure Government DoD regions
services: azure-government
cloud: gov
documentationcenter: ''
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.custom: references_regions
ms.date: 08/04/2021
---

# Department of Defense (DoD) in Azure Government

## Overview

Azure Government is used by the US Department of Defense (DoD) entities to deploy a broad range of workloads and solutions, including workloads subject to the DoD Cloud Computing [Security Requirements Guide](https://dl.dod.cyber.mil/wp-content/uploads/cloud/SRG/index.html) (SRG) Impact Level 4 (IL4) and Impact Level 5 (IL5) restrictions. Azure Government was the first hyperscale cloud services platform to be awarded a DoD IL5 Provisional Authorization (PA) by the Defense Information Systems Agency (DISA). For more information about DISA and DoD IL5, see [Department of Defense (DoD) Impact Level 5](/azure/compliance/offerings/offering-dod-il5) compliance documentation.

Azure Government offers the following regions to DoD mission owners and their partners:

|Regions|Relevant authorizations|# of IL5 PA services|
|------|------|------|
|US Gov Arizona </br> US Gov Texas </br> US Gov Virginia|FedRAMP High, DoD IL4, DoD IL5|138|
|US DoD Central </br> US DoD East|DoD IL5|64|

**Azure Government regions** (US Gov Arizona, US Gov Texas, and US Gov Virginia) are intended for US federal (including DoD), state, and local government agencies, and their partners. **Azure Government DoD regions** (US DoD Central and US DoD East) are reserved for exclusive DoD use. Separate DoD IL5 PAs are in place for Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) vs. Azure Government DoD regions (US DoD Central and US DoD East). 

The primary differences between DoD IL5 PAs that are in place for Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) vs. Azure Government DoD regions (US DoD Central and US DoD East) are:

- **IL5 compliance scope:** Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) have many more services authorized provisionally at DoD IL5, which in turn enables DoD mission owners and their partners to deploy more realistic applications in these regions. For a complete list of services in scope for DoD IL5 PA in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia), see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). For a complete list of Azure Government DoD regions (US DoD Central and US DoD East) services in scope for DoD IL5 PA, see [Azure Government DoD regions IL5 audit scope](#azure-government-dod-regions-il5-audit-scope).
- **IL5 configuration:** Azure Government DoD regions (US DoD Central and US DoD East) are physically isolated from the rest of Azure Government and reserved for exclusive DoD use. Therefore, no extra configuration is needed in DoD regions when deploying Azure services intended for IL5 workloads. In contrast, some Azure services deployed in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

> [!NOTE]
> If you are subject to DoD IL5 requirements, we recommend that you prioritize Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) for your workloads, as follows:
>
> - **New deployments:** Choose Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) for your new deployments. Doing so will allow you to benefit from the latest cloud innovations while meeting your DoD IL5 isolation requirements.
> - **Existing deployments:** If you have existing deployments in Azure Government DoD regions (US DoD Central and US DoD East), we encourage you to migrate these workloads to Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) to take advantage of additional services.

Azure provides [extensive support for tenant isolation](./azure-secure-isolation-guidance.md) across compute, storage, and networking services to segregate each customer's applications and data. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications.

Hyperscale cloud also offers a feature-rich environment incorporating the latest cloud innovations such as artificial intelligence, machine learning, IoT services, intelligent edge, and many more to help DoD mission owners implement their mission objectives. Using Azure Government cloud capabilities, you benefit from rapid feature growth, resiliency, and the cost-effective operation of the hyperscale cloud while still obtaining the levels of isolation, security, and confidence required to handle workloads subject to FedRAMP High, DoD IL4, and DoD IL5 requirements.

## Azure Government regions IL5 audit scope

For a complete list of services in scope for DoD IL5 PA in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia), see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).

## Azure Government DoD regions IL5 audit scope

The following services are in scope for DoD IL5 PA in Azure Government DoD regions (US DoD Central and US DoD East):

- [API Management](https://azure.microsoft.com/services/api-management/)
- [Application Gateway](https://azure.microsoft.com/services/application-gateway/)
- [Azure Active Directory (Free and Basic)](../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses)
- [Azure Active Directory (Premium P1 + P2)](../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses)
- [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/)
- [Azure Backup](https://azure.microsoft.com/services/backup/)
- [Azure Cache for Redis](https://azure.microsoft.com/services/cache/)
- [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)
- [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/)
- [Azure DNS](https://azure.microsoft.com/services/dns/)
- [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/)
- [Azure Front Door](https://azure.microsoft.com/services/frontdoor/)
- [Azure Functions](https://azure.microsoft.com/services/functions/)
- [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/)
- [Azure Lab Services](https://azure.microsoft.com/services/lab-services/)
- [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/)
- [Azure Managed Applications](https://azure.microsoft.com/services/managed-applications/)
- [Azure Media Services](https://azure.microsoft.com/services/media-services/)
- [Azure Monitor](https://azure.microsoft.com/services/monitor/)
- [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- [Azure Scheduler](../scheduler/index.yml)
- [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/)
- [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100))
- [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/)
- [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database/) (incl. [Azure SQL MI](https://azure.microsoft.com/products/azure-sql/managed-instance/))
- [Azure Synapse Analytics (formerly SQL Data Warehouse)](https://azure.microsoft.com/services/synapse-analytics/)
- [Batch](https://azure.microsoft.com/services/batch/)
- [Cloud Services](https://azure.microsoft.com/services/cloud-services/)
- [Dynamics 365 Customer Service](/dynamics365/customer-service/overview)
- [Dynamics 365 Field Service](/dynamics365/field-service/overview)
- [Dynamics 365 Project Service Automation](/dynamics365/project-operations/psa/overview)
- [Dynamics 365 Sales](/dynamics365/sales-enterprise/overview)
- [Event Grid](https://azure.microsoft.com/services/event-grid/)
- [Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [ExpressRoute](https://azure.microsoft.com/services/expressroute/)
- [Import/Export](https://azure.microsoft.com/services/storage/import-export/)
- [Key Vault](https://azure.microsoft.com/services/key-vault/)
- [Load Balancer](https://azure.microsoft.com/services/load-balancer/)
- [Microsoft Azure porta](https://azure.microsoft.com/features/azure-portal/)
- [Microsoft Dataverse (formerly Common Data Service)](/powerapps/maker/data-platform/data-platform-intro)
- [Microsoft Defender for Endpoint (formerly Microsoft Defender Advanced Threat Protection)](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint)
- [Microsoft Graph](/graph/overview)
- [Microsoft Stream](/stream/overview)
- [Network Watcher](https://azure.microsoft.com/services/network-watcher/)
- [Network Watcher Traffic Analytics](../network-watcher/traffic-analytics.md)
- [Power Apps](/powerapps/powerapps-overview)
- [Power Apps portal](https://powerapps.microsoft.com/portals/)
- [Power Automate (formerly Microsoft Flow)](/power-automate/getting-started)
- [Power BI](https://powerbi.microsoft.com/)
- [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/)
- [Service Bus](https://azure.microsoft.com/services/service-bus/)
- [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)
- [Storage: Blobs](https://azure.microsoft.com/services/storage/blobs/) (incl. [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md))
- [Storage: Disks (incl. Managed Disks)](https://azure.microsoft.com/services/storage/disks/)
- [Storage: Files](https://azure.microsoft.com/services/storage/files/)
- [Storage: Queues](https://azure.microsoft.com/services/storage/queues/)
- [Storage: Tables](https://azure.microsoft.com/services/storage/tables/)
- [Traffic Manager](https://azure.microsoft.com/services/traffic-manager/)
- [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/)
- [Virtual Machines](https://azure.microsoft.com/services/virtual-machines/)
- [Virtual Network](https://azure.microsoft.com/services/virtual-network/)
- [VPN Gateway](https://azure.microsoft.com/services/vpn-gateway/)
- [Web Apps (App Service)](https://azure.microsoft.com/services/app-service/web/)

## Frequently asked questions

### What are the Azure Government DoD regions? 
Azure Government DoD regions (US DoD Central and US DoD East) are physically separated Azure Government regions reserved for exclusive use by the DoD.

### What is the difference between Azure Government and the Azure Government DoD regions? 
Azure Government is a US government community cloud providing services for federal, state and local government customers, tribal entities, and other entities subject to various US government regulations such as CJIS, ITAR, and others. All Azure Government regions are designed to meet the security requirements for DoD IL5 workloads. Azure Government DoD regions (US DoD Central and US DoD East) achieve DoD IL5 tenant separation requirements by being dedicated exclusively to DoD. In Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia), some services require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

### How do Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) support IL5 data?
Azure provides [extensive support for tenant isolation](./azure-secure-isolation-guidance.md) across compute, storage, and networking services to segregate each customer's applications and data. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications. Moreover, some Azure services deployed in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

### What is IL5 data? 
IL5 accommodates controlled unclassified information (CUI) that requires a higher level of protection than that afforded by IL4 as deemed necessary by the information owner, public law, or other government regulations. IL5 also supports unclassified National Security Systems (NSS). This impact level accommodates NSS and CUI categorizations based on CNSSI 1253 up to moderate confidentiality and moderate integrity (M-M-x). For more information on IL5 data, see [DoD IL5 overview](/azure/compliance/offerings/offering-dod-il5#dod-il5-overview).

### What is the difference between IL4 and IL5 data?  
IL4 data is controlled unclassified information (CUI) that may include data subject to export control, protected health information, and other data requiring explicit CUI designation (for example, For Official Use Only, Law Enforcement Sensitive, and Sensitive Security Information).

IL5 data includes CUI that requires a higher level of protection as deemed necessary by the information owner, public law, or government regulation. IL5 data is inclusive of unclassified National Security Systems.

### Do Azure Government regions support classified data such as IL6? 
No. Azure Government regions support only unclassified data up to and including IL5. In contrast, IL6 data is defined as classified information up to Secret, and can be accommodated in [Azure Government Secret](https://azure.microsoft.com/global-infrastructure/government/national-security/).

### What DoD organizations can use Azure Government? 
All Azure Government regions are built to support DoD customers, including:

- The Office of the Secretary of Defense
- The Joint Chiefs of Staff
- The Joint Staff
- The Defense Agencies
- Department of Defense Field Activities
- The Department of the Army
- The Department of the Navy (including the United States Marine Corps)
- The Department of the Air Force
- The United States Coast Guard
- The unified combatant commands
- Other offices, agencies, activities, and commands under the control or supervision of any approved entity named above

### What services are part of your IL5 authorization scope? 
For a complete list of services in scope for DoD IL5 PA in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia), see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). For a complete list of services in scope for DoD IL5 PA in Azure Government DoD regions (US DoD Central and US DoD East), see [Azure Government DoD regions IL5 audit scope](#azure-government-dod-regions-il5-audit-scope).

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [How to buy Azure Government](https://azure.microsoft.com/global-infrastructure/government/how-to-buy/)
- [Get started with Azure Government](./documentation-government-get-started-connect-with-portal.md)
- [Azure Government Blog](https://devblogs.microsoft.com/azuregov/)
