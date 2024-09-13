---
title: Write effective prompts for Microsoft Copilot in Azure
description: Maximize productivity and intent understanding with prompt engineering in Microsoft Copilot in Azure.
ms.date: 04/16/2024
ms.topic: how-to
ms.service: copilot-for-azure
ms.custom:
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Write effective prompts for Microsoft Copilot in Azure

Prompt engineering is the process of designing prompts that elicit the best and most accurate responses from large language models (LLMs) like Microsoft Copilot in Azure (preview). As these models become more sophisticated, understanding how to create effective prompts becomes even more essential.

This article explains how to use prompt engineering to create effective prompts for Microsoft Copilot in Azure.

[!INCLUDE [preview-note](includes/preview-note.md)]

## What is prompt engineering?

Prompt engineering involves strategically crafting inputs for AI models like Copilot in Azure, enhancing their ability to deliver precise, relevant, and valuable outcomes. These models rely on pattern recognition from their training data, lacking real-world understanding or awareness of user goals. By incorporating specific contexts, examples, constraints, and directives into prompts, you can significantly elevate the response quality.

Good prompt engineering practices help you unlock more of Copilot in Azure's potential for code generation, recommendations, documentation retrieval, and navigation. By crafting your prompts thoughtfully, you can reduce the chance of seeing irrelevant suggestions. Prompt engineering is a crucial technique to help improve responses and complete tasks more efficiently. Taking the time to write great prompts ultimately fosters efficient code development, drives down cost, and minimizes errors by providing clear guidelines and expectations.

## Tips for writing better prompts

Microsoft Copilot in Azure can't read your mind. To get meaningful help, guide it: ask for shorter replies if its answers are too long, request complex details if replies are too basic, and specify the format you have in mind. Taking the time to write detailed instructions and refine your prompts helps you get what you're looking for.

The following tips can be useful when considering how to write effective prompts.

### Be clear and specific

Start with a clear intent. For example, if you say "Check performance," Microsoft Copilot in Azure won't know what you're referring to. Instead, be more specific with prompts like "Check the performance of Azure SQL Database in the last 24 hours."

For code generation, specify the language and the desired outcome. For example:

- **Create a YAML file that represents ...**
- **Generate CLI script to ...**
- **Give me a Kusto query to retrieve ...**
- **Help me deploy my workload by generating Terraform that ...**

### Set expectations

The words you use help shape Microsoft Copilot in Azure's responses. Slightly different verbs can return different results, so consider the best ways to phrase your requests. For example:

- For high-level information, use phrases like **How to** or **Create a guide**.
- For actionable responses, use words like **Generate**, **Deploy**, or **Stop**.
- To fetch information and display it in your chat, use terms like **Fetch**, **List**, or **Retrieve**.
- To change your view or navigate to a new page, try phrases like **Show me**, **Take me to**, or **Navigate to**.

You can also mention your expertise level to tailor the advice to your understanding, whether you're a beginner or an expert.

### Add context about your scenario

Detail your goals and why you're undertaking a task to get more precise assistance, or clarify the technologies you're interested in. For example, instead of just saying **Deploy Azure function**, describe your end goal in detail, such as **Deploy Azure function for processing data from IoT devices with a new resource**.

### Break down your requests

For complex issues or tasks, break down your request into smaller, manageable parts. For example: **First, identify virtual machines that are running right now. After you have a working query, stop them.** You can also try using separate prompts for different parts of a larger scenario.

### Customize your code

When asking for on-demand code generation, specify known parameters, resource names, and locations. When you do so, Microsoft Copilot in Azure generates code with those values, so that you don't have to update them yourself. For example, rather than saying **Give me a CLI script to create a storage account**, you can say **Give me a CLI script to create a storage account named Storage1234 in the TestRG resource group in the EastUS region.**

### Use Azure terminology

When possible, use Azure-specific terms for resources, services, and tasks. Copilot in Azure may not grasp your intent if it doesn't know which parts of Azure you're referring to. If you aren't sure about which term to use, you can ask Copilot in Azure about general information about your scenario, then use the terms it provides in your prompt.

### Use the feedback loop

If you don't get the response you were looking for, try again, using the previous response to help refine your prompts. For example, you can ask Copilot in Azure to tell you more about a previous response or to explain more about one aspect. For generated code, you can ask to change one aspect or add another step. Don't be afraid to experiment to see what works best.

To leave feedback on any response that Microsoft Copilot in Azure provides, use the thumbs up/down control. This feedback helps us understand your expectations so that we can improve the Copilot in Azure experience over time.

## Next steps

- Learn about [some of the things you can do with Microsoft Copilot in Azure](capabilities.md).
- Review our [Responsible AI FAQ for Microsoft Copilot in Azure](responsible-ai-faq.md).
