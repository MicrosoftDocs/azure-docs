---
title: Data security and encryption best practices - Microsoft Azure
description: This article provides a set of best practices for data security and encryption using built in Azure capabilities.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin
editor: TomSh

ms.assetid: 17ba67ad-e5cd-4a8f-b435-5218df753ca4
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/09/2020
ms.author: terrylan

---
# Azure data security and encryption best practices
This article describes best practices for data security and encryption.

The best practices are based on a consensus of opinion, and they work with current Azure platform capabilities and feature sets. Opinions and technologies change over time and this article is updated on a regular basis to reflect those changes.

## Protect data
To help protect data in the cloud, you need to account for the possible states in which your data can occur, and what controls are available for that state. Best practices for Azure data security and encryption relate to the following data states:

- At rest: This includes all information storage objects, containers, and types that exist statically on physical media, whether magnetic or optical disk.
- In transit: When data is being transferred between components, locations, or programs, it’s in transit. Examples are transfer over the network, across a service bus (from on-premises to cloud and vice-versa, including hybrid connections such as ExpressRoute), or during an input/output process.

## Choose a key management solution

Protecting your keys is essential to protecting your data in the cloud.

[Azure Key Vault](/azure/key-vault/key-vault-overview) helps safeguard cryptographic keys and secrets that cloud applications and services use. Key Vault streamlines the key management process and enables you to maintain control of keys that access and encrypt your data. Developers can create keys for development and testing in minutes, and then migrate them to production keys. Security administrators can grant (and revoke) permission to keys, as needed.

You can use Key Vault to create multiple secure containers, called vaults. These vaults are backed by HSMs. Vaults help reduce the chances of accidental loss of security information by centralizing the storage of application secrets. Key vaults also control and log the access to anything stored in them. Azure Key Vault can handle requesting and renewing Transport Layer Security (TLS) certificates. It provides features for a robust solution for certificate lifecycle management.

Azure Key Vault is designed to support application keys and secrets. Key Vault is not intended to be a store for user passwords.

Following are security best practices for using Key Vault.

**Best practice**: Grant access to users, groups, and applications at a specific scope.   
**Detail**: Use RBAC’s predefined roles. For example, to grant access to a user to manage key vaults, you would assign the predefined role [Key Vault Contributor](/azure/role-based-access-control/built-in-roles) to this user at a specific scope. The scope in this case would be a subscription, a resource group, or just a specific key vault. If the predefined roles don’t fit your needs, you can [define your own roles](/azure/role-based-access-control/custom-roles).

**Best practice**: Control what users have access to.   
**Detail**: Access to a key vault is controlled through two separate interfaces: management plane and data plane. The management plane and data plane access controls work independently.

Use RBAC to control what users have access to. For example, if you want to grant an application access to use keys in a key vault, you only need to grant data plane access permissions by using key vault access policies, and no management plane access is needed for this application. Conversely, if you want a user to be able to read vault properties and tags but not have any access to keys, secrets, or certificates, you can grant this user read access by using RBAC, and no access to the data plane is required.

