---
title: Assign permissions to Cost Management APIs
titleSuffix: Microsoft Cost Management
description: This article describes what you need to know to successfully assign permissions to an Azure service principal.
author: bandersmsft
ms.author: banders
ms.date: 07/15/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.custom: devx-track-arm-template
ms.reviewer: adwise
---

# Assign permissions to Cost Management APIs

Before using the Azure Cost Management APIs, you need to properly assign permissions to an Azure service principal. From there you can use the service principal identity to call the APIs.

## Permissions configuration checklist

- Get familiar with the [Azure Resource Manager REST APIs](/rest/api/azure).
- Determine which Cost Management APIs you want to use. For more information about available APIs, see [Cost Management automation overview](automation-overview.md).
- Configure service authorization and authentication for the Azure Resource Manager APIs.
    - If you're not already using Azure Resource Manager APIs, [register your client app with Microsoft Entra ID](/rest/api/azure/#register-your-client-application-with-azure-ad). Registration creates a service principal for you to use to call the APIs.
    - Assign the service principal access to the scopes needed, as outlined below.
    - Update any programming code to use [Microsoft Entra authentication](/rest/api/azure/#create-the-request) with your service principal.

## Assign service principal access to Azure Resource Manager APIs

After you create a service principal to programmatically call the Azure Resource Manager APIs, you need to assign it the proper permissions to authorize against and execute requests in Azure Resource Manager. There are two permission frameworks for different scenarios.

### Azure billing hierarchy access

If you have an Azure Enterprise Agreement or a Microsoft Customer Agreement, you can configure service principal access to Cost Management data in your billing account. To learn more about the billing hierarchies available and what permissions are needed to call each API in Azure Cost Management, see [Understand and work with scopes](../costs/understand-work-scopes.md).

- Enterprise Agreements - To assign service principal permissions to your enterprise billing account, departments, or enrollment account scopes, see [Assign roles to Azure Enterprise Agreement service principal names](../manage/assign-roles-azure-service-principals.md).

- Microsoft Customer Agreements - To assign service principal permissions to your Microsoft Customer Agreement billing account, billing profile, invoice section or customer scopes, see [Manage billing roles in the Azure portal](../manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal). Configure the permission to your service principal in the portal as you would a normal user. If you want to automate permissions assignment, see the [Billing Role Assignments API](/rest/api/billing/2020-05-01/billing-role-assignments).

### Azure role-based access control

Service principal support extends to Azure-specific scopes, like management groups, subscriptions, and resource groups. You can assign service principal permissions to thee scopes directly [in the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application) or by using [Azure PowerShell](../../active-directory/develop/howto-authenticate-service-principal-powershell.md#assign-the-application-to-a-role).

## Next steps

- Learn more about Cost Management automation at [Cost Management automation overview](automation-overview.md).
