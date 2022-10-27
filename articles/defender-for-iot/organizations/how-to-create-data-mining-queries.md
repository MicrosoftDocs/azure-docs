---
title: Create data mining queries and reports in Defender for IoT
description: Learn how to create granular reports about network devices.
ms.date: 02/02/2022
ms.topic: how-to
---

# Run data mining queries

Using data mining queries to get dynamic, granular information about your network devices, including for specific time periods, internet connectivity, ports and protocols, firmware versions, programming commands, and device state. You can use data mining queries for:

- **SOC incident response**: Generate a report in real time to help deal with immediate incident response. For example, Data Mining can generate a report for a list of devices that might require patching.
- **Forensics**: Generate a report based on historical data for investigative reports.
- **Network security**: Generate a report that helps improve overall network security. For example, generate a report can be generated that lists devices with weak authentication credentials.
- **Visibility**: Generate a report that covers all query items to view all baseline parameters of your network.
- **PLC security** Improve security by detecting PLCs in unsecure states, for example,  Program and Remote states.

Data mining information is saved and stored continuously, except for when a device is deleted. Data mining results can be exported and stored externally to a secure server. In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

## Predefined data mining reports

The following predefined reports are available. These queries are generated in real time.

- **Programming commands**: Devices that send industrial programming.
- **Remote access**: Devices that communicate through remote session protocols.
- **Internet activity**: Devices that are connected to the internet.
- **CVEs**: A list of devices detected with known vulnerabilities, along with CVSSv2 risk scores.
- **Excluded CVEs**: A list of all the CVEs that were manually excluded. It is possible to customize the CVE list manually so that the VA reports and attack vectors more accurately reflect your network by excluding or including particular CVEs and updating the CVSSv2 score accordingly.
- **Nonactive devices**: Devices that haven't communicated for the past seven days.
- **Active devices**: Active network devices within the last 24 hours.

Find these reports in **Analyze** > **Data Mining**. Reports are available for users with Administrator and Security Analyst permissions. Read only users can't access these reports.

## Create a report
To create a data-mining report:

1. Select **Data Mining** from the side menu. Predefined suggested reports appear automatically.

1. Select **Create report** and then enter the following values:

    - **Name** / **Description**. Enter a meaningful name for your report and an optional description.
    - **Send to CM**. Toggle this option on to send your report to your on-premises management console.
    - **Choose category**. Select the categories to include in your report.
    - **Order by**. Select to sort your data by category or by activity.
    - **Filter by**. Define a filter for your report, using dates, IP address, MAC address, port, or device group.

1. Select **Save** to save your report and display results on the **Data Mining** page.

Reports are dynamically updated each time you open them. For example:
- If you create a report for firmware versions on devices on June 1 and open the report again on June 10, this report will be updated with information that's accurate for June 10.
- If you create a report to detect new devices discovered over the last 30 days on June 1 and open the report on June 30, the results will be displayed for the last 30 days.

## Managing reports

Reports can be viewed in the **Data Mining** page, You can refresh a report, edit report parameters, and export to a CSV file or PDF. You can also take a snapshot of a report.


## View reports in on-premises management console

The on-premises management console lets you generate reports for each sensor that's connected to it. Reports are based on sensor data-mining queries that are performed, and include:

- **Active Devices (Last 24 Hours)**: Presents a list of devices that show network activity within a period of 24 hours.
- **Non-Active Devices (Last 7 Days)**: Presents a list of devices that show no network activity in the last seven days.
- **Programming Commands**: Presents a list of devices that sent programming commands within the last 24 hours.
- **Remote Access**: Presents a list of devices that remote sources accessed within the last 24 hours.

When you choose the sensor from the on-premises management console, all the custom reports configured on that sensor appear in the list of reports. For each sensor, you can generate a default report or a custom report configured on that sensor.

To generate a report:

1. On the left pane, select **Reports**. The **Reports** window appears.

2. From the **Sensors** drop-down list, select the sensor for which you want to generate the report.

   :::image type="content" source="media/how-to-generate-reports/sensor-drop-down-list.png" alt-text="Screenshot of sensors view.":::

3. From the right drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false":::.


## Next steps

For more information, see:

- [Risk assessment reporting](how-to-create-risk-assessment-reports.md)

- [Attack vector reporting](how-to-create-attack-vector-reports.md)

- [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)