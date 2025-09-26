---
title: Quotas for Azure Container Apps
description: Learn about quotas for Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/29/2025
ms.author: cshoe
---

# Quotas for Azure Container Apps

Azure Container Apps assigns different quota types to different scopes. In addition to the subscription scope, quotas also apply to region, environment, and application scopes. All quota requests are initiated using Azure Quota Management System (QMS), which features two options for making quota requests.

| Request type| Description | Use for these scopes... | View request status via |
|---|---|---|---|
| [Integrated requests](quota-requests.md#integrated-requests) | Integrated requests are often approved within a few minutes. If your request exceeds a quotas threshold, then a support ticket is generated for a Support Engineer to review the request. Review times can delay approval by up to a few days. | ▪ region<br><br>▪ subscription | [Azure portal](#list-usage-portal) |
| [Manual requests](quota-requests.md#manual-requests) | Manual requests always result in generating a support ticket. Approval is often automated, but some requests can take up to a few days for us to process. | ▪ environment | [Azure CLI](#list-usage-cli) |
  
> [!NOTE]
> Azure Container Apps is a production grade service designed for at-scale workloads. Making a quota request that escalates to the support team isn't out of the norm, but part of the process of managing resources on behalf of our customers. **Azure Container Apps is an at-scale service. Most all quota change requests are granted with exceptions only in limited circumstances**.

## View current quotas levels

<a name="list-usage-portal"></a>

Depending on the quota type, you can view your quota levels via the [Azure portal](https://ms.portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas) and through the Azure CLI.

When in the portal, select **Azure Container Apps** for the *Provider*.

:::image type="content" source="media/quotas/azure-container-apps-quota-header.png" alt-text="Screenshot of provider and subscription dropdowns in the quota window.":::

<a id="list-usage-cli"></a>

Quotas change requests made via the manual method aren't available in the portal. Use the following command to view your quotas on a per environment basis.

Before you run the following command, make sure to replace the placeholders surrounded by `<>` with your own values.

```azurecli
az containerapp env list-usages \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ENVIRONMENT_NAME>
```

## When to request quota

If an environment or subscription reaches a quota limit, it can have unintended consequences which include:

- Scaling restrictions on an app
- Provisioning times out with a failure
- Container Apps environment or workload profile creation failure

Your default quotas depend on factors which include the age and type of your subscription, and service use. If your app could receive thousands of requests per minute, you check your current quota allocations before moving your application into production.

If you encounter a *Maximum Allowed Cores exceeded for the Managed Environment* error, similar to the following example, you need to request a quota increase.

```text
Maximum Allowed Cores exceeded for the Managed Environment.

Please check https://learn.microsoft.com/en-us/azure/container-apps/quotas for resource limits
```

Other error messages could indicate that you've reached an environment or other quota limit. The Azure Quota Management System allows you to [monitor and alert](/azure/quotas/monitoring-alerting) on quota usage to proactively prevent constraints.

## Quota types

Azure Container Apps implements different categories of quotas that govern resource allocation across different aspects of your apps. These quotas are organized into basic quotas that control fundamental resource limits, GPU quotas for applications requiring specialized compute capabilities, and dynamic sessions quotas for session-based workloads.

### Basic quotas

The most requested quota changes are listed in the following table. Each scope indicates the reach of each quota. Regionally scoped quotas change on a per region basis. Environment scoped quotas require per environment requests.

| Quota | Scope | Request | View | Remarks |
|---|---|---|---|---|
| Managed Environment Count | Region | [Integrated request](quota-requests.md#integrated-requests) | [Portal](#list-usage-portal) | The number of environments per region. |
| Managed Environment Consumption Cores | Environment | [Manual request](quota-requests.md#manual-requests) | [CLI](#list-usage-cli) | The number of maximum consumption cores the environment is allocated to use. This value is the sum of cores requested by each active replica (across all apps) in an environment. |
| Managed Environment General Purpose Cores | Environment | [Manual request](quota-requests.md#manual-requests) | [CLI](#list-usage-cli) | The total cores available to all general purpose (D-series) profiles within an environment. |
| Managed Environment Memory Optimized Cores | Environment | [Manual request](quota-requests.md#manual-requests) | [CLI](#list-usage-cli) | The total cores available to all memory optimized (E-series) profiles within an environment. |

### GPU quotas

| Quota | Scope | Request | View | Remarks |
|--|--|--|--|--|
| Managed Environment Consumption NCA100 Gpus | Environment | [Manual request](quota-requests.md#manual-requests) | [Portal](#list-usage-portal) | The number of maximum consumption A100 GPU cores available for serverless GPUs within an environment. |
| Managed Environment Consumption T4 Gpus | Environment | [Manual request](quota-requests.md#manual-requests) | [Portal](#list-usage-portal) | The number of maximum consumption T4 GPU cores available for serverless GPUs within an environment. |
| Subscription NCA 100 GPUs | Region | [Integrated request](quota-requests.md#integrated-requests) | [Portal](#list-usage-portal) | The number of maximum dedicated A100 GPU cores environments across this region are allocated to use. |

### Dynamic sessions quotas

| Quota | Scope | Request | View | Remarks |
|--|--|--|--|--|
| Session pools | Region | [Integrated request](quota-requests.md#integrated-requests) | [Portal](#list-usage-portal) | Maximum number of dynamic session pools per region. |

## Related content

- [Request quota changes for Azure Container Apps](./quota-requests.md)