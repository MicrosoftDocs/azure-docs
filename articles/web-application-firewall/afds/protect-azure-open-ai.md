---
title: Protect Azure OpenAI using Azure Web Application Firewall on Azure Front Door
description: Learn how to Protect Azure OpenAI using Azure Web Application Firewall on Azure Front Door
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: how-to
ms.date: 08/31/2026
ms.custom: sfi-image-nochange
# Customer intent: As a cloud architect, I want to implement Azure Web Application Firewall on Azure Front Door for my Azure OpenAI APIs, so that I can enhance security and protect against evolving web application attacks.
---

# Protect Azure OpenAI using Azure Web Application Firewall on Azure Front Door

More enterprises are using Azure OpenAI APIs, and security attacks against web applications are becoming more complex. To protect Azure OpenAI APIs from these attacks, you need a strong security strategy.

Azure Web Application Firewall (WAF) is an Azure Networking product that protects web applications and APIs from various OWASP top 10 web attacks, Common Vulnerabilities and Exposures (CVEs), and malicious bot attacks.

This article describes how to use Azure Web Application Firewall (WAF) on Azure Front Door to protect Azure OpenAI endpoints.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.


## Create Azure OpenAI instance using the gpt-35-turbo model

First, create an OpenAI instance.

1. Create an Azure OpenAI instance and deploy a gpt-35-turbo model by using [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource).
1. Identify the Azure OpenAI endpoint and the API key.

   Open the Azure OpenAI service in the Microsoft Foundry portal and open the **Chat** option under **Playground**.
   Use the **View code** option to display the endpoint and the API key.

   :::image type="content" source="../media/protect-azure-open-ai/sample-code.png" alt-text="Screenshot showing Azure OpenAI sample code with Endpoint and Key.":::

1. Validate Azure OpenAI call by using your favorite API test method, such as [Visual Studio](/aspnet/core/test/http-files) or [Insomnia](https://insomnia.rest/).
   Use the Azure OpenAPI endpoint and api-key values you found in the earlier steps.
   Use these lines of code in the POST body:

   ```json
   {
   "model":"gpt-35-turbo",
   "messages": [
   {
   "role": "user",
   "content": "What is Azure OpenAI?"
   }
   ]
   }

   ```

1. In response to the POST, you should receive a *200 OK*.

   The Azure OpenAI service also generates a response by using the GPT model.

## Create an Azure Front Door instance with Azure WAF

Now use the Azure portal to create an Azure Front Door instance with Azure WAF.

1. Create an Azure Front Door premium optimized tier with an associated WAF security policy in the same resource group. Use the **Custom create** option.

   1. [Quickstart: Create an Azure Front Door profile - Azure portal](../../frontdoor/create-front-door-portal.md#create-a-front-door-for-your-application)
1. Add endpoints and routes.
1. Add the origin hostname: The origin hostname is `testazureopenai.openai.azure.com`.
1. Add the WAF policy.


## Configure a WAF policy to protect against web application and API vulnerabilities

Enable the WAF policy in prevention mode, and enable the latest Azure-managed rule sets: **Microsoft_DefaultRuleSet_2.2** and **Microsoft_BotManagerRuleSet_1.1**.

> [!NOTE]
> Azure updates the managed rule sets over time. Use the latest available versions, and validate and tune any rule-set changes in a test environment before you deploy them to production. For the available versions, see [Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md).

## Verify access to Azure OpenAI via Azure Front Door endpoint

Now verify your Azure Front Door endpoint.

1. Retrieve the Azure Front Door endpoint from the Front Door Manager.

   :::image type="content" source="../media/protect-azure-open-ai/front-door-endpoint.png" alt-text="Screenshot showing the Azure Front Door endpoint." lightbox="../media/protect-azure-open-ai/front-door-endpoint.png":::

2. Use your favorite API test method, such as [Visual Studio](/aspnet/core/test/http-files) or [Insomnia](https://insomnia.rest/) to send a POST request to the Azure Front Door endpoint.

3. Replace the Azure OpenAI endpoint with the AFD endpoint in the POST request.

   :::image type="content" source="../media/protect-azure-open-ai/test-final.png" alt-text="Screenshot showing the final POST." lightbox="../media/protect-azure-open-ai/test-final.png":::

   Azure OpenAI also generates a response using the GPT model.

## Validate WAF blocks an OWASP attack

Send a POST request simulating an OWASP attack on the Azure OpenAI endpoint. WAF blocks the call with a *403 Forbidden response* code.

## Configure IP restriction rules using WAF

To restrict access to the Azure OpenAI endpoint to the required IP addresses, see [Configure an IP restriction rule with a WAF for Azure Front Door](waf-front-door-configure-ip-restriction.md).

## Common issues

The following items are common issues you might encounter when using Azure OpenAI with Azure Front Door and Azure WAF.

- You get a *401: Access Denied* message when you send a POST request to your Azure OpenAI endpoint.

   If you attempt to send a POST request to your Azure OpenAI endpoint immediately after you create it, you might receive a *401: Access Denied* message even if you include the correct API key in your request. This issue usually resolves itself after some time without any direct intervention.

- You get a *415: Unsupported Media Type* message when you send a POST request to your Azure OpenAI endpoint.

   If you attempt to send a POST request to your Azure OpenAI endpoint with the Content-Type header `text/plain`, you get this message. Ensure you update your Content-Type header to `application/json` in the header section of your test.

## Related content

- [Web Application Firewall DRS rule groups and rules](waf-front-door-drs.md)
- [Configure bot protection for Web Application Firewall](waf-front-door-policy-configure-bot-protection.md)
- [Best practices for Web Application Firewall on Azure Front Door](waf-front-door-best-practices.md)
