---
title: Apply Linux Azure Automation State Configuration using PowerShell
description: This article tells you how to configure a Linux virtual machine to a desired state using Azure Automation State Configuration with PowerShell.
ms.topic: conceptual
services: automation
ms.subservice: dsc
ms.date: 06/18/2021
---

# Configure Linux desired state with Azure Automation State Configuration using PowerShell

In this tutorial, you'll apply an Azure Automation State Configuration with PowerShell to a Linux virtual machine to check whether it complies with a desired state. Specifically, you'll check whether the apache2 service is running Azure Automation State Configuration allows you to specify configurations for your servers and ensure that those servers are in the specified state over time. For more information about State Configuration, see [Azure Automation State Configuration overview](./automation-dsc-overview.md).

> [!div class="checklist"]
> - Onboard a Linux VM to be managed by Azure Automation DSC
> - Compose a configuration
> - Install PowerShell module for Automation
> - Import a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Modify the node configuration mapping
> - Check the compliance status of a managed node

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure Automation account. To learn more about Automation accounts, see [Automation Account authentication overview](./automation-security-overview.md).
- An Azure Resource Manager virtual machine (VM) running Ubuntu 18.04 LTS or later. For instructions on creating a Linux VM, see [Create a Linux virtual machine in Azure with PowerShell](../virtual-machines/windows/quick-create-powershell.md).
- The PowerShell [Az Module](/powershell/azure/new-azureps-module-az) installed on your workstation. Ensure you have the latest version. If necessary, run `Update-Module -Name Az`.

## Create a configuration

Review the code below and note the presence of two node [configurations](/powershell/scripting/dsc/configurations/configurations): `IsPresent` and `IsNotPresent`. This configuration calls one resource in each node block: the [nxPackage resource](/powershell/scripting/dsc/reference/resources/linux/lnxpackageresource). This resource manages the presence of the **apache2** package. Then, in a text editor, copy the following code to a local file and name it `LinuxConfig.ps1`:

```powershell
Configuration LinuxConfig
{
    Import-DscResource -ModuleName 'nx'

    Node IsPresent
    {
	    nxPackage apache2
	    {
            Name              = 'apache2'
            Ensure            = 'Present'
            PackageManager    = 'Apt'
        }
    }

    Node IsNotPresent
    {
	    nxPackage apache2
	    {
            Name              = 'apache2'
            Ensure            = 'Absent'
        }
    }
}
```

## Sign in to Azure

From your workstation, sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) PowerShell cmdlet and follow the on-screen directions.

```powershell
# Sign in to your Azure subscription
$sub = Get-AzSubscription -ErrorAction SilentlyContinue
if(-not($sub))
{
    Connect-AzAccount
}

# If you have multiple subscriptions, set the one to use
# Select-AzSubscription -SubscriptionId "<SUBSCRIPTIONID>"
```

## Initialize variables

For efficiency and decreased chance of error when executing the cmdlets, revise the PowerShell code further below as necessary and then execute.

