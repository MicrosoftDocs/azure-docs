---
title: "Prompt Shields in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about User Prompt injection attacks and the Prompt Shields feature that helps prevent them.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: conceptual
ms.date: 03/15/2024
ms.author: pafarley
---

# Prompt Shields

Generative AI models can pose risks of exploitation by malicious actors. To mitigate these risks, we integrate safety mechanisms to restrict the behavior of large language models (LLMs) within a safe operational scope. However, despite these safeguards, LLMs can still be vulnerable to adversarial inputs that bypass the integrated safety protocols.

Prompt Shields is a unified API that analyzes LLM inputs and detects User Prompt attacks and Document attacks, which are two common types of adversarial inputs.

### Prompt Shields for User Prompts

Previously called **Jailbreak risk detection**, this shield targets User Prompt injection attacks, where users deliberately exploit system vulnerabilities to elicit unauthorized behavior from the LLM. This could lead to inappropriate content generation or violations of system-imposed restrictions.

### Prompt Shields for Documents

This shield aims to safeguard against attacks that use information not directly supplied by the user or developer, such as external documents. Attackers might embed hidden instructions in these materials in order to gain unauthorized control over the LLM session.

## Types of input attacks

The two types of input attacks that Prompt Shields detects are described in this table.

| Type | Attacker | Entry point    | Method    | Objective/impact   | Resulting behavior  |
|-------|----------|---------|---------|---------|---------|
| User Prompt attacks | User     | User prompts      | Ignoring system prompts/RLHF training  | Altering intended LLM behavior         | Performing restricted actions against training |
| Document attacks   | Third party | Third-party content (documents, emails) | Misinterpreting third-party content   | Gaining unauthorized access or control | Executing unintended commands or actions      |

### Subtypes of User Prompt attacks

**Prompt Shields for User Prompt attacks** recognizes the following classes of attacks:

| Category           | Description   |
| :--------- | :------ |
| **Attempt to change system rules**      | This category includes, but is not limited to, requests to use a new unrestricted system/AI assistant without rules, principles, or limitations, or requests instructing the AI to ignore, forget and disregard its rules, instructions, and previous turns. |
| **Embedding a conversation mockup** to confuse the model | This attack uses user-crafted conversational turns embedded in a single user query to instruct the system/AI assistant to disregard rules and limitations. |
| **Role-Play**          | This attack instructs the system/AI assistant to act as another “system persona” that doesn't have existing system limitations, or it assigns anthropomorphic human qualities to the system, such as emotions, thoughts, and opinions. |
| **Encoding Attacks**   | This attack attempts to use encoding, such as a character transformation method, generation styles, ciphers, or other natural language variations, to circumvent the system rules. |

### Subtypes of Document attacks

**Prompt Shields for Documents attacks** recognizes the following classes of attacks:

|Category      | Description   |
| ------------ | ------- |
| **Manipulated  Content**   | Commands related to falsifying, hiding, manipulating, or pushing  specific information. |
| **Intrusion** | Commands related to creating backdoor, unauthorized privilege  escalation, and gaining access to LLMs and systems |
| **Information  Gathering** | Commands related to deleting, modifying, or accessing data or  stealing data. |
| **Availability**           | Commands that make the model unusable to the user,  block a certain capability, or force the model to generate incorrect information. |
| **Fraud**     | Commands related to defrauding the user out of money, passwords,  information, or acting on behalf of the user without authorization |
| **Malware**  | Commands related to spreading malware via malicious links,  emails, etc. |
| **Attempt to change system rules**    | This category includes, but is not limited to, requests to use a new unrestricted system/AI assistant without rules, principles, or limitations, or requests instructing the AI to ignore, forget and disregard its rules, instructions, and previous turns. |
| **Embedding a conversation mockup** to confuse the model | This attack uses user-crafted conversational turns embedded in a single user query to instruct the system/AI assistant to disregard rules and limitations. |
| **Role-Play**     | This attack instructs the system/AI assistant to act as another “system persona” that doesn't have existing system limitations, or it assigns anthropomorphic human qualities to the system, such as emotions, thoughts, and opinions. |
| **Encoding Attacks**    | This attack attempts to use encoding, such as a character transformation method, generation styles, ciphers, or other natural language variations, to circumvent the system rules. |

## Limitations

### Language availability

Currently, the Prompt Shields API supports the English language. While our API doesn't restrict the submission of non-English content, we can't guarantee the same level of quality and accuracy in the analysis of such content. We recommend users to primarily submit content in English to ensure the most reliable and accurate results from the API.

### Text length limitations

The maximum character limit for Prompt Shields allows for a user prompt of up to 10,000 characters, while the document array is restricted to a maximum of 5 documents with a combined total not exceeding 10,000 characters.

### Regions

To use this API, you must create your Azure AI Content Safety resource in the supported regions. See [Region availability](/azure/ai-services/content-safety/overview#region-availability).

### TPS limitations

See [Query rates](/azure/ai-services/content-safety/overview#query-rates).

If you need a higher rate, please [contact us](mailto:contentsafetysupport@microsoft.com) to request it.

## Next steps

Follow the quickstart to get started using Azure AI Content Safety to detect user input risks.

> [!div class="nextstepaction"]
> [Prompt Shields quickstart](../quickstart-jailbreak.md)
