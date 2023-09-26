---
title: Create data mining queries and reports in Defender for IoT
description: Learn how to create granular reports about network devices.
ms.date: 08/28/2023
ms.topic: how-to
---

# Create data mining queries

Run data mining queries to view details about the network devices detected by your OT sensor, like internet connectivity, ports and protocols, firmware versions, programming commands, and device state.

Defender for IoT OT network sensors provide a series of out-of-the-box reports for you to use. Both out-of-the-box and custom data mining reports always show information that’s correct for the day you’re viewing the report, rather than the day the report or query was created.

Data mining query data is continuously saved until a device is deleted, and is automatically backed on a daily basis to ensure system continuity.

## Prerequisites

To create data mining reports, you must be able to access the OT network sensor you want to generate data for as an **Admin** or **Security Analyst** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View an OT sensor predefined data mining report

To view current data on a predefined, out-of-the-box data mining report, sign into the OT sensor and select **Data Mining** on the left.

The following out-of-the-box reports are listed in the **Recommended** area, ready for you to use:

| Report | Description |
|---------|---------|
| **Programming Commands** | Lists all detected devices that send industrial programming commands. |
| **Internet Activity** | Lists all detected devices that are connected to the internet. |
| **Excluded CVEs** | Lists all detected devices that have CVEs that were manually excluded from the **CVEs** report. |
| **Active Devices (Last 24 Hours)** | Lists all detective devices that have had active traffic within the last 24 hours. |
| **Remote Access** | Lists all detected devices that communicate through remote session protocols. |
| **CVEs** | Lists all detected devices with known vulnerabilities, along with CVSS risk scores. <br> <br> Select **Edit** to delete and exclude specific CVEs from the report. <br><br> **Tip**: Delete CVEs to exclude them from the list to have your attack vector reports to reflect your network more accurately. |
| **Nonactive Devices (Last 7 Days)** | Lists all detected devices that haven't communicated for the past seven days. |

Select a report to view today’s data. Use the :::image type="icon" source="media/how-to-generate-reports/refresh-icon.png" border="false"::: **Refresh**, :::image type="icon" source="media/how-to-generate-reports/expand-all-icon.png" border="false"::: **Expand all**, and :::image type="icon" source="media/how-to-generate-reports/collapse-all-icon.png" border="false"::: **Collapse all** options to update and change your report views.

## Create an OT sensor custom data mining report

Create your own custom data mining report if you have reporting needs not covered by the out-of-the-box reports. Once created, custom data mining reports are visible to all users.

**To create a custom data mining report**:

1. Sign into the OT sensor and select **Data Mining** > **Create report**.

1. In the **Create new report** pane on the right, enter the following values:

    | Name | Description |
    |---------|---------|
    | **Name** / **Description** | Enter a meaningful name for your report and an optional description. |
    | **Send to CM** | Select to send your report to the on-premises management console. |
    | **Choose category** | Select the categories to include in your report. <br><br> For example, select **Internet Domain Allowlist** under **DNS** to create a report of the allowed internet domains and their resolved IP addresses. |
    | **Order by** | Select to sort your data by category or by activity. |
    | **Filter by** | Define a filter for your report using any of the following parameters: <br><br> - **Results within the last**: Enter a number and then select **Minutes**, **Hours**, or **Days** <br> - **IP address / MAC address / Port**: Enter one or more IP addresses, MAC addresses, and ports to filter into your report. Enter a value and then select + to add it to the list.<br> - **Device group**: Select one or mode device groups to filter into your report. |
    | **Add filter type** | Select to add any of the following filter types into your report. <br><br> - Transport (GENERIC) <br> - Protocol (GENERIC) <br> - TAG (GENERIC) <br> - Maximum value (GENERIC) <br> - State (GENERIC) <br> - Minimum value (GENERIC) <br><br> Enter a value in the relevant field and then select + to add it to the list. |

1. Select **Save**. Your data mining report is shown in the **My reports** area. For example:

    :::image type="content" source="media/how-to-generate-reports/custom-data-mining-reports.png" alt-text="Screenshot of a list of customized data mining reports." lightbox="media/how-to-generate-reports/custom-data-mining-reports.png":::

## Manage OT sensor data mining report data

Each data mining report on an OT sensor has the following options for managing your data:

| Option | Description |
|---------|---------|
| :::image type="icon" source="media/how-to-generate-reports/export-icon.png" border="false"::: **Export to CSV** | Export the current report data to a CSV file. |
| :::image type="icon" source="media/how-to-generate-reports/export-icon.png" border="false"::: **Export to PDF** | Export the current report data to a PDF file. |
| :::image type="icon" source="media/how-to-generate-reports/snapshot-icon.png" border="false"::: **Snapshots** | Save the current report data as a snapshot you can return to later. |
| :::image type="icon" source="media/how-to-generate-reports/manage-icon.png" border="false"::: **Manage report** | Update the values of an existing custom data mining report. This option is disabled for Recommended reports. |
| :::image type="icon" source="media/how-to-generate-reports/edit-icon.png" border="false"::: **Edit mode** | Select to remove specific results from the saved report. |

For example, select **Manage report** to update the data your report includes using the same fields as when you'd originally [created the report](#create-an-ot-sensor-custom-data-mining-report):

:::image type="content" source="media/how-to-generate-reports/manage-report-pane.png" alt-text="Screenshot of the manage report pane." lightbox="media/how-to-generate-reports/manage-report-pane.png":::

## View data mining reports for multiple sensors

Sign into an on-premises management console to view [out-of-the-box data mining reports](#view-an-ot-sensor-predefined-data-mining-report) for any connected sensor, and any custom data mining reports that were [sent to the CM](#create-an-ot-sensor-custom-data-mining-report).

**To view a data mining report from an on-premises management console**:

1. Sign into your on-premises management console and select **Reports** on the left.

1. From the **Sensors** drop-down list, select the sensor for which you want to generate the report.

1. From the **Select Report** drop-down list, select the report that you want to generate.

The page lists the current report data. Select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false"::: to export the data to a PDF file.

## Next steps

- View additional reports based on cloud-connected sensors in the Azure portal. For more information, see [Visualize Microsoft Defender for IoT data with Azure Monitor workbooks](workbooks.md)

- Continue creating other reports for more security data from your OT sensor. For more information, see:

  - [Risk assessment reporting](how-to-create-risk-assessment-reports.md)

  - [Attack vector reporting](how-to-create-attack-vector-reports.md)

  - [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)
