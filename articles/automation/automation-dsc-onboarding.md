---
title: Onboarding machines for management by Azure Automation State Configuration
description: How to set up machines for management with Azure Automation State Configuration
services: automation
ms.service: automation
ms.subservice: dsc
author: mgoedtel
ms.author: magoedte
ms.topic: conceptual
ms.date: 12/10/2019
manager: carmonm
---
# Onboarding machines for management by Azure Automation State Configuration

## Why manage machines with Azure Automation State Configuration?

Azure Automation State Configuration is a configuration management service
for Desired State Configuration (DSC) nodes in any cloud or on-premises datacenter. It's accessed in the Azure portal by selecting **State configuration (DSC)** under **Configuration Management**. 

This service enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine's compliance with the desired state you specify.

The Azure Automation State Configuration service is to DSC what Azure Automation runbooks are to PowerShell scripting. In other words, in the same way that Azure Automation helps you manage PowerShell scripts, it also helps you manage DSC configurations. To learn more about the benefits of using Azure Automation State Configuration, see [Azure Automation State Configuration overview](automation-dsc-overview.md).

Azure Automation State Configuration can be used to manage a variety of machines:

- Azure virtual machines
- Azure virtual machines (classic)
- Physical/virtual Windows machines on-premises, or in a cloud other than Azure (including AWS EC2 instances)
- Physical/virtual Linux machines on-premises, in Azure, or in a cloud other than Azure

If you are not ready to manage machine configuration from the cloud, you can use Azure Automation State Configuration as a report-only endpoint. This feature allows you to set (push) configurations through DSC and view reporting details in Azure Automation.

