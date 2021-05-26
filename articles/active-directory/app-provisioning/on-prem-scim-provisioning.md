---
title: On-premises app provisioning to SCIM-enabled apps
description: This article describes how to on-premises app provisioning to SCIM-enabled apps.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: conceptual
ms.workload: identity
ms.date: 03/09/2021
ms.author: billmath
ms.reviewer: arvinh
---

# On-premises app provisioning to SCIM-enabled apps

The Azure AD provisioning service supports a [SCIM 2.0](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) client that can be used to automatically provision users into cloud or on-premises applications. This document outlines how you can use the Azure AD provisioning service to provision users into an on-premises application that is SCIM enabled. If you're looking to provision users into non-SCIM on-premises applications, please such as a non-AD LDAP directory or SQL DB, please see here (link to new doc that we will need to create). If you're looking to provisioning users into cloud apps such as DropBox, Atlassian, etc. please review the app specific tutorials. 



## Pre-requisites
* AAD P1
* Admin role for installing the agent (one time effort) - Hybrid admin / Global admin 
* Admin role for configuring the application in the cloud (Application admin, Cloud application admin, Global Administrator, Custom role with perms)

## Steps
1. Add application from the [gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal).
1. Navigate to your app > Provisioning > Download the provisioning agent.
1. Install agent on-prem (provide admin credentials).
1. Configure any [attribute mappings](https://docs.microsoft.com/azure/active-directory/app-provisioning/customize-application-attributes) or [scoping](https://docs.microsoft.com/azure/active-directory/app-provisioning/define-conditional-rules-for-provisioning-user-accounts) rules required for your application.  
1. Add users to scope by [assigning users and groups](https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-assign-users) to the application.
1. Test provisioning a few users [on-demand](https://docs.microsoft.com/azure/active-directory/app-provisioning/provision-on-demand). 
1. Add additional users into scope by assigning them to your application. 
1. Navigate to the provisioning blade and hit start provisioning. 
1. Monitor using the [provisioning logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-provisioning-logs). 

## Things to be aware of
* Ensure your [SCIM](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010) implementation meets the [Azure AD SCIM requirements](https://docs.microsoft.com/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups).
  * Azure AD offers open source [reference code](https://github.com/AzureAD/SCIMReferenceCode/wiki) that developers can use to bootstrap their SCIM implementation (the code is as-is)
* Support the /schemaDiscovery endpoint to reduce configuration required in the Azure Portal. 

Next Steps

- [App provisioning](user-provisioning.md)
