---
title: Deploy the MedTech service in the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using either a quickstart template or manually.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 07/07/2022
ms.author: jasteppe
ms.custom: mode-api
---

# Deploy the MedTech service using the Azure portal

In this quickstart, you'll learn how to deploy the MedTech service in the Azure portal using two different methods: with a [quickstart template](#deploy-the-medtech-service-with-a-quickstart-template) or [manually](#deploy-the-medtech-service-manually). The MedTech service will enable you to ingest data from Internet of Things (IoT) into your Fast Healthcare Interoperability Resources (FHIR&#174;) service.

## Deploy the MedTech service with a quickstart template

If you already have an active Azure account, you can use this [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json) button to deploy a MedTech service that will include the following resources and permissions:

 * An Azure Event Hubs Namespace and device message Azure event hub (the event hub is named: **devicedata**).
 * An Azure event hub consumer group (the consumer group is named: **$Default**).
 * An Azure event hub sender role (the sender role is named: **devicedatasender**).
 * An Azure Health Data Services workspace.
 * An Azure Health Data Services FHIR service.
 * An Azure Health Data Services MedTech service including the necessary system-assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) permissions to the device message event hub (**Azure Events Hubs Receiver**) and FHIR service (**FHIR Data Writer**).

When the Azure portal launches, the following fields must be filled out:
 * **Subscription** - Choose the Azure subscription you would like to use for the deployment.
 * **Resource Group** - Choose an existing Resource Group or create a new Resource Group.
 * **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill based on the Resource Group region.
 * **Basename** - Will be used to append the name the Azure services to be deployed.
 * **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (could be the same or different region than your Resource Group). 

Leave the **Device Mapping** and **Destination Mapping** fields with their default values.

Select the **Review + create** button once the fields are filled out.

:::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png"::: 

After the validation has passed, select the **Create** button to begin the deployment.

:::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png" alt-text="Screenshot of Azure portal page displaying validation box and Create button for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png"::: 