> [!NOTE]
> Managing Azure VMs with Azure Automation State Configuration is included at no extra charge if the installed Azure VM Desired State Configuration extension version is greater than 2.70. For more information, see [**Automation pricing page**](https://azure.microsoft.com/pricing/details/automation/).

The following sections of this article outline how you can onboard the machines listed above to Azure Automation State Configuration.

## Onboarding Azure VMs

Azure Automation State Configuration lets you easily onboard Azure VMs for configuration management, using the Azure portal, Azure Resource Manager templates, or PowerShell. Under the hood, and without an administrator having to remote into a VM, the Azure VM Desired State Configuration extension registers the VM with Azure Automation State Configuration. Since the Azure extension runs asynchronously, steps to track its progress or troubleshoot it are provided in the [Troubleshooting Azure virtual machine onboarding](#troubleshooting-azure-virtual-machine-onboarding) section of this article.

> [!NOTE]
>Deploying DSC to a Linux node uses the **/tmp** folder. Modules such as `nxautomation` are temporarily downloaded for verification before installing them in their appropriate locations. To ensure that modules install correctly, the Log Analytics agent for Linux needs read/write permissions on the **/tmp** folder.<br><br>
>The Log Analytics agent for Linux runs as the `omsagent` user. To grant >write permission to the `omsagent` user, run the command `setfacl -m u:omsagent:rwx /tmp`.

### Onboard a VM using Azure portal

To onboard an Azure VM to Azure Automation State Configuration through the [Azure portal](https://portal.azure.com/):

1. Navigate to the Azure Automation account in which to onboard VMs. 

2. On the State Configuration page, select the **Nodes** tab, then click
**Add**.

3. Choose a VM to onboard.

4. If the machine doesn't have the PowerShell desired state extension installed and the power state is running, click **Connect**.

5. Under **Registration**, enter the [PowerShell DSC Local Configuration Manager values](/powershell/scripting/dsc/managing-nodes/metaConfig)
required for your use case. Optionally, you can enter a node configuration to assign to the VM.

![onboarding](./media/automation-dsc-onboarding/DSC_Onboarding_6.png)

### Onboard a VM using Azure Resource Manager templates

You can deploy and onboard a VM to Azure Automation State Configuration using Azure Resource Manager templates. See [Server managed by Desired State Configuration service](https://azure.microsoft.com/resources/templates/101-automation-configuration/) for an example template that onboards an existing VM to Azure Automation State Configuration. If you are managing a VM Scale Set, see the example template in [VM Scale Set Configuration managed by Azure Automation](https://azure.microsoft.com/resources/templates/201-vmss-automation-dsc/).

### Onboard machines using PowerShell

You can use the [Register-AzAutomationDscNode](/powershell/module/az.automation/register-azautomationdscnode) cmdlet in PowerShell to onboard VMs to Azure Automation State Configuration. 

> [!NOTE]
>The `Register-AzAutomationDscNode` cmdlet is implemented currently only for machines running Windows, as it triggers just the Windows extension.

### Register VMs across Azure subscriptions

The best way to register VMs from other Azure subscriptions is to use the DSC extension in an Azure Resource Manager deployment template. Examples are provided in [Desired State Configuration extension with Azure Resource Manager templates](https://docs.microsoft.com/azure/virtual-machines/extensions/dsc-template).

To find the registration key and registration URL to use as parameters in the template, see the [Onboarding securely using registration](#onboarding-securely-using-registration) section in this article.

## Onboarding physical/virtual Windows machines on-premises, or in a cloud other than Azure (including AWS EC2 instances)

You can onboard Windows servers running on-premises or in other cloud environments to Azure Automation State Configuration. The servers must have [outbound access to Azure](automation-dsc-overview.md#network-planning).

1. Make sure that the latest version of [WMF 5](https://aka.ms/wmf5latest) is installed on the machines to onboard to Azure Automation State Configuration. In addition, WMF 5 must be installed on the computer that you are using for the onboarding operation.
1. Follow the directions in the section [Generating DSC metaconfigurations](#generating-dsc-metaconfigurations) to create a folder containing the required DSC metaconfigurations. 
1. Use the following cmdlet to apply the PowerShell DSC metaconfigurations remotely to the machines that you want to onboard. 

   ```powershell
   Set-DscLocalConfigurationManager -Path C:\Users\joe\Desktop\DscMetaConfigs -ComputerName MyServer1, MyServer2
   ```

1. If you can't apply the PowerShell DSC metaconfigurations remotely, copy the **metaconfigurations** folder to the machines that you are onboarding. Then add code to call `Set-DscLocalConfigurationManager` locally on the machines.
1. Using the Azure portal or cmdlets, verify that the machines to onboard appear as a State Configuration nodes registered in your Azure Automation account.

## Onboarding physical/virtual Linux machines on-premises, or in a cloud other than Azure

You can onboard Linux servers running on-premises or in other cloud environments to Azure Automation State Configuration. The servers must have [outbound access to Azure](automation-dsc-overview.md#network-planning).

1. Make sure that the latest version of [PowerShell Desired State Configuration for Linux](https://github.com/Microsoft/PowerShell-DSC-for-Linux) is installed on the machines to onboard to Azure Automation State Configuration.
2. If the [PowerShell DSC Local Configuration Manager defaults](/powershell/scripting/dsc/managing-nodes/metaConfig4) match your use case, and you want to onboard machines so that they both pull from and report to Azure Automation State Configuration:

   - On each Linux machine to onboard to Azure Automation State Configuration, use `Register.py` to onboard using the PowerShell DSC Local Configuration Manager defaults.

     `/opt/microsoft/dsc/Scripts/Register.py <Automation account registration key> <Automation account registration URL>`

   - To find the registration key and registration URL for your Automation account, see the [Onboarding securely using registration](#onboarding-securely-using-registration) section of this article.

3. If the PowerShell DSC Local Configuration Manager (LCM) defaults don't match your use case, or you want to onboard machines that only report to Azure Automation State Configuration, follow steps 4-7. Otherwise, proceed directly to step 7.

4. Follow the directions in the [Generating DSC metaconfigurations](#generating-dsc-metaconfigurations) section to produce a folder containing the required DSC metaconfigurations.

5. Make sure that the latest version of [WMF 5](https://aka.ms/wmf5latest) is installed on the machine being used for onboarding.

6. Add code as follows to apply the PowerShell DSC metaconfigurations remotely to the machines that you want to onboard.

    ```powershell
    $SecurePass = ConvertTo-SecureString -String '<root password>' -AsPlainText -Force
    $Cred = New-Object System.Management.Automation.PSCredential 'root', $SecurePass
    $Opt = New-CimSessionOption -UseSsl -SkipCACheck -SkipCNCheck -SkipRevocationCheck

    # need a CimSession for each Linux machine to onboard
    $Session = New-CimSession -Credential $Cred -ComputerName <your Linux machine> -Port 5986 -Authentication basic -SessionOption $Opt

    Set-DscLocalConfigurationManager -CimSession $Session -Path C:\Users\joe\Desktop\DscMetaConfigs
    ```

7. If you can't apply the PowerShell DSC metaconfigurations remotely, copy the metaconfigurations corresponding to the remote machines from the folder described in step 4 to the Linux machines.

8. Add code to call `Set-DscLocalConfigurationManager.py` locally on each Linux machine to onboard to Azure Automation State Configuration.

   `/opt/microsoft/dsc/Scripts/SetDscLocalConfigurationManager.py -configurationmof <path to metaconfiguration file>`

9. Using the Azure portal or cmdlets, ensure that the machines to onboard now show up as DSC nodes registered in your Azure Automation account.

## Generating DSC metaconfigurations

To onboard any machine to Azure Automation State Configuration, you can generate a [DSC metaconfiguration](/powershell/scripting/dsc/managing-nodes/metaConfig). This configuration tells the DSC agent to pull from and/or report to Azure Automation State Configuration. You can generate a DSC metaconfiguration for Azure Automation State Configuration using either a PowerShell DSC configuration or the Azure Automation PowerShell cmdlets.

> [!NOTE]
> DSC metaconfigurations contain the secrets needed to onboard a machine to an Automation account for management. Make sure to properly protect any DSC metaconfigurations you create, or delete them after use.

Proxy support for metaconfigurations is controlled by LCM, which is the Windows PowerShell DSC engine. The LCM runs on all target nodes and is responsible for calling the configuration resources that are included in a DSC metaconfiguration script. You can include proxy support in a metaconfiguration by including definitions of the proxy URL and the proxy credential as needed in the `ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks. See [Configuring the Local Configuration Manager](https://docs.microsoft.com/powershell/scripting/dsc/managing-nodes/metaconfig?view=powershell-7).

### Generate DSC metaconfigurations using a DSC configuration

1. Open VSCode (or your favorite editor) as an administrator on a machine in your local environment. The machine must have the latest version of [WMF 5](https://aka.ms/wmf5latest) installed.
1. Copy the following script locally. This script contains a PowerShell DSC configuration for creating metaconfigurations, and a command to kick off the metaconfiguration creation.

    > [!NOTE]
    > State Configuration Node Configuration names are case-sensitive in the Azure portal. If the case is mismatched, the node will not show up under the **Nodes** tab.

   ```powershell
   # The DSC configuration that will generate metaconfigurations
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

    # Create the metaconfigurations
    # NOTE: DSC Node Configuration names are case sensitive in the portal.
    # TODO: edit the below as needed for your use case
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

   # Use PowerShell splatting to pass parameters to the DSC configuration being invoked
   # For more info about splatting, run: Get-Help -Name about_Splatting
   DscMetaConfigs @Params
   ```

1. Fill in the registration key and URL for your Automation account, as well as the names of the machines to onboard. All other parameters are optional. To find the registration key and registration URL for your Automation account, see the [Onboarding securely using registration](#onboarding-securely-using-registration) section.

1. If you want the machines to report DSC status information to Azure Automation State Configuration, but not pull configuration or PowerShell modules, set the `ReportOnly` parameter to true.

1. If `ReportOnly` is not set, the machines report DSC status information to Azure Automation State Configuration and pull configuration or PowerShell modules. Set parameters accordingly in the `ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks.

1. Run the script. You should now have a working directory folder called **DscMetaConfigs**, containing the PowerShell DSC metaconfigurations for the machines to onboard (as an administrator).

    ```powershell
    Set-DscLocalConfigurationManager -Path ./DscMetaConfigs
    ```

### Generate DSC metaconfigurations using Azure Automation cmdlets

If PowerShell DSC LCM defaults match your use case and you want to
onboard machines to both pull from and report to Azure Automation State Configuration, you can generate the needed DSC metaconfigurations more simply using the Azure Automation cmdlets.

1. Open the PowerShell console or VSCode as an administrator on a machine in your local environment.
2. Connect to Azure Resource Manager using `Connect-AzAccount`
3. Download the PowerShell DSC metaconfigurations for the machines you want to onboard from the Automation account in which you are setting up nodes.

   ```powershell
   # Define the parameters for Get-AzAutomationDscOnboardingMetaconfig using PowerShell Splatting
   $Params = @{
       ResourceGroupName = 'ContosoResources'; # The name of the Resource Group that contains your Azure Automation Account
       AutomationAccountName = 'ContosoAutomation'; # The name of the Azure Automation Account where you want a node on-boarded to
       ComputerName = @('web01', 'web02', 'sql01'); # The names of the computers that the meta configuration will be generated for
       OutputFolder = "$env:UserProfile\Desktop\";
   }
   # Use PowerShell splatting to pass parameters to the Azure Automation cmdlet being invoked
   # For more info about splatting, run: Get-Help -Name about_Splatting
   Get-AzAutomationDscOnboardingMetaconfig @Params
   ```

1. You should now have a folder called **DscMetaConfigs**, containing the PowerShell DSC metaconfigurations for the machines to onboard (as an administrator).

    ```powershell
    Set-DscLocalConfigurationManager -Path $env:UserProfile\Desktop\DscMetaConfigs
    ```

## Onboarding securely using registration

Machines can securely onboard to an Azure Automation account through the WMF 5 DSC registration protocol. This protocol allows a DSC node to authenticate to a PowerShell DSC pull or report server, including Azure Automation State Configuration. The node registers with the server at the registration URL and authenticates using a registration key. During registration, the DSC node and DSC pull/report server negotiate a unique certificate for the node to use for authentication to the server post-registration. This process prevents onboarded nodes from
impersonating one another, for example, if a node is compromised and behaving maliciously. After registration, the registration key is not used for authentication again, and is deleted from the node.

You can get the information required for the State Configuration registration protocol from **Keys** under **Account Settings** in the Azure portal. 

![Azure automation keys and URL](./media/automation-dsc-onboarding/DSC_Onboarding_4.png)

- Registration URL is the URL field on the Keys page.
- Registration key is the value of the **Primary access key** field or the **Secondary access key** field on the Keys page. Either key can be used.

For added security, you can regenerate the primary and secondary access keys of an Automation account at any time on the Keys page. Key regeneration prevents future node registrations from using previous keys.

## Re-registering a node

After registering a machine as a DSC node in Azure Automation State Configuration, there are several reasons why you might need to re-register that node in the future.

- **Certificate renewal.** For versions of Windows Server before Windows Server 2019, each node automatically negotiates a unique certificate for authentication that expires after one year. If a certificate expires without renewal, the node is unable to communicate with Azure Automation and is marked `Unresponsive`. Currently, the PowerShell DSC registration protocol can't automatically renew certificates when they are nearing expiration, and you must re-register the nodes after a year's time. Before re-registering, ensure that each node is running WMF 5 RTM. 

    Re-registration performed 90 days or less from the certificate expiration time, or at any point after the certificate expiration time, results in a new certificate being generated and used. A resolution to this issue is included in Windows Server 2019 and later.

- **Changes to DSC LCM values.** You might need to change [PowerShell DSC LCM values](/powershell/scripting/dsc/managing-nodes/metaConfig4) set during initial registration of the node, for example, `ConfigurationMode`. Currently, you can only change these DSC agent values through re-registration. The one exception is the Node Configuration value assigned to the node. You can change this in Azure Automation DSC directly.

You can re-register a node in the same way that you registered the node initially, using any of the onboarding methods described in this document. You do not need to unregister a node from Azure Automation State Configuration before re-registering it.

## Troubleshooting Azure virtual machine onboarding

Azure Automation State Configuration lets you easily onboard Azure Windows VMs for configuration management. Under the hood, the Azure VM Desired State Configuration extension is used to register the VM with Azure Automation State Configuration. Since the Azure VM Desired State Configuration extension runs asynchronously, tracking its progress and troubleshooting its execution can be important.

> [!NOTE]
> Any method of onboarding an Azure Windows VM to Azure Automation State Configuration that uses the Azure VM Desired State Configuration extension can take up to an hour for Azure Automation to show it as registered. This delay is due to the installation of WMF 5 on the VM by the Azure VM Desired State Configuration extension, which is required to onboard the VM to Azure Automation State Configuration.

To troubleshoot or view the status of the Azure VM Desired State Configuration extension:

1. In the Azure portal, navigate to the VM being onboarded.
2. Click **Extensions** under **Settings**. 
3. Now select **DSC** or **DSCForLinux**, depending on your operating system. 
4. For more details, you can click **View detailed status**.

For more information on troubleshooting, see [Troubleshooting issues with Azure Automation Desired State Configuration (DSC)](./troubleshoot/desired-state-configuration.md).

## Next steps

- To get started, see [Getting started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compiling configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/az.automation#automation).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Usage Example: Continuous deployment to virtual machines Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md).
