---
title: Setup a custom domain in Azure Static Web Apps
description: Learn to map a custom domain to Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 05/08/2020
ms.author: buhollan
---

# Setup a custom domain in Azure Static Web Apps Preview

By default, Azure Static Web Apps provides an auto-generated domain name. This article shows you how to map a custom domain name to an Azure Static Web Apps application.

## Prerequisites

- A purchased domain name
- Access to the DNS configuration properties for your domain

When configuring domain names, "A" Records are used to map root domains (for instance, `example.com`) to an IP address. Root domains must be mapped directly to an IP address, because the DNS specification does not allow mapping of one domain to another.

## DNS configuration options

There are a few different types of DNS configurations available for an application.

| If you want to                            | Then                                                |
| ----------------------------------------- | --------------------------------------------------- |
| Support `www.example.com`                 | [Map a CNAME record](#map-a-cname-record)           |
| Support `example.com`                     | [Configure a root domain](#configure-a-root-domain) |
| Point all subdomains to `www.example.com` | [Map a wildcard](#map-a-wildcard-domain)                   |

## Map a CNAME record

A CNAME record maps one domain to another. You can use a CNAME record to map `www.example.com` to the auto-generated domain that is provided by Azure Static Web Apps.

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Click on **Custom domains** in the menu.

1. In the _Custom domains_ window, copy the URL in the **Value** field.

### Configure DNS provider

1. Sign in to the website of your domain provider.

2. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

3. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

    The following screenshot is an example of a DNS records page:

    :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

4. Create a new **CNAME** record with the following values...

    | Setting             | Value                     |
    | ------------------- | ------------------------- |
    | Type                | CNAME                     |
    | Host                | www                       |
    | Value               | Paste from your clipboard |
    | TTL (if applicable) | Leave as default value    |

5. Save the changes with your DNS provider.

### Validate CNAME

1. Return to the _Custom domains_ window in the Azure portal.

1. Enter your domain, including the `www` portion in the _Validate custom domain_ section.

1. Click the **Validate** button.

Now that the custom domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain including the `www`, select CNAME from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns the auto-generated URL of your Static Web App (for instance, _random-name-123456789c.azurestaticapps.net_).

## Configure a root domain

Root domains are your domain minus any subdomain, including `www`. For example, the root domain for `www.example.com` is `example.com`. This is also known as an "APEX" domain.

While root domain support is not available during preview, you can see the blog post [Configure root domains in Azure Static Web Apps](https://burkeholland.github.io/posts/static-app-root-domain) for details on how to configure root domain support with a Static Web App.

## Map a wildcard domain

Sometimes you want all traffic sent to a subdomain to route to another domain. A common example is mapping all subdomain traffic to `www.example.com`. This way, even if someone types `w.example.com` instead of `www.example.com`, the request is sent to `www.example.com`.

### Configure DNS provider

1. Sign in to the website of your domain provider.

2. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

3. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

    The following screenshot is an example of a DNS records page:

    :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

4. Create a new **CNAME** record with the following values, replacing `www.example.com` with your custom domain name.

    | Setting | Value                  |
    | ------- | ---------------------- |
    | Type    | CNAME                  |
    | Host    | \*                     |
    | Value   | www.example.com        |
    | TTL     | Leave as default value |

5. Save the changes with your DNS provider.

Now that the wildcard domain is configured, it may take several hours for the changes to propagate worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your domain custom domain with any subdomain (other than `www`), select CNAME from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns your custom domain configured for your Static Web App (for instance, `www.example.com`).

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](application-settings.md)
