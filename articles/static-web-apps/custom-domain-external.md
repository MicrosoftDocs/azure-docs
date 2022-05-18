---
title: Set up a custom domain with external providers in Azure Static Web Apps
description: Use an external provider to manage your custom domain in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/10/2022
ms.author: cshoe
---

# Set up a custom domain in Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates are automatically created for the auto-generated domain name and any custom domains you may add.

## Preparation

Before you begin, consider how you want to support your apex domain. Domain names without a subdomain are known as apex, root domains. For example, the domain `www.example.com` is the `www` subdomain joined with the `example.com` apex domain.

Setting up an apex domain is a common scenario to configure once your domain name is set up. Creating an apex domain is achieved by configuring an `ALIAS` or `ANAME` record or through `CNAME` flattening. Some domain registrars like GoDaddy and Google don't support these DNS records. If your domain registrar doesn't support the all the DNS records you need, consider using [Azure DNS to configure your domain](custom-domain-azure-dns.md).

> [!NOTE]
> If your domain registrar doesn't support specialized DNS records and you don't want to use Azure DNS, you can forward your apex domain to the `www` subdomain. Refer to [Set up an apex domain in Azure Static Web Apps](apex-domain-external.md) for details.

This guide demonstrates how to configure your domain name with the `www` subdomain.

## Walkthrough video

> [!VIDEO https://docs.microsoft.com/Shows/5-Things/Configuring-a-custom-domain-with-Azure-Static-Web-Apps/player?format=ny]

## Get static web app URL

1. Navigate to the [Azure portal](https://portal.azure.com).

1. Navigate to your static web app.

1. From the *Overview* window, copy the generated **URL** of your site and set it aside in a text editor for future use.

## Create a CNAME record on your domain registrar account

Domain registrars are the services that allow you to purchase and manage domain names. Common providers include GoDaddy, Namecheap, Google, Tucows, and the like.

1. Open a new browser tab and sign in to your domain registrar account.

1. Navigate to your domain name's DNS configuration settings.

1. Add a new `CNAME` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `CNAME` |
    | Host | Your subdomain, such as **www** |
    | Value | Paste the domain name you set aside in the text editor. |
    | TTL (if applicable) | Leave as default value. |

## Create a CNAME record in Azure Static Web Apps

1. Return to your static web app in the Azure portal.

1. Under *Settings*, select **Custom domains**.

1. Select the **+ Add** button.

1. In the *Enter domain* tab, enter your domain name prefixed with **www**.

    For instance, if your domain name is `example.com`, enter `www.example.com` into this box.

1. Select the **Next** button.

1. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step (with the `www` subdomain). |
    | Hostname record type | Select **CNAME**. |

1. Select the **Add** button.

   Your `CNAME` record is being created and the DNS settings are being updated. Since DNS settings need to propagate, this process can take up to an hour or longer to complete.

1. Once the domain settings are in effect, open a new browser tab and navigate to your domain with the `www` subdomain.

    After the DNS records are updated, you should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Set up the apex domain](apex-domain-external.md)
