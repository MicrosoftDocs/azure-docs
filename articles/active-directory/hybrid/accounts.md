---
title: 'Accounts for integrating with Active Directory'
description: This article describes the required accounts for each of the synchronization tools.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/21/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Accounts for integrating with Active Directory

The following article describes the accounts that are required for each of the two synchronization tools.  Use these sections as a reference when configuring and setting up your environment.

## Accounts for installing and running cloud sync 

|Requirement|Description and more requirements|
|-----|-----|
|Domain/Enterprise administrator|Required to install the agent on the server and create the gMSA service account.|
|Hybrid Identity administrator|Required to configure cloud sync.  This account cannot be a guest account.|
|gMSA service account|Required to run the agent.| 

For more information, on cloud sync accounts, and how to set up a custom gMSA account, see [Cloud sync prerequisites](cloud-sync/how-to-prerequisites.md).

<a name='accounts-for-installing-and-running-azure-ad-connect'></a>

## Accounts for installing and running Microsoft Entra Connect

Microsoft Entra Connect uses three accounts to *synchronize information* from on-premises Windows Server Active Directory (Windows Server AD) to Microsoft Entra ID:


|Requirement|Description and additional requirements|
|-----|-----|
|AD DS Connector account|Used to read and write information to Windows Server AD by using Active Directory Domain Services (AD DS).|
|ADSync service account|Used to run the sync service and access the SQL Server database.|
|Microsoft Entra Connector account|Used to write information to Microsoft Entra ID.|
|Local Administrator account|The administrator who is installing Microsoft Entra Connect and who has local Administrator permissions on the computer.|
|AD DS Enterprise Administrator account|Optionally used to create the required AD DS Connector account.|
|Microsoft Entra Global Administrator account|Used to create the Microsoft Entra Connector account and to configure Microsoft Entra ID. You can view Global Administrator and Hybrid Identity Administrator accounts in the [Microsoft Entra admin center](https://entra.microsoft.com). See [List Microsoft Entra role assignments](../roles/view-assignments.md).|
|SQL SA account (optional)|Used to create the ADSync database when you use the full version of SQL Server. The instance of SQL Server can be local or remote to the Microsoft Entra Connect installation. This account can be the same account as the Enterprise Administrator account.|

For more information, on Microsoft Entra Connect accounts, and how to configure them, see [Accounts and permissions](connect/reference-connect-accounts-permissions.md).
