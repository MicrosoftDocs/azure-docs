---
title: Generate reports
description: Gain insight into network activity, risks, attacks, and trends using Defender for IoT reporting tools.
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/06/2020
ms.topic: how-to
ms.service: azure
---

# Generate reports

Gain insight into network activity, risks, attacks, and trends using Defender for IoT reporting tools. Tools are available to generate reports:

- based on activity detected by individual sensors
- based on activity detected by all sensors. These reports are generated from the on-premises management console.

## Sensor risk assessment reports

Risk assessment reporting lets you generate a security score for each network device, as well as an overall network security score. The overall score represents the percentage of 100% security.

This score is based on results from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range of other information is available, for example:

  - Configuration issues

  -  Device vulnerability prioritized by security level

  - Network security issues

  - Network operational issues

  - Attack vectors

  - Connections to ICS networks

  - Internet connections

  - Industrial malware indicators

  - Protocol issues

The report provides mitigation recommendations that will help you improve your current security score.

:::image type="content" source="media/how-to-generate-reports/image260.png" alt-text="Top Vulnerable devices":::

  - Secure Devices: Devices with a security score above 90%.

  - Vulnerable Devices: Devices with a security score below 70%.

  - Devices Needing Improvement: Devices with a security score between 70% and 89%.

**To create a report:**

1. Select **Risk Assessment** on the side menu.
2. Select a sensor from the **Select Sensor** dropdown.
3. Select **Generate Report**.
4. Select **Download** from the Archived Reports section.

:::image type="content" source="media/how-to-generate-reports/image261.png" alt-text="Risk Assessment":::

**To import a company logo:**

  - Select Import Logo.

## Sensor attack vector reports

Attack Vector reports provide a graphical representation of a vulnerability chain of exploitable  devices. These vulnerabilities can give an attacker access to key network  devices. The Attack Vector simulator calculates attack vectors in real time and analyzes all attack vectors per a specific target.

Working with the attack vector lets you evaluate the effect of mitigation activities in the attack sequence to determine, for example, if a system upgrade disrupts the attacker’s path by breaking the attack chain, or whether an alternate attack path remains. This helps the user to prioritize remediation and mitigation activities.

> [!NOTE]
> **Administrators** and **Security Analysts** may perform the procedures described in this section.

:::image type="content" source="media/how-to-generate-reports/image262.png" alt-text="Control Center":::

> [!NOTE]
> **Administrators** and **Security Analysts** may perform the procedures described in this section.

**To create an attack vector simulation:**

1. Select :::image type="content" source="media/how-to-generate-reports/image263.png" alt-text="Plus sign":::on the side menu to add a Simulation.

 :::image type="content" source="media/how-to-generate-reports/image264.png" alt-text="attack vector simulation":::

2. Enter Simulation properties:

    - Name - Simulation name.

    - Maximum vectors - the maximum number of vectors in a single simulation.

    - Show in Device map - Show the attack vector as a filter on the Device Map.

    - All Sources devices - Attack vector will consider all devices as an attack source.

    - Attack Source - Attack vector will consider only the specified devices as an attack source.

    - All Target devices - Attack vector will consider all devices as an attack target.

    - Select “All Targets” or specify Attack targets.

    - Attack Target - Attack vector will consider only the specified devices as an attack target.

    - Exclude devices - Specified devices will be excluded from the Attack Vector simulation.

    - Exclude Subnets - specified subnets will be excluded from the Attack Vector simulation.

3. Select **Add Simulation**. The simulation will be added to the simulations list.

 :::image type="content" source="media/how-to-generate-reports/new-simulation.png" alt-text="Add a new simulation.":::

 - Select :::image type="icon" source="media/how-to-generate-reports/edit-a-simulation-icon.png" border="false"::: to edit the simulation.

4. Select :::image type="icon" source="media/how-to-generate-reports/delete-simulation-icon.png" border="false"::: to delete the simulation.

5. Select :::image type="icon" source="media/how-to-generate-reports/make-a-favorite-icon.png" border="false"::: to mark the simulation as a favorite.

6. A list of attack vectors appears and includes; vector score (out of 100), attack source device, and attach target device.

7. Select a specific attack for graphical depiction of attack vectors.

 :::image type="content" source="media/how-to-generate-reports/sample-attack-vectors.png" alt-text="Attack vectors.":::

## Sensor data mining queries

Data mining tools let you generate comprehensive and granular information about your network devices at various layers. For example, based on:

  - Time periods

  - Connections to the internet

  - Ports

  - Protocols

  - Firmware versions

  - Programming commands

  - The device being nonactive

