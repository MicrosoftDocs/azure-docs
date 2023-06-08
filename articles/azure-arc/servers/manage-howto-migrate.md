---
title:  How to migrate Azure Arc-enabled servers across regions
description: Learn how to migrate an Azure Arc-enabled server from one region to another.
ms.date: 3/29/2022
ms.topic: conceptual
---

# How to migrate Azure Arc-enabled servers across regions

There are scenarios in which you'll want to move your existing Azure Arc-enabled server from one region to another. For example, you might want to move regions to improve manageability, for governance reasons, or because you realized the machine was originally registered in the wrong region.

To migrate an Azure Arc-enabled server from one Azure region to another, you have to uninstall the VM extensions, delete the resource in Azure, and re-create it in the other region. Before you perform these steps, you should audit the machine to verify which VM extensions are installed.

> [!NOTE]
> While installed extensions continue to run and perform their normal operation after this procedure is complete, you won't be able to manage them. If you attempt to redeploy the extensions on the machine, you may experience unpredictable behavior.

## Move machine to other region

> [!NOTE]
> Performing this operation will result in downtime during the migration.

1. Remove any VM extensions that are installed on the machine. You can do this by using the [Azure portal](manage-vm-extensions-portal.md#remove-extensions), [Azure CLI](manage-vm-extensions-cli.md#remove-extensions), or [Azure PowerShell](manage-vm-extensions-powershell.md#remove-extensions).

2. Use the **azcmagent** tool with the [Disconnect](azcmagent-disconnect.md) parameter to disconnect the machine from Azure Arc and delete the machine resource from Azure. You can run this manually while logged on interactively, with a Microsoft identity platform [access token](../../active-directory/develop/access-tokens.md), or with the service principal you used for onboarding (or with a [new service principal that you create](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale)).

    Disconnecting the machine from Azure Arc-enabled servers does not remove the Connected Machine agent, and you don't need to remove the agent as part of this process.

3. Run the `azcmagent` tool with the [Connect](azcmagent-connect.md) parameter to re-register the Connected Machine agent with Azure Arc-enabled servers in the other region.

4. Redeploy the VM extensions that were originally deployed to the machine from Azure Arc-enabled servers.

    If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure Policy definition, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md) policy, and much more.
