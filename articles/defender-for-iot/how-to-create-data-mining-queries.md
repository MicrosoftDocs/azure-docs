---
title: Create data mining reports
description: generate comprehensive and granular information about your network devices at various layers, such as protocols, firmware versions, or programming commands.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 01/20/2021
ms.topic: how-to
ms.service: azure
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

:::image type="content" source="media/how-to-generate-reports/active-device-list-v2.png" alt-text="List of active devices.":::

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

:::image type="content" source="media/how-to-generate-reports/data-mining-screeshot-v2.png" alt-text="The data mining screen.":::

## Create a data mining query

To create a data-mining report:

1. Select **Data Mining** from the side menu. Predefined suggested reports appear automatically.

 :::image type="content" source="media/how-to-generate-reports/data-mining-screeshot-v2.png" alt-text="Select data mining from side pane.":::

2. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false":::.

3. Select **New Report** and define the report.

   :::image type="content" source="media/how-to-generate-reports/create-new-report-screen.png" alt-text="Create a new report by filling out this screen.":::

   The following parameters are available:

   - Provide a report name and description.

   - For categories, select either:

      - **Categories (All)** to view all report results about all devices in your network.

      - **Generic** to choose standard categories.

   - Select specific report parameters of interest to you.

   - Choose a sort order (**Order by**). Sort results based on activity or category.

   - Select **Save to Report Pages** to save the report results as a report that's accessible from the **Report** page. This will enable RO users to run the report that you created.

   - Select **Filters (Add)** to add more filters. Wildcard requests are supported.

   - Specify a device group (defined in the device map).

   - Specify an IP address.

   - Specify a port.

   - Specify a MAC address.

4. Select **Save**. Report results open on the **Data Mining** page.

:::image type="content" source="media/how-to-generate-reports/data-mining-page.png" alt-text="Report results as seen on the Data Mining page.":::

### Manage data-mining reports

The following table describes management options for data mining:

| Icon image | Description |
|--|--|
| :::image type="icon" source="media/how-to-generate-reports/edit-a-simulation-icon.png" border="false"::: | Edit the report parameters. |
| :::image type="icon" source="media/how-to-generate-reports/export-as-pdf-icon.png" border="false"::: | Export as PDF. |
| :::image type="icon" source="media/how-to-generate-reports/csv-export-icon.png" border="false"::: |Export as CSV. |
| :::image type="icon" source="media/how-to-generate-reports/information-icon.png" border="false"::: | Show additional information such as the date last modified. Use this feature to create a query result snapshot. You might need to do this for further investigation with team leaders or SOC analysts, for example. |
| :::image type="icon" source="media/how-to-generate-reports/pin-icon.png" border="false"::: | Display on the **Reports** page or hide on the **Reports** page. :::image type="content" source="media/how-to-generate-reports/hide-reports-page.png" alt-text="Hide or reveal your reports."::: |
| :::image type="icon" source="media/how-to-generate-reports/delete-simulation-icon.png" border="false"::: | Delete the report. |

#### Create customized directories 

You can organize the extensive information for data-mining queries by creating directories for categories. For example, you can create directories for protocols or locations.

To create a new directory:

1. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false"::: to add a new directory.

2. Select **New Directory** to display the new directory form.

3. Name the new directory.

4. Drag the required reports into the new directory. At any time, you can drag the report back to the main view.

5. Right-click the new directory to open, edit, or delete it.

#### Create snapshots of report results

You might need to save certain query results for further investigation. For example, you might need to share results with various security teams.

Snapshots are saved within the report results and don't generate dynamic queries.

:::image type="content" source="media/how-to-generate-reports/report-results-report.png" alt-text="Snapshots.":::

To create a snapshot:

1. Open the required report.

2. Select the information icon :::image type="icon" source="media/how-to-generate-reports/information-icon.png" border="false":::.

3. Select **Take New**.

4. Enter a name for the snapshot and select **Save**.

:::image type="content" source="media/how-to-generate-reports/take-a-snapshot.png" alt-text="Take a snapshot.":::

#### Customize the CVE list

You can manually customize the CVE list as follows:

  - Include/exclude CVEs

  - Change the CVE score

To perform manual changes in the CVE report:

1.  From the side menu, select **Data Mining**.

2. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false"::: in the upper-left corner of the **Data Mining** window. Then select **New Report**.

   :::image type="content" source="media/how-to-generate-reports/create-a-new-report-screen.png" alt-text="Create a new report.":::

3. From the left pane, select one of the following options:

   - **Known Vulnerabilities**: Selects both options and presents results in the report's two tables, one with CVEs and the other with excluded CVEs.

   - **CVEs**: Select this option to present a list of all the CVEs.

   - **Excluded CVEs**: Select this option to presents a list of all the excluded CVEs.

4. Fill in the **Name** and **Description** information and select **Save**. The new report appears in the **Data Mining** window.

5. To exclude CVEs, open the data-mining report for CVEs. The list of all the CVEs appears.

   :::image type="content" source="media/how-to-generate-reports/cves.png" alt-text="C V E report.":::

6. To enable selecting items in the list, select :::image type="icon" source="media/how-to-generate-reports/enable-selecting-icon.png" border="false"::: and select the CVEs that you want to customize. The **Operations** bar appears on the bottom.

   :::image type="content" source="media/how-to-generate-reports/operations-bar-appears.png" alt-text="Screenshot of the data-mining Operations bar.":::

7. Select the CVEs that you want to exclude, and then select **Delete Records**. The CVEs that you've selected don't appear in the list of CVEs and will appear in the list of excluded CVEs when you generate one.

8. To include the excluded CVEs in the list of CVEs, generate the report for excluded CVEs and delete from that list the items that you want to include back in the list of CVEs.

9. Select the CVEs in which you want to change the score, and then select **Update CVE Score**.

   :::image type="content" source="media/how-to-generate-reports/set-new-score-screen.png" alt-text="Update the CVE score.":::

10. Enter the new score and select **OK**. The updated score appears in the CVEs that you selected.



## Sensor reports based on data mining

Regular reports, accessed from the **Reports** option, are predefined data mining reports. They're not dynamic queries as are available in data mining, but a static representation of the data mining query results.

Data mining query results are not available to Read Only users. Administrators and security analysts who want Read Only users to have access to the information generated by data mining queries should save the information as report.

Reports reflect information generated by data mining query results. This includes default data mining reports, which are available in the Reports view. Administrator and security analysts can also generate custom data mining queries, and save them as reports. These reports are available for RO users as well.

To generate a report:

1. Select **Reports** on the side menu.

2. Choose the required report to display. The choice can be **Custom** or **Auto-Generated** reports, such as **Programming Commands** and **Remote Access**.

3. You can export the report by selecting one of the icons on the upper right of the screen:

   :::image type="icon" source="media/how-to-generate-reports/export-to-pdf-icon.png" border="false"::: Export to a PDF file.

   :::image type="icon" source="media/how-to-generate-reports/export-to-csv-icon.png" border="false"::: Export to a CSV file.

> [!NOTE] 
> The RO user can see only reports created for them.

:::image type="content" source="media/how-to-generate-reports/select-a-report-screen.png" alt-text="Select the report to generate.":::

:::image type="content" source="media/how-to-generate-reports/remote-access-report.png" alt-text="Remote access report generated.":::

## On-premises management console reports based on data mining reports

The on-premises management console lets you generate reports for each sensor that's connected to it. Reports are based on sensor data-mining queries that are performed.

You can generate the following reports:

- **Active Devices (Last 24 Hours)**: Presents a list of devices that show network activity within a period of 24 hours.

- **Non-Active Devices (Last 7 Days)**: Presents a list of devices that show no network activity in the last seven days.

- **Programming Commands**: Presents a list of devices that sent programming commands within the last 24 hours.

- **Remote Access**: Presents a list of devices that remote sources accessed within the last 24 hours.

:::image type="content" source="media/how-to-generate-reports/reports-view.png" alt-text="Screenshot of the reports view.":::

When you choose the sensor from the on-premises management console, all the custom reports configured on that sensor appear in the list of reports. For each sensor, you can generate a default report or a custom report configured on that sensor.

To generate a report:

1. On the left pane, select **Reports**. The **Reports** window appears.

2. From the **Sensors** drop-down list, select the sensor for which you want to generate the report.

   :::image type="content" source="media/how-to-generate-reports/sensor-drop-down-list.png" alt-text="Screenshot of sensors view.":::

3. From the right drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false":::.
