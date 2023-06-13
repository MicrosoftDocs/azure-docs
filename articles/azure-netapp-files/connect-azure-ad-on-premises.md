title: Connect to on-premises environment with Azure Active Directory | Microsoft Learn
description: Explains how to connect Azure NetApp Files volumes from on-premises environment using Azure Active Directory (AD).
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
author: b-ahibbard
ms.author: anfdocs
ms.date: 06/12/2023
---
# Connect to on-premises environment with Azure Active Directory

Azure Active Directory (Azure AD) with the Hybrid Authentication Management module enables hybrid cloud users to authenticate cloud and on-premises credentials with Azure AD. 

This allows you to 

The Azure AD with the help of Hybrid Authentication Management module enables hybrid identity organisations (those with Active Directory on-premises) to use modern credentials for their applications and enables Azure AD to become the trusted source for both cloud and on-premises authentication. 

With Azure AD the clients connecting to ANF volume need not join premises AD domain. 
Only need to join Azure AD with user identities managed/synced from on-premises Active Directory to Azure AD using Azure AD connect application. 