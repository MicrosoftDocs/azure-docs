---
title: Deploy Azure Monitor at scale by using Azure Policy
description: Deploy Azure Monitor features at scale by using Azure Policy.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/08/2020

---

# Deploy Azure Monitor at scale by using Azure Policy
Although some Azure Monitor features are configured once or a limited number of times, others must be repeated for each resource that you want to monitor. This article describes methods for using Azure Policy to implement Azure Monitor at scale. The goal is to ensure that monitoring is consistently and accurately configured for all your Azure resources.

For example, you need to create a diagnostic setting for all your existing Azure resources and for each new resource that you create. You also need to have an agent installed and configured each time you create a virtual machine. You can use methods such as PowerShell or CLI to perform these actions, because these methods are available for all features of Azure Monitor. But by using Azure Policy, you can have logic in place that will automatically perform the appropriate configuration each time you create or modify a resource.


## Azure Policy
This section provides a brief introduction to [Azure Policy](../governance/policy/overview.md). You can use the Azure Policy service to assess and enforce organizational standards across your entire Azure subscription or management group with minimal effort. For complete details, see the [Azure Policy documentation](../governance/policy/overview.md).

With Azure Policy, you can specify configuration requirements for any resources that are created and take one of these actions:

- Identify resources that are out of compliance.
- Block the resources from being created.
- Add the required configuration. 

Azure Policy works by intercepting calls to create a new resource or to modify an existing resource. It can respond with such effects as denying the request if it doesn't match match with the properties expected in a policy definition, flagging it for noncompliance, or deploying a related resource. You can remediate existing resources with a **deployIfNotExists** or **modify** policy definition.