**Best practice**: Store certificates in your key vault. Your certificates are of high value. In the wrong hands, your application's security or the security of your data can be compromised.   
**Detail**: Azure Resource Manager can securely deploy certificates stored in Azure Key Vault to Azure VMs when the VMs are deployed. By setting appropriate access policies for the key vault, you also control who gets access to your certificate. Another benefit is that you manage all your certificates in one place in Azure Key Vault. See [Deploy Certificates to VMs from customer-managed Key Vault](https://blogs.technet.microsoft.com/kv/2016/09/14/updated-deploy-certificates-to-vms-from-customer-managed-key-vault/) for more information.

**Best practice**: Ensure that you can recover a deletion of key vaults or key vault objects.   
**Detail**: Deletion of key vaults or key vault objects can be inadvertent or malicious. Enable the soft delete and purge protection features of Key Vault, particularly for keys that are used to encrypt data at rest. Deletion of these keys is equivalent to data loss, so you can recover deleted vaults and vault objects if needed. Practice Key Vault recovery operations on a regular basis.

> [!NOTE]
> If a user has contributor permissions (RBAC) to a key vault management plane, they can grant themselves access to the data plane by setting a key vault access policy. We recommend that you tightly control who has contributor access to your key vaults, to ensure that only authorized persons can access and manage your key vaults, keys, secrets, and certificates.
>
>

## Manage with secure workstations

> [!NOTE]
> The subscription administrator or owner should use a secure access workstation or a privileged access workstation.
>
>

Because the vast majority of attacks target the end user, the endpoint becomes one of the primary points of attack. An attacker who compromises the endpoint can use the user’s credentials to gain access to the organization’s data. Most endpoint attacks take advantage of the fact that users are administrators in their local workstations.

**Best practice**: Use a secure management workstation to protect sensitive accounts, tasks, and data.   
**Detail**: Use a [privileged access workstation](https://technet.microsoft.com/library/mt634654.aspx) to reduce the attack surface in workstations. These secure management workstations can help you mitigate some of these attacks and ensure that your data is safer.

**Best practice**: Ensure endpoint protection.   
**Detail**: Enforce security policies across all devices that are used to consume data, regardless of the data location (cloud or on-premises).

## Protect data at rest

[Data encryption at rest](https://cloudblogs.microsoft.com/microsoftsecure/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step toward data privacy, compliance, and data sovereignty.

**Best practice**: Apply disk encryption to help safeguard your data.   
**Detail**: Use [Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview). It enables IT administrators to encrypt Windows and Linux IaaS VM disks. Disk Encryption combines the industry-standard Windows BitLocker feature and the Linux dm-crypt feature to provide volume encryption for the OS and the data disks.

Azure Storage and Azure SQL Database encrypt data at rest by default, and many services offer encryption as an option. You can use Azure Key Vault to maintain control of keys that access and encrypt your data. See [Azure resource providers encryption model support to learn more](encryption-atrest.md#azure-resource-providers-encryption-model-support).

**Best practices**: Use encryption to help mitigate risks related to unauthorized data access.   
**Detail**: Encrypt your drives before you write sensitive data to them.

Organizations that don’t enforce data encryption are more exposed to data-confidentiality issues. For example, unauthorized or rogue users might steal data in compromised accounts or gain unauthorized access to data coded in Clear Format. Companies also must prove that they are diligent and using correct security controls to enhance their data security in order to comply with industry regulations.

## Protect data in transit

Protecting data in transit should be an essential part of your data protection strategy. Because data is moving back and forth from many locations, we generally recommend that you always use SSL/TLS protocols to exchange data across different locations. In some circumstances, you might want to isolate the entire communication channel between your on-premises and cloud infrastructures by using a VPN.

For data moving between your on-premises infrastructure and Azure, consider appropriate safeguards such as HTTPS or VPN. When sending encrypted traffic between an Azure virtual network and an on-premises location over the public internet, use [Azure VPN Gateway](../../vpn-gateway/index.yml).

Following are best practices specific to using Azure VPN Gateway, SSL/TLS, and HTTPS.

**Best practice**: Secure access from multiple workstations located on-premises to an Azure virtual network.   
**Detail**: Use [site-to-site VPN](/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal).

**Best practice**: Secure access from an individual workstation located on-premises to an Azure virtual network.   
**Detail**: Use [point-to-site VPN](/azure/vpn-gateway/vpn-gateway-point-to-site-create).

**Best practice**: Move larger data sets over a dedicated high-speed WAN link.   
**Detail**: Use [ExpressRoute](/azure/expressroute/expressroute-introduction). If you choose to use ExpressRoute, you can also encrypt the data at the application level by using SSL/TLS or other protocols for added protection.

**Best practice**: Interact with Azure Storage through the Azure portal.   
**Detail**: All transactions occur via HTTPS. You can also use [Storage REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx) over HTTPS to interact with [Azure Storage](https://azure.microsoft.com/services/storage/).

Organizations that fail to protect data in transit are more susceptible to [man-in-the-middle attacks](https://technet.microsoft.com/library/gg195821.aspx), [eavesdropping](https://technet.microsoft.com/library/gg195641.aspx), and session hijacking. These attacks can be the first step in gaining access to confidential data.

## Secure email, documents, and sensitive data

You want to control and secure email, documents, and sensitive data that you share outside your company. [Azure Information Protection](/azure/information-protection/) is a cloud-based solution that helps an organization to classify, label, and protect its documents and emails. This can be done automatically by administrators who define rules and conditions, manually by users, or a combination where users get recommendations.

Classification is identifiable at all times, regardless of where the data is stored or with whom it’s shared. The labels include visual markings such as a header, footer, or watermark. Metadata is added to files and email headers in clear text. The clear text ensures that other services, such as solutions to prevent data loss, can identify the classification and take appropriate action.

The protection technology uses Azure Rights Management (Azure RMS). This technology is integrated with other Microsoft cloud services and applications, such as Office 365 and Azure Active Directory. This protection technology uses encryption, identity, and authorization policies. Protection that is applied through Azure RMS stays with the documents and emails, independently of the location—inside or outside your organization, networks, file servers, and applications.

This information protection solution keeps you in control of your data, even when it’s shared with other people. You can also use Azure RMS with your own line-of-business applications and information protection solutions from software vendors, whether these applications and solutions are on-premises or in the cloud.

We recommend that you:

- [Deploy Azure Information Protection](/azure/information-protection/deployment-roadmap) for your organization.
- Apply labels that reflect your business requirements. For example: Apply a label named “highly confidential” to all documents and emails that contain top-secret data, to classify and protect this data. Then, only authorized users can access this data, with any restrictions that you specify.
- Configure [usage logging for Azure RMS](/azure/information-protection/log-analyze-usage) so that you can monitor how your organization is using the protection service.

Organizations that are weak on [data classification](https://download.microsoft.com/download/0/A/3/0A3BE969-85C5-4DD2-83B6-366AA71D1FE3/Data-Classification-for-Cloud-Readiness.pdf) and file protection might be more susceptible to data leakage or data misuse. With proper file protection, you can analyze data flows to gain insight into your business, detect risky behaviors and take corrective measures, track access to documents, and so on.

## Next steps

See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:
* [Azure Security Team Blog](https://blogs.msdn.microsoft.com/azuresecurity/) - for up to date information on the latest in Azure Security
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com
