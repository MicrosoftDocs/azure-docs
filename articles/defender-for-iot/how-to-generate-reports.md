---
title: Generate reports
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/10/2020
ms.topic: article
ms.service: azure
---

# Generate reports

## Generate reports per sensor

### Risk assessment reporting 

Risk Assessment reporting lets you generate a security score for each network asset, as well as an overall network security score. The overall score represents the percentage of 100% security.

This score is based on results from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range of other information is available, for example:

  - Configuration issues

  - Asset vulnerability prioritized by security level

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

### Attack vectors

Attack Vector reports provide a graphical representation of a vulnerability chain of exploitable assets. These vulnerabilities can give an attacker access to key network assets. The Attack Vector simulator calculates attack vectors in real-time and analyzes all attack vectors per a specific target.

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

   - Show in Asset map - Show the attack vector as a filter on the Asset Map.

   - All Sources Assets - Attack vector will consider all assets as an attack source.

   - Attack Source - Attack vector will consider only the specified assets as an attack source.

   - All Target Assets - Attack vector will consider all assets as an attack target.

   - Select “All Targets” or specify Attack targets.

   - Attack Target - Attack vector will consider only the specified assets as an attack target.

   - Exclude Assets - Specified assets will be excluded from the Attack Vector simulation.

   - Exclude Subnets - specified subnets will be excluded from the Attack Vector simulation.

3. Select Add Simulation. The Simulation will be added to the Simulations list.

   :::image type="content" source="media/how-to-generate-reports/image265.png" alt-text="add simulation":::

   - Select :::image type="content" source="media/how-to-generate-reports/image214.png" alt-text="edit"::: to edit the simulation.

4. Select :::image type="content" source="media/how-to-generate-reports/image220.png" alt-text="delete"::: to delete the simulation.

5. Select :::image type="content" source="media/how-to-generate-reports/image240.png" alt-text="favorite"::: to mark the simulation as a favorite.

6. A list of attack vectors appears and includes: Vector score (out of 100), Attack Source asset and Attach Target asset.

7. Select a specific attack for graphical depiction of Attack Vectors.

   :::image type="content" source="media/how-to-generate-reports/image266.png" alt-text="vectors":::

### Data mining 

Data Mining tools let you generate comprehensive and granular information about your network assets at various layers, for example, based on:

  - Time periods

  - Connections to the Internet

  - Ports

  - Protocols

  - Firmware versions

  - Programming commands

  - The asset being non-active

You can fine-tune the report based on filters, for example, to query a specific subnet in which firmware was updated.

:::image type="content" source="media/how-to-generate-reports/image208.png" alt-text="Active Assets":::

Various tools are available to manage queries, for example: export and save. See [Manage Data Mining Reports](./manage-data-mining-reports.md) for details.

> [!NOTE] 
> **Administrators** and **Security Analysts** have access to Data Mining options.

#### Dynamic updates 

Data mining queries you create are dynamically updated each instance that you open them. This means for example:

  - If you create a report for firmware versions on assets on June 1 and open the report again on June 10th, this report will be updated with information that is accurate for the 10<sup>th</sup>.

  - If you create a report to detect new assets discovered over the last 30 days on June 1<sup>st</sup> and open the report on June 30<sup>th</sup>, the results will be displayed for the last 30 days.

#### Data mining use cases

Queries can be used to handle an extensive range of security needs for various security teams.

  - **SOC Incident Response:** Generate reports in real-time to help deal with immediate incident response. For example, or a list of assets that may require patching.

  - **Forensics:** Generate reports based on historical data for investigative reports.

  - **IT Network Integrity:** Generate reports that help improve overall network security. For example, a report that lists assets with weak authentication credentials.

  - **Visibility:** Generate a report that covers all query items to view all baseline parameters of your network.

#### Storage

Data Mining information is saved and stored continuously, except for when an asset is deleted. Data Mining results can be exported and stored externally to a secure server.  In addition, the sensor performs automatic daily backups to ensure system continuity and preservation of data.

#### Data mining and reports 

