---
title: Troubleshoot artifact application
description: Troubleshoot issues with applying artifacts on an Azure DevTest Labs virtual machine.
ms.topic: troubleshooting
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Troubleshoot issues applying artifacts on DevTest Labs virtual machines

This article guides you through possible causes and troubleshooting steps for artifact failures on Azure DevTest Labs virtual machines (VMs).

Artifacts are tools, actions, or software you can install on lab VMs during or after VM creation. Lab owners can [preselect mandatory artifacts](devtest-lab-mandatory-artifacts.md) to apply to all lab VMs at creation, and lab users can [apply artifacts to VMs](add-artifact-vm.md) that they own.

There are several possible causes for artifacts failing to install or run correctly. When an artifact appears to stop responding, first try to determine where it's stuck. Artifact installation can be blocked during the initial request, or fail during request execution.

You can troubleshoot artifact failures from the Azure portal or from the VM where the artifact failed.

## Troubleshoot artifact failures from the Azure portal

If you can't apply an artifact to a VM, first check the following items in the Azure portal:

- Make sure that the VM is running.
- Navigate to the **Artifacts** page for the lab VM to make sure the VM is ready for applying artifacts. If the Apply artifacts feature isn't available, you see a message at the top of the page.

### Use a PowerShell command

You can also use Azure PowerShell to determine whether the VM can apply artifacts. Inspect the flag `canApplyArtifacts`, which is returned when you expand on a `GET` operation. For example:

```powershell
Select-AzSubscription -SubscriptionId $SubscriptionId | Out-Null
$vm = Get-AzResource `
        -Name "$LabName/$VmName" `
        -ResourceGroupName $LabRgName `
        -ResourceType 'microsoft.devtestlab/labs/virtualmachines' `
        -ApiVersion '2018-10-15-preview' `
        -ODataQuery '$expand=Properties($expand=ComputeVm)'
