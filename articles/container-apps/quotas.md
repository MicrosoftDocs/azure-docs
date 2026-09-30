---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: limits-and-quotas
ms.date: 09/23/2026
ms.author: cshoe
---

# Quotas for Azure Container Apps

Azure Container Apps quotas can apply to a subscription and region, a managed environment, or an application. The request process depends on whether the quota applies to the selected subscription and region or to one managed environment.

| Request path | Description | Scope | Submit requests through |
|---|---|---|---|
| [Subscription quota requests](quota-requests.md#subscription-quota-requests) | The request might be fulfilled automatically or routed to Azure Support for further review. | Subscription and region | [Azure Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) |
| [Managed environment quota requests](quota-requests.md#managed-environment-quota-requests) | The request might be fulfilled automatically or routed to Azure Support for further review. You must create a managed environment before you can request a quota limit that applies to it. | One managed environment | The environment's **Quota** page |
  
> [!NOTE]
> A quota request might be routed to Azure Support as part of the review process.

## View current quota levels

<a name="list-usage-portal"></a>

You can view subscription quota usage through the [Azure Quota Management System](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas). You can view managed environment quota usage on the environment's **Quota** page and through the Azure CLI.

In the Azure portal, select **Azure Container Apps** for **Provider**.

:::image type="content" source="media/quotas/azure-container-apps-quota-header.png" alt-text="Screenshot of provider and subscription dropdowns in the quota window.":::

<a id="list-usage-cli"></a>

Use the following command to view your quotas on a per-environment basis.

Before you run the following command, make sure to replace the placeholders surrounded by `<>` with your own values.

```azurecli
az containerapp env list-usages \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ENVIRONMENT_NAME>
```

## When to request quota

If an environment or subscription reaches a quota limit, you might encounter:

- Scaling restrictions on an app
- Provisioning time-outs
- Container Apps environment or workload profile creation failures

Your default quotas depend on factors that include the age and type of your subscription and your service usage. If your app could receive thousands of requests per minute, check your current quota allocations before moving it into production.

If you encounter a *Maximum Allowed Cores exceeded for the Managed Environment* error, similar to the following example, you need to request a quota increase.

```text
Maximum Allowed Cores exceeded for the Managed Environment.

Please check https://learn.microsoft.com/en-us/azure/container-apps/quotas for resource limits
```

Other error messages could indicate that you've reached an environment or other quota limit. The Azure Quota Management System allows you to [monitor and alert](/azure/quotas/monitoring-alerting) on quota usage to proactively prevent constraints.

## Quota types

Azure Container Apps implements different categories of quotas that govern resource allocation across different aspects of your apps. These quotas are organized into basic quotas that control fundamental resource limits, GPU quotas for applications requiring specialized compute capabilities, dynamic sessions quotas for session-based workloads, and quotas for Sandboxes and Express.

### Basic quotas

The following table lists the most requested quota changes. Subscription quotas apply per subscription, per region. Managed environment quotas require a separate request for each environment.

| Quota | Scope | Request | View | Remarks |
|---|---|---|---|---|
| Managed Environment Count | Subscription and region | [Submit a subscription quota request](quota-requests.md#submit-a-subscription-quota-request) | [Portal](#list-usage-portal) | The number of environments per region. |
| Managed Environment Consumption Cores | One managed environment | [Submit a managed environment quota request](quota-requests.md#submit-a-managed-environment-quota-request) | [Portal](quota-requests.md#submit-a-managed-environment-quota-request) or [CLI](#list-usage-cli) | The maximum number of consumption cores allocated to the environment. This value is the sum of cores requested by each active replica across all apps in the environment. |
| Managed Environment General Purpose Cores | One managed environment | [Submit a managed environment quota request](quota-requests.md#submit-a-managed-environment-quota-request) | [Portal](quota-requests.md#submit-a-managed-environment-quota-request) or [CLI](#list-usage-cli) | The total cores available to all general purpose (D-series) profiles within an environment. |
| Managed Environment Memory Optimized Cores | One managed environment | [Submit a managed environment quota request](quota-requests.md#submit-a-managed-environment-quota-request) | [Portal](quota-requests.md#submit-a-managed-environment-quota-request) or [CLI](#list-usage-cli) | The total cores available to all memory optimized (E-series) profiles within an environment. |

### GPU quotas

| Quota | Scope | Request | View | Remarks |
|--|--|--|--|--|
| Managed Environment Consumption NCA100 GPUs | One managed environment | [Submit a managed environment quota request](quota-requests.md#submit-a-managed-environment-quota-request) | [Portal](quota-requests.md#submit-a-managed-environment-quota-request) or [CLI](#list-usage-cli) | The maximum number of consumption A100 GPUs available for serverless GPUs within an environment. |
| Managed Environment Consumption T4 GPUs | One managed environment | [Submit a managed environment quota request](quota-requests.md#submit-a-managed-environment-quota-request) | [Portal](quota-requests.md#submit-a-managed-environment-quota-request) or [CLI](#list-usage-cli) | The maximum number of consumption T4 GPUs available for serverless GPUs within an environment. |
| Subscription NCA 100 GPUs | Subscription and region | [Submit a subscription quota request](quota-requests.md#submit-a-subscription-quota-request) | [Portal](#list-usage-portal) | The maximum number of dedicated A100 GPUs that environments across this region can use. |

### Dynamic sessions quotas

| Quota | Scope | Request | View | Remarks |
|--|--|--|--|--|
| Session pools | Subscription and region | [Submit a subscription quota request](quota-requests.md#submit-a-subscription-quota-request) | [Portal](#list-usage-portal) | The maximum number of dynamic session pools per region. |

### Sandboxes and Express quotas

> [!NOTE]
> Sandboxes and Express are limited to 2,000 cores. Express apps are limited to 30 replicas, and you can create up to 200 Express environments per region. Updates to the quota request pipeline are planned in the coming months. To request more quota, open a support request or work with your Microsoft account representative.

## Related content

- [Request quota changes for Azure Container Apps](./quota-requests.md)