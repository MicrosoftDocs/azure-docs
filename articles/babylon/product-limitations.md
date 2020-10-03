---
title: Product limitations for Azure Babylon (preview)
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

* **Limitation**: The existence of Azure Babylon isn't public knowledge, which is why we don't want to expose information about it in the Azure portal. To create a catalog instance, you need to use a special flag. This flag is needed only when you create a catalog. Once a catalog exists, you can view it in the Azure portal without a flag. There are limitations to how many catalogs you can create in the preview.

* **Customer action**: To create a catalog instance, use the [**Babylon accounts**](https://aka.ms/babylonportal) page in the Azure portal.

* **Solution**: After Microsoft formally announces Azure Babylon, this flag won't be necessary.

### Scanning from the UI

* **Limitation**: We've released features in the UX that allow you to set up scans for many Azure data stores. To allow a scan, add the user who's setting up the scan to the Catalog resource permissions as a Contributor in the Azure portal.

* **Solution**: For the steps to take for each user who needs to set up scans, see [Assign permission to scan content into the catalog](add-security-principal.md#assign-permission-to-scan-content-into-the-catalog).

* **Additional information**

  * On-premises SQL Server scanning in Azure Babylon isn't yet available.

  * Power BI scanning is available only in limited preview. Send an email to BabylonDiscussion\@microsoft.com to be placed on the allow list, and then supply a feature flag to enable it. Otherwise, Azure Babylon starts the scan, but won't receive an asset.

## Warnings that require customer awareness

### Only five catalogs can be created per customer subscription per region

* **Limitation**: Currently, Azure Babylon has a hard limit on how many catalogs it can have per subscription per region.

* **Solution**: This limitation is expected to continue until the public preview.

### Catalogs can only be created in the regions available at the drop-down menu when you create an Azure Babylon account

* **Limitation**: Azure Babylon is currently deployed in a limited number of regions. More regions are planned. During preview, your Azure Babylon account can be created only in those regions, but this limitation doesn't prevent scans. However, the scan process does take samples of your data for classification purposes. If you scan your production data, there will be implication for moving data across regions.

* **Solution**: We plan on adding additional regions based on customer feedback.

### Schemas for hierarchical files (JSON & XML) are flattened

* **Limitation**: When Azure Babylon scans hierarchical data structures, such as JSON and XML, it *flattens* them. So, if you have *\<foo\>\<bar\>\<blah/\>\</bar\>\</foo\>*, it appears as the columns *foo*, *foo/-/bar*, and *foo/-/bar/-/blah*. The complete data is there, but it's in a tabular format.

* **Solution**: In a future release, the Azure Babylon portal will represent these flattened schemas in their hierarchical format.

### By design, the Azure Babylon portal includes several inactive features for the current release

* **Limitation**: Several inactive, backlogged features can be found in the Azure Babylon portal. Icons for these features are set to 50% opacity to be visually distinguishable from active, functional preview features. Microsoft requests early feedback from customers on these feature requirements, behaviors, and priorities.

* **Solution**: Based on customer feedback, most of those backlogged features are expected to be available for future preview releases.

### Customers will pay for scanning/classification of SQL Server On-Premises once this feature is available

* **Limitation**: In the current release, many aspects of the cost of running Azure Babylon are paid for by Microsoft. An exception is the scanning/classification of **SQL Server On-Premises**. Until Azure Babylon-managed scanning is introduced for SQL Server On-Premises scanning, Azure Babylon needs customers to create their own ADF factory instances in their own accounts. Any costs associated with running those factories are paid out of the customer's subscription. For all other Azure data stores that are supported, there's no additional cost to preview customers.

* **Solution:** Before the public preview, Azure Babylon is expected to support Azure Babylon-managed scanning of SQL Server On-Premises. That is, customers won't have to create their own factory instances. However, Azure Babylon might still run these scanning/classification instances in the customer subscription instead of the Microsoft subscription.

### We don't support soft delete on Azure Babylon accounts

* **Limitation**: If a customer chooses to delete their Azure Babylon account, all their data is lost without the possibility of recovery.

* **Solution**: While Azure Babylon is in preview, it supports *soft delete*, where Microsoft stores a deleted Azure Babylon account for a while (typically 30 days). Customers can then ask, before the end of the time window, to have the Azure Babylon account restored. After the time window has elapsed, the account is irretrievably deleted.
