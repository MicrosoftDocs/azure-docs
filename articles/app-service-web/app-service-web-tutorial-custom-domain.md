---
title: Map a existing domain name to an Azure App Service app | Microsoft Docs 
description: Learn add a existing domain name to web apps, mobile apps, or API apps in Azure App Service.
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
# Map an existing Domain name to an Azure App Service app

This tutorial shows you how to map an existing Domain (DNS) name to your web apps, mobile apps, or API apps in [Azure App Service](../app-service/app-service-value-prop-what-is.md).

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

In this tutorial, we outline three common domain mapping scenarios for Azure App Service:

- Alias an App Service app to a custom domain using a [`CNAME` record](#cname-record)
- Map an App Service app IP address to an [`A` record](#a-record)
- Map an App Service app to a [wildcard domain](#wildcard)

## Before you begin

To complete this tutorial, you need access to your DNS registry for your domain provider, for example GoDaddy, and the permissions to edit the configuration for your domain.

For example, to add DNS entries for `contoso.com` and `www.contoso.com`, you must have access to configure the DNS for the `contoso.com` domain.

> [!TIP]
> If you don't have an existing domain name, consider following the [App Service domain tutorial](custom-dns-web-site-buydomains-web-app.md) to purchase a domain using the Azure portal.
>

## Sign in to Azure

Open your favorite web browser, and navigate to the [Azure portal](https://portal.azure.com).

### Navigate to your app

From the left menu, click **App Service**, then click the name of your app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/select-app.png)

Clicking on the name of your app, opens the Web App blade for your App Service.

## Prepare your app

To map a custom DNS name, the [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) for your app must be set to the **Shared**, **Basic**, **Standard**, or **Premium** tier.

Mapping a Domain name is not supported in the **FREE** tier.

To complete the steps of this tutorial, we need to check the pricing tier of your Web App.

### Check the pricing tier

In the left-hand navigation of the Web App blade, scroll to the **Settings** section, and select **Scale up (App Service plan)**.

The **Choose your pricing tier** blade opens and your selected plan is outlined in blue.

If the selected plan is the **FREE**, proceed to Scale up your App Service Plan. Otherwise, you can close the **Choose your pricing tier** blade.

### Scale up your App Service plan

Select the **Shared**, or one of the **Basic**, **Standard**, or **Premium** tiers.

For example, select **Shared**, then click **Select**.

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

When you see the notification below, the scale operation is complete.

![Scale operation confirmation](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

## Create a CNAME record

In this section, we describe how to add a CNAME record for the `www` subdomain (`www.contoso.com`).

[!INCLUDE [app-service-web-access-dns-records](../../includes/app-service-web-access-dns-records.md)]

### Copy the App Service hostname

In the left-hand navigation of the web app blade, click **Custom domains**.

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

Copy the default hostname under the **Hostnames assigned to site**

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

### Create the CNAME record

Open the browser window that contains your DNS configuration for your domain provider.

Add a `CNAME` record to map a subdomain to your app's default hostname.

For the `www.contoso.com` domain example, your CNAME record should point the name `www` to the default hostname.

Your DNS records page show look like the following screenshot:

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/cname-record.png)

### Enable the CNAME record mapping in your app

[!INCLUDE [app-service-web-enable-hostname](../../includes/app-service-web-enable-hostname.md)]

![CNAME record added](./media/app-service-web-tutorial-custom-domain/cname-record-added.png)

[!INCLUDE [app-service-web-hostname-validation-error](../../includes/app-service-web-hostname-validation-error.md)]

## Create an A record

In the tutorial example, you want to add an A record for the root domain, `contoso.com`.

[!INCLUDE [app-service-web-access-dns-records](../../includes/app-service-web-access-dns-records.md)]

### Copy the App Service IP Address

In the left-hand navigation of the web app blade, click **Custom domains**.

![Custom domain menu](./media/app-service-web-tutorial-custom-domain/custom-domain-menu.png)

Copy the **IP address** from under the **External IP Address** header.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/mapping-information.png)

### Create the A record

To map an A record to your app, App Service actually requires **two** DNS records:

- An **A** record to map to your app's IP address.
- A **TXT** record to map to your app's default hostname. This record lets App Service verify that you own the custom domain you want to map.

For the `www.contoso.com` domain example, create the A and TXT records according to the following table (`@` typically represents the root domain).

| Record type | Host | Value |
| A | `@` | IP address |
| TXT | `@` | Default hostname |

Your DNS records page should look like the following screenshot:

![DNS records page](./media/app-service-web-tutorial-custom-domain/a-record.png)

### Enable the A record mapping in your app

[!INCLUDE [app-service-web-enable-hostname](../../includes/app-service-web-enable-hostname.md)]

![A record added](./media/app-service-web-tutorial-custom-domain/a-record-added.png)

[!INCLUDE [app-service-web-hostname-validation-error](../../includes/app-service-web-hostname-validation-error.md)]

## Map wildcard domains

You can also map a [wildcard DNS](https://en.wikipedia.org/wiki/Wildcard_DNS_record) (for example `*.contoso.com`) to your App Service.

It is recommended that you map a wildcard DNS using a CNAME record.

For example, to map `*.contoso.com`, follow the steps in [Step 3 - Create a CNAME record](#cname).

When you create the CNAME record, configure it to map the name `*` to the default hostname.

## Test in browser

In your browser, browse to the DNS one or more DNS names that you configured earlier (`contoso.com` and `www.contoso.com`).

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/app-with-custom-dns.png)

## Management

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