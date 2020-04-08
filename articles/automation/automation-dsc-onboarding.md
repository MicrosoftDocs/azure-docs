---
title: Onboard machines for management by Azure Automation State Configuration
description: This article describes, how to set up machines for management with Azure Automation State Configuration.
services: automation
ms.service: automation
ms.subservice: dsc
author: mgoedtel
ms.author: magoedte
ms.topic: conceptual
ms.date: 12/10/2019
manager: carmonm
---
# Onboard machines for management by Azure Automation State Configuration

Azure Automation State Configuration is a configuration management service for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. You access it in the Azure portal by selecting **State configuration (DSC)** under **Configuration Management**. 

This service enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports that show each machine's compliance with the desired state that you've specified.

The Azure Automation State Configuration service is to DSC what Azure Automation runbooks are to PowerShell scripting. In other words, in the same way that Azure Automation helps you manage PowerShell scripts, it also helps you manage DSC configurations. To learn more about the benefits of using Azure Automation State Configuration, see [Azure Automation State Configuration overview](automation-dsc-overview.md).

You can use Azure Automation State Configuration to manage a variety of machines:

- Azure virtual machines (VMs)
- Azure virtual machines (classic)
- Physical/virtual Windows machines on-premises, or in a cloud other than Azure (including Amazon Web Services [AWS] EC2 instances)
- Physical/virtual Linux machines on-premises, in Azure, or in a cloud other than Azure

If you're not ready to manage machine configuration from the cloud, you can use Azure Automation State Configuration as a report-only endpoint. This feature allows you to set (push) configurations through DSC and view reporting details in Azure Automation.

