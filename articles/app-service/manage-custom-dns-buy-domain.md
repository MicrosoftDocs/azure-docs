---
title: Buy custom domain name in Azure - App Service 
description: Learn how to buy a custom domain name with a web app in Azure App Service.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.assetid: 70fb0e6e-8727-4cca-ba82-98a4d21586ff
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/24/2017
ms.author: cephalin
ms.custom: seodec18

---
# Buy a custom domain name for Azure App Service

App Service domains are top-level domains that are managed directly in Azure. They make it easy to manage custom domains for [Azure App Service](overview.md). This tutorial shows you how to buy an App Service domain and assign DNS names to Azure App Service.

For Azure VM or Azure Storage, see [Assign App Service domain to Azure VM or Azure Storage](https://blogs.msdn.microsoft.com/appserviceteam/2017/07/31/assign-app-service-domain-to-azure-vm-or-azure-storage/). For Cloud Services, see 
[Configuring a custom domain name for an Azure cloud service](../cloud-services/cloud-services-custom-domain-name-portal.md).

## Prerequisites

To complete this tutorial:

* [Create an App Service app](/azure/app-service/), or use an app that you created for another tutorial.
* [Remove the spending limit on your subscription](../billing/billing-spending-limit.md#remove). You cannot buy App Service domains with free subscription credits.

## Prepare the app

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

To use custom domains in Azure App Service, your app's [App Service plan](https://azure.microsoft.com/pricing/details/app-service/) must be a paid tier (**Shared**, **Basic**, **Standard**, or **Premium**). In this step, you make sure that the app is in the supported pricing tier.

### Sign in to Azure

Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

### Navigate to the app in the Azure portal

From the left menu, select **App Services**, and then select the name of the app.

![Portal navigation to Azure app](./media/app-service-web-tutorial-custom-domain/select-app.png)

You see the management page of the App Service app.  

### Check the pricing tier

In the left navigation of the app page, scroll to the **Settings** section and select **Scale up (App Service plan)**.

![Scale-up menu](./media/app-service-web-tutorial-custom-domain/scale-up-menu.png)

The app's current tier is highlighted by a blue border. Check to make sure that the app is not in the **F1** tier. Custom DNS is not supported in the **F1** tier. 

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/check-pricing-tier.png)

If the App Service plan is not in the **F1** tier, close the **Scale up** page and skip to [Buy the domain](#buy-the-domain).

### Scale up the App Service plan

Select any of the non-free tiers (**D1**, **B1**, **B2**, **B3**, or any tier in the **Production** category). For additional options, click **See additional options**.

Click **Apply**.

![Check pricing tier](./media/app-service-web-tutorial-custom-domain/choose-pricing-tier.png)

When you see the following notification, the scale operation is complete.

![Scale operation confirmation](./media/app-service-web-tutorial-custom-domain/scale-notification.png)

## Buy the domain

### Pricing Information
For pricing information on Azure App Service Domains, visit the [App Service Pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/) and scroll down to App Service Domain.

### Sign in to Azure
Open the [Azure portal](https://portal.azure.com/) and sign in with your Azure account.

### Launch Buy domains
In the **App Services** tab, click the name of your app, select **Settings**, and then select **Custom domains**
   
![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-6.png)

In the **Custom domains** page, click **Buy Domain**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-1.png)

> [!NOTE]
> If you cannot see the **App Service Domains** section, you need to remove the spending limit on your Azure account (see [Prerequisites](#prerequisites)).
>
>

### Configure the domain purchase

In the **App Service Domain** page, in the **Search for domain** box, type the domain name you want to buy and type `Enter`. The suggested available domains are shown just below the text box. Select one or more domains you want to buy.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-2.png)

> [!NOTE]
> The following [top-level domains](https://wikipedia.org/wiki/Top-level_domain) are supported by App Service domains: _com_, _net_, _co.uk_, _org_, _nl_, _in_, _biz_, _org.uk_, and _co.in_.
>
>

Click the **Contact Information** and fill out the domain's contact information form. When finished, click **OK** to return to the App Service Domain page.

It is important that you fill out all required fields with as much accuracy as possible. Incorrect data for contact information can result in failure to purchase domains.

Next, select the desired options for your domain. See the following table for explanations:

| Setting | Suggested Value | Description |
|-|-|-|
|Privacy protection | Enable | Opt in to "Privacy protection", which is included in the purchase price _for free_. Some top-level domains are managed by registrars that do not support privacy protection, and they are listed on the **Privacy protection** page. |
| Assign default hostnames | **www** and **\@** | Select the desired hostname bindings, if desired. When the domain purchase operation is complete, your app can be accessed at the selected hostnames. If the app is behind [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/), you don't see the option to assign the root domain (@), because Traffic Manager does not support A records. You can make changes to the hostname assignments after the domain purchase completes. |

### Accept terms and purchase

Click **Legal Terms** to review the terms and the charges, then click **Buy**.

> [!NOTE]
> App Service Domains use GoDaddy for domain registration and Azure DNS to host the domains. In addition to the domain registration fee, usage charges for Azure DNS apply. For information, see [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).
>
>

Back in the **App Service Domain** page, click **OK**. While the operation is in progress, you see the following notifications:

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-validate.png)

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-purchase-success.png)

### Test the hostnames

If you have assigned default hostnames to your app, you also see a success notification for each selected hostname.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-bind-success.png)

You also see the selected hostnames in the **Custom domains** page, in the **Custom Hostnames** section.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-hostnames-added.png)

