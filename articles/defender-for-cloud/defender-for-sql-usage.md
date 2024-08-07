---
title: Enable Microsoft Defender for SQL servers on machines
description: Learn how to protect your Microsoft SQL servers on Azure VMs, on-premises, and in hybrid and multicloud environments with Microsoft Defender for Cloud.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 09/21/2023
---

# Enable Microsoft Defender for SQL servers on machines

Defender for SQL protects your IaaS SQL Servers by identifying and mitigating potential database vulnerabilities and detecting anomalous activities that could indicate threats to your databases.

Defender for Cloud populates with alerts when it detects suspicious database activities, potentially harmful attempts to access or exploit SQL machines, SQL injection attacks, anomalous database access, and query patterns. The alerts created by these types of events appear on the [alerts reference page](alerts-sql-database-and-azure-synapse-analytics.md).

Defender for Cloud uses vulnerability assessment to discover, track, and assist you in the remediation of potential database vulnerabilities. Assessment scans provide an overview of your SQL machines' security state and provide details of any security findings.

Learn more about [vulnerability assessment for Azure SQL servers on machines](defender-for-sql-on-machines-vulnerability-assessment.md).

Defender for SQL servers on machines protects your SQL servers hosted in Azure, multicloud, and even on-premises machines.

- Learn more about [SQL Server on Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/).

- For on-premises SQL servers, you can learn more about [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview) and how to [install Log Analytics agent on Windows computers without Azure Arc](../azure-monitor/agents/agent-windows.md).

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
|Protected SQL versions:|SQL Server version: 2012, 2014, 2016, 2017, 2019, 2022 <br>- [SQL on Azure virtual machines](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)<br>- [SQL Server on Azure Arc-enabled servers](/sql/sql-server/azure-arc/overview)<br><br>|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Azure Government<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Microsoft Azure operated by 21Vianet **(Advanced Threat Protection Only)**|

## Enable Defender for SQL on non-Azure machines using the AMA agent

### Prerequisites for enabling Defender for SQL on non-Azure machines

- An active Azure subscription.
- **Subscription owner** permissions on the subscription in which you wish to assign the policy.

- SQL Server on machines prerequisites:
  - **Permissions**: the Windows user operating the SQL server must have the **Sysadmin** role on the database.
  - **Extensions**: The following extensions should be added to the allowlist:
    - Defender for SQL (IaaS and Arc):
      - Publisher: Microsoft.Azure.AzureDefenderForSQL
      - Type: AdvancedThreatProtection.Windows
    - SQL IaaS Extension (IaaS):
      - Publisher: Microsoft.SqlServer.Management
      - Type: SqlIaaSAgent
    - SQL IaaS Extension (Arc):
      - Publisher: Microsoft.AzureData
      - Type: WindowsAgent.SqlServer
    - AMA extension (IaaS and Arc):
      - Publisher: Microsoft.Azure.Monitor
      - Type: AzureMonitorWindowsAgent

### Naming conventions in the Deny policy allowlist

- Defender for SQL uses the following naming convention when creating our resources:

  - DCR: `MicrosoftDefenderForSQL--dcr`
  - DCRA: `/Microsoft.Insights/MicrosoftDefenderForSQL-RulesAssociation`
  - Resource group: `DefaultResourceGroup-`
  - Log analytics workspace: `D4SQL--`

- Defender for SQL uses *MicrosoftDefenderForSQL* as a *createdBy* database tag.

### Steps to enable Defender for SQL on non-Azure machines

