---
title: Logging of LLM Requests and Responses | Azure API Management
titleSuffix: Azure API Management
description: Learn how to log LLM requests and responses from the AI gateway in Azure API Management.
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/14/2025
ms.author: danlep
ai-usage: ai-assisted
ms.collection: cd-skilling-ai-copilot
ms.custom:
---

# Enabling Logs of LLM Requests and Responses

[Intro]
In this guide, you'll learn how to enable logging for LLM requests and responses in Azure API Management. This is essential for monitoring and troubleshooting your AI gateway.

## Prerequisites
- An Azure API Management instance.
- A managed LLM chat completions API integrated with Azure API Management.
- Access to an Azure Log Analytics workspace.
- Appropriate permissions to configure diagnostic settings and access logs.

## Steps for Enabling Diagnostic Settings for Generative AI Logs
1. Navigate to your Azure API Management instance in the Azure portal.
2. Select **Diagnostic settings** under **Monitoring**.
3. Click **Add diagnostic setting**.
4. Configure the setting to send logs to your Log Analytics workspace:
   - Select **Logs** and **Metrics**.
   - Choose your Log Analytics workspace.
5. Save the diagnostic setting.

## Enabling Logging of LLM Requests/Responses for the LLM API
1. In your Azure API Management instance, locate the LLM API.
2. Select **Settings** for the API.
3. Enable **Request and Response Logging**.
4. Save the changes.

## Reviewing Analytics Workbook for LLM APIs
1. Open the Azure portal and navigate to your Log Analytics workspace.
2. Select **Workbooks** under **Monitoring**.
3. Search for and open the **Generative AI Analytics Workbook**.
4. Review metrics and visualizations for LLM API usage.

## Reviewing Azure Monitor Logs for Requests/Responses
1. Navigate to your Log Analytics workspace in the Azure portal.
2. Select **Logs** under **Monitoring**.
3. Use KQL queries to filter logs for LLM requests and responses:
   ```kql
   AzureDiagnostics
   | where ResourceType == "API Management"
   | where OperationName == "LLM Chat Completions"
    ```

## Related content
[TBD]