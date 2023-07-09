---
title: Deploy the MedTech service using the Azure portal - Azure Health Data Services
description: Learn how to deploy the MedTech service using the Azure portal.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 07/06/2023
ms.author: jasteppe
---

# Quickstart: Deploy the MedTech service using the Azure portal

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this quickstart, learn how to deploy the MedTech service and required resources using the Azure portal.

The MedTech service deployment using the Azure portal is divided into the following three sections:

* [Deploy prerequisite resources](#deploy-prerequisite-resources)
* [Configure and deploy the MedTech service](#configure-and-deploy-the-medtech-service)
* [Post-deployment](#post-deployment)

As a prerequisite, you need an Azure subscription and have been granted the proper permissions to deploy Azure resource groups and resources. You can follow all the steps, or skip some if you have an existing environment. Also, you can combine all the steps and complete them in Azure PowerShell, Azure CLI, and REST API scripts.

:::image type="content" source="media/deploy-manual-portal/get-started-with-medtech-service.png" alt-text="Diagram showing the MedTech service deployment overview." lightbox="media/deploy-manual-portal/get-started-with-medtech-service.png":::

> [!TIP]
> See the MedTech service article, [Choose a deployment method for the MedTech service](deploy-choose-method.md), for a description of the different deployment methods that can help to simply and automate the deployment of the MedTech service. 

## Deploy prerequisite resources

The first step is to deploy the MedTech service prerequisite resources:

* Azure resource group
* Azure Event Hubs namespace and event hub
* Azure Health Data services workspace
* Azure Health Data Services FHIR service

Once the prerequisite resources are available, deploy:
 
* Azure Health Data Services MedTech service

### Deploy a resource group 

Deploy a [resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md) to contain the prerequisite resources and the MedTech service.

### Deploy an Event Hubs namespace and event hub

Deploy an Event Hubs namespace into the resource group. Event Hubs namespaces are logical containers for event hubs. Once the namespace is deployed, you can deploy an event hub, which the MedTech service reads from. For information about deploying Event Hubs namespaces and event hubs, see [Create an event hub using Azure portal](../../event-hubs/event-hubs-create.md).

### Deploy a workspace

Deploy a [workspace](../workspace-overview.md) into the resource group. After you create a workspace using the [Azure portal](../healthcare-apis-quickstart.md), a FHIR service and MedTech service can be deployed from the workspace.

### Deploy a FHIR service

Deploy a [FHIR service](../fhir/fhir-portal-quickstart.md) into your resource group using your workspace. The MedTech service persists transformed device data into the FHIR service. 

## Configure and deploy the MedTech service

If you have successfully deployed the prerequisite resources, you're now ready to deploy the MedTech service.

Before you can deploy the MedTech service, you must complete the following steps:

### Set up the MedTech service configuration

Start with these three steps to begin configuring the MedTech service:

1. Start by going to your Azure Health Data services workspace and select the **Create MedTech service** box.

2. This step takes you to the **Add MedTech service** button. Select the button.

3. This step takes you to the **Create MedTech service** page. This page has five tabs you need to fill out:

* Basics
* Device mapping
* Destination mapping
* Tags (Optional)
* Review + create

### Configure the Basics tab

Follow these four steps to fill in the **Basics** tab configuration:

1. Enter the **MedTech service name**.

   The **MedTech service name** is a friendly, unique name for your MedTech service. For this example, we have named the MedTech service *mt-azuredocsdemo*.

2. Select the **Event Hubs Namespace**.

   The **Event Hubs Namespace** is the name of the *Event Hubs namespace* that you previously deployed. For this example, we're using the name *eh-azuredocsdemo*.

3. Select the **Events Hubs name**.

   The **Event Hubs name** is the name of the event hub that you previously deployed within the Event Hubs Namespace. For this example, we're using the name *devicedata*.  

4. Select the **Consumer group**.

   By default, a consumer group named *$Default* is created during the deployment of an event hub. Use this consumer group for your MedTech service deployment.

   > [!IMPORTANT]
   > If you're going to allow access from multiple services to the event hub, it is highly recommended that each service has its own event hub consumer group.
   >
   > Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
   >
   > Examples:
   >
   > * Two MedTech services accessing the same event hub.
   >
   > * A MedTech service and a storage writer application accessing the same event hub.

The **Basics** tab should now look something like this after you've filled it out:

:::image type="content" source="media\deploy-manual-portal\completed-basics-tab.png" alt-text="Screenshot of Basics tab filled out correctly." lightbox="media\deploy-manual-portal\completed-basics-tab.png":::

### Configure the Device mapping tab

For the purposes of this quickstart, accept the default **Device mapping** and move to the **Destination** tab. The device mapping is addressed in the [Post-deployment](#post-deployment) section of this quickstart.

### Configure the Destination tab

Under the **Destination** tab, use these values to enter the destination properties for your MedTech service instance:

* First, select the name of your **FHIR server**.

* Next, enter the **Destination name**.

  The **Destination name** is a friendly name for the destination. Enter a unique name for your destination. In this example, the **Destination name** name is
  *fs-azuredocsdemo*.

* Next, select the **Resolution type**.

   **Resolution type** specifies how the MedTech service associates device data with Device resources and Patient resources. The MedTech service reads Device and Patient resources from the FHIR service using [device identifiers](https://www.hl7.org/fhir/r4/device-definitions.html#Device.identifier) and [patient identifiers](https://www.hl7.org/fhir/r4/patient-definitions.html#Patient.identifier). If an [encounter identifier](https://hl7.org/fhir/r4/encounter-definitions.html#Encounter.identifier) is specified and extracted from the device data payload, it's linked to the observation if an encounter exists on the FHIR service with that identifier.  If the [encounter identifier](../../healthcare-apis/release-notes.md#medtech-service) is successfully normalized, but no FHIR Encounter exists with that encounter identifier, a **FhirResourceNotFound** exception is thrown.

  Device and Patient resources can be resolved by choosing a **Resolution type** of **Create** and **Lookup**:

  - **Create**

    If **Create** was selected, and Device or Patient resources are missing when the MedTech service is reading the device data, new resources are created using the identifiers included in the device data.

  - **Lookup**
  
    If **Lookup** was selected, and Device or Patient resources are missing, an error occurs, and the device data isn't processed. A **DeviceNotFoundException** and/or a **PatientNotFoundException** error is generated, depending on the type of resource not found.

 * For the **Destination mapping** field, accept the default **Destination mapping**. The FHIR destination mapping is addressed in the [Post-deployment](#post-deployment) section of this quickstart.


The **Destination** tab should now look something like this after you've filled it out:

:::image type="content" source="media\deploy-manual-portal\completed-destination-tab.png" alt-text="Screenshot of Destination tab filled out correctly." lightbox="media\deploy-manual-portal\completed-destination-tab.png":::

### Configure the Tags tab (Optional)

Before you complete your configuration in the **Review + create** tab, you may want to configure tags. You can do this step by selecting the **Next: Tags >** tab.

Tags are name and value pairs used for categorizing resources and are an optional step. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

### Validate your deployment

To begin the validation process of your MedTech service deployment, select the **Review + create** tab. There's a short delay and then you should see a screen that displays a **Validation success** message.

Your validation screen should look something like this:

:::image type="content" source="media\deploy-manual-portal\validate-and-review-tab.png" alt-text="Screenshot of validation success with details displayed." lightbox="media\deploy-manual-portal\validate-and-review-tab.png":::

If your deployment didn't validate, review the validation failure message(s), and troubleshoot the issue(s). Check all properties under each MedTech service tab that you've configured and then try the validation process again.

### Create deployment

1. Select the **Create** button to begin the deployment.

2. The deployment process may take several minutes. The screen displays a message saying that your deployment is in progress.

3. When Azure has finishes deploying, a "Your Deployment is complete" message appears and also displays the following information:

* Deployment name
* Subscription
* Resource group
* Deployment details

Your screen should look something like this:

:::image type="content" source="media\deploy-manual-portal\created-medtech-service.png" alt-text="Screenshot of the MedTech service deployment completion." lightbox="media\deploy-manual-portal\created-medtech-service.png":::

## Post-deployment

### Grant resource access to the MedTech service system-managed identity

There are two post-deployment access steps you must perform or the MedTech service can't read data from the event hub or write data to the FHIR service.

These steps are:

* Grant the MedTech service system-managed identity **Azure Event Hubs Data Receiver** access to the [event hub](../../event-hubs/authorize-access-azure-active-directory.md).
* Grant the MedTech service system-managed identity **FHIR Data Writer** access to the [FHIR service](../configure-azure-rbac.md).

These two steps are needed because MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and access control of your Azure resources.

### Provide device and FHIR destination mappings 

Valid and conforming device and FHIR destination mappings have to be provided to your MedTech service for it to be fully functional. For an overview and sample device and FHIR destination mappings, see:

* [Overview of the MedTech service device mapping](overview-of-device-mapping.md).

* [Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md).

> [!TIP]
> You can use the MedTech service [Mapping debugger](how-to-use-mapping-debugger.md) for assistance creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. The Mapping debugger enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. The Mapping debugger can also be used for uploading test device messages to see how they'll look after being processed into normalized messages and transformed into FHIR Observations.

## Next steps

In this article, you learned how to deploy the MedTech service and required resources using the Azure portal.  

To learn about other methods of deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

For an overview of the MedTech service device data processing stages, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

For frequently asked questions (FAQs) about the MedTech service, see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)
