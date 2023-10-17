---
title: 'Create a shareable link for Azure Bastion'
description: Learn how to create a shareable link to let a user connect to a target resource via Bastion without using the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 05/10/2023
ms.author: cherylmc
---

# Create a shareable link for Bastion

The Bastion **Shareable Link** feature lets users connect to a target resource (virtual machine or virtual machine scale set) using Azure Bastion without accessing the Azure portal. This article helps you use the Shareable Link feature to create a shareable link for an existing Azure Bastion deployment.

When a user without Azure credentials clicks a shareable link, a webpage opens that prompts the user to sign in to the target resource via RDP or SSH. Users authenticate using username and password or private key, depending on what you have configured for the target resource. The shareable link does not contain any credentials - the admin must provide sign-in credentials to the user.

By default, users in your org will have only read access to shared links. If a user has read access, they'll only be able to use and view shared links, but can't create or delete a shareable link. For more information, see the [Permissions](#permissions) section of this article.

## Considerations

* Shareable Links isn't currently supported for peered VNETs across tenants. 
* Shareable Links isn't currently supported over Virtual WAN.
* Shareable Links does not support connection to on-premises or non-Azure VMs and VMSS. 
* The Standard SKU is required for this feature.
* Bastion only supports 50 requests, including creates and deletes, for shareable links at a time.
* Bastion only supports 500 shareable links per Bastion resource. 

## Prerequisites

* Azure Bastion is deployed to your VNet. See [Tutorial - Deploy Bastion using manual settings](tutorial-create-host-portal.md) for steps.

* Bastion must be configured to use the **Standard** SKU for this feature. You can update the SKU from Basic to Standard when you configure the shareable links feature.

* The VNet in which the Bastion resource is deployed or a directly peered VNet contains the VM resource to which you want to create a shareable link.

## Enable Shareable Link feature

Before you can create a shareable link to a VM, you must first enable the feature.

1. In the Azure portal, go to your bastion resource.

1. On your **Bastion** page, in the left pane, click **Configuration**.

   :::image type="content" source="./media/shareable-link/configuration-settings.png" alt-text="Screenshot of Configuration settings with shareable link selected." lightbox="./media/shareable-link/configuration-settings.png":::

1. On the **Configuration** page, for **Tier**, select **Standard** if it isn't already selected. This feature requires the **Standard SKU**.

1. Select **Shareable Link** from the listed features to enable the Shareable Link feature.

1. Verify that you've selected the settings that you want, then click **Apply**.

1. Bastion will immediately begin updating the settings for your bastion host. Updates will take about 10 minutes.

## Create shareable links

In this section, you specify each resource for which you want to create a shareable link

1. In the Azure portal, go to your bastion resource.

1. On your bastion page, in the left pane, click **Shareable links**. Click **+ Add** to open the **Create shareable link** page.

   :::image type="content" source="./media/shareable-link/add.png" alt-text="Screenshot shareable links page with + add." lightbox="./media/shareable-link/add.png":::

1. On the **Create shareable link** page, select the resources for which you want to create a shareable link. You can select specific resources, or you can select all. A separate shareable link will be created for each selected resource. Click **Apply** to create links.

   :::image type="content" source="./media/shareable-link/select-vm.png" alt-text="Screenshot of shareable links page to create a shareable link." lightbox="./media/shareable-link/select-vm.png":::

1. Once the links are created, you can view them on the **Shareable links** page. The following example shows links for multiple resources. You can see that each resource has a separate link and the link status is **Active**. To share a link, copy it, then send it to the user. The link doesn't contain authentication credentials.

   :::image type="content" source="./media/shareable-link/copy-link.png" alt-text="Screenshot of shareable links page to show all available resource links." lightbox="./media/shareable-link/copy-link.png":::

## Connect to a VM

1. After receiving the link, the user opens the link in their browser.

1. In the left corner, the user can select whether to see text and images copied to the clipboard. The user inputs the required information, then clicks **Login** to connect. A shared link doesn't contain authentication credentials. The admin must provide sign-in credentials to the user. Custom port and protocols are supported.

   :::image type="content" source="./media/shareable-link/login.png" alt-text="Screenshot of Sign-in to bastion using the shareable link in the browser." lightbox="./media/shareable-link/login.png":::

> [!NOTE]
> If a link is no longer able to be opened, this means that someone in your organization has deleted that resource. While you'll still be able to see the shared links in your list, it will no longer connect to the target resource and will lead to a connection error. You can delete the shared link in your list, or keep it for auditing purposes.
>

## Delete a shareable link

1. In the Azure portal, go to your **Bastion resource -> Shareable Links**.

1. On the **Shareable Links** page, select the resource link that you want to delete, then click **Delete**.

   :::image type="content" source="./media/shareable-link/delete.png" alt-text="Screenshot of selecting link to delete." lightbox="./media/shareable-link/delete.png":::

## Permissions

Permissions to the Shareable Link feature are configured using Access control (IAM). By default, users in your org will have only read access to shared links. If a user has read access, they'll only be able to use and view shared links, but can't create or delete a shared link.

To give someone permissions to create or delete a shared link, use the following steps:

1. In the Azure portal, go to the Bastion host.
1. Go to the **Access control (IAM)** page.
1. In the Microsoft.Network/bastionHosts section, configure the following permissions:

   * Other: Creates shareable urls for the VMs under a bastion and returns the URLs.
   * Other: Deletes shareable urls for the provided VMs under a bastion.
   * Other: Deletes shareable urls for the provided tokens under a bastion.

   These correspond to the following PowerShell cmdlets:

   * Microsoft.Network/bastionHosts/createShareableLinks/action
   * Microsoft.Network/bastionHosts/deleteShareableLinks/action
   * Microsoft.Network/bastionHosts/deleteShareableLinksByToken/action
   * Microsoft.Network/bastionHosts/getShareableLinks/action -  If this isn't enabled, the user won't be able to see a shareable link.

## Next steps

* For additional features, see [Bastion features and configuration settings](configuration-settings.md).
* For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)
