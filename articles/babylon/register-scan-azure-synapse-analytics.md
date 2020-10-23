---
title: 'How to scan Azure Synapse Analytics'
titleSuffix: Babylon
description: This how to guide describes details of how to scan Azure Synapse Analytics. 
author: SunetraVirdi
ms.author: suvirdi
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/22/2020
---

# Register and scan Azure Synapse Analytics
## Supported capabilities
Azure Synapse Analytics supports the following:<br />
* Full and incremental scans to capture the metadata and apply classifications on the metadata, based on system and customer classifications<br />

## Prerequisites
* You need to be a Catalog Admin or Data Source Admin

## Register an Azure Synapse Analytics server
Navigate to your Babylon catalog.

Click on **Management Center** on the left navigation pane.

<!---![Screenshot showing how to go to Management Center]--->

Under **Sources and Scanning** pane, go to **Data sources** and hit the + sign on the right pane.

You can see **Register sources** pane open up on the right side of your screen. From the tiles of data sources, select **Azure Synapse Analytics** and hit **continue**

**Register sources** appears. Select a source name of your choice.

![Screenshot showing registration of source](./media/register-scan-azure-synapse-analytics/register.png)

## Set up authentication for a scan
Set up authentication for Azure Synapse Analytics using Azure subscription or manually.

Select authentication method as **Enter Manually**

Pick the server name

Click "Finish"

## Create and run a scan

Go to the data source name that you picked in step 5 and click **+ New scan** to set up a scan. You can enter the database name along with user name and pass word and test the connection.

<!---![screenshot to register data source]--->

Hit **continue** once the connection is successful. 

**Set scan trigger**
> [!NOTE] 
> Once means no schedule, which is an indication to the system that the scan should only run once. Recurring allows you to create a schedule the system should run the scan according to. The first execution of the scan will begin on the start date and time provided. Options include Monthly or Weekly scans.

You have the option to scan once or set up a recurring scan where you will pick a date and time to run the scan periodically.You can select the time it starts at and define the recurrence for a particular day of the month, and a time on that day of your choosing. You can also choose to specify an end date or not (meaning the recurrence of the scan will happen indefinitely).

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
