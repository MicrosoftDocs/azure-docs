<properties linkid="choosing-azure-websites-cloudservices-vms" urlDisplayName="Web Options for Windows Azure" pageTitle="Windows Azure Web Sites, Cloud Services, and VMs: When to use which?" metaKeywords="Cloud Services,Virtual Machines,Web Sites" metaDescription="Understand when to use Windows Azure Web Sites, Cloud Services, and Virtual Machines for web workloads." umbracoNaviHide="0" disqusComments="1" writer="jroth" editor="mollybos" manager="paulettm" /> 

<div chunk="../chunks/web-sites-left-nav.md" />

# Windows Azure Web Sites, Cloud Services, and VMs: When to use which?

This document provides guidance on how to make an informed decision in choosing between Windows Azure Web Sites, Cloud Services, and virtual machines to host a web application. Each of these services allows you to run highly scalable web applications in Windows Azure. Most of the differences involve a trade-off between manageability and control.

![ChoicesDiagram][]

[Windows Azure Web Sites][] enables you to build highly scalable websites quickly on Windows Azure. You can use the Windows Azure Portal or the command-line tools to set up a website with popular frameworks such as .NET, PHP, and Python. These supported frameworks are already deployed and do not require more installation steps. The Windows Azure Web Sites gallery contains many third-party applications, such as Drupal and WordPress as well as development frameworks such as Django and CakePHP. After creating a site, you can either migrate an existing website or build a completely new website. There is no need to learn a new application model or to manage your own machines. Web Sites are also easy to scale. Using the portal, you can move from a shared multitenant model to a reserved mode where dedicated machines service incoming traffic. Web Sites also allows you to integrate with other Windows Azure services, such as SQL Database, Service Bus, and Storage. In summary, Windows Azure Web Sites makes it easier to focus on application development by supporting a wide range of languages, open source applications, and deployment methodologies (FTP, Git, WebDeploy, or TFS). If you don’t have specialized requirements that require Cloud Services or virtual machines, a Windows Azure Web Site is most likely the best choice.

[Cloud Services][] enables you to create highly-available, scalable web applications in a rich Platform as a Service (PaaS) environment. Unlike Web Sites, a cloud service is created first in a development environment, such as Visual Studio, before being deployed to Windows Azure. Frameworks, such as PHP, require custom deployment steps or tasks that install the framework on role startup. The main advantage of Cloud Services is the ability to support more complex multitier architectures. A single cloud service could consist of a frontend web role and one or more worker roles. Each tier can be scaled independently. Developing in a PaaS environment supports code and architecture options that get the most out of the platform. There is also an increased level of control over your web application infrastructure. For example, you can remote desktop onto the machines that are running the role instances. You can also script more advanced IIS and machine configuration changes that run at role startup, including tasks that require administrator control.

[Virtual Machines][] enable you to run web applications on virtual machines in Windows Azure. This capability is also known as Infrastructure as a Service (IaaS). Create new Windows Server or Linux machines through the portal, or upload an existing virtual machine image. Virtual machines give you the most control over the operating system, configuration, and installed software and services. This is a good option for quickly migrating complex on-premises web applications to the cloud, because the machines can be moved as a whole. With Virtual Networks, you can also connect these virtual machines to on-premises corporate networks. As with Cloud Services, you have remote access to these machines and the ability to perform configuration changes at the administrative level. However, unlike Web Sites and Cloud Services, you must manage your virtual machine images and application architecture completely at the infrastructure level.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Windows Azure Web Sites are ideal for... </th>
   <th align="left" valign="top">Windows Azure Cloud Services are ideal for... </th>
   <th align="left" valign="top">Windows Azure Virtual Machines are ideal for... </th></tr>
<tr>
   <td valign="top"><p><b>Modern Web Applications</b>. Applications that consist of a client-side markup and scripting, server-side scripting and a database. You can scale out or up as needed.</p></td>
   <td valign="top"><p><b>Multi-tier Applications</b>. Applications that are composed of multiple tiers. Each tier can be scaled independently, with asynchronous background processing, like order processing, using both web and worker roles.</p></td>
   <td valign="top"><p><b>Server Applications</b>. Existing applications that leverage SQL Server, MySQL, MongoDB, SharePoint Server, etc.</p></td>
