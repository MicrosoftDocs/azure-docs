---
title: "Quickstart: Scan Storage Accounts behind a Firewall"
description: This tutorial describes how Scan resources behind a firewall. 
author: sudhandkumar
ms.author: kumarsud
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/16/20
---
# Quickstart: Scan Storage Accounts behind a Firewall 
In this quickstart, you scan a resource behind a firewall.
## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

## Set up SQL storage behind a firewall
   1. First step is to "add" the catalog's MSI to an Azure SQL DB via the [Scan Azure Data Sources with Babylon Portal](https://github.com/Azure/Babylon/blob/master/docs/scan-azure-data-sources-portal.md)

## Scan Storage from Babylon
1. Navigate to https://ms.web.babylon.azure.com/ and select the **Babylon Account**   
  :::image type="content" source="./media/scan-resource-firewall/launch-babylon-account.png" alt-text="Screenshot of the selection to launch the Azure Babylon account catalog.":::
1. Landing Page of Babylon and  click on **Management Center** which is the last icon from the left.

   :::image type="content" source="./media/scan-resource-firewall/landing-babylon.png" alt-text="Screenshot of the selection to launch the Azure Babylon Management Center.":::
1. Select **Data Sources** from Sources and Scanning.

   :::image type="content" source="./media/scan-resource-firewall/scan-management-center.png" alt-text="Screenshot to select data sources":::

1. Select **New** to add  Data Source.

   :::image type="content" source="./media/scan-resource-firewall/scan-add-datasource.png" alt-text="Screenshot of the selection to add new Data Source":::

1. Select SQLserver as Data Source.
   :::image type="content" source="./media/scan-resource-firewall/scan-sql-source.png" alt-text="Screenshot to select sql server.":::

1. Select Subscription Storage Account and add Name and to register Data Source. Click **Finish** to Complete registration. 
   :::image type="content" source="./media/scan-resource-firewall/scan-sql-register.png" alt-text="Screenshot to finish the selection":::

1. Select **Set Up Scan** for the storage that is behind the firewall and test connection. The connection indicates it is successful. 
 :::image type="content" source="./media/scan-resource-firewall/scan-sql-setscan.png" alt-text="Screenshot of the selection t0 set up scan.":::

1. Set up the scan frequency and click on Continue.
   :::image type="content" source="./media/scan-resource-firewall/scan-sql-once.png" alt-text="Screenshot of the selection to launch the sql scan.":::
1.  **Scan gets completed** for the storage that is behind the firewall successfully
   :::image type="content" source="./media/scan-resource-firewall/scan-sql-success.png" alt-text="Screenshot of the message scan completed":::