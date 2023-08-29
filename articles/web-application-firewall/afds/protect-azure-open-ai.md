---
title: Protect Azure Open AI using Azure Web Application Firewall on Azure Front Door
description: Learn how to Protect Azure Open AI using Azure Web Application Firewall on Azure Front Door
author: sowmyam2019
ms.author: victorh
ms.service: web-application-firewall
ms.topic: how-to
ms.date: 08/28/2023
---

# Protect Azure Open AI using Azure Web Application Firewall on Azure Front Door

There are a growing number of enterprises using Azure OpenAI APIs, and the number and complexity of security attacks against web applications is constantly evolving. A strong security strategy is necessary to protect Azure OpenAI APIs from various web application attacks.

Azure Web Application Firewall (WAF) is an Azure Networking product that protects web applications and APIs from various OWASP top 10 web attacks, Common Vulnerabilities and Exposures (CVEs), and malicious bot attacks.

This article describes how to use Azure Web Application Firewall (WAF) on Azure Front Door to protect Azure OpenAI endpoints.

## Prerequisites

None

<!-- 4. Task H2s ------------------------------------------------------------------------------

Required: Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a task. Each section is represented as an H2 in the article.

For portal-based procedures, minimize bullets and numbering.

* Each H2 should be a major step in the task.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## Create Azure Open AI instance using gpt-35-turbo model
First, create an Open AI instance.


1. Create an Azure Open AI instance and deploy a gpt-35-turbo model using [Create and deploy an Azure OpenAI Service resource](../../ai-services/openai/how-to/create-resource.md).
1. Identify the Azure OpenAI endpoint and the API key.

   Open the Azure Open AI studio and open the **Chat** option under **Playground**.
   Use the **View code** option to display the endpoint and the API key.
   :::image type="content" source="../media/protect-azure-open-ai/view-code.png" alt-text="Screenshot showing Azure AI Studio Chat playground.":::
   <br>

   :::image type="content" source="../media/protect-azure-open-ai/sample-code.png" alt-text="Screenshot showing Azure Open AI sample code with Endpoint and Key.":::

1. Validate Azure OpenAI call using [Postman](https://www.postman.com/).
   Use the Azure OpenAPI endpoint and api-key values found in the earlier steps.
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
   :::image type="content" source="../media/protect-azure-open-ai/postman-body.png" alt-text="Screenshot showing the post body.":::
1. In response to the POST, you should receive a *200 OK*:
   :::image type="content" source="../media/protect-azure-open-ai/post-200-ok.jpg" alt-text="Screenshot showing the POST 200 OK.":::

   The Azure OpenAI also generates a response using the GPT model.

## Create an Azure Front Door instance with Azure WAF

Now use the Azure portal to create an Azure Front Door instance with Azure WAF.

1. Create an Azure Front Door premium optimized tier with an associated WAF security policy in the same resource group. Use the **Custom create** option.

   1. [Quickstart: Create an Azure Front Door profile - Azure portal](../../frontdoor/create-front-door-portal.md#create-front-door-profile---custom-create)
1. Add endpoints and routes.
1. Add the origin hostname: The origin hostname is `testazureopenai.openai.azure.com`.
1. Add the WAF policy.


## Configure a WAF policy to protect against web application and API vulnerabilities

Enable the WAF policy in prevention mode and ensure **Microsoft_DefaultRuleSet_2.1** and **Microsoft_BotManagerRuleSet_1.0** are enabled.

:::image type="content" source="../media/protect-azure-open-ai/waf-policy.png" alt-text="Screenshot showing a WAF policy.":::

## Verify access to Azure OpenAI via Azure Front Door endpoint

Now verify your Azure Front Door endpoint.

1. Retrieve the Azure Front Door endpoint from the Front Door Manager.

   :::image type="content" source="../media/protect-azure-open-ai/front-door-endpoint.png" alt-text="Screenshot show the Azure Front Door endpoint.":::
2. Use Postman to send a POST request to the Azure Front Door endpoint.
   1. Replace the Azure Open AI endpoint with the AFD endpoint in Postman POST request.
   :::image type="content" source="../media/protect-azure-open-ai/post-first-query.png" alt-text="Screenshot showing the first POST.":::

   Azure OpenAI also generates a response using the GPT model.

## Validate WAF blocks an OWASP attack

Send a POST request simulating an OWASP attack on the Azure OpenAI endpoint. WAF blocks the call with a *403 Forbidden response* code.

## Configure IP restriction rules using WAF

To restrict access to the OpenAI endpoint to the required IP addresses, see [Configure an IP restriction rule with a WAF for Azure Front Door](waf-front-door-configure-ip-restriction.md).

## Common issues

The following items are common issues you may encounter when using Azure OpenAI with Azure Front Door and Azure WAF.

- You get a *401: Access Denied* message when you send a POST request to your OpenAI endpoint.

   If you attempt to send a POST request to your Azure OpenAI endpoint immediately after you create it, you may receive a *401: Access Denied* message even if you have the correct API key in your request. This issue will usually resolve itself after some time without any direct intervention.

- You get a *415: Unsupported Media Type* message when you send a POST request to your OpenAI endpoint.

   If you attempt to send a POST request to your Azure OpenAI endpoint with the Content-Type header `text/plain`, you get this message. Make sure to update your Content-Type header to `application/json` in the header section in Postman.
