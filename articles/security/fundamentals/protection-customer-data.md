---
title: Protection of customer data in Azure
description: Learn how Azure protects customer data through data segregation, data redundancy, and data destruction.
services: security
author: msmbaldwin
ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/12/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Azure customer data protection
By default, Microsoft operations and support personnel can't access customer data. When they need access to data related to a support case, they use a just-in-time (JIT) model and policies that Microsoft audits and vets against its compliance and privacy policies. The following Azure Security Policy establishes the access-control requirements:

- No access to customer data, by default.
- No user or administrator accounts on customer virtual machines (VMs).
- Grant the least privilege required to complete the task. Audit and log access requests.

Microsoft assigns unique corporate Active Directory accounts to Azure support personnel. Azure relies on Microsoft corporate Active Directory, managed by Microsoft Information Technology (MSIT), to control access to key information systems. Azure requires multifactor authentication and grants access only from secure consoles.

## Data protection
Azure provides customers with strong data security, both by default and as customer options.

**Data segregation**: Azure is a multitenant service, which means that multiple customer deployments and VMs are stored on the same physical hardware. Azure uses logical isolation to segregate each customer’s data from the data of others. Segregation provides the scale and economic benefits of multitenant services while rigorously preventing customers from accessing one another’s data.

**At-rest data protection**: You're responsible for ensuring that data stored in Azure is encrypted according to your standards. Azure offers a wide range of encryption capabilities, so you can choose the solution that best meets your needs. Azure Key Vault helps you maintain control of keys that cloud applications and services use to encrypt data. Azure Disk Encryption enables you to encrypt VMs. Azure Storage Service Encryption makes it possible to encrypt all data placed into your storage account.

**In-transit data protection**: Microsoft provides many options that you can use to secure data in transit internally within the Azure network and externally across the Internet to the end user. These options include communication through virtual private networks (by using IPsec/IKE encryption), Transport Layer Security (TLS) 1.2 or later (through Azure components such as Application Gateway or Azure Front Door), protocols directly on the Azure virtual machines (such as Windows IPsec or SMB), and more.

Additionally, Azure enables **encryption by default** by using MACsec (an IEEE standard at the data-link layer) for all Azure traffic traveling between Azure datacenters to ensure confidentiality and integrity of customer data.

**Data redundancy**: Microsoft helps ensure that data is protected if there's a cyberattack or physical damage to a datacenter. You can choose:

- In-country/region storage for compliance or latency considerations.
- Out-of-country/region storage for security or disaster recovery purposes.

You can replicate data within a selected geographic area for redundancy, but you can't transmit it outside that area. You have multiple options for replicating data, including the number of copies and the number and location of replication datacenters.

When you create your storage account, select one of the following replication options:

- **Locally redundant storage (LRS)**: Locally redundant storage maintains three copies of your data. LRS is replicated three times within a single facility in a single region. LRS protects your data from normal hardware failures, but not from a failure of a single facility.
- **Zone-redundant storage (ZRS)**: Zone-redundant storage maintains three copies of your data. ZRS is replicated three times across two to three facilities to provide higher durability than LRS. Replication occurs within a single region or across two regions. ZRS helps ensure that your data is durable within a single region.
- **Geo-redundant storage (GRS)**: Geo-redundant storage is enabled for your storage account by default when you create it. GRS maintains six copies of your data. With GRS, your data is replicated three times within the primary region. Your data is also replicated three times in a secondary region hundreds of miles away from the primary region, providing the highest level of durability. If a failure occurs in the primary region, Azure Storage fails over to the secondary region. GRS helps ensure that your data is durable in two separate regions.

**Data destruction**: When customers delete data or leave Azure, Microsoft follows strict standards for deleting data and the physical destruction of decommissioned hardware. Microsoft executes a complete deletion of data on customer request and on contract termination. For more information, see [Data management at Microsoft](https://www.microsoft.com/trust-center/privacy/data-management).

## Customer data ownership
Microsoft doesn't inspect, approve, or monitor applications that customers deploy to Azure. Moreover, Microsoft doesn't know what kind of data customers choose to store in Azure. Microsoft doesn't claim data ownership over the customer information entered into Azure.

## Records management
Azure established internal records-retention requirements for back-end data. Customers are responsible for identifying their own record retention requirements. For records that are stored in Azure, customers are responsible for extracting their data and retaining their content outside of Azure for a customer-specified retention period.

Azure allows customers to export data and audit reports from the product. The exports are saved locally to retain the information for a customer-defined retention time period.

## Electronic discovery (e-discovery)
You're responsible for complying with e-discovery requirements in your use of Azure services. If you must preserve your customer data, export and save the data locally. You can also request exports of your data from the Azure Customer Support department. In addition to enabling you to export your data, Azure conducts extensive logging and monitoring internally.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure information system components and boundaries](infrastructure-components.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure production operations and management](infrastructure-operations.md)
- [Azure infrastructure monitoring](infrastructure-monitoring.md)
- [Azure infrastructure integrity](infrastructure-integrity.md)
