---
title: Standard version of Azure VM extension for SAP solutions | Microsoft Docs
description: Learn how to deploy the Std VM Extension for SAP.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: OliverDoll
manager: juergent
editor: ''
tags: azure-resource-manager
ms.custom: devx-track-azurecli, devx-track-azurepowershell
keywords: ''
ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/22/2021
ms.author: oldoll
---

# Standard Version of Azure VM extension for SAP solutions
[new-extension]:vm-extension-for-sap-new.md (New Version of Azure VM extension for SAP solutions)
[configure-windows]:vm-extension-for-sap-standard.md#cb095b34-51c9-41f3-aeed-30a16072a1dc (Configure the Azure VM extension for SAP solutions with PowerShell)
[configure-linux]:vm-extension-for-sap-standard.md#c691e304-3524-4bfd-8612-992d5715a689 (Configure the Azure VM extension for SAP solutions with Azure CLI)
[configure-proxy]:deployment-guide.md#baccae00-6f79-4307-ade4-40292ce4e02d 
[troubleshoot-windows]:vm-extension-for-sap-standard.md#f566b77e-5427-451b-b4ca-6b93114d51e8 (Troubleshooting for Windows)
[troubleshoot-linux]:vm-extension-for-sap-standard.md#a4dae567-e7fd-4d4b-8279-510b8e5fae4a (Troubleshooting for Linux)
[healthcheck]:vm-extension-for-sap-standard.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1 (Health check for the Azure Extension for SAP configuration)
[deployment-guide-4.1]:vm-extension-for-sap-standard.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 (Deploying Azure PowerShell cmdlets)
[deploy-cli]:vm-extension-for-sap-standard.md#1ded9453-1330-442a-86ea-e0fd8ae8cab3 (Deploying Azure CLI)
[deployment-guide-figure-1000]:media/virtual-machines-shared-sap-deployment-guide/1000-service-properties.png
[deployment-guide-figure-1100]:media/virtual-machines-shared-sap-deployment-guide/1100-azperflib.png
[azure-cli-2]:/cli/azure/install-azure-cli
[msdn-set-Azvmaemextension]:/powershell/module/az.compute/set-azvmaemextension
[deployment-guide-figure-900]:media/virtual-machines-shared-sap-deployment-guide/900-cmd-update-executed.png
[readiness-check]:vm-extension-for-sap-standard.md#6b2561a0-b476-4579-847d-6c68117eb26e (Readiness check)
[deployment-guide-2.2]:deployment-guide.md#42ee2bdb-1efc-4ec7-ab31-fe4c22769b94 (SAP resources)
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[deployment-guide-figure-1300]:media/virtual-machines-shared-sap-deployment-guide/1300-cmd-test-executed.png
[deployment-guide-figure-1400]:media/virtual-machines-shared-sap-deployment-guide/1400-azperflib-error-servicenotstarted.png
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[deployment-guide-contact-support]:vm-extension-for-sap-standard.md#3ba34cfc-c9bb-4648-9c3c-88e8b9130ca2 (Troubleshooting Azure Extension for SAP - Contact Support)
[deployment-guide-run-the-script]:vm-extension-for-sap-standard.md#0d2847ad-865d-4a4c-a405-f9b7baaa00c7 (Troubleshooting Azure Extension for SAP - Run the setup script)
[deployment-guide-redeploy-after-sysprep]:vm-extension-for-sap-standard.md#2cd61f22-187d-42ed-bb8c-def0c983d756 (Troubleshooting Azure Extension for SAP - Redeploy after sysprep)
[deployment-guide-fix-internet-connection]:vm-extension-for-sap-standard.md#e92bc57d-80d9-4a2b-a2f4-16713a22ad89 ( Troubleshooting Azure Extension for SAP - Fix internet connection)



## Prerequisites

