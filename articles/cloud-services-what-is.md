<properties urlDisplayName="What is a Cloud Service" pageTitle="What is a cloud service - Azure service management" metaKeywords="Azure cloud services intro, cloud services overview, cloud services basics" description="An introduction to the cloud service in Azure." metaCanonical="" services="cloud-services" documentationCenter="" title="What is a cloud service?" authors="ryanwi" solutions="" manager="timlt" editor="" />

<tags ms.service="cloud-services" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/23/2014" ms.author="ryanwi" />




#What is a cloud service?
When you create an application and run it in Azure, the code and configuration together are called an Azure cloud service (known as a *hosted service* in earlier Azure releases).

By creating a cloud service, you can deploy a multi-tier web application in Azure, defining multiple roles to distribute processing and allow flexible scaling of your application. A cloud service consists of one or more web roles and/or worker roles, each with its own application files and configuration. Azure Websites and Virtual Machines also enable web applications on Azure.  The main advantage of cloud services is the ability to support more complex multi-tier architectures. For a  detailed comparison, see [Azure Web Sites, Cloud Services and Virtual Machines comparison][Comparison].

For a cloud service, Azure maintains the infrastructure for you, performing routine maintenance, patching the operating systems, and attempting to recover from service and hardware failures. If you define at least two instances of every role, most maintenance, as well as your own service upgrades, can be performed without any interruption in service. A cloud service must have at least two instances of every role to qualify for the Azure Service Level Agreement, which guarantees external connectivity to your Internet-facing roles at least 99.95 percent of the time. 

Each cloud service has two environments to which you can deploy your service package and configuration. You can deploy a cloud service to the staging environment to test it before you promote it to production. Promoting a staged cloud service to production is a simple matter of swapping the virtual IP addresses (VIPs) that are associated with the two environments. 


## Concepts ##


- **cloud service role:** A cloud service role is comprised of application files and a configuration. A cloud service can have two types of role:
 
>- **web role:**A web role provides a dedicated Internet Information Services (IIS) web-server used for hosting front-end web applications.

>- **worker role:** Applications hosted within worker roles can run asynchronous, long-running or perpetual tasks independent of user interaction or input.

- **role instance:** A role instance is a virtual machine on which the application code and role configuration run. A role can have multiple instances, defined in the service configuration file.

- **guest operating system:** The guest operating system for a cloud service is the operating system installed on the role instances (virtual machines) on which your application code runs.

- **cloud service components:** Three components are required in order to deploy an application as a cloud service in Azure:

>- **service definition file:** The cloud service definition file (.csdef) defines the service model, including the number of roles.

>- **service configuration file:** The cloud service configuration file (.cscfg) provides configuration settings for the cloud service and individual roles, including the number of role instances.

>- **service package:** The service package (.cspkg) contains the application code and the service definition file.

- **cloud service deployment:** A cloud service deployment is an instance of a cloud service deployed to the Azure staging or production environment. You can maintain deployments in both staging and production.

- **deployment environments:** Azure offers two deployment environments for cloud services: a *staging environment* in which you can test your deployment before you promote it to the *production environment*. The two environments are distinguished only by the virtual IP addresses (VIPs) by which the cloud service is accessed. In the staging environment, the cloud service's globally unique identifier (GUID) identifies it in URLs (*GUID*.cloudapp.net). In the production environment, the URL is based on the friendlier DNS prefix assigned to the cloud service (for example, *myservice*.cloudapp.net).

- **swap deployments:** To promote a deployment in the Azure staging environment to the production environment, you can "swap" the deployments by switching the VIPs by which the two deployments are accessed. After the deployment, the DNS name for the cloud service points to the deployment that had been in the staging environment. 

- **minimal vs. verbose monitoring:** *Minimal monitoring*, which is configured by default for a cloud service, uses performance counters gathered from the host operating systems for role instances (virtual machines). *Verbose monitoring* gathers additional metrics based on performance data within the role instances to enable closer analysis of issues that occur during application processing. For more information, see [How to Monitor Cloud Services][HTMonitorCloudServices].

- **Azure Diagnostics:** Azure Diagnostics is the API that enables you to collect diagnostic data from applications running in Azure. Azure Diagnostics must be enabled for cloud service roles in order for verbose monitoring to be turned on. For more information, see [Enabling Diagnostics in Azure][CloudServicesDiagnostics].

- **link a resource:** To show your cloud service's dependencies on other resources, such as an Azure SQL Database instance, you can "link" the resource to the cloud service. In the Preview Management Portal, you can view linked resources on the **Linked Resources** page, view their status on the dashboard, and scale a linked SQL Database instance along with the service roles on the **Scale** page. Linking a resource in this sense does not connect the resource to the application; you must configure the connections in the application code.

- **scale a cloud service:** A cloud service is scaled out by increasing the number of role instances (virtual machines) deployed for a role. A cloud service is scaled in by decreasing role instances. In the Preview Management Portal, you can also scale a linked SQL Database instance, by changing the SQL Database edition and the maximum database size, when you scale your service roles.

- **Azure Service Level Agreement (SLA):** The Azure Compute SLA guarantees that, when you deploy two or more role instances for every role, access to your cloud service will be maintained at least 99.95 percent of the time. Also, detection and corrective action will be initiated 99.9 percent of the time when a role instance's process is not running. For more information, see [Service Level Agreements] [SLA].

[HTMonitorCloudServices]:http://azure.microsoft.com/en-us/manage/services/cloud-services/how-to-monitor-a-cloud-service/
[SLA]: http://azure.microsoft.com/en-us/support/legal/sla/
[CloudServicesDiagnostics]: http://azure.microsoft.com/en-us/documentation/articles/cloud-services-dotnet-diagnostics/
[Comparison]: http://azure.microsoft.com/en-us/documentation/articles/choose-web-site-cloud-service-vm/
