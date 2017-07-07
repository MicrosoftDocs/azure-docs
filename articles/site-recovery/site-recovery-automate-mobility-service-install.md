---
title: Deploy the Site Recovery Mobility service with Azure Automation DSC | Microsoft Docs
description: Describes how to use Azure Automation DSC to automatically deploy the Azure Site Recovery Mobility service and Azure agent for VMware VM and physical server replication to Azure
services: site-recovery
documentationcenter: ''
author: krnese
manager: lorenr
editor: ''

ms.assetid: 1f8cd3ac-0522-48eb-a5f0-679ee9192ddb
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: krnese

---
# Deploy the Mobility service with Azure Automation DSC for replication of VM
In Operations Management Suite, we provide you with a comprehensive backup and disaster recovery solution that you can use as part of your business continuity plan.

We started this journey together with Hyper-V by using Hyper-V Replica. But we have expanded to support a heterogeneous setup because customers have multiple hypervisors and platforms in their clouds.

If you are running VMware workloads and/or physical servers today, a management server runs all of the Azure Site Recovery components in your environment to handle the communication and data replication with Azure, when Azure is your destination.

## Deploy the Site Recovery Mobility service by using Automation DSC
Let's start by doing a quick breakdown of what this management server does.

The management server runs several server roles. One of these roles is *configuration*, which coordinates communication and manages data replication and recovery processes.

In addition, the *process* role acts as a replication gateway. This role receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and then sends it to an Azure storage account. One of the functions for the process role is also to push installation of the Mobility service to protected machines and perform automatic discovery of VMware VMs.

If there's a failback from Azure, the *master target* role will handle the replication data as part of this operation.

For the protected machines, we rely on the *Mobility service*. This component is deployed to every machine (VMware VM or physical server) that you want to replicate to Azure. It captures data writes on the machine and forwards them to the management server (process role).

When you're dealing with business continuity, it's important to understand your workloads, your infrastructure, and the components involved. You can then meet the requirements for your recovery time objective (RTO) and recovery point objective (RPO). In this context, the Mobility service is key to ensuring that your workloads are protected as you would expect.

So how can you, in an optimized way, ensure that you have a reliable protected setup with help from some Operations Management Suite components?

This article provides an example of how you can use Azure Automation Desired State Configuration (DSC), together with Site Recovery, to ensure that:

* The Mobility service and Azure VM agent are deployed to the Windows machines that you want to protect.
* The Mobility service and Azure VM agent are always running when Azure is the replication target.

## Prerequisites
* A repository to store the required setup
* A repository to store the required passphrase to register with the management server

  > [!NOTE]
  > A unique passphrase is generated for each management server. If you are going to deploy multiple management servers, you have to ensure that the correct passphrase is stored in the passphrase.txt file.
  >
  >
