---
title: Troubleshoot issues with artifacts in Azure DevTest Labs | Microsoft Docs
description: Learn how to troubleshoot issues that occur when applying artifacts in an Azure DevTest Labs virtual machine. 
ms.topic: article
ms.date: 06/26/2020
---

# Troubleshoot issues when applying artifacts in an Azure DevTest Labs virtual machine
Applying artifacts on a virtual machine can fail for various reasons. This article guides you through some of the methods  to help identify possible causes.

If you need more help at any point in this article, you can contact the Azure DevTest Labs (DTL) experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get Support.   

> [!NOTE]
> This article applies to both Windows and non-Windows virtual machines. While there are some differences, they will be called out explicitly in this article.

## Quick troubleshooting steps
Check that the VM is running. DevTest Labs requires the VM to be running and that the [Microsoft Azure Virtual Machine Agent (VM Agent)](../virtual-machines/extensions/agent-windows.md) is installed and ready.

> [!TIP]
> In the **Azure portal**, navigate to the **Manage artifacts** page for the VM to see if the VM is ready for applying artifacts. You see a message at the very top of that page. 
> 
> Using **Azure PowerShell**, inspect the flag **canApplyArtifacts**, which is returned only when you expand on a GET operation. See the following example command:

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

## Ways to troubleshoot 
You can troubleshoot VMs created using DevTest Labs and the Resource Manager deployment model by using one of the following methods:

- **Azure portal** - great if you need to quickly get a visual hint of what may be causing the issue.
- **Azure PowerShell** - if you're comfortable with a PowerShell prompt, quickly query DevTest Labs resources using the Azure PowerShell cmdlets.

> [!TIP]
> For more information on how to review artifact execution within a VM, see [Diagnose artifact failures in the lab](devtest-lab-troubleshoot-artifact-failure.md).

## Symptoms, causes, and potential resolutions 

### Artifact appears to stop responding

An artifact appears to stop responding until a pre-defined timeout period expires, and the artifact is marked as **Failed**.

When an artifact appears to hang, first determine where it's stuck. An artifact can be blocked at any of the following steps during execution:

- **During the initial request**. DevTest Labs creates an Azure Resource Manager template to request the use of the Custom Script Extension (CSE). Therefore, behind the scenes, a resource group deployment is triggered. When an error at this level happens, you get details in the **Activity Logs** of the resource group for the VM in question.  
    - You can access the activity log from the lab VM page navigation bar. When you select it, you see an entry for either **applying artifacts to virtual machine** (if the apply artifacts operation was triggered directly) or **Add or modify virtual machines** (if the applying artifacts operation was part of the VM creation process).
    - Look for errors under these entries. Sometimes, the error won't be tagged accordingly, and you'll have to investigate each entry.
    - When investigating the details of each entry, make sure to review the contents of the JSON payload. You may see an error at the bottom of that document.
- **When trying to execute the artifact**. It could be because of networking or storage issues. See the respective section later in this article for details. It can also happen because of the way the script is authored. For example:
    - A PowerShell script has **mandatory parameters**, but one fails to pass a value to it, either because you allow the user to leave it blank, or because you don’t have a default value for the property in the artifactfile.json definition file. The script will stop responding because it's awaiting user input.
    - A PowerShell script **requires user input** as part of execution. Scripts must be written to work silently without requiring any user intervention.
- **VM Agent takes long to be ready**. When the VM is first started, or when the custom script extension is first installed to serve the request to apply artifacts, the VM may require either upgrading the VM Agent or wait for the VM Agent to initialize. There may be services on which the VM Agent depends that are taking a long time to initialize. In such cases, see [Azure Virtual Machine Agent overview](../virtual-machines/extensions/agent-windows.md) for further troubleshooting.

### To verify if the artifact appears to stop responding because of the script

1. Log in to the virtual machine in question.
2. Copy the script locally in the virtual machine or locate it on the virtual machine under `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\<version>`. It's the location where the artifact scripts are downloaded.
3. Using an elevated command prompt, execute the script locally, providing the same parameter values used to cause the issue.
4. Determine if the script suffers from any unwanted behavior. If so, either request an update to the artifact (if it is from the public repo); or, make the corrections yourself (if it is from your private repo).

