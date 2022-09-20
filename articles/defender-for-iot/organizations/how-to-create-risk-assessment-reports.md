---
title: Create risk assessment reports
description: Gain insight into network risks detected by individual sensors or an aggregate view of risks detected by all sensors.
ms.date: 02/03/2022
ms.topic: how-to
---

# Risk assessment reporting

## About risk assessment reports

Risk assessment reports provide:

- An overall security score for the devices detected by organizational sensors.

- A security score for each network device detected by an individual sensor.

- A breakdown of the number of vulnerable devices, devices that need improvement and secure devices.

-  Insight into security and operational issues:

    - Configuration issues

    - Device vulnerability prioritized by security level

    - Network security issues

    - Network operational issues

    - Connections to ICS networks

    - Internet connections

    - Industrial malware indicators

    - Protocol issues

    - Attack vectors

### Risk mitigation

Reports provide recommendations to help you improve your security score. For example:
- Install the latest security updates.
- Upgrade firmware to the latest version.
- Investigate PLCs in unsecure states.

## About security scores

Overall network security score is generated in each report. The score represents the percentage of 100 percent security. For example, a score of 30% would indicate that your network 30% secure.

Risk Assessment scores are based on information learned from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design.

**Secure Devices** are devices with a security score above 90%.

**Devices Needing Improvement**: Devices with a security score between 70 percent and 89%.

**Vulnerable Devices** are devices with a security score below 70%.

### About backup and anti-virus servers

The risk assessment score may be negatively impacted if you don't define backup and anti-virus server addresses in your sensor. Adding these addresses improves your score. By default these addresses aren't defined.
The Risk Assessment report cover page will indicate if backup servers and anti-virus servers are not defined.

**To add servers:**

1. Select **System Settings** and then select **System Properties**.
1. Select **Vulnerability Assessment** and add the addresses to **backup_servers** and **AV_addresses** fields. Use commas to separate multiple addresses.  separated by commas.  
1. Select **Save**.

## Create risk assessment reports

Create a risk assessment report based on detections made by the sensor you are logged into. The report name is automatically generated as risk-assessment-report-1.pdf. The number is updated for each new report you create.  The time and day of creation are displayed.

**To create a report:**

1. Sign in to the sensor console.
1. Select **Risk assessment** on the side menu.
1. Select **Generate report**. The report appears in the Saved Reports section.
1. Select the report from the Saved Reports section to download it.

**To import a company logo:**

1. Select **Import logo**.
1. Choose a logo to add to the header of your Risk assessment reports.

### Create an on-premises management console risk assessment report

Create a risk assessment report based on detections made by sensors that are managed by your on-premises management console.

**To create a report:**

1. Select **Risk Assessment** on the side menu.
2. Select a sensor from the **Select sensor** drop-down list.
3. Select **Generate Report**.
4. Select **Download** from the **Archived Reports** section.

**To import a company logo:**

1. Select **Import logo**.
1. Choose a logo to add to the header of your Risk assessment reports.

## Next steps

For more information, see [Attack vector reporting](how-to-create-attack-vector-reports.md).
