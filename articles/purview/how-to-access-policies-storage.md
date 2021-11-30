---
title: Data access policy provisioning for Azure Storage
description: Step-by-step guide on how to integrate Azure Storage into Azure Purview access policies and allow data owners to build access policies.
author: vlrodrig
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: references_regions, ignite-fall-2021
---

# Dataset provisioning by data owner for Azure Storage

## Supported capabilities

The Purview policy authoring supports following capabilities:
-   Data access policy for Azure Storage to control access to data stored in Blob or ADLS Gen2 files

> [!IMPORTANT]
> These capabilities are currently in preview. This preview version is provided without a service level agreement, and should not be used for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



## Prerequisites

### Opt-in to participate in Azure Purview data use policy preview
This functionality is currently in preview, so you will need to [opt-in to Purview data use policies preview](https://aka.ms/opt-in-data-use-policy).

### Provision new accounts in an isolated test subscription
Follow the steps below to create a new Azure Purview account and a new Azure Storage account in an isolated test subscription. Then enable the access policy functionality in these accounts.

### Supported regions

> [!IMPORTANT]
> 1. The access policy feature is only available on new Azure Purview and Azure Storage accounts.
> 2. This feature can only be used in the regions listed below, where access policy functionality is deployed.

#### Azure Purview 

-   North Europe
-   West Europe
-   UK South
-   East US
-   East US2
-   South Central US
-   West US 2
-   Southeast Asia
-   Australia East
-   Canada Central
-   France Central


#### Azure Storage

-   France Central
-   Canada Central


### Create Azure Purview account

Create a new Azure Purview account in the regions where the new functionality is enabled, under the subscription that is isolated for the new functionality.

To create a new Purview account, refer to  [Quickstart: Create an Azure Purview account in the Azure portal.](create-catalog-portal.md)

### Create Azure Storage account

To create a new Azure Storage account, refer to [Create a storage account - Azure Storage](../storage/common/storage-account-create.md)

### Configure Azure Purview and Storage for access policies

This section outlines the steps to configure Azure Purview and Storage to enable access policies.

#### Register the access policies functionality in Azure Storage

To register and confirm that this functionality is enabled for your subscription, execute following commands in PowerShell

```powershell
# Install the Az module
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
# Login into the subscription
Connect-AzAccount -Subscription <SubscriptionID>
# Register the feature
Register-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage
```

If the output of the last command shows value of “RegistrationState” as “Registered”, then your subscription is enabled for this functionality.

#### Register and scan data sources in Purview

The data source needs to be registered and scanned with Purview in order to define policies. Follow the Purview registration guides to
register your storage account:

-   [How to scan Azure storage blob - Azure Purview](register-scan-azure-blob-storage-source.md)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](register-scan-adls-gen2.md)

During registration, enable the data source for Data use governance, as shown in the picture

:::image type="content" source="./media/how-to-access-policies-storage/register-data-source-for-policy.png" alt-text="Image shows how to register a data source for policy.":::

#### Configure permissions for policy management actions

-   A user needs to be part of Purview data curator role to perform policy authoring/management actions.
-   A user needs to be part of Purview data source admin role to publish the policy.

See the section on managing role assignments in this guide: [How to create and manage collections](how-to-create-and-manage-collections.md)

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

1. The policy details page will appear, including Edit and Delete options. Select the **Edit** button which brings up the policy statement builder for the statements in this policy. Now, any parts of the statements in this policy can be updated. To delete the policy, use the **Delete** button.

    :::image type="content" source="./media/how-to-access-policies-storage/edit-policy-storage.png" alt-text="Image shows how a data owner can edit or delete a policy statement.":::

### Publish the policy

A newly created policy is in the draft state. The process of publishing associates the new policy with one or more data sources under governance.
The steps to publish a policy are as follows

1. Log in to Purview portal.

1. Navigate to the Purview Policy app using the left side panel.

    :::image type="content" source="./media/how-to-access-policies-storage/policy-onboard-guide-2.png" alt-text="Image shows how a data owner can access the Policy functionality in Azure Purview when it wants to publish a policy.":::

1. The Policy portal will present the list of existing policies in Purview. Locate the policy that needs to be published. Select the **Publish** button on the right top corner of the page.

    :::image type="content" source="./media/how-to-access-policies-storage/publish-policy-storage.png" alt-text="Image shows how a data owner can publish a policy.":::

1. A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be published and then select the **Publish** button. Publish is a background operation. It can take up to 2 hours for the changes to be reflected in the data source.

    :::image type="content" source="./media/how-to-access-policies-storage/select-data-sources-publish-policy-storage.png" alt-text="Image shows how a data owner can select the data source where the policy will be published.":::

## Next steps

Check this article to understand concepts related to Azure Purview:

* [Azure Purview overview](overview.md)
