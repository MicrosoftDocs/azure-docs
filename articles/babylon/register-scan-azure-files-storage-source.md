---
title: 'How to scan Azure files'
titleSuffix: Azure Purview
description: This how to guide describes details of how to scan Azure files. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/01/2020
---

# Register and scan Azure Files
## Supported capabilities
Azure Files supports the following:<br />
* Full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications<br />

## Prerequisites
* You need to be a Catalog Admin or Data Source Admin

## Register an Azure Files storage account
1. Navigate to your Purview catalog.<br />
2. Click on **Management Center** on the left navigation pane.<br />

<!---![Screenshot showing how to go to Management Center]--->

3. Under **Sources and Scanning** pane, go to **Data sources** and hit the + sign on the right pane.<br />
4. You can see **Register sources** pane open up on the right side of your screen. From the tiles of data sources, select **Azure Files** and hit **continue**<br />
<br />

## Set up authentication for a scan
Set up authentication for Azure Files Storage using Account Key<br />


### Account Key

1. Select authentication method as **Account Key**<br />
2. Select "From Azure subscription" option. <br />
3. Pick your Azure subscription where the Azure Files account exists.<br />
4. Pick your storage account name from the list.<br />
5. Click "Finish"<br />
<!---![screenshot to register data source]--->

## Create and run a scan
After you have setup your authentication type, click Continue. The next screen is where you set your scan trigger, telling the system how often you would like to scan.

> [!NOTE] 
> Once means no schedule, which is an indication to the system that the scan should only run once. Recurring allows you to create a schedule the system should run the scan according to. The first execution of the scan will begin on the start date and time provided. Options include Monthly or Weekly scans.

Here are some examples of triggers that are set up on a monthly cadence below. You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

You can also set up a trigger on a weekly cadence with an option to choose the day of the week.

**Set scan rule set**
Select a scan rule set to be used by your scan from the list of available<br />
<!---![Screenshot showing scan rule set]--->

**Review your scan**
Once you click Continue, you will view all the settings for your scan.<br />
<!---![Screenshot showing scan rule set]--->

**Edit a scan**
Select a scan and click Edit to edit the selected scan. You can only edit one scan at a time.

**Remove a scan**
To remove a scan, select one or more scans from the list, then click Remove.

**Scan history**
Click on any scan in the list to get to the scan history page. This page will show you whether your scan was schedule or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan and the total duration.

**Running a scan manually**
From the Scan History page, you can choose Run Scan now to launch a new scan immediately. This action will run a full scan, not an incremental scan.

**Cancelling scans in progress**
Select one or more scans that are in progress by selecting the checkbox for each.

Then click Cancel Scan to stop all the selected scans from running.

## Summary
In this tutorial you scanned an Azure Files account using the portal.
