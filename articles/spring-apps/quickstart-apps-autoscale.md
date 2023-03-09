---
title: Set up autoscale for Standard Consumption plan applications
description: Learn how to set up autoscale for Standard Consumption plan applications.
author: karlerickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/8/2023
ms.custom: devx-track-java
---

# Set up autoscale for Standard Consumption plan applications

This article describes how to set up autoscale rules for your applications in Azure Spring Apps Standard consumption plan. The plan uses Azure Container Apps to host your spring applications, and provides the following management and support:

- Manages automatic horizontal scaling through a set of declarative scaling rules.

- Support all the scaling rules that Azure Container Apps supports.

For more information see [Azure Container Apps documentation](/azure/container-apps/)

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, see [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A deployed Azure Spring Apps service instance.

- At least one application already created in your service instance.

## Scale definition

Scaling is defined by the combination of limits and rules.

- Limits are the minimum and maximum number of instances that your spring app will allow.

  | Scale limit                               | Default value | Min value | Max value |
  |-------------------------------------------|---------------|-----------|-----------|
  | Minimum number of instance per deployment | 1             | 0         | 30        |
  | Maximum number of instance per deployment | 10            | 1         | 30        |

  By default, the minimum instance number of your spring application is set to 1 to ensure that your deployment is always running. If you want to scale in to zero, you can set the minimum instance count to zero.

- Rules are the criteria that the autoscaling abide by to add or remove instances. The scale rules include HTTP, TCP, and Custom rules as described in [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app?pivots=azure-cli#scale-rules).

  If you define more than one scale rule, the autoscaling begins when the first condition of any rule is met.

- The polling interval and cooldown period are two time spans that occur during autoscaling.
  - The polling interval defines the time span between each polling action of realtime data as defined by your rules. The polling interval is set to 30 seconds by default.
  - The cooldown period applies only when scaling to zero, for example, to wait five minutes after the last time autoscaling checked the message queue and it was empty.

## Set up autoscale settings

You can set up autoscale settings for your application using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

1. Sign in to the Azure portal.
1. Select **Azure Spring Apps** under **Azure services**.
1. In the **Name** column, select the Azure Spring Apps instance that you want to autoscale.
1. On the overview page for your Azure Spring Apps instance, select **Apps** in the navigation pane.
1. Select the application for which you want to autoscale. 
1. On the overview page for the selected app, select **Scale out** in the navigation pane.
1. On the **Scale out (Preview)** page, select the deployment you want to autoscale. 
1. Set up the instance limits of your deployment.
1. Select **Add** to add your scale rules. To define your custom rules, see [Keda scalers](https://keda.sh/docs/2.9/scalers/).

:::image type="content" source="media/quickstart-apps-autoscale/autoscale-setting.png" alt-text="Screenshot of the Azure portal preview version showing the Scale out page for an app in an Azure Spring Apps instance." lightbox="media/quickstart-apps-autoscale/autoscale-setting.png":::

### [Azure CLI](#tab/azure-cli)

The following commands show an example to create an Azure Spring Apps application deployment with an autoscaling rule using the Azure CLI.

```azurecli-interactive
az spring app deployment create 
--resource-group <resource-group> 
--service <azure-spring-apps-service-instance-name> 
--app <app-name> 
--name <deployment-name> 
--secrets "connection-string-secret=<service-bus-connection-string>" 
--scale-rule-name azure-servicebus-queue-rule 
--scale-rule-type azure-servicebus 
--scale-rule-metadata "queueName=my-queue" 
                      "namespace=service-bus-namespace" 
                      "messageCount=5" 
--scale-rule-auth "connection=connection-string-secret" 
--min-instance-count 0
--min-instance-count 5 
```

---

## Next steps
