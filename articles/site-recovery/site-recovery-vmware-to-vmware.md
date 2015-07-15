<properties 
	pageTitle="Set up protection between on-premises VMware Sites" 
	description="Use this article to configure protection between two VMware sites using Azure Site Recovery." 
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
	ms.date="07/15/2015" 
	ms.author="raynew"/>


# Set up protection between on-premises VMware sites


## Overview

InMage Scout in Azure Site Recovery provides real-time replication between on-premises VMware sites. InMage Scout is included in Azure Site Recovery service subscriptions.


## Prerequisites

- **Azure account**—You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. You can start with a [free trial](pricing/free-trial/).

## Updates

No components updates are available at this time.


## Step 1: Create a vault and download InMage Scout

1. Sign in to the [Management Portal](https://portal.azure.com).
2. Click **Data Services** > **Recovery Services** > **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name** enter a friendly name to identify the vault.
5. In **Region** select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](pricing/details/site-recovery/).

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as <b>Active</b> on the main Recovery Services page.</P>

## Step 2: Configure the vault

1. Click **Create vault**.
2. In the **Recovery Services** page, click the vault to open the Quick Start page.
3. In the dropdown list, select **Between two on-premises VMware sites**.
4. Download InMage Scout. The setup files for all of the required components are in the downloaded zip file.
5. Set up replication between two VMware sites using the InMage Scout documentation that's downloaded with the product. Alternatively you can access the documentation as follows:

- [User guide](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf)
- [Compatibility matrix](http://download.microsoft.com/download/C/D/A/CDA1221B-74E4-4CCF-8F77-F785E71423C0/InMage_Scout_Standard_Compatibility_Matrix.pdf)	
- [Quick installation guide](http://download.microsoft.com/download/6/8/5/685E761C-8493-42EB-854F-FE24B5A6D74B/InMage_Scout_Standard_Quick_Install_Guide.pdf)
- [Release notes](http://download.microsoft.com/download/4/5/0/45008861-4994-4708-BFCD-867736D5621A/InMage_Scout_Standard_Release_Notes.pdf)
- [RX user guide](http://download.microsoft.com/download/A/7/7/A77504C5-D49F-4799-BBC4-4E92158AFBA4/InMage_ScoutCloud_RX_User_Guide_8.0.1.pdf)


## Next steps

Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).< 