---
title: Relocation guidance for Azure Monitor - Log Analytics Workspace
description: Learn how to relocate an Azure Monitor - Log Analytics Workspace to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/23/2024
ms.service: azure-monitor
ms.subservice: logs
ms.topic: how-to
---

# Relocation guidance for Azure Monitor - Log Analytics Workspace

This article covers relocation guidance for Azure Monitor - Log Analytics Workspace across regions.

### Prerequisites

- Validate the Azure subscription resource creation permission to deploy Log Analytics workspaces in the target region. Also, check to see if there's any Azure policy region restriction.
- Landing Zone has been deployed as per assessed architecture.
- Collect all Log Analytics workspace dependent resources. Resources that Log Analytics Workspace depends on must be moved *prior* to the Log Analytics Workspace relocation process. The services below are some of the dependencies that you may need to move prior to a workspace relocation. Consult the corresponding service guidance to learn how to move resources to the target location.

    - [Virtual Network, Network Security Groups, and Route Tables](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation Account](./relocation-automation.md)
    - [Storage Account](./relocation-storage-account.md)
    - [Azure Event Hub]()
    - [Azure Sentinel](./relocation-sentinel.md)
    - [Microsoft Defender for Cloud (Azure Security Center)](./relocation-defender.md)


### Redeploy your Log Analytics Workspace

In a Landing Zone deployment, many resources depend on Azure Log Analytics Workspace for data logging. When planning for the relocation of the Landing Zone, prioritization sequencing is extremely important. A relocation plan for Log Analytics Workspace must include the relocation of any resources that log data with Log Analytics Workspace as soon as Log Analytics has completed its move. 

Log Analytics Workspace doesn't natively support migrating workspace data from one region to another and associated devices.  Instead, a new Log Analytics Workspace is created in the desired region and then the devices and settings are reconfigured to the new workspace. 

The diagram below illustrates the relocation pattern for a Log Analytics workspace. The red flow lines represent the redeployment of the target instance along with data movement and updating domains and endpoints.


:::image type="content" source="media/relocation/log-analytics/log-analytics-workspace-relocation-pattern.png" alt-text="Diagram illustrating Log Analytics Workspace relocation pattern.":::


**Azure Resource Mover** doesn't support moving services used by the Microsoft Sentinel. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).

**To redeploy your workspace:**


1. From the Azure portal, export your Log Analytics Workspace into an [ARM template](/azure/azure-monitor/logs/resource-manager-workspace?tabs=bicep). 

1. Adjust the template parameters:
    - Remove linked-services resources (`microsoft.operationalinsights/workspaces/linkedservices``) if they’re present in the template.
    - Make the necessary changes to the template, such as updating all occurrences of the name and the location for the relocated Log Analytics Workspace. 

1. Adjust the parameter file by changing the `value` property for each parameter, such as `workspacesName`, `alertName`, and `location`.

1. Create the Log Analytics Workspace In the target region datacenter buy using the exported template.

1. Use any of the available options, including Data Collection Rules, to configure the required agents on virtual machines and virtual machine scale sets in the target region.

    - [For Windows, install the agent](/azure/azure-monitor/agents/agent-windows?tabs=setup-wizard) using DSC(Desire State Configuration) in Azure Automation.

    - [For Linux, install the agent](/azure/azure-monitor/agents/agent-linux?tabs=wrapper-script) using a wrapper script.

    - Install the agent with [VM insights by using Azure Policy](/azure/azure-monitor/vm/vminsights-enable-policy).

    - Setup auto provisioning for [monitoring agents with Defender for Cloud](/azure/defender-for-cloud/monitoring-components). 

1. Log Analytics solutions, such as Sentinel, that aren't included in the exported ARM template, require a specific onboarding process for them to the target workspace.  For more information, see [Install a monitoring solution](/previous-versions/azure/azure-monitor/insights/solutions?tabs=portal#install-a-monitoring-solution).


1. Once Log analytics relocation completes:
    - Identify resources in the [prerequisites](#prerequisites) that are required to send data to log analytics. [The diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD) of those resources must define the target workspace as the destination.
    - [Configure each Data Collector API instance](/azure/azure-monitor/logs/data-collector-api?tabs=powershell) separately to send data to the target workspace.

    - If alert rules aren’t exported in the template, you must [configure them manually in the target workspace](/azure/azure-monitor/alerts/alerts-create-log-alert-rule).

    - [Move all workbooks](/azure/azure-monitor/visualize/workbooks-move-region) that are associated with the source workspace to the target region. 

    - Reconfigure associated resources manually/or by using script updated in dependent resources, configs and apps.


### Validate your Log Analytics relocation

Once the relocation is complete, the Log Analytics Workspace must be tested and validated. Below are some of the recommended guidelines.

- If the relocation has been successful, all the relevant data tables should start populating. For example:

    :::image type="content" source="media/relocation/log-analytics/log-analytics-workspace-data-table.png" alt-text="Diagram illustrating Log Analytics Workspace data tables populating after relocation.":::

- Run manual or automated smoke and integration tests to ensure that configurations and dependent resources have been properly linked, and that configured data is accessible.

- Test Log Analytics Workspace components and integration.

- Run a validation check (either through a script or manually) to ensure all dependent resources are properly linked and all configured data is flowing to log analytics. This can be checked by running the following Kusto query language script:

    ```kusto
        Event
        | where TimeGenerated > ago(1h)
        | sort by TimeGenerated desc
    ```

