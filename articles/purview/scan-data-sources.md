---
title: How to scan sources
description: Learn how to scan registered data sources in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 01/25/2023
---

# Scan data sources in Microsoft Purview

In Microsoft Purview, after you [register a data source](manage-data-sources.md#register-a-new-source) your data source, you can scan your source to import metadata about the information stored in that source, and apply any classifications to sensitive data.

* For more information about scanning in general, see our [scanning concept article](concept-scans-and-ingestion.md)
* For best practices, see our [scanning best practices article.](concept-best-practices-scanning.md)

In this article, you'll learn the basic steps for scanning any data source.

>[!TIP]
>Each source has its own instructions and prerequisites for scanning. For the most complete scanning instructions, select your source from the [supported sources list](microsoft-purview-connector-overview.md) and review its scanning instructions.

## Prerequisites

[Here's a list of all the sources that are currently available to register and scan in Microsoft Purview.](microsoft-purview-connector-overview.md)

Before you can scan your data source, you must take these steps:

1. [Register your data source](manage-data-sources.md#register-a-new-source) - This essentially gives Microsoft Purview the address of your data source, and maps it to a [collection](catalog-permissions.md#a-collections-example) in the Microsoft Purview Data Map.
1. Consider your network - If your source is on an on-premises network, or a virtual private network (VPN), or if your [Microsoft Purview account is using private endpoints](catalog-private-link-end-to-end.md), you'll need a self-hosted integration runtime, which is a tool that will sit on a machine in your private network so your source and Microsoft Purview can connect during the scan. [Here are the instructions to create a self-hosted integration runtime.](manage-integration-runtimes.md)
1. Consider what credentials you're going to use to connect to your source. All [source pages](microsoft-purview-connector-overview.md) will have a **Scan** section that will include details about what authentication types are available.

## Creating a scan

In the steps below we'll be using [Azure Blob Storage](register-scan-azure-blob-storage-source.md) as an example, and authenticating with the Microsoft Purview Managed Identity.

>[!IMPORTANT]
> These are the general steps for creating a scan, but you should refer to [the source page](microsoft-purview-connector-overview.md) for source-specific prerequistes and scanning instructions.


1. In the [Azure portal](https://portal.azure.com), open your **Microsoft Purview account** and select the **Open Microsoft Purview governance portal**.

   :::image type="content" source="./media/scan-data-sources/open-purview-studio.png" alt-text="Screenshot of Microsoft Purview window in Azure portal, with the Microsoft Purview governance portal button highlighted." border="true":::

1. Navigate to the **Data map** -> **Sources** to view your registered sources either in a map or table view.
1. Find your source and select the **New Scan** icon.

   :::image type="content" source="media/scan-data-sources/register-blob-new-scan.png" alt-text="Screenshot that shows the screen to create a new scan":::

1. Provide a **Name** for the scan.
1. Select your authentication method. Here we chose the Purview MSI (managed identity.)
1. Choose the current collection, or a sub collection for the scan. The collection you choose will house the metadata discovered during the scan.

1. Select **Test connection**. If it isn't successful, see our [troubleshooting] section. On a successful connection, select **Continue**

   :::image type="content" source="media/scan-data-sources/register-blob-managed-identity.png" alt-text="Screenshot that shows the managed identity option to run the scan":::

1. Depending on the source, you can scope your scan to a specific subset of data. For Azure Blob Storage, we can select folders and subfolders by choosing the appropriate items in the list.

   :::image type="content" source="media/scan-data-sources/register-blob-scope-scan.png" alt-text="Scope your scan":::

1. Select a scan rule set. The scan rule set contains the kinds of data [classifications](concept-classification.md) your scan will check for. You can choose between the system default (that will contain all classifications available for the source), existing custom rule sets made by others in your organization, or [create a new rule set inline](create-a-scan-rule-set.md).

   :::image type="content" source="media/scan-data-sources/register-blob-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule (monthly or weekly) or run the scan once.

   :::image type="content" source="media/scan-data-sources/register-blob-scan-trigger.png" alt-text="scan trigger":::

1. Review your scan and select **Save and run**.

   :::image type="content" source="media/scan-data-sources/register-blob-review-scan.png" alt-text="review scan":::

## Viewing Scan

Depending on the amount of data in your data source, a scan can take some time to run, so here's how you can check on progress and see results when the scan is complete.

1. Navigate to the _data source_ in the _Collection_ and select **View Details** to check the status of the scan

   :::image type="content" source="media/scan-data-sources/register-blob-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_

   :::image type="content" source="media/scan-data-sources/register-blob-scan-details.png" alt-text="view scan details":::

1. The **Last run status** will be updated to **In progress** and then **Completed** once the entire scan has run successfully

   :::image type="content" source="media/scan-data-sources/register-blob-scan-in-progress.png" alt-text="view scan in progress":::

   :::image type="content" source="media/scan-data-sources/register-blob-scan-completed.png" alt-text="view scan completed":::

## Managing Scan

After a scan is complete, it can be managed or run again.

1. Select the **Scan name** to manage the scan

   :::image type="content" source="media/scan-data-sources/register-blob-manage-scan.png" alt-text="manage scan":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_  

   :::image type="content" source="media/scan-data-sources/register-blob-manage-scan-options.png" alt-text="manage scan options":::

1. You can _run an incremental scan_ or a _full scan_ again.

   :::image type="content" source="media/scan-data-sources/register-blob-full-inc-scan.png" alt-text="full or incremental scan":::

## Troubleshooting

Setting up the connection for your scan can complex since it's a custom set up for your network and your credentials.

If you're unable to connect to your source, follow these steps:

1. Review your [source page](microsoft-purview-connector-overview.md)prerequisites to make sure there's nothing you've missed.
1. Review your authentication option in the **Scan** section of your source page to confirm you have set up the authentication method correctly.
1. Review our [troubleshoot connections page](troubleshoot-connections.md).
1. [Create a support request](how-to-create-azure-support-request.md#go-to-help--support-from-the-global-header), so our support team can help you troubleshoot your specific environment.

## Next steps

* [Scanning best practices](concept-best-practices-scanning.md)
* [Azure Data Lake Storage Gen 2](register-scan-adls-gen2.md)
* [Power BI tenant](register-scan-power-bi-tenant.md)
* [Azure SQL Database](register-scan-azure-sql-database.md)
