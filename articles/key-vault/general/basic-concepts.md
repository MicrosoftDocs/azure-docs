---
title: What is Azure Key Vault? | Microsoft Docs
description: Learn how Azure Key Vault safeguards cryptographic keys and secrets that cloud applications and services use.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 01/18/2019
ms.author: mbaldwin
#Customer intent: As someone new to Key Vault, I'm trying to learn basic concepts that can help me understand Key Vault documentation.
---
# Azure Key Vault basic concepts

Azure Key Vault is a cloud service for securely storing and accessing secrets. A secret is anything that you want to tightly control access to, such as API keys, passwords, certificates, or cryptographic keys. Key Vault service supports two types of containers: vaults and managed hardware security module(HSM) pools. Vaults support storing software and HSM-backed keys, secrets, and certificates. Managed HSM pools only support HSM-backed keys. See [Azure Key Vault REST API overview](about-keys-secrets-certificates.md) for complete details.

Here are other important terms:

- **Tenant**: A tenant is the organization that owns and manages a specific instance of Microsoft cloud services. It's most often used to refer to the set of Azure and Microsoft 365 services for an organization.

- **Vault owner**: A vault owner can create a key vault and gain full access and control over it. The vault owner can also set up auditing to log who accesses secrets and keys. Administrators can control the key lifecycle. They can roll to a new version of the key, back it up, and do related tasks.

- **Vault consumer**: A vault consumer can perform actions on the assets inside the key vault when the vault owner grants the consumer access. The available actions depend on the permissions granted.

- **Managed HSM Administrators**: Users who are assigned the Administrator role have complete control over a Managed HSM pool. They can create more role assignments to delegate controlled access to other users.

- **Managed HSM Crypto Officer/User**: Built-in roles that are usually assigned to users or service principals that will perform cryptographic operations using keys in Managed HSM. Crypto User can create new keys, but cannot delete keys.

- **Managed HSM Crypto Service Encryption**: Built-in role that is usually assigned to a service accounts managed service identity (e.g. Storage account) for encryption of data at rest with customer managed key.

- **Resource**: A resource is a manageable item that's available through Azure. Common examples are virtual machine, storage account, web app, database, and virtual network. There are many more.

- **Resource group**: A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups, based on what makes the most sense for your organization.

- **Security principal**: An Azure security principal is a security identity that user-created apps, services, and automation tools use to access specific Azure resources. Think of it as a "user identity" (username and password or certificate) with a specific role, and tightly controlled permissions. A security principal should only need to do specific things, unlike a general user identity. It improves security if you grant it only the minimum permission level that it needs to perform its management tasks. A security principal used with an application or service is specifically called a **service principal**.

- [Azure Active Directory (Azure AD)](../../active-directory/fundamentals/active-directory-whatis.md): Azure AD is the Active Directory service for a tenant. Each directory has one or more domains. A directory can have many subscriptions associated with it, but only one tenant.

- **Azure tenant ID**: A tenant ID is a unique way to identify an Azure AD instance within an Azure subscription.

- **Managed identities**: Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. Using a managed identity makes solving this problem simpler by giving Azure services an automatically managed identity in Azure AD. You can use this identity to authenticate to Key Vault or any service that supports Azure AD authentication, without having any credentials in your code. For more information, see the following image and the [overview of managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

## Authentication
To do any operations with Key Vault, you first need to authenticate to it. There are three ways to authenticate to Key Vault:

- [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md): When you deploy an app on a virtual machine in Azure, you can assign an identity to your virtual machine that has access to Key Vault. You can also assign identities to [other Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). The benefit of this approach is that the app or service isn't managing the rotation of the first secret. Azure automatically rotates the identity. We recommend this approach as a best practice. 
- **Service principal and certificate**: You can use a service principal and an associated certificate that has access to Key Vault. We don't recommend this approach because the application owner or developer must rotate the certificate.
- **Service principal and secret**: Although you can use a service principal and a secret to authenticate to Key Vault, we don't recommend it. It's hard to automatically rotate the bootstrap secret that's used to authenticate to Key Vault.


## Key Vault roles

Use the following table to better understand how Key Vault can help to meet the needs of developers and security administrators.

| Role | Problem statement | Solved by Azure Key Vault |
| --- | --- | --- |
| Developer for an Azure application |"I want to write an application for Azure that uses keys for signing and encryption. But I want these keys to be external from my application so that the solution is suitable for an application that's geographically distributed. <br/><br/>I want these keys and secrets to be protected, without having to write the code myself. I also want these keys and secrets to be easy for me to use from my applications, with optimal performance." |√ Keys are stored in a vault and invoked by URI when needed.<br/><br/> √ Keys are safeguarded by Azure, using industry-standard algorithms, key lengths, and hardware security modules.<br/><br/> √ Keys are processed in HSMs that reside in the same Azure datacenters as the applications. This method provides better reliability and reduced latency than keys that reside in a separate location, such as on-premises. |
| Developer for software as a service (SaaS) |"I don't want the responsibility or potential liability for my customers' tenant keys and secrets. <br/><br/>I want customers to own and manage their keys so that I can concentrate on doing what I do best, which is providing the core software features." |√ Customers can import their own keys into Azure, and manage them. When a SaaS application needs to perform cryptographic operations by using customers' keys, Key Vault does these operations on behalf of the application. The application does not see the customers' keys. |
| Chief security officer (CSO) |"I want to know that our applications comply with FIPS 140-2 Level 2 or FIPS 140-2 Level 3 HSMs for secure key management. <br/><br/>I want to make sure that my organization is in control of the key lifecycle and can monitor key usage. <br/><br/>And although we use multiple Azure services and resources, I want to manage the keys from a single location in Azure." |√ Choose **vaults** for FIPS 140-2 Level 2 validated HSMs.<br/>√ Choose **managed HSM pools** for FIPS 140-2 Level 3 validated HSMs.<br/><br/>√ Key Vault is designed so that Microsoft does not see or extract your keys.<br/>√ Key usage is logged in near real time.<br/><br/>√ The vault provides a single interface, regardless of how many vaults you have in Azure, which regions they support, and which applications use them. |

Anybody with an Azure subscription can create and use key vaults. Although Key Vault benefits developers and security administrators, it can be implemented and managed by an organization's administrator who manages other Azure services. For example, this administrator can sign in with an Azure subscription, create a vault for the organization in which to store keys, and then be responsible for operational tasks like these:

- Create or import a key or secret
- Revoke or delete a key or secret
- Authorize users or applications to access the key vault, so they can then manage or use its keys and secrets
- Configure key usage (for example, sign or encrypt)
- Monitor key usage

This administrator then gives developers URIs to call from their applications. This administrator also gives key usage logging information to the security administrator. 

![Overview of how Azure Key Vault works][1]

Developers can also manage the keys directly, by using APIs. For more information, see [the Key Vault developer's guide](developers-guide.md).

## Next steps

- Learn about [Azure Key Vault security features](security-features.md).
- Learn how to [secure your managed HSM pools](../managed-hsm/access-control.md)

<!--Image references-->
[1]: ../media/key-vault-whatis/AzureKeyVault_overview.png
Azure Key Vault is available in most regions. For more information, see the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/).
