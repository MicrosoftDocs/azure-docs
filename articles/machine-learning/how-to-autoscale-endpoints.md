---
title: Autoscale online endpoints
titleSuffix: Azure Machine Learning
description: Learn how to scale up online endpoints in Azure Machine Learning, and get more CPU, memory, disk space, and extra features.
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.reviewer: sehan
ms.custom: devplatv2, cliv2, update-code
ms.date: 08/07/2024

#customer intent: As a developer, I want to autoscale online endpoints in Azure Machine Learning so I can control resource usage in my deployment based on metrics or schedules.
---

# Autoscale online endpoints in Azure Machine Learning

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn to manage resource usage in a deployment by configuring autoscaling based on metrics and schedules. The autoscale process lets you automatically run the right amount of resources to handle the load on your application. [Online endpoints](concept-endpoints.md) in Azure Machine Learning support autoscaling through integration with the autoscale feature in Azure Monitor.

Azure Monitor autoscale allows you to set rules that trigger one or more autoscale actions when conditions of the rules are met. You can configure metrics-based scaling (such as CPU utilization greater than 70%), schedule-based scaling (such as scaling rules for peak business hours), or a combination of the two. For more information, see [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md).

:::image type="content" source="media/how-to-autoscale-endpoints/concept-autoscale.png" border="false" alt-text="Diagram that shows how autoscale adds and removes instances as needed.":::

You can currently manage autoscaling by using the Azure CLI, the REST APIs, Azure Resource Manager, the Python SDK, or the browser-based Azure portal.

## Prerequisites

- A deployed endpoint. For more information, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md). 

- To use autoscale, the role `microsoft.insights/autoscalesettings/write` must be assigned to the identity that manages autoscale. You can use any built-in or custom roles that allow this action. For general guidance on managing roles for Azure Machine Learning, see [Manage users and roles](how-to-assign-roles.md). For more on autoscale settings from Azure Monitor, see [Microsoft.Insights autoscalesettings](/azure/templates/microsoft.insights/autoscalesettings).

- To use the Python SDK to manage the Azure Monitor service, install the `azure-mgmt-monitor` package with the following command:

   ```console
   pip install azure-mgmt-monitor
   ```

## Define autoscale profile

To enable autoscale for an online endpoint, you first define an autoscale profile. The profile specifies the default, minimum, and maximum scale set capacity. The following example shows how to set the number of virtual machine (VM) instances for the default, minimum, and maximum scale capacity.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

1. Set the endpoint and deployment names:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="set_endpoint_deployment_name" :::

1. Get the Azure Resource Manager ID of the deployment and endpoint:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="set_other_env_variables" :::

1. Create the autoscale profile:

   :::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="create_autoscale_profile" :::

> [!NOTE]
> For more information, see the [az monitor autoscale](/cli/azure/monitor/autoscale) reference.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. Import the necessary modules:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    from azure.mgmt.monitor import MonitorManagementClient
    from azure.mgmt.monitor.models import AutoscaleProfile, ScaleRule, MetricTrigger, ScaleAction, Recurrence, RecurrentSchedule
    import random 
    import datetime 
    ``` 

1. Define variables for the workspace, endpoint, and deployment:

    ```python
    subscription_id = "<YOUR-SUBSCRIPTION-ID>"
    resource_group = "<YOUR-RESOURCE-GROUP>"
    workspace = "<YOUR-WORKSPACE>"

    endpoint_name = "<YOUR-ENDPOINT-NAME>"
    deployment_name = "blue"
    ``` 

1. Get Azure Machine Learning and Azure Monitor clients:

    ```python
    credential = DefaultAzureCredential()
    ml_client = MLClient(
        credential, subscription_id, resource_group, workspace
    )

    mon_client = MonitorManagementClient(
        credential, subscription_id
    )
    ```

1. Get the endpoint and deployment objects: 

    ```python 
    deployment = ml_client.online_deployments.get(
        deployment_name, endpoint_name
    )

    endpoint = ml_client.online_endpoints.get(
        endpoint_name
    )
    ```

1. Create an autoscale profile: 

    ```python
    # Set a unique name for autoscale settings for this deployment. The following code appends a random number to create a unique name.
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

