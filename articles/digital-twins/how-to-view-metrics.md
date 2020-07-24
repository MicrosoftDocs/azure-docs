---
# Mandatory fields.
title: View metrics with Azure Monitor
titleSuffix: Azure Digital Twins
description: See how to view Azure Digital Twins metrics in Azure Monitor.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 7/24/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# View and understand Azure Digital Twins metrics

These metrics give you information about the state of Azure Digital Twins resources in your Azure subscription. Azure Digital Twins metrics help you assess the overall health of Azure Digital Twins service and the resources connected to it. These user-facing statistics help you see what is going on with your Azure Digital Twins and help perform root-cause analysis on issues without needing to contact Azure support.

Metrics are enabled by default. You can view Azure Digital Twins metrics from the [Azure portal](https://portal.azure.com).

## How to view Azure Digital Twins metrics

1. Create an Azure Digital Twins instance. You can find instructions on how to set up an Azure Digital Twins instance in [*How-to: Set up an instance and authentication*](how-to-set-up-instance-scripted.md).

2. Open the details page for your Azure Digital Twins instance (you can find it by typing its name into the portal search bar). From the instance's menu, select **Metrics**.
   
    ![Screenshot showing where the metrics option is in Azure Digital Twins resource page]()

3. From the metrics page, you can view the metrics for your Azure Digital Twins and create custom views of your metrics. 
   
    ![Screenshot showing the metrics page for Azure Digital Twins]()
    
4. You can choose to send your metrics data to an Event Hubs endpoint or an Azure Storage account by clicking **Diagnostics settings**, then **Add diagnostic setting**.

   ![Screenshot showing where diagnostic settings button is]()

## Azure Digital Twins metrics and how to use them

Azure Digital Twins provides several metrics to give you an overview of the health of your instance and its associated resources. You can also combine information from multiple metrics to paint a bigger picture of the state of your instance. 

The following table describes the metrics each Azure Digital Twins instance tracks, and how each metric relates to the overall status of your instance.

| Metric | Metric display name | Unit | Aggregation type| Description | Dimensions |
| --- | --- | --- | --- | --- | --- |

### Dimensions

Dimensions help identify more details about the metrics. Some of the routing metrics provide information per endpoint. The table below lists possible values for these dimensions.

| Dimension | Values |
| --- | --- |

## Next steps

Now that you’ve seen an overview of Azure Digital Twins metrics, follow these links to learn more about managing Azure Azure Digital Twins:

* [Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)
* [Manage custom models](how-to-manage-model.md)
* [Manage digital twins](how-to-manage-twin.md)
* [Manage the twin graph with relationships](how-to-manage-graph.md)
* [Manage endpoints and routes](how-to-manage-routes.md)