---
title: Scan Azure SQL DB behind a firewall
description: Learn how to scan resources behind a firewall using the Azure Purview portal.
author: sudhandkumar
ms.author: kumarsud
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 10/16/2020
---
# Scan Azure SQL DB behind a firewall in Azure Purview

In this article, you learn how to use Azure Purview to scan a resource behind a firewall.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Set up SQL storage behind a firewall

The first step is to add the catalog's MSI to an Azure SQL DB via the [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md).

## Scan SQL DB from Purview

1. Browse to the Purview home page.

1. Select **Management Center** on the left navigation.

1. Select **Data Sources** under **Sources and Scanning**.

1. Select **+ New** to add the Data Source.

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