> [!NOTE]
> A **Not Secure** label for your custom domain means that it's not yet bound to an SSL certificate, and any HTTPS request from a browser to your custom domain will receive an error or warning, depending on the browser. To configure SSL binding, see [Buy and configure an SSL certificate for Azure App Service](web-sites-purchase-ssl-web-site.md).
>

To test the hostnames, navigate to the listed hostnames in the browser. In the example in the preceding screenshot, try navigating to _kontoso.net_ and _www\.kontoso.net_.

## Assign hostnames to app

If you choose not to assign one or more default hostnames to your app during the purchase process, or if you need to assign a hostname not listed, you can assign a hostname anytime.

You can also assign hostnames in the App Service Domain to any other app. The steps depend on whether the App Service Domain and the app belong to the same subscription.

- Different subscription: Map custom DNS records from the App Service Domain to the app like an externally purchased domain. For information on adding custom DNS names to an App Service Domain, see [Manage custom DNS records](#custom). To map an external purchased domain to an app, see [Map an existing custom DNS name to Azure App Service](app-service-web-tutorial-custom-domain.md). 
- Same subscription: Use the following steps.

### Launch add hostname
In the **App Services** page, select the name of your app that you want to assign hostnames to, select **Settings**, and then select **Custom domains**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-6.png)

Make sure that your purchased domain is listed in the **App Service Domains** section, but don't select it. 

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-select-domain.png)

> [!NOTE]
> All App Service Domains in the same subscription are shown in the app's **Custom domains** page. If your domain is in the app's subscription, but you cannot see it in the app's **Custom domains** page, try reopening the **Custom domains** page or refresh the webpage. Also, check the notification bell at the top of the Azure portal for progress or creation failures.
>
>

Select **Add hostname**.

### Configure hostname
In the **Add hostname** dialog, type the fully qualified domain name of your App Service Domain or any subdomain. For example:

- kontoso.net
- www\.kontoso.net
- abc.kontoso.net

When finished, select **Validate**. The hostname record type is automatically selected for you.

Select **Add hostname**.

When the operation is complete, you see a success notification for the assigned hostname.  

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-bind-success.png)

### Close add hostname
In the **Add hostname** page, assign any other hostname to your app, as desired. When finished, close the **Add hostname** page.

You should now see the newly assigned hostname(s) in your app's **Custom domains** page.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-hostnames-added2.png)

### Test the hostnames

Navigate to the listed hostnames in the browser. In the example in the preceding screenshot, try navigating to _abc.kontoso.net_.

