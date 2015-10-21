<properties 
   pageTitle="Onboarding physical and virtual machines for management by Azure Automation DSC | Microsoft Azure" 
   description="How to setup machines for management with Azure Automation DSC" 
   services="automation" 
   documentationCenter="dev-center-name" 
   authors="coreyp-at-msft" 
   manager="stevenka" 
   editor="tysonn"/>

<tags
   ms.service="automation"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="TBD" 
   ms.date="10/07/2015"
   ms.author="coreyp"/>

# Onboarding machines for management by Azure Automation DSC

## Why manage machines with Azure Automation DSC?

Like [PowerShell Desired State Configuration](https://technet.microsoft.com/library/dn249912.aspx), Azure Automation Desired State Configuration is a simple, yet powerful, configuration management service for DSC nodes (physical and virtual machines) in any cloud or on-premises datacenter. It enables scalability across thousands of machines quickly and easily from a central, secure location. You can easily onboard machines, assign them declarative configurations, and view reports showing each machine’s compliance to the desired state you specified. The Azure Automation DSC management layer is to DSC what the Azure Automation management layer is to PowerShell scripting. In other words, in the same way that Azure Automation helps you manage Powershell scripts, it also helps you manage DSC configurations To learn more about the benefits of using Azure Automation DSC, see [Azure Automation DSC overview](automation-dsc-overview/). 

Azure Automation DSC can be used to manage a variety of machines:

*    Azure virtual machines (classic)
*    Azure virtual machines
*    Physical / virtual Windows machines on-premises, or in a cloud other than Azure
*    Physical / virtual Linux machines on-premises, in Azure, or in a cloud other than Azure

The following sections outline how you can onboard each type of machine to Azure Automation DSC.

## Azure virtual machines (classic)

With Azure Automation DSC, you can easily onboard Azure virtual machines (classic) for configuration management using either the Azure portal, or PowerShell. Under the hood, and without an administrator having to remote into the VM, the Azure VM Desired State Configuration extension registers the VM with Azure Automation DSC. Since the Azure VM Desired State Configuration extension runs asynchronously, steps to track its progress or troubleshoot it are provided in the <a href="#troubleshooting-azure-virtual-machine-onboarding">**Troubleshooting Azure virtual machine onboarding**</a> section below.


### Azure virtual machines

In the [Azure preview portal](http://portal.azure.com/), click **Browse** -> **Virtual machines (classic)**. Select the Windows VM you want to onboard. On the virtual machine’s dashboard blade, click **All settings** -> **Extensions** -> **Add** -> **Azure Automation DSC** -> **Create**. Enter the [PowerShell DSC Local Configuration Manager values](https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396) required for your use case, your Automation account’s registration key and registration URL, and optionally a node configuration to assign to the VM.

![](./media/automation-dsc-onboarding/DSC_Onboarding_1.png)


To find the registration URL and key for the Automation account to onboard the machine to, see the <a href="#secure-registration">**Secure registration**</a> section below.

### PowerShell

    # log in to both Azure Service Management and Azure Resource Manager
    Add-AzureAccount
    Login-AzureRmAccount
    
    # fill in correct values for your VM / Automation Account here
    $VMName = ""
    $ServiceName = ""
    $AutomationAccountName = ""
    $AutomationAccountResourceGroup = ""

    # fill in the name of a Node Configuration in Azure Automation DSC, for this VM to conform to
    $NodeConfigName = ""

    # get Azure Automation DSC registration info
    $Account = Get-AzureRmAutomationAccount -ResourceGroupName $AutomationAccountResourceGroup -Name $AutomationAccountName
    $RegistrationInfo = $Account | Get-AzureRmAutomationRegistrationInfo

    # use the DSC extension to onboard the VM for management with Azure Automation DSC
    $VM = Get-AzureVM -Name $VMName -ServiceName $ServiceName
    
    $PublicConfiguration = ConvertTo-Json -Depth 8 @{
      SasToken = ""
      ModulesUrl = "https://eus2oaasibizamarketprod1.blob.core.windows.net/automationdscpreview/RegistrationMetaConfigV2.zip"
      ConfigurationFunction = "RegistrationMetaConfigV2.ps1\RegistrationMetaConfigV2"

    # update these DSC agent Local Configuration Manager defaults if they do not match your use case.
    # See https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396 for more details
    Properties = @{
       RegistrationKey = @{
         UserName = 'notused'
         Password = 'PrivateSettingsRef:RegistrationKey'
    }
      RegistrationUrl = $RegistrationInfo.Endpoint
      NodeConfigurationName = $NodeConfigName
      ConfigurationMode = "ApplyAndMonitor"
      ConfigurationModeFrequencyMins = 15
      RefreshFrequencyMins = 30
      RebootNodeIfNeeded = $False
      ActionAfterReboot = "ContinueConfiguration"
      AllowModuleOverwrite = $False
      }
    }

    $PrivateConfiguration = ConvertTo-Json -Depth 8 @{
      Items = @{
         RegistrationKey = $RegistrationInfo.PrimaryKey
      }
    }
    
    $VM = Set-AzureVMExtension `
     -VM $vm `
     -Publisher Microsoft.Powershell `
     -ExtensionName DSC `
     -Version 2.6 `
     -PublicConfiguration $PublicConfiguration `
     -PrivateConfiguration $PrivateConfiguration
     -ForceUpdate

    $VM | Update-AzureVM

## Azure virtual machines

Azure Automation DSC lets you easily onboard Azure virtual machines for configuration management, using either the Azure portal, Azure Resource Manager templates, or PowerShell. Under the hood, and without an administrator having to remote into the VM, the Azure VM Desired State Configuration extension registers the VM with Azure Automation DSC. Since the Azure VM Desired State Configuration extension runs asynchronously, steps to track its progress or troubleshoot it are provided in the <a href="#troubleshooting-azure-virtual-machine-onboarding">**Troubleshooting Azure virtual machine onboarding**</a> section below.


### Azure portal

In the [Azure preview portal](http://portal.azure.com/), navigate to the Azure Automation account where you want to onboard virtual machines. On the Automation account dashboard, click **DSC Nodes** -> **Add Azure VM**.

Under **Select virtual machines to onboard**, select one or more Azure virtual machines to onboard.

![](./media/automation-dsc-onboarding/DSC_Onboarding_2.png)


Under **Configure registration data**, enter the [PowerShell DSC Local Configuration Manager values](https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396) required for your use case, and optionally a node configuration to assign to the VM.

![](./media/automation-dsc-onboarding/DSC_Onboarding_3.png)

 
### Azure Resource Manager templates

Azure virtual machines can be deployed and onboarded to Azure Automation DSC via Azure Resource Manager templates. See [Configure a VM via DSC extension and Azure Automation DSC](http://azure.microsoft.com/documentation/templates/dsc-extension-azure-automation-pullserver/) for an example template that onboards an existing VM to Azure Automation DSC. To find the registration key and registration URL taken as input in this template, see the <a href="#secure-registration">**Secure registration**</a> section below.

### PowerShell

The [Register-AzureRmAutomationDscNode](https://msdn.microsoft.com/library/mt244097.aspx?f=255&MSPPError=-2147217396) cmdlet can be used to onboard virtual machines in the Azure preview portal via PowerShell.

### Physical / virtual Windows machines on-premises, or in a cloud other than Azure

On-premises Windows machines and Windows machines in non-Azure clouds (such as Amazon Web Services) can also be onboarded to Azure Automation DSC, as long as they have outbound access to the internet, via a few simple steps:

1. Make sure the latest version of [WMF 5](http://www.microsoft.com/en-us/download/details.aspx?id=48729) is installed on the machines you want to onboard to Azure Automation DSC.

2. Open the PowerShell console or PowerShell ISE as an administrator in a machine in your local environment. This machine must also have the latest version of WMF 5 installed.

3. Connect to Azure Resource Manager using the Azure PowerShell module:
        `Login-AzureRmAccount`

4. Download, from the Automation account you want to onboard nodes to, the PowerShell DSC metaconfigurations for the machines you want to onboard:

	`Get-AzureRmAutomationDscOnboardingMetaconfig -ResourceGroupName MyResourceGroup -AutomationAccountName      		MyAutomationAccount -ComputerName MyServer1, MyServer2 -OutputFolder C:\Users\joe\Desktop`

5. Optionally, view and update the metaconfigurations in the output folder as needed to match the [PowerShell DSC Local Configuration Manager fields and values](https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396) you want, if the defaults do not match your use case.

6. Remotely apply the PowerShell DSC metaconfiguration to the machines you want to onboard:

	`Set-DscLocalConfigurationManager -Path C:\Users\joe\Desktop\DscMetaConfigs -ComputerName MyServer1, MyServer2`

7. If you cannot apply the PowerShell DSC metaconfigurations remotely, copy the output folder from step 4 onto each machine to onboard. Then call Set-DscLocalConfigurationManager locally on each machine to onboard.

8. Using the Azure portal or cmdlets, check that the machines to onboard now show up as DSC nodes registered in your Azure Automation account.

### Physical / virtual Linux machines on-premises, in Azure, or in a cloud other than Azure

On-premises Linux machines, Linux machines in Azure, and Linux machines in non-Azure clouds can also be onboarded to Azure Automation DSC, as long as they have outbound access to the internet, via a few simple steps:

1. Make sure the latest version of the [DSC Linux agent](http://www.microsoft.com/en-us/download/details.aspx?id=49150) is installed on the machines you want to onboard to Azure Automation DSC.

2. If the [PowerShell DSC Local Configuration Manager defaults](https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396) match your use case:

	*    On each Linux machine to onboard to Azure Automation DSC, use Register.py to onboard using the PowerShell DSC Local Configuration Manager defaults:

		`/opt/microsoft/dsc/Scripts/Register.py <Automation account registration key> <Automation account registration URL>`

	*    To find the registration key and registration URL for your Automation account, see the <a href="#secure-registration">**Secure registration**</a> section below.

	If the PowerShell DSC Local Configuration Manager defaults **do** **not** match your use case, follow steps 3 - 9. Otherwise, proceed directly to step 9.

3. Open the PowerShell console or PowerShell ISE as an administrator on a Windows machine in your local environment. This machine must have the latest version of [WMF 5](http://www.microsoft.com/en-us/download/details.aspx?id=48729) installed.

4. Connect to Azure Resource Manager using the Azure PowerShell module:

	`Login-AzureRmAccount`

5.  Download, from the Automation account you want to onboard nodes to, the PowerShell DSC metaconfigurations for the machines you want to onboard:
	
	`Get-AzureRmAutomationDscOnboardingMetaconfig -ResourceGroupName MyResourceGroup -AutomationAccountName MyAutomationAccount -ComputerName MyServer1, MyServer2 -OutputFolder C:\Users\joe\Desktop_`

6.  Optionally, view and update the metaconfigurations in the output folder as needed to match the [PowerShell DSC Local Configuration Manager fields and values](http://https://technet.microsoft.com/library/dn249922.aspx?f=255&MSPPError=-2147217396) you want, if the defaults do not match your use case.

7.  Remotely apply the PowerShell DSC metaconfiguration to the machines you want to onboard:
    	
    	$SecurePass = ConvertTo-SecureString -string "<root password>" -AsPlainText -Force
        $Cred = New-Object System.Management.Automation.PSCredential "root", $SecurPass
        $Opt = New-CimSessionOption -UseSs1:$true -SkipCACheck:$true -SkipCNCheck:$true -SkipRevocationCheck:$true

        # need a CimSession for each Linux machine to onboard
        
        $Session = New-CimSession -Credential:$Cred -ComputerName:<your Linux machine> -Port:5986 -Authentication:basic -SessionOption:$Opt
    	
    	Set-DscLocalConfigurationManager -CimSession $Session –Path C:\Users\joe\Desktop\DscMetaConfigs

8.  If you cannot apply the PowerShell DSC metaconfigurations remotely, for each Linux machine to onboard, copy the metaconfiguration corresponding to that machine from the folder in step 5 onto the Linux machine. Then call `SetDscLocalConfigurationManager.py` locally on each Linux machine you want to onboard to Azure Automation DSC:

	`/opt/microsoft/dsc/Scripts/SetDscLocalConfigurationManager.py –configurationmof <path to metaconfiguration file>`

9.  Using the Azure portal or cmdlets, check that the machines to onboard now show up as DSC nodes registered in your Azure Automation account.

##Secure registration

Machines can securely onboard to an Azure Automation account through the WMF 5 DSC registration protocol, which allows a DSC node to authenticate to a PowerShell DSC V2 Pull or Reporting server (including Azure Automation DSC). The node registers to the server at a **Registration URL**, authenticating using a **Registration key**. During registration, the DSC node and DSC Pull/Reporting server negotiate a unique certificate for this node to use for authentication to the server post-registration. This process prevents onboarded nodes from impersonating one another, such as if a node is compromised and behaving maliciously. After registration, the Registration key is not used for authentication again, and is deleted from the node.

You can get the information required for the DSC registration protocol from the **Manage Keys** blade in the Azure preview portal. Open this blade by clicking the key icon on the **Essentials** panel for the Automation account.

![](./media/automation-dsc-onboarding/DSC_Onboarding_4.png)

*    Registration URL is the URL field in the Manage Keys blade.
*    Registration key is the Primary Access Key or Secondary Access Key in the Manage Keys blade. Either key can be used.

For added security, the primary and secondary access keys of an Automation account can be regenerated at any time (on the **Manage Keys** blade) to prevent future node registrations using previous keys.

##Troubleshooting Azure virtual machine onboarding

Azure Automation DSC lets you easily onboard Azure Windows VMs for configuration management. Under the hood, the Azure VM Desired State Configuration extension is used to register the VM with Azure Automation DSC. Since the Azure VM Desired State Configuration extension runs asynchronously, tracking its progress and troubleshooting its execution may be important. 

>[AZURE.NOTE] Any method of onboarding an Azure Windows VM to Azure Automation DSC that uses the Azure VM Desired State Configuration extension could take up to an hour for the node to show up as registered in Azure Automation. This is due to the installation of Windows Management Framework 5.0 on the VM by the Azure VM DSC extension, which is required to onboard the VM to Azure Automation DSC.

To troubleshoot or view the status of the Azure VM Desired State Configuration extension, in the Azure preview portal navigate to the VM being onboarded, then click -> **All settings** -> **Extensions** -> **DSC**. For more details, you can click **View detailed status**.

[![](./media/automation-dsc-onboarding/DSC_Onboarding_5.png)](https://technet.microsoft.com/library/dn249912.aspx)

## Certificate expiration and reregistration

After registering, each node automatically negotiates a unique certificate for authentication that expires after one year. Currently, the PowerShell DSC registration protocol cannot automatically renew certificates when they are nearing expiration, so you need to reregister the nodes after a year’s time. Before reregistering, ensure that each node is running Windows Management Framework 5.0 RTM. If a node’s authentication certificate expires, and the node is not reregistered, the node will be unable to communicate with Azure Automation and will be marked ‘Unresponsive.’ Reregistration is performed in the same way you registered the node initially. Reregistration performed 90 days or less from the certificate expiration time, or at any point after the certificate expiration time, will result in a new certificate being generated and used.

## Related Articles
* [Azure Automation DSC overview](automation-dsc-overview.md)
* [Azure Automation DSC cmdlets](https://msdn.microsoft.com/library/mt244122.aspx)
* [Azure Automation DSC pricing](http://azure.microsoft.com/pricing/details/automation/)



