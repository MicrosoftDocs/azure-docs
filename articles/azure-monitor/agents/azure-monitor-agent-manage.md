---
title: Manage Azure Monitor Agent
description: Options for managing Azure Monitor Agent on Azure virtual machines and Azure Arc-enabled servers.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 7/18/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: jeffwo

---

# Manage Azure Monitor Agent

This article provides the different options currently available to install, uninstall, and update the [Azure Monitor agent](azure-monitor-agent-overview.md). This agent extension can be installed on Azure virtual machines, scale sets, and Azure Arc-enabled servers. It also lists the options to create [associations with data collection rules](data-collection-rule-azure-monitor-agent.md) that define which data the agent should collect. Installing, upgrading, or uninstalling Azure Monitor Agent won't require you to restart your server.

## Virtual machine extension details

Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. You can install it by using any of the methods to install virtual machine extensions including the methods described in this article.

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | See [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) | [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) |

## Extension versions

View [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md).

## Prerequisites

The following prerequisites must be met prior to installing Azure Monitor Agent.

- **Permissions**: For methods other than using the Azure portal, you must have the following role assignments to install the agent:  

   | Built-in role | Scopes | Reason |  
   |:---|:---|:---|  
   | <ul><li>[Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)</li><li>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, scale sets,</li><li>Azure Arc-enabled servers</li></ul> | To deploy the agent |  
   | Any role that includes the action *Microsoft.Resources/deployments/** (for example, [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li></ul> | To deploy agent extension via Azure Resource Manager templates (also used by Azure Policy) |  
- **Non-Azure**: To install the agent on physical servers and virtual machines hosted *outside* of Azure (that is, on-premises) or in other clouds, you must [install the Azure Arc Connected Machine agent](../../azure-arc/servers/agent-overview.md) first, at no added cost.
- **Authentication**: [Managed identity](../../active-directory/managed-identities-azure-resources/overview.md) must be enabled on Azure virtual machines. Both user-assigned and system-assigned managed identities are supported.
  - **User-assigned**: This managed identity is recommended for large-scale deployments, configurable via [built-in Azure policies](#use-azure-policy). You can create a user-assigned managed identity once and share it across multiple VMs, which means it's more scalable than a system-assigned managed identity. If you use a user-assigned managed identity, you must pass the managed identity details to Azure Monitor Agent via extension settings:
  
    ```json
    {
      "authentication": {
        "managedIdentity": {
          "identifier-name": "mi_res_id" or "object_id" or "client_id",
          "identifier-value": "<resource-id-of-uai>" or "<guid-object-or-client-id>"
        }
      }
    }
    ```
    We recommend that you use `mi_res_id` as the `identifier-name`. The following sample commands only show usage with `mi_res_id` for the sake of brevity. For more information on `mi_res_id`, `object_id`, and `client_id`, see the [Managed identity documentation](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http).
  - **System-assigned**: This managed identity is suited for initial testing or small deployments. When used at scale, for example, for all VMs in a subscription, it results in a substantial number of identities created (and deleted) in Microsoft Entra ID. To avoid this churn of identities, use user-assigned managed identities instead. *For Azure Arc-enabled servers, system-assigned managed identity is enabled automatically* as soon as you install the Azure Arc agent. It's the only supported type for Azure Arc-enabled servers.
  - **Not required for Azure Arc-enabled servers**: The system identity is enabled automatically when you [create a data collection rule in the Azure portal](data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule).
- **Networking**: If you use network firewalls, the [Azure Resource Manager service tag](../../virtual-network/service-tags-overview.md) must be enabled on the virtual network for the virtual machine. The virtual machine must also have access to the following HTTPS endpoints:

  -	global.handler.control.monitor.azure.com
  -	`<virtual-machine-region-name>`.handler.control.monitor.azure.com (example: westus.handler.control.monitor.azure.com)
  -	`<log-analytics-workspace-id>`.ods.opinsights.azure.com (example: 12345a01-b1cd-1234-e1f2-1234567g8h99.ods.opinsights.azure.com)  
    (If you use private links on the agent, you must also add the [dce endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint)).

> [!NOTE]
> This article only pertains to agent installation or management. After you install the agent, you must review the next article to [configure data collection rules and associate them with the machines](./data-collection-rule-azure-monitor-agent.md) with agents installed. *Azure Monitor Agents can't function without being associated with data collection rules.*

## Install

#### [Portal](#tab/azure-portal)

For information on how to install Azure Monitor Agent from the Azure portal, see [Create a data collection rule](data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule). This process creates the rule, associates it to the selected resources, and installs Azure Monitor Agent on them if it's not already installed.

#### [PowerShell](#tab/azure-powershell)

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the PowerShell command for adding a virtual machine extension. 

### Install on Azure virtual machines

Use the following PowerShell commands to install Azure Monitor Agent on Azure virtual machines. Choose the appropriate command based on your chosen authentication method.

#### User-assigned managed identity

- Windows
  ```powershell
  Set-AzVMExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true -SettingString '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
  ```

- Linux
  ```powershell
  Set-AzVMExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true -SettingString '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
  ```

#### System-assigned managed identity

- Windows
  ```powershell
  Set-AzVMExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true
  ```

- Linux
  ```powershell
  Set-AzVMExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true
  ```

### Install on Azure virtual machines scale set 

Use the [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) PowerShell cmdlet to install Azure Monitor Agent on Azure virtual machines scale sets.

### Install on Azure Arc-enabled servers

Use the following PowerShell commands to install Azure Monitor Agent on Azure Arc-enabled servers.

- Windows
  ```powershell
  New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -EnableAutomaticUpgrade
  ```

- Linux
  ```powershell
  New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -EnableAutomaticUpgrade
  ```

#### [Azure CLI](#tab/azure-cli)

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the Azure CLI command for adding a virtual machine extension.

### Install on Azure virtual machines

Use the following CLI commands to install Azure Monitor Agent on Azure virtual machines. Choose the appropriate command based on your chosen authentication method.

#### User-assigned managed identity

- Windows
  ```azurecli
  az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true --settings '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
  ```

- Linux
  ```azurecli
  az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true --settings '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
  ```

#### System-assigned managed identity

- Windows
  ```azurecli
  az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true
  ```

- Linux
  ```azurecli
  az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true
  ```
### Install on Azure virtual machines scale set 

Use the [az vmss extension set](/cli/azure/vmss/extension) CLI cmdlet to install Azure Monitor Agent on Azure virtual machines scale sets.

### Install on Azure Arc-enabled servers

Use the following CLI commands to install Azure Monitor Agent on Azure Arc-enabled servers.

- Windows
  ```azurecli
  az connectedmachine extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
  ```

- Linux
  ```azurecli
  az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
  ```

#### [Resource Manager template](#tab/azure-resource-manager)

You can use Resource Manager templates to install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers and to create an association with data collection rules. You must create any data collection rule prior to creating the association.

Get sample templates for installing the agent and creating the association from the following resources:

- [Template to install Azure Monitor agent (Azure and Azure Arc)](../agents/resource-manager-agent.md#azure-monitor-agent)
- [Template to create association with data collection rule](./resource-manager-data-collection-rules.md)

Install the templates by using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md), such as the following commands.

- PowerShell
  ```powershell
  New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
  ```

- Azure CLI
  ```azurecli
  az deployment group create --resource-group "<resource-group-name>" --template-file "<path-to-template>" --parameters "@<parameter-filename.json>"
  ```

---

## Uninstall

#### [Portal](#tab/azure-portal)

To uninstall Azure Monitor Agent by using the Azure portal, go to your virtual machine, scale set, or Azure Arc-enabled server. Select the **Extensions** tab and select **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that opens, select **Uninstall**.

#### [PowerShell](#tab/azure-powershell)

### Uninstall on Azure virtual machines

Use the following PowerShell commands to uninstall Azure Monitor Agent on Azure virtual machines.

- Windows
  ```powershell
  Remove-AzVMExtension -Name AzureMonitorWindowsAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
  ```

- Linux
  ```powershell
  Remove-AzVMExtension -Name AzureMonitorLinuxAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
  ```
### Uninstall on Azure virtual machines scale set 

Use the [Remove-AzVmssExtension](/powershell/module/az.compute/remove-azvmssextension) PowerShell cmdlet to uninstall Azure Monitor Agent on Azure virtual machines scale sets.

### Uninstall on Azure Arc-enabled servers

Use the following PowerShell commands to uninstall Azure Monitor Agent on Azure Arc-enabled servers.

- Windows
  ```powershell
  Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AzureMonitorWindowsAgent
  ```

- Linux
  ```powershell
  Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AzureMonitorLinuxAgent
  ```

#### [Azure CLI](#tab/azure-cli)

### Uninstall on Azure virtual machines

Use the following CLI commands to uninstall Azure Monitor Agent on Azure virtual machines.

- Windows
  ```azurecli
  az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> --name AzureMonitorWindowsAgent
  ```

- Linux
  ```azurecli
  az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> --name AzureMonitorLinuxAgent
  ```
### Uninstall on Azure virtual machines scale set 

Use the [az vmss extension delete](/cli/azure/vmss/extension) CLI cmdlet to uninstall Azure Monitor Agent on Azure virtual machines scale sets.

### Uninstall on Azure Arc-enabled servers

Use the following CLI commands to uninstall Azure Monitor Agent on Azure Arc-enabled servers.

- Windows
  ```azurecli
  az connectedmachine extension delete --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
  ```

- Linux
  ```azurecli
  az connectedmachine extension delete --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
  ```

#### [Resource Manager template](#tab/azure-resource-manager)

N/A

---

## Update

> [!NOTE]
> The recommendation is to enable [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) which may take **up to 5 weeks** after a new extension version is released for it to update installed extensions to the released (latest) version across all regions. Upgrades are issued in batches, so you may see some of your virtual machines, scale-sets or Arc-enabled servers get upgraded before others. If you need to upgrade an extension immediately, you may use the manual instructions below.

#### [Portal](#tab/azure-portal)

To perform a one-time update of the agent, you must first uninstall the existing agent version. Then install the new version as described.

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature. Go to your virtual machine or scale set, select the **Extensions** tab and select **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that opens, select **Enable automatic upgrade**.

#### [PowerShell](#tab/azure-powershell)

### Update on Azure virtual machines

To perform a one-time update of the agent, you must first uninstall the existing agent version, then install the new version as described.

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature by using the following PowerShell commands.

- Windows 
  ```powershell
  Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorWindowsAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
  ```

- Linux
  ```powershell
  Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorLinuxAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
  ```

### Update on Azure Arc-enabled servers

To perform a one-time upgrade of the agent, use the following PowerShell commands.

- Windows
  ```powershell
  $target = @{"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent" = @{"targetVersion"=<target-version-number>}}
  Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
  ```

- Linux
  ```powershell
  $target = @{"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent" = @{"targetVersion"=<target-version-number>}}
  Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
  ```

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#manage-automatic-extension-upgrade) feature by using the following PowerShell commands.

- Windows
  ```powershell
  Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AzureMonitorWindowsAgent -EnableAutomaticUpgrade
  ```

- Linux
  ```powershell
  Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AzureMonitorLinuxAgent -EnableAutomaticUpgrade
  ```

#### [Azure CLI](#tab/azure-cli)

### Update on Azure virtual machines

To perform a one-time update of the agent, you must first uninstall the existing agent version, then install the new version as described.
  
We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature by using the following CLI commands.

- Windows
  ```azurecli
  az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
  ```

- Linux
  ```azurecli
  az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
  ```

### Update on Azure Arc-enabled servers

To perform a one-time upgrade of the agent, use the following CLI commands.

- Windows
  ```azurecli
  az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
  ```

- Linux
  ```azurecli
  az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
  ```

 We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#manage-automatic-extension-upgrade) feature by using the following PowerShell commands.

- Windows
  ```azurecli
  az connectedmachine extension update --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
  ```

- Linux
  ```azurecli
  az connectedmachine extension update --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
  ```

#### [Resource Manager template](#tab/azure-resource-manager)

N/A

---

## Use Azure Policy

Use the following policies and policy initiatives to automatically install the agent and associate it with a data collection rule every time you create a virtual machine, scale set, or Azure Arc-enabled server.

> [!NOTE]
> As per Microsoft Identity best practices, policies for installing Azure Monitor Agent on virtual machines and scale sets rely on user-assigned managed identity. This option is the more scalable and resilient managed identity for these resources.
> For Azure Arc-enabled servers, policies rely on system-assigned managed identity as the only supported option today.

### Built-in policy initiatives

Before you proceed, review [prerequisites for agent installation](azure-monitor-agent-manage.md#prerequisites).  

There are built-in policy initiatives for Windows and Linux virtual machines, scale sets that provide at-scale onboarding using Azure Monitor agents end-to-end 
- [Deploy Windows Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F0d1b56c6-6d1f-4a5d-8695-b15efbea6b49/scopes~/%5B%22%2Fsubscriptions%2Fae71ef11-a03f-4b4f-a0e6-ef144727c711%22%5D)
- [Deploy Linux Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Fbabf8e94-780b-4b4d-abaa-4830136a8725/scopes~/%5B%22%2Fsubscriptions%2Fae71ef11-a03f-4b4f-a0e6-ef144727c711%22%5D)  


These initiatives above comprise individual policies that:

- (Optional) Create and assign built-in user-assigned managed identity, per subscription, per region. [Learn more](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#policy-definition-and-details).
   - `Bring Your Own User-Assigned Identity`: If set to `true`, it creates the built-in user-assigned managed identity in the predefined resource group and assigns it to all machines that the policy is applied to. If set to `false`, you can instead use existing user-assigned identity that *you must assign* to the machines beforehand.
- Install Azure Monitor Agent extension on the machine, and configure it to use user-assigned identity as specified by the following parameters.
  - `Bring Your Own User-Assigned Managed Identity`: If set to `false`, it configures the agent to use the built-in user-assigned managed identity created by the preceding policy. If set to `true`, it configures the agent to use an existing user-assigned identity that *you must assign* to the machines in scope beforehand.
  - `User-Assigned Managed Identity Name`: If you use your own identity (selected `true`), specify the name of the identity that's assigned to the machines.
  - `User-Assigned Managed Identity Resource Group`: If you use your own identity (selected `true`), specify the resource group where the identity exists.
  - `Additional Virtual Machine Images`: Pass additional VM image names that you want to apply the policy to, if not already included.
- Create and deploy the association to link the machine to specified data collection rule.
   - `Data Collection Rule Resource Id`: The Azure Resource Manager resourceId of the rule you want to associate via this policy to all machines the policy is applied to.

   :::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-initiatives.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-initiatives.png" alt-text="Partial screenshot from the Azure Policy Definitions page that shows two built-in policy initiatives for configuring Azure Monitor Agent.":::

#### Known issues

- Managed Identity default behavior. [Learn more](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request).
- Possible race condition with using built-in user-assigned identity creation policy. [Learn more](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#known-issues).
- Assigning policy to resource groups. If the assignment scope of the policy is a resource group and not a subscription, the identity used by policy assignment (different from the user-assigned identity used by agent) must be manually granted [these roles](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#required-authorization) prior to assignment/remediation. Failing to do this step will result in *deployment failures*.
- Other [Managed Identity limitations](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#limitations).

### Built-in policies

You can choose to use the individual policies from the preceding policy initiative to perform a single action at scale. For example, if you *only* want to automatically install the agent, use the second agent installation policy from the initiative, as shown.

:::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-policy.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-policy.png" alt-text="Partial screenshot from the Azure Policy Definitions page that shows policies contained within the initiative for configuring Azure Monitor Agent.":::

### Remediation

The initiatives or policies will apply to each virtual machine as it's created. A [remediation task](../../governance/policy/how-to/remediate-resources.md) deploys the policy definitions in the initiative to existing resources, so you can configure Azure Monitor Agent for any resources that were already created.

When you create the assignment by using the Azure portal, you have the option of creating a remediation task at the same time. For information on the remediation, see [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md).

:::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" alt-text="Screenshot that shows initiative remediation for Azure Monitor Agent.":::

## Next steps

[Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
