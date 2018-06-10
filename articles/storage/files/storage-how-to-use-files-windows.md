---
title: Mount an Azure file share and access the share in Windows | Microsoft Docs
description: Mount an Azure file share and access the share in Windows.
services: storage
documentationcenter: na
author: RenaShahMSFT
manager: aungoo
editor: tamram

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/07/2018
ms.author: renash
---

# Mount an Azure file share and access the share in Windows
[Azure Files](storage-files-introduction.md) is Microsoft's easy-to-use cloud file system. Azure file shares can be mounted in Windows and Windows Server. This article shows three different ways to mount an Azure file share on Windows: with the File Explorer UI, via PowerShell, and via the Command Prompt. 

In order to mount an Azure file share outside of the Azure region it is hosted in, such as on-premises or in a different Azure region, the OS must support SMB 3.0. 

You can mount Azure file shares on a Windows installation that is running either in an Azure VM or on-premises. The following table illustrates which OS versions support mounting file shares in which environment:

| Windows version        | SMB version | Mountable in Azure VM | Mountable On-Premises |
|------------------------|-------------|-----------------------|----------------------|
| Windows Server 2019 (preview)<sup>1</sup> | SMB 3.0 | Yes | Yes |
| Windows 10<sup>2</sup> | SMB 3.0 | Yes | Yes |
| Windows Server semi-annual channel<sup>3</sup> | SMB 3.0 | Yes | Yes |
| Windows Server 2016    | SMB 3.0     | Yes                   | Yes                  |
| Windows 8.1            | SMB 3.0     | Yes                   | Yes                  |
| Windows Server 2012 R2 | SMB 3.0     | Yes                   | Yes                  |
| Windows Server 2012    | SMB 3.0     | Yes                   | Yes                  |
| Windows 7              | SMB 2.1     | Yes                   | No                   |
| Windows Server 2008 R2 | SMB 2.1     | Yes                   | No                   |

