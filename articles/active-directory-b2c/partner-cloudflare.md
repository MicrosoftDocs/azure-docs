---
title: Tutorial to configure Azure Active Directory B2C with Cloudflare Web Application Firewall
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with Cloudflare Web application firewall and protect applications from malicious attacks 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.reviewer: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/6/2022
ms.author: gasinh
ms.subservice: B2C
---
# Tutorial: Configure Cloudflare Web Application Firewall with Azure Active Directory B2C

In this tutorial, you can learn how to configure the [Cloudflare Web Application Firewall (WAF)](https://www.cloudflare.com/application-services/products/waf/) solution for Azure Active Directory B2C (Azure AD B2C) tenant with custom domain. Use Cloudflare WAF to help protect organizations from malicious attacks that can exploit vulnerabilities such as SQL Injection, and cross-site scripting (XSS).

## Prerequisites

To get started, you'll need:

- An Azure subscription 
  - If you don't have one, you can get an [Azure free account](https://azure.microsoft.com/free/)
- [An Azure AD B2C tenant](tutorial-create-tenant.md) linked to your Azure subscription
- A [Cloudflare](https://dash.cloudflare.com/sign-up) account

## Scenario description

Cloudflare WAF integration includes the following components:

- **Azure AD B2C tenant** – The authorization server that verifies user credentials using the custom policies defined in the tenant. It's known as the identity provider
- [**Azure Front Door**](../frontdoor/front-door-overview.md) – Enables custom domains for Azure B2C tenant. Traffic from Cloudflare WAF is routed to Azure Front Door before arriving at Azure AD B2C tenant.
- **Cloudflare** – The web application firewall that manages traffic sent to the authorization server

## Integrate with Azure AD B2C

For custom domains in Azure AD B2C, use the custom domain feature in Azure Front Door. Learn how to [enable Azure AD B2C custom domains](./custom-domain.md?pivots=b2c-user-flow).  

After a custom domain for Azure AD B2C is configured using Azure Front Door, [test the custom domain](./custom-domain.md?pivots=b2c-custom-policy#test-your-custom-domain) before proceeding.  

## Create a Cloudflare account

On cloudflare.com, you can [create an account](https://dash.cloudflare.com/sign-up). To enable WAF, on [Application Services](https://www.cloudflare.com/plans/#price-matrix), select **Pro**, which is required.

### Configure DNS

1. To enable WAF for a domain, in the DNS console for the CNAME entry, turn on the proxy setting from the DNS console for the CNAME entry as shown.

    ![Screenshot of proxy settings.](./media/partner-cloudflare/select-proxy-settings.png)

2. Under the DNS pane, toggle the **Proxy status** option to **Proxied**. It turns orange.

The settings appear in the following image.

   ![Screenshot of proxied status.](./media/partner-cloudflare/select-proxied.png)

### Configure the Web Application Firewall

Go to your Cloudflare settings, and use the Cloudflare content to [configure the WAF](https://www.cloudflare.com/application-services/products/waf/) and learn about other security tools. 

### Configure firewall rule

In the top pane of the console, use the firewall option to add, update, or remove firewall rules. For example, the following firewall setting enables CAPTCHA for incoming requests to *contosobank.co.uk* domain before the request goes to Azure Front Door.

   ![Screenshot of enforcing captcha.](./media/partner-cloudflare/configure-firewall-rule.png)

Learn more: [Cloudflare Firewall Rules](https://support.cloudflare.com/hc/articles/360016473712-Cloudflare-Firewall-Rules)

### Test the settings

1. Complete CAPTCHA when access to the custom domain is requested.

    ![Screenshot of Cloudflare WAF enforce CAPTCHA.](./media/partner-cloudflare/enforce-captcha.png)

> [!NOTE]
> Cloudflare has functionality to customize block pages. See, [Configuring Custom Pages (Error and Challenge)](https://support.cloudflare.com/hc/en-us/articles/200172706-Configuring-Custom-Pages-Error-and-Challenge-).  

2. The Azure AD B2C policy sign-in dialog appears.

    ![Screenshot of Azure AD B2C policy sign-in.](./media/partner-cloudflare/azure-ad-b2c-policy.png)

## Resources

- Cloudflare: [Troubleshoot common custom pages issues](https://support.cloudflare.com/hc/en-us/articles/200172706-Configuring-Custom-Pages-Error-and-Challenge-#5QWV2KVjLnaAQ8L4tjiguw)
- [Get started with custom policies in Azure AD B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy&tabs=applications)

## Next steps 

[Configure a custom domain in Azure AD B2C](./custom-domain.md?pivots=b2c-user-flow)
