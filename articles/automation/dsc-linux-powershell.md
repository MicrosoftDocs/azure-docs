---
title: Apply Linux Azure Automation State Configuration using PowerShell
description: This article tells you how to configure a Linux virtual machine to a desired state using Azure Automation State Configuration with PowerShell.
ms.topic: conceptual
services: automation
ms.subservice: dsc
ms.custom: devx-track-azurepowershell, devx-track-linux
ms.date: 08/31/2021
---

# Configure Linux desired state with Azure Automation State Configuration using PowerShell

> [!NOTE]
> Before you enable Automation State Configuration, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Policy named [guest configuration](../governance/machine-configuration/overview.md). The guest configuration service combines features of DSC Extension, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Guest configuration also includes hybrid machine support through [Arc-enabled servers](../azure-arc/servers/overview.md).

> [!IMPORTANT]
> The desired state configuration VM extension for Linux will be [retired on **September 30, 2023**](https://aka.ms/dscext4linuxretirement). If you're currently using the desired state configuration VM extension for Linux, you should start planning your migration to the machine configuration feature of Azure Automanage by using the information in this article.

In this tutorial, you'll apply an Azure Automation State Configuration with PowerShell to an Azure Linux virtual machine to check whether it complies with a desired state. The desired state is to identify if the apache2 service is present on the node.

Azure Automation State Configuration allows you to specify configurations for your machines and ensure those machines are in a specified state over time. For more information about State Configuration, see [Azure Automation State Configuration overview](./automation-dsc-overview.md).

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Onboard an Azure Linux VM to be managed by Azure Automation DSC
> - Compose a configuration
> - Install PowerShell module for Automation
> - Import a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Modify the node configuration mapping
> - Check the compliance status of a managed node

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure Automation account. To learn more about Automation accounts, see [Automation Account authentication overview](./automation-security-overview.md).
- An Azure Resource Manager virtual machine (VM) running Ubuntu 18.04 LTS or later. For instructions on creating an Azure Linux VM, see [Create a Linux virtual machine in Azure with PowerShell](../virtual-machines/windows/quick-create-powershell.md).
- The PowerShell [Az Module](/powershell/azure/new-azureps-module-az) installed on the machine you'll be using to write, compile, and apply a state configuration to a target Azure Linux VM. Ensure you have the latest version. If necessary, run `Update-Module -Name Az`.

## Create a configuration

Review the code below and note the presence of two node [configurations](/powershell/dsc/configurations/configurations): `IsPresent` and `IsNotPresent`. This configuration calls one resource in each node block: the [nxPackage resource](/powershell/dsc/reference/resources/linux/lnxpackageresource). This resource manages the presence of the **apache2** package. Configuration names in Azure Automation must be limited to no more than 100 characters.

Then, in a text editor, copy the following code to a local file and name it `LinuxConfig.ps1`:

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

From your machine, sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) PowerShell cmdlet and follow the on-screen directions.

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
|$VM| Replace `yourVM` with the actual name of your Azure Linux VM.|
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

Azure Automation uses a number of PowerShell modules to enable cmdlets in runbooks and DSC resources in DSC configurations. **nx** is the module with DSC Resources for Linux. Install the **nx**  module with the [New-AzAutomationModule](/powershell/module/az.automation/new-azautomationmodule) cmdlet. For more information about modules, see [Manage modules in Azure Automation](./shared-resources/modules.md). Run the following command:

```powershell
New-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName `
    -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/new-azautomationmodule-output.png" alt-text="Output from New-AzAutomationModule command.":::

You can verify the installation running the following command:

```powershell
Get-AzAutomationModule `
    -ResourceGroupName $resourceGroup `
    -AutomationAccountName $automationAccount `
    -Name $moduleName
```

## Import configuration to Azure Automation

Call the [Import-AzAutomationDscConfiguration](/powershell/module/az.automation/import-azautomationdscconfiguration) cmdlet to upload the configuration into your Automation account. Revise value for `-SourcePath` with your actual path and then run the following command:

```powershell
Import-AzAutomationDscConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -SourcePath "path\LinuxConfig.ps1" `
   -Published
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/import-azautomationdscconfiguration-output.png" alt-text="Output from Import-AzAutomationDscConfiguration command.":::

You can view the configuration from your Automation account running the following command:

```powershell
Get-AzAutomationDscConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -Name $configurationName
```

## Compile configuration in Azure Automation

Before you can apply a desired state to a node, the configuration defining that state must be compiled into one or more node configurations.  Call the [Start-AzAutomationDscCompilationJob](/powershell/module/Az.Automation/Start-AzAutomationDscCompilationJob) cmdlet to compile the `LinuxConfig` configuration in Azure Automation. For more information about compilation, see [Compile DSC configurations](./automation-dsc-compile.md). Run the following command:

```powershell
Start-AzAutomationDscCompilationJob `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -ConfigurationName $configurationName
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/start-azautomationdsccompilationjob-output.png" alt-text="Output from Start-AzAutomationDscCompilationJob command.":::

You can view the compilation job from your Automation account using the following command:

```powershell
Get-AzAutomationDscCompilationJob `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -ConfigurationName $configurationName
```

Wait for the compilation job to complete before proceeding. The configuration must be compiled into a node configuration before it can be assigned to a node. Execute the following code to check for status every 5 seconds:

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

After the compilation job completes, you can also view the node configuration metadata using the following command:

