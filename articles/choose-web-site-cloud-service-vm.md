<properties linkid="manage-scenarios-choose-web-app-service" urlDisplayName="Web Options for Azure" pageTitle="Azure Websites, Cloud Services and Virtual Machines comparison" metaKeywords="Cloud Services, Virtual Machines, Web Sites" description="Learn when to use Azure Websites, Cloud Services, and Virtual Machines for hosting web applications. Review a feature comparison." metaCanonical="" services="web-sites,virtual-machines,cloud-services" documentationCenter="" title=" Cloud Services" authors="jroth" solutions="" manager="paulettm" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jroth" />





# Azure Websites, Cloud Services and Virtual Machines comparison

Azure offers several ways to host your web applications, such as [Azure Websites][], [Cloud Services][], and [Virtual Machines][]. After looking at these various options, you might be unsure which one best fits your needs, or you might be unclear about concepts such as IaaS vs PaaS. This article helps you understand your options and helps you make the right choice for your web scenario. Although all three options allow you to run highly scalable web applications in Azure, there are differences which can help guide your decision.

In many situations, Azure Websites is the best option. It provides simple and flexible options for deployment and management, and it is capable of hosting high-volume websites. You can quickly create a new website with popular software, such as WordPress, from the Web Application Gallery, or you can move an existing website to Azure Websites. Using the [Azure WebJobs SDK][] (currently in preview) you can also add background job processing. 

You also have the option to host web applications on Azure Cloud Services or Azure Virtual Machines. These options are good choices when your web tier requires the additional level of control and customization that they provide; however, this increased control comes at a cost of increased complexity in application creation, management, and deployment. The following diagram illustrates the trade-offs among the three options.

![ChoicesDiagram][ChoicesDiagram]

Websites are easier to set up, manage, and monitor, but you have fewer configuration options. The key point is that when you do not have a compelling reason to place your web front-end on Cloud Services or Virtual Machines, use Azure Websites. The remainder of this document provides the information needed to make an informed decision. This includes:

