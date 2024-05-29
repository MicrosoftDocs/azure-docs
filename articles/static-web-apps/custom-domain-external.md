---
title: Set up a custom domain with external providers in Azure Static Web Apps
description: Use an external provider to manage your custom domain in Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 05/29/2024
ms.author: cshoe
---

# Set up a custom domain in Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates automatically get created for the auto-generated domain name and any custom domains that you might add. This article shows how to configure your domain name with the `www` subdomain, using an external provider.

There are multiple methods of configuring a custom domain for use with Static Web Apps:

- If you are using an apex domain (a domain without a subdomain, also known as a root domain), then please follow the instructions for [configuring a custom apex domain on Static Web Apps](apex-domain-external.md).
- If you are using Azure DNS, then please see [configuring a custom domain with Azure DNS](custom-domain-azure-dns.md) or [configuring a custom apex domain with Azure DNS](apex-domain-azure-dns.md).

> [!NOTE]
> Static Web Apps doesn't support set-up of a custom domain with a private DNS server, hosted on-premises. Consider using an [Azure Private DNS zone](../dns/private-dns-privatednszone.md).

## Prerequisites

- You must be able to create a **CNAME** record on your DNS domain using the tools that your DNS service or domain registrar provides.

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

1. In the *Validate + add* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step (with the `www` subdomain). |
    | Hostname record type | Select **CNAME**. |

1. Select **Add**.

   Azure validates that the CNAME record has been created.  This is dependent on the time to live (TTL) for your domain and make take several days.  If 
   the validation fails, return to add the custom domain later.

1. When the update completes, open a new browser tab and go to your domain with the `www` subdomain.

    You should see your static web app in the browser. Inspect the location to verify that your site is served securely using `https`.
