---
title: Tutorial to provision access for Azure Storage
description: This tutorial describes how a data owner can create access policies for Azure Storage resources.
author: whhender
ms.author: whhender
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 04/08/2022
---

# Tutorial: Access provisioning by data owner to Azure Storage datasets (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

[Policies](concept-data-owner-policies.md) in Azure Purview allow you to enable access to data sources that have been registered to a collection. This tutorial describes how a data owner can leverage Azure Purview to enable access to datasets in Azure Storage though Azure Purview.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Prepare your Azure environment
> * Configure permissions to allow Azure Purview to connect to your resources
> * Register your Azure Storage resource for data use governance
> * Create and publish a policy for your resource group or subscription

## Prerequisites

[!INCLUDE [Access policies generic pre-requisites](./includes/access-policies-prerequisites-generic.md)]

[!INCLUDE [Azure Storage specific pre-requisites](./includes/access-policies-prerequisites-storage.md)]

## Configuration

[!INCLUDE [Access policies generic configuration](./includes/access-policies-configuration-generic.md)]

### Register the data sources in Azure Purview for data use governance

Your Azure Storage account needs to be registered in Azure Purview to later define access policies, and during registration we will enable data use governance. **Data use governance** is an available feature in Azure Purview that allows users to manage access to a resource from within Azure Purview. This allows you to centralize data discovery and access management, however it is a feature that directly impacts your data security.

> [!WARNING]
> Before enabling data use governance for any of your resources, read through our [**data use governance article**](how-to-enable-data-use-governance.md).
>
> This article includes data use governance best practices to help you ensure that your information is secure.


To register your resource and enable data use governance, follow these steps:

> [!Note]
> You need to be an owner of the subscription or resource group to be able to add a managed identity on an Azure resource.

