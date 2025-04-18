---
title: Add artifacts to VMs
description: Learn how to add or configure artifacts on lab virtual machines (VM) in Azure DevTest Labs by using the Azure portal or Azure PowerShell.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/26/2025
ms.custom: devx-track-azurepowershell, UpdateFrequency2

#customer intent: As a lab user, I want to add artifacts to my VMs so I can use them to run scripts or commands, install tools or applications, or take other actions on my VMs.
---

# Add artifacts to DevTest Labs VMs

This article describes how to add *artifacts* to Azure DevTest Labs virtual machines (VMs) by using the Azure portal or Azure PowerShell. Artifacts are tools, actions, or software you can add to lab VMs. For example, artifacts can run Windows PowerShell scripts or Bash commands, install tools or applications, or take other actions like joining a domain.

DevTest Labs artifacts can come from the [public DevTest Labs Git repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) or from private Git repositories. Lab users can [create their own custom artifacts](devtest-lab-artifact-author.md) and store them in a repository, and use parameters to customize existing artifacts for their own needs.

A lab administrator can [add artifact repositories to a lab](add-artifact-repository.md) so all lab users can access them. Lab administrators can also [specify mandatory artifacts to be installed on all lab VMs](devtest-lab-mandatory-artifacts.md) at creation. Lab users can't change or remove mandatory artifacts at VM creation time, but they can add and configure other available artifacts at or after VM creation time.

## Prerequisites

# [Azure portal](#tab/portal)

- User access to a lab in DevTest Labs.

# [Azure PowerShell](#tab/PowerShell)

- User access to a lab in DevTest Labs.
- Azure PowerShell. You can either:
  - [Use Azure Cloud Shell](/azure/cloud-shell/quickstart). Be sure to select the **PowerShell** environment.
  - [Install Azure PowerShell](/powershell/azure/install-azure-powershell) to use on a physical or virtual machine. If necessary, run `Update-Module -Name Az` to update your installation.

---

## Add artifacts to VMs

# [Azure portal](#tab/portal)
<a name="add-artifacts-to-vms-from-the-azure-portal"></a>
You can use the Azure portal to add artifacts during VM creation or to add artifacts to an existing lab VM.

### Add artifacts during VM creation

1. On the lab's home page, select **Add**.
1. On the **Choose a base** page, select the type of VM you want.
1. On the **Create lab resource** screen, fill out the **Basic Settings** tab according to the instructions at [Create lab VMs in Azure DevTest Labs](devtest-lab-add-vm.md).
1. At the bottom of the **Basic Settings** tab, select **Add or Remove Artifacts**.
1. On the **Add artifacts** page, select the arrow next to each artifact you want to add to the VM.
1. On each **Add artifact** pane, enter any required and optional parameter values, and then select **OK**. The artifact appears under **Selected artifacts** on the **Add artifacts** page, and the number of configured artifacts updates.

   :::image type="content" source="./media/add-artifact-vm/devtestlab-add-artifacts-blade-selected-artifacts.png" alt-text="Screenshot that shows adding artifacts.":::

1. By default, artifacts install in the order you add them. To rearrange the order, select the ellipsis **...** next to the artifact in the **Selected artifacts** list, and select **Move up**, **Move down**, **Move to top**, or **Move to bottom**.

   - To edit an artifact's parameters after you add it, select the pencil icon or select **...** next to the artifact and select **Edit** to reopen the artifact pane.

   - To delete an artifact from the **Selected artifacts** list, select **...** and then select **Delete**.

1. When you're done adding, arranging, and configuring artifacts, select **OK** on the **Add artifacts** page.
1. The **Artifacts** section of the **Create lab resource** screen shows the number of artifacts added. To add, edit, rearrange, or delete the artifacts before you create the VM, select **Add or Remove Artifacts** again.
1. Optionally configure any **Advanced Settings** or **Tags**, and then select **Create** and **Create** again at the bottom of the screen to create the VM with added artifacts.

After you create the VM, the installed artifacts appear on the VM's **Artifacts** page. To see details about each artifact's installation, select the artifact name.

### Add artifacts to an existing VM

1. From the lab's home page, select the VM from the **My virtual machines** list.
1. On the VM page, select **Artifacts** in the top menu bar or under **Operations** in the left navigation.
1. On the **Artifacts** page, select **Apply artifacts**.

   :::image type="content" source="./media/add-artifact-vm/artifacts.png" alt-text="Screenshot that shows the Artifacts pane for an existing VM.":::

1. On the **Add artifacts** page, select and configure artifacts the same way as for a new VM.
1. When you're done adding artifacts, select **Install**. The artifacts install on the VM immediately.

# [Azure PowerShell](#tab/PowerShell)

If necessary, sign in to your Azure account by using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet. If you have multiple Azure subscriptions, use `Set-AzContext -SubscriptionId "<SubscriptionId>"` and provide the subscription ID you want to use.

Run the following PowerShell script to apply an artifact to a VM by using the [Invoke-AzResourceAction](/powershell/module/az.resources/invoke-azresourceaction) cmdlet. Provide the information the script calls for when prompted.

```powershell
param (
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
$FullVMId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DevTestLab/labs/$DevTestLabName/virtualmachines/$virtualMachineName"

$virtualMachine = Get-AzResource -ResourceId $FullVMId

# Generate the artifact id
$FullArtifactId = "/subscriptions/$SubscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DevTestLab/labs/$DevTestLabName/artifactSources/$($repository.Name)/artifacts/$($template.Name)"

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

---

## Related content

- [Specify mandatory artifacts](devtest-lab-mandatory-artifacts.md)
- [Create custom artifacts](devtest-lab-artifact-author.md)
- [Add an artifact repository to a lab](devtest-lab-artifact-author.md)
- [Diagnose artifact failures](devtest-lab-troubleshoot-artifact-failure.md)
