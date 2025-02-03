---
title: Azure Web Application Firewall JavaScript challenge (preview) overview
description: This article is an overview of the Azure Web Application Firewall JavaScript challenge feature.
services: web-application-firewall
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.custom: devx-track-js
ms.date: 06/12/2024
ms.topic: concept-article
#customer intent: As a cloud network architect, I want to understand the Azure Web Application Firewall JavaScript challenge feature to determine if I want to deploy it.
---

# Azure Web Application Firewall JavaScript challenge (preview) overview

> [!IMPORTANT]
> Azure Web Application Firewall JavaScript challenge is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Web Application Firewall (WAF) on Azure Front Door and Azure Application Gateway offers a JavaScript challenge feature as one of the mitigation options for advanced bot protection. For Azure Front Door, It's available on the premium version as an action in the custom rule set and the Bot Manager 1.x ruleset.

The JavaScript challenge is an invisible web challenge used to distinguish between legitimate users and bots. Malicious bots fail the challenge, which protects web applications. In addition, the JavaScript challenge is beneficial as it reduces friction for legitimate users because it doesn't require any human intervention.

## How it works

 When the JS Challenge is active on Azure WAF and a client's HTTP(s) request matches a specific rule, the client is shown a Microsoft JS challenge page. The user sees this page for a few seconds while the user’s browser computes the challenge. The client's browser must successfully compute a JavaScript challenge on this page to receive validation from Azure WAF. When the computation succeeds, WAF validates the request as a nonbot client and runs the rest of the WAF rules. Requests that fail to successfully compute the challenge are blocked.

Cross-origin resource sharing (CORS) requests are challenged on each access attempt. So if a client accesses a page that triggers the JavaScript challenge from a domain different from the domain hosting the challenge, the client faces the challenge again even if the client previously passed the challenge.

In addition, if a client solves the JavaScript challenge and then the client’s IP address changes, the challenge is issued again.


Here's an example JavaScript challenge page:

:::image type="content" source="media/waf-javascript-challenge/javascript-challenge-page.png" alt-text="Screenshot showing the JavaScript challenge page.":::

## Expiration

The WAF policy setting defines the JavaScript challenge cookie validity lifetime in minutes. The user is challenged after the lifetime expires. The lifetime is an integer between 5 and 1,440 minutes and the default is 30 minutes. The JavaScript challenge cookie name is `afd_azwaf_jsclearance` on Azure Front Door, and `appgw_azwaf_jsclearance` on Azure Application Gateway.

> [!NOTE]
> The JavaScript challenge expiration cookie is injected into the user’s browser after successfully completing the challenge.

## Limitations

- AJAX and API calls aren't supported.
- If the first call that receives a JavaScript challenge has a POST body size greater than 128 KB, it blocks it. Additionally, challenges for non-HTML resources embedded in a page aren't supported. For example images, css, js, and so on. However, if there's a prior successful JavaScript challenge request, then the previous limitations are removed.
- The challenge isn't supported on Microsoft Internet Explorer. The challenge is supported on the latest versions of the Microsoft Edge, Chrome, Firefox, and Safari web browsers.
- The JavaScript challenge action on Web Application Firewall on Application Gateway isn't supported for *Rate Limit* type custom rules during the public preview.

## Related content

- [Azure WAF’s Bot Manager 1.1 and JavaScript Challenge (Preview): Navigating the Bot Threat Terrain](https://techcommunity.microsoft.com/t5/azure-network-security-blog/azure-waf-s-bot-manager-1-1-and-javascript-challenge-preview/ba-p/4249652)