> [!NOTE]
> General Support Statement:
> Support for the Azure Extension for SAP is provided through SAP support channels.
> If you need assistance with the Azure VM extension for SAP solutions, please open a support case with SAP Support
  
> [!NOTE]
> Make sure to uninstall the VM extension before switching between the standard and the new version of the Azure Extension for SAP.

> [!NOTE]
> There are two versions of the VM extension. This article covers the **standard** version of the Azure VM extension for SAP. For guidance on how to install the new version, see [New Version of Azure VM extension for SAP solutions][new-extension].


### <a name="604bcec2-8b6e-48d2-a944-61b0f5dee2f7"></a>Deploy Azure PowerShell cmdlets

Follow the steps described in the article [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell)

Check frequently for updates to the PowerShell cmdlets, which usually are updated monthly. Follow the steps described in [this](/powershell/azure/install-az-ps#update-the-azure-powershell-module) article. Unless stated otherwise in SAP Note [1928533] or SAP Note [2015553], we recommend that you work with the latest version of Azure PowerShell cmdlets.

To check the version of the Azure PowerShell cmdlets that are installed on your computer, run this PowerShell command:

```powershell
(Get-Module Az.Compute).Version
```

### <a name="1ded9453-1330-442a-86ea-e0fd8ae8cab3"></a>Deploy Azure CLI

Follow the steps described in the article [Install the Azure CLI](/cli/azure/install-azure-cli)

Check frequently for updates to Azure CLI, which usually is updated monthly.

To check the version of Azure CLI that is installed on your computer, run this command:

```console
az --version
```


## <a name="cb095b34-51c9-41f3-aeed-30a16072a1dc"></a>Configure the Azure VM extension for SAP solutions with PowerShell 
 
To install the Azure Extension for SAP by using PowerShell:

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet. For more information, see [Deploying Azure PowerShell cmdlets][deployment-guide-4.1]
1. Run the following PowerShell cmdlet. For a list of available environments, run cmdlet `Get-AzEnvironment`. If you want to use global Azure, your environment is **AzureCloud**. For Microsoft Azure operated by 21Vianet, select **AzureChinaCloud**. 
   ```powershell
   $env = Get-AzEnvironment -Name <name of the environment>
   Connect-AzAccount -Environment $env
   Set-AzContext -SubscriptionName <subscription name>
   
   Set-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name> 
   ``` 
After you enter your account data, the script deploys the required extensions and enables the required features. This can take several minutes.
For more information about `Set-AzVMAEMExtension`, see [Set-AzVMAEMExtension][msdn-set-Azvmaemextension].

![Successful execution of SAP-specific Azure cmdlet Set-AzVMAEMExtension][deployment-guide-figure-900]

The `Set-AzVMAEMExtension` configuration does all the steps to configure host data collection for SAP.

The script output includes the following information:

* Confirmation that data collection for the OS disk and all additional data disks has been configured.
* The next two messages confirm the configuration of Storage Metrics for a specific storage account.
* One line of output gives the status of the actual update of the VM Extension for SAP configuration.
* Another line of output confirms that the configuration has been deployed or updated.
* The last line of output is informational. It shows your options for testing the VM Extension for SAP configuration.
* To check that all steps of Azure VM Extension for SAP configuration have been executed successfully, and that the Azure Infrastructure provides the necessary data, proceed with the readiness check for the Azure Extension for SAP, as described in [Readiness check][readiness-check].
* Wait 15-30 minutes for Azure Diagnostics to collect the relevant data.

## <a name="c691e304-3524-4bfd-8612-992d5715a689"></a>Configure the Azure VM extension for SAP solutions with Azure CLI
 
To install the Azure VM Extension for SAP by using Azure CLI:

1. Make sure that you have installed the latest version of the Azure CLI. For more information, see [Deploy Azure CLI][deploy-cli] 

1. Sign in with your Azure account:
   ```azurecli
   az login
   ```

1. Install the Azure CLI AEM Extension. Ensure that you use version 0.2.2 or later.
   ```azurecli
   az extension add --name aem
   ```

1. Enable the extension: 
   ```azurecli
   az vm aem set -g <resource-group-name> -n <vm name> 
   ```

1. Verify that the Azure Extension for SAP is active on the Azure Linux VM. Check whether the file /var/lib/AzureEnhancedMonitor/PerfCounters exists. If it exists, at a command prompt, run this command to display information collected by the Azure Extension for SAP:

   ```console
   cat /var/lib/AzureEnhancedMonitor/PerfCounters
   ```

   The output looks like this:

   ```output
   ...
   2;cpu;Current Hw Frequency;;0;2194.659;MHz;60;1444036656;saplnxmon;
   2;cpu;Max Hw Frequency;;0;2194.659;MHz;0;1444036656;saplnxmon;
   ...
   ```

## Update the configuration of Azure extension for SAP

Update the configuration of Azure Extension for SAP in any of the following scenarios:
* The joint Microsoft/SAP team extends the capabilities of the VM extension and requests more or fewer counters.
* Microsoft introduces a new version of the underlying Azure infrastructure that delivers the  data, and the Azure Extension for SAP needs to be adapted to those changes.
* You mount additional data disks to your Azure VM or you remove a data disk. In this scenario, update the collection of storage-related data. Changing your configuration by adding or deleting endpoints or by assigning IP addresses to a VM does not affect the extension configuration.
* You change the size of your Azure VM, for example, from size A5 to any other VM size.
* You add new network interfaces to your Azure VM.

To update settings, update configuration of Azure Extension for SAP by following the steps in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows].

