---
title: Get started with the MedTech service in Azure Health Data Services
description: This document describes how to get you started with the MedTech service in Azure Health Data Services.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/19/2022
ms.author: jasteppe
ms.custom: mode-api
---

# Get started with the MedTech service in the Azure Health Data Services

This article will show you how to get started with the Azure MedTech service in the [Azure Health Data Services](../healthcare-apis-overview.md). There are six steps you need to follow to be able to deploy and process MedTech service to ingest health data from a medical device using Azure Event Hubs service, persist the data to Azure Fast Healthcare Interoperability Resources (FHIR&#174;) service as Observation resources, and link FHIR service Observations to patient and device resources. This article provides an architecture overview to help you follow the six steps of the implementation process.

## Architecture overview of MedTech service

The following diagram outlines the basic architectural path that enables the MedTech service to receive data from a medical device and send it to the FHIR service. This diagram shows how the six-step implementation process is divided into three key development stages: deployment, post-deployment, and data processing.

:::image type="content" source="media/iot-get-started/get-started-with-iot.png" alt-text="Diagram showing MedTech service architectural overview." lightbox="media/iot-get-started/get-started-with-iot.png":::

### Deployment

- Step 1 introduces the subscription and permissions prerequisites required.

- Step 2 shows how Azure services are provisioned for MedTech services.

- Step 3 presents the configuration process.

### Post-deployment

- Step 4 outlines how to connect to other services.

### Data processing

- Step 5 represents the data flow from a device to an event hub and the way it's processed through the five parts of the MedTech service.

- Step 6 demonstrates the path to verify processed data sent from MedTech service to the FHIR service.

## Get started implementing MedTech service

Follow these six steps to set up and start using MedTech service.

## Step 1: Prerequisites for deployment

In order to begin deployment, you need to determine if you have: an Azure subscription and correct Azure RBAC (Role-Based Access Control) role assignments. If you already have the appropriate subscription and roles, you can skip this step.

- If you don't have an Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

- You must have the appropriate RBAC roles for the subscription resources you want to use. The roles required for a user to complete the provisioning would be Contributor AND User Access Administrator OR Owner. The Contributor role allows the user to provision resources, and the User Access Administrator role allows the user to grant access so resources can send data between them. The Owner role can perform both. For more information, see [Azure role-based access control (RBAC)](/azure/cloud-adoption-framework/ready/considerations/roles).

## Step 2: Provision services for deployment

After you obtain the required prerequisites, the next phase of deployment is to create a workspace and provision instances of the Event Hubs service, FHIR service, and MedTech service. You must also give the Event Hubs permission to read data from your device and give the MedTech service permission to read and write to the FHIR service. There are four parts of this provisioning process.

### Create a resource group and workspace

You must first create a resource group to contain the deployed instances of a workspace, Event Hubs service, FHIR service, and MedTech service. A [workspace](../workspace-overview.md) is required as a container for the Azure Health Data Services. After you create a workspace from the [Azure portal](../healthcare-apis-quickstart.md), a FHIR service and MedTech service can be deployed to the workspace.

> [!NOTE]
> There are limits to the number of workspaces and the number of MedTech service instances you can create in each Azure subscription. For more information, see [MedTech service FAQs](iot-connector-faqs.md).

### Provision an Event Hubs instance to a namespace

In order to provision an Event Hubs service, an Event Hubs namespace must first be provisioned, because Event Hubs namespaces are logical containers for event hubs. Namespace must be associated with a resource. The event hub and namespace need to be provisioned in the same Azure subscription. For more information, see [Event Hubs](../../event-hubs/event-hubs-create.md).

Once an event hub is provisioned, you must give permission to the event hub to read data from the device. Then, MedTech service can retrieve data from the event hub using a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md). This system-assigned managed identity is assigned the **Azure Event Hubs Data Receiver** role. For more information on how to assign access to the MedTech service from an Event Hubs service instance, see [Granting access to the device message event hub](deploy-iot-connector-in-azure.md#granting-access-to-the-device-message-event-hub).

### Provision a FHIR service instance to the same workspace

You must provision a [FHIR service](../fhir/fhir-portal-quickstart.md) instance in your workspace. The MedTech service persists the data to FHIR service store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](deploy-iot-connector-in-azure.md#granting-access-to-the-fhir-service).

Once the FHIR service is provisioned, you must give the MedTech service permission to read and write to FHIR service. This permission enables the data to be persisted in the FHIR service store using system-assigned managed identity. See details on how to assign the **FHIR Data Writer** role to the MedTech service from the [FHIR service](deploy-iot-connector-in-azure.md#granting-access-to-the-fhir-service).

By design, the MedTech service retrieves data from the specified event hub using the system-assigned managed identity. For more information on how to assign the role to the MedTech service from [Event Hubs](deploy-iot-connector-in-azure.md#granting-access-to-the-device-message-event-hub).

### Provision a MedTech service instance in the workspace

You must provision a MedTech service instance from the [Azure portal](deploy-iot-connector-in-azure.md) in your workspace. You can make the provisioning process easier and more efficient by automating everything with Azure PowerShell, Azure CLI, or Azure REST API. You can find automation scripts at the [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts) website.

The MedTech service persists the data to the FHIR store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](deploy-iot-connector-in-azure.md#granting-access-to-the-fhir-service).

## Step 3: Configure MedTech for deployment

After you've fulfilled the prerequisites and provisioned your services, the next phase of deployment is to configure MedTech services to ingest data, set up device mappings, and set up destination mappings. These configuration settings will ensure that the data can be translated from your device to Observations in the FHIR service. There are four parts in this configuration process.

### Configuring MedTech service to ingest data

MedTech service must be configured to ingest data it will receive from an event hub. First you must begin the official deployment process at the Azure portal. For more information about deploying MedTech service using the Azure portal, see [Overview of how to manually deploy the MedTech service using the Azure portal](deploy-03-new-manual.md) and [Prerequisites for manually deploying the MedTech service using the Azure portal](deploy-03-new-manual.md).

Once you have starting using the portal and added MedTech service to your workspace, you must then configure MedTech service to ingest data from an event hub. For more information about configuring MedTech service to ingest data, see [Configure the MedTech service to ingest data](deploy-05-new-config.md).

### Configuring device mappings

You must configure MedTech to map it to the device you want to receive data from. Each device has unique settings that MedTech service must use. For more information on how to use Device mappings, see [How to use Device mappings](how-to-use-device-mappings.md).

- Azure Health Data Services provides an open source tool you can use called [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/main/tools/data-mapper). The IoMT Connector Data Mapper will help you map your device's data structure to a form that MedTech can use. For more information on device content mapping, see [Device Content Mapping](https://github.com/microsoft/iomt-fhir/blob/main/docs/Configuration.md#device-content-mapping). 

- When you're deploying MedTech service, you must set specific device mapping properties. For more information on device mapping properties, see [Configure the Device mapping properties](deploy-05-new-config.md).

### Configuring destination mappings

Once your device's data is properly mapped to your device's data format, you must then map it to an Observation in the FHIR service. For an overview of FHIR destination mappings, see [How to use the FHIR destination mappings](how-to-use-fhir-mappings.md).

For step-by-step destination property mapping, see [Configure destination properties](deploy-05-new-config.md).

### Create and deploy the MedTech service

If you've completed the prerequisites, provisioning, and configuration, you're now ready to deploy the MedTech service. Create and deploy your MedTech service by following the procedures at [Create your MedTech service](deploy-06-new-deploy.md).

## Step 4: Connect to required services (post deployment)

When you complete the final [deployment procedure](deploy-06-new-deploy.md) and don't get any errors, you must link MedTech service to an Event Hubs and the FHIR service. This will enable a connection from MedTech service to an Event Hubs instance and the FHIR service, so that data can flow smoothly from device to FHIR Observation. In order to do this, the Event Hubs instance for device message flow must be granted access via role assignment, so MedTech service can receive Event Hubs data. You must also grant access to The FHIR service via role assignments in order for MedTech to receive the data. There are two parts of the process to connect to required services.

For more information about granting access via role assignments, see [Granting the MedTech service access to the device message event hub and FHIR service](deploy-06-new-deploy.md#manual-post-deployment-requirements).

### Granting access to the device message event hub

The Event Hubs instance for device message event hub must be granted access using managed identity in order for the MedTech service to receive data sent to the event hub from a device. The step-by-step procedure for doing this is at [Granting access to the device message event hub](deploy-iot-connector-in-azure.md#granting-access-to-the-device-message-event-hub).

For more information about authorizing access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).

For more information about application roles, see [Authentication and Authorization for Azure Health Data Services](../authentication-authorization.md).

### Granting access to FHIR service

You must also grant access via role assignments to the FHIR service. This will enable FHIR service to receive data from the MedTech service by granting access using managed identity. The step-by-step procedure for doing this is at [Granting access to the FHIR service](deploy-iot-connector-in-azure.md#granting-access-to-the-fhir-service).

For more information about assigning roles to the FHIR services, see [Configure Azure RBAC role for Azure Health Data Services](../configure-azure-rbac.md).

For more information about application roles, see [Authentication and Authorization for Azure Health Data Services](../authentication-authorization.md).

## Step 5: Send the data for processing

When MedTech service is deployed and connected to the Event Hubs and FHIR services, it's ready to process data from a device and translate it into a FHIR service Observation. There are three parts of the sending process.

### Data sent from Device to Event Hubs

The data is sent to an Event Hubs instance so that it can wait until MedTech service is ready to receive it. The data transfer needs to be asynchronous because it's sent over the Internet and delivery times can't be precisely measured. Normally the data won't sit on an event hub longer than 24 hours.

For more information about Event Hubs, see [Event Hubs](../../event-hubs/event-hubs-about.md).

For more information on Event Hubs data retention, see [Event Hubs quotas](../../event-hubs/event-hubs-quotas.md)

### Data Sent from Event Hubs to MedTech

MedTech requests the data from the Event Hubs instance and the data is sent from the event hub to MedTech. This procedure is called ingestion.

### MedTech processes the data

MedTech processes the data in five steps: 

- Ingest
- Normalize
- Group
- Transform
- Persist

If the processing was successful and you didn't get any error messages, your device data is now a FHIR service [Observation](http://hl7.org/fhir/observation.html) resource.

For more information on the data flow through MedTech, see [MedTech service data flow](iot-data-flow.md).

## Step 6: Verify the processed data

You can verify that the data was processed correctly by checking to see if there's now a new Observation resource in the FHIR service. If the data isn't mapped or if the mapping isn't authored properly, the data will be skipped. If there are any problems, check the [device mapping](how-to-use-device-mappings.md) or the [FHIR destination mapping](how-to-use-fhir-mappings.md).

### Metrics

You can verify that the data is correctly persisted into the FHIR service by using the [MedTech service metrics](how-to-configure-metrics.md) in the Azure portal.

## Next steps

This article only described the basic steps needed to get started using MedTech service. For information about deploying MedTech service in the workspace, see

> [!div class="nextstepaction"]
> [Deploy the MedTech service in the Azure portal](deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
