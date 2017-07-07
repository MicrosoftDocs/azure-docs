

# Metadata for Azure technical articles
The standard Azure metadata section looks like this:
  ```
  ---
  title: <page title displayed in search results. Include the brand Azure>
  description: <article description that is displayed in search results>
  services: <service slug assigned to your service by ACOM>
  cloud: <optional; cloud value assigned by ACOM for sovereign clouds such as Azure Government and Azure Stack>
  suite: <optional; suite value assigned by ACOM for suites>
  author: <your GitHub user alias, with correct capitalization>
  manager: <alias of the content publishing manager responsible for the service area>

  ms.service: <service per approved list>
  ms.tgt_pltfrm: <optional>
  ms.devlang: <optional>
  ms.topic: article
  ms.date: mm/dd/yyyy
  ms.author: <your microsoft alias, one value only, alias only>
---
  ```
## Usage

- The element name and attribute names are case sensitive.

- Historically, the upper section of metadata in Azure articles was used to enable functionality on the ACOM site, the lower section was for content team metrics. With the move to docs.microsoft.com, we need to continue to use the upper section of metadata because several of the values are used to enable the azure.microsoft.com chrome that is currently applied to Azure content on docs.microsoft.com. The values that are passed to ACOM under this arrangement are:

    - Keywords from "tags" and "ms.search.keywords"
    - Products from "services"
    - Suites from "suite"
    - Clouds from "cloud”


## Attributes and values

![](./media/article-metadata/checkmark-small.png)**title**: Required; important for SEO. Title text appears in the browser tab and as the heading in a search result. Use up to 60 characters including spaces. Note that the site identifier *| Microsoft Docs* will automatically be added to your title value in the OPS build process. 

![](./media/article-metadata/checkmark-small.png)**description**: Required; important for SEO (relevance) and site functionality. The description should be at least 115 characters long to 145 characters maximum including spaces. Describe the purpose of your content so customers will know whether to choose it from a list of search results. The value is:

- This text may be displayed as the description or abstract paragraph in search results on Google.
- This text is displayed in [the article index results](https://azure.microsoft.com/documentation/articles/).

![](./media/article-metadata/checkmark-small.png)**services**: Required for articles that deal with a service. This value is usually referred to as the "service slug". This value is determined by the ACOM team; we continue to use this value on docs.microsoft.com to support correct functioning of the azure.microsoft.com search feature so documentation can be surfaced there. List the applicable services, separated by commas.

![](./media/article-metadata/checkmark-small.png)**cloud**: Required only for sovereign clouds such as Azure Government and Azure Stack. This value is determined by the ACOM team; we continue to use this value on docs.microsoft.com to support correct functioning of the azure.microsoft.com search feature so documentation can be surfaced there. List the applicable clouds, separated by commas.

![](./media/article-metadata/checkmark-small.png)**suite**: Required only for suites; only current service using this value is iot-suite.

![](./media/article-metadata/checkmark-small.png)**author**: Required, one value only. List the GitHub account for the primary author or article SME. Get the capitalization right, it matters!

![](./media/article-metadata/checkmark-small.png)**manager**: Required if you are a Microsoft contributor. List the email alias of the content publishing manager for the technology area. If you are a community contributor, include the attribute but leave it empty so we can fill it out.

![](./media/article-metadata/checkmark-small.png)**keywords**: Optional. For use by SEO champs only. Separate terms with commas. **Check with your SEO champ before you change or delete content in this article containing these terms.** This attribute records keywords the SEO champ has targeted and is tracking in order to improve search rank. The keywords do not render in the published HTML. Validation does not require this attribute.

![](./media/article-metadata/checkmark-small.png)**ms.service**: Required. Specifies the Azure service, tool, or feature that the article applies to. One value per page.

If a page applies to multiple services, choose the service to which it most directly applies; for instance, an article that uses an app hosted on web sites to demonstrate Service Bus functionality should have the **service-bus** value, rather than **web-sites**. If a page applies to multiple services equally, choose **multiple**. If a page does not apply to any services (this will be rare), choose **NA**.

The list of approved values is listed [here](https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-write-metadata?branch=master).

![](./media/article-metadata/checkmark-small.png)**ms.tgt_pltfrm**: Optional. Specifies the target platform, for instance Windows, Linux, Windows Phone, iOS, Android, or special cache platforms. One value per page. This value will be **na** for most topics except mobile and virtual machines.

![](./media/article-metadata/checkmark-small.png)**ms.devlang**: Optional. Specifies the programming language that the article applies to. Single value per page.

The list of approved values is listed [here](https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-write-metadata?branch=master).

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
