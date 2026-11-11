---
title: Azure in China developer guide
description: Microsoft provides tools to help developers create and deploy cloud applications to Azure global and to Azure in China.
ms.topic: concept-article
ms.date: 07/20/2020
---

# Azure in China developer guide

There are tools and documents to help developers create and deploy cloud applications to Microsoft Azure operated by 21Vianet (Azure in China). Most of the currently available technical content, such as the global [Azure documentation](/azure/), assumes that applications are being developed for Azure global. [Azure Docs for China](https://docs.azure.cn/zh-cn/) (in Chinese) supplies technical content adapted for Azure in China. For services available in Azure in China, see [Service availability and roadmaps of Azure in China](/azure/china/concepts-service-availability).

When referring to publicly available content for Azure global services, make sure to adapt the steps or customize any sample code that specifies settings for Azure global services. For example, customize the [Azure service endpoints](/azure/china/resources-developer-guide#check-endpoints-in-azure).

## Develop for Azure users

If you’re accustomed to developing cloud services for users in other regions, make sure you consider the following user expectations in China:

* **Mobile first:** Mobile devices, not PCs, are considered the source of the online world. Make sure your design strategy is mobile-centric.

* **QR codes and screen-scanning behavior:** Websites, print ads, business cards, and other media commonly include QR codes. Include QR codes in your website header and footer, so visitors can quickly load the site’s mobile version on their phones.

* **Content localization:** Localizing is more than just translating content. Take time to understand the digital environment of your target market and the cultural ramifications of your business decisions. Then tailor your content accordingly.

## Use social sites and media services in China

Commonly used western social media sites and services may be blocked in China. When operating a web presence in China:

* Avoid connecting to Google services on your website’s front end. Google, along with all of its services, is blocked in China. For best results, your site might need to avoid using Google services. For example, replace Google Maps with Baidu Maps, and use self-hosted fonts instead of Google fonts.

* Don't embed videos from YouTube or Vimeo. Both services are blocked in China. Host your video locally or on Chinese video hosting sites, such as Youku, Qiyi, Tudou, or use Azure Media Services. Optimize your site for Baidu, the most frequently used search engine in China, by using a search engine optimization (SEO) audit tool.

* Create a China-specific social network presence. Globally popular social networks, such as Facebook, Twitter, and Instagram, are blocked. Create a social marketing strategy specifically tailored for the social networks in China, such as WeChat and Sina Weibo. Azure doesn’t currently offer local social network integration (that is, a social identity provider).

## Check endpoints in Azure

Azure in China differs from Azure global, so any Azure service endpoints from Azure global sources, such as sample code or published documentation, must be changed. For details about endpoints used in Azure in China, see [Azure in China REST endpoints](concepts-service-availability.md#azure-in-china-rest-endpoints) and [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/details.aspx?id=57062).

## Application Insights

> [!NOTE]
> Codeless agent/extension based monitoring for Azure App Services is **currently not supported**. Snapshot Debugger is also not currently available.

## Next steps

* [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/details.aspx?id=57062)
* [Azure Architecture Center](/azure/architecture/)
