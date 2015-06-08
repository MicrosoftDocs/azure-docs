<properties
   pageTitle="Azure Backup - backup and restore from a Windows Server or Windows Client"
   description="Learn how to backup and restore from a Windows Server or Windows Client. The article also covers alternate server recovery"
   services="backup"
   documentationCenter=""
   authors="prvijay"
   manager="shreeshd"
   editor=""/>

<tags
   ms.service="backup"
   ms.workload="storage-backup-recovery"
	 ms.tgt_pltfrm="na"
	 ms.devlang="na"
	 ms.topic="article"
	 ms.date="04/02/2015"
	 ms.author="prvijay"/>

# Backup and restore from a Windows server or Windows client machine
This article covers the steps required to backup from a Windows server or a Windows client machine. It also covers the steps required to restore the backed up files on the same machine and the steps required to restore the backed up files on any other machine.

## Backup files
1. Once the machine is registered, open the Microsoft Azure Backup mmc snapin. <br/>
![Search result][1]

2. Click on **Schedule Backup** <br/>
![Schedule Backup][2]

3. Select the items which you wish to backup. Azure Backup on a Windows Server/Windows Client (i.e without System Center Data Protection Manager) enables you to protect files and folders. <br/>
![Items to Backup][3]

4. Specify the backup schedule and retention policy which is explained in detail in the following [article](backup-azure-backup-cloud-as-tape.md)

5. Choose the method of sending the initial backup. Your choice of completing the initial seeding is dependent on the amount of data which you wish to backup and your internet upload link speed. If you plan to backup GB’s/TB’s of data over a high latency, low bandwidth connection, it is recommended that you complete the initial backup by shipping a disk to the nearest Azure data center. This is called “Offline Backup” and is covered in detail in this [article](https://msdn.microsoft.com/library/azure/dn894419.aspx). If you have sufficient bandwidth connection it is recommended that you complete the initial backup over the network. <br/>
![Initial Backup][4]

6. Once the workflow completes, go back to the mmc snap in and click on **Back up Now** to complete the initial seeding over the network. <br/>
![Backup now][5]

7. Once the initial seeding is completed, the **Jobs** view in the Azure Backup console indicates the status. <br/>
![IR complete][6]

## Recover data on the same machine
If you accidentally deleted a file and if you wish to restore a file/volume in the same machine (from which the backup is taken), the following steps would help you recover the data.

1. Open the **Microsoft Azure Backup** snap in.

2. Click on **Recover Data** to initiate the workflow. <br/>
![Recover Data][7]

3. Select **This server (*yourmachinename*)** option as you plan to restore the backed up file on the same machine. <br/>
![Same machine][8]

4. You can opt to **Browse for files** or **Search for files**. Leave the default option if you plan to restore one or more files whose path is known. If you are not sure about the folder structure but would like to search for a file, pick the **Search for files** option. For the purpose of this section, we will proceed with the default option. <br/>
![Browse files][9]

5. In the next screen, select the volume from which you wish to restore the file. The screen enables you restore from any point in time. Dates which appear in **bold** in the calendar control indicate the availability of a restore point. Once a date is selected, based on your backup schedule (and the success of a backup operation), you can select a point in time from the **Time** drop down. <br/>
![Volume and Date][10]

6. In the next screen, select the items which you wish to recover. You can multi-select folders/files which you wish to restore. <br/>
![Select files][11]

7. In the next screen, specify the recovery parameters. <br/>
![Recovery options][12]
  + You have an option of restoring to the original location (in which the file/folder would be overwritten) or to another location in the same machine.

  + If the file/folder which you wish to restore, exists in the target location, you have the option to either create copies (two versions of the same file), or overwrite the files in the target location or skip the recovery of the files which exist in the target.

  + It is highly recommended that you leave the default option of restoring the ACLs on the files which are being recovered.

8. Once these inputs are provided, the recovery workflow starts which restores the files to this machine.

## Recover to an alternate machine
If your entire server is lost, you can still recover the file/volume in a different machine. The following steps illustrate the workflow.  

The nomenclature used in the steps are as follows:
  + *Source machine* – The original machine from which the backup was taken and which is currently unavailable.

  + *Target machine* – The machine on which the data is being retrieved.

  + *Sample vault* – The Backup vault to which the *Source machine* and *Target machine* are registered. <br/>

> [AZURE.NOTE] Backups taken from a machine cannot be restored on a machine which is running an earlier version of the operating system. For example, if backups are taken from a Windows 7 machine, it can be restored on a Windows 8 or above machine. However the vice-versa does not hold true.

1. Open the **Microsoft Azure Backup** snap in the *Target machine*.

2. Ensure that the *Target machine* and the *Source machine* are restored to the same Backup vault (in this article - *Sample vault*).

3. Click on **Recover Data** to initiate the workflow. <br/>
![Recover Data][7]

4. Select **Another server** <br/>
![Another Server][13]

5. Provide the vault credential file which corresponds to the *Sample vault*. If the vault credential file is invalid (or expired), download a new vault credential file from the *Sample vault* in the Azure portal. Once the vault credential file is provided, the backup vault against the vault credential file is displayed.

6. Select the *Source machine* from the list of displayed machines. <br/>
![List of machines][14]

7. As before select either the **Search for files** or **Browse for files** option. For the purpose of this section, we will use the **Search for files** option. <br/>
![Search][15]

8. Select the volume and date in the next screen. Search for the folder/file name which you wish to restore. <br/>
![Search items][16]

9. Select the location to which the files needs to be restored. <br/>
![Restore location][17]

10. Provide the encryption passphrase which was provided during *Source machine’s* registration to *Sample vault*. <br/>
![Encryption][18]

Once the input is provided, click on the **Recover** button which triggers the restores the backed up files in the destination provided.

<!--Image references-->
[1]: ./media/backup-azure-backup-and-recover/result.png
[2]: ./media/backup-azure-backup-and-recover/schedulebackup.png
[3]: ./media/backup-azure-backup-and-recover/items.png
[4]: ./media/backup-azure-backup-and-recover/initialbackup.png
[5]: ./media/backup-azure-backup-and-recover/backupnow.png
[6]: ./media/backup-azure-backup-and-recover/ircomplete.png

[7]: ./media/backup-azure-backup-and-recover/recover.png
[8]: ./media/backup-azure-backup-and-recover/samemachine.png
[9]: ./media/backup-azure-backup-and-recover/browseandsearch.png
[10]: ./media/backup-azure-backup-and-recover/volanddate.png
[11]: ./media/backup-azure-backup-and-recover/selectfiles.png
[12]: ./media/backup-azure-backup-and-recover/recoveroptions.png

[13]: ./media/backup-azure-backup-and-recover/anotherserver.png
[14]: ./media/backup-azure-backup-and-recover/machinelist.png
[15]: ./media/backup-azure-backup-and-recover/search.png
[16]: ./media/backup-azure-backup-and-recover/searchitems.png
[17]: ./media/backup-azure-backup-and-recover/restorelocation.png
[18]: ./media/backup-azure-backup-and-recover/encryption.png
