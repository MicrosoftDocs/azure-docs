<properties 
	pageTitle="Azure App Service Web Apps Offerings for Enterprise" 
	description="Shows how to use Azure App Service Web Apps to create enterprise website solutions for your business" 
	services="app-service\web" 
	documentationCenter="" 
	authors="apwestgarth" 
	writer="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="apwestgarth"/>

# Azure App Service Web Apps Offerings for Enterprise Whitepaper #

The need to reduce costs and deliver IT solutions faster in a rapidly evolving environment creates new challenges for Developers, IT Professionals, and Managers. Users are increasingly looking for their Line of Business (LOB) web applications to be quick, responsive, and available from any device. At the same time, businesses are trying to capitalize on the increased productivity and efficiency that comes from integration with cloud and mobile services, this may be something as simple as single sign-on across devices using Active Directory to collaboration in Office365 using data pulled from an internal LOB application which in turn pulls in data from the company implementation of Salesforce. [Azure App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) is an enterprise-class cloud service for developing, testing, and running web and mobile applications, Web APIs, and generic websites. It can be used to run corporate websites, business apps, and digital marketing campaigns on a global network of datacenters optimized for scale and availability, along with support for continuous integration and modern DevOps practices. 

This whitepaper highlights the capabilities of the [Web Apps](/services/app-service/web/) service specifically focused on running LOB Web Applications, covering migration of existing web applications and deployment of new LOB web applications on the platform. 

## Audience ##

IT Professionals, architects, and managers who are looking to migrate to the cloud web workloads that are currently running on-premises. Web workloads can span either Business to Employee or Business to Partners web applications.

## Introduction ##

App Service Web Apps is an ideal platform on which to host both external and internal web applications and services as it provides a cost-effective, highly scalable, managed solution allowing you to concentrate on delivering business value for your users rather than spending significant amounts of time and money maintaining and supporting separate environments. Web Apps offers a flexible platform on which to deploy your enterprise web applications offering the ability to continue to authenticate against on-premises Active Directory via integration with Microsoft Azure Active Directory, support of easy and quick deployments making use of your internal continuous integration and deployment practices, while automatically scaling to grow with the business needs - all on a managed platform that allows you to focus on your application and not your infrastructure. 

## Problem Definition ##

The IT landscape is changing rapidly, with a move away from hosting on traditional servers with their high capital costs on long lead times to one that uses on-demand use of services that scale automatically to handle load. IT departments are being challenged to reduce the cost and footprint of infrastructure and maintenance spend with a focus on reducing CAPEX while also increasing agility. The imminent end of life of older infrastructure platforms, such as Windows Server 2003, is leading IT departments to review cloud migration as a potential way to avoid new long term capital costs. In the past, CIOs would make purchasing decisions for other departments; however, increasingly CMOs and other business unit heads are taking a more active role in how their budget is spent and what the return on their investment is. Increasingly, businesses need their workforce to be far more mobile than ever before with employees working remotely, spending more time with customers needing access to systems hassle free.

Business needs change monthly, weekly, daily. Businesses are looking for instant global scale with regular updated services full of new features, provided by a third party or internally. Users have higher expectations, with many making use of services in their own private lives such as Office365. They expect to have access to similar, up to date, feature rich services in their work life. To cope with this demand, IT must look to help the business to enable this through selection and integration with third party services, careful selection of platforms which can adapt to the business needs, whilst also being reliable with a total reduced cost of ownership.

Development teams are looking to deliver immediate business benefit, delivering new features on a frequent basis. They are looking for a cost effective, reliable platform which integrates with their existing tools and practices – development, test, release; and working together with IT departments automates deployment, management and alerting, all with the goal of zero downtime.

<a href="highlevel" />
## High Level Solution ##

Web platforms and frameworks are increasingly being used to develop, test and host line of business applications.  With a typical line of business application, such as an internal employee expense system, often consisting solely of a web app with a backing database to store the data connected with the application.

App Service Web Apps is a good option for hosting such applications, offering scalable and reliable infrastructure which is managed and patched with near zero manual intervention and downtime. The Microsoft Azure platform provides many data storage options to support web applications hosted on Web Apps from Microsoft Azure SQL Database, a managed scalable relational database-as-a-service, to popular services from our partners such as ClearDB MySQL Database and MongoDB.

An alternative approach is to make use of your existing investment on premise. In the example scenario, an employee expense system, you may wish to maintain your data store within your own internal infrastructure. This could be for integration with internal systems (reporting, payroll, billing etc.) or to satisfy an IT governance requirement.  Web Apps provides two methods of enabling you to connect to your on premises infrastructure:

