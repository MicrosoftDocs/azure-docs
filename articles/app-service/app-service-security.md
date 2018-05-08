---
title: Security in Azure App Service | Microsoft Docs
description: Learn about how App Service helps secure your app, and how you can further lock down your app from threats. 
keywords: azure app service, web app, mobile app, api app, security, secure, secured, compliance, compliant, certificate, certificates, https, ftps, tls, trust, encryption, encrypt, encrypted, ip restriction, authentication, authorization, authn, autho, msi, managed service identity, secrets, secret, patching, patch, patches, version
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/25/2017
ms.author: cephalin

---
# Security in Azure App Service

This article shows you how [Azure App Service](app-service-web-overview.md) secures your web app, mobile app backend, API app, and [Azure Functions](/azure/azure-functions/). It also shows the various features you can use to further secure your App Service app from threats.

The platform components of App Service, including Azure VMs, storage, network connections, web frameworks, management and integration features, are actively secured and hardened. App Service goes through vigorous compliance and checks on a continuous basis to make sure that:

- Your apps are isolated from both the internet and from the other customers' Azure resources.
- Communication of secrets (such as connection strings) between your app and other Azure resources (such as [SQL Database](/services/sql-database/)) in a resource group stays within Azure and doesn't cross any network boundaries. Secrets are always encrypted.
- All communication between your app and external resources, such as PowerShell management, command-line interface, Azure SDKs, REST APIs, and hybrid connections, are properly encrypted.
- 24-hour threat management protects App Service resources from malware, distributed denial-of-service (DDoS), man-in-the-middle (MITM), and other threats.
- For more information on infrastructure and platform security in Azure, see [Azure Trust Center](https://azure.microsoft.com/overview/trusted-cloud/).

The following sections show you how you can use the various capabilities in App Service to further protect your App Service app from threats.

## Certificates

App Service lets you secure your apps with [certificates](https://wikipedia.org/wiki/Public_key_certificate). When your app is created, its default domain name (<app_name>.azurewebsites.net) is already secured with a certificate from Azure. If you [configure a custom domain for your app](app-service-web-tutorial-custom-domain.md), you should also [secure it with a custom certificate](app-service-web-tutorial-custom-ssl.md) so that client browsers can make secured HTTPS connections to your app. There are two ways to do it:

- **App Service certificate** - Create a certificate directly in Azure. The certificate is secured in [Azure Key Vault](/azure/key-vault/), and can be imported into your App Service app. For more information, see [Buy and Configure an SSL Certificate for your Azure App Service](web-sites-purchase-ssl-web-site.md).
- **Third-party certificate** - Upload a custom SSL certificate that you purchased from a trusted certificate authority and bind it to your App Service app. App Service supports both single-domain certificates and wildcard certificates. It also supports self-signed certificates for testing purposes. For more information, see [Bind an existing custom SSL certificate to Azure Web Apps](app-service-web-tutorial-custom-ssl.md).

## HTTPS, SSL, TLS, and FTPS

To secure your app against all unencrypted connections, App Service provides one-click configuration to enforce HTTPS. Unsecured requests are turned away before they even reach your application code. For more information, see [Enforce HTTPS](app-service-web-tutorial-custom-ssl.md#enforce-https).

[TLS](https://wikipedia.org/wiki/Transport_Layer_Security) 1.0 is no longer considered secure by industry standards, such as [PCI DSS](https://wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard). App Service lets you disable outdated protocols by [enforcing TLS 1.1/1.2](app-service-web-tutorial-custom-ssl.md#enforce-tls-1112).

App Service supports both FTP and FTPS for deploying your files. However, FTPS should be used instead of FTP, if at all possible. When one or both of these protocols are not in use, you should [disable them](app-service-deploy-ftp.md#enforce-ftps).

## Static IP restrictions

By default, your App Service app accepts requests from all IP addresses from the internet, but you can limit that access to a small subset of IP addresses. App Service lets you define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses defined by a subnet mask. For more information, see [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md).

## Authentication and authorization

Azure App Service provides an authentication and authorization module. When enabled, it can sign in users with little or application code. You may run your own authentication and authorization code, or allow App Service to handle it for you instead. The module handles web requests before handing them off to your application code, and it denies unauthorized requests before they reach your code.

App Service authentication and authorization support multiple authentication providers, including Azure Active Directory, Microsoft accounts, Facebook, Google, and Twitter. For more information, see [Authentication and authorization in Azure App Service](app-service-authentication-overview.md).

## Service-to-service authentication 

When authenticating against a back-end service, App Service provides two different mechanisms depending on your need:

- **Service identity** - Sign in to the remote resource using the identity of the app itself. App Service lets you easily create a [managed service identity](app-service-managed-service-identity.md), which you can use to authenticate with other services, such as [Azure SQL Database](/azure/sql-database/), [Azure Key Vault](/azure/key-vault/), or another App Service app. For an end-to-end tutorial of this approach, see [Secure Azure SQL Database connection from App Service using managed service identity](app-service-web-tutorial-connect-msi.md).
- **On-behalf-of (OBO)** - Make delegated access to remote resources on behalf of the user. With Azure Active Directory as the authentication provider, your App Service app can perform delegated sign-in to a remote service, such as [Azure Active Directory Graph API](../active-directory/develop/active-directory-graph-api.md) or a remote API app in App Service. For an end-to-end tutorial of this approach, see [Authenticate and authorize users end-to-end in Azure App Service](app-service-web-tutorial-auth-aad.md).

## Application secrets

Don't store application secrets, such as database credentials, API tokens, and private keys in your code or configuration files. Instead, you should access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern in your language of choice. In App Service, the way to define environment variables is through [app settings](web-sites-configure.md#app-settings) (and, especially for .NET applications, [connection strings](web-sites-configure.md#connection-strings)). App settings and connection strings are stored encrypted in Azure, and they're decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly.

Also, App Service lets you integrate your app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. By [accessing the Key Vault with a managed service identity](../key-vault/tutorial-web-application-keyvault.md), your App Service app can securely access the secrets you need.

## OS and Runtime Patching

For information on how to get certain version information regarding the OS or software in App Service, see [OS and runtime patching in Azure App Service](app-service-patch-os-runtime.md). 