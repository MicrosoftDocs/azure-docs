---
title: Azure Stack Key Vault introduction | Microsoft Docs
description: Learn how Azure Stack Key Vault manages keys and secrets
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: 70f1684a-3fbb-4cd1-bf29-9f9882e98fe9
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/04/2017
ms.author: sngun

---
# Introduction to Key Vault in Azure Stack

## Before you start
This article assumes the following:

* Azure Stack administrators must have [created an offer](azure-stack-create-offer.md) that includes the Key Vault service.  
* Tenants must [subscribe to an offer](azure-stack-subscribe-plan-provision-vm.md) that includes the Key Vault service.  
* [PowerShell is configured for use with Azure Stack](azure-stack-powershell-configure.md) 
 
## Key Vault basics
Key Vault in Azure Stack helps safeguard cryptographic keys and secrets that cloud applications and services use. By using Key Vault, you can encrypt keys and secrets (such as authentication keys, storage account keys, data encryption keys, .pfx files, and passwords).

Key Vault streamlines the key management process and enables you to maintain control of keys that access and encrypt your data. Developers can create keys for development and testing in minutes, and then seamlessly migrate them to production keys. Security administrators can grant (and revoke) permission to keys, as needed.

Anybody with an Azure Stack subscription can create and use key vaults. Although Key Vault benefits developers and security administrators, it can be implemented and managed by an administrator who manages other Azure Stack services for an organization. For example, this administrator can sign in with an Azure Stack subscription, create a vault for the organization in which to store keys, and then be responsible for these operational tasks:

* Create or import a key or secret
* Revoke or delete a key or secret
* Authorize users or applications to access the key vault, so they can
    then manage or use its keys and secrets
* Configure key usage (for example, sign or encrypt)

This administrator can then provide developers with URIs to call from their applications, and provide a security administrator with key usage logging information.

Developers can also manage the keys directly, by using APIs. For more information, see the Key Vault developer's guide.

## Scenarios
The following table depicts some of the scenarios where Key Vault can help meet the needs of developers and security administrators:

### Developer for an Azure Stack application
**Problem**: I want to write an application for Azure Stack that uses keys for signing and encryption, but I want these to be external from my application so that the solution is suitable for an application that is geographically distributed.

**Statement**: Keys are stored in a vault and invoked by URI when needed.

### Developer for software as a service (SaaS)
**Problem:** I don’t want the responsibility or potential liability for my customers’ tenant keys and secrets.

**Statement:** Customers can import their own keys into Azure Stack, and manage them. I want customers to own and manage their keys so that I can concentrate on doing what I do best, which is providing the core software features.

### Chief Security Officer (CSO)
**Problem:** I want to make sure that my organization is in control of the key life cycle and can monitor key usage.

**Statement** Key Vault is designed so that Microsoft does not see or extract your keys.  When an application needs to perform cryptographic operations by using customers’ keys, Key Vault does this on behalf of the application. The application does not see the customers’ keys.  Although we use multiple Azure Stack services and resources, I want to manage the keys from a single location in Azure Stack. The vault provides a single interface, regardless of how many vaults you have in Azure Stack, which regions they support, and which applications use them.

## Next Steps

* [Manage Key Vault in Azure Stack using the portal](azure-stack-kv-manage-portal.md)  
* [Manage Key Vault in Azure Stack using PowerShell](azure-stack-kv-manage-powershell.md)