## <a name="564adb4f-5c95-4041-9616-6635e83a810b"></a>Checks and troubleshooting

After you have deployed your Azure VM and set up the relevant Azure Extension for SAP, check whether all the components of the extension are working as expected.

Run the readiness check for the Azure Extension for SAP as described in [Readiness check][readiness-check]. If all readiness check results are positive and all relevant performance counters appear OK, Azure Extension for SAP has been set up successfully. You can proceed with the installation of SAP Host Agent as described in the SAP Notes in [SAP resources][deployment-guide-2.2]. If the readiness check indicates that counters are missing, run the health check for the Azure Extension for SAP, as described in [Health check for the Azure Extension for SAP configuration][healthcheck]. For more troubleshooting options, see [Troubleshooting for Windows][troubleshoot-windows] or [Troubleshooting for Linux][troubleshoot-linux].

### <a name="6b2561a0-b476-4579-847d-6c68117eb26e"></a>Readiness check

This check makes sure that all performance metrics that appear inside your SAP application are provided by the underlying Azure Extension for SAP.

#### Run the readiness check on a Windows VM
 
1. Sign in to the Azure virtual machine (using an admin account is not necessary).
1. Open a Command Prompt window.
1. At the command prompt, change the directory to the installation folder of the Azure Extension for SAP:
   C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\&lt;version>\\drop

   The *version* in the path to the extension might vary. If you see folders for multiple versions of the extension in the installation folder, check the configuration of the AzureEnhancedMonitoring Windows service, and then switch to the folder indicated as *Path to executable*.

   ![Properties of service running the Azure Extension for SAP][deployment-guide-figure-1000]

1. At the command prompt, run **azperflib.exe** without any parameters.

   > [!NOTE]
   > Azperflib.exe runs in a loop and updates the collected counters every 60 seconds. To end the loop, close the Command Prompt window.
   >
   >

If the Azure Extension for SAP is not installed, or the AzureEnhancedMonitoring service is not running, the extension has not been configured correctly. For detailed information about how to troubleshoot the extension, see [Troubleshooting for Windows][troubleshoot-windows] or [Troubleshooting for Linux][troubleshoot-linux].

> [!NOTE]
> The Azperflib.exe is a component that can't be used for own purposes. It is a component which delivers Azure infrastructure data related to the VM for the SAP Host Agent exclusively.
> 
##### Check the output of azperflib.exe
 
