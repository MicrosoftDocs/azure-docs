# Choose the right query strategy for Azure Resource Graph

Azure Resource Graph (ARG) is built for fast, large-scale queries across your Azure resources. Because ARG indexes data asynchronously, it's important to understand when to query ARG directly and when to fall back to the resource provider (RP) that owns the resource — the source of truth for its resource state. This article explains how ARG fits into the Azure control plane, when to use a hybrid ARG + RP query strategy, and how to choose between RP, ARG's Query API and its Get/List API.

## How ARG fits into the Azure control plane

The resource control plane has three components:

- **Azure Resource Manager (ARM)** — the request gateway for ARG. ARM routes requests to ARG without needing to make individual calls to each resource provider.

- **Resource providers** (for example, the Compute Resource Provider, or CRP) — the source of truth for resource state. Direct calls to a resource provider's APIs return **strongly consistent data**.

- **Azure Resource Graph (ARG)** — an asynchronous index over control-plane data, built for high-throughput, scalable querying across large resource sets. ARG is **near real-time**, it follows an **eventual consistency model**, due to the distributed nature of the system supporting the API. It lags behind the source of truth, typically by seconds, occasionally longer in case there are any backend disruptions.

ARG stays in sync through two mechanisms: asynchronous change notifications from ARM and resource providers, and periodic reconciliation passes that catch anything a notification missed.

> [!NOTE]
> ARG trades strong consistency for scale and throughput. Resource provider APIs trade throughput for point-in-time correctness. Choose based on which one your operation needs.

## Use a hybrid query strategy for critical scenarios

In scenarios where data freshness and data reliability matter, use a hybrid strategy: query ARG for scale, and fall back to the resource provider API when you detect a data-freshness issue, an indexing delay, or elevated latency or before taking a critical action based on resource state. This avoids two failure modes at once — the cost of always calling the RP directly, and the risk of acting on stale ARG data as if it were current (for example, restarting or deprovisioning a resource based on outdated state).

### Common scenarios

**Polling immediately after resource creation** - Some workflows poll a resource within 1–2 seconds of creating it — for example, waiting for provisioningState to reach a final state, or waiting for certain properties to appear in the response. Because ARG indexing may not have completed yet, a query issued this soon after creation can return 404 Not Found even though the resource exists. Use a hybrid strategy here to avoid false negatives: if ARG returns not-found immediately after a write, fall back to the resource provider before treating it as an error.

**Verifying state before a destructive operation** - If your workflow uses ARG to identify candidate resources for an operation, and that operation is destructive (delete, restart, deprovision), don't act on the ARG result directly. Backend latency can leave ARG's view of a resource out of date, which is a meaningful risk when the resulting action can't be undone.

> [!IMPORTANT]
> Use ARG to build your candidate list, then run a strong-consistency check against the resource provider immediately before executing the destructive action.

### Guidance to handle eventual consistency for ARG

- **Verify only before irreversible actions, not on every poll.** Add a secondary resource-provider check before customer-impacting or destructive workflows — not on every ARG query. Verifying every poll defeats the purpose of using ARG and can trigger throttling at scale. The pattern is: trust ARG for identification and scale, verify with the source of truth right before anything irreversible.

  > [!TIP]
  > If verifying at your operation's volume raises throttling concerns, engage Microsoft before you hit a limit. Quota increases to support this pattern are a supportable, expected request — not an edge case.

- **Add wait time between subsequent ARG queries where your scenario allows it.** Where it does, use exponential backoff: start with a couple of seconds before the first retry, and increase the wait time with each subsequent attempt (for example, 2s → 4s → 8s → 16s...) up to a cap of a few minutes. Stop increasing once you hit that cap, and either continue polling at the capped interval or fall back to the resource provider API.

- **Consider the [ARG Get/List API](../resource-graph/concepts/azure-resource-graph-get-list-api.md) for high-frequency polling.** Refer to [this section](../resource-graph/concepts/azure-resource-graph-get-list-api.md#building-resilient-resource-queries-with-arg-and--resource-provider-approach) that has more on setting up a fallback with the Get/List API.

## API comparison

Use this table to decide which API fits your scenario.

| Feature | Resource provider APIs (example: CRP) | ARG Query API | ARG Get/List API |
|---------|---------------------------------------|---------------|------------------|
| **What it is** | Direct calls to a resource provider's own APIs (for example, VM/VMSS APIs) for querying resources and inventory. | Azure Resource Graph's bulk query API, available through Resource Graph Explorer in the Azure portal, Azure PowerShell, Azure CLI, SDKs, and REST API. | Uses the existing control-plane Get/List APIs with useResourceGraph=true appended, which routes the call through the ARG backend. Available through Azure REST APIs and select SDKs. |
| **Reference** | [Find resource providers by Azure services](../../../azure-resource-manager/management/azure-services-resource-providers.md) | [Run Azure Resource Graph query using REST API](../first-query-rest-api.md), which uses `POST /providers/Microsoft.ResourceGraph/resources` | [ARG GET/LIST API](../resource-graph/concepts/azure-resource-graph-get-list-api.md) leverages the existing control plane GET APIs appending the flag "useResourceGraph=true" to the APIs which seamlessly routes the call to this backend. |
| **Best for** | • Small-scale, ad hoc, or infrequent queries against control-plane APIs.<br>• Scenarios that require strongly consistent data straight from the source of truth.<br>• A final check before a destructive or irreversible operation (delete, restart, deprovision).<br>• A fallback when ARG data is stale. | • Tenant-level bulk lookups that join across multiple tenants, subscriptions, resource groups, or management groups for complex analytical scenarios.<br>• Scanning or polling many resources (thousands+) for state. | • Lookups scoped to the full get/list API surface for a single subscription or resource group.<br>• High-concurrency, high-throughput polling scenarios. |
| **Throttling quota** | Varies by resource and operation, generally lower than ARG limits. Example: GET on VMSS VMs is 36 calls/min at the resource level and 2,000 calls/min at the subscription level. | 15 queries per 5 seconds. Can be raised on a case-by-case basis. | Aligns with ARM limits — upto 4,000 queries/min/subscription/caller. This is a soft limit and can be raised as needed. |
| **Consistency level** | Strongly consistent — this is the source of truth. | Follows an eventual consistency model. Data is indexed in the ARG backend with a latency of a few minutes, typically under 1 minute. | Follows an eventual consistency model. Data is indexed in the ARG backend with a latency of a few minutes, typically under 1 minute. |
| **Availability** | Control-plane APIs themselves don't carry an SLA, but the resources managed through them do — for example, Azure VMs carry an SLA of 99.9% or higher depending on redundancy options. | No public SLA. | No public SLA. |
| **Product lifecycle stage** | Generally available (GA) | Generally available (GA) | Generally available (GA) |
| **Pricing** | Free to call. Resources created or managed through these APIs (VMs, storage, etc.) incur standard Azure charges. | Free | Free |

> [!NOTE]
> Throttling limits vary by resource type and operation. The figures above are examples (VMSS shown for the resource provider column) — check current limits for your specific resource type and region rather than treating these as fixed constants.

Both the hybrid fallback pattern and the Get/List API help ensure you're retrieving the most accurate resource state available, without being blocked by short-lived data-freshness gaps.

---

**Note for ARG and Pacific pages:** ARG data is not strongly consistent. This means that data is indexed in ARG with a short latency. For more details, and guidance on how to manage the consistency, see [choose-query-strategy.md](choose-query-strategy.md)
