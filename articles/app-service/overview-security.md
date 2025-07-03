---
title: Security in Azure App Service
description: Learn about how Azure App Service helps secure your app, and how you can help protect your app from security threats.
keywords: azure app service, web app, mobile app, api app, function app, security, secure, secured, compliance, compliant, certificate, certificates, https, ftps, tls, trust, encryption, encrypt, encrypted, ip restriction, authentication, authorization, authn, autho, msi, managed service identity, managed identity, secrets, secret, patching, patch, patches, version, isolation, network isolation, ddos, mitm
ms.topic: overview
ms.date: 07/02/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3
author: cephalin
ms.author: cephalin

---
# Security in Azure App Service

This article describes how [Azure App Service](overview.md) helps secure your web app, mobile app back end, API app, or [function app](/azure/azure-functions/index). The article also describes how you can help secure your app further by using built-in App Service features.

[!INCLUDE [app-service-security-intro](../../includes/app-service-security-intro.md)]

The following sections describe more ways to help protect your App Service app from threats.

## HTTPS and certificates

You can use App Service to secure your apps through [HTTPS](https://wikipedia.org/wiki/HTTPS). When your app is created, its default domain name `<app_name>.azurewebsites.net` is already accessible via HTTPS. If you [configure a custom domain for your app](app-service-web-tutorial-custom-domain.md), help [secure it with a TLS/SSL certificate](configure-ssl-bindings.md) so that client browsers can make secure HTTPS connections to your custom domain.

App Service supports the following types of certificates:

- Free App Service managed certificate
- App Service certificate
- Third-party certificate
- Certificate imported from Azure Key Vault

For more information, see [Add and manage TLS/SSL certificates in Azure App Service](configure-ssl-certificate.md).

### Unsecured protocols (HTTP, TLS 1.0, FTP)

By default, App Service forces a redirect from HTTP requests to HTTPS. Unsecured requests are redirected before they reach your application code. To change this behavior, see [Configure general settings](configure-common.md#configure-general-settings).

Azure App Service supports the following [Transport Layer Security (TLS)](https://wikipedia.org/wiki/Transport_Layer_Security) versions for incoming requests to your web app:

- TLS 1.3: The latest and most secure version.
- TLS 1.2: The default minimum TLS version for new web apps.
- TLS 1.1 and TLS 1.0: Versions supported for backward compatibility, but not considered secure by industry standards such as the [Payment Card Industry Data Security Standard (PCI DSS)](https://wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard).

You can configure the minimum TLS version for incoming requests to your web app and its Source Control Manager (SCM) site. By default, the minimum is set to **TLS 1.2**. To enforce different TLS versions, see [Configure general settings]((configure-common.md#configure-general-settings).

App Service supports both FTP and FTPS for deploying app files. New apps are set to accept only FTPS by default. To increase security, use FTPS instead of FTP if possible. If you aren't using FTP/S, you should [disable it](deploy-ftp.md#enforce-ftps). For more information, see [Deploy your app to Azure App Service using FTP/S](deploy-ftp.md).

## Static IP restrictions

By default, your App Service app accepts requests from all internet IP addresses, but you can limit access to a subset of IP addresses. You can use App Service on Windows to define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses defined by a subnet mask. For more information, see [Set up Azure App Service access restrictions](app-service-ip-restrictions.md).

For App Service on Windows, you can also restrict IP addresses dynamically by configuring the *web.config* file. For more information, see [Dynamic IP Security \<dynamicIpSecurity>](/iis/configuration/system.webServer/security/dynamicIpSecurity/).

## Client authentication and authorization

App Service provides built-in authentication and authorization of users or client apps. You can implement your own authentication and authorization solution or allow App Service to handle it for you.

When enabled, built-in authentication and authorization can sign in users and client apps with little or no application code. The authentication and authorization module handles web requests before passing them to your application code, and denies unauthorized requests.

App Service authentication and authorization support multiple authentication providers, including Microsoft Entra ID, Microsoft accounts, Facebook, Google, and X. For more information, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).

## Service-to-service authentication

When you authenticate against a back-end service, App Service provides two mechanisms depending on your needs:

- **Service identity** signs in to the remote resource by using the identity of the app itself. In App Service, you can create a [managed identity](overview-managed-identity.md) to use to authenticate with other services, such as [Azure SQL Database](/azure/sql-database/) or [Azure Key Vault](/azure/key-vault/). For an end-to-end tutorial, see [Secure an Azure SQL Database connection from App Service by using a managed identity](tutorial-connect-msi-sql-database.md).

- **On behalf of (OBO)** delegates access to remote resources on behalf of the user. With Microsoft Entra ID as the authentication provider, your App Service app can perform delegated sign-in to a remote service such as [Microsoft Graph](/graph/overview) or to a remote App Service API app. For an end-to-end tutorial, see [Authenticate and authorize users end to end in Azure App Service](tutorial-auth-aad.md).

## Connectivity to remote resources

Your app might need to access [Azure resources](#azure-resources), [on-premises resources](#on-premises-resources), or [resources inside an Azure virtual network](#resources-inside-an-azure-virtual-network). App Service provides a secure connection method for each of these scenarios. You should also observe security best practices, such as always using encrypted connections even if the back-end resource allows unencrypted connections.

Also ensure that your back-end Azure service allows the smallest possible set of IP addresses. To find the outbound IP addresses for your app, see [Find outbound IPs](overview-inbound-outbound-ips.md#find-outbound-ips).

### Azure resources

When your app connects to Azure resources like [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) and [Azure Storage](/azure/storage/index), the connection stays in Azure and doesn't cross any network boundaries. The connection uses shared networking in Azure, so make sure it's encrypted.

If your app is hosted in an [App Service Environment](environment/intro.md), you should connect to supported Azure services by using [virtual network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

### Resources inside an Azure virtual network

Your app can access resources in an [Azure virtual network](/azure/virtual-network/index) through [virtual network integration](overview-vnet-integration.md) using point-to-site VPN. The app can then access the resources in the virtual network by using their private IP addresses. The point-to-site connection still traverses the shared networks in Azure.

To isolate your resource connectivity completely from the shared networks in Azure, create your app in an [App Service Environment](environment/intro.md). Because an App Service Environment is always deployed to a dedicated virtual network, connectivity between your app and other resources in the virtual network is fully isolated. For more information about network security in an App Service Environment, see [Network isolation](#network-isolation).

### On-premises resources

You can securely access on-premises resources like databases in several different ways.

- A [hybrid connection](app-service-hybrid-connections.md) establishes a point-to-point connection to your remote resource through a Transmission Control Protocol (TCP) tunnel that uses TLS 1.2 with shared access signature keys.
- [Virtual network integration](overview-vnet-integration.md) or [App Service Environment](environment/intro.md) use a site-to-site VPN as described in [Resources inside an Azure virtual network](#resources-inside-an-azure-virtual-network), but the virtual network is connected to your on-premises network through the [site-to-site VPN](/azure/vpn-gateway/tutorial-site-to-site-portal). In this network topology, your app can connect to on-premises resources the same way it connects to other resources in the virtual network.

## Application secrets

Don't store application secrets like database credentials, API tokens, and private keys in your code or configuration files. Instead, access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern for your code language. In App Service, you define environment variables through [app settings](configure-common.md#configure-app-settings) and, especially for .NET applications, [connection strings](configure-common.md#configure-connection-strings).

App settings and connection strings are stored encrypted in Azure and are decrypted just before they're injected into your app's process memory when the app starts. The encryption keys are rotated regularly.

Alternatively, you can integrate your App Service app with [Azure Key Vault](/azure/key-vault/) for advanced secrets management. Your App Service app can [access the key vault by using a managed identity](/azure/key-vault/general/tutorial-net-create-vault-azure-web-app) to securely access the secrets you need.

## Network isolation

All App Service pricing tiers run your apps on the Azure shared network infrastructure except for the Isolated pricing tier. For example, the public IP addresses and front-end load balancers are shared with other tenants. The Isolated tier gives you complete network isolation by running your apps inside a dedicated [App Service Environment](environment/intro.md) in your own instance of [Azure Virtual Network](/azure/virtual-network/index).

By using network isolation, you can:

- Serve your apps through a dedicated public endpoint with dedicated front ends.
- Serve internal application by using an internal load balancer (ILB) that allows access only from inside your Azure virtual network. The ILB has an IP address from your private subnet, which provides total isolation of your apps from the internet.
- [Use an ILB behind a web application firewall (WAF)](environment/integrate-with-application-gateway.md). The WAF offers enterprise-level URI filtering, protection from distributed denial-of-service (DDoS) attacks, and SQL injection prevention for your public-facing applications.

## DDoS protection

For web workloads, use a [WAF](/azure/web-application-firewall/overview) and [Azure DDoS protection](/azure/ddos-protection/ddos-protection-overview) to safeguard against emerging DDoS attacks. Another option is to deploy [Azure Front Door](/azure/frontdoor/web-application-firewall) with a WAF for platform-level [protection against network-level DDoS attacks](/azure/frontdoor/front-door-ddos).

## Related content

[Introduction to Azure App Service Environments](environment/intro.md)
