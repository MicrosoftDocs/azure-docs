---
title: Map a custom DNS name to an Azure web app | Microsoft Docs 
description: Learn add a custom DNS domain name (i.e. vanity domain) to web app, mobile app backend, or API app in Azure App Service.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: dc446e0e-0958-48ea-8d99-441d2b947a7c
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 03/29/2017
ms.author: cephalin

---
# Map a custom DNS name to an Azure web app

This tutorial shows you how to map a custom DNS name to your web app, mobile app backend, or API app in [Azure App Service](../app-service/app-service-value-prop-what-is.md). 

You can use either a [CNAME record](https://en.wikipedia.org/wiki/CNAME_record) or an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A) to map a custom DNS name to App Service.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

This tutorial follows the example scenario of mapping two DNS names to an app in App Service:

- `contoso.com` - a root domain. You'll use an A record to map it to App Service. 
- `www.contoso.com` - a subdomain of `contoso.com`. You'll use a CNAME record to map it to App Service.

The tutorial also shows you how to map a [wildcard DNS](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (e.g. `*.contoso.com`) to App Service.

> [!NOTE]
> It is recommended that you map subdomains and wildcard domains with CNAME records instead of A records. If you delete and recreate your app, or change from a dedicated hosting tier back to the **Shared** tier, your app's virtual IP address may change. A CNAME mapping is valid through such a change, whereas an A mapping is potentially invalidated by a new IP address. 
>
> However, do _not_ create a CNAME record for your root domain (i.e. the "root record"). For more information, see [Why can't a CNAME record be used at the root domain](http://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain). To map a root domain to your Azure app, use an [A record](#a) instead.
> 
> 

## Before you begin

Before going through this tutorial, make sure you have administrative access to the DNS configuration page for your respective domain provider (e.g. GoDaddy). For example, to add a mapping for `contoso.com` and `www.contoso.com`, you need to be able to configure DNS entries for the `contoso.com` domain.

> [!NOTE]
> If you don't have a custom DNS domain yet, you can always just [buy a domain directly from Azure and map it to your app](custom-dns-web-site-buydomains-web-app.md).
>
>

## Step 1 - Prepare your app
To map a custom DNS name, your[App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be a paid tier (**Shared**, **Basic**, **Standard**, or **Premium**). In this step, you make sure that your Azure app is in the supported pricing tier.

### Sign in to Azure

Open the Azure portal. 

To do this, sign in to [https://portal.azure.com](https://portal.azure.com) with your Azure account.

### Navigate to your app
From the left menu, click **App Service**, then click the name of your Azure app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/select-app.png)

You have landed in your app's _blade_ (a portal page that opens horizontally).  

### Check the pricing tier
In the **Overview** page, which opens by default, check to make sure that your app is not in the **Free** tier.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

Custom DNS is not supported in the **Free** tier. If you need to scale up, follow the next section. Otherwise, skip to [Step 2](#info).

### Scale up your App Service plan

To scale up your plan, click **Scale up (App Service plan)** in the left pane.

Select the tier you want to scale to. For example, select **Shared**. When ready, click **Select**.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

When you see the notification below, the scale operation is complete.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

<a name="info"></a>

## Step 2 - Get hostname or IP address of your app

In this step, you obtain the default hostname or IP address of your app. A CNAME record maps to your app's default hostname, and an A record maps to your app's IP address.  

In the tutorial example, you want to create both a CNAME record (for the root domain `contoso.com`) and an A record (for the subdomain `www.contoso.com`), so you need to obtain both the hostname and the IP address.

### Open the custom domain UI

In your app's blade, click **Custom domains** in the menu. 

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

### Copy the hostname or IP address

In th **Custom domains** page, copy the app's default hostname under **Hostnames assigned to site** and its **IP address**.

You'll need the default hostname later for the CNAME record mapping, or the IP address for the A record mapping. 

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

<a name="cname"></a>

## Step 3 - Create a CNAME record

You can map a custom DNS name to App Service with either a CNAME record or an A record.

In the tutorial example, you want to add a CNAME record for the `www` subdomain (i.e. `www.contoso.com`). 

> [!NOTE]
> It is recommended that you map subdomains and wildcard domains with CNAME records instead of A records. If you delete and recreate your app, or change from a dedicated hosting tier back to the **Shared** tier, your app's virtual IP address may change. A CNAME mapping is valid through such a change, whereas an A mapping is potentially invalidated by a new IP address. 
>
> However, do _not_ create a CNAME record for your root domain (i.e. the "root record"). For more information, see [Why can't a CNAME record be used at the root domain](http://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain). To map a root domain to your Azure app, use an [A record](#a) instead.
> 
> 

### Access DNS records with domain provider

First, sign in to the website of your domain provider.

Then, you need to find the page for managing DNS records. Every domain provider has its own DNS records interface, so you should consult your provider's documentation. In general, you should look for links or areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**. Often, you can find the link by viewing your account information, and then looking for a link such as **My domains**. 

Then, look for a link that lets you manage DNS records. This link might be named **Zone file**, **DNS Records**, or **Advanced configuration**.

The following screenshot is an example of what your DNS records page may look like:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/example-record-ui.png)

In the example screenshot, you click **Add** to create a record. Some providers have different links to add different record types. Again, consult your provider's documentation.

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you click a separate **Save Changes** link after you create them. 
>
>

### Create the CNAME record

The following table shows you how you would configure a CNAME record mapping for the supported domain types.

<table cellspacing="0" border="1">
  <tr>
    <th>Domain type</th>
    <th>CNAME Host</th>
    <th>CNAME Value</th>
  </tr>
  <tr>
    <td>Subdomain<br>(e.g. <code>www.contoso.com</code>)</td>
    <td>www</td>
    <td>Default hostname from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td>Wildcard domain<br>(e.g. <code>*.contoso.com</code>)</td>
    <td>\*</td>
    <td>Default hostname from <a href="#info">Step 2</a></td>
  </tr>
</table>

For the `www.contoso.com` domain example, your DNS records page show look like the following screenshot:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record.png)

<a name="a"></a>

## Step 4 - Create an A record

You can map a custom DNS name to App Service with either a CNAME record or an A record.

In the tutorial example, you want to add an A record for the root domain, `contoso.com`. 

> [!NOTE]
> The A record should be used to map a root domain (i.e. the "root record"). For more information, see [Why can't a CNAME record be used at the root domain](http://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain).
>
> For subdomains and wildcard domains, it is recommended that you map with CNAME records instead. If you delete and recreate your app, or change from a dedicated hosting tier back to the **Shared** tier, your app's virtual IP address may change. A CNAME mapping is valid through such a change, whereas an A mapping is potentially invalidated by a new IP address. To create a CNAME mapping instead, see [Create a CNAME record](#cname).
> 
> 

### Access DNS records with domain provider

First, sign in to the website of your domain provider.

Then, you need to find the page for managing DNS records. Every domain provider has its own DNS records interface, so you should consult your provider's documentation. In general, you should look for links or areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**. Often, you can find the link by viewing your account information, and then looking for a link such as **My domains**. 

Then, look for a link that lets you manage DNS records. This link might be named **Zone file**, **DNS Records**, or **Advanced configuration**.

The following screenshot is an example of what your DNS records page may look like:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/example-record-ui.png)

In the example screenshot, you click **Add** to create a record. Some providers have different links to add different record types. Again, consult your provider's documentation.

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you click a separate **Save Changes** link after you create them. 
>
>

### Create the A record

To map an A record to your app, App Service actually requires _two_ DNS records:

- An **A** record to map to your app's IP address.
- A **TXT** record to map to your app's default hostname. This record lets App Service verify that you own the custom domain you want to map.

The following table shows you how you would configure an A record mapping for the supported domain types (`@` typically represents the root domain). 

<table cellspacing="0" border="1">
  <tr>
    <th>Domain type</th>
    <th>Record type</th>
    <th>Host</th>
    <th>Value</th>
  </tr>
  <tr>
    <td rowspan="2" align="left">Root domain<br>(e.g. <code>contoso.com</code>)</td>
    <td>A</td>
    <td>@</td>
    <td>IP address from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td>TXT</td>
    <td>@</td>
    <td>Default hostname from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td rowspan="2" align="left">Subdomain<br>(e.g. <code>www.contoso.com</code>)</td>
    <td>A</td>
    <td>www</td>
    <td>IP address from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td>TXT</td>
    <td>www</td>
    <td>Default hostname from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td rowspan="2" align="left">Wildcard domain<br>(e.g. <code>*.contoso.com</code>)</td>
    <td>A</td>
    <td>\*</td>
    <td>IP address from <a href="#info">Step 2</a></td>
  </tr>
  <tr>
    <td>TXT</td>
    <td>\*</td>
    <td>Default hostname from <a href="#info">Step 2</a></td>
  </tr>
</table>

For the `contoso.com` domain example, your DNS records page show look like the following screenshot:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/a-record.png)

<a name="enable"></a>

## Step 5 - Enable the custom DNS in your app

You are now ready to add your configured DNS names (e.g. `contoso.com` and `www.contoso.com`) to your app.

Back in your app's **Custom domains** page in the Azure portal (see [Step 2](#info)), you need to add the fully-qualified
domain name of your custom domain to the list.

### Add the A hostname to your app

Click the **+** icon next to **Add hostname**.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/add-host-name.png)

Type the fully qualified domain name for which you configured the A record earlier (e.g. `contoso.com`), then click **Validate**.

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/verification-error.png)

Otherwise, the **Add hostname** button is activated. 

Make sure that **Hostname record type** is set to **A record (example.com)**.

Click **Add hostname** to add the DNS name to your app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/validate-domain-name.png)

It might take some time for the new hostname to be reflected in your app's **Custom domains** page. Try refreshing the browser to update the data.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

<a name="add-cname"></a>
### Add the CNAME hostname to your app

Click the **+** icon next to **Add hostname**.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

Type the fully qualified domain name for which you configured the CNAME record earlier (e.g. `www.contoso.com`), then click **Validate**.

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/verification-error-cname.png)

Otherwise, the **Add hostname** button is activated. 

Make sure that **Hostname record type** is set to **A record (example.com)**.

Click **Add hostname** to add the DNS name to your app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

It might take some time for the new hostname to be reflected in your app's **Custom domains** page. Try refreshing the browser to update the data.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

### Step 5 - Test in browser

In your browser, browse to the DNS name(s) that you configured earlier (`contoso.com` and `www.contoso.com`).

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

## More resources

[Buy and Configure a custom domain name in Azure App Service](custom-dns-web-site-buydomains-web-app.md)
