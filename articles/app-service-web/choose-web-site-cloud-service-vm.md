<properties
	pageTitle="Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison | Microsoft Azure"
	description="Learn how to choose between Azure App Service, Virtual Machines, Service Fabric, and Cloud Services for hosting web applications."
	services="app-service\web, virtual-machines, cloud-services"
	documentationCenter=""
	authors="tdykstra"
	manager="wpickett"
	editor="jimbe"/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/06/2016"
	ms.author="tdykstra"/>

# Azure App Service, Virtual Machines, Service Fabric, and Cloud Services comparison

## Overview

Azure offers several ways to host web sites: [Azure App Service][], [Virtual Machines][], [Service Fabric][], and [Cloud Services][]. This article helps you understand the options and make the right choice for your web application.

Azure App Service is the best choice for most web apps. Deployment and management are integrated into the platform, sites can scale quickly to handle high traffic loads, and the built-in load balancing and traffic manager provide high availability. You can move existing sites to Azure App Service easily with an [online migration tool](https://www.migratetoazure.net/), use an open-source app from the Web Application Gallery, or create a new site using the framework and tools of your choice. The [WebJobs][] feature makes it easy to add background job processing to your App Service web app.

Service Fabric is a good choice if you’re creating a new app or re-writing an existing app to use a microservice architecture. Apps, which run on a shared pool of machines, can start small and grow to massive scale with hundreds or thousands of machines as needed. Stateful services make it easy to consistently and reliably store app state, and Service Fabric automatically manages service partitioning, scaling, and availability for you.  Service Fabric also supports WebAPI with Open Web Interface for .NET (OWIN) and ASP.NET Core.  Compared to App Service, Service Fabric also provides more control over, or direct access to, the underlying infrastructure. You can remote into your servers or configure server startup tasks. Cloud Services is similar to Service Fabric in degree of control versus ease of use, but it’s now a legacy service and Service Fabric is recommended for new development.

If you have an existing application that would require substantial modifications to run in App Service or Service Fabric, you could choose Virtual Machines in order to simplify migrating to the cloud. However, correctly configuring, securing, and maintaining VMs requires much more time and IT expertise compared to Azure App Service and Service Fabric. If you are considering Azure Virtual Machines, make sure you take into account the ongoing maintenance effort required to patch, update, and manage your VM environment. Azure Virtual Machines is Infrastructure-as-a-Service (IaaS), while App Service and Service Fabric are Platform-as-a-Service (Paas). 

##<a name="scenarios"></a>Scenarios and recommendations

Here are some common application scenarios with recommendations as to which Azure web hosting option might be most appropriate for each.

- [I need a web front end with background processing and database backend to run business applications integrated with on premise assets.](#onprem)
- [I need a reliable way to host my corporate website that scales well and offers global reach.](#corp)
- [I have an IIS6 application running on Windows Server 2003.](#iis6)
- [I'm a small business owner, and I need an inexpensive way to host my site but with future growth in mind.](#smallbusiness)
- [I'm a web or graphic designer, and I want to design and build web sites for my customers.](#designer)
- [I'm migrating my multi-tier application with a web front-end to the Cloud.](#multitier)
- [My application depends on highly customized Windows or Linux environments and I want to move it to the cloud.](#custom)
- [My site uses open source software, and I want to host it in Azure.](#oss)
- [I have a line-of-business application that needs to connect to the corporate network.](#lob)
- [I want to host a REST API or web service for mobile clients.](#mobile)


### <a id="onprem"></a> I need a web front end with background processing and database backend to run business applications integrated with on premise assets.

Azure App Service is a great solution for complex business applications. It lets you develop apps that scale automatically on a load balanced platform, are secured with Active Directory, and connect to your on-premises resources. It makes managing those apps easy through a world-class portal and APIs, and allows you to gain insight into how customers are using them with app insight tools. The [Webjobs][] feature lets you run background processes and tasks as part of your web tier, while hybrid connectivity and VNET features make it easy to connect back to on-premises resources. Azure App Service provides three 9's SLA for web apps and enables you to:

* Run your applications reliably on a self-healing, auto-patching cloud platform.
* Scale automatically across a global network of datacenters.
* Back up and restore for disaster recovery.
* Be ISO, SOC2, and PCI compliant.
* Integrate with Active Directory

### <a id="corp"></a> I need a reliable way to host my corporate website that scales well and offers global reach.

Azure App Service is a great solution for hosting corporate websites. It enables web apps to scale quickly and easily to meet demand across a global network of datacenters. It offers local reach, fault tolerance, and intelligent traffic management. All on a platform that provides world-class management tools, allowing you to gain insight into site health and site traffic quickly and easily. Azure App Service provides three 9's SLA for web apps and enables you to:

* Run your websites reliably on a self-healing, auto-patching cloud platform.
* Scale automatically across a global network of datacenters.
* Back up and restore for disaster recovery.
* Manage logs and traffic with integrated tools.
* Be ISO, SOC2, and PCI compliant.
* Integrate with Active Directory

### <a id="iis6"></a> I have an IIS6 application running on Windows Server 2003.

Azure App Service makes it easy to avoid the infrastructure costs associated with migrating older IIS6 applications. Microsoft has created [easy to use migration tools and detailed migration guidance](https://www.movemetowebsites.net/) that enable you to check compatibility and identify any changes that need to be made. Integration with Visual Studio, TFS, and common CMS tools makes it easy to deploy IIS6 applications directly to the cloud. Once deployed, the Azur Portal provides robust management tools that enable you to scale down to manage costs and up to meet demand as necessary. With the migration tool you can:

* Quickly and easily migrate your legacy Windows Server 2003 web application to the cloud.
* Opt to leave your attached SQL database on-premise to create a hybrid application.
* Automatically move your SQL database along with your legacy application.

### <a id="smallbusiness"></a>I'm a small business owner, and I need an inexpensive way to host my site but with future growth in mind.

Azure App Service is a great solution for this scenario, because you can start using it for free and then add more capabilities when you need them. Each free web app comes with a domain provided by Azure (*your_company*.azurewebsites.net), and the platform includes integrated deployment and management tools as well as an application gallery that make it easy to get started. There are many other services and scaling options that allow the site to evolve with increased user demand. With Azure App Service, you can:

- Begin with the free tier and then scale up as needed.
- Use the Application Gallery to quickly set up popular web applications, such as WordPress.
- Add additional Azure services and features to your application as needed.
- Secure your web app with HTTPS.

### <a id="designer"></a> I'm a web or graphic designer, and I want to design and build websites for my customers

For web developers and designers, Azure App Service integrates easily with a variety of frameworks and tools, includes deployment support for Git and FTP, and offers tight integration with tools and services such as Visual Studio and SQL Database. With App Service, you can:

- Use command-line tools for [automated tasks][scripting].
- Work with popular languages such as [.Net][dotnet], [PHP][], [Node.js][nodejs], and [Python][].
- Select three different scaling levels for scaling up to very high capacities.
- Integrate with other Azure services, such as [SQL Database][sqldatabase], [Service Bus][servicebus] and [Storage][], or partner offerings from the [Azure Store][azurestore], such as MySQL and MongoDB.
- Integrate with tools such as Visual Studio, Git, WebMatrix, WebDeploy, TFS, and FTP.

### <a id="multitier"></a>I'm migrating my multi-tier application with a web front-end to the Cloud

If you’re running a multi-tier application, such as a web server that connects to a database, Azure App Service is a good option that offers tight integration with Azure SQL Database. And you can use the WebJobs feature for running backend processes.

Choose Service Fabric for one or more of your tiers if you need more control over the server environment, such as the ability to remote into your server or configure server startup tasks.

Choose Virtual Machines for one or more of your tiers if you want to use your own machine image or run server software or services that you can't configure on Service Fabric.

### <a id="custom"></a>My application depends on highly customized Windows or Linux environments and I want to move it to the cloud.

If your application requires complex installation or configuration of software and the operating system, Virtual Machines is probably the best solution. With Virtual Machines, you can:

- Use the Virtual Machine gallery to start with an operating system, such as Windows or Linux, and then customize it for your application requirements.
- Create and upload a custom image of an existing on-premises server to run on a virtual machine in Azure.

### <a id="oss"></a>My site uses open source software, and I want to host it in Azure

If your open source framework is supported on App Service, the languages and frameworks needed by your application are configured for you automatically. App Service enables you to:

- Use many popular open source languages, such as [.NET][dotnet], [PHP][], [Node.js][nodejs], and [Python][].
- Set up WordPress, Drupal, Umbraco, DNN, and many other third-party web applications.
- Migrate an existing application or create a new one from the Application Gallery.

If your open source framework is not supported on App Service, you can run it on one of the other Azure web hosting options. With Virtual Machines, you install and configure the software on the machine image, which can be Windows or Linux-based.

### <a id="lob"></a>I have a line-of-business application that needs to connect to the corporate network

If you want to create a line-of-business application, your website might require direct access to services or data on the corporate network. This is possible on App Service, Service Fabric, and Virtual Machines using the [Azure Virtual Network service](/services/virtual-network/). On App Service you can use the [VNET integration feature](https://azure.microsoft.com/blog/2014/09/15/azure-websites-virtual-network-integration/), which allows your Azure applications to run as if they were on your corporate network.

### <a id="mobile"></a>I want to host a REST API or web service for mobile clients

HTTP-based web services enable you to support a wide variety of clients, including mobile clients. Frameworks like ASP.NET Web API integrate with Visual Studio to make it easier to create and consume REST services.  These services are exposed from a web endpoint, so it is possible to use any web hosting technique on Azure to support this scenario. However, App Service is a great choice for hosting REST APIs. With App Service, you can:

- Quickly create a [mobile app](../app-service-mobile/app-service-mobile-value-prop.md) or [API app](../app-service-api/app-service-api-apps-why-best-platform.md) to host the HTTP web service in one of Azure’s globally distributed datacenters.
- Migrate existing services or create new ones.
- Achieve SLA for availability with a single instance, or scale out to multiple dedicated machines.
- Use the published site to provide REST APIs to any HTTP clients, including mobile clients.

##<a name="features"></a>Feature Comparison

The following table compares the capabilities of App Service, Cloud Services, Virtual Machines, and Service Fabric to help you make the best choice. For current information about the SLA for each option, see [Azure Service Level Agreements](/support/legal/sla/).

Feature|App Service (web apps)|Cloud Services (web roles)|Virtual Machines|Service Fabric|Notes
---|---|---|---|---|---
Near-instant deployment|X|||X|Deploying an application or an application update to a Cloud Service, or creating a VM, takes several minutes at least; deploying an application to a web app takes seconds.
Scale up to larger machines without redeploy|X|||X|
Web server instances share content and configuration, which means you don't have to redeploy or reconfigure as you scale.|X|||X|
Multiple deployment environments (production and staging)|X|X||X|Service Fabric allows you to have multiple environments for your apps or to deploy different versions of your app side-by-side.
Automatic OS update management|X|X|||Automatic OS updates are planned for a future Service Fabric release.
Seamless platform switching (easily move between 32 bit and 64 bit)|X|X|||
Deploy code with GIT, FTP|X||X||
Deploy code with Web Deploy|X||X||Cloud Services supports the use of Web Deploy to deploy updates to individual role instances. However, you can't use it for initial deployment of a role, and if you use Web Deploy for an update you have to deploy separately to each instance of a role. Multiple instances are required in order to qualify for the Cloud Service SLA for production environments.
WebMatrix support|X||X||
Access to services like Service Bus, Storage, SQL Database|X|X|X|X|
Host web or web services tier of a multi-tier architecture|X|X|X|X|
Host middle tier of a multi-tier architecture|X|X|X|X|App Service web apps can easily host a REST API middle tier, and the [WebJobs](http://go.microsoft.com/fwlink/?linkid=390226) feature can host background processing jobs. You can run WebJobs in a dedicated website to achieve independent scalability for the tier. The preview [API apps](../app-service-api/app-service-api-apps-why-best-platform.md) feature provides even more features for hosting REST services.
Integrated MySQL-as-a-service support|X|X|X||Cloud Services can integrate MySQL-as-a-service through ClearDB's offerings, but not as part of the Azure Portal workflow.
Support for ASP.NET, classic ASP, Node.js, PHP, Python|X|X|X|X|Service Fabric supports the creation of a web front-end using [ASP.NET 5](../service-fabric/service-fabric-add-a-web-frontend.md) or you can deploy any type of application (Node.js, Java, etc) as a [guest executable](../service-fabric/service-fabric-deploy-existing-app.md).
Scale out to multiple instances without redeploy|X|X|X|X|Virtual Machines can scale out to multiple instances, but the services running on them must be written to handle this scale-out. You have to configure a load balancer to route requests across the machines, and create an Affinity Group to prevent simultaneous restarts of all instances due to maintenance or hardware failures.
Support for SSL|X|X|X|X|For App Service web apps, SSL for custom domain names is only supported for Basic and Standard mode. For information about using SSL with web apps, see [Configuring an SSL certificate for an Azure Website](../app-service-web/web-sites-configure-ssl-certificate.md).
Visual Studio integration|X|X|X|X|
Remote Debugging|X|X|X||
Deploy code with TFS|X|X|X|X|
Network isolation with [Azure Virtual Network](/services/virtual-network/)|X|X|X|X|See also [Azure Websites Virtual Network Integration](/blog/2014/09/15/azure-websites-virtual-network-integration/)
Support for [Azure Traffic Manager](/services/traffic-manager/)|X|X|X|X|
Integrated Endpoint Monitoring|X|X|X||
Remote desktop access to servers||X|X|X|
Install any custom MSI||X|X|X|Service Fabric allows you to host any executable file as a [guest executable](../service-fabric/service-fabric-deploy-existing-app.md) or you can install any app on the VMs.
Ability to define/execute start-up tasks||X|X|X|
Can listen to ETW events||X|X|X|


> [AZURE.NOTE]
> If you want to get started with Azure App Service before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived starter app in Azure App Service for free. No credit card required, no commitments.


## <a id="nextsteps"></a> Next Steps

For more information about the three web hosting options, see [Introducing Azure](../fundamentals-introduction-to-azure.md).

To get started with the option(s) you choose for your application, see the following resources:

* [Azure App Service](/documentation/services/app-service/)
* [Azure Cloud Services](/documentation/services/cloud-services/)
* [Azure Virtual Machines](/documentation/services/virtual-machines/)
* [Service Fabric](/documentation/services/service-fabric)

  [ChoicesDiagram]: ./media/choose-web-site-cloud-service-vm/Websites_CloudServices_VMs_3.png
  [Azure App Service]: /services/app-service/
  [Cloud Services]: http://go.microsoft.com/fwlink/?LinkId=306052
  [Virtual Machines]: http://go.microsoft.com/fwlink/?LinkID=306053
  [Service Fabric]: /services/service-fabric
  [ClearDB]: http://www.cleardb.com/
  [WebJobs]: http://go.microsoft.com/fwlink/?linkid=390226&clcid=0x409
  [Configuring an SSL certificate for an Azure Website]: http://www.windowsazure.com/develop/net/common-tasks/enable-ssl-web-site/
  [azurestore]: http://www.windowsazure.com/gallery/store/
  [scripting]: http://www.windowsazure.com/documentation/scripts/?services=web-sites
  [dotnet]: http://www.windowsazure.com/develop/net/
  [nodejs]: http://www.windowsazure.com/develop/nodejs/
  [PHP]: http://www.windowsazure.com/develop/php/
  [Python]: http://www.windowsazure.com/develop/python/
  [servicebus]: http://www.windowsazure.com/documentation/services/service-bus/
  [sqldatabase]: http://www.windowsazure.com/documentation/services/sql-database/
  [Storage]: http://www.windowsazure.com/documentation/services/storage/