Regular reports, accessed from the Reports option, are pre-defined Data Mining reports. They are not dynamic queries as are available in Data Mining, but a static representation of the Data Mining query results.

Data Mining query results are not available to Read Only users. As a result, Admin and Security Analyst users who want Read Only users to have access to the information generated by Data Mining queries, should save the Data Mining query as report when generating Data Mining queries.

See ***Reports*** for details about sensor reports.

#### Predefined queries

The following pre-defined queries are available. These queries are generated in real-time.

  - CVEs – A list of assets detected with Known Vulnerabilities within the last 24 hours.

  - Excluded CVEs – A list of all the CVEs that were manually excluded. To achieve more accurate results in VA reports and Attack Vector you can customize the CVE list manually by including/excluding CVEs.

  - Internet Activity – Asset that connected to the Internet

  - Non- Active Assets – Assets that have not communicated for the past 7 days.

  - Active Assets – Active network assets within the last 24 hours.

  - Remote access – Assets communicating with remote session protocols.

  - Programming Commands: Assets sending industrial programming.

These reports are automatically accessible from the Reports screen where they can be viewed by Read-Only users and other users. Read-Only users cannot access Data Mining reports.

:::image type="content" source="media/how-to-generate-reports/image209.png" alt-text="Data Mining":::

#### Create data mining report 

This section describes how to create a Data Mining report.

**To create a data mining report:**

1. Select **Data Mining** from the side menu. Pre-defined suggested reports appear automatically.

   :::image type="content" source="media/how-to-generate-reports/image210.png" alt-text="Data":::

2. Select :::image type="content" source="media/how-to-generate-reports/image211.png" alt-text="Plus":::.

3. Select **New Report** and define the report.

   :::image type="content" source="media/how-to-generate-reports/image212.png" alt-text="Create new Report":::

The following parameters are available:

  - Report name and description

  - Categories - Select either:

  - **Categories (All)** to view all report results about all assets in your network.

  - **Generic** to choose standard categories.

  - Select specific report parameters of interest to you.

    - Sort order (**Order by**). Sort results based on activity or category.

    - **Save to Report Pages**. Save the report results as a report accessible from the **Report** page. This will enable Read-Only users to run the report you created.

    - Select **Filters (Add)** to add additional filters. Wildcard requests are supported.

   - Device Group (defined in the Asset map)

   - IP address

   - Port

   - MAC address

4. Select **Save**. Report results open in the Data Mining page.

    :::image type="content" source="media/how-to-generate-reports/image213.png" alt-text="Mining":::

#### Manage data mining reports 

This section describes Data Mining management options.

| Icon image | Description |
|--|--|
| <img src="media/how-to-generate-reports/image214.png" style="width:0.2639in;height:0.2639in"  alt="edit" /> | Edit the report parameters. |
| <img src="media/how-to-generate-reports/image215.png" style="width:0.20833in;height:0.23958in" alt="PDF" /> | Export as PDF. |
| <img src="media/how-to-generate-reports/image216.png" style="width:0.20833in;height:0.20833in" alt="CSV" /> | Select to export as CSV. |
| <img src="media/how-to-generate-reports/image217.png" style="width:0.22377in;height:0.20833in" alt="information" /> | Show additional information such as the date last modified. Use this feature to create a query result snapshot. You may need to do this for further investigation, for example with team leaders or SOC analysts. |
| <img src="media/how-to-generate-reports/image218.png" style="width:0.20833in;height:0.29167in" alt="pin" /> | Display in **Reports** page or hide from **Reports** page. <img src="media/how-to-generate-reports/image219.png" style="width:2.22917in;height:0.64042in"  alt="Report" /> |
| <img src="media/how-to-generate-reports/image220.png" style="width:0.20833in;height:0.24456in" alt="Delete" /> | Delete the report. |

##### Create customized directories 

You can organize the extensive information by Data Mining queries by creating subfolders categories, for example for Protocols or locations.

**To create a new directory:**

1. Select :::image type="content" source="media/how-to-generate-reports/image211.png" alt-text="Plus"::: to add a new directory.

2. Select New Directory to display the new directory form.

3. Name the new directory.