You can fine-tune the report based on filters. For example, to query a specific subnet in which firmware was updated.

:::image type="content" source="media/how-to-generate-reports/active-device-list.png" alt-text="List of active devices.":::

Various tools are available to manage queries. For example, export and save.

> [!NOTE]
> **Administrators** and **Security Analysts** have access to data mining options.

### Dynamic updates

Data mining queries you create are dynamically updated each instance that you open them. For example,

  - If you create a report for firmware versions on devices on June 1 and open the report again on June 10, this report will be updated with information that is accurate for the 10th.

  - If you create a report to detect new devices discovered over the last 30 days on June 1 and open the report on June 30, the results will be displayed for the last 30 days.

### Data mining use cases

Queries can be used to handle an extensive range of security needs for various security teams.

  - **SOC incident response:** Generate reports in real time to help deal with immediate incident response. For example, or a list of devices that may require patching.

  - **Forensics:** Generate reports based on historical data for investigative reports.

  - **IT Network Integrity:** Generate reports that help improve overall network security. For example, a report that lists devices with weak authentication credentials.

  - **Visibility:** Generate a report that covers all query items to view all baseline parameters of your network.

### Data mining storage

Data mining information is saved and stored continuously, except for when a device is deleted. Data mining results can be exported and stored externally to a secure server.  In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

### Data mining and reports 

Regular reports, accessed from the Reports option, are pre-defined data mining reports. They are not dynamic queries as are available in data mining, but a static representation of the data mining query results.

Data mining query results are not available to RO users. As a result, administrator and security analyst users who want RO users to have access to the information generated by data mining queries, should save the data mining query as report when generating data mining queries.

### Predefined queries

The following predefined queries are available. These queries are generated in real time.

  - CVEs – A list of devices detected with known vulnerabilities within the last 24 hours.

  - Excluded CVEs – A list of all the CVEs that were manually excluded. To achieve more accurate results in VA reports and attack vector you can customize the CVE list manually by including and excluding CVEs.

  - Internet activity – Device that connected to the internet.

  - Nonactive devices – Devices that have not communicated for the past seven days.

  - Active devices – Active network devices within the last 24 hours.

  - Remote access – Devices communicating with remote session protocols.

  - Programming commands - Devices sending industrial programming.

These reports are automatically accessible from the Reports screen where they can be viewed by RO users and other users. RO users cannot access data mining reports.

:::image type="content" source="media/how-to-generate-reports/data-mining-screeshot.png" alt-text="The data mining screen.":::

### Create data mining report

This section describes how to create a data mining report.

To create a data mining report:

1. Select **Data Mining** from the side menu. Predefined suggested reports appear automatically.

 :::image type="content" source="media/how-to-generate-reports/data-mining-selection-from-pane.png" alt-text="Select data mining from side pane.":::

2. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false":::.

3. Select **New Report** and define the report.

 :::image type="content" source="media/how-to-generate-reports/create-new-report-screen.png" alt-text="Create a new report by filling out this screen.":::

The following parameters are available:

  - Report name and description.

  - Categories - Select either:

      - **Categories (All)** to view all report results about all devices in your network.

      - **Generic** to choose standard categories.

  - Select specific report parameters of interest to you.

  - Sort order (**Order by**). Sort results based on activity, or category.

  - **Save to Report Pages**. Save the report results as a report accessible from the **Report** page. This will enable RO users to run the report you created.

  - Select **Filters (Add)** to add additional filters. Wildcard requests are supported.

 - Device group (defined in the Device map).

 - IP address.

 - Port.

 - MAC address.

4. Select **Save**. Report results open in the Data Mining page.

  :::image type="content" source="media/how-to-generate-reports/data-mining-page.png" alt-text="Report results as seen in the data mining page.":::

### Manage data mining reports

This article describes data mining management options.

| Icon image | Description |
|--|--|
| :::image type="icon" source="media/how-to-generate-reports/edit-a-simulation-icon.png" border="false"::: | Edit the report parameters. |
| :::image type="icon" source="media/how-to-generate-reports/export-as-pdf-icon.png" border="false"::: | Export as PDF. |
| :::image type="icon" source="media/how-to-generate-reports/csv-export-icon.png" border="false"::: | Select to export as CSV. |
| :::image type="icon" source="media/how-to-generate-reports/information-icon.png" border="false"::: | Show additional information such as the date last modified. Use this feature to create a query result snapshot. You may need to do this for further investigation. For example, with team leaders, or SOC analysts. |
| :::image type="icon" source="media/how-to-generate-reports/pin-icon.png" border="false"::: | Display in Reports page or hide from Reports page. :::image type="content" source="media/how-to-generate-reports/hide-reports-page.png" alt-text="Hide or reveal your reports."::: |
| :::image type="icon" source="media/how-to-generate-reports/delete-simulation-icon.png" border="false"::: | Delete the report. |

