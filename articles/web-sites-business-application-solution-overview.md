<properties urlDisplayName="Create a Line-of-Business Application on Azure Websites" pageTitle="Create a Line-of-Business Application on Azure Websites" metaKeywords="Web Sites" description="This guide provides a technical overview of how to use Azure Websites to create intranet, line-of-business applications. This includes authentication strategies, service bus relay, and monitoring." umbracoNaviHide="0" disqusComments="1" editor="mollybos" manager="wpickett" title="Create a Line-of-Business Application on Azure Websites" authors="jroth" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/01/2014" ms.author="jroth" />



# Create a Line-of-Business Application on Azure Websites

This guide provides a technical overview of how to use Azure Websites to create line-of-business applications. For the purposes of this document, these applications are assumed to be intranet applications that should be secured for internal business use. There are two distinctive characteristics of business applications. These applications require authentication, typically against a corporate directory. And they normally require some access or integration with on-premises data and services. This guide focuses on building business applications on [Azure Web Sites][websitesoverview]. However, there are situations where [Azure Cloud Services][csoverview] or [Azure Virtual Machines][vmoverview] would be a better fit for your requirements. It is important to review the differences between these options in the topic [Azure Web Sites, Cloud Services, and VMs: When to use which?][chooseservice]. 

The following areas are addressed in this guide:

