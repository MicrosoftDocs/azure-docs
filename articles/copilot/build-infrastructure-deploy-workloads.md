---
title: Build infrastructure and deploy workloads using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can use Microsoft Cost Management to help you manage your costs.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Build infrastructure and deploy workloads using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can help you quickly build custom infrastructure for your workloads and provide templates and scripts to help you deploy. By using Microsoft Copilot for Azure (preview), you can often reduce your deployment time dramatically.

Throughout a conversation, Microsoft Copilot for Azure (preview) will ask you questions to better understand your requirements and applications. Based on the provided information, it then provides several architecture options suitable for deploying that infrastructure. After you select an option, Microsoft Copilot for Azure (preview) provides detailed descriptions of the infrastructure, including how it can be configured. Finally, Microsoft Copilot for Azure provides templates and scripts using the language of your choice to deploy your infrastructure.

To get help building infrastructure and deploying workloads, start on the **Virtual machines** page in the Azure portal. Select the arrow next to **Create**, then select **More VMs and related solutions**. Once you're there, start the conversation by letting Microsoft Copilot for Azure (preview) know what you want to build and deploy.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

The prompts you use can vary depending on the type of workload you want to deploy, and the stage of the conversation that you're in. Here are a few examples of the kinds of prompts you might use. Modify these prompts based on your real-life scenarios, or try additional prompts as the conversation continues.

- Starting the conversation:
  - "Help me deploy a website on Azure"
  - "How can I deploy SAP based application on Azure?"
  - "Give me infrastructure for my new application."
- Gathering requirements:
  - "Give me examples of these requirements."
  - "What do you mean by security requirements?"
  - (or provide your requirements based on the questions)
- High level architecture stage:
  - "Let's go with option 1."
  - "Give me more details about option 1."
  - "Are there more options available?"
  - "Instead of SQL, use Cosmos DB."
  - "Can you give me comparison table for these options? Also include approximate cost." 
- Detailed infrastructure building stage:
  - "I like this infrastructure. Give me an ARM template to deploy this."
  - "Can you include rolling upgrade mode Manual instead of Automatic for the VMSS?"
  - "Can you explain this design in more detail?"
  - "Are there any alternatives to private link?"
- Code building stage:
  - "Can you give me PS instead of ARM template?"
  - "Change VMSS instance count to 100 instead of 10."
  - "Explain this code in English."

## Examples

In this example, the first request is "Change cost management scope." Microsoft Copilot for Azure (preview) provides a prompt to open the scope selector, allowing you to choose the desired scope.

:::image type="content" source="media/analyze-cost-management/cost-management-change-scope.png" lightbox="media/analyze-cost-management/cost-management-change-scope.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) changing the cost management scope.":::

Once the desired scope is selected, you can say "Summarize my costs for the last 6 months?" A summary of costs for the selected scope is provided. You can follow up with questions to get more granular details, such as "How about the cost of VMs specifically?"

:::image type="content" source="media/analyze-cost-management/cost-management-summarize-costs.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing a summary of costs.":::

:::image type="content" source="media/analyze-cost-management/cost-management-vm-costs.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing details about VM costs.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
