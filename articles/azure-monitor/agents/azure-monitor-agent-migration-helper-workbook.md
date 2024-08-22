---
title: Azure Monitor Agent Migration Helper workbook 
description: Plan your migration from the Log Analytics Agent to the Azure Monitor Agent using the Azure Monitor Agent Migration Helper workbook.
author: EdB-MSFT
ms.author: edbaynash
ms.reviewer: guywild
ms.topic: conceptual 
ms.date: 06/16/2024

# Customer intent: As an azure administrator, I want to understand how the Azure Monitor Agent Migration Helper workbook can help me in migrating from the MMA agent to the AMA agent.

---

# Azure Monitor Agent Migration Helper workbook

Azure Monitor Agent Migration Helper workbook is a workbook-based Azure Monitor solution that helps you discover what to migrate and track progress as you move from Log Analytics Agent to Azure Monitor Agent. Use this single pane of glass view to expedite and track the status of your agent migration journey. The helper now supports multiple subscriptions, and includes automatic migration recommendations based on your usage.

## Using the AMA workbook

To open the workbook:
1. Navigate to the **Azure Monitor** page in the Azure portal, and select **Workbooks**. 
1. In the **Workbooks** pane, scroll down to the **AMA Migration Helper** workbook, and select it.

:::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/select-monitor-workbook.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/select-monitor-workbook.png" alt-text="A screenshot showing the AMA Migration helper tine in the list of workbooks.":::

The workbook opens on the **Subscriptions Overview** tab. 
This page provides a high-level view of the resources in your subscriptions, which agents are deployed, and the migration status. Use this page to keep track of the migration status of your resources across your subscriptions.

On the subscriptions overview tab, the workbook automatically detects the following resources:
- Subscriptions 
- Workspaces
- Azure Virtual Machines
- Virtual Machine Scale Sets
- Arc-enabled servers
- Hybrid machines without Arc where the legacy agent is deployed

Each item has a tab that provides a detailed view of the resources in that category.

 :::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/subscriptions-overview.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/subscriptions-overview.png" alt-text="A screenshot showing subscriptions overview tab.":::

The Migration status table appears at the bottom of the page.

The table includes the following columns:
- Subscription
- Resource Type
- Resource count
- How many resources have both agents deployed
- How many resources have only the Log Analytics Agent deployed
- How many resources have only the Azure Monitor Agent deployed
- Migration status

The table can be exported to Excel to allow you to work offline or share the data.

The following image shows the migration status table with the following statuses:

- Not Started: Resources that don't have any Azure Monitor Agents deployed.
- In progress: Resources that have both agents deployed.
- Completed: Resources that have only the Azure Monitor Agent deployed.


  :::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/migration-status.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/migration-status.png" alt-text="A screenshot showing the migration status table.":::

### Azure Virtual Machines, Azure Virtual Machine Scale Sets, and Arc-enabled servers tabs

The Azure Virtual Machines and Scale Sets tabs provides a detailed view of the Azure Virtual Machines, Virtual Machine Scale Sets and Arc-enabled serves in your subscriptions. These machines are listed regardless of the workspace to which they send telemetry. 
The table provides a view of the migration status is per machine showing which agents are deployed, the last time a heartbeat was sent to one of your workspaces, and the migration status. 

 :::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/azure-virtual-machines-tab.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/azure-virtual-machines-tab.png" alt-text="A screenshot showing the Azure Virtual Machines migration status tab.":::

### Hybrid machines without Arc

The Hybrid machines without Arc tab provide a detailed view of the hybrid machines in your subscriptions that aren't Arc-enables but have the legacy agent deployed. The table includes the Log Analytics workspace that the machine sends telemetry to, the last time the machine sent a heartbeat to the workspace

 :::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/hybrid-machines-tab.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/hybrid-machines-tab.png" alt-text="A screenshot showing the Hybrid machines without Arc migration status tab.":::


### Workspaces

The **Workspace** tab provides a detailed view of the workspaces in your subscriptions.  Choose a specific workspace to view using the dropdown above the table. The dropdown at the top of the page doesn't filter the table.

On the **Agents** tab, the table shows how many resources of each type are sending telemetry to the workspace, which agent is configured and the migration status.

 :::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/workspace-agents-tab.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/workspace-agents-tab.png" alt-text="A screenshot showing the workspace agents tab.":::    

The **Solutions** tab shows the legacy solutions that have been deployed into the workspace and the recommended migration steps are for that specific solution. Select the recommendation for more information. The last time data any kind of logs or telemetry was received from teach solution is listed.

:::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/workspace-solutions-tab.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/workspace-solutions-tab.png" alt-text="A screenshot showing the workspace solutions tab.":::    

You can also see this information in the **Legacy solutions** tab on your Log Analytics workspace page.

### Automation update management

The AMA migration Helper workbook provides you with guidance on which of your machines are using the update Management solution and how to migrate them.

The **Azure Automation Update Management** tab provides a detailed view of the machines in your subscriptions that are using the Update Management solution.  It detects your automation accounts linked to your workspace, shows the machines that may require migration, their status, and the ability to migrate them.

Select **Migrate Now** to go to the Azure Update Manager migration tool(Preview). 

For more information, see [Move from Automation Update Management to Azure Update Manager](/azure/update-manager/guidance-migration-automation-update-management-azure-update-manager)

:::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/automation-update-management.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/automation-update-management.png" alt-text="A screenshot showing the automation update management tab.":::    


## Workspace Auditing workbook

The Azure Monitor Workspace Auditing workbook is another workbook tool to help you understand your workspaces. 
This workbook collects all of your Log Analytics workspaces and shows you the following for each workspace:
1. All data sources that are sending data to the workspace.
1. The agents that are sending heartbeats to the workspace. 
1. The resources that are sending data to the workspace.
1. Any Application Insights resources that are sending data to the workspace.

To use the Azure Monitor Workspace Auditing workbook, follow the steps below

1. Copy the workbook JSON from the [GitHub repository](https://github.com/microsoft/AzureMonitorCommunity/blob/master/Azure%20Services/Log%20Analytics%20workspaces/Workbooks/Workspace%20Audit.json).
1. In the Azure portal, navigate to the **Azure Monitor** page, and select **Workbooks**.
1. Select **+ New**.
1. Select the Advanced editor **</>**
1. Select **Gallery Template**.
1. Replace the text with the JSON from the GitHub repository.
1. Select **Apply**.

:::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/workspace-auditing-workbook.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/workspace-auditing-workbook.png"  alt-text="A screenshot showing the edit workbook page.":::

The **Data Collection** tab shows the data sources that have been collected into this workspace over th last seven days. The table includes the data source, whether it's billable and the volume of data ingested, and the last time data was received from that data source.

:::image type="content" source="./media/azure-monitor-agent-migration-helper-workbook/workspace-auditing-workbook-data-collection.png" lightbox="./media/azure-monitor-agent-migration-helper-workbook/workspace-auditing-workbook-data-collection.png"  alt-text="A screenshot showing the workbook data collection tab.":::

The following tabs are also available in the workbook:
- **Agents**: Lists the agents that are sending heartbeats to the workspace. 
- **Azure Resources**: Lists the resources that are sending data to the workspace. 
- **Application Insights**:  The Application Insights resources that are sending data to the workspace.
