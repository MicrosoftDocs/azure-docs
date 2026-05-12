---
title: 'Frequently asked questions about WordPress on App Service'
description: Learn about frequently asked questions, troubleshooting guidance, security, scaling, and performance optimization for WordPress on Azure App Service.
keywords: app service, azure app service, wordpress, preview, app service on linux, plugins, mysql flexible server, wordpress on linux, php
ai-usage: ai-assisted
author: reddyabhishek
ms.service: azure-app-service
ms.topic: faq
ms.date: 05/12/2026
# ms.devlang: wordpress
ms.author: tulikac
ms.custom:
  - mvc
  - linux-related-content
  - sfi-ropc-nochange
---

# WordPress on App Service: Frequently Asked Questions

This article answers common questions about hosting and managing WordPress on Azure App Service, including scaling, security, monitoring, troubleshooting, and performance optimization.

## Are there limits on the number of sites, visits, storage, or bandwidth?

The allocated resources for an App Service plan and database tier determine the hosting capacity. For example:

- **App Service B1 Plan:** Includes one core, 1.75-GB RAM, and 10-GB storage.
- **Database B1ms Instance:** Offers one vCore, 2-GB RAM, and storage up to 16 GB.

There's no fixed limit on the number of sites you can host, but recommended application limits by pricing tier are:

| Pricing tier | Recommended maximum apps |
|---|---|
| B1, S1, P1v2, I1v1 | 8 |
| B2, S2, P2v2, I2v1 | 16 |
| B3, S3, P3v2, I3v1 | 32 |
| P1v3, I1v2 | 16 |
| P2v3, I2v2 | 32 |
| P3v3, I3v2 | 64 |

Bandwidth is unlimited, but [internet egress charges apply](https://azure.microsoft.com/pricing/details/bandwidth/).

## How are security patches updated?

Azure manages security patches for core platform technologies, while WordPress-specific updates might require manual or semi-automated actions.

- **PHP major versions:** Update manually under **App Service > Settings > Configuration**.
- **WordPress core:** Minor updates are automatic, while major updates require manual configuration.
- **Plugins and themes:** Perform updates manually after backing up your site to avoid compatibility issues. WordPress also supports automatic updates.

For more information, see [How to keep your WordPress website stack on Azure App Service up to date](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-keep-your-wordpress-website-stack-on-azure-app-service-up-to-date/3832193).

## What security features are available to protect my website?

Azure App Service integrates multiple security features to help protect WordPress sites.

- **[App Service security](overview-security.md):** HTTPS, IP restrictions, certificates, authentication, and network isolation.
- **[Easy Authentication](overview-authentication-authorization.md):** Built-in identity provider integration with minimal configuration.
- **[Azure Database for MySQL](/security/benchmark/azure/baselines/azure-database-for-mysql-flexible-server-security-baseline):** Encryption, backup, and advanced database protection capabilities.
- **[Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview):** Secure communication between Azure resources, the internet, and on-premises networks.
- **[Managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities):** Credential-free access to Azure resources using Microsoft Entra tokens.
- **[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction):** Threat detection and DevSecOps integration.
- **[Azure Key Vault](/azure/key-vault/):** Secure storage for secrets, certificates, and encryption keys.
- **[Microsoft Entra ID](/entra/identity/):** Single sign-on (SSO) and identity management capabilities.

## How can I set up WordPress Multisite?

WordPress Multisite enables you to manage multiple websites from a single WordPress installation.

You can configure either:

- A [subdirectory-based Multisite](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-set-up-subdirectory-multisite-in-wordpress-on-azure-app/ba-p/3791071)
- A [subdomain-based Multisite](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-set-up-subdomain-multisite-in-wordpress-on-app-service/ba-p/3886283)

> [!NOTE]
> - Converting a WordPress installation to Multisite is permanent and isn't reversible.
> - Switching between subdirectory and subdomain configurations isn't supported.

## How do I access my WordPress website database?

You can access the database by using **phpMyAdmin** at:

`https://<your-site-link>/phpmyadmin`

Use the `DATABASE_USERNAME` environment variable as the username and a generated token as the password. You can retrieve the token by using Kudu SSH.

## How do I enable a custom domain for my WordPress website?

You can configure a custom domain by using these resources:

- [Use custom domains with WordPress on Azure App Service](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-use-custom-domains-with-wordpress-on-app-service/ba-p/3886247)
- [Configure custom domains with Azure Front Door](/azure/frontdoor/front-door-custom-domain)

## Does WordPress on App Service support email functionality?

Yes. Email functionality is supported through **[Azure Communication Services](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/wordpress-on-azure-appservice-email-integration/ba-p/3890486)**.

You can also configure [custom email domains](/azure/communication-services/quickstarts/email/add-custom-verified-domains).

## How can I update NGINX configurations for my WordPress website?

You can update NGINX configurations by using a startup script.

For detailed instructions, see the [startup script guide](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/updating-nginx-default-configurations-on-azure-app-services/ba-p/3710146).

## How can I access error logs for my WordPress website?

You can access logs for troubleshooting and debugging by using:

- **App Service logs**
- **Kudu dashboard**

For more information, see [Enable diagnostic logging in App Service](troubleshoot-diagnostic-logs.md).

## How do I estimate pricing for hosting a WordPress site on Azure?

Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/) to estimate hosting costs for services such as:

