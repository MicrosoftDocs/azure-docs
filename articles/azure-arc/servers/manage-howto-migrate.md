---
title:  How to migrate Azure Arc—enabled servers across regions
description: Learn how to migrate an Azure Arc—enabled server from one region to another.
ms.date: 07/16/2021
ms.topic: conceptual
---

# How to migrate Azure Arc—enabled servers across regions

There are scenarios in which you'd want to move your existing Azure Arc—enabled server from one region to another. For example, you realized the machine was registered in the wrong region, to improve manageability, or to move for governance reasons.

To migrate an Azure Arc—enabled server from one Azure region to another, you have to uninstall the VM extensions, delete the resource in Azure, and re-create it in the other region. Before you perform these steps, you should audit the machine to verify which VM extensions are installed.

> [!NOTE]
> While installed extensions continue to run and perform their normal operation after this procedure is complete, you won't be able to manage them. If you attempt to redeploy the extensions on the machine, you may experience unpredictable behavior.

## Move machine to other region

> [!NOTE]
> During this operation, it results in downtime during the migration.

1. Remove VM extensions installed from the [Azure portal](manage-vm-extensions-portal.md#uninstall-extensions), using the [Azure CLI](manage-vm-extensions-cli.md#remove-an-installed-extension), or using [Azure PowerShell](manage-vm-extensions-powershell.md#remove-an-installed-extension).

2. Use the **azcmagent** tool with the [Disconnect](manage-agent.md#disconnect) parameter to disconnect the machine from Azure Arc and delete the machine resource from Azure. Disconnecting the machine from Azure Arc—enabled servers does not remove the Connected Machine agent, and you do not need to remove the agent as part of this process. You can run this manually while logged on interactively, or automate using the same service principal you used to onboard multiple agents, or with a Microsoft identity platform [access token](../../active-directory/develop/access-tokens.md). If you did not use a service principal to register the machine with Azure Arc—enabled servers, see the following [article](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale) to create a service principal.

3. Re-register the Connected Machine agent with Azure Arc—enabled servers in the other region. Run the `azcmagent` tool with the [Connect](manage-agent.md#connect) parameter complete this step.

4. Redeploy the VM extensions that were originally deployed to the machine from Azure Arc—enabled servers. If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure policy, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md) policy, and much more.
