---
title: Troubleshoot common Azure Chaos Studio problems
description: Learn to troubleshoot common problems when you use Azure Chaos Studio.
author: c-ashton
ms.service: chaos-studio
ms.author: cashton
ms.topic: troubleshooting
ms.date: 11/10/2021
ms.custom: template-troubleshooting, ignite-fall-2021
---

# Troubleshoot issues with Azure Chaos Studio

As you use Azure Chaos Studio, you might occasionally encounter some problems. This article explains common problems and troubleshooting steps.

## General troubleshooting tips

The following sources are useful when you troubleshoot problems with Chaos Studio:
- **Activity log**: The [Azure activity log](../azure-monitor/essentials/activity-log.md) has a record of all create, update, and delete operations in a subscription. These records include Chaos Studio operations like enabling a target or capabilities, installing the agent, and creating or running an experiment. Failures in the activity log indicate that a user action essential to using Chaos Studio might have failed to complete. Most service-direct faults also inject faults by executing an Azure Resource Manager operation, so the activity log also has the record of faults that were injected during an experiment for some service-direct faults.
- **Experiment details**: Experiment execution details show the status and errors of an individual experiment run. Opening a specific fault in experiment details shows the resources that failed and the error messages for a failure. Learn more about how to [access experiment details](chaos-studio-run-experiment.md#view-experiment-history-and-details).
- **Agent logs**: If you're using an agent-based fault, you might need to RDP or SSH in to the virtual machine (VM) to understand why the agent failed to run a fault. The instructions for accessing agent logs depend on the operating system:
    * **Chaos Windows agent**: Agent logs are in the Windows Event Log in the Application category with the source `AzureChaosAgent`. The agent adds fault activity and regular health check (ability to authenticate to and communicate with the Chaos Studio agent service) events to this log.
    * **Chaos Linux agent**: The Linux agent uses systemd to manage the agent process as a Linux service. To view the systemd journal for the agent (the events logged by the agent service), run the command `journalctl -u azure-chaos-agent`.
- **VM extension status**: If you're using an agent-based fault, verify that the VM extension is installed and healthy. In the Azure portal, go to your VM and go to **Extensions** or **Extensions + applications**. Select the `ChaosAgent` extension and look for the following fields:
    * **Status** should show *Provisioning succeeded*. Any other status indicates that the agent failed to install. Verify that you meet all [system requirements](chaos-studio-limitations.md#limitations). Try to reinstall the agent.
    * **Handler status** should show *Ready*. Any other status indicates that the agent installed but can't connect to Chaos Studio. Verify that you meet all [network requirements](chaos-studio-limitations.md#limitations) and that the user-assigned managed identity was added to the VM. Try to reboot.

## Problems when you add a resource

You might encounter the following problems when you add a resource.

### Resources don't show up in the targets list in the Azure portal
If you don't see the resources you want to enable in the Chaos Studio targets list, it might be because of any of the following problems:
* The resources aren't in [a supported region for Chaos Studio](https://azure.microsoft.com/global-infrastructure/services/?products=chaos-studio).
* The resources aren't of [a supported resource type in Chaos Studio](chaos-studio-fault-providers.md).
* The resources are in a subscription or resource group that's filtered out in the filters for the target list. Change the subscription and resource group filters to see your resources.

### Target or capability enablement fails or doesn't show correctly in the target list
If you see an error when you enable targets or capabilities, try the following steps:
1. Verify that you have appropriate permissions to the resources you're adding. Enabling a target or capabilities requires Microsoft.Chaos/\* permission at the scope of the resource. Built-in roles such as Contributor have wildcard read and write permission, which includes permission to all Microsoft.Chaos operations.
1. Wait a few minutes for the target and capability list to update. The Azure portal uses Azure Resource Graph to gather information on adding targets and capabilities. It can take up to five minutes for the update to propagate.
1. If the resource still shows *Not enabled*, try the following steps:
    1. Attempt to enable the resource again.
    2. If resource enablement still fails, go to the activity log and find the failed target create operation to see detailed error information.
1. If the resource shows *Enabled* but adding capabilities failed, try the following steps:
    1. Select **Manage actions** on the resource in the targets list. Check any capabilities that weren't checked and select **Save**.
    1. If capability enablement still fails, go to the activity log and find the failed target create operation to see detailed error information.

## Prerequisite problems

Some problems are caused by missing prerequisites.

### Agent-based faults fail on a virtual machine
Agent-based faults might fail for various reasons related to missing prerequisites:
* On Linux VMs, the [CPU Pressure](chaos-studio-fault-library.md#cpu-pressure), [Physical Memory Pressure](chaos-studio-fault-library.md#physical-memory-pressure), [Disk I/O pressure](chaos-studio-fault-library.md#disk-io-pressure-linux), and [Arbitrary Stress-ng Stress](chaos-studio-fault-library.md#arbitrary-stress-ng-stress) faults all require that the [stress-ng utility](https://wiki.ubuntu.com/Kernel/Reference/stress-ng) is installed on your VM. For more information on how to install stress-ng, see the fault prerequisite sections.
* On either Linux or Windows VMs, the user-assigned managed identity provided during agent-based target enablement must also be added to the VM.
* On either Linux or Windows VMs, the system-assigned managed identity for the experiment must be granted the Reader role on the VM. (Seemingly elevated roles like Virtual Machine Contributor don't include the \*/Read operation that's necessary for the Chaos Studio agent to read the microsoft-agent target proxy resource on the VM.)

### Chaos agent won't install on virtual machine scale sets

Installing the Chaos agent on virtual machine scale sets might fail without showing an error if the virtual machine scale set upgrade policy is set to **Manual**. To check the virtual machine scale set upgrade policy:

1. Sign in to the Azure portal.
1. Select **Virtual Machine Scale Set**.
1. On the left pane, select **Upgrade policy**.
1. Check the **Upgrade mode** to see if it's set to **Manual - Existing instances must be manually upgraded**.

If the upgrade policy is set to **Manual**, you must upgrade your Azure Virtual Machine Scale Sets instances so that the Chaos agent installation can finish.

#### Upgrade instances from the Azure portal

You can upgrade your Virtual Machine Scale Sets instances from the Azure portal:

1. Sign in to the Azure portal.
1. Select **Virtual Machine Scale Set**.
1. On the left pane, select **Instances**.
1. Select all instances and select **Upgrade**.

#### Upgrade instances with the Azure CLI

You can upgrade your Virtual Machine Scale Sets instances with the Azure CLI:

- From the Azure CLI, use `az vmss update-instances` to manually upgrade your instances:

    ```azurecli
    az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
    ```

For more information, see [Bring VMs up to date with the latest scale set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md).

### AKS Chaos Mesh faults fail
Azure Kubernetes Service (AKS) Chaos Mesh faults might fail for various reasons related to missing prerequisites:
* Chaos Mesh must first be installed on the AKS cluster before you use the AKS Chaos Mesh faults. For instructions, see the [Chaos Mesh faults on AKS tutorial](chaos-studio-tutorial-aks-portal.md#set-up-chaos-mesh-on-your-aks-cluster).
* Chaos Mesh must be version 2.0.4 or greater. You can get the Chaos Mesh version by connecting to your AKS cluster and running `helm version chaos-mesh`.
* Chaos Mesh must be installed with the namespace `chaos-testing`. Other namespace names for Chaos Mesh aren't supported.
* The AKS Cluster Admin role must be assigned to the system-assigned managed identity for the chaos experiment.

## Problems when you create or design an experiment

You might encounter problems when you create or design an experiment.

### When I add a fault, my resource doesn't show in the Target Resources list 
When you add a fault, if you don't see the resource you want to target with a fault in the **Target Resources** list, it might be because of any of the following issues:
* The **Subscription** filter is set to exclude the subscription in which your target is deployed. Select the subscription filter and modify the selected subscriptions.
* The resource hasn't been added yet. Go to the **Targets** view and enable the target. Then close the **Add Fault** pane and reopen it to see an updated target list.
* The resource hasn't been enabled for the target type of that fault yet. See the [fault library](chaos-studio-fault-library.md) to see which target type is used for the fault. Then go to the **Targets** view and enable that target type. The type is either agent-based for microsoft-agent faults or service-direct for all other target types. Then close the **Add Fault** pane and reopen it to see an updated target list.
* The resource doesn't have the capability for that fault enabled yet. See the [fault library](chaos-studio-fault-library.md) to see the capability name for the fault. Then go to the **Targets** view and select **Manage actions** on the target resource. Select the checkbox for the capability that corresponds to the fault you're trying to run and select **Save**. Then close the **Add Fault** pane and reopen it to see an updated target list.
* The resource was recently added and hasn't appeared in Resource Graph yet. The **Target Resources** list is queried from Resource Graph. After a new target is enabled, it can take up to five minutes for the update to propagate to Resource Graph. Wait a few minutes, and then reopen the **Add Fault** pane.

### When I create an experiment, I get the error "The microsoft:agent provider requires a managed identity"

This error happens when the agent hasn't been deployed to your VM. For installation instructions, see [Create and run an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md).

### When I create an experiment, I get the error "The content media type 'null' is not supported. Only 'application/json' is supported"

You might encounter this error if you're creating your experiment by using an Azure Resource Manager template or the Chaos Studio REST API. The error indicates that there's malformed JSON in your experiment definition. Check to see if you have any syntax errors, such as mismatched braces or brackets ({} and \[\]). To check, use a JSON linter like Visual Studio Code.

## Problems when you run an experiment

You might encounter problems when you run an experiment.

### The execution status of my experiment after starting is "Failed"

From the **Experiments** list in the Azure portal, select the experiment name to see the **Experiment Overview**. In the **History** section, select **Details** next to the failed experiment run to see detailed error information.

![Screenshot that shows experiment history.](images/run-experiment-history.png)

### My agent-based fault failed with the error "Verify that the target is correctly added and proper read permissions are provided to the experiment msi"

This error might happen if you added the agent by using the Azure portal, which has a known issue. Enabling an agent-based target doesn't assign the user-assigned managed identity to the VM or virtual machine scale set.

To resolve this problem, go to the VM or virtual machine scale set in the Azure portal and go to **Identity**. Open the **User assigned** tab and add your user-assigned identity to the VM. After you're finished, you might need to reboot the VM for the agent to connect.

## Problems when setting up a managed identity

### When I try to add a system-assigned/user-assigned managed identity to my existing experiment, it fails to save. 

If you are trying to add a user-assigned or system-assigned managed identity to an experiment that **already** has a managed identity assigned to it, the experiment fails to deploy. You need to delete the existing user-assigned or system-assigned managed identity on the desired experiment **first** before adding your desired managed identity. 
