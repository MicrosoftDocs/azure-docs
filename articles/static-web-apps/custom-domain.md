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

## DNS configuration options

There are a few different types of DNS configurations available for an application.

| If you want to                                  | Then                                                |
| ----------------------------------------------- | --------------------------------------------------- |
| Support `example.com`                           | [Configure a root domain](#configure-a-root-domain) |
| Support `www.example.com` or `blog.example.net` | [Map a CNAME record](#map-a-cname-record)           |
| Point all subdomains to `www.example.com`       | [Map a wildcard](#map-a-wildcard-domain)            |

## Configure a root domain

Root domains are the domain minus any subdomain, including `www`. For example, the root domain for `www.example.com` is `example.com`.

The process for creating a root domain requires you to complete the following actions:

- [Create a TXT](#create-a-txt-record) record to prove that you own the domain.
- [Create an ALIAS](#create-an-alias-record) record to direct traffic to your application.

Both of these steps are required for the root domain to function.

### Create a TXT record

A TXT record lets a domain administrator enter text into the domain name system (DNS). Azure generates a unique code that you must add to your domain provider as a TXT record. Azure will then look for that TXT record to verify that you own the domain.

#### Enter your domain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Click on **Custom domains** in the menu.

1. In the _Domain name_ field, **enter your root domain**. Make sure that you enter only the root domain, without any subdomains or protocols. For example, `mydomain.com`.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Add domain screen showing the custom domain in the input box":::

1. Click on the **Next** button to move to the _Validate + configure_ step.

#### Create the TXT record

[!INCLUDE [static-web-apps-txt-record](../../includes/static-web-apps-txt-record.md)]

#### Validate TXT record

1. Return to the _Validate + configure_ screen in the Azure Portal.

During this step, Azure automatically verifies the TXT record with your DNS provider. The _Custom domains_ screen shows any configured domains and their validation status. Once the validation process is complete, a green indicator appears next to the added domain.

:::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Green indicator showing TXT record has been validated":::

When the green indicator appears next to your domain in the _Custom domains_ screen, you can complete the second step, which is to add an ALIAS record.

### Create an ALIAS record

An ALIAS record maps one domain to another. It is used specifically for root domains (i.e. `example.com`). In this section, you will create an ALIAS record that maps your root domain to the auto-generated URL of your static web app.

1. Select **Overview** in the menu.

1. Copy the URL of your static web app from the overview screen by hovering over it and selecting the **copy** icon.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Overview page of a static web app with the URL field highlighted":::

1. Return to your DNS provider.

1. Create a new ALIAS record. Enter "@" for the "host" field and paste the URL on your clipboard.

### Validating root domain setup

The root domain setup is now complete, but it may take some time for the DNS changes to propagate.

You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain, select **A** from the drop-down, and select **Start**.

## Map a CNAME record

A CNAME record maps one domain to another. It is specifically used for subdomains (i.e. `www.example.com`, `blog.example.com`). In this section, you will create a CNAME record that maps a subdomain to the auto-generated URL of your static web app.

### Enter your subdomain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Click on **Custom domains** in the menu.

1. In the _Domain name_ field, enter your subdomain. Make sure that you enter it without any protocols. For example, `www.mydomain.com`.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Add domain screen showing the custom subdomain in the input box":::

1. Select the **Next** button to move to the _Validate + configure_ step.

#### Optional: Create a TXT record

If you have an active subdomain pointing at another URL, consider using a TXT record to validate domain ownership. This action verifies ownership of the domain and generates the proper certificate without redirecting traffic.

This way, you can wait until the entire validation process is complete before redirecting traffic to your static web app and avoiding down time.

[!INCLUDE [static-web-apps-txt-record](../../includes/static-web-apps-txt-record.md)]

#### Validate and add

1. Make sure **CNAME** is selected from the _Hostname record type_ dropdown list.

1. Copy the value in the _Require Value_ field to you clipboard by selecting the **copy** icon.

   :::image type="content" source="../articles/static-web-apps/media/getting-started/overview-window.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

1. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page:

   :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

1. Create a new **CNAME** record with the following values.

   | Setting             | Value                     |
   | ------------------- | ------------------------- |
   | Type                | CNAME                     |
   | Host                | www                       |
   | Value               | Paste from your clipboard |
   | TTL (if applicable) | Leave as default value    |

1. Save the changes with your DNS provider.

#### Validate CNAME

1. Return to the _Validate + add_ window in the Azure portal.

1. Select the **Validate** button.

1. When the validation process is finished, select the **Add** button.

Now that the custom domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain including the `www`, select **CNAME** from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns the auto-generated URL of your static web app (for instance, _random-name-123456789c.azurestaticapps.net_).

## Map a wildcard domain

Sometimes you want all traffic sent to a subdomain to route to another domain. A common example is mapping all subdomain traffic to `www.example.com`. This way, even if someone types `w.example.com` instead of `www.example.com`, the request is sent to `www.example.com`.

### Configure DNS provider

1. Sign in to the website of your domain provider.

2. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

3. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page.

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
