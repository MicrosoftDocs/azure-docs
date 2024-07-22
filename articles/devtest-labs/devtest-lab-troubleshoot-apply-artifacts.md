---
title: Troubleshoot artifacts on lab virtual machines
titleSuffix: Azure DevTest Labs
description: Troubleshoot issues with applying artifacts on lab virtual machines in Azure DevTest Labs, including script problems, failure errors, and analyzing log data.
ms.topic: troubleshooting-general
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/11/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to analyze errors and log data about my lab artifacts in Azure DevTest Labs so I can troubleshoot and resolve issues.
---

# Troubleshoot artifacts on lab virtual machines in Azure DevTest Labs 

This article guides you through possible causes and troubleshooting steps for artifact failures on your Azure DevTest Labs virtual machine (VM) resources.

Artifacts are tools, actions, or software you can install on lab VMs during or after VM creation. Lab owners can [preselect mandatory artifacts](devtest-lab-mandatory-artifacts.md) to apply to all lab VMs at creation, and lab users can [apply artifacts to VMs](add-artifact-vm.md) that they own. Several possible issues can cause artifacts to fail to install and apply to a lab or run correctly on a lab VM.

When an artifact appears to stop responding, the first step is to try to determine why the process is stuck. Artifact installation can be blocked during the initial request or fail during request execution. You can troubleshoot artifact failures from the Azure portal or from the VM where the artifact failure occurs.

## Troubleshoot in the Azure portal

If an artifact isn't successfully applying to your lab VM, you can start by investigating the status of your VM in the Azure portal. You can find information about the state of the VM, confirm it's running, and verify artifacts can be applied. The Activity log data for the lab VM shows entries about installation processes. You can check the entries to find information about artifact failures. 

### Check VM status

Check the VM state in the Azure portal by following these steps:

1. Browse to the **Overview** page for the DevTest Labs lab VM and confirm the machine is _Running_:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/check-lab-machine.png" border="false" alt-text="Screenshot that shows how to confirm the DevTest Labs virtual machine is running." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/check-lab-machine-large.png":::

1. Select **Artifacts** and open the artifacts list for the lab VM:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/open-artifacts-list.png" alt-text="Screenshot that shows how to open the Artifacts list for the lab virtual machine.":::

1. Check the **Apply artifacts** option and confirm the lab VM is ready to accept applied artifacts:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/check-apply-artifacts.png" alt-text="Screenshot that shows how to confirm artifacts can be applied to the DevTest Labs virtual machine.":::

   When the **Apply artifacts** option is grayed, you can't apply artifacts to the lab VM and you see a notification message on the page:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/apply-artifacts-grayed.png" alt-text="Screenshot of the message that shows artifacts can't be applied to the DevTest Labs virtual machine.":::

#### Use PowerShell command

You can also use Azure PowerShell to check if your lab VM can receive applied artifacts.

The following `GET` command returns the `canApplyArtifacts` flag with a value of True or False. To run the command, replace the `$LabName/$VmName` parameter with your lab name and VM name, and specify your lab resource group in the `$LabRgName` parameter.

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

### Investigate failed artifact details

An artifact can stop responding and eventually show as _Failed_ in the artifacts list for the lab VM.

Investigate failed artifacts by following these steps:

1. Browse to the **Artifacts** list page for the lab VM, and select the artifact with the _Failed_ status:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact.png" alt-text="Screenshot that shows how to locate and select the failed artifact for the lab virtual machine.":::

1. The **Artifact** details view opens. The details include the **Deployment Message** and **Extension Message** information about the artifact failure:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact-details.png" alt-text="Screenshot of the details for the failed artifact, including deployment and extension message information." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact-details-large.png":::

### Inspect Activity logs

To install artifacts, DevTest Labs creates and deploys an Azure Resource Manager (ARM) template that requests use of the Custom Script Extension (CSE). An error at this level shows up in the Activity logs for the subscription and for the resource group that contains the lab VM.

> [!NOTE]
> When you view the Activity logs, you might need to expand the installation process entries to see the failure error summaries.

Inspect the Activity log entries for failures related to installation or application of the artifact on the lab VM with these steps:

1. Browse to the **Activity log** page for the lab VM and locate the artifact with the _Failed_ status:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/select-failed-artifact-entry.png" alt-text="Screenshot that shows how to locate the Activity log entry for a failed artifact on the lab VM." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/select-failed-artifact-entry-large.png":::

1. Select the entry to open the details pane and view the log information:

   - If you're attempting to apply the artifact directly to your lab VM, look for failure errors related to the **Create or Update Virtual Machine Extension** installation process. 

   - If you're creating a VM and applying the artifact during the process, look for failure errors reported for the **Create or Update Virtual Machine** installation process.

   The pane title corresponds to the entry title, such as **Apply artifacts to virtual machine**:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact-entry-details.png" alt-text="Screenshot that shows how to view details for the Activity log entry for a failed artifact.":::

