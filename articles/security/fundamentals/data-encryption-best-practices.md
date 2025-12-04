---
title: Data security and encryption best practices - Microsoft Azure
description: This article provides a set of best practices for data security and encryption using built in Azure capabilities.
services: security
author: msmbaldwin

ms.assetid: 17ba67ad-e5cd-4a8f-b435-5218df753ca4
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 10/22/2025
ms.author: mbaldwin

---
# Azure data security and encryption best practices
This article describes best practices for data security and encryption.

The best practices are based on a consensus of opinion, and they work with current Azure platform capabilities and feature sets. Opinions and technologies change over time and this article is updated on a regular basis to reflect those changes.

## Protect data
To help protect data in the cloud, you need to account for the possible states in which your data can occur, and what controls are available for that state. Best practices for Azure data security and encryption relate to the following data states:

- At rest: This includes all information storage objects, containers, and types that exist statically on physical media, whether magnetic or optical disk.
- In transit: When data is being transferred between components, locations, or programs, it's in transit. Examples are transfer over the network, across a service bus (from on-premises to cloud and vice-versa, including hybrid connections such as ExpressRoute), or during an input/output process.
- In Use: When data is being processed, the specialized AMD & Intel chipset based Confidential compute VMs keep the data encrypted in memory using hardware managed keys.

## Choose a key management solution

Protecting your keys is essential to protecting your data in the cloud.

Azure offers several different services to protect your cryptographic keys using HSMs. These offerings provide cloud scalability and availability while giving you complete control over your keys. For more information and guidance on choosing among these key management offerings, see [How to choose the right Azure key management solution](key-management-choose.md). [Azure Key Vault Premium](/azure/key-vault/general/overview) or [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) are recommended for managing your encryption at rest keys.

## Manage with secure workstations

> [!NOTE]
> The subscription administrator or owner should use a secure access workstation or a privileged access workstation.

Because the vast majority of attacks target the end user, the endpoint becomes one of the primary points of attack. An attacker who compromises the endpoint can use the user's credentials to gain access to the organization's data. Most endpoint attacks take advantage of the fact that users are administrators in their local workstations.

**Best practice**: Use a secure management workstation to protect sensitive accounts, tasks, and data.
**Detail**: Use a [privileged access workstation](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) to reduce the attack surface in workstations. These secure management workstations can help you mitigate some of these attacks and ensure that your data is safer.

**Best practice**: Ensure endpoint protection.
**Detail**: Enforce security policies across all devices that are used to consume data, regardless of the data location (cloud or on-premises).

## Protect data at rest

[Data encryption at rest](encryption-atrest.md) is a mandatory step toward data privacy, compliance, and data sovereignty.

