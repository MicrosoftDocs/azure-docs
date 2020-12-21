---
title: Generate reports
description: Gain insight into network activity, risks, attacks, and trends by using Defender for IoT reporting tools.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/17/2020
ms.topic: how-to
ms.service: azure
---

# Generate reports

Gain insight into network activity, risks, attacks, and trends by using Azure Defender for IoT reporting tools. Tools are available to generate reports:

- Based on activity detected by individual sensors.
- Based on activity detected by all sensors. 

These reports are generated from the on-premises management console.

## Reports for sensor risk assessment

Risk assessment reporting lets you generate a security score for each network device, as well as an overall network security score. The overall score represents the percentage of 100 percent security.

This score is based on results from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range of other information is available, such as:

- Configuration issues

- Device vulnerability prioritized by security level

- Network security issues

- Network operational issues

- Attack vectors

- Connections to ICS networks

- Internet connections

- Industrial malware indicators

- Protocol issues

  - Secure Devices: Devices with a security score above 90%.

- **Secure Devices**: Devices with a security score above 90 percent.

- **Vulnerable Devices**: Devices with a security score below 70 percent.

- **Devices Needing Improvement**: Devices with a security score between 70 percent and 89 percent.

To create a report:

1. Select **Risk Assessment** on the side menu.
2. Select a sensor from the **Select Sensor** drop-down list.
3. Select **Generate Report**.
4. Select **Download** from the Archived Reports section.

:::image type="content" source="media/how-to-generate-reports/risk-assessment.png" alt-text="A view of the risk assessment.":::

To import a company logo:

To import a company logo:

- Select **Import Logo**.

## Reports for sensor attack vector

Attack vector reports provide a graphical representation of a vulnerability chain of exploitable devices. These vulnerabilities can give an attacker access to key network devices. The Attack Vector Simulator calculates attack vectors in real time and analyzes all attack vectors for a specific target.

Working with the attack vector lets you evaluate the effect of mitigation activities in the attack sequence. You can then determine, for example, if a system upgrade disrupts the attacker's path by breaking the attack chain, or if an alternate attack path remains. This information helps you prioritize remediation and mitigation activities.

:::image type="content" source="media/how-to-generate-reports/control-center.png" alt-text="View your alerts in the control center.":::

> [!NOTE]
> Administrators and security analysts can perform the procedures described in this section.

To create an attack vector simulation:

1. Select :::image type="content" source="media/how-to-generate-reports/plus.png" alt-text="Plus sign":::on the side menu to add a Simulation.

 :::image type="content" source="media/how-to-generate-reports/vector.png" alt-text="The attack vector simulation.":::

2. Enter simulation properties:

   - **Name**: Simulation name.

   - **Maximum vectors**: The maximum number of vectors in a single simulation.

   - **Show in Device map**: Show the attack vector as a filter on the device map.

   - **All Source devices**: The attack vector will consider all devices as an attack source.

   - **Attack Source**: The attack vector will consider only the specified devices as an attack source.

   - **All Target devices**: The attack vector will consider all devices as an attack target.

   - **Attack Target**: The attack vector will consider only the specified devices as an attack target.

   - **Exclude devices**: Specified devices will be excluded from the attack vector simulation.

   - **Exclude Subnets**: Specified subnets will be excluded from the attack vector simulation.

3. Select **Add Simulation**. The simulation will be added to the simulations list.

   :::image type="content" source="media/how-to-generate-reports/new-simulation.png" alt-text="Add a new simulation.":::

4. Select :::image type="icon" source="media/how-to-generate-reports/edit-a-simulation-icon.png" border="false"::: if you want to edit the simulation.

   Select :::image type="icon" source="media/how-to-generate-reports/delete-simulation-icon.png" border="false"::: if you want to delete the simulation.

   Select :::image type="icon" source="media/how-to-generate-reports/make-a-favorite-icon.png" border="false"::: if you want to mark the simulation as a favorite.

5. A list of attack vectors appears and includes vector score (out of 100), attack source device, and attack target device. Select a specific attack for graphical depiction of attack vectors.

   :::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Attack vectors.":::

## Sensor data-mining queries

Data-mining tools let you generate comprehensive and granular information about your network devices at various layers. For example, you can create a query based on:

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

