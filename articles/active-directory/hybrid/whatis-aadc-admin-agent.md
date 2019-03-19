---
title: 'What is the Azure AD Connect Admin Agent - Azure AD Connect | Microsoft Docs'
description: Describes the tools used to synchronize and monitor your on-premises environment with Azure AD.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 02/26/2019
ms.subservice: hybrid
ms.author: billmath
ms.topic: conceptual
ms.collection: M365-identity-device-management
---

# What is the Azure AD Connect Admin Agent? 
The Azure AD Connect Admin Agent is a new component of Azure AD Connect that is installed on an Azure AD Connect server. It is used to collect specific data from your Active Directory environment and helps a Microsoft support engineer troubleshoot issues when you open a support case. 

When installed, the Admin Agent waits for specific requests for data from Azure Active Directory, gets the requested data from the sync environment and sends it to Azure Active Directory, where it is presented to the Microsoft support engineer. 

The information that the Admin Agent retrieves from your environment is not stored in any way - it is only displayed to the Microsoft support engineer to assist them in investigating and troubleshooting the Azure AD Connect related support case that you opened. When the support case is closed the data is no longer available to the Microsoft service engineer and can no longer be retrieved from your server until a new support case is opened. 

## How is the Azure AD Connect Admin Agent installed on the Azure AD Connect server? 
After the Admin Agent is installed, you’ll see the following two new programs in the “Add/Remove Programs” list in the Control Panel of your server: 

![admin agent](media/whatis-aadc-admin-agent/adminagent1.png)

You should not remove or de-install these as they are a critical part of your Azure AD Connect installation. 

## What data in my Sync service is shown to the Microsoft service engineer? 
When you open a support case and you enable the “Share Diagnostic Data” option, the Microsoft Support Engineer can see, for a given user, the relevant data in Active Directory, the Active Directory connector space in the Azure Active Directory Connect server, the Azure Active Directory connector space in the Azure Active Directory Connect server and the Metaverse in the Azure Active Directory Connect server. 

When the support case is closed or when you revoke the “Share Diagnostic Data” option, the Microsoft Support Engineer can no longer access that data. 
The Microsoft Support Engineer cannot change any data in your system and cannot see any passwords. 

## What if I don’t want the Microsoft support engineer to access my data? 
 
If you do not want the Microsoft service engineer to access your data for a support call you can indicate this when you open a support call in the Azure Portal: 