1. In [Azure Machine Learning studio](https://ml.azure.com), go to your workspace, and select __Endpoints__ from the left menu.

1. In the list of available endpoints, select the endpoint to configure:

   :::image type="content" source="media/how-to-autoscale-endpoints/select-endpoint.png" alt-text="Screenshot that shows how to select an endpoint deployment entry for a Machine Learning workspace in the studio." lightbox="media/how-to-autoscale-endpoints/select-endpoint.png":::

1. On the __Details__ tab for the selected endpoint, select __Configure auto scaling__:

   :::image type="content" source="media/how-to-autoscale-endpoints/configure-auto-scaling.png" alt-text="Screenshot that shows how to select the option to configure autoscaling for an endpoint." lightbox="media/how-to-autoscale-endpoints/configure-auto-scaling.png":::

1. For the __Choose how to scale your resources__ option, select __Custom autoscale__ to begin the configuration.

1. For the __Default__ scale condition option, configure the following values:

   - __Scale mode__: Select __Scale based on a metric__.
   - __Instance limits__ > __Minimum__: Set the value to 2.
   - __Instance limits__ > __Maximum__: Set the value to 5.
   - __Instance limits__ > __Default__: Set the value to 2.

   :::image type="content" source="media/how-to-autoscale-endpoints/choose-custom-autoscale.png" alt-text="Screenshot that shows how to configure the autoscale settings in the studio." lightbox="media/how-to-autoscale-endpoints/choose-custom-autoscale.png":::

Leave the configuration pane open. In the next section, you configure the __Rules__ settings.

---

## Create scale-out rule based on deployment metrics

A common scale-out rule is to increase the number of VM instances when the average CPU load is high. The following example shows how to allocate two more nodes (up to the maximum) if the CPU average load is greater than 70% for 5 minutes:

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_out_on_cpu_util" :::

The rule is part of the `my-scale-settings` profile, where `autoscale-name` matches the `name` portion of the profile. The value of the rule `condition` argument indicates the rule triggers when "The average CPU consumption among the VM instances exceeds 70% for 5 minutes." When the condition is satisfied, two more VM instances are allocated. 

> [!NOTE]
> For more information, see the [az monitor autoscale](/cli/azure/monitor/autoscale) Azure CLI syntax reference.

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. Create the rule definition:

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

   This rule refers to the last 5-minute average of the `CPUUtilizationpercentage` value from the arguments `metric_name`, `time_window`, and `time_aggregation`. When the value of the metric is greater than the `threshold` of 70, the deployment allocates two more VM instances. 

1. Update the `my-scale-settings` profile to include this rule: 

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

The following steps continue with the autoscale configuration.

1. For the __Rules__ option, select the __Add a rule__ link. The __Scale rule__ page opens.

1. On the __Scale rule__ page, configure the following values:

   - __Metric name__: Select __CPU Utilization Percentage__.
   - __Operator__: Set to __Greater than__.
   - __Metric threshold__: Set the value to 70.
   - __Duration (minutes)__: Set the value to 5.
   - __Time grain statistic__: Select __Average__.
   - __Operation__: Select __Increase count by__.
   - __Instance count__: Set the value to 2.

1. Select __Add__ to create the rule:

   :::image type="content" source="media/how-to-autoscale-endpoints/scale-out-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-out-rule.png" alt-text="Screenshot that shows how to configure the scale-out rule for greater than 70% CPU for 5 minutes.":::

Leave the configuration pane open. In the next section, you adjust the __Rules__ settings.

---

## Create scale-in rule based on deployment metrics

When the average CPU load is light, a scale-in rule can reduce the number of VM instances. The following example shows how to release a single node down to a minimum of two, if the CPU load is less than 30% for 5 minutes.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_in_on_cpu_util" :::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. Create the rule definition: 

    ```python 
    rule_scale_in = ScaleRule(
        metric_trigger = MetricTrigger(
            metric_name="CpuUtilizationPercentage",
            metric_resource_uri = deployment.id, 
            time_grain = datetime.timedelta(minutes = 1),
            statistic = "Average",
            operator = "LessThan", 
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

1. Update the `my-scale-settings` profile to include this rule: 

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

The following steps adjust the __Rules__ configuration to support a scale in rule.

1. For the __Rules__ option, select the __Add a rule__ link. The __Scale rule__ page opens.

1. On the __Scale rule__ page, configure the following values:

   - __Metric name__: Select __CPU Utilization Percentage__.
   - __Operator__: Set to __Less than__.
   - __Metric threshold__: Set the value to 30.
   - __Duration (minutes)__: Set the value to 5.
   - __Time grain statistic__: Select __Average__.
   - __Operation__: Select __Decrease count by__.
   - __Instance count__: Set the value to 1.

1. Select __Add__ to create the rule:

   :::image type="content" source="media/how-to-autoscale-endpoints/scale-in-rule.png" lightbox="media/how-to-autoscale-endpoints/scale-in-rule.png" alt-text="Screenshot that shows how to configure the scale in rule for less than 30% CPU for 5 minutes.":::

   If you configure both scale-out and scale-in rules, your rules look similar to the following screenshot. The rules specify that if average CPU load exceeds 70% for 5 minutes, two more nodes should be allocated, up to the limit of five. If CPU load is less than 30% for 5 minutes, a single node should be released, down to the minimum of two. 

   :::image type="content" source="media/how-to-autoscale-endpoints/autoscale-rules-final.png" lightbox="media/how-to-autoscale-endpoints/autoscale-rules-final.png" alt-text="Screenshot that shows the autoscale settings including the scale in and scale-out rules.":::

Leave the configuration pane open. In the next section, you specify other scale settings.

---

## Create scale rule based on endpoint metrics

In the previous sections, you created rules to scale in or out based on deployment metrics. You can also create a rule that applies to the deployment endpoint. In this section, you learn how to allocate another node when the request latency is greater than an average of 70 milliseconds for 5 minutes.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="scale_up_on_request_latency" :::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

1. Create the rule definition: 

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

1. Update the `my-scale-settings` profile to include this rule: 

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

The following steps continue the rule configuration on the __Custom autoscale__ page.

1. At the bottom of the page, select the __Add a scale condition__ link.

1. On the __Scale condition__ page, select __Scale based on metric__, and then select the __Add a rule__ link. The __Scale rule__ page opens.

1. On the __Scale rule__ page, configure the following values:

   - __Metric source__: Select __Other resource__.
   - __Resource type__: Select __Machine Learning online endpoints__.
   - __Resource__: Select your endpoint.
   - __Metric name__: Select __Request latency__.
   - __Operator__: Set to __Greater than__.
   - __Metric threshold__: Set the value to 70.
   - __Duration (minutes)__: Set the value to 5.
   - __Time grain statistic__: Select __Average__.
   - __Operation__: Select __Increase count by__.
   - __Instance count__: Set the value to 1.

1. Select __Add__ to create the rule:

   :::image type="content" source="media/how-to-autoscale-endpoints/endpoint-rule.png" lightbox="media/how-to-autoscale-endpoints/endpoint-rule.png" alt-text="Screenshot that shows how to configure a scale rule by using endpoint metrics.":::

---

## Find IDs for supported metrics

If you want to use other metrics in code to set up autoscale rules by using the Azure CLI or the SDK, see the table in [Available metrics](how-to-monitor-online-endpoints.md#available-metrics).

## Create scale rule based on schedule

You can also create rules that apply only on certain days or at certain times. In this section, you create a rule that sets the node count to 2 on the weekends.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="weekend_profile" :::

# [Python SDK](#tab/python)

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

The following steps configure the rule with options on the __Custom autoscale__ page in the studio.

1. At the bottom of the page, select the __Add a scale condition__ link.

1. On the __Scale condition__ page, select __Scale to a specific instance count__, and then select the __Add a rule__ link. The __Scale rule__ page opens.

1. On the __Scale rule__ page, configure the following values:

   - __Instance count__: Set the value to 2.
   - __Schedule__: Select __Repeat specific days__.
   - Set the schedule pattern: Select __Repeat every__ and __Saturday__ and __Sunday__.

1. Select __Add__ to create the rule:

   :::image type="content" source="media/how-to-autoscale-endpoints/schedule-rules.png" lightbox="media/how-to-autoscale-endpoints/schedule-rules.png" alt-text="Screenshot that shows how to create a rule based on a schedule.":::

---

## Enable or disable autoscale

You can enable or disable a specific autoscale profile.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="disable_profile" :::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
mon_client.autoscale_settings.create_or_update(
    resource_group, 
    autoscale_settings_name, 
    parameters = {
        "location" : endpoint.location,
        "target_resource_uri" : deployment.id,
        "enabled" : False
    }
)
```

# [Studio](#tab/azure-studio)

- To disable an autoscale profile in use, select __Manual scale__, and then select __Save__.

- To enable an autoscale profile, select __Custom autoscale__. The studio lists all recognized autoscale profiles for the workspace. Select a profile and then select __Save__ to enable. 

---

## Delete resources

If you're not going to use your deployments, delete the resources with the following steps.

# [Azure CLI](#tab/cli)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="azurecli" source="~/azureml-examples-main/cli/deploy-moe-autoscale.sh" ID="delete_endpoint" :::

# [Python SDK](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

```python
mon_client.autoscale_settings.delete(
    resource_group, 
    autoscale_settings_name
)

ml_client.online_endpoints.begin_delete(endpoint_name)
```

# [Studio](#tab/azure-studio)

1. In [Azure Machine Learning studio](https://ml.azure.com), go to your workspace and select __Endpoints__ from the left menu.

1. In the list of endpoints, select the endpoint to delete (check the circle next to the model name).

1. Select __Delete__.

Alternatively, you can delete a managed online endpoint directly in the [endpoint details page](how-to-use-managed-online-endpoint-studio.md#view-managed-online-endpoints). 

--- 

## Related content

- [Understand autoscale settings](../azure-monitor/autoscale/autoscale-understanding-settings.md)
- [Review common autoscale patterns](../azure-monitor/autoscale/autoscale-common-scale-patterns.md)
- [Explore best practices for autoscale](../azure-monitor/autoscale/autoscale-best-practices.md)
