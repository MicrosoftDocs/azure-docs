---
title: Configure Azure Agent Grid (limited preview)
description: Learn how to configure Azure Agent Grid in limited preview, request access, enroll ACI or AKS workloads, apply policies, and validate traffic.
author: asudbring
ms.author: allensu
ms.service: azure
ms.topic: how-to
ms.custom: template-how-to
ms.date: 11/17/2026
# Customer intent: As a network administrator, I want to configure Azure Agent Grid in the Azure portal so that I can protect agent workloads and inspect their traffic.
---

# Configure Azure Agent Grid (limited preview)

In this article, you learn how to configure Azure Agent Grid in the Azure portal. You create a grid, attach compute resources, enroll workloads as members, add policies in policy groups, and validate traffic with flow logs.

Agent Grid is in limited preview for both AI sandboxes in Azure Container Instances (ACI) and Azure Kubernetes Service (AKS). To request access, complete the [Agent Grid limited preview access request form](https://aka.ms/AG_RequestAccess).

> [!IMPORTANT]
> Agent Grid is currently in limited preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> Agent Grid was internally named Agent Fabric. Azure Resource Manager resource types, the Azure CLI, and API properties might still use that name.

## Prerequisites

Before you begin, review the [Azure Agent Grid limitations](overview.md#limitations).

- An Azure account with an active subscription and approved access to the Agent Grid limited preview. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The `Microsoft.NetworkSecurity` resource provider, `Microsoft.NetworkSecurity/AgentGridPreview` for Agent Grid, `Microsoft.ContainerInstance/AIAgentsGroupsPreview` for AI sandboxes in ACI, and `Microsoft.ContainerService/EnableAgentFabricPreview` for AKS registered in the subscription. For instructions, see [Set up preview features in an Azure subscription](../azure-resource-manager/management/preview-features.md#register-preview-feature).
- A region where Agent Grid is available. See [Region availability](overview.md#region-availability).
- An Azure Kubernetes Service (AKS) cluster or an AI sandbox group in Azure Container Instances (ACI) that runs your agents.
- If you use AgentGateway for AKS, enable Gateway API support on the cluster. Agent Grid doesn't include this support automatically. You can enable it by using the [managed Gateway API installation](/azure/aks/managed-gateway-api).
- To use content inspection policies (Prompt Shields), an Azure AI Content Safety resource that you own, and its endpoint and an API key.
- To store flow logs, a Log Analytics workspace.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Plan the configuration

Use the following workflow to configure Agent Grid. After you apply policies, turn on flow logs and use **Flow map** and **Live inspect** to see what Agent Grid allows and denies.

| Step | What you do |
| --- | --- |
| 1 | Create an agent grid |
| 2 | Attach the ACI sandbox groups that run your agents |
| 3 | Enroll the workloads that you want to protect |
| 4 | Add policies to the grid in policy groups |
| 5 | Review the policy order and member connectivity |
| 6 | Turn on flow logs |
| 7 | Validate traffic |

Keep these behaviors in mind as you plan:

- Attaching a compute resource doesn't change any traffic. Agent Grid intercepts and governs traffic only for workloads that you enroll as members. Workloads that you don't enroll aren't affected.
- Policy groups that you apply to a grid govern all members of that grid. Individual policies select the workloads they apply to by workload identity.
- Policy groups are independent resources. They aren't children of a grid, so you can create a policy group once and apply it to more than one grid.
- The grid checks policy groups from the lowest priority number, and the policies of each group from top to bottom. The first policy that applies to a request decides.
- When an FQDN filtering, URL filtering, or MCP policy applies to a member, the grid denies the member's other traffic, unless another policy allows it.
- If a grid has TLS inspection policies, it decrypts HTTPS only from their sources. That affects content inspection, URL filtering, and MCP policies for other members, as described in TLS inspection.

## Create an agent grid

A grid is the Azure resource that your agents join. It gives each member an identity and applies your policies to its network traffic.

1. In the Azure portal, search for and select **AgentGrid**.
1. On the **Overview** page, select **Create**. You can also select **Create** under **Create a grid** on the **Get started** page.
1. On the **Basics** tab of the **Create an AgentGrid** page, enter the following information:

   | Section | Setting | Value |
   | --- | --- | --- |
   | **Project details** | **Subscription** | Select your Azure subscription. |
   | **Project details** | **Resource group** | Select a resource group, or select **Create new**. |
   | **Instance details** | **Name** | Enter a name. The name must be 3 to 24 characters and can contain letters, numbers, and hyphens. |
   | **Instance details** | **Region** | Select the region of the AKS clusters and ACI sandbox groups that run your agents. Each resource that you attach must be in the grid's subscription and region. |

1. Select **Review + create**, and then select **Create**. When the deployment finishes, the grid appears in the list on the **AgentGrid Overview** page with the status **Succeeded**.

## Attach your compute resources

Attach the AKS clusters and ACI sandbox groups that run your agents. Each attachment creates a cluster association under the grid.

- The compute resource must be in the same subscription and region as the grid.
- A compute resource can be attached to only one grid.
- You can't change the target resource of an existing attachment. To attach a different resource, detach and attach again.

To attach a resource in the Azure portal:

1. Open your grid, select **Grid members** > **Attached resources**, and then select **Add**.
1. In the **Add resources** pane, under **Orchestrator**, select **AKS cluster** or **ACI sandbox group**. The pane uses the subscription and region of the grid, because a resource must be in the grid's subscription and region.
1. If you selected **AKS cluster**, select the AKS cluster that you want to attach.
1. For an ACI sandbox group, under **Sandbox group**, search for and select the group. Then, under **Sandboxes**, select the sandboxes to add. A sandbox group that's already attached to a grid shows the name of that grid.
1. Select **Attach**.

The resource is attached when its **State** on the **Attached resources** page is **Added to grid**. The page also lists the **Kind**, **SKU**, and number of **Members** of each resource.

## Enroll workloads as members

Enroll the workloads that you want Agent Grid to protect. When you enroll a workload, Agent Grid attests it, issues it a workload identity (a SPIFFE ID), and starts intercepting its traffic. Workloads that you don't enroll keep running unchanged.

1. Open your grid, and then select **Grid members** > **Members**. The page groups the workloads by the resource that they run on.
1. Find each workload that you want to protect. If its status is **Not enrolled**, select **Enroll** in its row. You can search by workload or SPIFFE ID, and filter by status. If an AKS cluster shows **Workloads not read**, the portal can't list the cluster's namespaces. Enter a namespace that you can read in **Namespace to read**, under **Add workloads** on the **Attached resources** page.
1. Confirm that each workload shows the status **Enrolled** and has a SPIFFE ID.

## Add policies to the grid

A policy group holds security policies. Each grid that lists the group in its default policy groups enforces its policies. A policy group has a priority and a list of policies, and each policy has its own name, priority, direction, ports, source, and destination. The source selects workloads by workload ID patterns, so a policy can apply to every member or to specific members.

Agent Grid supports these policy types in this preview:

| Policy type | What it does |
| --- | --- |
| FQDN filtering | Allows the source to reach only the listed FQDNs. The grid denies other destinations for this source, unless another policy allows them. |
| URL filtering | Filters HTTP(S) requests by URL and method. The grid denies other traffic of this source, unless another policy allows it. |
| MCP | Allows or denies MCP tool calls to MCP servers, by tool name. The grid denies other traffic of this source, unless another policy allows it. |
| TLS inspection | Decrypts TLS only for the selected sources, so that other policies can inspect their HTTPS traffic. |
| Content inspection | Finds prompt injection in JSON request bodies (POST, PUT, PATCH) by using Prompt Shields in your Azure AI Content Safety resource. The grid denies a request that contains a prompt injection (HTTP 403). |

A content inspection policy requires a Content Safety connection on the grid. Until you connect a resource, you can't add a content inspection policy to the grid. If you add a content inspection policy to a group that's applied to a grid without a connection, Agent Grid rejects the change and keeps the previous policies.

### Connect your Azure AI Content Safety resource

1. Open your grid and select **Settings** > **Content Safety**.
1. Copy the endpoint and API key from **Keys and Endpoint** in your Azure AI Content Safety resource menu, and enter the following information:

   | Setting | Value |
   | --- | --- |
   | **Endpoint** | Enter the endpoint of your Azure AI Content Safety resource, for example `https://contoso.cognitiveservices.azure.com/`. |
   | **API key** | Enter a key of the resource. |

1. Select **Save**.

The grid keeps the key secret, and the portal never shows a saved key. To change the key later, enter the new key.

### Configure security policies

When you add a policy, the settings depend on its type:

| Policy type | Settings |
| --- | --- |
| FQDN filtering | Under **Destination**, add one or more **Destination FQDNs**, or paste a list. Optionally, enter a **Policy name** (the default is `allow-rule`) and change the **Ports** (the default is `443`). |
| URL filtering | Under **Rules**, set the **Rule priority**, an optional **Rule name** (the default is `allow-rule`), the **Hostname** that the rule decides, the **HTTP method** (the default is **Any**), the **Rule action**, and optional **Paths**. In **Hostname**, for example `api.contoso.com`, `*` matches any characters, also across dots. In **Paths**, enter one path per line, for example `/v1/*`, or leave it empty to match all paths. Select **Add rule** to add more rules. Then choose the **Default action**, which applies to the hosts that the rules name when no rule matches. Other hosts get no verdict from this policy. |
| MCP | Add rules that allow or deny MCP tool calls by tool name, and choose a default action. On the **Policies** page, an MCP policy shows its rules and default action, for example **Allow 1 rule · default Deny**. |
| TLS inspection | **Source** supports only member identities, and the **Certificate** is an Azure-managed CA. Choose the **Default action**, which applies to a TLS connection of the sources when no rule matches: **Inspect** decrypts the connection, and **Bypass** passes it through. Under **Rules**, set the **Rule priority**, an optional **Rule name** (the default is `inspect-rule`), the **Rule action**, and the **Destination FQDNs**, each an exact host name or a name with one leading `*`. The rule matches the SNI of the connection. A rule without an action takes the default action and only names the connection in the logs. A TLS inspection policy has at most one rule for now. |
| Content inspection | **Source** supports only member identities, and there are no other settings. The policy denies a request (HTTP 403) when the Content Safety resource of the grid finds a prompt injection in it, so the grid needs a Content Safety connection first. |

To add a policy to the grid:

1. In your grid, select **Policies**, and then select **Add policy**.
1. Under **Policy group**, select **Create new group**, or select an existing policy group. For a new group, enter a **Name**, for example `egress-openai`.
1. For a new group, review the **Priority**. The text under it shows where the grid checks the group, for example **Checked 4 of 4 in this grid**. To change the position, enter another priority or select **Place**. Optionally, expand **More options**.
1. Under **Policy type**, select **FQDN filtering**, **URL filtering**, **MCP**, **TLS inspection**, or **Content inspection**.
1. Under **Source**, select **Member identities**, and then in **Select members**, enter a member or a pattern. TLS inspection and content inspection policies support only member identities.
1. Enter the settings for the policy type. The preceding table describes them.
1. Select **Add**.

## Review the policy order and member connectivity

The grid checks policy groups from the lowest priority number, and the policies of each group from top to bottom. The first policy that applies to a request decides.

1. In your grid, select **Policies**. The page lists the policy groups that apply to the grid and their policies.
1. Under **Policy groups**, review each group's policy types, **Priority**, and place in the order, for example **Checked 2 of 3**.
1. Under **Policies**, review each policy's **Order**, **Name**, **Type**, **Applies to**, **Rules**, and **Policy group**. To change or delete a policy, select its edit or delete icon.
1. Under **Member connectivity**, check the decision of the attached policy groups from each member to the other members and to **External**: **Allow**, **Deny**, **Depends on request**, or **Not applicable**. Select a cell to see the rule that decides it under **Details**.

## Turn on flow logs

Agent Grid sends flow logs to Azure Monitor through diagnostic settings, in the `AgentFabricFlowLogs` log category. Flow logs record allowed and denied requests and the policy that matched. The **Flow map** and **Live inspect** pages of the grid are built from these logs.

1. Open your grid, and then select **Monitoring** > **Diagnostic settings**. You can also select **Diagnostic settings** on the toolbar of the **Flow map** or **Live inspect** page.
1. Select **Add diagnostic setting**.
1. Enter a name, select the **AgentFabricFlowLogs** category, and select **Send to Log Analytics workspace**.
1. Select your workspace, and then select **Save**.

## Validate the configuration

1. On the grid's **Overview** page, confirm that **Status** under **Essentials** is **Succeeded**. If you turned on flow logs, **Essentials** also shows them under **Flow logs**. Confirm that each resource on the **Attached resources** page shows the state **Added to grid**, and that each workload that you enrolled shows the status **Enrolled** on the **Members** page.
1. In the **Members** card of the **Overview** page, check the members without an identity and the members that no policy targets. Under **Needs attention**, select **Add policy** next to a member to add a policy for it.
1. From an enrolled workload, connect to a destination that your policies allow and to one that they deny. The allowed request succeeds, and the denied request fails. For a denied HTTP request, the grid returns status 403.
1. In the grid, select **Live inspect**. Each request shows its **Source**, **Destination**, **Verdict** (**Allow**, **Deny**, or **Unknown**), **Reason**, **Status**, and the **Rule** that decided it, such as a policy name or **Default action**. For MCP traffic, the **MCP** column shows the MCP method or tool, for example `tools/list`. New requests can take some minutes to show.
1. Select **Flow map** to see the flows between sources and destinations, with the number of allowed, denied, and unknown requests. A line with a denied request is red; select a verdict to highlight its flows. Use **Requests over time** to focus the map on a time window.
1. To query the flow logs, select **Open in Log Analytics** on the **Live inspect** or **Flow map** page, or review the entries in your Log Analytics workspace.

## Manage the configuration

- To change or delete a policy, open the grid's **Policies** page, and select the edit or delete icon of the policy.
- To stop protecting a compute resource, detach it.

## Troubleshoot

| Symptom | Cause and resolution |
| --- | --- |
| Attaching a resource is rejected | The resource is in a different subscription or region from the grid, or it's already attached to another grid. |
| You can't add a content inspection policy, or a policy group change that adds one is rejected | The grid, or a grid that uses the group, has no Content Safety connection. In the grid, select **Settings** > **Content Safety**, connect your Content Safety resource, and then retry. |
| A workload's traffic isn't being filtered | The workload isn't enrolled (its status on the **Members** page is **Not enrolled**), no policy targets it (the **Members** card on the grid's **Overview** page lists it under **Needs attention**), the policy group doesn't apply to the grid, or the member pattern of the policy doesn't match the workload. |

## Clean up resources

When you no longer need the grid, remove its configuration:

1. Detach all compute resources from the grid.
1. Delete the grid.
1. Delete policy groups that you no longer need.

## Related content

- [What is Azure Agent Grid? (limited preview)](overview.md).
- [Key concepts](overview.md#key-concepts).
- [Supported compute](overview.md#supported-compute).