| Variable | Value |
|---|---|
|$resourceGroup| Replace `yourResourceGroup` with the actual name of your resource group.|
|$automationAccount| Replace `yourAutomationAccount` with the actual name of your Automation account.|
|$VM| Replace `yourVM` with the actual name of your Linux virtual machine.|
|$configurationName| Leave as is with `LinuxConfig`. The name of the configuration used in this tutorial.|
|$nodeConfigurationName0|Leave as is with `LinuxConfig.IsNotPresent`. The name of a node configuration used in this tutorial.|
|$nodeConfigurationName1|Leave as is with `LinuxConfig.IsPresent`. The name of a node configuration used in this tutorial.|
|$moduleName|Leave as is with `nx`. The name of the PowerShell module used for DSC in this tutorial.|
|$moduleVersion| Obtain the latest version number for `nx` from the [PowerShell Gallery](https://www.powershellgallery.com/packages/nx). This tutorial uses version `1.0`.|

```powershell
$resourceGroup = "yourResourceGroup"
$automationAccount = "yourAutomationAccount"
$VM = "yourVM"
$configurationName = "LinuxConfig"
$nodeConfigurationName0 = "LinuxConfig.IsNotPresent"
$nodeConfigurationName1 = "LinuxConfig.IsPresent"
$moduleName = "nx"
$moduleVersion = "1.0"
```

## Install nx module

Azure Automation uses a number of PowerShell modules to enable cmdlets in runbooks and DSC resources in DSC configurations. **nx** is the module with DSC Resources for Linux. Install the **nx**  module with the [New-AzAutomationModule](/powershell/module/az.automation/new-azautomationmodule) cmdlet. For more information about modules, see [Manage modules in Azure Automation](./shared-resources/modules.md). Execute the following code:

```powershell
New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/new-azautomationmodule-output.png" alt-text="Output from New-AzAutomationModule command.":::

You can verify the installation with the following code:

```powershell
Get-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName 
```

## Import configuration to Azure Automation

Call the [Import-AzAutomationDscConfiguration](/powershell/module/Az.Automation/Import-AzAutomationDscConfiguration) cmdlet to upload the configuration into your Automation account. Revise value for `-SourcePath` with your actual path and then execute the following code:

```powershell
Import-AzAutomationDscConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -SourcePath "C:\DscConfigs\LinuxConfig.ps1" `
   -Published
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/import-azautomationdscconfiguration-output.png" alt-text="Output from Import-AzAutomationDscConfiguration command.":::

You can view the configuration from Automation with the following code:

```powershell
Get-AzAutomationDscConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $configurationName
```

## Compile configuration in Azure Automation

Before you can apply a desired state to a node, the configuration defining that state must be compiled into one or more node configurations.  Call the [Start-AzAutomationDscCompilationJob](/powershell/module/Az.Automation/Start-AzAutomationDscCompilationJob) cmdlet to compile the `LinuxConfig` configuration in Azure Automation. For more information about compilation, see [Compile DSC configurations](./automation-dsc-compile.md). Execute the following code:

```powershell
Start-AzAutomationDscCompilationJob `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -ConfigurationName $configurationName
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/start-azautomationdsccompilationjob-output.png" alt-text="Output from Start-AzAutomationDscCompilationJob command.":::

You can view the compilation job from Automation with the following code:

```powershell
Get-AzAutomationDscCompilationJob `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -ConfigurationName $configurationName
```

Wait for the compilation job to complete before proceeding as the configuration must be compiled into a node configuration before it can be assigned to a node. Execute the following code to check for status every 5 seconds:

```powershell
while ((Get-AzAutomationDscCompilationJob `
         -ResourceGroupName $resourceGroup `
         -AutomationAccountName $automationAccount `
         -ConfigurationName $configurationName).Status -ne "Completed") 
{
   Write-Output "Wait"
   Start-Sleep -Seconds 5
}
Write-Output "Compilation complete"
```

After the compilation job completes, you can also view the node configuration metadata with the following code:

```powershell
Get-AzAutomationDscNodeConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount
```

## Register the Linux VM for an Automation account

Register the Azure virtual machine as an APS Desired State Configuration (DSC) node for the Azure Automation account. The [Register-AzAutomationDscNode](/powershell/module/Az.Automation/Register-AzAutomationDscNode) cmdlet only supports VMs running Windows OS. The Linux virtual machine will first need to be configured for DSC. For detailed steps, see [Get started with Desired State Configuration (DSC) for Linux](/powershell/scripting/dsc/getting-started/lnxgettingstarted).

1. Craft the bash registration command from PowerShell for later execution on your Linux VM. Execute the following code:

   ```powershell
    $primaryKey = (Get-AzAutomationRegistrationInfo `
        -ResourceGroupName $resourceGroup `
        -AutomationAccountName $automationAccount).PrimaryKey
    
    $URL = (Get-AzAutomationRegistrationInfo `
        -ResourceGroupName $resourceGroup `
        -AutomationAccountName $automationAccount).Endpoint
    
    Write-Output "sudo /opt/microsoft/dsc/Scripts/Register.py $primaryKey $URL"
   ```

   These commands obtain the Automation account's primary access key and URL and concatenates it to the registration command. Ensure you remove any carriage returns from the output. This command will be used in a later step.

1. Connect to your linux VM. If you used a password, you can use the syntax below. If you used a public-private key pair, see [SSH on Linux](./../virtual-machines/linux/mac-create-ssh-keys.md) for detailed steps. The additional commands perform a few updates and installs Python.

   ```cmd
   ssh user@IP

   sudo apt-get update
   sudo apt-get install -y python
   ```

1. Install Open Management Infrastructure (OMI). For more information on OMI, see [Open Management Infrastructure](https://github.com/Microsoft/omi). Verify the latest [release](https://github.com/Microsoft/omi/releases). Revise the release version below as needed, and then execute the commands in your ssh session:

   ```bash
   wget https://github.com/microsoft/omi/releases/download/v1.6.8-0/omi-1.6.8-0.ssl_110.ulinux.x64.deb

   sudo dpkg -i ./omi-1.6.8-0.ssl_110.ulinux.x64.deb
   ```

1. Install PowerShell Desired State Configuration for Linux. For more information, see [DSC on Linux](https://github.com/microsoft/PowerShell-DSC-for-Linux). Verify the latest [release](https://github.com/microsoft/PowerShell-DSC-for-Linux/releases). Revise the release version below as needed, and then execute the commands in your ssh session:

   ```bash
   wget https://github.com/microsoft/PowerShell-DSC-for-Linux/releases/download/v1.2.1-0/dsc-1.2.1-0.ssl_110.x64.deb

   sudo dpkg -i ./dsc-1.2.1-0.ssl_110.x64.deb
   ```

1. Now you can register the node using the `sudo /opt/microsoft/dsc/Scripts/Register.py <PRIMARY ACCESS KEY> <URL>` code you crafted in step 1. Execute the code in your ssh session. The output should look similar as shown below:

   ```output
   instance of SendConfigurationApply
   {
        ReturnValue=0
   }
   
   ```

1. You can verify the registration back in PowerShell with the following code:

   ```powershell
     Get-AzAutomationDscNode `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $VM  
   ```

   The output should look similar as shown below:

      :::image type="content" source="media/dsc-linux-powershell/get-azautomationdscnode-output.png" alt-text="Output from Get-AzAutomationDscNode command.":::

