---
title: Azure Web Application Firewall integration in Microsoft Security Copilot
description: Learn about using Microsoft Security Copilot to investigate traffic flagged by Azure Web Application Firewall.
keywords: copilot for security, copilot for security, threat intelligence, intrusion detection and prevention system, plugin, integration, azure web application firewall, copilot, open ai, openai co-pilot
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.date: 06/09/2025
ms.topic: concept-article
ms.localizationpriority: high
ms.collection: Tier1, ce-skilling-ai-copilot
# Customer intent: As a security professional, I want to integrate Azure Web Application Firewall with AI tools, so that I can quickly investigate flagged traffic and gain actionable insights on potential threats and vulnerabilities in my environment.
---

# Azure Web Application Firewall integration in Microsoft Security Copilot

Microsoft Security Copilot is a cloud-based AI platform that provides natural language copilot experience. It can help support security professionals in different scenarios, like incident response, threat hunting, and intelligence gathering. For more information, see [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)

Azure Web Application Firewall (WAF) integration in Microsoft Security Copilot enables deep investigation of Azure WAF events. It can help you investigate WAF logs triggered by Azure WAF in a matter of minutes and provide related attack vectors using natural language responses at machine speed. It provides visibility into your environment’s threat landscape. It allows you to retrieve a list of most frequently triggered WAF rules  and identify the top offending IPaddresses in your environment. 

Microsoft Security Copilot integration is supported on both Azure WAF on Azure Application Gateway and Azure WAF on Azure Front Door.

## Know before you begin

If you're new to Microsoft Security Copilot, you should familiarize yourself with it by reading these articles:
- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [Understand authentication in Microsoft Security Copilot](/security-copilot/authentication)
- [Prompting in Microsoft Security Copilot](/security-copilot/prompting-security-copilot)

## Microsoft Security Copilot integration in Azure WAF 

This integration supports the standalone experience and is accessed through [https://securitycopilot.microsoft.com](https://securitycopilot.microsoft.com). This is a chat-like experience that you can use to ask questions and get answers about your data. For more information, see [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot#standalone-and-embedded-experiences).

## Key features 

Azure Web Application Firewall integration in Microsoft Security Copilot provides several powerful capabilities to help you analyze and understand your security posture. These features use AI to translate complex WAF logs into actionable insights through natural language responses.

- Providing a list of top Azure WAF rules triggered in the customer environment and generating deep context with related attack vectors.  
   
    This capability provides details about Azure WAF rules that are triggered due to a WAF block. It provides an ordered list of rules based on trigger frequency in the desired time period. The analysis processes Azure WAF logs and connects related logs over a specific time period. The result is an easy-to-understand natural language explanation of why a particular request was blocked.

- Providing a list of malicious IP addresses in the customer environment and generating related threats.

    This capability provides details about client IP addresses blocked by the Azure WAF. The analysis processes Azure WAF logs and connects related logs over a specific time period. The result is an easy-to-understand natural language explanation of which IP addresses the WAF blocked and the reason for the blocks.

- Summarizing SQL injection (SQLi) attacks.

   This capability provides details about SQL injection (SQLi) attacks that were blocked by Azure WAF. By analyzing Azure WAF logs and correlating related data over a specific time period, this skill delivers an easy-to-understand natural language explanation of why SQLi requests were blocked.

- Summarizing Cross-site scripting (XSS) attacks.

   This Azure WAF skill helps you understand why Azure WAF blocked Cross Site Scripting (XSS) attacks to web applications. The skill analyzes Azure WAF logs and connects related incidents over a specific time period. The result is an easy-to-understand natural language explanation of why an XSS request was blocked.

## Enable the Azure WAF integration in Copilot for Security

To enable the integration, follow these steps:

1.	Ensure that you have at least Copilot contributor permissions.
2.	Open [https://securitycopilot.microsoft.com/](https://securitycopilot.microsoft.com).
3.	Open the Security Copilot menu.
4.	Open **Sources** in the prompt bar.  
5.	On the Plugins page, set the Azure Web Application Firewall toggle to **On**.
6.	Select the Settings on the Azure Web Application Firewall plugin to configure the Log Analytics workspace for Azure Front Door WAF or the Azure Application Gateway WAF.
7.	To start using the skills, use the prompt bar.
:::image type="content" source="media/waf-copilot/prompt-bar.png" alt-text="Screenshot showing the Microsoft Security Copilot prompt bar.":::

## Sample Azure WAF prompts

You can create your own prompts in Microsoft Security Copilot to perform analysis on the attacks based on WAF logs. This section shows some ideas and examples.

### Before you begin

- Be clear and specific with your prompts. You might get better results if you include specific device IDs/names, app names, or policy names in your prompts.

   It might also help to add WAF to your prompt. For example:
   - Was there any SQL injection attack in my regional WAF in the last day?
   - Tell me more about the top rules triggered in my global WAF

- Experiment with different prompts and variations to see what works best for your use case. Chat AI models vary, so iterate and refine your prompts based on the results you receive
For guidance on writing effective prompts, see Creating your own prompts. 

The following example prompts might be helpful.

### Summarize information about SQL injection attacks

- Was there a SQL injection attack in my global WAF in the last day?
- Show me IP addresses related to the top SQL injection attack in my global WAF
- Show me all SQL injection attacks in regional WAF in the last 24 hours

### Summarize information about cross-site scripting attacks

- Was any XSS attack detected in my Application Gateway WAF in the last 12 hours?
- Show me list of all XSS attacks in my Azure Front Door WAF

### Generate a list of threats in my environment based on WAF rules

- What were the top global WAF rules triggered in the last 24 hours?
- What are top threats related to the WAF Rule in my environment? \<enter rule ID\>
- Was there any bot attack in my regional WAF in the last day?
- Summarize custom rule blocks triggered by Azure Front Door WAF in the last day.

### Generate a list of threats in my environment based on malicious IP addresses

- What was the top offending IP in regional WAF in the last day?
- Summarize list of malicious IP addresses in my Azure Front Door WAF in the last six hours?

## Provide feedback

Your feedback on the Azure WAF integration with Microsoft Security Copilot helps with development. To provide feedback in Copilot, select **How’s this response?** At the bottom of each completed prompt and choose any of the following options:

- Looks right - Select if the results are accurate, based on your assessment.
- Needs improvement - Select if any detail in the results is incorrect or incomplete, based on your assessment.
- Inappropriate - Select if the results contain questionable, ambiguous, or potentially harmful information.

For each feedback item, you can provide more information in the next dialog box that appears. Whenever possible, and when the result is Needs improvement, write a few words explaining what can be done to improve the outcome.

## Limitation

If you migrate to Azure Log Analytics dedicated tables in the Application Gateway WAF V2 version, the Microsoft Security Copilot WAF Skills aren't functional. As a temporary workaround, enable Azure Diagnostics as the destination table in addition to the resource-specific table.

## Privacy and data security in Microsoft Security Copilot

To understand how Microsoft Security Copilot handles your prompts and the data that’s retrieved from the service (prompt output), see [Privacy and data security in Microsoft Security Copilot](/security-copilot/privacy-data-security).

## Related content

- [What is Microsoft Security Copilot?](/copilot/security/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
