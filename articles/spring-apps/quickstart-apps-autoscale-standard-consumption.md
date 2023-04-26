---
title: Quickstart - Set up autoscale for applications in Azure Spring Apps Standard consumption plan
description: Learn how to set up autoscale for applications in Azure Spring Apps Standard consumption plan.
author: karlerickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 03/21/2023
ms.custom: devx-track-java
---

# Quickstart: Set up autoscale for applications in Azure Spring Apps Standard consumption plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes how to set up autoscale rules for your applications in Azure Spring Apps Standard consumption plan. The plan uses an Azure Container Apps environment to host your Spring applications, and provides the following management and support:

- Manages automatic horizontal scaling through a set of declarative scaling rules.
- Supports all the scaling rules that Azure Container Apps supports.

For more information, see [Azure Container Apps documentation](../container-apps/index.yml).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, see [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure Spring Apps Standard consumption plan service instance. For more information, see [Quickstart: Provision an Azure Spring Apps Standard consumption plan service instance](quickstart-provision-standard-consumption-service-instance.md).
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
1. Select **Add** to add your scale rules. To define your custom rules, see [Keda scalers](https://keda.sh/docs/2.9/scalers/).

:::image type="content" source="media/quickstart-apps-autoscale/autoscale-setting.png" alt-text="Screenshot of the Azure portal preview version showing the Scale out page for an app in an Azure Spring Apps instance." lightbox="media/quickstart-apps-autoscale/autoscale-setting.png":::

### [Azure CLI](#tab/azure-cli)

Use the following commands to create an application in Azure Spring Apps with an autoscaling rule. The replicas count is adjusted automatically according to the count of messages in Azure Service Bus Queue.

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

---

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
> [Map a custom domain to Azure Spring Apps with the Standard consumption plan](./quickstart-standard-consumption-custom-domain.md)