Azperflib.exe output shows all populated Azure performance counters for SAP. At the bottom of the list of collected counters, a summary and health indicator show the status of Azure Extension for SAP.

![Output of health check by executing azperflib.exe, which indicates that no problems exist][deployment-guide-figure-1100]
<a name="figure-11"></a>

Check the result returned for the **Counters total** output, which is reported as empty, and for **Health status**, shown in the preceding figure.

Interpret the resulting values as follows:

| Azperflib.exe result values | Azure Extension for SAP health status |
| --- | --- |
| **API Calls - not available** | Counters that are not available might be either not applicable to the virtual machine configuration, or are errors. See **Health status**. |
| **Counters total - empty** |The following two Azure storage counters can be empty: <ul><li>Storage Read Op Latency Server msec</li><li>Storage Read Op Latency E2E msec</li></ul>All other counters must have values. |
| **Health status** |Only OK if return status shows **OK**. |
| **Diagnostics** |Detailed information about health status. |

If the **Health status** value is not **OK**, follow the instructions in [Health check for the Azure Extension for SAP configuration][healthcheck].
 
##### Run the readiness check on a Linux VM

1. Connect to the Azure Virtual Machine by using SSH.
1. Check the output of the Azure Extension for SAP.

   a.  Run `more /var/lib/AzureEnhancedMonitor/PerfCounters`

   **Expected result**: Returns list of performance counters. The file should not be empty.

   b. Run `cat /var/lib/AzureEnhancedMonitor/PerfCounters | grep Error`

   **Expected result**: Returns one line where the error is **none**, for example, **3;config;Error;;0;0;none;0;1456416792;tst-servercs;**

   c. Run `more /var/lib/AzureEnhancedMonitor/LatestErrorRecord`

   **Expected result**: Returns as empty or does not exist.

If the preceding check was not successful, run these additional checks:

1. Make sure that the waagent is installed and enabled.

   a.  Run `sudo ls -al /var/lib/waagent/`

     **Expected result**: Lists the content of the waagent directory.

   b.  Run `ps -ax | grep waagent`

   **Expected result**: Displays one entry similar to: `python /usr/sbin/waagent -daemon`

1. Make sure that the Azure Extension for SAP is installed and running.

   a.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-*/'`

   **Expected result**: Lists the content of the Azure Extension for SAP directory.

   b. Run `ps -ax | grep AzureEnhanced`

   **Expected result**: Displays one entry similar to: `python /var/lib/waagent/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux-2.0.0.2/handler.py daemon`

1. Install SAP Host Agent as described in SAP Note [1031096], and check the output of `saposcol`.

   a.  Run `/usr/sap/hostctrl/exe/saposcol -d`

   b.  Run `dump ccm`

   c.  Check whether the **Virtualization_Configuration\Enhanced Monitoring Access** metric is **true**.

If you already have an SAP NetWeaver ABAP application server installed, open transaction ST06 and check whether monitoring is enabled.

If any of these checks fail, and for detailed information about how to redeploy the extension, see [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].

## <a name="e2d592ff-b4ea-4a53-a91a-e5521edb6cd1"></a>Health checks

If some of the infrastructure data is not delivered correctly as indicated by the tests described in [Readiness check][readiness-check], run the health checks described in this chapter to check whether the Azure infrastructure and the Azure Extension for SAP are configured correctly.

