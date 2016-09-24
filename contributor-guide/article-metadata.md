

#Metadata for Azure technical articles

All Azure technical articles contain two metadata sections - a properties section and a tags section. The properties section enables some website automation and SEO stuff, while the tags section enables a lot of internal content reporting. Both sections are required.

- [Syntax]
- [Usage]
- [Attributes and values for the properties section]
- [Attributes and values for the tags section]

##Syntax

The properties section uses the following syntax:

    <properties
       pageTitle="Page title that displays in search results and the browser tab | Microsoft Azure"
       description="Article description that will be displayed on landing pages and in most search results"
       services="service-name"
       documentationCenter="dev-center-name"
       authors="GitHub-alias-of-only-one-author"
       manager="manager-alias"
       editor=""
       tags="optional"
       keywords="For use by SEO champs only. Separate terms with commas. Check with your SEO champ before you change content in this article containing these terms."/>

The tags section uses the following syntax:

    <tags
       ms.service="required"
       ms.devlang="may be required"
       ms.topic="article"
       ms.tgt_pltfrm="may be required"
       ms.workload="na"
       ms.date="mm/dd/yyyy"
       ms.author="Your MSFT alias or your full email address;semicolon separates two or more"/>

##Usage

- The element name and attribute names are case sensitive.
- The <properties> section must be the first line of your file.
- Leave a blank line after each metadata section and before your page title to ensure that the page title is correctly converted to HTML during the publishing process.

## Attributes and values for the properties section

![](./media/article-metadata/checkmark-small.png)**pageTitle**: Required; important to SEO. The text for this attribute appears in the browser tab and as the title in a search result. Use 55-60 characters including spaces and including the site identifier *| Microsoft Azure* (typed as: space pipe space Microsoft Azure).  The pageTitle should be different from the H1.

![](./media/article-metadata/checkmark-small.png)**description**: Required; important for SEO (relevance) and site functionality. The description should be at least 125 characters long to 155 characters maximum including spaces. Describe the purpose of your content so customers will know whether to choose it from a list of search results. The value is:

