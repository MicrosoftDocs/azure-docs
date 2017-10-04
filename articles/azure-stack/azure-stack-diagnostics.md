---
title: Diagnostics in Azure Stack
description: How to collect log files for diagnostics in Azure Stack
services: azure-stack
author: adshar
manager: byronr
services: azure-stack
cloud: azure-stack

ms.service: azure-stack
ms.topic: article
ms.date: 10/2/2017
ms.author: adshar

---
# Azure Stack diagnostics tools

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*
 
Azure Stack is a large collection of components working together and interacting with each other. All these components  generate their own unique logs. This can make diagnosing issues a challenging task, especially for errors coming from multiple interacting Azure Stack components. 

Our diagnostics tools help ensure the log collection mechanism is easy and efficient. The following diagram shows how log collection tools in Azure Stack work:

![Log collection tools](media/azure-stack-diagnostics/image01.png)
 
 
## Trace Collector
 
The Trace Collector is enabled by default. It continuously runs in the background and collects all Event Tracing for Windows (ETW) logs from component services on Azure Stack and stores them on a common local share. 

The following are important things to know about the Trace Collector:
 
* The Trace Collector runs continuously with default size limits. The default maximum size allowed for each file (200 MB) is **not** a cutoff size. A size check occurs periodically (currently every 2 minutes) and if the current file is >= 200 MB, it is saved and a new file is generated. There is also an 8 GB (configurable) limit on the total file size generated per event session. Once this limit is reached, the oldest files are deleted as new ones are created.
* There is a 5-day age limit on the logs. This limit is also configurable. 
* Each component defines the trace configuration properties through a JSON file. The JSON files are stored in `C:\TraceCollector\Configuration`. If necessary, these files can be edited to change the age and size limits of the collected logs. Changes to these files require a restart of the *Microsoft Azure Stack Trace Collector* service for the changes to take effect.
* The following example is a trace configuration JSON file for FabricRingServices Operations from the XRP VM: 

```
{
    "LogFile": 
    {
        "SessionName": "FabricRingServicesOperationsLogSession",
        "FileName": "\\\\SU1FileServer\\SU1_ManagementLibrary_1\\Diagnostics\\FabricRingServices\\Operations\\AzureStack.Common.Infrastructure.Operations.etl",
        "RollTimeStamp": "00:00:00",
        "MaxDaysOfFiles": "5",
        "MaxSizeInMB": "200",
        "TotalSizeInMB": "5120"
    },
    "EventSources":
    [
        {"Name": "Microsoft-AzureStack-Common-Infrastructure-ResourceManager" },
        {"Name": "Microsoft-OperationManager-EventSource" },
        {"Name": "Microsoft-Operation-EventSource" }
    ]
}
```

* **MaxDaysOfFiles**

    This parameter controls the age of files to keep. Older log files are deleted.
* **MaxSizeInMB**

    This parameter controls the size threshold for a single file. If the size is reached, a new .etl file is created.
* **TotalSizeInMB**

    This parameter controls the total size of the .etl files generated from an event session. If the total file size is greater than this parameter value, older files are deleted.
  
## Log collection tool
 
The PowerShell command `Get-AzureStackLog` can be used to collect logs from all the components  in an Azure Stack environment. It saves them in zip files in a user-defined location. If our technical support team needs your logs to help troubleshoot an issue, they may ask you to run this tool.

> [!CAUTION]
> These log files may contain personally identifiable information (PII). Take this into account before you publicly post any log files.
 
The following are some example log types that are collected:
*   **Azure Stack deployment logs**
*	**Windows event logs**
*	**Panther logs**

   To troubleshoot VM creation issues:
*	**Cluster logs**
*	**Storage diagnostic logs**
*	**ETW logs**

These files are collected by the Trace Collector and stored in a share from where `Get-AzureStackLog` retrieves them.
 
**To run Get-AzureStackLog on an Azure Stack Development Kit (ASDK) system**
1.	Log in as AzureStack\AzureStackAdmin on the host.
2.	Open a PowerShell window as an administrator.
3.	Run `Get-AzureStackLog`.  

    **Examples**

    - Collect all logs for all roles:

        `Get-AzureStackLog -OutputPath C:\AzureStackLogs`

    - Collect logs from VirtualMachines and BareMetal roles:

        `Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal`

    - Collect logs from VirtualMachines and BareMetal roles, with date filtering for log files for the past 8 hours:

        `Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal -FromDate (Get-Date).AddHours(-8)`

    - Collect logs from VirtualMachines and BareMetal roles, with date filtering for log files for the time period between 8 hours ago and 2 hours ago:

      `Get-AzureStackLog -OutputPath C:\AzureStackLogs -FilterByRole VirtualMachines,BareMetal -FromDate (Get-Date).AddHours(-8) -ToDate (Get-Date).AddHours(-2)`

**To run Get-AzureStackLog on an Azure Stack integrated system:**

To run the log collection tool on an integrated system, you need to have access to the Privileged End Point (PEP). Here is an example script you can run using the PEP to collect logs on an integrated system:

