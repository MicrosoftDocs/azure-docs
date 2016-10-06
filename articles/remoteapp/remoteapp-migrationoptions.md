
<properties 
    pageTitle="Options for migrating out of Azure RemoteApp | Microsoft Azure" 
    description="Learn about the options for migrating out of Azure RemoteApp." 
    services="remoteapp" 
	documentationCenter="" 
    authors="ericorman" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="10/05/2016" 
    ms.author="elizapo" />

# Options for migrating out of Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

If you have stopped using Azure RemoteApp because of the [retirement announcement](https://go.microsoft.com/fwlink/?linkid=821148) or because you've finished your evaluation, you will need to migrateoff of Azure RemoteApp to another app service. There are two different approaches for migrating: a self-managed (often called Infrastructure as a Service [IaaS]) deployment or a fully managed (often called Platform as a Service or Software as a Service [PaaS/SaaS]) offering. 

Self-service IaaS is a do-it-yourself deployment that is completely managed, operated, and owned by you, directly deployed on virtual machines (VMs) or physical systems. At the other end, a fully managed PaaS/SaaS offering is more like Azure RemoteApp - a partner provides a service layer on top of a remoting solution that handles operational and servicing, while you, as the customer, do some image and app management.

Read on for more information, including examples of the different hosting options.    

## Self-managed (IaaS) solutions
- RDS on IaaS: You can deploy a native session-based Remote Desktop Services (in Windows Server) deployment using either RemoteApp or desktops on-premises or in a hosted environment (like on Azure VMs). RDS on IaaS deployments are best for customers already familiar with and that have existing technical expertise with RDS deployments. 
  >[NOTE]
  > You'll need Volume Licensing with Software Assurance (SA) for RDS client access licenses to use this deployment option.

    Deploying RDS on Azure VMs is easier than ever when you use [deployment and patching templates](https://blogs.technet.microsoft.com/enterprisemobility/2015/07/13/azure-resource-manager-template-for-rds-deployment/). You can get the same elastic scaling capabilities within Azure RemoteApp by using the [auto scaling script](https://gallery.technet.microsoft.com/scriptcenter/Automatic-Scaling-of-9b4f5e76), although there are more customizations and configurations. When you deploy RDS on Azure VMs, support is provided through [Azure Support](https://azure.microsoft.com/support/plans/), the same support professionals that supported you with Azure RemoteApp. Cost estimates based upon your existing usage can be derived by contacting [Azure Support](https://azure.microsoft.com/support/plans/), or you can perform calculations yourself using soon to be released Cost Calculator.  Also, soon with N-series VMs you'll be able to add vGPU - hear more about this and about how to [harness RDS improvements in Windows Server 2016](https://myignite.microsoft.com/videos/2794) in our Ignite session.   

    We have step by step deployment guides for [Windows Server 2012 R2](http://aka.ms/rdsonazure) and [Windows Server 2016](http://aka.ms/rdsonazure2016) to assist with your deployment. 

- Citrix on IaaS: A native Citrix deployment of session-based XenApp or XenDesktop can be deployed on-premises or within a hosted environment (such as on Azure VMs). 

   Check out the step-by-step deployment guide, [Citrix XA 7.6 on Azure](http://www.citrixandmicrosoft.com/Documents/Citrix-Azure Deployment Guide-v.1.0.docx), for more information. Read more about [Citrix on Azure](http://www.citrixandmicrosoft.com/Solutions/AzureCloud.aspx), including a price calculator. You can also find a [Citrix contact](http://citrix.com/English/contact/index.asp) to discuss your options with.

## Fully managed (PaaS/SaaS) offerings
- Citrix Cloud: [Citrix existing cloud solution](https://www.citrix.com/products/citrix-cloud/). 
- Citrix XenApp Express (in tech preview): Architecturally identical to Citrix Cloud except it will include simplified management UI and other features and capabilities that are similar to Azure RemoteApp.

   Register for their tech preview, watch their [Ignite session](https://myignite.microsoft.com/videos/2792), and read more [here](http://now.citrix.com/remoteapp).   

- Citrix Service Provider Program: The Citrix Service Provider Program makes it easy for service providers to deliver the simplicity of virtual cloud computing to SMBs, offering them the services they want in an easy, pay-as-you-go model. Citrix Service Providers grow their Microsoft SPLA businesses and expand their RDS platform investments with any device, anywhere access, the broadest application support, a rich high-def experience, added security and increased scalability. In turn, Citrix Service Providers attract more subscribers, increase customer satisfaction and reduce their operational costs. [Learn more](http://www.citrix.com/products/service-providers.html) or [find a partner](https://www.citrix.com/buy/partnerlocator.html).

- Microsoft Hosted Service Provider: Hosting partners typically offer a fully managed hosted Windows desktop and application service, which may include managing the Azure resources, operating systems, applications, and helpdesk using the partner’s licensing agreements with Microsoft and other software providers along with being a Service Provider License Agreement to allow reselling of Subscriber Access License (SAL). Check out [this list of Hosted Service Providers](http://aka.ms/rdsonazurecertified) from our reference list that have specialty of assisting customers with their Azure RemoteApp migration.  

## Need more help?
Still need help choosing or have further questions? Use one of the following methods to get help. 

1.	Email us at [arainfo@microsoft.com](mailto:arainfo@microsoft.com).
2.	Contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). A support professional will personally assist answering your questions. Start by opening an [Azure support case](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
3.    Call us. [Find a local sales number](https://azure.microsoft.com/overview/sales-number/).