1. On the details pane, select **JSON** to review the contents of the JSON payload. You can see the error at the end of the JSON document:

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact-entry-json.png" alt-text="Screenshot that shows how to view the JSON details for the Activity log entry for a failed artifact." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/failed-artifact-entry-json-large.png":::

### Investigate artifact repository and lab storage account

When DevTest Labs applies an artifact, it reads the artifact configuration and files from connected repositories. If an artifact fails to install or apply to your lab VM, the issue might be related to repository access.

By default, DevTest Labs has access to the DevTest Labs [public Artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). You can also connect a lab to a private repository to access custom artifacts. Depending on the configuration, lab VMs might not have direct access to the artifact repository. DevTest Labs caches the artifacts in a lab storage account created when the lab first initializes.

- If a custom artifact fails to install, make sure the personal access token (PAT) for the private repository isn't expired. If the PAT is expired, the artifact isn't listed, and any scripts that refer to artifacts from that repository fail.

- If access to the storage account is blocked, you might see an error similar to this example:

   ```console
   CSE Error: Failed to download all specified files. Exiting. Exception: Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (403) Forbidden. ---> System.Net.WebException: The remote server returned an error: (403) Forbidden.
   ```

   A scenario where you might encounter this error is when traffic is blocked from the VM to the Azure Storage service. The error appears in the Activity log of the resource group for the lab VM.

Identify repository connection issues to the Azure Storage account with these steps:

1. Check for added network security groups (NSGs). If a subscription policy is added to automatically configure NSGs in all virtual networks, it can affect the virtual network used for creating your lab VMs.

1. Verify all NSG rules:

   - Use [IP flow verify](../network-watcher/diagnose-vm-network-traffic-filtering-problem.md) to determine whether an NSG rule is blocking traffic to or from a VM.
   
   - Review effective security group rules to ensure an inbound **Allow** NSG rule exists. For more information, see [Using effective security rules to troubleshoot VM traffic flow](../virtual-network/diagnose-network-traffic-filter-problem.md).

1. Check the default storage account for your lab.

   The default storage account is the first storage account created during lab creation. The name usually starts with the letter "a" and ends with a multi-digit number, such as `a<labname>#`.

   1. Browse to the **Overview** page for the DevTest Labs lab VM, and select **Resource visualizer**.

   1. In the diagram, locate the **Storage account** that has a name that matches the described naming convention, `a<labname>#`.

   1. Select the **Storage account** resource to see the popup menu, and then select **View**:

      :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/select-storage-account.png" alt-text="Screenshot that shows how to select the View option for the storage account for a DevTest Labs lab resource." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/select-storage-account-large.png":::

   1. On the storage account **Overview** page, expand the **Security + networking** section on the left menu, and select **Networking**:

      :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/storage-account-networking.png" alt-text="Screenshot that shows how to view the Networking configuration for the storage account for a DevTest Labs lab resource." lightbox="media/devtest-lab-troubleshoot-apply-artifacts/storage-account-networking-large.png":::

   1. On the **Firewalls and virtual networks** tab, check the configuration for the **Public network access** option:
   
      1. If **Enabled from selected virtual networks and IP addresses** is selected, confirm the list of allowed IP addresses shows the lab's virtual networks that can be used to create lab VMs:

         :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/enable-networks-addresses.png" alt-text="Screenshot that shows the Enabled from selected virtual networks and IP addresses selection for the lab resource storage account.":::

      1. Otherwise, confirm **Enabled from all networks** is selected:

         :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/enable-all-networks.png" alt-text="Screenshot that shows the Enabled from all networks selection for the lab resource storage account.":::

For in-depth troubleshooting, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

## Troubleshoot on the lab machine

You can connect to the lab VM where the artifact failed and investigate the issue.

### Inspect Custom Script Extension log file

View the Custom Script Extension (CSE) log file for a Windows VM by following these steps:

1. Connect to your running DevTest Labs lab VM.

1. Open a **File Explorer** window and go to _C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\\<CSE version>\\Status\\_. An example _\<CSE version>_ is `1.10.12`.

   :::image type="content" source="media/devtest-lab-troubleshoot-apply-artifacts/status-folder.png" alt-text="Screenshot that shows the contents of the Status folder on a Windows virtual machine for DevTest Labs.":::

1. Open and inspect a _STATUS_ file to view the error, such as _1.status_.

