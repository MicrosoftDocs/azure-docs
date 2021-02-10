---
title:  How to migrate Azure Arc enabled servers across regions
description: Learn how to migrate an Azure Arc enabled server from one region to another.
ms.date: 02/09/2021
ms.topic: conceptual
---

# How to migrate Azure Arc enabled servers across regions

To migrate an Azure Arc enabled server from one Azure region to another, you have to delete the resource in Azure and re-create it in the other region.

Before you perform these steps, it is necessary to remove the VM extensions.

> [!NOTE]
> While installed extensions continue to run and perform their normal operation after this procedure is complete, you won't be able to manage them. If you attempt to redeploy the extensions on the machine, you may experience unpredictable behavior.

The steps below summarize the migration procedure.

1. Audit the VM extensions installed on the machine and note their configuration, using the [Azure CLI](manage-vm-extensions-cli.md#list-extensions-installed) or using [Azure PowerShell](manage-vm-extensions-powershell.md#list-extensions-installed).

2. Remove the VM extensions using PowerShell, the Azure CLI, or from the Azure portal.

    > [!NOTE]
    > If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure Policy Guest Configuration policy, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers) and after the renamed machine is registered with Arc enabled servers.

3. Disconnect the machine from Arc enabled servers using PowerShell, the Azure CLI, or from the portal.

4. Connect the machine with Arc enabled servers using the `Azcmagent` tool to register and create a new resource in Azure in the other region.

5. Deploy VM extensions previously installed on the target machine.

## Move machine to other region

> [!NOTE]
> During this operation, it results in downtime during the migration.

1. Remove VM extensions installed from the [Azure portal](manage-vm-extensions-portal.md#uninstall-extension), using the [Azure CLI](manage-vm-extensions-cli.md#remove-an-installed-extension), or using [Azure PowerShell](manage-vm-extensions-powershell.md#remove-an-installed-extension).

2. Use one of the following methods to disconnect the machine from Azure Arc. Disconnecting the machine from Arc enabled servers does not remove the Connected Machine agent, and you do not need to remove the agent as part of this process. Any VM extensions that are deployed to the machine continue to work during this process.

    # [Azure portal](#tab/azure-portal)

    1. From your browser, go to the [Azure portal](https://portal.azure.com).
    1. In the portal, browse to **Servers - Azure Arc** and select your hybrid machine from the list.
    1. From the selected registered Arc enabled server, select **Delete** from the top bar to delete the resource in Azure.

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az resource delete \
      --resource-group ExampleResourceGroup \
      --name ExampleArcMachine \
      --resource-type "Microsoft.HybridCompute/machines"
    ```

    # [Azure PowerShell](#tab/azure-powershell)

    ```powershell
    Remove-AzResource `
     -ResourceGroupName ExampleResourceGroup `
     -ResourceName ExampleArcMachine `
     -ResourceType Microsoft.HybridCompute/machines
    ```

3. Re-register the Connected Machine agent with Arc enabled servers in the other region. Run the `azcmagent` tool with the [Connect](manage-agent.md#connect) parameter complete this step.

4. Redeploy the VM extensions that were originally deployed to the machine from Arc enabled servers. If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure Policy Guest Configuration policy, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-policy.md), and much more.
