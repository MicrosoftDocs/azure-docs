---
title: Create Azure Service Bus namespace and queue using Azure template
description: 'Quickstart: Create a Service Bus namespace and a queue using Azure Resource Manager template'
documentationcenter: .net
author: spelluru
ms.author: spelluru
ms.date: 06/23/2020
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.custom:
  - subject-armqs
  - mode-arm
---

# Quickstart: Create a Service Bus namespace and a queue using an ARM template

This article shows how to use an Azure Resource Manager template (ARM template) that creates a Service Bus namespace and a queue within that namespace. The article explains how to specify which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-servicebus-create-queue%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/201-servicebus-create-queue).

:::code language="json" source="~/quickstart-templates/201-servicebus-create-queue/azuredeploy.json":::

The resources defined in the template include:

- [**Microsoft.ServiceBus/namespaces**](/azure/templates/microsoft.servicebus/namespaces)
- [**Microsoft.ServiceBus/namespaces/queues**](/azure/templates/microsoft.servicebus/namespaces/queues)

> [!NOTE]
> The following ARM templates are available for download and deployment.
>
> * [Create a Service Bus namespace with queue and authorization rule](service-bus-resource-manager-namespace-auth-rule.md)
> * [Create a Service Bus namespace with topic and subscription](service-bus-resource-manager-namespace-topic.md)
> * [Create a Service Bus namespace](service-bus-resource-manager-namespace.md)
> * [Create a Service Bus namespace with topic, subscription, and rule](service-bus-resource-manager-namespace-topic-with-rule.md)

You can find more template from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Servicebus&pageNumber=1&sort=Popular)

## Deploy the template

With this template, you deploy a Service Bus namespace with a queue.

[Service Bus queues](service-bus-queues-topics-subscriptions.md#queues) offer First In, First Out (FIFO) message delivery to one or more competing consumers.

To run the deployment automatically, click the following button: Create a new resource group for the deployment so that you can easily cleanup later.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-servicebus-create-queue%2Fazuredeploy.json)

## Validate the deployment

1. Select **Notifications** at the top to see the status of the deployment. Wait until the deployment succeeds. Then, select **Go to resource group** in the notification message to navigate to the page for the resource group that contains the Service Bus namespace. 

    ![Notification from deployment](./media/service-bus-resource-manager-namespace-queue/notification.png)
2. Confirm that you see your Service Bus namespace in the list of resources. 

    ![Resource group - namespace](./media/service-bus-resource-manager-namespace-queue/resource-group-namespace.png)
3. Select the namespace from the list to see the **Service Bus Namespace** page. 

## Clean up resources

1. In the Azure portal, navigate to the **Resource group** page for your resource group.
2. Select **Delete resource group** from the toolbar. 
3. Type the name of the resource group, and select **Delete**. 

    ![Resource group - delete](./media/service-bus-resource-manager-namespace-queue/resource-group-delete.png)

## Next steps

See the following topic that shows how to create an authorization rule for the namespace/queue:

[Create a Service Bus authorization rule for namespace and queue using an ARM template](service-bus-resource-manager-namespace-auth-rule.md)

Learn how to manage these resources by viewing these articles:

* [Manage Service Bus with PowerShell](service-bus-manage-with-ps.md)
* [Manage Service Bus resources with the Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/releases)

[Authoring Azure Resource Manager templates]: ../azure-resource-manager/templates/template-syntax.md
[Service Bus namespace and queue template]: https://github.com/Azure/azure-quickstart-templates/blob/master/201-servicebus-create-queue/
[Azure Quickstart Templates]: https://azure.microsoft.com/documentation/templates/?term=service+bus
[Learn more about Service Bus queues]: service-bus-queues-topics-subscriptions.md
[Using Azure PowerShell with Azure Resource Manager]: ../azure-resource-manager/management/manage-resources-powershell.md
[Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management]: ../azure-resource-manager/management/manage-resources-cli.md
