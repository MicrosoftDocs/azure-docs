---
title: 'Frequently asked questions about WordPress on Azure App Service'
description: Questions and answers about WordPress on Azure App Service.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
author: msangapu-msft
ms.topic: overview
ms.date: 11/26/2024
# ms.devlang: wordpress
ms.author: msangapu
ms.custom: mvc, linux-related-content
---
# WordPress on Azure App Service: Frequently Asked Questions (FAQ)

## Are there limits on the number of sites, visits, storage, or bandwidth?

The allocated resources for an App Service Plan and Database Tier determine the hosting capacity. For example:

- **App Service B1 Plan:** Includes 1 core, 1.75 GB RAM, and 10 GB storage.
- **Database B1ms Instance:** Offers 1 vCore, 2 GB RAM, and storage up to 16 GB.

There's no fixed limit on the number of sites you can host, but recommended app limits by SKU are:

| **SKU**           | **Recommended Max Apps** |
|--------------------|---------------------------|
| B1, S1, P1v2, I1v1 | 8                         |
| B2, S2, P2v2, I2v1 | 16                        |
| B3, S3, P3v2, I3v1 | 32                        |
| P1v3, I1v2         | 16                        |
| P2v3, I2v2         | 32                        |
| P3v3, I3v2         | 64                        |

Bandwidth is unlimited, but charges apply for internet egress.

---

## How are security patches updated?

Azure manages security patches for core technologies, while WordPress-specific updates may require manual or semi-automated steps:

- **PHP Major Versions:** Update manually under **App Service > Settings > Configuration**.
- **WordPress Core:** Minor updates are automatic, while major updates need manual configuration.
- **Plugins and Themes:** Perform manual updates after backing up your site to avoid issues. WordPress offers auto-update options.

---

## What security features are available to protect my website?

Azure App Service integrates robust security features to safeguard WordPress sites:

1. **App Service Security:** HTTPS, IP restrictions, certificates, authentication, and network isolation.
2. **Easy Authentication:** Built-in identity provider integration with minimal effort.
3. **Database Security:** Advanced protections for Azure MySQL servers, including encryption and backup capabilities.
4. **Virtual Network (VNET):** Secure communication between Azure resources, the internet, and on-premises networks.
5. **Managed Identities:** Credential-free access to resources using Microsoft Entra tokens.
6. **Defender for Cloud:** Proactive threat detection with DevSecOps integration.
7. **Azure Key Vault:** Secure storage for keys, secrets, and certificates.
8. **Microsoft Entra ID:** Single Sign-On (SSO) for seamless authentication.

---

## How can I set up WordPress Multisite?

WordPress Multisite allows managing multiple sites from a single installation. To enable:

1. Set up a **subdirectory-based Multisite** or **subdomain-based Multisite**.
2. Follow [guides for configuration](#).

**Important Notes:**
- Conversion to Multisite is permanent; reverting to a single site is unsupported.
- Switching between subdirectory and subdomain setups is not allowed.

---

## How do I access my WordPress website's database?

The database can be accessed using **phpMyAdmin** at:

`https://<your-site-link>/phpmyadmin`

Use the `DATABASE_USERNAME` as the username and a generated token as the password (tokens can be retrieved via **Kudu SSH**).

---

## How do I enable a custom domain for my WordPress website?

Custom domains can be set up with these resources:

- [Using custom domains with WordPress on Azure App Service](#)
- [Configuring custom domains with Azure Front Door](#)

---

## Does WordPress on App Service have email functionality?

Yes, email functionality is supported through **Azure Communication Services**. Custom email domains can be configured using [these guides](#).

---

## How can I update NGINX configurations for my WordPress website?

NGINX configurations can be updated using a **startup script**. Detailed instructions are available in the [startup script guide](#).

---

## How can I access error logs for my WordPress website?

Access error logs for debugging via **App Service logs** or the **Kudu dashboard**. Refer to the [documentation](#) for detailed steps.

---

## How do I estimate pricing for hosting a WordPress site on Azure?

Use the [Azure Pricing Calculator](#) to estimate hosting costs, considering App Service, MySQL, CDN, Blob Storage, and additional components.

---

## How can I debug and monitor my WordPress site?

Key tools for debugging and monitoring WordPress sites include:

- **App Service Logs**
- **Kudu Dashboard**
- **SSH Access**
- **phpMyAdmin**

Refer to the [documentation](#) for details.

---

## What features can I use to boost my WordPress site's performance?

Enhance performance with these features:

- **Content Delivery Network (CDN)**
- **Azure Front Door (AFD)**
- **Blob Storage**
- **Dynamic Caching**
- **Image Compression (Smush)**
- **Scaling Up and Out**
- **Redis Cache**

---

## What are the options for configuring and setting up my WordPress site?

Options for setting up WordPress include:

- **FTP File Transfers**
- **NGINX Configuration Updates**
- **App Service Settings Management**

---

## How can I build a headless WordPress site?

Enable **WP REST APIs** and integrate with **Static Web Apps** to create a decoupled front-end experience. Learn more [here](#).

---

## What features are available for creating an enterprise-grade production website?

Key features include:

- Staging slots for safe testing
- Custom domains and SSL certificates
- CI/CD pipelines for automated deployments
- Startup scripts for configuration
- Custom email domains
- Scaling and load testing capabilities

---

## What are common errors for WordPress on App Service, and how can I troubleshoot?

Typical issues and resolutions:

- **Debug Logs:** Enable for troubleshooting.
- **CORS Issues:** Adjust settings in CDN or Azure Front Door.
- **Existing WordPress Detected Warning:** Follow [troubleshooting steps](#).
- **Intl Extension Issues:** Install via the configuration panel.