**Best practice**: Apply encryption at host to help safeguard your data.
**Detail**: Use [Encryption at host - End-to-end encryption for your VM](/azure/virtual-machines/disk-encryption#encryption-at-host---end-to-end-encryption-for-your-vm-data). Encryption at host is a Virtual Machine option that enhances Azure Disk Storage Server-Side Encryption to ensure that all temp disks and disk caches are encrypted at rest and flow encrypted to the Storage clusters..

Most Azure services, such as Azure Storage and Azure SQL Database, encrypt data at rest by default. You can use Azure Key Vault to maintain control of keys that access and encrypt your data. See [Azure resource providers encryption model support to learn more](encryption-atrest.md#azure-resource-providers-encryption-model-support).

**Best practices**: Use encryption to help mitigate risks related to unauthorized data access.
**Detail**: Encrypt encryption on your services before you write sensitive data to them.

Organizations that don't enforce data encryption are more exposed to data-confidentiality issues. Companies also must prove that they are diligent and using correct security controls to enhance their data security in order to comply with industry regulations.

## Protect data in transit

Protecting data in transit should be an essential part of your data protection strategy. Because data is moving back and forth from many locations, we generally recommend that you always use SSL/TLS protocols to exchange data across different locations. In some circumstances, you might want to isolate the entire communication channel between your on-premises and cloud infrastructures by using a VPN.

For data moving between your on-premises infrastructure and Azure, consider appropriate safeguards such as HTTPS or VPN. When sending encrypted traffic between an Azure virtual network and an on-premises location over the public internet, use [Azure VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md).

Following are best practices specific to using Azure VPN Gateway, SSL/TLS, and HTTPS.

**Best practice**: Secure access from multiple workstations located on-premises to an Azure virtual network.
**Detail**: Use [site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md).

**Best practice**: Secure access from an individual workstation located on-premises to an Azure virtual network.
**Detail**: Use [point-to-site VPN](../../vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal.md).

**Best practice**: Move larger data sets over a dedicated high-speed WAN link.
**Detail**: Use [ExpressRoute](../../expressroute/expressroute-introduction.md). If you choose to use ExpressRoute, you can also encrypt the data at the application level by using SSL/TLS or other protocols for added protection.

**Best practice**: Interact with Azure Storage through the Azure portal.
**Detail**: All transactions occur via HTTPS. You can also use [Storage REST API](/rest/api/storageservices/) over HTTPS to interact with [Azure Storage](../../storage/common/storage-introduction.md).

Organizations that fail to protect data in transit are more susceptible to [man-in-the-middle attacks](/previous-versions/office/skype-server-2010/gg195821(v=ocs.14)), [eavesdropping](/previous-versions/office/skype-server-2010/gg195641(v=ocs.14)), and session hijacking. These attacks can be the first step in gaining access to confidential data.

## Protect data in use

**Lessen the need for trust**
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.
- App software vendors: Trust software by deploying on-premises, using open-source, or by building in-house application software.
- Hardware vendors: Trust hardware by using on-premises hardware or in-house hardware.
- Infrastructure providers: Trust cloud providers or manage your own on-premises data centers.

**Reducing the attack surface**
The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

Azure confidential computing can help you:

- Prevent unauthorized access: Run sensitive data in the cloud. Trust that Azure provides the best data protection possible, with little to no change from what gets done today.
- Meet regulatory compliance: Migrate to the cloud and keep full control of data to satisfy government regulations for protecting personal information and secure organizational IP.
- Ensure secure and untrusted collaboration: Tackle industry-wide work-scale problems by combing data across organizations, even competitors, to unlock broad data analytics and deeper insights.
- Isolate processing: Offer a new wave of products that remove liability on private data with blind processing. User data can't even be retrieved by the service provider.

Learn more about [Confidential computing](/azure/confidential-computing/).

## Secure email, documents, and sensitive data

You want to control and secure email, documents, and sensitive data that you share outside your company. [Azure Information Protection](/azure/information-protection/what-is-information-protection) is a cloud-based solution that helps an organization to classify, label, and protect its documents and emails. This can be done automatically by administrators who define rules and conditions, manually by users, or a combination where users get recommendations.

Classification is identifiable at all times, regardless of where the data is stored or with whom it's shared. The labels include visual markings such as a header, footer, or watermark. Metadata is added to files and email headers in clear text. The clear text ensures that other services, such as solutions to prevent data loss, can identify the classification and take appropriate action.

The protection technology uses Azure Rights Management (Azure RMS). This technology is integrated with other Microsoft cloud services and applications, such as Microsoft 365 and Microsoft Entra ID. This protection technology uses encryption, identity, and authorization policies. Protection that is applied through Azure RMS stays with the documents and emails, independently of the location-inside or outside your organization, networks, file servers, and applications.

This information protection solution keeps you in control of your data, even when it's shared with other people. You can also use Azure RMS with your own line-of-business applications and information protection solutions from software vendors, whether these applications and solutions are on-premises or in the cloud.

We recommend that you:

- [Deploy Azure Information Protection](/azure/information-protection/deployment-roadmap) for your organization.
- Apply labels that reflect your business requirements. For example: Apply a label named "highly confidential" to all documents and emails that contain top-secret data, to classify and protect this data. Then, only authorized users can access this data, with any restrictions that you specify.
- Configure [usage logging for Azure RMS](/azure/information-protection/log-analyze-usage) so that you can monitor how your organization is using the protection service.

Organizations that are weak on [data classification](https://download.microsoft.com/download/0/A/3/0A3BE969-85C5-4DD2-83B6-366AA71D1FE3/Data-Classification-for-Cloud-Readiness.pdf) and file protection might be more susceptible to data leakage or data misuse. With proper file protection, you can analyze data flows to gain insight into your business, detect risky behaviors and take corrective measures, track access to documents, and so on.

## Next steps

See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:
* [Azure Security Team Blog](/archive/blogs/azuresecurity/) - for up to date information on the latest in Azure Security
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com
