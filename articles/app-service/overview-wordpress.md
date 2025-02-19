---
title: 'An overview of WordPress'
description: An overview of WordPress on App Service. You can focus on creating WordPress content while Azure takes care of the infrastructure, security, and performance needs.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
author: msangapu-msft
ai-usage: ai-assisted
ms.topic: overview
ms.date: 12/10/2024
# ms.devlang: wordpress
ms.author: msangapu
ms.subservice: wordpress
ms.custom: mvc, linux-related-content
#customer intent: As a new Azure customer, I want to learn more about WordPress on App Service so that I can build an effective WP site.
---

# What is WordPress on App Service?

WordPress is one of the world's most popular content management systems (CMS), powering over 40% of websites globally. It enables users to create and manage websites with ease, offering flexibility for blogs, e-commerce platforms, portfolios, corporate sites, and more. Its extensive plugin ecosystem and customizable themes make it a versatile choice for developers and content creators alike.

With WordPress on Azure App Service, you can focus on creating content while Azure takes care of the infrastructure, security, and performance needs. App Service provides a streamlined and scalable platform for hosting WordPress websites. By using Azure's powerful infrastructure, including **Azure App Service**, **Azure Database for MySQL**, **Azure CDN**, and **Azure Blob Storage**, you can quickly deploy and manage a secure, high-performance WordPress site.

This solution is designed to meet the needs of both small and large-scale deployments, whether you're running a personal blog, a corporate website, or an e-commerce platform. With features like automated updates, advanced security, and global availability, WordPress on Azure App Service simplifies infrastructure management, so you can focus on your content and audience.

[**Quickstart documentation**](quickstart-wordpress.md) | [**Create a WordPress site using the Azure portal**](https://portal.azure.com/#create/WordPress.WordPress)

## How does App Service simplify WordPress?

Azure App Service makes deploying WordPress sites straightforward for both beginners and experienced developers:

- **Automatic updates:** Automatically updates technologies like Linux, PHP, and NGINX to keep your site secure and up to date.
- **Pre-configured setup:** By leveraging powerful Azure services like Azure App Service, Azure Database for MySQL, Azure CDN, and Azure Blob Storage, you get a pre-configured setup optimized for performance and security.
- **Flexible file transfers:** Easily transfer files via FTP for custom content uploads.
- **Custom server configurations:** Adjust NGINX settings using startup scripts.
- **Staging slots:** Safely test changes in isolated environments before deploying them to production.

## What enterprise-grade features are available?

Azure App Service provides advanced tools to ensure your WordPress site is secure, reliable, scalable, and performant:

- **Custom domains and SSL certificates:** Set up personalized domains and secure your site with HTTPS.
- **Scalability:** Adjust resources automatically or manually to handle traffic spikes.
- **CI/CD pipelines:** Automate deployments with continuous integration and deployment workflows.
- **Email integration:** Use custom email domains for professional communication to enhance branding and customer interactions.
- **Load testing:** Simulate real-world traffic conditions to optimize your site's performance.
- **Security:** SSL (both free and paid options), VNET, DDoS protection, Web Application Firewall, Active directory integration, IP restriction settings and many more. Additionally, you can integrate with Microsoft  Defender for Cloud to receive security scans and insights, further bolstering your site’s security.  When you deploy your WordPress site, it runs on its own dedicated instance and NOT a shared instance, making it more performant, secure and avoiding noisy neighbors.  


## What are the best scenarios for WordPress on App Service?

WordPress on Azure App Service supports a wide range of use cases, including:

- **Corporate websites and intranets:** Scalable and secure solutions for public-facing sites or internal portals.
- **E-commerce platforms:** Handle traffic spikes while ensuring secure customer data management.
- **Content management systems (CMS):** Ideal for blogs, portfolios, and headless CMS applications.
- **Community and social networking sites:** Manage high volumes of user-generated content seamlessly.
- **Marketing campaigns:** Deploy high-performance landing pages to support digital marketing initiatives.


## What hosting plans are available?

Azure offers flexible hosting plans to accommodate different needs, from testing to enterprise-grade production workloads:

| **Plan**      | **App Service**                          | **Database for MySQL**                          |
||||
| **Free**      | F1 (60 CPU mins/day, 1-GB RAM, 1-GB storage) | Burstable, B1ms (2-GB RAM, 32-GB storage)       |
| **Basic**     | B1 (1 core, 1.75-GB RAM, 10-GB storage)   | Burstable, B1ms (2-GB RAM, 32-GB storage)       |
| **Standard**  | P0V3 (1 core, 4-GB RAM, 250-GB storage)  | B2s (4-GB RAM, 128-GB storage)                  |
| **Premium**   | P1V3 (2 cores, 8-GB RAM, 250-GB storage) | D2ds_v4 (8-GB RAM, 128-GB storage)              |

> [!NOTE]
> Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs for your specific needs.


## Why should you choose WordPress on App Service?

WordPress on Azure App Service combines ease of management, powerful performance features, and enterprise-grade security to provide a reliable platform for hosting WordPress websites. Whether you're managing a small blog or a high-traffic business site, Azure App Service offers the tools and scalability to meet your needs.

- **Simplified management:** Easily handle deployments, updates, backups, and configurations through the Azure portal.
- **Performance and scalability:** Meet traffic demands with autoscaling, CDN integration, and caching solutions.
- **Enterprise-level security:** Secure your site with SSL, VNET, Azure Key Vault, and Azure Defender.
- **Seamless integration:** Extend your site's capabilities with services like Azure Front Door, Azure Monitor, and Azure Backup.
- **Global availability:** Deploy your site in Azure's global regions for low latency and enhanced performance.

## What are the limitations of WordPress on App Service?

While WordPress on Azure App Service provides robust features and scalability, it has some limitations to consider:

- **Performance on Shared Hosting Plans**: While Free and Basic plans are cost-effective for smaller sites, they may not provide the performance needed for high-traffic websites.
- **No Support for Windows-based Hosting**: WordPress on App Service is Linux-based, and Windows-based hosting is not available.
- **Custom NGINX Configuration Complexity**: Customizing NGINX settings involves creating and managing startup scripts, which may require technical expertise.

By understanding these limitations, users can plan effectively and decide whether this solution aligns with their specific requirements.

## Learning resources

Explore more about WordPress on Azure App Service:

- [Create a WordPress site](quickstart-wordpress.md)
- [GitHub documentation](https://github.com/Azure/wordpress-linux-appservice)
- [Sidecar configuration](tutorial-custom-container-sidecar.md)

## Next steps

To get started with WordPress on Azure App Service:

- [Explore the Quickstart documentation](quickstart-wordpress.md).
- [Deploy your WordPress site](https://azure.microsoft.com/get-started/).
