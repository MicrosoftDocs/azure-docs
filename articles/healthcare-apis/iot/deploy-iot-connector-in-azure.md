---
title: Deploy the MedTech service using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to deploy the MedTech service in the Azure portal using either a quickstart template or manual steps.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/02/2022
ms.author: jasteppe
ms.custom: mode-api
---

# Deploy the MedTech service using the Azure portal

In this quickstart, you'll learn how to deploy the MedTech service in the Azure portal using two different methods: with a [quickstart template](#deploy-the-medtech-service-with-a-quickstart-template) or [manually](#deploy-the-medtech-service-manually). The MedTech service will enable you to ingest data from Internet of Things (IoT) into your Fast Healthcare Interoperability Resources (FHIR&#174;) service.

> [!IMPORTANT]
>
> You'll want to confirm that the **Microsoft.HealthcareApis** and **Microsoft.EventHub** resource providers have been registered with your Azure subscription for a successful deployment. To learn more about registering resource providers, see [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types) 

## Deploy the MedTech service with a quickstart template

If you already have an active Azure account, you can use this [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.healthcareapis%2Fworkspaces%2Fiotconnectors%2Fazuredeploy.json) button to deploy a MedTech service that will include the following resources and roles:

 * An Azure Event Hubs Namespace and device message Azure event hub (the event hub is named: **devicedata**).
 * An Azure event hub consumer group (the consumer group is named: **$Default**).
 * An Azure event hub sender role (the sender role is named: **devicedatasender**).
 * An Azure Health Data Services workspace.
 * An Azure Health Data Services FHIR service.
 * An Azure Health Data Services MedTech service including the necessary [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) roles to the device message event hub (**Azure Events Hubs Receiver**) and FHIR service (**FHIR Data Writer**).

> [!TIP]
> 
> By using the drop down menus, you can find all the values that can be selected. You can also begin to type the value to begin the search for the resource, however, selecting the resource from the drop down menu will ensure that there are no typos.
>
> :::image type="content" source="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png" alt-text="Screenshot of Azure portal page displaying drop down menu example." lightbox="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png"::: 


1. When the Azure portal launches, the following fields must be filled out:

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png" alt-text="Screenshot of Azure portal page displaying deployment options for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-options.png"::: 

   * **Subscription** - Choose the Azure subscription you would like to use for the deployment.
   * **Resource Group** - Choose an existing Resource Group or create a new Resource Group.
   * **Region** - The Azure region of the Resource Group used for the deployment. This field will auto-fill based on the Resource Group region.
   * **Basename** - Will be used to append the name the Azure resources and services to be deployed.
   * **Location** - Use the drop-down list to select a supported Azure region for the Azure Health Data Services (could be the same or different region than your Resource Group). 

2. Leave the **Device Mapping** and **Destination Mapping** fields with their default values.

3. Select the **Review + create** button once the fields are filled out.

4. After the validation has passed, select the **Create** button to begin the deployment.

   :::image type="content" source="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png" alt-text="Screenshot of Azure portal page displaying validation box and Create button for the Azure Health Data Service MedTech service." lightbox="media\iot-deploy-quickstart-in-portal\iot-deploy-quickstart-create.png"::: 

5. After a successful deployment, there will be remaining configurations that will need to be completed by you for a fully functional MedTech service:
   * Provide a working device mapping. For more information, see [How to use device mappings](how-to-use-device-mappings.md).
   * Provide a working FHIR destination mapping. For more information, see [How to use FHIR destination mappings](how-to-use-fhir-mappings.md).
   * Use the Shared access policies (SAS) key (**devicedatasender**) for connecting your device or application to the MedTech service device message event hub (**devicedata**). For more information, see [Connection string for a specific event hub in a namespace](../../event-hubs/event-hubs-get-connection-string.md#connection-string-for-a-specific-event-hub-in-a-namespace).

   > [!IMPORTANT]
   >
   > If you're going to allow access from multiple services to the device message event hub, it is highly recommended that each service has  its own event hub consumer group. 
   >
   > Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups). 
   >
   > **Examples:** 
   > * Two MedTech services accessing the same device message event hub.
   > * A MedTech service and a storage writer application accessing the same device message event hub. 

## Deploy the MedTech service manually

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of creating a MedTech service instance in Azure Health Data Services:

* [Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Resource group deployed in the Azure portal](../../azure-resource-manager/management/manage-resource-groups-portal.md)
* [Azure Event Hubs namespace and event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in Azure Health Data Services](../fhir/fhir-portal-quickstart.md)

