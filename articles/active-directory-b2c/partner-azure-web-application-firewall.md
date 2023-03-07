---
title: Tutorial to configure Azure Active Directory B2C with Azure Web Application Firewall
titleSuffix: Azure AD B2C
description: Learn to configure Azure AD B2C with Azure Web application firewall to protect applications from malicious attacks 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/17/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure Azure Active Directory B2C with Azure Web Application Firewall

Learn how to enable the Azure Web Application Firewall (WAF) service for Azure Active Directory B2C (Azure AD B2C) tenant with a custom domain. WAF protects web applications from common exploits and vulnerabilities.

Learn more about [Azure Web Application Firewall](https://azure.microsoft.com/services/web-application-firewall/#overview)

## Prerequisites

To get started, you need:

* An Azure subscription
* If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* **An Azure AD B2C tenant** – authorization server that verifies user credentials using custom policies defined in the tenant
  * Also known as the identity provider (IdP)
  * See, [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md) 
* **Azure Front Door (AFD)** – enables custom domains for the Azure AD B2C tenant
  * See, [Azure Front Door and CDN documentation](../frontdoor/index.yml)
* **WAF** – manages traffic sent to the authorization server
  * [Azure Web Application Firewall](https://azure.microsoft.com/services/web-application-firewall/#overview)

## Azure AD B2C setup

To use custom domains in Azure AD B2C, use the custom domain features in AFD. See, [Enable custom domains for Azure AD B2C](./custom-domain.md?pivots=b2c-user-flow).  

> [!IMPORTANT]
> After you configure the custom domain, see [Test your custom domain](./custom-domain.md?pivots=b2c-custom-policy#test-your-custom-domain).  

## Onboard with WAF

To enable WAF, configure a WAF policy and associate it with the AFD for protection.

### Create a WAF policy

To create a WAF policy with Azure-managed Default Rule Set (DRS):

1. Go to the [Azure portal](https://portal.azure.com). Select **Create a resource** and then search for Azure WAF. Select **Azure Web Application Firewall (WAF)** > **Create**.

2. Go to the **Create a WAF policy** page, select the **Basics** tab. Enter the following information, accept the defaults for the remaining settings.

| Value | Description |
|:--------|:-------|
| Policy for | Global WAF (Front Door)|
| Front Door SKU | Select between Basic, Standard, or Premium SKU |
|Subscription | Select your Front Door subscription name |
| Resource group | Select your Front Door resource group name |
| Policy name | Enter a unique name for your WAF policy |
| Policy state | Set as Enabled |
| Policy mode | Set as Detection |

3. Select **Review + create**

4. Go to the **Association** tab of the Create a WAF policy page, select + **Associate a Front Door profile**, enter the following settings

| Value | Description |
|:----|:------|
| Front Door | Select your Front Door name associated with Azure AD B2C custom domain |
| Domains | Select the Azure AD B2C custom domains you want to associate the WAF policy to|

5. Select **Add**.

6. Select **Review + create**, then select **Create**.

### Change policy mode from detection to prevention

When a WAF policy is created, by default the policy is in Detection mode. In Detection mode, WAF doesn't block any requests, instead, requests matching the WAF rules are logged in the WAF logs. For more information about WAF logging, see [Azure WAF monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md).

The sample query shows all the requests that were blocked by the WAF policy in the past 24 hours. The details include, rule name, request data, action taken by the policy, and the policy mode.

![Image shows the blocked requests](./media/partner-azure-web-application-firewall/blocked-requests-query.png)

![Image shows the blocked requests details](./media/partner-azure-web-application-firewall/blocked-requests-details.png)

It's recommended that you let the WAF capture requests in Detection mode. Review the WAF logs to determine if there are any rules in the policy that are causing false positive results. Then after [exclude the WAF rules based on the WAF logs](../web-application-firewall/afds/waf-front-door-exclusion.md#define-exclusion-based-on-web-application-firewall-logs).

To see WAF in action, use Switch to prevention mode to change from Detection to Prevention mode. All requests that match the rules defined in the Default Rule Set (DRS) are blocked and logged in the WAF logs.

![Image shows the switch to prevention mode](./media/partner-azure-web-application-firewall/switch-to-prevention-mode.png)

In case you want to switch back to the detection mode, you can do so by using Switch to detection mode option.

![Image shows the switch to detection mode](./media/partner-azure-web-application-firewall/switch-to-detection-mode.png)

## Next steps

- [Azure WAF monitoring and logging](../web-application-firewall/afds/waf-front-door-monitor.md)

- [WAF with Front Door service exclusion lists](../web-application-firewall/afds/waf-front-door-exclusion.md)
