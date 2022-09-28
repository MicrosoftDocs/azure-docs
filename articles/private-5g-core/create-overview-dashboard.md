---
title: Create an overview Log Analytics dashboard
titleSuffix: Azure Private 5G Core Preview
description: Information on how to use an ARM template to create an overview Log Analytics dashboard you can use to monitor a packet core instance.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/20/2022
ms.custom: template-how-to 
---

# Create an overview Log Analytics dashboard using an ARM template

Log Analytics dashboards can visualize all of your saved log queries, giving you the ability to find, correlate, and share data about your private mobile network. In this how-to guide, you'll learn how to create an example overview dashboard using an Azure Resource Manager (ARM) template. This dashboard includes charts to monitor important Key Performance Indicators (KPIs) for a packet core instance's operation, including throughput and the number of connected devices.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-dashboard%2Fazuredeploy.json)

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope. 
- Carry out the steps in [Enabling Log Analytics for Azure Private 5G Core](enable-log-analytics-for-private-5g-core.md).
- Collect the following information.

  - The name of the **Kubernetes - Azure Arc** resource that represents the Kubernetes cluster on which your packet core instance is running.
  - The name of the resource group containing the **Kubernetes - Azure Arc** resource.

## Review the template

The template used in this how-to guide is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-create-dashboard). The template for this article is too long to show here. To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.mobilenetwork/mobilenetwork-create-dashboard/azuredeploy.json).

The template defines one [**Microsoft.Portal/dashboards**](/azure/templates/microsoft.portal/dashboards) resource, which is a dashboard that displays data about your packet core instance's activity.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-dashboard%2Fazuredeploy.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** set this to the Azure subscription you used to create your private mobile network.
    - **Resource group:** set this to the resource group in which you want to create the dashboard. You can use an existing resource group or create a new one.
    - **Region:** select **East US**.
    - **Connected Cluster Name:** enter the name of the **Kubernetes - Azure Arc** resource that represents the Kubernetes cluster on which your packet core instance is running.
    - **Connected Cluster Resource Group:** enter the name of the resource group containing the **Kubernetes - Azure Arc** resource.
    - **Dashboard Display Name:** enter the name you want to use for the dashboard.
    - **Location:** leave this field unchanged.
     
    :::image type="content" source="media/create-overview-dashboard/dashboard-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the dashboard ARM template.":::

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the dashboard. The Azure portal will display a confirmation screen when the dashboard has been created. 

## Review deployed resources

1. On the confirmation screen, select **Go to resource**.

    :::image type="content" source="media/create-overview-dashboard/deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Select **Go to dashboard**.

    :::image type="content" source="media/create-overview-dashboard/go-to-dashboard-option.png" alt-text="Screenshot of the Azure portal showing the Go to dashboard option.":::

1. The Azure portal displays the new overview dashboard, with several tiles providing information on important KPIs for the packet core instance.

    :::image type="content" source="media/create-overview-dashboard/overview-dashboard.png" alt-text="Screenshot of the Azure portal showing the overview dashboard. It includes tiles for connected devices, gNodeBs, PDU sessions and throughput." lightbox="media/create-overview-dashboard/overview-dashboard.png":::

## Next steps

You can now begin using the overview dashboard to monitor your packet core instance's activity. You can also use the following articles to add more queries to the dashboard. 

- [Learn more about constructing queries](monitor-private-5g-core-with-log-analytics.md#construct-queries).
- [Learn more about how to pin a query to the dashboard](../azure-monitor/visualize/tutorial-logs-dashboards.md#visualize-a-log-query).
