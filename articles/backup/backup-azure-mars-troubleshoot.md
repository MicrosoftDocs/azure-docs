---
title: Troubleshoot Azure Backup Agent | Microsoft Docs
description: Troubleshoot installation and registration of Azure Backup Agent
services: backup
documentationcenter: ''
author: saurabhsensharma
manager: shreeshd
editor: ''

ms.assetid: 778c6ccf-3e57-4103-a022-367cc60c411a
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/4/2017
ms.author: saurse;markgal;

---

# Troubleshoot Azure Backup Agent configuration and registration issues
## Recommended steps
Refer to the recommended actions in the following tables to resolve errors that you might encounter during the configuration or registration of Azure Backup Agent.

[!INCLUDE [backup-upgrade-mars-agent.md](../../includes/backup-upgrade-mars-agent.md)]

## Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service.
| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** </br> *Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)* | <ul><li> The vault credentials are invalid (that is, they were downloaded more than 48 hours before the time of registration).<li>The Azure Backup Agent is not able to download a temporary file to the Windows Temp folder. <li>The vault credentials are on a network location. <li>TLS 1.0 is disabled<li> A configured proxy server is blocking the connection. <br> |  <ul><li>Download the new vault credentials.<li>Go to **Internet options** > **Security** > **Internet**. Next, select **Custom Level**, and scroll until you see the file download section. Then select **Enable**.<li>You might also have to add the site to [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li> Match the date and time with your machine.<li>Go to C:/Windows/Temp and check whether there are more than 60,000 or 65,000 files with the .tmp extension. If there are, delete these files.<li>You can test this by running the SDP package on the server. If you get an error stating that file downloads are not allowed, it is very likely that there are a large number of files in the C:/Windows/Temp directory.<li>Ensure that you have .NET framework 4.6.2 installed. <li>If you have disabled TLS 1.0 due to PCI compliance, refer to this [troubleshooting page](https://support.microsoft.com/help/4022913). <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan: <ul><li>CBengine.exe<li>CSC.exe, which is related to .NET Framework. There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.

## The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |
| **Error** </br><ol><li>*The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to internet*<li>*(407) Proxy Authentication Required* |Proxy blocking the connection. |  <ul><li>Go into **Internet options** > **Security** > **Internet**. Then select **Custom Level** and scroll until you see the file download section. Select **Enable**.<li>You might also have to add the site to [trusted sites](https://docs.microsoft.com/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use a proxy server. Then provide the proxy server details. <li>If you have anti-virus software installed on the server, exclude the following files from the anti-virus scan. <ul><li>CBEngine.exe (instead of dpmra.exe).<li>CSC.exe (related to .NET Framework). There is a CSC.exe for every .NET version that's installed on the server. Exclude CSC.exe files that are tied to all versions of .NET framework on the affected server. <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.

## Failed to set the encryption key for secure backups

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |		
| **Error** </br>*Failed to set the encryption key for secure backups. The current operation failed due to an internal service error 'Invalid input error'. Please retry the operation after some time. If the issue persists, please contact Microsoft support*. |Server is already registered with another vault.| Unregister the server from the vault and register again.

## The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]

| Error details | Possible causes | Recommended actions |
| ---     | ---     | ---    |			
| **Error** </br><ol><li>*The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Please retry the operation after some time. If the issue persists, please contact Microsoft support* <li>*Error 34506. The encryption passphrase stored on this computer is not correctly configured*. | <li> The scratch folder is located on a volume that has insufficient space. <li> The scratch folder has been moved incorrectly to another location. <li> The OnlineBackup.KEK file is missing. | <li>Move the scratch folder or cache location to a volume with free space equivalent to 5-10% of the total size of the backup data. To correctly move the cache location, refer to the steps in [Questions about the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup).<li> Ensure that the OnlineBackup.KEK file is present. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*.

## Need help? Contact support
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps
* Get more details on [how to back up Windows Server with the Azure Backup Agent](tutorial-backup-windows-server-to-azure.md).
* If you need to restore a backup, use this article to [restore files to a Windows machine](backup-azure-restore-windows-server.md).