Data-mining queries that you create are dynamically updated each time you open them. For example:

- If you create a report for firmware versions on devices on June 1 and open the report again on June 10, this report will be updated with information that's accurate for June 10.

- If you create a report to detect new devices discovered over the last 30 days on June 1 and open the report on June 30, the results will be displayed for the last 30 days.

### Data-mining use cases

You can use queries to handle an extensive range of security needs for various security teams:

- **SOC incident response**: Generate a report in real time to help deal with immediate incident response. For example, generate a report for a list of devices that might require patching.

- **Forensics**: Generate a report based on historical data for investigative reports.

- **IT Network Integrity**: Generate a report that helps improve overall network security. For example, generate a report that lists devices with weak authentication credentials.

- **Visibility**: Generate a report that covers all query items to view all baseline parameters of your network.

### Data-mining storage

Data mining information is saved and stored continuously, except for when a device is deleted. Data mining results can be exported and stored externally to a secure server. In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

### Data mining and reports 

Regular reports, accessed from the **Reports** option, are predefined data-mining reports. They're not dynamic queries as are available in data mining, but a static representation of the data-mining query results.

Data-mining query results are not available to RO users. Administrators and security analysts who want RO users to have access to the information generated by data mining queries should save the information as report.

### Predefined queries

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

### Create a data-mining report

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

### Reports based on data mining

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

## Reports for sensor trends and statistics

You can create widget graphs and pie charts to gain insight into network trends and statistics. Widgets can be grouped under user-defined dashboards.

> [!NOTE]
> Only administrators and security analysts can perform the procedures in this section.

To see dashboards and widgets, select **Trends & Statistics** on the side menu.

:::image type="content" source="media/how-to-generate-reports/investigation-screenshot.png" alt-text="Screenshot of an investigation.":::

The dashboard consists of widgets that graphically describe the following types of information:

- Traffic by port
- Channel bandwidth
- Total bandwidth
- Active TCP connection
- Devices:
  - New devices
  - Busy devices
  - Devices by vendor
  - Devices by OS
  - Disconnected devices
- Connectivity drop by hours
- Alerts for incidents by type
- Database table access
- Protocol dissection widgets
- Ethernet and IP address:
  - Ethernet and IP address traffic by CIP service
  - Ethernet and IP address traffic by CIP class
  - Ethernet and IP address traffic by command
- OPC:
  - OPC top management operations
  - OPC top I/O operations
- Siemens S7:
  - S7 traffic by control function
  - S7 traffic by subfunction
- SRTP:
  - SRTP traffic by service code
  - SRTP errors by day
- SuiteLink:
  - SuiteLink top queried tags
  - SuiteLink numeric tag behavior
- IEC-60870 traffic by ASDU
- DNP3 traffic by function
- MMS traffic by service
- Modbus traffic by function
- OPC-UA traffic by service

> [!NOTE]
>  The time in the widgets is set according to the sensor time.

## Reports for the on-premises management console

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

## Risk assessment reports for the on-premises management console

Generate a risk assessment report for each sensor that's connected to your on-premises management console. This report provides insight into each of the networks that your sensors are monitoring.

Risk assessment reports let you generate a security score for each network device, as well as an overall network security score. The overall score is based on deep packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range of other information is available. For example:

- Configuration issues

- Device vulnerability prioritized by security level

- Network security issues

- Network operational issues

- Attack vectors

- Connections to ICS networks

- Internet connections

- Industrial malware indicators

- Protocol issues

The report provides mitigation recommendations that will help you improve your security score.

- Secure devices: Devices with a security score above 90%.

- **Vulnerable devices**: Devices with a security score below 70 percent.

- **Devices needing improvement**: Devices with a security score between 70 percent and 89 percent.

To create a report:

1. Select **Risk Assessment** on the side menu.

2. Select a sensor from the **Select sensor** drop-down list.

3. Select **Generate Report**.

4. Select **Download** from the **Archived Reports** section.

To import a company logo:

- Select **Import Logo**.

:::image type="content" source="media/how-to-generate-reports/import-logo-screenshot.png" alt-text="Import your logo through the risk assessment view.":::

## See also
[Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views)
