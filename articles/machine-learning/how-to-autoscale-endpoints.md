---
title: Autoscale online endpoints
titleSuffix:  Azure Machine Learning
description: Learn to scale up online endpoints. Get more CPU, memory, disk space, and extra features.
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.custom: devplatv2, cliv2, event-tier1-build-2022

ms.date: 02/07/2023
---
# Autoscale an online endpoint

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Autoscale automatically runs the right amount of resources to handle the load on your application. [Online endpoints](concept-endpoints.md) supports autoscaling through integration with the Azure Monitor autoscale feature.

Azure Monitor autoscaling supports a rich set of rules. You can configure metrics-based scaling (for instance, CPU utilization >70%), schedule-based scaling (for example, scaling rules for peak business hours), or a combination. For more information, see [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md).

:::image type="content" source="media/how-to-autoscale-endpoints/concept-autoscale.png" alt-text="Diagram for autoscale adding/removing instance as needed":::

Today, you can manage autoscaling using either the Azure CLI, REST, ARM, or the browser-based Azure portal. Other Azure Machine Learning SDKs, such as the Python SDK, will add support over time.

## Prerequisites

* A deployed endpoint. [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md). 
* To use autoscale, the role `microsoft.insights/autoscalesettings/write` must be assigned to the identity that manages autoscale. You can use any built-in or custom roles that allow this action. For general guidance on managing roles for Azure Machine Learning, see [Manage users and roles](./how-to-assign-roles.md). For more on autoscale settings from Azure Monitor, see [Microsoft.Insights autoscalesettings](/azure/templates/microsoft.insights/autoscalesettings).

## Define an autoscale profile

To enable autoscale for an endpoint, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. The following example sets the default and minimum capacity as two VM instances, and the maximum capacity as five:

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The following snippet sets the endpoint and deployment names:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="set_endpoint_deployment_name" :::

Next, get the Azure Resource Manager ID of the deployment and endpoint:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="set_other_env_variables" :::

The following snippet creates the autoscale profile:

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="create_autoscale_profile" :::

> [!NOTE]
> For more, see the [reference page for autoscale](/cli/azure/monitor/autoscale)


# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Import modules:
```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential
from azure.mgmt.monitor import MonitorManagementClient
from azure.mgmt.monitor.models import AutoscaleProfile, ScaleRule, MetricTrigger, ScaleAction, Recurrence, RecurrentSchedule
import random 
import datetime 
``` 

Define variables for the workspace, endpoint, and deployment:

```python
subscription_id = "<YOUR-SUBSCRIPTION-ID>"
resource_group = "<YOUR-RESOURCE-GROUP>"
workspace = "<YOUR-WORKSPACE>"

endpoint_name = "<YOUR-ENDPOINT-NAME>"
deployment_name = "blue"
``` 

Get Azure Machine Learning and Azure Monitor clients:

```python
credential = DefaultAzureCredential()
ml_client = MLClient(
    credential, subscription_id, resource_group, workspace
)

mon_client = MonitorManagementClient(
    credential, subscription_id
)
```

Get the endpoint and deployment objects: 

```python 
deployment = ml_client.online_deployments.get(
    deployment_name, endpoint_name
)

endpoint = ml_client.online_endpoints.get(
    endpoint_name
)
```

Create an autoscale profile: 

```python
# Set a unique name for autoscale settings for this deployment. The below will append a random number to make the name unique.
autoscale_settings_name = f"autoscale-{endpoint_name}-{deployment_name}-{random.randint(0,1000)}"

mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "profiles" : [
            AutoscaleProfile(
                name="my-scale-settings",
                capacity={
                    "minimum" : 2, 
                    "maximum" : 5,
                    "default" : 2
                },
                rules = []
            )
        ]
    }
)
```

# [Studio](#tab/azure-studio)

