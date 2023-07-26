---
title: Group naming policy quickstart
description: Explains how to add new users or delete existing users in Azure Active Directory
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: quickstart
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro, mode-other
ms.collection: M365-identity-device-management
#Customer intent: As an Azure AD identity administrator, I want to enforce naming policy on self-service groups, to help me sort and search in my Azure AD organization’s user-created groups.
---

# Quickstart: Naming policy for groups in Azure Active Directory

In this quickstart, in Azure Active Directory (Azure AD), part of Microsoft Entra, you will set up naming policy in your Azure AD organization for user-created Microsoft 365 groups, to help you sort and search your groups. For example, you could use the naming policy to:

* Communicate the function of a group, membership, geographic region, or who created the group.
* Help categorize groups in the address book.
* Block specific words from being used in group names and aliases.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Configure the group naming policy in the Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) with a User Administrator account.
1. Browse to **Azure Active Directory** > **Groups**, then select **Naming policy** to open the Naming policy page.

    ![open the Naming policy page in the admin center](./media/groups-quickstart-naming-policy/policy.png)

### View or edit the Prefix-suffix naming policy

1. On the **Naming policy** page, select **Group naming policy**.
1. You can view or edit the current prefix or suffix naming policies individually by selecting the attributes or strings you want to enforce as part of the naming policy.
1. To remove a prefix or suffix from the list, select the prefix or suffix, then select **Delete**. Multiple items can be deleted at the same time.
1. Select **Save** for your changes to the policy to go into effect.

### View or edit the custom blocked words

1. On the **Naming policy** page, select **Blocked words**.

    ![edit and upload blocked words list for naming policy](./media/groups-quickstart-naming-policy/blockedwords.png)

1. View or edit the current list of custom blocked words by selecting **Download**.
1. Upload the new list of custom blocked words by selecting the file icon.
1. Select **Save** for your changes to the policy to go into effect.

That's it. You've set your naming policy and added your custom blocked words.

## Clean up resources

### Remove the naming policy using Azure portal

1. On the **Naming policy** page, select **Delete policy**.
1. After you confirm the deletion, the naming policy is removed, including all prefix-suffix naming policy and any custom blocked words.

## Next steps

In this quickstart, you’ve learned how to set the naming policy for your Azure AD organization through the Azure portal.

Advance to the next article for more information including the PowerShell cmdlets for naming policy, technical constraints, adding a list of custom blocked words, and the end user experiences across Microsoft 365 apps.
> [!div class="nextstepaction"]
> [Naming policy PowerShell](groups-naming-policy.md)