- [Scenarios](#scenarios)
- [Service Summaries](#services)
- [Feature Comparison](#features)

##<a name="scenarios"></a>Scenarios

### I'm a small business owner, and I need an inexpensive way to host my site but with future growth in mind.

Azure Websites (WAWS) is a great solution for this scenario, because you can start using it for free and then add more capabilities when you need them. For example, each free website comes with a domain provided by Azure (*your_company*.azurewebsites.net). When you’re ready to start using your own domain, you can add this for as low as $9.80 a month (as of 1/2014). There are many other services and scaling options that allow the site to evolve with increased user demand. With **Azure Websites**, you can:

- Begin with the free tier and then scale up as needed.
- Use the Application Gallery to quickly setup popular web applications, such as WordPress.
- Add additional Azure services and features to your application as needed.
- Secure your website with HTTPS using the certificate provided with your *your_company*.azurewebsites.net domain name.

### I'm a web or graphic designer, and I want to design and build websites for my customers

For web developers, Azure Websites gives you what you need to create sophisticated web applications. Websites offers tight integration with tools such as Visual Studio and SQL database. With **Websites**, developers can:

- Use command-line tools for [automated tasks][scripting].
- Work with popular languages such as [.Net][dotnet], [PHP][], [Node.js][nodejs], and [Python][].
- Select three different scaling levels for scaling up to very high capacities.
- Integrate with other Azure services, such as [SQL Database][sqldatabase], [Service Bus][servicebus] and [Storage][], or partner offerings from the [Azure Store][azurestore], such as MySQL and MongoDB.
- Integrate with tools, such as Visual Studio, Git, WebMatrix, WebDeploy, TFS, and FTP.

### I'm migrating my multi-tier application with a web front-end to the Cloud

If you’re running a multi-tier application, such as a web server that talks to a database server to store and retrieve website data, you have several options for in Azure. These architectural options include Websites, Cloud Services, and Virtual Machines. First, **Websites** is a good option for the web tier of your solution and can be used with Azure SQL Database to create a two-tier architecture. Websites also allows you to run background or long running processes using the Azure WebJobs SDK preview. If you need more complex architecture or more flexible scaling options, Cloud Services or Virtual Machines are a better choice. 

**Cloud Services** enables you to:

- Host web, middle-tier, and backend services on scalable web and worker roles. 
- Host only the middle-tier and backend services on worker roles, keeping the front-end on Azure Websites. 
- Scale frontend and backend services independently.

**Virtual Machines** enables you to: 

- More easily migrate highly customized environments as a virtual machine image.
- Run software or services that cannot be configured on Websites or Cloud Services.

### My application depends on highly customized Windows or Linux environments

If your application requires complex installation or configuration of software and the operating system, Virtual Machines is probably the best solution. With **Virtual Machines**, you can:

- Use the Virtual Machine gallery to start with an operating system, such as Windows or Linux, and then customize it for your application requirements. 
- Create and upload a custom image of an existing on-premises server to run on a virtual machine in Azure. 

### My site uses open source software, and I want to host it in Azure

All three options allow you to host open source languages and frameworks. **Cloud Services** requires you to use startup tasks to install and configure any required open source software that runs on Windows. With **Virtual Machines**, you install and configure the software on the machine image, which can be Windows or Linux-based. If your open source framework is support on Websites, this provides a simpler way to host these types of applications as Websites can be automatically configured with the languages and frameworks needed by your application. **Websites** enables you to:

- Use many popular open source languages, such as [.NET][dotnet], [PHP][], [Node.js][nodejs], and [Python][]. 
- Setup WordPress, Drupal, Umbraco, DNN, and many other third-party web applications. 
- Migrate an existing application or create a new one from the Application Gallery. 

### I have a line-of-business application that needs to connect to the corporate network

If you want to create a line-of-business application, your website might require direct access to services or data on the corporate network. This is possible on **Websites**, **Cloud Services**, and **Virtual Machines**. There are differences in the approach you take, which include the following:

- Websites can securely connect to on-premises resources through the use of Service Bus Relay. This allows services on the corporate network to perform tasks on behalf of the web application without moving everything to the Cloud or setting up a virtual network. 
- Cloud Services and Virtual Machines can take advantage of Virtual Network. In effect, Virtual Network allows machines running in Azure to connect to an on-premises network. Azure then becomes an extension of your corporate datacenter.

### I want to host a REST API or web service for mobile clients

HTTP-based web services allows you to support a wide variety of clients, including mobile clients. Frameworks like the ASP.NET Web API integrate with Visual Studio to make it easier to create and consume REST services.  These services are exposed from a web endpoint, so it is possible to use any web hosting technique on Azure to support this scenario. However, **Websites** is a great choice for hosting REST APIs. With Websites, you can:

- Quickly create a Website to host the HTTP web service in one of Azure’s globally distributed datacenters.
- Migrate existing services or create new ones, potentially taking advantage of the ASP.NET Web API in Visual Studio.
- Achieve SLA for availability with a single instance, or scale out to multiple dedicated machines. 
- Use the published site to provide REST APIs to any HTTP clients, including mobile clients.

##<a name="services"></a>Service Summaries

[Azure Websites][] enables you to build highly scalable websites quickly on Azure. You can use the Azure Portal or the command-line tools to set up a website with popular languages such as .NET, PHP, Node.js, and Python. Supported frameworks are already deployed and do not require more installation steps. The Azure Websites gallery contains many third-party applications, such as Drupal and WordPress as well as development frameworks such as Django and CakePHP. After creating a site, you can either migrate an existing website or build a completely new website. Websites eliminates the need to manage the physical hardware, and it also provides several scaling options. You can move from a shared multi-tenant model to a standard mode where dedicated machines service incoming traffic. Websites also enable you to integrate with other Azure services, such as SQL Database, Service Bus, and Storage. Using the [Azure WebJobs SDK][] preview, you can add background processing. In summary, Azure Websites make it easier to focus on application development by supporting a wide range of languages, open source applications, and deployment methodologies (FTP, Git, Web Deploy, or TFS). If you don’t have specialized requirements that require Cloud Services or Virtual Machines, an Azure Website is most likely the best choice.

[Cloud Services][] enable you to create highly-available, scalable web applications in a rich Platform as a Service (PaaS) environment. Unlike Websites, a cloud service is created first in a development environment, such as Visual Studio, before being deployed to Azure. Frameworks, such as PHP, require custom deployment steps or tasks that install the framework on role startup. The main advantage of Cloud Services is the ability to support more complex multitier architectures. A single cloud service could consist of a frontend web role and one or more worker roles. Each tier can be scaled independently. There is also an increased level of control over your web application infrastructure. For example, you can remote desktop onto the machines that are running the role instances. You can also script more advanced IIS and machine configuration changes that run at role startup, including tasks that require administrator control.

[Virtual Machines][] enable you to run web applications on virtual machines in Azure. This capability is also known as Infrastructure as a Service (IaaS). Create new Windows Server or Linux machines through the portal, or upload an existing virtual machine image. Virtual Machines give you the most control over the operating system, configuration, and installed software and services. This is a good option for quickly migrating complex on-premises web applications to the cloud, because the machines can be moved as a whole. With Virtual Networks, you can also connect these virtual machines to on-premises corporate networks. As with Cloud Services, you have remote access to these machines and the ability to perform configuration changes at the administrative level. However, unlike Websites and Cloud Services, you must manage your virtual machine images and application architecture completely at the infrastructure level. One basic example is that you have to apply your own patches to the operating system.

##<a name="features"></a>Feature Comparison

The following table compares the capabilities of Websites, Cloud Services, and Virtual Machines to help you make the best choice. Boxes with an asterisk are explained more in the notes following the table.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Feature</th>
   <th align="left" valign="middle">Websites</th>
   <th align="left" valign="middle">Cloud Services (web roles)</th>
   <th align="left" valign="middle">Virtual Machines</th>
</tr>
<tr>
   <td valign="middle"><p>Access to services like Service Bus, Storage, SQL Database</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Host web or web services tier of a multi-tier architecture</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Host middle tier of a multi-tier architecture</p></td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Integrated MySQL-as-a-service support</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X <sup>1</sup></td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Support for ASP.NET, classic ASP, Node.js, PHP, Python</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Scale out to multiple instances without redeploy</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X <sup>2</sup></td>
</tr>
<tr>
   <td valign="middle"><p>Support for SSL</p></td>
   <td valign="middle">X <sup>3</sup></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Visual Studio integration</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Remote Debugging</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Deploy code with TFS</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Deploy code with GIT, FTP</p></td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Deploy code with Web Deploy</p></td>
   <td valign="middle">X</td>
   <td valign="middle"><sup>4</sup></td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>WebMatrix support</p></td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Near-instant deployment</p></td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
   <td valign="middle"></td>
</tr>
<tr>
   <td valign="middle"><p>Instances share content and configuration</p></td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
   <td valign="middle"></td>
</tr>
<tr>
   <td valign="middle"><p>Scale up to larger machines without redeploy</p></td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
   <td valign="middle"></td>
</tr>
<tr>
   <td valign="middle"><p>Multiple deployment environments (production and staging)</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
</tr>
<tr>
   <td valign="middle"><p>Network isolation with Azure Virtual Network</p></td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Support for Azure Traffic Manager</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Remote desktop access to servers</p></td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Ability to define/execute start-up tasks</p></td>
   <td valign="middle"></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Automatic OS update management</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
</tr>
<tr>
   <td valign="middle"><p>Integrated Endpoint Monitoring</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
</tr>
<tr>
   <td valign="middle"><p>Seamless platform switching (32bit/64bit)</p></td>
   <td valign="middle">X</td>
   <td valign="middle">X</td>
   <td valign="middle"></td>
</tr>
</table>

<sup>1</sup> Web or worker roles can integrate MySQL-as-a-service through ClearDB's offerings, but not as part of the Management Portal workflow.

<sup>2</sup> Although Virtual Machines can scale out to multiple instances, the services running on these machines must be written to handle this scale-out. An additional load balancer must be configured to route requests across the machines. Finally, an Affinity Group should be created for all machines participating in the same role to protect them from simultaneous restarts from maintenance or hardware failures.

<sup>3</sup> For Websites, SSL for custom domain names is only supported for standard mode. For more information on using SSL with Websites, see [Configuring an SSL certificate for an Azure Website][].

<sup>4</sup> Web Deploy is supported for cloud services when deploying to single-instance roles. However, production roles require multiple instances to meet the Azure SLA. Therefore, Web Deploy is not a suitable deployment mechanism for cloud services in production.


  [ChoicesDiagram]: ./media/choose-web-site-cloud-service-vm/Websites_CloudServices_VMs_2.png
  [Azure Websites]: http://go.microsoft.com/fwlink/?LinkId=306051
  [Cloud Services]: http://go.microsoft.com/fwlink/?LinkId=306052
  [Virtual Machines]: http://go.microsoft.com/fwlink/?LinkID=306053
  [ClearDB]: http://www.cleardb.com/
  [Azure WebJobs SDK]: http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/getting-started-with-windows-azure-webjobs
  [Configuring an SSL certificate for an Azure Website]: http://www.windowsazure.com/en-us/develop/net/common-tasks/enable-ssl-web-site/
  [azurestore]: http://www.windowsazure.com/en-us/gallery/store/
  [scripting]: http://www.windowsazure.com/en-us/documentation/scripts/?services=web-sites
  [dotnet]: http://www.windowsazure.com/en-us/develop/net/
  [nodejs]: http://www.windowsazure.com/en-us/develop/nodejs/
  [PHP]: http://www.windowsazure.com/en-us/develop/php/
  [Python]: http://www.windowsazure.com/en-us/develop/python/
  [servicebus]: http://www.windowsazure.com/en-us/documentation/services/service-bus/
  [sqldatabase]: http://www.windowsazure.com/en-us/documentation/services/sql-database/
  [Storage]: http://www.windowsazure.com/en-us/documentation/services/storage/
