---
title: Scan storage accounts behind a firewall in Azure Purview
titleSuffix: Azure Purview
description: Learn how to scan resources behind a firewall using the Azure Purview portal.
author: sudhandkumar
ms.author: kumarsud
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/16/2020
---
# Scan Storage Accounts behind a Firewall in Azure Purview

In this article, you learn how to use Azure Purview to scan a resource behind a firewall.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Set up SQL storage behind a firewall

The first step is to add the catalog's MSI to an Azure SQL DB via the [Scan Azure Data Sources with Purview Portal](https://github.com/Azure/Babylon/blob/master/docs/scan-azure-data-sources-portal.md)

## Scan storage from Babylon

1. Browse to [https://ms.web.babylon.azure.com/](https://ms.web.babylon.azure.com/) and select the **Purview Account**.

   :::image type="content" source="./media/scan-resource-firewall/launch-babylon-account.png" alt-text="Screenshot of the selection to launch the Azure Purview account catalog.":::
  
1. On the Purview landing page, select **Management Center** (last icon on the left).

   :::image type="content" source="./media/scan-resource-firewall/landing-babylon.png" alt-text="Screenshot of the selection to launch the Azure Purview Management Center.":::

1. Select **Data Sources** from **Sources and Scanning**.

   :::image type="content" source="./media/scan-resource-firewall/scan-management-center.png" alt-text="Screenshot to select data sources":::

1. Select **New** to add the Data Source.

   :::image type="content" source="./media/scan-resource-firewall/scan-add-datasource.png" alt-text="Screenshot of the selection to add new Data Source":::

1. Select **Azure SQL Database**.

   :::image type="content" source="./media/scan-resource-firewall/scan-sql-source.png" alt-text="Screenshot to select sql server.":::

1. Provide a name for the new data source, select **From Azure subscription**, and select your subscription and server name from the dropdown.

   Select **Finish** to Complete registration. 

   :::image type="content" source="./media/scan-resource-firewall/scan-sql-register.png" alt-text="Screenshot to finish the selection":::

1. Select **Set Up Scan** for the storage that is behind the firewall and test connection. The connection indicates it's successful. 

   :::image type="content" source="./media/scan-resource-firewall/scan-sql-setscan.png" alt-text="Screenshot of the selection t0 set up scan.":::

1. Set up the scan frequency and select **Continue**.

   :::image type="content" source="./media/scan-resource-firewall/scan-sql-once.png" alt-text="Screenshot of the selection to launch the sql scan.":::

1.  The scan completes, and the status is updated in the list of Data sources.

   :::image type="content" source="./media/scan-resource-firewall/scan-sql-success.png" alt-text="Screenshot of the message scan completed":::
   
## Next steps

Next, you can set up a scan rule set [Create a scan rule set](create-a-scan-rule-set.md) to group scans together.
