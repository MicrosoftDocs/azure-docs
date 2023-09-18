---
title: How to enable Microsoft Defender for SQL servers on machines
description: Learn how to protect your Microsoft SQL servers on Azure VMs, on-premises, and in hybrid and multicloud environments with Microsoft Defender for Cloud.
ms.topic: how-to
ms.custom: ignite-2022
ms.author: dacurwin
author: dcurwin
ms.date: 09/14/2023
---

# Enable Microsoft Defender for SQL servers on machines

Defender for SQL protects your IaaS SQL Servers by identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases. 

Defender for Cloud will populate with alerts when there are suspicious database activities, potentially harmful attempts to access or exploit SQL machines, SQL injection attacks, and anomalous database access and query patterns. These events can trigger alerts that will appear on the [alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).

Vulnerability assessment discovers, tracks, and helps you remediate potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

Learn more about [vulnerability assessment for Azure SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md).

Microsoft Defender for SQL servers on machines extends the protections for your Azure-native SQL servers to fully support hybrid environments and protect SQL servers hosted in Azure, multicloud ,and even on-premises machines:

1. [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/)

1. On-premises SQL servers:

  - [Azure Arc-enabled SQL Server](/sql/sql-server/azure-arc/overview)

  - [SQL Server running on Windows machines without Azure Arc](../azure-monitor/agents/agent-windows.md)

1. Multicloud SQL servers:

  - [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)

  - [Connect your GCP project to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)

  > [!NOTE]
  > Enable database protection for your multicloud SQL servers through the [AWS connector](quickstart-onboard-aws.md#connect-your-aws-account) or the [GCP connector](quickstart-onboard-gcp.md#configure-the-defender-for-databases-plan).

## Availability

|Aspect|Details|
|----|----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for SQL servers on machines** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected SQL versions:|SQL Server version: 2012, 2014, 2016, 2017, 2019, 2022 <br>- [SQL on Azure virtual machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)<br>- [SQL Server on Azure Arc-enabled servers](/sql/sql-server/azure-arc/overview)<br>- On-premises SQL servers on Windows machines without Azure Arc<br>|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Microsoft Azure operated by 21Vianet **(Advanced Threat Protection Only)**|

## Set up Microsoft Defender for SQL servers on machines

Defender for SQL server on machines plan requires Microsoft Monitoring Agent (MMA) or Azure Monitoring Agent (AMA) to prevent attacks and detect misconfigurations. The plan’s autoprovisioning process is automatically enabled with the plan and is responsible for configuring all agent components required for the plan to function: installation and configuration of MMA/AMA, workspace configuration and the installation of the plan’s VM extension/solution.

Due to the upcoming Microsoft Monitoring Agent (MMA) retirement in August 2024, Defender for Cloud [updated its strategy](upcoming-changes#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) accordingly. 
As a result, a new SQL Server-targeted Azure Monitoring Agent autoprovisioning process was released in Public Preview to replace the current process being depricated. Learn more about the [new autoprovisioning process](upcoming-changes#defender-for-sql-server-on-machines) and to migrate to it.

> [!NOTE]
> During the **Azure Monitoring Agent for SQL Server on machines** Public Preview period, customers using current **Log Analytics agent/Azure Monitor agent** proceses with the 'Azure Monitor Agent (Preview)' option will asked to migrate to the new process [Learn more](quickstart-onboard-aws.md#connect-your-aws-account)

**To enable the plan**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, locate the Databases plan and select **Select types**.

  :::image type="content" source="media/tutorial-enabledatabases-plan/select-types.png" alt-text="Screenshot that shows you where to select, select types on the Defender plans page." lightbox="media/tutorial-enabledatabases-plan/select-types.png":::

1. In the Resource types selection window, toggle the **SQL servers on machines** plan to **On**.

1. Select **Continue**.

1. Select **Save**.

**(optional)** Configure advanced autoprovisioning settings:

1. From Defender for Cloud's menu, open the **Environment settings** page.

1. Select **Settings & monitoring**.

  - For customer using the current GA autoprovisioning process, click the **Edit configuration** link of the **Log Analytics agent/Azure Monitor agent** component.

  - For customer using the new Preview autoprovisioning process, click the **Edit configuration** link of the **Azure Monitoring Agent for SQL server on machines (Preview)** component.

## Explore and investigate security alerts

Microsoft Defender for SQL alerts are available in:

- The Defender for Cloud's security alerts page

- The machine's security page

- The [workload protections dashboard](workload-protections-dashboard.md)

- Through the direct link in the alert emails

**To view alerts**:

1. Select **Security alerts** from Defender for Cloud's menu and select an alert.

1. Alerts are designed to be self-contained, with detailed remediation steps and investigation information in each one. You can investigate further by using other Microsoft Defender for Cloud and Microsoft Sentinel capabilities for a broader view:

  - Enable SQL Server's auditing feature for further investigations. If you're a Microsoft Sentinel user, you can upload the SQL auditing logs from the Windows Security Log events to Sentinel and enjoy a rich investigation experience. [Learn more about SQL Server Auditing](/sql/relational-databases/security/auditing/create-a-server-audit-and-server-audit-specification?preserve-view=true&view=sql-server-ver15).

  - To improve your security posture, use Defender for Cloud's recommendations for the host machine indicated in each alert to reduce the risks of future attacks.
  
    [Learn more about managing and responding to alerts](managing-and-responding-alerts.md).

## Next steps

For related information, see these resources:
- [How Microsoft Defender for Azure SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc).
- [Security alerts for SQL Database and Azure Synapse Analytics](alerts-reference.md#alerts-sql-db-and-warehouse)
- [Set up email notifications for security alerts](configure-email-notifications.md)
- [Learn more about Microsoft Sentinel](../sentinel/index.yml)
- Check out [common questions](faq-defender-for-databases.yml) about Defender for Databases.
