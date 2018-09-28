---
title: Diagnostics in Azure Stack
description: How to collect log files for diagnostics in Azure Stack
services: azure-stack
author: jeffgilb
manager: femila
services: azure-stack
cloud: azure-stack

ms.service: azure-stack
ms.topic: article
ms.date: 09/27/2018
ms.author: jeffgilb
ms.reviewer: adshar
---
# Azure Stack diagnostics tools

Azure Stack is a large collection of components working together and interacting with each other. All these components  generate their own unique logs. This can make diagnosing issues a challenging task, especially for errors coming from multiple, interacting Azure Stack components. 

Our diagnostics tools help ensure the log collection mechanism is easy and efficient. The following diagram shows how log collection tools in Azure Stack work:

![Azure Stack diagnostic tools](media/azure-stack-diagnostics/get-azslogs.png)
 
 
## Trace Collector
 
The Trace Collector is enabled by default and runs continuously in the background to collect all Event Tracing for Windows (ETW) logs from Azure Stack component services. ETW logs are stored in a common local share with a five day age limit. Once this limit is reached, the oldest files are deleted as new ones are created. The default maximum size allowed for each file  is 200 MB. A size check occurs every 2 minutes, and if the current file is >= 200 MB, it is saved and a new file is generated. There is also an 8 GB limit on the total file size generated per event session. 

## Log collection tool
 
The PowerShell cmdlet **Get-AzureStackLog** can be used to collect logs from all the components  in an Azure Stack environment. It saves them in zip files in a user-defined location. If the Azure Stack technical support team needs your logs to help troubleshoot an issue, they may ask you to run this tool.

> [!CAUTION]
> These log files may contain personally identifiable information (PII). Take this into account before you publicly post any log files.
 
The following are some example log types that are collected:
*   **Azure Stack deployment logs**
*	**Windows event logs**
*	**Panther logs**
*	**Cluster logs**
*	**Storage diagnostic logs**
*	**ETW logs**

These files are collected and saved in a share by Trace Collector. The  **Get-AzureStackLog** PowerShell cmdlet can then be used to collect them when necessary.

### To run Get-AzureStackLog on Azure Stack integrated systems 
To run the log collection tool on an integrated system, you need to have access to the Privileged End Point (PEP). Here is an example script you can run using the PEP to collect logs on an integrated system:

```powershell
$ip = "<IP ADDRESS OF THE PEP VM>" # You can also use the machine name instead of IP here.
 
$pwd= ConvertTo-SecureString "<CLOUD ADMIN PASSWORD>" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("<DOMAIN NAME>\CloudAdmin", $pwd)
 
$shareCred = Get-Credential
 
$s = New-PSSession -ComputerName $ip -ConfigurationName PrivilegedEndpoint -Credential $cred

$fromDate = (Get-Date).AddHours(-8)
$toDate = (Get-Date).AddHours(-2)  #provide the time that includes the period for your issue
 
Invoke-Command -Session $s {    Get-AzureStackLog -OutputSharePath "<EXTERNAL SHARE ADDRESS>" -OutputShareCredential $using:shareCred  -FilterByRole Storage -FromDate $using:fromDate -ToDate $using:toDate}

if($s)
{
    Remove-PSSession $s
}
```

- The parameters **OutputSharePath** and **OutputShareCredential** are used to upload logs to an external shared folder.
- As shown in the previous example, the **FromDate** and **ToDate** parameters can be used to collect logs for a particular time period. This can come in handy for scenarios like collecting logs after applying an update package on an integrated system.


 
### To run Get-AzureStackLog on an Azure Stack Development Kit (ASDK) system
1. Sign in as **AzureStack\CloudAdmin** on the host.
2. Open a PowerShell window as an administrator.
3. Run the **Get-AzureStackLog** PowerShell cmdlet.

**Examples:**

  Collect all logs for all roles:

  ```powershell
  Get-AzureStackLog -OutputPath C:\AzureStackLogs
  ```

  Collect logs from VirtualMachines and BareMetal roles:

  ```powershell
  Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal
  ```

  Collect logs from VirtualMachines and BareMetal roles, with date filtering for log files for the past 8 hours:
    
  ```powershell
  Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal -FromDate (Get-Date).AddHours(-8)
  ```

  Collect logs from VirtualMachines and BareMetal roles, with date filtering for log files for the time period between 8 hours ago and 2 hours ago:

  ```powershell
  Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal -FromDate (Get-Date).AddHours(-8) -ToDate (Get-Date).AddHours(-2)
  ```