> [!TIP]
> 
> By using the drop down menus, you can find all the values that can be selected. You can also begin to type the value to begin the search for the resource, however, selecting the resource from the drop down menu will ensure that there are no typos.
>
> :::image type="content" source="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png" alt-text="Screenshot of Azure portal page displaying drop down menu example." lightbox="media\iot-deploy-quickstart-in-portal\display-drop-down-box.png"::: 
>

1. Sign into the [Azure portal](https://portal.azure.com), and then enter your Health Data Services workspace resource name in the **Search** bar field located at the middle top of your screen. The name of the workspace you'll be deploying into will be of your own choosing. For this example deployment of the MedTech service, we'll be using a workspace named `azuredocsdemo`. 
 
   :::image type="content" source="media\iot-deploy-manual-in-portal\find-workspace-in-portal.png" alt-text="Screenshot of Azure portal and entering the workspace that will be used for the MedTech service deployment." lightbox="media\iot-deploy-manual-in-portal\find-workspace-in-portal.png":::

2. Select the **Deploy MedTech service** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-deploy-medtech-service-button.png" alt-text="Screenshot of Azure Health Data Services workspace with a red box around the Deploy MedTech service button." lightbox="media\iot-deploy-manual-in-portal\select-deploy-medtech-service-button.png":::

3. Select the **Add MedTech service** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-add-medtech-service-button.png" alt-text="Screenshot of workspace and red box round the Add MedTech service button." lightbox="media\iot-deploy-manual-in-portal\select-add-medtech-service-button.png":::

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

## Create your MedTech service

1. Select the **Create** button to begin the deployment of your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\create-medtech-service.png" alt-text="Screenshot of a red box around the Create button for the MedTech service." lightbox="media\iot-deploy-manual-in-portal\create-medtech-service.png":::

2. The deployment status of your MedTech service will be displayed.

   :::image type="content" source="media\iot-deploy-manual-in-portal\deploy-medtech-service-status.png" alt-text="Screenshot of the MedTech service deployment status and a red box around deployment information." lightbox="media\iot-deploy-manual-in-portal\deploy-medtech-service-status.png":::

3. Once your MedTech service is successfully deployed, select the **Go to resource** button to be taken to your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\created-medtech-service.png" alt-text="Screenshot of the MedTech service deployment status and a red box around Go to resource button." lightbox="media\iot-deploy-manual-in-portal\created-medtech-service.png":::  

4. Now that your MedTech service has been deployed, we're going to walk through the steps of assigning access roles. Your MedTech service's system-assigned managed identity will require access to your device message event hub and your FHIR service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\display-medtech-service-configurations.png" alt-text="Screenshot of the MedTech service main configuration page." lightbox="media\iot-deploy-manual-in-portal\display-medtech-service-configurations.png":::

## Granting the MedTech service access to the device message event hub and FHIR service

To ensure that your MedTech service works properly, it's system-assigned managed identity must be granted access via role assignments to your device message event hub and FHIR service. 

### Granting access to the device message event hub

1. In the **Search** bar at the top center of the Azure portal, enter and select the name of your **Event Hubs Namespace** that was previously created for your MedTech service device messages.

   :::image type="content" source="media\iot-deploy-manual-in-portal\search-for-event-hubs-namespace.png" alt-text="Screenshot of the Azure portal search bar with red box around the search bar and Azure Event Hubs Namespace." lightbox="media\iot-deploy-manual-in-portal\search-for-event-hubs-namespace.png":::

2. Select the **Event Hubs** button under **Entities**.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-medtech-service-event-hubs-button.png" alt-text="Screenshot of the MedTech service Azure Event Hubs Namespace with red box around the Event Hubs button." lightbox="media\iot-deploy-manual-in-portal\select-medtech-service-event-hubs-button.png":::  
   
3. Select the event hub that will be used for your MedTech service device messages. For this example, the device message event hub is named `devicedata'. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-for-device-messages.png" alt-text="Screenshot of the device message event hub with red box around the Access control (IAM) button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-for-device-messages.png":::

4. Select the **Access control (IAM)** button.
   
   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-access-control-iam-button.png" alt-text="Screenshot of event hub landing page and a red box around the Access control (IAM) button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-access-control-iam-button.png":::    

5. Select the **Add role assignment** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-add-role-assignment-button.png" alt-text="Screenshot of the Access control (IAM) page and a red box around the Add role assignment button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-add-role-assignment-button.png":::
 
6. On the **Add role assignment** page, select the **View** button directly across from the **Azure Event Hubs Data Receiver** role.

   :::image type="content" source="media\iot-deploy-manual-in-portal\event-hub-add-role-assignment-available-roles.png" alt-text="Screenshot of the Access control (IAM) page and a red box around the Azure Event Hubs Data Receiver text and View button." lightbox="media\iot-deploy-manual-in-portal\event-hub-add-role-assignment-available-roles.png":::

   The Azure Event Hubs Data Receiver role allows the MedTech service that's being assigned this role to receive device message data from this event hub.

   > [!TIP]
   >
   > For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

7. Select the **Select role** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\event-hub-select-role-button.png" alt-text="Screenshot of the Azure Events Hubs Data Receiver role with a red box around the Select role button." lightbox="media\iot-deploy-manual-in-portal\event-hub-select-role-button.png":::

8. Select the **Next** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-roles-next-button.png" alt-text="Screenshot of the Azure Events Hubs Data Receiver role with a red box around the Next button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-roles-next-button.png":::

9. In the **Add role assignment** page, select **Managed identity** next to **Assign access to** and **+ Select members** next to **Members**. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hubs-managed-identity-and-members-buttons.png" alt-text="Screenshot of the Add role assignment page with a red box around the Managed identity and + Select members buttons." lightbox="media\iot-deploy-manual-in-portal\select-event-hubs-managed-identity-and-members-buttons.png"::: 

10. When the **Select managed identities** box opens, under the **Managed identity** box, select **MedTech service,** and find your MedTech service system-assigned managed identity under the **Select** box. Once the system-assigned managed identity for your MedTech service is found, select it, and then select the **Select** button.

    > [!TIP]
    >   
    > The system-assigned managed identify name for your MedTech service is a concatenation of the workspace name and the name of your MedTech service.
    >
    > **"your workspace name"/"your MedTech service name"** or **"your workspace name"/iotconnectors/"your MedTech service name"**
    >
    > For example:
    >
    > **azuredocsdemo/mt-azuredocsdemo** or **azuredocsdemo/iotconnectors/mt-azuredocsdemo**

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-medtech-service-mi-for-event-hub-access.png" alt-text="Screenshot of the Select managed identities page with a red box around the Managed identity drop-down box, the selected managed identity and the Select button." lightbox="media\iot-deploy-manual-in-portal\select-medtech-service-mi-for-event-hub-access.png":::

11. On the **Add role assignment** page, select the **Review + assign** button.

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-add.png" alt-text="Screenshot of the Add role assignment page with a red box around the Review + assign button." lightbox="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-add.png":::

12. On the **Add role assignment** confirmation page, select the **Review + assign** button.

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-confirmation.png" alt-text="Screenshot of the Add role assignment confirmation page with a red box around the Review + assign button." lightbox="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-confirmation.png":::

13. After the role assignment has been successfully added to the event hub, a notification will display on your screen with a green check mark. This notification indicates that your MedTech service can now read from your device message event hub.

    :::image type="content" source="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png" alt-text="Screenshot of the MedTech service system-assigned managed identity being successfully granted access to the event hub with a red box around the message." lightbox="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png":::

    > [!TIP]
    >
    > For more information about authorizing access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).  

### Granting access to the FHIR service

The steps for granting your MedTech service system-assigned managed identity access to your FHIR service are the same steps that you took to grant access to your device message event hub. The only exception will be that your MedTech service system-assigned managed identity will require **FHIR Data Writer** access versus **Azure Event Hubs Data Receiver**.

The **FHIR Data Writer** role provides read and write access to your FHIR service, which your MedTech service uses to access or persist data. Because the MedTech service is deployed as a separate resource, the FHIR service will receive requests from the MedTech service. If the FHIR service doesn’t know who's making the request, it will deny the request as unauthorized.

:::image type="content" source="media\iot-deploy-manual-in-portal\select-fhir-data-writer-for-medtech-service-access-to-fhir-service.png" alt-text="Screenshot of Add role assignment page for your FHIR service and a red box around the FHIR Data Reader role and View button." lightbox="media\iot-deploy-manual-in-portal\select-fhir-data-writer-for-medtech-service-access-to-fhir-service.png":::

> [!TIP]
>
> For more information about assigning roles to the FHIR service, see [Configure Azure Role-based Access Control (RBAC)](.././configure-azure-rbac.md)
>
> For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

## Next steps

In this article, you've learned how to deploy a MedTech service using the Azure portal. To learn more about how to troubleshoot your MedTech service or Frequently Asked Questions (FAQs) about the MedTech service, see

> [!div class="nextstepaction"]
>
> [Troubleshoot the MedTech service](iot-troubleshoot-guide.md)
>
> [Frequently asked questions (FAQs) about the MedTech service](iot-connector-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
