---
title: Secure your Azure API Management deployment
description: Learn how to secure Azure API Management, with best practices for protecting your gateway, APIs, and backend services.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-api-management
ms.topic: best-practice
ms.custom: horz-security
ms.date: 09/18/2026
ai-usage: ai-generated
---

# Secure your Azure API Management deployment

Azure API Management provides a managed gateway that publishes, secures, and governs APIs that front your backend services. Because the gateway sits between untrusted clients and your backends, its configuration directly determines the attack surface of every API you expose. Follow security best practices to protect the gateway, the APIs it publishes, the secrets it holds, and the backends it reaches.

This article provides security recommendations to help protect your Azure API Management deployment.

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

API Management is an ingress point for backend APIs, so much of its security value comes from what the gateway enforces on requests before they reach your services. Use gateway policies to validate, throttle, and authorize traffic, and don't treat subscription keys as an identity mechanism.

- **Validate API requests and responses at the gateway**: Apply the `validate-content` and `validate-parameters` policies to enforce request body, path, query, and header schemas before requests reach backends, and the `validate-headers` and `validate-status-code` policies to check backend responses before they return to clients. For more information, see [Content validation policies](api-management-policies.md#content-validation).
- **Mitigate common API threats**: Configure the policies recommended for the OWASP API Security Top 10 to protect published APIs from injection, excessive data exposure, and other API-specific attacks. For more information, see [Mitigate OWASP API security threats](mitigate-owasp-api-threats.md).
- **Apply rate limits and quotas to protect backends**: Use the `rate-limit-by-key` policy to throttle abusive callers and the `quota-by-key` policy to enforce renewable or lifetime call-volume quotas, shielding backend services from traffic spikes and denial-of-service conditions. For more information, see [Rate limiting and quota policies](api-management-policies.md#rate-limiting-and-quotas).
- **Do not rely on subscription keys as an authentication mechanism**: A subscription key identifies an API Management subscription, not a user or app, and is prone to being shared or leaked. Authenticate callers with OAuth 2.0 or client certificates instead, and treat subscription keys only as coarse access control. For more information, see [Authentication and authorization to APIs](authentication-authorization-overview.md).

## Network security

By default, the API Management gateway is reachable from the public internet. Reducing that exposure and controlling both inbound and outbound traffic is the highest-impact hardening you can do.

- **Restrict inbound access with a private endpoint**: Configure an inbound private endpoint so clients on your virtual network reach the gateway over Azure Private Link instead of a public IP address. For more information, see [Connect privately to API Management using an inbound private endpoint](private-endpoint.md).
- **Disable public network access**: When you connect clients through a private endpoint, turn off public network access so the gateway accepts traffic only from approved private connections. For more information, see [Connect privately to API Management using an inbound private endpoint](private-endpoint.md).
- **Isolate the gateway in a virtual network**: Use a supported virtual network model to control connectivity to backends and other Azure resources: virtual network injection for Premium v2 or classic Developer and Premium instances, or virtual network integration for outbound access in the Standard v2 and Premium v2 tiers. For more information, see [Use a virtual network with API Management](virtual-network-concepts.md).
    - **Use internal mode for private gateways**: Deploy the gateway in internal virtual network mode when it should be reachable only from within your network. For more information, see [Deploy API Management in an internal virtual network](api-management-using-with-internal-vnet.md).
- **Control outbound connectivity with virtual network integration**: In the Standard v2 and Premium v2 tiers, integrate the gateway with a virtual network so calls to backends traverse your network and honor network security group and firewall rules. For more information, see [Integrate a v2 tier instance with a virtual network for outbound connectivity](integrate-vnet-outbound.md).
- **Front the gateway with a web application firewall**: Place Azure Application Gateway with Web Application Firewall ahead of an internal API Management instance to inspect and filter inbound traffic before it reaches the gateway. For more information, see [Integrate API Management in an internal virtual network with Application Gateway](api-management-howto-integrate-internal-vnet-appgateway.md).
- **Filter client traffic by IP address**: Use the `ip-filter` policy to allow or deny calls from specific IP addresses or ranges at the API or operation level. For more information, see [ip-filter policy](ip-filter-policy.md).
- **Enable DDoS protection for network-injected instances**: For classic Developer or Premium instances injected into a virtual network in external mode, enable Azure DDoS Protection on the virtual network to defend the exposed gateway endpoints against volumetric attacks. In internal mode, DDoS Protection covers only the management endpoint on port 3443. For more information, see [Defend API Management against DDoS attacks](protect-with-ddos-protection.md).
- **Protect backend resources with a network security perimeter**: Front a network security perimeter-protected Azure resource with API Management and authenticate to it with the gateway's managed identity so the backend rejects public access. For more information, see [Front a network security perimeter-protected resource with API Management](using-network-security-perimeter.md).

## TLS and HTTPS

API Management supports TLS versions up to TLS 1.3 for both client-side and backend connections, with TLS 1.2 enabled by default. Restrict the gateway to strong protocols and enforce certificate-based trust where appropriate.

- **Disable outdated TLS protocols and weak ciphers**: Turn off TLS 1.0, TLS 1.1, SSL 3.0, and weak cipher suites on the configurable client-side and backend-side settings so the gateway negotiates only strong transport security. The Consumption, Basic v2, Standard v2, and Premium v2 tiers don't support changes to the default cipher configuration, and managed workspace gateways don't support changes to the default protocol or cipher configuration. For more information, see [Manage protocols and ciphers in API Management](api-management-howto-manage-protocols-ciphers.md).
- **Require client certificate (mutual TLS) authentication**: Require and validate client certificates at the gateway to authenticate calling apps, and check certificate properties with the `validate-client-certificate` policy. For more information, see [Secure APIs using client certificate authentication](api-management-howto-mutual-certificates-for-clients.md).
- **Authenticate to backends with client certificates**: Present a managed client certificate from the gateway to backend services so the backend accepts calls only from API Management. For more information, see [Secure backend services using client certificate authentication](api-management-howto-mutual-certificates.md).

## Identity and access management

Separate control-plane access (who can manage the service) from data-plane access (who can call the APIs), and apply least privilege to both.

- **Authorize API access with OAuth 2.0 and Microsoft Entra ID**: Validate JSON Web Tokens at the gateway with the `validate-jwt` or `validate-azure-ad-token` policy so only callers presenting valid tokens reach your backends. For more information, see [Authentication and authorization to APIs](authentication-authorization-overview.md).
    - **Protect backend APIs with Microsoft Entra ID**: Configure backend API authorization so the gateway obtains and passes valid tokens to the backend. For more information, see [Protect an API backend with Microsoft Entra ID](api-management-howto-protect-backend-with-aad.md).
- **Assign least-privilege built-in RBAC roles for the control plane**: Grant the narrowest role that fits each operator's job rather than broad ownership. Use *API Management Service Reader* for read-only access, *API Management Service Operator* to manage the service but not its entities, and reserve *API Management Service Contributor* for full administrators; use the API Management workspace roles and *API Management Developer Portal Content Editor* for scoped tasks. For more information, see [Use role-based access control in API Management](api-management-role-based-access-control.md).
- **Enable a managed identity for the instance**: Configure a system-assigned or user-assigned managed identity so the gateway authenticates to Key Vault, backends, and other Azure resources without stored credentials. For more information, see [Use managed identities in API Management](api-management-howto-use-managed-service-identity.md).
- **Manage subscription keys securely**: Regenerate keys on a regular schedule, require a subscription key on APIs that need it, and rotate the primary and secondary keys independently to avoid downtime. For more information, see [Subscriptions in API Management](api-management-subscriptions.md).
    - **Restrict the built-in all-access subscription**: Limit the all-access subscription to authorized administrators and never embed its key in client apps, because it grants access to every API in the instance. For more information, see [Create subscriptions in API Management](api-management-howto-create-subscriptions.md).
- **Restrict developer portal access**: Control who can sign in to and see content in the developer portal, and disable anonymous access to products and APIs that shouldn't be public. For more information, see [Secure access to the developer portal](secure-developer-portal-access.md).
- **Enforce Conditional Access for API Management administrators**: Apply Conditional Access policies that require multifactor authentication and compliant devices for the identities that can manage the API Management service, its policies and named values, the linked Key Vault, and the virtual network resources the gateway depends on. For more information, see [Require MFA for Azure management](/entra/identity/conditional-access/policy-old-require-mfa-azure-mgmt).

## Data protection

API Management holds secrets, backend credentials, and TLS certificates. Keep them in a managed secret store and reference them rather than embedding them in policies.

- **Store secrets in Azure Key Vault as named values**: Reference versionless Key Vault secret identifiers from named values instead of embedding credentials in policy definitions, so API Management picks up rotated secrets and they never appear in configuration. Key Vault integration for named values isn't currently available in workspaces. For more information, see [Use named values in API Management policies](api-management-howto-properties.md).
    - **Mark inline sensitive named values as secret**: Mark any inline named value that holds sensitive data as a secret so API Management encrypts it. For more information, see [Use named values in API Management policies](api-management-howto-properties.md).
- **Retrieve Key Vault secrets and certificates with a managed identity**: Grant the gateway's managed identity access to Key Vault so it reads secrets and certificates without a stored credential. For more information, see [Use managed identities in API Management](api-management-howto-use-managed-service-identity.md).
- **Store custom domain TLS certificates in Key Vault**: Use Key Vault certificates for your custom domain, set the certificate to autorenew, and use an SLA-backed tier so API Management picks up the latest certificate version automatically without downtime. For more information, see [Configure a custom domain name for your API Management instance](configure-custom-domain.md).

## Logging and monitoring

Capture gateway telemetry and route it to your security tooling so you can detect and investigate attacks against your APIs.

- **Collect gateway resource logs with a diagnostic setting**: In tiers that support resource logs, send API Management resource logs, including gateway request logs, to a Log Analytics workspace, event hub, or storage account for retention and analysis. The Consumption tier doesn't support resource log collection. For more information, see [Monitor API Management](monitor-api-management.md).
- **Monitor metrics and configure alerts**: Track gateway capacity and request and error metrics in Azure Monitor and alert on anomalies that can indicate abuse or outages. The v2 tiers and workspace gateways report CPU and memory utilization metrics in place of the classic gateway capacity metric. For more information, see [Monitor API Management with Azure Monitor](api-management-howto-use-azure-monitor.md).
- **Trace requests with Application Insights**: Integrate Application Insights to capture end-to-end request telemetry and diagnose suspicious call patterns. For more information, see [Integrate API Management with Application Insights](api-management-howto-app-insights.md).
- **Stream logs and events to Event Hubs for SIEM**: For non-workspace APIs, use the `log-to-eventhub` policy to forward request and custom events to an event hub for ingestion by a security information and event management system. For more information, see [Log events to Azure Event Hubs](api-management-howto-log-event-hubs.md).
- **Enable Defender for APIs threat detection**: Onboard the instance's REST APIs to Microsoft Defender for APIs to detect runtime threats and surface recommendations, such as unused endpoints to remove and unauthenticated endpoints to secure. For more information, see [Protect APIs with Defender for APIs](protect-with-defender-for-apis.md).

## Compliance and governance

Enforce and audit your API Management security configuration at scale with platform governance controls.

- **Enforce configuration with Azure Policy**: Assign the built-in API Management policy definitions for controls such as requiring virtual network deployment, restricting public configuration-endpoint access, requiring encrypted protocols, validating backend certificates, and backing named values with Key Vault. For more information, see [Built-in policy definitions for API Management](policy-reference.md).
- **Review cloud security posture with Defender for Cloud**: Act on the API Management-specific recommendations in Microsoft Defender for Cloud, such as onboarding REST APIs to Defender for APIs and removing unauthenticated or unused endpoints. For more information, see [API and API Management security recommendations](/azure/defender-for-cloud/recommendations-reference-api).
- **Apply resource locks to the instance**: Add a delete lock to production API Management instances to prevent accidental deletion of the gateway and its configuration. For more information, see [Lock resources to prevent changes](/azure/azure-resource-manager/management/lock-resources).
- **Tag API Management resources for governance**: Apply resource tags to instances so you can track ownership, environment, and data sensitivity across your API estate. For more information, see [Use tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources).

## Backup and recovery

Protect your gateway configuration and design for regional resilience so an outage or accidental change doesn't take your APIs offline.

- **Back up and restore your instance**: In the Developer, Basic, Standard, and Premium tiers, regularly back up the API Management instance so you can restore its configuration after accidental changes or a regional failure. For more information, see [Back up and restore API Management for disaster recovery](api-management-howto-disaster-recovery-backup-restore.md).
- **Enable availability zone redundancy**: Spread the gateway across availability zones in the Premium, Standard v2, and Premium v2 tiers to withstand a datacenter failure within a region. For more information, see [Enable availability zone support for API Management](enable-availability-zone-support.md).
- **Deploy to multiple regions**: Add regional gateways in the Premium tier so clients fail over to a healthy region during a regional outage. For more information, see [Deploy API Management to multiple Azure regions](api-management-howto-deploy-multi-region.md).

## Related content

- [Well-Architected Framework - API Management service guide](/azure/well-architected/service-guides/azure-api-management)
- [Zero Trust guidance center](/security/zero-trust/zero-trust-overview)
