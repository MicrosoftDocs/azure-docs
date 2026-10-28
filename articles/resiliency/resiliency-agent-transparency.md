---
title: Transparency frequently asked questions for Azure Copilot Resiliency Agent
description: Learn how Azure Copilot Resiliency Agent works, what it can and can't do, and how to review and validate AI-generated output.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 10/12/2026
ms.topic: faq
ms.service: resiliency
ms.collection: ce-skilling-ai-copilot
---

# Transparency frequently asked questions for Azure Copilot Resiliency Agent

Use this FAQ to understand the capabilities, intended uses, limitations, reliability expectations, data access, and responsible use of Azure Copilot Resiliency Agent.

## What is Azure Copilot Resiliency Agent?

Azure Copilot Resiliency Agent is an AI-assisted Azure capability that helps you plan, assess, and improve the resilience of Azure applications. In the current public preview, the agent focuses on zone resilience.

The agent supports two experiences:

- **Start Resilient** helps you design zone-resilient applications and generate resilient infrastructure-as-code templates before deployment.
- **Get Resilient** helps you evaluate existing resources and service groups, identify resilience gaps, set goals, and remediate supported resources.

For an overview and example prompts, see [Use Azure Copilot Resiliency Agent](goals-recommendations-use-agent.md).

## What can Azure Copilot Resiliency Agent do?

The agent can:

- Analyze a natural-language description of an application architecture.
- Assess the zone resilience of an Azure resource or service group.
- Identify prerequisites and blockers for enabling zone resilience.
- Create service groups and manage their membership.
- Create zone resilience goals and report goal compliance.
- Produce posture reports and prioritized recommendations.
- Enable zone resilience directly for supported resource types after user confirmation.
- Provide step-by-step guidance for resources that require migration or redeployment.
- Generate enablement scripts in PowerShell, Azure CLI, Bicep, Terraform, and Azure Resource Manager template formats.
- Generate Bicep templates for new, zone-resilient deployments.

## What is the intended use of Azure Copilot Resiliency Agent?

Cloud administrators, infrastructure teams, developers, and site reliability engineering teams can use the agent as decision support when they:

- Design new applications with zone-resilient configurations.
- Assess the zone resilience posture of existing applications.
- Identify and prioritize resilience gaps.
- Plan and implement resilience improvements.
- Track service-group compliance with zone resilience goals.

The agent isn't intended to replace architecture reviews, testing, organizational change controls, or human judgment.

## What outputs does the agent generate?

Depending on the workflow, outputs can include:

- Conversational explanations.
- Zone resilience goals and posture reports.
- Prioritized recommendations and proposed actions.
- Bicep templates for new deployments.
- PowerShell, Azure CLI, Bicep, Terraform, or Azure Resource Manager templates for remediation.

Treat these outputs as assistive guidance rather than authoritative instructions.

## How was Azure Copilot Resiliency Agent evaluated?

Microsoft evaluated the agent by using scenario-based datasets that cover request routing, service-group and discovery flows, resilience goals, zone-resilience assessment, template analysis, and multistep remediation.

Evaluation occurs at multiple levels, including:

- Whether the response addresses the user's intent.
- Whether the request routes to the correct agent capability.
- Whether the agent selects the expected tools.
- Whether tool arguments are complete and accurate.
- Whether the agent avoids unnecessary actions.
- Whether user-facing guidance is clear and complete.

Safety evaluations also include adversarial, ambiguous, malformed, unsupported, and permission-sensitive requests. Microsoft continues to evaluate and improve the experience based on identified reliability and safety gaps.

## What are the known limitations?

Consider the following limitations when you use Azure Copilot Resiliency Agent:

