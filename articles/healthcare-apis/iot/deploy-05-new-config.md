---
title: Configuring the MedTech service for deployment using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to configure the MedTech service for manual deployment using the Azure portal.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/10/2022
ms.author: jasteppe
---

# Part 2: Configure the MedTech service for manual deployment using the Azure portal

Before you can manually deploy the MedTech service, you must complete the following configuration tasks:

## Set up the MedTech service configuration

Start with these three steps to begin configuring the MedTech service so it will be ready to accept your tabbed configuration input:

1. Start by going to the Health Data Services workspace you created in the manual deployment [Prerequisites](deploy-03-new-manual.md#part-1-prerequisites) section. Select the Create MedTech service box.

2. This will take you to the Add MedTech service button. Select the button.

3. This will take you to the Create MedTech service page. This page has five tabs you need to fill out:

- Basics
- Device mapping
- Destination mapping
- Tags (optional)
- Review + create

## Configure the Basics tab

Follow these six steps to fill in the Basics tab configuration:

1. Enter the **MedTech service name**.

    The **MedTech service name** is a friendly, unique name for your MedTech service. For this example, we'll name the MedTech service `mt-azuredocsdemo`.

2. Enter the **Event Hubs Namespace**.

    The Event Hubs Namespace is the name of the **Event Hubs Namespace** that you previously deployed. For this example, we'll use `eh-azuredocsdemo` with our MedTech service device messages.

    > [!TIP]
    > For information about deploying an Azure Event Hubs Namespace, see [Create an Event Hubs Namespace](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace).
    >
    > For more information about Azure Event Hubs Namespaces, see [Namespace](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#namespace) in the Features and terminology in Azure Event Hubs document.

3. Enter the **Events Hubs name**.

   The Event Hubs name is the name of the event hub that you previously deployed within the Event Hubs Namespace. For this example, we'll use `devicedata` with our MedTech service device messages.  

   > [!TIP]
   > For information about deploying an Azure event hub, see [Create an event hub](../../event-hubs/event-hubs-create.md#create-an-event-hub).

4. Enter the **Consumer group**.

    The Consumer group name is located by going to the **Overview** page of the Event Hubs Namespace and selecting the event hub to be used for the MedTech service device messages. In this example, the event hub is named `devicedata`.

5. When you're inside the event hub, select the **Consumer groups** button under **Entities** to display the name of the consumer group to be used by your MedTech service.

6. By default, a consumer group named **$Default** is created during the deployment of an event hub. Use this consumer group for your MedTech service deployment.

   > [!IMPORTANT]
   > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group.
   >
   > Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
   >
   > Examples:
   >
   > - Two MedTech services accessing the same device message event hub.
   >
   > - A MedTech service and a storage writer application accessing the same device message event hub.

The Basics tab should now look like this after you have filled it out:

  :::image type="content" source="media\iot-deploy-manual-in-portal\select-device-mapping-button.png" alt-text="Screenshot of Basics tab filled out correctly." lightbox="media\iot-deploy-manual-in-portal\select-device-mapping-button.png":::

You are now ready to select the Device mapping tab and begin setting up the connection from the medical device to MedTech service.

## Configure the Device mapping tab

You need to configure device mapping so that your instance of MedTech service can connect to the device you want to receive data from. This means that the data will be first sent to your event hub instance and then picked up by the MedTech service.

The easiest way to configure the Device mapping tab is to use the Internet of Medical Things (IoMT) Connector Data Mapper tool to visualize, edit, and test your device mapping. This open source tool is available from [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper).

To begin configuring the device mapping tab, go to the Create MedTech service page and select the **Device mapping** tab. Then follow these two steps:

1. Go to the IoMT Connector Data Mapper and get the appropriate JSON code.

2. Return to the Create MedTech service page. Enter the JSON code for the template you want to use into the **Device mapping** tab. After you enter the template code, the Device mapping code will be displayed on the screen.

3. If the Device code is correct, select the **Next: Destination >** tab to enter the destination properties you want to use with your MedTech service. Note that your device configuration data will be saved for this session.

For more information regarding device mappings, see the relevant GitHub open source documentation at [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#device-content-mapping).

For Azure docs information about device mapping, see [How to use Device mappings](how-to-use-device-mappings.md).

## Configure the Destination tab

In order to configure the destination mapping tab, you can use the IoMT Connector Data Mapper tool to visualize, edit, and test the destination mapping. This open source tool is available from [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper). You need to configure destination mapping so that your instance of MedTech service can send and receive data to and from the FHIR service.

To begin configuring destination mapping, go to the Create MedTech service page and select the **Destination mapping** tab. There are two parts of the tab you must fill out:

 1. Destination properties
 2. JSON template request

### Destination properties

Under the **Destination** tab, use these values to enter the destination properties for your MedTech service instance:

- First, enter the name of your **Fast Healthcare Interoperability Resources (FHIR&#174;) server** using the following four steps:

  1. The **FHIR Server** name (also known as the **FHIR service**) can be located by using the **Search** bar at the top of the screen. 
  1. To connect to your FHIR service instance, enter the name of the FHIR service you used in the manual deploy configuration article at [Deploy the FHIR service](deploy-03-new-manual.md#deploy-the-fhir-service).
  1. Then select the **Properties** button. 
  1. Next, Copy and paste the **Name** string into the **FHIR Server** text field. In this example, the **FHIR Server** name is `fs-azuredocsdemo`.

- Next, enter the **Destination Name**.

  The **Destination Name** is a friendly name for the destination. Enter a unique name for your destination. In this example, the **Destination Name** is

  `fs-azuredocsdemo`.

- Then, select the **Resolution Type**.

  **Resolution Type** specifies how MedTech service will resolve missing data when reading from the FHIR service. MedTech reads device and patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/patient-definitions.html#Patient.identifier).

  Missing data can be resolved by choosing a **Resolution Type** of **Create** and **Lookup**:

  - **Create**

    If you selected **Create**, and device or patient resources are missing when you are reading data, new resources will be created, containing just the identifier.

  - **Lookup**
  
    If you selected **Lookup**, and device or patient resources are missing, an error will occur, and the data won't be processed. The errors **DeviceNotFoundException** and/or a **PatientNotFoundException** error will be generated, depending on the type of resource not found.

For more information regarding destination mapping, see the FHIR service GitHub documentation at [FHIR mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#fhir-mapping).

For Azure docs information about destination mapping, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).

### JSON template request

Before you can complete the FHIR destination mapping, you must get a FHIR destination mapping code. Follow these four steps:

1. Go to the [IoMT Connector Data Mapper Tool](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) and get the JSON template for your FHIR destination. 
1. Go back to the Destination tab of the Create MedTech service page. 
1. Go to the large box below the boxes for FHIR server name, Destination name, and Resolution type. Enter the JSON template request in that box.
1. You will then receive the FHIR Destination mapping code which will be saved as part of your configuration.

## Configure the Tags tab (optional)

Before you complete your configuration in the **Review + create** tab, you may want to configure tabs. You can do this by selecting the **Next: Tags >** tabs.

Tags are name and value pairs used for categorizing resources. This an optional step you may have a lot of resources and want to sort them. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

Follow these steps if you want to create tags:

1. Under the **Tags** tab, enter the tag properties associated with the MedTech service.

   - Enter a **Name**.
   - Enter a **Value**.

2. Once you've entered your tag(s), you are ready to do the last step of your configuration.

## Select the Review + create tab to validate your deployment request

To begin the validation process of your MedTech service deployment, select the **Review + create** tab. There will be a short delay and then you should  see a screen that displays a **Validation success** message. Below the message, you should see the following values for your deployment.

**Basics** 
- MedTech service name
- Event Hubs name
- Consumer group
- Event Hubs namespace

---

**Destination**
- FHIR server
- Destination name
- Resolution type

Your validation screen should look something like this:

   :::image type="content" source="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png" alt-text="Screenshot of validation success with details displayed." lightbox="media\iot-deploy-manual-in-portal\validate-and-review-medtech-service.png":::

If your MedTech service didn't validate, review the validation failure message, and troubleshoot the issue. Check all properties under each MedTech service tab that you've configured. Go back and try again.

## Continue on to Part 3: Deployment and Post-deployment

After your configuration is successfully completed, you can go on to Part 3: Deployment and post deployment. See **Next steps** below.

## Next steps

When you are ready to begin Part 3 of Manual Deployment, see

>[!div class="nextstepaction"]
>[Part 3: Manual deployment and post-deployment of MedTech service](deploy-06-new-deploy.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
