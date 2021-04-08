---
title: Create risk assessment reports
description: Gain insight into network risks detected by individual sensors or an aggregate view of risks detected by all sensors.
ms.date: 12/17/2020
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

Reports provide recommendations to help you improve your security score. For example, install the latest security updates, upgrade firmware to the latest version or follow up on alerts.

## About security scores

Overall network security score is generated in each report. The score represents the percentage of 100 percent security. For example, a score of 30% would indicate that your network 30% secure.

Risk Assessment scores are based on information learned from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design.

**Secure Devices** are devices with a security score above 90 %.

**Devices Needing Improvement**: Devices with a security score between 70 percent and 89 %.

**Vulnerable Devices** are devices with a security score below 70 %.

## Create risk assessment reports

Create a PDF risk assessment report. The report name is automatically generated as risk-assessment-report-1.pdf. The number is updated for each new report you create.  The time and day of creation are displayed.

### Create a sensor risk assessment report

Create a risk assessment report based on detections made by the sensor you are logged into.

To create a report:

1. Login to the sensor console.
1. Select **Risk Assessment** on the side menu.
1. Select **Generate Report**. The report appears in the Archived Reports section.
1. Select the report from the Archived Reports section to download it.

:::image type="content" source="media/how-to-generate-reports/risk-assessment.png" alt-text="A view of the risk assessment.":::

To import a company logo:

- Select **Import Logo**.

### Create an on-premises management console risk assessment report

Create a risk assessment report based on detections made by the any of the sensors managed by your on-premises management console. 

To create a report:

1. Select **Risk Assessment** on the side menu.

2. Select a sensor from the **Select sensor** drop-down list.

3. Select **Generate Report**.

4. Select **Download** from the **Archived Reports** section.

To import a company logo:

- Select **Import Logo**.

:::image type="content" source="media/how-to-generate-reports/import-logo-screenshot.png" alt-text="Import your logo through the risk assessment view.":::

## See also

[Attack vector reporting](how-to-create-attack-vector-reports.md)