<sup>1</sup>Windows Server 2019 is available in preview through the [Windows Server Insiders program](https://insider.windows.com/for-business-getting-started-server/). Although Windows Server 2019 is not supported for production use yet, please let us know if you have any issues connecting to Azure file shares beyond what is covered in the [troubleshooting guide for Windows](storage-troubleshoot-windows-file-connection-problems.md).  
<sup>2</sup>Windows 10, versions 1507, 1607, 1703, 1709, and 1803.  
<sup>3</sup>Windows Server, version 1709 and 1803.

> [!Note]  
> We always recommend taking the most recent KB for your version of Windows.

## Prerequisites for mounting Azure file share with Windows 
* **Storage account name**: To mount an Azure file share, you will need the name of the storage account.

* **Storage account key**: To mount an Azure file share, you will need the primary (or secondary) storage key. SAS keys are not currently supported for mounting.

* **Ensure port 445 is open**: The SMB protocol requires TCP port 445 to be open; connections will fail if port 445 is blocked. You can check to see if your firewall is blocking port 445 with the `Test-NetConnection` cmdlet.

    ```PowerShell
    Test-NetConnection -ComputerName <storage-account> -Port 445
    ```

    If the connection was successful, you should see the following output:

    ```
    ComputerName     : <storage-account>.file.core.windows.net
    RemoteAddress    : <storage-account-ip-address>
    RemotePort       : 445
    InterfaceAlias   : <your-network-interface>
    SourceAddress    : <your-ip-address>
    TcpTestSucceeded : True
    ```

    > [!Note]  
    > The above command returns the current IP address of the storage account. This IP address is not guaranteed to remain the same, and may change at any time. Do not hardcode this IP address into any scripts, or into a firewall configuration. 

## Persisting connections across reboots
The easiest way to establish a persistent connection is to save your storage account credentials into windows using the cmdkey utility. The following is an example command-line for persisting your storage account credentials into your VM:

```PowerShell
cmdkey /add:<storage-account>.file.core.windows.net /user:AZURE\<storage-account> /pass:<storage-account-key>
```

CmdKey can also allow you to list the credentials it stored:

```PowerShell
cmdkey /list
```

If the credentials for your Azure file share are stored successfully, the expected output is as follows:

```
Currently stored credentials:

Target: Domain:target=<yourstorageaccountname>.file.core.windows.net
Type: Domain Password
User: AZURE\<yourstorageaccountname>
```

Once the credentials have been persisted, you no longer have to supply them when connecting to your share. Instead you can connect without specifying any credentials.

## Mount the Azure file share with File Explorer
> [!Note]  
> Note that the following instructions are shown on Windows 10 and may differ slightly on older releases. 

1. **Open File Explorer**: This can be done by opening from the Start Menu, or by pressing Win+E shortcut.

2. **Navigate to the "This PC" item on the left-hand side of the window. This will change the menus available in the ribbon. Under the Computer menu, select "Map Network Drive"**.
    
    ![A screenshot of the "Map network drive" drop-down menu](./media/storage-how-to-use-files-windows/1_MountOnWindows10.png)

3. **Copy the UNC path from the "Connect" pane in the Azure portal.** 

    ![The UNC path from the Azure Files Connect pane](./media/storage-how-to-use-files-windows/portal_netuse_connect.png)

4. **Select the Drive letter and enter the UNC path.** 
    
    ![A screenshot of the "Map Network Drive" dialog](./media/storage-how-to-use-files-windows/2_MountOnWindows10.png)

5. **Use the Storage Account Name prepended with `Azure\` as the username and a Storage Account Key as the password.**
    
    ![A screenshot of the network credential dialog](./media/storage-how-to-use-files-windows/3_MountOnWindows10.png)

6. **Use Azure file share as desired**.
    
    ![Azure file share is now mounted](./media/storage-how-to-use-files-windows/4_MountOnWindows10.png)

7. **When you are ready to dismount (or disconnect) the Azure file share, you can do so by right-clicking on the entry for the share under the "Network locations" in File Explorer and selecting "Disconnect"**.

## Mount the Azure file share with PowerShell
1. **Use the following command to mount the Azure file share**: Remember to replace `<storage-account-name>`, `<share-name>`, `<storage-account-key>`, `<desired-drive-letter>` with the proper information.

    ```PowerShell
    $acctKey = ConvertTo-SecureString -String "<storage-account-key>" -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList "Azure\<storage-account-name>", $acctKey
    New-PSDrive -Name <desired-drive-letter> -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<share-name>" -Credential $credential
    ```

2. **Use the Azure file share as desired**.

3. **When you are finished, dismount the Azure file share using the following command**.

    ```PowerShell
    Remove-PSDrive -Name <desired-drive-letter>
    ```

> [!Note]  
> You may use the `-Persist` parameter on `New-PSDrive` to make the Azure file share visible to the rest of the OS while mounted.

## Mount the Azure file share with Command Prompt
1. **Use the following command to mount the Azure file share**: Remember to replace `<storage-account-name>`, `<share-name>`, `<storage-account-key>`, `<desired-drive-letter>` with the proper information.

    ```
    net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
    ```

2. **Use the Azure file share as desired**.

3. **When you are finished, dismount the Azure file share using the following command**.

    ```
    net use <desired-drive-letter>: /delete
    ```

> [!Note]  
> You can configure the Azure file share to automatically reconnect on reboot by persisting the credentials in Windows. The following command will persist the credentials:
>   ```
>   cmdkey /add:<storage-account-name>.file.core.windows.net /user:AZURE\<storage-account-name> /pass:<storage-account-key>
>   ```

## Securing Windows/Windows Server
In order to mount an Azure file share on Windows, port 445 must be accessible. Many organizations block port 445 access to Azure because of the security risks inherent with SMB 1. SMB 1, also known as CIFS (Common Internet File System), is a legacy file system protocol included with Windows and Windows Server. SMB 1 is an outdated, inefficient, and most importantly insecure protocol. The good news is that Azure Files does not support SMB 1, and all supported versions of Windows and Windows Server make it possible to remove or disable SMB 1. We always [strongly recommend](https://aka.ms/stopusingsmb1) removing or disabling the SMB 1 client and server in Windows before continuing with this guide.

The following table provides detailed information on the status of SMB 1 each version of Windows:

| Windows version                           | SMB 1 default status | Disable/Remove method       | 
|-------------------------------------------|----------------------|-----------------------------|
| Windows Server 2019 (preview)             | Disabled             | Remove with Windows feature |
| Windows Server, versions 1709+            | Disabled             | Remove with Windows feature |
| Windows 10, versions 1709+                | Disabled             | Remove with Windows feature |
| Windows Server 2016                       | Enabled              | Remove with Windows feature |
| Windows 10, versions 1507, 1607, and 1703 | Enabled              | Remove with Windows feature |
| Windows Server 2012 R2                    | Enabled              | Remove with Windows feature | 
| Windows 8.1                               | Enabled              | Remove with Windows feature | 
| Windows Server 2012                       | Enabled              | Disable with Registry       | 
| Windows Server 2008 R2                    | Enabled              | Disable with Registry       |
| Windows 7                                 | Enabled              | Disable with Registry       | 

### Auditing SMB 1 usage
> Applies to Windows Server 2019 (preview), Windows Server semi-annual channel (versions 1709 and 1803), Windows Server 2016, Windows 10 (versions 1507, 1607, 1703, 1709, and 1803), Windows Server 2012 R2, and Windows 8.1

Before removing SMB 1 in your environment, you may wish to audit SMB 1 usage to see if any clients will be broken by the change. If any requests are made against SMB shares with SMB 1, an audit event will be logged in the event log under `Applications and Services Logs > Microsoft > Windows > SMBServer > Audit`. 

> [!Note]  
> To enable auditing support on Windows Server 2012 R2 and Windows 8.1, install at least [KB4022720](https://support.microsoft.com/help/4022720/windows-8-1-windows-server-2012-r2-update-kb4022720).

To enable auditing, execute the following cmdlet from an elevated PowerShell session:

```PowerShell
Set-SmbServerConfiguration –AuditSmb1Access $true
```

### Removing SMB 1 from Windows Server
> Applies to Windows Server 2019 (preview), Windows Server semi-annual channel (versions 1709 and 1803), Windows Server 2016, Windows Server 2012 R2

To remove SMB 1 from a Windows Server instance, execute the following cmdlet from an elevated PowerShell session:

```PowerShell
Remove-WindowsFeature -Name FS-SMB1
```

To complete the removal process, restart your server. 

> [!Note]  
> Starting with Windows 10 and Windows Server version 1709, SMB 1 is not installed by default and has separate Windows features for the SMB 1 client and SMB 1 server. We always recommend leaving both the SMB 1 server (`FS-SMB1-SERVER`) and the SMB 1 client (`FS-SMB1-CLIENT`) uninstalled.

### Removing SMB 1 from Windows client
> Applies to Windows 10 (versions 1507, 1607, 1703, 1709, and 1803) and Windows 8.1

To remove SMB 1 from your Windows client, execute the following cmdlet from an elevated PowerShell session:

```PowerShell
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
```

To complete the removal process, restart your PC.

### Disabling SMB 1 on legacy versions of Windows/Windows Server
> Applies to Windows Server 2012, Windows Server 2008 R2, and Windows 7

SMB 1 cannot be completely removed on legacy versions of Windows/Windows Server, but it can be disabled through the Registry. To disable SMB 1, create a new registry key `SMB1` of type `DWORD` with a value of `0` under `HKEY_LOCAL_MACHINE > SYSTEM > CurrentControlSet > Services > LanmanServer > Parameters`.

You can easily accomplish this with the following PowerShell cmdlet as well:

```PowerShell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" SMB1 -Type DWORD -Value 0 –Force
```

After creating this registry key, you must restart your server to disable SMB 1.

### SMB resources
- [Stop using SMB 1](https://blogs.technet.microsoft.com/filecab/2016/09/16/stop-using-smb1/)
- [SMB 1 Product Clearinghouse](https://blogs.technet.microsoft.com/filecab/2017/06/01/smb1-product-clearinghouse/)
- [Discover SMB 1 in your environment with DSCEA](https://blogs.technet.microsoft.com/ralphkyttle/2017/04/07/discover-smb1-in-your-environment-with-dscea/)
- [Disabling SMB 1 through Group Policy](https://blogs.technet.microsoft.com/secguide/2017/06/15/disabling-smbv1-through-group-policy/)

## Next steps
See these links for more information about Azure Files:
- [Planning for an Azure Files deployment](storage-files-planning.md)
* [FAQ](../storage-files-faq.md)
* [Troubleshooting on Windows](storage-troubleshoot-windows-file-connection-problems.md)      