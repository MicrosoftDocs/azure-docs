---
title: Receive device data through Azure IoT Hub - Azure Health Data Services
description: In this tutorial, you'll learn how to enable device data routing from IoT Hub into the FHIR service through MedTech service.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 11/05/2022
ms.author: jasteppe
---

# Tutorial: Receive device data through Azure IoT Hub
 
The MedTech service may be used with devices created and managed through an [Azure IoT Hub](/azure/iot-hub/iot-concepts-and-iot-hub) for enhanced workflows and ease of use. This tutorial uses a Quickstart template and a **Deploy to Azure** button to deploy and configure a MedTech service using the Azure IoT Hub for device creation, management, and routing device messages to the device message event hub. 

Below is a diagram of the IoT device message flow when using an IoT Hub with the MedTech service. As you can see, devices send their messages to the IoT Hub, which then routes the device messages to the device message event hub to be picked up by the MedTech service. The MedTech service will then process the device messages and persist them into the Fast Healthcare Interoperability Resources (FHIR&#174;) service as FHIR observations. To learn more about the MedTech service data flow, see [MedTech service data flow](iot-data-flow.md)

:::image type="content" source="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png" alt-text="Diagram of IoT message data flow through IoT Hub into the MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png"::: 

## Prerequisites

In order to begin the deployment and complete this tutorial, you need to have the following prerequisites completed:

- An active Azure subscription account. If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- **Owner** or **Contributor** access to the Azure subscription. For more information about Azure role-based access control, see [What is Azure role-based access control?](/azure/role-based-access-control/overview).

- These resource providers registered with your Azure subscription: **Microsoft.HealthcareApis**, **Microsoft.EventHub**, and **Microsoft.Devices**. To learn more about registering resource providers, see [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types).

- [Visual Studio Code (VSCode)](https://code.visualstudio.com/Download) installed locally and configured with the addition of the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) extension. The Azure IoT Tools are a collection of tools makes it easy to connect to IoT Hubs, create devices, and send messages. For the purposes of this tutorial, we'll be using the **Azure IoT Hub** tool to connect to the deployed IoT Hub, create a device, and send a device message from the device to the IoT Hub.

When you've fulfilled these prerequisites, you're ready to use the **Deploy to Azure** button.

## Deploy to Azure button

1. Select the **Deploy to Azure** button below to begin the deployment within the Azure portal.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors-with-iothub%2Fazuredeploy.json)

   This button will call a template from the [Azure Resource Manager (ARM)](/azure/azure-resource-manager/management/overview) [Quickstart template library](https://azure.microsoft.com/resources/templates/iotconnectors-with-iothub/) to get information from your Azure subscription environment and begin deploying the MedTech service and IoT Hub using the Azure portal.

## Provide configuration details

2. When the Azure portal screen appears, your next task is to fill out the option fields that provide specific details of your deployment configuration.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deploy-template-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-deploy-template-options.png":::

   - **Subscription** - Choose the Azure subscription you want to use for the deployment.

   - **Resource group** - Choose an existing resource group or create a new resource group.

   - **Region** - The Azure region of the resource group used for the deployment. This field will auto-fill based on the resource group region.

   - **Basename** - This value will be appended to the name of the Azure resources and services to be deployed. For this tutorial, we're selecting the base name of **azuredocsdemo**. You'll pick a base name of your own choosing.

   - **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (the value could be the same or different region than your resource group). For a list of Azure regions where the Azure Health Data Services is available, see [Products available by regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=health-data-services).

   - **Fhir Contributor Principle Id** - **Optional** - An Azure AD user object ID that you would like to provide access to for read/write permissions to the FHIR service. This account can be used to access the FHIR service to view the device messages that are generated as part of this tutorial. It's recommended to use your own Azure AD user object ID so that you'll have access to the FHIR service. If you don't choose to use the **Fhir Contributor Principle Id** option, clear the field of any entries. To learn more about how to acquire an Azure AD user object ID, see [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id). The user object ID used in this tutorial isn't real and shouldn't be used. You'll use your own user object ID or that of another person you wish to provide access to the FHIR service.

    - Don't change the **Device Mapping** and **Destination Mapping** default values at this time as they'll work with the provided device message sample later in this tutorial when you send a device message to the IoT Hub using Visual Studio Code with the Azure IoT Hub extension.

   > [!IMPORTANT]
   > For this tutorial, the Quickstart template will place the MedTech service into a **Create** mode so that a device record is created on the FHIR service.
   >
   > To learn more about the MedTech service resolution types: **Create** and **Lookup**, see: [Destination properties](/azure/healthcare-apis/iot/deploy-05-new-config#destination-properties)

3. Select the **Review + create** button after all the option fields are filled out. This selection will review your input and check to see if all your values are valid.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-review-and-create-button.png" alt-text="Screenshot of Azure portal page displaying the **Review + create**." lightbox="media\iot-hub-to-iot-connector\iot-review-and-create-button.png":::

4. If the validation is successful, you'll see a **Validation Passed** message.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-validation-completed.png" alt-text="Screenshot of Azure portal page displaying the **Validation Passed** message." lightbox="media\iot-hub-to-iot-connector\iot-validation-completed.png":::

5. After a successful validation, select the **Create** button to begin the deployment.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-button.png" alt-text="Screenshot of Azure portal page displaying the **Create**." lightbox="media\iot-hub-to-iot-connector\iot-create-button.png":::

6. After a few minutes wait, a message will appear telling you that your deployment is complete.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-deployment-complete-banner.png" alt-text="Screenshot of Azure portal page displaying **Your deployment is complete**." lightbox="media\iot-hub-to-iot-connector\iot-deployment-complete-banner.png":::

## Review of deployed resources and access permissions

Once the deployment has competed, the following resources and access roles will be created as part of the template deployment: 

- An Azure Event Hubs Namespace and device message Azure event hub. In this example, the event hub is named **devicedata**.

- An Azure event hub consumer group. In this example, the consumer group is named **$Default**.

- An Azure event hub sender role. In this example, the sender role is named **devicedatasender**.

- An Azure IoT Hub with [messaging routing](/azure/iot-hub/iot-hub-devguide-messages-d2c) configured to send device messages to the device message event hub.

- A [user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview) that provides send access from the IoT Hub to the device message event hub (**Event Hubs Data Sender** role within the [Access control section (IAM)](/azure/role-based-access-control/overview) of the device message event hub).  

- An Azure Health Data Services workspace.

- An Azure Health Data Services FHIR service.

- An Azure Health Data Services MedTech service instance, including the necessary [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview) roles to the device message event hub (**Azure Events Hubs Receiver** role within the [Access control section (IAM)](/azure/role-based-access-control/overview) of the device message event hub) and FHIR service (**FHIR Data Writer** role within the [Access control section (IAM)](/azure/role-based-access-control/overview) of the FHIR service).

> [!TIP]
> For detailed step-by-step instructions on how to manually deploy the MedTech service, see [How to manually deploy the MedTech service using the Azure portal](deploy-03-new-manual.md).

## Create a device and send a message

1. Open **VSCode** with the previously installed **Azure IoT Tools**.

2. The **Azure IoT Hub extension** can be found in the **Explorer** section of **VSCode**. Select **…** and then select **Select IoT Hub**. You'll be shown a list of Azure subscriptions. Select the subscription where your IoT Hub was provisioned. You'll then be shown a list of IoT Hubs. Select your IoT Hub (your IoT Hub will be the basename you provided when you provisioned the resources prefixed with “ih-“.). For this example, we'll select an IoT Hub named **ih-azuredocsdemo**. You'll be selecting your own IoT Hub.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-iot-hub.png" alt-text="Screenshot of VSCode with the Azure IoT Hub extension selecting the deployed IoT Hub for this tutorial " lightbox="media\iot-hub-to-iot-connector\iot-select-iot-hub.png":::

3. Create a device within your IoT Hub to use to send device messages. Select **…** and then select **Create Device**. For this example, we'll be creating a device named **device-001**. You'll create a device name of your own choosing.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-create-device.png" alt-text="Screenshot of VSCode with the Azure IoT Hub extension selecting **Create device** for this tutorial." lightbox="media\iot-hub-to-iot-connector\iot-create-device.png":::

4. To send a message from the newly created device to the IoT Hub, right-click the device and select the **Send D2C Message to IoT Hub** option. For this example, we'll be using a device named **device-001**. You'll use the device you created as part of the previous step.

   > [!NOTE]
   > **D2C** stands for Device-to-Cloud. In this example, cloud is the IoT Hub that will be receiving the device message. IoT Hub allows two-way communications, which is why there's also the option to **Send C2D Message to Device Cloud** (C2D stands for Cloud-to-Device).

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png" alt-text="Screenshot of VSCode with the Azure IoT Hub extension selecting the **Send D2C Message to IoT Hub** option." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message.png":::

5. In the **Send D2C Messages** box, make the following selections:

   - **Device(s) to send messages from** - Leave at default. The device will be the one previously created by you.
   
   - **Message(s) per device** - Adjust from 10 to one.
   
   - **Interval between two messages** - Leave at default of one second.
   
   - **Message** - Leave at default value of **Plain Text**
   
   - **Edit** - If present, remove the **Hello from Azure IoT!** example and copy/paste the below device message into the **Edit** box.
   
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

6. Select **Send** to begin the process of sending a device message to the IoT Hub.

   :::image type="content" source="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png" alt-text="Screenshot of VSCode with the Azure IoT Hub extension selecting the device message options." lightbox="media\iot-hub-to-iot-connector\iot-select-device-to-cloud-message-options.png":::   
   
   > [!NOTE]
   >  After the device message is sent, it may take up to five minutes for the FHIR resources to be present in the FHIR service.

   > [!IMPORTANT]
   > To avoid device spoofing in device-to-cloud messages, Azure IoT Hub enriches all messages with additional properties. To learn more about these properties, see [Anti-spoofing properties](/azure/iot-hub/iot-hub-devguide-messages-construct#anti-spoofing-properties).
   >
   > To learn more about IotJsonPathContentTemplate mappings usage with the MedTech service device mappings, see [How to use IotJsonPathContentTemplate mappings](how-to-use-iot-jsonpath-content-mappings.md).

## View device data in the FHIR service (Optional)

If you provided your own Azure AD user object ID as the optional Fhir Contributor Principal ID when deploying this tutorial's template, then you have access to query FHIR resources on the FHIR service. 

Use this tutorial, [Access using Postman](/azure/healthcare-apis/fhir/use-postman) to get an Azure AD access token and view FHIR resources on the FHIR service.

## Next steps

In this tutorial, you deployed an Azure IoT Hub to route device data to the MedTech service. 

To learn about how to use device mappings, see

> [!div class="nextstepaction"]
> [How to use device mappings](how-to-use-device-mappings.md)

To learn more about FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