### Health checks using PowerShell

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet, as described in [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Run the following PowerShell cmdlet. For a list of available environments, run the cmdlet `Get-AzEnvironment`. To use global Azure, select the **AzureCloud** environment. For Microsoft Azure operated by 21Vianet, select **AzureChinaCloud**.

   ```powershell
   $env = Get-AzEnvironment -Name <name of the environment>
   Connect-AzAccount -Environment $env
   Set-AzContext -SubscriptionName <subscription name>
   Test-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
   ```

1. The script tests the configuration of the virtual machine you select.

   ![Output of successful test of the Azure Extension for SAP][deployment-guide-figure-1300]

Make sure that every health check result is **OK**. If some checks do not display **OK**, run the update cmdlet as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows]. Wait 15 minutes, and repeat the checks described in [Readiness check][readiness-check] and this chapter. If the checks still indicate a problem with some or all counters, see [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].

> [!Note]
> You can experience some warnings in cases where you use Managed Standard Azure Disks. Warnings will be displayed instead of the tests returning "OK". This is normal and intended in case of that disk type. See also [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].
>

### Health checks using Azure CLI

To run the health check for the Azure VM Extension for SAP by using Azure CLI:
 
1. Install [Azure CLI 2.0][azure-cli-2]. Ensure that you use at least version 2.19.1 or later (use the latest version). 
1. Sign in with your Azure account:
   ```azurecli
   az login
   ```

1. Install the Azure CLI AEM Extension. Ensure that you use version 0.2.2 or later.
   ```azurecli
   az extension add --name aem
   ```

1. Verify the installation of the extension: 
   ```azurecliw
   az vm aem verify -g <resource-group-name> -n <vm name> 
   ```
The script tests the configuration of the virtual machine you select.

Make sure that every health check result is **OK**. If some checks do not display **OK**, run the update cmdlet as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows]. Wait 15 minutes, and repeat the checks described in [Readiness check][readiness-check] and this chapter. If the checks still indicate a problem with some or all counters, see [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].

## <a name="f566b77e-5427-451b-b4ca-6b93114d51e8"></a>Troubleshooting for Windows
 
### Azure performance counters do not show up at all
The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. If the service has not been installed correctly or if it is not running in your VM, no performance metrics can be collected.
 
#### The installation directory of the Azure Extension for SAP is empty

##### Issue
The installation directory C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\<version>\drop is empty.

##### Solution
The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine or rerun the `Set-AzVMAEMExtension` configuration script.

#### Service for Azure Extension for SAP does not exist

##### Issue

The AzureEnhancedMonitoring Windows service does not exist.

Azperflib.exe output throws an error:

![Execution of azperflib.exe indicates that the service of the Azure Extension for SAP is not running][deployment-guide-figure-1400]
<a name="figure-14"></a>
 
##### Solution

If the service does not exist, the Azure Extension for SAP has not been installed correctly. Redeploy the extension as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows].

After you deployed the extension, check again whether the Azure performance counters are provided in the Azure VM.

#### Service for Azure Extension for SAP exists, but fails to start
##### Issue
The AzureEnhancedMonitoring Windows service exists and is enabled, but fails to start. For more information, check the application event log.
##### Solution
The configuration is incorrect. Restart the Azure Extension for SAP in the VM, as described in Configure the Azure Extension for SAP.
 
### Some Azure performance counters are missing
The AzureEnhancedMonitoring Windows service collects performance metrics in Azure. The service gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Diagnostics. Storage counters are used from your logging on the storage subscription level.

If troubleshooting by using SAP Note [1999351] doesn't resolve the issue, rerun the `Set-AzVMAEMExtension` configuration script. You might have to wait an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

## <a name="a4dae567-e7fd-4d4b-8279-510b8e5fae4a"></a>Troubleshooting for Linux

### Azure performance counters do not show up at all
Performance metrics in Azure are collected by a daemon. If the daemon is not running, no performance metrics can be collected.

#### The installation directory of the Azure Extension for SAP is empty
##### Issue
The directory \\var\\lib\\waagent\\ does not have a subdirectory for the Azure Extension for SAP.
##### Solution
The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine and/or rerun the `Set-AzVMAEMExtension` configuration script.

