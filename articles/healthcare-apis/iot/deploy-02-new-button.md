---
title: Deploy the MedTech service with a QuickStart template - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using a QuickStart template.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/28/2022
ms.author: jasteppe
---

# Deploy the MedTech service with an Azure Resource Manager Quickstart template

In this article, you'll learn how to deploy the MedTech service in the Azure portal using an Azure Resource Manager (ARM) Quickstart template. This template will be used with the **Deploy to Azure** button to make it easy to provide the information you need to automatically create the infrastructure and configuration of your deployment. For more information about Azure Resource Manager (ARM) templates, see [What are ARM templates?](../../azure-resource-manager/templates/overview.md).

If you need to see a diagram with information on the MedTech service deployment, there's an architecture overview at [Choose a deployment method](deploy-iot-connector-in-azure.md#deployment-architecture-overview). This diagram shows the data flow steps of deployment and how MedTech service processes data into a Fast Healthcare Interoperability Resources (FHIR&#174;) Observation.

There are four simple tasks you need to complete in order to deploy MedTech service with the ARM template **Deploy to Azure** button. They are:

## Prerequisites

In order to begin deployment, you need to have the following prerequisites:

- An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- Two resource providers registered with your Azure subscription: **Microsoft.HealthcareApis** and **Microsoft.EventHub**. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

When you've fulfilled these two prerequisites, you're ready to begin the second task.

## Deploy to Azure button

Next, you need to select the ARM template **Deploy to Azure** button here:

 [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json).

This button will call a template from the Azure Resource Manager (ARM) Quickstart template library to get information from your Azure subscription environment and begin deploying the MedTech service.

After you select the **Deploy to Azure** button, it may take a few minutes to implement the following resources and roles:

- An Azure Event Hubs Namespace and device message Azure event hub. In this example, the event hub is named **devicedata**.

- An Azure event hub consumer group. In this example, the consumer group is named **$Default**.

- An Azure event hub sender role. In this example, the sender role is named **devicedatasender**.

- An Azure Health Data Services workspace.

- An Azure Health Data Services FHIR service.

- An Azure Health Data Services MedTech service instance, including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (named **Azure Events Hubs Receiver**) and FHIR service (named **FHIR Data Writer**).

After these resources and roles have completed their implementation, the Azure portal will be launched.

## Provide configuration details

When the Azure portal screen appears, your next task is to fill out five fields that provide specific details of your deployment configuration.

:::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png":::

### Use these values to fill out the five fields

- **Subscription** - Choose the Azure subscription you want to use for the deployment.

- **Resource Group** - Choose an existing Resource Group or create a new Resource Group.

- **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill, based on the Resource Group region.

- **Basename** - This value will be appended to the name of the Azure resources and services to be deployed.

- **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (the value could be the same or different region than your Resource Group).

### When completed, do the following

Don't change the **Device Mapping** and **Destination Mapping** default values at this time.

Select the **Review + create** button after all the fields are filled out. This selection will review your input and check to see if all your values are valid.

When the validation is successful, select the **Create** button to begin the deployment. After a brief wait, a message will appear telling you that your deployment is complete.

## Required post-deployment tasks

Now that the MedTech service is successfully deployed, there are three post-deployment tasks that need to be completed before MedTech is fully functional and ready for use:

1. First, you must provide a working device mapping. For more information, see [How to use device mappings](how-to-use-device-mappings.md).

2. Second, you need to ensure that you have a working FHIR destination mapping. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).

3. Third, you must use a Shared access policies (SAS) key (named **devicedatasender**) to connect your device or application to the MedTech service device message event hub (named **devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

> [!IMPORTANT]
>
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group. Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> **Examples:**
>
> - Two MedTech services accessing the same device message event hub.
> - A MedTech service and a storage writer application accessing the same device message event hub.

## Next steps

In this article, you learned how to deploy the MedTech service in the Azure portal using a Quickstart ARM template with a **Deploy to Azure** button. To learn more about other methods of deployment, see

> [!div class="nextstepaction"]
> [Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

> [!div class="nextstepaction"]
> [How to manually deploy MedTech service with Azure portal](deploy-03-new-manual.md)

> [!div class="nextstepaction"]
> [How to deploy MedTech service using an ARM template and Azure PowerShell or Azure CLI](deploy-08-new-ps-cli.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