Azure Policy consists of the objects in the following table. For a more detailed explanation of each, see [Azure Policy objects](../governance/policy/overview.md#azure-policy-objects).

| Item | Description |
|:---|:---|
| Policy definition | This object describes resource compliance conditions and the effect to take if a condition is met. It might be all resources of a particular type or only resources that match certain properties. The effect might be to simply flag the resource for compliance or to deploy a related resource. Policy definitions are written using JSON, as described in [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md). Effects are described in [Understand Azure Policy effects](../governance/policy/concepts/effects.md).
| Policy initiative | A group of policy definitions that should be applied together is called an intiative. For example, you might have one policy definition to send resource logs to a Log Analytics workspace and another to send resource logs to event hubs. Create an initiative that includes both policy definitions, and apply the initiative to resources instead of the individual policy definitions. Initiatives are written using JSON, as described in [Azure Policy initiative structure](../governance/policy/concepts/initiative-definition-structure.md). |
| Assignment | A policy definition or initiative doesn't take effect until it's assigned to a scope. For example, assign a policy to a resource group to apply it to all resources created in that resource, or assign it to a subscription to apply it to all resources in that subscription. For more information, see [Azure Policy assignment structure](../governance/policy/concepts/assignment-structure.md). |

## Built-in policy definitions for Azure Monitor
Azure Policy includes several prebuilt definitions related to Azure Monitor. You can assign these policy definitions to your existing subscription or use them as a basis to create your own custom definitions. For a complete list of the built-in policies in the **Monitoring** category, see [Azure Policy built-in policy definitions for Azure Monitor](.//policy-reference.md).

To view the built-in policy definitions related to monitoring:

1. Go to **Azure Policy** in the Azure portal.
2. Select **Definitions**.
3. For **Type**, select **Built-in**. For **Category**, select **Monitoring**.

  ![Screenshot of the Azure Policy Definitions page in Azure portal showing a list of policy definitions for the Monitoring category and Built-in Type.](media/deploy-scale/builtin-policies.png)

## Azure Monitor agent
The [Azure Monitor agent](agents/azure-monitor-agent-overview.md) collects monitoring data from the guest operating system of Azure virtual machines and delivers it to Azure Monitor. It uses [Data Collection Rules](agents/data-collection-rule-overview.md) to configure data to collect from each agent, that enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines.

Use the following policies and policy initiatives to automatically install the agent and associate it to a data collection rule, every time you create a virtual machine.

### Built-in policy initiatives
View prerequisites for agent installation [here](agents/azure-monitor-agent-install.md#prerequisites). 

There are policy initiatives for Windows and Linux virtual machines, comprising of individual policies that
- Install the Azure Monitor agent extension on the virtual machine
- Create and deploy the association to link the virtual machine to a data collection rule

  ![Partial screenshot from the Azure Policy Definitions page showing two built-in policy initiaves for configuring Azure Monitor Agent.](media/deploy-scale/built-in-ama-dcr-initiatives.png)  

### Built-in policies 
You can choose to use the individual policies as per your needs, from the respective policy initiative. For example if you only want to automatically install the agent, simply use the first policy from the initiative as shown below:  

  ![Partial screenshot from the Azure Policy Definitions page showing policies contained within the initiative for configuring Azure Monitor Agent.](media/deploy-scale/built-in-ama-dcr-policy.png)  

### Remediation
The initiatives or policies will apply to each virtual machine as it's created. A [remediation task](../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to **existing resources**, so this allows you to configure the Azure Monitor agent for any resources that were already created. When you create the assignment using the Azure portal, you have the option of creating a remediation task at the same time. See [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md) for details on the remediation.

![Initiative remediation for AMA](media/deploy-scale/built-in-ama-dcr-remediation.png)


## Diagnostic settings
[Diagnostic settings](essentials/diagnostic-settings.md) collect resource logs and metrics from Azure resources to multiple locations, typically to a Log Analytics workspace which allows you to analyze the data with [log queries](logs/log-query-overview.md) and [log alerts](alerts/alerts-log.md). Use Policy to automatically create a diagnostic setting each time you create a resource.

Each Azure resource type has a unique set of categories that need to be listed in the diagnostic setting. Because of this, each resource type requires a separate policy definition. Some resource types have built-in policy definitions that you can assign without modification. For other resource types, you need to create a custom definition.

### Built-in policy definitions for Azure Monitor
There are two built-in policy definitions for each resource type, one to send to Log Analytics workspace and another to Event Hub. If you only need one location, then assign that policy for the resource type. If you need both, then assign both policy definitions for the resource.

For example, the following image shows the built-in diagnostic setting policy definitions for Data Lake Analytics.

  ![Partial screenshot from the Azure Policy Definitions page showing two built-in diagnostic setting policy definitions for Data Lake Analytics.](media/deploy-scale/builtin-diagnostic-settings.png)

### Custom policy definitions
For resource types that don't have a built-in policy, you need to create a custom policy definition. You could do this manually in the Azure portal by copying an existing built-in policy and then modifying for your resource type. It's more efficient though to create the policy programatically using a script in the PowerShell Gallery.

The script [Create-AzDiagPolicy](https://www.powershellgallery.com/packages/Create-AzDiagPolicy) creates policy files for a particular resource type that you can install using PowerShell or CLI. Use the following procedure to create a custom policy definition for diagnostic settings.


1. Ensure that you have [Azure PowerShell](/powershell/azure/install-az-ps) installed.
2. Install the script with the following command:
  
    ```azurepowershell
    Install-Script -Name Create-AzDiagPolicy
    ```

3. Run the script using the parameters to specify where to send the logs. You will be prompted to specify a subscription and resource type. For example, to create a policy definition that sends to Log Analytics workspace and Event Hub, use the following command.

   ```azurepowershell
   Create-AzDiagPolicy.ps1 -ExportLA -ExportEH -ExportDir ".\PolicyFiles"  
   ```

4. Alternatively, you can specify a subscription and resource type in the command. For example, to create a policy definition that sends to Log Analytics workspace and Event Hub for Azure SQL Server databases, use the following command.

   ```azurepowershell
   Create-AzDiagPolicy.ps1 -SubscriptionID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ResourceType Microsoft.Sql/servers/databases  -ExportLA -ExportEH -ExportDir ".\PolicyFiles"  
   ```

5. The script creates separate folders for each policy definition, each containing three files named azurepolicy.json, azurepolicy.rules.json, azurepolicy.parameters.json. If you want to create the policy manually in the Azure portal, you can copy and paste the contents of azurepolicy.json since it includes the entire policy definition. Use the other two files with PowerShell or CLI to create the policy definition from a command line.

    The following examples show how to install the policy definition from both PowerShell and CLI. Each includes metadata to specify a category of **Monitoring** to group the new policy definition with the built-in policy definitions.

      ```azurepowershell
      New-AzPolicyDefinition -name "Deploy Diagnostic Settings for SQL Server database to Log Analytics workspace" -policy .\Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.rules.json -parameter .\Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.parameters.json -mode All -Metadata '{"category":"Monitoring"}'
      ```

      ```azurecli
      az policy definition create --name 'deploy-diag-setting-sql-database--workspace' --display-name 'Deploy Diagnostic Settings for SQL Server database to Log Analytics workspace'  --rules 'Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.rules.json' --params 'Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.parameters.json' --subscription 'AzureMonitor_Docs' --mode All
      ```

### Initiative
Rather than create an assignment for each policy definition, a common strategy is to create an initiative that includes the policy definitions to create diagnostic settings for each Azure service. Create an assignment between the initiative and a management group, subscription, or resource group depending on how you manage your environment. This strategy offers the following benefits:

- Create a single assignment for the initiative instead of multiple assignments for each resource type. Use the same initiative for multiple monitoring groups, subscriptions, or resource groups.
- Modify the initiative when you need to add a new resource type or destination. For example, your initial requirements might be to send data only to a Log Analytics workspace, but later you want to add Event Hub. Modify the initiative rather than creating new assignments.

See [Create and assign an initiative definition](../governance/policy/tutorials/create-and-manage.md#create-and-assign-an-initiative-definition) for details on creating an initiative. Consider the following recommendations:

- Set the **Category** to **Monitoring** to group it with related built-in and custom policy definitions.
- Instead of specifying the details for the Log Analytics workspace and the Event Hub for policy definition included in the initiative, use a common initiative parameter. This allows you to easily specify a common value for all policy definitions and change that value if necessary.

![Initiative definition](media/deploy-scale/initiative-definition.png)

### Assignment 
Assign the initiative to an Azure management group, subscription, or resource group depending on the scope of your resources to monitor. A [management group](../governance/management-groups/overview.md) is particularly useful for scoping policy especially if your organization has multiple subscriptions.

![Screenshot of the settings for the Basics tab in the Assign initiative section of the Diagnostic settings to Log Analytics workspace in Azure portal.](media/deploy-scale/initiative-assignment.png)

By using initiative parameters, you can specify the workspace or any other details once for all of the policy definitions in the initiative. 

![Initiative parameters](media/deploy-scale/initiative-parameters.png)

### Remediation
The initiative will apply to each virtual machine as it's created. A [remediation task](../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to existing resources, so this allows you to create diagnostic settings for any resources that were already created. When you create the assignment using the Azure portal, you have the option of creating a remediation task at the same time. See [Remediate non-compliant resources with Azure Policy](../governance/policy/how-to/remediate-resources.md) for details on the remediation.

![Initiative remediation](media/deploy-scale/initiative-remediation.png)


## VM insights
[VM insights](vm/vminsights-overview.md) is the primary tool in Azure Monitor for monitoring virtual machines. Enabling VM insights installs both the Log Analytics agent and the Dependency agent. Rather than performing these tasks manually, use Azure Policy to ensure have each virtual machine configured as you create it.

> [!NOTE]
> VM insights includes a feature called **VM insights Policy Coverage** that allows you to discover and remediate noncompliant VMs in your environment. You can use this feature rather than working directly with Azure Policy for Azure VMs and for hybrid virtual machines connected with Azure Arc. For Azure virtual machine scale sets, you must create the assignment using Azure Policy.
 

VM insights includes the following built-in initiatives that install both agents to enable full monitoring. 

|Name |Description |
|:---|:---|
|Enable VM insights | Installs the Log Analytics agent and Dependency agent on Azure VMs and hybrid VMs connected with Azure Arc. |
|Enable Azure Monitor for virtual machine scale sets | Installs the Log Analytics agent and Dependency agent on Azure virtual machine scale set. |


### Virtual machines
Instead of creating assignments for these initiatives using the Azure Policy interface, VM insights includes a feature that allows you to inspect the number of virtual machines in each scope to determine whether the initiative has been applied. You can then configure the workspace and create any required assignments using that interface.

For details of this process, see [Enable VM insights by using Azure Policy](./vm/vminsights-enable-policy.md).

![VM insights policy](media/deploy-scale/vminsights-policy.png)

### Virtual machine scale sets
To use Azure Policy to enable monitoring for virtual machine scale sets, assign the **Enable Azure Monitor for virtual machine scale sets** initiative to an Azure management group, subscription, or resource group depending on the scope of your resources to monitor. A [management group](../governance/management-groups/overview.md) is particularly useful for scoping policy especially if your organization has multiple subscriptions.

![Screenshot of the Assign initiative page in Azure portal. Initiative definition is set to Enable Azure Monitor for virtual machine scale sets.](media/deploy-scale/virtual-machine-scale-set-assign-initiative.png)

Select the workspace the data will be sent to. This workspace must have the *VMInsights* solution installed as described in [Configure Log Analytics workspace for VM insights](vm/vminsights-configure-workspace.md).

![Select workspace](media/deploy-scale/virtual-machine-scale-set-workspace.png)

Create a remediation task if you have existing virtual machine scale set that need to be assigned this policy.

![Remediation task](media/deploy-scale/virtual-machine-scale-set-remediation.png)

### Log Analytics agent
You might have scenarios where you want to install the Log Analytics agent but not the dependency agent. There is no built-in initiative for just the agent, but you can create your own based on the built-in policy definitions provided by VM insights.

> [!NOTE]
> There would be no reason to deploy the Dependency agent on its own since it requires the Log Analytics agent to deliver its data to Azure Monitor.


|Name |Description |
|-----|------------|
|Audit Log Analytics agent deployment – VM image (OS) unlisted |Reports VMs as noncompliant if the VM image (OS) isn't defined in the list and the agent isn't installed. |
|Deploy Log Analytics agent for Linux VMs |Deploy Log Analytics agent for Linux VMs if the VM image (OS) is defined in the list and the agent isn't installed. |
|Deploy Log Analytics agent for Windows VMs |Deploy Log Analytics agent for Windows VMs if the VM image (OS) is defined in the list and the agent isn't installed. |
| [Preview]: Log Analytics agent should be installed on your Linux Azure Arc machines |Reports hybrid Azure Arc machines as noncompliant for Linux VMs if the VM image (OS) is defined in the list and the agent isn't installed. |
| [Preview]: Log Analytics agent should be installed on your Windows Azure Arc machines |Reports hybrid Azure Arc machines as noncompliant for Windows VMs if the VM image (OS) is defined in the list and the agent isn't installed. |
| [Preview]: Deploy Log Analytics agent to Linux Azure Arc machines |Deploy Log Analytics agent for Linux hybrid Azure Arc machines if the VM image (OS) is defined in the list and the agent isn't installed. |
| [Preview]: Deploy Log Analytics agent to Windows Azure Arc machines |Deploy Log Analytics agent for Windows hybrid Azure Arc machines if the VM image (OS) is defined in the list and the agent isn't installed. |
|Audit Dependency agent deployment in virtual machine scale sets – VM image (OS) unlisted |Reports virtual machine scale set as noncompliant if the VM image (OS) isn't defined in the list and the agent isn't installed. |
|Audit Log Analytics agent deployment in virtual machine scale sets – VM image (OS) unlisted |Reports virtual machine scale set as noncompliant if the VM image (OS) isn't defined in the list and the agent isn't installed. |
|Deploy Log Analytics agent for Linux virtual machine scale sets |Deploy Log Analytics agent for Linux virtual machine scale sets if the VM Image (OS) is defined in the list and the agent isn't installed. |
|Deploy Log Analytics agent for Windows virtual machine scale sets |Deploy Log Analytics agent for Windows virtual machine scale sets if the VM image (OS) is defined in the list and the agent isn't installed. |


## Next steps

- Read more about [Azure Policy](../governance/policy/overview.md).
- Read more about [diagnostic settings](essentials/diagnostic-settings.md).
