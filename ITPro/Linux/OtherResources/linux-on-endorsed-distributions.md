<properties umbracoNaviHide="0" pageTitle="Linux on Windows Azure-Endorsed Distributions" metaKeywords="Windows Azure virtual machine, Azure virtual machine, certificates, management certificates" metaDescription="Learn how to create management certificates for Linux on Windows Azure." linkid="manage-linux-how-to-guide-virtual-machines" urlDisplayName="How To Guides" headerExpose="" footerExpose="" disqusComments="1" />

#Linux on Windows Azure-Endorsed Distributions

The distribution images on the Gallery are provided by the following partners and we are working with the community to bring even more endorsed distributions. In the meantime you can always Bring your Own Linux following the guidelines in this page.

## Canonical ##
 
[http://www.ubuntu.com/cloud/azure](http://www.ubuntu.com/cloud/azure)

Canonical engineering and open commuwww.ubuntu.com/cloud/azurenity governance drive Ubuntu's success in client, server and cloud computing,  including personal cloud services for consumers. Canonical's vision of a unified free platform in Ubuntu, from phone to cloud, with a family of coherent interfaces for the phone, tablet, TV and desktop, makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics, and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers and software developers to bring Ubuntu solutions to market, from PCs to servers and handheld devices.

## OpenLogic ##
 
[http://www.openlogic.com/azure/index.php](http://www.openlogic.com/azure/index.php)

OpenLogic is a leading provider of enterprise open source solutions for the cloud and the data center. OpenLogic helps hundreds of leading enterprise across a wide range of industries to safely acquire, support, and control open source software. OpenLogic offers commercial-grade technical support and indemnification for 600 open source packages backed by the OpenLogic Expert Community, including enterprise level support for CentOS as well as being the launch partner for providing Centos images on Windows Azure.

##SUSE##
 
[http://www.suse.com/suse-linux-enterprise-server-on-azure](http://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Windows Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Windows Azure cloud services to deliver an easily manageable cloud environment. And with more than 9,200 certified applications from over 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Windows Azure.

The following table shows the different distribution versions, LIS drivers and Agent Versions that have been tested to work on Windows Azure.

Note that the different distributions will be incorporating the agent to their official distribution archives shortly, but for the time being we are releasing all the RPM and Deb packages for the agent plus the drivers for CentOS on the same ISO. 

<table border="1" width="600">
  <tr bgcolor="#E9E7E7">
		<th>Distribution</th>		
	    <th>Version</th>
	    <th>Last Verified</th>
		<th>Drivers</th>
		<th>Agent</th>
		<th>Base Images</th>
	</tr>
	<tr>
		<th>  Canonical UBUNTU </th>
		<td> Ubuntu 12.04</td>
		<td>June 7 2012</td>
        <td>In Kernel</td>
		<td>Deb: <A HREF="http://go.microsoft.com/p/fwlink/?LinkID=254261">ISO</A><br />
			Source: <A HREF="http://go.microsoft.com/p/fwlink/?LinkID=250998">GITHUB</A></td>
		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254264">Download base VHD</a></td>
	</tr>
	<tr>
		<th> CENTOS by Open Logi </th>
		<td> CentOS 6.2</td>
		<td>June 7 2012</td>
	    <td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254263">LIS 3.3</a></td>
		<td>RPM:<A HREF="http://go.microsoft.com/p/fwlink/?LinkID=254261">ISO</A><br />
			Source: <A HREF="http://go.microsoft.com/p/fwlink/?LinkID=250998">GITHUB</A></td>
 		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254266">Download ISO</a></td>
	</tr>
	<tr>
		<th> SUSE </th>
		<td> SLES 11SP2</td>
		<td>June 7 2012</td>
        <td>In Kernel</td>
		<td>RPM: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=2542619">ISO</A><br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
		<td><a href="http://go.microsoft.com/fwlink/p/?LinkID=254265">Create base image</a></td>
	</tr>
	<tr>
		<th> OPEN SUSE </th>
		<td> Open SUSE 12.1</td>
		<td>June 7 2012</td>
		<td>In Kernel</td>
		<td>RPM: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=254261">ISO</A><br />
			Source: <A HREF="http://go.microsoft.com/fwlink/p/?LinkID=250998">GITHUB</A></td>
		<td></td>
	</tr>
</table>