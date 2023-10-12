---
title: Azure Government DoD Overview | Microsoft Docs
description: Features and guidance for using Azure Government DoD regions
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.topic: article
ms.custom: references_regions
recommendations: false
ms.date: 05/09/2023
---

# Department of Defense (DoD) in Azure Government

## Overview

Azure Government is used by the US Department of Defense (DoD) entities to deploy a broad range of workloads and solutions. Some of these workloads can be subject to the DoD Cloud Computing [Security Requirements Guide](https://public.cyber.mil/dccs/dccs-documents/) (SRG) Impact Level 4 (IL4) and Impact Level 5 (IL5) restrictions. Azure Government was the first hyperscale cloud services platform to be awarded a DoD IL5 Provisional Authorization (PA) by the Defense Information Systems Agency (DISA). For more information about DISA and DoD IL5, see [Department of Defense (DoD) Impact Level 5](/azure/compliance/offerings/offering-dod-il5) compliance documentation.

Azure Government offers the following regions to DoD mission owners and their partners:

|Regions|Relevant authorizations|# of IL5 PA services|
|------|------|------|
|US Gov Arizona </br> US Gov Texas </br> US Gov Virginia|FedRAMP High, DoD IL4, DoD IL5|150|
|US DoD Central </br> US DoD East|DoD IL5|60|

Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (**US Gov regions**) are intended for US federal (including DoD), state, and local government agencies, and their partners. Azure Government regions US DoD Central and US DoD East (**US DoD regions**) are reserved for exclusive DoD use. Separate DoD IL5 PAs are in place for US Gov regions vs. US DoD regions. For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

The primary differences between DoD IL5 PAs that are in place for US Gov regions vs. US DoD regions are:

- **IL5 compliance scope:** US Gov regions have many more services authorized provisionally at DoD IL5, which in turn enables DoD mission owners and their partners to deploy more realistic applications in these regions.
  - For a complete list of services in scope for DoD IL5 PA in US Gov regions, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).
  - For a complete list of services in scope for DoD IL5 in US DoD regions, see [US DoD regions IL5 audit scope](#us-dod-regions-il5-audit-scope) in this article.
- **IL5 configuration:** US DoD regions are reserved for exclusive DoD use. Therefore, no extra configuration is needed in US DoD regions when deploying Azure services intended for IL5 workloads. In contrast, some Azure services deployed in US Gov regions require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

> [!NOTE]
> If you are subject to DoD IL5 requirements, we recommend that you prioritize US Gov regions for your workloads, as follows:
>
> - **New deployments:** Choose US Gov regions for your new deployments. Doing so will allow you to benefit from the latest cloud innovations while meeting your DoD IL5 isolation requirements.
> - **Existing deployments:** If you have existing deployments in US DoD regions, we encourage you to migrate these workloads to US Gov regions to take advantage of additional services.

Azure provides [extensive support for tenant isolation](./azure-secure-isolation-guidance.md) across compute, storage, and networking services to segregate each customer's applications and data. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications.

Hyper-scale cloud also offers a feature-rich environment incorporating the latest cloud innovations such as artificial intelligence, machine learning, IoT services, intelligent edge, and many more to help DoD mission owners implement their mission objectives. Using Azure Government cloud capabilities, you benefit from rapid feature growth, resiliency, and the cost-effective operation of the hyper-scale cloud while still obtaining the levels of isolation, security, and confidence required to handle workloads subject to FedRAMP High, DoD IL4, and DoD IL5 requirements.

## US Gov regions IL5 audit scope

For a complete list of services in scope for DoD IL5 PA in US Gov regions (US Gov Arizona, US Gov Texas, and US Gov Virginia), see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope).

## US DoD regions IL5 audit scope

The following services are in scope for DoD IL5 PA in US DoD regions (US DoD Central and US DoD East):

