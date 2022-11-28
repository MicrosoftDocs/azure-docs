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

## About domains

Setting up an apex domain is a common scenario to configure once your domain name is set up. Creating an apex domain is achieved by configuring an `ALIAS` or `ANAME` record or through `CNAME` flattening. Some domain registrars like GoDaddy and Google don't support these DNS records. If your domain registrar doesn't support all the DNS records you need, consider using [Azure DNS to configure your domain](custom-domain-azure-dns.md).

The following are terms you'll encounter as you set up a custom domain.

* **Apex or root domains**: Given the domain `www.example.com`, the `www` prefix is known as the subdomain, while the remaining segment of `example.com` is referred to as the apex domain.

* **Domain registrar**: A registrar verifies the availability of a domain sells the rights to purchase a domain name.

* **DNS zone**: A Domain Name System (DNS) zone hosts the DNS records associated to a specific domain. There are various records available which direct traffic for different purposes. For example, the domain `example.com` may contain several DNS records. One record handles traffic for `mail.example.com` (for a mail server), and another `www.contoso.com` (for a website).

* **DNS hosting**: A DNS host maintains DNS servers that resolve a domain name to a specific IP address.

* **Name server**: A name server is responsible for storing the DNS records for a domain.

## Next steps

Use the following links for steps on how to set up your domain based on your provider.

* [Use Azure DNS](custom-domain-azure-dns.md)
* [Use an external DNS provider](custom-domain-external.md)
