---
title: Autoscale managed endpoints
titleSuffix:  Azure Machine Learning
description: Learn to scale up managed endpoints. Get more CPU, memory, disk space, and extra features.
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: seramasu
author: rsethur
ms.reviewer: laobri
ms.custom: devplatv2
ms.date: 08/30/2021

---
# Autoscale a managed endpoint (preview)

{>> TODO: Figure out where in TOC this should live.  <<}

Autoscale automatically runs the right amount of resources to handle the load on your application. [Managed endpoints](concept-endpoints.md) supports autoscaling through integration with the Azure monitor autoscale feature. 

Azure monitor autoscaling supports a rich set of rules. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination. For more, see [Overview of autoscale in Microsoft Azure](/azure-monitor/autoscale/autoscale-overview.md).

Today, you can manage autoscaling using either the Azure CLI, REST, ARM, or the browser-based Azure portal. Other Azure ML SDKs, such as the Python SDK, will add support over time.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* A deployed endpoint. See [What are Azure Machine Learning endpoints (preview)](concept-endpoints.md) and [Deploy and score a machine learning model by using a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md). 

* [Optional] To manage autoscaling using the Azure CLI, you'll need at least the tk version of the `ml` extension. For more, see [Install, set up, and use the 2.0 CLI (preview)](how-to-configure-cli.md). {>> ??? <<}

## Go to autoscale settings

# [Azure CLI](#tab/azure-cli)

## Define an autoscale profile

To enable autoscale on a scale set, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. The following example sets the default and minimum capacity as two VM instances, and the maximum capacity as six:

```azurecli
RESOURCE_ID=$(az ml endpoint show -n $ENDPOINT_NAME -o tsv --query "id")

az monitor autoscale create \
  --resource $RESOURCE_ID
  --name my-scale-settings
  --min-count 2 \
  --max-count 5 \
  --count 2
```

{>> snippets? <<}

> [!NOTE]
> For more, see the [reference page for autoscale](/cli/azure/monitor/autoscale?view=azure-cli-latest&preserve-view=true)

## Create a rule to scale out

A common scaling out rule is one that increases the number of VM instances when the average CPU load is high. Such a rule might look like the following example:

```azurecli
az monitor autoscale rule create \
  --autoscale-name my-scale-settings \
  --condition "Percentage CPU > 70 avg 3m" \
  --scale out 2
```

The rule is part of the `my-scale-settings` profile (`autoscale-name` matches the `name` of the profile). The value of its `condition` argument says the rule should trigger when "The average CPU consumption among the VM instances exceeds 70% for three minutes." When that condition is satisfied, two more VM instances are allocated. 

## Create a rule to scale in

When load is light, a scaling in rule can reduce the number of VM instances. The following command shows such a rule:

```azurecli
az monitor autoscale rule create \
  --autoscale-name my-scale-settings \
  --condition "Percentage CPU < 30 avg 3m" \
  --scale in 1
```

The condition for this rule is that the three-minute average CPU consumption has dropped below 30%. When this rule triggers, the number of VM instances will be decreased by one. 

# [Portal](#tab/azure-portal)

In Azure Machine Learning studio:

1. Go to the "Endpoints" page
1. Select the endpoint you're interested in

:::image type="content" source="media/how-to-autoscale-endpoints/endpoints-portal.png" alt-text="Screenshot showing Endpoints page of Azure Machine Learning studio":::

In the endpoint details screen, in the Details tab, select "tk wording Configure autoscaling" to open the tk 

:::image type="content" source="media/how-to-autoscale-endpoints/endpoint-details.png" alt-text="Screenshot showing link to configure autoscaling":::

## Next steps

- [Understand autoscale settings](/autoscale/autoscale-understand-settings)
- [Overview of common autoscale patterns](/autoscale/autoscale-common-scale-patterns)
- [Best practices for autoscale](/autoscale/autoscale-best-practices)
- [Troubleshooting Azure autoscale](/autoscale/autoscale-troubleshoot)
