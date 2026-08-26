---
title: AI agent shared responsibility model - Microsoft Azure
description: Understand the shared responsibility model for AI agents on Azure, covering the orchestration, tool, and memory layers unique to autonomous agents.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 08/26/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# AI agent shared responsibility model

AI agents extend generative AI beyond the request/response pattern that the [AI shared responsibility model](shared-responsibility-ai.md) describes. Unlike a large language model, an agent doesn't only return content for a human to act on. Instead, an agent:

- **Acts autonomously.** It invokes tools, calls APIs, writes data, and triggers workflows without a human approving each step.
- **Plans and loops.** It decomposes goals, reasons over intermediate results, and reprompts itself many times before returning.
- **Holds state and memory.** Short-term context plus persistent memory influences future behavior and can cross session or user boundaries.
- **Has an identity.** It authenticates to downstream systems by using managed identities, on-behalf-of tokens, or a [distinct agent identity](/entra/agent-id/what-is-microsoft-entra-agent-id), and it carries privileges of its own.
- **Composes with other agents.** In multi-agent orchestration, one agent's output becomes another agent's instruction, introducing a new trust boundary.

Each of these behaviors introduces responsibilities that don't exist in the request/response AI model.

> [!NOTE]
> This article uses "responsibility" in a governance sense: who is expected to configure, operate, and monitor each control. It is illustrative guidance and is not intended to convey legal conclusions or to modify or contradict the terms of any agreement between you and Microsoft.

## How AI agents differ from cloud and AI workloads

The following table summarizes how the AI agent model differs from the standard cloud model and the generative AI (LLM) model.

| Concern | Standard cloud model | AI (LLM) model | AI agent model |
|---|---|---|---|
| Primary interaction | API or GUI | Prompt to response | Goal to autonomous multi-step action |
| Real-world side effects | Application code, explicit | Human acts on output | Agent acts directly through tools |
| State | Application and data layer | Stateless prompt | Persistent agent memory and context |
| Identity | User or application identity | User or application identity | Distinct agent identity plus delegated tokens |
| Trust boundary | User to application | User to model | User to agent to tools to other agents |
| Top risk | Misconfiguration, data exposure | Prompt injection (content) | Prompt injection that drives actions; excessive agency; confused deputy |

## Division of responsibility

As with the [cloud](shared-responsibility.md) and [AI](shared-responsibility-ai.md) shared responsibility models, the division of responsibility shifts with the deployment model that you choose. For agents, the relevant options are:

- **SaaS agent.** A ready-made agent, such as Microsoft 365 Copilot agents, Microsoft Security Copilot, or published Microsoft Copilot Studio agents. Microsoft operates the orchestrator, model, safety systems, and most tool connectors. You own configuration, data access scoping, identity, and usage.
- **PaaS agent.** You build an agent on a managed agent platform, such as Microsoft Foundry Agent Service, custom Microsoft Copilot Studio agents, or the Microsoft Agent Framework on an Azure-managed runtime. Microsoft provides the runtime, model hosting, and platform safety controls. You own the agent's instructions, tool and plugin selection, tool permissions, orchestration logic, memory design, and the agent's identity and authorization.
- **IaaS agent.** You build and host the entire agent stack yourself: a custom orchestrator on VMs or containers, a self-managed framework, and possibly self-hosted models. You own nearly everything except the physical infrastructure (and the base model, if you consume it as a hosted API).

Responsibility shifts *left*, meaning you take more ownership, as you move from SaaS to PaaS to IaaS agents.

The following diagram illustrates the areas of responsibility between you and Microsoft according to the type of agent deployment.

:::image type="content" source="media/shared-responsibility-ai-agent/ai-agent-shared-responsibility.svg" alt-text="Diagram of AI agent responsibility layers across IaaS, PaaS, and SaaS agent deployments, with three new layers (agent memory and state, tools and actions, and agent orchestration) added on top of the AI shared responsibility model." border="false":::

## AI agent layer overview

An agentic system adds three new layers on top of and around the existing AI platform, application, and usage layers. Security responsibility follows whoever performs the task, but a provider might expose controls to you as configuration.

