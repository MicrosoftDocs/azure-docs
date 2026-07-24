---
title: Edge Actions (Preview)
titleSuffix: Azure Front Door
description: Enhance security and performance with Azure Front Door edge actions. Learn how to create, manage, and attach custom JavaScript logic to your routes.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 07/23/2026
---

# Customization at the edge using Azure Front Door edge actions (preview)  

Azure Front Door edge actions is a transformative capability that empowers organizations to run custom JavaScript logic directly at Microsoft's global Azure Front Door [PoP locations](edge-locations-by-region.md). Designed for modern web applications, Edge Actions enable ultra-low latency execution of business logic against user requests and responses.

This capability addresses the growing demand for secure, scalable, and intelligent content delivery in an era of digital transformation. As enterprises face increasing threats and performance expectations, Edge Actions offer a powerful solution to optimize request and response flows, enhance security posture, and reduce origin load, all while maintaining high availability and performance standards.

> [!IMPORTANT]
> Azure Front Door edge actions is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

:::image type="content" source="media/edge-actions/edge-actions.png" alt-text="Diagram showing Azure Front Door edge actions.":::

## Supported capabilities

During the preview, Edge Actions support only **client request invocations**, which support the following scenarios:

- A/B experimentation
- Request and response header manipulation
- Request rejection
- Dynamic origin selection
- URL rewrite
- URL redirect
- JWT token validation

### Sample JavaScript code samples for supported scenarios

