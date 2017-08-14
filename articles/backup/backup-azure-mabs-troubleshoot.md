---
title: Troubleshoot Azure Backup Server | Microsoft Docs
description: Troubleshoot installation, registration of Azure Backup Server and backup and restore of application workloads
services: backup
documentationcenter: ''
author: pvrk
manager: shreeshd
editor: ''

ms.assetid: 2d73c349-0fc8-4ca8-afd8-8c9029cb8524
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/08/2017
ms.author: pullabhk;markgal;

---

# Troubleshoot Azure Backup Server

You can troubleshoot errors encountered while using Azure Backup Server with information listed in the following table.


## Installation issues

| Operation | Error details | Workaround |
|-----------|---------------|------------|
|Installation | Setup could not update registry metadata. This update failure could lead to over usage of storage consumption. To avoid this please update the ReFS Trimming registry entry. | Adjust the registry key, SYSTEM\CurrentControlSet\Control\FileSystem\RefsEnableInlineTrim. Set the value Dword to 1. |
|Installation | Setup could not update registry metadata. This update failure could lead to over usage of storage consumption. To avoid this please update the Volume SnapOptimization registry entry. | Create the registry key, SOFTWARE\Microsoft Data Protection Manager\Configuration\VolSnapOptimization\WriteIds, with an empty string value. |

## Registration and Agent related issues
| Operation | Error details | Workaround |
| --- | --- | --- |
| Registering to a vault | Invalid vault credentials provided. The file is either corrupted or does not have the latest credentials associated with recovery service | To fix this error: <ol><li> Download the latest credentials file from the vault and try again <br>(OR)</li> <li> If the above action didn't work, try downloading the credentials to a different local directory or create a new vault <br>(OR)</li> <li> Try updating the date and time settings as stated in [this blog](https://azure.microsoft.com/blog/troubleshooting-common-configuration-issues-with-azure-backup/) <br>(OR)</li> <li> Check whether c:\windows\temp has more than 65000 files. Move stale files to another location or delete the items in the Temp folder <br>(OR)</li> <li> Check the status of certificates <br> a. Open "Manage Computer Certificates" (in the Control Panel) <br> b. Expand the "Personal" node and its child node "Certificates" <br> c.  Remove the certificate "Windows Azure Tools" <br> d. Retry the registration in the Azure Backup client <br> (OR) </li> <li> Check whether any Group policy is in place </li></ol> |
| Pushing agent(s) to protected servers | The agent operation failed because of a communication error with the DPM Agent Coordinator service on \<ServerName> | **If the recommended action shown in the product doesn't work**, <ol><li> If you are attaching a computer from an untrusted domain, follow [these](https://technet.microsoft.com/library/hh757801(v=sc.12).aspx) steps <br> (OR) </li><li> If you are attaching a computer from a trusted domain, troubleshoot using the steps outlined in [this blog](https://blogs.technet.microsoft.com/dpm/2012/02/06/data-protection-manager-agent-network-troubleshooting/) <br>(OR)</li><li> Try disabling Antivirus as a troubleshooting step. If it resolves the issue, modify the Antivirus settings as suggested in [this article] (https://technet.microsoft.com/library/hh757911.aspx)</li></ol> |
| Pushing agent(s) to protected servers | The credentials specified for server are invalid | **If the recommended action shown in the product doesn't work**, <br> try to install the protection agent manually on the production server as specified in [this article](https://technet.microsoft.com/library/hh758186(v=sc.12).aspx#BKMK_Manual)|