#### The execution of Set-AzVMAEMExtension and Test-AzVMAEMExtension show warning messages stating that Standard Managed Disks are not supported
##### Issue
When executing Set-AzVMAEMExtension or Test-AzVMAEMExtension messages like these are shown:

<pre><code>
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
WARNING: [WARN] Standard Managed Disks are not supported. Extension will be installed but no disk metrics will be available.
</code></pre>

Executing azperfli.exe as described earlier you can get a result that is indicating a non-healthy state.

##### Solution
The messages are caused by the fact that Standard Managed Disks are not delivering the APIs used by the SAP Extension for SAP to check on statistics of the Standard Azure Storage Accounts. This is not a matter of concern. Reason for introducing the collecting data for Standard Disk Storage accounts was throttling of inputs and outputs that occurred frequently. Managed disks will avoid such throttling by limiting the number of disks in a storage account. Therefore, not having that type of that data is not critical.

### Some Azure performance counters are missing

Performance metrics in Azure are collected by a daemon, which gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Diagnostics. Storage counters come from the logs in your storage subscription.

For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Azure Extension for SAP.

If troubleshooting by using SAP Note [1999351] does not resolve the issue, rerun the `Set-AzVMAEMExtension` configuration script as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows]. You might have to wait for an hour because storage analytics or diagnostics counters might not be created immediately after they are enabled. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine.

## Azure extension error codes

| Error ID | Error description | Solution |
|---|---|---|
| <a name="cfg_018"></a>cfg/018 | App configuration is missing. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_019"></a>cfg/019 | No deployment ID in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_020"></a>cfg/020 | No RoleInstanceId in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_022"></a>cfg/022 | No RoleInstanceId in app config. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_031"></a>cfg/031 | Cannot read Azure configuration. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_021"></a>cfg/021 | App configuration file is missing. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_015"></a>cfg/015 | No VM size in app config. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_016"></a>cfg/016 | GlobalMemoryStatusEx counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_023"></a>cfg/023 | MaxHwFrequency counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_024"></a>cfg/024 | NIC counters failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_025"></a>cfg/025 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_026"></a>cfg/026 | Processor name counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_027"></a>cfg/027 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_038"></a>cfg/038 | The metric 'Disk type' is missing in the extension configuration file config.xml. 'Disk type' along with some other counters was introduced in v2.2.0.68 12/16/2015. If you deployed the extension prior to 12/16/2015, it uses the old configuration file. The Azure extension framework automatically upgrades the extension to a newer version, but the config.xml remains unchanged. To update the configuration, download and execute the latest PowerShell setup script. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_039"></a>cfg/039 | No disk caching. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_036"></a>cfg/036 | No disk SLA throughput. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_037"></a>cfg/037 | No disk SLA IOPS. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_028"></a>cfg/028 | Disk mapping counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_029"></a>cfg/029 | Last hardware change counter failed. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_030"></a>cfg/030 | NIC counters failed | [contact support][deployment-guide-contact-support] |
| <a name="cfg_017"></a>cfg/017 | Due to sysprep of the VM your Windows SID has changed. | [redeploy after sysprep][deployment-guide-redeploy-after-sysprep] |
| <a name="str_007"></a>str/007 | Access to the storage analytics failed. <br /><br />As population of storage analytics data on a newly created VM may need up to half an hour,  the error might disappear after some time. If the error still appears, re-run the setup script. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_010"></a>str/010 | No Storage Analytics counters. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_009"></a>str/009 | Storage Analytics failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_004"></a>wad/004 | Bad WAD configuration. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_002"></a>wad/002 | Unexpected WAD format. | [contact support][deployment-guide-contact-support] |
| <a name="wad_001"></a>wad/001 | No WAD counters found. | [run setup script][deployment-guide-run-the-script] |
| <a name="wad_040"></a>wad/040 | Stale WAD counters found. | [contact support][deployment-guide-contact-support] |
| <a name="wad_003"></a>wad/003 | Cannot read WAD table. There is no connection to WAD table. There can be several causes of this:<br /><br /> 1) outdated configuration <br />2) no network connection to Azure <br />3) issues with WAD setup | [run setup script][deployment-guide-run-the-script]<br />[fix internet connection][deployment-guide-fix-internet-connection]<br />[contact support][deployment-guide-contact-support] |
| <a name="prf_011"></a>prf/011 | Perfmon NIC metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_012"></a>prf/012 | Perfmon disk metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_013"></a>prf/013 | Some prefmon metrics failed. | [contact support][deployment-guide-contact-support] |
| <a name="prf_014"></a>prf/014 | Perfmon failed to create a counter. | [contact support][deployment-guide-contact-support] |
| <a name="cfg_035"></a>cfg/035 | No metric providers configured. | [contact support][deployment-guide-contact-support] |
| <a name="str_006"></a>str/006 | Bad Storage Analytics config. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_032"></a>str/032 | Storage Analytics metrics failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="cfg_033"></a>cfg/033 | One of the metric providers failed. | [run setup script][deployment-guide-run-the-script] |
| <a name="str_034"></a>str/034 | Provider thread failed. | [contact support][deployment-guide-contact-support] |