</tr>
<tr>
   <td valign="top"><p><b>Continuous Development</b>. Deploy directly from your source code repository by using Git or Team Foundation Service.</p></td>
   <td valign="top"><p><b>Applications that Require Advanced Administration</b>. Applications that require administrator access, remote desk"top" access, or running code with elevated privileges.</p></td>
   <td valign="top"><p><b>Existing Line-of-business Applications</b>. Choose an image from the gallery or upload your own VHD.</p></td>
</tr>
<tr>
   <td valign="top"><p><b>Popular Open Source Applications</b>. Launch a website with a few clicks with such applications as WordPress, Joomla!, and Drupal. Create advanced, high-traffic open-source websites on Windows Azure.</p></td>
   <td valign="top"><p><b>Applications that Require Advanced Networking</b>. Applications that require network isolation with Windows Azure Virtual Network.</p></td>
   <td valign="top"><p><b>Windows or Linux</b>. Support for Windows Server and community/commercial versions of Linux. Connect virtual machines with Cloud Services to take advantage of PaaS services.</p></td>
</tr>
</table>

## Web Sites and Cloud Services Feature Comparison

When you consider the options, virtual machines can be used for almost any application architecture. However, Web Sites and Cloud Services have similar use cases and advantages; knowing when to use each can be difficult. The following table compares the capabilities of Web Sites and Cloud Services to help you make the best choice.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Feature</th>
   <th align="left" valign="top">Web Sites</th>
   <th align="left" valign="top">Web Roles</th>
</tr>
<tr>
   <td valign="top"><p>Access to services like Service Bus, Storage, SQL Database</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Integrated MySQL-as-a-service support</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b>, see note below</p></td>
</tr>
<tr>
   <td valign="top"><p>Support for ASP.NET, classic ASP, Node.js, PHP, Python</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Scale out to multiple instances without redeploy</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Support for SSL</p></td>
   <td valign="top"><p><b>Yes</b>, see note below</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Visual Studio integration</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Deploy code with TFS</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Deploy code with GIT, FTP</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No</p></td>
</tr>
<tr>
   <td valign="top"><p>Deploy code with Web Deploy</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No, see note below</p></td>
</tr>
<tr>
   <td valign="top"><p>WebMatrix support</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No</p></td>
</tr>
<tr>
   <td valign="top"><p>Near-instant deployment</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No</p></td>
</tr>
<tr>
   <td valign="top"><p>Instances share content and configuration</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No</p></td>
</tr>
<tr>
   <td valign="top"><p>Scale up to larger machines without redeploy</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
   <td valign="top"><p>No</p></td>
</tr>
<tr>
   <td valign="top"><p>Multiple deployment environments (production and staging)</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Network isolation with Windows Azure Virtual Network</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Support for Windows Azure Traffic Manager Preview</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Support for CDN</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Remote desk"top" access to servers</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
<tr>
   <td valign="top"><p>Ability to define/execute start-up tasks</p></td>
   <td valign="top"><p>No</p></td>
   <td valign="top"><p><b>Yes</b></p></td>
</tr>
</table>

<div class="dev-callout">
    <strong>Note</strong>
    <p>Web or worker roles can integrate MySQL-as-a-service through <a href="http://www.cleardb.com/">ClearDB</a>'s offerings, but not as part of the Management Portal workflow.</p>
    </div>

<div class="dev-callout">
    <strong>Note</strong>
    <p>For Web Sites, SSL is only supported for reserved mode. For more information on using SSL with Web Sites, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/enable-ssl-web-site/">Configuring an SSL certificate for a Windows Azure Web Site</a>.</p>
    </div>

<div class="dev-callout">
    <strong>Note</strong>
    <p>Web Deploy is supported for cloud services when deploying to single-instance roles. However, production roles require multiple instances to meet the Windows Azure SLA. Therefore, Web Deploy is not a suitable deployment mechanism for cloud services in production.</p>
    </div>

  [ChoicesDiagram]: ../media/Websites_CloudServices_VMs.png
  [Windows Azure Web Sites]: http://go.microsoft.com/fwlink/?LinkId=306051
  [Cloud Services]: http://go.microsoft.com/fwlink/?LinkId=306052
  [Virtual Machines]: http://go.microsoft.com/fwlink/?LinkID=306053
  [ClearDB]: http://www.cleardb.com/