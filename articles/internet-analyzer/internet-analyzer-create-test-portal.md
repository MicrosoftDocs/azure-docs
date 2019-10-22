---
title: 'Create an Internet Analyzer test using Portal | Microsoft Docs'
description: In this article, learn how to create your first Internet Analyzer test. 
services: internet-analyzer
author: megan-beatty; mattcalder; diego-perez-botero

ms.service: internet-analyzer
ms.topic: tutorial
ms.date: 10/16/2019
ms.author: mebeatty
# Customer intent: As someone interested in migrating to Azure/ AFD/ CDN, I want to set up an Internet Analyzer test to understand the expected performance impact to my end users. 

---
# Create an Internet Analyzer test using Portal (Preview)

There are two ways to create an Internet Analyzer resource- using the Azure preview portal or using [CLI](internet-analyzer-cli.md). This section helps you create a new Azure Internet Analyzer resource using our portal experience. 


> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

# Before you begin

The public preview is available to use globally; however, data storage is limited to *US West 2* during preview.

# Basics 

1. [Request access](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR65LM6ELn65MggTwxb0d215UMkNIUDVGV1JGS0w5WFBHWklNMTNRTDQ4My4u) to use Internet Analyzer by providing your active Subscription ID. 
2. From the home page in the [Azure portal - Internet Analyzer preview](https://preview.portal.azure.com), click **+ Create a resource**. Internet Analyzer is currently only available from the *preview* Azure portal. 
3. On the **New** page, search for "Internet Analyzer" in the *Search the Marketplace* field. 
4. Click **Internet Analyzer (preview)**. Make sure the publisher is *Microsoft* and the category is *Networking*.
5. On the **Internet Analyzer (preview)** page, click **Create** to open the **Create an Internet Analyzer** page.
6. Specify the following configuration settings for your Internet Analyzer resource:

    * **Subscription:** The Azure subscription to host the new Internet Analyzer resource. Use the same Subscription ID used to request access.  
    * **Resource Group:** The Azure resource group that the new Internet Analyzer resource will be created in. If you don’t have an existing resource group, you can create a new one.
    * **Name:** The name of the new Internet Analyzer resource profile. 
    * **Region:** The Azure public region that the resource will be created in. 

7. When you have finished specifying the settings, click **Next: Configuration**. 

# Configuration 

## Embed Client
To begin any test, the JavaScript client must be embedded in your Web application. Specific instructions can be found on the [Embed Internet Analyzer Client](internet-analyzer-embed-client.md) page. Tests can be created before or after the client is embedded; however, no measurements will be collected until this step is complete. 

## Setup Tests
1. Give your test a name in the **Test Name** box.
2. Add a description for your test in the **Description** field. 
3. Click **Configure Endpoint** - a tab will appear from the right-hand side. Select the type of endpoint you'd like to configure- a single Azure region, multiple Azure regions, or a custom endpoint.

    > 
    ***Preconfigured endpoints: single and multiple Azure region combinations***
    * Select a region or set of regions from a [predetermined list of Azure endpoints](internet-analyzer-faq.md).
    * Next, select the type of application or content delivery architecture you'd like to evaluate. 
        * Single Azure region: Site acceleration ([Azure Front Door](https://azure.microsoft.com/services/frontdoor/)), static content caching ([Azure CDN for Microsoft](https://azure.microsoft.com/services/cdn/)), or none. 
        * Multiple Azure regions: Site acceleration ([Azure Front Door](https://azure.microsoft.com/services/frontdoor/)), DNS routing ([Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/))  

    ***Custom endpoints***
    * Download the one-pixel image provided on the page and host it on the endpoint server you would like to measure. Internet Analyzer assumes your custom endpoint is Internet-facing. 
    * Paste the location of the one-pixel imagine in the portal and the HTTPS URL. 
    * More detailed instructions can be found on the [Create Custom Endpoint](internet-analyzer-custom-endpoint.md) page. 
    >

4. Click **Add** to add the endpoint to your test. 
5. Repeat steps 1-5 to configure your second endpoint. Endpoint A is always measured relative to Endpoint B - when configuring endpoints, consider which endpoint should be your test control. 
6. By default, tests will be set to **Enabled.** If the JavaScript client is already installed, this means your test will begin once you click **Review + create**. If **Enabled** is not selected, you will need to start your test from the *Configuration* tab.


## Next steps

* Read the [Internet Analyzer FAQ](internet-analyzer-faq.md)
* Learn more about embedding the [Internet Analyzer Client](internet-analyzer-embed-client.md) and creating a [custom endpoint](internet-analyzer-custom-endpoint.md). 
