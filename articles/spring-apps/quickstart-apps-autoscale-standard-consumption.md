---
title: Quickstart - Set up autoscale for applications in Azure Spring Apps Standard consumption and dedicated plan
description: Learn how to set up autoscale for applications in Azure Spring Apps Standard consumption and dedicated plan.
author: KarlErickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java, devx-track-extended-java
---

# Quickstart: Set up autoscale for applications in the Azure Spring Apps Standard consumption and dedicated plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes how to set up autoscale rules for your applications in Azure Spring Apps Standard consumption and dedicated plan. The plan uses an Azure Container Apps environment to host your Spring applications, and provides the following management and support:

- Manages automatic horizontal scaling through a set of declarative scaling rules.
- Supports all the scaling rules that Azure Container Apps supports.

For more information, see [Azure Container Apps documentation](../container-apps/index.yml).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, see [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Spring Apps Standard consumption and dedicated plan service instance. For more information, see [Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](quickstart-provision-standard-consumption-service-instance.md).
- A Spring app deployed to Azure Spring Apps. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md).

## Scale definition

Scaling is defined by the combination of limits and rules.

- Limits are the minimum and maximum number of instances that your Spring allows.

  | Scale limit                                | Default value | Min value | Max value |
  |--------------------------------------------|---------------|-----------|-----------|
  | Minimum number of instances per deployment | 1             | 0         | 30        |
  | Maximum number of instances per deployment | 10            | 1         | 30        |

  By default, the minimum instance count of your Spring application is set to 1 to ensure that your deployment is always running. If you want to scale in to zero, you can set the minimum instance count to zero.

- Rules are the criteria that the autoscaling abides by to add or remove instances. The scale rules include HTTP, TCP, and Custom rules as described in the [Scale rules](../container-apps/scale-app.md#scale-rules) section of [Set scaling rules in Azure Container Apps](../container-apps/scale-app.md).

  If you define more than one scale rule, the autoscaling begins when the first condition of any rule is met.

- The *polling interval* and *cooldown period* are two time spans that occur during autoscaling.
  - The polling interval defines the time span between each polling action of real time data as defined by your rules. The polling interval is set to 30 seconds by default.
  - The cooldown period applies only when scaling to zero - for example, to wait five minutes after the last time autoscaling checked the message queue and it was empty.

## Set up autoscale settings

You can set up autoscale settings for your application by using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

Use the following steps to define autoscale settings and rules.

1. Sign in to the Azure portal.
1. Select **Azure Spring Apps** under **Azure services**.
1. In the **Name** column, select the Azure Spring Apps instance that you want to autoscale.
1. On the overview page for your Azure Spring Apps instance, select **Apps** in the navigation pane.
1. Select the application that you want to autoscale.
1. On the overview page for the selected app, select **Scale out** in the navigation pane.
1. On the **Scale out (Preview)** page, select the deployment you want to autoscale.
1. Set up the instance limits of your deployment.
1. Select **Add** to add your scale rules. 

:::image type="content" source="media/quickstart-apps-autoscale/autoscale-setting.png" alt-text="Screenshot of the Azure portal preview version showing the Scale out page for an app in an Azure Spring Apps instance." lightbox="media/quickstart-apps-autoscale/autoscale-setting.png":::

### [Azure CLI](#tab/azure-cli)

Use the following commands to create an application in Azure Spring Apps with an autoscaling rule, based on [Keda Azure Service Bus Scaler](https://keda.sh/docs/2.8/scalers/azure-service-bus/).   

```azurecli-interactive
az spring app create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <app-name> \
    --secrets "connection-string-secret=<service-bus-connection-string>" \
    --scale-rule-name azure-servicebus-queue-rule \
    --scale-rule-type azure-servicebus \
    --scale-rule-metadata "queueName=my-queue" \
                          "namespace=service-bus-namespace" \
                          "messageCount=5" \
    --scale-rule-auth "connection=connection-string-secret" \
    --min-replicas 0 \
    --max-replicas 5
```

The replicas count is adjusted automatically according to the count of messages in Azure Service Bus Queue. When there are no messages in the queue, your application is scaled to 0 replica. When there are messages in the queue, the application is scaled out according to the message count.

---

## Custom scaling rules

For information on defining custom rules, see [Keda scalers](https://keda.sh/docs/2.9/scalers/). The following sections show two examples of setting scale rules on MySQL and Cron.

### Set up auto scaling rules on MySQL database

The following CLI commands show you how to autoscale your Spring application based on [Keda MySQL Scaler](https://keda.sh/docs/2.8/scalers/mysql/). First, create a secret to store your SQL connection string. This secret is used for your scale rule authentication. Then, set up a rule which scales the app based on the rows count of a table.

```azurecli-interactive
az spring app update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <app-name> \
    --secrets mysqlconnectionstring="<username>:<pwd>@tcp(<server name>:3306)/<database name>" 

az spring app scale \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <app-name> \
    --scale-rule-type mysql \
    --scale-rule-name <your rule name> \
    --scale-rule-auth "connectionString=mysqlconnectionstring" \
    --scale-rule-metadata queryValue=4 query="SELECT count(*) FROM mytable" \
    --min-replicas 0 \
    --max-replicas 3
```

### Create a rule based on Linux cron

The following commands show you how to set up a rule based on [Keda Cron Scaler](https://keda.sh/docs/2.8/scalers/cron/). The replicas are scaled to the desired number during the cron time interval.

```azurecli-interactive
az spring app scale \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --name <app-name> \
    --scale-rule-type cron \
    --scale-rule-name testscalerule \
    --scale-rule-metadata timezone="Asia/Shanghai" \
                          start="10 * * * *" \
                          end="15 * * * *" \
                          desiredReplicas="3" \
    --min-replicas 0 \
    --max-replicas 3
```

## Scaling events

You can find the scaling events from the system logs of your underlying container app, and filter the EventSource by using `KEDA`, as shown in the following example:

```sql
ContainerAppSystemLogs_CL 
| where ContainerAppName_s == 'YourAppName' and EventSource_s == 'KEDA'
```

## Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternately, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Map a custom domain to Azure Spring Apps with the Standard consumption and dedicated plan](./quickstart-standard-consumption-custom-domain.md)
