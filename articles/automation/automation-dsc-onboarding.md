---
title: Enable Azure Automation State Configuration
description: This article tells how to set up machines for management with Azure Automation State Configuration.
services: automation
ms.service: azure-automation
ms.subservice: desired-state-config
ms.topic: how-to
ms.date: 08/20/2024
ms.custom:
---

# Enable Azure Automation State Configuration

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

This article describes how you can set up your machines for management with Azure Automation State
Configuration. For details of this service, see
[Azure Automation State Configuration overview][17].

## Enable Azure VMs

Azure Automation State Configuration lets you easily enable Azure VMs for configuration management,
using the Azure portal, Azure Resource Manager templates, or PowerShell. The Azure VM Desired State
Configuration extension registers the VM with Azure Automation State Configuration automatically.
Since the Azure extension runs asynchronously, steps to track its progress are provided in
[Check status of VM setup][11].

> [!NOTE]
> Deploying DSC to a Linux node uses the **/tmp** folder. Modules such as `nxautomation` are
> temporarily downloaded for verification before installing them in their appropriate locations. To
> ensure that modules install correctly, the Log Analytics agent for Linux needs read/write
> permissions on the **/tmp** folder. The Log Analytics agent for Linux runs as the `omsagent` user.
> To grant >write permission to the `omsagent` user, run the command
> `setfacl -m u:omsagent:rwx /tmp`.

### Enable a VM using Azure portal

To enable an Azure VM to State Configuration through the [Azure portal][24]:

1. Navigate to the Azure Automation account in which to enable VMs.
1. On the State Configuration page, select the **Nodes** tab, then select **Add**.
1. Choose a VM to enable.
1. If the machine doesn't have the PowerShell desired state extension installed and the power state
   is running, select **Connect**.
1. Under **Registration**, enter the [PowerShell DSC Local Configuration Manager values][00]
   required for your use case. Optionally, you can enter a node configuration to assign to the VM.

![enabling VM][02]

### Enable a VM using Azure Resource Manager templates

You can install and enable a VM for State Configuration using Azure Resource Manager templates. See
[Server managed by Desired State Configuration service][21] for an example template that enables an
existing VM for State Configuration. If you're managing a virtual machine scale set, see the
example template in [Virtual machine scale set configuration managed by Azure Automation][22].

### Enable machines using PowerShell

You can use the [Register-AzAutomationDscNode][09] cmdlet in PowerShell to enable VMs for State Configuration.

> [!NOTE]
> The `Register-AzAutomationDscNode` cmdlet is implemented currently only for machines running
> Windows, as it triggers just the Windows extension.

### Register VMs across Azure subscriptions

The best way to register VMs from other Azure subscriptions is to use the DSC extension in an Azure
Resource Manager deployment template. Examples are provided in
[Desired State Configuration extension with Azure Resource Manager templates][04].

## Use DSC metaconfiguration to register hybrid machines

You can enable machines securely for an Azure Automation account through the DSC metaconfiguration.
The protocols implemented in DSC use information from the metaconfiguration to authenticate to Azure
Automation State Configuration. The node registers with the service at the registration URL and
authenticates using a registration key. During registration, the DSC node and DSC service negotiate
a unique certificate for the node to use for authentication to the server post-registration. This
process prevents enabled nodes from impersonating one another, for example, if a node is compromised
and behaving maliciously. After registration, the registration key isn't used for authentication
again, and is deleted from the node.

You can get the information required for the State Configuration registration protocol from **Keys**
under **Account Settings** in the Azure portal.

![Azure automation keys and URL][01]

- Registration URL is the URL field on the Keys page.
- Registration key is the value of the **Primary access key** field or the **Secondary access key**
  field on the Keys page. Either key can be used.

For added security, you can regenerate the primary and secondary access keys of an Automation
account at any time on the Keys page. Key regeneration prevents future node registrations from using
previous keys.

### Generate DSC metaconfigurations

