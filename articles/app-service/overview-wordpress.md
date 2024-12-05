---
title: 'An overview of WordPress'
description: An overview of WordPress on App Service. You can focus on creating WP content while Azure takes care of the infrastructure, security, and performance needs.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
author: msangapu-msft
ms.topic: overview
ms.date: 11/26/2024
# ms.devlang: wordpress
ms.author: msangapu
ms.service: azure-app-service
ms.custom: mvc, linux-related-content
#customer intent: As a new Azure customer, I want to learn more about WordPress on App Service so that I can build an effective WP site.
---

# What is WordPress on App Service?

With **WordPress on Azure App Service**, you can focus on creating content while Azure takes care of the infrastructure, security, and performance needs. App Service provides a streamlined and scalable platform for hosting WordPress websites. By using Azure's powerful infrastructure, including **Azure App Service**, **Azure Database for MySQL**, **Azure CDN**, and **Azure Blob Storage**, you can quickly deploy and manage a secure, high-performance WordPress site.

This solution is designed to meet the needs of both small and large-scale deployments, whether you're running a personal blog, a corporate website, or an e-commerce platform. With features like automated updates, advanced security, and global availability, WordPress on Azure App Service simplifies infrastructure management, so you can focus on your content and audience.

[**Quickstart Documentation**](quickstart-wordpress.md) | [**Create a WordPress site using the Azure portal**](https://portal.azure.com/#create/WordPress.WordPress)

## How Does Azure App Service Simplify WordPress Deployment?

Azure App Service makes deploying WordPress sites straightforward for both beginners and experienced developers:

- **Pre-configured Setup:** Automatically updates technologies like Linux, PHP, and NGINX to keep your site secure and up to date.
- **Flexible File Transfers:** Easily transfer files via FTP for custom content uploads.
- **Custom Server Configurations:** Adjust NGINX settings using startup scripts.
- **Staging Slots:** Safely test changes in isolated environments before deploying them to production.

## What Enterprise-Grade Features Are Available?

Azure App Service provides advanced tools to ensure your WordPress site is reliable, scalable, and performant:

- **Custom Domains and SSL Certificates:** Set up personalized domains and secure your site with HTTPS.
- **Scalability:** Adjust resources automatically or manually to handle traffic spikes.
- **CI/CD Pipelines:** Automate deployments with Continuous Integration and Continuous Deployment workflows.
- **Email Integration:** Use custom email domains for professional communication.
- **Load Testing:** Simulate real-world traffic conditions to optimize your site's performance.

## What Scenarios Are Best Suited for WordPress on Azure App Service?

WordPress on Azure App Service supports a wide range of use cases, including:

- **Corporate Websites and Intranets:** Scalable and secure solutions for public-facing sites or internal portals.
- **E-commerce Platforms:** Handle traffic spikes while ensuring secure customer data management.
- **Content Management Systems (CMS):** Ideal for blogs, portfolios, and headless CMS applications.
- **Community and Social Networking Sites:** Manage high volumes of user-generated content seamlessly.
- **Marketing Campaigns:** Deploy high-performance landing pages to support digital marketing initiatives.

## What Hosting Plans Are Available?

Azure offers flexible hosting plans to accommodate different needs, from testing to enterprise-grade production workloads:

| **Plan** | **App Service** | **Database for MySQL** |
|----------|----------------|---------------|---------------------------|
| **Free**      | F1 (60 CPU mins/day, 1-GB RAM, 1-GB storage) | Burstable, B1ms (2-GB RAM, 32-GB storage)       | 
| **Basic**     | B1 (1 core, 1.75-GB RAM, 10-GB storage)   | Burstable, B1ms (2-GB RAM, 32-GB storage)       | 
| **Standard**  | P0V3 (1 core, 4-GB RAM, 250-GB storage)  | B2s (4-GB RAM, 128-GB storage)                  |
| **Premium**   | P1V3 (2 cores, 8-GB RAM, 250-GB storage) | D2ds_v4 (8-GB RAM, 128-GB storage)              |

> [!NOTE]
> Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs for your specific needs.
>

## Why Choose WordPress on Azure App Service?

WordPress on Azure App Service combines ease of management, powerful performance features, and enterprise-grade security to provide a reliable platform for hosting WordPress websites. Whether you're managing a small blog or a high-traffic business site, Azure App Service offers the tools and scalability to meet your needs.

- **Simplified Management**: Easily handle deployments, updates, backups, and configurations through the Azure portal.
- **Performance and Scalability**: Meet traffic demands with autoscaling, CDN integration, and caching solutions.
- **Enterprise-Level Security**: Secure your site with SSL, VNET, Azure Key Vault, and Azure Defender.
- **Seamless Integration**: Extend your site's capabilities with services like Azure Front Door, Azure Monitor, and Azure Backup.
- **Global Availability**: Deploy your site in Azure's global regions for low latency and enhanced performance.

## Learning Resources

Explore more about WordPress on Azure App Service:
- [WordPress FAQ](troubleshoot-wordpress.md)
- [Create a WordPress Site](quickstart-wordpress.md)
- [GitHub Documentation](https://github.com/Azure/wordpress-linux-appservice)
- [Sidecar Configuration](tutorial-custom-container-sidecar.md)

## Next Steps

To get started with WordPress on Azure App Service:

- [Explore the Quickstart Documentation](quickstart-wordpress.md).
- [Deploy Your WordPress Site](https://azure.microsoft.com/get-started/).