- [Consider the Benefits](#benefits)
- [Choose an Authentication Strategy](#authentication)
- [Create an Azure Web Site that Supports Authentication](#createintranetsite)
- [Use Service Bus to Integrate with On-Premises Resources](#servicebusrelay)
- [Monitor the Application](#monitor)

<div class="dev-callout">
<strong>Note</strong>
<p>This guide presents some of the most common areas and tasks that are aligned with public-facing .COM site development. However, there are other capabilities of Azure Websites that you can use in your specific implementation. To review these capabilities, also see the other guides on <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/global-web-presence-solution-overview/">Global Web Presence</a> and <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/digital-marketing-campaign-solution-overview">Digital Marketing Campaigns</a>.</p>
</div>

##<a name="benefits"></a>Consider the Benefits
Because line-of-business applications typically target corporate users, you should consider the reasons to use the Cloud versus on-premises corporate resources and infrastructure. First, there are some of the typical benefits of moving to the Cloud, such as the ability to scale up and down with dynamic workloads. For example, consider an application that handles annual performance reviews. For most of the year, this type of application would handle very little traffic. But during the review period, traffic would spike to high levels for a large company. Azure provides scaling options that enable the company to scale out to handle the load during the high-traffic review period while saving money by scaling back for the rest of the year. Another benefit of the Cloud is the ability to focus more on application development and less on infrastructure acquisition and management.

In addition to these standard advantages, placing a business application in the Cloud provides greater support for employees and partners to use the application from anywhere. Users do not need to be connected to the corporate network through in order to use the application, and the IT group avoids complex reverse proxy solutions. There are several authentication options to make sure that access to company applications are protected. These options are discussed in the following sections of this guide.

##<a name="authentication"></a>Choose an Authentication Strategy
For the business application scenario, your authentication strategy is one of the most important decisions. There are several options:

- Use the [Azure Active Directory service][adoverview]. You can use this as a stand-alone directory, or you can synchronize it with an on-premises Active Directory. Applications then interact with the Azure Active Directory to authenticate users. For an overview of this approach, see [Using Azure Active Directory][adusing].
- Use Azure Virtual Machines and Virtual Network to install Active Directory. This gives you the option of extending an on-premises Active Directory installation to the Cloud. You can also choose to use Active Directory Federation Services (ADFS) to federate identity requests back to the on-premises AD. Then authentication for the Azure application goes through ADFS to the on-premises Active Directory. For more information about this approach, see [Running Windows Server Active Directory in VMs][adwithvm] and [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][addeployguidelines]. 
- Use an intermediary service, such as [Azure Access Control Service][acs2] (ACS), to use multiple identity services to authenticate users. This provides an abstraction to authenticate either through Active Directory or through a different identity provider. For more information, see [Using Azure Active Directory Access Control][acsusing].

For this business application scenario, the first scenario using Azure Active Directory provides the fastest path for implementing an authentication strategy for your application. The remainder of this guide focuses on Azure Active Directory. However, depending on your business requirements, you might find that one of the other two solutions is a better fit. For example, if you are not permitted to synchronize identity information to the Cloud, then the ADFS solution might be the better option. Or if you must support other identity providers, like Facebook, then an ACS solution would fit better.

Before you begin to setup a new Azure Active Directory, you should note that existing services, such as Office 365 or Windows Intune, already use Azure Active Directory. In that case, you would associate your existing subscription with you Azure subscription. For more details, see [What is an Azure AD tenant?][adtenant].

If you do not currently have a service that already uses Azure Active Directory, you can create a new directory in the Management Portal. Use the **Active Directory** section of the Management Portal to create a new directory.

![BusinessApplicationsAzureAD][BusinessApplicationsAzureAD]

Once created, you have the option to create and manage users, integrated applications, and domains.

![BusinessApplicationsADUsers][BusinessApplicationsADUsers]

For a full walkthrough of these steps, see [Adding Sign-On to Your Web Application Using Azure AD][adsso]. If you are using this new directory as a standalone resource, then the next step is to develop applications that integrate with the directory. However, if you have on-premises Active Directory identities, you typically want to synchronize those with the new Azure Active Directory. For more information on how to do this, see [Directory integration][dirintegration].

Once the directory is created and populated, you must create web applications that require authentication and then integrate them with the directory. These steps are covered in the following two sections.

##<a name="createintranetsite"></a>Create an Azure Website that Supports Authentication
In the Global Web Presence scenario, we discussed various options for creating and deploying a new website. If you are new to Azure Websites, it is a good idea to [review that information][scenarioglobalweb]. An ASP.NET application in Visual Studio is a common choice for an intranet web application that uses window authentication. One of the reasons for this is the tight integration and support for this scenario provided by ASP.NET and Visual Studio.

For example, when creating an ASP.NET MVC 4 project in Visual Studio, you have the option to create an **Intranet Application** in the project creation dialog.

![BusinessApplicationsVSIntranetApp][BusinessApplicationsVSIntranetApp]

This makes changes to the project settings to support Windows Authentication. Specifically, the web.config file has the **authentication** element's **mode** attribute set to **Windows**. You must make this change manually if you create a different ASP.NET project, such as a Web Forms project, or if you are working with an existing project.

For an MVC project, you must also change two values in the project properties window. Set **Windows Authentication** to **Enabled** and **Anonymous Authentication** to **Disabled**.

![BusinessApplicationsVSProperties][BusinessApplicationsVSProperties]

In order to authenticate with Azure Active Directory, you have to register this application with the directory, and you must then modify that application configuration to connect. This can be done in two ways in Visual Studio:

- [Identity and Access Tool for Visual Studio](#identityandaccessforvs)
- [Microsoft ASP.NET Tools for Azure Active Directory](#aspnettoolsforwaad)

###<a name="identityandaccessforvs"></a>Identity and Access Tool for Visual Studio:
One method is to use the [Identity and Access Tool][identityandaccess] (which you can download and install). This tool integrates with Visual Studio on the project context menu. The following instructions and screenshots are from Visual Studio 2012. Right-click the project, and select **Identity and Access**. There are three things that must be configured. On the **Providers** tab, you must provide the **path to the STS metadata document** and the **APP ID URI** (to obtain these values, see the section on [Registering Applications in Azure Active Directory](#registerwaadapp)).

![BusinessApplicationsVSIdentityAndAccess][BusinessApplicationsVSIdentityAndAccess]

The final configuration change that must be made is on the **Configuration** tab of the **Identity and Access** dialog. You must select the **Enable web farm cookies** checkbox. For a detailed walkthrough of these steps, see [Adding Sign-On to Your Web Application Using Azure AD][adsso].

####<a name="registerwaadapp"></a>Registering Applications in Azure Active Directory:
In order to fill out the **Providers** tab, you need to register your application with Azure Active Directory. On the Azure Management Portal, in the **Active Directory** section, select your directory and then go to the **Applications** tab. This provides an option to add your Azure Website by URL. Note that when you go through these steps, you initially set the URL to the localhost address provided for local debugging in Visual Studio. Later you change this to the actual URL of your website when you deploy.

![BusinessApplicationsADIntegratedApps][BusinessApplicationsADIntegratedApps]

Once added, the portal provides both the STS metadata document path (the **Federation Metadata Document URL**) and the **APP ID URI**. These values are used on the **Providers** tab of the **Identity and Access** dialog in Visual Studio. 

![BusinessApplicationsADAppAdded][BusinessApplicationsADAppAdded]

###<a name="aspnettoolsforwaad"></a>Microsoft ASP.NET Tools for Azure Active Directory:
An alternate method to accomplish the previous steps is to use the [Microsoft ASP.NET Tools for Azure Active Directory][aspnettools]. To use this, click the **Enable Azure Authentication** item from the **Project** menu in Visual Studio. This brings up a simple dialog that asks for the address of your Azure Active Directory domain (not the URL for your application).

![BusinessApplicationsVSEnableAuth][BusinessApplicationsVSEnableAuth]

If you are the administrator of that Active Directory domain, then select the **Provision this application in the Azure AD** checkbox. This will do the work of registering the application with Active Directory. If you are not the administrator, then uncheck that box and provide the information displayed to an administrator. That administrator can use the Management Portal to create an integrated application using the previous steps on the Identity and Access tool. For detailed steps on how to use the ASP.NET Tools for Azure Active Directory, see [Azure Authentication][azureauthtutorial].

When managing your line-of-business application, you have the ability to use any of the supported source code control systems for deployment. However, because of the high level of Visual Studio integration in this scenario, it is more likely that Team Foundation Service (TFS) is your source control system of choice. If so, you should note that Azure Websites provides integration with TFS. In the Management Portal, go to the **Dashboard** tab of your website. Then select **Set up deployment from source control**. Follow the instructions for using TFS. 

![BusinessApplicationsDeploy][BusinessApplicationsDeploy]

##<a name="servicebusrelay"></a>Use Service Bus to Integrate with On-Premises Resources
Many line-of-business applications must integrate with on-premises data and services. There are multiple reasons why certain types of data cannot be moved to the Cloud. These reasons can be practical or regulatory. If you are in the planning stages of deciding what data to host in Azure and what data should remain on-premises, it is important to review the resources on the [Azure Trust Center][trustcenter]. Hybrid web applications run in Azure and access resources that must remain on-premises.

When using Virtual Machines or Cloud Services, you can use a Virtual Network to connect applications in Azure with a corporate network. However, Websites does not support Virtual Networks, so the best way to perform this type of integration with Websites is through the use of the [Azure Service Bus Relay Service][sbrelay]. The Service Bus Relay service allows applications in the cloud to securely connect to WCF services running on a corporate network. Service Bus allows for this communication without opening firewall ports. 

In the diagram below, both the cloud application and the on-premises WCF service communicate with Service Bus through a previously created namespace. The on-premises WCF service has access to internal data and services that cannot be moved to the Cloud. The WCF service registers an endpoint in the namespace. The website running in Azure connects to this endpoint in Service Bus as well. They only need to be able to make outgoing public HTTP requests to complete this step.

![BusinessApplicationsServiceBusRelay][BusinessApplicationsServiceBusRelay]

Service Bus then connects the cloud application to the on-premises WCF service. This provides a basic architecture for creating hybrid applications that use services and resources on both Azure and on-premises. For more information, see [How to Use the Service Bus Relay Service][sbrelayhowto] and the tutorial [Service Bus Relayed Messaging Tutorial][sbrelaytutorial]. For a sample that demonstrates this technique, see [Enterprise Pizza - Connecting Web Sites to On-premise Using Service Bus][enterprisepizza].

##<a name="monitor"></a>Monitor the Application
Business applications benefit from the standard Website capabilities, such as scaling and monitoring. For a business application that experiences variable load during specific days or hours, the Autoscale (Preview) feature can assist with scaling the site out and back to efficiently use resources. Monitoring options include endpoint monitoring and quota monitoring. All of these scenarios were covered in more detail in the [Global Web Presence][scenarioglobalweb] and [Digital Marketing Campaign][scenariodigitalmarketing] scenarios.

Monitoring needs can vary between different line-of-business applications that have different levels of importance to the business. For the more mission critical applications, consider investing in a third-party monitoring solution, such as [New Relic][newrelic].

Line-of-business applications are typically managed by IT staff. In the event of unexpected errors or behavior, IT workers can enable more detailed logging and then analyze the resulting data to determine problems. In the Management Portal, go to the **Configure** tab, and review the options in the **application diagnostics** and **site diagnostics** sections. 

![BusinessApplicationsDiagnostics][BusinessApplicationsDiagnostics]

Use the various application and site logs to troubleshoot problems with the website. Note that some of the options specify **File System**, which places the log files on the file system for your site. These can be accessed through FTP, Azure PowerShell, or the Azure Command-Line tools. Other options specify **Storage**. This sends the information to the Azure storage account that you specify. For **Web Server Logging**, you also have an option of specifying a disk quota for the file system or a retention policy for the storage option. This prevents you from storing a indefinitely increasing the amount of stored logging data.

![BusinessApplicationsDiagRetention][BusinessApplicationsDiagRetention]

For more information on these logging settings, see [How to: Configure diagnostics and download logs for a web site][configurediagnostics].

In addition to viewing the raw logs through FTP or storage utilities, such as Azure Storage Explorer, you can also view log information in Visual Studio. For detailed information on using these logs in troubleshooting scenarios, see [Troubleshooting Azure Web Sites in Visual Studio][troubleshootwebsites].

##<a name="summary"></a>Summary
Azure enables you to host secure intranet applications in the Cloud. Azure Active Directory provides the ability to authenticate users, in order that only members of your organization can access the applications. The Service Bus Relay Service provides a mechanism for web applications to communicate with on-premises services and data. This hybrid application approach makes it easier to publish a business application to the Cloud without migrating all dependent data and services as well. Once deployed, business applications benefit from the standard scaling and monitoring capabilities provided by Azure Websites. For more information, see the following technical articles.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Area</th>
   <th align="left" valign="top">Resources</th>
</tr>
<tr>
   <td valign="middle"><strong>Plan</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/choose-web-app-service">Azure Websites, Cloud Services, and VMs: When to use which?</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Create and Deploy</strong></td>
   <td valign="top">- <a href ="http://www.windowsazure.com/en-us/develop/net/tutorials/get-started/">Deploying an ASP.NET Web Application to an Azure Website</a><br/>- <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/web-site-with-sql-database/">Deploy a Secure ASP.NET MVC Application to Azure</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Authentication</strong></td>
   <td valign="top">- <a href ="http://www.windowsazure.com/en-us/manage/windows/fundamentals/identity/">Understand Azure Identity Options</a><br/>- <a href="http://www.windowsazure.com/en-us/documentation/services/active-directory/">Azure Active Directory service</a><br/>- <a href="http://technet.microsoft.com/en-us/library/jj573650.aspx">What is an Azure AD tenant?</a><br/>- <a href="http://msdn.microsoft.com/library/windowsazure/dn151790.aspx">Adding Sign-On to Your Web Application Using Azure AD</a><br/>- <a href="http://www.asp.net/aspnet/overview/aspnet-and-visual-studio-2012/windows-azure-authentication">Azure Authentication Tutorial</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Service Bus Relay</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/service-bus-relay/">How to Use the Service Bus Relay Service</a><br/>- <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee706736.aspx">Service Bus Relayed Messaging Tutorial</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Monitor</strong></td>
   <td valign="top">- <a href ="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/">How to Monitor Websites</a><br/>- <a href="http://msdn.microsoft.com/library/windowsazure/dn306638.aspx">How to: Receive Alert Notifications and Manage Alert Rules in Azure</a><br/>- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/#howtoconfigdiagnostics">How to: Configure diagnostics and download logs for a website</a><br/>- <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/">Troubleshooting Azure Websites in Visual Studio</a></td>
</tr>
</table>

  [websitesoverview]:/en-us/documentation/services/web-sites/
  [csoverview]:/en-us/documentation/services/cloud-services/
  [vmoverview]:/en-us/documentation/services/virtual-machines/
  [chooseservice]:/en-us/manage/services/web-sites/choose-web-app-service
  [scenarioglobalweb]:/en-us/manage/services/web-sites/global-web-presence-solution-overview/
  [scenariodigitalmarketing]:/en-us/manage/services/web-sites/digital-marketing-campaign-solution-overview
  [adoverview]:/en-us/documentation/services/active-directory/
  [adusing]:/en-us/manage/windows/fundamentals/identity/#ad
  [adwithvm]:/en-us/manage/windows/fundamentals/identity/#adinvm
  [addeployguidelines]:http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx
  [acs2]:http://msdn.microsoft.com/library/windowsazure/hh147631.aspx
  [acsusing]:/en-us/manage/windows/fundamentals/identity/#ac
  [adtenant]:http://technet.microsoft.com/en-us/library/jj573650.aspx
  [adsso]:http://msdn.microsoft.com/library/windowsazure/dn151790.aspx
  [dirintegration]:http://technet.microsoft.com/en-us/library/jj573653.aspx
  [identityandaccess]:http://visualstudiogallery.msdn.microsoft.com/e21bf653-dfe1-4d81-b3d3-795cb104066e
  [aspnettools]:http://go.microsoft.com/fwlink/?LinkID=282306
  [azureauthtutorial]:http://www.asp.net/aspnet/overview/aspnet-and-visual-studio-2012/windows-azure-authentication
  [trustcenter]:/en-us/support/trust-center/
  [sbrelay]:http://msdn.microsoft.com/en-us/library/windowsazure/jj860549.aspx
  [sbrelayhowto]:/en-us/develop/net/how-to-guides/service-bus-relay/
  [sbrelaytutorial]:http://msdn.microsoft.com/en-us/library/windowsazure/ee706736.aspx
  [enterprisepizza]:http://code.msdn.microsoft.com/windowsazure/Enterprise-Pizza-e2d8f2fa
  [newrelic]:http://newrelic.com/azure
  [configurediagnostics]:/en-us/manage/services/web-sites/how-to-monitor-websites/#howtoconfigdiagnostics
  [troubleshootwebsites]:/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/
  [BusinessApplicationsAzureAD]: ./media/web-sites-business-application-solution-overview/BusinessApplications_AzureAD.png
  [BusinessApplicationsADUsers]: ./media/web-sites-business-application-solution-overview/BusinessApplications_AD_Users.png
  [BusinessApplicationsVSIntranetApp]: ./media/web-sites-business-application-solution-overview/BusinessApplications_VS_IntranetApp.png
  [BusinessApplicationsVSProperties]: ./media/web-sites-business-application-solution-overview/BusinessApplications_VS_Properties.png
  [BusinessApplicationsVSIdentityAndAccess]: ./media/web-sites-business-application-solution-overview/BusinessApplications_VS_IdentityAndAccess.png
  [BusinessApplicationsADIntegratedApps]: ./media/web-sites-business-application-solution-overview/BusinessApplications_AD_IntegratedApps.png
  [BusinessApplicationsADAppAdded]: ./media/web-sites-business-application-solution-overview/BusinessApplications_AD_AppAdded.png
  [BusinessApplicationsVSEnableAuth]: ./media/web-sites-business-application-solution-overview/BusinessApplications_VS_EnableAuth.png
  [BusinessApplicationsDeploy]: ./media/web-sites-business-application-solution-overview/BusinessApplications_Deploy.png
  [BusinessApplicationsServiceBusRelay]: ./media/web-sites-business-application-solution-overview/BusinessApplications_ServiceBusRelay.png
  [BusinessApplicationsDiagnostics]: ./media/web-sites-business-application-solution-overview/BusinessApplications_Diagnostics.png
  [BusinessApplicationsDiagRetention]: ./media/web-sites-business-application-solution-overview/BusinessApplications_Diag_Retention.png
  
  
  
  
  
  
  
  
  
  
  
  
  
  




  



