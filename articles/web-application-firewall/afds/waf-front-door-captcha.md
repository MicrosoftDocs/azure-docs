---
title: Azure Front Door Web Application Firewall CAPTCHA (preview)
description: Learn about the CAPTCHA feature in Azure Front Door Web Application Firewall (WAF) and how it helps protect your web applications from automated attacks.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 04/29/2025

---

# Azure Front Door Web Application Firewall CAPTCHA (preview)

Web Application Firewall CAPTCHA on Azure Frond Door is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Web Application Firewall (WAF) offers a CAPTCHA feature designed to differentiate human users from automated bots. This interactive challenge requires suspected traffic to complete a CAPTCHA test, blocking malicious automated requests while allowing legitimate users to proceed seamlessly. As a result, WAF helps protect applications from bot-driven attacks, including brute-force attempts and account takeover risks.

CAPTCHA on Azure WAF is particularly useful in login and sign-up flows where human authentication is crucial to protect sensitive user data. It acts as a strong defense against a variety of automated threats, preventing bots from accessing critical website elements like login pages and forms, and reducing spam by ensuring only real users can submit comments, register accounts, or complete transactions.

Incorporating CAPTCHA into Azure WAF not only enhances security but also minimizes friction for legitimate users. This balance strengthens the overall protection of web applications against sophisticated automated threats.

## How it works

When the CAPTCHA challenge is active on Azure WAF, any client's HTTP(s) request matches a specific rule prompts an interactive Microsoft CAPTCHA page. This challenge requires user participation to verify they're human before their request is validated by Azure WAF. Upon successful completion, WAF recognizes the request as originating from a legitimate user, and proceeds with standard rule processing. Requests that fail to complete the challenge are blocked, thus preventing automated bots from accessing protected resources. 

## Expiration 

The WAF **Policy settings** define the CAPTCHA challenge cookie validity lifetime in minutes, determining how long a user remains validated before facing a new challenge. Once the lifetime expires, the user must complete the CAPTCHA challenge again to verify their identity. The lifetime is configurable between 5 and 1,440 minutes, with a default setting of 30 minutes.  

The CAPTCHA challenge cookie name is **afd_azwaf_captcha** on Azure Front Door. 

## Limitations 

- **Mobile Apps**: Not supported 

- **AJAX and API calls aren't supported**: CAPTCHA verification doesn't apply to these types of requests. 

- **POST body size restriction**: If the first request triggering a CAPTCHA challenge has a POST body exceeding 128 KB, it will be blocked. 

- **Non-HTML embedded resources**: CAPTCHA is designed for HTML resources. If you put CAPTCHA in front of non-HTML resources like images, CSS, or JavaScript files you'll likely encounter issues with contents loading and rendering.  

- **Browser compatibility**: CAPTCHA isn't supported on Microsoft Internet Explorer. It's compatible with the latest versions of Microsoft Edge, Chrome, Firefox, and Safari. 

