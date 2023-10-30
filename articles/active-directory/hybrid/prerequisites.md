---
title: 'Prerequisites for integrating with Active Directory'
description: This article describes the prerequisites required to integrate with Active Directory.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/01/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Prerequisites for integrating with Active Directory
The following document provides the prerequisites for integrating with Active Directory.

## Cloud sync

### Hardware and software

|Requirement|Description and more requirements|
|-----|-----|
|Windows server 2016 or greater that is or has:|• 4 GB RAM or more</br>• .NET 4.7.1 runtime or greater</br>• domain-joined</br>• PowerShell execution policy set to **Undefined** or **RemoteSigned**</br>• TLS 1.2 enabled</br>|
|Active Directory|• On-premises AD that has a forest functional level 2003 or higher|
|Microsoft Entra tenant|• A tenant in Azure that will be used to synchronize from on-premises|

For more information on the cloud sync prerequisites, see [Cloud sync prerequisites](cloud-sync/how-to-prerequisites.md).

### Accounts

|Requirement|Description and more requirements|
|-----|-----|
|Domain/Enterprise administrator|Required to install the agent on the server and create the gMSA service account.|
|Hybrid Identity administrator|Required to configure cloud sync.  This account cannot be a guest account.|
|gMSA service account|Required to run the agent.| 

For more information on the cloud sync accounts, and how to set up a custom gMSA account, see [Cloud sync prerequisites](cloud-sync/how-to-prerequisites.md).

<a name='azure-ad-connect'></a>

## Microsoft Entra Connect

### Hardware and software

|Requirement|Description and more requirements|
|-----|-----|
|Windows server 2016 or greater that is or has:|• 4 GB RAM or more</br>• .NET 4.6.2 runtime or greater</br>• domain-joined</br>• PowerShell execution policy set to **RemoteSigned**</br>• TLS 1.2 enabled</br>• if federation is being used, the AD FS severs must be Windows Server 2012 R2 or higher and TLS/SSL certificates must be configured.|
|Active Directory|• On-premises AD that has a forest functional level 2003 or higher</br>• a writeable domain controller|
|Microsoft Entra tenant|• A tenant in Azure used to synchronize from on-premises|
|SQL Server|Microsoft Entra Connect requires a SQL Server database to store identity data. By default, a SQL Server 2019 Express LocalDB (a light version of SQL Server Express) is installed. For more information on using a SQL server, see [Microsoft Entra Connect SQL server requirements](connect/how-to-connect-install-prerequisites.md#sql-server-used-by-azure-ad-connect)


For more information on the cloud sync prerequisites, see [Microsoft Entra Connect prerequisites](connect/how-to-connect-install-prerequisites.md).

### Accounts

|Requirement|Description and more requirements|
|-----|-----|
|Enterprise administrator|Required to install Microsoft Entra Connect.|
|Hybrid Identity administrator|Required to configure cloud sync.  This account cannot be a guest account.  This account must be a school or organization account and can't be a Microsoft account.|
|Custom settings|If you use the custom settings installation path, you have more options. You can specify the following information:</br>• [AD DS Connector account](./connect/reference-connect-accounts-permissions.md)</br>• [ADSync Service account](./connect/reference-connect-accounts-permissions.md)</br>• [Microsoft Entra Connector account](./connect/reference-connect-accounts-permissions.md).  </br>For more information, see [Custom installation settings](./connect/reference-connect-accounts-permissions.md#custom-settings).|

For more information on the Microsoft Entra Connect accounts, see [Microsoft Entra Connect: Accounts and permissions](connect/reference-connect-accounts-permissions.md).

## Next steps
- [Common scenarios](common-scenarios.md)
- [Tools for synchronization](sync-tools.md)
- [Choosing the right sync tool](https://setup.microsoft.com/azure/add-or-sync-users-to-azure-ad)
- [Steps to start](get-started.md)
