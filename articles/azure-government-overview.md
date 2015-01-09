<properties title="Azure Government Developers Guide" pageTitle="Azure Government Overview" description="This article provides an overview of the Azure Government Cloud capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners. " metaKeywords="Azure Government AzureGov GovCloud" services="" solutions="" documentationCenter="" authors="John Harvey" videoId="" scriptId="" manager="required" />

<tags ms.service="multiple" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="azure-government" ms.date="12/6/2014" ms.author="jharve" />


<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section (above): this is required in all topics. Please fill it out! See http://sharepoint/sites/azurecontentguidance/wiki/Pages/Markdown%20tagging%20-%20add%20a%20properties%20section%20to%20your%20markdown%20file%20to%20specify%20metadata%20values.aspx for details. -->

<!-- Tags section (above): this is required in all topics. Please fill it out! See http://sharepoint/sites/azurecontentguidance/wiki/Pages/Markdown%20tagging%20-%20add%20a%20tags%20section%20to%20your%20markdown%20file%20to%20specify%20metadata%20for%20reporting.aspx for details. -->

<!--The next line, with one pound sign at the beginning, is the page title--> 

#  Microsoft Azure Government Overview 

<p> Microsoft Azure Government is a physically and network isolated instance of Microsoft Azure.  This developers guide will provide details on the differences that application developers and administrators would need to interact and work with these seperate regions of Azure.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->


## In this topic


+ [Overview](#Overview)
+ [Guidance for Developers](#Guidance)
+ [Features currently available in Microsoft Azure Government](#Features)
+ [Endpoint Mapping](#Endpoint)
+ [Next Steps](#next)


## <a name="Overview"></a>Overview

Azure Government is a government-community cloud (GCC) designed to support strategic government scenarios that require speed, scale, security, compliance and economics for U.S. government organizations.   It was developed based on Microsoft’s extensive experience delivering software, security, compliance, and controls in other Microsoft cloud offerings such as Azure public, Office 365, O365 GCC, Microsoft CRM Online etc. 

In addition, Azure Government is designed to meet the higher level security and compliance needs for sensitive, dedicated, U.S. Public Sector workloads found in regulations such as United States Federal Risk and Authorization Management Program (FedRAMP), Department of Defense Enterprise Cloud Service Broker (ECSB), Criminal Justice Information Services (CJIS) Security Policy and Health Insurance Portability and Accountability Act (HIPAA).     

Below is a summary view of the Azure Government Cloud infrastructure, fabric, services and frameworks that are available to help government organizations build hybrid cloud solutions to meet their goals.  As some services below are only available in preview, please see the [regions page](http://azure.microsoft.com/en-us/regions/#services) as the most up to date services that are generally available are listed.

![][2]

Azure Government includes the core components of Infrastructure-as-a-Service (IaaS) and Platform-as-a-Service (PaaS).  This includes infrastructure, network, storage, data management, identity management and many other services.  Azure Government supports the same great features that public Azure customers have leveraged like Geo-Synchronous data replication and auto scaling. Microsoft has been identified as the leader in both <a href="https://www.gartner.com/doc/2575715/magic-quadrant-cloud-infrastructure-service" target="_new">IaaS</a> and <a href="https://www.gartner.com/doc/2645317/magic-quadrant-enterprise-application-platform" target="_new">PaaS<a/> by leading industry analysts.

In addition to providing the robust services and features of public Azure, Azure Government provides a number of features to assure US government entities that their data is secure by providing:

- **Physical and network-isolated instance** – The Azure Government environment is a completely separate instance from Microsoft Azure public and only used by qualified U.S. government organizations and solution providers.

- **Security, Privacy & Compliance** - Microsoft has implemented its robust security, privacy, and compliance controls framework plus additional stringent controls to meet the higher level requirements found in ECSB Impact Levels and CJIS. 

- **Data Storage** – The Azure Government environment maintains 2 datacenters over 500 miles apart. All customer managed data is stored within the Continental United States (CONUS) datacenters

- **U.S. Personnel** – All Azure Government operators and administrators are screened U.S. citizens.

- **Identity Management** – Identity Management within the Azure Government environment is a separate instance of Azure Active Directory.

- **Compliance** – Microsoft is continuously investing to meet and maintain rigorous and changing federal, state, and local compliance requirements such as FedRAMP, CJIS, ECSB, and HIPAA for U.S. government cloud solutions. 

- **Cloud Integration** – Azure Government provides an integrated environment with O365 Government allowing for a single sign-on across cloud services and enhanced services such as 1TB of OneDrive storage space.

Azure Government also enables organizations to maintain their existing technology investments and realize the benefits of cloud services.  Since Azure Government is an interoperable cloud platform, with products and technologies organizations can build applications that are more open from the ground up.  Agencies can choose the tools, services, operating system, architecture, and frameworks including Windows, Linux, Oracle, SharePoint, .NET, Java, PHP and Node.js, for their cloud solutions. The flexibility of the Azure Government platform allows for new forms of cross-agency collaboration, application development, and integration.  

U.S. government organizations interested in cloud services can be confident that Azure Government provides enormous scale and rigorous security practices to meet their evolving needs. 







## <a name="Features"></a> Features currently available in Microsoft Azure Government
Azure Government currently has the following services available in both US GOV IOWA and US GOV VIRGINIA regions:

- Virtual Machines
- Cloud Services
- Storage
- Active Directory
- Scheduler
- Virtual Networking
- SQL Database

Other services are available, and more services will be added on a continuous basis.  For the most current list of services, please see the [regions page](http://azure.microsoft.com/en-us/regions/#services) which will highlight each available region and their services.  

Currently, US GOV Iowa and US GOV Virginia are the data centers supporting Azure Government.  Please refer to the regions page above for current data centers and services available.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged -->

## <a name="next"></a>Next steps

If you are interested in learning more and about Azure Government please leverage some of the links below.

- **<A href="http://azure.com/gov">Acquiring and accessing Azure Government</a>**

- **<A href="/azure-government-developer-guide">Azure Government Developer Guide</a>**

<!--- **<A href="/azure-government-service-description">Azure Government Service Descriptions</a>**-->




<!-- Images. -->

[1]: ./media/azure-government-developer-guide/publisherguide.png
[2]: ./media/azure-government-overview/azure-gov-overview.jpg

<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