After a successful deployment, there will be remaining configurations that will need to be completed by you for a fully functional MedTech service:
 * Provide a working device mapping file. For more information, see [How to use device mappings](how-to-use-device-mappings.md).
 * Provide a working destination mapping file. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).
 * Use the Shared access policies (SAS) key (**devicedatasender**) for connecting your device or application to the MedTech service device message event hub (**devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

> [!IMPORTANT]
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group. 
>
> Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
>
> Examples: 
>* Two MedTech services accessing the same device message event hub.
>* A MedTech service and a storage writer application accessing the same device message event hub. 

## Deploy the MedTech service manually

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of creating a MedTech service instance in Azure Health Data Services.

* [Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Resource group deployed in the Azure portal](../../azure-resource-manager/management/manage-resource-groups-portal.md)
* [Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in Azure Health Data Services](../fhir/fhir-portal-quickstart.md)

1. Sign in the [Azure portal](https://portal.azure.com), and then enter your Health Data Services workspace resource name in the **Search** bar field.
 
   ![Screenshot of entering the workspace resource name in the search bar field.](media/iot-deploy-manual-in-portal/select-workspace-resource-group.png#lightbox)

2. Select **Deploy MedTech service**.

   ![Screenshot of MedTech services blade.](media/iot-deploy-manual-in-portal/iot-connector-blade.png#lightbox)

3. Next, select **Add MedTech service**.

   ![Screenshot of add MedTech services.](media/iot-deploy-manual-in-portal/add-iot-connector.png#lightbox)

## Configure the MedTech service to ingest data

Under the **Basics** tab, complete the required fields under **Instance details**.

![Screenshot of IoT configure instance details.](media/iot-deploy-manual-in-portal/basics-instance-details.png#lightbox)

1. Enter the **MedTech service name**.

   The **MedTech service name** is a friendly name for the MedTech service. Enter a unique name for your MedTech service. As an example, you can name it `healthdemo-iot`.

2. Enter the **Event Hub name**.

   The event hub name is the name of the **Event Hubs Instance** that you've deployed. 

   For information about Azure Event Hubs, see [Quickstart: Create an event hub using Azure portal](../../event-hubs/event-hubs-create.md#create-an-event-hubs-namespace).

3. Enter the **Consumer Group**.

   The Consumer Group name is located by using the **Search** bar to go to the Event Hubs instance that you've deployed and by selecting the  **Consumer groups** blade.

   ![Screenshot of Consumer group name.](media/iot-deploy-manual-in-portal/consumer-group-name.png#lightbox)

> [!IMPORTANT]
> If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has its own event hub consumer group. 
>
> Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
>
> Examples: 
>* Two MedTech services accessing the same device message event hub.
>* A MedTech service and a storage writer application accessing the same device message event hub. 

4. Enter the name of the **Fully Qualified Namespace**.

    The **Fully Qualified Namespace** is the **Host name** located on your Event Hubs Namespace's **Overview** page.

    ![Screenshot of Fully qualified namespace.](media/iot-deploy-manual-in-portal/event-hub-hostname.png#lightbox)  

    For more information about Event Hubs Namespaces, see [Namespace](../../event-hubs/event-hubs-features.md?WT.mc_id=Portal-Microsoft_Healthcare_APIs#namespace) in the Features and terminology in Azure Event Hubs document.

5. Select **Next: Device mapping**. 
  
## Configure the Device mapping properties

> [!TIP]
> The IoMT Connector Data Mapper is an open source tool to visualize the mapping configuration for normalizing a device's input data, and then transform it to FHIR resources. Developers can use this tool to edit and test Devices and FHIR destination mappings, and to export the data to upload to an MedTech service in the Azure portal. This tool also helps developers understand their device's Device and FHIR destination mapping configurations.
>
> For more information, see the open source documentation:
>
> [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper)
>
> [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#device-content-mapping)

1. Under the **Device Mapping** tab, enter the Device mapping JSON code associated with your MedTech service.

   ![Screenshot of Configure device mapping.](media/iot-deploy-manual-in-portal/configure-device-mapping.png#lightbox)

2. Select **Next: Destination >** to configure the destination properties associated with your MedTech service.

## Configure the FHIR destination mapping properties

Under the **Destination** tab, enter the destination properties associated with the MedTech service.

   ![Screenshot of Configure destination properties.](media/iot-deploy-manual-in-portal/configure-destination-properties.png#lightbox)

1. Enter the Azure Resource ID of the **FHIR service**.

   The **FHIR Server** name (also known as the **FHIR service**) is located by using the **Search** bar to go to the FHIR service that you've deployed and by selecting the **Properties** blade. Copy and paste the **Resource ID** string to the **FHIR Server** text field.

    ![Screenshot of Enter FHIR server name.](media/iot-deploy-manual-in-portal/fhir-service-resource-id.png#lightbox) 

2. Enter the **Destination Name**.

   The **Destination Name** is a friendly name for the destination. Enter a unique name for your destination. As an example, you can name it `iotmedicdevice`.

3. Select **Create** or **Lookup** for the **Resolution Type**.

    > [!NOTE]
    > For the MedTech service destination to create a valid observation resource in the FHIR service, a device resource and patient resource **must** exist in the FHIR service, so the observation can properly reference the device that created the data, and the patient the data was measured from. There are two modes the MedTech service can use to resolve the device and patient resources.

   **Create**

     The MedTech service destination attempts to retrieve a device resource from the FHIR Server using the device identifier included in the event hub message. It also attempts to retrieve a patient resource from the FHIR service using the patient identifier included in the event hub message. If either resource isn't found, new resources will be created (device, patient, or both) containing just the identifier contained in the event hub message. When you use the **Create** option, both a device identifier and a patient identifier can be configured in the device mapping. In other words, when the MedTech service destination is in **Create** mode, it can function normally **without** adding device and patient resources to the FHIR service.

   **Lookup**

     The MedTech service destination attempts to retrieve a device resource from the FHIR service using the device identifier included in the event hub message. If the device resource isn't found, an error will occur, and the data won't be processed. For **Lookup** to function properly, a device resource with an identifier matching the device identifier included in the event hub message **must** exist and the device resource **must** have a reference to a patient resource that also exists. In other words, when the MedTech service destination is in the Lookup mode, device and patient resources **must** be added to the FHIR service before data can be processed.

   For more information, see the open source documentation [FHIR destination mapping](https://github.com/microsoft/iomt-fhir/blob/master/docs/Configuration.md#fhir-mapping).

4. Under **Destination Mapping**, enter the JSON code inside the code editor.

   For information about the Mapper Tool, see [IoMT Connector Data Mapper Tool](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper).

5. You may select **Review + create**, or you can select **Next: Tags >** if you want to configure tags.  

## (Optional) Configure Tags

Tags are name and value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

Under the **Tags** tab, enter the tag properties associated with the MedTech service.

   ![Screenshot of Tag properties.](media/iot-deploy-manual-in-portal/tag-properties.png#lightbox)
 
1. Enter a **Name**.
2. Enter a **Value**.
3. Select **Review + create**.

   You should notice a **Validation success** message like what's shown in the image below. 

   ![Screenshot of Validation success message.](media/iot-deploy-manual-in-portal/iot-connector-validation-success.png#lightbox) 

   > [!NOTE]
   > If your MedTech service didn't validate, review the validation failure message, and troubleshoot the issue. It's recommended that you review the properties under each MedTech service tab that you've configured.

4. Next, select **Create**.

   The newly deployed MedTech service will display inside your Azure Resource groups page.

   ![Screenshot of Deployed MedTech service listed in the Azure Recent resources list.](media/iot-deploy-manual-in-portal/azure-resources-iot-connector-deployed.png#lightbox)  

    Now that your MedTech service has been deployed, we're going to walk through the steps of assigning permissions to access the event hub and FHIR service. 

## Granting the MedTech service access

To ensure that your MedTech service works properly, it must have granted access permissions to the event hub and FHIR service. 

### Accessing the MedTech service from the event hub

1. In the **Azure Resource group** list, select the name of your **Event Hubs Namespace**.

2. Select the **Access control (IAM)** blade, and then select **+ Add**.   

   ![Screenshot of access control of Event Hubs Namespace.](media/iot-deploy-manual-in-portal/access-control-blade-add.png#lightbox)

3. Select **Add role assignment**.

   ![Screenshot of add role assignment.](media/iot-deploy-manual-in-portal/event-hub-add-role-assignment.png#lightbox)
 
4. Select the **Role**, and then select **Azure Event Hubs Data Receiver**.

   ![Screenshot of add role assignment required fields.](media/iot-deploy-manual-in-portal/event-hub-add-role-assignment-fields.png#lightbox)

   The Azure Event Hubs Data Receiver role allows the MedTech service that's being assigned this role to receive data from this event hub.

   For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

5. Select **Assign access to**, and keep the default option selected **User, group, or service principal**.

6. In the **Select** field, enter the security principal for your MedTech service.  

   `<your workspace name>/iotconnectors/<your MedTech service name>`
 
   When you deploy a MedTech service, it creates a system-assigned managed identity. The system-assigned managed identify name is a concatenation of the workspace name, resource type (that's the MedTech service), and the name of the MedTech service.

7. Select **Save**.

   After the role assignment has been successfully added to the event hub, a notification will display a green check mark with the text "Add Role assignment."  This message indicates that the MedTech service can now read from the event hub.

   ![Screenshot of added role assignment message.](media/iot-deploy-manual-in-portal/event-hub-added-role-assignment.png#lightbox)

For more information about authoring access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).  

### Accessing the MedTech service from the FHIR service

1. In the **Azure Resource group list**, select the name of your **FHIR service**.
 
2. Select the **Access control (IAM)** blade, and then select **+ Add**. 

3. Select **Add role assignment**.

  ![Screenshot of add role assignment for the FHIR service.](media/iot-deploy-manual-in-portal/fhir-service-add-role-assignment.png#lightbox)

4. Select the **Role**, and then select **FHIR Data Writer**.

   The FHIR Data Writer role provides read and write access that the MedTech service uses to function. Because the MedTech service is deployed as a separate resource, the FHIR service will receive requests from the MedTech service. If the FHIR service doesn’t know who's making the request, or if it doesn't have the assigned role, it will deny the request as unauthorized.

   For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

5. In the **Select** field, enter the security principal for your MedTech service.  

    `<your workspace name>/iotconnectors/<your MedTech service name>`

6. Select **Save**.

   ![Screenshot of FHIR service added role assignment message.](media/iot-deploy-manual-in-portal/fhir-service-added-role-assignment.png#lightbox)

   For more information about assigning roles to the FHIR service, see [Configure Azure Role-based Access Control (RBAC)](.././configure-azure-rbac.md).

## Next steps

In this article, you've learned how to deploy a MedTech service in the Azure portal. To learn more about the device and FHIR destination mapping files for the MedTech service, see

>[!div class="nextstepaction"]
>[How to use Device mappings](how-to-use-device-mappings.md)
>
>[How to use FHIR destination mappings](how-to-use-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
