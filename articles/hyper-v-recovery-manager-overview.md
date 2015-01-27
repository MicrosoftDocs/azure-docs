<properties pageTitle="Azure Site Recovery Overview" description="Deploy Azure Site Recovery to protect virtual machines on Hyper-V host servers that are located in VMM clouds. You can deploy from one on-premises site to another, or from an on-premises site to Azure." editor="jimbe" manager="jwhit" authors="rayne-wiselman" services="site-recovery" documentationCenter=""/>

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/19/2014" ms.author="raynew"/>

# Azure Site Recovery Overview


<p>Azure Site Recovery orchestrates replication and failover in a number of scenarios:</p>


<ul>
<li>**On-premises Hyper-V site to Azure protection with Hyper-V replication** — Orchestrate replication, failover, and recovery from an on-premises site with one or more Hyper-V servers but without System Center VMM. Virtual machine data is replicated from a source Hyper-V host server to Azure. Read <a href="http://go.microsoft.com/fwlink/?LinkId=522298">Getting started with Azure Site Recovery: Protection Between an On-Premises Hyper-V Site and Azure with Hyper-V Replication</a>.</li>
<li>**On-premises VMM site to on-premises VMM site protection with Hyper-V replication** — Orchestrate replication, failover, and recovery between on-premises VMM sites. Virtual machine data is replicated from a source Hyper-V host server to a target host server. Read <a href="http://go.microsoft.com/fwlink/?LinkId=398765">Getting started with Azure Site Recovery: Protection Between Two On-Premises VMM Sites with Hyper-V Replication</a>.</li>

<li>**On-premises VMM site to on-premises VMM site protection with SAN replication** — Orchestrates end-to-end replication, failover, and recovery using storage array-based replication between SAN devices that host virtual machine data in source and target on-premises sites. Read <a href="http://go.microsoft.com/fwlink/?LinkId=518683">Getting started with Azure Site Recovery: : Protection Between Two On-Premises VMM Sites with SAN replication</a>.</li>

<li>**On-premises VMM site to Azure protection** — Orchestrate replication, failover, and recovery between an on-premises VMM site and Azure. Replicated virtual machine data is stored in Azure storage. Read <a href="http://go.microsoft.com/fwlink/?LinkId=398764">Getting Started with Azure Site Recovery: Protection between an On-Premises VMM Site and Azure.</a></li>

<li>**On-premises VMWare site to on-premises VMWare site with InMage** — InMage Scout is a recent Microsoft acquisition that provides real-time replication between on-premises VMWare sites. Right now InMage is available as a separate product that's obtained via a subscription to the Azure Site Recovery service. Read <a href="http://go.microsoft.com/fwlink/?LinkId=518684">Getting Started with Azure Site Recovery: Protection between an On-Premises VMWare Sites with InMage</a>.</li>
</ul>

<p>The feature matrix summarizes these scenarios.</p>

<table border="1">
<thead>
<tr>
	<th>Feature</th><th>On-Premises to Azure</th>
	<th>On-Premises to On-Premises (Hyper-V)</th>
	<th>On-Premises to On-Premises (SAN)</th>
</tr>
</thead>

<tr>
<td>Data to Azure Site Recovery</td>
<td><p>Cloud metadata is sent to Azure Site Recovery.</p> <p>Replicated data is stored in Azure storage.</p></td>
<td><p>Cloud metadata is sent to Azure Site Recovery.</p> <p>Replicated data is stored in the location specified by the target Hyper-V server.</p></td>
<td><p>Cloud metadata is sent to Azure Site Recovery.</p> <p>Replicated data is stored in the target array storage.</p></td>
</tr>

<tr>
<td>Vault requirements</td>
<td><p>You'll need an Azure account to set up an Azure Site Recovery vault. see <a href="http://aka.ms/try-azure">Azure free trial</a>. Get pricing information at <a href="http://go.microsoft.com/fwlink/?LinkId=378268">Azure Site Recovery Manager Pricing Details</a>.</p></td>
<td><p>Azure account with Azure Site Recovery enabled.</p>
</td><td><p>Azure account with Azure Site Recovery enabled.</p></td>
</tr>

<tr>
<td>Replication</td>
<td>Virtual machines replicate from source on-premises Hyper-V server to target Azure storage. You can set up reverse replication to replicate back to the source location.</td>
<td>Virtual machines replicate from source on-premises Hyper-V server to another. You can set up reverse replication to replicate back to the source location.</td>
<td>Virtual machines replicate from source SAN storage device to target SAN device. You can set up reverse replication to replicate back to the source location.</td>
</tr>

