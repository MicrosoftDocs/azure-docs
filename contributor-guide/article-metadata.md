

#Metadata for Azure technical articles

All Azure technical articles contain two metadata sections - a properties section and a tags section. The properties section enables some website automation and SEO stuff, while the tags section enables a lot of internal content reporting. Both sections are required.

##Syntax

The properties section uses this syntax:

    <properties title="required" pageTitle="required" description="required" metaKeywords="" services="" solutions="" documentationCenter="" authors="Your GitHub account" videoId="" scriptId="" manager="required" />

The tags section uses this syntax:

    <tags ms.service="required" ms.devlang="may be required" ms.topic="article" ms.tgt_pltfrm="may be required" ms.workload="required" ms.date="mm/dd/yyyy" ms.author="Your MSFT alias or your full email address" />

##Usage

- The element name and attribute names are case sensitive.
- The <properties> section must be the first line of your file, and it must exist as a single line (e.g. don't add any line breaks between attributes).
- Leave a blank line after each metadata section and before your page title to ensure that the page title is correctly converted to HTML during the publishing process.

## Attributes and their values - properties section

**title**: no longer required. Checking to see if we can leave it out.

**pageTitle**: Required; important to SEO. The title you enter for this attribute appears in the browser address bar and as the title in a search result.
 
**description**: Required; important to SEO and site functionalities. Up to 150 characters. The value you enter should be rich in keywords for the topic covered. The value is:

- Sometimes displayed as the search results description in search results
- Will soon be displayed automatically on documentation landing pages as the description that appears when you click "More". It may appear in other contexts on azure.microsoft.com.

**metaKeywords": no longer required. Checking to see if we can leave it out.

**services**: Required for articles that deal with a service. List all the applicable services, separated by commas. The first service you list will drive the navigational breadcrumbs for the page. Values:

- active-directory
- backup
- biztalk-services
- cache
- cloud-services
- hdinsight
- media-services
- mobile-services
- multi-factor-authentication
- notification-hubs
- recovery-manager
- service-bus
- scheduler
- sql-database
- storage
- virtual-machines
- virtual-network
- visual-studio-online
- web-sites
 

**solutions**: no longer required. Checking to see if we can leave it out.

**documentationCenter**: Required for dev-centric articles best featured through a dev center. Specify the single dev center or language that applies to the article. The value you list will drive the navigational breadcrumbs for the page. Values:

- **.NET** 
- **nodejs** 
- **Java** 
- **PHP** 
- **Python** 
- **Ruby** 
- **Mobile**: Deprecated. Replace with specific mobile platform.
- **iOS**: Verifing this new value
- **Android**: Verifing this new value
- **Windows**: Verifing this new value
- **Xamarin**: Verifing this new value

**authors**: Required. List the GitHub account for the primary author or article SME. This attribute drives the byline on the published article. List only one, in spite of the plural name of the attribute.

**videoId**: Unique identifier for a single video that is associated with the article. This property is not currently used.
 
**scriptId**: Unique identifier for a single script that is associated with the article. This property is not currently used.

**manager**: Required if you are a Microsoft contributor. List the alias of the content publishing manager for the technology area. If you are a community contributor, include the attribute but leave it empty so we can fill it out.

## Attributes and their values - tags section

