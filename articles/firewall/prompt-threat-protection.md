---
title: Prompt Threat Protection concepts in Azure Firewall (preview)
description: Understand how Azure Firewall Prompt Threat Protection uses Prompt Shields to inspect selected AI traffic and apply alerting or blocking.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 11/04/2026
# Customer intent: As a network security administrator, I want to understand Prompt Threat Protection and its inspection boundaries so that I can plan protection for supported AI traffic.
---

# Prompt Threat Protection concepts in Azure Firewall (preview)

Prompt Threat Protection is an Azure Firewall capability that uses Azure AI Content Safety Prompt Shields to detect direct and indirect prompt injection attempts in selected AI traffic. It can log detections or block detected attempts according to the configured mode.

Prompt injection attempts to make a large language model follow malicious instructions. A direct attempt comes from a user prompt. An indirect attempt comes from external content, such as a retrieved document.

> [!IMPORTANT]
> Prompt Threat Protection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Inspection model

Prompt Threat Protection is part of the [Azure Firewall AI Security add-on](ai-security-concepts.md). It requires Azure Firewall Premium, the add-on enabled, and Azure Firewall Policy.

When eligible AI traffic matches the configured firewall policy, Azure Firewall identifies the traffic and extracts prompt-related content. For HTTPS traffic, TLS inspection must first decrypt the content. Prompt Shields analyzes the extracted content, and Azure Firewall applies the configured action to the resulting verdict.

Prompt Shields detects; Azure Firewall enforces. The classification comes from an Azure AI Content Safety resource that the firewall policy accesses through a managed identity. The firewall applies the action in the network path, so applications don't need to integrate a content safety SDK to receive this protection. For more information about the detection service, see [Prompt Shields in Azure AI Content Safety](/azure/ai-services/content-safety/concepts/jailbreak-detection).

The add-on alone doesn't establish inspection coverage. Routing, the matching rule, protection configuration, and protocol eligibility all affect whether a request is evaluated.

## Prompt extraction

To analyze a request, Azure Firewall needs to know where the prompt appears in the request body. A provider schema describes that location.

A predefined schema covers a supported provider API format, such as the OpenAI chat completions format. A custom schema specifies the JSON fields that contain prompt content for an application that doesn't use a predefined format. Extraction also depends on the inspection direction configured in the profile.

## Protection modes

The mode determines how the firewall responds to a detection.

| Mode | Behavior |
| --- | --- |
| Disabled | Prompt Threat Protection isn't enabled. |
| Alert only | Detected prompt injection attempts are logged. Traffic isn't blocked. |
| Alert and deny | Detected prompt injection attempts are blocked and logged. The client receives an HTTP 403 Forbidden response, and the request doesn't reach the AI service. |

These labels describe Prompt Threat Protection. Other AI Security capabilities have their own mode names and settings.

## Traffic scope and dependencies

The preview covers supported outbound and east-west AI traffic, including selected Azure OpenAI and Azure AI Foundry model endpoint traffic. Coverage depends on supported request formats and the applied firewall configuration. The preview doesn't inspect every request to an AI service.

The preview supports HTTP/1.1 traffic. HTTPS inspection requires TLS inspection. Inbound public application inspection isn't supported.

Clients must trust the certificate authority used for TLS inspection. For certificate requirements, see [Azure Firewall Premium certificates](premium-certificates.md).

## Direct and indirect injection examples

The following examples explain the types of content that can carry an injection attempt. They aren't test payloads or a guarantee that a particular request produces a detection. Network-layer detection is one control among several. For broader guidance, see [Prompt injection in the Zero Trust AI attack techniques catalog](/security/zero-trust/catalog-ai-attack-techniques/prompt-injection).

### Direct attempt in a user request

A user request contains instructions intended to override an application's existing instructions or expose information that the application shouldn't return. This request is a direct attempt because the instructions arrive in the user's prompt.

### Indirect attempt in retrieved content

An application retrieves a document that contains instructions intended to change the model's behavior. This document is an indirect attempt because the instructions arrive as external content rather than as the user's request.

## Inspection evidence

A successful request doesn't prove that Prompt Threat Protection evaluated the content. Inspection evidence needs to distinguish the matching firewall traffic from a protection verdict and its action.

Review routing, rule selection, protection mode, and TLS inspection as part of validation. Existing firewall monitoring is a starting point, but a generic application-rule match alone isn't evidence of a Prompt Threat Protection verdict.

## Related content

- [Configure Prompt Threat Protection](configure-prompt-threat-protection.md)
- [Azure Firewall AI Security concepts](ai-security-concepts.md)
- [Azure Firewall Premium certificates](premium-certificates.md)
