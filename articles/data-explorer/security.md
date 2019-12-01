---
title: Secure Azure Data Explorer clusters in Azure
description: Learn about how to secure clusters in Azure Data Explorer.
author: itsagui
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/27/2019
---

# Secure Azure Data Explorer clusters in Azure

It's important to keep your clusters secure. Securing your clusters can include one or more Azure features that cover secure access and secure storage. This article provides information that enables you to keep your cluster secure.


## Encryption

### Azure Disk Encryption

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. It also integrates with [Azure Key Vault](/azure/key-vault/) which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted. 

## Managed identities for Azure resources

A common challenge when building cloud applications is how to manage the credentials in your code for authenticating to cloud services. Keeping the credentials secure is an important task. Ideally, the credentials never appear on developer workstations and aren't checked into source control. Azure Key Vault provides a way to securely store credentials, secrets, and other keys, but your code has to authenticate to Key Vault to retrieve them.

The managed identities for Azure resources feature in Azure Active Directory (Azure AD) solves this problem. The feature provides Azure services with an automatically managed identity in Azure AD. You can use the identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. For more detailed information about this service, review the [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) overview page.

## Role-based access control

Using role-based access control (RBAC), you can segregate duties within your team and grant only the amount of access to users on your cluster that they need to perform their jobs. Instead of giving everybody unrestricted permissions on the cluster, you can allow only certain actions. You can configure access control for the databases in the Azure portal, using the Azure CLI, or Azure PowerShell.
**ADD LINKS**