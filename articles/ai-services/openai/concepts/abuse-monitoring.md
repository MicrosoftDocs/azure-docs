---
title: Azure OpenAI Service abuse monitoring
titleSuffix: Azure OpenAI
description: Learn about the abuse monitoring capabilities of Azure OpenAI Service
author: mrbullwinkle
ms.author: mbullwin
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual 
ms.date: 06/16/2023
ms.custom: template-concept
manager: nitinme
keywords: 
---

# Abuse Monitoring

Azure OpenAI Service detects and mitigates instances of recurring content and/or behaviors that suggest use of the service in a manner that may violate the [Code of Conduct](/legal/cognitive-services/openai/code-of-conduct?context=/azure/ai-services/openai/context/context) or other applicable product terms. Details on how data is handled can be found on the [Data, Privacy and Security page](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context).

## Components of abuse monitoring

There are several components to abuse monitoring:

- **Content Classification**: Classifier models detect harmful language and/or images in user prompts (inputs) and completions (outputs). The system looks for categories of harms as defined in the [Content Requirements](/legal/cognitive-services/openai/code-of-conduct?context=/azure/ai-services/openai/context/context), and assigns severity levels as described in more detail on the [Content Filtering page](content-filter.md).

- **Abuse Pattern Capture**: Azure OpenAI Service’s abuse monitoring looks at customer usage patterns and employs algorithms and heuristics to detect indicators of potential abuse. Detected patterns consider, for example, the frequency and severity at which harmful content is detected in a customer’s prompts and completions.

- **Human Review and Decision**: When prompts and/or completions are flagged through content classification and abuse pattern capture as described above, authorized Microsoft employees may assess the flagged content, and either confirm or correct the classification or determination based on predefined guidelines and policies. Data can be accessed for human review <u>only</u> by authorized Microsoft employees via Secure Access Workstations (SAWs) with Just-In-Time (JIT) request approval granted by team managers. For Azure OpenAI Service resources deployed in the European Economic Area, the authorized Microsoft employees are located in the European Economic Area.

- **Notification and Action**: When a threshold of abusive behavior has been confirmed based on the preceding three steps, the customer is informed of the determination by email. Except in cases of severe or recurring abuse, customers typically are given an opportunity to explain or remediate—and implement mechanisms to prevent recurrence of—the abusive behavior. Failure to address the behavior—or recurring or severe abuse—may result in suspension or termination of the customer’s access to Azure OpenAI resources and/or capabilities.

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).
- Learn more about how data is processed in connection with content filtering and abuse monitoring: [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).
