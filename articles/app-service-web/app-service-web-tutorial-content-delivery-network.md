---
title: Add a Content Delivery Network (CDN) to an Azure App Service | Microsoft Docs
description: Add a Content Delivery Network (CDN) to an Azure App Service to cache and deliver your static files from servers close to your customers around the world.
services: app-service
author: syntaxc4
ms.author: cfowler
ms.date: 05/01/2017
ms.topic: hero-article
ms.service: app-service-web
manager: erikre
---
# Add a Content Delivery Network (CDN) to an Azure App Service

The [Azure Content Delivery Network (CDN)](../cdn/cdn-overview.md) caches static web content at strategically placed locations to provide maximum throughput for delivering content to users. This tutorial shows how to add a CDN) to a web app in Azure App Service. 

You'll work with a sample app that you create in the [static HTML quickstart](app-service-web-get-started-html.md).

![Sample app home page](media/app-service-web-tutorial-content-delivery-network/sample-app-home-page.png)

When you're finished, you'll know how to create CDN endpoints, refresh cached assets, use query strings to control cached versions, and use a custom domain.

## Before you begin

To complete this tutorial, you'll work with a sample application deployed in a web app in Azure App Service. To create the web app, follow the [static HTML quickstart](app-service-web-get-started-html.md). In that tutorial, skip the **Update and redeploy** and **Clean up resources** steps. When you finish that tutorial, keep the command prompt open so that you can deploy additional changes to the web app later in this tutorial.

### Have a custom domain ready

To complete the custom domain step of this tutorial, you need to have access to your DNS registry for your domain provider (such as GoDaddy). For example, to add DNS entries for `contoso.com` and `www.contoso.com`, you must have access to configure the DNS settings for the `contoso.com` root domain.

If you don't already have a domain name, consider following the [App Service domain tutorial](custom-dns-web-site-buydomains-web-app.md) to purchase a domain using the Azure portal. 

## Log in to the Azure portal

