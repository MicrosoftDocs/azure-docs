---
title: Configuring the MedTech service for deployment using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to configure the MedTech service for manual deployment using the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/27/2022
ms.author: v-smcevoy
---

# Configure the MedTech service for manual deployment using the Azure portal

Before you can manually deploy the MedTech service, you must configure the following:

- MedTech service
- Basics tab
- Device mapping tab
- Destination tab
- Tags tab (optional)
- Review + create tab

## Set up the MedTech service configuration

Follow these four steps to configure the MedTech service so it will be ready to accept tabbed configuration input:

1. Start by going to the Health Data Services workspace you created from the manual deployment [Prerequisites](deploy-04-new-prereq.md) article. Select the Create MedTech service box.

2. This will take you to the Add MedTech service button. Select the button.

3. This will take you to the Create MedTech service blade. This blade has five tabs. After you fill out all the tabbed configurations, you will be ready to deploy the MedTech service.

## Configure the Basics tab

Follow these six steps to fill in the Basics tab configuration:

1. Enter the **MedTech service name**.

    The **MedTech service name** is a friendly, unique name for your MedTech service. For this example, we'll name the MedTech service `mt-azuredocsdemo`.

2. Enter the **Event Hubs Namespace**.

    The Event Hubs Namespace is the name of the **Event Hubs Namespace** that you previously deployed. For this example, we'll use `eh-azuredocsdemo` with our MedTech service device messages.

    > [!TIP]
    >
    > For information about deploying an Azure Event Hubs Namespace, see [Create an Event Hubs Namespace](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace).
    >
    > For more information about Azure Event Hubs Namespaces, see [Namespace](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#namespace) in the Features and terminology in Azure Event Hubs document.

3. Enter the **Events Hubs name**.

   The Event Hubs name is the name of the event hub that you previously deployed within the Event Hubs Namespace. For this example, we'll use `devicedata` with our MedTech service device messages.  

   > [!TIP]
   >
   > For information about deploying an Azure event hub, see [Create an event hub](../../event-hubs/event-hubs-create.md#create-an-event-hub).

4. Enter the **Consumer group**.

    The Consumer group name is located by going to the **Overview** page of the Event Hubs Namespace and selecting the event hub to be used for the MedTech service device messages. In this example, the event hub is named `devicedata`.

5. When you're inside the event hub, select the **Consumer groups** button under **Entities** to display the name of the consumer group to be used by your MedTech service.

6. By default, a consumer group named **$Default** is created during the deployment of an event hub. Use this consumer group for your MedTech service deployment.

   > [!IMPORTANT]
   >
   > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group.
   >
   > Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
   >
   > Examples:

   > - Two MedTech services accessing the same device message event hub.

   > - A MedTech service and a storage writer application accessing the same device message event hub.

The Basics tab should now look like this after you have filled it out:

  :::image type="content" source="media\iot-deploy-manual-in-portal\select-device-mapping-button.png" alt-text="Screenshot of Basics tab filled out correctly." lightbox="media\iot-deploy-manual-in-portal\select-device-mapping-button.png":::

You are now ready to select the Device mapping tab and begin setting up the connection from the medical device to MedTech service.

## Configure the Device mapping tab

In order to configure the Device mapping tab, you can use the Internet of Medical Things (IoMT) Connector Data Mapper tool to visualize, edit, and test the device mapping. This open source tool is at [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper). You need to configure device mapping so that your instance of MedTech service can connect to the device you want to receive data from. Note that the data will be first sent to your event hub instance and then picked up by the MedTech service.

To begin configuring device mapping tab, select the **Device mapping** tab under Create MedTech service and follow these steps:

1. Get the appropriate JSON code from the IoMT Connector Data Mapper. Then, in the **Device mapping** tab of the Create MedTech service page, enter the JSON code for the template you want to use. When you enter the template code, the Device mapping code will be displayed.

2. If the Device code looks correct, select the **Next: Destination >** tab to enter the destination properties associated with your MedTech service. Your device configuration data will be saved.

For more information regarding Device mappings, see the relevant GitHub open source documentation at [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#device-content-mapping).

For Azure docs information about device mapping, see [How to use Device mappings](how-to-use-device-mappings.md).

## Configure the Destination tab

In order to configure the Destination mapping tab, you can use the Internet of Medical Things (IoMT) Connector Data Mapper tool to visualize, edit, and test the device mapping. This open source tool is at [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper). You need to configure destination mapping so that your instance of MedTech service can send and receive data to and from the FHIR service.

To begin configuring destination mapping, select the **Destination mapping** tab under Create MedTech service. There are two parts of the tab you must fill out:

 1. Destination properties
 2. JSON template request

### Destination properties

Under the **Destination** tab, enter the destination properties associated with your MedTech service using these values:

- Enter the name of your **FHIR server**.

  The **FHIR Server** name (also known as the **FHIR service**) is located by using the **Search** bar at the top of the screen to go to the FHIR service that you've deployed and by selecting the **Properties** button. Copy and paste the **Name** string into the **FHIR Server** text field. In this example, the **FHIR Server** name is `fs-azuredocsdemo`. Use the information you used when you deployed the FHIR service earlier in the manual deploy configuration article at [Deploy the FHIR service](deploy-04-new-prereq.md#deploy-the-fhir-service).

- Enter the **Destination Name**.

      The **Destination Name** is a friendly name for the destination. Enter a unique name for your destination. In this example, the **Destination Name** is `fs-azuredocsdemo`.

- Select **Create** or **Lookup** for the **Resolution Type**.

  For the MedTech service destination to create a valid observation resource in the FHIR service, a device resource and patient resource **must** exist in the FHIR service, so the observation can properly reference the device that created the data, as well as the patient the data was measured from. There are two modes the MedTech service can use to resolve the device and patient resources.

  - If you select **Create**:

    The MedTech service destination attempts to retrieve a device resource from the FHIR service using the [device identifier](https://www.hl7.org/fhir/device-definitions.html#Device.identifier) included in the normalized message. It also attempts to retrieve a patient resource from the FHIR service using the [patient identifier](https://www.hl7.org/fhir/patient-definitions.html#Patient.identifier) included in the normalized message. If either resource isn't found, new resources will be created (device, patient, or both) containing just the identifier contained in the normalized message. When you use the **Create** option, both a device identifier and a patient identifier can be configured in the device mapping. In other words, when the MedTech service destination is in **Create** mode, it can function normally **without** adding device and patient resources to the FHIR service.

  - If you select **Lookup**:

    The MedTech service destination attempts to retrieve a device resource from the FHIR service using the device identifier included in the normalized message. If the device resource isn't found, an error will occur, and the data won't be processed. For **Lookup** to function properly, a device resource with an identifier matching the device identifier included in the normalized message **must** exist and the device resource **must** have a reference to a patient resource that also exists. In other words, when the MedTech service destination is in the Lookup mode, device and patient resources **must** be added to the FHIR service before data can be processed. If the MedTech service attempts to look up resources that don't exist on the FHIR service, a **DeviceNotFoundException** and/or a **PatientNotFoundException** error(s) will be generated based on which resources aren't present.

For more information regarding destination mappings, see the relevant GitHub documentation at [FHIR mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#fhir-mapping).

For Azure docs information about destination mapping, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

### JSON template request

After you have entered the FHIR server name, Destination name, and Resolution type, you then must enter an appropriate JSON template request in the large box below the first three boxes. Get this code from the [IoMT Connector Data Mapper Tool](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper). You will then receive the FHIR Destination mapping code.

Before you go on to the **Review + create** tab, you have the option select the **Next: Tags >** button if you want to configure tags.

## Configure the Tags tab (optional)

Tags are name and value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

Follow these steps to create tags:

1. Under the **Tags** tab, enter the tag properties associated with the MedTech service.

   - Enter a **Name**.
   - Enter a **Value**.

2. Once you've entered your tag(s), you are ready to go on.

## Select the Review + create tab to validate your deployment request

Selecting the **Review + create** tab will begin the validation process of your MedTech service deployment. There will be a short delay and then you should  see a final screen that displays a **Validation success** message. Below the message you should see the values created for your deployment.

- **Basics** 
- MedTech service name
- Event Hubs name
- Consumer group
- Event Hubs namespace

---

- **Destination**
- FHIR server
- Destination name
- Resolution type

Your validation screen should look something like this:

   :::image type="content" source="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png" alt-text="Screenshot of validation success with details displayed." lightbox="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png":::

If your MedTech service didn't validate, review the validation failure message, and troubleshoot the issue. Check all properties under each MedTech service tab that you've configured. Go back and try again. 

If your deployment request was valid, you are ready to go on the next step, which is to actually deploy the MedTech service.

## Next steps

In this article, you were shown how to configure MedTech service in preparation for deployment and make sure that everything has been validated before you attempt to deploy. To learn about deploying a validated MedTech service instance, see

>[!div class="nextstepaction"]
>[Deploy y7our the validated MedTech service instancel](deploy-06-new-deploy.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
