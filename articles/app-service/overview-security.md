---
title: Secure your Azure App Service deployment
description: Learn how to secure Azure App Service, with best practices for protecting your deployment.
keywords: azure app service, web app, mobile app, api app, function app, security, secure, secured, compliance, compliant, certificate, certificates, https, ftps, tls, trust, encryption, encrypt, encrypted, ip restriction, authentication, authorization, authn, autho, msi, managed service identity, managed identity, secrets, secret, patching, patch, patches, version, isolation, network isolation, ddos, mitm
ms.topic: overview
ms.date: 12/03/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3, horz-security
author: cephalin
ms.author: cephalin

ms.service: azure-app-service
---
# Secure your Azure App Service deployment

Azure App Service provides a platform-as-a-service (PaaS) environment that enables you to build, deploy, and scale web apps, mobile app backends, RESTful APIs, and function apps. When deploying this service, it's important to follow security best practices to protect your applications, data, and infrastructure.

This article provides guidance on how to best secure your Azure App Service deployment.

[!INCLUDE [app-service-security-intro](../../includes/app-service-security-intro.md)]

## Network security

App Service supports many network security features to lock down your applications and prevent unauthorized access.

- **Configure private endpoints**: Eliminate public internet exposure by routing traffic to your App Service through your virtual network using Azure Private Link, ensuring secure connectivity for clients in your private networks. See [Use private endpoints for Azure App Service](/azure/app-service/networking/private-endpoint).

- **Implement virtual network integration**: Secure your outbound traffic by enabling your app to access resources in or through an Azure virtual network while maintaining isolation from the public internet. See [Integrate your app with an Azure virtual network](/azure/app-service/overview-vnet-integration).

- **Configure IP access restrictions**: Restrict access to your app by defining an allow list of IP addresses and subnets that can access your application, blocking all other traffic. You can define individual IP addresses or ranges defined by subnet masks, and configure dynamic IP restrictions through web.config files on Windows apps. See [Set up Azure App Service access restrictions](/azure/app-service/app-service-ip-restrictions).

- **Set up service endpoint restrictions**: Lock down inbound access to your app from specific subnets in your virtual networks using service endpoints, which work together with IP access restrictions to provide network-level filtering. See [Azure App Service access restrictions](/azure/app-service/overview-access-restrictions).

- **Use Web Application Firewall**: Enhance protection against common web vulnerabilities and attacks by implementing Azure Front Door or Application Gateway with Web Application Firewall capabilities in front of your App Service. See [Azure Web Application Firewall on Azure Application Gateway](/azure/web-application-firewall/ag/ag-overview).

## Identity and access management

Properly managing identities and access controls is essential for securing your Azure App Service deployments against unauthorized usage and potential credential theft.

- **Enable managed identities for outgoing requests**: Authenticate to Azure services securely from your app without storing credentials in your code or configuration by using managed identities, eliminating the need to manage service principals and connection strings. Managed identities provide an automatically managed identity in Microsoft Entra ID for your app to use when making outgoing requests to other Azure services like Azure SQL Database, Azure Key Vault, and Azure Storage. App Service supports both system-assigned and user-assigned managed identities. See [Use managed identities for App Service and Azure Functions](/azure/app-service/overview-managed-identity).

- **Configure authentication and authorization**: Implement App Service Authentication/Authorization to secure your application with Microsoft Entra ID or other identity providers, preventing unauthorized access without writing custom authentication code. The built-in authentication module handles web requests before passing them to your application code and supports multiple providers including Microsoft Entra ID, Microsoft accounts, Facebook, Google, and X. See [Authentication and authorization in Azure App Service](/azure/app-service/overview-authentication-authorization).

