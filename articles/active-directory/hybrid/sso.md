---
title: 'Get started with single sign-on'
description: This article describes how you can configure the synchronization tools to use single sign-on.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/04/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Get started with single sign-on


Setting up single sign-on, depends on which synchronization tool you are using and what your business goals are.  Use the tables to determine which features you would

## Cloud sync
After installing the Microsoft Entra Provisioning Agent, you will need to configure single sign-on for cloud sync.  The following table provides a list of steps required for using single sign-on.
  
|Task|Description|
|-----|-----|
|Download and extract Microsoft Entra Connect files|Download and extract the Microsoft Entra Connect files to use the PowerShell modules.|
|Import the Seamless single sign-on PowerShell module|Import the PowerShell modules into a PowerShell session.|
|Get the list of Active Directory forests on which Seamless single sign-on has been enabled|Determine where single sign-on has been enabled.|
|Enable Seamless single sign-on for each Active Directory forest|Enable single sign-on on your forests.|
|Enable the feature on your tenant|Enable single sign-on on your tenant.|

For more information, see [configuring single sign-on with cloud sync](cloud-sync/how-to-sso.md).

<a name='azure-ad-connect'></a>

## Microsoft Entra Connect
Microsoft Entra seamless single sign-on (Seamless single sign-on) automatically signs in users when they're using their corporate desktops that are connected to your corporate network.  The following table provides a list of steps required for using single sign-on.

|Task|Description|
|-----|-----|
|Check the prerequisites|Review the prerequisites and ensure you can enable single sign-on.|
|Enable the feature|Use the Microsoft Entra Connect wizard to enable single sign-on.|
|Roll out the feature|Gradually implement single sign-on.|
|Test single sign-on|Ensure single sign-on is working.|

For more information, see [configuring single sign-on with Microsoft Entra Connect](connect/how-to-connect-sso-quick-start.md) and [configuring single sign-on with cloud sync](cloud-sync/how-to-sso.md).
