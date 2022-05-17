---
title: Authoring and publishing data owner access policies
description: Step-by-step guide on how a data owner can author and publish access policies in Microsoft Purview
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 4/18/2022
---

# Authoring and publishing data owner access policies (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Access policies allow a data owner to delegate in Microsoft Purview access management to a data source. These policies can be authored directly in the Microsoft Purview governance portal, and after publishing, they get enforced by the data source. This tutorial describes how to create, update, and publish access policies in the Microsoft Purview governance portal.

## Prerequisites
[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

## Configuration
[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Data source configuration

Before authoring data policies in the Microsoft Purview governance portal, you'll need to configure the data sources so that they can enforce those policies.

1. Follow any policy-specific prerequisites for your source. Check the [Microsoft Purview supported data sources table](azure-purview-connector-overview.md#microsoft-purview-data-sources) and select the link in the **Access Policy** column for sources where access policies are available. Follow any steps listed in the Access policy or Prerequisites sections.
1. Register the data source in Microsoft Purview. Follow the **Prerequisites** and **Register** sections of the [source pages](azure-purview-connector-overview.md) for your resources.
1. [Enable the Data Use Management toggle on the data source](how-to-enable-data-use-management.md#enable-data-use-management). Additional permissions for this step are described in the linked document.

## Create a new policy

This section describes the steps to create a new policy in Microsoft Purview.

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

1. Select the **New Policy** button in the policy page.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-1.png" alt-text="Data owner can access the Policy functionality in Microsoft Purview when it wants to create policies.":::

1. The new policy page will appear. Enter the policy **Name** and **Description**.

1. To add policy statements to the new policy, select the **New policy statement** button. This will bring up the policy statement builder.

    :::image type="content" source="./media/access-policies-common/create-new-policy.png" alt-text="Data owner can create a new policy statement.":::

1. Select the **Effect** button and choose *Allow* from the drop-down list.

1. Select the **Action** button and choose *Read* or *Modify* from the drop-down list.

1. Select the **Data Resources** button to bring up the window to enter Data resource information, which will open to the right.

1. Under the **Data Resources** Panel do **one of two things** depending on the granularity of the policy:
    - To create a broad policy statement that covers an entire data source, resource group, or subscription that was previously registered, use the **Data sources** box and select its **Type**.
    - To create a fine-grained policy, use the **Assets** box instead. Enter the **Data Source Type** and the **Name** of a previously registered and scanned data source. See example in the image.

    :::image type="content" source="./media/access-policies-common/select-data-source-type.png" alt-text="Data owner can select a Data Resource when editing a policy statement.":::

1. Select the **Continue** button and transverse the hierarchy to select and underlying data-object (for example: folder, file, etc.).  Select **Recursive** to apply the policy from that point in the hierarchy down to any child data-objects. Then select the **Add** button. This will take you back to the policy editor.

    :::image type="content" source="./media/access-policies-common/select-asset.png" alt-text="Data owner can select the asset when creating or editing a policy statement.":::

1. Select the **Subjects** button and enter the subject identity as a principal, group, or MSI. Then select the **OK** button. This will take you back to the policy editor

    :::image type="content" source="./media/access-policies-common/select-subject.png" alt-text="Data owner can select the subject when creating or editing a policy statement.":::

1. Repeat the steps #5 to #11 to enter any more policy statements.

1. Select the **Save** button to save the policy.

Now that you have created your policy, you will need to publish it for it to become active.

## Publish a policy

A newly created policy is in the **draft** state. The process of publishing associates the new policy with one or more data sources under governance. This is called "binding" a policy to a data source.

The steps to publish a policy are as follows:

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Data owner can access the Policy functionality in Microsoft Purview when it wants to update a policy by selecting 'Data policies'.":::

1. The Policy portal will present the list of existing policies in Microsoft Purview. Locate the policy that needs to be published. Select the **Publish** button on the right top corner of the page.

    :::image type="content" source="./media/access-policies-common/publish-policy.png" alt-text="Data owner can publish a policy.":::

1. A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be published and then select the **Publish** button.

    :::image type="content" source="./media/access-policies-common/select-data-sources-publish-policy.png" alt-text="Data owner can select the data source where the policy will be published.":::

>[!Note]
> After making changes to a policy, there is no need to publish it again for it to take effect if the data source(s) continues to be the same.

## Update or delete a policy

Steps to update or delete a policy in Microsoft Purview are as follows.

1. Sign in to the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Data owner can access the Policy functionality in Microsoft Purview when it wants to update a policy.":::

1. The Policy portal will present the list of existing policies in Microsoft Purview. Select the policy that needs to be updated.

1. The policy details page will appear, including Edit and Delete options. Select the **Edit** button, which brings up the policy statement builder. Now, any parts of the statements in this policy can be updated. To delete the policy, use the **Delete** button.

    :::image type="content" source="./media/access-policies-common/edit-policy.png" alt-text="Data owner can edit or delete a policy statement.":::

## Next steps

For specific guides on creating policies, you can follow these tutorials:

- [Enable Microsoft Purview data owner policies on all data sources in a subscription or a resource group](./how-to-data-owner-policies-resource-group.md)
- [Enable Microsoft Purview data owner policies on an Azure Storage account](./how-to-data-owner-policies-storage.md)
