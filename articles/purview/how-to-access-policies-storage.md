---
title: Data access policy provisioning for Azure Storage
description: Step-by-step guide on how to integrate Azure Storage into Azure Purview access policies and allow data owners to build access policies.
author: vlrodrig
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 11/15/2021
ms.custom: ignite-fall-2021
---

# Dataset provisioning by data owner for Azure Storage (preview)

## Supported capabilities
This guide describes how to configure Azure Storage to enforce data access policies created and managed from Azure Purview. The Azure Purview policy authoring supports the following capabilities:
-   Data access policies to control access to data stored in Blob or Azure Data Lake Storage (ADLS) Gen2

> [!IMPORTANT]
> These capabilities are currently in preview. This preview version is provided without a service level agreement, and should not be used for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Best practices
- We highly encourage you to register all data sources for use governance and manage all associated access policies from a single Azure Purview account.
- If you want to use multiple Purview accounts, be aware of these valid and invalid configurations. In the diagram below:
    - **Case 1** shows a valid configuration where a Storage account is being registered in a Purview account in the same subscription.
    - **Case 2** shows a valid configuration where a Storage account is being registered in a Purview account in a different subscription. 
    - **Case 3** shows an invalid configuration arising because Storage accounts S3SA1 and S3SA2 both belong to Subscription 3, but are being registered to different Purview accounts. 

:::image type="content" source="./media/how-to-access-policies-storage/valid-and-invalid configurations.png" alt-text="Diagram shows valid and invalid configurations when using multiple Purview accounts to manage policies.":::


## Prerequisites
>[!Note]
> The access policy feature is only available on **new** Azure Purview and Azure Storage accounts.
- Create a new or use an existing isolated test subscription. You can [follow this guide to create one](../cost-management-billing/manage/create-subscription.md).
- Create a **new** Purview account. You can [follow our quick-start guide to create one](create-catalog-portal.md).
- Create a **new** Azure Storage account in one of the regions listed below. You can [follow this guide to create one](../storage/common/storage-account-create.md).

[!INCLUDE [policy regions and enablement](./includes/storage-policy-regions.md)]

## Configuration

### Enable access policy enforcement for the Azure Storage account
The following PowerShell commands need to be executed in the subscription where the Azure Storage account resides. This will cover all Azure Storage accounts in that subscription.

```powershell
# Install the Az module
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
# Login into the subscription
Connect-AzAccount -Subscription <SubscriptionID>
# Register the feature
Register-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage
```
If the output of the last command shows value of “RegistrationState” as “Registered”, then your subscription is enabled for this functionality.

### Opt in to participate in Azure Purview data use policy preview
This functionality is currently in preview. You will need to [Opt in to Purview data use policies preview](https://aka.ms/opt-in-data-use-policy)

### Register Purview as a resource provider in other subscriptions
Execute this step only if the Storage account you want to manage access to is in a different subscription from the one used for the Azure Purview account. Register Azure Purview as a resource provider in the subscription for the Azure Storage account by following this guide:  
[Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md)

### Configure permissions for policy management actions
- User needs to have role *Owner* in the Azure Storage account to register this source for *Data use Governance* in Azure Purview. [You can follow this guide to configure this permission](../role-based-access-control/check-access.md)
- User needs to be member of Purview *Data source admins* role at the root collection level to register a source for *Data use governance*.
- User needs to be member of Purview *Policy authors* role at root collection level to perform policy authoring/management actions.
- User needs to be member of Purview *Data source admin* role at the root collection level to publish the policy.

>[!NOTE]
> Both Azure Storage *Owner* or Purview *Data source admin* can independently de-register the source for Data use governance.

See the section on managing role assignments for Purview in this guide: [How to create and manage collections](how-to-create-and-manage-collections.md)

In addition to these, see "Known issues" section at the bottom of this document.

### Register and scan data sources in Purview
Register and scan each data source with Purview to later define access policies. You can follow these guides:

-   [Register and scan Azure Storage Blob - Azure Purview](register-scan-azure-blob-storage-source.md)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](register-scan-adls-gen2.md)

During registration, enable the data source for access policy through the **Data use governance** toggle, as shown in the picture

:::image type="content" source="./media/how-to-access-policies-storage/register-data-source-for-policy.png" alt-text="Image shows how to register a data source for policy.":::

> [!NOTE]
> The behavior of the toggle will enforce that all the data sources in the same subscription can only be registered for data use governance in a single Purview account. That Purview account itself could be in any subscription in the tenant.



## Policy authoring

This section describes the steps for creating, updating, and publishing Purview access policies.

### Create a new policy

This section describes the steps to create a new policy in Azure Purview.

1. Log in to Purview portal.

1. Navigate to **Policy management** app using the left side panel.

1. Select the **New Policy** button in the policy page.

    :::image type="content" source="./media/how-to-access-policies-storage/policy-onboard-guide-1.png" alt-text="Image shows how a data owner can access the Policy functionality in Azure Purview when it wants to create policies.":::

