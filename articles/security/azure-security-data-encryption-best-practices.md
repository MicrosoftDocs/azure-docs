<properties
   pageTitle="Data Security and Encryption Best Practices | Microsoft Azure"
   description="This article provides a set of best practices for data security and encryption using built in Azure capabilities."
   services="security"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/26/2016"
   ms.author="yuridio"/>

#Azure Data Security and Encryption Best Practices

One of the keys to data protection in the cloud is accounting for the possible states in which your data may occur, and what controls are available for that state. For the purpose of Azure data security and encryption best practices the recommendations will be around the following data’s states:

- At-rest: This includes all information storage objects, containers, and types that exist statically on physical media, be it magnetic or optical disk.

- In-Transit: When data is being transferred between components, locations or programs, such as over the network, across a service bus (from on-premises to cloud and vice-versa, including hybrid connections such as ExpressRoute), or during an input/output process, it is thought of as being in-motion.

In this article we will discuss a collection of Azure data security and encryption best practices. These best practices are derived from our experience with Azure data security and encryption and the experiences of customers like yourself.

For each best practice, we’ll explain:

- What the best practice is
- Why you want to enable that best practice
- What might be the result if you fail to enable the best practice
- Possible alternatives to the best practice
- How you can learn to enable the best practice

This Azure Data Security and Encryption Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure data security and encryption best practices discussed in this article include:

- Enforce multi-factor authentication
- Use role based access control (RBAC)
- Encrypt Azure virtual machines
- Use hardware security models
- Manage with Secure Workstations
- Enable SQL data encryption
- Protect data in transit
- Enforce file level data encryption


## Enforce Multi-factor Authentication

The first step in data access and control in Microsoft Azure is to authenticate the user. [Azure Multi-Factor Authentication (MFA)](../multi-factor-authentication/multi-factor-authentication.md) is a method of verifying user’s identity by using another method than just a username and password. This authentication method helps safeguard access to data and applications while meeting user demand for a simple sign-in process.

By enabling Azure MFA for your users, you are adding a second layer of security to user sign-ins and transactions. In this case, a transaction might be accessing a document located in a file server or in your SharePoint Online. Azure MFA also helps IT to reduce the likelihood that a compromised credential will have access to organization’s data.

For example: if you enforce Azure MFA for your users and configure it to use a phone call or text message as verification, if the user’s credential is compromised, the attacker won’t be able to access any resource since he will not have access to user’s phone. Organizations that do not add this extra layer of identity protection are more susceptible for credential theft attack, which may lead to data compromise.

One alternative for organizations that want to keep the authentication control on-premises is to use [Azure Multi-Factor Authentication Server](../multi-factor-authentication/multi-factor-authentication-get-started-server.md), also called MFA on-premises. By using this method you will still be able to enforce multi-factor authentication, while keeping the MFA server on-premises.

For more information on Azure MFA, please read the article [Getting started with Azure Multi-Factor Authentication in the cloud](../multi-factor-authentication/multi-factor-authentication-get-started-cloud.md).

