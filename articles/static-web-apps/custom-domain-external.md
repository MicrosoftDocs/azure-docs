---
title: Set up a custom domain with external providers in Azure Static Web Apps
description: Use an external provider to manage your custom domain in Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 10/13/2022
ms.author: cshoe
---

# Set up a custom domain in Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates automatically get created for the auto-generated domain name and any custom domains that you might add. This article shows how to configure your domain name with the `www` subdomain, using an external provider.

> [!NOTE]
> Static Web Apps doesn't support set-up of a custom domain with a private DNS server, hosted on-premises. Consider using an [Azure Private DNS zone](../dns/private-dns-privatednszone.md). 
## Prerequisites

- Consider how you want to support your apex domain. Domain names without a subdomain are known as apex root domains. For example, the domain `www.example.com` is the `www` subdomain joined with the `example.com` apex domain.

- You create an apex domain by configuring an `ALIAS` or `ANAME` record or flattening `CNAME`. Some domain registrars, like GoDaddy and Google, don't support these DNS records. If your domain registrar doesn't support all the DNS records you need, consider using [Azure DNS to configure your domain](custom-domain-azure-dns.md).

> [!NOTE]
> If your domain registrar doesn't support specialized DNS records and you don't want to use Azure DNS, you can forward your apex domain to the `www` subdomain. For more information, see [Set up an apex domain in Azure Static Web Apps](apex-domain-external.md).

## Watch the video

> [!VIDEO https://learn.microsoft.com/Shows/5-Things/Configuring-a-custom-domain-with-Azure-Static-Web-Apps/player?format=ny]

## Get your static web app URL

1. Go to the [Azure portal](https://portal.azure.com).

1. Go to your static web app.

1. From the *Overview* window, copy the generated **URL** of your site and set it aside in a text editor for future use.

## Create a CNAME record on your domain registrar account

Domain registrars are the services you can use to purchase and manage domain names. Common providers include GoDaddy, Namecheap, Google, Tucows, and the like.

1. Open a new browser tab and sign in to your domain registrar account.

1. Go to your domain name's DNS configuration settings.

1. Add a new `CNAME` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `CNAME` |
    | Host | Your subdomain, such as **www** |
    | Value | Paste the domain name you set aside in the text editor. |
    | TTL (if applicable) | Leave as default value. |

## Create a CNAME record in Azure Static Web Apps

1. Return to your static web app in the Azure portal.

1. Under *Settings*, select **Custom domains** > **+ Add**. Select **Custom domain on other DNS**.

1. Select **+ Add**.

1. In the *Enter domain* tab, enter your domain name prefixed with **www**, and then select **Next**.

    For instance, if your domain name is `example.com`, enter `www.example.com`.
    :::image type="content" source="media/custom-domain/add-domain.png" alt-text="Screenshot showing sequence of steps in add custom domain form.":::

1. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step (with the `www` subdomain). |
    | Hostname record type | Select **CNAME**. |

1. Select **Add**.

   Azure creates your `CNAME` record and updates the DNS settings. Since DNS settings need to propagate, this process can take up to an hour or longer to complete.

1. When the update completes, open a new browser tab and go to your domain with the `www` subdomain.

    You should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Set up the apex domain](apex-domain-external.md)