- Azure App Service
- Azure Database for MySQL
- Azure Front Door
- Azure Blob Storage

For more information, see the [pricing estimate guide](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-estimate-pricing-for-wordpress-on-app-service/ba-p/4029262).

## How can I debug and monitor my WordPress site?

Key tools for debugging and monitoring WordPress sites include:

- **[App Service Logs](troubleshoot-diagnostic-logs.md)**
- **[Kudu](https://techcommunity.microsoft.com/blog/appsonazureblog/kudu-dashboard-explained---wordpress-on-app-service/4030035)**
- **[SSH Access](configure-linux-open-ssh-session.md?pivots=container-linux)**

### phpMyAdmin

WordPress on App Service uses Azure Database for MySQL Flexible Server, which is integrated into a virtual network. This setup restricts database access to within the virtual network.

phpMyAdmin is included by default and can be accessed at:

`https://<your-site-link>/phpmyadmin`

If you're using managed identities, you can sign in to phpMyAdmin by using:

- The `DATABASE_USERNAME` environment variable as the username
- A generated access token as the password

To retrieve the token, connect through Kudu SSH and run:

```bash
/usr/local/bin/fetch-mysql-access-token.sh
```

You can also find the database username and password in App Service environment variables.

## What features can I use to improve my WordPress site's performance?

You can improve performance by using the following Azure services and WordPress features:

- **[Azure Front Door (AFD)](/azure/frontdoor/)**
- **[Azure Blob Storage](/azure/storage/blobs/)**
- **Dynamic caching**
- **[Image compression with Smush](https://wordpress.org/plugins/wp-smushit/)**
- **[Scale up](/azure/app-service/manage-scale-up)** and **[scale out](/azure/app-service/manage-automatic-scaling)**
- **[Azure Cache for Redis](https://techcommunity.microsoft.com/blog/appsonazureblog/distributed-caching-with-azure-redis-to-boost-your-wordpress-sites-performance/3974605)**

## What configuration and setup options are available for WordPress on App Service?

You can configure and manage WordPress on App Service by using:

- **[FTP file transfers](/azure/app-service/deploy-ftp)**
- **[NGINX configuration updates](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/updating-nginx-default-configurations-on-azure-app-services/ba-p/3710146)**
- **[App Service settings](/azure/app-service/configure-common)**

## How can I build a headless WordPress site?

You can create a headless WordPress architecture by enabling **WP REST APIs** and integrating with **Azure Static Web Apps** for a decoupled front-end experience.

For more information, see [Integrate WordPress on App Service with Azure Static Web Apps](https://techcommunity.microsoft.com/blog/appsonazureblog/integrating-wordpress-on-app-service-with-azure-static-web-apps/4004955).

## What features are available for creating an enterprise-grade production website?

Enterprise deployment capabilities include:

- [Deployment slots](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-set-up-staging-slots-in-wordpress-on-app-service/4144847) for testing and staged deployments
- [Custom domains](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-use-custom-domains-with-wordpress-on-app-service/3886247)
- [CI/CD pipelines](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-integrate-continuous-integration-and-deployment-with-wordpress-on-app-ser/4144886) for automated deployments
- [Startup scripts](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-run-bash-scripts-in-wordpress-on-azure-app-service/3625692) for configuration automation
- [Custom email domains](/azure/communication-services/quickstarts/email/add-custom-verified-domains)
- [Scaling](/azure/app-service/manage-scale-up) and [load testing](/azure/load-testing/concept-load-test-app-service) capabilities

## What are common WordPress on App Service errors, and how can I troubleshoot them?

Common issues and troubleshooting resources include:

- **[Enable debug logs](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/enabling_debug_logs_for_wordpress.md)** for troubleshooting WordPress issues
- **[Resolve CORS issues](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/cors_issue_with_azure_cdn_frontdoor_blob.md)** when using Azure Front Door or CDN integrations
- **[Troubleshoot existing WordPress installation warnings](https://github.com/Azure/wordpress-linux-appservice/blob/main/WordPress/troubleshooting-guides/tsg_existing_wordpress_installation_detected.md)**
- **[Install the Intl PHP extension](https://techcommunity.microsoft.com/blog/appsonazureblog/how-to-install-intl-extension-on-wordpress-on-azure-app-service/4138353)** through the App Service configuration panel
