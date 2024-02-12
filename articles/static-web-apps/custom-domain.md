---
title: Custom domains with Azure Static Web Apps
description: Using a custom domain with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 02/11/2021
ms.author: cshoe
---

# Custom domains with Azure Static Web Apps

By default, Azure Static Web Apps provides an auto-generated domain name for your website, but you can point a custom domain to your site. Free SSL/TLS certificates are automatically created for the auto-generated domain name and any custom domains you may add.

When you map a custom domain to a static web app, you have a few options available to you. You can configure subdomains and an apex domain.

The following table includes links to articles that demonstrate how to configure a custom domain based provider type. <sup>1</sup>

| Action | Using... | Using... |
|--|--|--|
| Set up a domain with the `www` subdomain | [Azure DNS](custom-domain-azure-dns.md) | [External provider](custom-domain-external.md) |
| Set up an apex domain | [Azure DNS](apex-domain-azure-dns.md) | [External provider](apex-domain-external.md) |

<sup>1</sup> Some registrars like GoDaddy and Google don't support domain records that affect how you configure your apex domain. Consider using [Azure DNS](custom-domain-azure-dns.md) with these registrars to set up your apex domain.

> [!NOTE]
> Adding a custom domain to a [preview environment](preview-environments.md) is not supported. Unicode domains, including Punycode domains and the `xn--` prefix are also not supported.

## About domains

Setting up an apex domain is a common scenario to configure once your domain name is set up. Creating an apex domain is achieved by configuring an `ALIAS` or `ANAME` record or through `CNAME` flattening. Some domain registrars like GoDaddy and Google don't support these DNS records. If your domain registrar doesn't support all the DNS records you need, consider using [Azure DNS to configure your domain](custom-domain-azure-dns.md). 

Alternatively, for domain registrars that don't support `ALIAS` records, `ANAME` records or `CNAME` flattening, you can configure an `A` record for your static web app. This directs traffic to a single regional host of your static web app. Using `A` records is not recommended as your application will no longer benefit from its global distribution, and this may affect your application performance if your traffic is globally distributed.

The following are terms you'll encounter as you set up a custom domain.

* **Apex or root domains**: Given the domain `www.example.com`, the `www` prefix is known as the subdomain, while the remaining segment of `example.com` is referred to as the apex domain.

* **Domain registrar**: A registrar verifies the availability of a domain sells the rights to purchase a domain name.

* **DNS zone**: A Domain Name System (DNS) zone hosts the DNS records associated to a specific domain. There are various records available which direct traffic for different purposes. For example, the domain `example.com` may contain several DNS records. One record handles traffic for `mail.example.com` (for a mail server), and another `www.contoso.com` (for a website).

* **DNS hosting**: A DNS host maintains DNS servers that resolve a domain name to a specific IP address.

* **Name server**: A name server is responsible for storing the DNS records for a domain.

For custom domain verification to work with Static Web Apps, the DNS must be publicly resolvable. After the domain is added, one of the following conditions must be met for automatic certificate renewal to work:
*  Ensure that the public Internet CNAME DNS record used to add the custom domain to the Static Web App via CNAME validation is still present. This option is only valid if CNAME validation was used to add the domain to the static web app.
* Ensure that the custom domain resolves to the static web app over public internet. This option is valid regardless of the validation method used to add the domain to the web app. This approach is valid even if private endpoints are enabled, because private endpoints for Static Web Apps block internet access to the site contents but do not block internet DNS resolution to the site.

## Zero downtime migration

You may want to migrate a custom domain currently serving a production website to your static web app with zero downtime. DNS providers do not accept multiple records for the same name/host, so you can separately validate your ownership of the domain and route traffic to your web app.

1. Open your static web app in the Azure portal.
1. Add a **TXT record** for your custom domain (APEX or subdomain). Instead of entering the *Host* value as displayed, enter the *Host* in your DNS provider as follows:
   * For APEX domains, enter `_dnsauth.www.<YOUR-DOMAIN.COM>`.
   * For subdomains, enter `_dnsauth.<SUBDOMAIN>.<YOUR-DOMAIN.COM>`.
1. Once your domain is validated, you can migrate your traffic to your static web app by updating your `CNAME`, `ALIAS`, or `A` record to point to your [default host name](./apex-domain-external.md)

## Next steps

Use the following links for steps on how to set up your domain based on your provider.

* [Use Azure DNS](custom-domain-azure-dns.md)
* [Use an external DNS provider](custom-domain-external.md)
