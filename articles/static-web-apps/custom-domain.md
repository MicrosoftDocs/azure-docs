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

| If you want to                                  | Then                                                |
| ----------------------------------------------- | --------------------------------------------------- |
| Support `example.com`                           | [Configure a root domain](#configure-a-root-domain) |
| Support `www.example.com` or `blog.example.net` | [Map a CNAME record](#map-a-cname-record)           |
| Point all subdomains to `www.example.com`       | [Map a wildcard](#map-a-wildcard-domain)            |

## Configure a root domain

Root domains are your domain minus any subdomain, including `www`. For example, the root domain for `www.example.com` is `example.com`.

The process for creating a root domain involves creating a TXT record to prove that you own the domain, and then creating an ALIAS record which will direct traffic to your app. Both steps must be completed in order for the root domain to function.

### Create a TXT record

The TXT record creation requires you to first add the domain that you want to use, and then generate a unique code that Azure will use to verify that you own the domain.

#### Enter your domain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Click on **Custom domains** in the menu.

1. In the "Domain name" field, enter your domain. Make sure that you enter just the root domain, without any subdomains or protocols (i.e. example.com).

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Add domain screen showing the custom domain in the input box":::

1. Click on the "Next" button to move to the _Validate + configure_ step.

#### Create the TXT record

[!INCLUDE [static-web-apps-txt-record](../../includes/static-web-apps-txt-record.md)]

#### Validate TXT record

1. Return to the "Validate + configure" screen in the Azure Portal.

Azure will now verify the TXT record. This process happens automatically as soon as you create the TXT record with your DNS provider. The "Custom domains" screen will show any domains you have configured and their validation status. Once the validation process is complete, you will see a green indicator next to the domain that you added.

:::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Green indicator showing TXT record has been validated":::

When the green indicator appears next to your domain in the "Custom domains" screen, you can complete the second step, which is to add an ALIAS record.

### Create an ALIAS record

1. Click on the "Overview" in the menu.

1. Copy the URL of your static web app from the overview screen by hovering over it and clicking on the "copy" icon.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Overview page of a static web app with the URL field highlighted":::

1. Return to your DNS provider.

1. Create a new ALIAS record. Enter "@" for the "host" field and paste the URL on your clipboard.

### Validating root domain setup

Your root domain setup is now complete, but it may take some time for the DNS changes to propagate. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain, select A from the drop-down, and select **Start**.

## Map a CNAME record

A CNAME record maps one domain to another. You can use a CNAME record to map `www.example.com`, `blog.example.com`, or any other sub-domain to the auto-generated domain that is provided by Azure Static Web Apps.

### Enter your subdomain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Click on **Custom domains** in the menu.

1. In the "Domain name" field, enter your subdomain. Make sure that you enter it without any protocols (i.e. www.example.com).

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Add domain screen showing the custom subdomain in the input box":::

1. Click on the "Next" button to move to the "Validate + configure" step.

#### OPTIONAL: Create a TXT record

If you have an active subdomain pointing at another URL, you should consider using a TXT record to validate domain ownership. This will ensure ownership of the domain as well as generate the proper certificate without actually redirecting your traffic. This way, you can wait until the entire validation process is complete before redirecting traffic to your static web app saving down time.

[!INCLUDE [static-web-apps-txt-record](../../includes/static-web-apps-txt-record.md)]

#### Validate and add

1. Make sure "CNAME" is selected from the "Hostname record type" dropdown list.

1. Copy the value in the "Require Value" field to you clipboard by clicking on the "copy" icon.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

1. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page:

   :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

1. Create a new **CNAME** record with the following values...

   | Setting             | Value                     |
   | ------------------- | ------------------------- |
   | Type                | CNAME                     |
   | Host                | www                       |
   | Value               | Paste from your clipboard |
   | TTL (if applicable) | Leave as default value    |

1. Save the changes with your DNS provider.

#### Validate CNAME

1. Return to the _Validate + add_ window in the Azure portal.

1. Click the **Validate** button.

1. When the validation process finished, click the **Add** button.

Now that the custom domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain including the `www`, select CNAME from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns the auto-generated URL of your Static Web App (for instance, _random-name-123456789c.azurestaticapps.net_).

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

> [!div class="nextstepaction"] > [Configure app settings](application-settings.md)