* Windows Management Framework (WMF) 5.0 installed on the machines that you want to enable for protection (a requirement for Automation DSC)

  > [!NOTE]
  > If you want to use DSC for Windows machines that have WMF 4.0 installed, see the section [Use DSC in disconnected environments](#Use DSC in disconnected environments).
  >
  >

The Mobility service can be installed through the command line and accepts several arguments. That’s why you need to have the binaries (after extracting them from your setup) and store them in a place where you can retrieve them by using a DSC configuration.

## Step 1: Extract binaries
1. To extract the files that you need for this setup, browse to the following directory on your management server:

    **\Microsoft Azure Site Recovery\home\svsystems\pushinstallsvc\repository**

    In this folder, you should see an MSI file named:

    **Microsoft-ASR_UA_version_Windows_GA_date_Release.exe**

    Use the following command to extract the installer:

    **.\Microsoft-ASR_UA_9.1.0.0_Windows_GA_02May2016_release.exe /q /x:C:\Users\Administrator\Desktop\Mobility_Service\Extract**
2. Select all files and send them to a compressed (zipped) folder.

You now have the binaries that you need to automate the setup of the Mobility service by using Automation DSC.

### Passphrase
Next, you need to determine where you want to place this zipped folder. You can use an Azure storage account, as shown later, to store the passphrase that you need for the setup. The agent will then register with the management server as part of the process.

The passphrase that you got when you deployed the management server can be saved to a text file as passphrase.txt.

Place both the zipped folder and the passphrase in a dedicated container in the Azure storage account.

![Folder location](./media/site-recovery-automate-mobilitysevice-install/folder-and-passphrase-location.png)

If you prefer to keep these files on a share on your network, you can do so. You just need to ensure that the DSC resource that you will be using later has access and can get the setup and passphrase.

## Step 2: Create the DSC configuration
The setup depends on WMF 5.0. For the machine to successfully apply the configuration through Automation DSC, WMF 5.0 needs to be present.

The environment uses the following example DSC configuration:

```powershell
configuration ASRMobilityService {

    $RemoteFile = 'https://knrecstor01.blob.core.windows.net/asr/ASR.zip'
    $RemotePassphrase = 'https://knrecstor01.blob.core.windows.net/asr/passphrase.txt'
    $RemoteAzureAgent = 'http://go.microsoft.com/fwlink/p/?LinkId=394789'
    $LocalAzureAgent = 'C:\Temp\AzureVmAgent.msi'
    $TempDestination = 'C:\Temp\asr.zip'
    $LocalPassphrase = 'C:\Temp\Mobility_service\passphrase.txt'
    $Role = 'Agent'
    $Install = 'C:\Program Files (x86)\Microsoft Azure Site Recovery'
    $CSEndpoint = '10.0.0.115'
    $Arguments = '/Role "{0}" /InstallLocation "{1}" /CSEndpoint "{2}" /PassphraseFilePath "{3}"' -f $Role,$Install,$CSEndpoint,$LocalPassphrase

    Import-DscResource -ModuleName xPSDesiredStateConfiguration

    node localhost {

        File Directory {
            DestinationPath = 'C:\Temp\ASRSetup\'
            Type = 'Directory'            
        }

        xRemoteFile Setup {
            URI = $RemoteFile
            DestinationPath = $TempDestination
            DependsOn = '[File]Directory'
        }

        xRemoteFile Passphrase {
            URI = $RemotePassphrase
            DestinationPath = $LocalPassphrase
            DependsOn = '[File]Directory'
        }

        xRemoteFile AzureAgent {
            URI = $RemoteAzureAgent
            DestinationPath = $LocalAzureAgent
            DependsOn = '[File]Directory'
        }

        Archive ASRzip {
            Path = $TempDestination
            Destination = 'C:\Temp\ASRSetup'
            DependsOn = '[xRemotefile]Setup'
        }

        Package Install {
            Path = 'C:\temp\ASRSetup\ASR\UNIFIEDAGENT.EXE'
            Ensure = 'Present'
            Name = 'Microsoft Azure Site Recovery mobility Service/Master Target Server'
            ProductId = '275197FC-14FD-4560-A5EB-38217F80CBD1'
            Arguments = $Arguments
            DependsOn = '[Archive]ASRzip'
        }

        Package AzureAgent {
            Path = 'C:\Temp\AzureVmAgent.msi'
            Ensure = 'Present'
            Name = 'Windows Azure VM Agent - 2.7.1198.735'
            ProductId = '5CF4D04A-F16C-4892-9196-6025EA61F964'
            Arguments = '/q /l "c:\temp\agentlog.txt'
            DependsOn = '[Package]Install'
        }

        Service ASRvx {
            Name = 'svagents'
            Ensure = 'Present'
            State = 'Running'
            DependsOn = '[Package]Install'
        }

        Service ASR {
            Name = 'InMage Scout Application Service'
            Ensure = 'Present'
            State = 'Running'
            DependsOn = '[Package]Install'
        }

        Service AzureAgentService {
            Name = 'WindowsAzureGuestAgent'
            Ensure = 'Present'
            State = 'Running'
            DependsOn = '[Package]AzureAgent'
        }

        Service AzureTelemetry {
            Name = 'WindowsAzureTelemetryService'
            Ensure = 'Present'
            State = 'Running'
            DependsOn = '[Package]AzureAgent'
        }
    }
}
```
The configuration will do the following:

* The variables will tell the configuration where to get the binaries for the Mobility service and the Azure VM agent, where to get the passphrase, and where to store the output.
* The configuration will import the xPSDesiredStateConfiguration DSC resource, so that you can use `xRemoteFile` to download the files from the repository.
* The configuration will create a directory where you want to store the binaries.
* The archive resource will extract the files from the zipped folder.
* The package Install resource will install the Mobility service from the UNIFIEDAGENT.EXE installer with the specific arguments. (The variables that construct the arguments need to be changed to reflect your environment.)
* The package AzureAgent resource will install the Azure VM agent, which is recommended on every VM that runs in Azure. The Azure VM agent also makes it possible to add extensions to the VM after failover.
* The service resource or resources will ensure that the related Mobility services and the Azure services are always running.

Save the configuration as **ASRMobilityService**.

> [!NOTE]
> Remember to replace the CSIP in your configuration to reflect the actual management server, so that the agent will be connected correctly and will use the correct passphrase.
>
>

## Step 3: Upload to Automation DSC
Because the DSC configuration that you made will import a required DSC resource module (xPSDesiredStateConfiguration), you need to import that module in Automation before you upload the DSC configuration.

Sign in to your Automation account, browse to **Assets** > **Modules**, and click **Browse Gallery**.

Here you can search for the module and import it to your account.

![Import module](./media/site-recovery-automate-mobilitysevice-install/search-and-import-module.png)

When you finish this, go to your machine where you have the Azure Resource Manager modules installed and proceed to import the newly created DSC configuration.

### Import cmdlets
In PowerShell, sign in to your Azure subscription. Modify the cmdlets to reflect your environment and capture your Automation account information in a variable:

```powershell
$AAAccount = Get-AzureRmAutomationAccount -ResourceGroupName 'KNOMS' -Name 'KNOMSAA'
```

Upload the configuration to Automation DSC by using the following cmdlet:

```powershell
$ImportArgs = @{
    SourcePath = 'C:\ASR\ASRMobilityService.ps1'
    Published = $true
    Description = 'DSC Config for Mobility Service'
}
$AAAccount | Import-AzureRmAutomationDscConfiguration @ImportArgs
```

### Compile the configuration in Automation DSC
Next, you need to compile the configuration in Automation DSC, so that you can start to register nodes to it. You achieve that by running the following cmdlet:

```powershell
$AAAccount | Start-AzureRmAutomationDscCompilationJob -ConfigurationName ASRMobilityService
```

This can take a few minutes, because you're basically deploying the configuration to the hosted DSC pull service.

After you compile the configuration, you can retrieve the job information by using PowerShell (Get-AzureRmAutomationDscCompilationJob) or by using the [Azure portal](https://portal.azure.com/).

![Retrieve job](./media/site-recovery-automate-mobilitysevice-install/retrieve-job.png)

You have now successfully published and uploaded your DSC configuration to Automation DSC.

## Step 4: Onboard machines to Automation DSC
> [!NOTE]
> One of the prerequisites for completing this scenario is that your Windows machines are updated with the latest version of WMF. You can download and install the correct version for your platform from the [Download Center](https://www.microsoft.com/download/details.aspx?id=50395).
>
>

You will now create a metaconfig for DSC that you will apply to your nodes. To succeed with this, you need to retrieve the endpoint URL and the primary key for your selected Automation account in Azure. You can find these values under **Keys** on the **All settings** blade for the Automation account.

![Key values](./media/site-recovery-automate-mobilitysevice-install/key-values.png)

In this example, you have a Windows Server 2012 R2 physical server that you want to protect by using Site Recovery.

### Check for any pending file rename operations in the registry
Before you start to associate the server with the Automation DSC endpoint, we recommend that you check for any pending file rename operations in the registry. They might prohibit the setup from finishing due to a pending reboot.

Run the following cmdlet to verify that there’s no pending reboot on the server:

```powershell
Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\' | Select-Object -Property PendingFileRenameOperations
```
If this shows empty, you are OK to proceed. If not, you should address this by rebooting the server during a maintenance window.

To apply the configuration on the server, start the PowerShell Integrated Scripting Environment (ISE) and run the following script. This is essentially a DSC local configuration that will instruct the Local Configuration Manager engine to register with the Automation DSC service and retrieve the specific configuration (ASRMobilityService.localhost).

```powershell
[DSCLocalConfigurationManager()]
configuration metaconfig {
    param (
        $URL,
        $Key
    )
    node localhost {
        Settings {
            RefreshFrequencyMins = '30'
            RebootNodeIfNeeded = $true
            RefreshMode = 'PULL'
            ActionAfterReboot = 'ContinueConfiguration'
            ConfigurationMode = 'ApplyAndMonitor'
            AllowModuleOverwrite = $true
        }

        ResourceRepositoryWeb AzureAutomationDSC {
            ServerURL = $URL
            RegistrationKey = $Key
        }

        ConfigurationRepositoryWeb AzureAutomationDSC {
            ServerURL = $URL
            RegistrationKey = $Key
            ConfigurationNames = 'ASRMobilityService.localhost'
        }

        ReportServerWeb AzureAutomationDSC {
            ServerURL = $URL
            RegistrationKey = $Key
        }
    }
}
metaconfig -URL 'https://we-agentservice-prod-1.azure-automation.net/accounts/<YOURAAAccountID>' -Key '<YOURAAAccountKey>'

Set-DscLocalConfigurationManager .\metaconfig -Force -Verbose
```

This configuration will cause the Local Configuration Manager engine to register itself with Automation DSC. It will also determine how the engine should operate, what it should do if there's a configuration drift (ApplyAndAutoCorrect), and how it should proceed with the configuration if a reboot is required.

After you run this script, the node should start to register with Automation DSC.

![Node registration in progress](./media/site-recovery-automate-mobilitysevice-install/register-node.png)

If you go back to the Azure portal, you can see that the newly registered node has now appeared in the portal.

![Registered node in the portal](./media/site-recovery-automate-mobilitysevice-install/registered-node.png)

On the server, you can run the following PowerShell cmdlet to verify that the node has been registered correctly:

```powershell
Get-DscLocalConfigurationManager
```

After the configuration has been pulled and applied to the server, you can verify this by running the following cmdlet:

```powershell
Get-DscConfigurationStatus
```

The output shows that the server has successfully pulled its configuration:

![Output](./media/site-recovery-automate-mobilitysevice-install/successful-config.png)

In addition, the Mobility service setup has its own log that can be found at *SystemDrive*\ProgramData\ASRSetupLogs.

That’s it. You have now successfully deployed and registered the Mobility service on the machine that you want to protect by using Site Recovery. DSC will make sure that the required services are always running.

![Successful deployment](./media/site-recovery-automate-mobilitysevice-install/successful-install.png)

After the management server detects the successful deployment, you can configure protection and enable replication on the machine by using Site Recovery.

## Use DSC in disconnected environments
If your machines aren’t connected to the Internet, you can still rely on DSC to deploy and configure the Mobility service on the workloads that you want to protect.

You can instantiate your own DSC pull server in your environment to essentially provide the same capabilities that you get from Automation DSC. That is, the clients will pull the configuration (after it's registered) to the DSC endpoint. However, another option is to manually push the DSC configuration to your machines, either locally or remotely.

Note that in this example, there's an added parameter for the computer name. The remote files are now located on a remote share that should be accessible by the machines that you want to protect. The end of the script enacts the configuration and then starts to apply the DSC configuration to the target computer.

### Prerequisites
Make sure that the xPSDesiredStateConfiguration PowerShell module is installed. For Windows machines where WMF 5.0 is installed, you can install the xPSDesiredStateConfiguration module by running the following cmdlet on the target machines:

```powershell
Find-Module -Name xPSDesiredStateConfiguration | Install-Module
```

You can also download and save the module in case you need to distribute it to Windows machines that have WMF 4.0. Run this cmdlet on a machine where PowerShellGet (WMF 5.0) is present:

```powershell
Save-Module -Name xPSDesiredStateConfiguration -Path <location>
```

Also for WMF 4.0, ensure that the [Windows 8.1 update KB2883200](https://www.microsoft.com/download/details.aspx?id=40749) is installed on the machines.

The following configuration can be pushed to Windows machines that have WMF 5.0 and WMF 4.0:

```powershell
configuration ASRMobilityService {
    param (
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [System.String] $ComputerName
    )

    $RemoteFile = '\\myfileserver\share\asr.zip'
    $RemotePassphrase = '\\myfileserver\share\passphrase.txt'
    $RemoteAzureAgent = '\\myfileserver\share\AzureVmAgent.msi'
    $LocalAzureAgent = 'C:\Temp\AzureVmAgent.msi'
    $TempDestination = 'C:\Temp\asr.zip'
    $LocalPassphrase = 'C:\Temp\Mobility_service\passphrase.txt'
    $Role = 'Agent'
    $Install = 'C:\Program Files (x86)\Microsoft Azure Site Recovery'
    $CSEndpoint = '10.0.0.115'
    $Arguments = '/Role "{0}" /InstallLocation "{1}" /CSEndpoint "{2}" /PassphraseFilePath "{3}"' -f $Role,$Install,$CSEndpoint,$LocalPassphrase

    Import-DscResource -ModuleName xPSDesiredStateConfiguration

    node $ComputerName {      
        File Directory {
            DestinationPath = 'C:\Temp\ASRSetup\'
            Type = 'Directory'            
        }

        xRemoteFile Setup {
            URI = $RemoteFile
            DestinationPath = $TempDestination
            DependsOn = '[File]Directory'
        }

        xRemoteFile Passphrase {
            URI = $RemotePassphrase
            DestinationPath = $LocalPassphrase
            DependsOn = '[File]Directory'
        }

        xRemoteFile AzureAgent {
            URI = $RemoteAzureAgent
            DestinationPath = $LocalAzureAgent
            DependsOn = '[File]Directory'
        }

        Archive ASRzip {
            Path = $TempDestination
            Destination = 'C:\Temp\ASRSetup'
            DependsOn = '[xRemotefile]Setup'
        }

        Package Install {
            Path = 'C:\temp\ASRSetup\ASR\UNIFIEDAGENT.EXE'
            Ensure = 'Present'
            Name = 'Microsoft Azure Site Recovery mobility Service/Master Target Server'
            ProductId = '275197FC-14FD-4560-A5EB-38217F80CBD1'
            Arguments = $Arguments
            DependsOn = '[Archive]ASRzip'
        }

        Package AzureAgent {
            Path = 'C:\Temp\AzureVmAgent.msi'
            Ensure = 'Present'
            Name = 'Windows Azure VM Agent - 2.7.1198.735'
            ProductId = '5CF4D04A-F16C-4892-9196-6025EA61F964'
            Arguments = '/q /l "c:\temp\agentlog.txt'
            DependsOn = '[Package]Install'
        }

        Service ASRvx {
            Name = 'svagents'
            State = 'Running'
            DependsOn = '[Package]Install'
        }

        Service ASR {
            Name = 'InMage Scout Application Service'
            State = 'Running'
            DependsOn = '[Package]Install'
        }

        Service AzureAgentService {
            Name = 'WindowsAzureGuestAgent'
            State = 'Running'
            DependsOn = '[Package]AzureAgent'
        }

        Service AzureTelemetry {
            Name = 'WindowsAzureTelemetryService'
            State = 'Running'
            DependsOn = '[Package]AzureAgent'
        }
    }
}
ASRMobilityService -ComputerName 'MyTargetComputerName'

Start-DscConfiguration .\ASRMobilityService -Wait -Force -Verbose
```

If you want to instantiate your own DSC pull server on your corporate network to mimic the capabilities that you can get from Automation DSC, see [Setting up a DSC web pull server](https://msdn.microsoft.com/powershell/dsc/pullserver?f=255&MSPPError=-2147217396).

## Optional: Deploy a DSC configuration by using an Azure Resource Manager template
This article has focused on how you can create your own DSC configuration to automatically deploy the Mobility service and the Azure VM Agent--and ensure that they are running on the machines that you want to protect. We also have an Azure Resource Manager template that will deploy this DSC configuration to a new or existing Azure Automation account. The template will use input parameters to create Automation assets that will contain the variables for your environment.

After you deploy the template, you can simply refer to step 4 in this guide to onboard your machines.

The template will do the following:

1. Use an existing Automation account or create a new one
2. Take input parameters for:
   * ASRRemoteFile--the location where you have stored the Mobility service setup
   * ASRPassphrase--the location where you have stored the passphrase.txt file
   * ASRCSEndpoint--the IP address of your management server
3. Import the xPSDesiredStateConfiguration PowerShell module
4. Create and compile the DSC configuration

All the preceding steps will happen in the right order, so that you can start onboarding your machines for protection.

The template, with instructions for deployment, is located on [GitHub](https://github.com/krnese/AzureDeploy/tree/master/OMS/MSOMS/DSC).

Deploy the template by using PowerShell:

```powershell
$RGDeployArgs = @{
    Name = 'DSC3'
    ResourceGroupName = 'KNOMS'
    TemplateFile = 'https://raw.githubusercontent.com/krnese/AzureDeploy/master/OMS/MSOMS/DSC/azuredeploy.json'
    OMSAutomationAccountName = 'KNOMSAA'
    ASRRemoteFile = 'https://knrecstor01.blob.core.windows.net/asr/ASR.zip'
    ASRRemotePassphrase = 'https://knrecstor01.blob.core.windows.net/asr/passphrase.txt'
    ASRCSEndpoint = '10.0.0.115'
    DSCJobGuid = [System.Guid]::NewGuid().ToString()
}
New-AzureRmResourceGroupDeployment @RGDeployArgs -Verbose
```

## Next steps
After you deploy the Mobility service agents, you can [enable replication](site-recovery-vmware-to-azure.md#enable-replication) for the virtual machines.