- **Zone resilience scope:** The public preview focuses on zone resilience. It isn't a complete assessment of disaster recovery, backup, cyber recovery, regional resilience, or incident orchestration.
- **Resource and region support:** Some resources, configurations, and regions aren't supported.
- **Available Azure context:** Results depend on resource metadata from Azure Resource Manager APIs and Azure Resource Graph. Missing, stale, or incomplete metadata can affect assessments and recommendations.
- **Permissions:** The agent can use only the resources and metadata available through the signed-in user's permissions. Missing permissions can lead to incomplete or unsuccessful results.
- **Large service groups:** Operations can take longer for service groups with many resources or complex dependencies.
- **Generated output:** Reports, recommendations, scripts, templates, and proposed actions can be incomplete or inaccurate.
- **Language:** The agent is primarily designed and evaluated for English-language interactions. Results for unsupported or mixed-language prompts might be less reliable.

## Are the results authoritative?

No. Azure Copilot Resiliency Agent provides assistive guidance based on the Azure context and resource metadata that it can access. Validate its output against your workload requirements, Azure product documentation, reliability objectives, and organizational standards before taking action.

## Does the agent make autonomous changes?

No. The agent uses human-in-the-loop controls for resource-impacting operations and requires user confirmation. Some supported resources can be changed in place after confirmation. For resources that require migration or redeployment, the agent provides guidance and scripts instead.

Apply your normal review, testing, approval, and change-management processes before using generated output in production.

## What operational factors support effective and responsible use?

Follow the best practices in the following list while using the agent:

- Give the agent a clear resource or service-group scope.
- Provide relevant architecture and resilience requirements.
- Verify that Azure resource metadata is current.
- Confirm that you have the permissions required for the requested operation.
- Review recommendations, scripts, and templates before use.
- Test generated changes in a nonproduction environment.
- Use peer review and established change controls for production changes.
- Monitor resources after remediation to confirm the intended outcome.

## What data does the agent access?

The agent uses text that you enter and structured Azure context available within your permissions. This context can include:

- Azure resource metadata and configuration details.
- Resource relationships.
- Service-group membership.
- Zone resilience goals.

The agent can retrieve this context through Azure Resource Manager APIs and Azure Resource Graph.

## Can the agent access Azure data that I'm not authorized to view?

No. The agent works in the signed-in user's security context and is limited by the user's Azure role-based access control permissions. If you don't have access to a resource or required metadata, the agent can't use that information.

## How should I manage privacy and sensitive data?

Don't include secrets, credentials, or other sensitive information in prompts. Use Azure role-based access control to limit the resources and metadata available to each user, and follow your organization's data-handling and governance policies.

For information about how Azure Copilot uses and collects data, see [Responsible AI FAQ for Azure Copilot](/azure/copilot/responsible-ai-faq).

## What Responsible AI risks should I consider?

As with other generative AI systems, the agent can produce inaccurate, incomplete, irrelevant, or ungrounded output. It can also misunderstand ambiguous requests, select an incorrect action, use incorrect arguments, or provide incomplete posture and next-step summaries.

Users should also consider risks from prompt injection, unsafe or destructive requests, unsupported scenarios, permission failures, tool errors, and overreliance on generated output. Additional review is required when the output could contribute to consequential decisions or be used in a sensitive or regulated environment.

## What safeguards help reduce risk?

The agent uses Azure Copilot platform safeguards and agent-level safety instructions. It works within the signed-in user's security context, applies human-in-the-loop controls to resource-impacting operations, and is evaluated against content-safety, jailbreak, prompt-injection, code-vulnerability, routing, and tool-use risks.

These safeguards reduce risk but don't eliminate the need for user validation and oversight.

## How do I provide feedback?

Use the thumbs-up or thumbs-down control in Azure Copilot to rate a response and provide details. Don't include confidential or sensitive information in feedback.

## Related content

- [Use Azure Copilot Resiliency Agent](goals-recommendations-use-agent.md)
- [Assign goals and view resilience posture](goals-recommendations-assign-goals-view-posture.md)
- [Review recommendations](goals-recommendations-review-recommendations.md)