1. Connect SQL server to Azure Arc. For more information on the supported operating systems, connectivity configuration, and required permissions, see the following documentation:

    - [Plan and deploy Azure Arc-enabled servers](/azure/azure-arc/servers/plan-at-scale-deployment)
    - [Connected Machine agent prerequisites](/azure/azure-arc/servers/prerequisites)
    - [Connected Machine agent network requirements](/azure/azure-arc/servers/network-requirements)
    - [Roles specific to SQL Server enabled by Azure Arc](/sql/relational-databases/security/authentication-access/server-level-roles#roles-specific-to-sql-server-enabled-by-azure-arc)

1. Once Azure Arc is installed, the Azure extension for SQL Server is installed automatically on the database server. For more information, see [Manage automatic connection for SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/manage-autodeploy).

### Enable Defender for SQL

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, locate the Databases plan and select **Select types**.

    :::image type="content" source="media/tutorial-enabledatabases-plan/select-types.png" alt-text="Screenshot that shows you where to select, select types on the Defender plans page." lightbox="media/tutorial-enabledatabases-plan/select-types.png":::

1. In the Resource types selection window, toggle the **SQL servers on machines** plan to **On**.

1. Select **Continue**.

1. Select **Save**.

1. Once enabled we use one of the following policy initiatives:
   - Configure SQL VMs and Arc-enabled SQL servers to install Microsoft Defender for SQL and AMA with a Log analytics workspace (LAW) for a default LAW. This creates resources groups with data collection rules and a default Log analytics workspace. For more information about the Log analytics workspace, see [Log Analytics workspace overview](/azure/azure-monitor/logs/log-analytics-workspace-overview).

    :::image type="content" source="media/defender-for-sql-usage/default-log-analytics-workspace.png" alt-text="Screenshot of how to configure default log analytics workspace." lightbox="media/defender-for-sql-usage/default-log-analytics-workspace.png":::

   - Configure SQL VMs and Arc-enabled SQL servers to install Microsoft Defender for SQL and AMA with a user-defined LAW. This creates a resource group with data collection rules and a custom Log analytics workspace in the predefined region. During this process, we install the Azure monitoring agent. For more information about the options to install the AMA agent, see [Azure Monitor Agent prerequisites](/azure/azure-monitor/agents/azure-monitor-agent-manage#prerequisites).

    :::image type="content" source="media/defender-for-sql-usage/user-defined-log-analytics-workspace.png" alt-text="Screenshot of how to configure user-defined log analytics workspace." lightbox="media/defender-for-sql-usage/user-defined-log-analytics-workspace.png":::

1. To complete the installation process, a restart of the SQL server (instance) is necessary for versions 2017 and older.

## Enable Defender for SQL on Azure virtual machines using the AMA agent

### Prerequisites for enabling Defender for SQL on Azure virtual machines

- An active Azure subscription.
- **Subscription owner** permissions on the subscription in which you wish to assign the policy.
- SQL Server on machines prerequisites:
  - **Permissions**: the Windows user operating the SQL server must have the **Sysadmin** role on the database.
  - **Extensions**: The following extensions should be added to the allowlist:
    - Defender for SQL (IaaS and Arc):
      - Publisher: Microsoft.Azure.AzureDefenderForSQL
      - Type: AdvancedThreatProtection.Windows
    - SQL IaaS Extension (IaaS):
      - Publisher: Microsoft.SqlServer.Management
      - Type: SqlIaaSAgent
    - SQL IaaS Extension (Arc):
      - Publisher: Microsoft.AzureData
      - Type: WindowsAgent.SqlServer
    - AMA extension (IaaS and Arc):
      - Publisher: Microsoft.Azure.Monitor
      - Type: AzureMonitorWindowsAgent
- Since we're creating a resource group in *East US*, as part of the autoprovisioning enablement process, this region needs to be allowed or Defender for SQL can't complete the installation process successfully.

### Steps to enable Defender for SQL on Azure virtual machines

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, locate the Databases plan and select **Select types**.

    :::image type="content" source="media/tutorial-enabledatabases-plan/select-types.png" alt-text="Screenshot that shows you where to select types on the Defender plans page." lightbox="media/tutorial-enabledatabases-plan/select-types.png":::

1. In the Resource types selection window, toggle the **SQL servers on machines** plan to **On**.

1. Select **Continue**.

1. Select **Save**.

1. Once enabled we use one of the following policy initiatives:
   - Configure SQL VMs and Arc-enabled SQL servers to install Microsoft Defender for SQL and AMA with a Log analytics workspace (LAW) for a default LAW. This creates a resources group in *East US*, and managed identity. For more information about the use of the managed identity, see [Resource Manager template samples for agents in Azure Monitor](/azure/azure-monitor/agents/resource-manager-agent). It also creates a resource group that includes a Data Collection Rules (DCR) and a default LAW. All resources are consolidated under this single resource group. The DCR and LAW are created to align with the region of the virtual machine (VM).

    :::image type="content" source="media/defender-for-sql-usage/default-log-analytics-workspace.png" alt-text="Screenshot of how to configure default log analytics workspace." lightbox="media/defender-for-sql-usage/default-log-analytics-workspace.png":::

   - Configure SQL VMs and Arc-enabled SQL servers to install Microsoft Defender for SQL and AMA with a user-defined LAW. This creates a resources group in *East US*, and managed identity. For more information about the use of the managed identity, see [Resource Manager template samples for agents in Azure Monitor](/azure/azure-monitor/agents/resource-manager-agent). It also creates a resources group with a DCR and a custom LAW in the predefined region.

    :::image type="content" source="media/defender-for-sql-usage/user-defined-log-analytics-workspace.png" alt-text="Screenshot of how to configure user-defined log analytics workspace." lightbox="media/defender-for-sql-usage/user-defined-log-analytics-workspace.png":::

1. To complete the installation process, a restart of the SQL server (instance) is necessary for versions 2017 and older.

## Common questions

### Once the deployment is done, how long do we need to wait to see a successful deployment?

It takes approximately 30 minutes to update the protection status by the SQL IaaS Extension, assuming all the prerequisites are fulfilled.

### How do I verify that my deployment ended successfully and that my database is now protected?

1. Locate the database on the upper search bar in the Azure portal.
1. Under the **Security** tab, select **Defender for Cloud**.
1. Check the **Protection status**. If the status is **Protected**, the deployment was successful.

:::image type="content" source="media/defender-for-sql-usage/protection-status-protected.png" alt-text="Screenshot showing protection status as protected." lightbox="media/defender-for-sql-usage/protection-status-protected.png":::

### What is the purpose of the managed identity created during the installation process on Azure SQL VMs?

The managed identity is part of the Azure Policy, which pushes out the AMA. It's used by the AMA to access the database to collect the data and send it via the Log Analytics Workspace (LAW) to Defender for Cloud. For more information about the use of the managed identity, see [Resource Manager template samples for agents in Azure Monitor](/azure/azure-monitor/agents/resource-manager-agent).

### Can I use my own DCR or managed-identity instead of Defender for Cloud creating a new one?

Yes, we allow you to bring your own identity or DCR using the following script only. For more information, see [Enable Microsoft Defender for SQL servers on machines at scale](enable-defender-sql-at-scale.md).

### How can I enable SQL servers on machines with AMA at scale?

See [Enable Microsoft Defender for SQL servers on machines at scale](enable-defender-sql-at-scale.md) for the process of how to enable Microsoft Defender for SQL’s autoprovisioning across multiple subscriptions simultaneously. It's applicable to SQL servers hosted on Azure Virtual Machines, on-premises environments, and Azure Arc-enabled SQL servers.

### Which tables are used in LAW with AMA?

Defender for SQL on SQL VMs and Arc-enabled SQL servers uses the Log Analytics Workspace (LAW) to transfer data from the database to the Defender for Cloud portal. This means that no data is saved locally at the LAW. The tables in the LAW named *SQLAtpStatus* and the *SqlVulnerabilityAssessmentScanStatus* will be retired [when MMA is deprecated](/azure/azure-monitor/agents/azure-monitor-agent-migration). ATP and VA status can be viewed in the Defender for Cloud portal.

### How does Defender for SQL collect logs from the SQL server?

Defender for SQL uses Xevent, beginning with SQL Server 2017. On previous versions of SQL Server, Defender for SQL collects the logs using the SQL server audit logs.

### I see a parameter named enableCollectionOfSqlQueriesForSecurityResearch in the policy initiative. Does this mean that my data is collected for analysis?

This parameter isn't in use today. Its default value is *false*, meaning that unless you proactively change the value, it remains false. There's no effect from this parameter.

## Related content

For related information, see these resources:

- [How Microsoft Defender for Azure SQL can protect SQL servers anywhere](https://www.youtube.com/watch?v=V7RdB6RSVpc).
- [Security alerts for SQL Database and Azure Synapse Analytics](alerts-sql-database-and-azure-synapse-analytics.md)
- Check out [common questions](faq-defender-for-databases.yml) about Defender for Databases.