```
$ip = "<IP OF THE PEP VM>" # You can also use the machine name instead of IP here.
 
$pwd= ConvertTo-SecureString "<CLOUD ADMIN PASSWORD>" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("<DOMAIN NAME>\CloudAdmin", $pwd)
 
$shareCred = Get-Credential
 
$s = New-PSSession -ComputerName $ip -ConfigurationName PrivilegedEndpoint -Credential $cred

$fromDate = (Get-Date).AddHours(-8)
$toDate = (Get-Date).AddHours(-2)  #provide the time that includes the period for your issue
 
Invoke-Command -Session $s {    Get-AzureStackLog -OutputPath "\\<HLH MACHINE ADDREESS>\c$\logs" -OutputSharePath "<EXTERNAL SHARE ADDRESS>" -OutputShareCredential $using:shareCred  -FilterByRole Storage -FromDate $using:fromDate -ToDate $using:toDate}

if($s)
{
    Remove-PSSession $s
}
```

- When you collect logs from the PEP, specify the `OutputPath` parameter to be a location on the HLH machine. Also ensure that the location is encrypted.
- The parameters `OutputSharePath` and `OutputShareCredential` are optional and are used when you upload logs to an external shared folder. Use these parameters *in addition* to `OutputPath`. If `OutputPath` is not specified, the log collection tool uses the system drive of the PEP VM for storage. This might cause the script to fail because  the drive space is limited.
- As shown in the previous example, the `FromDate` and `ToDate` parameters can be used to collect logs for a particular time period. This can come in handy for scenarios like collecting logs after applying an update package on an integrated system.

**Parameter considerations for both ASDK and integrated systems:**

- If the `FromDate` and `ToDate` parameters are not specified, logs are collected for the past four hours by default.
- You can use the `TimeOutInMinutes` parameter to set the timeout for log collection. It is set to 150 (2.5 hours) by default.

- Currently, you can use the `FilterByRole` parameter to filter log collection by the following roles:

   |   |   |   |
   | - | - | - |
   | `ACSMigrationService`     | `ACSMonitoringService`   | `ACSSettingsService` |
   | `ACS`                     | `ACSFabric`              | `ACSFrontEnd`        |
   | `ACSTableMaster`          | `ACSTableServer`         | `ACSWac`             |
   | `ADFS`                    | `ASAppGateway`           | `BareMetal`          |
   | `BRP`                     | `CA`                     | `CPI`                |
   | `CRP`                     | `DeploymentMachine`      | `DHCP`               |
   |`Domain`                   | `ECE`                    | `ECESeedRing`        |        
   | `FabricRing`              | `FabricRingServices`     | `FRP`                |
   |` Gateway`                 | `HealthMonitoring`       | `HRP`                |               
   | `IBC`                     | `InfraServiceController` | `KeyVaultAdminResourceProvider`|
   | `KeyVaultControlPlane`    | `KeyVaultDataPlane`      | `NC`                 |            
   | `NonPrivilegedAppGateway` | `NRP`                    | `SeedRing`           |
   | `SeedRingServices`        | `SLB`                    | `SQL`                |     
   | `SRP`                     | `Storage`                | `StorageController`  |
   | `URP`                     | `UsageBridge`            | `VirtualMachines`    |  
   | `WAS`                     | `WASPUBLIC`              | `WDS`                |


A few additional things to note:

* The command takes some time to run based on which role(s) the logs are collecting. Contributing factors also include the time duration specified for log collection, and the numbers of nodes in the Azure Stack environment.
* After log collection completes, check the new folder created in the `-OutputPath` parameter specified in the command.
* Each role has its logs inside individual zip files. Depending on the size of the collected logs, a role may have its logs split in to multiple zip files. For such a role, if you want to have all the log files unzipped in to a single folder, use a tool that can  unzip in bulk (such as 7zip). Select all the zipped files for the role, and select **extract here**. This unzips all the log files for that role in a single merged folder.
* A file called `Get-AzureStackLog_Output.log` is also created in the folder that contains the zipped log files. This file is a log of the command output, which can be used for troubleshooting problems during log collection.
* To investigate a specific failure, logs may be needed from more than one component.
    -	System and Event logs for all infrastructure VMs are collected in the *VirtualMachines* role.
    -	System and Event logs for all hosts are collected in the *BareMetal* role.
    -	Failover Cluster and Hyper-V event logs are collected in the *Storage* role.
    -	ACS logs are collected in the *Storage* and *ACS* roles.

> [!NOTE]
> Size and age limits are enforced on the logs collected as it is essential to ensure efficient utilization of your storage space to ensure it doesn't get flooded with logs. However, when diagnosing a problem you sometimes need logs that might not exist anymore because of these limits. Thus, it is **highly recommended** that you offload your logs to an external storage space (a storage account in Azure, an additional on-prem storage device etc.) every 8 to 12 hours and keep them there for 1 - 3 months, depending on your requirements. Also, ensure this storage location is encrypted.

## Next steps
[Microsoft Azure Stack troubleshooting](azure-stack-troubleshooting.md)
