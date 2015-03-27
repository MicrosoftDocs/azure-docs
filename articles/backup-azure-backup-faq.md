<properties
   pageTitle="Azure Backup - FAQ"
   description="Frequently asked questions on the Azure Backup service"
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
	 ms.date="03/26/2015"
	 ms.author="prvijay"/>

# Azure Backup - FAQ
The following is a list of commonly asked questions about Azure Backup. If you have any additional questions about Azure Backup, go to the the [discussion forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazureonlinebackup) and post your questions. Someone from our community will help you get your answers. If a question is commonly asked, we will add it to this article so that it can be found quickly and easily.

## Installation & Configuration

**Q1. What is the list of supported operating systems from which I can backup to Azure using Azure Backup?** <br/>
A1. The following list of OS’es is supported by Azure Backup


| Operating System        | Platform           | SKU  |
| :------------- |-------------| :-----|
| Windows 8 and latest SPs      | 64 bit | Enterprise, Pro |
| Windows 7 and latest SPs      | 64 bit | Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter |
| Windows 8.1 and latest SPs | 64 bit      |    Enterprise, Pro |
|Windows Server 2012 R2 and latest SPs|	64 bit|	Standard, Datacenter, Foundation|
|Windows Server 2012 and latest SPs|	64 bit|	Datacenter, Foundation, Standard|
|Windows Storage Server 2012 R2 and latest SPs	|64 bit|	Standard, Workgroup|
|Windows Storage Server 2012 and latest SPs	|64 bit	|Standard, Workgroup
|Windows Server 2012 R2 and latest SPs	|64 bit|	Essential|
|Windows Server 2008 R2 SP1	|64 bit|	Standard, Enterprise, Datacenter, Foundation|
|Windows Server 2008 SP2	|64 bit|	Standard, Enterprise, Datacenter, Foundation|