### AI platform layer (inherited)

The AI platform layer hosts and safeguards the model, training data, weights, and inference APIs. Microsoft provides built-in input and output safety systems for PaaS ([Microsoft Foundry](/azure/ai-foundry/) and [Azure OpenAI](/azure/ai-services/openai/overview) models) and for SaaS ([Microsoft Security Copilot](https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot) and [Microsoft 365 Copilot](https://www.microsoft.com/microsoft-365/copilot)).

### Agent orchestration layer

The orchestration layer is the "brain loop": planning, reasoning, tool selection, the agent's system prompt and instructions, and multi-agent coordination. This layer is where *excessive agency* and *prompt-injection-to-action* risks live.

Security considerations:

- Constrain the agent's instructions and scope (least functionality).
- Validate and sanitize any untrusted content that enters the loop, including retrieved documents, tool outputs, and other agents' messages. Treat all of it as untrusted input, not as trusted instructions.
- Enforce planning guardrails: step and iteration limits, loop detection, budget and cost ceilings, and allow lists for which tools can be chained.
- For multi-agent systems, treat each inter-agent message as a trust boundary and reapply input safety.

### Tools and actions layer

The tools and actions layer contains the connectors, plugins, functions, Model Context Protocol (MCP) servers, and APIs that the agent can invoke to read and *change* state in the real world. This layer is the biggest difference from the LLM model.

Security considerations:

- **Least privilege per tool.** Each tool or connector should hold only the permissions required. Don't grant the agent a broad standing identity.
- **Authorization on every action, not only at session start.** Recheck that this action, on this resource, is permitted. This check mitigates confused-deputy and over-broad delegation risks.
- **Human-in-the-loop gates.** Require them for high-impact, irreversible, or sensitive actions such as writes, deletes, payments, production changes, and external sends.
- **Action auditing.** Log every tool invocation with inputs, outputs, the identity used, and the decision rationale.
- **Sandboxing and egress control.** Apply them to code-execution and browsing tools.

### Agent memory and state layer

The agent memory layer covers short-term conversation context plus persistent memory, vector stores, and scratchpads that influence future behavior.

Security considerations:

- **Scope and isolate memory per user and tenant.** Prevent cross-user or cross-session memory bleed.
- **Protect against memory poisoning.** Injected content can persist and retrigger later.
- **Classify, retain, and delete stored memory.** Apply data classification, retention, and the right to deletion.
- **Encrypt memory stores and enforce access control.** Treat memory as sensitive data.

### AI application layer (inherited)

The AI application layer is the application or interface that the user consumes, together with grounding, plugins, and the application safety system.

### AI usage layer (inherited, extended)

The AI usage layer describes how users and applications consume the agent. With agents, *accountability for autonomous actions* becomes central: acceptable-use policies, user education on agent-specific risks, and clear ownership of actions the agent takes on a user's behalf.

## Responsibility matrix

The following matrix summarizes responsibility across deployment models. **C** = Customer, **M** = Microsoft, **S** = Shared. The matrix is a general guide; specific responsibilities for a given service can vary based on the service's terms and configuration.

### Inherited cloud and AI responsibilities

| Responsibility area | IaaS agent | PaaS agent | SaaS agent |
|---|---|---|---|
| Customer data (including grounding and memory contents) | C | C | C |
| Identities and users | C | C | C |
| Access management (RBAC, MFA, Conditional Access) | C | C | C |
| Client devices and endpoints | C | C | S |
| Base model hosting and weights | C/M<sup>1</sup> | M | M |
| Model input/output content safety | C/M<sup>1</sup> | S | M |
| Physical infrastructure (hosts, network, datacenter) | M | M | M |

### Agent-specific responsibilities

| Responsibility area | IaaS agent | PaaS agent | SaaS agent |
|---|---|---|---|
| Agent instructions, system prompt, and scope | C | C | S |
| Tool, plugin, and connector selection | C | C | S |
| Per-tool permissions (least privilege) | C | C | S |
| Agent identity and delegated token management | C | S | S |
| Per-action authorization checks | C | S | S |
| Human-in-the-loop approval for high-impact actions | C | C | C |
| Orchestration guardrails (loop, step, and cost limits) | C | S | M |
| Multi-agent trust-boundary controls | C | S | S |
| Memory design, isolation, and poisoning defense | C | S | M |
| Tool and action sandboxing and egress control | C | S | M |
| Action audit logging and monitoring | C | S | S |
| Agent runtime and orchestrator platform | C | M | M |
| Acceptable-use policy and accountability for actions | C | C | C |

<sup>1</sup> Customer if you self-host the model on IaaS; Microsoft if you consume a hosted model API from your IaaS-hosted agent.

## Responsibilities you always retain

Regardless of deployment model, you're always accountable for:

- **Data**, including everything written to agent memory and passed to tools.
- **Identity and least privilege**: the agent's own identity and the scope of every credential or token it can use.
- **Authorization of actions**: what the agent is allowed to do, especially irreversible or sensitive operations.
- **Human oversight**: which actions require approval and who is accountable for the agent's behavior.
- **Acceptable use and governance**: policies, user education, and compliance for autonomous behavior.

## Top agent-specific risks to design against

These risks map to the [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/), the [OWASP Top 10 for Agentic AI](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/), [MITRE ATLAS](https://atlas.mitre.org/), and the [Microsoft Security Response Center (MSRC) vulnerability severity classification for AI systems](https://www.microsoft.com/msrc/aibugbar). They emphasize the *action* dimension that's unique to agents.

| Risk | Mitigation |
|---|---|
| **Prompt injection to action.** Untrusted content, such as a webpage, document, email, or another agent, hijacks the agent into invoking tools maliciously. | Treat all tool, retrieval, and agent outputs as untrusted. Isolate instructions from data. Gate high-impact actions. |
| **Excessive agency.** The agent has more tools, permissions, or autonomy than the task needs. | Apply least functionality plus least privilege per tool, and scope instructions. |
| **Confused deputy or over-broad delegation.** The agent uses its privileged identity to do something that the requesting user can't. | Use on-behalf-of tokens and per-action authorization. Avoid a standing broad identity. |
| **Memory poisoning.** Injected content persists and retriggers later or across sessions. | Isolate and validate memory, track provenance, and enforce retention. |
| **Unbounded loops, cost, and resource exhaustion.** Runaway planning. | Enforce step, iteration, and budget limits, and detect loops. |
| **Multi-agent trust failures.** A compromised or hallucinating agent contaminates collaborators. | Reapply input safety at each inter-agent boundary. Verify, don't trust. |
| **Rogue or impersonated agents.** An unauthorized agent acts in the environment, or an agent's identity is spoofed. | Enforce strong agent identity, attestation, and detection and monitoring. |

## Configure before you customize

The same principle that Microsoft recommends for AI applies to agents, and it's *stronger* for agents because autonomy multiplies the cost of getting it wrong.

1. Start with **SaaS agents** (Microsoft 365 Copilot, Microsoft Security Copilot, or published Microsoft Copilot Studio agents). Microsoft owns orchestration, safety, and most tool security. You configure data scope and identity.
1. Move to **PaaS agents** (Microsoft Foundry Agent Service, custom Microsoft Copilot Studio agents, or the Microsoft Agent Framework on a managed runtime) only when off-the-shelf doesn't fit. You take on agent logic, tools, permissions, memory, and identity.
1. Build **IaaS agents** only with deep expertise in AI security, identity, and autonomous-systems risk. You own nearly the entire stack.

Rule of thumb: The more autonomy and the broader the tool and permission set that you grant an agent, the more of the responsibility matrix shifts to you, regardless of deployment model. Autonomy never reduces accountability.

## Next steps

- Learn about [shared responsibilities for cloud computing](shared-responsibility.md).
- Learn about the [AI shared responsibility model](shared-responsibility-ai.md).
- Learn about [Azure AI security best practices](ai-security-best-practices.md).
