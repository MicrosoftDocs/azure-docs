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

[WordPress](https://www.wordpress.org) is an open source Content Management System (CMS) used by over 40% of the web to create websites, blogs, and other applications. WordPress can be run on a few different Azure services: [AKS](/azure/mysql/flexible-server/tutorial-deploy-wordpress-on-aks), [Virtual Machines](/azure/virtual-machines/linux/tutorial-lamp-stack#install-wordpress), [Azure Container Apps](https://github.com/Azure-Samples/apptemplate-wordpress-on-ACA) and Azure App Service. For a full list of WordPress options on Azure, see [WordPress on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?search=wordpress&page=1).

With WordPress on Azure App Service, you can focus on creating content while Azure takes care of the infrastructure, security, and performance needs. App Service provides a streamlined and scalable platform for hosting WordPress websites. By using Azure's powerful infrastructure, including **Azure App Service**, **Azure Database for MySQL**, **Azure CDN**, and **Azure Blob Storage**, you can quickly deploy and manage a secure, high-performance WordPress site.

This solution is designed to meet the needs of both small and large-scale deployments, whether you're running a personal blog, a corporate website, or an e-commerce platform. With features like automated updates, advanced security, and global availability, WordPress on Azure App Service simplifies infrastructure management, so you can focus on your content and audience.

[**Quickstart documentation**](quickstart-wordpress.md) | [**Create a WordPress site using the Azure portal**](https://portal.azure.com/#create/WordPress.WordPress)

## How does App Service simplify WordPress?

Azure App Service makes deploying WordPress sites straightforward for both beginners and experienced developers:

- **Automatic updates:** Technologies like Linux, PHP, and NGINX to keep your site secure and up to date.
- **Pre-configured setup:** Get a preconfigured setup optimized for performance and security using powerful Azure services like Azure App Service, Azure Database for MySQL, Azure CDN, and Azure Blob Storage.
- **Flexible file transfers:** Easily transfer files via FTP for custom content uploads.
- **Custom server configurations:** Adjust NGINX settings using startup scripts.
- **Staging slots:** Teset changes safely in isolated environments before deploying them to production.

## What enterprise-grade features are available?

Azure App Service provides a robust and scalable environment for hosting WordPress, offering key enterprise-level features for performance, security, and management.

### Security and reliability

- **SSL and custom domains** – Secure your site with HTTPS and configure custom domains for branding.  
- **DDoS protection and Web Application Firewall (WAF)** – Protect against malicious attacks and unauthorized access.  
- **Virtual Network (VNET) integration** – Isolate traffic and secure database connections.  
- **Managed identities and Key Vault** – Secure credentials and automate access management.  
- **Microsoft Defender for Cloud** – Continuous security monitoring and threat protection.  
- **Dedicated instances** – WordPress runs on its own instance, ensuring better security and performance compared to shared hosting.  

### Performance and scalability

- **Autoscaling** – Automatically adjust compute resources based on traffic demands.  
- **Azure CDN** – Reduce latency by caching content closer to users.  
- **Blob Storage integration** – Offload static assets to optimize performance.  
- **Load testing** – Simulate real-world traffic and fine-tune application responsiveness.  

### Deployment and management

- **CI/CD pipelines** – Automate deployments with GitHub Actions or Azure DevOps.  
- **Backup and restore** – Ensure data recovery with scheduled backups.  
- **Logging and monitoring** – Use App Service Logs, Azure Monitor, and Application Insights for diagnostics and analytics.  
- **Global availability** – Deploy in multiple Azure regions for redundancy and reduced latency.  

These features make Azure App Service a scalable, secure, and highly available platform for WordPress hosting, suitable for both small websites and enterprise-scale deployments.


## What are the best scenarios for WordPress on App Service?

WordPress on Azure App Service supports a wide range of use cases, including:

- **Corporate websites and intranets:** Scalable and secure solutions for public-facing sites or internal portals.
- **E-commerce platforms:** Handle traffic spikes while ensuring secure customer data management.
- **Content management systems (CMS):** Ideal for blogs, portfolios, and headless CMS applications.
- **Community and social networking sites:** Manage high volumes of user-generated content seamlessly.
- **Marketing campaigns:** Deploy high-performance landing pages to support digital marketing initiatives.

## What are some considerations when using WordPress on App Service?

While WordPress on Azure App Service provides robust features and scalability, it has some limitations to consider:

- **Performance on Shared Hosting Plans**: While Free and Basic plans are cost-effective for smaller sites, they may not provide the performance needed for high-traffic websites.
- **No Support for Windows-based Hosting**: WordPress on App Service is Linux-based, and Windows-based hosting is not available.
- **Custom NGINX Configuration Complexity**: Customizing NGINX settings involves creating and managing startup scripts, which may require technical expertise.

By understanding these limitations, users can plan effectively and decide whether this solution aligns with their specific requirements.

## Resources

Explore more about WordPress on Azure App Service:

- [Create a WordPress site](quickstart-wordpress.md)
- [GitHub documentation](https://github.com/Azure/wordpress-linux-appservice)
- [Sidecar configuration](tutorial-custom-container-sidecar.md)

## Next steps

To get started with WordPress on Azure App Service:

- [Explore the Quickstart documentation](quickstart-wordpress.md).
- [Deploy your WordPress site](https://azure.microsoft.com/get-started/).