**Q2. Where can I download the latest Azure Backup agent?** <br/>
A2. You can download the latest agent from [here](http://aka.ms/azurebackup_agent). This can be installed on Windows Server, SCDPM server or Windows client

**Q3. Which version of SCDPM server is supported?** <br/>
A3. It is recommended that you install the [latest](http://aka.ms/azurebackup_agent) Azure Backup agent on the latest update rollup of SCDPM (UR5 as of Feb 2015)

**Q4. When configuring the Azure Backup agent, I am prompted to enter the “vault credentials”. Is there any expiry date attached to the vault credentials?** <br/>
A4. Yes, the vault credential expire after 48hours. If the file expires, log in to the Azure portal and download the vault credentials files from your Backup vault.

**Q5. Is there any limit on the number of backup vaults which can be created in each Azure subscription?** <br/>
A5. Yes. As of March 2015, you can create 25 vaults per subscription. If you need more vaults, then create a new subscription.

**Q6. Should I look at vault as a billing entity?** <br/>
A6. Though it is possible to get a detailed bill for each vault, it is highly recommended that you consider an Azure subscription as a billing entity. It is consistent across all services and is easier to manage.

**Q7. Are there any limits on the number of servers/machines which can be registered against each vault?** <br/>
A7. Yes, you can register upto 50 machines per vault. If you need to register more machines, create a new vault.

**Q8. Is there any limits on the amount of data which can be backed up from a Windows server/client or SCDPM server?** <br/>
A8. No.

**Q9. How do I register my server to another datacenter?**<br/>
A9. In general the backup data is sent to the datacenter of the Backup Service to which it is registered. The easiest way to change the datacenter is to uninstall the agent and reinstall the agent and register to a new datacenter.

**Q10. What happens if I rename a Windows server which is backing up data to Azure?** <br/>
A10. Any currently configured backups will be stopped. You will need to reregister the server with the backup vault and it will be considered a new server by Recovery Services, so the first backup operation that occurs after registration will be a full backup of all of the data included in the backup, instead of just the changes since the last backup occurred. However, if you need to perform a recovery operation you can recover the data that has been backed up using Recover from another server recovery option. For more information, see Rename a server.

**Q11. What types of drives can I backup files and folders from?** <br/>
A11. The following set of drives/volumes can be backup:

+ Removable Media: The drive must report as fixed to be used a backup item source.

+ Read-only Volumes: The volume must be writable for the volume shadow copy service (VSS) to function.

+ Offline Volumes	: The volume must be online for VSS to function.

+ Network share: The volume must be local to the server to be backed up using online backup.

**Q12. What file and folder types can I back up from my server?**<br/>
A12. The following types are supported:

+ Encrypted

+ Compressed

+ Sparse

+ Compressed + Sparse

+ Hard Links: Not supported, skipped

+ Reparse Point: Not supported, skipped

+ Encrypted + Compressed: Not supported, skipped

+ Encrypted + Sparse: Not supported, skipped

+ Compressed Stream: Not supported, skipped

+ Sparse Stream: Not supported, skipped

**Q13. What's the minimum size requirement for the cache folder?** <br/>
A13. The size of the cache folder is determined by the amount of data that you are backing up. In general you should expect that 10-15% of the space required for data storage should be allocated for the cache folder.

**Q14. How I can isolate specific server data from being recovered by other servers in my organization? **<br/>
A14. Any servers that are registered using the same vault will be able to recover the data backed up by other servers that use the same passphrase. If you have servers that you want to ensure recovery only occurs to specific servers in your organization, you should use a separate passphrase designated for those servers. For example, human resources servers could use one encryption passphrase, accounting servers another, and storage servers a third.

**Q15. Can I “migrate” my backup data between subscriptions?** <br/>
A15: No

**Q16: Can I “migrate” my backup vault between subscriptions?** <br/>
A16: No. The vault is created at a subscription level and cannot be reassigned to another subscription once it’s created.

## Backup & Retention
**Q1. Is there a limit on the size of each data source which is being backed up?** <br/>
A1. As of March 2015, each data source should be less than or equal to 1.7 TB. A data source is either

+ File/Folder volume

+ SQL DB

+ Sharepoint farm

+ Exchange server

+ Hyper-V VM

**Q2. Is there are limit on number of times backup can be scheduled per day?**<br/>
A2. Yes, Azure Backup enables 3 backup copies per day through Windows Server/Client and 2 backup copies per day through SCDPM.

**Q3. Is there a difference between DPM’s and Azure Backup’s (i.e on Windows Server without DPM) backup scheduling policy?** <br/>
A3. Yes. Using DPM, you can specify daily, weekly, monthly, yearly scheduling while from a Windows Server (without DPM), you can specify only daily, weekly schedules.

**Q4. Is there a difference between DPM’s and Azure Backup’s (i.e on Windows Server without DPM) retention policy?**<br/>
A4. No, you have the same capabilities. You can specify daily, weekly, monthly and yearly retention policies.

**Q5. Can I configure my retention policies selectively – i.e. configure weekly and daily but not yearly and monthly?**<br/>
A5. You have the full set of knobs to come up with policies which best define your compliance/retention requirements.

**Q6. Can I “schedule a backup” at 6pm and specify “retention policies” at a different time?**<br/>
A6. No. Retention policies can only be applied on backup points. In the below picture, the retention policy is being specified on backups taken at 12am and 6pm. <br/>

![Schedule Backup and Retention][1]
<br/>

**Q7. Is an incremental copy transferred  for the retention policies scheduled?** <br/>
A7. No, the incremental copy is sent based on the time mentioned in the backup schedule page. The points which can be retained are determined based on the retention policy.

**Q8. If backup is retained for a long duration, does it take a significant time to recover the data (say the oldest point)?** <br/>
A8. No – the time taken to recovery the oldest or the latest point is one and the same. Each recovery point behaves like a full point.

**Q9. If each recovery point is like a full point, does it impact the total billable backup storage?**<br/>
A9.  Typical long term retention point products store backup data as full points. However, these are storage inefficient but are easier and faster to restore. Incremental copies are storage efficient but  requires you to restore a chain of data which impacts your recovery time. Azure Backup’s unique storage architecture gives you the best of both worlds by optimally storing data for fast restores and incurring low storage costs. This approach ensures that your (ingress and egress) bandwidth is efficiently used, storage is kept to the minimum and the time taken to recover is kept to the minimum.

**Q10. Is there a limit on the number of recovery points which can be created?**<br/>
A10. As of April 2015, you can have upto 366 recovery points. You can use any permutation to arrive at a number which is less than 366. Eg – the retention points in the below picture add to 354. <br/>

![Retention screen][2]

**Q11. Once Microsoft improves limit from 366, will I need to upgrade the agent or reseed the initial backup?** <br/>
A11. No. Once we make the change in our service, you will be notified through our social media outlets (blogs, Azure announcements, portal etc). Based on your needs, you would then be required to only change the retention policy.

**Q12. Why is the amount of data transferred in backup not equal to the amount of data I backed up?**<br/>
A12. All the data that is backed up is compressed and encrypted before being transferred. You can expect 30-40% compression benefits depending on the type of data being backed up.

## Recoveries
**Q1. How many recoveries can I perform on the data which is backed up to Azure?**<br/>
A1. There is no limit on the number of recoveries from Azure Backup.

**Q2. Do I have to pay for the egress traffic from Azure data center during recoveries?**<br/>
A2. No. Your recoveries are free and you are not charged for the egress traffic.

## Security
**Q1. Is the data sent to Azure encrypted?** <br/>
A1. Yes. Data is encrypted on the on-premises server/client/SCDPM machine using AES256 and the data is sent over a secure HTTPS link.

**Q2. Is the backup data on Azure encrypted as well?**<br/>
A2. Yes. The data which is sent to Azure remains encrypted (at rest). Microsoft does not decrypt the backup data at any point.

**Q3. What is the minimum length of encryption key used to encrypt backup data?** <br/>
A3. The encryption key should be at least 16 characters.

**Q4. What happens if I misplace the encryption key? Can I recover the data (or) can Microsoft recover the data?** <br/>
A4. The key used to encrypt the backup data is present only on the customer premises. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the customer misplaces the key, Microsoft cannot recover the backup data.
 


<!--Image references-->
[1]: ./media/backup-azure-backup-faq/Schedule.png
[2]: ./media/backup-azure-backup-faq/RetentionScreen1.png
