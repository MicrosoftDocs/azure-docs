---
title: Receive device data through Azure IoT Hub - Azure Health Data Services
description: In this tutorial, learn how us deploy an Azure IoT Hub with message routing to send device messages to the MedTech service by using Visual Studio Code and the Azure IoT Hub extension.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 11/16/2022
ms.author: jasteppe
---

# Tutorial: Receive device data through Azure IoT Hub

You can use the MedTech service with devices that are created and managed through a hub in [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md) for enhanced workflows and ease of use. This tutorial uses an Azure Resource Manager template (ARM template) and a **Deploy to Azure** button to deploy a MedTech service by using a hub to create and manage devices, and to route device messages to the MedTech service device message event hub.

The ARM template that you use to deploy your solution in this tutorial is available at [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/iotconnectors-with-iothub/) by using the *azuredeploy.json* file on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors-with-iothub).

> [!TIP]
> For more information about using Azure PowerShell and the Azure CLI to deploy MedTech service ARM templates, see [Using Azure PowerShell and the Azure CLI to deploy the MedTech service with Azure Resource Manager templates](deploy-08-new-ps-cli.md).
>
> For more information about ARM templates, see [What are ARM templates?](../../azure-resource-manager/templates/overview.md)

The following diagram depicts the IoT device message flow when you use an hub in Azure IoT Hub with the MedTech service. Devices send their messages to the IoT hub, which then routes the device messages to the device message event hub to be picked up by the MedTech service. The MedTech service then transforms the device messages and persists them in the Fast Healthcare Interoperability Resources (FHIR&#174;) service as FHIR Observations. For more information, see [MedTech service data flow](iot-data-flow.md).

:::image type="content" source="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png" border="false" alt-text="Diagram of the IoT message data flow through an IoT hub into the MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png":::

## Prerequisites

To begin the deployment and complete this tutorial, first have the following prerequisites:

- An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- **Owner** or **Contributor + User Access Administrator** access to the Azure subscription. For more information about Azure role-based access control, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

- These resource providers registered with your Azure subscription: **Microsoft.HealthcareApis**, **Microsoft.EventHub**, and **Microsoft.Devices**. To learn more about registering resource providers, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- [Visual Studio Code](https://code.visualstudio.com/Download) installed locally and configured with the addition of the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools). Azure IoT Tools is a collection of extensions that makes it easy to connect to IoT hubs, create devices, and send messages. In this tutorial, you use the Azure IoT Hub extension to connect to your deployed IoT hub, create a device, and send a test message from the device to your IoT hub.

When you have these prerequisites, you're ready to use the **Deploy to Azure** button.

## Use the Deploy to Azure button

Select the **Deploy to Azure** button below to begin the deployment within the Azure portal.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors-with-iothub%2Fazuredeploy.json)

This button will call an ARM template from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iotconnectors-with-iothub/) site to get information from your Azure subscription environment and begin deploying the MedTech service and IoT Hub using the Azure portal.

## Provide configuration details

