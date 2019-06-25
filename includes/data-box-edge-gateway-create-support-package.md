---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 03/05/2019
ms.author: alkohli
---

If you experience any device issues, you can create a support package from the system logs. Microsoft Support uses this package to troubleshoot the issues. Follow these steps to create a support package:

1. [Connect to the PowerShell interface of your device](#connect-to-the-powershell-interface).
2. Use the `Get-HcsNodeSupportPackage` command to create a support package. The usage of the cmdlet is as follows:

    ```powershell
    Get-HcsNodeSupportPackage [-Path] <string> [-Zip] [-ZipFileName <string>] [-Include {None | RegistryKeys | EtwLogs
            | PeriodicEtwLogs | LogFiles | DumpLog | Platform | FullDumps | MiniDumps | ClusterManagementLog | ClusterLog |
            UpdateLogs | CbsLogs | StorageCmdlets | ClusterCmdlets | ConfigurationCmdlets | KernelDump | RollbackLogs |
            Symbols | NetworkCmdlets | NetworkCmds | Fltmc | ClusterStorageLogs | UTElement | UTFlag | SmbWmiProvider |
            TimeCmds | LocalUILogs | ClusterHealthLogs | BcdeditCommand | BitLockerCommand | DirStats | ComputeRolesLogs |
            ComputeCmdlets | DeviceGuard | Manifests | MeasuredBootLogs | Stats | PeriodicStatLogs | MigrationLogs |
            RollbackSupportPackage | ArchivedLogs | Default}] [-MinimumTimestamp <datetime>] [-MaximumTimestamp <datetime>]
            [-IncludeArchived] [-IncludePeriodicStats] [-Credential <pscredential>]  [<CommonParameters>]
    ```

    The cmdlet collects logs from your device and copies those logs to a specified network or local share.

    The parameters used are as follows:

    - `-Path` - Specify the network or the local path to copy support package to. (required)
    - `-Credential` - Specify the credentials to access the protected path.
    - `-Zip` - Specify to generate a zip file.
    - `-Include` - Specify to include the components to be included in the support package. If not specified, `Default` is assumed.
    - `-IncludeArchived` - Specify to include archived logs in the support package.
    - `-IncludePeriodicStats` - Specify to include periodic stat logs in the support package.

    
