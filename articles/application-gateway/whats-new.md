---
title: What's new in Azure Application Gateway
description: Learn what's new with Azure Application Gateway, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: overview
ms.date: 06/10/2020
ms.author: victorh

---
# What's new in Azure Application Gateway?

Azure Application Gateway is updated on an ongoing basis. To stay updated with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality

## New features

|Feature  |Description  |Date added  |
|---------|---------|---------|
| Application Gateway Ingress Controller (AGIC) AKS add-on (Preview) |Application Gateway Ingress Controller can now be deployed as a native AKS add-on in one line through Azure CLI. Being an AKS add-on allows AGIC to become a fully managed service, while still running in the customer's AKS cluster. For more information, see [AGIC add-on differences](ingress-controller-overview.md#difference-between-helm-deployment-and-aks-add-on). |June 2020 |
| User-Defined Routes (UDR) on v2 (Preview) |User-defined routes are now supported in some scenarios on Application Gateway v2 SKUs. For more information, see [Application Gateway configuration overview](configuration-overview.md#user-defined-routes-supported-on-the-application-gateway-subnet). |March 2020 |
|Affinity cookie changes |When cookie-based affinity is enabled, Application Gateway injects another identical cookie called *ApplicationGatewayAffinityCORS* in addition to the existing ApplicationGatewayAffinity cookie. *ApplicationGatewayAffinityCORS* has two more attributes added to it (*SameSite=None; Secure*) so that sticky sessions are maintained even for cross-origin requests. See [Application Gateway Cookie based affinity](configuration-overview.md#cookie-based-affinity) for more information. |February 2020 |
|Probe enhancements |With the custom probe enhancements in Application Gateway v2 SKU, we have simplified [probe configuration](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-probe-portal#create-probe-for-application-gateway-v2-sku), facilitated [on-demand backend health tests](https://docs.microsoft.com/azure/application-gateway/application-gateway-create-probe-portal#test-backend-health-with-the-probe) and added [more diagnostic information](https://docs.microsoft.com/azure/application-gateway/application-gateway-backend-health-troubleshooting#error-messages) to help you troubleshoot backend health issues.  |October 2019 |
|More metrics |We've added the following new metrics to help you monitor your Application Gateway v2 SKU: [Timing-related metrics](https://docs.microsoft.com/azure/application-gateway/application-gateway-metrics#timing-metrics), Backend response status, Bytes received, Bytes sent, Client TLS protocol and Current compute units. See [Metrics supported by Application Gateway V2 SKU](https://docs.microsoft.com/azure/application-gateway/application-gateway-metrics#metrics-supported-by-application-gateway-v2-sku). |August 2019 |
|WAF custom rules |Application Gateway WAF_v2 now supports creating custom rules. See [Application Gateway custom rules](custom-waf-rules-overview.md). |June 2019 |
|Autoscaling, zone redundancy, static VIP support GA |General availability for v2 SKU, which supports autoscaling, zone redundancy, enhance performance, static VIPs, Key Vault, Header rewrite. See [Application Gateway autoscaling documentation](application-gateway-autoscaling-zone-redundant.md). |April 2019 |
|Key Vault integration |Application Gateway now supports integration with Key Vault (in public preview) for server certificates that are attached to HTTPS enabled listeners. See [TLS termination with Key Vault certificates](key-vault-certs.md). |April 2019 |
|Header CRUD/Rewrites     |You can now rewrite HTTP headers. See [Tutorial: Create an application gateway and rewrite HTTP headers](tutorial-http-header-rewrite-powershell.md) for more information.|December 2018|
|WAF configuration and exclusion list     |We've added more options to help you configure your WAF and reduce false positives. For more information, see [Web application firewall request size limits and exclusion lists](application-gateway-waf-configuration.md).|December 2018|
|Autoscaling, zone redundancy, static VIP support      |With the v2 SKU, there are many improvements such as Autoscaling, improved performance, and more. See [What is Azure Application Gateway?](overview.md) for more information.|September 2018|
|Connection draining     |Connection draining allows you to gracefully remove members from your backend pools. For more information, see [Connection draining](features.md#connection-draining).|September 2018|
|Custom error pages     |With custom error pages, you can create an error page within the format of the rest of your websites. To enable this, see [Create Application Gateway custom error pages](custom-error.md).|September 2018|
|Metrics Enhancements     |You can get a better view of the state of your Application Gateway with enhanced metrics. To enable metrics on your Application Gateway, see [Back-end health, diagnostic logs, and metrics for Application Gateway](application-gateway-diagnostics.md).|June 2018|

## Next steps

For more information about Azure Application Gateway, see [What is Azure Application Gateway?](overview.md)