> [!TIP]
> You can correct issues with artifacts hosted in our [public repo](https://github.com/Azure/azure-devtestlab) and submit the changes for our review and approval. See the **Contributions** section in the [README.md](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/README.md) document.
> 
> For information about writing your own artifacts, see [AUTHORING.md](https://github.com/Azure/azure-devtestlab/blob/master/Artifacts/AUTHORING.md) document.

### To verify if the artifact appears to stop responding because of the VM Agent:
1. Log in to the virtual machine in question.
2. Using File Explorer navigate to **C:\WindowsAzure\logs**.
3. Locate and open file **WaAppAgent.log**.
4. Look for entries that show when the VM Agent starts and when it is finishing initialization (that is, the first heartbeat is sent). Favor newer entries or specifically the ones around the time period for which you experience the issue.

    ```
    [00000006] [11/14/2019 05:52:13.44] [INFO]  WindowsAzureGuestAgent starting. Version 2.7.41491.949
    ...
    [00000006] [11/14/2019 05:52:31.77] [WARN]  Waiting for OOBE to Complete ...
    ...
    [00000006] [11/14/2019 06:02:30.43] [WARN]  Waiting for OOBE to Complete ...
    [00000006] [11/14/2019 06:02:33.43] [INFO]  StateExecutor initialization completed.
    [00000020] [11/14/2019 06:02:33.43] [HEART] WindowsAzureGuestAgent Heartbeat.
    ```
    In this example, you can see that the VM Agent start time took 10 minutes and 20 seconds because a heartbeat was sent. The cause in this case was the OOBE service taking a long time to start.

> [!TIP]
> For general information about Azure extensions, see [Azure virtual machine extensions and features](../virtual-machines/extensions/overview.md).

## Storage errors
DevTest Labs requires access to the lab’s storage account that is created to cache artifacts. When DevTest Labs applies an artifact, it will read the artifact configuration and its files from the configured repositories. By default, DevTest Labs configures access to the **public artifact repo**.

Depending on how a VM is configured, it may not have direct access to this repo. Therefore, by design, DevTest Labs caches the artifacts in a storage account that's created when the lab is first initialized.

If access to this storage account is blocked in any way, as when traffic is blocked from the VM to the Azure Storage service, you may see an error similar to the following one:

```shell
CSE Error: Failed to download all specified files. Exiting. Exception: Microsoft.WindowsAzure.Storage.StorageException: The remote server returned an error: (403) Forbidden. ---> System.Net.WebException: The remote server returned an error: (403) Forbidden.
```

The above error would appear in the **Deployment Message** section in the **Artifact results** page under **Manage artifacts**. It will also appear in the **Activity Logs** under the resource group of the virtual machine in question.

### To ensure communication to the Azure Storage service isn't being blocked:

- **Check for added network security groups (NSG)**. It may be that a subscription policy was added where NSGs are automatically configured in all virtual networks. It would also affect the lab’s default virtual network, if used, or other virtual network configured in your lab, used for the creation of VMs.
- **Check the default lab’s storage account** (that is, the first storage account created when the lab was created, whose name usually starts with the letter “a” and ends with a multi-digit number that is, a\<labname\>#).
    1. Navigate to the lab’s resource group.
    2. Locate the resource of type **storage account**, whose name matches the convention.
    3. Navigate to the storage account page called **Firewalls and virtual networks**.
    4. Ensure that it's set to **All networks**. If the **Selected networks** option is selected, then ensure that the lab’s virtual networks used to create VMs are added to the list.

For more in-depth troubleshooting, see [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

> [!TIP]
> **Verify network security group rules**. Use [IP flow verify](../network-watcher/diagnose-vm-network-traffic-filtering-problem.md#use-ip-flow-verify) to confirm that a rule in a network security group is blocking traffic to or from a virtual machine. You can also review effective security group rules to ensure inbound **Allow** NSG rule exists. For more information, see [Using effective security rules to troubleshoot VM traffic flow](../virtual-network/diagnose-network-traffic-filter-problem.md).

## Other sources of error
There are other less frequent possible sources of error. Make sure to evaluate each to see if it applies to your case. Here is one of them: 

- **Expired personal access token for the private repo**. When expired, the artifact won’t get listed and any scripts that refer to artifacts from a repository with an expired private access token will fail accordingly.

## Next steps
If none of these errors occurred and you still can’t apply artifacts, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
