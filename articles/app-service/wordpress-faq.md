---
title: 'Frequently asked questions about WordPress on App Service'
description: Use this article to find frequently asked questions and answers about WordPress on Azure App Service.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
ai-usage: ai-assisted
author: reddyabhishek
ms.subservice: wordpress
ms.topic: faq
ms.date: 12/13/2024
# ms.devlang: wordpress
ms.author: areddys
ms.custom: mvc, linux-related-content
---
# WordPress on App Service: Frequently Asked Questions

## Are there limits on the number of sites, visits, storage, or bandwidth?

The allocated resources for an App Service plan and database tier determine the hosting capacity. For example:
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

Bandwidth is unlimited, but [charges apply for internet egress](https://azure.microsoft.com/pricing/details/bandwidth/).

## How are security patches updated?
Azure manages security patches for core technologies, while WordPress-specific updates may require manual or semi-automated steps:
- **PHP Major Versions:** Update manually under **App Service > Settings > Configuration**.
- **WordPress Core:** Minor updates are automatic, while major updates need manual configuration.
- **Plugins and Themes:** Perform manual updates after backing up your site to avoid issues. WordPress also offers auto update options.

See [How to keep your WordPress website stack on Azure App Service up to date](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-keep-your-wordpress-website-stack-on-azure-app-service-up-to-date/3832193) for more information.

## What security features are available to protect my website?
Azure App Service integrates robust security features to safeguard WordPress sites:
- **[App Service Security](overview-security.md):** HTTPS, IP restrictions, certificates, authentication, and network isolation.
- **[Easy Authentication](overview-authentication-authorization.md):** Built-in identity provider integration with minimal effort.
- **[Azure Database for MySQL](/security/benchmark/azure/baselines/azure-database-for-mysql-flexible-server-security-baseline):** Advanced protections for Azure MySQL servers, including encryption and backup capabilities.
- **[Virtual Network (VNET)](/azure/virtual-network/virtual-networks-overview):** Secure communication between Azure resources, the internet, and on-premises networks.
- **[Managed Identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities):** Credential-free access to resources using Microsoft Entra tokens.
- **[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction):** Proactive threat detection with DevSecOps integration.
- **[Azure Key Vault](/azure/key-vault/):** Secure storage for keys, secrets, and certificates.
- **[Microsoft Entra ID](/entra/identity/):** Single sign-On (SSO) for seamless authentication.



## How can I set up WordPress Multisite?
WordPress Multisite allows managing multiple sites from a single installation. To enable:
Set up a **[subdirectory-based Multisite](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-set-up-subdirectory-multisite-in-wordpress-on-azure-app/ba-p/3791071)** or **[subdomain-based Multisite](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-set-up-subdomain-multisite-in-wordpress-on-app-service/ba-p/3886283)**.

> [!NOTE]
> - Conversion to Multisite is permanent; reverting to a single site is unsupported.
> - Switching between subdirectory and subdomain setups isn't allowed.
>

## How do I access my WordPress website's database?
The database can be accessed using **phpMyAdmin** at: `https://<your-site-link>/phpmyadmin`.
Use the `DATABASE_USERNAME` as the username and a generated token as the password (tokens can be retrieved via **Kudu SSH**).

## How do I enable a custom domain for my WordPress website?
Custom domains can be set up with these resources:
- [Using custom domains with WordPress on Azure App Service](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-use-custom-domains-with-wordpress-on-app-service/ba-p/3886247)
- [Configuring custom domains with Azure Front Door](/azure/frontdoor/front-door-custom-domain)

## Does WordPress on App Service have email functionality?
Yes, email functionality is supported through **[Azure Communication Services](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/wordpress-on-azure-appservice-email-integration/ba-p/3890486)**. [Custom email domains can be also be configured](/azure/communication-services/quickstarts/email/add-custom-verified-domains).

## How can I update NGINX configurations for my WordPress website?
NGINX configurations can be updated using a **startup script**. Detailed instructions are available in the [startup script guide](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/updating-nginx-default-configurations-on-azure-app-services/ba-p/3710146).

## How can I access error logs for my WordPress website?
Access error logs for debugging via **App Service logs** or the **Kudu dashboard**. Refer to the [documentation](troubleshoot-diagnostic-logs.md) for detailed steps.

## How do I estimate pricing for hosting a WordPress site on Azure?
Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/) to estimate hosting costs, considering App Service, MySQL, CDN, Blob Storage, and other components. Use this [pricing estimate guide](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-estimate-pricing-for-wordpress-on-app-service/ba-p/4029262) for more information.

