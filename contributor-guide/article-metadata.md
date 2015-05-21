

#Metadata for Azure technical articles

All Azure technical articles contain two metadata sections - a properties section and a tags section. The properties section enables some website automation and SEO stuff, while the tags section enables a lot of internal content reporting. Both sections are required.

- [Syntax]
- [Usage]
- [Attributes and values for the properties section]
- [Attributes and values for the tags section]

##Syntax

The properties section uses this syntax:

    <properties 
       pageTitle="Page title that displays in search results and the browser tab" 
       description="Article description that will be displayed on landing pages and in most search results" 
       services="service-name" 
       documentationCenter="dev-center-name" 
       authors="GitHub-alias-of-only-one-author" 
       manager="manager-alias" 
       editor=""
       tags=""/>

The tags section uses this syntax:

    <tags
       ms.service="required"
       ms.devlang="may be required"
       ms.topic="article"
       ms.tgt_pltfrm="may be required"
       ms.workload="required" 
       ms.date="mm/dd/yyyy"
       ms.author="Your MSFT alias or your full email address;semicolon separates two or more"/>

##Usage

- The element name and attribute names are case sensitive.
- The <properties> section must be the first line of your file.
- Leave a blank line after each metadata section and before your page title to ensure that the page title is correctly converted to HTML during the publishing process.

## Attributes and values for the properties section

![](./media/article-metadata/checkmark-small.png)**pageTitle**: Required; important to SEO. The text for this attribute appears in the browser tab and as the title in a search result. Use 55-60 characters including spaces and including the site identifier *| Microsoft Azure* (typed as: space pipe space Microsoft Azure).
 
![](./media/article-metadata/checkmark-small.png)**description**: Required; important for SEO (relevance) and site functionalities. Use at least 140 characters, but don't exceed 170 characters including spaces. Describe the  purpose of your content so customers will know whether to choose it from a list of search results. The value is:

- Usually displayed as the description or abstract paragraph in search results
- Will soon be displayed automatically on documentation landing pages as the description that appears when you click "More". It may appear in other contexts on azure.microsoft.com.

![](./media/article-metadata/checkmark-small.png)**services**: Required for articles that deal with a service. List all the applicable services, separated by commas. The first service you list will drive the navigational breadcrumbs for the page. In articles that specify both a services value and a documentationCenter value, the services value will drive the breadcrumb. Values:

- active-directory
- api-management
- app-service\api
- app-service\logic
- app-service\mobile
- app-service\web
- automation
- backup
- batch
- biztalk-services
- cache
- cdn
- cloud-services
- data-factory
- documentdb
- hdinsight
- key-vault
- machine-learning
- media-services
- mobile-engagement
- mobile-services
- multi-factor-authentication
- notification-hubs
- operational-insights
- recovery-manager
- redis-cache
- remoteapp
- search
- service-bus
- service-fabric
- scheduler
- site-recovery
- sql-database
- storage
- storsimple
- stream-analytics
- virtual-machines
- virtual-network
- visual-studio-online
- web-sites

![](./media/article-metadata/checkmark-small.png)**documentationCenter**: Required for dev-centric articles best featured through a dev center. Specify the single dev center or language that applies to the article. The value you list will drive the navigational breadcrumbs for the page. In articles that specify both a services value and a documentationCenter value, the services value will drive the breadcrumb. Values:

- **.net** 
- **nodejs** 
- **java** 
- **php** 
- **python** 
- **ruby** 
- **mobile**: Deprecated. Replace with specific mobile platform.
- **ios**: Verifing this new value
- **android**: Verifying this new value
- **windows**: Verifying this new value
- **xamarin**: Verifying this new value

![](./media/article-metadata/checkmark-small.png)**authors**: Required, one value only. List the GitHub account for the primary author or article SME. This attribute drives the byline on the published article. List only one, in spite of the plural name of the attribute.

![](./media/article-metadata/checkmark-small.png)**manager**: Required if you are a Microsoft contributor. List the alias of the content publishing manager for the technology area. If you are a community contributor, include the attribute but leave it empty so we can fill it out.

![](./media/article-metadata/checkmark-small.png)**editor**: Not used. Do not use it for other purposes.

