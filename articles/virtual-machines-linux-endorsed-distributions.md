<properties urlDisplayName="Endorsed distributions" pageTitle="Endorsed distributions of Linux in Azure" metaKeywords="" description="Learn about Linux on Azure-endorsed distributions, including guidelines for Ubuntu, OpenLogic, and SUSE." metaCanonical="" services="virtual-machines" documentationCenter="" title="Linux on Azure-Endorsed Distributions" authors="kathydav" solutions="" manager="timlt" editor="tysonn" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="kathydav" />





#Linux on Azure-Endorsed Distributions

The distribution images on the Azure Gallery are provided by the following partners, and we are working with the various Linux communities to bring even more endorsed distributions. In the meantime, for distributions not available from the Gallery you can always Bring Your Own Linux by following the guidelines on [this page](../virtual-machines-linux-create-upload-vhd/).

## Canonical ##
 
[http://www.ubuntu.com/cloud/azure](http://www.ubuntu.com/cloud/azure)

Canonical engineering and open community governance drive Ubuntu's success in client, server and cloud computing,  including personal cloud services for consumers. Canonical's vision of a unified free platform in Ubuntu, from phone to cloud, with a family of coherent interfaces for the phone, tablet, TV and desktop, makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics, and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers and software developers to bring Ubuntu solutions to market, from PCs to servers and handheld devices.

## OpenLogic ##
 
[http://www.openlogic.com/azure](http://www.openlogic.com/azure)

OpenLogic is a leading provider of enterprise open source solutions for the cloud and the data center. OpenLogic helps hundreds of leading enterprise across a wide range of industries to safely acquire, support, and control open source software. OpenLogic offers commercial-grade technical support and indemnification for 600 open source packages backed by the OpenLogic Expert Community, including enterprise level support for CentOS as well as being the launch partner for providing CentOS-based images on Azure.

## Oracle##
[http://www.oracle.com/technetwork/topics/cloud/faq-1963009.html](http://www.oracle.com/technetwork/topics/cloud/faq-1963009.html)

Oracle’s strategy is to offer a broad portfolio of solutions for public and private clouds, while giving customers choice and flexibility in how they deploy Oracle software in Oracle clouds as well as other clouds.  Oracle’s partnership with Microsoft enables customers to deploy Oracle software in Microsoft public and private clouds with the confidence of certification and support from Oracle.  Oracle’s commitment and investment in Oracle public and private cloud solutions is unchanged.

##SUSE##
 
[http://www.suse.com/suse-linux-enterprise-server-on-azure](http://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Azure cloud services to deliver an easily manageable cloud environment. And with more than 9,200 certified applications from over 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Azure.

## Supported Versions ##

The following table shows the different distribution versions, Linux Integration Services (LIS) drivers and Azure Linux Agent versions that have been tested to work on Azure. LIS drivers are either built into the distribution's kernel by default, or are available [here](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409). Linux Agent versions are available from the distribution's package repository or on [Github](https://github.com/azure/walinuxagent).

The table also includes a link to the [Linux kernel compatibility patch](http://go.microsoft.com/fwlink/?LinkID=403027&clcid=0x409) required by some distribution/kernel versions to work optimally in Azure.

<table border="1" width="600">
  <tr bgcolor="#E9E7E7">
		<th>Distribution</th>		
	    <th>Version</th>
	    <th>Drivers</th>
		<th>Kernel Compatibility Patch</th>
		<th>Agent</th>
			</tr>
	<tr>
		<th>  Canonical Ubuntu </th>
		<td> Ubuntu 12.04.1+, 14.04 & 14.10 </td>
		<td>In Kernel</td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275152&amp;clcid=0x409">Required for 12.04 or 12.04.01 only</a></td>
		<td>Package: In package repo under walinuxagent <br />
			Source: <a href="http://go.microsoft.com/fwlink/p/?LinkID=250998">GitHub</a></td>
			</tr>
	<tr>
		<th> CentOS by OpenLogic </th>
		<td> CentOS 6.3+</td>
	    <td>CentOS 6.3: <a href="http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409">LIS drivers</a>; CentOS 6.4+ drivers: in Kernel</td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275153&amp;clcid=0x409">Required for 6.3 only</a></td>
		<td>Package:In <a href="http://olcentgbl.trafficmanager.net/openlogic/6/openlogic/x86_64/RPMS/">Open Logic package repo </a> under walinuxagent<br />
			Source: <a href="http://go.microsoft.com/fwlink/p/?LinkID=250998">GitHub</a></td>
 		
	</tr>
	<tr>
		<th> CoreOS </th>
		<td> 475.1.0 <i>Alpha</i><sup style="font-weight:bold">1</sup> </td>
        <td> In Kernel </td>
		<td> N/A </td>
		<td> Source: <a href="https://github.com/coreos/coreos-overlay/tree/master/app-emulation/wa-linux-agent">GitHub</a></td>
		
	</tr>
	<tr>
		<th> Oracle Linux </th>
		<td> 6.4+</td>
        <td>In Kernel</td>
		<td>N/A</td>
		<td>Package: In repo, name: WALinuxAgent<br />
			Source: <a href="http://go.microsoft.com/fwlink/p/?LinkID=250998">GitHub</a></td>
		
	</tr>
	<tr>
		<th> SUSE Linux Enterprise </th>
		<td> SLES 11 SP3+</td>
        <td>In Kernel</td>
		<td>N/A</td>
		<td>Package: In <a href="https://build.opensuse.org/project/show/Cloud:Tools" >Cloud:Tools</a> repo, name: WALinuxAgent<br />
			Source Code: <a href="http://go.microsoft.com/fwlink/p/?LinkID=250998">GitHub</a></td>
		
	</tr>
	<tr>
		<th> openSUSE </th>
		<td> openSUSE 13.1+</td>
		<td>In Kernel</td>
		<td>N/A</td>
		<td>Package: In <a href="https://build.opensuse.org/project/show/Cloud:Tools" >Cloud:Tools</a> repo, name: WALinuxAgent<br />
			Source Code: <a href="http://go.microsoft.com/fwlink/p/?LinkID=250998">GitHub</a></td>
		
	</tr>
</table>

 <sup style="font-weight:bold">1</sup> **Note:** CoreOS on Azure is currently in developer preview (*alpha*).

