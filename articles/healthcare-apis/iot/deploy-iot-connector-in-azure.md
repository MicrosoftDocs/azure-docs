---
title: Deploy IoT connector in the Azure portal - Azure Healthcare APIs
description: In this article, you'll learn how to deploy IoT connector in the Azure portal. 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 11/10/2021
ms.author: jasteppe
---

# Deploy IoT connector in the Azure portal

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this quickstart, you'll learn how to deploy IoT connector in the Azure portal. Configuring an IoT connector will enable you to ingest data from Internet of Things (IoT) into your Fast Healthcare Interoperability Resources (FHIR&#174;) service using an Azure Event Hub for device messages.

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of creating an IoT connector instance in Azure Healthcare APIs.

* [Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Resource group deployed in the Azure portal](../../azure-resource-manager/management/manage-resource-groups-portal.md)
* [Event Hubs namespace and Event Hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in Azure Healthcare APIs](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in Azure Healthcare APIs](../fhir/fhir-portal-quickstart.md) 

## Deploy IoT connector 

1. Sign in the [Azure portal](https://portal.azure.com), and then enter your Healthcare APIs workspace resource name in the **Search** bar field.
 
   ![Screenshot of entering the workspace resource name in the search bar field.](media/select-workspace-resource-group.png#lightbox)

2. Select **Deploy IoT connectors**.

   ![Screenshot of IoT connectors blade.](media/iot-connector-blade.png#lightbox)

3. Next, select **Add IoT connector**.

   ![Screenshot of add IoT connectors.](media/add-iot-connector.png#lightbox)

## Configure IoT connector to ingest data

Under the **Basics** tab, complete the required fields under **Instance details**.

![Screenshot of IoT configure instance details.](media/basics-instance-details.png#lightbox)

1. Enter the **IoT connector name**.

   The **IoT connector name** is a friendly name for the IoT connector. Enter a unique name for your IoT Connector. As an example, you can name it `healthdemo-iot`.

2. Enter the **Event Hub name**.

   The Event Hub name is the name of the **Event Hubs Instance** that you've deployed. 

   For information about Azure Event Hubs, see [Quickstart: Create an Event Hub using Azure portal](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace).

3. Enter the **Consumer Group**.

   The Consumer Group name is located by using the **Search** bar to go to the Event Hubs instance that you've deployed and by selecting the  **Consumer groups** blade.

   ![Screenshot of Consumer group name.](media/consumer-group-name.png#lightbox)

   For information about Consumer Groups,  see [Features and terminology in Azure Event Hubs](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#event-consumers).

4. Enter the name of the **Fully Qualified Namespace**.

    The **Fully Qualified Namespace** is the **Host name** located on your Event Hubs Namespace's **Overview** page.

    ![Screenshot of Fully qualified namespace.](media/event-hub-hostname.png#lightbox)  

    For more information about Event Hubs Namespaces, see [Namespace](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#namespace) in the Features and terminology in Azure Event Hubs document.

5. Select **Next: Device mapping**. 
  
## Configure Device mapping properties

> [!TIP]
> The IoMT Connector Data Mapper is an open source tool to visualize the mapping configuration for normalizing a device's input data, and then transform it to FHIR resources. Developers can use this tool to edit and test Devices and FHIR destination mappings, and to export the data to upload to an IoT connector in the Azure portal. This tool also helps developers understand their device's Device and FHIR destination mapping configurations.
>
> For more information, see the open source documentation:
>
> [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper)
>
> [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#device-content-mapping)

1. Under the **Device Mapping** tab, enter the Device mapping JSON code associated with your IoT connector.

   ![Screenshot of Configure device mapping.](media/configure-device-mapping.png#lightbox)

2. Select **Next: Destination >** to configure the destination properties associated with your IoT connector.

## Configure FHIR destination mapping properties

Under the **Destination** tab, enter the destination properties associated with the IoT connector.

   ![Screenshot of Configure destination properties.](media/configure-destination-properties.png#lightbox)

1. Enter the Azure Resource ID of the **FHIR service**.

   The **FHIR Server** name (also known as the **FHIR service**) is located by using the **Search** bar to go to the FHIR service that you've deployed and by selecting the **Properties** blade. Copy and paste the **Resource ID** string to the **FHIR Server** text field.

    ![Screenshot of Enter FHIR server name.](media/fhir-service-resource-id.png#lightbox) 

2. Enter the **Destination Name**.

   The **Destination Name** is a friendly name for the destination. Enter a unique name for your destination. As an example, you can name it `iotmedicdevice`.

3. Select **Create** or **Lookup** for the **Resolution Type**.

    > [!NOTE]
    > For the IoT connector destination to create a valid observation resource in the FHIR service, a device resource and patient resource **must** exist in the FHIR Server, so the observation can properly reference the device that created the data, and the patient the data was measured from. There are two modes the IoT connector can use to resolve the device and patient resources.

   **Create**

     The IoT connector destination attempts to retrieve a device resource from the FHIR Server using the device identifier included in the Event Hub message. It also attempts to retrieve a patient resource from the FHIR Server using the patient identifier included in the Event Hub message. If either resource is not found, new resources will be created (device, patient, or both) containing just the identifier contained in the Event Hub message. When you use the **Create** option, both a device identifier and a patient identifier can be configured in the device mapping. In other words, when the IoT Connector destination is in **Create** mode, it can function normally **without** adding device and patient resources to the FHIR Server.

   **Lookup**

     The IoT connector destination attempts to retrieve a device resource from the FHIR Server using the device identifier included in the event hub message. If the device resource is not found, this will cause an error, and the data won't be processed. For **Lookup** to function properly, a device resource with an identifier matching the device identifier included in the event hub message **must** exist and the device resource **must** have a reference to a patient resource that also exists. In other words, when the IoT connector destination is in the Lookup mode, device and patient resources **must** be added to the FHIR Server before data can be processed.

   For more information, see the open source documentation [FHIR destination mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#fhir-mapping).

4. Under **Destination Mapping**, enter the JSON code inside the code editor.

   For information about the Mapper Tool, see [IoMT Connector Data Mapper Tool](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper).

5. You may select **Review + create**, or you can select **Next: Tags >** if you want to configure tags.  

## (Optional) Configure Tags

Tags are name and value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

Under the **Tags** tab, enter the tag properties associated with the IoT connector.

   ![Screenshot of Tag properties.](media/tag-properties.png#lightbox)
 
1. Enter a **Name**.
2. Enter a **Value**.
3. Select **Review + create**.

   You should notice a **Validation success** message like what's shown in the image below. 

   ![Screenshot of Validation success message.](media/iot-connector-validation-success.png#lightbox) 

   > [!NOTE]
   > If your IoT connector didn’t validate, review the validation failure message, and troubleshoot the issue. It’s recommended that you review the properties under each IoT connector tab that you've configured.

4. Next, select **Create**.

   The newly deployed IoT connector will display inside your Azure Resource groups page.

   ![Screenshot of Deployed IoT connector listed in the Azure Recent resources list.](media/azure-resources-iot-connector-deployed.png#lightbox)  

    Now that your IoT connector has been deployed, we're going to walk through the steps of assigning permissions to access the Event Hub and the FHIR service. 

## Granting IoT connector access

To ensure that your IoT connector works properly, it must have granted access permissions to the Event Hub and FHIR service. 

### Accessing the IoT connector from the Event Hub

1. In the **Azure Resource group** list, select the name of your **Event Hubs Namespace**.

2. Select the **Access control (IAM)** blade, and then select **+ Add**.   

   ![Screenshot of access control of Event Hubs Namespace.](media/access-control-blade-add.png#lightbox)

3. Select **Add role assignment**.

   ![Screenshot of add role assignment.](media/event-hub-add-role-assignment.png#lightbox)
 
4. Select the **Role**, and then select **Azure Event Hubs Data Receiver**.

   ![Screenshot of add role assignment required fields.](media/event-hub-add-role-assignment-fields.png#lightbox)

   The Azure Event Hubs Data Receiver role allows the IoT connector that's being assigned this role to receive data from this Event Hub.

   For more information about application roles, see [Authentication & Authorization for the Healthcare APIs (preview)](.././authentication-authorization.md).

5. Select **Assign access to**, and keep the default option selected **User, group, or service principal**.

6. In the **Select** field, enter the security principal for your IoT connector.  

   `<your workspace name>/iotconnectors/<your IoT connector name>`
 
   When you deploy an IoT connector, it creates a managed identity. The managed identify name is a concatenation of the workspace name, resource type (that's the IoT connector), and the name of the IoT connector.

7. Select **Save**.

   After the role assignment has been successfully added to the Event Hub, a notification will display a green check mark with the text "Add Role assignment."  This message indicates that the IoT connector can now read from the Event Hub.

   ![Screenshot of added role assignment message.](media/event-hub-added-role-assignment.png#lightbox)

For more information about authoring access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).  

### Accessing the IoT connector from the FHIR service

1. In the **Azure Resource group list**, select the name of your  **FHIR service**.
 
2. Select the **Access control (IAM)** blade, and then select **+ Add**. 

3. Select **Add role assignment**.

  ![Screenshot of add role assignment for the FHIR service.](media/fhir-service-add-role-assignment.png#lightbox)

4. Select the **Role**, and then select **FHIR Data Writer**.

   The FHIR Data Writer role provides read and write access that the IoT connector uses to function. Because the IoT connector is deployed as a separate resource, the FHIR service will receive requests from the IoT connector. If the FHIR service doesn’t know who's making the request, or if it doesn't have the assigned role, it will deny the request as unauthorized.

   For more information about application roles, see [Authentication & Authorization for the Healthcare APIs (preview)](.././authentication-authorization.md).

5. In the **Select** field, enter the security principal for your IoT connector.  

    `<your workspace name>/iotconnectors/<your IoT connector name>`

6. Select **Save**.

   ![Screenshot of FHIR service added role assignment message.](media/fhir-service-added-role-assignment.png#lightbox)

   For more information about assigning roles to the FHIR service, see [Configure Azure RBAC](.././configure-azure-rbac.md).

## Next steps

In this article, you've learned how to deploy an IoT connector in the Azure portal. For an overview of IoT connector, see

>[!div class="nextstepaction"]
>[IoT connector overview](iot-connector-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
