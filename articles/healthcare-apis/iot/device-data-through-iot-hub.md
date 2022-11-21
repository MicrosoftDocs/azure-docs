---
title: Receive device messages through Azure IoT Hub - Azure Health Data Services
description: Learn how to deploy Azure IoT Hub with message routing to send device messages to the MedTech service in Azure Health Data Services. The tutorial uses an Azure Resource Manager template in the Azure portal and Visual Studio Code with the Azure IoT Hub extension.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 11/16/2022
ms.author: jasteppe
---

# Tutorial: Receive device messages through Azure IoT Hub

For enhanced workflows and ease of use, you can use the MedTech service in Azure Health Data Services to receive messages from devices you create and manage through a hub in [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md). This tutorial uses an Azure Resource Manager template (ARM template) and a **Deploy to Azure** button to deploy a MedTech service. The template creates an instance of IoT Hub to create and manage devices, and then routes device messages to an event hub for the MedTech service to pick up.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Open an ARM template in the Azure portal.
> - Configure the template for your deployment.
> - Create a device.
> - Send a test message.
> - Review metrics for the test message.

The ARM template that you use to deploy your solution in this tutorial is available at [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/iotconnectors-with-iothub/) by using the *azuredeploy.json* file on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors-with-iothub).

> [!TIP]
> Learn how to [use Azure PowerShell and the Azure CLI to deploy the MedTech service by using an ARM template](deploy-08-new-ps-cli.md). For more information about ARM templates, see [What are ARM templates?](../../azure-resource-manager/templates/overview.md)

## Device message flow

The following diagram demonstrates the IoT device message flow when you use a hub with the MedTech service. Devices send messages to the IoT hub. The hub then routes the device messages to the device message event hub for the MedTech service to pick up. The MedTech service transforms the device messages and persists them in the Fast Healthcare Interoperability Resources (FHIR&#174;) service as FHIR Observations. For more information, see [Medtech service data flow](iot-data-flow.md).

:::image type="content" source="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png" border="false" alt-text="Diagram of the IoT message data flow through an IoT hub into the MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png":::

## Prerequisites

To begin your deployment and complete the tutorial, you must have the following prerequisites:

- An active Azure subscription account. If you don't have an Azure subscription, see the [subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- Owner or Contributor and User Access Administrator role assignments in the Azure subscription. For more information, see [What is Azure role-based access control?](../../role-based-access-control/overview.md)

- The Microsoft.HealthcareApis, Microsoft.EventHub, and Microsoft.Devices resource providers registered with your Azure subscription. To learn more, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

- [Visual Studio Code](https://code.visualstudio.com/Download) installed locally.

- [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) installed in Visual Studio Code. Azure IoT Tools is a collection of extensions that makes it easy to connect to hubs, create devices, and send messages. In this tutorial, you use the Azure IoT Hub extension in Visual Studio Code to connect to your deployed hub, create a device, and send a test message from the device to your hub.

When you have these prerequisites, you're ready to deploy the tutorial template by using the **Deploy to Azure** button.

## Use the Deploy to Azure button

To begin deployment in the Azure portal, select the **Deploy to Azure** button:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors-with-iothub%2Fazuredeploy.json)

The button calls an ARM template from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/iotconnectors-with-iothub/) to get information from your Azure subscription environment and begin deploying the MedTech service and IoT Hub by using the Azure portal.

## Configure the deployment

