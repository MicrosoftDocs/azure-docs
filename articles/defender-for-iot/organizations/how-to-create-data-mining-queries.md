---
title: Create data mining reports
description: generate comprehensive and granular information about your network devices at various layers, such as protocols, firmware versions, or programming commands.
ms.date: 02/22/2022
ms.topic: how-to
---

# Sensor data mining queries

## About Sensor data mining queries

Data mining tools let you generate comprehensive and granular information about your network devices at various layers. For example, you can create a query based on:

- Time periods

- Connections to the internet

- Ports

- Protocols

- Firmware versions

- Programming commands

- Inactivity of the device

You can fine-tune the report based on filters. For example, you can query a specific subnet in which firmware was updated.


Various tools are available to manage queries. For example, you can export and save.

> [!NOTE]
> Administrators and security analysts have access to data-mining options.

### Dynamic updates

Data mining queries that you create are dynamically updated each time you open them. For example:

- If you create a report for firmware versions on devices on June 1 and open the report again on June 10, this report will be updated with information that's accurate for June 10.

- If you create a report to detect new devices discovered over the last 30 days on June 1 and open the report on June 30, the results will be displayed for the last 30 days.

### Data mining use cases

You can use queries to handle an extensive range of security needs for various security teams:

- **SOC incident response**: Generate a report in real time to help deal with immediate incident response. For example, Data Mining can generate a report for a list of devices that might require patching.

- **Forensics**: Generate a report based on historical data for investigative reports.

- **IT Network Integrity**: Generate a report that helps improve overall network security. For example, generate a report can be generated that lists devices with weak authentication credentials.

- **Visibility**: Generate a report that covers all query items to view all baseline parameters of your network.

- **PLC Security** Improve security by detecting PLCs in unsecure states for example Program and Remote states.

## Data mining storage

Data mining information is saved and stored continuously, except for when a device is deleted. Data mining results can be exported and stored externally to a secure server. In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

## Predefined data mining queries

The following predefined queries are available. These queries are generated in real time.

- **CVEs**: A list of devices detected with known vulnerabilities within the last 24 hours.

- **Excluded CVEs**: A list of all the CVEs that were manually excluded. To achieve more accurate results in VA reports and attack vectors, you can customize the CVE list manually by including and excluding CVEs.

- **Internet activity**: Devices that are connected to the internet.

- **Nonactive devices**: Devices that have not communicated for the past seven days.

- **Active devices**: Active network devices within the last 24 hours.

- **Remote access**: Devices that communicate through remote session protocols.

- **Programming commands**: Devices that send industrial programming.

These reports are automatically accessible from the **Reports** screen, where RO users and other users can view them. RO users can't access data-mining reports.

## Create a data mining query

To create a data-mining report:

1. Select **Data Mining** from the side menu. Predefined suggested reports appear automatically.

1. Select **Create report** and then enter the following values:

    - **Name** / **Description**. Enter a meaningful name for your report and an optional description.
    - **Send to CM**. Toggle this option on to send your report to your on-premises management console.
    - **Choose category**. Select the categories to include in your report.
    - **Order by**. Select to sort your data by category or by activity.
    - **Filter by**. Define a filter for your report, using dates, IP address, MAC address, port, or device group.

1. Select **Save** to save your report and display results on the **Data Mining** page.

### Manage data-mining reports

Select a report to access the following data mining report options:

- **Refresh**: Refresh the page with updated data.
- **Expand all** / **Collapse all**: Expand all report sections.
- **Export to CSV** / **Export to PDF**: Export the report as a CSV or PDF file that you can save locally.
- **Snapshots**. Enables you to take a snapshot of the current data being reported.
- **Manage report**: Enables you to modify the report parameters to show different data.
- **Edit mode**: Shows the report in an editing mode. Editing mode also allows you to delete the report entirely.


#### Customize the CVE list

You can manually customize the CVE list as follows:

  - Include/exclude CVEs

  - Change the CVE score

To perform manual changes in the CVE report:

1.  From the side menu, select **Data Mining**.

2. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false"::: in the upper-left corner of the **Data Mining** window. Then select **New Report**.

3. From the left pane, select one of the following options:

   - **Known Vulnerabilities**: Selects both options and presents results in the report's two tables, one with CVEs and the other with excluded CVEs.

   - **CVEs**: Select this option to present a list of all the CVEs.

   - **Excluded CVEs**: Select this option to presents a list of all the excluded CVEs.

4. Fill in the **Name** and **Description** information and select **Save**. The new report appears in the **Data Mining** window.

5. To exclude CVEs, open the data-mining report for CVEs. The list of all the CVEs appears.

6. To enable selecting items in the list, select :::image type="icon" source="media/how-to-generate-reports/enable-selecting-icon.png" border="false"::: and select the CVEs that you want to customize. The **Operations** bar appears on the bottom.

7. Select the CVEs that you want to exclude, and then select **Delete Records**. The CVEs that you've selected don't appear in the list of CVEs and will appear in the list of excluded CVEs when you generate one.

8. To include the excluded CVEs in the list of CVEs, generate the report for excluded CVEs and delete from that list the items that you want to include back in the list of CVEs.

9. Select the CVEs in which you want to change the score, and then select **Update CVE Score**.

10. Enter the new score and select **OK**. The updated score appears in the CVEs that you selected.



## Sensor reports based on data mining

Regular reports, accessed from the **Reports** option, are predefined data mining reports. They're not dynamic queries as are available in data mining, but a static representation of the data mining query results.

Data mining query results are not available to Read Only users. Administrators and security analysts who want Read Only users to have access to the information generated by data mining queries should save the information as report.

Reports reflect information generated by data mining query results. This includes default data mining reports, which are available in the Reports view. Administrator and security analysts can also generate custom data mining queries, and save them as reports. These reports are available for RO users as well.

To generate a report:

1. Select **Reports** on the side menu.

2. Choose the required report to display. The choice can be **Custom** or **Auto-Generated** reports, such as **Programming Commands** and **Remote Access**.

3. You can export the report by selecting one of the icons on the upper right of the screen:


> [!NOTE] 
> The RO user can see only reports created for them.


## On-premises management console reports based on data mining reports

The on-premises management console lets you generate reports for each sensor that's connected to it. Reports are based on sensor data-mining queries that are performed.

You can generate the following reports:

- **Active Devices (Last 24 Hours)**: Presents a list of devices that show network activity within a period of 24 hours.

- **Non-Active Devices (Last 7 Days)**: Presents a list of devices that show no network activity in the last seven days.

- **Programming Commands**: Presents a list of devices that sent programming commands within the last 24 hours.

- **Remote Access**: Presents a list of devices that remote sources accessed within the last 24 hours.


When you choose the sensor from the on-premises management console, all the custom reports configured on that sensor appear in the list of reports. For each sensor, you can generate a default report or a custom report configured on that sensor.

To generate a report:

1. On the left pane, select **Reports**. The **Reports** window appears.

2. From the **Sensors** drop-down list, select the sensor for which you want to generate the report.

3. From the right drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false":::.