$vm.Properties.canApplyArtifacts
```

### Investigate the failed artifact

An artifact can stop responding, and finally appear as **Failed**. To investigate failed artifacts:

1. On your lab **Overview** page, from the list under **My virtual machines**, select the VM that has the artifact you want to investigate.
1. On the VM **Overview** page, select **Artifacts** in the left navigation. The **Artifacts** page lists artifacts associated with the VM, and their status.

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/artifact-list.png" alt-text="Screenshot showing the list of artifacts and their status.":::

1. Select the artifact that shows a **Failed** status. The artifact opens with an extension message that includes details about the artifact failure.

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/artifact-failure.png" alt-text="Screenshot of the error message for a failed artifact.":::

### Inspect the Activity logs

To install artifacts, DevTest Labs creates and deploys an Azure Resource Manager (ARM) template that requests use of the Custom Script Extension (CSE). An error at this level shows up in the **Activity logs** for the subscription and for the VM's resource group.

If an artifact failed to install, inspect the **Activity log** entries for either **Create or Update Virtual Machine Extension**, if you applied the artifact directly, or **Create or Update Virtual Machine**, if the artifact was being applied as part of VM creation. Look for failures under these entries. Sometimes you have to expand the entry to see the failure.

Select the failed entry to see the error details. On the failure page, select **JSON** to review the contents of the JSON payload. You can see the error at the end of the JSON document.

### Investigate the private artifact repository and lab storage account

When DevTest Labs applies an artifact, it reads the artifact configuration and files from connected repositories. By default, DevTest Labs has access to the DevTest Labs [public Artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). You can also connect a lab to a private repository to access custom artifacts. If a custom artifact fails to install, make sure the personal access token (PAT) for the private repository hasn't expired. If the PAT is expired, the artifact won't be listed, and any scripts that refer to artifacts from that repository fail.

Depending on configuration, lab VMs might not have direct access to the artifact repository. DevTest Labs caches the artifacts in a lab storage account that's created when the lab first initializes. If access to this storage account is blocked, such as when traffic is blocked from the VM to the Azure Storage service, you might see an error similar to this:

```shell
CSE Error: Failed to download all specified files. Exiting. Exception: Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (403) Forbidden. ---> System.Net.WebException: The remote server returned an error: (403) Forbidden.
```

This error appears in the **Activity log** of the VM's resource group.

To troubleshoot connectivity issues to the Azure Storage account:

- Check for added network security groups (NSGs). If a subscription policy was added to automatically configure NSGs in all virtual networks, it would affect the virtual network used for creating lab VMs.

- Verify NSG rules. Use [IP flow verify](../network-watcher/diagnose-vm-network-traffic-filtering-problem.md) to determine whether an NSG rule is blocking traffic to or from a VM. You can also review effective security group rules to ensure that an inbound **Allow** NSG rule exists. For more information, see [Using effective security rules to troubleshoot VM traffic flow](../virtual-network/diagnose-network-traffic-filter-problem.md).

- Check the lab's default storage account. The default storage account is the first storage account created when the lab was created. The name usually starts with the letter "a" and ends with a multi-digit number, such as a\<labname>#.

  1. Navigate to the lab's resource group.
  1. Locate the resource of type **Storage account** whose name matches the convention.
  1. On the storage account **Overview** page, select **Networking** in the left navigation.
  1. On the **Firewalls and virtual networks** tab, ensure that **Public network access** is set to **Enabled from all networks**. Or, if the **Enabled from selected virtual networks and IP addresses** option is selected, make sure the lab's virtual networks used to create VMs are added to the list.

For in-depth troubleshooting, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

## Troubleshoot artifact failures from the lab VM

You can connect to the lab VM where the artifact failed, and investigate the issue there.

### Inspect the Custom Script Extension log file

1. On the lab VM, go to *C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\\*1.10.12\*\\Status\\*, where *\*1.10.12\** is the CSE version number.

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/status-folder.png" alt-text="Screenshot of the Status folder on the lab V M.":::

1. Open and inspect the *STATUS* file to view the error.

For instructions on finding the log files on a **Linux** VM, see [Use the Azure Custom Script Extension Version 2 with Linux virtual machines](../virtual-machines/extensions/custom-script-linux.md#troubleshooting).

### Check the VM Agent

Ensure that the [Azure Virtual Machine Agent (VM Agent)](../virtual-machines/extensions/agent-windows.md) is installed and ready.

When the VM first starts, or when the CSE first installs to serve the request to apply artifacts, the VM might need to either upgrade the VM Agent or wait for the VM Agent to initialize. The VM Agent might depend on services that take a long time to initialize. For further troubleshooting, see [Azure Virtual Machine Agent overview](../virtual-machines/extensions/agent-windows.md).

To verify if the artifact appeared to stop responding because of the VM Agent:

1. On the lab VM, navigate to *C:\\WindowsAzure\\logs*.
1. Open the file *WaAppAgent.log*.
1. Look for entries that show the VM Agent starting, finishing initialization, and the first sent heartbeat, around the time you experienced the artifact issue.

   ```text
   [00000006] [11/14/2019 05:52:13.44] [INFO]  WindowsAzureGuestAgent starting. Version 2.7.41491.949
   ...
   [00000006] [11/14/2019 05:52:31.77] [WARN]  Waiting for OOBE to Complete ...
   ...
   [00000006] [11/14/2019 06:02:30.43] [WARN]  Waiting for OOBE to Complete ...
   [00000006] [11/14/2019 06:02:33.43] [INFO]  StateExecutor initialization completed.
   [00000020] [11/14/2019 06:02:33.43] [HEART] WindowsAzureGuestAgent Heartbeat.
   ```

In the previous example, the VM Agent took 10 minutes and 20 seconds to start. The cause was the OOBE service taking a long time to start.

For general information about Azure extensions, see [Azure virtual machine extensions and features](../virtual-machines/extensions/overview.md).

### Investigate script issues

The artifact installation could fail because of the way the artifact installation script is authored. For example:

- The script has mandatory parameters but fails to pass a value, either by allowing the user to leave it blank, or because there's no default value in the *artifactfile.json* definition file. The script stops responding because it's awaiting user input.

- The script requires user input as part of execution. Scripts should work silently without requiring user intervention.

To troubleshoot whether the script is causing the artifact to appear to stop responding:

1. Copy the script to the VM, or locate it on the VM in the artifact script download location, *C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads*. 
1. Using an administrative command prompt, run the script on the VM, providing the same parameter values that caused the issue.
1. Determine if the script shows any unwanted behavior. If so, request an update, or correct the script.

> [!TIP]
> You can submit proposed script corrections for artifacts hosted in the DevTest Labs [public repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). For details, see the **Contributions** section in the [README](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/README.md) document.

> [!NOTE]
> A custom artifact needs to have the proper structure. For information about how to correctly construct an artifact, see [Create custom artifacts](devtest-lab-artifact-author.md). For an example of a properly structured artifact, see the [Test parameter types](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes) artifact.
> 
> For more information about writing and correcting artifact scripts, see [AUTHORING](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/AUTHORING.md).

## Next steps

If you need more help, try one of the following support channels:

- Contact the Azure DevTest Labs experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/).
- Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums).
- Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.
- Go to the [Azure support site](https://azure.microsoft.com/support/options) and select **Submit a support ticket** to file an Azure support incident.