1. In the Azure portal, on the **Basics** tab of the Azure quickstart template, select or enter the following information for your deployment:

   - **Subscription**: The Azure subscription to use for the deployment.

   - **Resource group**: An existing resource group, or you can create a new resource group.

   - **Region**: The Azure region of the resource group that's used for the deployment. **Region** auto-fills by using the resource group region.

   - **Basename**: A value that's appended to the name of the Azure resources and services that are deployed. The examples in this tutorial use the basename  **azuredocsdemo**. You can choose your own basename value.

   - **Location**: A supported Azure region for Azure Health Data Services (the value can be the same as or different from the region your resource group is in). For a list of Azure regions where Azure Health Data Services is available, see [Products available by regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=health-data-services).

   - **Fhir Contributor Principle Id** (optional): An Azure AD user object ID to provide read/write permissions in the FHIR service.
  
      You can use this account to give access to the FHIR service to view the device messages that are generated in this tutorial. We recommend that you use your own Azure Active Directory (Azure AD) user object ID, so that you can access the messages in the FHIR service. If you choose not to use the **Fhir Contributor Principle Id** option, clear the text box.
  
      To learn how to get an Azure AD user object ID, see [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id). The user object ID that's used in this tutorial is only an example. You'll use your own user object ID or the object ID of another person who you want to be able to access the FHIR service.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deploy-template-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-deploy-template-options.png":::

   Don't change the default values for **Device Mapping** and **Destination Mapping** in this tutorial. The mappings are set in the template to send a device message to your hub later in the tutorial.
  
   > [!IMPORTANT]
   > In this tutorial, the ARM template configures the MedTech service to operate in Create mode. A Patient Resource and a Device Resource are created for each device that sends data to your FHIR service.
   >
   > To learn more about the MedTech service resolution types Create and Lookup, see [Destination properties](deploy-05-new-config.md#destination-properties).

1. To validate your configuration, select **Review + create**.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-review-and-create-button.png" alt-text="Screenshot of Azure portal page displaying the Review + create.":::

1. In **Review + create**, check the template validation status. If validation is successful, the template displays **Validation Passed**. If validation fails, fix the detail that's indicated in the error message, and then select **Review + create** again.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-validation-completed.png" alt-text="Screenshot that shows the Review + create pane displaying the Validation Passed message.":::

1. After a successful validation, to begin the deployment, select **Create**.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-button.png" alt-text="Screenshot that shows the highlighted Create button.":::

1. In a few minutes, the Azure portal displays the message that your deployment is completed.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deployment-complete-banner.png" alt-text="Screenshot that shows a green checkmark and the message Your deployment is complete.":::

## Review deployed resources and access permissions

When deployment is completed, the following resources and access roles are created in the template deployment:

- An Azure Event Hubs namespace and a device message event hub. In this deployment, the event hub is named *devicedata*.

- An event hub consumer group. In this deployment, the consumer group is named *$Default*.

- An event hub sender role. In this deployment, the sender role is named *devicedatasender*. The event hub sender role isn't used in this tutorial. To learn more about the role, see [Review of deployed resources and access permissions](deploy-02-new-button.md#required-post-deployment-tasks).

- An instance of Azure IoT Hub with [messaging routing](../../iot-hub/iot-hub-devguide-messages-d2c.md) configured to send device messages to the device message event hub.

- A [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) that provides send access from the IoT hub to the device message event hub. The managed identity has the Event Hubs Data Sender role in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the device message event hub.  

- A Health Data Services workspace.

- A Health Data Services FHIR service.

- An instance of the Health Data Services MedTech service, with the required [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles:

  - For the device message event hub, the Azure Events Hubs Receiver role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the device message event hub.

  - For the FHIR service, the FHIR Data Writer role is assigned in the [Access control section (IAM)](../../role-based-access-control/overview.md) of the FHIR service.

> [!TIP]
> Get detailed instructions to [manually deploy the MedTech service by using the Azure portal](deploy-03-new-manual.md).

## Create a device and send a test message

With your resources successfully deployed, next, you connect to your hub, create a device, and send a test message to the hub. After you complete these steps, your MedTech service can:

- Pick up the hub-routed test message from the device message event hub.
- Transform the test message into five FHIR Observations.
- Persist the FHIR Observations to your FHIR service.

You complete the steps by using Visual Studio Code with the Azure IoT Hub extension:

1. Open Visual Studio Code with Azure IoT Tools installed.

1. In Explorer, in **Azure IoT Hub**, select **…** and choose **Select IoT Hub**.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-iot-hub.png" alt-text="Screenshot of Visual Studio Code with the Azure IoT Hub extension selecting the deployed IoT Hub for this tutorial " lightbox="media\iot-hub-to-iot-connector\iot-select-iot-hub.png":::

1. Select the Azure subscription where your hub was provisioned.
  
1. Select your IoT hub. The name of your hub is the *basename* you provided when you provisioned the resources, prefixed with **ih-**. An example hub name is *ih-azuredocsdemo*.

1. In Explorer, in **Azure IoT Hub**, select **…** and choose **Create Device**. An example device name is *iot-001*.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-device.png" alt-text="Screenshot of Visual Studio Code with the Azure IoT Hub extension selecting Create device for this tutorial." lightbox="media\iot-hub-to-iot-connector\iot-create-device.png":::

1. To send a test message from the device to your hub, right-click the device and select **Send D2C Message to IoT Hub**.

   > [!NOTE]
   > In this device-to-cloud (D2C) example, *cloud* is the hub in Azure IoT Hub that receives the device message. IoT Hub supports two-way communications. To set up a cloud-to-device (C2D) scenario, select **Send C2D Message to Device Cloud**.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png" alt-text="Screenshot that shows Visual Studio Code with the Azure IoT Hub extension Send D2C Message to IoT Hub option selected." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png":::

1. In **Send D2C Messages**, select or enter the following values:

   - **Device(s) to send messages from**: The name of the device you created.

   - **Message(s) per device**: **1**.

   - **Interval between two messages**: **1 second(s)**.

   - **Message**: **Plain Text**.

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

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png" alt-text="Screenshot that shows Visual Studio code with the Azure IoT Hub extension selecting the device message options." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png":::

   After you select **Send**, it might take up to five minutes for the FHIR resources to be available in the FHIR service.

   > [!IMPORTANT]
   > To avoid device spoofing in D2C messages, Azure IoT Hub enriches all messages with additional properties. For more information, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties) and [How to use IotJsonPathContentTemplate mappings](how-to-use-iot-jsonpath-content-mappings.md).

## Review metrics from the test message

Now that you've successfully sent a test message to your hub, review your MedTech service metrics. You review metrics to verify that your MedTech service received, transformed, and persisted the test message to your FHIR service. To learn more, see [How to display the MedTech service monitoring tab metrics](how-to-use-monitoring-tab.md).

For your MedTech service metrics, you can see that your MedTech service completed the following steps for the test message:

- **Number of Incoming Messages**: Received the incoming test message from the device message event hub.
- **Number of Normalized Messages**: Created five normalized messages.
- **Number of Measurements**: Created five measurements.
- **Number of FHIR resources**: Created five FHIR resources that are persisted in your FHIR service.

:::image type="content" source="media\iot-hub-to-iot-connector\iot-metrics-tile-one.png" alt-text="Screenshot that shows a MedTech service metrics tile and test data metrics." lightbox="media\iot-hub-to-iot-connector\iot-metrics-tile-one.png":::

:::image type="content" source="media\iot-hub-to-iot-connector\iot-metrics-tile-two.png" alt-text="Screenshot that shows a second MedTech service metrics tile and test data metrics." lightbox="media\iot-hub-to-iot-connector\iot-metrics-tile-two.png":::

## View test data in the FHIR service

If you provided your own Azure AD user object ID as the optional value for **Fhir Contributor Principal ID** in the deployment template, you can query FHIR resources in your FHIR service.

To learn how to get an Azure AD access token and view FHIR resources in your FHIR service, see [Access by using Postman](../fhir/use-postman.md).

## Next steps

In this tutorial, you deployed an ARM template in the Azure portal, connected to your hub in Azure IoT Hub, created a device, and sent a test message to your MedTech service.

To learn how to use device mappings:

> [!div class="nextstepaction"]
> [How to use device mappings](how-to-use-device-mappings.md)

To learn more about FHIR destination mappings:

> [!div class="nextstepaction"]
> [How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