## Assign a node configuration

Call the [Set-AzAutomationDscNode](/powershell/module/Az.Automation/Set-AzAutomationDscNode) cmdlet to set the node configuration mapping. Execute the following code:

```powershell
# Get the ID of the DSC node
$node = Get-AzAutomationDscNode `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $VM

# Set node configuration mapping
Set-AzAutomationDscNode `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -NodeConfigurationName $nodeConfigurationName0 `
   -NodeId $node.Id `
   -Force
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/set-azautomationdscnode-output.png" alt-text="Output from Set-AzAutomationDscNode command.":::

## Modify the node configuration mapping

Call the [Set-AzAutomationDscNode](/powershell/module/Az.Automation/Set-AzAutomationDscNode) cmdlet to modify the node configuration mapping. Here, you modify the current node configuration mapping from `LinuxConfig.IsNotPresent` to `LinuxConfig.IsPresent`. Execute the following code:

```powershell
# Modify node configuration mapping
Set-AzAutomationDscNode `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -NodeConfigurationName $nodeConfigurationName1 `
   -NodeId $node.Id `
   -Force
```

## Check the compliance status of a managed node

Each time State Configuration does a consistency check on a managed node, the node sends a status report back to the pull server. Call the [Get-AzAutomationDscNodeReport](/powershell/module/Az.Automation/Get-AzAutomationDscNodeReport) cmdlet to get reports on the compliance status of a managed node using the following code:

```powershell
Get-AzAutomationDscNodeReport `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -NodeId $node.Id `
   -Latest
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/get-azautomationdscnodereport-output.png" alt-text="Output from Get-AzAutomationDscNodeReport command.":::

It can take some time after a node is enabled before the first report is available. You might
need to wait up to 30 minutes for the first report after you enable a node. For more information about report data, see [Using a DSC report server](/powershell/scripting/dsc/pull-server/reportserver).

## Clean up resources

Delete resources when no longer needed with the following code:

```powershell
# Get the ID of the DSC node
$NodeID = (Get-AzAutomationDscNode `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $VM).Id

# Remove DSC node from management by an Automation account.
# Although you can't register a node through PowerShell, you can unregister it with PowerShell.
Unregister-AzAutomationDscNode `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Id $NodeID `
   -Force

# Remove metadata from DSC node configurations in Automation.
Remove-AzAutomationDscNodeConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $nodeConfigurationName0 `
   -IgnoreNodeMappings `
   -Force

Remove-AzAutomationDscNodeConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $nodeConfigurationName1 `
   -IgnoreNodeMappings `
   -Force

# Remove DSC configuration from Automation.
Remove-AzAutomationDscConfiguration `
   -AutomationAccountName $automationAccount `
   -ResourceGroupName $resourceGroup `
   -Name $configurationName `
   -Force

# Removes nx module from Automation.
Remove-AzAutomationModule `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $moduleName 
```

## Next steps

In this tutorial, you applied an Azure Automation State Configuration with PowerShell to a Linux virtual machine to check whether it complied with a desired state. For a more thorough explanation of configuration composition, see:

> [!div class="nextstepaction"]
> [Compose DSC configurations](./compose-configurationwithcompositeresources.md)