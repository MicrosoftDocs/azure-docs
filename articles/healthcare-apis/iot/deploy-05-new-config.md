---
title: Configuring the MedTech service for deployment using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to configure the MedTech service for manual deployment using the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: v-smcevoy
---

# Configure the MedTech service for manual deployment using the Azure portal

## Configuraton overview

## Configure the MedTech service to ingest data

1. Under the **Basics** tab, complete the required fields under **MedTech service details** page section.

   :::image type="content" source="media\iot-deploy-manual-in-portal\deploy-medtech-service-basics.png" alt-text="Screenshot of create MedTech services basics information with red boxes around the required information." lightbox="media\iot-deploy-manual-in-portal\deploy-medtech-service-basics.png":::

   1. Enter the **MedTech service name**.

      The **MedTech service name** is a friendly, unique name for your MedTech service. For this example, we'll name the MedTech service `mt-azuredocsdemo`.

   2. Enter the **Event Hubs Namespace**.

      The Event Hubs Namespace is the name of the **Event Hubs Namespace** that you've previously deployed. For this example, we'll use `eh-azuredocsdemo` for use with our MedTech service device messages. 

      > [!TIP]
      >
      > For information about deploying an Azure Event Hubs Namespace, see [Create an Event Hubs Namespace](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace).
      >
      > For more information about Azure Event Hubs Namespaces, see [Namespace](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#namespace) in the Features and terminology in Azure Event Hubs document.

   3. Enter the **Events Hubs name**.

      The Event Hubs name is the event hub that you previously deployed within the Event Hubs Namespace. For this example, we'll use `devicedata` for use with our MedTech service device messages.  
   
      > [!TIP]
      >
      > For information about deploying an Azure event hub, see [Create an event hub](../../event-hubs/event-hubs-create.md#create-an-event-hub).

   4. Enter the **Consumer group**.

      The Consumer group name is located by going to the **Overview** page of the Event Hubs Namespace and selecting the event hub to be used for the MedTech service device messages. In this example, the event hub is named `devicedata`.

      :::image type="content" source="media\iot-deploy-manual-in-portal\select-medtech-service-event-hub.png" alt-text="Screenshot of Event Hubs overview and red box around the event hub to be used for the MedTech service device messages." lightbox="media\iot-deploy-manual-in-portal\select-medtech-service-event-hub.png":::

   5. Once inside of the event hub, select the **Consumer groups** button under **Entities** to display the name of the consumer group to be used by your MedTech service. 

      :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-consumer-groups.png" alt-text="Screenshot of event hub overview and red box around the consumer groups button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-consumer-groups.png":::

   6. By default, a consumer group named **$Default** is created during the deployment of an event hub. Use this consumer group for your MedTech service deployment.

      :::image type="content" source="media\iot-deploy-manual-in-portal\display-event-hub-consumer-group.png" alt-text="Screenshot of event hub consumer groups with red box around the consumer group to be used with the MedTech service." lightbox="media\iot-deploy-manual-in-portal\display-event-hub-consumer-group.png":::

      > [!IMPORTANT]
      >
      > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group. 
      >
      > Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
      >
      > Examples: 
      > * Two MedTech services accessing the same device message event hub.
      > * A MedTech service and a storage writer application accessing the same device message event hub. 
    
2. Select **Next: Device mapping** button. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-device-mapping-button.png" alt-text="Screenshot of MedTech services basics information filled out and a red box around the Device mapping button." lightbox="media\iot-deploy-manual-in-portal\select-device-mapping-button.png":::
  
## Configure the Device mapping properties

> [!TIP]
>
> The IoMT Connector Data Mapper is an open source tool to visualize the mapping configuration for normalizing a device's input data, and then transforming it into FHIR resources. You can use this tool to edit and test Device and FHIR destination mappings, and to export the mappings to be uploaded to a MedTech service in the Azure portal. This tool also helps you understand your device's Device and FHIR destination mapping configurations.
>
> For more information regarding Device mappings, see our GitHub open source and Azure Docs documentation:
>
> [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper)
>
> [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#device-content-mapping)
>
> [How to use Device mappings](how-to-use-device-mappings.md)

1. Under the **Device mapping** tab, enter the Device mapping JSON code for use with your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\configure-device-mapping-empty.png" alt-text="Screenshot of empty Device mapping page with red box around required information." lightbox="media\iot-deploy-manual-in-portal\configure-device-mapping-empty.png":::

2. Once Device mapping is configured, select the **Next: Destination >** button to configure the destination properties associated with your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\configure-device-mapping-completed.png" alt-text="Screenshot of Device mapping page and the Destination button with red box around both." lightbox="media\iot-deploy-manual-in-portal\configure-device-mapping-completed.png":::

## Configure Destination properties

1. Under the **Destination** tab, enter the destination properties associated with your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\configure-destination-mapping-empty.png" alt-text="Screenshot of Destination mapping page with red box around required information." lightbox="media\iot-deploy-manual-in-portal\configure-destination-mapping-empty.png":::

   1. Name of your **FHIR server**.

      The **FHIR Server** name (also known as the **FHIR service**) is located by using the **Search** bar at the top of the screen to go to the FHIR service that you've deployed and by selecting the **Properties** button. Copy and paste the **Name** string into the **FHIR Server** text field. In this example, the **FHIR Server** name is `fs-azuredocsdemo`.

      :::image type="content" source="media\iot-deploy-manual-in-portal\get-fhir-service-name.png" alt-text="Screenshot of the FHIR Server properties with a red box around the Properties button and FHIR service name."lightbox="media\iot-deploy-manual-in-portal\get-fhir-service-name.png"::: 

   2. Enter the **Destination Name**.

      The **Destination Name** is a friendly name for the destination. Enter a unique name for your destination. In this example, the **Destination Name** is `fs-azuredocsdemo`.

   3. Select **Create** or **Lookup** for the **Resolution Type**.

    > [!NOTE]
    >
    > For the MedTech service destination to create a valid observation resource in the FHIR service, a device resource and patient resource **must** exist in the FHIR service, so the observation can properly reference the device that created the data, and the patient the data was measured from. There are two modes the MedTech service can use to resolve the device and patient resources.

    **Create**

      The MedTech service destination attempts to retrieve a device resource from the FHIR service using the [device identifier](https://www.hl7.org/fhir/device-definitions.html#Device.identifier) included in the normalized message. It also attempts to retrieve a patient resource from the FHIR service using the [patient identifier](https://www.hl7.org/fhir/patient-definitions.html#Patient.identifier) included in the normalized message. If either resource isn't found, new resources will be created (device, patient, or both) containing just the identifier contained in the normalized message. When you use the **Create** option, both a device identifier and a patient identifier can be configured in the device mapping. In other words, when the MedTech service destination is in **Create** mode, it can function normally **without** adding device and patient resources to the FHIR service.

    **Lookup**

      The MedTech service destination attempts to retrieve a device resource from the FHIR service using the device identifier included in the normalized message. If the device resource isn't found, an error will occur, and the data won't be processed. For **Lookup** to function properly, a device resource with an identifier matching the device identifier included in the normalized message **must** exist and the device resource **must** have a reference to a patient resource that also exists. In other words, when the MedTech service destination is in the Lookup mode, device and patient resources **must** be added to the FHIR service before data can be processed. If the MedTech service attempts to look up resources that don't exist on the FHIR service, a **DeviceNotFoundException** and/or a **PatientNotFoundException** error(s) will be generated based on which resources aren't present.

   > [!TIP]
   > 
   > For more information regarding Destination mappings, see our GitHub and Azure Docs documentation:
   >
   > [FHIR mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#fhir-mapping).
   >
   > [How to us FHIR destination mappings](how-to-use-fhir-mappings.md)

2. Under **Destination Mapping**, enter the JSON code inside the code editor.

   > [!TIP]
   >
   > For information about the Mapper Tool, see [IoMT Connector Data Mapper Tool](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper).

3. You may select the **Review + create** button, or you can optionally select the **Next: Tags >** button if you want to configure tags. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\configure-destination-mapping-completed.png" alt-text="Screenshot of Destination mapping page with red box around both required information." lightbox="media\iot-deploy-manual-in-portal\configure-destination-mapping-completed.png"::: 

## (Optional) Configure Tags

Tags are name and value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

1. Under the **Tags** tab, enter the tag properties associated with the MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\optional-create-tags.png" alt-text="Screenshot of optional tags creation page with red box around both required information." lightbox="media\iot-deploy-manual-in-portal\optional-create-tags.png":::
 
   1. Enter a **Name**.
   2. Enter a **Value**.

2. Once you've entered your tag(s), select the **Review + create** button.

3. You should notice a **Validation success** message like what's shown in the image below. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png" alt-text="Screenshot of validation success and a red box around the Create button." lightbox="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png"::: 

   > [!NOTE]
   >
   > If your MedTech service didn't validate, review the validation failure message, and troubleshoot the issue. It's recommended that you review the properties under each MedTech service tab that you've configured.


FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
