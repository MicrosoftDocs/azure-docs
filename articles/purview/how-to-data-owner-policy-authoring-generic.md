---
title: Authoring and publishing data owner access policies
description: Step-by-step guide on how a data owner can author and publish access policies in Azure Purview
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 2/2/2022
ms.custom:
---

# Authoring and publishing data owner access policies (Preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Access policies allow data owners to manage access to datasets from Azure Purview. Data owners can monitor and manage data use from within the Azure Purview Studio, without directly modifying the resource where the data is housed.

This tutorial describes how a data owner can create, update and publish access policies in Azure Purview.

## Prerequisites

### Required permissions

To register a data source, resource group, or subscription in Azure Purview with the *Data use Governance* option set (that is, with access policies), a user have **either one of the following** IAM role combinations on that resource:

- IAM *Owner*
- Both IAM *Contributor* + IAM *User Access Administrator*

Follow this [guide to configure Azure RBAC permissions](../role-based-access-control/check-access.md).

### Source configuration
To apply these policies to data sources in your environment, you'll need to configure your sources.

Check the [Azure Purview supported data sources table](azure-purview-connector-overview.md#azure-purview-data-sources) and select the link in the **Access Policy** column for sources where access policies are available.

Currently these are the supported sources:

- [Azure Blob Storage](register-scan-azure-blob-storage-source.md#access-policy)
- [Azure Data Lake Gen2](register-scan-adls-gen2.md#access-policy)

## Create policies for individual sources

To create an access policy for a resource, the resource will first need to be registered in Azure Purview.
Once you have your resource registered, follow the rest of the steps steps to enable an individual resource for access policy.

1. Follow the **Prerequisites** and **Register** sections of the source pages for your resources:

  - [Register and scan Azure Storage Blob - Azure Purview](register-scan-azure-blob-storage-source.md)
  - [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](register-scan-adls-gen2.md)

1. Go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to enable access policies for.

1. At the top of the source page, select **Edit source**.

1. Enable the data source for access policies in Azure Purview by setting the **Data use governance** toggle to **Enabled**, as shown in the image below.

    :::image type="content" source="./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Set Data use governance toggle to **Enabled** at the bottom of the menu.":::

> [!WARNING]
> **Known issues** related to source registration:
>
> - Moving data sources to a different resource group or subscription is not yet supported. If want to do that, de-register the data source in Azure Purview before moving it and then register it again after that happens.
> - Once a subscription gets disabled for *Data use governance* any underlying assets that are enabled for *Data use governance* will be disabled, which is the right behavior. However, policy statements based on those assets will still be allowed after that.

Now that you've enabled your resource for access policies, you can [create your access policies](#create-a-new-policy).

## Create policies for resource groups or subscriptions

A data owner can use Azure Purview to enable access to ALL data sources in a subscription or a resource group. This can be achieved through a single policy statement, and will cover all existing data sources, and data sources that are created afterwards.

To create a policy for a resource group, Azure Purview will need permissions to list resources in a subscription or group, then the subscription or group will need to be registered as a source.

To create an access policy across a resource group or subscription, follow these instructions:

[!INCLUDE [Permissions to list resources](./includes/authentication-to-enumerate-resources.md)]

1. To create an access policy for a resource group or subscription, the resource group or subscription will need to be registered as a source in Azure Purview. Follow the **Prerequisites** and **Register** sections for [multiple Azure sources in Azure Purview](register-scan-azure-multiple-sources.md).

1. Now that you have your resource group or subscription registered in Azure Purview, go to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to enable access policies for.

1. At the top of the source page, select **Edit source**.

1. Enable the data source for access policies in Azure Purview by setting the **Data use governance** toggle to **Enabled**, as shown in the image below.

   :::image type="content" source="./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Set Data use governance toggle to 'Enabled' at the bottom of the menu.":::

1. Enable the resource group or the subscription for access policies in Azure Purview by setting the **Data use governance** toggle to **Enabled**, as shown in the picture.

![Image shows how to register a resource group or subscription for policy.](./media/tutorial-data-owner-policies-resource-group/register-resource-group-for-policy.png)

>[!IMPORTANT]
>Make sure you write down the **Name** you use when registering in Azure Purview. You will need it when you publish a policy. The recommended practice is to make the registered name exactly the same as the endpoint name.

Now that you've enabled your resource for access policies, you can [create your access policies](#create-a-new-policy).

## Disable policies

To disable access policies for a source, resource group, or subscription, a user needs to either be a data source **Owner** or an Azure Purview **Data source admin**. Once you have those permissions follow these steps:

1. Remove the source from any currently existing access policies. If the source is listed in any current policies, you won't be able to disable it.

1. Then, to disable the source, select the **Data map** tab in the left menu.

1. Select the **Sources** tab in the left menu.

1. Select the source you want to disable access policies for.

1. At the top of the source page, select **Edit source**.

1. Enable the data source for access policies in Azure Purview by setting the **Data use governance** toggle to **Disabled**, as shown in the image below.

>[!NOTE]
> Disabling **Data use governance** for a subscription will disable it also for all assets registered in that subscription.

## Create a new policy

This section describes the steps to create a new policy in Azure Purview.

1. Sign in to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

1. Select the **New Policy** button in the policy page.

:::image type="content" source="./media/access-policies-common/policy-onboard-guide-1.png" alt-text="Data owner can access the Policy functionality in Azure Purview when it wants to create policies.":::

1. The new policy page will appear. Enter the policy **Name** and **Description**.

1. To add policy statements to the new policy, select the **New policy statement** button. This will bring up the policy statement builder.

    :::image type="content" source="./media/access-policies-common/create-new-policy.png" alt-text="Data owner can create a new policy statement.":::

1. Select the **Effect** button and choose *Allow* from the drop-down list.

1. Select the **Action** button and choose *Read* or *Modify* from the drop-down list.

1. Select the **Data Resources** button to bring up the window to enter Data resource information, which will open to the right.

1. Under the **Data Resources** Panel do one of two things depending on the granularity of the policy:
    - To create a broad policy statement that covers an entire data source, resource group, or subscription that was previously registered, use the **Data sources** box and select its **Type**.
    - To create a fine-grained policy, use the **Assets** box instead. Enter the **Data Source Type** and the **Name** of a previously registered and scanned data source. See example in the image.

    :::image type="content" source="./media/access-policies-common/select-data-source-type.png" alt-text="Data owner can select a Data Resource when editing a policy statement.":::

1. Select the **Continue** button and transverse the hierarchy to select and underlying data-object (for example: folder, file, etc.).  Select **Recursive** to apply the policy from that point in the hierarchy down to any child data-objects. Then select the **Add** button. This will take you back to the policy editor.

    :::image type="content" source="./media/access-policies-common/select-asset.png" alt-text="Data owner can select the asset when creating or editing a policy statement.":::

1. Select the **Subjects** button and enter the subject identity as a principal, group, or MSI. Then select the **OK** button. This will take you back to the policy editor

    :::image type="content" source="./media/access-policies-common/select-subject.png" alt-text="Data owner can select the subject when creating or editing a policy statement.":::

1. Repeat the steps #5 to #11 to enter any more policy statements.

1. Select the **Save** button to save the policy

## Update or delete a policy

Steps to create a new policy in Azure Purview are as follows.

1. Sign in to Azure Purview Studio.

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Data owner can access the Policy functionality in Azure Purview when it wants to update a policy.":::

1. The Policy portal will present the list of existing policies in Azure Purview. Select the policy that needs to be updated.

1. The policy details page will appear, including Edit and Delete options. Select the **Edit** button, which brings up the policy statement builder. Now, any parts of the statements in this policy can be updated. To delete the policy, use the **Delete** button.

    :::image type="content" source="./media/access-policies-common/edit-policy.png" alt-text="Data owner can edit or delete a policy statement.":::

## Publish the policy

A newly created policy is in the draft state. The process of publishing associates the new policy with one or more data sources under governance. This is called "binding" a policy to a data source.

The steps to publish a policy are as follows

1. Sign in to Azure Purview Studio.

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Data owner can access the Policy functionality in Azure Purview when it wants to update a policy by selecting 'Data policies'.":::

1. The Policy portal will present the list of existing policies in Azure Purview. Locate the policy that needs to be published. Select the **Publish** button on the right top corner of the page.

    :::image type="content" source="./media/access-policies-common/publish-policy.png" alt-text="Data owner can publish a policy.":::

1. A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be published and then select the **Publish** button.

    :::image type="content" source="./media/access-policies-common/select-data-sources-publish-policy.png" alt-text="Data owner can select the data source where the policy will be published.":::

>[!Note]
> After making changes to a policy, there is no need to publish it again for it to take effect if the data source(s) continues to be the same.

## Data use governance best practices

- We highly encourage registering data sources for *Data use governance* and managing all associated access policies in a single Azure Purview account.
- Should you have multiple Azure Purview accounts, be aware that **all** data sources belonging to a subscription must be registered for *Data use governance* in a single Azure Purview account. That Azure Purview account can be in any subscription in the tenant. The *Data use governance* toggle will become greyed out when there are invalid configurations. Some examples of valid and invalid configurations follow in the diagram below:
  - **Case 1** shows a valid configuration where a Storage account is registered in an Azure Purview account in the same subscription.
  - **Case 2** shows a valid configuration where a Storage account is registered in an Azure Purview account in a different subscription.
  - **Case 3** shows an invalid configuration arising because Storage accounts S3SA1 and S3SA2 both belong to Subscription 3, but are registered to different Azure Purview accounts. In that case, the *Data use governance* toggle will only work in the Azure Purview account that wins and registers a data source in that subscription first. The toggle will then be greyed out for the other data source.

    :::image type="content" source="./media/access-policies-common/valid-and-invalid-configurations.png" alt-text="Diagram shows valid and invalid configurations when using multiple Azure Purview accounts to manage policies.":::

## Next steps

Check blog, demo and related tutorials

- [Demo of data owner access policies for Azure Storage](https://www.youtube.com/watch?v=CFE8ltT19Ss)
- [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./tutorial-data-owner-policies-resource-group.md)
- [Enable Azure Purview data owner policies on an Azure Storage account](./tutorial-data-owner-policies-storage.md)
