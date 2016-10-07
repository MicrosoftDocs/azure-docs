
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
    ms.date="10/06/2016" 
    ms.author="elizapo" />

# Options for migrating out of Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

If you have stopped using Azure RemoteApp because of the [retirement announcement](https://go.microsoft.com/fwlink/?linkid=821148) or because you've finished your evaluation, you need to migrate off of Azure RemoteApp to another app service. There are two different approaches for migrating: a self-managed (often called Infrastructure as a Service [IaaS]) deployment or a fully managed (often called Platform as a Service or Software as a Service [PaaS/SaaS]) offering. 

Self-service IaaS is a do-it-yourself deployment that is managed, operated, and owned by you, directly deployed on virtual machines (VMs) or physical systems. At the other end, a fully managed PaaS/SaaS offering is more like Azure RemoteApp - a partner provides a service layer on top of a remoting solution that handles operational and servicing, while you, as the customer, do some image and app management.

Read on for more information, including examples of the different hosting options.    

## Self-managed (IaaS) solutions

### **RDS on IaaS** 
You can deploy a native session-based Remote Desktop Services (in Windows Server) deployment using either RemoteApp or desktops on-premises or in a hosted environment (like on Azure VMs). RDS on IaaS deployments are best for customers already familiar with and that have existing technical expertise with RDS deployments. 

> [AZURE.NOTE]
> You need Volume Licensing with Software Assurance (SA) for RDS client access licenses to use this deployment option.

Deploying RDS on Azure VMs is easier than ever when you use [deployment and patching templates](https://blogs.technet.microsoft.com/enterprisemobility/2015/07/13/azure-resource-manager-template-for-rds-deployment/). You can get the same elastic scaling capabilities with Azure classic deployment model resources (not Azure Resource Model resources) within Azure RemoteApp by using the [auto scaling script](https://gallery.technet.microsoft.com/scriptcenter/Automatic-Scaling-of-9b4f5e76), although there are more customizations and configurations. When you deploy RDS on Azure VMs, support is provided through [Azure Support](https://azure.microsoft.com/support/plans/), the same support professionals that supported you with Azure RemoteApp. You can get cost estimates based on your existing usage by contacting [Azure Support](https://azure.microsoft.com/support/plans/), or you can perform calculations yourself using a soon to be released Cost Calculator.  Also, with N-series VMs (currently in private preview) you can add vGPU - hear more about adding vGPU and about how to [harness RDS improvements in Windows Server 2016](https://myignite.microsoft.com/videos/2794) in our Ignite session.   

We have step by step deployment guides for [Windows Server 2012 R2](http://aka.ms/rdsonazure) and [Windows Server 2016](http://aka.ms/rdsonazure2016) to assist with your deployment. Check out the [Remote Desktop blog](https://blogs.technet.microsoft.com/enterprisemobility/?product=windows-server-remote-desktop-services) for the latest news.
 
### **Citrix on IaaS** 
A native Citrix deployment of session-based XenApp or XenDesktop can be deployed on-premises or within a hosted environment (such as on Azure VMs). 

Check out the step-by-step deployment guide, [Citrix XA 7.6 on Azure](http://www.citrixandmicrosoft.com/Documents/Citrix-Azure Deployment Guide-v.1.0.docx), for more information. Read more about [Citrix on Azure](http://www.citrixandmicrosoft.com/Solutions/AzureCloud.aspx), including a price calculator. You can also find a [Citrix contact](http://citrix.com/English/contact/index.asp) to discuss your options with.

## Fully managed (PaaS/SaaS) offerings

### **Citrix Cloud** 
[Citrix existing cloud solution](https://www.citrix.com/products/citrix-cloud/), identical architecturally to Citrix XenApp Express. Citrix is offering a [50% discount promotion](https://www.citrix.com/blogs/2016/10/03/special-promotion-for-microsoft-azure-remoteapp-customers/) for existing Azure RemoteApp customers. 

### **Citrix XenApp Express (in tech preview)**
[Register for their tech preview](http://now.citrix.com/remoteapp), and watch their [Ignite session](https://myignite.microsoft.com/videos/2792) (starting at minute 20:30). XenApp Express is architecturally identical to Citrix Cloud except it includes simplified management UI and other features and capabilities that are similar to Azure RemoteApp. 

Learn more about [Citrix XenApp Express](http://now.citrix.com/remoteapp).   

### **Citrix Service Provider Program** 
The Citrix Service Provider Program makes it easy for service providers to deliver the simplicity of virtual cloud computing to SMBs, offering them the services they want in an easy, pay-as-you-go model. Citrix Service Providers grow their Microsoft SPLA businesses and expand their RDS platform investments with any device, anywhere access, the broadest application support, a rich experience, added security and increased scalability. In turn, Citrix Service Providers attract more subscribers, increase customer satisfaction and reduce their operational costs. [Learn more](http://www.citrix.com/products/service-providers.html) or [find a partner](https://www.citrix.com/buy/partnerlocator.html).

### **Microsoft Hosted Service Provider** 
Hosting partners typically offer a fully managed hosted Windows desktop and application service, which may include managing the Azure resources, operating systems, applications, and helpdesk using the partner’s licensing agreements with Microsoft and other software providers along with being a Service Provider License Agreement to allow reselling of Subscriber Access License (SAL). The following information provides details and contact information for hosters that specialize in assisting customers with their Azure RemoteApp migration. Check out [the full list of Hosted Service Providers](http://aka.ms/rdsonazurecertified).  

#### **ASPEX**
[ASPEX](http://www.aspex.be/en) specializes in ISVs transitioning to the Cloud and ISV‘ looking to optimize their current cloud setups. ASPEX offers a wide range of managed services, devops, and consulting services.  

Primary location: Antwerp, Belgium

Operation region: Western Europe

Partner status: [Silver](https://partnercenter.microsoft.com/pcv/solution-providers/aspex_9397f5dd-ebdd-405b-b926-19a5bda61f7a/cfe00bac-ea36-4591-a60b-ec001c4c3dff)

Microsoft Cloud Service Provider: Yes

Offer session-based RemoteApp and Desktop solutions: Yes, both

Azure RemoteApp migration solutions: Yes, [learn more](https://www.aspex.be/en/azure-remote-apps)

**Contact:**

- Phone: +3232202198
- Mail: [info@aspex.be](mailto:info@aspex.be)
- Web: [http://cloud.aspex.be/contact-ara-0](http://cloud.aspex.be/contact-ara-0)

#### **Conexlink (Platform name: MyCloudIT)**
[MyCloudIT](http://www.mycloudit.com) is an automation platform for IT companies to simplify, optimize, and scale the migration and delivery of remote desktops, remote applications, and infrastructure in the Microsoft Azure Cloud. 

The MyCloudIT platform reduces deployment time by 95%, Azure cost by 30%, and moves their client’s entire IT infrastructure into the cloud in a matter of a few key strokes. Partners can now manage customers from one global dashboard, service end users around the world like never before, and grow revenues without adding additional overhead or extensive Azure training.  

Primary location: Dallas, TX, USA

Operation region: Worldwide

Partner status: [Gold](https://partnercenter.microsoft.com/pcv/solution-providers/conexlink_4298787366/843036_1?k=Conexlink)

Microsoft Cloud Service Provider: Yes

Offer session-based RemoteApp and Desktop solutions: Yes, both

Azure RemoteApp migration solutions: Yes, [learn more](https://mycloudit.com/remote-app-microsoft/)

**Contact:**
- Brian Garoutte, VP of Business Development

   Phone: 972-218-0741

   Email: [brian.garoutte@conexlink.com](mailto:brian.garoutte@conexlink.com)

#### **Acuutech**
[Acuutech](http://www.acuutech.com) specializes in providing hosted desktop solutions, delivering full desktop and ISV applications experiences built on Microsoft technology to a global client base from Azure and their own datacenters.

Primary location: London, UK; Singapore; Houston, TX

Operation region: Worldwide

Partner status: Gold

Microsoft Cloud Service Provider: Yes

Offer session-based RemoteApp and Desktop solutions: Yes, both

Azure RemoteApp migration solutions: Yes, [learn more](http://www.acuutech.com/ara-migration/)

**Contact:**

- United Kingdom:

  5/6 York House, Langston Road,

  Loughton, Essex IG10 3TQ
  
  Phone: +44 (0) 20 8502 2155
 
- Singapore:

  100 Cecil Street, #09-02, 
  
  The Globe, Singapore 069532
  
  Phone: +65 6709 4933
 
- North America: 

  3601 S. Sandman St.
  
  Suite 200, Houston, TX 77098
  
  Phone: +1 713 691 0800

## Need more help?
Still need help choosing or have further questions? Use one of the following methods to get help. 

1.	Email us at [arainfo@microsoft.com](mailto:arainfo@microsoft.com).
2.	Contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Start by opening an [Azure support case](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
3.  Call us. [Find a local sales number](https://azure.microsoft.com/overview/sales-number/).
