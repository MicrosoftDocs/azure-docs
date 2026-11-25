---
title: Configure Advanced Application Threat Protection in Azure Firewall (preview)
description: Configure Advanced Application Threat Protection in Azure Firewall to evaluate eligible application requests before enabling denial.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 11/04/2026
# Customer intent: As a network security administrator, I want to configure Advanced Application Threat Protection so that I can evaluate application-request inspection before enabling blocking.
---

# Configure Advanced Application Threat Protection in Azure Firewall (preview)

Advanced Application Threat Protection is an AI-powered inline capability for Azure Firewall. It analyzes each eligible HTTP request to help detect attempts to exploit existing and emerging vulnerabilities in enterprise web applications and APIs, including disguised variants that don't match existing signatures.

Azure Firewall sends the HTTP request to an AI service for analysis. The service returns a risk score, which Azure Firewall uses to apply the configured protection settings to alert or deny the request. This capability adds AI-based request analysis to Azure Firewall Premium's existing protections. It's designed to help detect attacks such as SQL injection, cross-site scripting (XSS), path traversal, and command injection.

This article shows how to configure the capability through a security profile group and associate the group with application rules. Start in **Alert only** mode before using **Alert and deny**. For the shared model, see [Azure Firewall AI Security concepts](ai-security-concepts.md).

> [!IMPORTANT]
> Advanced Application Threat Protection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- Azure Firewall Premium in a region where the AI Security preview is available. See [Azure Firewall AI Security concepts](ai-security-concepts.md).
- The AI Security add-on enabled on all firewalls associated with the firewall policy.
- An Azure Firewall Policy with application rules covering the intended HTTP or HTTPS traffic.
- For HTTPS, working TLS inspection and client trust in the inspection certificate authority. See [Azure Firewall Premium certificates](premium-certificates.md).
- An authorized test environment and a test application that you own, with approved test requests and a benign control.

During the preview, configuration is available only in the Azure portal.

## Inspection scope

The capability inspects eligible HTTP or HTTPS requests that match application rules associated with the protection group. The described scenarios include east-west traffic between Azure workloads and traffic from on-premises networks to Azure workloads, routed through Azure Firewall.

Traffic translated by inbound DNAT rules isn't processed by application rules and isn't inspected by this capability.

Application-request analysis and file analysis address different content. For malware protection in file transfers, see [Configure Advanced Malware Threat Protection](configure-malware-protection.md). Application threat protection complements rather than replaces Azure Web Application Firewall, application security testing, and timely patching.

## Create a security profile group

Use the guided group experience to configure application threat protection.

1. In the Azure portal, open the firewall policy.
1. Select **Settings** > **Security Profile Groups (preview)** > **Create security profile group**.
1. On the **Basics** tab, enter a configuration name and select **Advanced application threat protection (preview)**. Select **Next**.
1. On the **Configure protections** tab, enter a profile name, or turn on **Use existing Advanced application threat protection security profile** and select a profile.
1. For **Mode**, select **Alert only** for the initial evaluation. The other options are **Disabled** and **Alert and deny**.
1. Under **Risk threshold**, set the **Alert** percentage for the requests that you want to review.
1. Select **Next**, review the settings, and then select **Create**.

An action is triggered when the request's risk score is greater than its configured threshold. Lower values trigger actions at lower scores. Choose thresholds based on your evaluation rather than treating an illustrative value as a recommended default.

Other capabilities in the group are optional. A group can contain at most one profile of each type.

## Apply the group to application rules

Before changing a rule, check whether a matching network rule prevents the test traffic from reaching the intended application rule. Azure Firewall processes network rules first. For more information, see [Azure Firewall rule processing](rule-processing.md).

1. Select **Rules** > **Application rules**, and create or edit the target rule.
1. Scope its sources and destinations to the intended evaluation traffic.
1. Select the security profile group that you created.
1. Configure the protocol:
   - For HTTPS, use **HTTPS:443** and enable **TLS inspection** on the rule.
   - For HTTP, use **HTTP:80**. TLS inspection isn't required for unencrypted HTTP.
1. Save the rule.

## Verify inspection in Alert only mode

Evaluate the configured protection against a test application before enabling denial.

1. Confirm routing through the firewall and a match on the intended application rule.
1. Check the selected group, protection mode, and alert threshold.
1. For HTTPS, confirm successful decryption and client trust in the inspection certificate authority.
1. Send a benign control request and an approved application-security test request to the test application that you own.
1. Review the recorded risk scores and actions for the requests. Compare them with the configured threshold.

No particular test request is guaranteed to produce a detection. A successful request alone doesn't prove inspection occurred. Existing [Azure Firewall monitoring](monitor-firewall.md) helps establish the traffic path, but validation also needs evidence of the application threat protection verdict.

### Enable denial after evaluation

After reviewing the results in **Alert only** mode:

1. Change the application's protection mode in the group to **Alert and deny**.
1. Set both the **Alert** and **Deny** thresholds.
1. Repeat the approved tests in the authorized environment.
1. Confirm denial for a request whose risk score exceeds the deny threshold. A denied request receives **HTTP 403 Forbidden** and doesn't reach the application.
1. Repeat the benign control and review the recorded actions before expanding the rule's scope.

## If inspection doesn't produce the expected result

Check the following items before changing thresholds:

- The traffic traverses the firewall and matches an application rule, rather than a network or DNAT rule.
- The rule references the intended security profile group.
- The protection mode and thresholds match the evaluation.
- HTTPS traffic is successfully decrypted and the client trusts the inspection certificate authority.

Risk scores are probabilistic and can produce false positives or false negatives. Don't treat a low score or an absent alert as proof that a request is safe.

## Limitations

- Inspects HTTP request content: the method, URL, selected headers, and body.
- Inspects between 1 and 2 KB of total request content.

## Related content

- [Azure Firewall AI Security concepts](ai-security-concepts.md)
- [Configure Advanced Malware Threat Protection](configure-malware-protection.md)
- [Azure Firewall rule processing](rule-processing.md)
