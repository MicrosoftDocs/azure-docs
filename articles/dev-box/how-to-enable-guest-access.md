---
title: Enable guest user access to dev boxes
titleSuffix: Microsoft Dev Box
description: Learn how to configure Microsoft Dev Box so that guest users from other Microsoft Entra tenants can create and connect to dev boxes.
ms.service: dev-box
ms.topic: how-to
ms.custom: public-preview, awp-ai
ai-usage: ai-assisted
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/01/2026

#Customer intent: As a platform engineer, I want to enable guest user access so that external collaborators from other tenants can use dev boxes in my projects.
---

# Enable guest user access to dev boxes (preview)

In this article, you learn how to configure Microsoft Dev Box so that guest users from other Microsoft Entra tenants can create and connect to dev boxes. Guest user access uses Microsoft Entra B2B collaboration to invite external users into your tenant and assign them Dev Box roles.

For example, if your organization works with external contractors or partner teams who have their own Microsoft Entra tenants, you can invite them as guest users and give them access to dev boxes in your projects.

> [!IMPORTANT]
> Guest user access for Microsoft Dev Box is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you begin, make sure you have the following prerequisites in place:

- An Azure account with an active subscription.
- A [dev center with at least one project](quickstart-configure-dev-box-service.md) configured in Microsoft Dev Box.
- Permission to [invite guest users](/entra/external-id/add-users-administrator) in your Microsoft Entra tenant.
- An [image definition](how-to-configure-team-customizations.md) that uses a **Windows 11 Enterprise, version 24H2 or later** base image with the **2025-09 Cumulative Update for Windows 11 (KB5065789)** or later installed.
- A dev box pool with [single sign-on (SSO) enabled](how-to-enable-single-sign-on.md). SSO is required for guest user access.

## Register for the preview

During the public preview, you must provide your tenant ID and dev center ID to Microsoft to enable guest user access.

### Find your tenant ID

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **Tenant properties**. In the list of results, select **Tenant properties**.

1. On the **Tenant properties** page, find the **Tenant ID** field and copy the value.

### Find your dev center resource ID

1. In the Azure portal, in the search box, enter **Dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you want to use for guest user access.

1. On the dev center's **Overview** page, select **Properties**.

1. Find the **Resource ID** field and copy the value.

### Submit your details to Microsoft

Contact your Microsoft support representative to submit your tenant ID and dev center resource ID and request that guest user access be enabled for your dev center. You can submit a support ticket to contact your representative. For more information about creating support requests, see: [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

After Microsoft confirms that your tenant is enabled, you can proceed with the remaining steps.

## Create an image definition with a supported image

Guest user access requires an image definition that uses a Windows 11 Enterprise base image, version 24H2 or later, with specific cumulative updates installed.

1. Create or update an image definition with a base image that meets these requirements:

   | Requirement | Value |
   |---|---|
   | **Operating system** | Windows 11 Enterprise |
   | **Version** | 24H2 or later |
   | **Cumulative update** | 2025-09 Cumulative Update for Windows 11 (KB5065789) or later |

1. Verify that the base image in your image definition includes the required update. You can use a marketplace image that already includes the update, or prepare a custom image. For more information on creating image definitions, see [Configure team customizations](how-to-configure-team-customizations.md).

## Create a pool with SSO enabled

Guest user access requires single sign-on (SSO) to be enabled on the dev box pool.

1. Create a new dev box pool or update an existing pool to enable SSO. For the detailed steps, see [Enable single sign-on for dev boxes](how-to-enable-single-sign-on.md).

1. Assign the image definition with the supported image to the pool.

After you enable SSO on the pool, new dev boxes created from the pool support guest user access.

## Invite guest users and assign roles

To give external users access to dev boxes, first invite them as guest users in your Microsoft Entra tenant, and then assign them the Dev Box User role on the project.

1. Invite external users as guests in your Microsoft Entra tenant. For detailed steps, see [Add B2B collaboration users in the Azure portal](/entra/external-id/add-users-administrator).

1. After the guest users accept the invitation and appear in your directory, assign them the **DevCenter Dev Box User** role at the project level. For detailed steps, see [Configure access to Microsoft Dev Box projects](how-to-manage-dev-box-access.md).

After you assign the role, guest users can create dev boxes from the pools in that project.

> [!NOTE]
> If the guest user's dev box was recently created, it can take up to 30 minutes before the dev box appears in the developer portal or Windows App.

## Connect to a dev box as a guest user

Guest users can connect to their dev boxes by using the Windows App or the developer portal. Because the dev box is in a different tenant from the guest user's home tenant, the guest user must switch to the resource tenant before connecting.

### Connect by using the Windows App

To connect to a dev box in a resource tenant by using the Windows App:

1. Make sure you have Windows App version **2.0.804.0 or later** installed. [Download Windows App](https://apps.microsoft.com/detail/9n1f85v9t8bn?hl=en-us&gl=US).

1. Open Windows App. On the sign-in or account picker window, select **Use another account**.

1. Select **Sign-in Options** > **Sign in to an organization**.

1. Enter the domain name of the resource tenant. To find your domain name, in the Azure portal, search for **Domain names** under Microsoft Entra ID.

1. Follow the sign-in prompts to complete authentication.

1. After you sign in, select the **Profile** icon and select the target tenant.

1. Find your dev box in the list. The dev box might appear as a Windows 365 device.

1. Select **Connect** to connect to the dev box.

### Connect by using the developer portal

To connect to a dev box in a resource tenant by using the developer portal:

1. Go to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).

1. In the upper right corner, select the **tenant arrow** next to your account name.

1. Select the tenant in which you're a guest.

1. Find your dev box and select **Connect**.

## Limitations

The following limitations apply during the public preview:

- You must register your tenant and dev center with Microsoft before you can use guest user access.
- The image definition must use a Windows 11 Enterprise 24H2 or later base image with the 2025-09 Cumulative Update (KB5065789) or later.
- SSO must be enabled on the pool.
- Windows App version 2.0.804.0 or later is required for connecting through the Windows App.

## Troubleshooting

| Issue | Resolution |
|---|---|
| Dev box doesn't appear in the developer portal or Windows App after creation. | Wait up to 30 minutes for the dev box to become visible. |
| Can't connect to the dev box. | Verify that SSO is enabled on the pool and that the image definition uses a supported base image. |
| Sign-in fails in Windows App. | Make sure you're using Windows App version 2.0.804.0 or later. Use the **Sign in to an organization** flow and enter the correct domain name. |
| Guest user can't see the project or pools. | Confirm the user was invited as a guest in the tenant and assigned the **DevCenter Dev Box User** role at the project level. |

## Related content

- [Configure access to Microsoft Dev Box projects](how-to-manage-dev-box-access.md)
- [Enable single sign-on for dev boxes](how-to-enable-single-sign-on.md)
- [Configure team customizations](how-to-configure-team-customizations.md)
- [Add B2B collaboration users in the Azure portal](/entra/external-id/add-users-administrator)
