---
title: Create diagnostic settings at scale using Azure policies and initiatives
description: Use Azure Policy to create diagnostic settings in Azure Monitor at scale as each Azure resource is created.
author: EdB-MSFT
ms.author: edbaynash
services: azure-monitor
ms.topic: conceptual
ms.date: 02/25/2023
ms.reviewer: lualderm
---


# Create diagnostic settings at scale using Azure Policies and Initiatives

In order to monitor Azure resources, it's necessary to create [diagnostic settings](./diagnostic-settings.md) for each resource. This process can be difficult to manage when you have many resources. To simplify the process of creating and applying diagnostic settings at scale, use Azure Policy to automatically generate diagnostic settings for both new and existing resources. 

Each Azure resource type has a unique set of categories listed in the diagnostic settings. Each resource type therefore requires a separate policy definition. Some resource types have built-in policy definitions that you can assign without modification. For other resource types, you can create a custom definition.   

## Log category groups

Log category groups, group together similar types of logs. Category groups make it easy to refer to multiple logs in a single command. An **allLogs** category group exists containing all of the logs. There's also an **audit** category group that includes all audit logs.  By using to a category group, you can define a policy that dynamically updates as new log categories are added to group.

## Built-in policy definitions for Azure Monitor
There are generally three built-in policy definitions for each resource type, corresponding to the three destinations to send diagnostics to:
* Log Analytics workspaces 
* Azure Storage accounts 
* Event hubs 

Assign the policies for the resource type according to which destinations you need.

A set of policies built-in policies and initiatives based on the audit log category groups have been developed to help you apply diagnostics settings with only a few steps. For more information, see [Enable Diagnostics settings by category group using built-in policies.](./diagnostics-settings-policies-deployifnotexists.md)

For a complete list of built-in policies for Azure Monitor, see [Azure Policy built-in definitions for Azure Monitor](../policy-reference.md)

## Custom policy definitions
For resource types that don't have a built-in policy, you need to create a custom policy definition. You could do create a new policy manually in the Azure portal by copying an existing built-in policy and then modifying it for your resource type. Alternatively, create the policy programmatically by using a script in the PowerShell Gallery.