### Parameter considerations for both ASDK and integrated systems

- If the **FromDate** and **ToDate** parameters are not specified, logs are collected for the past four hours by default.
- Use the **FilterByNode** parameter to filter logs by computer name. For example:
```Get-AzureStackLog -OutputPath <path> -FilterByNode azs-xrp01```
- Use the **FilterByLogType** parameter to filter logs by type. You can choose to filter by File, Share or WindowsEvent. For example:
```Get-AzureStackLog -OutputPath <path> -FilterByLogType File```
- You can use the **TimeOutInMinutes** parameter to set the timeout for log collection. It is set to 150 (2.5 hours) by default.
- In version 1805 and later, dump file log collection is disabled by default. To enable it, use the **IncludeDumpFile** switch parameter. 
- Currently, you can use the **FilterByRole** parameter to filter log collection by the following roles:

 |   |   |   |    |
 | - | - | - | -  |   
 |ACS|Compute|InfraServiceController|QueryServiceCoordinator|
 |ACSBlob|CPI|Infrastructure|QueryServiceWorker|
 |ACSDownloadService|CRP|KeyVaultAdminResourceProvider|SeedRing|
 |ACSFabric|DatacenterIntegration|KeyVaultControlPlane|SeedRingServices|
 |ACSFrontEnd|DeploymentMachine|KeyVaultDataPlane|SLB|
 |ACSMetrics|DiskRP|KeyVaultInternalControlPlane|SlbVips|
 |ACSMigrationService|Domain|KeyVaultInternalDataPlane|SQL|
 |ACSMonitoringService|ECE|KeyVaultNamingService|SRP|
 |ACSSettingsService|EventAdminRP|MDM|Storage|
 |ACSTableMaster|EventRP|MetricsAdminRP|StorageAccounts|
 |ACSTableServer|ExternalDNS|MetricsRP|StorageController|
 |ACSWac|Fabric|MetricsServer|Tenant|
 |ADFS|FabricRing|MetricsStoreService|TraceCollector|
 |ApplicationController|FabricRingServices|MonAdminRP|URP|
 |ASAppGateway|FirstTierAggregationService|MonitoringAgent|Usage|
 |AzureBridge|FRP|MonRP|UsageBridge|
 |AzureMonitor|Gallery|NC|VirtualMachines|
 |AzureStackBitlocker|Gateway|Network|WAS|
 |BareMetal|HealthMonitoring|NonPrivilegedAppGateway|WASBootstrap|
 |BRP|HintingServiceV2|NRP|WASPUBLIC|
 |CA|HRP|OboService|WindowsDefender|
 |CacheService|IBC|OEM|     |
 |Cloud|IdentityProvider|OnboardRP|     |	
 |Cluster|iDns|PXE|     |
 |   |   |   |    |

### Additional considerations

* The command takes some time to run based on which role(s) the logs are collecting. Contributing factors also include the time duration specified for log collection, and the numbers of nodes in the Azure Stack environment.
* As log collection runs, check the new folder created in the **OutputSharePath** parameter specified in the command.
* Each role has its logs inside individual zip files. Depending on the size of the collected logs, a role may have its logs split in to multiple zip files. For such a role, if you want to have all the log files unzipped in to a single folder, use a tool that can  unzip in bulk (such as 7zip). Select all the zipped files for the role, and select **extract here**. This unzips all the log files for that role in a single merged folder.
* A file called **Get-AzureStackLog_Output.log** is also created in the folder that contains the zipped log files. This file is a log of the command output, which can be used for troubleshooting problems during log collection. Sometimes the log file includes `PS>TerminatingError` entries which can be safely ignored, unless expected log files are missing after log collection runs.
* To investigate a specific failure, logs may be needed from more than one component.
    -	System and Event logs for all infrastructure VMs are collected in the *VirtualMachines* role.
    -	System and Event logs for all hosts are collected in the *BareMetal* role.
    -	Failover Cluster and Hyper-V event logs are collected in the *Storage* role.
    -	ACS logs are collected in the *Storage* and *ACS* roles.

> [!NOTE]
> Size and age limits are enforced on the logs collected as it is essential to ensure efficient utilization of your storage space to ensure it doesn't get flooded with logs. However, when diagnosing a problem you sometimes need logs that might not exist anymore because of these limits. Thus, it is **highly recommended** that you offload your logs to an external storage space (a storage account in Azure, an additional on-prem storage device etc.) every 8 to 12 hours and keep them there for 1 - 3 months, depending on your requirements. Also, ensure this storage location is encrypted.

## Next steps
[Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md)

