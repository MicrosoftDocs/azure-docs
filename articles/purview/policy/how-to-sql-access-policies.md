---
title: How to create data access policies for Azure SQL DB
description: Step-by-step guide on how to integrate Azure SQL DB into Azure Purview Data Policies
author: vlrodrig
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 10/07/2021
---

# How to integrate Azure SL DB into Azure Purview Data Policies

## Supported capabilities

The Purview policy authoring supports following capabilities:
-   Data policy for Azure Storage to control access to data stored
    in Blob or ADLS Gen2 files

\[**IMPORTANT**\] This preview version is provided without a service level agreement, and
it's not recommended for production workloads. Certain features might
not be supported or might have constrained capabilities. For more
information, see [Supplemental Terms of Use for Microsoft Azure
Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Pre-requisites

### Using isolated subscription for preview

\[**IMPORTANT**\] Given the sensitive nature of the functionality (centrally defined data access control), we require the preview to be
evaluated in an isolated subscription. Microsoft will explicitly approve that subscription to enable the data policy functionality in Azure
Purview and Azure Storage accounts.

### Provision new accounts in the isolated subscriptions

#### Create Azure Purview account

Provision a new Purview account and Storage account in the isolated subscription. The new functionality will be enabled in these new
accounts. To create a new Purview account, refer to the quick-start guide [Quickstart: Create an Azure Purview account in the
Azure
portal.](../create-catalog-portal.md)

#### Create Azure Storage account

To create a new Azure Storage account, refer to [Create a storage account - Azure Storage](../../storage/common/storage-account-create.md)
To confirm that this functionality is enabled for your subscription, execute following commands in PowerShell

```
<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p># Install the Az module</p>
<p>Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force</p>
<p># Log in into the subscription</p>
<p>Connect-AzAccount -Subscription &lt;Subscription-ID&gt;</p>
<p># Check status of the feature</p>
<p>Get-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>
```

If the output of the last command shows value of “RegistrationState” as “Registered”, then your subscription is enabled for this functionality.

### Configure Azure Purview and Storage for Data Policies

This section outlines the steps to configure Azure Purview and Storage for data policy validation.

### Provision new accounts

This feature is only available on new Azure Purview and Azure Storage accounts.

#### Supported regions

The data policy feature is enabled following Azure regions for each product. To use the feature, you’ll need to use Azure Purview and Azure
Storage accounts in the regions where this functionality is available.

##### Azure Purview 

-   North Europe
-   West Europe
-   East US
-   East US2
-   South Central US
-   West US 2
-   Canada Central
-   Southeast Asia
-   Australia East

##### Azure Storage

-   East US 2
-   Canada Central

#### Create new Azure Purview account

Create a new Azure Purview account in the regions where the new functionality is enabled, under the subscription that is isolated for
the new functionality.

For more information on creating a Purview account, see [Quickstart: Create an Azure Purview account in the Azure portal (preview) - Azure
Purview \| Microsoft Docs](../create-catalog-portal.md)

### Register and scan data sources in Purview

The data source needs to be registered and scanned with Purview in order to define policies. Follow the Purview registration guides to
register your storage account:

-   [How to scan Azure storage blob - Azure Purview](../register-scan-azure-blob-storage-source.md)

-   [Register and scan Azure Data Lake Storage (ADLS) Gen2 - Azure Purview](../register-scan-adls-gen2.md)

### Configure permissions for policy management actions

-   A user needs to be part of Purview data curator role to perform policy authoring/management actions.
-   A user needs to be part of Purview data source admin role to publish the policy.

## Policy Authoring

This section describes the steps for creating, updating, and publishing Purview data policies.

### Create new policy

Steps to create a new policy in Purview

1.  Log in to Purview portal.

2.  Navigate to **Policy management** app using the left side panel.

3.  Select the **New Policy** button in the policy page.
    :::image type="content" source="./media/how-to-sql-access-policies/policy-onboard-guide-1.png" alt-text="Image shows how a Data Owner can access the Policy functionality in Azure Purview when it wants to create policies.":::

4.  The new policy page will appear. Enter the policy **Name** and
    **Description**.

5.  To add policy statements to the new policy, select the **New policy
    statement** button. This will bring up the policy statement builder.
    :::image type="content" source="./media/how-to-sql-access-policies/create-new-policy-sql.png" alt-text="Image shows how a Data Owner can create a new policy statement.":::

6.  Select the **Action** button and choose Read or Modify from the drop-down list.

7.  Select the **Effect** button and choose Allow or Deny from the drop-down list.

8.  Select the **Data Resources** button to bring up the options to provide the data asset path

9.  In the **Assets** box, enter the **Data Source Type** and select the
    **Name** of a previously registered data source.
    :::image type="content" source="./media/how-to-sql-access-policies/select-data-source-type-sql.png" alt-text="Image shows how a Data Owner can select a Data Resource when editing a policy statement.":::

10. Select the **Continue** button and transverse the hierarchy to select the folder or file. Then select the **Add** button. This will take you back to the policy editor.
    :::image type="content" source="./media/how-to-sql-access-policies/select-asset-sql.png" alt-text="Image shows how a Data Owner can select the asset when creating or editing a policy statement.":::

11. Select the **Subjects** button and enter the subject identity as a principal, group, or MSI. Then select the **OK** button. This will
    take you back to the policy editor
    :::image type="content" source="./media/how-to-sql-access-policies/select-subject.png" alt-text="Image shows how a Data Owner can select the subject when creating or editing a policy statement.":::

12. Repeat the steps #5 to #11 to enter any additional policy statements.

13. Select the **Save** button to save the policy

### Update or delete a policy

Steps to create a new policy in Purview are as follows.

1.  Log in to Purview portal.

2.  Navigate to Purview policy app using the left side panel.
    :::image type="content" source="./media/how-to-sql-access-policies/policy-onboard-guide-2.png" alt-text="Image shows how a Data Owner can access the Policy functionality in Azure Purview when it wants to update a policy.":::

3.  The Policy portal will present the list of existing policies in Purview. Select the policy that needs to be updated.

4.  The policy details page will appear, including Edit and Delete options. Select the **Edit** button which brings up the policy
    statement builder for the statements in this policy. Now, any parts of the statements in this policy can be updated. To delete the
    policy, use the **Delete** button.
    :::image type="content" source="./media/how-to-sql-access-policies/edit-policy-sql.png" alt-text="Image shows how a Data Owner can edit or delete a policy statement.":::

## Policy publishing

A newly created policy is in the draft state. The process of publish is to associate the policy with one or more data sources under governance.
The steps to publish a policy are as follows

1.  Log in to Purview portal.

2.  Navigate to the Purview Policy app using the left side panel.

    :::image type="content" source="./media/how-to-sql-access-policies/policy-onboard-guide-2.png" alt-text="Image shows how a Data Owner can access the Policy functionality in Azure Purview when it wants to publish a policy.":::

3.  The Policy portal will present the list of existing policies in Purview. Locate the policy that needs to be published. Select the
    **Publish** button on the right top corner of the page.
    :::image type="content" source="./media/how-to-sql-access-policies/publish-policy-sql.png" alt-text="Image shows how a Data Owner can publish a policy.":::

4.  A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be
    published and then select the **Publish** button. Note that the publish is a background operation. It would take up to 2 hours for
    the changes to be reflected in the data source.

    :::image type="content" source="./media/how-to-sql-access-policies/select-data-sources-publish-policy-sql.png" alt-text="Image shows how a Data Owner can select the data source where the policy will be published.":::

## Next steps
Please check the tutorials on how to create policies in Azure Purview that work on specific data systems such as Azure Storage:

[How to create data access policies for Azure Storage](how-to-storage-access-policies.md)
