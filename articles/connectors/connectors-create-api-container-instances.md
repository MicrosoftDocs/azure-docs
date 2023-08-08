---
title: Deploy & manage Azure Container Instances
description: Automate tasks and workflows that create and manage container deployments in Azure Container Instances by using Azure Logic Apps.
services: logic-apps, container-instances
ms.service: logic-apps
ms.suite: integration
author: dlepow
ms.author: danlep
ms.manager: gwallace
ms.reviewer: estfan, macolso
ms.topic: how-to
tags: connectors
ms.date: 01/14/2020
---

# Deploy and manage Azure Container Instances by using Azure Logic Apps

With Azure Logic Apps and the Azure Container Instance connector, you can set up automated tasks and workflows that deploy and manage [container groups](../container-instances/container-instances-container-groups.md). The Container Instance connector supports the following actions:

* Create or delete a container group
* Get the properties of a container group
* Get a list of container groups
* Get the logs of a container instance

Use these actions in your logic apps for tasks such as running a container workload in response to a Logic Apps trigger. You can also have other actions use the output from Container Instance actions. 

This connector provides only actions, so to start your logic app, 
use a separate trigger, such as a **Recurrence** trigger to run a container workload on a regular schedule. Or, you might have need to trigger a container group deployment after an event such as arrival of an Outlook e-mail. 

If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142Fs). 

* Basic knowledge about how to create logic apps and how to create container instances

  * [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)

  * [Create and manage container instances](../container-instances/container-instances-quickstart.md)

* The logic app where you want to access your container instances. To use an action, start your logic app with another trigger, for example, the **Recurrence** trigger.

## Add a Container Instance action

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Choose a path: 

   * Under the last step where you want to add an action, 
   choose **New step**. 

     -or-

   * Between the steps where you want to add an action, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. In the search box, enter "container instance" as your filter. 
Under the actions list, select the Azure Container Instance connector action you want.

1. Provide a name for your connection. 

1. Provide the necessary details for your selected action 
and continue building your logic app's workflow.

  For example, select **Create container group** and enter the properties for a container group and one or more container instances in the group, as shown in the following image (partial detail):

  ![Create container group](./media/connectors-create-api-container-instances/logic-apps-aci-connector.png)

## Connector reference

For technical details about triggers, actions, and limits, which are 
described by the connector's OpenAPI (formerly Swagger) description, 
review the connector's [reference page](/connectors/aci/) or container group [YAML reference](../container-instances/container-instances-reference-yaml.md).

## Next steps

* See a [sample logic app](https://github.com/Azure-Samples/aci-logicapps-integration) that runs a container in Azure Container Instances to analyze the sentiment of e-mail or Twitter text

* [Managed connectors for Azure Logic Apps](managed.md)

* [Built-in connectors for Azure Logic Apps](built-in.md)

* [What are connectors in Azure Logic Apps](introduction.md)