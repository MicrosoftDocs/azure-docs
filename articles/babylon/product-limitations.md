---
title: Product limitations for Azure Babylon (preview)
titleSuffix: Azure Babylon
description: This document describes current limitations and product warnings for the Azure Babylon preview. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 09/17/2020
---

# Product limitations for Azure Babylon (preview)

Read this document carefully. It includes warnings that Azure Babylon preview customers are expected to be aware of. Some warnings require you to take certain actions and others require only your awareness.

## Warnings that require customer action

### Use the feature flag when creating an Azure Babylon account

* **Limitation**: The existence of Babylon isn't public knowledge; it's only available under NDA. That's why we don't want to expose any information about it in the Azure portal. To create a catalog instance, you need to use a special flag. This flag is needed only when you create a catalog. Once a catalog exists, you can view it in the Azure portal normally, without a flag. There are limitations to how many catalogs you can create in the preview.

* **Customer action**: To create a catalog instance, use the [**Babylon accounts**](https://aka.ms/babylonportal) page in the Azure portal.

* **Solution**: After we publicly announce the existence of Babylon, this flag won't be necessary.

### Scanning from the UI

* **Limitation**: We've released features in the UX that allow you to set up scans for many Azure data stores. To allow a scan, add the user who's setting up the scan to the Catalog resource permissions as a Contributor in the Azure portal.

* **Solution**: Here are the steps to take for each person who needs to set up scans:

   1. Sign in to the [Azure portal](https://portal.azure.com), find your catalog, and then select **Access control (IAM)**.

      :::image type="content" source="./media/product-limitations/access-control.png" alt-text="Screenshot showing how to select Access control (IAM) for a catalog in the Azure portal.":::

   1. Under **Add a role assignment**, select **Add**.

      :::image type="content" source="./media/product-limitations/role-assignment.png" alt-text="Screenshot showing how to add a role assignment to a catalog in the Azure portal.":::

   1. Set **Role** to **Contributor** and add the user who will set up scanning.

      :::image type="content" source="./media/product-limitations/add-role-assignment.png" alt-text="Screenshot showing how to set the role to Contributor for a catalog in the Azure portal.":::

* **Additional information**

  * On-premises SQL Server scanning in Babylon isn't yet available.

  * Power BI scanning is available only in limited preview. Send an email to BabylonDiscussion\@microsoft.com to get whitelisted, and then supply a feature flag to enable it. Otherwise, Babylon will start the scan, but won't receive an asset.

## Warnings that require customer awareness

### Only five catalogs can be created per customer subscription per region

* **Limitation**: Currently, Babylon has a hard limit on how many catalogs it can have per subscription per region.

* **Solution**: This limitation is expected to continue until the public preview.

### Catalogs can only be created in the regions available at the drop-down menu when you create a Babylon account.

* **Limitation**: Babylon is currently deployed in a limited number of regions, but more regions are planned. During preview, your Babylon account can be created only in those regions, but this limitation doesn't prevent scans. However, the scan process does take samples of your data for classification purposes. If you scan your production data, there will be implication on moving data across regions.

* **Solution**: We plan on adding additional regions based on customer feedback.

### Schemas for hierarchical files (JSON & XML) are flattened

* **Limitation**: When scanning hierarchical data structures, such as JSON and XML, Babylon *flattens* them. So, if you have *\<foo\>\<bar\>\<blah/\>\</bar\>\</foo\>*, it appears as the columns *foo*, *foo/-/bar*, *foo/-/bar/-/blah*. The complete data is there, but in a tabular format.

* **Solution**: In a future release, the Babylon portal will represent these flattened schemas in their hierarchical format.

### By design, the Babylon portal includes several inactive features for the current release

* **Limitation**: Several inactive, backlogged features can be found in the Babylon portal. Icons for these features are set to 50% opacity to be visually distinguishable from active, functional preview features. Microsoft requests early feedback from customers on feature requirements, behaviors, and priorities.

* **Solution**: Based on customer feedback, most of those backlogged features are expected to be available for future preview releases.

### Customers will pay for scanning/classification of SQL Server On-Premises once this feature is available

* **Limitation**: In the current release, many aspects of the cost of running Babylon are being paid for by Microsoft. An exception is scanning/classification of **SQL Server On-Premises**. The reason is that until Babylon-managed scanning is introduced for SQL Server On-Premises scanning, Babylon needs customers to create their own ADF factory instances in their own accounts. Any costs associated with running those factories are paid out of the customer's subscription. For all other Azure data stores that are supported, there's no additional cost to preview customers.

* **Solution:** At some point before the public preview, Babylon is expected to support Babylon-managed scanning of SQL Server On-Premises. That is, customers won't have to create their own factory instances. However, Babylon might still run these scanning/classification instances in the customer's subscription and not in Microsoft's.

### We don't support soft delete on Babylon accounts

* **Limitation**: If a customer chooses to delete their Babylon account, all their data is lost without the possibility of recovery.

* **Solution**: While Babylon is in preview, it will support *soft delete*, where Microsoft stores a deleted Babylon account for a while (typically 30 days). Customers can then ask, before the end of the time window  to have the Babylon account restored. After the time window, the account is irretrievably deleted.
