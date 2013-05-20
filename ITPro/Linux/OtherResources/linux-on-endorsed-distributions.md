<properties linkid="manage-linux-other-resources-endorsed-distributions" urlDisplayName="Endorsed distributions" pageTitle="Endorsed distributions of Linux in Windows Azure" metaKeywords="" metaDescription="Learn about Linux on Windows Azure-endorsed distributions, including guidelines for Ubuntu, OpenLogic, and SUSE." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="kathydav" editor="tysonn" manager="jeffreyg" />

<div chunk="../chunks/linux-left-nav.md" />

#Linux on Windows Azure-Endorsed Distributions

The distribution images on the Gallery are provided by the following partners and we are working with the community to bring even more endorsed distributions. In the meantime you can always Bring your Own Linux following the guidelines in this page.

## Canonical ##
 
[http://www.ubuntu.com/cloud/azure](http://www.ubuntu.com/cloud/azure)

Canonical engineering and open community governance drive Ubuntu's success in client, server and cloud computing,  including personal cloud services for consumers. Canonical's vision of a unified free platform in Ubuntu, from phone to cloud, with a family of coherent interfaces for the phone, tablet, TV and desktop, makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics, and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers and software developers to bring Ubuntu solutions to market, from PCs to servers and handheld devices.

## OpenLogic ##
 
[http://www.openlogic.com/azure/index.php](http://www.openlogic.com/azure/index.php)

OpenLogic is a leading provider of enterprise open source solutions for the cloud and the data center. OpenLogic helps hundreds of leading enterprise across a wide range of industries to safely acquire, support, and control open source software. OpenLogic offers commercial-grade technical support and indemnification for 600 open source packages backed by the OpenLogic Expert Community, including enterprise level support for CentOS as well as being the launch partner for providing Centos images on Windows Azure.

##SUSE##
 
[http://www.suse.com/suse-linux-enterprise-server-on-azure](http://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Windows Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Windows Azure cloud services to deliver an easily manageable cloud environment. And with more than 9,200 certified applications from over 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Windows Azure.

The following table shows the different distribution versions, LIS drivers and Agent Versions that have been tested to work on Windows Azure.
The table also includes a link to the Kernel compatibility patch required by some distribution versions to work optimally in Windows Azure.

Note that the different distributions will be incorporating the agent to their official distribution archives shortly, but for the time being we are releasing all the RPM and Deb packages for the agent plus the drivers for CentOS on the same ISO. 

<table border="1" width="600">
  <tr bgcolor="#E9E7E7">
		<th>Distribution</th>		
	    <th>Version</th>
	    <th>Drivers</th>
		<th>Kernel Compatibility Patch</th>
		<th>Agent</th>
		<th>Base Images</th>
	</tr>
	<tr>
		<th>  Canonical UBUNTU </th>
		<td> Ubuntu 12.04.1, 12.10, and 13.04</td>
		<td>In Kernel</td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275152&amp;clcid=0x409">Required for 12.04.x only</a></td>
		<td>Deb: In package repo under walinuxagent <br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
		<td><a href="http://go.microsoft.com/fwlink/p/?LinkId=301511">Download base VHD</a></td>
	</tr>
	<tr>
		<th> CENTOS by Open Logic </th>
		<td> CentOS 6.3</td>
	    <td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254263">Latest LIS drivers</a></td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275153&amp;clcid=0x409">Required for 6.2 and 6.3 only</a></td>
		<td>RPM:In <a href="http://olcentgbl.trafficmanager.net/openlogic/6/openlogic/x86_64/RPMS/">Open Logic package repo </a> under walinuxagent<br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
 		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254266">Download ISO</a></td>
	</tr>
	<tr>
		<th> SUSE Linux Enterprise </th>
		<td> SLES 11 SP2</td>
        <td>In Kernel</td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275154&amp;clcid=0x409">Latest Kernel required</a></td>
		<td>RPM: In package repo under walinuxagent<br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=301278">Create base image</a></td>
	</tr>
	<tr>
		<th> openSUSE </th>
		<td> OpenSUSE 12.3</td>
		<td>In Kernel</td>
		<td><a href="http://go.microsoft.com/fwlink/?LinkID=275155&amp;clcid=0x409">Latest Kernel required</a></td>
		<td>RPM: In package repo under walinux<br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=301281">Create base image</a></td>
	</tr>
</table>