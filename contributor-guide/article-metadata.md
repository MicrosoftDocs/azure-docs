

# Metadata for Azure technical articles
The standard Azure metadata section looks like this:
  ```
  ---
  title: <page title displayed in search results. Include the brand Azure> | Microsoft Docs
  description: <article description that is displayed in search results>
  services: <service slug assigned to your service by ACOM>
  cloud: <cloud value assigned by ACOM for sovereign clouds such as Azure Government and Azure Stack>
  documentationcenter: <usually not applicable; if applicable, use value listed below for the correct dev center>
  author: <your GitHub user alias, with correct capitalization>
  manager: <alias of the content publishing manager responsible for the service area>

  ms.assetid: <asset ID - include the attribute, but leave it blank. The value will be added post publication.>
  ms.service: <service per approved list>
  ms.workload: na
  ms.tgt_pltfrm: na
  ms.devlang: <dev lang value, see list below>
  ms.topic: article
  ms.date: mm/dd/yyyy
  ms.author: <your microsoft alias, one value only, alias only>

---
  ```
##Usage

- The element name and attribute names are case sensitive.

## Attributes and values

![](./media/article-metadata/checkmark-small.png)**title**: Required; important for SEO. Title text appears in the browser tab and as the heading in a search result. Use up to 60 characters including spaces and including the site identifier *| Microsoft Docs* (typed as: space pipe space Microsoft Docs). The H1 of an article should expand on the title, not duplicate it. 

![](./media/article-metadata/checkmark-small.png)**description**: Required; important for SEO (relevance) and site functionality. The description should be at least 115 characters long to 145 characters maximum including spaces. Describe the purpose of your content so customers will know whether to choose it from a list of search results. The value is:

- This text may be displayed as the description or abstract paragraph in search results on Google.
- This text is displayed in [the article index results](https://azure.microsoft.com/documentation/articles/).

![](./media/article-metadata/checkmark-small.png)**services**: Required for articles that deal with a service. This value is usually referred to as the "service slug". This value is assigned by the ACOM team, and is used across the azure.microsoft.com site and in URLs for the service. List the applicable services, separated by commas.

![](./media/article-metadata/checkmark-small.png)**cloud**: Required only for sovereign clouds such as Azure Government and Azure Stack. This value is assigned by the ACOM team, and is used across the azure.microsoft.com site and in URLs for the service. List the applicable services

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

![](./media/article-metadata/checkmark-small.png)**author**: Required, one value only. List the GitHub account for the primary author or article SME. Get the capitalization right, it matters!

![](./media/article-metadata/checkmark-small.png)**manager**: Required if you are a Microsoft contributor. List the email alias of the content publishing manager for the technology area. If you are a community contributor, include the attribute but leave it empty so we can fill it out.

![](./media/article-metadata/checkmark-small.png)**tags**: Optional. Include only if you want to enable a link under the article breadcrumb to the article index page (http://azure.microsoft.com/documentation/articles/) to a prefiltered list of articles that match one of the approved values. These values are meant to provide a way to group content together when the content grouping is not service-specific. These tags can also provide labeling that indicates the technology stack the article applies to. This value **does not** support free-form tags or hashtags; the tags must be enabled on the site. You can supply multiple tags values to one article, separated by commas. The approved values are:

  - architecture
  - azure-resource-manager
  - azure-service-management
  - billing
  - mysql

![](./media/article-metadata/checkmark-small.png)**keywords**: Optional. For use by SEO champs only. Separate terms with commas. **Check with your SEO champ before you change or delete content in this article containing these terms.** This attribute records keywords the SEO champ has targeted and is tracking in order to improve search rank. The keywords do not render in the published HTML. Validation does not require this attribute.

![](./media/article-metadata/checkmark-small.png)**ms.assetid**: Required, but leave it blank for now. We will be periodically adding the asset ID post publication.

![](./media/article-metadata/checkmark-small.png)**ms.service**: Required. Specifies the Azure service, tool, or feature that the article applies to. One value per page.

 If a page applies to multiple services, choose the service to which it most directly applies; for instance, an article that uses an app hosted on web sites to demonstrate Service Bus functionality should have the **service-bus** value, rather than **web-sites**. If a page applies to multiple services equally, choose **multiple**. If a page does not apply to any services (this will be rare), choose **NA**.

The list of approved ms.service values is listed [here](https://microsoft.sharepoint.com/teams/STBCSI/Insights/_layouts/15/WopiFrame.aspx?sourcedoc=%7b7A321BF1-0611-4184-84DA-A0E964C435FA%7d&file=WEDCS_MasterList_CSIValues.xlsx&action=default&IsList=1&ListId=%7b46B17C8A-CD7E-47ED-A1B6-F2B654B55E2B%7d&ListItemId=969)

![](./media/article-metadata/checkmark-small.png)**ms.workload**: Required, but leave as **na** at this time. The ms.workload value is being mapped by an xls, not the value in the .md file. The ms.workload value is still required for validation until the feature can be updated. That work is now being scheduled.  Please use **"na"** as the value for now.



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


![](./media/article-metadata/checkmark-small.png)**ms.topic**: Required. Specifies the topic type. Most new pages created by contributors will use "article".

 - **article**: A conceptual topic, tutorial, feature guide, or other non-reference article

 - **get-started-article**: assign to articles that are featured in the Get Started or Overview section of the left navigation for a service.

 - **hero-article**: a "hero" tutorial that is designed to provide an introduction to a service or feature that gets visitors started using the service quickly and drives free-trial sign-ups and MSDN activations. Assign this value ONLY to articles that are featured on the documentation landing page for your service.

![](./media/article-metadata/checkmark-small.png) **ms.date**: Required. Specifies the date the article was last reviewed for relevance, accuracy, correct screen shots, and working links. Enter the date in mm/dd/yyyy format. This date also appears on the published article as the last updated date.

![](./media/article-metadata/checkmark-small.png) **ms.author**: Required. Specifies the author(s) associated with the topic. Internal reports (such as freshness) use this value to associate the right author(s) with the article. To specify multiple values you should separate them with semicolons. Either Microsoft aliases or complete email addresses are acceptable. The length can be no longer than 200 characters.


### Contributors' Guide Links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

<!--Anchors-->
[Syntax]: #syntax
[Usage]: #usage
[Attributes and values for the properties section]: #attributes-and-values-for-the-properties-section
[Attributes and values for the tags section]: #attributes-and-values-for-the-tags-section
