---
title: Sign in to LUIS portal
description: If you are a new user signing in to the LUIS portal, the sign-in experience will slightly differ based on your current user account.
services: cognitive-services
ms.custom:
ms.service: cognitive-services
ms.date: 09/08/2020
ms.topic: how-to
ms.author: a-sakand
author: skandil
---
# Sign in to LUIS portal

If you are a new user signing in to the LUIS portal, the sign-in experience will slightly differ based on your current user account:
  * Associated with an Azure subscription
  * Not associated with an Azure subscription

## Determine account type

When you first sign in to the LUIS portal, use the following visual indicators to determine account type.

### Account without Azure subscription

An account, which is not associated with an Azure subscription has the Azure icon in the top-right navigation bar. Once you migrate to the associated account type, the icon no longer appears.

:::image type="content" source="media/sign-in/sign-in-with-account-without-azure-subscription.png" alt-text="Partial screen-shot of LUIS navigation bar with Azure icon.":::

### Account with Azure subscription

An account associated with an Azure subscription allows you to select your subscription and resource to use.

:::image type="content" source="media/sign-in/resource-selection.png" alt-text="Partial screen-shot of LUIS portal with resource selection drop-down selection boxes.":::

## Sign in with account associated with an Azure subscription

1. Sign in to [LUIS portal](https://www.luis.ai) and agree to the terms of use.

1. You will have two options signing up:

    * Continue using an Azure resource, which is the recommended path and soon will be the only available path. This path allows you to link your LUIS account with an Azure Authoring resource while signing up either by choosing an existing resource in your subscription or creating a new resource. This is equivalent to signing up migrated without the need of undergoing the [migration process](luis-migration-authoring.md#what-is-migration) later on. All users will be required to migrate by November 2, 2020.

    * Continue using the starter or trial key. This path allows you to sign in to LUIS with the starter or the trial resource that is being provided without having to create any resources. If you choose this path, you will eventually be required to [migrate your account](luis-migration-authoring.md#migration-steps) and link your applications to an authoring resource. That is why choosing the path where you continue with your Azure resource is recommended.

    [Learn more about authoring and starter keys](luis-how-to-azure-subscription.md#luis-resources). Both resources give you 1 million free authoring transactions and 1000 free prediction endpoint transactions.

    :::image type="content" source="media/sign-in/signup-landing-page.png" alt-text="Partial screen-shot to choose a type of Language Understanding authoring resource.":::

1. Use an existing authoring resource

    :::image type="content" source="media/sign-in/signup-choose-resource.png" alt-text="Choose authoring resource":::

    If you already have LUIS Authoring resources in your subscription and you associate one with your LUIS account during sign-in, choose the **Use existing Authoring Resource** option and provide the following information:

    * **Tenant** - the tenant your Azure subscription is associated with. You will not be able to switch tenants from the existing window. You can switch tenants by selecting the rightmost avatar, which contains your initials in the top bar.
    * **Subscription name** - the subscription that will be associated with the resource. If you have more than one subscription that belongs to your tenant, select the one you want from the drop-down list.
    * **Resource name** - The authoring resource you want you account to be associated to.

    > [!Note]
    > If the authoring resource that you are looking is greyed out in the dropdown list, this means that you have signed in to a different regional portal. [Understand the concept of regional portals](luis-reference-regions.md#luis-authoring-regions).

1. Create a new authoring resource

    :::image type="content" source="media/sign-in/signup-create-resource.png" alt-text="Create authoring resource":::

    When **creating a new authoring resource**, provide the following information:

    * **Tenant** - the tenant your Azure subscription is associated with. You will not be able to switch tenants from the existing window. You can switch tenants by selecting the rightmost avatar, which contains your initials in the top bar.
    * **Resource name** - a custom name you choose, used as part of the URL for your authoring transactions. Your resource name can only include alphanumeric characters, '-', and can’t start or end with '-'. If any other symbols are included in the name, creating a resource will fail.
    * **Subscription name** - the subscription that will be associated with the resource. If you have more than one subscription that belongs to your tenant, select the one you want from the drop-down list.
    * **Resource group** - a custom resource group name you choose in your subscription. Resource groups allow you to group Azure resources for access and management. If you currently do not have a resource group in your subscription, you will not be allowed to create one in the LUIS portal. Go to [Azure portal](https://ms.portal.azure.com/#create/Microsoft.ResourceGroup) to create one then go to LUIS to continue the sign-in process.

1. After your choose your path, it may take a couple of seconds until a sign that says "Your account has been successfully migrated appears. Finish by selecting **Continue**.

    :::image type="content" source="media/sign-in/signup-confirm-2.png" alt-text="Confirm authoring resource":::

    > [!Note]
    > If you have a subscription and at least one authoring resource in the region same as the one you are signing up to in the portal, you might automatically sign in to LUIS migrated and associated with a resource without the need of choosing which path to go in.


## Sign in with user account not associated with an Azure subscription

1. Sign in to [LUIS portal](https://www.luis.ai) and check that you agree to the terms of use.

1. Finish by selecting **Continue**. You will automatically sign in with a trial/starter key. This means that eventually you will be required to [migrate your account](luis-migration-authoring.md#migration-steps) and link your applications to an authoring resource. To undergo the migration process, you will need to sign in for an [Azure Free Trial](https://azure.microsoft.com/free/).

    :::image type="content" source="media/sign-in/signup-no-subscription.png" alt-text="No subscription scenario":::

## Troubleshooting

* If you create an authoring resource from the Azure portal in a different region than the portal you are signing in to, the authoring resource will be greyed out.
* When creating a new resource, make sure that the resource name only includes alphanumeric characters, '-', and can’t start or end with '-'. Otherwise, it will fail.
* Make sure that you have the [proper permissions on your subscription to create an Azure resource](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles). If you do not have the proper permissions, contact the admin of your subscription to give you sufficient permissions.

## Next steps

* Learn how to [start a new app](luis-how-to-start-new-app.md)
