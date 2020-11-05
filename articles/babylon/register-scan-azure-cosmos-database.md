---
title: 'How to scan Azure Cosmos Database (SQL API)'
titleSuffix: Azure Purview
description: This how to guide describes details of how to scan Azure Cosmos Database (SQL API). 
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/9/2020
---

# Register and Scan Azure Cosmos Database (SQL API)    
This article outlines how to register an Azure Cosmos Database (SQL API) account in Purview and set up a scan.

## Supported capabilities
Azure Cosmos Database (SQL API) supports the following:
* Full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications

## Prerequisites
* You need to be a Data Source Administrator to setup and schedule scans

## Register an Azure Cosmos Database (SQL API) account
1. Navigate to your Purview catalog.
2. Click on **Management Center** on the left navigation pane.

    :::image type="content" source="./media/register-scan-azure-cosmos-database/go-to-management-center.png" alt-text="Screenshot showing how to go to Management Center" lightbox="./media/register-scan-azure-cosmos-database/go-to-management-center.png":::

3. Under **Sources and Scanning** pane, go to **Data sources** and hit the + sign on the right pane.
4. You can see **Register sources** pane open up on the right side of your screen. From the tiles of data sources, select **Azure Cosmos Database (SQL API)** and hit **continue**

## Set up authentication for a scan
The supported Authentication mechanism for Azure Cosmos Database (SQL API) is **Account Key**

### Account key
Enter the storage account key manually as shown in screenshot below. The account key can be found at Settings--> Keys on Cosmos DB account on Azure portal. Click on "Test connection" to verify if the connection is successful.


:::image type="content" source="./media/register-scan-azure-cosmos-database/service-principal-auth.png" alt-text="Screenshot showing service principal authorization":::

## Create and run a scan
After you have entered storage account key , select Continue. 

**Scope your scan**
The next screen here is to scope the scan. Please select the folders you want to scan and select continue (by default all the folders will be selected)

:::image type="content" source="./media/register-scan-azure-cosmos-database/scope-scan.png" alt-text="Screenshot scope scans":::

The next screen is where you set your scan trigger, telling the system how often you would like to scan.

> [!NOTE] 
> Once means no schedule, which is an indication to the system that the scan should only run once.

Here are some examples of triggers that are set up on a monthly cadence below. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

You can also set up a trigger on a weekly cadence with an option to choose the day of the week.

**Set scan rule set**
Select a scan rule set to be used by your scan from the list of available

:::image type="content" source="./media/register-scan-azure-cosmos-database/select-scan-rule-set.png" alt-text="Screenshot showing scan rule set":::

**Review your scan**
When you click Continue, you will be presented with scan summary page, where you can view all the settings for your scan.

:::image type="content" source="./media/register-scan-azure-cosmos-database/review-save-run.png" alt-text="Screenshot showing review your scan":::

**Edit a scan**
Select a scan and click Edit to edit the selected scan. You can only edit one scan at a time.

**Remove a scan**
To remove a scan, select one or more scans from the list, then select **Remove**.

**Scan history**
Select any scan in the list to get to the scan history page. This page will show you whether your scan was schedule or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

**Run a scan manually**
From the **Scan History page**, you can choose **Run Scan now** to launch a new scan immediately. This action will run a full scan, not an incremental scan.

**Cancel scans in progress**
Select one or more scans that are in progress by selecting the checkbox for each.

Then select **Cancel Scan** to stop all the selected scans from running.

## Summary
In this tutorial, you scanned an Azure Cosmos Database (SQL API) account using the portal.
