---
title: Product limitations for Azure Babylon (preview)
titleSuffix: Azure Babylon
description: This document describes current limitations of Azure Babylon. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 08/28/2020
---

# Product limitations for Azure Babylon (preview)

Read this document carefully. It includes warnings that Azure Babylon preview customers are expected to be aware of. Some warnings require you to take certain actions and others require only your awareness.

## Warnings that require customer action

### Use the feature flag when creating an Azure Babylon account

* **Limitation**: The existence of Babylon isn't public knowledge; it's only available under NDA. Therefore, we don't want to expose any information about it in the Azure portal. To create a catalog instance, you need to use a special flag. This flag is needed only when you create a catalog. Once a catalog exists, you can view it in the Azure portal normally, without a flag. There are limitations to how many catalogs you can create in the preview.

* **Customer action**: When you create a catalog instance, go to the **Babylon** [instance screen in the Azure portal](https://aka.ms/babylonportal).

* **Solution**: After we publicly announce the existence of Babylon, this flag won't be necessary.

### Scanning from the UI

* **Limitation**: We released features in the UX that allow you to set up scans for many Azure data stores. One of the limitations is that the person who is setting up the scan needs to be added to the Catalog resource permissions in the Azure portal as a Contributor in order for the scans to be allowed.

* **Solution**: Here are the steps to take for each person who needs to set up scans:

   1. Go to the Azure portal, find your catalog, and then select **Access control (IAM)**.

      :::image type="content" source="./media/product-limitations/access-control.png" alt-text="Screenshot showing how to select Access control (IAM) for a catalog in the Azure portal.":::

   1. Select **Add a role assignment**.

      :::image type="content" source="./media/product-limitations/role-assignment.png" alt-text="Screenshot showing how to add a role assignment to a catalog in the Azure portal.":::

   1. Set **Role** to **Contributor** and add the user who will set up scanning.

      :::image type="content" source="./media/product-limitations/add-role-assignment.png" alt-text="Screenshot showing how to set the Role to Contributor for a catalog in the Azure portal.":::

* **Additional information**

  * On-premises SQL Server scanning in Babylon isn't yet available.

  * Power BI scanning is available only in limited preview. Send an email to BabylonDiscussion\@microsoft.com to get whitelisted, and then supply a feature flag to enable it. Otherwise, Babylon will start the scan, but won't receive an asset.

## Warnings that require customer awareness

### Only five catalogs can be created per customer subscription per region

* **Limitation**: Currently Babylon has a hard limit on how many catalogs it can have per subscription per region.

* **Solution**: This limitation is expected to continue until the public preview.

### Catalogs can only be created in the regions available at the drop-down menu when you create a Babylon account.

* **Limitation**: Babylon is currently deployed in a limited number of regions, but we're planning to add more. That means during preview, your Babylon account can be created only in those regions. This limitation doesn't prevent the scan from happening. However, the scan process does take samples of your data for classification purposes. There will be implication on moving data across regions if you scan your production data.

* **Solution**: We plan on adding additional regions based on customer feedback.

### Schemas for hierarchical files (JSON & XML) are flattened

* **Limitation**: When scanning hierarchical data structures (think JSON and XML), we "flatten" them down. So, if you have \<foo\>\<bar\>\<blah/\>\</bar\>\</foo\> it appears as column foo, another column foo/-/bar, and a third column foo/-/bar/-/blah. So, the data is there but in a tabular format.

* **Solution**: In a future release, the portal will represent these flattened schemas in their hierarchical format.

### By design, the Babylon portal includes several inactive features for the current release.

* **Limitation**: Several inactive, backlogged features can be found in the Babylon web portal. icons for these features are set to have 50% opacity so that they're visually distinguished from active, functional preview features. The intention is to ask for early feedback from customers on feature requirements, behaviors, and priorities.

* **Solution**: Based on customer feedback, most of those
backlogged features are expected to be available for future preview releases.

### Customers will pay for scanning/classification of SQL Server On-Premises once this feature is available in late 2020.

* **Limitation**: In the current release, many aspects of the cost of running Babylon are being paid for by Microsoft. One of the exceptions is scanning/classification of **SQL Server On-Premises**. The reason is that until Babylon-managed scanning is introduced for SQL Server On-Premises scanning, Babylon needs customers to create their own ADF factory instances in their own accounts. Any costs associated with running those factories are paid out of the customer's subscription. For all other Azure data stores that are supported, there's no additional cost to preview customers.

* **Solution:** At some point before the public preview, Babylon is expected to support Babylon-managed scanning of SQL Server On-Premises. That is, customers won't have to create their own factory instances. It's worth pointing out however that Babylon may still run these scanning/classification instances in the customer's subscription and not in Microsoft's.

### We don't support soft delete on Babylon accounts

* **Limitation**: If a customer chooses to delete their Babylon account, then all data is instantly lost without possibility of recovery.

* **Solution**: When Babylon is in public preview, it will support "soft delete", where Microsoft stores a deleted Babylon account for a period of time. Customers can then ask, before the end of the time window (typically 30 days), to have the Babylon account restored. After the time window, the account is irretrievably deleted.