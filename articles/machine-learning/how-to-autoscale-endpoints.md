---
title: Autoscale managed online endpoints
titleSuffix:  Azure Machine Learning
description: Learn to scale up managed endpoints. Get more CPU, memory, disk space, and extra features.
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: seramasu
author: rsethur
ms.reviewer: laobri
ms.custom: devplatv2
ms.date: 10/12/2021

---
# Autoscale a managed online endpoint (preview)

Autoscale automatically runs the right amount of resources to handle the load on your application. [Managed endpoints](concept-endpoints.md) supports autoscaling through integration with the Azure monitor autoscale feature. 

Azure monitor autoscaling supports a rich set of rules. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination. For more, see [Overview of autoscale in Microsoft Azure](/azure-monitor/autoscale/autoscale-overview.md).

Today, you can manage autoscaling using either the Azure CLI, REST, ARM, or the browser-based Azure portal. Other Azure ML SDKs, such as the Python SDK, will add support over time.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* A deployed endpoint. [Deploy and score a machine learning model by using a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md). 

## Go to autoscale settings

# [Azure CLI](#tab/azure-cli)

## Define an autoscale profile

To enable autoscale on a scale set, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. The following example sets the default and minimum capacity as two VM instances, and the maximum capacity as five:

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

> [!NOTE]
> For more information on the CLI syntax, see [`az monitor autoscale`](../../cli/azure/monitor/autoscale.md).

## Create a rule to scale in

When load is light, a scaling in rule can reduce the number of VM instances. The following command shows such a rule:

```azurecli
az monitor autoscale rule create \
  --autoscale-name my-scale-settings \
  --condition "Percentage CPU < 30 avg 5m" \
  --scale in 1
```

The condition for this rule is that the five-minute average CPU consumption has dropped below 30%. When this rule triggers, the number of VM instances will be decreased by one.

# [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), select __Azure Monitor__. You can find this in the menu on the left of the page, or in the __Tools__ section at the bottom of the page.

    :::image type="content" source="media/how-to-autoscale-endpoints/select-azure-monitor.png" alt-text="Screenshot of Azure Monitor in the menu and on the page":::

1. From the left side of the Azure Monitor page, select __Autoscale__ and then select the deployed endpoint. You can use the selections at the top of the page to filter the list of resources.

    :::image type="content" source="media/how-to-autoscale-endpoints/select-endpoint.png" alt-text="Screenshot of the list of items that can be used with autoscale":::

1. On the __Autoscale settings__ page, select __Custom autoscale__ to begin the configuration.

    :::image type="content" source="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" lightbox="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" alt-text="Screenshot showing custom autoscale choice":::

1. Use the following steps to create a __scale out__ rule. This rule will allocate two more nodes (up to the maximum) if the CPU's average a load of greater than 70% for five minutes:

    1. In the __Scale mode__ section, select __Scale based on a metric__. In the __Instance limits__ section, set the minimum, maximum, and default number of nodes. For instance, the following image specifies a maximum of five nodes, and a minimum and default of two nodes.

        :::image type="content" source="media/how-to-autoscale-endpoints/set-instance-limits.png" lightbox="media/how-to-autoscale-endpoints/set-instance-limits.png" alt-text="Screenshot showing set limits UI":::

    1. In the __Rules__ section, select __Add a rule__. The __Scale rule__ page is displayed. Use the following information to populate the fields on this page:

        * Set __Metric name__ to __CPU Utilization Percentage__.
        * Set __Operator__ to __Greater than__ and set the __Metric threshold__ to __70__.
        * Set __Duration (minutes)__ to 5. Leave the __Time grain statistic__ as __Average__.
        * Set __Operation__ to __Increase count by__ and set __Instance count__ to __2__.
        
        Finally, select the __Add__ button to create the rule.

        :::image type="content" source="media/how-to-autoscale-endpoints/scale-out-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-out-rule.png" alt-text="Screenshot showing scale out rule >70% CPU for 5 minutes":::

1. Use the following steps to create a __scale in__ rule. This rule will release a single node, down to a minimum of 2, if the CPU load is less than 30% for 5 minutes:

    1. In the __Rules__ section, select __Add a rule__. The __Scale rule__ page is displayed. Use the following information to populate the fields on this page:

        * Set __Metric name__ to __CPU Utilization Percentage__.
        * Set __Operator__ to __Less than__ and the __Metric threshold__ to __30__.
        * Set __Duration (minutes)__ to __5__.
        * Set __Operation__ to __Decrease count by__ and set __Instance count__ to __1__.
        
        Finally, select the __Add__ button to create the rule.

        :::image type="content" source="media/how-to-autoscale-endpoints/scale-in-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-in-rule.png" alt-text="Screenshot showing scale-in rule":::

Once you have created both rules, your autoscale rules should be similar to the following screenshot. You've specified that if average CPU load exceeds 70% for 5 minutes, 2 more nodes should be allocated, up to the limit of 5. If CPU load is less than 30% for 5 minutes, a single node should be released, down to the minimum of 2. 

:::image type="content" source="media/how-to-autoscale-endpoints/autoscale-rules-final.png" lightbox="media/how-to-autoscale-endpoints/autoscale-rules-final.png" alt-text="Screenshot showing autoscale settings including rules":::

--- 

## Create a rule for endpoint metrics
{>> TODO 2021-10-07 Write the walkthrough <<}
The previous rules applied to the deployment. Now, add a rule that applies to the endpoint. 

# [Azure CLI](#tab/azure-cli)
{>> TODO 2021-10-07: Needs example code from Sethu <<}

# [Portal](#tab/azure-portal)

To create an endpoint-focused rule: 

* Choose "+ Add a scale condition" 
* Choose "Scale based on metric"
* Set Metric source to 'Other resource' (this is key difference from previous)
* Set Resource type to 'Machine learning online endpoints'
* Select your resource
* Set necessary params as in

:::image type="content" source="media/how-to-autoscale-endpoints/endpoint-rule.png" lightbox="media/how-to-autoscale-endpoints/endpoint-rule.png" alt-text="Screenshot showing schedule-based rules":::

{>> TODO / Notes

Use https://ms.portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Monitoring=azureML#blade/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/autoscale if necessary. (Note that you have to use feature flags.

The endpoint-rule.png has a little pii in the Resource `laobri-canary-ws` 

<<}

---

## Create a schedule-based rule
{>> TODO 2021-10-07 <<}
blah blah 

# [Azure CLI](#tab/azure-cli)
{>> TODO 2021-10-07: Needs example from Sethu <<}

# [Portal](#tab/azure-portal)

* Choose "+ Add a scale condition" 
* Choose "Scale to a specific instance count" (this is key difference from others)
* Set params as in

:::image type="content" source="media/how-to-autoscale-endpoints/schedule-rules.png" lightbox="media/how-to-autoscale-endpoints/schedule-rules.png" alt-text="Screenshot showing schedule-based rules":::

---

## Delete resources

If you are not going to use your deployments, delete them:

::: code language="azurecli" source="~/azureml-examples-main/cli/deploy-managed-online-endpoint.sh" ID="delete_endpoint" :::

## Next steps

- [Understand autoscale settings](/autoscale/autoscale-understand-settings)
- [Overview of common autoscale patterns](/autoscale/autoscale-common-scale-patterns)
- [Best practices for autoscale](/autoscale/autoscale-best-practices)
- [Troubleshooting Azure autoscale](/autoscale/autoscale-troubleshoot)
