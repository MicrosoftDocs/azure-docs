---
title: Troubleshoot enterprise cost views - Azure | Microsoft Docs
description: Learn how to resolve any issues you might have with organizational cost views within the Azure portal.  
services: ''
documentationcenter: ''
author: rthorn17
manager: rithorn
editor: ''

ms.assetid: 
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/25/2017
ms.author: rithorn
---

# Troubleshoot enterprise cost views 

Within enterprise enrollments, there are multiple settings that could cause users within the enrollment to not be able to view costs.  These settings are managed by the enrollment administrator, or by the partner if the enrollment is not purchased directly with Microsoft.  This article helps you understand what the settings are and how they impact the enrollment. These settings are independent of the [Azure RBAC Roles](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure). 

## Enabling access to costs
If you are not seeing costs, or that cost views are disabled, it might be due to one of the following reasons:

1. You’ve purchased Azure through a channel partner, and the partner hasn’t released pricing yet. To release pricing, contact your partner to do update the setting within the [Enterprise portal](https://ea.azure.com).
2. Alternatively, if you’re an EA Direct customer, there are a couple of possibilities:
    * You are an Account Owner and your Enrollment Administrator has disabled the "AO view charges" setting.  
    * You are a Department Administrator and your Enrollment Administrator has disabled the "DA view charges" setting.
    * Contact your Enrollment Administrator to get access. The Enrollment Admin can visit the [Enterprise portal](https://ea.azure.com/manage/enrollment) and update the setting as seen here:

![Enterprise Portal Settings](media/billing-enterprise-mgmt-groups/ea-portal-settings.png)


## Asset not found? 
If you are receiving an error message "Asset not found" when trying to access a subscription or [management group](billing-enterprise-mgmt-group-overview.md), then you do not have the correct role to view this item.  See the [Azure Role-Based Access Control (RBAC)](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-configure) document for help.  