1. From the [Azure portal](https://portal.azure.com), find the Azure Blob storage account that you would like to register.

   :::image type="content" source="media/tutorial-data-owner-policies-storage/register-blob-storage-acct.png" alt-text="Screenshot that shows the storage account":::

1. Select **Access Control (IAM)** in the left navigation and then select **+ Add** --> **Add role assignment**.

   :::image type="content" source="media/tutorial-data-owner-policies-storage/register-blob-access-control.png" alt-text="Screenshot that shows the access control for the storage account":::

1. Set the **Role** to **Storage Blob Data Reader** and enter your _Azure Purview account name_ under the **Select** input box. Then, select **Save** to give this role assignment to your Azure Purview account.

   :::image type="content" source="media/tutorial-data-owner-policies-storage/register-blob-assign-permissions.png" alt-text="Screenshot that shows the details to assign permissions for the Azure Purview account":::

1. If you have a firewall enabled on your Storage account, follow these steps as well:
    1. Go into your Azure Storage account in [Azure portal](https://portal.azure.com).
    1. Navigate to **Security + networking > Networking**.NET
    1. Choose **Selected Networks** under **Allow access from**.
    1. In the **Exceptions** section, select **Allow trusted Microsoft services to access this storage account** and select **Save**.

       :::image type="content" source="media/tutorial-data-owner-policies-storage/register-blob-permission.png" alt-text="Screenshot that shows the exceptions to allow trusted Microsoft services to access the storage account.":::

1. Once you have set up authentication for your storage account , go to the [Azure Purview Studio](https://web.purview.azure.com/).
1. Select **Data Map** on the left menu.

    :::image type="content" source="media/tutorial-data-owner-policies-storage/select-data-map.png" alt-text="Screenshot that shows the far left menu in the Azure Purview Studio open with Data Map highlighted.":::

1. Select **Register**.

    :::image type="content" source="media/tutorial-data-owner-policies-storage/select-register.png" alt-text="Screenshot that shows Azure Purview Studio Data Map sources, with the register button highlighted at the top.":::

1. On **Register sources**, select **Azure Blob Storage**.

   :::image type="content" source="media/tutorial-data-owner-policies-storage/select-azure-blob-storage.png" alt-text="Screenshot that shows the tile for Azure Multiple on the screen for registering multiple sources.":::

1. Select **Continue**.
1. On the **Register sources (Azure)** screen, do the following:
   1. In the **Name** box, enter a friendly name that the data source will be listed with in the catalog. 
   1. In the **Subscription** dropdown list boxes, select the subscription where your storage account is housed. Then select your storage account under **Storage account name**. In **Select a collection** select the collection where you'd like to register your Azure Storage account.
   
      :::image type="content" source="media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Screenshot that shows the boxes for selecting a storage account.":::

   1. In the **Select a collection** box, select a collection or create a new one (optional).
   1. Set the *Data use governance* toggle to **Enabled**, as shown in the image below.

       :::image type="content" source="./media/tutorial-data-owner-policies-storage/register-data-source-for-policy-storage.png" alt-text="Screenshot that shows Data use governance toggle set to active on the registered resource page.":::

        >[!TIP]
        >If the data use governance toggle is greyed out and unable to be selected:
        > 1. Confirm you have followed all prerequisites to enable Data use governance across your resources.
        > 1. Confirm that you have selected a storage account to be registered.
        > 1. It may be that this resource is already registered in another Azure Purview account. Hover over it to know the name of the Azure Purview account that has registered the data resource.first. Only one Azure Purview account can register a resource for data use governance at at time.

   1. Select **Register** to register the resource group or subscription with Azure Purview with data use governance enabled.

>[!TIP]
> For more information about data use governance, including best practices or known issues, see our [data use governance article](how-to-enable-data-use-governance.md).

## Create a data owner policy

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

    :::image type="content" source="./media/access-policies-common/select-data-source-type.png" alt-text="Screenshot showing the policy editor, with Data Resources selected, and Data source Type highlighted in the data resources menu.":::

1. Select the **Continue** button and transverse the hierarchy to select and underlying data-object (for example: folder, file, etc.).  Select **Recursive** to apply the policy from that point in the hierarchy down to any child data-objects. Then select the **Add** button. This will take you back to the policy editor.

    :::image type="content" source="./media/access-policies-common/select-asset.png" alt-text="Screenshot showing the Select asset menu, and the Add button highlighted.":::

1. Select the **Subjects** button and enter the subject identity as a principal, group, or MSI. Then select the **OK** button. This will take you back to the policy editor

    :::image type="content" source="./media/access-policies-common/select-subject.png" alt-text="Screenshot showing the Subject menu, with a subject select from the search and the OK button highlighted at the bottom..":::

1. Repeat the steps #5 to #11 to enter any more policy statements.

1. Select the **Save** button to save the policy.

    :::image type="content" source="./media/tutorial-data-owner-policies-storage/data-owner-policy-example-storage.png" alt-text="Screenshot showing a sample data owner policy giving access to an Azure Storage account.":::

## Publish a data owner policy

1. Sign in to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Screenshot showing the Azure Purview studio with the leftmost menu open, Policy Management highlighted, and Data Policies selected on the next page.":::

1. The Policy portal will present the list of existing policies in Azure Purview. Locate the policy that needs to be published. Select the **Publish** button on the right top corner of the page.

    :::image type="content" source="./media/access-policies-common/publish-policy.png" alt-text="Screenshot showing the policy editing menu with the Publish button highlighted in the top right of the page.":::

1. A list of data sources is displayed. You can enter a name to filter the list. Then, select each data source where this policy is to be published and then select the **Publish** button.

    :::image type="content" source="./media/access-policies-common/select-data-sources-publish-policy.png" alt-text="Screenshot showing with Policy publish menu with a data resource selected and the publish button highlighted.":::

>[!Important]
> - Publish is a background operation. It can take up to **2 hours** for the changes to be reflected in Storage account(s).

## Clean up resources

To delete a policy in Azure Purview, follow these steps:

1. Sign in to the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Navigate to the **Data policy** feature using the left side panel. Then select **Data policies**.

    :::image type="content" source="./media/access-policies-common/policy-onboard-guide-2.png" alt-text="Screenshot showing the leftmost menu open, Policy Management highlighted, and Data Policies selected on the next page.":::

1. The Policy portal will present the list of existing policies in Azure Purview. Select the policy that needs to be updated.

1. The policy details page will appear, including Edit and Delete options. Select the **Edit** button, which brings up the policy statement builder. Now, any parts of the statements in this policy can be updated. To delete the policy, use the **Delete** button.

    :::image type="content" source="./media/access-policies-common/edit-policy.png" alt-text="Screenshot showing an open policy with the Edit button highlighted in the top menu on the page.":::


## Next steps

Check our demo and related tutorials:

> [!div class="nextstepaction"]
> [Demo of access policy for Azure Storage](https://docs.microsoft.com/video/media/8ce7c554-0d48-430f-8f63-edf94946947c/purview-policy-storage-dataowner-scenario_mid.mp4)
> [Concepts for Azure Purview data owner policies](./concept-data-owner-policies.md)
> [Enable Azure Purview data owner policies on all data sources in a subscription or a resource group](./how-to-data-owner-policies-resource-group.md)
