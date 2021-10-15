---
title: Azure Purview account upgrade information
description: Azure Purview accounts created before August 18, 2021 will be automatically upgraded to the latest version of Purview. This article describes what will change, and any next steps needed.
author: whhender
ms.author: whhender
ms.service: purview
ms.topic: conceptual 
ms.date: 08/27/2021
ms.custom: template-concept 
---

# Azure Purview account upgrade information

Azure Purview released some new features on August 18, 2021, including the elastic data map, updated collections, and updated access control. Azure Purview accounts created **after** August 18, 2021 are created with all these new features already available.

Accounts created **before** August 18, 2021 (legacy accounts) are being automatically upgraded to include these features.

If you have a Purview account created **before** August 18, 2021, you'll receive an email notification when your Purview account has been upgraded.

This document covers the changes you'll see when your account is upgraded, and any steps you'll need to take to use the new features.

## Elastic data map

Upgraded Azure Purview accounts use a new data map system that scales dynamically based on use: the elastic data map. Elastic data maps start at one capacity unit, and will add and reduce capacity units as needed.
This new feature doesn't affect how you interact with Purview directly, but does affect billing. It scales to the size you need to manage your data landscape, and you're only billed for what you use.

For more information about the new elastic data map and how it's billed, see our [elastic data map page](concept-elastic-data-map.md).