To enable any machine for State Configuration, you can generate a [DSC metaconfiguration][00]. This
configuration tells the DSC agent to pull from and/or report to Azure Automation State
Configuration. You can generate a DSC metaconfiguration for Azure Automation State Configuration
using either a PowerShell DSC configuration or the Azure Automation PowerShell cmdlets.

> [!NOTE]
> DSC metaconfigurations contain the secrets needed to enable a machine in an Automation account for
> management. Make sure to properly protect any DSC metaconfigurations you create, or delete them
> after use.

The [Local Configuration Manager][05] (LCM) controls proxy support for metaconfigurations. The LCM
runs on all target nodes and is responsible for calling the configuration resources that are
included in a DSC metaconfiguration script. You can include proxy support in a metaconfiguration by
including definitions of `ProxyURL` and `ProxyCredential` properties as needed in the
`ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks. An example of
the URL setting is `ProxyURL = "http://172.16.3.6:3128";`. The `ProxyCredential` property is set to
a `PSCredential` object, as described in [Manage credentials in Azure Automation][25].

### Generate DSC metaconfigurations using a DSC configuration

1. Open a text editor, such as Visual Studio Code (VS Code), as an administrator on a machine in
   your local environment. The machine must have the latest version of [WMF 5][19] installed.
1. Copy the following script locally. This script contains a PowerShell DSC configuration for
   creating metaconfigurations, and a command to kick off the metaconfiguration creation.

   > [!NOTE]
   > State Configuration Node Configuration names are case-sensitive in the Azure portal. If the
   > case is mismatched, the node will not show up under the **Nodes** tab.

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

1. Fill in the registration key and URL for your Automation account, and the names of the
   machines to enable. All other parameters are optional. To find the registration key and
   registration URL for your Automation account, see
   [Use DSC metaconfiguration to register hybrid machines][13].

1. If you want the machines to report DSC status information to Azure Automation State
   Configuration, but not pull configuration or PowerShell modules, set the `ReportOnly` parameter
   to true.

1. If `ReportOnly` isn't set, the machines report DSC status information to Azure Automation State
   Configuration and pull configuration or PowerShell modules. Set parameters accordingly in the
   `ConfigurationRepositoryWeb`, `ResourceRepositoryWeb`, and `ReportServerWeb` blocks.

1. Run the script. You should now have a working directory folder called **DscMetaConfigs**,
   containing the PowerShell DSC metaconfigurations for the machines to enable (as an
   administrator).

   ```powershell
   Set-DscLocalConfigurationManager -Path ./DscMetaConfigs
   ```

### Generate DSC metaconfigurations using Azure Automation cmdlets

You can generate the DSC metaconfigurations using the Azure Automation cmdlets under the following
conditions:

- The LCM defaults match your use case
- You want to enable machines to both pull from and report to Azure Automation State Configuration

Use the following steps to generate the metaconfigurations:

1. Open the PowerShell console or VS Code as an administrator on a machine in your local environment.
1. Connect to Azure Resource Manager using [Connect-AzAccount][07].
1. Download the PowerShell DSC metaconfigurations for the machines you want to enable from the
   Automation account in which you're setting up nodes.

   ```powershell
   # Define the parameters for Get-AzAutomationDscOnboardingMetaconfig using PowerShell Splatting
   $Params = @{
       ResourceGroupName = 'ContosoResources' # The Resource Group that contains your Azure Automation account
       AutomationAccountName = 'ContosoAutomation'; # The Azure Automation account where you want to onboard the node
       ComputerName = @('web01', 'web02', 'sql01'); # The computers to generate the metaconfigurations for
       OutputFolder = "$env:UserProfile\Desktop\";
   }
   # Use PowerShell splatting to pass parameters to the Azure Automation cmdlet being invoked
   # For more info about splatting, run: Get-Help -Name about_Splatting
   Get-AzAutomationDscOnboardingMetaconfig @Params
   ```

1. You should now have a **DscMetaConfigs** folder containing the PowerShell DSC metaconfigurations
   for the machines to enable (as an administrator).

   ```powershell
   Set-DscLocalConfigurationManager -Path $env:UserProfile\Desktop\DscMetaConfigs
   ```

### Enable physical/virtual Windows machines

You can enable Windows servers running on-premises or in other cloud environments (including AWS EC2
instances) to Azure Automation State Configuration. The servers must have
[outbound access to Azure][18].

1. Make sure that the latest version of [WMF 5][19] is installed on the machines to enable for State
   Configuration. In addition, WMF 5 must be installed on the computer that you're using for
   enabling the machines.
1. To create a folder containing the required DSC metaconfigurations, follow the directions in
   [Generate DSC metaconfigurations][12].
1. Use the following cmdlet to apply the PowerShell DSC metaconfigurations remotely to the machines
   to enable.

   ```powershell
   Set-DscLocalConfigurationManager -Path C:\Users\joe\Desktop\DscMetaConfigs -ComputerName MyServer1, MyServer2
   ```

1. If you can't apply the PowerShell DSC metaconfigurations remotely, copy the
   **metaconfigurations** folder to the machines that you're enabling. Then add code to call
   [Set-DscLocalConfigurationManager][10] locally on the machines.
1. Using the Azure portal or cmdlets, verify that the machines appear as State Configuration nodes
   registered in your Azure Automation account.

### Enable physical/virtual Linux machines

You can enable Linux servers running on-premises or in other cloud environments for State
Configuration. The servers must have [outbound access to Azure][18].

1. Make sure that the latest version of [PowerShell Desired State Configuration for Linux][23] is
   installed on the machines to enable for State Configuration.
1. If the [PowerShell DSC Local Configuration Manager defaults][06] match your use case, and you
   want to enable machines so that they both pull from and report to State Configuration:

   - On each Linux machine to enable, use `Register.py` to enable the machine with the PowerShell
     DSC Local Configuration Manager defaults.

     `/opt/microsoft/dsc/Scripts/Register.py <Automation account registration key> <Automation account registration URL>`

   - To find the registration key and registration URL for your Automation account, see
     [Use DSC metaconfiguration to register hybrid machines][13].

1. If the PowerShell DSC Local Configuration Manager (LCM) defaults don't match your use case, or
   you want to enable machines that only report to Azure Automation State Configuration, follow
   steps 4-7. Otherwise, proceed directly to step 7.

1. Follow the directions in [Generate DSC metaconfigurations][12] section to produce a folder
   containing the required DSC metaconfigurations.

1. Make sure that the latest version of [WMF 5][19] is installed on the computer being used to
   enable your machines for State Configuration.

1. Add code as follows to apply the PowerShell DSC metaconfigurations remotely to the machines to
   enable.

   ```powershell
   $SecurePass = ConvertTo-SecureString -String '<root password>' -AsPlainText -Force
   $Cred = New-Object System.Management.Automation.PSCredential 'root', $SecurePass
   $Opt = New-CimSessionOption -UseSsl -SkipCACheck -SkipCNCheck -SkipRevocationCheck
   # need a CimSession for each Linux machine to onboard
   $Session = New-CimSession -Credential $Cred -ComputerName <your Linux machine> -Port 5986 -Authentication basic -SessionOption $Opt
   Set-DscLocalConfigurationManager -CimSession $Session -Path C:\Users\joe\Desktop\DscMetaConfigs
   ```

1. If you can't apply the PowerShell DSC metaconfigurations remotely, copy the metaconfigurations
   corresponding to the remote machines from the folder described in step 4 to the Linux machines.

1. Add code to call `Set-DscLocalConfigurationManager.py` locally on each Linux machine to enable
   for State Configuration.

   `/opt/microsoft/dsc/Scripts/SetDscLocalConfigurationManager.py -configurationmof <path to metaconfiguration file>`

1. Ensure that the machines show up as DSC nodes registered in your Azure Automation account. You
   can use the Azure portal or the cmdlets.

## Re-register a node

After you register a machine as a DSC node in Azure Automation State Configuration, there are
several reasons why you might need to re-register that node in the future.

- **Certificate renewal.** For versions of Windows Server before Windows Server 2019, each node
  automatically negotiates a unique certificate for authentication that expires after one year. If a
  certificate expires without renewal, the node is unable to communicate with Azure Automation and
  is marked `Unresponsive`. Currently, the PowerShell DSC registration protocol can't automatically
  renew certificates when they're nearing expiration, and you must re-register the nodes after a
  year's time. Before re-registering, ensure that each node is running WMF 5 RTM.

  A new certificate is generated and used if you re-register 90 days or less from the certificate
  expiration time or at any point after the certificate expiration time. This issue is fixed in
  Windows Server 2019 and later.

- **Changes to DSC LCM values.** You might need to change [PowerShell DSC LCM values][06] set during
  initial registration of the node, for example, `ConfigurationMode`. Currently, you can only change
  these DSC agent values through re-registration. The one exception is the Node Configuration value.
  You can change this value in Azure Automation DSC directly.

You can re-register a node just as you registered the node initially, using any of the methods
described in this document. You don't need to unregister a node from Azure Automation State
Configuration before re-registering it.

## Check status of VM setup

State Configuration lets you easily enable Azure Windows VMs for configuration management. Under the
hood, the Azure VM Desired State Configuration extension is used to register the VM with Azure
Automation State Configuration. Since the Azure VM Desired State Configuration extension runs
asynchronously, tracking its progress and troubleshooting its execution can be important.

> [!NOTE]
> Any method of enabling Azure Windows VMs for State Configuration that uses the Azure VM Desired
> State Configuration extension can take up to an hour for Azure Automation to show VMs as
> registered. This delay is due to the installation of WMF 5 on the VM by the Azure VM Desired State
> Configuration extension, which is required to enable VMs for State Configuration.

To view the status of the Azure VM Desired State Configuration extension:

1. In the Azure portal, navigate to the VM being enabled.
2. Select **Extensions** under **Settings**.
3. Now select **DSC** or **DSCForLinux**, depending on your operating system.
4. For more details, you can select **View detailed status**.

## Next steps

- To get started, see [Get started with Azure Automation State Configuration][16].
- To learn about compiling DSC configurations so that you can assign them to target nodes, see
  [Compile DSC configurations in Azure Automation State Configuration][15].
- For a PowerShell cmdlet reference, see [Az.Automation][08].
- For pricing information, see [Azure Automation State Configuration pricing][20].
- For an example of using Azure Automation State Configuration in a continuous deployment pipeline,
  see [Set up continuous deployment with Chocolatey][14].
- For troubleshooting information, see [Troubleshoot Azure Automation State Configuration][03].

<!-- link references -->
[00]: /powershell/dsc/managing-nodes/metaConfig
[01]: ./media/automation-dsc-onboarding/DSC_Onboarding_4.png
[02]: ./media/automation-dsc-onboarding/DSC_Onboarding_6.png
[03]: ./troubleshoot/desired-state-configuration.md
[04]: /azure/virtual-machines/extensions/dsc-template
[05]: /powershell/dsc/managing-nodes/metaconfig
[06]: /powershell/dsc/managing-nodes/metaConfig4
[07]: /powershell/module/Az.Accounts/Connect-AzAccount
[08]: /powershell/module/az.automation
[09]: /powershell/module/az.automation/register-azautomationdscnode
[10]: /powershell/module/psdesiredstateconfiguration/set-dsclocalconfigurationmanager
[11]: #check-status-of-vm-setup
[12]: #generate-dsc-metaconfigurations
[13]: #use-dsc-metaconfiguration-to-register-hybrid-machines
[14]: automation-dsc-cd-chocolatey.md
[15]: automation-dsc-compile.md
[16]: automation-dsc-getting-started.md
[17]: automation-dsc-overview.md
[18]: automation-dsc-overview.md#network-planning
[19]: https://aka.ms/wmf5latest
[20]: https://azure.microsoft.com/pricing/details/automation/
[21]: https://azure.microsoft.com/resources/templates/automation-configuration/
[22]: https://azure.microsoft.com/resources/templates/vmss-automation-dsc/
[23]: https://github.com/Microsoft/PowerShell-DSC-for-Linux
[24]: https://portal.azure.com/
[25]: shared-resources/credentials.md
