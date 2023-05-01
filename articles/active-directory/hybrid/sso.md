---
title: 'Get started with single sign-on'
description: This article describes the how you can configure the synchronization tools to use single sign-on.
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


Configuring single sign-on, will depend on which synchronization tool you are using and what your business goals are.  Use the tables below to determine which features you would

## Cloud sync
After installing the Azure AD Connect provisioning agent, you will need to configure single sign-on for cloud sync.  The following table provides a list of steps required for using single sign-on.
  
|Task|Description|
|-----|-----|
|Download and extract Azure AD Connect files|Download and extract the Azure AD Connect files to use the PowerShell modules.|
|Import the Seamless SSO PowerShell module|Import the PowerShell modules into a PowerShell session.|
|Get the list of Active Directory forests on which Seamless SSO has been enabled|Determine where sso has been enabled.|
|Enable Seamless SSO for each Active Directory forest|Enable sso on your forests.|
|Enable the feature on your tenant|Enable sso on your tenant.|

For more information, see [configuring single sign-on with cloud sync](cloud-sync/how-to-sso.md).

## Azure AD Connect
Azure Active Directory (Azure AD) Seamless single sign-on (Seamless SSO) automatically signs in users when they're using their corporate desktops that are connected to your corporate network.  The following table provides a list of steps required for using single sign-on.

|Task|Description|
|-----|-----|
|Check the prerequisites|Review the prerequisites and ensure you can enable sso.|
|Enable the feature|Use the Azure AD Connect wizard to enable sso.|
|Roll out the feature|Gradually roll the feature out.|
|Test SSO|Ensure sso is working.|

For more information, see [configuring single sign-on with Azure AD Connect](connect/how-to-connect-sso-quick-start.md).

For more information, see [configuring single sign-on with cloud sync](cloud-sync/how-to-sso.md).