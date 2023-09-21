---
title: How to enable Microsoft Defender for SQL servers on machines
description: Learn how to protect your Microsoft SQL servers on Azure VMs, on-premises, and in hybrid and multicloud environments with Microsoft Defender for Cloud.
ms.topic: how-to
ms.custom: ignite-2022
ms.author: dacurwin
author: dcurwin
ms.date: 09/21/2023
---

# Enable Microsoft Defender for SQL servers on machines

Defender for SQL protects your IaaS SQL Servers by identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases. 

Defender for Cloud populates with alerts when it detects suspicious database activities, potentially harmful attempts to access or exploit SQL machines, SQL injection attacks, anomalous database access and query patterns. The alerts created by these types of events appear on the [alerts reference page](alerts-reference.md#alerts-sql-db-and-warehouse).

Defender for Cloud uses vulnerability assessment to discover, track, and assist you in the remediation of potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state and provide details of any security findings.

Learn more about [vulnerability assessment for Azure SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md).

Defender for SQL servers on machines protects your SQL servers hosted in Azure, multicloud, and even on-premises machines.

- Learn more about [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/).

- For on-premises SQL servers, you can learn more about [Azure Arc-enabled SQL Server](/sql/sql-server/azure-arc/overview) and how to [install Log Analytics agent on Windows computers without Azure Arc](../azure-monitor/agents/agent-windows.md).

- For multicloud SQL servers:

  - [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)

  - [Connect your GCP project to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)

    > [!NOTE]
    > You must enable database protection for your multicloud SQL servers through the [AWS connector](quickstart-onboard-aws.md#connect-your-aws-account) or the [GCP connector](quickstart-onboard-gcp.md#configure-the-defender-for-databases-plan).

## Availability

|Aspect|Details|
|----|----|
|Release state:|General availability (GA)|
|Pricing:|**Microsoft Defender for SQL servers on machines** is billed as shown on the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/)|
|Protected SQL versions:|SQL Server version: 2012, 2014, 2016, 2017, 2019, 2022 <br>- [SQL on Azure virtual machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)<br>- [SQL Server on Azure Arc-enabled servers](/sql/sql-server/azure-arc/overview)<br>- On-premises SQL servers on Windows machines without Azure Arc<br>|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Microsoft Azure operated by 21Vianet **(Advanced Threat Protection Only)**|

## Set up Microsoft Defender for SQL servers on machines

The Defender for SQL server on machines plan requires either the Microsoft Monitoring Agent (MMA) or Azure Monitoring Agent (AMA) to prevent attacks and detect misconfigurations. The plan’s autoprovisioning process is automatically enabled with the plan and is responsible for the configuration of all of the agent components required for the plan to function. This includes, installation and configuration of MMA/AMA, workspace configuration and the installation of the plan’s VM extension/solution.

Microsoft Monitoring Agent (MMA) is set to be retired in August 2024. Defender for Cloud [updated its strategy](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) accordingly by releasing a SQL Server-targeted Azure Monitoring Agent (AMA) autoprovisioning process to replace the Microsoft Monitoring Agent (MMA) process which is set to be deprecated. Learn more about the [AMA for SQL server on machines (Preview) autoprovisioning process](defender-for-sql-autoprovisioning.md) and how to migrate to it.

> [!NOTE]
> During the **Azure Monitoring Agent for SQL Server on machines (Preview)**, customers who are currently using the **Log Analytics agent/Azure Monitor agent** processes will be asked to [migrate to the AMA for SQL server on machines (Preview) autoprovisioning process](defender-for-sql-autoprovisioning.md).

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

1. **(Optional)** Configure advanced autoprovisioning settings:

    1. Navigate to the **Environment settings** page.

    1. Select **Settings & monitoring**.

        - For customer using the current generally available autoprovisioning process, select **Edit configuration** for the **Log Analytics agent/Azure Monitor agent** component.

        - For customer using the preview of the autoprovisioning process, select **Edit configuration** for the **Azure Monitoring Agent for SQL server on machines (Preview)** component.

## Explore and investigate security alerts

There are several ways to view Microsoft Defender for SQL alerts in Microsoft Defender for Cloud:

- The Alerts page.

- The machine's security page.

- The [workload protections dashboard](workload-protections-dashboard.md).

- Through the direct link provided in the alert's email.

**To view alerts**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. Select **Security alerts**.

1. Select an alert.

Alerts are designed to be self-contained, with detailed remediation steps and investigation information in each one. You can investigate further by using other Microsoft Defender for Cloud and Microsoft Sentinel capabilities for a broader view:

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
