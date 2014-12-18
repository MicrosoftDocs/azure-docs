<properties linkid="configure-hyper-v-recovery-vault" urlDisplayName="configure-Azure-Site-Recovery" pageTitle="Getting Started with Azure Site Recovery: Protection Between Two On-Premises VMWare sites with InMage" metaKeywords="Azure Site Recovery, VMM, clouds, disaster recovery, VMWare, InMage" description="InMage in Azure Site Recovery handles the replication, failover and recovery between on-premises VMWare sites." metaCanonical="" umbracoNaviHide="0" disqusComments="1" title="Getting Started with Azure Site Recovery: On-Premises to On-Premises VMWare Site Protection with InMage" editor="jimbe" manager="johndaw" authors="raynew" />

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/19/2014" ms.author="raynew" />


# Getting Started with Azure Site Recovery:  On-Premises to On-Premises VMWare Site Protection


<div class="dev-callout"> 

<p>InMage in Azure Site Recovery provides real-time replication between on-premises VMWare sites . InMage is included in subscriptions to the Azure Site Recovery service.</p>


</div>


<h2><a id="before"></a>Prerequisites</h2> 
<div class="dev-callout"> 

<UL>
<LI><b>Azure account</b>—You'll need an Azure account. If you don't have one, see <a href="http://aka.ms/try-azure">Azure free trial</a>. Get subscription pricing information at <a href="http://go.microsoft.com/fwlink/?LinkId=378268">Azure Site Recovery Manager Pricing Details</a>.</LI>
</UL>



<a name="vault"></a> <h2>Step 1: Create a vault and download InMage</h2>

1. Sign in to the [Management Portal](https://manage.windowsazure.com).


2. Expand <b>Data Services</b>, expand <b>Recovery Services</b>, and click <b>Site Recovery Vault</b>.


3. Click <b>Create New</b> and then click <b>Quick Create</b>.
	
4. In <b>Name</b>, enter a friendly name to identify the vault.

5. In <b>Region</b>, select the geographic region for the vault. To check supported regions see Geographic Availability in <a href="http://go.microsoft.com/fwlink/?LinkId=389880">Azure Site Recovery Pricing Details</a>

6. Click <b>Create vault</b>. 

	![New Vault](./media/hyper-v-recovery-manager-configure-vault/SRSAN_HvVault.png)

<P>Check the status bar to confirm that the vault was successfully created. The vault will be listed as <b>Active</b> on the main Recovery Services page.</P>

<a name="upload"></a> <h2>Step 2: Configure the vault</h2>


1. In the <b>Recovery Services</b> page, click the vault to open the Quick Start page. Quick Start can also be opened at any time using the icon.

	![Quick Start Icon](./media/hyper-v-recovery-manager-configure-vault/SRSAN_QuickStartIcon.png)

2. In the dropdown list, select **Between two on-premises VMWare sites**.
3. Download InMage Scout.
	
	![VMWare](./media/hyper-v-recovery-manager-configure-vault/SRVMWare_SelectScenario.png)

4. Set up replication between two VMWare sites using the InMage documentation that's downloaded with the product.



<h2><a id="next"></a>Next steps</h2>
<UL>

<LI>For questions, visit the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</LI> 
</UL>