## Renew the domain

The App Service domain you bought is valid for one year from the time of purchase. By default, the domain is configured to renew automatically by charging your payment method for the next year. You can manually renew your domain name.

If you want to turn off automatic renewal, or if you want to manually renew your domain, follow the steps here.

In the **App Services** tab, click the name of your app, select **Settings**, and then select **Custom domains**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-6.png)

In the **App Service Domains** section, select the domain you want to configure.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-select-domain.png)

From the left navigation of the domain, select **Domain renewal**. To stop renewing your domain automatically, select **Off**, and then **Save**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-autorenew.png)

To manually renew your domain, select **Renew domain**. However, this button is not active until [90 days before the domain's expiration](#when-domain-expires).

If your domain renewal is successful, you receive an email notification within 24 hours.

## When domain expires

Azure deals with expiring or expired App Service domains as follows:

* If automatic renewal is disabled: 90 days before domain expiration, a renewal notification email is sent to you and the **Renew domain** button is activated in the portal.
* If automatic renewal is enabled: On the day after your domain expiration date, Azure attempts to bill you for the domain name renewal.
* If an error occurs during automatic renewal (for example, your card on file is expired), or if automatic renewal is disabled and you allow the domain to expire, Azure notifies you of the domain expiration and parks your domain name. You can [manually renew](#renew-the-domain) your domain.
* On the 4th and 12th days day after expiration, Azure sends you additional notification emails. You can [manually renew](#renew-the-domain) your domain.
* On the 19th day after expiration, your domain remains on hold but becomes subject to a redemption fee. You can call customer support to renew your domain name, subject to any applicable renewal and redemption fees.
* On the 25th day after expiration, Azure puts your domain up for auction with a domain name industry auction service. You can call customer support to renew your domain name, subject to any applicable renewal and redemption fees.
* On the 30th day after expiration, you're no longer able to redeem your domain.

<a name="custom"></a>

## Manage custom DNS records

In Azure, DNS records for an App Service Domain are managed using [Azure DNS](https://azure.microsoft.com/services/dns/). You can add, remove, and update DNS records, just like for an externally purchased domain.

### Open App Service Domain

In the Azure portal, from the left menu, select **All services** > **App Service Domains**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-access.png)

Select the domain to manage. 

### Access DNS zone

In the domain's left menu, select **DNS zone**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-dns-zone.png)

This action opens the [DNS zone](../dns/dns-zones-records.md) page of your App Service Domain in Azure DNS. For information on how to edit DNS records, see [How to manage DNS Zones in the Azure portal](../dns/dns-operations-dnszones-portal.md).

## Cancel purchase (delete domain)

After you purchase the App Service Domain, you have five days to cancel your purchase for a full refund. After five days, you can delete the App Service Domain, but cannot receive a refund.

### Open App Service Domain

In the Azure portal, from the left menu, select **All services** > **App Service Domains**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-access.png)

Select the domain to you want to cancel or delete. 

### Delete hostname bindings

In the domain's left menu, select **Hostname bindings**. The hostname bindings from all Azure services are listed here.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-hostname-bindings.png)

You cannot delete the App Service Domain until all hostname bindings are deleted.

Delete each hostname binding by selecting **...** > **Delete**. After all the bindings are deleted, select **Save**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-delete-hostname-bindings.png)

### Cancel or delete

In the domain's left menu, select **Overview**. 

If the cancellation period on the purchased domain has not elapsed, select **Cancel purchase**. Otherwise, you see a **Delete** button instead. To delete the domain without a refund, select **Delete**.

![](./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-cancel.png)

To confirm the operation, select **Yes**.

After the operation is complete, the domain is released from your subscription and available for anyone to purchase again. 

## Direct default URL to a custom directory

By default, App Service directs web requests to the root directory of your app code. To direct them to a subdirectory, such as `public`, see [Direct default URL to a custom directory](app-service-web-tutorial-custom-domain.md#virtualdir).
