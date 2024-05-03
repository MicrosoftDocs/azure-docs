---
title: Azure Web Application Firewall JavaScript challenge (preview) overview
description: This article is an overview of the Azure Web Application Firewall JavaScript challenge feature.
services: web-application-firewall
author: sowmyam2019
ms.service: web-application-firewall
ms.date: 05/03/2024
ms.author: victorh
ms.topic: concept-article

#customer intent: As a cloud network architect, I want to understand the Azure Web Application Firewall JavaScript challenge feature to determine if I want to deploy it.
---

# Azure Web Application Firewall JavaScript challenge (preview) overview

> [!IMPORTANT]
> Azure Web Application Firewall JavaScript challenge is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Web Application Firewall (WAF) on Azure Front Door offers a JavaScript challenge feature as one of the mitigation options for advanced bot protection.  It is available on the Azure Front Door premium version as an action in the custom rule set and the Bot Manager 1.x ruleset.

The JavaScript challenge is an invisible web challenge used to distinguish between legitimate users and bots. Malicious bots fail the challenge, which protects web applications. In addition, the JavaScript challenge is beneficial as it reduces friction for legitimate users. This is because it doesn't require any human intervention.

## How it works

 When the JS Challenge is active on Azure WAF and a client's HTTP(s) request matches a specific rule, the client is shown a Microsoft JS challenge page. The user sees this page for a few seconds while the user’s browser computes the challenge. This page contains a JavaScript challenge that the client’s browser must compute successfully to be validated by Azure WAF. If the computation succeeds, the request is validated by WAF as a non-bot client and the rest of the WAF rules are executed. Requests that fail to successfully compute the challenge are blocked.

Here's an example JavaScript challenge page:

:::image type="content" source="media/waf-javascript-challenge/javascript-challenge-page.png" alt-text="Screenshot showing the JavaScript challenge page.":::

## Localization

The JavaScript challenge page is localized to be adapted to both language and culture of a particular market.  The locale is determined by the read-only `Navigator.language` property.  The supported languages codes are: cd, de, en, es, fr, hu, id, it, ja, ko, nl, pl, pt-BR, pt-PT, ru, sv, tr, zh-Hans, zh-Hant.

## Expiration

The WAF policy setting defines the JavaScript challenge cookie validity lifetime in minutes. The user is challenged after the lifetime expires. The lifetime is an integer between 5 and 1440 and the default is 30 minutes. The JavaScript challenge cookie name is `afd_azwaf_jsclearance`.

> [!NOTE]
> The JavaScript challenge expiration cookie is injected into the user’s browser after successfully completing the challenge.

## Limitations

- AJAX and API calls are not supported.
- If the first call to be JavaScript challenged has a POST body size > 128 KB, it is blocked. Additionally, challenges for non-HTML resources embedded in a page are not supported. For example images, css, js, and so on. However, if there is a prior successful JavaScript challenge request, then the previous limitations are removed.
- The challenge is not supported on Microsoft Internet Explorer. The challenge is supported on the latest versions of the Edge, Chrome, Firefox, and Safari web browsers.
- Cross-origin resource sharing (CORS) requests result in a challenge loop.  If you visit a page that triggers the JavaScript challenge action from a domain that is not the same as the domain running the JavaScript challenge, you are challenged regardless of prior challenge passes.
- If the JavaScript challenge is issued to one IP address but is solved by a different IP address, then the computation result is invalid, potentially leading to a challenge loop.
