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

## Prerequisites
See the following articles for prerequisites and other requirements for the Azure Monitor agent:

- [Azure Monitor agent requirements](./azure-monitor-agent-requirements.md) 
- [Azure Monitor agent network configuration](./azure-monitor-agent-network-configuration.md)

## Install

#### [Portal](#tab/azure-portal)

For information on how to install Azure Monitor Agent from the Azure portal, see [Create a data collection rule](../essentials/data-collection-rule-edit.md). This process creates the rule, associates it to the selected resources, and installs Azure Monitor Agent on them if it's not already installed.

#### [PowerShell](#tab/azure-powershell)

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the PowerShell command for adding a virtual machine extension. 

### Install on Azure virtual machines

Use the following PowerShell commands to install Azure Monitor Agent on Azure virtual machines. Choose the appropriate command based on your chosen authentication method.

#### User-assigned managed identity

- Windows
  ```powershell
  Set-AzVMExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true -SettingString '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
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
- [Template to create association with data collection rule](../essentials/data-collection-rule-create-edit.md?tabs=arm#manually-create-a-dcr)

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
  az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
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

> [!NOTE]
> The policy definitions only include the list of Windows and Linux versions that Microsoft supports. To add a custom image, use the `Additional Virtual Machine Images` parameter.

These initiatives above comprise individual policies that:

- (Optional) Create and assign built-in user-assigned managed identity, per subscription, per region. [Learn more](../../active-directory/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy.md#policy-definition-and-details).
   - `Bring Your Own User-Assigned Identity`: If set to `false`, it creates the built-in user-assigned managed identity in the predefined resource group and assigns it to all the machines that the policy is applied to. Location of the resource group can be configured in the `Built-In-Identity-RG Location` parameter.
     If set to `true`, you can instead use an existing user-assigned identity that is automatically assigned to all the machines that the policy is applied to.
- Install Azure Monitor Agent extension on the machine, and configure it to use user-assigned identity as specified by the following parameters.
  - `Bring Your Own User-Assigned Managed Identity`: If set to `false`, it configures the agent to use the built-in user-assigned managed identity created by the preceding policy. If set to `true`, it configures the agent to use an existing user-assigned identity.
  - `User-Assigned Managed Identity Name`: If you use your own identity (selected `true`), specify the name of the identity that's assigned to the machines.
  - `User-Assigned Managed Identity Resource Group`: If you use your own identity (selected `true`), specify the resource group where the identity exists.
  - `Additional Virtual Machine Images`: Pass additional VM image names that you want to apply the policy to, if not already included.
  - `Built-In-Identity-RG Location`: If you use built-in user-assigned managed identity, specify the location where the identity and the resource group should be created. This parameter is only used when `Bring Your Own User-Assigned Managed Identity` parameter is set to `false`.
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
<!-- convertborder later -->
:::image type="content" source="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" lightbox="media/azure-monitor-agent-install/built-in-ama-dcr-remediation.png" alt-text="Screenshot that shows initiative remediation for Azure Monitor Agent." border="false":::

## Frequently asked questions

This section provides answers to common questions.

### What impact does installing the Azure Arc Connected Machine agent have on my non-Azure machine?

There's no impact to the machine after the Azure Arc Connected Machine agent is installed. It hardly uses system or network resources and is designed to have a low footprint on the host where it's run.    

## Next steps

[Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
