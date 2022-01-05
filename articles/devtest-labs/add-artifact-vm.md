---
title: Add an artifact to a VM
description: Learn how to add an artifact to a virtual machine in a lab in Azure DevTest Labs.
ms.topic: how-to
ms.date: 01/04/2022
ms.custom: devx-track-azurepowershell
---

# Add artifacts to DevTest Labs VMs

You can add *artifacts* to Azure DevTest Labs virtual machines (VMs). DevTest Labs artifacts specify actions to take to provision a VM, such as running Windows PowerShell scripts, running Bash commands, or installing software. You can use parameters to customize the artifacts for your own needs.

DevTest Labs artifacts can come from the [public DevTest Labs Git repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) or from private Git repositories. To create your own custom artifacts and store them in a repository, see [Create custom artifacts](devtest-lab-artifact-author.md). To add your artifact repository to a lab so lab users can access the custom artifacts, see [Add an artifact repository to your lab](add-artifact-repository.md).

This article describes how to add available artifacts to VMs by using the Azure portal or Azure PowerShell.

## Add artifacts to VMs from the Azure portal

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), go to the lab that has the VM you want to add artifacts to.
1. On the lab **Overview** page, under **My virtual machines**, select the VM you want to add artifacts to.
1. On the VM page, select **Artifacts** in the top menu bar or left navigation.
1. On the **Artifacts** page, select **Apply artifacts**.
1. On the **Add artifacts** page, select the arrow next to each artifact you want to add to the VM. Artifact actions execute in the order you add them to the VM.
1. On each **Add artifact** pane, enter any required and optional parameter values, and then select **OK**.
1. When you're done adding artifacts, select **Install**.

After the artifacts install, they appear on the VM's **Artifacts** page.

<!-- After you add artifacts, you can modify them or change the order they run in.

### View or modify artifacts

To view installed artifacts, select **Artifacts** from the top menu bar on the VM's **Overview** page.

To modify an artifact, select it from the list on the **Artifacts** page. 
1. On the **Add artifact** pane, make any needed changes, and select **OK** to close the **Add artifact** pane.

### Change the order to run artifacts

By default, artifact actions execute in the order you added them to the VM. To change the order in which the artifacts are run.

1. At the top of the **Apply artifacts** pane, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** pane, drag and drop the artifacts into the desired order. If you have trouble dragging the artifact, make sure that you are dragging from the left side of the artifact. 
1. Select **OK** when done.  -->

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
      $name = $_.TrimStart('^-param_')
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

- [Specify mandatory artifacts for your lab](devtest-lab-mandatory-artifacts.md)
- [Create custom artifacts](devtest-lab-artifact-author.md)
- [Add an artifact repository to a lab](devtest-lab-artifact-author.md)
- [Diagnose artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