For instructions on finding the log files on a **Linux** VM, see [Use the Azure Custom Script Extension Version 2 with Linux virtual machines](../virtual-machines/extensions/custom-script-linux.md#troubleshooting).

### Check Azure Virtual Machine Agent

Ensure the [Azure Virtual Machine Agent (VM Agent)](../virtual-machines/extensions/agent-windows.md) for your lab VM is installed and ready.

When your lab VM first starts, or when the CSE first installs to serve the request to apply artifacts, the lab VM might need to upgrade the VM Agent or wait for the VM Agent to initialize. The VM Agent might depend on services that take a long time to initialize. 

Determine whether the VM Agent is causing the artifact to stop responding by following these steps:

1. Connect to your running DevTest Labs lab VM.

1. Open a **File Explorer** window, and go to the folder that has the log files for your lab VM, such as _C:\\WindowsAzure\\logs_.

1. Open the _WaAppAgent.log_ file.

1. In the log file, look for entries that show the VM Agent starting, finishing initialization, and sending the first heartbeat. Scan entries for time stamps around the time you experienced the artifact issue. The following snippet shows some example entries from the log file:

   ```console
   [00000006] [11/14/2019 05:52:13.44] [INFO]  WindowsAzureGuestAgent starting. Version 2.7.41491.949
   ...
   [00000006] [11/14/2019 05:52:31.77] [WARN]  Waiting for OOBE to Complete ...
   ...
   [00000006] [11/14/2019 06:02:30.43] [WARN]  Waiting for OOBE to Complete ...
   [00000006] [11/14/2019 06:02:33.43] [INFO]  StateExecutor initialization completed.
   [00000020] [11/14/2019 06:02:33.43] [HEART] WindowsAzureGuestAgent Heartbeat.
   ```

   In this example, the VM Agent took 10 minutes and 20 seconds to start. The delay is because the out-of-box-experience (OOBE) service took a long time to start. The long start time for the VM Agent caused the artifact to stop responding.

For general information about Azure extensions, see [Azure virtual machine extensions and features](../virtual-machines/extensions/overview.md). For more troubleshooting ideas, see [Azure Virtual Machine Agent overview](../virtual-machines/extensions/agent-windows.md).

### Investigate script issues

Another reason the artifact installation might fail is due to the way the artifact installation script is authored.

Here are some examples of potential script issues:

- **The script has mandatory parameters, but an expected value isn't passed during script execution.** This scenario can happen if the user is allowed to leave an expected parameter blank and a default value isn't specified in the _artifactfile.json_ definition file. As a result, the script stops responding because it's waiting for user input. When the script requires parameter values, it's a good practice to define defaults and require the user to enter a value.

- **The script requires user action during script execution.** This scenario can happen if there's a long delay in script execution while waiting for the user to take action. It's a good practice to author scripts that can work silently without requiring user intervention.

Determine whether the script is causing the artifact to stop responding by following these steps:

1. Connect to your running DevTest Labs lab VM.

1. Open a **File Explorer** window.

1. Go to the **Download** folder that has the artifact installation script for your VM, such as _C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\\<CSE version>\\Downloads\\_. An example _\<CSE version>_ is `1.10.12`.

   For the subsequent steps, you can work with the script in this folder, or copy the script to a working folder on your VM.

1. Open a Command Prompt window with administrative privileges on your VM.

1. Run the artifact installation script in the Command Prompt window.

   Follow the script prompts and enter the required parameter values. To investigate whether lack of user input or delayed user action causes an issue, try to reproduce the specific behavior.

1. Determine if the script demonstrates unexpected or problematic behavior.

1. As needed, correct the script on your lab VM, and run the script again to confirm the issues are resolved.

#### Check artifact structure

A custom artifact needs to have the proper structure. Be sure to confirm that custom artifacts in the artifact installation script implement the correct structure. The following resources provide information to help you complete this check:

- For information about how to correctly construct an artifact, see [Create custom artifacts](devtest-lab-artifact-author.md).
- For an example of a properly structured artifact, see the [Test parameter types](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes) artifact.
- For more information about writing and correcting artifact scripts, see [AUTHORING](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/AUTHORING.md).

#### Request script update

You can submit proposed script corrections for artifacts hosted in the DevTest Labs [public repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts). For details, see the **Contributions** section in the [README](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/README.md) document.

## Get support

If you need more help, try one of the following support channels:

- Search the [Microsoft Community](https://azure.microsoft.com/support/community/) website resources for information about Azure DevTest Labs and access posts on Stack Overflow.

- Connect with [@AzureSupport](https://x.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

## Related content

- [Troubleshoot virtual machine deployment failures in Azure DevTest Labs](troubleshoot-vm-deployment-failures.md)
- [Test parameter types artifact](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes)
