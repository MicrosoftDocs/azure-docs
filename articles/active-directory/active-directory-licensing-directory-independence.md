<properties
   pageTitle="Add and manage multiple Azure Active Directory directories | Microsoft Azure"
   description="Instructions and best practices for adding and managing your Azure Active Directory directories, explaining directories as a fully independent resources"
   services="active-directory"
   documentationCenter=""
   authors="curtand"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/16/2016"
   ms.author="curtand"/>

# Add and manage multiple Azure Active Directory directories

In Azure Active Directory (Azure AD), each directory is a fully independent resource: a peer, fully-featured, and logically independent of other directories that you manage. There is no parent-child relationship between directories. This independence between directories includes resource independence, administrative independence, and synchronization independence.

##Resource independence

If you create or delete a resource in one directory, it has no impact on any resource in another directory, with the partial exception of external users, described below. If you use a custom domain 'contoso.com' with one directory, it cannot be used with any other directory.

##Administrative independence

If a non-administrative user of directory 'Contoso' creates a test directory 'Test' then:
- By default, the user who creates a directory is added as an external user in that new directory, and assigned the global administrator role in that directory.
- The administrators of directory 'Contoso' have no direct administrative privileges to directory 'Test' unless an administrator of 'Test' specifically grants them these privileges. Administrators of 'Contoso' can control access to directory 'Test' if they control the user account which created 'Test.'
- If you change (add or remove) an administrator role for a user in one directory, the change does not affect any administrator role that the user might have in another directory.

##Synchronization independence

You can configure each Azure AD directory independently to get data synchronized from a single instance of either:
  - The Directory Synchronization (DirSync) tool, to synchronize data with a single AD forest.
  - The Azure Active Directory Connector for Forefront Identity Manager, to synchronize data with one or more on-premises forests, and/or non-Azure AD data sources.

##Add an Azure AD directory

To add an Azure AD directory in the Azure classic portal, select the Azure Active Directory extension on the left and tap **Add**.

> [AZURE.NOTE]   Unlike other Azure resources, your directories are not child resources of an Azure subscription. If you cancel or allow your Azure subscription to expire, you can still access your directory data using Azure PowerShell, the Azure Graph API, or other interfaces such as the Office 365 Admin Center. You can also associate another subscription with the directory.

For a broad overview of Azure AD licensing issues and best practices, see [What is Azure Active Directory licensing?](active-directory-licensing-what-is.md).