- **Implement role-based access control for management operations**: Control who can manage and configure your App Service resources (management plane) by assigning the minimum necessary Azure RBAC permissions to users and service principals following the principle of least privilege. This controls administrative access to operations like creating apps, modifying configuration settings, and managing deployments—separate from application-level authentication (Easy Auth) or app-to-resource authentication (managed identities). See [Azure built-in roles](/azure/role-based-access-control/built-in-roles#web-plan-contributor).

- **Implement on-behalf-of authentication**: Delegate access to remote resources on behalf of users using Microsoft Entra ID as the authentication provider. Your App Service app can perform delegated sign-in to services like Microsoft Graph or remote App Service API apps. For an end-to-end tutorial, see [Authenticate and authorize users end to end in Azure App Service](/azure/app-service/tutorial-auth-aad).

- **Enable mutual TLS authentication**: Require client certificates for added security when your application needs to verify client identity, particularly for B2B scenarios or internal applications. See [Configure TLS mutual authentication for Azure App Service](/azure/app-service/app-service-web-configure-tls-mutual-auth).

<a name='https-and-certificates'></a>
## Data protection

Protecting data in transit and at rest is crucial for maintaining the confidentiality and integrity of your applications and their data.

- **Enforce HTTPS**: Redirect all HTTP traffic to HTTPS by enabling HTTPS-only mode, ensuring that all communication between clients and your app is encrypted. By default, App Service forces a redirect from HTTP requests to HTTPS, and your app's default domain name `<app_name>.azurewebsites.net` is already accessible via HTTPS. See [Configure general settings](/azure/app-service/configure-common#configure-general-settings).

- **Configure TLS version**: Use modern TLS protocols by configuring the minimum TLS version to 1.2 or higher, and disable outdated, insecure protocols to prevent potential vulnerabilities. App Service supports TLS 1.3 (latest), TLS 1.2 (default minimum), and TLS 1.1/1.0 (for backward compatibility only). Configure the minimum TLS version for both your web app and SCM site. See [Configure general settings](/azure/app-service/configure-common#configure-general-settings).

- **Manage TLS/SSL certificates**: Secure custom domains by using properly configured TLS/SSL certificates to establish trusted connections. App Service supports multiple certificate types: free App Service managed certificates, App Service certificates, third-party certificates, and certificates imported from Azure Key Vault. If you configure a custom domain, secure it with a TLS/SSL certificate so browsers can make secure HTTPS connections. See [Add and manage TLS/SSL certificates in Azure App Service](/azure/app-service/configure-ssl-certificate).

- **Store secrets in Key Vault**: Protect sensitive configuration values like database credentials, API tokens, and private keys by storing them in Azure Key Vault and accessing them using managed identities, rather than storing them in application settings or code. Your App Service app can securely access Key Vault using managed identity authentication. See [Use Key Vault references for App Service and Azure Functions](/azure/app-service/app-service-key-vault-references).

- **Encrypt application settings**: Use encrypted app settings and connection strings instead of storing secrets in code or configuration files. App Service stores these values encrypted in Azure and decrypts them just before injection into your app's process memory when the app starts, with encryption keys rotated regularly. Access these values as environment variables using standard patterns for your programming language. See [Configure app settings](/azure/app-service/configure-common#configure-app-settings).

- **Secure remote connections**: Always use encrypted connections when accessing remote resources, even if the back-end resource allows unencrypted connections. For Azure resources like Azure SQL Database and Azure Storage, connections stay within Azure and don't cross network boundaries. For virtual network resources, use virtual network integration with point-to-site VPN. For on-premises resources, use hybrid connections with TLS 1.2 or virtual network integration with site-to-site VPN. Ensure back-end Azure services allow only the smallest possible set of IP addresses from your app. See [Find outbound IPs](/azure/app-service/overview-inbound-outbound-ips#find-outbound-ips).

## Logging and monitoring

Implementing comprehensive logging and monitoring is essential for detecting potential security threats and troubleshooting issues with your Azure App Service deployment.

- **Enable diagnostic logging**: Configure Azure App Service diagnostic logs to track application errors, web server logs, failed request traces, and detailed error messages to identify security issues and troubleshoot problems. See [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs).

- **Integrate with Azure Monitor**: Set up Azure Monitor to collect and analyze logs and metrics from your App Service, enabling comprehensive monitoring and alerting for security events and performance issues. See [Monitor apps in Azure App Service](/azure/app-service/web-sites-monitor).

- **Configure Application Insights**: Implement Application Insights to gain detailed insights into application performance, usage patterns, and potential security issues, with real-time monitoring and analytics capabilities. See [Monitor Azure App Service performance](/azure/azure-monitor/app/azure-web-apps).

- **Set up security alerts**: Create custom alerts to notify you of abnormal usage patterns, potential security breaches, or service disruptions affecting your App Service resources. See [Create, view, and manage metric alerts using Azure Monitor](/azure/azure-monitor/alerts/alerts-metric).

- **Enable health checks**: Configure health checks to monitor your application's operational status and automatically remediate issues when possible. See [Monitor App Service instances using Health check](/azure/app-service/monitor-instances-health-check).

## Compliance and governance

Establishing proper governance and ensuring compliance with relevant standards is crucial for the secure operation of Azure App Service applications.

- **Implement Azure Policy**: Enforce organization-wide security standards for your App Service deployments by creating and assigning Azure Policy definitions that audit and enforce compliance requirements. See [Azure Policy Regulatory Compliance controls for Azure App Service](/azure/app-service/security-controls-policy).

- **Review security recommendations**: Regularly assess your App Service security posture using Microsoft Defender for Cloud to identify and remediate security vulnerabilities and misconfigurations. See [Protect your Azure App Service web apps and APIs](/azure/defender-for-cloud/defender-for-app-service-introduction).

- **Conduct security assessments**: Perform regular security assessments and penetration testing of your App Service applications to identify potential vulnerabilities and security weaknesses. See [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).

- **Maintain regulatory compliance**: Configure your App Service deployments in accordance with applicable regulatory requirements for your industry and region, particularly regarding data protection and privacy. See [Azure compliance documentation](/azure/compliance/).

- **Implement secure DevOps practices**: Establish secure CI/CD pipelines for deploying applications to App Service, including code scanning, dependency checks, and automated security testing. See [DevSecOps in Azure](/azure/architecture/solution-ideas/articles/devsecops-in-azure).

## Backup and recovery

Implementing robust backup and recovery mechanisms is essential for ensuring business continuity and data protection in your Azure App Service deployments.

- **Enable automated backups**: Configure scheduled backups for your App Service applications to ensure you can recover your applications and data in case of accidental deletion, corruption, or other failures. See [Back up and restore your app in Azure App Service](/azure/app-service/manage-backup).

- **Configure backup retention**: Set appropriate retention periods for your backups based on your business requirements and compliance needs, ensuring critical data is preserved for the required duration. See [Back up and restore your app in Azure App Service](/azure/app-service/manage-backup).

- **Implement multi-region deployments**: Deploy your critical applications across multiple regions to provide high availability and disaster recovery capabilities in case of regional outages. See [Tutorial: Create a highly available multi-region app in App Service](/azure/app-service/tutorial-multi-region-app).

- **Test backup restoration**: Regularly test your backup restoration process to ensure backups are valid and can be successfully restored when needed, verifying both application functionality and data integrity. See [Restore an app from a backup](/azure/app-service/manage-backup#restore-an-app-from-a-backup).

- **Document recovery procedures**: Create and maintain comprehensive documentation for recovery procedures, ensuring quick and effective response during service disruptions or disasters.

## Service-specific security

Azure App Service has unique security considerations that should be addressed to ensure the overall security of your web applications.

- **Disable basic authentication**: Disable basic username and password authentication for FTP and SCM endpoints in favor of Microsoft Entra ID-based authentication, which provides OAuth 2.0 token-based authentication with enhanced security. See [Disable basic authentication in Azure App Service deployments](/azure/app-service/configure-basic-auth-disable).

- **Secure FTP/FTPS deployments**: Disable FTP access or enforce FTPS-only mode when using FTP for deployments to prevent credentials and content from being transmitted in clear text. New apps are set to accept only FTPS by default. See [Deploy your app to Azure App Service using FTP/S](/azure/app-service/deploy-ftp).

- **Achieve complete network isolation**: Use the App Service Environment to run your apps inside a dedicated App Service Environment in your own Azure Virtual Network instance. This provides complete network isolation from shared infrastructure with dedicated public endpoints, internal load balancer (ILB) options for internal-only access, and the ability to use an ILB behind a web application firewall for enterprise-level protection. See [Introduction to Azure App Service Environments](/azure/app-service/environment/intro).

- **Implement DDoS protection**: Use a Web Application Firewall (WAF) and Azure DDoS protection to safeguard against emerging DDoS attacks. Deploy Azure Front Door with a WAF for platform-level protection against network-level DDoS attacks. See [Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview) and [Azure Front Door with WAF](/azure/frontdoor/front-door-ddos).

## Related content

- [Introduction to Azure App Service Environments](environment/intro.md)
- [Managed identities for App Service](overview-managed-identity.md)
