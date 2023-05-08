---
title: Troubleshoot common Azure Chaos Studio problems
description: Learn to troubleshoot common problems when using Azure Chaos Studio
author: c-ashton
ms.service: chaos-studio
ms.author: cashton
ms.topic: troubleshooting
ms.date: 11/10/2021
ms.custom: template-troubleshooting, ignite-fall-2021
---

# Troubleshoot issues with Azure Chaos Studio

As you use Chaos Studio, you may occasionally encounter some problems. This article details common problems and troubleshooting steps.

## General troubleshooting tips

The following sources are useful when troubleshooting issues with Chaos Studio:
1. **The Activity Log**: The [Azure Activity Log](../azure-monitor/essentials/activity-log.md) has a record of all create, update, and delete operations in a subscription. These records include Chaos Studio operations like enabling a target and/or capabilities, installing the agent, and creating or running an experiment. Failures in the Activity Log indicate that a user action essential to using Chaos Studio may have failed to complete. Most service-direct faults also inject faults by executing an Azure Resource Manager operation, so the Activity Log also has the record of faults that were injected during an experiment for some service-direct faults.
2. **Experiment Details**: Experiment execution details show the status and errors of an individual experiment run. Opening a specific fault in experiment details shows the resources that failed and the error messages for a failure. [Learn more about how to access experiment details](chaos-studio-run-experiment.md#view-experiment-history-and-details).
3. **Agent logs**: If using an agent-based fault, you may need to RDP or SSH in to the virtual machine to understand why the agent failed to run a fault. The instructions for accessing agent logs depend on the operating system:
    * **Chaos Windows agent**: Agent logs are in the Windows Event Log in the Application category with the source AzureChaosAgent. The agent adds fault activity and regular health check (ability to authenticate to and communicate with the Chaos Studio agent service) events to this log.
    * **Chaos Linux agent**: The Linux agent uses systemd to manage the agent process as a Linux service. To view the systemd journal for the agent (the events logged by the agent service), run the command `journalctl -u azure-chaos-agent`.
4. **VM extension status**: If using an agent-based fault, verify that the VM extension is installed and healthy. In the Azure portal, navigate to your virtual machine and go to **Extensions** or **Extensions + applications**. Click on the ChaosAgent extension and look for the following fields:
    * **Status** should show "Provisioning succeeded." Any other status indicates that the agent failed to install. Verify that you meet all [system requirements](chaos-studio-limitations.md#limitations) try reinstalling the agent.
    * **Handler status** should show "Ready." Any other status indicates that the agent installed but can't connect to the Chaos Studio service. Verify that you meet all [network requirements](chaos-studio-limitations.md#limitations) and that the user-assigned managed identity has been added to the virtual machine and try rebooting.

## Issues onboarding a resource

### Resources don't show up in the targets list in the Azure portal
If you don't see the resources you would like to enable in the Chaos Studio targets list, it may be due to any of the following issues:
* The resources aren't in [a supported region for Chaos Studio](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio).
* The resources aren't of [a supported resource type in Chaos Studio](chaos-studio-fault-providers.md).
* The resources are in a subscription or resource group that is filtered out in the filters for the target list. Change the subscription and resource group filters to see your resources.

### Target and/or capability enablement fails or doesn't show correctly in the target list
If you see an error when enabling targets and/or capabilities, try the following steps:
1. Verify that you have appropriate permissions to the resources you're onboarding. Enabling a target and/or capabilities requires Microsoft.Chaos/\* permission at the scope of the resource. Built-in roles such as Contributor have wildcard Read and Write permission, which includes permission to all Microsoft.Chaos operations.
2. Wait a few minutes for the target and capability list to update. The Azure portal uses Azure Resource Graph to gather information on target and capability onboarding and it can take up to five minutes for the update to propagate.
3. If the resource still shows "Not enabled", try the following steps:
    1. Attempt to enable the resource again.
    2. If resource enablement still fails, visit the Activity Log and find the failed target create operation to see detailed error information.
4. If the resource shows "Enabled" but onboarding capabilities failed, try the following steps:
    1. Click the **Manage actions** button on the resource in the targets list. Check any capabilities that weren't checked, and click **Save**.
    2. If capability enablement still fails, visit the Activity Log and find the failed target create operation to see detailed error information.

## Prerequisite issues

Some issues are caused by missing prerequisites. 

### Agent-based faults fail on a virtual machine
Agent-based faults may fail for various reasons related to missing prerequisites:
* On Linux VMs, the [CPU Pressure](chaos-studio-fault-library.md#cpu-pressure), [Physical Memory Pressure](chaos-studio-fault-library.md#physical-memory-pressure), [Disk I/O pressure](chaos-studio-fault-library.md#disk-io-pressure-linux), and [Arbitrary Stress-ng Stress](chaos-studio-fault-library.md#arbitrary-stress-ng-stress) faults all require the [stress-ng utility](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) to be installed on your virtual machine. For more information on how to install stress-ng, see the fault prerequisite sections.
* On either Linux or Windows VMs, the user-assigned managed identity provided during agent-based target enablement must also be added to the virtual machine.
* On either Linux or Windows VMs, the system-assigned managed identity for the experiment must be granted Reader role on the VM (seemingly elevated roles like Virtual Machine Contributor don't include the \*/Read operation that is necessary for the Chaos Studio agent service to read the microsoft-agent target proxy resource on the virtual machine).

### Chaos agent won't install on Virtual Machine Scale Sets

Installing the Chaos agent on Virtual Machine Scale Sets may fail with without showing an error if the Virtual Machine Scale Sets upgrade policy is set to **Manual**. To check the Virtual Machine Scale Sets upgrade policy:

1. Log in to Azure portal.
1. Select **Virtual Machine Scale Set**.
1. From the left pane menu, choose **Upgrade policy**.
1. Check the **Upgrade mode** to see if it's set to **Manual - Existing instances must be manually upgraded**.

If the Upgrade policy is set to **Manual**, you must upgrade your Virtual Machine Scale Sets instances so that Chaos agent installation completes.

#### Upgrade instances from Azure portal

You can upgrade your Virtual Machine Scale Sets instances from Azure portal:

1. Log in to Azure portal.
1. Select **Virtual Machine Scale Set**.
1. From the left pane menu, choose **Instances**.
1. Select all instances and click **Upgrade**.

#### Upgrade instances with the Azure CLI

You can upgrade your Virtual Machine Scale Sets instances with Azure CLI:

- From the Azure CLI, use `az vmss update-instances` to manually upgrade your instances:

    ```azurecli
    az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
    ```

For more information, see [How to bring VMs up-to-date with the latest scale set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model)

### AKS Chaos Mesh faults fail
AKS Chaos Mesh faults may fail for various reasons related to missing prerequisites:
* Chaos Mesh must first be installed on the AKS cluster before using the AKS Chaos Mesh faults. Instructions can be found in the [Chaos Mesh faults on AKS tutorial](chaos-studio-tutorial-aks-portal.md#set-up-chaos-mesh-on-your-aks-cluster).
* Chaos Mesh must be version 2.0.4 or greater. You can get the Chaos Mesh version by connecting to your AKS cluster and running `helm version chaos-mesh`.
* Chaos Mesh must be installed with the namespace `chaos-testing`. Other namespace names for Chaos Mesh aren't supported.
* The Azure Kubernetes Service Cluster Admin role must be assigned to the system-assigned managed identity for the chaos experiment.

## Issues creating or designing an experiment

### My resource doesn't show in the Target Resources list when I add a fault
When you add a fault, if you don't see the resource you want to target with a fault in the Target Resources list, it may be due to any of the following issues:
* The **Subscription** filter is set to exclude the subscription in which your target is deployed. Click on the subscription filter and modify the selected subscriptions.
* The resource hasn't been onboarded yet. Visit the **Targets** view and enable the target. After this completes, you need to close the Add Fault pane and reopen it to see an updated target list.
* The resource hasn't been enabled for the target type of that fault yet. Consult the [fault library](chaos-studio-fault-library.md) to see which target type is used for the fault, then visit the **Targets** view and enable that target type (either agent-based for microsoft-agent faults or service-direct for all other target types). After this completes, you need to close the Add Fault pane and reopen it to see an updated target list.
* The resource doesn't have the capability for that fault enabled yet. Consult the [fault library](chaos-studio-fault-library.md) to see the capability name for the fault, then visit the **Targets** view and click **Manage actions** on the target resource. Check the box for the capability that corresponds to the fault you're trying to run and click **Save**. After this completes, you need to close the Add Fault pane and reopen it to see an updated target list.
* The resource has just recently been onboarded and hasn't appeared in Azure Resource Graph yet. The Target Resources list is queried from Azure Resource Graph, and after enabling a new target it can take up to five minutes for the update to propagate to Azure Resource Graph. Wait a few minutes, then reopen the Add Fault pane.

### I get the error `The microsoft:agent provider requires a managed identity` when creating an experiment

This error happens when the agent hasn't been deployed to your virtual machine. For installation instructions, see [Create and run an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md).

### When creating an experiment, I get the error `The content media type '<null>' is not supported. Only 'application/json' is supported.`

You may encounter this error if you're creating your experiment using an ARM template or the Chaos Studio REST API. The error indicates that there's malformed JSON in your experiment definition. Check to see if you have any syntax errors, such as mismatched braces or brackets ({} and \[\]), using a JSON linter like Visual Studio Code.

## Issues running an experiment

### The execution status of my experiment after starting is "Failed"

From the **Experiments** list in the Azure portal, click on the experiment name to see the **Experiment Overview**. In the **History** section, click on **Details** next to the failed experiment run to see detailed error information.

![Experiment history](images/run-experiment-history.png)

### My agent-based fault failed with error: Verify that the target is correctly onboarded and proper read permissions are provided to the experiment msi.

This may happen if you onboarded the agent using the Azure portal, which has a known issue: Enabling an agent-based target doesn't assign the user-assigned managed identity to the virtual machine or Virtual Machine Scale Set.

To resolve this, navigate to the virtual machine or Virtual Machine Scale Set in the Azure portal, go to **Identity**, open the **User assigned** tab, and **Add** your user-assigned identity to the virtual machine. Once complete, you may need to reboot the virtual machine for the agent to connect.