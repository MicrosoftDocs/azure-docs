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

| Scenario                                                                                 | Example                                | Domain validation method | DNS record type |
| ---------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------ | --------------- |
| [Add a root/APEX domain](#add-domain-using-txt-record-validation)                        | `mydomain.com`, `example.co.uk`        | TXT                      | ALIAS           |
| [Add a subdomain](#add-domain-using-cname-record-validation)                             | `www.mydomain.com`, `foo.mydomain.com` | CNAME                    | CNAME           |
| [Transfer a subdomain that is currently in use](#add-domain-using-txt-record-validation) | `www.mydomain.com`, `foo.mydomain.com` | TXT                      | CNAME           |

## Add domain using CNAME record validation

CNAME record validation is the recommended way to add a custom domain, however, it only works for subdomains. If you would like to add a root domain (`mydomain.com`), please skip to [Add domain using TXT record validation](#add-domain-using-txt-record-validation) and then [create an ALIAS record](#create-an-alias-record).

> [!IMPORTANT]
> If your subdomain is currently associated to a live site, and you aren't ready to transfer it to your static web app, use TXT record validation.

#### Enter your subdomain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter your subdomain. Make sure that you enter it without any protocols. For example, `www.mydomain.com`.

   :::image type="content" source="../articles/static-web-apps/custom-domain/add-subdomain.png" alt-text="Add domain screen showing the custom subdomain in the input box":::

1. Select the **Next** button to move to the _Validate + configure_ step.

#### Configure CNAME with your domain provider

1. Make sure **CNAME** is selected from the _Hostname record type_ dropdown list.

1. Copy the value in the _Require Value_ field to your clipboard by selecting the **copy** icon.

   :::image type="content" source="../articles/static-web-apps/media/custom-domain/copy-cname.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

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

1. Select the **Add** button.

Azure will attempt to validate the new CNAME with your domain provider. This may take a few minutes depending on your domain provider. If the validation fails immediately, wait a few minutes and try again before proceeding with any troubleshooting.

Now that the custom domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain including the `www`, select **CNAME** from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns the auto-generated URL of your static web app (for instance, _random-name-123456789c.azurestaticapps.net_).

## Add domain using TXT record validation

Use TXT record validation when you want to do either of the following...

1. You want to configure a root domain (i.e. `mydomain.com`). CNAMES cannot be used to map root domains. Note that your domain provider must also support ALIAS record types or CNAME flattening.
1. You want to transfer a subdomain without downtime. The TXT record validation method allows you to validate that you own the domain, and for static web apps to go through the process of issuing you a certificate for that domain. You can then switch your domain to point to your static web app at any time with a CNAME record.

#### Enter your domain

1. Open the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Search for and select **Static Web Apps**

1. On the _Static Web Apps_ page, select the name of your app.

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter either your root domain (i.e. `mydomain.com`) or your subdomain (i.e. `www.mydomain.com`).

   :::image type="content" source="../articles/static-web-apps/media/custom-domains/add-domain.png" alt-text="Add domain screen showing the custom domain in the input box":::

1. Click on the **Next** button to move to the _Validate + configure_ step.

#### Configure TXT record with your domain provider

1. Ensure that the "Hostname record type" dropdown is set to "TXT".

1. Select the **Generate code** button.

   :::image type="content" source="../articles/static-web-apps/media/custom-domains/generate-code.png" alt-text="Add custom screen with generate code button highlighted":::

   This action generates a unique code, which may take up to a minute to process.

1. Select the clipboard icon next to the code to copy the value to your clipboard.

   :::image type="content" source="../articles/static-web-apps/media/custom-domains/copy-code.png" alt-text="Add custom domain screen with copy code button highlighted":::

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

   > [!NOTE]
   > Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **TXT** record with the following values...

   | Setting             | Value                     |
   | ------------------- | ------------------------- |
   | Type                | TXT                       |
   | Host                | @                         |
   | Value               | Paste from your clipboard |
   | TTL (if applicable) | Leave as default value    |

> [!NOTE]
> Some DNS providers will change the "@" to your root domain (i.e. mydomain.com) automatically. This is expected and the validation process will still work.

#### Validate TXT record

1. Return to the _Validate + configure_ screen in the Azure Portal.

During this step, Azure automatically verifies the TXT record with your DNS provider. Once the validation process is complete, a green indicator appears next to the added domain.

:::image type="content" source="../articles/static-web-apps/media/custom-domains/txt-record-ready.png" alt-text="Green indicator showing TXT record has been validated":::

When the green indicator appears next to your domain in the _Custom domains_ screen, you can complete the second step, which is to add an ALIAS record.

## Create an ALIAS record

An ALIAS record maps one domain to another. It is used specifically for root domains (i.e. `mydomain.com`). In this section, you will create an ALIAS record that maps your root domain to the auto-generated URL of your static web app.

> [!IMPORTANT]
> Your domain provider must support [ALIAS records](https://docs.microsoft.com/en-us/azure/dns/dns-alias) or CNAME flattening.

1. Select **Overview** in the menu.

1. Copy the URL of your static web app from the overview screen by hovering over it and selecting the **copy** icon.

   :::image type="content" source="../articles/static-web-apps/media/custom-domains/overview.png" alt-text="Overview page of a static web app with the copy URL icon highlighted":::

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

   > [!NOTE]
   > Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **ALIAS** record with the following values...

   | Setting             | Value                                             |
   | ------------------- | ------------------------------------------------- |
   | Type                | ALIAS (use CNAME if ALIAS is not available)       |
   | Host                | @                                                 |
   | Value               | Paste from your clipboard and **remove https://** |
   | TTL (if applicable) | Leave as default value                            |

> [!IMPORTANT]
> If your domain provider doesn't offer an ALIAS record type, use a CNAME type instead. Many providers offer the same functionality as the ALIAS record type via the CNAME record type and a feature called "CNAME Flattening".

### Validate ALIAS record

The root domain setup is now complete, but it may take some time for the DNS changes to propagate.

You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your custom domain, select **A** from the drop-down, and select **Start**. You should see an IP address next to each geographic location. If you see "timeout", the propagation has not yet completed.

> [!NOTE]
> The IP address that you see when using the DNS Propagation tool will not resolve to your application. However, your root domain will work if you see an IP address value.

## Map a wildcard domain

Sometimes you want all traffic sent to a subdomain to route to another domain. A common example is mapping all subdomain traffic to `www.mydomain.com`. This way, even if someone types `w.mydomain.com` instead of `www.mydomain.com`, the request is sent to `www.mydomain.com`.

### Configure DNS provider

1. Sign in to the website of your domain provider.

2. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

3. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page.

   :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

4. Create a new **CNAME** record with the following values, replacing `www.mydomain.com` with your custom domain name.

   | Setting | Value                  |
   | ------- | ---------------------- |
   | Type    | CNAME                  |
   | Host    | \*                     |
   | Value   | www.mydomain.com       |
   | TTL     | Leave as default value |

5. Save the changes with your DNS provider.

Now that the wildcard domain is configured, it may take several hours for the changes to propagate worldwide. You can check the status of the propagation by going to [dnspropagation.net](https://dnspropagation.net). Enter your domain custom domain with any subdomain (other than `www`), select CNAME from the drop-down, and select **Start**.

If your DNS changes have populated, the website returns your custom domain configured for your Static Web App (for instance, `www.mydomain.com`).

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](application-settings.md)
