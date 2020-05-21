---
title: Security
description: Learn about how App Service helps secure your app, and how you can further lock down your app from threats. 
keywords: azure app service, web app, mobile app, api app, function app, security, secure, secured, compliance, compliant, certificate, certificates, https, ftps, tls, trust, encryption, encrypt, encrypted, ip restriction, authentication, authorization, authn, autho, msi, managed service identity, managed identity, secrets, secret, patching, patch, patches, version, isolation, network isolation, ddos, mitm
ms.topic: article
ms.date: 08/24/2018
ms.custom: seodec18

---
# Security in Azure App Service

This article shows you how [Azure App Service](overview.md) helps secure your web app, mobile app back end, API app, and [function app](/azure/azure-functions/). It also shows how you can further secure your app with the built-in App Service features.

[!INCLUDE [app-service-security-intro](../../includes/app-service-security-intro.md)]

The following sections show you how to further protect your App Service app from threats.

## HTTPS and Certificates

App Service lets you secure your apps with [HTTPS](https://wikipedia.org/wiki/HTTPS). When your app is created, its default domain name (\<app_name>.azurewebsites.net) is already accessible using HTTPS. If you [configure a custom domain for your app](app-service-web-tutorial-custom-domain.md), you should also [secure it with a TLS/SSL certificate](configure-ssl-bindings.md) so that client browsers can make secured HTTPS connections to your custom domain. There are several types of certificates supported by App Service:

- Free App Service Managed Certificate
- App Service certificate
- Third-party certificate
- Certificate imported from Azure Key Vault

For more information, see [Add a TLS/SSL certificate in Azure App Service](configure-ssl-certificate.md).

## Insecure protocols (HTTP, TLS 1.0, FTP)

To secure your app against all unencrypted (HTTP) connections, App Service provides one-click configuration to enforce HTTPS. Unsecured requests are turned away before they even reach your application code. For more information, see [Enforce HTTPS](configure-ssl-bindings.md#enforce-https).

[TLS](https://wikipedia.org/wiki/Transport_Layer_Security) 1.0 is no longer considered secure by industry standards, such as [PCI DSS](https://wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard). App Service lets you disable outdated protocols by [enforcing TLS 1.1/1.2](configure-ssl-bindings.md#enforce-tls-versions).

App Service supports both FTP and FTPS for deploying your files. However, FTPS should be used instead of FTP, if at all possible. When one or both of these protocols are not in use, you should [disable them](deploy-ftp.md#enforce-ftps).

## Static IP restrictions

By default, your App Service app accepts requests from all IP addresses from the internet, but you can limit that access to a small subset of IP addresses. App Service on Windows lets you define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses defined by a subnet mask. For more information, see [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md).

For App Service on Windows, you can also restrict IP addresses dynamically by configuring the _web.config_. For more information, see [Dynamic IP Security \<dynamicIpSecurity>](https://docs.microsoft.com/iis/configuration/system.webServer/security/dynamicIpSecurity/).

## Client authentication and authorization

Azure App Service provides turn-key authentication and authorization of users or client apps. When enabled, it can sign in users and client apps with little or no application code. You may implement your own authentication and authorization solution, or allow App Service to handle it for you instead. The authentication and authorization module handles web requests before handing them off to your application code, and it denies unauthorized requests before they reach your code.

App Service authentication and authorization support multiple authentication providers, including Azure Active Directory, Microsoft accounts, Facebook, Google, and Twitter. For more information, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).

## Service-to-service authentication

When authenticating against a back-end service, App Service provides two different mechanisms depending on your need:

- **Service identity** - Sign in to the remote resource using the identity of the app itself. App Service lets you easily create a [managed identity](overview-managed-identity.md), which you can use to authenticate with other services, such as [Azure SQL Database](/azure/sql-database/) or [Azure Key Vault](/azure/key-vault/). For an end-to-end tutorial of this approach, see [Secure Azure SQL Database connection from App Service using a managed identity](app-service-web-tutorial-connect-msi.md).
- **On-behalf-of (OBO)** - Make delegated access to remote resources on behalf of the user. With Azure Active Directory as the authentication provider, your App Service app can perform delegated sign-in to a remote service, such as [Microsoft Graph API](../active-directory/develop/microsoft-graph-intro.md) or a remote API app in App Service. For an end-to-end tutorial of this approach, see [Authenticate and authorize users end-to-end in Azure App Service](app-service-web-tutorial-auth-aad.md).

## Connectivity to remote resources

There are three types of remote resources your app may need to access: 

- [Azure resources](#azure-resources)
- [Resources inside an Azure Virtual Network](#resources-inside-an-azure-virtual-network)
- [On-premises resources](#on-premises-resources)

In each of these cases, App Service provides a way for you to make secure connections, but you should still observe security best practices. For example, always use encrypted connections even if the back-end resource allows unencrypted connections. Furthermore, make sure that your back-end Azure service allows the minimum set of IP addresses. You can find the outbound IP addresses for your app at [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md).

### Azure resources

When your app connects to Azure resources, such as [SQL Database](https://azure.microsoft.com/services/sql-database/) and [Azure Storage](/azure/storage/), the connection stays within Azure and doesn't cross any network boundaries. However, the connection goes through the shared networking in Azure, so always make sure that your connection is encrypted. 

If your app is hosted in an [App Service environment](environment/intro.md), you should [connect to supported Azure services using Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

### Resources inside an Azure Virtual Network

Your app can access resources in an [Azure Virtual Network](/azure/virtual-network/) through [Virtual Network integration](web-sites-integrate-with-vnet.md). The integration is established with a Virtual Network using a point-to-site VPN. The app can then access the resources in the Virtual Network using their private IP addresses. The point-to-site connection, however, still traverses the shared networks in Azure. 

To isolate your resource connectivity completely from the shared networks in Azure, create your app in an [App Service environment](environment/intro.md). Since an App Service environment is always deployed to a dedicated Virtual Network, connectivity between your app and resources within the Virtual Network is fully isolated. For other aspects of network security in an App Service environment, see [Network isolation](#network-isolation).

### On-premises resources

You can securely access on-premises resources, such as databases, in three ways: 

- [Hybrid connections](app-service-hybrid-connections.md) - Establishes a point-to-point connection to your remote resource through a TCP tunnel. The TCP tunnel is established using TLS 1.2 with shared access signature (SAS) keys.
- [Virtual Network integration](web-sites-integrate-with-vnet.md) with site-to-site VPN - As described in [Resources inside an Azure Virtual Network](#resources-inside-an-azure-virtual-network), but the Virtual Network can be connected to your on-premises network through a [site-to-site VPN](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md). In this network topology, your app can connect to on-premises resources like other resources in the Virtual Network.
- [App Service environment](environment/intro.md) with site-to-site VPN - As described in [Resources inside an Azure Virtual Network](#resources-inside-an-azure-virtual-network), but the Virtual Network can be connected to your on-premises network through a [site-to-site VPN](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md). In this network topology, your app can connect to on-premises resources like other resources in the Virtual Network.

## Application secrets

Don't store application secrets, such as database credentials, API tokens, and private keys in your code or configuration files. The commonly accepted approach is to access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern in your language of choice. In App Service, the way to define environment variables is through [app settings](configure-common.md#configure-app-settings) (and, especially for .NET applications, [connection strings](configure-common.md#configure-connection-strings)). App settings and connection strings are stored encrypted in Azure, and they're decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly.

Alternatively, you can integrate your App Service app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. By [accessing the Key Vault with a managed identity](../key-vault/tutorial-web-application-keyvault.md), your App Service app can securely access the secrets you need.

## Network isolation

Except for the **Isolated** pricing tier, all tiers run your apps on the shared network infrastructure in App Service. For example, the public IP addresses and front-end load balancers are shared with other tenants. The **Isolated** tier gives you complete network isolation by running your apps inside a dedicated [App Service environment](environment/intro.md). An App Service environment runs in your own instance of [Azure Virtual Network](/azure/virtual-network/). It lets you: 

- Serve your apps through a dedicated public endpoint, with dedicated front ends.
- Serve internal application using an internal load balancer (ILB), which allows access only from inside your Azure Virtual Network. The ILB has an IP address from your private subnet, which provides total isolation of your apps from the internet.
- [Use an ILB behind a web application firewall (WAF)](environment/integrate-with-application-gateway.md). The WAF offers enterprise-level protection to your public-facing applications, such as DDoS protection, URI filtering, and SQL injection prevention.

For more information, see [Introduction to Azure App Service Environments](environment/intro.md). 
