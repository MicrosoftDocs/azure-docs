---
title: What Is Security in Azure App Service?
description: Learn about how Azure App Service helps secure your app, and how you can help protect your app from threats. 
keywords: azure app service, web app, mobile app, api app, function app, security, secure, secured, compliance, compliant, certificate, certificates, https, ftps, tls, trust, encryption, encrypt, encrypted, ip restriction, authentication, authorization, authn, autho, msi, managed service identity, managed identity, secrets, secret, patching, patch, patches, version, isolation, network isolation, ddos, mitm
ms.topic: overview
ms.date: 08/24/2018
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3
author: cephalin
ms.author: cephalin

---
# What is security in Azure App Service?

This article describes how [Azure App Service](overview.md) helps secure your web app, mobile app back end, API app, and [function app](../azure-functions/index.yml). It also shows you how to further help secure your app by using built-in App Service features.

[!INCLUDE [app-service-security-intro](../../includes/app-service-security-intro.md)]

The following sections show you how to further help protect your App Service app from threats.

## HTTPS and certificates

You can use App Service to secure your apps through [HTTPS](https://wikipedia.org/wiki/HTTPS). When your app is created, its default domain name (`<app_name>.azurewebsites.net`) is already accessible by using HTTPS. If you [configure a custom domain for your app](app-service-web-tutorial-custom-domain.md), you should also [help secure it with a TLS/SSL certificate](configure-ssl-bindings.md) so that client browsers can make secured HTTPS connections to your custom domain.

App Service supports these types of certificates:

- Free App Service managed certificate
- App Service certificate
- Third-party certificate
- Certificate imported from Azure Key Vault

For more information, see [Add a TLS/SSL certificate in Azure App Service](configure-ssl-certificate.md).

## Unsecured protocols (HTTP, TLS 1.0, FTP)

To secure your app against all unencrypted (HTTP) connections, App Service provides one-click configuration to enforce HTTPS. Unsecured requests are turned away before they even reach your application code. For more information, see [Enforce HTTPS](configure-ssl-bindings.md#enforce-https).

[TLS](https://wikipedia.org/wiki/Transport_Layer_Security) 1.0 is no longer considered secure by industry standards, such as the [PCI DSS](https://wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard). Use App Service to disable outdated protocols by [enforcing TLS 1.1/TLS 1.2](configure-ssl-bindings.md#enforce-tls-versions).

App Service supports both FTP and FTPS for deploying your files. To increase security, use FTPS instead of FTP, if at all possible. When one or both of these protocols aren't in use, you should [disable them](deploy-ftp.md#enforce-ftps).

## Static IP restrictions

By default, your App Service app accepts requests from all IP addresses from the internet, but you can limit that access to a small subset of IP addresses. You can use App Service on Windows to define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses that are defined by a subnet mask. For more information, see [Azure App Service static IP restrictions](app-service-ip-restrictions.md).

For App Service on Windows, you can also restrict IP addresses dynamically by configuring the `web.config` file. For more information, see [Dynamic IP Security \<dynamicIpSecurity>](/iis/configuration/system.webServer/security/dynamicIpSecurity/).

## Client authentication and authorization

Azure App Service provides turn-key authentication and authorization of users or client apps. When enabled, it can sign in users and client apps with little or no application code. You can implement your own authentication and authorization solution or allow App Service to handle it for you. The authentication and authorization module handles web requests before handing them off to your application code. It denies unauthorized requests before they reach your code.

App Service authentication and authorization support multiple authentication providers, including Microsoft Entra ID, Microsoft accounts, Facebook, Google, and X. For more information, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).

## Service-to-service authentication

When you authenticate against a back-end service, App Service provides two mechanisms depending on your need:

- **Service identity**: Sign in to the remote resource by using the identity of the app itself. In App Service, you can easily create a [managed identity](overview-managed-identity.md), which you can use to authenticate with other services, such as [Azure SQL Database](/azure/sql-database/) or [Azure Key Vault](/azure/key-vault/). For an end-to-end tutorial of this approach, see [Secure an Azure SQL Database connection from App Service by using a managed identity](tutorial-connect-msi-sql-database.md).
- **On behalf of (OBO)**: Make delegated access to remote resources on behalf of the user. With Microsoft Entra ID as the authentication provider, your App Service app can perform delegated sign-in to a remote service, such as to [Microsoft Graph](/graph/overview) or to a remote API app in App Service. For an end-to-end tutorial of this approach, see [Authenticate and authorize users end to end in Azure App Service](tutorial-auth-aad.md).

## Connectivity to remote resources

Your app might need to access three types of remote resources:

- [Azure resources](#azure-resources)
- [Resources inside an Azure virtual network](#resources-inside-an-azure-virtual-network)
- [On-premises resources](#on-premises-resources)

In each of these scenarios, App Service provides a way for you to make secure connections, but you should still observe security best practices. For example, always use encrypted connections, even if the back-end resource allows unencrypted connections. Also ensure that your back-end Azure service allows the minimum set of IP addresses. You can find the outbound IP addresses for your app at [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md).

### Azure resources

When your app connects to Azure resources like [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) and [Azure Storage](../storage/index.yml), the connection stays in Azure and doesn't cross any network boundaries. However, the connection goes through the shared networking in Azure, so always make sure that your connection is encrypted.

If your app is hosted in an [App Service Environment](environment/intro.md), you should [connect to supported Azure services by using virtual network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).

### Resources inside an Azure virtual network

Your app can access resources in an [Azure virtual network](../virtual-network/index.yml) through [virtual network integration](./overview-vnet-integration.md). The integration is established with a virtual network by using a point-to-site VPN. The app can then access the resources in the virtual network by using their private IP addresses. The point-to-site connection, however, still traverses the shared networks in Azure.

To isolate your resource connectivity completely from the shared networks in Azure, create your app in an [App Service Environment](environment/intro.md). Because an App Service Environment is always deployed to a dedicated virtual network, connectivity between your app and resources in the virtual network is fully isolated. For more information about network security in an App Service Environment, see [Network isolation](#network-isolation).

### On-premises resources

You can securely access on-premises resources, such as databases, in three ways:

- **[Hybrid connection](app-service-hybrid-connections.md)**: Use a hybrid connection to establish a point-to-point connection to your remote resource through a TCP tunnel. The TCP tunnel is established by using TLS 1.2 with shared access signature keys.
- **[Virtual network integration](./overview-vnet-integration.md) with a site-to-site VPN**: As described in [Resources inside an Azure virtual network](#resources-inside-an-azure-virtual-network), but in virtual network integration, the virtual network can be connected to your on-premises network through a [site-to-site VPN](../vpn-gateway/tutorial-site-to-site-portal.md). In this network topology, your app can connect to on-premises resources like it connects to other resources in the virtual network.
- **[App Service Environment](environment/intro.md) with a site-to-site VPN**: As described in [Resources inside an Azure virtual network](#resources-inside-an-azure-virtual-network), but in an App Service Environment, the virtual network can be connected to your on-premises network through a [site-to-site VPN](../vpn-gateway/tutorial-site-to-site-portal.md). In this network topology, your app can connect to on-premises resources like it connects to other resources in the virtual network.

## Application secrets

Don't store application secrets like database credentials, API tokens, and private keys in your code or configuration files. The commonly accepted approach is to access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) by using the standard pattern in your language of choice. In App Service, the way to define environment variables is through [app settings](configure-common.md#configure-app-settings) (and, especially for .NET applications, [connection strings](configure-common.md#configure-connection-strings)). App settings and connection strings are stored encrypted in Azure. They're decrypted only before they're injected into your app's process memory when the app starts. The encryption keys are rotated regularly.

Alternatively, you can integrate your App Service app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. By [accessing the key vault by using a managed identity](/azure/key-vault/general/tutorial-net-create-vault-azure-web-app), your App Service app can securely access the secrets you need.

## Network isolation

Except for the Isolated pricing tier, all tiers run your apps on the shared network infrastructure in App Service. For example, the public IP addresses and front-end load balancers are shared with other tenants. The Isolated tier gives you complete network isolation by running your apps inside a dedicated [App Service Environment](environment/intro.md). An App Service Environment runs in your own instance of [Azure Virtual Network](../virtual-network/index.yml).

You can:

- Serve your apps through a dedicated public endpoint, with dedicated front ends.
- Serve internal application by using an internal load balancer (ILB), which allows access only from inside your Azure virtual network. The ILB has an IP address from your private subnet, which provides total isolation of your apps from the internet.
- [Use an ILB behind a web application firewall (WAF)](environment/integrate-with-application-gateway.md). The WAF offers enterprise-level protection to your public-facing applications, such as protection from a distributed denial-of-service (DDoS) attack, URI filtering, and preventing SQL injection.

## DDoS protection

For web workloads, we highly recommend that you use [Azure DDoS protection](../ddos-protection/ddos-protection-overview.md) and a [WAF](../web-application-firewall/overview.md) to safeguard against emerging DDoS attacks. Another option is to deploy [Azure Front Door](../frontdoor/web-application-firewall.md) with a WAF. Azure Front Door offers platform-level [protection against network-level DDoS attacks](../frontdoor/front-door-ddos.md).

For more information, see [Introduction to Azure App Service Environments](environment/intro.md).