### Detailed guidelines on solutions provided

#### <a name="0d2847ad-865d-4a4c-a405-f9b7baaa00c7"></a>Run the setup script

Follow the steps in chapter [Configure the Azure Extension for SAP][configure-windows] in this guide to install the extension again. Note that some counters might need up to 30 minutes for provisioning.

If the errors do not disappear, [contact support][deployment-guide-contact-support].

#### <a name="3ba34cfc-c9bb-4648-9c3c-88e8b9130ca2"></a>Contact Support

Unexpected error or there is no known solution. Collect the AzureEnhancedMonitoring_service.log file located in the folder C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\drop (Windows) or /var/log/azure/Microsoft.OSTCExtensions.AzureEnhancedMonitorForLinux (Linux) and contact SAP support for further assistance.

#### <a name="2cd61f22-187d-42ed-bb8c-def0c983d756"></a>Redeploy after sysprep

If you plan to build a generalized sysprepped OS image (which can include SAP software), it is recommended that this image does not include the Azure extension for SAP. You should install the Azure extension for SAP after the new instance of the generalized OS image has been deployed.

However, if your generalized and sysprepped OS image already contains the Azure Extension for SAP, you can apply the following workaround to reconfigure the extension, on the newly deployed VM instance:

* On the newly deployed VM instance delete the content of the following folders:  
  C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\RuntimeSettings
  C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.AzureCATExtensionHandler\\\<version\>\Status

* Follow the steps in chapter [Configure the Azure Extension for SAP][configure-windows] in this guide to install the extension again.

#### <a name="e92bc57d-80d9-4a2b-a2f4-16713a22ad89"></a>Fix internet connection

The  Microsoft Azure Virtual Machine running the Azure extension for SAP requires access to the Internet. If this Azure VM is part of an Azure Virtual Network or of an on-premises domain, make sure that the relevant proxy settings are set. These settings must also be valid for the LocalSystem account to access the Internet. Follow chapter [Configure the proxy][configure-proxy] in this guide.

In addition, if you need to set a static IP address for your Azure VM, do not set it manually inside the Azure VM, but set it using [Azure PowerShell](../../virtual-network/ip-services/virtual-networks-static-private-ip-arm-ps.md), [Azure CLI](../../virtual-network/ip-services/virtual-networks-static-private-ip-arm-cli.md) [Azure portal](../../virtual-network/ip-services/virtual-networks-static-private-ip-arm-pportal.md). The static IP is propagated via the Azure DHCP service.

Manually setting a static IP address inside the Azure VM is not supported, and might lead to problems with the Azure extension for SAP.


## Next steps
* [Azure Virtual Machines deployment for SAP NetWeaver](./deployment-guide.md)
* [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