#### Create customized directories 

You can organize the extensive information by data mining queries by creating subfolders categories. For example, for protocols, or locations.

To create a new directory:

1. Select :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false"::: to add a new directory.

2. Select **New Directory** to display the new directory form.

3. Name the new directory.

4. Drag the required reports into the new directory. At any time, you can drag the report back to the main view.

5. Right-click the new directory in order to open, edit, or delete.

#### Create snapshots of report results

You may need to save certain queries results for further investigation. For example, with various security teams.

Snapshots are saved within the report results report and do not generate dynamic queries.

:::image type="content" source="media/how-to-generate-reports/report-results-report.png" alt-text="Snapshots.":::

**To create a snapshot:**

1. Open the required report.

2. Select the information icon :::image type="icon" source="media/how-to-generate-reports/information-icon.png" border="false":::.

3. Select **Take New**.

4. Enter a name for the snapshot and select **Save**.

 :::image type="content" source="media/how-to-generate-reports/take-a-snapshot.png" alt-text="Take a snapshot.":::

#### Customizing the CVE list

You can manually customize the CVE list as follows:

  - Include/exclude CVEs

  - Change the CVE score

**To perform manual changes in the CVE report:**

1.  From the side menu, select **Data Mining**.

2. Select on the :::image type="icon" source="media/how-to-generate-reports/plus-icon.png" border="false"::: in the top-left corner of the Data Mining window and select **New Report**.

  :::image type="content" source="media/how-to-generate-reports/create-a-new-report-screen.png" alt-text="Create a new report.":::

3. From the left pane, select one of the following options:

  - **Known Vulnerabilities:** Selects both options and presents in the report 2 tables, one with CVEs and another one with excluded CVEs.

  - **CVEs:** Select this option to present a list of all the CVEs.

  - **Excluded CVEs:** Select this option to presents a list of all the excluded CVEs.

4. Fill the Name and the Description and select **Save**. The new report appears in the **Data Mining** window.

5. To exclude CVEs, open the CVEs data mining report. The list of all the CVEs appears.

 :::image type="content" source="media/how-to-generate-reports/cves.png" alt-text="CVEs report.":::

6. To enable selecting items in the list, select :::image type="icon" source="media/how-to-generate-reports/enable-selecting-icon.png" border="false"::: and select the CVEs that you want to customize. The **Operations** bar appears on the bottom.

 :::image type="content" source="media/how-to-generate-reports/operations-bar-appears.png" alt-text="Screenshot of the data mining operations bar appearing on the bottom.":::

7. Select the CVEs that you want to exclude and select **Delete Records**. The CVEs that you have selected do not appear in the CVEs list and will appear in the excluded CVEs list when you generate one.

8. To include the excluded CVEs in the CVEs list, generate the excluded CVEs report and delete from that list the items that you want to include back in the CVEs list.

9. Select the CVEs in which you want to change the score and select **Update CVE Score**.

 :::image type="content" source="media/how-to-generate-reports/set-new-score-screen.png" alt-text="Update the CVE score.":::

10. Type the new score and select **OK**. The updated score appears in the CVEs that you have selected.

### Reports based on data mining

Reports reflect information generated by data mining query results. This includes default data mining reports, which are available in the Reports view. Administrator and security analysts can also generate custom data mining queries, and save them as reports. These reports are available for RO users as well.

**To generate a report:**

1. Select **Reports** on the side menu.

2. Choose the required report to display. Can be, **Custom** or **Auto-Generated** reports, such as **Programming Commands** and **Remote Access**.

3. You can also export the report by selecting one of the icons in the upper right of the screen:

  -  :::image type="icon" source="media/how-to-generate-reports/export-to-pdf-icon.png" border="false"::: Export to a PDF file.

  -  :::image type="icon" source="media/how-to-generate-reports/export-to-csv-icon.png" border="false"::: Export to a CSV file.

> [!NOTE] 
> The RO user can see only reports created for him.

:::image type="content" source="media/how-to-generate-reports/select-a-report-screen.png" alt-text="Select the report to generate.":::

