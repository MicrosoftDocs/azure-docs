---
title: Add an artifact to a VM in Azure DevTest Labs | Microsoft Docs
description: Learn how to add an artifact to a virtual machine in a lab in Azure DevTest Labs
ms.topic: article
ms.date: 06/26/2020
---

# Add an artifact to a VM
While creating a VM, you can add existing artifacts to it. These artifacts can be from either the [public DevTest Labs Git repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) or from your own Git repository. This article shows you how to add artifacts in the Azure portal, and by using Azure PowerShell. 

Azure DevTest Labs *artifacts* let you specify *actions* that are performed when the VM is provisioned, such as running Windows PowerShell scripts, running Bash commands, and installing software. Artifact *parameters* let you customize the artifact for your particular scenario.

To learn about how to create custom artifacts, see the article: [Create custom artifacts](devtest-lab-artifact-author.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Use Azure portal 
1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **All Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the lab containing the VM with which you want to work.  
1. Select **My virtual machines**.
1. Select the desired VM.
1. Select **Manage artifacts**. 
1. Select **Apply artifacts**.
1. On the **Apply artifacts** pane, select the artifact you wish to add to the VM.
1. On the **Add artifact** pane, enter the required parameter values and any optional parameters that you need.  
1. Select **Add** to add the artifact and return to the **Apply artifacts** pane.
1. Continue adding artifacts as needed for your VM.
1. Once you've added your artifacts, you can [change the order in which the artifacts are run](#change-the-order-in-which-artifacts-are-run). You can also go back to [view or modify an artifact](#view-or-modify-an-artifact).
1. When you're done adding artifacts, select **Apply**

### Change the order in which artifacts are run
By default, the actions of the artifacts are executed in the order in which they are added to the VM. 
The following steps illustrate how to change the order in which the artifacts are run.

1. At the top of the **Apply artifacts** pane, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** pane, drag and drop the artifacts into the desired order. If you have trouble dragging the artifact, make sure that you are dragging from the left side of the artifact. 
1. Select **OK** when done.  

### View or modify an artifact
The following steps illustrate how to view or modify the parameters of an artifact:

1. At the top of the **Apply artifacts** pane, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** pane, select the artifact that you want to view or edit.  
1. On the **Add artifact** pane, make any needed changes, and select **OK** to close the **Add artifact** pane.
1. Select **OK** to close the **Selected artifacts** pane.

## Use PowerShell
The following script applies the specified artifact to the specified VM. The [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) command is the one that performs the operation.  

```powershell
#Requires -Module Az.Resources

param
(
[Parameter(Mandatory=$true, HelpMessage="The ID of the subscription that contains the lab")]
   [string] $SubscriptionId,
[Parameter(Mandatory=$true, HelpMessage="The name of the lab containing the virtual machine")]
   [string] $DevTestLabName,
[Parameter(Mandatory=$true, HelpMessage="The name of the virtual machine")]
   [string] $VirtualMachineName,
[Parameter(Mandatory=$true, HelpMessage="The repository where the artifact is stored")]
   [string] $RepositoryName,
[Parameter(Mandatory=$true, HelpMessage="The artifact to apply to the virtual machine")]
   [string] $ArtifactName,
[Parameter(ValueFromRemainingArguments=$true)]
   $Params
)

# Set the appropriate subscription
Set-AzContext -SubscriptionId $SubscriptionId | Out-Null
 
# Get the lab resource group name
$resourceGroupName = (Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' | Where-Object { $_.Name -eq $DevTestLabName}).ResourceGroupName
if ($resourceGroupName -eq $null) { throw "Unable to find lab $DevTestLabName in subscription $SubscriptionId." }

# Get the internal repo name
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

# Find the virtual machine in Azure
$FullVMId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName`
                /providers/Microsoft.DevTestLab/labs/$DevTestLabName/virtualmachines/$virtualMachineName"

$virtualMachine = Get-AzResource -ResourceId $FullVMId

# Generate the artifact id
$FullArtifactId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName`
                        /providers/Microsoft.DevTestLab/labs/$DevTestLabName/artifactSources/$($repository.Name)`
                        /artifacts/$($template.Name)"

# Handle the inputted parameters to pass through
$artifactParameters = @()

# Fill artifact parameter with the additional -param_ data and strip off the -param_
$Params | ForEach-Object {
   if ($_ -match '^-param_(.*)') {
      $name = $_.TrimStart('^-param_')
   } elseif ( $name ) {
      $artifactParameters += @{ "name" = "$name"; "value" = "$_" }
      $name = $null #reset name variable
   }
}

# Create structure for the artifact data to be passed to the action

$prop = @{
artifacts = @(
    @{
        artifactId = $FullArtifactId
        parameters = $artifactParameters
    }
    )
}

# Check the VM
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
See the following articles on artifacts:

- [Specify mandatory artifacts for your lab](devtest-lab-mandatory-artifacts.md)
- [Create custom artifacts](devtest-lab-artifact-author.md)
- [Add an artifact repository to a lab](devtest-lab-artifact-author.md)
- [Diagnose artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
