---
title: Set up a custom domain in Azure Static Web Apps
description: Learn to map a custom domain with free SSL/TLS certificate to Azure Static Web Apps
services: static-web-apps
author: burkeholland
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 08/04/2021
ms.author: buhollan
---

# Set up a custom domain with free certificate in Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name. This article shows you how to map a custom domain name to an Azure Static Web Apps application.

## Free SSL/TLS certificate

Azure Static Web Apps automatically provides a free SSL/TLS certificate for the auto-generated domain name and any custom domains you may add.

## Walkthrough Video

> [!VIDEO https://channel9.msdn.com/Shows/5-Things/Configuring-a-custom-domain-with-Azure-Static-Web-Apps/player?format=ny]

## Prerequisites

- A purchased domain name
- Access to the DNS configuration properties for your domain

## DNS configuration options

There are a few different types of DNS configurations available for an application.

| Scenario                                                                                 | Example                                | Domain validation method | DNS record type |
| ---------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------ | --------------- |
| [Add a root/apex domain](#add-domain-using-txt-record-validation)                        | `mydomain.com`, `example.co.uk`        | TXT                      | ALIAS           |
| [Add a subdomain](#add-domain-using-cname-record-validation)                             | `www.mydomain.com`, `foo.mydomain.com` | CNAME                    | CNAME           |
| [Transfer a subdomain that is currently in use](#add-domain-using-txt-record-validation) | `www.mydomain.com`, `foo.mydomain.com` | TXT                      | CNAME           |

## Add domain using CNAME record validation

CNAME record validation is the recommended way to add a custom domain, however, it only works for subdomains. If you would like to add a root domain (`mydomain.com`), please skip to [Add domain using TXT record validation](#add-domain-using-txt-record-validation) and then [create an ALIAS record](#create-an-alias-record).

> [!IMPORTANT]
> If your subdomain is currently associated to a live site, and you aren't ready to transfer it to your static web app, use [TXT record validation](#add-domain-using-txt-record-validation).

### Enter your subdomain

1. Open your static web app in the [Azure portal](https://portal.azure.com).

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter your subdomain. Make sure that you enter it without any protocols. For example, `www.mydomain.com`.

   :::image type="content" source="media/custom-domain/add-subdomain.png" alt-text="Add domain screen showing the custom subdomain in the input box":::

1. Select the **Next** button to move to the _Validate + configure_ step.

### Configure CNAME with your domain provider

You'll need to configure a CNAME with your domain provider. Azure DNS is recommended, but these steps will work with any domain provider.

# [Azure DNS](#tab/azure-dns)

1. Make sure **CNAME** is selected from the _Hostname record type_ dropdown list.

1. Copy the value in the _Value_ field to your clipboard by selecting the **copy** icon.

   :::image type="content" source="media/custom-domain/copy-cname.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

1. In a separate browser tab or window, open your Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **CNAME** record set with the following values.

   | Setting          | Value                                     |
   | ---------------- | ----------------------------------------- |
   | Name             | Your subdomain, such as `www`             |
   | Type             | CNAME                                     |
   | Alias Record Set | No                                        |
   | TTL              | Leave as default value                    |
   | TTL Unit         | Leave as default value                    |
   | Alias            | Paste the domain name from your clipboard |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-cname.png" alt-text="Azure DNS record set screen with name, type and alias fields highlighted":::

[!INCLUDE [validate CNAME](../../includes/static-web-apps-validate-cname.md)]

# [Other DNS](#tab/other-dns)

1. Make sure **CNAME** is selected from the _Hostname record type_ dropdown list.

1. Copy the value in the _Value_ field to your clipboard by selecting the **copy** icon.

   :::image type="content" source="media/custom-domain/copy-cname.png" alt-text="Validate + add screen showing CNAME selected and the copy icon outlined":::

1. In a separate browser tab or window, sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

1. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

   The following screenshot is an example of a DNS records page:

   :::image type="content" source="media/custom-domain/example-record-ui.png" alt-text="Sample DNS provider configuration":::

1. Create a new **CNAME** record with the following values.

   | Setting             | Value                                     |
   | ------------------- | ----------------------------------------- |
   | Type                | CNAME                                     |
   | Host                | Your subdomain, such as `www`             |
   | Value               | Paste the domain name from your clipboard |
   | TTL (if applicable) | Leave as default value                    |

1. Save the changes with your DNS provider.

[!INCLUDE [validate CNAME](../../includes/static-web-apps-validate-cname.md)]

---

## Add domain using TXT record validation

Azure uses a TXT record to validate that you own a domain. This is useful when you want to do one of the following...

1. You want to configure a root domain (i.e. `mydomain.com`). Validating that you own the domain is required before you can create an ALIAS record that configures the root domain.

1. You want to transfer a subdomain without downtime. The TXT record validation method allows you to validate that you own the domain, and for static web apps to go through the process of issuing you a certificate for that domain. You can then switch your domain to point to your static web app at any time with a CNAME record.

#### Enter your domain

1. Open your static web app in the [Azure portal](https://portal.azure.com).

1. Select **Custom domains** in the menu.

1. Select the **Add** button.

1. In the _Domain name_ field, enter either your root domain (i.e. `mydomain.com`) or your subdomain (i.e. `www.mydomain.com`).

   :::image type="content" source="media/custom-domain/add-domain.png" alt-text="Add domain screen showing the custom domain in the input box":::

1. Click on the **Next** button to move to the _Validate + configure_ step.

#### Configure TXT record with your domain provider

You'll need to configure a TXT record with your domain provider. Azure DNS is recommended, but these steps will work with any domain provider.

# [Azure DNS](#tab/azure-dns)

1. Ensure that the "Hostname record type" dropdown is set to "TXT".

1. Select the **Generate code** button.

   :::image type="content" source="media/custom-domain/generate-code.png" alt-text="Add custom screen with generate code button highlighted":::

   This action generates a unique code, which may take up to a minute to process.

1. Select the clipboard icon next to the code to copy the value to your clipboard.

   :::image type="content" source="media/custom-domain/copy-code.png" alt-text="Add custom domain screen with copy code button highlighted":::

1. In a separate browser tab or window, open your Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **TXT** record set with the following values.

   | Setting  | Value                                                                           |
   | -------- | ------------------------------------------------------------------------------- |
   | Name     | `@` for root domain, or enter `_dnsauth.<YOUR_SUBDOMAIN>` for subdomain         |
   | Type     | TXT                                                                             |
   | TTL      | Leave as default value                                                          |
   | TTL Unit | Leave as default value                                                          |
   | Value    | Paste the code from your clipboard                                              |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-txt.png" alt-text="Azure DNS record set screen with name, type and value fields highlighted":::

[!INCLUDE [validate TXT record](../../includes/static-web-apps-validate-txt.md)]

# [Other DNS](#tab/other-dns)

1. Ensure that the "Hostname record type" dropdown is set to "TXT".

1. Select the **Generate code** button.

   :::image type="content" source="media/custom-domain/generate-code.png" alt-text="Add custom screen with generate code button highlighted":::

   This action generates a unique code, which may take up to a minute to process.

1. Select the clipboard icon next to the code to copy the value to your clipboard.

   :::image type="content" source="media/custom-domain/copy-code.png" alt-text="Add custom domain screen with copy code button highlighted":::

1. In a separate browser tab or window, sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

   > [!NOTE]
   > Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **TXT** record with the following values...

   | Setting             | Value                                                                        |
   | ------------------- | ---------------------------------------------------------------------------- |
   | Type                | TXT                                                                          |
   | Host                | `@` for root domain, or enter `_dnsauth.<YOUR_SUBDOMAIN>` for subdomain      |
   | Value               | Paste the code from your clipboard                                           |
   | TTL (if applicable) | Leave as default value                                                       |

> [!NOTE]
> Some DNS providers use a different convention than "@" to indicate a root domain or they change the "@" to your root domain (i.e. mydomain.com) automatically. This is expected and the validation process will still work.

[!INCLUDE [create repository from template](../../includes/static-web-apps-validate-txt.md)]

---

## Create an ALIAS record

An ALIAS record maps one domain to another. It is used specifically for root domains (i.e. `mydomain.com`). In this section, you will create an ALIAS record that maps your root domain to the auto-generated URL of your static web app.

# [Azure DNS](#tab/azure-dns)

> [!IMPORTANT]
> Your Azure DNS Zone should be in the same subscription as your static web app.

1. Open your domain's Azure DNS Zone in the Azure portal.

1. Select the **+ Record Set** button.

1. Create a new **A** record set with the following values.

   | Setting          | Value                              |
   | ---------------- | ---------------------------------- |
   | Name             | @                                  |
   | Type             | A - Alias record to IPv4 Address   |
   | Alias Record Set | Yes                                |
   | Alias type       | Azure resource                     |
   | Subscription     | \<Your Subscription>               |
   | Azure resource   | \<Your Static Web App>             |
   | TTL              | Leave as default value             |
   | TTL Unit         | Leave as default value             |

1. Select **OK**.

   :::image type="content" source="media/custom-domain/azure-dns-alias.png" alt-text="Azure DNS record set screen with name, type, alias and resource fields highlighted":::

Now that the root domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide.

# [Other DNS](#tab/other-dns)

> [!IMPORTANT]
> Your domain provider must support [ALIAS](../dns/dns-alias.md) or ANAME records, or CNAME flattening.

1. Open your static web app in the [Azure portal](https://portal.azure.com).

1. Select **Custom domain** in the menu.

1. Copy the auto-generated URL of your static web app from the custom domain screen.

   :::image type="content" source="media/custom-domain/auto-generated.png" alt-text="Overview page of a static web app with the copy URL icon highlighted":::

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

   > [!NOTE]
   > Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **ALIAS** record with the following values...

   | Setting             | Value                                                          |
   | ------------------- | -------------------------------------------------------------- |
   | Type                | ALIAS or ANAME (use CNAME if ALIAS is not available)                    |
   | Host                | @                                                              |
   | Value               | Paste the domain name from your clipboard                      |
   | TTL (if applicable) | Leave as default value                                         |

> [!IMPORTANT]
> If your domain provider doesn't offer an ALIAS or ANAME record type, use a CNAME type instead. Many providers offer the same functionality as the ALIAS record type via the CNAME record type and a feature called "CNAME Flattening".

Now that the root domain is configured, it may take several hours for the DNS provider to propagate the changes worldwide.

---

## Redirect requests to a default domain

Your static web app can be accessed using its automatically generated domain and any custom domains that you have configured. Optionally, you can configure your app to redirect all traffic to a default domain.

### Set a default domain

When you designate a custom domain as your app's default domain, requests to other domains are automatically redirected to the default domain. Only one custom domain can be set as the default.

Follow the below steps to set a custom domain as default.

1. With your static web app opened in the Azure portal, select **Custom domains** in the menu.

1. Select the custom domain you want to configure as the default domain.

1. Select **Set default**.

   :::image type="content" source="media/custom-domain/set-default.png" alt-text="Set a custom domain as the default":::

1. After the operation completes, refresh the table to confirm your domain is marked as "default".

### Unset a default domain

To stop domains redirecting to a default domain, follow the below steps.

1. With your static web app opened in the Azure portal, select **Custom domains** in the menu.

1. Select the custom domain you configured as the default.

1. Select **Unset default**.

1. After the operation completes, refresh the table to confirm that no domains are marked as "default".

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](application-settings.md)