In [Azure Machine Learning studio](https://ml.azure.com), select your workspace and then select __Endpoints__ from the left side of the page. Once the endpoints are listed, select the one you want to configure.

:::image type="content" source="media/how-to-autoscale-endpoints/select-endpoint.png" alt-text="Screenshot of an endpoint deployment entry in the portal.":::

From the __Details__ tab for the endpoint, select __Configure auto scaling__.

:::image type="content" source="media/how-to-autoscale-endpoints/configure-auto-scaling.png" alt-text="Screenshot of the configure auto scaling link in endpoint details.":::

Under __Choose how to scale your resources__, select __Custom autoscale__ to begin the configuration. For the default scale condition, use the following values:

* Set __Scale mode__ to __Scale based on a metric__.
* Set __Minimum__ to __2__.
* Set __Maximum__ to __5__.
* Set __Default__ to __2__.

:::image type="content" source="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" alt-text="Screenshot showing custom autoscale choice.":::

---

## Create a rule to scale out using metrics

A common scaling out rule is one that increases the number of VM instances when the average CPU load is high. The following example will allocate two more nodes (up to the maximum) if the CPU average a load of greater than 70% for five minutes::

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_out_on_cpu_util" :::

The rule is part of the `my-scale-settings` profile (`autoscale-name` matches the `name` of the profile). The value of its `condition` argument says the rule should trigger when "The average CPU consumption among the VM instances exceeds 70% for five minutes." When that condition is satisfied, two more VM instances are allocated. 

> [!NOTE]
> For more information on the CLI syntax, see [`az monitor autoscale`](/cli/azure/monitor/autoscale).


# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Create the rule definition:

```python 
rule_scale_out = ScaleRule(
    metric_trigger = MetricTrigger(
        metric_name="CpuUtilizationPercentage",
        metric_resource_uri = deployment.id, 
        time_grain = datetime.timedelta(minutes = 1),
        statistic = "Average",
        operator = "GreaterThan", 
        time_aggregation = "Last",
        time_window = datetime.timedelta(minutes = 5), 
        threshold = 70
    ), 
    scale_action = ScaleAction(
        direction = "Increase", 
        type = "ChangeCount", 
        value = 2, 
        cooldown = datetime.timedelta(hours = 1)
    )
)
```
This rule is refers to the last 5 minute average of `CPUUtilizationpercentage` from the arguments `metric_name`, `time_window` and `time_aggregation`. When value of the metric is greater than the `threshold` of 70, two more VM instances are allocated. 

Update the `my-scale-settings` profile to include this rule: 

```python 
mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "profiles" : [
            AutoscaleProfile(
                name="my-scale-settings",
                capacity={
                    "minimum" : 2, 
                    "maximum" : 5,
                    "default" : 2
                },
                rules = [
                    rule_scale_out
                ]
            )
        ]
    }
)
``` 

# [Studio](#tab/azure-studio)

In the __Rules__ section, select __Add a rule__. The __Scale rule__ page is displayed. Use the following information to populate the fields on this page:

* Set __Metric name__ to __CPU Utilization Percentage__.
* Set __Operator__ to __Greater than__ and set the __Metric threshold__ to __70__.
* Set __Duration (minutes)__ to 5. Leave the __Time grain statistic__ as __Average__.
* Set __Operation__ to __Increase count by__ and set __Instance count__ to __2__.

Finally, select the __Add__ button to create the rule.

:::image type="content" source="media/how-to-autoscale-endpoints/scale-out-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-out-rule.png" alt-text="Screenshot showing scale out rule >70% CPU for 5 minutes.":::

---

## Create a rule to scale in using metrics

When load is light, a scaling in rule can reduce the number of VM instances. The following example will release a single node, down to a minimum of 2, if the CPU load is less than 30% for 5 minutes:

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_in_on_cpu_util" :::

# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Create the rule definition: 

```python 
rule_scale_in = ScaleRule(
    metric_trigger = MetricTrigger(
        metric_name="CpuUtilizationPercentage",
        metric_resource_uri = deployment.id, 
        time_grain = datetime.timedelta(minutes = 1),
        statistic = "Average",
        operator = "less Than", 
        time_aggregation = "Last",
        time_window = datetime.timedelta(minutes = 5), 
        threshold = 30
    ), 
    scale_action = ScaleAction(
        direction = "Increase", 
        type = "ChangeCount", 
        value = 1, 
        cooldown = datetime.timedelta(hours = 1)
    )
)
``` 

Update the `my-scale-settings` profile to include this rule: 

```python 
mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "profiles" : [
            AutoscaleProfile(
                name="my-scale-settings",
                capacity={
                    "minimum" : 2, 
                    "maximum" : 5,
                    "default" : 2
                },
                rules = [
                    rule_scale_out, 
                    rule_scale_in
                ]
            )
        ]
    }
)
``` 
 
# [Studio](#tab/azure-studio)

In the __Rules__ section, select __Add a rule__. The __Scale rule__ page is displayed. Use the following information to populate the fields on this page:

* Set __Metric name__ to __CPU Utilization Percentage__.
* Set __Operator__ to __Less than__ and the __Metric threshold__ to __30__.
* Set __Duration (minutes)__ to __5__.
* Set __Operation__ to __Decrease count by__ and set __Instance count__ to __1__.

Finally, select the __Add__ button to create the rule.

:::image type="content" source="media/how-to-autoscale-endpoints/scale-in-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-in-rule.png" alt-text="Screenshot showing scale-in rule":::

If you have both scale out and scale in rules, your rules will look similar to the following screenshot. You've specified that if average CPU load exceeds 70% for 5 minutes, 2 more nodes should be allocated, up to the limit of 5. If CPU load is less than 30% for 5 minutes, a single node should be released, down to the minimum of 2. 

:::image type="content" source="media/how-to-autoscale-endpoints/autoscale-rules-final.png" lightbox="media/how-to-autoscale-endpoints/autoscale-rules-final.png" alt-text="Screenshot showing autoscale settings including rules.":::

---

## Create a scaling rule based on endpoint metrics

The previous rules applied to the deployment. Now, add a rule that applies to the endpoint. In this example, if the request latency is greater than an average of 70 milliseconds for 5 minutes, allocate another node.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_up_on_request_latency" :::


# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Create the rule definition: 

```python
rule_scale_out_endpoint = ScaleRule(
    metric_trigger = MetricTrigger(
        metric_name="RequestLatency",
        metric_resource_uri = endpoint.id, 
        time_grain = datetime.timedelta(minutes = 1),
        statistic = "Average",
        operator = "GreaterThan", 
        time_aggregation = "Last",
        time_window = datetime.timedelta(minutes = 5), 
        threshold = 70
    ), 
    scale_action = ScaleAction(
        direction = "Increase", 
        type = "ChangeCount", 
        value = 1, 
        cooldown = datetime.timedelta(hours = 1)
    )
)

```
This rule's `metric_resource_uri` field now refers to the endpoint rather than the deployment.

Update the `my-scale-settings` profile to include this rule: 

```python 
mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "profiles" : [
            AutoscaleProfile(
                name="my-scale-settings",
                capacity={
                    "minimum" : 2, 
                    "maximum" : 5,
                    "default" : 2
                },
                rules = [
                    rule_scale_out, 
                    rule_scale_in,
                    rule_scale_out_endpoint
                ]
            )
        ]
    }
)
``` 

# [Studio](#tab/azure-studio)

From the bottom of the page, select __+ Add a scale condition__.

Select __Scale based on metric__, and then select __Add a rule__. The __Scale rule__ page is displayed. Use the following information to populate the fields on this page:

* Set __Metric source__ to __Other resource__.
* Set __Resource type__ to __Machine Learning online endpoints__.
* Set __Resource__ to your endpoint.
* Set __Metric name__ to __Request latency__.
* Set __Operator__ to __Greater than__ and set __Metric threshold__ to __70__.
* Set __Duration (minutes)__ to __5__.
* Set __Operation__ to __Increase count by__ and set __Instance count__ to 1

:::image type="content" source="media/how-to-autoscale-endpoints/endpoint-rule.png" lightbox="media/how-to-autoscale-endpoints/endpoint-rule.png" alt-text="Screenshot showing endpoint metrics rules.":::

---

## Create scaling rules based on a schedule

You can also create rules that apply only on certain days or at certain times. In this example, the node count is set to 2 on the weekend.

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="weekend_profile" :::

# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python 
mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "profiles" : [
            AutoscaleProfile(
                name="Default",
                capacity={
                    "minimum" : 2, 
                    "maximum" : 2,
                    "default" : 2
                },
                recurrence = Recurrence(
                    frequency = "Week", 
                    schedule = RecurrentSchedule(
                        time_zone = "Pacific Standard Time", 
                        days = ["Saturday", "Sunday"], 
                        hours = [], 
                        minutes = []
                    )
                )
            )
        ]
    }
)
``` 

# [Studio](#tab/azure-studio)

From the bottom of the page, select __+ Add a scale condition__. On the new scale condition, use the following information to populate the fields:
 
* Select __Scale to a specific instance count__.
* Set the __Instance count__ to __2__.
* Set the __Schedule__ to __Repeat specific days__.
* Set the schedule to __Repeat every__ __Saturday__ and __Sunday__.

:::image type="content" source="media/how-to-autoscale-endpoints/schedule-rules.png" lightbox="media/how-to-autoscale-endpoints/schedule-rules.png" alt-text="Screenshot showing schedule-based rules.":::

---

## Delete resources

If you are not going to use your deployments, delete them:

# [Azure CLI](#tab/azure-cli)
[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="delete_endpoint" :::

# [Python](#tab/python)
[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
mon_client.autoscale_settings.delete(
    resource_group, 
    autoscale_settings_name
)

ml_client.online_endpoints.begin_delete(endpoint_name)
```

# [Studio](#tab/azure-studio)
1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select an endpoint by checking the circle next to the model name.
1. Select **Delete**.

Alternatively, you can delete a managed online endpoint directly in the [endpoint details page](how-to-use-managed-online-endpoint-studio.md#view-managed-online-endpoints). 

--- 

## Next steps

To learn more about autoscale with Azure Monitor, see the following articles:

- [Understand autoscale settings](../azure-monitor/autoscale/autoscale-understanding-settings.md)
- [Overview of common autoscale patterns](../azure-monitor/autoscale/autoscale-common-scale-patterns.md)
- [Best practices for autoscale](../azure-monitor/autoscale/autoscale-best-practices.md)
- [Troubleshooting Azure autoscale](../azure-monitor/autoscale/autoscale-troubleshoot.md)