4. Drag the required reports into the new directory. At any time, you can drag the report back to the main view.

5. Right-click the new directory in order to Open, Edit or Delete.

##### Create snapshots of report results

You may need to save certain queries results for further investigation, for example with various security teams.

Snapshots are saved within the report results report and do not generate dynamic queries.

:::image type="content" source="media/how-to-generate-reports/image221.png" alt-text="Snapshots":::

**To create a snapshot:**

1.  Open the required report.

2. Select the information icon :::image type="content" source="media/how-to-generate-reports/image217.png" alt-text="information icon":::.

3. Select **take new**.

4. Enter a name for the snapshot and select Save.

   :::image type="content" source="media/how-to-generate-reports/image222.png" alt-text="Take Snapshot":::

##### Customizing the CVE list

You can manually customize the CVE list as follows:

  - Include/exclude CVEs

  - Change the CVE score

**To perform manual changes in the CVE report:**

1.  From the side menu, select **Data Mining**.

2. Select on the + in the top left corner of the Data Mining window and select **New Report**.

    :::image type="content" source="media/how-to-generate-reports/image223.png" alt-text="Create new Report":::

3. From the left pane, select one of the following options:

   - **Known Vulnerabilities:** Selects both options and presents in the report 2 tables, one with CVEs and another one with excluded CVEs.

   - **CVEs:** Select this option to present a list of all the CVEs.

   - **Excluded CVEs:** Select this option to presents a list of all the excluded CVEs.

4. Fill the Name and the Description and select **Save**. The new report appears in the **Data Mining** window.

5. To exclude CVEs, open the CVEs data mining report. The list of all the CVEs appears.

   :::image type="content" source="media/how-to-generate-reports/image224.png" alt-text="CVEs":::

6. To enable selecting items in the list, select :::image type="content" source="media/how-to-generate-reports/image225.png" alt-text="enable selecting"::: and select the CVEs that you want to customize. The **Operations** bar appears on the bottom.

   :::image type="content" source="media/how-to-generate-reports/image226.png" alt-text="CVE":::

7. Select the CVEs that you want to exclude and select **Delete Records**. The CVEs that you have selected do not appear in the CVEs list and will appear in the excluded CVEs list when you generate one.

8. To include the excluded CVEs in the CVEs list, generate the Excluded CVEs report and delete from that list the items that you want to include back in the CVEs list.

9. Select the CVEs in which you want to change the score and select **Update CVE Score**.

   :::image type="content" source="media/how-to-generate-reports/image227.png" alt-text="Set new score":::

10. Type the new score and select **OK**. The updated score appears in the CVEs that you have selected.

### Reports based on data mining

Reports reflect information generated by Data Mining query results. This includes default Data Mining reports, which are available in the Reports view. Admin and Security Analysts can also generate custom Data Mining queries and save them as reports, available for Read only users as well.

**To generate a report:**

1. Select Reports on the side menu.

2. Choose the required report to display - Custom or Auto-Generated reports, such as Programming Commands and Remote Access.

3. You can also export the report by selecting one of the icons in the upper right of the screen:

  - :::image type="content" source="media/how-to-generate-reports/image228.png" alt-text="PDF"::: Export to a PDF file

  - :::image type="content" source="media/how-to-generate-reports/image34.png" alt-text="CSV"::: Export to a CSV file

> [!NOTE] 
> The Read-Only user can see only reports created for him.

:::image type="content" source="media/how-to-generate-reports/image229.png" alt-text="Select Reports":::

:::image type="content" source="media/how-to-generate-reports/image230.png" alt-text="Remote Access":::

### Trends and statistics

Trends and statistics 

Widget graphs and pie charts can be created to gain insight into network trends and statistics. Widgets can be grouped under user-defined Dashboards.

> [!NOTE]
> Only **Administrators** and **Security Analysts** may perform the procedures in this section.

To see dashboards and widgets, select **Trends & Statistics** on the side menu.

:::image type="content" source="media/how-to-generate-reports/image231.png" alt-text="Investigation":::

