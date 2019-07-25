---
title: Security recommendations for Azure App Service
description: Security recommendations for the Azure App Service. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your web app solutions. 
services: app-service
author: barclayn
manager: barbkess

ms.service: app-service
ms.topic: conceptual
ms.date: 06/17/2019
ms.author: barclayn
ms.custom: security-recommendations

---

# Security recommendations for App Service

This article contains security recommendations for Azure App Service. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your Web App solutions. For more information on what Microsoft does to fulfill service provider responsibilities, read [Azure infrastructure security](../security/azure-security-infrastructure.md).

## General

| Recommendation | Comments |
|-|-|----|
| Stay up-to-date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. |

## Identity and access management

| Recommendation | Comments |
|-|----|
| Disable anonymous access | Unless you need to support anonymous requests, disable anonymous access. For more information on Azure App Service authentication options, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).|
| Require authentication | Whenever possible, use the App Service authentication module instead of writing code to handle authentication and authorization. See [Authentication and authorization in Azure App Service](overview-authentication-authorization.md). |
| Protect back-end resources with authenticated access | You can either use the user's identity or use an application identity to authenticate to a back-end resource. When you choose to use an application identity use a [managed identity](overview-managed-identity.md).
| Require client certificate authentication | Client certificate authentication improves security by only allowing connections from clients that can authenticate using certificates that you provide. |

## Data protection

| Recommendation | Comments |
|-|-|
| Redirect HTTP to HTTPs | By default, clients can connect to web apps by using both HTTP or HTTPS. We recommend redirecting HTTP to HTTPs because HTTPS uses the SSL/TLS protocol to provide a secure connection, which is both encrypted and authenticated. |
| Encrypt communication to Azure resources | When your app connects to Azure resources, such as [SQL Database](https://azure.microsoft.com/services/sql-database/) or [Azure Storage](/azure/storage/), the connection stays in Azure. Since the connection goes through the shared networking in Azure, you should always encrypt all communication. |
| Require the latest TLS version possible | Since 2018 new Azure App Service apps use TLS 1.2. Newer versions of TLS include security improvements over older protocol versions. |
| Use FTPS | App Service supports both FTP and FTPS for deploying your files. Use FTPS instead of FTP when possible. When one or both of these protocols are not in use, you should [disable them](deploy-ftp.md#enforce-ftps). |
| Secure application data | Don't store application secrets, such as database credentials, API tokens, or private keys in your code or configuration files. The commonly accepted approach is to access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern in your language of choice. In Azure App Service, you can define environment variables through [app settings](web-sites-configure.md) and [connection strings](web-sites-configure.md). App settings and connection strings are stored encrypted in Azure. The app settings are decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly. Alternatively, you can integrate your Azure App Service app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. By [accessing the Key Vault with a managed identity](../key-vault/tutorial-web-application-keyvault.md), your App Service app can securely access the secrets you need. |

## Networking

| Recommendation | Comments |
|-|-|
| Use static IP restrictions | Azure App Service on Windows lets you define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses defined by a subnet mask. For more information, see [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md).  |
| Use the isolated pricing tier | Except for the isolated pricing tier, all tiers run your apps on the shared network infrastructure in Azure App Service. The isolated tier gives you complete network isolation by running your apps inside a dedicated [App Service environment](environment/intro.md). An App Service environment runs in your own instance of [Azure Virtual Network](/azure/virtual-network/).|
| Use secure connections when accessing on-premises resources | You can use [Hybrid connections](app-service-hybrid-connections.md), [Virtual Network integration](web-sites-integrate-with-vnet.md), or [App Service environment's](environment/intro.md) to connect to on-premises resources. |
| Limit exposure to inbound network traffic | Network security groups allow you to restrict network access and control the number of exposed endpoints. For more information, see [How To Control Inbound Traffic to an App Service Environment](environment/app-service-app-service-environment-control-inbound-traffic.md). |

## Monitoring

| Recommendation | Comments |
|-|-|
|Use Azure Security Center standard tier | [Azure Security Center](../security-center/security-center-app-services.md) is natively integrated with Azure App Service. It can run assessments and provide security recommendations. |

## Next steps

Check with your application provider to see if there are additional security requirements. For more information on developing secure applications, see [Secure Development Documentation](../security/abstract-develop-secure-apps.md).
