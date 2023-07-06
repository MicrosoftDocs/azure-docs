---
title: "Attach/detach a compute gallery to a lab plan"
titleSuffix: Azure Lab Services
description: This article describes how to attach or detach an Azure compute gallery to a lab plan in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/01/2023
---

# Attach or detach an Azure compute gallery to a lab plan in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows how to attach or detach an Azure compute gallery to a lab plan. If you use a lab account, see how to [attach or detach a compute gallery to a lab account](how-to-attach-detach-shared-image-gallery-1.md).

> [!IMPORTANT]
> To show a virtual machine image in the list of images during lab creation, you need to replicate the compute gallery image to the same region as the lab plan. You need to manually [replicate images](../virtual-machines/shared-image-galleries.md) to other regions in the compute gallery.

Saving images to a compute gallery and replicating those images incurs extra cost. This cost is separate from the Azure Lab Services usage cost. Learn more about [Azure Compute Gallery pricing](../virtual-machines/azure-compute-gallery.md#billing).

## Prerequisites

- To change settings for the lab plan, your Azure account needs the [Owner](/azure/role-based-access-control/built-in-roles#owner), [Contributor](/azure/role-based-access-control/built-in-roles#contributor), or [Lab Services Contributor](/azure/role-based-access-control/built-in-roles#lab-services-contributor) role on the lab plan. Learn more about the [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md).

- To attach an Azure compute gallery to a lab plan, your Azure account needs to have the following permissions:

    | Azure role | Scope | Note |
    | ---- | ----- | ---- |
    | [Owner](/azure/role-based-access-control/built-in-roles#owner) | Azure compute gallery | If you attach an existing compute gallery. |
    | [Owner](/azure/role-based-access-control/built-in-roles#owner) | Resource group | If you create a new compute gallery. |

- If your Azure account is a guest user in Azure Active Directory, your Azure account needs to have the [Directory Readers](/azure/active-directory/roles/permissions-reference#directory-readers) role to attach an existing compute gallery.

Learn how to [assign an Azure role in Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/role-assignments-steps#step-5-assign-role).

## Scenarios

Here are a couple of scenarios supported by attaching a compute gallery.

- A lab plan admin attaches a compute gallery to the lab plan. An image is uploaded to the compute gallery outside the context of a lab. The image is enabled on the lab plan by the lab plan admin. Then, lab creators can use that image from the compute gallery to create labs.
- A lab plan admin attaches a compute gallery to the lab plan. A lab creator (educator) saves the customized image of their lab to the compute gallery. Then, other lab creators can select this image from the compute gallery to create a template for their labs.

When you [save a template image of a lab](how-to-use-shared-image-gallery.md#save-an-image-to-a-compute-gallery) in Azure Lab Services, the image is uploaded to the compute gallery as a specialized image. [Specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) keep machine-specific information and user profiles. You can still directly upload a generalized image to the gallery outside of Azure Lab Services.

A lab creator can create a template VM based on both generalized and specialized images in Azure Lab Services.

> [!IMPORTANT]
> While using an Azure compute gallery, Azure Lab Services supports only images that use less than 128 GB of disk space on their OS drive. Images with more than 128 GB of disk space or multiple disks won't be shown in the list of virtual machine images during lab creation.

## Attach a new compute gallery to a lab plan

1. Open your lab plan in the [Azure portal](https://portal.azure.com).

1. Select **Azure compute gallery** on the menu.

1. Select the **Create Azure compute gallery** button.  

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/no-gallery-create-new.png" alt-text="Screenshot of the Create Azure compute gallery button.":::

1. In the **Create Azure compute gallery** window, enter a **name** for the gallery, and then select **Create**.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/create-azure-compute-gallery-window.png" alt-text="Screenshot of the Create compute gallery window." lightbox="./media/how-to-attach-detach-shared-image-gallery/create-azure-compute-gallery-window.png":::

Azure Lab Services creates the compute gallery and attaches it to the lab plan. All labs created using this lab plan can now use images from the attached compute gallery.

In the bottom pane, you see images in the compute gallery. There are no images in this new gallery. When you upload images to the gallery, you see them on this page.

:::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attached-gallery-empty-list.png" alt-text="Screenshot of the attached image gallery list of images." lightbox="./media/how-to-attach-detach-shared-image-gallery/attached-gallery-empty-list.png":::

## Attach an existing compute gallery to a lab plan

If you already have an Azure compute gallery, you can also attach it to your lab plan. To attach an existing compute gallery, you first need to grant the Azure Lab Services service principal permissions to the compute gallery. Next, you can attach the existing compute gallery to your lab plan.

### Configure compute gallery permissions

The Azure Lab Services service principal needs to have the [Owner](/azure/role-based-access-control/built-in-roles#owner) Azure RBAC role on the Azure compute gallery. There are two Azure Lab Services service principals:

| Name | Application ID | Description |
| ---- | ----- | ---- |
| Azure Lab Services | c7bb12bf-0b39-4f7f-9171-f418ff39b76a | Service principal for Azure Lab Services lab plans (V2). |
| Azure Lab Services | 1a14be2a-e903-4cec-99cf-b2e209259a0f | Service principal for Azure Lab Services lab accounts (V1). |

To attach a compute gallery to a lab plan, assign the [Owner](/azure/role-based-access-control/built-in-roles#owner) role to the service principal with application ID `c7bb12bf-0b39-4f7f-9171-f418ff39b76a`.

If your Azure account is a guest user, your Azure account needs to have the [Directory Readers](/azure/active-directory/roles/permissions-reference#directory-readers) role to perform the role assignment. Learn about [role assignments for guest users](/azure/role-based-access-control/role-assignments-external-users#guest-user-cannot-browse-users-groups-or-service-principals-to-assign-roles).

# [Azure CLI](#tab/azure-cli)

Follow these steps to grant permissions to the Azure Lab Services service principal by using the Azure CLI:

1. Open [Azure Cloud Shell](https://shell.azure.com). Alternately, select the **Cloud Shell** button on the menu bar at the upper right in the [Azure portal](https://portal.azure.com).

    Azure Cloud Shell is an interactive, authenticated, browser-accessible terminal for managing Azure resources. Learn how to get started with [Azure Cloud Shell](/azure/cloud-shell/quickstart).

1. Enter the following commands in Cloud Shell:
 
    1. Select the service principal object ID, based on the application ID:

        ```azurecli-interactive
        az ad sp show --id c7bb12bf-0b39-4f7f-9171-f418ff39b76a --query "id" -o tsv
        ```

    1. Select the ID of the compute gallery, based on the gallery name:

        ```azurecli-interactive
        az sig show --gallery-name <gallery-name> --resource-group <gallery-resource-group> --query id -o tsv
        ```

        Replace the text placeholders *`<gallery-name>`* and *`<gallery-resource-group>`* with the compute gallery name and the name of the resource group that contains the compute gallery. Make sure to remove the angle brackets when replacing the text.

    1. Assign the Owner role to service principal on the compute gallery:

        ```azurecli-interactive
        az role assignment create --assignee-object-id <service-principal-object-id> --role Owner --scope <gallery-id>
        ```

        Replace the text placeholders *`<service-principal-object-id>`* and *`<gallery-id>`* with the outcomes of the previous commands.

# [Azure portal](#tab/portal)

When you add a role assignment in the Azure portal, the user interface shows the *object ID* of the service principal, which is different from the *application ID*. The object ID for a service principal is different in each Azure subscription. Learn more about [Service principal objects](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

Follow these steps to grant permissions to the Azure Lab Services service principal by using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top, enter *Enterprise applications*, and select **Enterprise applications** from the services list.
1. On the **All applications** page, remove the **Application type** filter, and enter *c7bb12bf-0b39-4f7f-9171-f418ff39b76a* in the **Application ID starts with** filter.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/lab-services-enterprise-applications.png" alt-text="Screenshot that shows the list of enterprise applications in the Azure portal, highlighting the application ID filter." lightbox="./media/how-to-attach-detach-shared-image-gallery/lab-services-enterprise-applications.png":::

1. Note the **Object ID** value of the Azure Lab Services service principal.
1. Go to your Azure compute gallery resource.
1. Select **Access control (IAM)**, and then select **Add** > **Add role assignment**.
1. On the **Role** page, select the **Owner** role from the list.
1. On the **Members** page, select **Select members**.
1. Enter *Azure Lab Services** in the search box, select both items, and then select **Select**.
1. In the **Add role assignment** page, remove the item that doesn't match the object ID of the Azure Lab Services service principal.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/compute-gallery-add-role-assignment.png" alt-text="Screenshot that shows the add role assignment page for the compute gallery in the Azure portal." lightbox="./media/how-to-attach-detach-shared-image-gallery/compute-gallery-add-role-assignment.png":::

1. On the **Review + Assign** page, select **Review + assign** to add the role assignment to the compute gallery.

---

Learn more about how to [assign an Azure role in Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/role-assignments-steps#step-5-assign-role).

### Attach the compute gallery

The following procedure shows you how to attach an existing compute gallery to a lab plan.

1. Open your lab plan in the [Azure portal](https://portal.azure.com).

1. Select **Azure compute gallery** on the menu.

1. Select the **Attach existing gallery** button.  

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/no-gallery-attach-existing.png" alt-text="Screenshot of the Attach existing gallery button.":::

1. On the **Attach an existing compute gallery** page, select your compute gallery, and then select the **Select** button.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attach-existing-compute-gallery.png" alt-text="Screenshot of the Azure compute gallery page for a lab plan when the gallery is attached.":::

All labs created using this lab plan can now use images from the attached compute gallery.

## Enable and disable images

All images in the attached compute gallery are disabled by default.

To enable or disable images from a compute gallery:

1. Check the VM images in the list.

1. Select **Enable image** or **Disable image**, to enable or disable the images.

1. Select **Apply** to confirm the action.

    :::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/enable-attached-gallery-image.png" alt-text="Screenshot that shows how to enable an image for an attached compute gallery.":::

## Detach a compute gallery

To detach a compute gallery from your lab, select **Detach** on the toolbar. Confirm the detach operation.  

:::image type="content" source="./media/how-to-attach-detach-shared-image-gallery/attached-gallery-detach.png" alt-text="Screenshot of how to detach the compute gallery from the lab plan.":::

Only one Azure compute gallery can be attached to a lab plan. To attach another compute gallery, follow the steps to [attach an existing compute gallery](#attach-an-existing-compute-gallery-to-a-lab-plan).

## Next steps

To learn how to save a template image to the compute gallery or use an image from the compute gallery, see [How to use a compute gallery](how-to-use-shared-image-gallery.md).

To explore other options for bringing custom images to compute gallery outside of the context of a lab, see [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

For more information about compute galleries in general, see [compute gallery](../virtual-machines/shared-image-galleries.md).