## Use Role Based Access Control (RBAC)
Restrict access based on the [need to know](https://en.wikipedia.org/wiki/Need_to_know) and [least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) security principles. This is imperative for organizations that want to enforce security policies for data access. Azure Role-Based Access Control (RBAC) can be used to assign permissions to users, groups, and applications at a certain scope. The scope of a role assignment can be a subscription, a resource group, or a single resource.

You can leverage [built-in RBAC roles](../active-directory/role-based-access-built-in-roles.md) in Azure to assign privileges to users. Consider using *Storage Account Contributor* for cloud operators that need to manage storage accounts and *Classic Storage Account Contributor* role to manage classic storage accounts. For cloud operators that needs to manage VMs and storage account, consider adding them to *Virtual Machine Contributor* role.

Organizations that do not enforce data access control by leveraging capabilities such as RBAC may be giving more privileges than necessary for their users. This can lead to data compromise by having some users having access to data that they shouldn’t have in the first place.

You can learn more about Azure RBAC by reading the article [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md).

## Encrypt Azure Virtual Machines
For many organizations, [data encryption at rest](https://blogs.microsoft.com/cybertrust/2015/09/10/cloud-security-controls-series-encrypting-data-at-rest/) is a mandatory step towards data privacy, compliance and data sovereignty. Azure Disk Encryption enables IT administrators to encrypt Windows and Linux IaaS Virtual Machine (VM) disks. Azure Disk Encryption leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide volume encryption for the OS and the data disks.

You can leverage Azure Disk Encryption to help protect and safeguard your data to meet your organizational security and compliance requirements. Organizations should also consider using encryption to help mitigate risks related to unauthorized data access. It is also recommended that you encrypt drives prior to writing sensitive data to them.

Make sure to encrypt your VM’s data volumes and boot volume in order to protect data at rest in your Azure storage account. Safeguard the encryption keys and secrets by leveraging [Azure Key Vault](../key-vault/key-vault-whatis.md).

For your on-premises Windows Servers, consider the following encryption best practices:

- Use [BitLocker](https://technet.microsoft.com/library/dn306081.aspx) for data encryption
- Store recovery information in AD DS.
- If there is any concern that BitLocker keys have been compromised, we recommend that you either format the drive to remove all instances of the BitLocker metadata from the drive or that you decrypt and encrypt the entire drive again.

Organizations that do not enforce data encryption are more likely to be exposed to data integrity issues, such as malicious or rogue users stealing data and compromised accounts gaining unauthorized access to data in clear format. Besides these risks, companies that have to comply with industry regulations, must prove that they are diligent and are using the correct security controls to enhance data security.

You can learn more about Azure Disk Encryption by reading the article [Azure Disk Encryption for Windows and Linux IaaS VMs](azure-security-disk-encryption.md).

## Use Hardware Security Modules

Industry encryption solutions use secret keys to encrypt data. Therefore, it is critical that these keys are safely stored. Key management becomes an integral part of data protection, since it will be leveraged to store secret keys that are used to encrypt data.

Azure disk encryption uses [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) to help you control and manage disk encryption keys and secrets in your key vault subscription, while ensuring that all data in the virtual machine disks are encrypted at rest in your Azure storage. You should use Azure Key Vault to audit keys and policy usage.

There are many inherent risks related to not having appropriate security controls in place to protect the secret keys that were used to encrypt your data. If attackers have access to the secret keys, they will be able to decrypt the data and potentially have access to confidential information.

You can learn more about general recommendations for certificate management in Azure by reading the article [Certificate Management in Azure: Do’s and Don’ts](https://blogs.msdn.microsoft.com/azuresecurity/2015/07/13/certificate-management-in-azure-dos-and-donts/).

For more information about Azure Key Vault, read [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md).

## Manage with Secure Workstations

Since the vast majority of the attacks target the end user, the endpoint becomes one of the primary points of attack. If an attacker compromises the endpoint, he can leverage the user’s credentials to gain access to organization’s data. Most endpoint attacks are able to take advantage of the fact that end users are administrators in their local workstations.

You can reduce these risks by using a secure management workstation. We recommend that you use a [Privileged Access Workstations (PAW)](https://technet.microsoft.com/library/mt634654.aspx) to reduce the attack surface in workstations. These secure management workstations can help you mitigate some of these attacks help ensure your data is safer. Make sure to use PAW to harden and lock down your workstation. This is an important step to provide high security assurances for sensitive accounts, tasks and data protection.

Lack of endpoint protection may put your data at risk, make sure to enforce security policies across all devices that are used to consume data, regardless of the data location (cloud or on-premises).

You can learn more about privileged access workstation by reading the article [Securing Privileged Access](https://technet.microsoft.com/library/mt631194.aspx).

## Enable SQL data encryption

[Azure SQL Database transparent data encryption](https://msdn.microsoft.com/library/dn948096.aspx) (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.  TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key.

Even when the entire storage is encrypted, it is very important to also encrypt your database itself. This is an implementation of the defense in depth approach for data protection. If you are using [Azure SQL Database](https://msdn.microsoft.com/library/0bf7e8ff-1416-4923-9c4c-49341e208c62.aspx) and wish to protect sensitive data such as credit card or social security numbers, you can encrypt databases with FIPS 140-2 validated 256 bit AES encryption which meets the requirements of many industry standards (e.g., HIPAA, PCI).

It’s important to understand that files related to [buffer pool extension](https://msdn.microsoft.com/library/dn133176.aspx) (BPE) are not encrypted when a database is encrypted using TDE. You must use file system level encryption tools like BitLocker or the [Encrypting File System](https://technet.microsoft.com/library/cc700811.aspx) (EFS) for BPE related files.

Since an authorized user such as a security administrator or a database administrator can access the data even if the database is encrypted with TDE, you should also follow the recommendations below:

- SQL authentication at the database level
- Azure AD authentication using RBAC roles
- Users and applications should use separate accounts to authenticate. This way you can limit the permissions granted to users and applications and reduce the risks of malicious activity
- Implement database-level security by using fixed database roles (such as db_datareader or db_datawriter), or you can create custom roles for your application to grant explicit permissions to selected database objects

Organizations that are not using database level encryption may be more susceptible for attacks that may compromise data located in SQL databases.

You can learn more about SQL TDE encryption by reading the article [Transparent Data Encryption with Azure SQL Database](https://msdn.microsoft.com/library/0bf7e8ff-1416-4923-9c4c-49341e208c62.aspx).

## Protect data in transit

Protecting data in transit should be essential part of your data protection strategy. Since data will be moving back and forth from many locations, the general recommendation is that you always use SSL/TLS protocols to exchange data across different locations. In some circumstances, you may want to isolate the entire communication channel between your on-premises and cloud infrastructure by using a virtual private network (VPN).

For data moving between your on-premises infrastructure and Azure, you should consider appropriate safeguards such as HTTPS or VPN.

For organizations that need to secure access from multiple workstations located on-premises to Azure, use [Azure site-to-site VPN](../vpn-gateway/vpn-gateway-site-to-site-create.md).

For organizations that need to secure access from one workstation located on-premises to Azure, use [Point-to-Site VPN](../vpn-gateway/vpn-gateway-point-to-site-create.md).

Larger data sets can be moved over a dedicated high-speed WAN link such as [ExpressRoute](https://azure.microsoft.com/services/expressroute/). If you choose to use ExpressRoute, you can also encrypt the data at the application-level using [SSL/TLS](https://support.microsoft.com/kb/257591) or other protocols for added protection.

If you are interacting with Azure Storage through the Azure Portal, all transactions occur via HTTPS. [Storage REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx) over HTTPS can also be used to interact with [Azure Storage](https://azure.microsoft.com/services/storage/) and [Azure SQL Database](https://azure.microsoft.com/services/sql-database/).

Organizations that fail to protect data in transit are more susceptible for [man-in-the-middle attacks](https://technet.microsoft.com/library/gg195821.aspx), [eavesdropping](https://technet.microsoft.com/library/gg195641.aspx) and session hijacking. These attacks can be the first step in gaining access to confidential data.

You can learn more about Azure VPN option by reading the article [Planning and design for VPN Gateway](../vpn-gateway/vpn-gateway-plan-design.md).

## Enforce file level data encryption

Another layer of protection that can increase the level of security for your data is encrypting the file itself, regardless of the file location.

[Azure RMS](https://technet.microsoft.com/library/jj585026.aspx) uses encryption, identity, and authorization policies to help secure your files and email. Azure RMS works across multiple devices — phones, tablets, and PCs by protecting both within your organization and outside your organization. This capability is possible because Azure RMS adds a level of protection that remains with the data, even when it leaves your organization’s boundaries.

When you use Azure RMS to protect your files, you are using industry-standard cryptography with full support of [FIPS 140-2](http://csrc.nist.gov/groups/STM/cmvp/standards.html). When you leverage Azure RMS for data protection, you have the assurance that the protection stays with the file, even if it is copied to storage that is not under the control of IT, such as a cloud storage service. The same occurs for files shared via e-mail, the file is protected as an attachment to an email message, with instructions how to open the protected attachment.

When planning for Azure RMS adoption we recommend the following:

- Install the [RMS sharing app](https://technet.microsoft.com/library/dn339006.aspx). This app integrates with Office applications by installing an Office add-in so that users can easily protect files directly.
- Configure applications and services to support Azure RMS
- Create [custom templates](https://technet.microsoft.com/library/dn642472.aspx) that reflect your business requirements. For example: a template for top secret data that should be applied in all top secret related emails.

Organizations that are weak on [data classification](http://download.microsoft.com/download/0/A/3/0A3BE969-85C5-4DD2-83B6-366AA71D1FE3/Data-Classification-for-Cloud-Readiness.pdf) and file protection may be more susceptible to data leakage. Without proper file protection, organizations won’t be able to obtain business insights, monitor for abuse and prevent malicious access to files.

You can learn more about Azure RMS by reading the article [Getting Started with Azure Rights Management](https://technet.microsoft.com/library/jj585016.aspx).