> [!NOTE]
> Managing Azure VMs with Azure Automation State Configuration is included at no extra charge if your installed Azure VM Desired State Configuration extension is 2.70 or later. For more information, see [Automation pricing](https://azure.microsoft.com/pricing/details/automation/).

The following sections of this article outline how you can onboard the previously listed machines to Azure Automation State Configuration.

## Onboard Azure VMs

With Azure Automation State Configuration, you can easily onboard Azure VMs for configuration management by using the Azure portal, Azure Resource Manager templates, or PowerShell. Under the hood, and without an administrator having to remote into a VM, the Azure VM Desired State Configuration extension registers the VM with Azure Automation State Configuration. 

Because the Azure extension runs asynchronously, we provide steps to track its progress or troubleshoot it in the [Troubleshoot Azure virtual machine onboarding](#troubleshoot-azure-virtual-machine-onboarding) section of this article.

> [!NOTE]
> Deploying DSC to a Linux node uses the */tmp* folder. Modules such as `nxautomation` are temporarily downloaded for verification before they're installed. To ensure that modules are installed correctly, the Log Analytics agent for Linux needs read/write permissions on the */tmp* folder.<br><br>
> The Log Analytics agent for Linux runs as the *omsagent* user. To grant write permission to the *omsagent* user, run the command `setfacl -m u:omsagent:rwx /tmp`.

### Onboard VMs by using the Azure portal

To onboard Azure VMs to Azure Automation State Configuration through the [Azure portal](https://portal.azure.com/):

1. Go to the Azure Automation account in which you want to onboard VMs. 

2. On the **State Configuration** page, select the **Nodes** tab, then select **Add**.

3. Choose a VM to onboard.

4. If the machine doesn't have the PowerShell desired state extension installed and the power state is running, select **Connect**.

5. Under **Registration**, enter the [PowerShell DSC Local Configuration Manager values](/powershell/scripting/dsc/managing-nodes/metaConfig) required for your use case. Optionally, you can enter a node configuration to assign to the VM.

![The VM registration pane](./media/automation-dsc-onboarding/DSC_Onboarding_6.png)

### Onboard VMs by using Azure Resource Manager templates

You can deploy and onboard VMs to Azure Automation State Configuration using Azure Resource Manager templates. For an example template that onboards an existing VM to Azure Automation State Configuration, see [Server managed by Desired State Configuration service](https://azure.microsoft.com/resources/templates/101-automation-configuration/). If you're managing a virtual machine scale set, see the example template in [Virtual machine scale set configuration managed by Azure Automation](https://azure.microsoft.com/resources/templates/201-vmss-automation-dsc/).

### Onboard VMs by using PowerShell

You can use the [Register-AzAutomationDscNode](/powershell/module/az.automation/register-azautomationdscnode) cmdlet in PowerShell to onboard VMs to Azure Automation State Configuration. 

> [!NOTE]
>The `Register-AzAutomationDscNode` cmdlet is implemented currently only for machines running Windows, because the cmdlet triggers only the Windows extension.

### Register VMs across Azure subscriptions

The best way to register VMs from other Azure subscriptions is to use the DSC extension in an Azure Resource Manager deployment template. Examples are provided in [Desired State Configuration extension with Azure Resource Manager templates](https://docs.microsoft.com/azure/virtual-machines/extensions/dsc-template).

To find the registration key and registration URL to use as parameters in the template, see the [Onboard securely by using registration](#onboard-securely-by-using-registration) section in this article.

## Onboard physical or virtual Windows machines on-premises, or in a cloud other than Azure (including AWS EC2 instances)

You can onboard Windows servers that are running on-premises or in other cloud environments to Azure Automation State Configuration. The servers must have [outbound access to Azure](automation-dsc-overview.md#network-planning).

1. Make sure that the latest version of [Windows Management Framework 5](https://aka.ms/wmf5latest) is installed on the machines to be onboarded to Azure Automation State Configuration. In addition, Windows Management Framework 5 must be installed on the computer that you're using for the onboarding operation.
1. To create a folder containing the required DSC metaconfigurations, follow the directions in the [Generate DSC metaconfigurations](#generate-dsc-metaconfigurations) section. 
1. To apply the PowerShell DSC metaconfigurations remotely to the machines that you want to onboard, use the following cmdlet: 

   ```powershell
   Set-DscLocalConfigurationManager -Path C:\Users\joe\Desktop\DscMetaConfigs -ComputerName MyServer1, MyServer2
   ```

   If you can't apply the PowerShell DSC metaconfigurations remotely:
   
   a. Copy the *metaconfigurations* folder to the machines that you're onboarding.  
   b. Add code to call `Set-DscLocalConfigurationManager` locally on the machines.
1. By using the Azure portal or cmdlets, verify that the machines to onboard appear as State Configuration nodes registered in your Azure Automation account.

## Onboard physical or virtual Linux machines on-premises, or in a cloud other than Azure

You can onboard Linux servers running on-premises or in other cloud environments to Azure Automation State Configuration. The servers must have [outbound access to Azure](automation-dsc-overview.md#network-planning).

1. Make sure that the latest version of [PowerShell Desired State Configuration for Linux](https://github.com/Microsoft/PowerShell-DSC-for-Linux) is installed on the machines to be onboarded to Azure Automation State Configuration.
1. If the [PowerShell DSC Local Configuration Manager defaults](/powershell/scripting/dsc/managing-nodes/metaConfig4) match your use case, and you want to onboard machines so that they both pull from and report to Azure Automation State Configuration, do the following:

   a. On each Linux machine to onboard to Azure Automation State Configuration, use `Register.py` to onboard them by using the PowerShell DSC Local Configuration Manager defaults.

     `/opt/microsoft/dsc/Scripts/Register.py <Automation account registration key> <Automation account registration URL>`

   b. To find the registration key and registration URL for your Automation account, see the [Onboard securely by using registration](#onboard-securely-by-using-registration) section of this article.

1. If the PowerShell DSC Local Configuration Manager (LCM) defaults don't match your use case, or if you want to onboard machines that report only to Azure Automation State Configuration, follow steps a-d. Otherwise, proceed directly to step d.

    a. To produce a folder containing the required DSC metaconfigurations, follow the directions in the [Generate DSC metaconfigurations](#generate-dsc-metaconfigurations) section.

    b. Make sure that the latest version of [Windows Management Framework 5](https://aka.ms/wmf5latest) is installed on the machine that's being used for onboarding.

    c. To apply the PowerShell DSC metaconfigurations remotely to the machines that you want to onboard, add the following code:

    ```powershell
    $SecurePass = ConvertTo-SecureString -String '<root password>' -AsPlainText -Force
    $Cred = New-Object System.Management.Automation.PSCredential 'root', $SecurePass
    $Opt = New-CimSessionOption -UseSsl -SkipCACheck -SkipCNCheck -SkipRevocationCheck

    # need a CimSession for each Linux machine to onboard
    $Session = New-CimSession -Credential $Cred -ComputerName <your Linux machine> -Port 5986 -Authentication basic -SessionOption $Opt

    Set-DscLocalConfigurationManager -CimSession $Session -Path C:\Users\joe\Desktop\DscMetaConfigs
    ```

    d. If you can't apply the PowerShell DSC metaconfigurations remotely, copy the metaconfigurations corresponding to the remote machines from the folder described in step 3.a to the Linux machines.

1. Add code to call *Set-DscLocalConfigurationManager.py* locally on each Linux machine to be onboarded to Azure Automation State Configuration.

   `/opt/microsoft/dsc/Scripts/SetDscLocalConfigurationManager.py -configurationmof <path to metaconfiguration file>`

1. By using the Azure portal or cmdlets, ensure that the machines to onboard now show up as DSC nodes registered in your Azure Automation account.

## Generate DSC metaconfigurations

To onboard any machine to Azure Automation State Configuration, you can generate a [DSC metaconfiguration](/powershell/scripting/dsc/managing-nodes/metaConfig). This configuration tells the DSC agent to pull from or report to Azure Automation State Configuration. You can generate a DSC metaconfiguration for Azure Automation State Configuration by using either a PowerShell DSC configuration or the Azure Automation PowerShell cmdlets.

> [!NOTE]
> DSC metaconfigurations contain the secrets needed to onboard a machine to an Automation account for management. Be sure to properly protect any DSC metaconfigurations you create, or delete them after use.

Proxy support for metaconfigurations is controlled by LCM, which is the Windows PowerShell DSC engine. LCM runs on all target nodes and is responsible for calling the configuration resources that are included in a DSC metaconfiguration script. 

You can include proxy support in a metaconfiguration by including definitions of the proxy URL and the proxy credential as needed in the `ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks. See [Configure Local Configuration Manager](https://docs.microsoft.com/powershell/scripting/dsc/managing-nodes/metaconfig?view=powershell-7).

### Generate DSC metaconfigurations by using a DSC configuration

1. Open Visual Studio Code (or your favorite editor) as an administrator on a machine in your local environment. The machine must have the latest version of [Windows Management Framework 5](https://aka.ms/wmf5latest) installed.
1. Copy the following script locally. This script contains a PowerShell DSC configuration for creating metaconfigurations, and a command to kick off the metaconfiguration creation.

    > [!NOTE]
    > State Configuration Node Configuration names are case-sensitive in the Azure portal. If the case is mismatched, the node won't show up under the **Nodes** tab.

   ```powershell
   # The DSC configuration that will generate metaconfigurations.
   [DscLocalConfigurationManager()]
   Configuration DscMetaConfigs
   {
        param
        (
            [Parameter(Mandatory=$True)]
            [String]$RegistrationUrl,

            [Parameter(Mandatory=$True)]
            [String]$RegistrationKey,

            [Parameter(Mandatory=$True)]
            [String[]]$ComputerName,

            [Int]$RefreshFrequencyMins = 30,

            [Int]$ConfigurationModeFrequencyMins = 15,

            [String]$ConfigurationMode = 'ApplyAndMonitor',

            [String]$NodeConfigurationName,

            [Boolean]$RebootNodeIfNeeded= $False,

            [String]$ActionAfterReboot = 'ContinueConfiguration',

            [Boolean]$AllowModuleOverwrite = $False,

            [Boolean]$ReportOnly
        )

        if(!$NodeConfigurationName -or $NodeConfigurationName -eq '')
        {
            $ConfigurationNames = $null
        }
        else
        {
            $ConfigurationNames = @($NodeConfigurationName)
        }

        if($ReportOnly)
        {
            $RefreshMode = 'PUSH'
        }
        else
        {
            $RefreshMode = 'PULL'
        }

        Node $ComputerName
        {
            Settings
            {
                RefreshFrequencyMins           = $RefreshFrequencyMins
                RefreshMode                    = $RefreshMode
                ConfigurationMode              = $ConfigurationMode
                AllowModuleOverwrite           = $AllowModuleOverwrite
                RebootNodeIfNeeded             = $RebootNodeIfNeeded
                ActionAfterReboot              = $ActionAfterReboot
                ConfigurationModeFrequencyMins = $ConfigurationModeFrequencyMins
            }

            if(!$ReportOnly)
            {
            ConfigurationRepositoryWeb AzureAutomationStateConfiguration
                {
                    ServerUrl          = $RegistrationUrl
                    RegistrationKey    = $RegistrationKey
                    ConfigurationNames = $ConfigurationNames
                }

                ResourceRepositoryWeb AzureAutomationStateConfiguration
                {
                    ServerUrl       = $RegistrationUrl
                    RegistrationKey = $RegistrationKey
                }
            }

            ReportServerWeb AzureAutomationStateConfiguration
            {
                ServerUrl       = $RegistrationUrl
                RegistrationKey = $RegistrationKey
            }
        }
   }

    # Create the metaconfigurations.
    # NOTE: DSC Node Configuration names are case sensitive in the portal.
    # TODO: Edit the following as needed for your use case.
   $Params = @{
        RegistrationUrl = '<fill me in>';
        RegistrationKey = '<fill me in>';
        ComputerName = @('<some VM to onboard>', '<some other VM to onboard>');
        NodeConfigurationName = 'SimpleConfig.webserver';
        RefreshFrequencyMins = 30;
        ConfigurationModeFrequencyMins = 15;
        RebootNodeIfNeeded = $False;
        AllowModuleOverwrite = $False;
        ConfigurationMode = 'ApplyAndMonitor';
        ActionAfterReboot = 'ContinueConfiguration';
        ReportOnly = $False;  # Set to $True to have machines only report to AA DSC but not pull from it
   }

   # Use PowerShell splatting to pass parameters to the DSC configuration being invoked.
   # For more info about splatting, run: Get-Help -Name about_Splatting.
   DscMetaConfigs @Params
   ```

1. Fill in the registration key and URL for your Automation account, as well as the names of the machines to onboard. All other parameters are optional. To find the registration key and registration URL for your Automation account, see the [Onboard securely by using registration](#onboard-securely-by-using-registration) section.

1. If you want the machines to report DSC status information to Azure Automation State Configuration, but not pull configuration or PowerShell modules, set the `ReportOnly` parameter to *true*.

1. If `ReportOnly` is not set, the machines report DSC status information to Azure Automation State Configuration and pull configuration or PowerShell modules. Set parameters accordingly in the `ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks.

1. Run the script. You should now have a working directory folder called *DscMetaConfigs*, which contains the PowerShell DSC metaconfigurations for the machines to onboard (as an administrator).

    ```powershell
    Set-DscLocalConfigurationManager -Path ./DscMetaConfigs
    ```

### Generate DSC metaconfigurations by using Azure Automation cmdlets

If the PowerShell DSC LCM defaults match your use case and you want to onboard machines to both pull from and report to Azure Automation State Configuration, you can generate the needed DSC metaconfigurations more simply by using the Azure Automation cmdlets.

1. Open the PowerShell console or Visual Studio Code as an administrator on a machine in your local environment.
2. Connect to Azure Resource Manager by using `Connect-AzAccount`.
3. Download the PowerShell DSC metaconfigurations for the machines you want to onboard from the Automation account in which you're setting up nodes.

   ```powershell
   # Define the parameters for Get-AzAutomationDscOnboardingMetaconfig using PowerShell Splatting.
   $Params = @{
       ResourceGroupName = 'ContosoResources'; # The name of the Resource Group that contains your Azure Automation Account
       AutomationAccountName = 'ContosoAutomation'; # The name of the Azure Automation Account where you want a node on-boarded to
       ComputerName = @('web01', 'web02', 'sql01'); # The names of the computers that the meta configuration will be generated for
       OutputFolder = "$env:UserProfile\Desktop\";
   }
   # Use PowerShell splatting to pass parameters to the Azure Automation cmdlet being invoked.
   # For more info about splatting, run: Get-Help -Name about_Splatting.
   Get-AzAutomationDscOnboardingMetaconfig @Params
   ```

1. You should now have a folder called *DscMetaConfigs*, which contains the PowerShell DSC metaconfigurations for the machines to onboard (as an administrator).

    ```powershell
    Set-DscLocalConfigurationManager -Path $env:UserProfile\Desktop\DscMetaConfigs
    ```

## Onboard securely by using registration

Machines can be onboarded securely to an Azure Automation account through the Windows Management Framework 5 DSC registration protocol. This protocol allows a DSC node to authenticate to a PowerShell DSC pull or report server, including Azure Automation State Configuration. The node registers with the server at the registration URL and authenticates by using a registration key. 

During registration, the DSC node and the DSC pull/report server negotiate a unique certificate for the node to use for authentication to the server post-registration. This process prevents onboarded nodes from impersonating one another (for example, if a node is compromised and behaving maliciously). 

After registration, the registration key is not reused for authentication, and it's deleted from the node.

To get the information that's required for the State Configuration registration protocol, go to the Azure portal and, under **Account Settings**, select **Keys**. 

![Azure automation keys and URL in the Keys pane](./media/automation-dsc-onboarding/DSC_Onboarding_4.png)

- **Registration URL**: The value in the **URL** box.
- **Registration key**: The value in the **Primary access key** box or the **Secondary access key** box. You can use either key.

For added security, you can regenerate the primary and secondary access keys of an Automation account at any time in the **Keys** pane. Key regeneration prevents future node registrations from using previous keys.

## Re-register a node

After you register a machine as a DSC node in Azure Automation State Configuration, you might need to re-register that node in the future for either of the following reasons:

- **Certificate renewal**: For versions of Windows Server earlier than Windows Server 2019, each node automatically negotiates a unique certificate for authentication that expires after one year. If a certificate expires without renewal, the node is unable to communicate with Azure Automation and is marked *Unresponsive*. 

  Currently, the PowerShell DSC registration protocol can't automatically renew certificates when they are nearing expiration, and you must re-register the nodes after a year's time. Before you re-register, ensure that each node is running Windows Management Framework 5 RTM. 

    Re-registration performed 90 or fewer days from the certificate expiration time, or at any point after the certificate expiration time, results in a new certificate being generated and used. A resolution to this issue is included in Windows Server 2019 and later.

- **Changes to DSC LCM values**: You might need to change [PowerShell DSC LCM values](/powershell/scripting/dsc/managing-nodes/metaConfig4) that were set during initial registration of the node (for example, `ConfigurationMode`). Currently, you can change these DSC agent values only through re-registration. The one exception is the Node Configuration value assigned to the node. You can change this value in Azure Automation DSC directly.

You can re-register a node in the same way that you registered the node initially, by using any of the onboarding methods described in this document. You don't need to unregister a node from Azure Automation State Configuration before re-registering it.

## Troubleshoot Azure virtual machine onboarding

Azure Automation State Configuration lets you easily onboard Azure Windows VMs for configuration management. Under the hood, the Azure VM Desired State Configuration extension is used to register the VM with Azure Automation State Configuration. Because the Azure VM Desired State Configuration extension runs asynchronously, tracking its progress and troubleshooting its execution can be important.

> [!NOTE]
> Any method of onboarding an Azure Windows VM to Azure Automation State Configuration that uses the Azure VM Desired State Configuration extension can take up to an hour for Azure Automation to show it as registered. This delay results from the installation of Windows Management Framework 5 on the VM by the Azure VM Desired State Configuration extension, which is required to onboard the VM to Azure Automation State Configuration.

To troubleshoot or view the status of the Azure VM Desired State Configuration extension:

1. In the Azure portal, go to the VM that's being onboarded.
2. Under **Settings**, select **Extensions**. 
3. Select **DSC** or **DSCForLinux**, depending on your operating system. 
4. For more information about the extension, select **View detailed status**.

For more information about troubleshooting, see [Troubleshoot issues with Azure Automation Desired State Configuration (DSC)](./troubleshoot/desired-state-configuration.md).

## Next steps

- To get started, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/az.automation#automation).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous deployment to virtual machines using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md).
