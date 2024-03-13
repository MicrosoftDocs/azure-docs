---
title: Add an artifact to a VM
description: Learn how to add an artifact to a virtual machine in a lab in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: devx-track-azurepowershell, UpdateFrequency2
---

# Add artifacts to DevTest Labs VMs

This article describes how to add *artifacts* to Azure DevTest Labs virtual machines (VMs). Artifacts specify actions to take to provision a VM, such as running Windows PowerShell scripts, running Bash commands, or installing software. You can use parameters to customize the artifacts for your own needs.

DevTest Labs artifacts can come from the [public DevTest Labs Git repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) or from private Git repositories. To create your own custom artifacts and store them in a repository, see [Create custom artifacts](devtest-lab-artifact-author.md). To add your artifact repository to a lab so lab users can access the custom artifacts, see [Add an artifact repository to your lab](add-artifact-repository.md).

DevTest Labs lab owners can specify mandatory artifacts to be installed on all lab VMs at creation. For more information, see [Specify mandatory artifacts for DevTest Labs VMs](devtest-lab-mandatory-artifacts.md).

You can't change or remove mandatory artifacts at VM creation time, but you can add any available individual artifacts. This article describes how to add available artifacts to VMs by using the Azure portal or Azure PowerShell.

## Add artifacts to VMs from the Azure portal

You can add artifacts during VM creation, or add artifacts to existing lab VMs.

To add artifacts during VM creation:

1. On the lab's home page, select **Add**.
1. On the **Choose a base** page, select the type of VM you want.
1. On the **Create lab resource** screen, select **Add or Remove Artifacts**.
1. On the **Add artifacts** page, select the arrow next to each artifact you want to add to the VM.
1. On each **Add artifact** pane, enter any required and optional parameter values, and then select **OK**. The artifact appears under **Selected artifacts**, and the number of configured artifacts updates.

   :::image type="content" source="./media/add-artifact-vm/devtestlab-add-artifacts-blade-selected-artifacts.png" alt-text="Screenshot that shows adding artifacts on the Add artifacts pane.":::

1. You can change the artifacts after adding them.

   - By default, artifacts install in the order you add them. To rearrange the order, select the ellipsis **...** next to the artifact in the **Selected artifacts** list, and select **Move up**, **Move down**, **Move to top**, or **Move to bottom**.
   - To edit the artifact's parameters, select **Edit** to reopen the **Add artifact** pane.
   - To delete the artifact from the **Selected artifacts** list, select **Delete**.

1. When you're done adding and arranging artifacts, select **OK**.
1. The **Create lab resource** screen shows the number of artifacts added. To add, edit, rearrange, or delete the artifacts before you create the VM, select **Add or Remove Artifacts** again.

After you create the VM, the installed artifacts appear on the VM's **Artifacts** page. To see details about each artifact's installation, select the artifact name.

To install artifacts on an existing VM:

1. From the lab's home page, select the VM from the **My virtual machines** list.
1. On the VM page, select **Artifacts** in the top menu bar or left navigation.
1. On the **Artifacts** page, select **Apply artifacts**.

   :::image type="content" source="./media/add-artifact-vm/artifacts.png" alt-text="Screenshot that shows Artifacts pane for an existing V M.":::

1. On the **Add artifacts** page, select and configure artifacts the same as for a new VM.
1. When you're done adding artifacts, select **Install**. The artifacts install on the VM immediately.

## Add artifacts to VMs by using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following PowerShell script applies an artifact to a VM by using the [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) cmdlet.

```powershell
#Requires -Module Az.Resources

param
(
[Parameter(Mandatory=$true, HelpMessage="The ID of the subscription that contains the lab")]
   [string] $SubscriptionId,
[Parameter(Mandatory=$true, HelpMessage="The name of the lab that has the VM")]
   [string] $DevTestLabName,
[Parameter(Mandatory=$true, HelpMessage="The name of the VM")]
   [string] $VirtualMachineName,
[Parameter(Mandatory=$true, HelpMessage="The repository where the artifact is stored")]
   [string] $RepositoryName,
[Parameter(Mandatory=$true, HelpMessage="The artifact to apply to the VM")]
   [string] $ArtifactName,
[Parameter(ValueFromRemainingArguments=$true)]
   $Params
)

# Set the appropriate subscription
Set-AzContext -SubscriptionId $SubscriptionId | Out-Null
 
# Get the lab resource group name
$resourceGroupName = (Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' | Where-Object { $_.Name -eq $DevTestLabName}).ResourceGroupName
if ($resourceGroupName -eq $null) { throw "Unable to find lab $DevTestLabName in subscription $SubscriptionId." }

# Get the internal repository name
$repository = Get-AzResource -ResourceGroupName $resourceGroupName `
                    -ResourceType 'Microsoft.DevTestLab/labs/artifactsources' `
                    -ResourceName $DevTestLabName `
                    -ApiVersion 2016-05-15 `
                    | Where-Object { $RepositoryName -in ($_.Name, $_.Properties.displayName) } `
                    | Select-Object -First 1

if ($repository -eq $null) { "Unable to find repository $RepositoryName in lab $DevTestLabName." }

# Get the internal artifact name
$template = Get-AzResource -ResourceGroupName $resourceGroupName `
                -ResourceType "Microsoft.DevTestLab/labs/artifactSources/artifacts" `
                -ResourceName "$DevTestLabName/$($repository.Name)" `
                -ApiVersion 2016-05-15 `
                | Where-Object { $ArtifactName -in ($_.Name, $_.Properties.title) } `
                | Select-Object -First 1

if ($template -eq $null) { throw "Unable to find template $ArtifactName in lab $DevTestLabName." }

# Find the VM in Azure
$FullVMId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName`
                /providers/Microsoft.DevTestLab/labs/$DevTestLabName/virtualmachines/$virtualMachineName"

$virtualMachine = Get-AzResource -ResourceId $FullVMId

# Generate the artifact id
$FullArtifactId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName`
                        /providers/Microsoft.DevTestLab/labs/$DevTestLabName/artifactSources/$($repository.Name)`
                        /artifacts/$($template.Name)"

# Handle the input parameters to pass through
$artifactParameters = @()

# Fill the artifact parameter with the additional -param_ data and strip off the -param_
$Params | ForEach-Object {
   if ($_ -match '^-param_(.*)') {
      $name = $_ -replace '^-param_'
   } elseif ( $name ) {
      $artifactParameters += @{ "name" = "$name"; "value" = "$_" }
      $name = $null #reset name variable
   }
}

# Create a structure to pass the artifact data to the action

$prop = @{
artifacts = @(
    @{
        artifactId = $FullArtifactId
        parameters = $artifactParameters
    }
    )
}

# Apply the artifact
if ($virtualMachine -ne $null) {
   # Apply the artifact by name to the virtual machine
   $status = Invoke-AzResourceAction -Parameters $prop -ResourceId $virtualMachine.ResourceId -Action "applyArtifacts" -ApiVersion 2016-05-15 -Force
   if ($status.Status -eq 'Succeeded') {
      Write-Output "##[section] Successfully applied artifact: $ArtifactName to $VirtualMachineName"
   } else {
      Write-Error "##[error]Failed to apply artifact: $ArtifactName to $VirtualMachineName"
   }
} else {
   Write-Error "##[error]$VirtualMachine was not found in the DevTest Lab, unable to apply the artifact"
}

```

## Next steps

- [Specify mandatory artifacts](devtest-lab-mandatory-artifacts.md)
- [Create custom artifacts](devtest-lab-artifact-author.md)
- [Add an artifact repository to a lab](devtest-lab-artifact-author.md)
- [Diagnose artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