<tr>
<td>Virtual machine storage</td>
<td>Virtual machine hard disk stored in Azure storage</td>
<td>Virtual machine hard disk stored on Hyper-V host.</td>
<td>Virtual machine hard disk stored on SAN storage array.</td>
</tr>

<tr>
<td>Azure storage</td>
<td><p>Azure storage account required.</p> <p>The account should have geo-replication enabled, be located in the the same region as the Azure Site Recovery service, and be associated with the same subscription.</p></td>
<td>Not applicable</td>
<td>Not applicable</td>
</tr>

<tr>
<td>SAN storage array</td>
<td><p>Not applicable</p></td>
<td>Not applicable</td>
<td>SAN storage array must be available in both the source and target sites and managed by VMM. See <a href="http://go.microsoft.com/fwlink/?LinkId=518685">Deployment prerequisites</a> for more information. </td>
</tr>

<tr>
<td>VMM server</td>
<td>Requires a VMM server only in the source site only. The VMM server must have an least one cloud that contains at least one Hyper-V host server or cluster.</td>
<td>Requires source and target VMM servers with at least one cloud on each, or a single VMM server with two clouds. Clouds must contain at least one Hyper-V host server or cluster.</td>
<td>Requires source and target VMM servers with at least one cloud on each. Clouds must contain at least one Hyper-V cluster.</td>
</tr>

<tr>
<td>VMM System Center version</td>
<td>System Center 2012 R2</td>
<td><p>System Center 2012 with SP1</p><p>System Center 2012 R2</p></td>
<td><p>System Center 2012 R2 with VMM Update Rollup 5.0</p></td>
</tr>

<tr>
<td>VMM configuration</td>
<td><p>Set up clouds in source and target sites</p><p>Set up VM networks in source and target site</p><p>Set up storage classifications in source and target sites <p>Install the Provider on source and target VMM servers</p></td>
<td><p>Set up clouds in source site</p><p>Set up SAN storage</p><p>Set up VM networks in source site</p><p>Install the Provider on source VMM server</p><p>Enable virtual machine protection</p></td>
<td><p>Set up clouds in source and target sites</p><p>Set up VM networks in source and target sites</p><p>Install the Provider on source and target VMM server</p><p>Enable virtual machine protection</p></td>
</tr>

<tr>
<td>Azure Site Recovery Provider</td>
<td>Install on source VMM server</td>
<td>Install on source and target VMM servers</td>
<td>Install on source and target VMM servers</td>
</tr>

<tr>
<td>Azure Recovery Services Agent</td>
<td>Install on Hyper-V host servers located in VMM clouds</td>
<td>Not required</td>
<td>Not required</td>
</tr>

<tr>
<td>Virtual machine recovery points</td>
<td><p>Set recovery points by time.</p> <p>Specifies how long a recovery point should be kept (0-24 hours). A recovery point is created using the formula 90/copy_frequency during the first hour,and then once an hour.</p></td>
<td><p>Set recovery points by amount.</p> <p>Specifies how many additional recovery points should be kept (0-15). By default a recovery point is created every hour. When set to zero only the latest recovery point is stored on the replica Hyper-V host server.</p></td>
<td>Configured in array storage settings.</td>
</tr>

<tr>
<td>Network mapping</td>
<td><p>Map VM networks to Azure networks.</p> <p>Network mapping ensures that all virtual machines that fail over in the same source VM network can connect after failover. In addition if there's a network gateway on the target Azure network then virtual machines can connect to on-premises virtual machines. </p><p>If mapping isn't enabled only virtual machines that fail over in the same recovery plan can connect to each other after failover to Azure.</p></td>
<td><p>Map source VM networks to target VM networks.</p> <p>Network mapping is used to place replicated virtual machines on optimal Hyper-V host servers, and ensures that virtual machines associated with the source VM network are associated with the mapped target network after failover. </p><p>If mapping isn't enabled replicated virtual machines won't be connected to a network.</p></td>
<td><p>Map source VM networks to target VM networks.</p> <p>Network mapping ensures that virtual machines associated with the source VM network are associated with the mapped target network after failover. </p><p>If mapping isn't enabled replicated virtual machines won't be connected to a network.</p></td>
</tr>

<tr>
<td>Storage mapping</td>
<td>Not applicable</td>
<td><p>Maps storage classifications on source VMM servers to storage classifications on target VMM servers.</p> <p>With mapping enable virtual machine hard disks in the source storage classification will be located in the target storage classification after failover.</p><p>If storage mapping isn't enabled replicated virtual hard disks will be stored in the default location on the target Hyper-V host server.</p></td>
<td><p>Maps between storage arrays and pools in the primary and secondary sites.</p></td>
</tr>

</table>

<p>For questions, visit the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</p> 