![](./media/article-metadata/checkmark-small.png)**tags**: Optional. Include only if you want to enable a link under the article breadcrumb to the article index page (http://azure.microsoft.com/documentation/articles/) to a prefiltered list of articles that match one of the following approved values: mysql, billing, architecture. This value does not support free-form tags or hashtags.

## Attributes and values for the tags section

![](./media/article-metadata/checkmark-small.png)**ms.service**: Required. Specifies the Azure service, tool, or feature that the article applies to. One value per page. 

 If a page applies to multiple services, choose the service to which it most directly applies; for instance, an article that uses an app hosted on web sites to demonstrate Service Bus functionality should have the **service-bus** value, rather than **web-sites**. If a page applies to multiple services equally, choose **multiple**. If a page does not apply to any services (this will be rare), choose **NA**.

 - **active-directory**
 - **api-management**
 - **app-service**: Only applies to general conceptual material on App Service
 - **app-service-api**
 - **app-service-logic**
 - **app-service-mobile**
 - **app-service-web**
 - **application-insights**	
 - **automation**	
 - **backup**	
 - **biztalk-services**	
 - **cache**	
 - **cdn**	
 - **cloud-services**	
 - **expressroute**	
 - **hdinsight**	
 - **intelligent-systems**	
 - **key-vault**	
 - **machine-learning**	
 - **marketplace**: Articles about the Azure marketplace
 - **media-services**
 - **mobile-engagement**	
 - **mobile-services**	
 - **multi-factor-authentication**	
 - **multiple**: The page applies to multiple services equally
 - **na**: The page does not apply to any services (rare)
 - **notification-hubs**	
 - **operational-insights**	
 - **remoteapp**	
 - **scheduler**	
 - **service-bus**	
 - **service-fabric**
 - **site-recovery**: formerly recovery-services
 - **sql-database**	
 - **sql-reporting**	
 - **storage**	
 - **store**: Articles about services available through the Azure Store
 - **storsimple**	
 - **traffic-manager**	
 - **virtual-machines**	
 - **virtual-network**	
 - **visual-studio-online**	
 - **web-sites**	

![](./media/article-metadata/checkmark-small.png)**ms.devlang**: Required. Specifies the programming language that the article applies to. Single value per page.

 If a page applies to two programming languages equally, choose **multiple**. If a page is primarily conceptual and its content is generally applicable to multiple programming languages, choose **multiple**. If a page is not targeted at developers and the programming language applicability is not relevant, choose **NA**. Use **rest-api** to identify REST API reference topics.

 - **cpp**	
 - **dotnet**	
 - **java**	
 - **javascript**	
 - **multiple**: The page applies to multiple programming languages equally.
 - **na**: The page is not targeting developers and is not specific to any programming languages.
 - **nodejs**	
 - **objective-c**	
 - **php**	
 - **python**	
 - **rest-api**	
 - **ruby**	


![](./media/article-metadata/checkmark-small.png)**ms.topic**: Required. Specifics the topic type. Most new pages created by contributors will be article or reference.

 - **article**: A conceptual topic, tutorial, feature guide, or other non-reference article

 - **campaign-page**: Azure.com only.  A page that is specifically designed as a landing page for external campaigns, and is not included as part of the primary site IA.  Should not be used for documentation articles or regular doc landing pages.  Examples: azure.microsoft.com/develop/net/aspnet/; azure.microsoft.com/develop/mobile/ios/

 - **dev-center-home-page**: Azure.com only.  A dev center home page, e.g. /develop/net/

 - **hero-article**: a "hero" tutorial that is designed to provide an introduction to a service or feature that gets visitors started using the service quickly and drives free-trial sign-ups and MSDN activations

 - **home-page**: Top level documentation home page. We only have two: azure.microsoft.com/documentation/ and msdn.microsoft.com/library/azure/

 - **index-page**: Second-level landing pages for programming languages, services, or features. These are spread across Azure.com and the library, and are used as entry points for more specific, scoped information. Examples: http://azure.microsoft.com/develop/mobile/resources-wp8/, http://msdn.microsoft.com/library/azure/jj673460.aspx, http://msdn.microsoft.com/library/azure/hh689864.aspx

 - **infographic-page**: Azure.com only. A page that features a browsable infographic or poster, for instance http://azure.microsoft.com/documentation/infographics/windows-azure/

 - **reference**: An API reference page (including REST API) or PowerShell cmdlet reference page

 - **service-home-page**: Azure.com only.  A doc service home page, e.g. /documentation/services/virtual-machines/

 - **site-section-home-page**: Azure.com only. A "home page" for a particular type of content on azure.com Examples: http://azure.microsoft.com/documentation/infographics/, http://azure.microsoft.com/documentation/scripts/, http://azure.microsoft.com/documentation/videos/home/, http://azure.microsoft.com/downloads/

 - **video-page**: Azure.com only.  A page that features a video, for instance http://azure.microsoft.com/documentation/videos/azure-webjobs-hosting-testing-net/

![](./media/article-metadata/checkmark-small.png)**ms.tgt_pltfrm**: Required. Specifies the target platform, for instance Windows, Linux, Windows Phone, iOS, Android, or special cache platforms. One value per page. This value will be **NA** for most topics except mobile and virtual machines.

 - **cache-in-role**	
 - **cache-multiple**	
 - **cache-redis**	
 - **cache-service**	
 - **cache-shared**	
 - **command-line-interface**	
 - **ibiza**: content that uses the Ibiza portal. Use this only in cases where the feature being discussed is available across both the Ibiza portal and the current portal.
 - **mobile-android**: Azure.com only right now
 - **mobile-html**: Azure.com only right now
 - **mobile-ios**: Azure.com only right now
 - **mobile-kindle**: Azure.com only right now
 - **mobile-multiple**	
 - **mobile-nokia-x**: Azure.com only right now
 - **mobile-phonegap**: Azure.com only right now
 - **mobile-sencha**: Azure.com only right now
 - **mobile-windows**: Azure.com only right now; Windows Universal
 - **mobile-windows-phone**	
 - **mobile-windows-store**	
 - **mobile-xamarin**: Azure.com only right now; Xamarin all platforms
 - **mobile-xamarin-android**: Azure.com only right now
 - **mobile-xamarin-ios**: Azure.com only right now
 - **multiple**: The page applies to multiple platforms equally
 - **na**: A platform specifier is not applicable for this page
 - **powershell**	
 - **vm-linux**	
 - **vm-multiple**	
 - **vm-windows**	
 - **vm-windows-sharepoint**	
 - **vm-windows-sql-server**	
 - **vs-getting-started**: Identifies the VS Getting Started page group. Tag added 12/1/14.
 - **vs-what-happened**: Identifies the VS Getting Started What Happened page. Tag added 12/1/14.

![](./media/article-metadata/checkmark-small.png)**ms.workload**: Required. Specifies the Azure workload that the page applies to. One value only per article.

 If a page applies to multiple workloads, choose the workload to which is most directly applies. If a page applies to multiple workloads equally, choose **multiple**. If a page applies to a service that does not yet map to a workload, choose **TBD**. If a page does not apply to any workloads (this will be rare), choose **NA**.

 - **multiple**: The page applies to multiple workloads equally

 - **na**: The page does not appy to any workloads. Examples include Store partner content or content that is programming-language specific but not specific to Azure services

 - **tbd**: The page applies to a service that does not yet map to a workload

 - **big-data**: In many cases, content associated with the following services maps to this workload: hdinsight

 - **data-services**: In many cases, content associated with the following services maps to this workload: sql-database

 - **identity**: In many cases, content associated with the following services maps to this workload: active-directory, multi-factor-authentication

 - **infrastructure-services**: In many cases, content associated with the following services maps to this workload: virtual-machines, virtual-network, traffic-manager, expressroute

 - **integration**: In many cases, content associated with the following services maps to this workload: biztalk-services

 - **media**: In many cases, content associated with the following services maps to this workload: media-services

 - **mobile**: In many cases, content associated with the following services maps to this workload: mobile-services, notification-hubs, service-bus

 - **storage-backup-recovery**: In many cases, content associated with the following services maps to this workload: storage, recovery-services, backup

 - **web**: In many cases, content associated with the following services maps to this workload: web-sites

 - **azure-government**: Use for content that supports the Azure Government offering. 

![](./media/article-metadata/checkmark-small.png) **ms.date**: Required. Specifies the date the article was last reviewed for relevance, accuracy, correct screen shots, and working links. Enter the date in mm/dd/yyyy format. This date also appears on the published article as the last updated date.

![](./media/article-metadata/checkmark-small.png) **ms.author**: Required. Specifies the author(s) associated with the topic. To specify multiple values you should separate them with semicolons. Either Microsoft aliases or complete email addresses are acceptable. The length can be no longer than 200 characters.


###Contributors' Guide Links

- [Overview article](./../CONTRIBUTING.md)
- [Index of guidance articles](./contributor-guide-index.md)


<!--Anchors-->
[Syntax]: #syntax
[Usage]: #usage
[Attributes and values for the properties section]: #attributes-and-values-for-the-properties-section
[Attributes and values for the tags section]: #attributes-and-values-for-the-tags-section