```powershell
Get-AzAutomationDscNodeConfiguration `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount
```

## Register the Azure Linux VM for an Automation account

Register the Azure Linux VM as a Desired State Configuration (DSC) node for the Azure Automation account. The [Register-AzAutomationDscNode](/powershell/module/az.automation/register-azautomationdscnode) cmdlet only supports VMs running Windows OS. The Azure Linux VM will first need to be configured for DSC. For detailed steps, see [Get started with Desired State Configuration (DSC) for Linux](/powershell/dsc/getting-started/lnxgettingstarted).

1. Construct a Python script with the registration command using PowerShell for later execution on your Azure Linux VM by running the following code:

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

1. Connect to your Azure Linux VM. If you used a password, you can use the syntax below. If you used a public-private key pair, see [SSH on Linux](./../virtual-machines/linux/mac-create-ssh-keys.md) for detailed steps. The other commands retrieve information about what packages can be installed, including what updates to currently installed packages are available, and installs Python.

   ```cmd
   ssh user@IP
   ```

   ```bash
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

1. Now you can register the node using the `sudo /opt/microsoft/dsc/Scripts/Register.py <Primary Access Key> <URL>` Python script created in step 1. Run the commands in your ssh session, and the following output should look similar as shown below:

   ```output
   instance of SendConfigurationApply
   {
        ReturnValue=0
   }

   ```

1. You can verify the registration in PowerShell using the following command:

   ```powershell
     Get-AzAutomationDscNode `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $VM
   ```

   The output should look similar as shown below:

      :::image type="content" source="media/dsc-linux-powershell/get-azautomationdscnode-output.png" alt-text="Output from Get-AzAutomationDscNode command.":::

## Assign a node configuration

Call the [Set-AzAutomationDscNode](/powershell/module/Az.Automation/Set-AzAutomationDscNode) cmdlet to set the node configuration mapping. Run the following commands:

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

Call the [Set-AzAutomationDscNode](/powershell/module/Az.Automation/Set-AzAutomationDscNode) cmdlet to modify the node configuration mapping. Here, you modify the current node configuration mapping from `LinuxConfig.IsNotPresent` to `LinuxConfig.IsPresent`. Run the following command:

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

Each time State Configuration does a consistency check on a managed node, the node sends a status report back to the pull server. The following example uses the [Get-AzAutomationDscNodeReport](/powershell/module/Az.Automation/Get-AzAutomationDscNodeReport) cmdlet to report on the compliance status of a managed node.

```powershell
Get-AzAutomationDscNodeReport `
   -ResourceGroupName $resourceGroup `
   -AutomationAccountName $automationAccount `
   -NodeId $node.Id `
   -Latest
```

The output should look similar as shown below:

   :::image type="content" source="media/dsc-linux-powershell/get-azautomationdscnodereport-output.png" alt-text="Output from Get-AzAutomationDscNodeReport command.":::

The first report may not be available immediately and may take up to 30 minutes after you enable a node. For more information about report data, see [Using a DSC report server](/powershell/dsc/pull-server/reportserver).

## Clean up resources

The following steps help you delete the resources created for this tutorial that are no longer needed.

1. Remove DSC node from management by an Automation account. Although you can't register a node through PowerShell, you can unregister it with PowerShell. Run the following commands:

    ```powershell
    # Get the ID of the DSC node
    $NodeID = (Get-AzAutomationDscNode `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $VM).Id

    Unregister-AzAutomationDscNode `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Id $NodeID `
       -Force

    # Verify using the same command from Register the Azure Linux VM for an Automation account. A blank response indicates success.
    Get-AzAutomationDscNode `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $VM
    ```

1. Remove metadata from DSC node configurations in Automation. Run the following commands:

    ```powershell
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

    # Verify using the same command from Compile configuration in Azure Automation.
    Get-AzAutomationDscNodeConfiguration `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $nodeConfigurationName0

    Get-AzAutomationDscNodeConfiguration `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $nodeConfigurationName1
    ```

      Successful removal is indicated by output that looks similar to the following: `Get-AzAutomationDscNodeConfiguration : NodeConfiguration LinuxConfig.IsNotPresent not found`.

1. Remove DSC configuration from Automation. Run the following command:

    ```powershell
    Remove-AzAutomationDscConfiguration `
       -AutomationAccountName $automationAccount `
       -ResourceGroupName $resourceGroup `
       -Name $configurationName `
       -Force

    # Verify using the same command from Import configuration to Azure Automation.
    Get-AzAutomationDscConfiguration `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $configurationName
    ```

   Successful removal is indicated by output that looks similar to the following: `Get-AzAutomationDscConfiguration : Operation returned an invalid status code 'NotFound'`.

1. Removes nx module from Automation. Run the following command:

    ```powershell
    Remove-AzAutomationModule `
       -ResourceGroupName $resourceGroup `
       -AutomationAccountName $automationAccount `
       -Name $moduleName -Force

    # Verify using the same command from Install nx module.
    Get-AzAutomationModule `
        -ResourceGroupName $resourceGroup `
        -AutomationAccountName $automationAccount `
        -Name $moduleName
    ```

   Successful removal is indicated by output that looks similar to the following: `Get-AzAutomationModule : The module was not found. Module name: nx.`.

## Next steps

In this tutorial, you applied an Azure Automation State Configuration with PowerShell to an Azure Linux VM to check whether it complied with a desired state. For a more thorough explanation of configuration composition, see:

> [!div class="nextstepaction"]
> [Compose DSC configurations](./compose-configurationwithcompositeresources.md)