The script [Create-AzDiagPolicy](https://www.powershellgallery.com/packages/Create-AzDiagPolicy) creates policy files for a particular resource type that you can install by using PowerShell or the Azure CLI. Use the following procedure to create a custom policy definition for diagnostic settings:

1. Ensure that you have [Azure PowerShell](/powershell/azure/install-azure-powershell) installed.
2. Install the script by using the following command:
  
    ```azurepowershell
    Install-Script -Name Create-AzDiagPolicy
    ```

3. Run the script by using the parameters to specify where to send the logs. You'll be prompted to specify a subscription and resource type. 

   For example, to create a policy definition that sends logs to a Log Analytics workspace and an event hub, use the following command:

   ```azurepowershell
   Create-AzDiagPolicy.ps1 -ExportLA -ExportEH -ExportDir ".\PolicyFiles"  
   ```

   Alternatively, you can specify a subscription and resource type in the command. For example, to create a policy definition that sends logs to a Log Analytics workspace and an event hub for SQL Server databases, use the following command:

   ```azurepowershell
   Create-AzDiagPolicy.ps1 -SubscriptionID xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -ResourceType Microsoft.Sql/servers/databases  -ExportLA -ExportEH -ExportDir ".\PolicyFiles"  
   ```

5. The script creates separate folders for each policy definition. Each folder contains three files named *azurepolicy.json*, *azurepolicy.rules.json*, and *azurepolicy.parameters.json*. If you want to create the policy manually in the Azure portal, you can copy and paste the contents of *azurepolicy.json* because it includes the entire policy definition. Use the other two files with PowerShell or the Azure CLI to create the policy definition from a command line.

   The following examples show how to install the policy definition from both PowerShell and the Azure CLI. Each example includes metadata to specify a category of **Monitoring** to group the new policy definition with the built-in policy definitions.

   ```azurepowershell
   New-AzPolicyDefinition -name "Deploy Diagnostic Settings for SQL Server database to Log Analytics workspace" -policy .\Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.rules.json -parameter .\Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.parameters.json -mode All -Metadata '{"category":"Monitoring"}'
   ```

   ```azurecli
   az policy definition create --name 'deploy-diag-setting-sql-database--workspace' --display-name 'Deploy Diagnostic Settings for SQL Server database to Log Analytics workspace'  --rules 'Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.rules.json' --params 'Apply-Diag-Settings-LA-Microsoft.Sql-servers-databases\azurepolicy.parameters.json' --subscription 'AzureMonitor_Docs' --mode All
   ```

## Initiative
Rather than create an assignment for each policy definition, a common strategy is to create an initiative that includes the policy definitions to create diagnostic settings for each Azure service. Create an assignment between the initiative and a management group, subscription, or resource group, depending on how you manage your environment. This strategy offers the following benefits:

- Create a single assignment for the initiative instead of multiple assignments for each resource type. Use the same initiative for multiple monitoring groups, subscriptions, or resource groups.
- Modify the initiative when you need to add a new resource type or destination. For example, your initial requirements might be to send data only to a Log Analytics workspace, but later you want to add an event hub. Modify the initiative instead of creating new assignments.

For details on creating an initiative, see [Create and assign an initiative definition](../../governance/policy/tutorials/create-and-manage.md#create-and-assign-an-initiative-definition). Consider the following recommendations:

- Set **Category** to **Monitoring** to group it with related built-in and custom policy definitions.
- Instead of specifying the details for the Log Analytics workspace and the event hub for policy definitions included in the initiative, use a common initiative parameter. This parameter allows you to easily specify a common value for all policy definitions and change that value if necessary.
<!-- convertborder later -->
:::image type="content" source="media/diagnostic-settings-policy/initiative-definition.png" lightbox="media/diagnostic-settings-policy/initiative-definition.png" alt-text="Screenshot that shows settings for initiative definition." border="false":::

## Assignment 
Assign the initiative to an Azure management group, subscription, or resource group, depending on the scope of your resources to monitor. A [management group](../../governance/management-groups/overview.md) is useful for scoping policy, especially if your organization has multiple subscriptions.
<!-- convertborder later -->
:::image type="content" source="media/diagnostic-settings-policy/initiative-assignment.png" lightbox="media/diagnostic-settings-policy/initiative-assignment.png" alt-text="Screenshot of the settings for the Basics tab in the Assign initiative section of the Diagnostic settings to Log Analytics workspace in the Azure portal." border="false":::

By using initiative parameters, you can specify the workspace or any other details once for all of the policy definitions in the initiative. 
<!-- convertborder later -->
:::image type="content" source="media/diagnostic-settings-policy/initiative-parameters.png" lightbox="media/diagnostic-settings-policy/initiative-parameters.png" alt-text="Screenshot that shows initiative parameters on the Parameters tab." border="false":::

## Remediation
The initiative will be applied to each virtual machine as it's created. A [remediation task](../../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to existing resources, so you can create diagnostic settings for any resources that were already created.

When you create the assignment by using the Azure portal, you have the option of creating a remediation task at the same time. See [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md) for details on the remediation.
<!-- convertborder later -->
:::image type="content" source="media/diagnostic-settings-policy/initiative-remediation.png" lightbox="media/diagnostic-settings-policy/initiative-remediation.png" alt-text="Screenshot that shows initiative remediation for a Log Analytics workspace." border="false":::

## Troubleshooting

### Metric category is not supported

When deploying a diagnostic setting, you receive an error message, similar to *Metric category 'xxxx' is not supported*. You may receive this error even though your previous deployment succeeded. 

The problem occurs when using a Resource Manager template, REST API, Azure CLI, or Azure PowerShell. Diagnostic settings created via the Azure portal aren't affected as only the supported category names are presented.

The problem is caused by a recent change in the underlying API. Metric categories other than 'AllMetrics' aren't supported and never were except for a few specific Azure services. In the past, other category names were ignored when deploying a diagnostic setting. The Azure Monitor backend redirected these categories to 'AllMetrics'.  As of February 2021, the backend was updated to specifically confirm the metric category provided is accurate. This change has caused some deployments to fail.

If you receive this error, update your deployments to replace any metric category names with 'AllMetrics' to fix the issue. If the deployment was previously adding multiple categories, only one with the 'AllMetrics' reference should be kept. If you continue to have the problem, contact Azure support through the Azure portal. 

### Setting disappears due to non-ASCII characters in resourceID

Diagnostic settings don't support resourceIDs with non-ASCII characters (for example, Preproducción). Since you can't rename resources in Azure, your only option is to create a new resource without the non-ASCII characters. If the characters are in a resource group, you can move the resources under it to a new one. Otherwise, you'll need to recreate the resource.

## Next steps

- [Read more about Azure platform Logs](./platform-logs-overview.md)
- [Read more about diagnostic settings](./diagnostic-settings.md)
