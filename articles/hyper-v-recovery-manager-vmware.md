<properties pageTitle="Getting Started with Azure Site Recovery: Protection Between Two On-Premises VMWare sites with InMage" description="InMage in Azure Site Recovery handles the replication, failover and recovery between on-premises VMWare sites." editor="jimbe" manager="jwhit" authors="rayne-wiselman" services="site-recovery" documentationCenter=""/>

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/19/2014" ms.author="raynew"/>


# Getting Started with Azure Site Recovery:  On-Premises to On-Premises VMWare Site Protection


InMage in Azure Site Recovery provides real-time replication between on-premises VMWare sites . InMage is included in subscriptions to the Azure Site Recovery service.


##<a id="before"></a>Prerequisites

- **Azure account**—You'll need an Azure account. If you don't have one, see [Azure free trial](http://aka.ms/try-azure). Get subscription pricing information at [Azure Site Recovery Manager Pricing Details](http://go.microsoft.com/fwlink/?LinkId=378268).



##<a name="vault"></a>Step 1: Create a vault and download InMage

1. Sign in to the [Management Portal](https://manage.windowsazure.com).


2. Expand **Data Services**, expand **Recovery Services**, and click **Site Recovery Vault**.


3. Click **Create New** and then click **Quick Create**.
	
4. In **Name**, enter a friendly name to identify the vault.

5. In **Region**, select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](href="http://go.microsoft.com/fwlink/?LinkId=389880)

6. Click **Create vault**. 

	![New Vault](./media/hyper-v-recovery-manager-configure-vault/SRSAN_HvVault.png)

Check the status bar to confirm that the vault was successfully created. The vault will be listed as **Active** on the main Recovery Services page.

##<a name="upload"></a> Step 2: Configure the vault


1. In the **Recovery Services** page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/hyper-v-recovery-manager-configure-vault/SRSAN_QuickStartIcon.png)

2. In the dropdown list, select **Between two on-premises VMWare sites**.
3. Download InMage Scout.
	
	![VMWare](./media/hyper-v-recovery-manager-configure-vault/SRVMWare_SelectScenario.png)

4. Set up replication between two VMWare sites using the InMage documentation that's downloaded with the product.



##<a id="next"></a>Next steps

- For questions, visit the [Azure Recovery Services Forum](http://go.microsoft.com/fwlink/?LinkId=313628).
