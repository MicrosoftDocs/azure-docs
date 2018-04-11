---
title: Privileged Identity Management for Azure Resources - Use custom roles to target PIM settings| Microsoft Docs
description: Describes how to use custom roles in PIM for Azure resources.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/30/2018
ms.author: billmath
---


# Use custom roles to target PIM settings

It may be necessary to apply strict PIM settings to some members of a role, while providing greater autonomy for others. Consider a scenario where your organization hires sevral contract associates to assist in the development of an application that will run in an Azure subscription. 

As a resource administrator, you would like employees of your organization to have eligible access without approval required, but all contract associates must seek approval when they request activation. Follow the steps below outline the process to enable targeted PIM settings for Azure resource roles.

## Create the custom role

[Use this guide to create a custom role for a resource](../../role-based-access-control/custom-roles.md).

Include a descriptive name so you can easily remember which built-in role you intended to duplicate.

>[!NOTE]
>Ensure the custom role is a duplicate of the role you intended, and its scope matches the built-in role.

## Apply PIM settings

Once the role is created in your tenant, navigate to PIM and select the resource the role is scoped to.

![](media/azure-pim-resource-rbac/aadpim_manage_azure_resource_some_there.png)

[Configure PIM role settings](pim-resource-roles-configure-role-settings.md) that should apply to these members

Finally, [Assign roles](pim-resource-roles-assign-roles.md) to the distinct group of members you wish to target with these settings.

## Next steps

[Review the owners of subscription](pim-resource-roles-perform-access-review.md)
