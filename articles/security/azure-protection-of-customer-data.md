---
title: Protection of customer data in Azure
description: This article addresses how Azure protects customer data.
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

# Protection of customer data in Azure   
Access to customer data by Microsoft operations and support personnel is denied by default. When access to customer data is granted, leadership approval is required and then access is carefully managed and logged. The access control requirements are established by the following Microsoft Azure Security Policy:

- No access to customer data by default
- No user or administrator accounts on customer VMs
- Grant least privilege required to complete task; audit and log access requests

Microsoft Azure support personnel are assigned unique Corporate AD accounts by Microsoft as part of the standard new employee onboarding process. Microsoft Azure relies on Microsoft Corporate Active Directory, managed by MSIT, to control access to key information systems. Multi-factor authentication is required, and access is only granted from secure consoles.

All access attempts are monitored and can be displayed via a basic set of reports.

## Data protection
Azure provides customers with strong data security – both by default and as customer options.

**Data segregation** - Azure is a multi-tenant service, meaning that multiple customers’ deployments and virtual machines are stored on the same physical hardware. Azure uses logical isolation to segregate each customer’s data from that of others. This provides the scale and economic benefits of multitenant services while rigorously preventing customers from accessing one another’s data.

**At-rest data protection** - Customers are responsible for ensuring that data stored in Azure is encrypted in accordance with their standards. Azure offers a wide range of encryption capabilities, giving customers the flexibility to choose the solution that best meets their needs. Azure Key Vault helps customers easily and cost effectively maintain control of keys used by cloud applications and services to encrypt data. Azure Disk Encryption enables customers to encrypt virtual machines. Azure Storage Service Encryption makes it possible to encrypt all data placed into a customer's storage account.

**In-transit data protection** - Customers can enable encryption for traffic between their own VMs and end users. Azure protects data in transit to or from outside components, as well as data in transit internally, such as between two virtual networks. Azure uses the industry-standard Transport Layer Security (TLS) 1.2 or above or above protocol with 2048-bit RSA/SHA256 encryption keys, as recommended by CESG/NCSC, to encrypt communications both between the customer and the cloud, and internally between Azure systems and datacenters.

**Encryption** - Encryption of data in storage and in transit can be deployed by customers to align with best practices for ensuring confidentiality and integrity of data. It is straightforward for customers to configure their Azure cloud services to use SSL to protect communications from the Internet and even between their Azure hosted VMs.

**Data redundancy** - Microsoft ensures data is protected in the event of a cyberattack or physical damage to a datacenter. Customers may opt for in-country storage for compliance or latency considerations or out-of-country storage for security or disaster recovery purposes. Data may be replicated within a selected geographic area for redundancy but will not be transmitted outside it. Customers have multiple options for replicating data, including number of copies and number and location of replication datacenters.

When you create your storage account, you must select one of the following replication options:

- Locally redundant storage (LRS). Locally redundant storage maintains three copies of your data. LRS is replicated three times within a single facility in a single region. LRS protects your data from normal hardware failures, but not from the failure of a single facility.
- Zone-redundant storage (ZRS). Zone-redundant storage maintains three copies of your data. ZRS is replicated three times across two to three facilities, either within a single region or across two regions, providing higher durability than LRS. ZRS ensures that your data is durable within a single region.
- Geo-redundant storage (GRS). Geo-redundant storage is enabled for your storage account by default when you create it. GRS maintains six copies of your data. With GRS, your data is replicated three times within the primary region, and is also replicated three times in a secondary region hundreds of miles away from the primary region, providing the highest level of durability. In the event of a failure at the primary region, Azure Storage will failover to the secondary region. GRS ensures that your data is durable in two separate regions.

**Data destruction** - When customers delete data or leave Azure, Microsoft follows strict standards for overwriting storage resources before reuse, as well as physical destruction of decommissioned hardware. Microsoft executes a complete deletion of data on customer request and on contract termination.

## Customer data ownership
Microsoft does not inspect, approve, or monitor applications that customers deploy to Azure. Moreover, Microsoft does not know what kind of data customers choose to store in Azure. Microsoft does not claim data ownership over the customer information entered into Azure.

## Records management
Azure has established internal records retention requirements for backend data. Customers are responsible for identifying their own record retention requirements. For records stored in Azure, the customer is responsible for extracting their data and retaining the content outside of Azure for a customer-specified retention period.

Azure provides the customer the ability to export data and audit reports from the product and save the exports locally to retain the information for a customer-defined retention time period.

## Electronic discovery (e-discovery)
Azure customers are responsible for complying with e-discovery requirements in their use of Azure services. If an Azure customer must preserve their customer data, they may export and save the data locally. Additionally, customers can request exports of their data from Azure Customer Support department. In addition to allowing customers to export their data, Azure conducts extensive logging and monitoring internally.




## Next steps