## How can I debug and monitor my WordPress site?
Key tools for debugging and monitoring WordPress sites include:
- **[App Service Logs](troubleshoot-diagnostic-logs.md)**
- **[Kudu](https://techcommunity.microsoft.com/blog/appsonazureblog/kudu-dashboard-explained---wordpress-on-app-service/4030035)**
- **[SSH Access](configure-linux-open-ssh-session.md?pivots=container-linux)**

### PhpMyAdmin
WordPress on App Service utilizes an Azure Database for MySQL Flexible Server, which is integrated into a VNET. This setup restricts database access to within the VNET. WordPress on App Service includes phpMyAdmin by default. You can access it at: https://`<your-site-link>`/phpmyadmin. 
 
If you are using Managed Identities, you can log in to phpMyAdmin by using the value from DATABASE_USERNAME environment variable as the username and the token as the password. To find the token use your Kudu SSH to run the following command: 
 
/usr/local/bin/fetch-mysql-access-token.sh 
 
Or you can find the database username and password from App Service environment variables 

## What features can I use to boost my WordPress site's performance?

Enhance performance with these features / plugins:
- **[Content Delivery Network (CDN)](/azure/cdn/)**
- **[Azure Front Door (AFD)](/azure/frontdoor/)**
- **[Blob Storage](/azure/storage/blobs/)**
- **Dynamic Caching**
- **[Image Compression (Smush)](https://wordpress.org/plugins/wp-smushit/)**
- **[Scaling Up](/azure/app-service/manage-scale-up) and [Out](/azure/app-service/manage-automatic-scaling)**
- **[Redis Cache](https://techcommunity.microsoft.com/blog/appsonazureblog/distributed-caching-with-azure-redis-to-boost-your-wordpress-sites-performance/3974605)**

## What are the options for configuring and setting up my WordPress site?

Options for setting up WordPress include:
- **[FTP File Transfers](/azure/app-service/deploy-ftp)**
- **[NGINX Configuration Updates](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/updating-nginx-default-configurations-on-azure-app-services/ba-p/3710146)**
- **[App Service settings](/azure/app-service/configure-common)**

## How can I build a headless WordPress site?
Enable **WP REST APIs** and integrate with **Static Web Apps** to create a decoupled front-end experience. Learn more [here](https://techcommunity.microsoft.com/blog/appsonazureblog/integrating-wordpress-on-app-service-with-azure-static-web-apps/4004955).

## What features are available for creating an enterprise-grade production website?
Key features include:
- [Staging slots](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-set-up-staging-slots-in-wordpress-on-app-service/4144847) for safe testing
- [Custom domains](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-use-custom-domains-with-wordpress-on-app-service/3886247) and SSL certificates
- [CI/CD](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-integrate-continuous-integration-and-deployment-with-wordpress-on-app-ser/4144886) pipelines for automated deployments
- [Startup scripts](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-run-bash-scripts-in-wordpress-on-azure-app-service/3625692) for configuration
- [Emails with custom domain](/azure/communication-services/quickstarts/email/add-custom-verified-domains)
- [Scaling](/azure/app-service/manage-scale-up) and [load testing](/azure/load-testing/concept-load-test-app-service) capabilities

## What are common errors for WordPress on App Service, and how can I troubleshoot?
Typical issues and resolutions:
- **[Debug Logs](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/enabling_debug_logs_for_wordpress.md):** Enable for troubleshooting.
- **[CORS Issues](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/cors_issue_with_azure_cdn_frontdoor_blob.md):** Adjust settings in CDN or Azure Front Door.
- **[Existing WordPress Detected Warning](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/troubleshooting-guides/tsg_existing_wordpress_installation_detected.md):** Follow [troubleshooting steps](#).
- **[Intl Extension issues](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-install-intl-extension-on-wordpress-on-azure-app-service/4138353):** Install via the configuration panel.