The dashboard consists of widgets that graphically describe the following types of information, such as:

  - Traffic
  - Channels Bandwidth
  - Traffic By Port
  - Total Bandwidth
  - Busy Assets
  - Active TCP Connection
    - Assets
  - New Assets
  - Busy Assets
  - Assets By Vendor
  - Assets By Operating System
    - Disconnections
  - Disconnected Assets
  - Connectivity Drop By Hours
    - Alerts
  - Incidents By Type
    - Database
  - Database table access
    - Protocol Dissection Widgets
  - ETHERNET/ IP
  - EtherNet/IP Traffic By CIP Service
  - EtherNet/IP Traffic By CIP Class
  - EtherNet/IP Traffic By Command
  - OPC
  - OPC Top Management Operations
  - OPC TOP I/O Operations
  - SIEMENS-S7
  - S7 traffic by control function
  - S7 traffic By Sub-function
  - SRTP
  - SRTP Traffic By Service Code
  - SRTP Errors By Day
  - SUITELINK
  - Suitelink Top Queried Tags
  - Suitelink Numeric Tag Behavior
  - 60870-5-104
  - IEC-60870 Traffic by ASDU
  - DNP3
  - DNP3 traffic by function
  - MMS
  - MMS Traffic by Service
  - MODBUS
  - Modbus traffic by function
  - OPC-UA
  - OPC-UA traffic by service

> [!NOTE]
>  The time in the widgets is set according to the sensor time.

## Generate reports on all enterprise sensors

### Generate Reports

The on-premises management console lets you generate reports for each of the Sensors connected to it. Reports are based in Sensor Data Mining queries performed.

You can generate the following reports:

- **Active Assets (Last 24 Hours):** Presents a list of assets that show network activity within a period of 24 hours.

- **Non Active Assets (Last 7 Days):** Presents a list of assets that shown no network activity in the last 7 days.

- **Programming Commands:** Presents a list of assets that sent programming commands within the last 24 hours.

- **Remote Access:** Presents a list of assets that were accessed by remote sources within the last 24 hours.

:::image type="content" source="media/how-to-generate-reports/image91.png" alt-text="Screenshot of Reports view":::

When you choose the Sensor from the Central Manager, all the custom reports configured on that Sensor appear in the list of reports. For each Sensor, you can generate a default report, or a custom report configured on that Sensor.

**To generate a report:**

1.  In the left pane, select **Reports**. The **Reports** window appears.

2. From the **Sensors** drop-down list, select the Sensor for which you want to generate the report.

:::image type="content" source="media/how-to-generate-reports/image92.png" alt-text="Screenshot of Sensors view":::

3. From the right drop-down list, select the report that you want to generate.

4. To create a PDF of the report results, select :::image type="content" source="media/how-to-generate-reports/image93.png" alt-text="Icon of PDF button":::.

### Network Risk Assessment Reports

Generate a Risk Assessment Report for each of the Sensors connected to your Central Manager. This provides insight into each of the networks that your Sensors are monitoring.

Risk Assessment reporting lets you generate a security score for each network asset, as well as an overall network security score.

This score is based on an overall security score based on deep packet inspection, behavioral modeling engines, and a SCADA-specific state machine design. An extensive range if other information is available, for example:

- Configuration issues

- Asset vulnerability prioritized by security level

- Network security issues

- Network operational issues

- Attack vectors

- Connections to ICS networks

- Internet connections

- Industrial malware indicators

- Protocol issues

The report provides mitigation recommendations that will help you improve your current security score.

:::image type="content" source="media/how-to-generate-reports/image94.png" alt-text="Screenshot of Risk Assessment view":::

- Secure Devices: Devices with a security score above 90%.

- Vulnerable Devices: Devices with a security score below 70%.

- Devices Needing Improvement: Devices with a security score between 70% and 89%.

**To create a report:**

1. Select **Risk Assessment** on the side menu.

2. Select a Sensor from the Select Sensor dropdown.

3. Select **Generate Report**.

4. Select **Download** from the Archived Reports section.

**To import a company logo:**

1. Select **Import Logo**.

:::image type="content" source="media/how-to-generate-reports/image95.png" alt-text="Screenshot of Risk Assessment view":::