1. When the Azure portal screen appears, your next task is to fill out the option fields that provide specific details of your deployment configuration.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deploy-template-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-deploy-template-options.png":::

   - **Subscription**: The Azure subscription you want to use for the deployment.

   - **Resource group**: An existing resource group or create a new resource group.

   - **Region**: The Azure region of the resource group used for the deployment. This field will auto-fill based on the resource group region.

   - **Basename**: This value will be appended to the name of the Azure resources and services to be deployed. For this tutorial, we're selecting the basename of **azuredocsdemo**. You'll pick a base name of your own choosing.

   - **Location**: Use the drop-down list to select a supported Azure region for the Azure Health Data Services (the value could be the same or different region than your resource group). For a list of Azure regions where the Azure Health Data Services is available, see [Products available by regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=health-data-services).

   - **Fhir Contributor Principle Id** - **Optional**: An Azure AD user object ID that you would like to provide access to for read/write permissions to the FHIR service. This account can be used to access the FHIR service to view the device messages that are generated as part of this tutorial. It's recommended to use your own Azure AD user object ID so that you'll have access to the FHIR service. If you don't choose to use the **Fhir Contributor Principle Id** option, clear the field of any entries. To learn more about how to acquire an Azure AD user object ID, see [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id). The user object ID used in this tutorial isn't real and shouldn't be used. You'll use your own user object ID or that of another person you wish to provide access to the FHIR service.

   - Don't change the **Device Mapping** and **Destination Mapping** default values at this time. These mappings will work with the provided test message later in this tutorial when you send a device message to your IoT Hub using **VSCode** with the **Azure IoT Hub extension**.

   > [!IMPORTANT]
   > For this tutorial, the ARM template will configure the MedTech service to operate in **Create** mode so that a Patient Resource and Device Resource are created for each device that sends data to your FHIR service.
   >
   > To learn more about the MedTech service resolution types: **Create** and **Lookup**, see: [Destination properties](deploy-05-new-config.md#destination-properties).

1. Select the **Review + create** button after all the option fields are correctly filled out. This selection will review your option inputs and check to see if all your supplied values are valid.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-review-and-create-button.png" alt-text="Screenshot of Azure portal page displaying the Review + create." lightbox="media\iot-hub-to-iot-connector\iot-review-and-create-button.png":::

1. If the validation is successful, you'll see a **Validation Passed** message. If not, fix the option creating the validation error and attempt the validation process again.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-validation-completed.png" alt-text="Screenshot of Azure portal page displaying the Validation Passed message." lightbox="media\iot-hub-to-iot-connector\iot-validation-completed.png":::

1. After a successful validation, select the **Create** button to begin the deployment.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-button.png" alt-text="Screenshot of Azure portal page displaying the Create." lightbox="media\iot-hub-to-iot-connector\iot-create-button.png":::

1. After a few minutes wait, a message will appear telling you that your deployment is completed.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deployment-complete-banner.png" alt-text="Screenshot of Azure portal page displaying Your deployment is complete." lightbox="media\iot-hub-to-iot-connector\iot-deployment-complete-banner.png":::

## Review of deployed resources and access permissions

Once the deployment has competed, the following resources and access roles will be created as part of the template deployment:

- An Azure Event Hubs Namespace and device message Azure event hub. In this deployment, the event hub is named **devicedata**.

- An Azure event hub consumer group. In this deployment, the consumer group is named **$Default**.

- An Azure event hub sender role. In this deployment, the sender role is named **devicedatasender**. For the purposes of this tutorial, this role won't be used. To learn more about the role and its use, see [Review of deployed resources and access permissions](deploy-02-new-button.md#required-post-deployment-tasks).

- An Azure IoT Hub with [messaging routing](../../iot-hub/iot-hub-devguide-messages-d2c.md) configured to send device messages to the device message event hub.

- A [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) that provides send access from the IoT Hub to the device message event hub (**Event Hubs Data Sender** role within the [Access control section (IAM)](../../role-based-access-control/overview.md) of the device message event hub).  

- An Azure Health Data Services workspace.

- An Azure Health Data Services FHIR service.

- An Azure Health Data Services MedTech service instance, including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (**Azure Events Hubs Receiver** role within the [Access control section (IAM)](../../role-based-access-control/overview.md) of the device message event hub) and FHIR service (**FHIR Data Writer** role within the [Access control section (IAM)](../../role-based-access-control/overview.md) of the FHIR service).

> [!TIP]
> For detailed step-by-step instructions on how to manually deploy the MedTech service, see [How to manually deploy the MedTech service using the Azure portal](deploy-03-new-manual.md).

## Create a device and send a test message

Now that your deployment has successfully completed, we'll connect to your hub, create a device, and send a test message to the hub by using Visual Studio Code with the Azure IoT Hub extension. These steps will allow your MedTech service to:

- Pick up the hub-routed test message from the device message event hub.
- Transform the test message into five FHIR Observations.
- Persist the FHIR Observations to your FHIR service.

1. Open Visual Studio Code with Azure IoT Tools installed.

1. In Explorer, in **Azure IoT Hub**, select **…** and then select **Select IoT Hub**. In a list of Azure subscriptions, select the subscription where your IoT hub was provisioned. You'll then be shown a list of IoT hubs. Select your IoT Hub (your IoT Hub will be the **basename** you provided when you provisioned the resources prefixed with **ih-**.). For this example, we'll select an IoT Hub named **ih-azuredocsdemo**. You'll be selecting your own IoT Hub.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-iot-hub.png" alt-text="Screenshot of Visual Studio Code with the Azure IoT Hub extension selecting the deployed IoT Hub for this tutorial " lightbox="media\iot-hub-to-iot-connector\iot-select-iot-hub.png":::

1. To create a device in your hub to use to send a test message, select **…**, and then select **Create Device**. For example, create a device named **iot-001**. You'll create a device name of your own choosing.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-device.png" alt-text="Screenshot of Visual Studio Code with the Azure IoT Hub extension selecting Create device for this tutorial." lightbox="media\iot-hub-to-iot-connector\iot-create-device.png":::

1. To send a test message from the device to your hub, right-click the device and select **Send D2C Message to IoT Hub**. In this example, the device is named **iot-001**. Use the device you created in the preceding step.

   > [!NOTE]
   > In this device-to-cloud (D2C) example, *cloud* is the hub in Azure IoT Hub that receives the device message. IoT Hub supports two-way communications. To set up a cloud-to-device (C2D) scenario, you select the **Send C2D Message to Device Cloud** option.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png" alt-text="Screenshot of Visual Studio Code with the Azure IoT Hub extension Send D2C Message to IoT Hub option selected." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png":::

1. In **Send D2C Messages**, select or enter the following values:

   - **Device(s) to send messages from**: The name of the device you created (default).

   - **Message(s) per device**: **1**.

   - **Interval between two messages**: **1 second(s)** (default).

   - **Message**: **Plain Text** (default).

   - **Edit**: Clear any existing text, and then paste the following JSON.

     > [!TIP]
     > You can use the **Copy** option in in the right corner of the test message, and then paste it in **Edit**.

     ```json
     {
       "HeartRate": 78,
       "RespiratoryRate": 12,
       "HeartRateVariability": 30,
       "BodyTemperature": 98.6,
       "BloodPressure": {
         "Systolic": 120,
         "Diastolic": 80
       }
     }
     ```

1. To begin the process of sending a test message to your hub, select **Send**.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png" alt-text="Screenshot of VSCode with the Azure IoT Hub extension selecting the device message options." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png":::   

   > [!NOTE]
   >  After you select **Send**, it might take up to five minutes for the FHIR resources to be available in the FHIR service.

   > [!IMPORTANT]
   > To avoid device spoofing in D2C messages, Azure IoT Hub enriches all messages with additional properties. To learn more about these properties, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties).
   >
   > To learn more, see [How to use IotJsonPathContentTemplate mappings](how-to-use-iot-jsonpath-content-mappings.md).

