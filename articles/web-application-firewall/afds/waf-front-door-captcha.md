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

Azure Web Application Firewall (WAF) now offers a CAPTCHA feature designed specifically to verify human users and differentiate them from automated bots. This interactive challenge ensures that only genuine users can access web applications by requiring suspected traffic to complete a CAPTCHA test. By blocking malicious automated requests while allowing legitimate users to proceed seamlessly, WAF helps protect applications from bot-driven attacks, including brute-force attempts and account takeover risks. This feature is especially valuable for login and sign-up flows, where ensuring human authentication is critical to safeguarding sensitive user data. 

CAPTCHA on Azure WAF serves as a powerful defense against a variety of automated threats. It effectively prevents bots from accessing critical website elements, such as login pages, forms, and sensitive user accounts, protecting against credential stuffing and brute-force attacks. Additionally, CAPTCHA helps reduce spam by ensuring only real users can submit comments, register accounts, or complete transactions. With its ability to enhance security while minimizing friction for legitimate users, this feature strengthens the overall protection of web applications against sophisticated automated threats. 

## How it works

When the CAPTCHA challenge is active on Azure WAF and a client's HTTP(s) request matches a specific rule, the client is presented with an interactive Microsoft CAPTCHA page to verify that they're human. This challenge requires user participation to complete verification before their request is validated by Azure WAF. Upon successful completion, WAF recognizes the request as originating from a legitimate user and proceeds with standard rule processing. Requests that fail to complete the challenge are blocked, preventing automated bots from accessing protected resources. 

## Expiration 

The WAF policy setting defines the CAPTCHA challenge cookie validity lifetime in minutes, determining how long a user remains validated before facing a new challenge. Once the lifetime expires, the user must complete the CAPTCHA challenge again to verify their identity. The lifetime is configurable between 5 and 1,440 minutes, with a default setting of 30 minutes.  

The CAPTCHA challenge cookie name is **afd_azwaf_captcha** on Azure Front Door. 

## Limitations 

- **Mobile Apps**: Not supported 

- **AJAX and API calls aren't supported**: CAPTCHA verification doesn't apply to these types of requests. 

- **POST body size restriction**: If the first request triggering a CAPTCHA challenge has a POST body exceeding 128 KB, it will be blocked. 

- **Non-HTML embedded resources**: CAPTCHA is designed for HTML resources. If you put CAPTCHA in front of non-HTML resources like images, CSS, or JavaScript files you'll likely encounter issues with contents loading and rendering.  

- **Browser compatibility**: CAPTCHA isn't supported on Microsoft Internet Explorer. It's compatible with the latest versions of Microsoft Edge, Chrome, Firefox, and Safari. 