You can get sample Edge Action code samples for previous use cases from the [Azure/EdgeActionsSamples](https://github.com/Azure/EdgeActionsSamples) GitHub community repo.

### Edge Actions size and resource limits

During the preview, each Edge Action resource has the following constraints:

- Code size: 16 KB
- Version counts: 3
- Execution time: 10 ms
- Maximum number of Edge Actions resources per subscription: 100

Currently, **JavaScript** is the only supported language.

For more information about service limits, see [Azure Front Door Standard and Premium service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits).

### Important considerations 

- Set one version of the code as the default version to execute against the request.
- Don't implement any unsupported methods in your code.
- The service supports code execution for up to 10 ms. If the execution goes beyond this limit, the service terminates the code execution and sends the request without Edge Action processing.
- You need to attach an Edge Action to the Azure Front Door route before it can execute against the client request.
- You can create and attach Edge Actions by using the portal UI or the Visual Studio Code extension.

## High-level flow with Edge Actions 

The following diagram shows a high-level flow of request and response to an Azure Front Door endpoint when you use Edge Actions.

:::image type="content" source="media/edge-actions/request-flow.png" alt-text="Diagram showing a high-level flow of request/response to Azure Front Door endpoint with Edge Actions in use.":::

When a user initiates a request to a resource that Azure Front Door fronts, the request follows Azure Front Door routing architecture. For more information, see [Routing architecture overview](front-door-routing-architecture.md?pivots=front-door-standard-premium). When you attach an Edge Action to a route, the request follows this flow: 

1. The request lands in one of the Azure Front Door edge PoP locations.

1. The request matches an Azure Front Door profile.

1. If the domain is enabled with WAF rules, Azure Front Door evaluates them. If not, this step is skipped.

1. If the request matches a rule configured in the Azure Front Door rule engine, Azure Front Door processes it.

1. If the request matches a rule configured to invoke Edge Action, the rules engine invokes Edge Action, and the request is routed to Edge Actions.

1. Edge Action creates a Hyperlight sandbox and loads:

    1. Custom and secure JavaScript runtime.

    1. Immutable context variable that contains all the data of the [server variables](rule-set-server-variables.md), list of healthy origins in the matched route, user's request originating country code, user's device type from user-agent header of the request, and current date-time stamp.

    1. Edge Actions code that is set as default. If execution filter is configured and corresponding header is set, then configured version is executed.

1. Edge Actions code executes and modifies the request, sends the response (if content found in cache), or sends the request to origin to be fulfilled.

## Create and manage an Edge Action

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *Edge Actions*. Select **Edge Actions** from the search results.

1. Select **+ Create**.

1. In **Create Edge Action**, enter or select the required details.

    :::image type="content" source="media/edge-actions/create-edge-action.png" alt-text="Screenshot that shows the Basic tab of creating an Edge Action." lightbox="media/edge-actions/create-edge-action.png":::

1. Select **Review + create**, and then select **Create**.

1. After the deployment finishes, select **Go to resource** to go to the Edge Action resource page.

    :::image type="content" source="media/edge-actions/edge-action-overview.png" alt-text="Screenshot that shows the Overview page of an Edge Action." lightbox="media/edge-actions/edge-action-overview.png":::

## Create a new version of Edge Action 

To execute client requests successfully, each Edge Action must include at least one code version object with an uploaded JavaScript file. By using versions, you can safely manage and release updates for Edge Actions while keeping multiple versions available. You can upload a new version and set it as the default without experiencing downtime during the switch. If an issue arises with the latest code, you can easily roll back to the previous version. You can create **up to three versions** for each Edge Action.

1. Under **Settings** of your Edge Action, select **Versions**.

1. Select **+ Add**.

1. Enter the name of the version and upload the JavaScript code.

1. Select **Set default** if you want this version to be the default for requests, and select **OK** to complete the creation.

    This operation creates a new version and uploads the JavaScript code. The portal displays the status for both operations separately. (During the preview period, the **Upload code** operation can take up to 10 minutes.)

1. When the new version is created, the portal shows the provisioning state as **succeeded**.

    :::image type="content" source="media/edge-actions/edge-action-version.png" alt-text="Screenshot that shows the versions list." lightbox="media/edge-actions/edge-action-version.png":::

1. Select **Download code** if you want to verify the content of the JavaScript code. It downloads a ZIP folder named `EdgeActionCode`, which contains your `.js` file.

## Attach Edge Action to Azure Front Door route

This part of the configuration is the most important. Currently, you can invoke Edge Actions only through Azure Front Door route configurations. You can attach an Edge Action to an Azure Front Door route in three ways:

1. Easy attach experience in Azure Front Door profile

1. Create a new ruleset in Azure Front Door profile

1. Attach view in Edge Action resource

### Easy attach experience in Azure Front Door profile

This flow is useful for users who aren't familiar with the [Azure Front Door rules engine](front-door-rules-engine.md?pivots=front-door-standard-premium) and want to attach the Edge Action to the Azure Front Door.

> [!NOTE]
> - For any advanced operations such as custom ruleset name, custom conditions, or actions, use the rules engine UI.
> - The *easy attach* creation flow checks to see if a default ruleset exists.
> - If it doesn't, it creates one, along with a default invocation rule. If a default ruleset exists with a default rule for another Edge Action, the flow creates a new default rule with a number increment at the end (for example, 002) to attach the new Edge Action.

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Settings**, select **Front Door manager** and then select the specific endpoint.

1. In the **Routes** section, select the name of the route.

1. In **Update route**, scroll down and select **Attach Edge Actions** link. This link opens the pop-up pane. You see all Edge Actions available in that subscription with their corresponding default versions.

    :::image type="content" source="media/edge-actions/update-route.png" alt-text="Screenshot that shows how to update a route." lightbox="media/edge-actions/update-route.png":::

1. Select the Edge Action that you want to attach, and then select **Associate** to confirm selection.

    :::image type="content" source="media/edge-actions/attach-edge-action.png" alt-text="Screenshot that shows how to attach an Edge Action." lightbox="media/edge-actions/attach-edge-action.png":::

1.  Select **Update** to commit the changes.

### Create a new ruleset in Azure Front Door profile

This flow is more elaborate and requires manual creation of the rule set before associating the Edge Action to the route configuration. At a high level, follow these steps:

1. In the Azure portal, go to your Azure Front Door profile.

1. Under **Settings**, select **Rule sets**. 

1. Create a new rule set and a rule with the required condition. Select the action as **Invoke Edge Action**.

1. Select **Save** to complete creation of the rule set.

    :::image type="content" source="media/edge-actions/rule-set-invoke-edge-action.png" alt-text="Screenshot that shows rule set configuration." lightbox="media/edge-actions/rule-set-invoke-edge-action.png":::

1. Associate this rule set to a route like any other rule set. For more information, see [Configure rule sets](./standard-premium/how-to-configure-rule-set.md).

### Attach view in Edge Action resource

You can associate a route to an Edge Action through **Attachments**.

1. Under **Settings** of your Edge Action, select **Attachments**.

1. Select **+ Associate route**, and then select the corresponding Azure Front Door profile.

    :::image type="content" source="media/edge-actions/attachments-associate-route.png" alt-text="Screenshot that shows how to associate a route using Edge Action Attachment." lightbox="media/edge-actions/attachments-associate-route.png":::

1. Select **Next** and then select the route name.

1. Select **Next** to configure rule sets, and then select **Save**.

    When the route association is complete, you can see the details of the route you added listed in the **Attachments** view of your Edge Actions.

#### Verify Edge Action is attached

You can check in Azure Front Door route whether the corresponding Edge Action is attached.

1. Under **Settings** of your Azure Front Door, select **Front Door manager**.

1. Select the route that you want to check.

1. In **Update route**, select **Manage Edge Actions** to verify Edge Action details or detach.

    :::image type="content" source="media/edge-actions/manage-edge-action.png" alt-text="Screenshot that shows how to check Edge Action details." lightbox="media/edge-actions/manage-edge-action.png":::

#### Detach Edge Action from route 

To detach an Edge Action from a route, you can go to the route as shown in the previous section or from the Edge Action itself as follows:

1. Under **Settings** of your Edge Action, select **Attachments**.

1. Choose the Edge Action that you want to detach and select **Dissociate**.

    :::image type="content" source="media/edge-actions/dissociate-edge-action.png" alt-text="Screenshot that shows how to dissociate and Edge Action from a route." lightbox="media/edge-actions/dissociate-edge-action.png":::

## Execution filters

Execution filters control which version of an Edge Action runs on an Azure Front Door route:

- **Selective version routing:** Only the *default version* and versions that execution filters explicitly reference can run. Execution filters can **override the default version**.

- **Version protection:** Any version that an execution filter references is active. You can't delete or upgrade it while it's in use.

- **Zero-downtime switching:** Execution filters enable **seamless version transitions** without downtime or complex configuration updates.

Execution filters work well for scenarios like:

- Canary rollouts

- A/B testing through header-based routing

- Safely deploying and validating new versions

### Apply an execution filter

To safely roll out a new version of Edge Action to production, follow these steps.

1. Under **Settings** of your Edge Action, select **Versions** to verify the versions you have. The following image shows two versions. The *First* version is the default version and the *Second* version is the newer version that you want to roll out.

    :::image type="content" source="media/edge-actions/edge-action-versions.png" alt-text="Screenshot that shows the list of versions." lightbox="media/edge-actions/edge-action-versions.png":::

1. Select **Execution filters**.

1. Select **+ Add** to create a new execution filter that runs the *Second* version if the request has an HTTP header called *test* with value *execution* as shown in the following image:

    :::image type="content" source="media/edge-actions/execution-filter.png" alt-text="Screenshot that shows how to add an execution filter." lightbox="media/edge-actions/execution-filter.png":::

1. On your client side, pass these HTTP headers in dogfood requests to test the new behavior by using the *Second* version for selected customers who registered to corresponding versions. When everything appears satisfactory, set this version as the default on the Edge Actions resource side.

In the following logs, you see that *First* runs for regular requests and *Second* runs when you inject headers in the request:

:::image type="content" source="media/edge-actions/logs.png" alt-text="Screenshot that shows the logs." lightbox="media/edge-actions/logs.png":::

## Edge Action logs

You can configure Edge Action logs the same way you configure Azure Front Door logs. For more information, see [Configure Azure Front Door logs](./standard-premium/how-to-logs.md).

1. Under **Monitoring** of your Edge Action, select **Diagnostic settings**.

1. Select **+ Add diagnostic setting**.

1. In **Diagnostic setting**, select **allLogs** and **Send to Log Analytics workspace** checkboxes. Then, select the Log Analytics workspace that you want to use and its subscription.

    :::image type="content" source="media/edge-actions/diagnostic-setting.png" alt-text="Screenshot that shows the diagnostic setting." lightbox="media/edge-actions/diagnostic-setting.png":::

1. Select **Save**.

The `EdgeActionConsoleLog` table has the following schema:

| **ColumnName** | **ColumnType** | **Description** |
|----|----|----|
| TimeGenerated | datetime | UTC time when the log was generated |
| TrackingReference | string | The unique reference string that identifies a request served by Azure Front Door. The tracking reference is sent to the client and to the origin by using the X-Azure-Ref headers. Use the tracking reference when searching for a specific request in the access or WAF logs. |
| LogMessage | string | Any message that you specify using the console.log statement in your Edge Action code |
| EdgeActionVersion | string | Edge Action version that generated this log message |
| Type | string | Type of the log. Currently, there's only one type supported (EdgeActionConsoleLog) |
| ResourceId | string | Resource ID of your edge action |

## Azure Front Door logs 

You can also use Azure Front Door logs to verify whether the edge action got executed.

:::image type="content" source="media/edge-actions/front-door-logs.png" alt-text="Screenshot that shows Azure Front Door logs." lightbox="media/edge-actions/front-door-logs.png":::

| **ColumnName** | **ColumnType** | **Description** |
|---|---|---|
| edgeActionsStatusCode | string | Status code representing execution success of edge action. <br> - 200: Successful <br> - 503: Error during execution |

## Pricing

Edge actions follow a simple two-part pricing model based on the number of invocations and execution time beyond 1 ms for each invocation. For details about edge actions pricing, see the following table, including applicable billing meters and usage-based charges on invocations and execution time.

| Meter | Price |
|--|--|
| Invocations | $0.1 per 1 M invocations |
| Overage execution time <sup>1</sup> | $0.00005 per second |

<sup>1</sup> Cumulative additional execution time for all invocations that took more than 1 ms.

For more information, see [Understanding Azure Front Door billing: Example 7](billing.md#example-7-edge-actions).

## Related content

- For REST API, Azure CLI, or PowerShell, see [Edge actions REST API](/rest/api/edge-actions/operation-groups), [az edge-action](/cli/azure/edge-action), or [Az.EdgeAction Module](/powershell/module/az.edgeaction).
- To learn about service limits, see [Azure Front Door Standard and Premium service limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-standard-and-premium-service-limits).
- To learn about Azure Front Door, see [What is Azure Front Door?](front-door-overview.md)