## Review metrics from test message

Now that you've successfully sent a test message to your hub, you can review your MedTech service metrics to verify that your MedTech service received, transformed, and persisted the test message to your FHIR service. To learn more about how to display the MedTech service monitoring tab metrics and the different types of metrics, see [How to display the MedTech service monitoring tab metrics](how-to-use-monitoring-tab.md).

For your MedTech service metrics, you can see that your MedTech service completed the following steps with the test message:

- **Number of Incoming Messages**: Received the incoming test message from the device message event hub.
- **Number of Normalized Messages**: Created five normalized messages.
- **Number of Measurements**: Created five measurements.
- **Number of FHIR resources**: Created five FHIR resources that will be persisted on your FHIR service.

:::image type="content" source="media\iot-hub-to-iot-connector\iot-metrics-tile-one.png" alt-text="Screenshot of MedTech service first metrics tile showing the test data metrics." lightbox="media\iot-hub-to-iot-connector\iot-metrics-tile-one.png":::

:::image type="content" source="media\iot-hub-to-iot-connector\iot-metrics-tile-two.png" alt-text="Screenshot of MedTech service second metrics tile showing the test data metrics." lightbox="media\iot-hub-to-iot-connector\iot-metrics-tile-two.png":::

## View test data in the FHIR service

If you provided your own Azure AD user object ID as the optional value for **Fhir Contributor Principal ID** when you deployed the tutorial template, you can query FHIR resources in your FHIR service.

To learn how to get an Azure AD access token and view FHIR resources in your FHIR service, see [Access by using Postman](../fhir/use-postman.md).

## Next steps

In this tutorial, you deployed an ARM template in the Azure portal, connected to your hub in Azure IoT Hub, created a device, and sent a test message to your MedTech service.

To learn how to use device mappings, see:

> [!div class="nextstepaction"]
> [How to use device mappings](how-to-use-device-mappings.md)

To learn more about FHIR destination mappings, see:

> [!div class="nextstepaction"]
> [How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
