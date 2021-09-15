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

Autoscale automatically runs the right amount of resources to handle the load on your application. [Managed endpoints](concept-endpoints.md) supports autoscaling through integration with the Azure monitor autoscale feature. 

Azure monitor autoscaling supports a rich set of rules. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination. For more, see [Overview of autoscale in Microsoft Azure](/azure-monitor/autoscale/autoscale-overview.md).

Today, you can manage autoscaling using either the Azure CLI, REST, ARM, or the browser-based Azure portal. Other Azure ML SDKs, such as the Python SDK, will add support over time.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* A deployed endpoint. See [What are Azure Machine Learning endpoints (preview)](concept-endpoints.md) and [Deploy and score a machine learning model by using a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md). 

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

> [!NOTE]
> For more, see the [reference page for autoscale](/cli/azure/monitor/autoscale?view=azure-cli-latest&preserve-view=true)

## Create a rule to scale out

A common scaling out rule is one that increases the number of VM instances when the average CPU load is high. Such a rule might look like the following example:

```azurecli
az monitor autoscale rule create \
  --autoscale-name my-scale-settings \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 2
```

The rule is part of the `my-scale-settings` profile (`autoscale-name` matches the `name` of the profile). The value of its `condition` argument says the rule should trigger when "The average CPU consumption among the VM instances exceeds 70% for five minutes." When that condition is satisfied, two more VM instances are allocated. 

## Create a rule to scale in

When load is light, a scaling in rule can reduce the number of VM instances. The following command shows such a rule:

```azurecli
az monitor autoscale rule create \
  --autoscale-name my-scale-settings \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1
```

The condition for this rule is that the three-minute average CPU consumption has dropped below 30%. When this rule triggers, the number of VM instances will be decreased by one. 

# [Portal](#tab/azure-portal)

In Azure Machine Learning studio:

1. Go to the "Endpoints" page
1. Select the endpoint you're interested in

:::image type="content" source="media/how-to-autoscale-endpoints/endpoints-portal.png" alt-text="Screenshot showing Endpoints page of Azure Machine Learning studio":::

In the endpoint details screen, in the Details tab, select the deployment in which you're interested. In the deployment details section, select "Configure autoscaling" to open the autoscaling wizard.
{>>TODO: PII <<}

:::image type="content" source="media/how-to-autoscale-endpoints/configure-autoscale.png" lightbox="media/how-to-autoscale-endpoints/configure-autoscale.png" alt-text="Screenshot showing link to configure autoscaling":::

In the Scale Out page, choose the "Custom autoscale" option to begin the configuration. 

:::image type="content" source="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" lightbox="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" alt-text="Screenshot showing custom autoscale choice":::

In the "Instance limits" section, set the minimum, maximum, and default number of nodes. For instance, the following image specifies a maximum of five nodes, and a minimum and default of two nodes.

:::image type="content" source="media/how-to-autoscale-endpoints/set-instance-limits.png" lightbox="media/how-to-autoscale-endpoints/set-instance-limits.png" alt-text="Screenshot showing set limits UI":::

In the "Rules" section, choose "Add a rule". The "Scale rule" page will show.

1. Set the "Operator" to "Greater than" and set the "Metric threshold" to 70
1. Set "Duration (minutes)" to 5. Leave the "Time grain statistic" as "Average"
1. Set "Operation" to "Increase count by" and set "Instance count" to 2
1. Choose the "Add" button to create the rule

:::image type="content" source="media/how-to-autoscale-endpoints/scale-out-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-out-rule.png" alt-text="Screenshot showing scale out rule >70% CPU for 5 minutes":::

You have just specified that if the CPUs average a load of greater than 70% for five minutes, the system should allocate two additional nodes up to the maximum set for autoscale.

Now create a rule for scaling in. Choose "New rule." In the "Scale rule" page:

1. Set the "Operator" to "Less than" and the "Metric threshold" to 30
1. Set the "Duration (minutes)" to 5
1. Set the "Operation" to "Decrease count by" and set "Intsance count" to 1
1. Choose the "Add" button to create the rule

:::image type="content" source="media/how-to-autoscale-endpoints/scale-in-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-in-rule.png" alt-text="Screenshot showing scale-in rule":::

Once you have created both rules, your autoscale rules should look like the following image. You've specified that if average CPU load exceeds 70% for 5 minutes, 2 additional nodes should be allocated, up to the limit of 5. If CPU load is less than 30% for 5 minutes, a single node should be released, down to the minimum of 2. 

:::image type="content" source="media/how-to-autoscale-endpoints/autoscale-rules-final.png" lightbox="media/how-to-autoscale-endpoints/autoscale-rules-final.png" alt-text="Screenshot showing autoscale settings including rules":::

## Next steps

- [Understand autoscale settings](/autoscale/autoscale-understand-settings)
- [Overview of common autoscale patterns](/autoscale/autoscale-common-scale-patterns)
- [Best practices for autoscale](/autoscale/autoscale-best-practices)
- [Troubleshooting Azure autoscale](/autoscale/autoscale-troubleshoot)
