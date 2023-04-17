---
title: Authorize access to Azure Files via OAuth authentication over REST APIs using Azure Active Directory (preview)
description: Authorize access to Azure file shares and directories via the OAuth authentication protocol over REST APIs using Azure Active Directory (Azure AD). Assign Azure roles for access rights. Access files with an Azure AD account.
author: khdownie
ms.service: storage
ms.topic: conceptual
ms.date: 04/17/2023
ms.author: kendownie
ms.subservice: files
---

# Authorize access to Azure Files using Azure Active Directory for REST access (preview)

Azure Files OAuth over REST (preview) enables privileged read and write data access to Azure Files using the OAuth authentication protocol using Azure Active Directory (Azure AD) for REST based access. Users, groups, first-party services such as Azure portal, and third-party services and applications using REST interfaces can now use OAuth authentication and authorization to access Azure Files. PowerShell cmdlets and Azure CLI commands that call REST APIs can also use OAuth to access Azure Files.

The feature also helps customers switch from storage account key access to OAuth for admin workflows, improving auditing and tracking.

## Limitations

REST API OAuth support is limited to FileREST Data APIs that support operations on files and directories. OAuth isn't supported on FilesREST data plane APIs that manage FileService and FileShare resources. These management APIs are exposed through the data plane for legacy reasons. We recommend using the control plane APIs (the storage resource provider - Microsoft.Storage) for all management activities related to FileService and FileShare resources.

## Customer use cases

OAuth authentication and authorization with Azure Files over the REST API interface can benefit customers in the following scenarios.

### Application development and service integration

OAuth authentication and authorization enable developers to build applications that access Azure Storage REST APIs using user or application identities from Azure AD.  

Customers and partners can also enable first-party and third-party services to configure necessary access securely and transparently to a customer storage account.  

DevOps tools such as the Azure portal, PowerShell, and CLI, AzCopy, and Storage Explorer can manage data using the user’s identity, eliminating the need to manage or distribute storage access keys.

### Managed identities  

Customers with applications and managed identities that require access to file share data for backup, restore, or auditing purposes can benefit from OAuth authentication and authorization. Enforcing file- and directory-level permissions for each identity adds complexity and might not be compatible with certain workloads. For instance, customers might want to authorize a backup solution service to access Azure file shares with read-only access to all files with no regard to file-specific permissions. 

### Storage account key replacement

Azure AD provides superior security and ease of use over shared key access. You can replace storage account key access with OAuth authentication and authorization to access Azure File shares with read-all/write-all privileges. This approach also offers better auditing and tracking specific user access.



## Next steps

- [Authorize access to Azure file share data in the Azure portal](authorize-data-operations-portal.md)
