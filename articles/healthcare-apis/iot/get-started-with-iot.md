---
title: Get started with the MedTech service in Azure Health Data Services
description: This document describes how to get started with the MedTech service in Azure Health Data Services.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 07/01/2022
ms.author: v-smcevoy
ms.custom: mode-api
---

# Get started with the MedTech service in Azure Health Data Services

This article outlines the basic steps to get started with the MedTech service in [Azure Health Data Services](../healthcare-apis-overview.md).  The MedTech service processes device data and saves it to the FHIR service as observation resources, linking the observation to patient and device resources.

Before you can get started, you'll need a valid Azure subscription. You will also need permission to deploy Azure resources. You can skip these steps if you already have the appropriate Azure RBAC (Role-Based Access Control) roles, for example, Contributor role or Owner role allows you to deploy or delete resources in the subscription.

The following diagram shows the four key steps of how to set up the MedTech service to receive data from a device and send it to the FHIR service:

[![MedTech service data flow diagram.](media/get-started-with-iot.png)](media/get-started-with-iot.png#lightbox)

## Key steps needed to use the MedTech service

Follow these steps and you'll be able to deploy an effective MedTech service instance:

### Step 1: Configure prerequisites for using Azure Health Data Services

Before you can begin sending data from a device, you must follow these steps:

#### Use the appropriate Azure subscription and related roles

These are the two main prerequisites needed:

* You must have a valid Azure subscription.

* You must have the appropriate RBAC roles for the subscription resources you want to use. The roles required for a user to complete the provisioning would be Contributor AND User Access Administrator OR Owner. The Contributor role allows the user to provision resources, and the User Access Administrator role allows the user to grant access so resources can send data between them. The Owner role can perform both.

### Step 2: Provisioning service instances

After configuring the prerequisites, you must then do the following:

* Create a workspace.

* Provision a MedTech service instance and a FHIR service instance in a workspace. Event Hubs service instances are provisioned not in a workspace, but in a namespace that is associated with a resource.

#### Create a resource group and workspace in your Azure subscription

You must first create a resource group to contain the deployed instances of workspace, FHIR service, MedTech service, and Event Hub. Resources cannot be deployed directly to your Azure Subscription.

A [workspace](../workspace-overview.md) is required as a container for Azure Health Data Services. Create your workspace from the [Azure portal](../healthcare-apis-quickstart.md).

MedTech service and FHIR service are deployed to a workspace, but Event Hubs instances are deployed to a resource group.

> [!NOTE]
> There are limits to the number of workspaces and the number of MedTech service instances you can create in each Azure subscription. For more information, see [IoT Connector FAQs](iot-connector-faqs.md).

#### Provision a MedTech service instance in the same workspace

You must provision a MedTech service instance from the [Azure portal](deploy-iot-connector-in-azure.md) in your workspace.

You can make the provisioning process easier and more efficient by automating everything with Azure PowerShell, Azure CLI, or Azure REST API. You can find automation scripts at the [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts) website.

#### Provision an Event Hubs service instance to a namespace

In order to provision an Event Hub, an Event Hubs namespace must first be provisioned. Event Hubs namespaces are a logical container for Event Hubs.See [Event Hubs](../../event-hubs/event-hubs-create.md) for more information.

> [!NOTE]
> Event Hubs cannot be provisioned in a workspace, but must be provisioned in a resource group. However, the Event Hub and Event Hubs namespace need to be provisioned in the same Azure subscription.

Once Event Hubs is provisioned, you must give permission to the Event Hubs to read data from the device. The MedTech service retrieves data from the Event Hubs using a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md). This managed identity is assigned an Azure Event Hubs data receiver role.For more information on how to assign the managed-identity role to the MedTech service from Event Hubs, see [Granting MedTech service access](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-the-medtech-service-access).

#### Provision a FHIR service instance to the same workspace

You must provision a [FHIR service](../fhir/fhir-portal-quickstart.md) instance in your workspace.

The MedTech service persists the data to the FHIR store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

Once the FHIR service is provisioned, you must give MedTech permission to read and write to the FHIR service. This permission enables the data to be persisted in FHIR store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

### Step 3: Sending the data

When the relevant services are instanced and provisioned, you can send the event data from the device to MedTech through the Event Hubs. The process is:

#### Send data from your device to Event Hubs

Because you've already configured your device, you're now ready to send the event data to Event Hubs for asynchronous routing.

#### Sending data from the Event Hubs to the MedTech service

Now that the event data is parked at Event Hubs, MedTech service can read that data.

#### Checking the data against customer data mappings

Before you send the event data to FHIR, you'll probably want to verify the data.

### Step 4: Verifying the data

Before the data can be handed off to FHIR, it must be verified and routed to its final destination using data mapping. The process is:

#### Data matches the customer data mappings

If the data matches the customer-supplied mapping, it will be become an observable resource in FHIR.

#### Data doesn't match the customer data mappings

If the data doesn't match or isn't authored properly, then the data is skipped and an error be generated.

#### Using Metrics

You can use Metrics to determine whether the data followed correct device mappings and successfully went to FHIR. Metrics can also be used to display errors in the data flow, enabling you to troubleshoot your MedTech service instance.

#### All steps complete

When you've successfully finished all of these steps, your MedTech service instance is now reading device-generated data and creating [observable resources](https://www.hl7.org/fhir//observations.html) in FHIR.

## Next steps

This article described the basic steps to get started using the MedTech service. For information about deploying the MedTech service in the workspace, see

>[!div class="nextstepaction"]
>[Deploy MedTech service in the Azure portal](deploy-iot-connector-in-azure.md)