- [API Management](https://azure.microsoft.com/services/api-management/)
- [Application Gateway](https://azure.microsoft.com/services/application-gateway/)
- [Microsoft Entra ID (Free](../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses)
- [Microsoft Entra ID (P1 + P2)](../active-directory/fundamentals/active-directory-whatis.md#what-are-the-azure-ad-licenses)
- [Azure Analysis Services](https://azure.microsoft.com/services/analysis-services/)
- [Azure Backup](https://azure.microsoft.com/services/backup/)
- [Azure Cache for Redis](https://azure.microsoft.com/services/cache/)
- [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/)
- [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/)
- [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/)
- [Azure DNS](https://azure.microsoft.com/services/dns/)
- [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/)
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
- [Azure Scheduler](../scheduler/index.yml) (replaced by [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/))
- [Azure Service Fabric](https://azure.microsoft.com/services/service-fabric/)
- [Azure Service Manager (RDFE)](/previous-versions/azure/ee460799(v=azure.100))
- [Azure Site Recovery](https://azure.microsoft.com/services/site-recovery/)
- [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database/)
- [Azure Synapse Analytics](https://azure.microsoft.com/services/synapse-analytics/)
- [Batch](https://azure.microsoft.com/services/batch/)
- [Dynamics 365 Customer Engagement](/dynamics365/admin/admin-guide)
- [Event Grid](https://azure.microsoft.com/services/event-grid/)
- [Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [Import/Export](https://azure.microsoft.com/services/storage/import-export/)
- [Key Vault](https://azure.microsoft.com/services/key-vault/)
- [Load Balancer](https://azure.microsoft.com/services/load-balancer/)
- [Microsoft Azure portal](https://azure.microsoft.com/features/azure-portal/)
- [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) (formerly Microsoft Defender Advanced Threat Protection)
- [Microsoft Graph](/graph/overview)
- [Microsoft Stream](/stream/overview)
- [Network Watcher](https://azure.microsoft.com/services/network-watcher/)
- [Power Apps](/powerapps/powerapps-overview)
- [Power Apps portal](https://powerapps.microsoft.com/portals/)
- [Power Automate](/power-automate/getting-started) (formerly Microsoft Flow)
- [Power BI](https://powerbi.microsoft.com/)
- [Power BI Embedded](https://azure.microsoft.com/services/power-bi-embedded/)
- [Service Bus](https://azure.microsoft.com/services/service-bus/)
- [SQL Server Stretch Database](https://azure.microsoft.com/services/sql-server-stretch-database/)
- [Storage: Blobs](https://azure.microsoft.com/services/storage/blobs/) (incl. [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md))
- [Storage: Disks](https://azure.microsoft.com/services/storage/disks/) (incl. [managed disks](../virtual-machines/managed-disks-overview.md))
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

### What are the US DoD regions?
Azure Government regions US DoD Central and US DoD East (US DoD regions) are physically separated Azure Government regions reserved for exclusive use by the DoD. They reside on the same isolated network as Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia (US Gov regions) and use the same identity model. Both the network and identity model are separate from Azure commercial.

### What is the difference between US Gov regions and US DoD regions?
Azure Government is a US government community cloud providing services for federal, state and local government customers, tribal entities, and other entities subject to various US government regulations such as CJIS, ITAR, and others. All Azure Government regions are designed to meet the security requirements for DoD IL5 workloads. They're deployed on a separate and isolated network and use a separate identity model from Azure commercial regions. US DoD regions achieve DoD IL5 tenant separation requirements by being dedicated exclusively to DoD. In US Gov regions, some services require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

### How do US Gov regions support IL5 data?
Azure provides [extensive support for tenant isolation](./azure-secure-isolation-guidance.md) across compute, storage, and networking services to segregate each customer's applications and data. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications. Some Azure services deployed in US Gov regions require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).

### What is IL5 data?
IL5 accommodates controlled unclassified information (CUI) that requires a higher level of protection than is afforded by IL4 as deemed necessary by the information owner, public law, or other government regulations. IL5 also supports unclassified National Security Systems (NSS). This impact level accommodates NSS and CUI categorizations based on CNSSI 1253 up to moderate confidentiality and moderate integrity (M-M-x). For more information on IL5 data, see [DoD IL5 overview](/azure/compliance/offerings/offering-dod-il5#dod-il5-overview).

### What is the difference between IL4 and IL5 data?
IL4 data is controlled unclassified information (CUI) that may include data subject to export control, protected health information, and other data requiring explicit CUI designation (for example, For Official Use Only, Law Enforcement Sensitive, and Sensitive Security Information).

IL5 data includes CUI that requires a higher level of protection as deemed necessary by the information owner, public law, or government regulation. IL5 data is inclusive of unclassified National Security Systems.

### Do Azure Government regions support classified data such as IL6?
No. Azure Government regions support only unclassified data up to and including IL5. In contrast, [IL6 data](/azure/compliance/offerings/offering-dod-il6) is defined as classified information up to Secret, and can be accommodated in [Azure Government Secret](https://azure.microsoft.com/global-infrastructure/government/national-security/).

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

### What services are available in Azure Government?
For service availability in Azure Government, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

### What services are part of your IL5 authorization scope?
For a complete list of services in scope for DoD IL5 PA in US Gov regions, see [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope). For a complete list of services in scope for DoD IL5 PA in US DoD regions, see [US DoD regions IL5 audit scope](#us-dod-regions-il5-audit-scope) in this article.

## Next steps

- [Acquiring and accessing Azure Government](https://azure.microsoft.com/offers/azure-government/)
- [How to buy Azure Government](https://azure.microsoft.com/global-infrastructure/government/how-to-buy/)
- [Get started with Azure Government](./documentation-government-get-started-connect-with-portal.md)
- [Azure Government Blog](https://devblogs.microsoft.com/azuregov/)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)
- [Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [DoD Impact Level 4](/azure/compliance/offerings/offering-dod-il4)
- [DoD Impact Level 5](/azure/compliance/offerings/offering-dod-il5)
- [DoD Impact Level 6](/azure/compliance/offerings/offering-dod-il6)