Open a browser and navigate to the [Azure portal](https://portal.azure.com).

## Create a CDN profile and endpoint

In the left navigation, select **App Services**, and then select the app that you created in the [static HTML quickstart](app-service-web-get-started-html.md).

![Select App Service app in the portal](media/app-service-web-tutorial-content-delivery-network/portal-select-app-services.png)

In the App Service blade, enter *cdn* in the **Search** box, and then select **Networking > Configure Azure CDN for your app**.

![Select CDN in the portal](media/app-service-web-tutorial-content-delivery-network/portal-select-cdn.png)

In the **Azure Content Delivery Network** blade, provide the **New endpoint** settings as specified in the table.

![Create profile and endpoint in the portal](media/app-service-web-tutorial-content-delivery-network/portal-new-endpoint.png)

![Create profile and endpoint in the portal - detail of New endpoint input boxes](media/app-service-web-tutorial-content-delivery-network/portal-new-endpoint-detail.png)

| Setting | Suggested value | Description |
| ------- | --------------- | ----------- |
| **CDN profile** | myCDNProfile | Select **Create new** to create a new CDN profile. A CDN profile is a collection of CDN endpoints with the same pricing tier. |
| **Pricing tier** | Standard Akamai | The [pricing tier](../cdn/cdn-overview.md#azure-cdn-features) specifies the provider and available features. Standard Akamai is recommended for this tutorial because Akamai provisions its CDN in minutes versus up to an hour and a half for Verizon. |
| **CDN endpoint name** | Any name that is unique in the azureedge.net domain | You access your cached resources at the domain *\<endpointname>.azureedge.net*.

Select **Create**.

Azure creates the profile and endpoint. The new endpoint appears in the **Endpoints** list on the same blade, and when it's provisioned the status is **Running**. The provisioning process may take a few minutes.

![New endpoint in list](media/app-service-web-tutorial-content-delivery-network/portal-new-endpoint-in-list.png)

### Test the CDN endpoint

Now that the CDN endpoint is provisioned, you can access content from it.

The sample app has an *index.html* file and *css*, *img*, and *js* folders that contain other static assets. The content paths for all of these files are the same at the CDN endpoint. For example, both of the following URLs access the *bootstrap.css* file in the *css* folder:

```
http://<appname>.azurewebsites.net/css/bootstrap.css
http://<endpointname>.azureedge.net/css/bootstrap.css
```

Navigate a browser to the following URL and you see the same page that you ran earlier in an Azure web app, but now it's served from the CDN.

```
http://<endpointname>.azureedge.net/index.html
```

![Sample app home page served from CDN](media/app-service-web-tutorial-content-delivery-network/sample-app-home-page-cdn.png)

This shows that Azure CDN has retrieved the origin web app's assets and is serving them from the CDN endpoint. 

To ensure that this page is cached in the CDN, refresh the page. Two requests for the same asset are sometimes required for the CDN to cache the requested content.

## Purge the CDN

The CDN periodically refreshes its resources from the origin web app based on the time-to-live (TTL) configuration. The default TTL is 7 days.

At times you might need to refresh the CDN before the TTL expiration -- for example, when you deploy updated content to the web app. To trigger a refresh, you can manually purge the CDN resources. 

In this section of the tutorial, you deploy a change to the web app and purge the CDN to trigger the CDN to refresh its cache.

### Deploy a change to the web app

Open the *index.html* file and add "- V2" to the H1 heading, as shown in the following example: 

```
<h1>Azure App Service - Sample Static HTML Site - V2</h1>
```

Commit your change and deploy it to the web app.

```bash
git commit -am "version 2"
git push azure master
```

Once deployment has completed, browse to the web app URL and you see the change.

```
http://<appname>.azurewebsites.net/
```

![V2 in title in web app](media/app-service-web-tutorial-content-delivery-network/v2-in-web-app-title.png)

Browse to the CDN endpoint URL for the home page and you don't see the change because the cached version in the CDN hasn't expired yet. 

```
http://<endpointname>.azureedge.net/index.html
```

![No V2 in title in CDN](media/app-service-web-tutorial-content-delivery-network/no-v2-in-cdn-title.png)

### Purge the CDN in the portal

To trigger the CDN to update its cached version, purge the CDN.

In the portal left navigation, select **Resource groups**, and then select the resource group that you created for your web app (myResourceGroup).

![Select resource group](media/app-service-web-tutorial-content-delivery-network/portal-select-group.png)

In the list of resources, select your CDN endpoint.

![Select endpoint](media/app-service-web-tutorial-content-delivery-network/portal-select-endpoint.png)

At the top of the **Endpoint** blade, click **Purge**.

![Select Purge](media/app-service-web-tutorial-content-delivery-network/portal-select-purge.png)

Enter the content paths you wish to purge. You can pass a complete file path to purge an individual file, or a path segment to purge and refresh all content in a folder. Since you changed *index.html*, make sure that is one of the paths.

At the bottom of the blade, select **Purge**.

![Purge blade](media/app-service-web-tutorial-content-delivery-network/app-service-web-purge-cdn.png)

### Verify that the CDN is updated

Wait until the purge request finishes processing, typically a couple of minutes. To see the current status, select the bell icon at the top of the page. 

![Purge notification](media/app-service-web-tutorial-content-delivery-network/portal-purge-notification.png)

Browse to the CDN endpoint URL for *index.html*, and now you see the V2 that you added to the title on the home page. This shows that the CDN cache has been refreshed.

```
http://<endpointname>.azureedge.net/index.html
```

![V2 in title in CDN](media/app-service-web-tutorial-content-delivery-network/v2-in-cdn-title.png)

## Use query strings to version content

The Azure CDN offers the following caching behavior options:

* Ignore query strings
* Bypass caching for query strings
* Cache every unique URL 

The first of these is the default, which means there is only one cached version of an asset regardless of the query string used in the URL that accesses it. 

In this section of the tutorial, you change the caching behavior to cache every unique URL.

### Verify that query strings are currently ignored

In a browser, navigate to the home page at the CDN endpoint, but include a query string: 

```
http://<endpointname>.azureedge.net/index.html?q=1
```

The CDN returns the current web app content, which includes "V2" in the heading. To ensure that this page is cached in the CDN, refresh the page. 

Open *index.html* and change "V2" to "V3", and deploy the change. 

```bash
git commit -am "version 3"
git push azure master
```

In a browser, go to the web app URL. The "V3" in the heading confirms that your change and deployment were successful. Then go to the CDN endpoint URL with the query string, and you still see  "V2". Try other query string values such as "q=2" and you still see "V2" because all query strings are treated as one for caching purposes.

```
http://<endpointname>.azureedge.net/index.html?q=1
http://<endpointname>.azureedge.net/index.html?q=2
```

![V2 in title in CDN, query string 1](media/app-service-web-tutorial-content-delivery-network/v2-in-cdn-title-qs1.png)

![V2 in title in CDN, query string 2](media/app-service-web-tutorial-content-delivery-network/v2-in-cdn-title-qs2.png)

This output shows that the query string makes no difference in what cached information the CDN returns.

### Change the cache behavior

In the Azure portal **CDN Endpoint** blade, select **Cache**.

Select **Cache every unique URL** from the **Query string caching behavior** drop-down list.

Select **Save**.

![Select query string caching behavior](media/app-service-web-tutorial-content-delivery-network/portal-select-caching-behavior.png)

### Verify that query strings are no longer ignored

In a browser, navigate to the home page at the CDN endpoint, including the first query string you tried earlier. 

```
http://<endpointname>.azureedge.net/index.html?q=1
```

![V3 in title in CDN, query string 1](media/app-service-web-tutorial-content-delivery-network/v3-in-cdn-title-qs1.png)

Because each query string is now treated as a different resource, the CDN retrieves, caches, and returns the current contents of the origin web app, with "V3" in the heading. To ensure that this page is cached in the CDN, refresh the page. 

Open *index.html* and change "V3" to "V4", and then deploy the change. 

```bash
git commit -am "version 4"
git push azure master
```

In a browser, navigate to the CDN endpoint URL with the same query string you tried earlier and with a new one:

```
http://<endpointname>.azureedge.net/index.html?q=1
http://<endpointname>.azureedge.net/index.html?q=2
```

![V3 in title in CDN, query string 1](media/app-service-web-tutorial-content-delivery-network/v3-in-cdn-title-qs1.png)

![V4 in title in CDN, query string 2](media/app-service-web-tutorial-content-delivery-network/v4-in-cdn-title-qs2.png)

Each query string is treated differently:  q=1 was used before, so cached contents are returned (V3), while q=2 is new, so the latest web app contents are retrieved and returned (v4).

## Map a custom domain to a CDN endpoint

You'll map your custom domain to your CDN Endpoint by creating a CNAME record. A CNAME record is a DNS feature that maps a source domain to a destination domain. For example, you might map `cdn.contoso.com` or `static.contoso.com` to `contoso.azureedge.net`.

If you don't have a custom domain, consider following the [App Service domain tutorial](custom-dns-web-site-buydomains-web-app.md) to purchase a domain using the Azure portal. 

### Find the hostname to use with the CNAME

In the Azure portal **Endpoint** blade, make sure **Overview** is selected in the left navigation, and then select the **+ Custom Domain** button at the top of the blade.

![Select Add Custom Domain](media/app-service-web-tutorial-content-delivery-network/portal-select-add-domain.png)

In the **Add a custom domain** blade, you see the endpoint host name to use in creating a CNAME record. The host name is derived from your CDN endpoint URL: **&lt;EndpointName>.azureedge.net**. 

![Add Domain blade](media/app-service-web-tutorial-content-delivery-network/portal-add-domain.png)

### Configure the CNAME with your domain registrar

Navigate to your domain registrar's web site, and locate the section for creating DNS records. You might find this in a section such as **Domain Name**, **DNS**, or **Name Server Management**.

Find the section for managing CNAMEs. You may have to go to an advanced settings page and look for the words CNAME, Alias, or Subdomains.

Create a new CNAME record that maps your chosen subdomain (for example, **static** or **cdn**) to the **Endpoint host name** shown earlier in the portal. 

### Enter the custom domain in Azure

Return to the **Add a custom domain** blade, and enter your custom domain, including the subdomain, in the dialog box. For example, enter `cdn.contoso.com`.   
   
Azure verifies that the CNAME record exists for the domain name you have entered. If the CNAME is correct, your custom domain is validated.

It can take time for the CNAME record to propagate to name servers on the Internet. If your domain is not validated immediately, and you believe the CNAME record is correct, wait a few minutes and try again.

### Test the custom domain

In a browser, navigate to the *index.html* file using your custom domain (for example, `cdn.contoso.com/index.html`) to verify that it is showing CDN assets. You see the home page with the current H1 heading ("V4").

![V4 in title in CDN, custom domain](media/app-service-web-tutorial-content-delivery-network/v4-in-cdn-title-custom-domain.png)

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next Steps

For more information about Azure CDN, see the following resources:

* [What is Azure CDN](../best-practices-cdn.md?toc=%2fazure%2fcdn%2ftoc.json)
* [Purge an Azure CDN endpoint](../cdn/cdn-purge-endpoint.md)
* [Control Azure CDN caching behavior with query strings](../cdn/cdn-query-string.md)
* [Map Azure CDN content to a custom domain](../cdn/cdn-map-content-to-custom-domain.md)
* [Enable HTTPS on an Azure CDN custom domain](../cdn/cdn-custom-ssl.md)
* [Improve performance by compressing files in Azure CDN](../cdn/cdn-improve-performance.md)
* [Pre-load assets on an Azure CDN endpoint](../cdn/cdn-preload-endpoint.md)