1. The new policy page will appear. Enter the policy **Name** and **Description**.

1. To add policy statements to the new policy, select the **New policy statement** button. This will bring up the policy statement builder.

    :::image type="content" source="./media/how-to-access-policies-storage/create-new-policy-storage.png" alt-text="Image shows how a data owner can create a new policy statement.":::

1. Select the **Action** button and choose Read or Modify from the drop-down list.

1. Select the **Effect** button and choose Allow from the drop-down list.

1. Select the **Data Resources** button to bring up the options to provide the data asset path

1. In the **Assets** box, enter the **Data Source Type** and select the **Name** of a previously registered data source.

    :::image type="content" source="./media/how-to-access-policies-storage/select-data-source-type-storage.png" alt-text="Image shows how a data owner can select a Data Resource when editing a policy statement.":::

1. Select the **Continue** button and transverse the hierarchy to select the folder or file. Then select the **Add** button. This will take you back to the policy editor.

    :::image type="content" source="./media/how-to-access-policies-storage/select-asset-storage.png" alt-text="Image shows how a data owner can select the asset when creating or editing a policy statement.":::

1. Select the **Subjects** button and enter the subject identity as a principal, group, or MSI. Then select the **OK** button. This will take you back to the policy editor

    :::image type="content" source="./media/how-to-access-policies-storage/select-subject.png" alt-text="Image shows how a data owner can select the subject when creating or editing a policy statement.":::

1. Repeat the steps #5 to #11 to enter any more policy statements.

1. Select the **Save** button to save the policy

### Update or delete a policy

Steps to create a new policy in Purview are as follows.

1. Log in to Purview portal.

1. Navigate to Purview policy app using the left side panel.

    :::image type="content" source="./media/how-to-access-policies-storage/policy-onboard-guide-2.png" alt-text="Image shows how a data owner can access the Policy functionality in Azure Purview when it wants to update a policy.":::

1. The Policy portal will present the list of existing policies in Purview. Select the policy that needs to be updated.

1. The policy details page will appear, including Edit and Delete options. Select the **Edit** button, which brings up the policy statement builder for the statements in this policy. Now, any parts of the statements in this policy can be updated. To delete the policy, use the **Delete** button.

    :::image type="content" source="./media/how-to-access-policies-storage/edit-policy-storage.png" alt-text="Image shows how a data owner can edit or delete a policy statement.":::

### Publish the policy

A newly created policy is in the draft state. The process of publishing associates the new policy with one or more data sources under governance.
The steps to publish a policy are as follows

1. Log in to Purview portal.

1. Navigate to the Purview Policy app using the left side panel.

    :::image type="content" source="./media/how-to-access-policies-storage/policy-onboard-guide-2.png" alt-text="Image shows how a data owner can access the Policy functionality in Azure Purview when it wants to publish a policy.":::

1. The Policy portal will present the list of existing policies in Purview. Locate the policy that needs to be published. Select the **Publish** button on the right top corner of the page.

    :::image type="content" source="./media/how-to-access-policies-storage/publish-policy-storage.png" alt-text="Image shows how a data owner can publish a policy.":::

1. A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be published and then select the **Publish** button.

    :::image type="content" source="./media/how-to-access-policies-storage/select-data-sources-publish-policy-storage.png" alt-text="Image shows how a data owner can select the data source where the policy will be published.":::

>[!NOTE]
> Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in the data source.

## Policy action mapping

This section contains a reference of how actions in Azure Purview data policies map to specific actions in Azure Storage.

| **Purview policy action** | **Data source specific actions**                                                        |
|---------------------------|-----------------------------------------------------------------------------------------|
|||
| *Read*                    |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/read                      |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                |
|||
| *Modify*                  |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read                |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write               |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action          |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action         |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete              |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/read                      |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/write                     |
|                           |<sub>Microsoft.Storage/storageAccounts/blobServices/containers/delete                    |
|||

## Known issues
These are known issues in the current release
1. In addition to Purview *Policy authors* role, user requires directory *Reader* permission in Azure Active Directory (AAD) to create data owner policy.
1. Purview *Policy author* role is not sufficient to create policies. It also requires Purview *Data source admin* role as well.
1. 	Disabling a subscription for Data use governance will disable Data use governance for all assets registered in that subscription.
1. Policy operations are only supported at root collection level and not child collection level.

## Next steps
Check the blog and demo related to the capabilities mentioned in this how-to guide

* [What's New in Azure Purview at Microsoft Ignite 2021](https://techcommunity.microsoft.com/t5/azure-purview/what-s-new-in-azure-purview-at-microsoft-ignite-2021/ba-p/2915954)
* [Demo of access policy for Azure Storage](https://www.youtube.com/watch?v=CFE8ltT19Ss)
