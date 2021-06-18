---
author: hophanms
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: include
ms.date: 1/20/2021
---
## Creating and running a scan

> [!Note] 
> The steps and screenshots shown below illustrate the general process for managing scans across different data source types. Your options may differ slightly depending on the types of data sources that you are working with.

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

1. Select the data source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source. 

   :::image type="content" source="media/manage-scans/set-up-scan.png" alt-text="Set up scan":::

1. You can scope your scan to specific parts of the data source such as folders, collections or schemas by checking the appropriate items in the list.

   :::image type="content" source="media/manage-scans/scope-your-scan.png" alt-text="Scope your scan":::

1. The select a scan rule set for you scan. You can choose between the system default, the existing custom ones or create a new one inline.

   :::image type="content" source="media/manage-scans/scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/manage-scans/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

## Viewing your scans and scan runs

To view existing scans, do the following:

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section. 

2. Select the desired data source. You will see a list of existing scans on that data source.

3. Select the scan whose results you are interested to view.

4. This page will show you all of the previous scan runs along with metrics and status for each scan run. It will also display whether your scan was scheduled or manual, how many assets had classifications applied, how many total assets were discovered, the start and end time of the scan, and the total scan duration.

## Manage your scans - edit, delete, or cancel

To manage or delete a scan, do the following:

1. Navigate to the management center. Select **Data sources** under the **Sources and scanning** section then select on the desired data source.

2. Select the scan you would like to manage. You can edit the scan by selecting **Edit**.

3. You can delete your scan by selecting **Delete**. 