- This text may be displayed as the description or abstract paragraph in search results on Google.
- This text is displayed in [the article index results](https://azure.microsoft.com/documentation/articles/).

![](./media/article-metadata/checkmark-small.png)**services**: Required for articles that deal with a service. This value is ofter referred to as the "servce slug". List all the applicable services, separated by commas. The first service that you list will drive the navigational breadcrumbs for the page and the left navigation that is diplayed with the page.

In articles that specify both a services value and a documentationCenter value, the services value will drive the breadcrumb. Additional values that you list will appear as tags in the published article. Values:

- active-directory
- active-directory-b2c
- active-directory-ds
- app-service\api
- api-management
- app-service
- app-servic\mobile
- app-service\web
- app-service\logic
- application-gateway
- application-insights
- automation
- azure-portal
- azure-resource-manager
- azure-stack
- backup
- batch
- best-practice
- biztalk-services
- cache
- cdn
- cloud-services
- data-catalog
- data-factory
- data-lake-analytics
- data-lake-store
- devtest-lab
- dns
- documentdb
- expressroute
- event-hubs
- hdinsight
- iot-hub
- key-vault
- load-balancer
- machine-learning
- marketplace
- media-services
- mobile-engagement
- mobile-services
- multi-factor-authentication
- notification-hubs
- operational-insights
- operations-management-suite
- powerapps
- recovery-manager
- redis-cache
- remoteapp
- rights-management
- scheduler
- search
- security-center
- service-bus
- service-fabric
- site-recovery
- sql-database
- sql-data-warehouse
- sql-reporting
- storage
- store
- storsimple
- stream-analytics
- traffic-manager
- virtual-machines
- virtual-network
- visual-studio-online
- vpn-gateway
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

![](./media/article-metadata/checkmark-small.png)**manager**: Required if you are a Microsoft contributor. List the email alias of the content publishing manager for the technology area. If you are a community contributor, include the attribute but leave it empty so we can fill it out.

![](./media/article-metadata/checkmark-small.png)**editor**: Not used. Do not use it for other purposes.

![](./media/article-metadata/checkmark-small.png)**tags**: Optional. Include only if you want to enable a link under the article breadcrumb to the article index page (http://azure.microsoft.com/documentation/articles/) to a prefiltered list of articles that match one of the approved values. These values are meant to provide a way to group content together when the content grouping is not service-specific. These tags can also provide labeling that indicates the technology stack the article applies to. This value **does not** support free-form tags or hashtags; the tags must be enabled on the site. You can supply multiple tags values to one article, separated by commas. The approved values are:

  - architecture
  - azure-resource-manager
  - azure-service-management
  - billing
  - mysql

![](./media/article-metadata/checkmark-small.png)**keywords**: Optional. For use by SEO champs only. Separate terms with commas. **Check with your SEO champ before you change or delete content in this article containing these terms.** This attribute records keywords the SEO champ has targeted and is tracking in order to improve search rank. The keywords do not render in the published HTML. Validation does not require this attribute.

## Attributes and values for the tags section

![](./media/article-metadata/checkmark-small.png)**ms.service**: Required. Specifies the Azure service, tool, or feature that the article applies to. One value per page.

 If a page applies to multiple services, choose the service to which it most directly applies; for instance, an article that uses an app hosted on web sites to demonstrate Service Bus functionality should have the **service-bus** value, rather than **web-sites**. If a page applies to multiple services equally, choose **multiple**. If a page does not apply to any services (this will be rare), choose **NA**.

 - **active-directory**
 - **active-directory-b2c**
 - **active-directory-ds**
 - **api-management**
 - **app-service**: Only applies to general conceptual material on App Service
 - **app-service-api**
 - **app-service-logic**
 - **app-service-mobile**
 - **app-service-web**
 - **application-insights**
 - **application-gateway**
 - **automation**
 - **azure-resource-manager**
 - **azure-security**
 - **azure-stack**
 - **backup**
 - **batch**
 - **best-practice**
 - **biztalk-services**
 - **billing**
 - **cache**
 - **cdn**
 - **cloud-services**
 - **data-catalog**
 - **data-lake-store**
 - **data-lake-analytics**
 - **devtest-lab**
 - **expressroute**
 - **hdinsight**
 - **internet-of-things**
 - **iot-hub**
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
 - **powerapps**
 - **recovery-manager**
 - **redis-cache**
 - **remoteapp**
 - **rights-management**
 - **scheduler**
 - **security-center**
 - **service-bus**
 - **service-fabric**
 - **site-recovery**: formerly recovery-services
 - **sql-database**
 - **sql-data-warehouse**
 - **sql-reporting**
 - **storage**
 - **store**: Articles about services available through the Azure Store
 - **storsimple**
 - **traffic-manager**
 - **virtual-machines**
 - **virtual-network**
 - **visual-studio-online**
 - **vpn-gateway**
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

 - **get-started-article**: assign to articles that are featured in the Get Started or Overview section of the left navigation for a service.

 - **hero-article**: a "hero" tutorial that is designed to provide an introduction to a service or feature that gets visitors started using the service quickly and drives free-trial sign-ups and MSDN activations. Assign this value ONLY to articles that are featured at the top of the documentation landing page for your service.

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

**update 8/6/15** The ms.workload value is being mapped by an xls, not the value in the .md file. The ms.workload value is still required for validation until the feature can be updated. That work is now being scheduled.  Please use **"na"** as the value for now.

![](./media/article-metadata/checkmark-small.png) **ms.date**: Required. Specifies the date the article was last reviewed for relevance, accuracy, correct screen shots, and working links. Enter the date in mm/dd/yyyy format. This date also appears on the published article as the last updated date.

![](./media/article-metadata/checkmark-small.png) **ms.author**: Required. Specifies the author(s) associated with the topic. Internal reports (such as freshness) use this value to associate the right author(s) with the article. To specify multiple values you should separate them with semicolons. Either Microsoft aliases or complete email addresses are acceptable. The length can be no longer than 200 characters.


###Contributors' Guide Links

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)


<!--Anchors-->
[Syntax]: #syntax
[Usage]: #usage
[Attributes and values for the properties section]: #attributes-and-values-for-the-properties-section
[Attributes and values for the tags section]: #attributes-and-values-for-the-tags-section
