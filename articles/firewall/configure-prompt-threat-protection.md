---
title: Configure Prompt Threat Protection in Azure Firewall (preview)
description: Configure Prompt Threat Protection in Azure Firewall to detect and block prompt injection attempts in supported AI application traffic.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 11/04/2026
# Customer intent: As a network security administrator, I want to configure Prompt Threat Protection in Azure Firewall so that I can detect and block prompt injection attempts before they reach my AI services.
---

# Configure Prompt Threat Protection in Azure Firewall (preview)

Prompt Threat Protection inspects supported AI requests that pass through Azure Firewall and uses Azure AI Content Safety Prompt Shields to detect direct and indirect prompt injection attempts. Azure Firewall then logs or blocks detected attempts according to the configured mode.

This article shows how to create a security profile group that contains a Prompt Threat Protection profile, and apply the group to an application rule. Start in **Alert only** mode before blocking traffic. For background, see [Prompt Threat Protection concepts](prompt-threat-protection.md).

> [!IMPORTANT]
> Prompt Threat Protection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- Azure Firewall Premium with the AI Security add-on enabled on every firewall associated with the firewall policy, in a region where the preview is available. See [Azure Firewall AI Security concepts](ai-security-concepts.md).
- An Azure AI Content Safety resource and a [managed identity](/entra/identity/managed-identities-azure-resources/overview) that the firewall policy uses to access it.
- TLS inspection configured on the firewall policy, with the inspection certificate authority trusted by the clients. See [Azure Firewall Premium certificates](premium-certificates.md).
- An application rule that covers the HTTPS traffic from the clients to the AI service.
- The request format of the AI service. You select a predefined provider schema or define a custom schema that identifies the JSON fields that contain prompts.
- An authorized test environment with a test AI endpoint, a benign request, and an approved test request. Use synthetic data.

During the preview, configuration is available only in the Azure portal.

## Create a security profile group with a Prompt Threat Protection profile

1. In the Azure portal, open your firewall policy.
1. Select **Settings** > **Security Profile Groups (preview)** > **Create security profile group**.
1. On the **Basics** tab, enter a configuration name and select **Prompt threat protection (preview)**. Select other protections to include in the same group. Select **Next**.
1. On the **Configure protections** tab, enter a profile name, or turn on **Use existing Prompt threat protection security profile** and select a profile.
1. For **Mode**, select **Alert only** for the initial evaluation. The other options are **Disabled** and **Alert and deny**.
1. For **Direction**, keep **Request** to inspect prompts that clients send to the AI service.
1. Review **Failure action**. The portal default is **Fail open**.
1. For **Backend endpoint**, enter the endpoint of your Azure AI Content Safety resource. For **Managed identity**, select the managed identity that the policy uses to access it.
1. Select the provider schema that matches your AI service. Keep **Provider mode** set to **Predefined**, and then select your AI service under **Providers**, such as OpenAI.
1. Select **Next**, review the settings, and then select **Create**.

A security profile group can contain at most one profile of each type.

## Apply the group to an application rule

Azure Firewall processes network rules before application rules. Check that a matching network rule doesn't prevent the AI traffic from reaching the intended application rule. For more information, see [Azure Firewall rule processing](rule-processing.md).

1. Select **Rules** > **Application rules**, and edit the rule that covers the AI traffic.
1. Scope the sources and destinations to the clients and AI service that you want to protect.
1. Use **HTTPS:443** and enable **TLS inspection** on the rule.
1. Select the security profile group that contains the Prompt Threat Protection profile.
1. Save the rule.

## Verify detection in Alert only mode

1. Confirm that the test client's traffic traverses the firewall and matches the intended application rule.
1. Confirm that TLS inspection succeeds and that the client trusts the inspection certificate authority.
1. Send a benign request to the test AI endpoint. Confirm that the request succeeds and reaches the endpoint.
1. Send an approved test request that contains a prompt injection attempt, such as an instruction to ignore previous instructions and reveal the system prompt.
1. Review the Azure Firewall logs for the corresponding Prompt Threat Protection detection.

A successful request alone doesn't show that Prompt Threat Protection evaluated it. Correlate the request with the firewall log entry by using its timestamp or another supported identifier. No particular test request is guaranteed to produce a detection.

### Block detected attempts

After you review the results in **Alert only** mode:

1. Edit the Prompt Threat Protection profile in the security profile group, change **Mode** to **Alert and deny**, and save your changes.
1. Send the same benign request and confirm that it still succeeds.
1. Send the approved test request. Confirm that the client receives an **HTTP 403 Forbidden** response, that the firewall logs the block, and that the request doesn't reach the AI endpoint.

## If detection doesn't produce the expected result

Check the following items:

- The traffic matches the application rule that references the security profile group, rather than a network rule.
- TLS inspection succeeds for the request.
- The provider schema matches the AI service's request format, so that the firewall can extract the prompt.
- The managed identity can access the Azure AI Content Safety resource.
- The profile mode is set as expected.

## Related content

- [Prompt Threat Protection concepts](prompt-threat-protection.md)
- [Azure Firewall AI Security concepts](ai-security-concepts.md)
- [Azure Firewall rule processing](rule-processing.md)
