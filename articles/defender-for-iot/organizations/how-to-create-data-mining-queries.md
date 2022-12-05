---
title: Create data mining queries and reports in Defender for IoT
description: Learn how to create granular reports about network devices.
ms.date: 12/05/2022
ms.topic: how-to
---

# Create data mining queries

Running data mining queries provides dynamic and detailed information about your network devices. This includes information for specific time periods, internet connectivity, ports and protocols, firmware versions, programming commands, and device state.

Data mining information is saved and stored continuously, except for when a device is deleted. Data mining results can be exported and stored externally to a secure server. In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

## Prerequisites

You must be an **Admin** or **Security Analyst** [user](roles-on-premises.md) to access predefined data mining reports.

## Create a report

Reports are dynamically updated each time you open them. The report shows information that's accurate for the date of viewing the report, rather than the date of creating the report.

**To generate a report**:

1. Select **Data Mining** from the side menu. Predefined suggested reports appear automatically.

1. Select **Create report** and then enter the following values:

    | Parameter | Description |
    |---------|---------|
    | **Name** / **Description** | Enter a meaningful name for your report and an optional description. |
    | **Send to CM** | Toggle this option on to send your report to your on-premises management console. |
    | **Choose category** | Select the categories to include in your report. |
    | **Order by** | Select to sort your data by category or by activity. |
    | **Filter by** | Define a filter for your report, using dates, IP address, MAC address, port, or device group. |

1. Select **Save** to save your report and display results on the **Data Mining** page.

## Custom data mining reports

Customize your data mining queries, using the different parameters in the **Create new report** pane, to:

| Purpose | Description |
|---------|---------|
| **SOC incident response** | Generate a report in real time to help deal with immediate incident response. For example, Data Mining can generate a report for a list of devices that might require patching. |
| **Forensics** | Generate a report based on historical data for investigative reports. |
| **Network security** | Generate a report that helps improve overall network security. For example, generate a report that lists devices with weak authentication credentials. |
| **Visibility** | Generate a report that covers all query items to view all baseline parameters of your network. |
| **PLC security** | Improve security by detecting PLCs in unsecure states, such as Program and Remote states. |

## Predefined data mining reports

The following predefined reports are available in the **Data Mining** page. These queries are generated in real time.

| Report | Description |
|---------|---------|
| **Programming commands** | Devices that send industrial programming. |
| **Remote access** | Devices that communicate through remote session protocols. |
| **Internet activity** | Devices that are connected to the internet. |
| **CVEs** | A list of devices detected with known vulnerabilities, along with CVSSv2 risk scores. |
| **Excluded CVEs** | A list of all the CVEs that were manually excluded. Customize the CVE list manually if you want the VA reports and attack vectors to reflect your network more accurately. Customization includes excluding or including particular CVEs and updating the CVSSv2 score accordingly. |
| **Nonactive devices** | Devices that haven't communicated for the past seven days. |
| **Active devices** | Active network devices within the last 24 hours. |

## Generate reports in on-premises management console

The on-premises management console lets you generate reports for each sensor that's connected to it. For each sensor, you can generate a default report or a custom report configured on that sensor. When you choose a sensor from the on-premises management console, all the custom reports configured on that sensor appear in the list of reports.

**To generate a report**:

1. Select **Reports** from the side menu.

2. From the **Sensors** drop-down list, select the sensor for which you want to generate the report.

3. From the **Select Report** drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false":::.

## Default reports in on-premises management console

Reports are based on sensor data-mining queries that are performed, and include:

| Information  | Description  |
|---------|---------|
| **Active Devices (Last 24 Hours)** | Presents a list of devices that show network activity within a period of 24 hours. |
| **Non-Active Devices (Last 7 Days)** | Presents a list of devices that show no network activity in the last seven days. |
| **Programming Commands** | Presents a list of devices that sent programming commands within the last 24 hours. |
| **Remote Access** | Presents a list of devices that remote sources accessed within the last 24 hours. |

## Next steps

Continue creating other reports for more security data from your OT sensor. For more information, see:

- [Risk assessment reporting](how-to-create-risk-assessment-reports.md)

- [Attack vector reporting](how-to-create-attack-vector-reports.md)

- [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)
