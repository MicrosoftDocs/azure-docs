<properties 
   pageTitle="Back up Azure virtual machines using Azure Backup" 
   description="Use this guide to learn how to use Azure Backup to back up Azure virtual machines" 
   services="site-recovery" 
   documentationCenter="dev-center-name" 
   authors="markgalioto" 
   manager="jwhit" 
   editor="tysonn"/>

<tags
   ms.service="site-recovery"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="backup-recovery" 
   ms.date="02/27dd/2015"
   ms.author="markgal"/>

# Back up Azure virtual machines using Azure Backup 

## Overview
You can protect the Azure virtual machines in your Azure infrastructure using the Azure Backup service.

## Before you start
You'll need an Azure account. If you don't have one check out the [Azure free trial] (../pricing/free-trial/).

This guide describes how to set up protection for virtual machines from scratch. After prerequisites are in place you'll create Azure virtual machines and register them in the vault, and then enable protection for them.

## Create a vault
1. Sign in to the [Management Portal](https://manage.windowsazure.com).

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault**> **Quick Create**.

3. In **Name**, enter a friendly name to identify the vault.

4. In **Region**, select the geographic region for the vault.  
![New backup vault](http://i.imgur.com/8ptgjuo.png)

5. Click **Create Vault**.

	It can take a while for the backup vault to be created. Monitor status notifications at the bottom of the portal. A message confirms that the vault has been successfully created and it will be listed in the Recovery Services page as **Active**. 
![backup vault creation](http://i.imgur.com/grtLcKM.png)

3. If you have multiple subscriptions associated with your organizational account, choose the correct account to associate with the backup vault.

## Create and register an Azure virtual machine

2. Click Quick Start > **Protect your virtual machines** > **Add virtual machines to register**. 

3. To create a new virtual machine click **New** > **Compute** > **Virtual Machine** > **From Gallery**. 
4. In the **Choose an Image** page of the Create a Virtual Machine wizard specify the image you want to use.
5. In the first **Virtual Machine Configuration** page specify a name, release date, tier, size, and credentials.
6. In the second **Virtual Machine Configuration** page specify the security extensions that will be running on the virtual machine and make sure **Microsoft Backup Extension** is selected in the Protection Extensions. Select the vault to which you want to register the virtual machine.
7. The virtual machine is created and automatically registered in the vault. It's started automatically. During registration it appears with the status Registering rin the **Registered Items** page of the vault. After it's done it will show up as **Registered**. It's also listed under **Virtual Machines** in the management portal.

## Protect the virtual machine

1. Select the virtual machine in the **Registered Items** page > **Protect**.
2. On the **Select items to protect** page of the **Protect Items** wizard, in the **Unprotected Items** list check the virtual machines for which you want to enable protection. These will appear on the right-hand **Selected Items** list.
3. On the **Specify protection details** page you'll select a protection policy. A policy defines the backup schedule and how long the backup is retained in Azure Backup. If you don't have a protection policy defined specify a name for the policy, and its schedule and retention settings.
4. After protection is configured the virtual machine will show with a Protected status on the **Protected Items** page. A

## Run a backup
After initial replication completes the virtual machine will be backed up in accordance with the policy schedule, or you can click **Backup Now** to run a manual backup.
Backup Now uses the retention policy that's applied to the virtual machine Backup. It runs a  full backup and creates a recovery point.



## Run a restore
1. To restore a virtual machine from the backup on the **Protected Items** page click **Restore**.
2. On the **Select a recovery point** page in the **Restore a Virtual Machine** wizard you can restore from the newest recovery point, or from a previous point in time.
3. On the **Select restore location** page select to restore the virtual machine to the original location or an alternate. If you select alternate you'll need to specify the alternate virtual machine name, cloud service, and target network. You can select to backup the virtual machine.

## Manage protected virtual machines
1. You can double-click on protected virtual machines in the **Protected Items** page to drill down.
2. To view virtual machine backup information click the **Backup Details** tab that shows cwhen the virtual machine was last backed up, its backup status, and its latest recovery point. For status you can open the **Jobs** tab and filter jobs for the specific virtual machine. 
3. To view the backup schedule and retention settings for the virtual machine click the **Backup Policy** tab that shows the applied policy. You can apply a different policy or create a new policy on the **Policies** page.
4. To stop protecting a virtual machine select it in **Protected Items** > **Stop Backup**. You can specify whether you want to delete the backup for the virtual machine that's currently in Azure Backup, and optionally specify a reason for auditing purposes. The virtual machine will show in the page with the **Protection Stopped** status.

Note that if you didn't select to delete the backup when you stopped backup for the virtual machine you can select the virtual machine in the Protected Items page and click **Delete**. If you want to remove the virtual machine from the backup vault, select it and click **Unregister** to remove it completely.


## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.>
[Azure free trial]: ./pricing/free-trial/
[Link 2 to another azure.microsoft.com documentation topic]: ./pricing/free-trial/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
