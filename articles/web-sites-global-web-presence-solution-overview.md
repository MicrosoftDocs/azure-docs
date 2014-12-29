<properties urlDisplayName="Create a Global Web Presence on Azure Websites" pageTitle="Create a Global Web Presence on Azure Websites" metaKeywords="" description="This guide provides a technical overview of how to host your organization's (.COM) site on Azure Websites. This includes deployment, custom domains, SSL, and monitoring." metaCanonical="http://www.windowsazure.com/en-us/documentation/articles/web-sites-global-web-presence-solution-overview/" services="" documentationCenter="" title="Create a Global Web Presence on Azure Websites" authors="jroth" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/01/2014" ms.author="jroth" />





# Create a Global Web Presence on Azure Websites

This guide provides a technical overview of how to host your organization's (.COM) site on Azure. This scenario is also referred to as a global web presence. This guide focuses on using [Azure Web Sites][websitesoverview], because Websites is the fastest and simplest way to create, migrate, scale, and manage a web application on Azure. However, some application requirements lend themselves better to [Azure Cloud Services][csoverview] or [Azure Virtual Machines][vmoverview] running IIS. These are also excellent choices for hosting web applications. If you are in the initial planning stages, please review the document [Azure Web Sites, Cloud Services, and VMs: When to use which?][chooseservice]. In the absence of a requirement to use Cloud Services or Virtual Machines, we recommend using Websites for hosting your global web presence. The rest of this document will provide guidance for using Websites with this scenario. 

The following areas are addressed in this guide:

- [Create an Azure Web Site](#createwebsite)
- [Deploy the Web Site](#deploywebsite)
- [Add a Custom Domain](#customdomain)
- [Secure the Web Site with SSL](#ssl)
- [Monitor the Site](#monitor)

> [AZURE.NOTE]
> This guide presents some of the most common areas and tasks that are aligned with public-facing .COM site development. However, there are other capabilities of Azure Websites that you can use in your specific implementation. To review these capabilities, also see the other guides on <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/digital-marketing-campaign-solution-overview">Digital Marketing Campaigns</a> and <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/business-application-solution-overview">Business Applications</a>.
> 
> If you want to get started with Azure Websites before signing up for an account, go to <a href="https://trywebsites.azurewebsites.net/">https://trywebsites.azurewebsites.net</a>, where you can immediately create a short-lived ASP.NET starter site in Azure Websites for free. No credit card required, no commitments.

##<a name="createwebsite"></a>Create an Azure Website
Using the Azure Management Portal, you can create a new Azure Website in several ways. When you click the **New** button on the bottom of the portal, you are presented with the following dialog:

![GlobalWebCreate][GlobalWebCreate]

There are three options for creating a new Website: **Quick Create**, **Custom Create**, and **From Gallery**. With each of these options, you should select an Azure region that aligns with the majority of your user base.

If you are migrating an existing site, the **Custom Create** option allows you to create or associate a SQL Database or MySQL database. This option also provides the ability to specify several source control options for deployment, such as GitHub or Team Foundation Server (TFS). If you are already managing your website using a source control mechanism, this provides a quick way to setup your Azure Website for deployment.

The **From Gallery** option allows you to setup a new site with one of several frameworks, such as Drupal or WordPress. This can be helpful to quickly set up a new site that you can then customize within the chosen framework.

Like most services in Azure, you must select an Azure region for your new Website. Azure has multiple regions located around the world. Once you deploy your website to any one region, it is accessible globally on the internet. However, multiple regions provides greater flexibility. One obvious benefit is to deploy sites in regions that are closest to users. 

For details on the steps to create a new website, see [Get started with Azure Web Sites and ASP.NET][howtocreatewebsites].

##<a name="deploywebsite"></a>Deploy the Website
There are several ways to deploy your website to Azure. If you selected a framework from the gallery, you already have a starter site deployed. However, to make any progress, you still must set up some type of editing and deployment procedure. Some of the deployment options include:

- Use an FTP client.
- Deploy from source control.
- Publish from Visual Studio.
- Publish from [WebMatrix][webmatrix].

Each of these options have various strengths. The ability to publish from an FTP client is a simple and straight-forward solution to push new files up to your site. It also means that any existing publishing tools or processes that rely on FTP can continue to work with Azure Websites. Source control provides the best control over site content releases, because changes can be tracked, published, and rolled-back to earlier versions if necessary. The options to publish directly from Visual Studio or Web Matrix is a convenience for developers that use either tool. One useful scenario for this feature is during the early stages of a project or for prototyping. In both cases, frequent publishing and testing is potentially more convenient from within the development environment. 

Many of the deployment tasks here involve the use of information in the Azure Management Portal. Go to your website, select the **Dashboard** tab, and then look for the **quick glance** section. The following screenshot shows several options.

![GlobalWebQuickGlance][GlobalWebQuickGlance]

Some source control tools and FTP clients require username/password access. For a new Website, credentials are not automatically created. However, you can easily do this by clicking **Reset your deployment credentials**. Once completed, you can use any FTP client to deploy your website by using these credentials along with the **FTP Host Name** on the same **Dashboard** page.

![GlobalWebFTPSettings][GlobalWebFTPSettings]

Note that the Deployment/FTP user name is a combination of the Website name and the user name that you provided. So if your site were "http://contoso.azurewebsite.net" and if your user name were "myuser", the user name for deployment and FTP would be "contoso\myuser".

You can also choose to deploy through a source control management service, such as GitHub or TFS Online. Click the option to **Set up deployment from source control**. Then follow the instructions for source control system or service of your choice. For step-by-step instructions for publishing from a local Git repository, see [Publishing from Source Control to Azure Web Sites][publishingwithgit].

If you plan to use Visual Studio to create and manage your site, you can choose to publish directly from Visual Studio. One method is to click the **Download the publish profile** option. This allows you to save a publishsettings file that can be imported into Visual Studio for web publishing. 

> [AZURE.NOTE]
> It is important to keep the <i>publishsettings</i> file safe and outside of source control, because it contains user names and passwords for both deployment and also any linked database connection strings.

It is also possible to import the subscription information directly into Visual Studio. For an example, consider a local ASP.NET project in Visual Studio. Right-click on the web project and select **Publish**. The **Import** button in the **Publish Web** dialog enables you to import either a file that contains your Azure subscription settings or the publishsettings file that you downloaded from the Websites dashboard. The following screenshot shows these options.

![GlobalWebVSPublish][GlobalWebVSPublish]

For more information about publishing to Azure from Visual Studio, see Deploying an ASP.NET Web Application to an Azure Website. 

One more option for both development and deployment is WebMatrix from the Azure Management Portal.

![GlobalWebWebMatrix][GlobalWebWebMatrix]

For more information on this option, see [Develop and deploy a web site with Microsoft WebMatrix][aspnetgetstarted].

Although these steps provide what you need for deploying your .COM site, you should also create a plan for managing the ongoing content publishing cycle. These options could range from rolling a custom solution, to periodic redeployments for a site that changes infrequently, to a full-featured content management system (CMS). If you're creating a new website, you should note that there are options in the gallery to use existing CMS frameworks, such as [Drupal][drupal] or [Umbraco][umbraco].

##<a name="customdomain"></a>Add a Custom Domain
If this is your global web presence, you will want to associate your registered domain name with the website. There are many third-party providers that provide domain registration services. Each of these providers supports the creation of different types of DNS records to manage your domain. A DNS record helps to map a user-friendly URL, such as "www.contoso.com", to the actual URL or IP address that hosts the site. 

> [AZURE.NOTE]
> In the discussion below, there are two DNS record types of interest. First, a CNAME record can redirect from one URL, such as "www.contoso.com", to a different URL, such as "contoso.azurewebsites.net". Second, an A record can map a URL, such as "www.contoso.com", to an IP address, such as 172.16.48.1.

For Azure Websites, you must first create a CNAME record to the Azure Website. This setting is done through the third-party registrar's site. The following is an example CNAME record.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Type</th>
   <th align="left" valign="top">Host</th>
   <th align="left" valign="top">Answer</th>
   <th align="left" valign="top">TTL</th>
</tr>
<tr>
   <td valign="top"><strong>CNAME</strong></td>
   <td valign="top">www.contoso.com</td>
   <td valign="top">contoso.azurewebsites.net</td>
   <td valign="top">8000</td>
</tr>
</table>

If your domain is newly registered, it might take the domain a day or more to resolve on all DNS servers, which operate off of cached DNS entries. However, if your domain already exists, the CNAME change should happen within a minute. Note that the CNAME record provides a mapping between your domain (which must be qualified with a subdomain alias, such as "www") to the Azure Website URL. Neither side of the CNAME record includes the "http://" prefix.

In the Azure Management Portal, verify that you are running in **Shared** or Sta****ndard modes on the **Scale** tab (custom domains are not supported for **Free** websites). Then go to the **Configure** tab and click the **Manage Domains** button. This enables you to associate the website with the custom domain name. 

![GlobalWebWebMatrix][GlobalWebWebMatrix]

Before placing your custom domain in the list, you must first go to your DNS provider and create a CNAME record for your custom domain (www.contoso.com) that points to the URL for your Azure Website (contoso.azurewebsites.net). After this propagates, you can enter the custom domain in the dialog shown in the previous screenshot. The presence of the CNAME record for www.contoso.com that points to this website ensures that you have the authority to use that domain name with this website. At this point, you can create an A record with the IP address at the bottom of the dialog.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="top">Type</th>
   <th align="left" valign="top">Host</th>
   <th align="left" valign="top">Answer</th>
   <th align="left" valign="top">TTL</th>
</tr>
<tr>
   <td valign="top"><strong>A</strong></td>
   <td valign="top">contoso.com</td>
   <td valign="top">172.16.48.1</td>
   <td valign="top">8000</td>
</tr>
</table>

For more information, see [Configuring a custom domain name for an Azure web site][customdns].

##<a name="ssl"></a>Secure the Website with SSL
If your site contains read-only information, there is no need to provide secure access to the site. However, if you collect any user information, perform ecommerce, or manage any other sensitive data, you should secure the site. Security is a big subject, and this paper cannot cover all of the best practices and techniques. However, it is important to highlight the process of enabling Secure Sockets Layer (SSL) for your Website. SSL allows users to connect to your site in an encrypted manner with HTTPS addresses instead of HTTP. There are specific steps required to use SSL with Azure Websites. 

Azure Websites automatically provides a secure connection to the actual site URL. For example, if your site were http://contoso.azurewebsites.net, you can connect over SSL simply by changing "http" to "https", as in **https**://contoso.azurewebsites.net.

However, if you are using a custom domain name, you must take steps to upload a certificate and enable SSL through the Azure Management Portal for your website. The following steps provide a summary of this process, but you can find the detailed instructions in the topic [Configuring an SSL certificate for an Azure web site][ssl].

First, obtain an SSL certificate from a Certificate Authority. If you are going to secure your domain with multiple subdomains (for example www.contoso.com and staging.contoso.com), you'll need to get a wildcard certificate (*.contoso.com). These can cost more, so you must decide whether the flexibility of this type of certificate justifies the cost.

Once you get the certificate from the Certificate Authority, you cannot simply upload it to Azure in the same format. You must generate a .pfx file using the openssl command. The openssl command is part of the OpenSSL Project. The sources are distributed on the [OpenSSL website][openssl], but you can usually find a precompiled version of the tool on the internet as well. In the following example, a certificate, myserver.crt, and the private key file, myserver.key, are used to create a .pfx file.

	openssl pkcs12 -export -out myserver.pfx -inkey myserver.key -in myserver.crt

To upload the certificate to Azure, first go to the **Scale** tab and verify that you are running in **Standard** mode. SSL for custom domains is not supported for **Free** or **Shared** modes. On the **Configure** tab, click the **upload a certificate** button.

![GlobalWebUplodateCert][GlobalWebUplodateCert]

Then in the **ssl bindings** section, map the certificate to the domain name that it secures. There are two options for this mapping: SNI SSL and IP Based SSL.

![GlobalWebSSLBindings][GlobalWebSSLBindings]

The **IP Based SSL** option is the traditional way to map the public dedicated IP address to the domain name. This works with all browsers. The **SNI SSL** option allows multiple domains to share the same IP address and yet have different associated SSL certificates for each domain. SNI SSL does not work with some older browsers (for more information on compatibility, see the [Wikipedia entry for SNI SSL][sni]). There is a monthly charge (prorated hourly) associated with each SSL certificate, and the pricing varies depending on the choice of IP based or SNI SSL. For pricing information, see [Web Sites Pricing Details][sslpricing]. For more information on this process, see [Configuring an SSL certificate for an Azure web site][ssl].

##<a name="monitor"></a>Monitor the Site
After your site is actively handling user requests, it is important to use monitoring. For example, you might want to know whether user load is causing high CPU time, which could indicate the need to scale the site. Or application inefficiencies might increase the response time or lead to errors. This section covers some of the built-in monitoring capabilities on the Azure Management Portal.

The **Monitor** tab contains some key metrics for your Website in graph format. 

![GlobalWebMonitor1][GlobalWebMonitor1]

You can customize the metrics in this graph using the Add Metrics button.

![GlobalWebMonitor2][GlobalWebMonitor2]

For sites running in **Standard** mode, you can also enable endpoint monitoring and alerting. On the **Configure** tab, go to the **monitoring** section, and configure an endpoint. This endpoint runs from one or more locations that you specify and periodically attempts to access your website. Both timing and error information is collected. 

In the **Monitor** tab, this endpoint appears showing response time. If you select the endpoint metric, you can then add an alert rule by clicking the **Add Rule** icon.

![GlobalWebMonitor3][GlobalWebMonitor3]

The rule can email administrators or other individuals when the response time exceeds the specified threshold.

![GlobalWebMonitor4][GlobalWebMonitor4]

If you discover the site requires scaling, this can be done on the **Scale** tab either manually or through the Autoscale preview. The scale tab provides choices for both scale-up (larger dedicated machines) or scale-out (additional shared instances or dedicated instances of the same size). However, the Autoscale preview only supports scale-out. For more details on this option, see the For more information on website monitoring, see the "Scale with User Demand" section of the [Digital Marketing Campaign][scenariodigitalmarketing] scenario. Also see, [How to Monitor Web Sites][howtomonitor].

##<a name="summary"></a>Summary
To create your organization's (.COM) site, the standard tasks include choosing a development framework, site creation, deployment, custom domain assignment, and monitoring. For sites that must secure user data, SSL is highly recommended. This article has provided an overview of performing these tasks using Azure Websites. For more information, see the following technical articles referenced in the paper.

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
   <td valign="middle"><strong>Create</strong></td>
   <td valign="top">- <a href="http://azure.microsoft.com/en-us/documentation/articles/web-sites-dotnet-get-started/">Get started with Azure Websites and ASP.NET</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Deploy</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/publishing-with-git/">Publishing from Source Control to Azure Websites</a><br/>- <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/get-started/">Deploying an ASP.NET Web Application to an Azure Website</a><br/>- <a href="http://www.windowsazure.com/en-us/develop/net/tutorials/website-with-webmatrix/">Develop and deploy a website with Microsoft WebMatrix</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Custom Domains</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/custom-dns-web-site/">Configuring a custom domain name for an Azure website</a></td>
</tr>
<tr>
   <td valign="middle"><strong>SSL</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/enable-ssl-web-site/">Configuring an SSL certificate for an Azure website</a></td>
</tr>
<tr>
   <td valign="middle"><strong>Monitor</strong></td>
   <td valign="top">- <a href="http://www.windowsazure.com/en-us/manage/services/web-sites/how-to-monitor-websites/">How to Monitor Websites</a></td>
</tr>
</table>

  [websitesoverview]:/en-us/documentation/services/web-sites/
  [csoverview]:/en-us/documentation/services/cloud-services/
  [vmoverview]:/en-us/documentation/services/virtual-machines/
  [chooseservice]:/en-us/manage/services/web-sites/choose-web-app-service
  
  
  [scenariodigitalmarketing]:/en-us/manage/services/web-sites/digital-marketing-campaign-solution-overview
  [howtocreatewebsites]:/en-us/documentation/articles/web-sites-dotnet-get-started
  [webmatrix]:http://www.microsoft.com/web/webmatrix/
  [publishingwithgit]:/en-us/develop/net/common-tasks/publishing-with-git/
  [aspnetgetstarted]:/en-us/develop/net/tutorials/get-started/
  [drupal]:https://drupal.org/
  [umbraco]:http://umbraco.com/
  [customdns]:/en-us/develop/net/common-tasks/custom-dns-web-site/
  [ssl]:/en-us/develop/net/common-tasks/enable-ssl-web-site/
  [openssl]:http://www.openssl.org/
  [sni]:http://en.wikipedia.org/wiki/Server_Name_Indication
  [sslpricing]:/en-us/pricing/details/web-sites/#service-ssl
  [howtomonitor]:/en-us/manage/services/web-sites/how-to-monitor-websites/
  
 [GlobalWebCreate]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Create.png
  [GlobalWebQuickGlance]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_QuickGlance.png
  [GlobalWebMonitor1]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Monitor1.png
  [GlobalWebMonitor2]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Monitor2.png
  [GlobalWebMonitor3]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Monitor3.png
  [GlobalWebMonitor4]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Monitor4.png
  [GlobalWebVSPublish]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_VS_Publish.png
  [GlobalWebSSLBindings]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_SSL_Bindings.png
  [GlobalWebUplodateCert]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_Uplodate_Cert.png
  [GlobalWebCustomDomain]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_CustomDomain.png
  [GlobalWebWebMatrix]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_WebMatrix.png
  [GlobalWebFTPSettings]: ./media/web-sites-global-web-presence-solution-overview/GlobalWeb_FTPSettings.png
  
  
  
  
  
  
  
  
  
  
  
