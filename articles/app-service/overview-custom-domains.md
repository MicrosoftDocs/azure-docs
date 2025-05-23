---
title: Overview of using custom domain names
description: Learn how to configure and manage custom domain names in Azure App Service, including mapping, buying, migrating, securing, and traffic routing.
author: msangapu-msft
ms.author: msangapu
ms.date: 03/10/2025
ms.topic: overview
ms.service: azure-app-service
---
# Overview: Use custom domain names with Azure App Service

Azure App Service enables you to host web apps on a fully managed platform. By default, apps hosted on Azure App Service are assigned a domain name like `myapp-00000.westus.azurewebsites.net`. However, for most production applications, you’ll want to use your own **domain name** (e.g., `www.contoso.com`) to create a professional, branded web presence. This is referred to as adding a **custom domain** to your app.

In this article, you'll get an overview of how to configure and manage custom domain names in Azure App Service—whether you're buying a new domain, migrating an existing one, managing DNS, or securing your domain with SSL/TLS certificates.

## What is a custom domain?

A **domain name** is the address people type into a web browser to reach your website. A **custom domain** is a domain name that you own and configure to point to your Azure-hosted app, replacing the default Azure domain.

For example:

- **Default Azure domain**: `myapp-00000.westus.azurewebsites.net`
- **Custom domain**: `www.contoso.com`

Using a custom domain allows you to:

- Establish a branded, user-friendly web address.
- Improve trust and credibility with customers.
- Manage and secure traffic to your application.

## Common scenarios for custom domains in Azure App Service

Azure App Service supports various scenarios for working with domain names:

- **Point a custom domain name to your App Service app.**
- **Purchase a domain name directly through Azure**, simplifying DNS management.
- **Migrate an existing domain name** from another registrar to be managed via Azure.
- **Distribute global traffic** using Azure Traffic Manager with your domain.
- **Secure your custom domain** with SSL/TLS certificates for HTTPS.

## Key steps to set up and manage custom domain names

### Map a custom domain name to your app

To associate a domain name with your App Service app, you need to create DNS records with your domain registrar that point to Azure. This typically involves:

- Adding an **A record** (using the app's IP address) or a **CNAME record** (aliasing the Azure default domain).
- Verifying ownership of the domain.
- Binding the domain name to your app in the Azure portal or via CLI.

> [!div class="nextstep"]
> [Tutorial: Map a custom domain to your Azure app](app-service-web-tutorial-custom-domain.md)
### Buy a domain name from Azure

Azure lets you **search for and purchase domain names directly** through the Azure portal. Domains purchased via Azure are automatically linked to Azure DNS for easier setup.

**Benefits of buying a domain name through Azure**:

- Simplified DNS management.
- Seamless integration with App Service.
- Easier SSL certificate setup.

> [!div class="nextstep"]
> [Buy and configure a custom domain name in Azure](manage-custom-dns-buy-domain.md)
### Migrate an existing domain name to Azure DNS

If your web app is currently hosted elsewhere and actively serving traffic, you can migrate your custom domain to Azure App Service without downtime by carefully managing DNS updates. The migration process allows you to transition your domain while minimizing disruption to users.

Azure provides options to:

Verify domain ownership before switching traffic to avoid interruptions.
Preconfigure domain settings in App Service to ensure seamless redirection.
Manage DNS changes strategically to reduce propagation delays.

> [!div class="nextstep"]
> [Migrate an existing domain name to Azure App Service](manage-custom-dns-migrate-domain.md)
### Configure Traffic Manager with your custom domain

To improve global performance and availability, you can use **Azure Traffic Manager** to route traffic for your custom domain based on geographic location, latency, or availability. Traffic Manager works with your App Service app to ensure users are directed to the best-performing instance.

> [!div class="nextstep"]
> [Use Traffic Manager with a custom domain name](configure-domain-traffic-manager.md)
### Secure your custom domain name with SSL certificates

Securing your custom domain with an **SSL/TLS certificate** enables HTTPS, which is essential for protecting user data and building trust. Azure App Service supports:

- **Free App Service Managed Certificates** for custom domains.
- **Bring Your Own Certificate (BYOC)** for more advanced configurations.

Certificates can be easily created, uploaded, and managed within Azure.

> [!div class="nextstep"]
> [Secure a custom domain with an SSL certificate](tutorial-secure-domain-certificate.md)
## Summary

Adding a **custom domain name** to your Azure App Service app helps you create a branded, secure, and professional online experience. Whether you're purchasing a new domain, migrating an existing one, optimizing traffic flow, or securing your app, Azure provides a complete set of tools to manage domain names efficiently.

## Next steps

- [Get started: Map a custom domain name](app-service-web-tutorial-custom-domain.md)
- [Purchase a domain name through Azure](manage-custom-dns-buy-domain.md)
- [Set up Traffic Manager with your domain](configure-domain-traffic-manager.md)
- [Add SSL to secure your domain](tutorial-secure-domain-certificate.md)