---
title: Azure API Management workspaces preview - migration required (Dec 2024) | Microsoft Docs
description: Azure API Management is removing support for preview workspaces. If your service uses workspaces preview, migrate your workspaces to the latest version.
services: api-management 
author: dlepow
ms.service: api-management
ms.topic: concept-article
ms.date: 07/08/2024
ms.author: danlep
---

# Workspaces preview - Migration required (December 2024)

[!INCLUDE [api-management-availability-premium-dev-standard](../../../includes/api-management-availability-premium-dev-standard.md)]

Azure API Management [workspaces](../workspaces-overview.md) are now generally available, and we introduced several feature updates with that release. As part of our continued development of workspaces, we're removing support for preview workspaces (created before API version 2023-09-01). If you created preview workspaces in Azure API Management and want to continue using them, you need to migrate your workspaces to the generally available version. 

After 31 December 2024, your preview workspaces and APIs managed in them may stop working if you haven't migrated to the latest workspace capabilities. APIs and resources managed outside workspaces aren't affected by this change.

## Is my service affected by these changes?

Your service may be affected by these changes if you created preview workspaces in your API Management instance. This feature is currently available in the **Premium** service tier.

## Breaking changes

The following are breaking changes that require you to take action to migrate your preview workspaces to the generally available version:

* **Dedicated gateway** - Each workspace must be associated with a dedicated API gateway that isolates the workspace's runtime traffic. In preview, workspaces shared a gateway with the service.
* **Service-level managed identities not supported** - To improve the security of workspaces, system-assigned and user-assigned managed identities enabled at the service level can't be used in workspaces. Related API Management features that depend on managed identities, such as storing named values and certificates in Azure Key Vault, are also not supported in workspaces.

> [!NOTE]
> These breaking changes are in addition to the [June 2024 breaking changes](workspaces-breaking-changes-june-2024.md) for preview workspaces that were announced previously.

## What is the deadline for the change?

The breaking changes will be enforced in preview workspaces after 31 December 2024. We strongly recommend that you make all required changes to the configuration of your preview workspaces before that date.

## What do I need to do?

If your workspaces are affected by these changes, you need to migrate your workspaces to align with the generally available capabilities. The following sections provide guidance on how to migrate your workspaces.

### Use Premium tier for your API Management instance

Ensure that your API Management instance is running in the **Premium** tier to continue using workspaces. As announced [previously](workspaces-breaking-changes-june-2024.md), if your instance is in the **Standard** or **Developer** tier and you're using preview workspaces, you need to upgrade to the **Premium** tier.

### Confirm the region for your instance

Adding a dedicated gateway to a workspace requires that the gateway is in the same region as your instance. Currently, workspace gateways are supported in a [subset of regions](../workspaces-overview.md#supported-gateway-features) in which API Management instances can run.

To determine if your preview workspaces are in a supported region:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Workspaces**.
1. If your workspaces are in a region that doesn't supports workspace gateways, you'll see a message in the portal similar to "Workspaces are currently unavailable in the region of your API Management service". 
    * If you see this message, you can [move your API Management instance](../api-management-howto-migrate.md) to a supported region.
    * If you don't see this message, your workspace is in a supported region and you can proceed to add a dedicated gateway.

### Add a dedicated gateway to your workspaces

The following are abbreviated steps to add a dedicated gateway to a workspace. For gateway networking options, prerequisites, and detailed instructions, see [Create and manage a workspace](../how-to-create-workspace.md).

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **Workspaces**.
1. Select a workspace.
1. In the left menu, under **Deployment + infrastructure**, select **Gateways** > **+ Add**.
1. Complete the wizard to create a gateway. Provisioning of the gateway may take 2 hours or longer.
1. After your gateway is provisioned, go to the gateway's **Overview** page. Note the value of **Runtime hostname**. You use this value to update your client apps that call your workspace's APIs.
1. Repeat the preceding steps for your remaining workspaces.


### Update client apps to use the new gateway hostname

After you add a dedicated gateway to your workspace, you need to update your client apps that call the workspace's APIs to use the new gateway hostname instead of the gateway hostname of your API Management instance. 

> [!NOTE]
> * To help you migrate your workspaces, APIs in workspaces can still be accessed at runtime through October 2024 using the gateway hostname of your API Management instance. After October 2024, you must use the gateway hostname of the workspace. We strongly recommend that you complete migration before this date.
> * If your workspace gateways are in internal virtual networks (that is, they're configured with private inbound access and private outbound access), make sure that connectivity to your API Management instance's built-in gateway is also secured.

### Update dependencies on service-level managed identities

If you're using service-level managed identities in the configuration of workspace entities (for example, named values or certificates), you need to update the configurations. Recommended steps vary depending on the entity. Example: Update named values to use secret values instead of secrets stored in Azure Key Vault.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## More information

* [Workspaces overview](../workspaces-overview.md)
* [Workspaces preview breaking changes (June 2024)](workspaces-breaking-changes-june-2024.md)

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