## Configuring protection group
| Operation | Error details | Workaround |
| --- | --- | --- |
| Configuring Protection groups | DPM could not enumerate application component  on protected computer (Protected computer Name) | Click 'Refresh' on the configure protection group UI screen at the relevant datasource/component level |
| Configuring Protection groups | Unable to configure protection | If the protected server is a SQL server, please check whether sysadmin role permissions have been provided to the system account (NTAuthority\System) on the protected computer as stated in [this article](https://technet.microsoft.com/library/hh757977(v=sc.12).aspx)
| Configuring Protection groups | There is insufficient free space in the storage pool for this protection group | The disks which are added to the storage pool [should not contain a partition](https://technet.microsoft.com/library/hh758075(v=sc.12).aspx). Delete any existing volumes on the disks and then add it to the storage pool|
| Policy change |The backup policy could not be modified. Error: The current operation failed due to an internal service error [0x29834]. Please retry the operation after sometime. If the issue persists, please contact Microsoft support. |**Cause:**<br/>This error comes when security settings are enabled, you try to reduce retention range below the minimum values specified above and you are on unsupported  version (below MAB version 2.0.9052 and Azure Backup server update 1). <br/>**Recommended Action:**<br/> In this case, you should set retention period above the minimum retention period specified (seven days for daily, four weeks for weekly, three weeks for monthly or one year for yearly) to proceed with policy related udpates. Optionally, preferred approach would be to update backup agent and Azure Backup Server to leverage all the security updates. |

## Backup
| Operation | Error details | Workaround |
| --- | --- | --- |
| Backup | Replica is inconsistent | You can find more details about the causes of replica inconsistency and relevant suggestions [here](https://technet.microsoft.com/library/cc161593.aspx) <br> <ol><li> In case of System State/BMR backup, please check whether Windows Server Backup is installed or not on Protected Server </li><li> Check for Space related issues on DPM storage pool on the DPM/MABS server and allocate storage as required </li><li> Check the state of the Volume shadow copy service on the protected server. If it is in disabled state set it to start manually and start the service on the server. Then go back to the DPM/MABS console and start the sync with consistency check job.</li></ol>|
| Backup | An unexpected error occurred while the job was running, The device is not ready | **If the recommended action shown in the product doesn't work**, <br> <ol><li>Set the Shadow Copy Storage space to unlimited on the Items in the protection group and run the consistency check <br></li> (OR) <li>Try deleting the existing Protection group and create multiple new ones – one with each individual item in it</li></ol> |
| Backup | If you are backing up only System State, verify if there is enough free space on the protected computer to store the System State backup | <ol><li>Verify that the WSB on the protected machine is installed</li><li>Verify that enough space is present on the protected computer for the system state: The easiest way to do this is to go to the protected computer, open WSB and click through the selections and select BMR. The UI will then tell you how much space is required for this. Open WSB -> Local backup -> Backup schedule -> Select Backup Configuration -> Full server (size is displayed). Use this size for verification.</li></ol>
| Backup | Online recovery point creation failed | If the error message says "Windows Azure Backup Agent was unable to create a snapshot of the selected volume", please try increasing the space in replica and recovery point volume.
| Backup | Online recovery point creation failed | If the error message says "The encryption passphrase for this server is not set. Please configure an encryption passphrase" try configuring an encryption passphrase. If it fails, <br> <ol><li>check whether the scratch location exists or not. The location mentioned in the registry HKEY_LOCAL_MACHINE\Software\Microsoft\Windows Azure Backup\Config with name “ScratchLocation” should exist.</li><li> If the scratch location exists, try re-registering using the old passphrase. **Whenever you configure an encryption passphrase, please save it in a secure location**</li><ol>
| Backup | Backup failure for BMR | If BMR size is huge, retry after moving some application files to OS drive |
| Backup | Error while accessing files/shared folders | Try modifying the antivirus settings as suggested [here](https://technet.microsoft.com/library/hh757911.aspx)|

## Change Passphrase
| Operation | Error details | Workaround |
| --- | --- | --- |
| Change Passphrase |Security PIN entered is incorrect. Provide the correct Security PIN to complete this operation. |**Cause:**<br/> This error comes when you enter invalid or expired Security PIN while performing critical operation (like change passphrase). <br/>**Recommended Action:**<br/> To complete the operation, you must enter valid Security PIN. To get the PIN, log in to Azure portal and navigate to Recovery Services vault > Settings > Properties > Generate Security PIN. Use this PIN to change passphrase. |
| Change Passphrase |Operation failed. ID: 120002 |**Cause:**<br/>This error comes when security settings are enabled, you try to change passphrase and you are on unsupported version.<br/>**Recommended Action:**<br/> To change passphrase, you must first update backup agent to minimum version minimum 2.0.9052 and Azure Backup server to minimum update 1, then enter valid Security PIN. To get the PIN, log in to Azure portal and navigate to Recovery Services vault > Settings > Properties > Generate Security PIN. Use this PIN to change passphrase. |
