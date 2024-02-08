---
title: Create risk assessment reports on an OT sensor - Microsoft Defender for IoT
description: Gain insight into network risks detected by individual Defender for IoT OT sensors or an aggregate view of risks detected by all OT sensors.
ms.date: 12/01/2022
ms.topic: how-to
---

# Create risk assessment reports

Risk assessment reports provide details about security scores, vulnerabilities, and operational issues on devices detected by a specific OT network sensor, as well as risks coming from imported firewall rules.

Each Defender for IoT network sensor can generate a risk assessment report, while the on-premises management console collects those reports from all connected sensors.

## Prerequisites

To create risk assessment reports, you must be able to access the OT network sensor you want to generate data for:

- You must be an **Admin** user to import firewall rules to an OT sensor or add backup and anti-virus server addresses.

- You must be an **Admin** or **Security Analyst** user to create or view risk assessment reports on the OT sensor or on-premises management console.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)

## Generate risk assessment reports from an OT sensor

Use an individual OT sensor to view reports generated for that sensor only.

**To generate a report**:

1. Sign in to the sensor console and select **Risk assessment** > **Generate report**. The report is generated and appears in the **Reports list**, along with the timestamp and report size.

    For example:

    :::image type="content" source="media/how-to-generate-reports/risk-assessment-reports-list.png" alt-text="Screenshot of a list of risk assessment reports." lightbox="media/how-to-generate-reports/risk-assessment-reports-list.png":::

    Reports are automatically named `risk-assessment-report-<integer>`, where the `<integer>` is incremented automatically.

1. Select the report name to download it and open it in your browser.

## Risk assessment report contents

Risk assessment reports include the following details:

|Details  |Description  |
|---------|---------|
| **Security scores** | An overall security score for all detected devices, and a security score for each individual device. <br><br> Security scores are based on data learned from packet inspection, behavioral modeling engines, and a SCADA-specific state machine design, and are categorized as follows: <br><br> - **Secure Devices** are devices with a security score above 90%. <br> - **Devices Needing Improvement** are devices with a security score between 70 percent and 89%. <br> - **Vulnerable Devices** are devices with a security score below 70%. |
| **Security and operational issues** | Insight into any of the following security and operational issues: <br><br> - Configuration issues <br> - Device vulnerability, prioritized by security level <br> - Network security issues <br> - Network operational issues <br> - Connections to ICS networks <br> - Internet connections <br> - Industrial malware indicators <br> - Protocol issues <br> - Attack vectors |
| **Firewall rule risk** | The Risk Assessment report highlights if a rule isn't secure, or if there's a mismatch between the rule and the monitored network. |

## Enrich the risk assessment report

Enrich your sensor with extra data to provide fuller risk assessment reports:

- Import firewall rules to have them assessed for risks in the report
- Lower your risk by defining addresses for your backup and anti-virus server

### Import firewall rules to an OT sensor

Import firewall rules to your OT sensor for analysis in **Risk assessment** reports. Importing firewall rules is supported for the following firewalls:

|Name  |Description  | File type |
|---------|---------|---------|
| **Check Point** | Firewall export to R77 | .ZIP |
| **Fortinet** | Configuration backup | .CONF|
|**Juniper** | ScreenOS CLI configuration | .TXT |

**To import firewall rules**:

1. Sign in to your sensor as an **Admin** user and elect **System Settings** > **Import settings** > **Firewall rules**.
1. In the **Firewall rules** pane:

    - Select a firewall type from the dropdown menu
    - Select **+ Import file** to browse to and select the file you want to import.

For example:

:::image type="content" source="media/how-to-generate-reports/import-firewall-rules.png" alt-text="Screenshot of how to import firewall rules." lightbox="media/how-to-generate-reports/import-firewall-rules.png":::

### Define backup and anti-virus servers on an OT sensor

Backup and anti-virus servers aren't defined on your sensor by default. We recommend defining these addresses on your sensor to keep your network risk assessment low.

**To add backup and anti-virus server addresses**:

1. Sign into your OT sensor and select **System Settings** > **System Properties** > **Vulnerability Assessment**.
1. Add your backup and anti-virus server addresses to the **backup_servers** and **AV_addresses** fields, respectively. Use commas to separate multiple addresses.
1. Select **Save** to save your changes.

## View risk assessment reports for multiple sensors

Use an on-premises management console to view risk assessment reports for all connected sensors.

**To generate a report**:

1. Sign in to your on-premises management console and select **Risk assessment**.

1. From the **Select Sensor** drop-down menu, select the sensor for which you want to generate the report, and then select **Generate Report**.

    A new report is listed in the **Archived Reports** area, listed by the time and date it was created, and showing the security score and report size.

    For example:

    :::image type="content" source="media/how-to-generate-reports/risk-assessment-report-for-multiple-sensors.png" alt-text="Screenshot of a list of archived reports." lightbox="media/how-to-generate-reports/risk-assessment-report-for-multiple-sensors.png":::

1. Select **Download** to download a report and open it in your browser.

## Next steps

- Take action based on the recommendations provided in the risk assessment reports to improve your overall network security score. For example, you might install the latest security or firmware updates, or investigate any PLCs that are currently in unsecure states.

    For more information, see [Enhance security posture with security recommendations](recommendations.md).

- Continue creating other reports for more security data from your OT sensor. For more information, see:

    - [Attack vector reporting](how-to-create-attack-vector-reports.md)
    
    - [Sensor data mining queries](how-to-create-data-mining-queries.md)
    
    - [Create trends and statistics dashboards](how-to-create-trends-and-statistics-reports.md)
    