:::image type="content" source="media/how-to-generate-reports/remote-access-report.png" alt-text="Remote access report generated.":::

## Sensor trends and statistics reporting

Trends and statistics

Widget graphs and pie charts can be created to gain insight into network trends and statistics. Widgets can be grouped under user-defined Dashboards.

> [!NOTE]
> Only administrators and security analysts may perform the procedures in this section.

To see dashboards and widgets, select **Trends & Statistics** on the side menu.

:::image type="content" source="media/how-to-generate-reports/investigation-screenshot.png" alt-text="Screenshot of an investigation.":::

The dashboard consists of widgets that graphically describe the following types of information, such as:

  - Traffic
  - Channels bandwidth
  - Traffic by port
  - Total bandwidth
  - Busy devices
  - Active TCP connection
  - Devices
  - New devices
  - Busy devices
  - Devices by vendor
  - Devices by OS
  - Disconnections
  - Disconnected devices
  - Connectivity drop by hours
  - Alerts
  - Incidents by type
  - Database
  - Database table access
  - Protocol dissection widgets
  - ETHERNET and IP address
  - EtherNet and IP address traffic by CIP service
  - EtherNet and IP address traffic by CIP class
  - EtherNet and IP address traffic by command
  - OPC
  - OPC top management operations
  - OPC tOP I/O operations
  - SIEMENS-S7
  - S7 traffic by control function
  - S7 traffic by subfunction
  - SRTP
  - SRTP traffic by service code
  - SRTP errors by day
  - SUITELINK
  - Suitelink top queried tags
  - Suitelink numeric tag behavior
  - 60870-5-104
  - IEC-60870 traffic by ASDU
  - DNP3
  - DNP3 traffic by function
  - MMS
  - MMS traffic by service
  - MODBUS
  - Modbus traffic by function
  - OPC-UA
  - OPC-UA traffic by service

> [!NOTE]
>  The time in the widgets is set according to the sensor time.

## On-premises management console reports

The on-premises management console lets you generate reports for each of the sensors connected to it. Reports are based on sensor data mining queries performed.

You can generate the following reports:

- **Active Devices (Last 24 Hours):** Presents a list of devices that show network activity within a period of 24 hours.

- **Non-Active Devices (Last 7 Days):** Presents a list of devices that shown no network activity in the last seven days.

- **Programming Commands:** Presents a list of devices that sent programming commands within the last 24 hours.

- **Remote Access:** Presents a list of devices that were accessed by remote sources within the last 24 hours.

:::image type="content" source="media/how-to-generate-reports/reports-view.png" alt-text="Screenshot of the reports view.":::

When you choose the sensor from the on-premises management console, all the custom reports configured on that sensor appear in the list of reports. For each sensor, you can generate a default report, or a custom report configured on that sensor.

**To generate a report:**

1.  In the left pane, select **Reports**. The *Reports window appears.

2. From the sensors dropdown list, select the sensor for which you want to generate the report.

:::image type="content" source="media/how-to-generate-reports/sensor-drop-down-list.png" alt-text="Screenshot of sensors view.":::

3. From the right drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="icon" source="media/how-to-generate-reports/pdf-report-icon.png" border="false":::.

## On-premises management console risk assessment reports

Generate a risk assessment report for each of the sensors connected to your on-premises management console. This provides insight into each of the networks that your sensors are monitoring.

Risk assessment reporting lets you generate a security score for each network device, as well as an overall network security score.

This score is based on an overall security score based on deep packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range if other information is available. For example:

- Configuration issues

- Device vulnerability prioritized by security level

- Network security issues

- Network operational issues

- Attack vectors

- Connections to ICS networks

- Internet connections

- Industrial malware indicators

- Protocol issues

The report provides mitigation recommendations that will help you improve your current security score.

:::image type="content" source="media/how-to-generate-reports/risk-assessment-screenshot.png" alt-text="Screenshot of the risk assessment screen.":::

- Secure devices: Devices with a security score above 90%.

- Vulnerable devices: Devices with a security score below 70%.

- Devices needing improvement: Devices with a security score between 70% and 89%.

To create a report:

1. Select **Risk Assessment** on the side menu.

2. Select a sensor from the select sensor dropdown.

3. Select **Generate Report**.

4. Select **Download** from the Archived Reports section.

To import a company logo:*

1. Select **Import Logo**.

:::image type="content" source="media/how-to-generate-reports/import-logo-screenshat.png" alt-text="Import your logo through the risk assessment view.":::

## See also
[Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views)
