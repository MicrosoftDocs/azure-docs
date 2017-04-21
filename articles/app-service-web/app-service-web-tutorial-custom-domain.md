---
title: Map a custom DNS name to an Azure App Service app | Microsoft Docs 
description: Learn add a custom DNS domain name (vanity domain) to web app, mobile app backend, or API app in Azure App Service.
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
# Map a custom DNS name to an Azure App Service app

This tutorial shows you how to map a custom DNS name to your web app, mobile app backend, or API app in [Azure App Service](../app-service/app-service-value-prop-what-is.md). 

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

You can use either a [CNAME record](https://en.wikipedia.org/wiki/CNAME_record) or an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A) to map a custom DNS name to App Service.

> [!NOTE]
> We recommended that you map subdomains with CNAME records instead of A records. A CNAME mapping is not bound to your app's IP address and is not affected when that IP address changes. 
>
> However, do **not** create a CNAME record for your root domain (i.e. the "root record"). For more information, see [Why can't a CNAME record be used at the root domain](http://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain). To map a root domain to your Azure app, use an [A record](#a) instead.
> 
> 

This tutorial follows the example scenario of mapping two DNS names to an app in App Service:

- `contoso.com` - a root domain. You'll use an A record to map it to the app. 
- `www.contoso.com` - a subdomain of `contoso.com`. You'll use a CNAME record to map it to the app.

## Before you begin

Before going through this tutorial, make sure you have administrative access to the DNS configuration page for your domain provider (like GoDaddy). To add a mapping for `contoso.com` and `www.contoso.com`, you need to be able to configure DNS entries for the `contoso.com` domain.

> [!NOTE]
> If you don't have a custom DNS domain yet, you can always [buy a domain directly from Azure and map it to your app](custom-dns-web-site-buydomains-web-app.md).
>
>

## Step 1 - Prepare your app
To map a custom DNS name, your[App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be a paid tier (**Shared**, **Basic**, **Standard**, or **Premium**). In this step, you make sure that your App Service app is in the supported pricing tier.

### Sign in to Azure

Open the Azure portal. 

To do this, sign in to [https://portal.azure.com](https://portal.azure.com) with your Azure account.

### Navigate to your app
From the left menu, click **App Service**, then click the name of your app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/select-app.png)

You have landed in your app's _blade_ (a portal page that opens horizontally).  

### Check the pricing tier
In the **Overview** page, which opens by default, check to make sure that your app is not in the **Free** tier.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

Custom DNS is not supported in the **Free** tier. If you need to scale up, follow the next section. Otherwise, skip to [Step 2](#info).

### Scale up your App Service plan

To scale up your plan, click **Scale up (App Service plan)** in the left pane.

Select the tier you want to scale to. For example, select **Shared**. When ready, click **Select**.

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

When you see the notification below, the scale operation is complete.

![Scale operation confirmation](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

<a name="info"></a>

## Step 2 - Get hostname or IP address of your app

In this step, you obtain the default hostname or IP address of your app. A CNAME record maps to your app's default hostname, and an A record maps to your app's IP address.  

In the tutorial example, you want to create both a CNAME record (for the root domain `contoso.com`) and an A record (for the subdomain `www.contoso.com`), so you need to obtain both the hostname and the IP address.

### Open the custom domain UI

In the left-hand navigation of your web app, click **Custom domains**. 

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

### Copy the hostname or IP address

In the **Custom domains** page, copy the app's default hostname under **Hostnames assigned to site** and its **IP address**.

You'll need the default hostname later for the CNAME record mapping, or the IP address for the A record mapping. 

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

<a name="cname"></a>

## Step 3 - Create a CNAME record

In the tutorial example, you want to add a CNAME record for the `www` subdomain (`www.contoso.com`). 

### Access DNS records with domain provider

First, sign in to the website of your domain provider.

Find the page for managing DNS records. Every domain provider has its own DNS records interface, so you should consult your provider's documentation. Look for links or areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**. 

Often, you can find the link by viewing your account information, and then looking for a link such as **My domains**. Then look for a link that lets you manage DNS records. This link might be named **Zone file**, **DNS Records**, or **Advanced configuration**.

The following screenshot is an example of a DNS records page:

![Example DNS records page](./media/app-service-web-tutorial-custom-domain/example-record-ui.png)

In the example screenshot, you click **Add** to create a record. Some providers have different links to add different record types. Again, consult your provider's documentation.

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you click a separate **Save Changes** link. 
>
>

### Create the CNAME record

Add a CNAME record to map a subdomain to your app's default hostname.

For the `www.contoso.com` domain example, your CNAME record should point the name `www` to the hostname you copied from [Step 2](#info).

Your DNS records page show look like the following screenshot:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record.png)

<a name="add-cname"></a>

### Enable the CNAME record mapping in your app

You're now ready to add your configured DNS name to your app.

Back in your app's **Custom domains** page in the Azure portal (see [Step 2](#info)), you need to add the fully-qualified
custom DNS name (`www.contoso.com`) to the list.

Click the **+** icon next to **Add hostname**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name-cname.png)

Type the fully qualified domain name for which you configured the CNAME record earlier (e.g. `www.contoso.com`), then click **Validate**.

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Verification error](./media/app-service-web-tutorial-custom-domain/verification-error-cname.png)

Otherwise, the **Add hostname** button is activated. 

Make sure that **Hostname record type** is set to **CNAME record (example.com)**.

Click **Add hostname** to add the DNS name to your app.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name-cname.png)

It might take some time for the new hostname to be reflected in your app's **Custom domains** page. Try refreshing the browser to update the data.

![CNAME record added](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

<a name="a"></a>

## Step 4 - Create an A record

In the tutorial example, you want to add an A record for the root domain, `contoso.com`. 

### Access DNS records with domain provider

First, sign in to the website of your domain provider.

Find the page for managing DNS records. Every domain provider has its own DNS records interface, so you should consult your provider's documentation. Look for links or areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**. 

Often, you can find the link by viewing your account information, and then looking for a link such as **My domains**. Then look for a link that lets you manage DNS records. This link might be named **Zone file**, **DNS Records**, or **Advanced configuration**.

The following screenshot is an example of a DNS records page:

![Example DNS records page](./media/app-service-web-tutorial-custom-domain/example-record-ui.png)

In the example screenshot, you click **Add** to create a record. Some providers have different links to add different record types. Again, consult your provider's documentation.

> [!NOTE]
> For certain providers, such as GoDaddy, changes to DNS records don't become effective until you click a separate **Save Changes** link. 
>
>

### Create the A record

To map an A record to your app, App Service actually requires **two** DNS records:

- An **A** record to map to your app's IP address.
- A **TXT** record to map to your app's default hostname. This record lets App Service verify that you own the custom domain you want to map.

For the `www.contoso.com` domain example, create the A and TXT records according to the following table (`@` typically represents the root domain). 

| Record type | Host | Value |
| A | `@` | IP address from [Step 2](#info) |
| TXT | `@` | Default hostname from from [Step 2](#info) |

Your DNS records page should look like the following screenshot:

![DNS records page](./media/app-service-web-tutorial-custom-domain/a-record.png)

### Enable the A record mapping in your app

You are now ready to add your configured DNS name to your app.

Back in your app's **Custom domains** page in the Azure portal (see [Step 2](#info)), you need to add the fully-qualified
custom DNS name (`contoso.com`) to the list.

Click the **+** icon next to **Add hostname**.

![Add host name](./media/app-service-web-tutorial-custom-domain/add-host-name.png)

Type the fully qualified domain name for which you configured the A record earlier (for example, `contoso.com`), then click **Validate**.

If you missed a step or made a typo somewhere earlier, you see a verification error at the bottom of the page.

![Verification error](./media/app-service-web-tutorial-custom-domain/verification-error.png)

Otherwise, the **Add hostname** button is activated. 

Make sure that **Hostname record type** is set to **A record (example.com)**.

Click **Add hostname** to add the DNS name to your app.

![Add DNS name to the app](./media/app-service-web-tutorial-custom-domain/validate-domain-name.png)

It might take some time for the new hostname to be reflected in your app's **Custom domains** page. Try refreshing the browser to update the data.

![A record added](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

### Step 5 - Test in browser

In your browser, browse to the DNS name(s) that you configured earlier (`contoso.com` and `www.contoso.com`).

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

## Map wildcard domains

If desired, you can map a [wildcard DNS](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (e.g. `*.contoso.com`) to App Service.

It is recommended that you map a wildcard DNS using a CNAME record.

For example, to map `*.contoso.com`, follow the steps in [Step 3 - Create a CNAME record](#cname). 

When you create the CNAME record, configure it to map the name `*` to the default hostname from [Step 2](#info). 

## Scripted management 

You can manage custom domains at the command prompt, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azureps-cmdlets-docs/). 

### Azure CLI 

The following command adds a configured custom DNS name to an App Service app. 

```bash 
az appservice web config hostname add --webapp <app_name> --resource-group <resourece_group_name> \ 
--name <fully_qualified_domain_name> 
``` 

For more information, see [Map a custom domain to a web app](scripts/app-service-cli-configure-custom-domain.md) 

### Azure PowerShell 

The following command adds a configured custom DNS name to an App Service app. 

```PowerShell  
Set-AzureRmWebApp -Name <app_name> -ResourceGroupName <resourece_group_name> ` 
-HostNames @(<fully_qualified_domain_name>,"<app_name>.azurewebsites.net") 
```

For more information, see [Assign a custom domain to a web app](scripts/app-service-powershell-configure-custom-domain.md) 

## More resources

[Buy and Configure a custom domain name in Azure App Service](custom-dns-web-site-buydomains-web-app.md)
