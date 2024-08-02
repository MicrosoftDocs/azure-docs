---
title: Reference table for all API security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud API security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 03/13/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# API/API management security recommendations

This article lists all the API/API management security recommendations you might see in Microsoft Defender for Cloud. 

The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).


## Azure API recommendations

### Microsoft Defender for APIs should be enabled

**Description & related policy**: Enable the Defender for APIs plan to discover and protect API resources against attacks and security misconfigurations. [Learn more](defender-for-apis-deploy.md)

**Severity**: High

### Azure API Management APIs should be onboarded to Defender for APIs

**Description & related policy**: Onboarding APIs to Defender for APIs requires compute and memory utilization on the Azure API Management service. Monitor performance of your Azure API Management service while onboarding APIs, and scale out your Azure API Management resources as needed.

**Severity**: High

### API endpoints that are unused should be disabled and removed from the Azure API Management service

**Description & related policy**: As a security best practice, API endpoints that haven't received traffic for 30 days are considered unused, and should be removed from the Azure API Management service. Keeping unused API endpoints might pose a security risk. These might be APIs that should have been deprecated from the Azure API Management service, but have accidentally been left active. Such APIs typically do not receive the most up-to-date security coverage.

**Severity**: Low

### API endpoints in Azure API Management should be authenticated

**Description & related policy**: API endpoints published within Azure API Management should enforce authentication to help minimize security risk. Authentication mechanisms are sometimes implemented incorrectly or are missing. This allows attackers to exploit implementation flaws and to access data. For APIs published in Azure API Management, this recommendation assesses authentication through verifying the presence of Azure API Management subscription keys for APIs or products where subscription is required, and the execution of policies for validating [JWT](../api-management/validate-jwt-policy.md), [client certificates](../api-management/validate-client-certificate-policy.md), and [Microsoft Entra](../api-management/validate-azure-ad-token-policy.md) tokens. If none of these authentication mechanisms are executed during the API call, the API will receive this recommendation.

**Severity**: High

## API management recommendations

### API Management subscriptions should not be scoped to all APIs

**Description & related policy**: API Management subscriptions should be scoped to a product or an individual API instead of all APIs, which could result in excessive data exposure.

**Severity**: Medium

### API Management calls to API backends should not bypass certificate thumbprint or name validation

**Description & related policy**: API Management should validate the backend server certificate for all API calls. Enable SSL certificate thumbprint and name validation to improve the API security.

**Severity**: Medium

### API Management direct management endpoint should not be enabled

**Description & related policy**: The direct management REST API in Azure API Management bypasses Azure Resource Manager role-based access control, authorization, and throttling mechanisms, thus increasing the vulnerability of your service.

**Severity**: Low

### API Management APIs should use only encrypted protocols

**Description & related policy**: APIs should be available only through encrypted protocols, like HTTPS or WSS. Avoid using unsecured protocols, such as HTTP or WS to ensure security of data in transit.

**Severity**: High

### API Management secret named values should be stored in Azure Key Vault

**Description & related policy**: Named values are a collection of name and value pairs in each API Management service. Secret values can be stored either as encrypted text in API Management (custom secrets) or by referencing secrets in Azure Key Vault. Reference secret named values from Azure Key Vault to improve security of API Management and secrets. Azure Key Vault supports granular access management and secret rotation policies.

**Severity**: Medium

### API Management should disable public network access to the service configuration endpoints

**Description & related policy**: To improve the security of API Management services, restrict connectivity to service configuration endpoints, like direct access management API, Git configuration management endpoint, or self-hosted gateways configuration endpoint.

**Severity**: Medium

### API Management minimum API version should be set to 2019-12-01 or higher

**Description & related policy**: To prevent service secrets from being shared with read-only users, the minimum API version should be set to 2019-12-01 or higher.

**Severity**: Medium

### API Management calls to API backends should be authenticated

**Description & related policy**: Calls from API Management to backends should use some form of authentication, whether via certificates or credentials. Does not apply to Service Fabric backends.

**Severity**: Medium



## Related content

- [Learn about security recommendations?](security-policy-concept.md)
- [Review security recommendations](review-security-recommendations.md)
