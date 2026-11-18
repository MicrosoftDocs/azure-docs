---
title: What is Azure Agent Grid? (limited preview)
description: Learn how Azure Agent Grid protects ACI and AKS agent workloads in limited preview. Explore workload identities, policies, and access requirements.
author: asudbring
ms.author: allensu
ms.service: azure
ms.topic: overview
ms.date: 11/17/2026
---

# What is Azure Agent Grid? (limited preview)

Azure Agent Grid is a network security capability that protects AI agents, and the models, tools, and services they connect to, from within the Azure network platform. Agent Grid gives each enrolled workload a verifiable workload identity, carries its traffic over mutually authenticated and encrypted (mTLS) tunnels, and enforces policies that you write in terms of that identity. Enforcement happens outside the agent's sandbox, so an agent can't bypass or override it, and you don't need to change agent code, add an SDK, or deploy sidecars.

Agent Grid is in limited preview for both AI sandboxes in Azure Container Instances (ACI) and Azure Kubernetes Service (AKS). To request access, complete the [Agent Grid limited preview access request form](https://aka.ms/AG_RequestAccess).

> [!IMPORTANT]
> Agent Grid is currently in limited preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> Agent Grid was internally named Agent Fabric. Azure Resource Manager resource types, the Azure CLI, and API properties might still use that name.

## Why use Agent Grid

AI agents are powerful and increasingly autonomous, and it helps to treat them as untrusted insiders. For example, an agent can be manipulated through a prompt injection hidden in content it processes into reaching destinations or calling tools it was never meant to use. Because agents act with real credentials and permissions, the impact of a compromised agent can be severe.

Agent traffic also doesn't look like traditional application traffic. A single request can trigger many calls across agents, models, Model Context Protocol (MCP) servers, tools, and Azure services, over multiple turns and multiple hops. The result is a web of interactions rather than a few predictable flows. Placing a gateway in front of each agent doesn't scale to that pattern, and ingress and egress controls differ across the compute services where agents run. You also have difficulty maintaining policies based on IP addresses when many short-lived pods or sandboxes share the same infrastructure.

Agent Grid addresses these challenges by building agent security into the Azure network platform:

- One consistent set of network controls across the Azure compute services where your agents run.
- Policies based on workload identity, so you don't have to track changing IP addresses.
- Enforcement outside the agent's trust boundary, so the agent can't turn it off or route around it.
- Protection without changes to your agents or applications.

## Key capabilities

- Workload identity for every enrolled agent. Agent Grid attests each enrolled workload and issues it a short-lived X.509 workload identity certificate based on the open SPIFFE standard.
- Encrypted, mutually authenticated connectivity. Traffic from an enrolled workload travels through an mTLS tunnel tied to that workload's identity, so traffic is encrypted and only authenticated parties communicate.
- Identity-based policies. Policies can target workload identities instead of IP addresses. You can still use IP addresses and ranges where you need them; Agent Grid supports controls from layer 3 through layer 7.
- Traffic inspection policies built for agent traffic: FQDN filtering, URL filtering, MCP policies that control which MCP tools an agent can call, TLS inspection, and prompt injection protection that uses Prompt Shields in Azure AI Content Safety.
- Bring your own Azure AI Content Safety. Prompt Shields inspection uses an Azure AI Content Safety resource that you own and connect to the grid.
- Enforcement the agent can't bypass. Agent Grid intercepts the workload's traffic outside the sandbox, so the agent can't override it and all of its traffic goes through Agent Grid.
- Observability. Agent Grid sends flow logs to Azure Monitor through diagnostic settings, so you can keep them in a Log Analytics workspace. The flow map shows the connections between members and the destinations they reach. You can select a blocked flow to see the policy and the reason it was blocked, and inspected requests include a deep inspection view.
- Isolation for each grid. Each grid is isolated with its own policies, which limits the impact of a misconfiguration or compromise to that grid.

## Supported compute

| Compute service | Workloads you can enroll | Preview status |
| --- | --- | --- |
| AI sandboxes in Azure Container Instances (ACI sandbox groups) | Sandboxes in an attached sandbox group | Limited preview |
| Azure Kubernetes Service (AKS) | Agent sandbox workloads and traditional Kubernetes deployments in an attached cluster | Limited preview |

AI sandboxes run each agent in its own lightweight, hypervisor-isolated micro VM, which provides compute isolation. Agent Grid adds network isolation and network security on top of that compute isolation.

## Key concepts

| Concept | Description |
| --- | --- |
| Agent Grid | A top-level resource that defines an isolated security boundary for a set of agent workloads. Each grid has its own trust domain for member identities and default policy groups that apply to all of its members. |
| Attached resource | A compute resource, such as an ACI sandbox group or an AKS cluster, that you attach to a grid. Attaching a resource makes its workloads available to enroll; it doesn't change their traffic. |
| Member | A workload that you enroll in a grid. You create and remove members through the compute service, for example when you enroll a sandbox, not directly through Agent Grid. Agent Grid intercepts and governs traffic only for members. |
| Policy group | A top-level, resource group-scoped collection of security policies with a priority. Policy groups that you apply to a grid govern all of its members. |
| Policy | A rule in a policy group. A policy selects the workloads it applies to, for example by workload ID patterns, and defines what traffic to allow, block, or inspect. |
| Workload identity | A short-lived X.509 certificate, called an SVID, that carries the workload's SPIFFE ID. |

## How Agent Grid works

Agent Grid enforces security outside the sandbox where an agent runs. Because code inside a sandbox can be manipulated, Agent Grid treats it as untrusted and handles traffic interception, workload identity, and encryption outside of it.

- You create a grid, attach compute resources, enroll workloads as members, and apply policies.
- Agent Grid attests each enrolled workload and issues it a short-lived workload identity certificate.
- Agent Grid intercepts the workload's traffic outside the sandbox and carries it through an mTLS tunnel that's authenticated by the workload's identity.
- Agent Grid identifies the source workload by its identity and applies the grid's policies, such as FQDN and URL filtering, MCP policies, TLS inspection, and Prompt Shields.
- Agent Grid forwards allowed traffic to its destination. It drops blocked traffic and logs the request, the policy that matched, and the reason. These logs also build the flow map.

Agent Grid builds on open standards: SPIFFE for workload identity and mTLS for transport.

## Example: stop a prompt injection from triggering an unauthorized tool call

Consider an application with two agents and an MCP server. Agent 1 runs in one ACI sandbox and Agent 2 runs in another sandbox. The MCP server exposes tools for a support ticket system, including a read tool that retrieves tickets and a write tool that extends a customer's license activation. Agent 2 is meant only to read and summarize tickets.

A customer opens a support ticket that contains hidden malicious instructions. When a user asks for a summary of recent tickets, Agent 2 retrieves the ticket through the MCP server, and the model processing the ticket is tricked into calling the tool that extends a license. Because Agent 2 is a legitimate, authenticated workload, application-level checks alone don't stop the call.

With Agent Grid, you apply an MCP policy that allows Agent 2 to call only read operations on the MCP server. Agent Grid blocks the write tool call on the network and logs the attempt. If the injected instructions also try to send data to an unapproved destination, FQDN or URL filtering blocks that connection, and Prompt Shields can detect and block the malicious prompt itself. The flow map shows the blocked flows, and selecting one shows the policy that blocked it.

## Region availability

During the limited preview, Agent Grid is available in these regions: Central US, West US 2, Sweden Central, Australia East, and Indonesia Central.

## Limitations

### Supported compute and hosting

- ACI sandbox groups are supported only with a public IP address. Sandbox groups that use virtual network integration aren't supported in this preview.
- Agent Grid doesn't support private AKS clusters in this preview.
- AKS clusters should use Microsoft Entra integration.
- Unenroll AKS clusters from Agent Grid before you delete them.
- Other hosting environments, such as Microsoft Foundry hosted agents, Azure Container Apps, and Microsoft Copilot Studio, aren't supported in this preview.

### Grid, members, and service limits

- Compute resources must be in the same subscription and region as the grid, and a compute resource can be attached to only one grid.
- Agent Grid applies only to workloads that you enroll as members. Workloads in an attached resource that you don't enroll aren't affected.
- The compute service creates and deletes members. You can't create a member directly.
- You can't change a grid's trust domain after you create it.
- Service limits are 500 grids per region and 100 members per grid.

### Networking

- TCP and IPv4 are currently supported.
- If you use your own virtual network, allow inbound traffic to the Agent Grid gateway's load balancer IP address on TCP ports `15008` and `15009` in the subnet's network security group (NSG).

### Identity and security policies

- Agent Grid workload identities aren't connected to Microsoft Entra Agent ID in this preview.
- TLS inspection and content inspection policies support only member identities as the source.
- A TLS inspection policy has at most one rule, and TLS inspection uses an Azure-managed certificate authority.

## Next steps

- [Configure Azure Agent Grid (limited preview)](configure-agent-grid.md).
