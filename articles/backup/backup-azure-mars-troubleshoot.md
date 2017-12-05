---
title: Troubleshoot Azure Backup Agent (MARS Agent) | Microsoft Docs
description: Troubleshoot installation & registration of Azure Backup agent
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

# Troubleshooting Azure Backup Agent Configuration/Registration issues
## Recommended steps
Refer to the recommended action(s) specified below to resolve corresponding errors seen during the configuration or registration of the Azure Backup agent.

## Error: Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service.
| Error details | Possible Causes | Recommended Action(s) |
| ---     | ---     | ---    |
| **Error** </br> *Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service. (ID: 34513)* | <ol><li> The Vault credentials are not valid (that is. they were downloaded more than 48 hours before the time of registration).<li>	The Azure Backup agent is not able to download a temporary file to the Temp folder of Windows. <li>The Vault Credentials are on a network location. <li>TLS 1.0 is disabled<li> A configured proxy server is blocking the connection <br> |  <ol><li>Download the new Vault Credentials<li>Go into internet options > security > Internet > click Custom Level > scroll until you see file download section and select enable.<li>You may also have to add the site to [trusted sites](https://docs.microsoft.com/en-us/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use proxy and give the proxy details <li> Match the Date & Time (UTC) with your machine<li>Go to C:/Windows/Temp and check whether there are more than 60,000 or 65,000 files (with .tmp extension) and delete these files.<li>You can test this by running the SDP package on the server. If you get the error stating file downloads are not allowed, you can be reasonably sure about large number of files in the C:/Windows/Temp directory.<li>Ensure that you have .NET framework 4.6.2 installed <li>If you have disabled TLS 1.0 due to PCI compliance, refer to this [troubleshoot link](https://support.microsoft.com/help/4022913). <li>If you have an anti-virus installed in the server, exclude the following files from anti-virus scan. <ol><li>CBengine.exe<li>CSC.exe(related to .NET Framework. There is a CSC.exe per .NET version installed on the server. Exclude all CSC.exe files tied to all versions of .NET framework on the affected server.) <li>Scratch folder or cache location. <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*

## Error: The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup

| Error details | Possible Causes | Recommended Action(s) |
| ---     | ---     | ---    |
| **Error** </br><ol><li>*The Microsoft Azure Recovery Service Agent was unable to connect to Microsoft Azure Backup. (ID: 100050) Check your network settings and ensure that you are able to connect to internet*<li>*(407) Proxy Authentication Required* |Proxy blocking the connection* |  <ol><li>Go into internet options > security > Internet > click Custom Level > scroll until you see file download section and select enable.<li>You may also have to add the site to [trusted sites](https://docs.microsoft.com/en-us/azure/backup/backup-try-azure-backup-in-10-mins#network-and-connectivity-requirements).<li>Change the settings to use proxy and give the proxy details <li>If you have an anti-virus installed in the server, exclude the following files from anti-virus scan. <ol><li>CBengine.exe<li>(instead of dpmra.exe)<li>CSC.exe(related to .NET Framework. There is a CSC.exe per .NET version installed on the server. Exclude all CSC.exe files tied to all versions of .NET framework on the affected server.) <li>Scratch folder or cache location <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*

## Error: Failed to set the encryption key for secure backups

| Error details | Possible Causes | Recommended Action(s) |
| ---     | ---     | ---    |		
| **Error** </br>*Failed to set the encryption key for secure backups. The current operation failed due to an internal service error 'Invalid input error'. Please retry the operation after some time. If the issue persists, please contact Microsoft support* |Server is already registered with another vault| Un-register the server from the vault and register again.

## Error: The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]

| Error details | Possible Causes | Recommended Action(s) |
| ---     | ---     | ---    |			
| **Error** </br><ol><li>*The activation did not complete successfully. The current operation failed due to an internal service error [0x1FC07]. Please retry the operation after some time. If the issue persists, please contact Microsoft support* <li>*Error 34506. The encryption passphrase stored on this computer is not correctly configured* | <li> Scratch folder is located on a volume that has insufficient space <li> Scratch folder is moved incorrectly to another location <li> OnlineBackup.KEK file is missing | <li>Move the scratch folder or cache location to a volume with free space equivalent to 5-10% of the total size of backup data. Refer to the steps mentioned in [this article](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq#backup) to correctly move the cache location.<li> Ensure that OnlineBackup.KEK file is present <br>*The default location for the scratch folder or the cache location path is C:\Program Files\Microsoft Azure Recovery Services Agent\Scratch*

## Need help? Contact support
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps
* Get more details on [backing up your Windows Server with the Azure Backup agent](tutorial-backup-windows-server-to-azure.md).
* If you need to restore a backup, use this article to [restore files to a Windows machine](backup-azure-restore-windows-server.md).