For billing details for all of Purview, see the [pricing calculator](https://azure.microsoft.com/pricing/details/azure-purview/).

When your account is upgraded, you won't need to make any changes to use the elastic data map. It's automatically enabled.

## Collections

Collections exist in legacy Purview accounts, but have new functionality and are managed in a different way in upgraded Purview accounts.

[Legacy collections](how-to-create-and-manage-collections.md#legacy-collection-guide) were a way to organize data sources and artifacts in your Purview account. Collections are still used to customize your Purview data map to match your business landscape, but they now also include access control. Rather than controlling access at a high level outside your data map, through collections your access management experience will match your data map.

[Collections](how-to-create-and-manage-collections.md) give you fine-grained control over your data sources, but also over discoverability. Users will only see assets in collections that they have access to, and so will only see the information they need.

When your Purview account is upgraded, your collections will be updated as well. All your current assets will be migrated into these new collections. In the sections below, we'll discuss where you can find your collections and your existing assets.

### Locate and manage collections

To find your new collections, we'll start in the [Purview Studio](https://web.purview.azure.com/resource/). You can find the studio by going to your Purview resource in the [Azure portal](https://portal.azure.com) and selecting the **Open Purview Studio** tile on the overview page.

Select Data Map > Collections from the left pane to open the collection management page.

:::image type="content" source="./media/concept-account-upgrade/find-collections.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the Collections tab selected." border="true":::

There you'll see the root collection, as well as all your existing collections. The root collection is the top collection in your collection list and will have the same name as your Purview resource. In our example below, it's called Contoso Purview.

:::image type="content" source="./media/concept-account-upgrade/select-root-collection.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the root collection highlighted." border="true":::

All your existing collections have been added to this root collection, and they can be managed from this page.
To create a new collection select **+ Add a Collection**.

:::image type="content" source="./media/concept-account-upgrade/select-add-a-collection.png" alt-text="Screenshot of Purview studio window, showing the new collection window, with the add a collection buttons highlighted." border="true":::

To edit a collection, select **Edit** either from the collection detail page, or from the collection's drop down menu.

:::image type="content" source="./media/concept-account-upgrade/edit-collection.png" alt-text="Screenshot of Purview studio window, open to collection window, with the 'edit' button highlighted both in the selected collection window, and under the ellipsis button next to the name of the collection." border="true":::

To edit role assignments in a collection, select the **Role assignments** tab to see all the roles in a collection. Only a collection admin can manage role assignments. There's more information about permissions in upgraded accounts in the [section below](#permissions).

:::image type="content" source="./media/concept-account-upgrade/select-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab highlighted." border="true":::

For more information about collections in upgraded accounts, please read our [guide on creating and managing collections](how-to-create-and-manage-collections.md).

### What happens to your collections during upgrade?

1. A root collection is created. The root collection is the top collection in your collection list and will have the same name as your Purview resource. In our example below, it's called Contoso Purview.

    :::image type="content" source="./media/concept-account-upgrade/select-root-collection.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the root collection highlighted." border="true":::

1. Your previously existing collections will be connected to the root collection. You'll see them listed below the root collection, and can interact with them there.

### What happens to your sources during upgrade?

1. Any sources that weren't previously associated with a collection are automatically added to the root collection.

1. Any sources or scans that were previously associated with a collection are added to those respective collections in your upgraded account.

Assets are also associated with collections in the upgraded account, but they may not immediately show up under your upgraded collection. This is for one of two reasons:

* The asset is scanned by a scheduled scan, and the next run of the scan has not happened yet.
* The asset was only scanned by a one-time scan.

> [!NOTE]
> Assets are added to a collection during the scanning process, so another scan will need to be run on your assets to add them to these new collections.

For your scheduled scans, you only need to wait for the next run of these scans, and the assets will be added to your collection.

For one-time scans, you'll need to rerun these manually to populate the assets in your collection.

1. In the [Purview Studio](https://web.purview.azure.com/resource/), open the Data Map, select **Sources**. Select the source you want to scan.

    :::image type="content" source="./media/concept-account-upgrade/select-sources.png" alt-text="Screenshot of Purview studio window, opened to the Data Map, with the sources highlighted." border="true":::

1. Select the **Scans** tab, then select the scan you want to rerun.

    :::image type="content" source="./media/concept-account-upgrade/select-scan.png" alt-text="Screenshot of Purview studio window, opened to a source, with the scans highlighted." border="true":::

1. Select **Run scan now** to run the scan again.

    :::image type="content" source="./media/concept-account-upgrade/run-scan-now.png" alt-text="Screenshot of Purview studio window, opened to a scan, with Run scan now highlighted." border="true":::

### What happens when your upgraded account doesn't have a collection admin?

Your upgraded Purview account will have default collection admin(s) if the process can identify at least one user or group in the following order: 

1. Owner (explicitly assigned)

1. User Access Administrator (explicitly assigned)

1. Data Source Administrator and Data Curator

If your account did not have any user or group matched with the above criteria, the upgraded Purview account will have no collection admin. 

You can still manually add a collection admin by using the management API. The user who calls this API must have Owner or User Access Administrator permission on Purview account to execute a write action. You will need to know the `objectId` of the new collection admin to submit via the API.

#### Request

   ```
    POST https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Purview/accounts/<accountName>/addRootCollectionAdmin?api-version=2021-07-01
   ```    
    
#### Request body

   ```json
    {
        "objectId": "<objectId>"
    }
   ```    

`objectId` is the objectId of the new collection admin to add.

#### Response body

If success, you will get an empty body response with `200` code.

If failure, the format of the response body is as follows.

   ```json
    {
        "error": {
            "code": "19000",
            "message": "The caller does not have Microsoft.Authorization/roleAssignments/write permission on resource: [/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>].",
            "target": null,
            "details": []
        }
    }
   ```

## Permissions

In upgraded Purview accounts, permissions are managed through collections.

> [!NOTE]
> Permissions in upgraded accounts are no longer managed through Access Control (IAM). When a legacy account is upgraded, preexisting IAM permissions will still show under Access Control IAM, but will no longer affect access in Purview.

When a legacy account is upgraded, all the permissions assigned in Access Control IAM are assigned to the root collection to one of the following roles.

* **Collection admins** - can edit a collection, its details, manage access in the collection, and add subcollections.
* **Data source admins** - can manage data sources and data scans.
* **Data curators** - can create, read, modify, and delete actions on catalog data objects.
* **Data readers** - can access but not modify catalog data objects.

To grant your users access to sources and artifacts in Purview, you will want to grant them access to collections and subcollections where they may require access to the data.

> [!NOTE]
> Only Collection admins have permission to manage access in collections.

To view or edit role assignments in a collection, select the **Role assignments** tab within your collection.

:::image type="content" source="./media/concept-account-upgrade/select-role-assignments.png" alt-text="Screenshot of Purview studio collection window, with the role assignments tab highlighted." border="true":::

For more information about managing permissions in an upgraded Purview account, follow our [Purview permissions guide](catalog-permissions.md).

## Next steps

For more information about the concepts above, or for information on securing your Purview Resource, follow the links below.

* [Private endpoints with Azure Purview](catalog-private-link.md)
* [Elastic data map](concept-elastic-data-map.md)
* [Purview permissions guide](catalog-permissions.md)