- [Hybrid Connections](integration-hybrid-connection-overview.md) – Hybrid Connections are a feature of Microsoft Azure BizTalk Services and enable Web Apps to connect to on premises resources securely, for example SQL Server, MySQL, Web APIs and custom web services. 
- [Virtual Network Integration](http://azure.microsoft.com/blog/2014/09/15/azure-websites-virtual-network-integration/) – Web Apps integrtaion with Azure Virtual Network allows you to connect your web app to an Azure Virtual Network which in turn can be connected to your on premises infrastructure through a site-to-site VPN. 

The following diagram is an example high-level solution with connectivity options for on premises resources.

![](./media/web-sites-enterprise-offerings/on-premise-connectivity-solutions.png)

## Business Benefits ##

App Service Web Apps provides a host of business benefits which enable your function to be much more cost-effective and agile in delivering for the business needs. 

### PaaS Model ###

App Service Web Apps is built on a Platform as a Service model which provides a number of cost and efficiency savings.  No longer do you need to spend hours managing VMs, patching Operating Systems and Frameworks. Web Apps is an automatically patched environment which enables you to focus on managing your web applications and not VMs, leaving teams free to provide additional business value.

The PaaS Model underpinning Web Apps enables practitioners of the DevOps methodology to fulfill their goals. As a business this means full management and integration throughout the application entire life cycle, including development, testing, release, monitoring and management, and support. 

For development teams, continuous integration and deployment workflows can be configured from Visual Studio Online, GitHub, TeamCity, Hudson or BitBucket, enabling automated build, test and deployment enabling faster release cycles whilst reducing the friction involved in releasing in existing infrastructure. Web Apps also supports the creation of multiple testing and staging environments for your release workflow, no longer do you need to reserve or allocate hardware for these purposes, you can create as many environments as you wish and define your own promotion to release workflow. As a business you could decide to release to a test slot from source control, perform a series of tests and upon successful completion promote to a stage slot and finally swap to production with no downtime, with the added benefit that web applications hosted on Web Apps are preloaded and hot to provide the best possible customer experience.

Operations teams can feel confident that they are in the best possible position to react to any issues with any of their web applications hosted on Web Apps with the built in monitoring and alerts features. Should Operations Teams have already invested in analytics and monitoring solutions such from Microsoft Visual Studio Application Insights, New Relic and AppDynamics. These are also fully supported on Web Apps enabling continuity and a familiar environments from which to monitor your web applications.

Finally, Web Apps provides functionality to automatically back up your app(s) and hosted database(s) direct to an Azure Blob Storage container. Providing you with an easy way and very cost effective method with which to recover from disaster, reducing the need for complex on premises hardware and software.

### Ease of Migration ###

Hardware maintenance and rotation is a key issue for businesses as release cycles for hardware and operating systems speed up. Maybe you have a number of Windows Server 2003 R2 servers which are coming to the end of support in 2015 but they are still hosting key web applications for your business? App Service Web Apps is a great candidate on which to host those web applications and for you to rationalize the business hardware estate. Web Apps gives you access to a range of hardware specifications which are managed and maintained as part of the service, eliminating the need to factor in replacement and management costs as part of your infrastructure budget.  Migration can be as simple as a copy and paste operation from your existing deployment to Web Apps or a more complex migration where using the Web Apps Migration Assistant will add value. Migrated web applications enjoy the full spectrum of Azure services, integrating additional services to the web applications. For example, you can consider adding Azure Active Directory to control access to your application based on users’ association to security groups. Another example can be adding Cache Services to improve performance and reduce latency, providing overall better user experience. 

### Enterprise Class Hosting ###

App Service Web Apps provides a stable, reliable platform which has been proven to be able to handle a wide variety of business needs from small internal development and test workloads, to highly scaled high traffic websites. By using Web Apps, you are making use of the same enterprise class hosting platform that Microsoft as a company uses for high value web workloads. Web Apps, along with all services on the Azure platform, are built with security and compliance with regulatory requirements, such as ISO (ISO/IEC 27001:2005); SOC1 and SOC2 SSAE 16/ISAE 3402 Attestations, HIPAA BAA, PCI and Fedramp, at the very heart of each element and feature, for more information please see [http://aka.ms/azurecompliance](/support/trust-center/compliance/). 

Microsoft Azure platform allows Role Based Authorization Controls enabling enterprise levels of control to resources within Web Apps. RBAC gives enterprises the power to implement their own access management policies for all of their assets in the Azure Environment, by assigning users to groups and in turn assigning the required permissions to those groups against the asset such as a web app. For more information on RBAC in Azure, see [http://aka.ms/azurerbac](../role-based-access-control-configure/). By utilizing Web Apps, you can be sure your web applications are deployed in a safe and secure environment and you have full control into which territory your assets are deployed. 

Additionally, Web Apps is also able to make full use of your on premises investments by offering the ability to connect back to your internal resources, such as your data warehouse or SharePoint environment. As discussed in [High Level solution] you can make use of Hybrid Connections and Virtual Network Connectivity to establish connections to on premises infrastructure and services.

### Global Scale ###

App Service Web Apps is a global and scalable platform, enabling your web applications to grow and adapt to the needs of a growing business quickly and with minimal long term planning and cost. In typical on premises infrastructure scenarios, expansion and increase in demand both locally and geographically would require a large amount of management, planning and expenditure to provision and manage additional infrastructure. Web Apps offers the ability to scale your web applications with the ebb and flow of your requirements. For example using the expenses application as an example, for the majority of the month your users are light users of the application but as the deadline each month for expense submissions to be entered and usage increases on your application, Web Apps has the capability to automatically provision more infrastructure for your application and then once the usage has subsided again it can scale back to the baseline infrastructure you define.

Web Apps is available globally in 17 datacenters worldwide, and growing. For the most updated list of regions and location, see [http://aka.ms/azlocations](http://aka.ms/azlocations). With Web Apps, your business can easily achieve global reach and scale. As your company grows into new regions, the reporting application dashboards that you use and host on Web Apps can easily be deployed into additional datacenters and serve local users far more quickly through the combination of Web Apps and Azure Traffic Manager, all with the added benefit of the scalable infrastructure underneath being able to contract and expand as the needs of the regional offices change.
 
## Solution Details ##

Let’s look at an example of an application migration scenario. This outlines the details of how App Service Web Apps features come to together to provide great solution and business value.
 
Throughout this example the line of business application we will be discussing is an expense reporting application that enables employees to submit their expenses for reimbursement. The application is hosted on a Windows Server 2003 R2 running IIS6 and the database is a SQL Server 2005 database. The reason we choose older server lies with the coming End of Service for Windows Server 2003 R2 and SQL Server 2005, and we have [tools](http://aka.ms/websitesmigration) and [guidance](http://aka.ms/websitesmigrationresources) to automatically migrate workloads into Azure. With that in mind, the pattern used in this example apply to a wide verity of migration scenarios. 

### Migrate Existing Application ###

Step one of the overall solution for moving a line-of-business application to Web Apps is to identify the existing application assets and architecture. The example in this paper is an ASP.NET web application hosted on a single IIS Server with the database hosted on a separate SQL Server, as shown in the figure below. Employees login to the system using a username and password combination, they enter details of expenses and upload scanned copies of receipts, into the database, for each item of expense. 
 
![](./media/web-sites-enterprise-offerings/on-premise-app-example.png)

#### Items to consider ####

When migration application from an on-premises environment, you might want to keep in mind, few Web Apps constraints. Here are some key topics to be aware of when migrating web applications to Web Apps ([http://aka.ms/websitesmigrationresources](http://aka.ms/websitesmigrationresources)):

-	Port Bindings – Web Apps only supports port 80 for HTTP and port 443 for HTTPS traffic. If your application uses any other port, then once migrated the application will make use of port 80 for HTTP and port 443 for HTTPS traffic. This is often a harmless issue as it is common in on premises deployments to make use of different ports in order to overcome the use of domain names, especially in development and test environments
-	Authentication – Web Apps supports Anonymous Authentication by default and Forms Authentication as identified by an application. Web Apps can offer Windows Authentication when the application is integrated with Azure Active Directory and ADFS only. This is a feature which is discussed in more detail [here](http://aka.ms/azurebizapp) 
-	GAC based assemblies – Web Apps does not allow the deployment of assemblies to the Global Assembly Cache (GAC). Therefore, if the application being migrated makes use of this feature on-premises, consider moving the assemblies to the bin folder of the application.
-	IIS5 Compatibility Mode – Web Apps does not support IIS5 Compatibility Mode, and as such each Web Apps instance and all web applications under the parent Web Apps instance run in the same worker process within a single application pool.
-	Use of COM Libraries – Web Apps does not allow the registration of COM Components on the platform. Therefore if the application is making use of any COM Components, these would need to be rewritten in managed code and deployed with the application.
-	ISAPI Filters – ISAPI Filters can be supported on Web Apps. They will need to be deployed as part of the application and registered in the web application's web.config file. For more information, see [http://aka.ms/azurewebsitesxdt](../web-sites-transform-extend/). 

Once these topics have been considered, your web application should be ready for the Cloud. And don’t worry if some topics are not fully met, the migration tool will give best effort to migration. 

The next steps in the migration process are to create an App Service web app and an Azure SQL Database. There are multiple sizes of Web Apps instances with varying number of CPU Cores and RAM amounts available for you to select based on your web applications requirement. For more information and pricing, see [http://aka.ms/azurewebsitesskus](/pricing/details/websites/). Likewise, Microsoft Azure SQL Database caters to all of a business’ needs with various service tiers and performance levels to fulfill requirements. Further information can be found at [http://aka.ms/azuresqldbskus](/pricing/details/sql-database/). Once created, the application is uploaded to App Service Web Apps, either via FTP or WebDeploy and then move onto the database.

In this migration the solution uses Azure SQL Database but that is not the only database that is supported on Azure. Companies can also make use of MySQL, MongoDB, Azure DocumentDB and many more via add-ons which can be purchased at the [Azure Store](/marketplace/partner-program/). 

When creating an Azure SQL Database a number of options are available to import an existing database from an on-premises server from generating a script of an existing database to using the [Data-tier Application Export and Import](http://aka.ms/dacpac). 

The expenses application database was created by creating a new Azure SQL Database, connecting to the database using SQL Server Management Studio and then running a script to build the database schema and populate it with data from the on-premises database.

The final step in this first stage of the migration requires the updating of connection strings to the database for the application. This can be achieved via the Azure portal. For each web app you can modify application specific settings, including any connection strings being used by the application to connect to any database being used.

### Alternatives to using Azure SQL Database ###

The Azure platform offers a number of alternatives to using Azure SQL Database as a web applications primary database, this is to enable different workloads i.e. use of a NoSQL Solution or to enable the platform to suit a business’ data needs. For example, a business may hold data that must not be stored off-site or in a public cloud environment, and therefore would look to maintain the use of their on-premises database.

#### Connectivity to On Premises Resources ####
App Service Web Apps offers two methods of connecting to on premises resources, such as databases, enabling reuse of existing high value infrastructure. The two methods are Web Apps Virtual Network Integration and Hybrid Connections:

- Web Apps Virtual Network Integration supports integration between Web Apps and an Azure Virtual Network, allowing you access to resources running in your Virtual Network which, if connected to your on premises network with site-to-site VPN, allows connectivity direct to your on premises systems.
- Hybrid Connections are a feature of Azure BizTalk Services and provide an easy way to connect to individual on-premises resources such as SQL Server, MySQL, HTTP Web APIs and most custom Web Services.

#### Scale and Resiliency ####

As a business grows its workforce, via acquisitions or natural organic growth, so too must web applications scale to meet these new demands. Indeed today it is common to see an even greater spread of co-located teams and remote employees, for example companies with offices in the United States, Europe and Asia, with a mobile sales force in many more territories. Web Apps has the capability to handle elastic changes in scale comfortably and automatically.

App Service Web Apps allows web applications to be configured to scale automatically via the Azure portal, depending on two vectors – scheduled times or by CPU usage. Web Apps Auto Scaling provides a cost effective and extremely flexible way to cater for greater changes in usage for all business applications, from web applications like our expense reporting system to marketing websites, which experience a high burst of traffic for a short duration of promotion. For more information and guidance on scaling your web applications using Web Apps, see [How to Scale Websites](web-sites-scale.md).

In addition to the scaling flexibility of Web Apps, the overall platform enables business continuity and resiliency through the possible distribution of web applications and their assets across multiple datacenters and geographic regions.

## Summary ##
App Service Web Apps offers a flexible, cost effective, responsive solution to the dynamic needs of a business in a rapidly evolving environment. Web Apps helps businesses increase productivity and efficiency by making use of a managed platform with modern DevOps capabilities and reduced hands on management, while providing enterprise capabilities in scale, resilience, security and integration with on-premises assets.

## Call to Action ##
For more information on the Azure App Service Web Apps service, visit [http://aka.ms/enterprisewebsites](/sservices/websites/enterprise/) where more information can be sourced, and sign up for a trial today at [http://aka.ms/azuretrial](/pricing/free-trial/) to evaluate the service and discover the benefits for your business.

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]
 
