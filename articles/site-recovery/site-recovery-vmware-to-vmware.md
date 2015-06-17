<properties 
	pageTitle="Deploy between on-premises VMWare Sites" 
	description="InMage Scout in Azure Site Recovery handles the replication, failover and recovery between on-premises VMWare sites." 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/29/2015" 
	ms.author="raynew"/>


# Deploy between on-premises VMWare sites


##Overview

InMage Scout in Azure Site Recovery provides real-time replication between on-premises VMWare sites . InMage Scout is included in subscriptions to the Azure Site Recovery service.


## Prerequisites

- **Azure account**—You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. You can start with a [free trial](pricing/free-trial/).


##Step 1: Create a vault and download InMage Scout

1. Sign in to the [Management Portal](https://portal.azure.com).
2. Click **Data Services** > **Recovery Services** > **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name** enter a friendly name to identify the vault.
5. In **Region** select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](pricing/details/site-recovery/).

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as <b>Active</b> on the main Recovery Services page.</P>

##Step 2: Configure the vault

1. Click **Create vault**.
2. In the **Recovery Services** page, click the vault to open the Quick Start page.
3. In the dropdown list, select **Between two on-premises VMWare sites**.
4. Download InMage Scout.
5. Set up replication between two VMWare sites using the InMage Scout documentation that's downloaded with the product.


##Next steps

Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).< 