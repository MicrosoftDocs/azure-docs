---
title: Managing access to Azure billing | Microsoft Docs
description: 
services: ''
documentationcenter: ''
author: vikdesai
manager: vikdesai
editor: ''
tags: billing

ms.assetid: e4c4d136-2826-4938-868f-a7e67ff6b025
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: vikdesai

---
# How to manage access to subscription billing
The access to viewing billing information is granted to users in certain roles on the Azure subscription. The user roles who can read billing information are Account Administrator, Service Administrator, Co-administrator, Owner, Contributor, Reader and Billing Reader.
Account Administrator and Billing Reader are billing only roles and do not have any access to service management operations.
The common scenario for Billing Reader is ability to delegate access to billing information for a subscription without giving any access to perform service management. This role is appropriate for users in an organization who perform financial/cost management for Azure subscriptions. The user in this role can view cost information in the Azure management portal and download invoices for the subscription.
<screen shots from Azure portal>
Also, users in this role can call Azure Billing API (hyperlink to billing API REST API) to download invoices.

## Adding users to billing reading role
Users who are in Service Administrator, Co-administrator, Owner, User Access Administrator roles can delegate access to other users. (hyperlink to Azure RBAC roles)
1.	Select the subscription that you want to delegate billing reader access
2.	Select Access Control (IAM) (Screen shots need to be replaced)


