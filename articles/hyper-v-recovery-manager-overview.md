<properties linkid="Azure Site Recovery Overview" urlDisplayName="Azure Site Recovery Overview" pageTitle="Azure Site Recovery Overview" metaKeywords="Azure Site Recovery, on-premises, clouds, Azure, VMM, Hyper-V" description="Deploy Azure Site Recovery to protect virtual machines on Hyper-V host servers that are located in VMM clouds. You can deploy from one on-premises site to another, or from an on-premises site to Azure." metaCanonical="" umbracoNaviHide="0" disqusComments="1" title="Azure Site Recovery Overview" editor="jimbe" manager="johndaw" authors="raynew" />

<tags ms.service="site-recovery" ms.workload="backup-recovery" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="raynew" />

# Azure Site Recovery Overview

<div class="dev-callout"> 
<p>Deploy Azure Site Recovery to protect virtual machines running on Hyper-V host servers that are located in System Center Virtual Machine Manager (VMM) clouds. You can deploy Azure Site Recovery in a couple of ways:</p>


<ul>
<li><b>On-premises to on-premises protection</b>—Replicate virtual machines from one on-premises site to another. You configure and enable protection settings in Azure Site Recovery vaults. Virtual machine data is replicated from a source Hyper-V host server to a target host server. Azure Site Recovery orchestrates the process. A tutorial for this scenario is available in <a href="http://go.microsoft.com/fwlink/?LinkId=398765">Getting started with Azure Site Recovery: On-premises to on-premises protection</a>.</li>

<li><b>On-premises to Azure protection</b>—Replicate virtual machines from an on-premises site to Microsoft Azure. You configure and enable protection settings in Azure Site Recovery vaults.  Azure Site Recovery orchestrates the process and replicated virtual machine data is stored in Azure storage. A tutorial for this scenario is available in <a href="http://go.microsoft.com/fwlink/?LinkId=398764">Getting Started with Azure Site Recovery: On-Premises to Azure Protection</a>.</li>
</ul>

<p>The following table summarizes and compares the two deployment options.</p>

<table border="1">
<thead>
<tr>
	<th>Feature</th><th>On-Premises to Azure</th>
	<th>On-Premises to On-Premises</th>
</tr>
</thead>

<tr>
<td>Data to Azure Site Recovery</td>
<td>Cloud metadata is sent to Azure Site Recovery. Replicated data is stored in Azure storage.</td>
<td>Cloud metadata is sent to Azure Site Recovery. Replicated data is stored on the target Hyper-V host server.</td>
</tr>

<tr>
<td>Vault requirements</td>
<td><p>The vault requires a certificate that complies with <a href=" http://go.microsoft.com/fwlink/?LinkId=386485">vault requirements</a>. </p><p>A vault key is generated automatically. The key ensures traffic integrity between the Azure Site Recovery Provider on the VMM server and Azure Site Recovery.</p></td>
<td><p>The vault requires a certificate that complies with <a href=" http://go.microsoft.com/fwlink/?LinkId=386485">vault requirements</a>. </p><p>A vault key is generated automatically. The key ensures traffic integrity between the Azure Site Recovery Provider on the VMM server and Azure Site Recovery.</p></td>
</tr>

<tr>
<td>Replication</td>
<td>Virtual machines replicate from an on-premises Hyper-V server to Azure storage.</td>
<td>Virtual machines replicate from one on-premises Hyper-V server to another.</td>
</tr>

<tr>
<td>Virtual machine storage</td>
<td>Virtual machine hard disk stored in Azure storage</td>
<td>Virtual machine hard disk stored on Hyper-V host.</td>
</tr>

<tr>
<td>Azure storage</td>
<td><p>Azure storage account required.</p> <p>The account should have geo-replication enabled, be located in the the same region as the Azure Site Recovery service, and be associated with the same subscription.</p></td>
<td>Not applicable</td>
</tr>

<tr>
<td>VMM server</td>
<td>Requires a source VMM server only</td>
<td>Requires source and target VMM servers with at least one cloud on each, or a single VMM server with two clouds</td>
</tr>

<tr>
<td>VMM server System Center version</td>
<td>System Center 2012 R2</td>
<td><p>System Center 2012 with SP1</p><p>System Center 2012 R2</p></td>
</tr>

<tr>
<td>Azure Site Recovery Provider</td>
<td>Install on source VMM server</td>
<td>Install on source and target VMM servers</td>
</tr>

<tr>
<td>Azure Recovery Services Agent</td>
<td>Install on Hyper-V host servers located in VMM clouds</td>
<td>Not required</td>
</tr>

<tr>
<td>Virtual machine recovery points</td>
<td><p>Set recovery points by time.</p> <p>Specifies how long a recovery point should be kept (0-24 hours). A recovery point is created using the formula 90/copy_frequency during the first hour,and then once an hour.</p></td>
<td><p>Set recovery points by amount.</p> <p>Specifies how many additional recovery points should be kept (0-15). By default a recovery point is created every hour. When set to zero only the latest recovery point is stored on the replica Hyper-V host server.</p></td>
</tr>

<tr>
<td>Network mapping</td>
<td><p>Map VM networks to Azure networks.</p> <p>Network mapping ensures that all virtual machines that fail over in the same source VM network can connect after failover. In addition if there's a network gateway on the target Azure network then virtual machines can connect to on-premises virtual machines. </p><p>If mapping isn't enabled only virtual machines that fail over in the same recovery plan can connect to each other after failover to Azure.</p></td>
<td><p>Map source VM networks to target VM networks.</p> <p>Network mapping is used to place replicated virtual machines on optimal Hyper-V host servers, and ensures that virtual machines associated with the source VM network are associated with the mapped target network after failover. </p><p>If mapping isn't enabled replicated virtual machines won't be connected to a network.</p></td>
</tr>

<tr>
<td>Storage mapping</td>
<td>Not applicable</td>
<td><p>Maps storage classifications on source VMM servers to storage classifications on target VMM servers.</p> <p>With mapping enable virtual machine hard disks in the source storage classification will be located in the target storage classification after failover.</p><p>If storage mapping isn't enabled replicated virtual hard disks will be stored in the default location on the target Hyper-V host server.</p></td>
</tr>

</table>

<p>For questions, visit the <a href="http://go.microsoft.com/fwlink/?LinkId=313628">Azure Recovery Services Forum</a>.</p> 