---
title: Set up an apex domain in Azure Static Web Apps
description: Configure the root domain in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/11/2022
ms.author: cshoe
---

# Set up an apex domain in Azure Static Web Apps

Domain names without a subdomain are known as apex or root domains. For example, the domain `www.example.com` is the `www` subdomain joined with the `example.com` apex domain.

Some domain registrars (like Google and GoDaddy) don't allow you to point the apex domain to an existing URL. If your registrar doesn't support `ALIAS` or `ANAME` records, or doesn't allow `CNAME` flattening, consider the following options:

* Configure your domain with [Azure DNS](custom-domain.md)
* Forward the apex domain to the `www` subdomain
* Use an `A` record

Using an `A` record directs your traffic to a single regional host of your static web app. When enabled, your static web app no longer benefits from its global distribution, and this may affect your application performance. Consider using `ALIAS`, `ANAME` or `CNAME` record for APEX domains for the best performance.

This guide demonstrates three options for configuring an apex domain.

* Use the steps to [set up with an ALIAS record](#set-up-with-an-alias-record) if your domain registrar supports the `ALIAS` DNS record.

    If your registrar doesn't support `ALIAS` records, but does support `ANAME` records or `CNAME` flattening, see their documentation for configuration settings.

* Use the steps in [forward to www subdomain](#forward-to-www-subdomain) if your domain registrar doesn't support the `ALIAS` DNS record.

* Use the steps to [set up with an A Record](#set-up-with-an-a-record) if the above options do not suit you. With an `A` record, your traffic is directed to a single Static Web Apps host, and your app no longer benefit from the performance improvements provided by global distribution.

## Set up with an ALIAS record

Before you create the `ALIAS` record, you first need to validate that you own the domain.

### Validate ownership

1. Open the [Azure portal](https://portal.azure.com).

1. Go to your static web app.

1. From the *Overview* window, copy the generated **URL** of your site and set it aside in a text editor for future use.

1. Under *Settings*, select **Custom domains**.

2. Select **+ Add**.

3. In the *Enter domain* tab, enter your apex domain name.

    For instance, if your domain name is `example.com`, enter `example.com` into this box (without any subdomains).

4. Select **Next**.

5. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step. |
    | Hostname record type | Select **TXT**. |

6. Select **Generate code**.

    Wait as the code is generated. It make take a minute or so to complete.

7. Once the `TXT` record value is generated, **copy** (next to the generated value) the code to the clipboard.

8. Select **Close**.

9. Open a new browser tab and sign in to your domain registrar account.

10. Go to your domain name's DNS configuration settings.

11. Add a new `TXT` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `TXT` |
    | Host | Enter **@** |
    | Value | Paste the generated code value you copied from the Azure portal. |
    | TTL (if applicable) | Leave as default value. |

12. Save changes to your DNS record.

### Set up an ALIAS record

1. Return to your domain name's DNS configuration settings.

1. Add a new `ALIAS` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `ALIAS` |
    | Host | Enter **@** |
    | Value | Paste the generated URL you copied from the Azure portal. Make sure to remove the `https://` prefix from your URL. |
    | TTL (if applicable) | Leave as default value. |

1. Save changes to your DNS record.

    Since DNS settings need to propagate, this process can take some time to complete.

1. Open a new browser tab and go to your apex domain.

    After the DNS records are updated, you should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Forward to www subdomain

Each domain registrar has a different process for managing domain names. Once you sign in to your account with your registrar, look for domain forwarding options. Some registrars have this functionality listed under *DNS options*, while others have them associated with *Website options*.

Make sure as you set up forwarding that you only configure the apex domain to forward to the `www` subdomain.

See your registrar's documentation for details.

## Set up with an A record

Before you create the `A` record, you first need to validate that you own the domain.

### Validate ownership

1. Open the [Azure portal](https://portal.azure.com).

1. Go to your static web app.

1. From the *Overview* window in the top right corner of the *Essentials* section, select **JSON View**.
	
1. Copy the value of the **`stableInboundIP`** property and set it aside in a text editor for future use. This is the IP address of your regional Static Web Apps host.

1. Under Settings, select Custom domains.

1. Select **+ Add**.
	
1. In the *Enter domain* tab, enter your apex domain name.

    For instance, if your domain name is `example.com`, enter `example.com` into this box (without any subdomains).

1. Select **Next**.

1. In the *Validate + Configure* tab, enter the following values.

    | Setting | Value |
    |---|---|
    | Domain name | This value should match the domain name you entered in the previous step. |
    | Hostname record type | Select **TXT**. |

1. Select **Generate code**.

    Wait as the code is generated. It make take a minute or so to complete.

1. Once the `TXT` record value is generated, **copy** (next to the generated value) the code to the clipboard.

1. Select **Close**.

1. Open a new browser tab and sign in to your domain registrar account.

1. Go to your domain name's DNS configuration settings.

1. Add a new `TXT` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `TXT` |
    | Host | Enter **@** |
    | Value | Paste the generated code value you copied from the Azure portal. |
    | TTL (if applicable) | Leave as default value. |

1. Save changes to your DNS record.

### Set up an A record

1. Return to your domain name's DNS configuration settings.

1. Add a new `A` record with the following values.

    | Setting | Value |
    |--|--|
    | Type | `A` |
    | Host | Enter **@** |
    | Value | Paste the **`stableInboundIP`** you copied from the Azure portal.  |
    | TTL (if applicable) | Leave as default value. |

1. Save changes to your DNS record.

    Since DNS settings need to propagate, this process can take some time to complete.

1. Open a new browser tab and go to your apex domain.

    After the DNS records are updated, you should see your static web app in the browser. Also, inspect the location to verify that your site is served securely using `https`.

## Next steps

> [!div class="nextstepaction"]
> [Manage the default domain](custom-domain-default.md)
