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

This article outlines the basic steps to get started with the MedTech service in [Azure Health Data Services](../healthcare-apis-overview.md). The MedTech service enables you to receive data from a device, such as a smart watch, medical monitor, or patient record. You can then convert the data to a FHIR service format for analysis by a medical team.

Before you can get started, you'll need an valid Azure subscription. You will also need permission to create and deploy Azure resources. You can skip these steps if you already have the appropriate permissions for the relevant resources.

The following diagram shows the four key procedures of how to set up the MedTech service to receive data from a device and send it to the FHIR service:

[![MedTech service data flow diagram.](media/get-started-with-iot.png)](media/get-started-with-iot.png#lightbox)

## Key procedures needed to create a MedTech application

Follow these procedures and you'll be able to create an effective MedTech application:

### Prepare your Azure Health Data Services application

Before you can begin sending data from a device, you must follow these steps:

#### Get Azure account and permissions

First, you must have a valid Azure account and permission to access Azure services.

#### Create a workspace in your Azure subscription

You must create a [workspace](../workspace-overview.md) as a logical container for your relevant resources and services of MedTech service, FHIR service, and Event Hubs. Create your workspace from the [Azure portal](../healthcare-apis-quickstart.md). 

> [!NOTE]
> There are limits to the number of workspaces and the number of MedTech service instances you can create in each Azure subscription. For more information, see [IoT Connector FAQs](iot-connector-faqs.md).

#### Set up your device

You'll need to follow the device instructions for transmitting data over a network.

### Provision service instances

Next you must provision a MedTech service instance, an Event Hubs service instance, and a FHIR service instance. All services must be contained in the same workspace.

#### Provision a MedTech service instance in the same workspace

You must provision a MedTech service instance from the [Azure portal](deploy-iot-connector-in-azure.md) in your workspace.

You can make the provisioning process easier and more efficient by automating everything with Azure PowerShell, Azure CLI, or Azure REST API. You can find automation scripts at the [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts) website.

#### Provision an Event Hubs service instance to your workspace

You must provision an [Event Hubs](../../event-hubs/event-hubs-create.md) service instance in your workspace.

Once Event Hubs is provisioned, you must give permission to the Event Hubs to read data from the device. The MedTech service retrieves data from the Event Hubs using a system-managed identity. For more information on how to assign the managed-identity role to the MedTech service from Event Hubs, see [Granting MedTech service access](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-the-medtech-service-access).

#### Provision a FHIR service instance to the same workspace

You must provision a [FHIR service](../fhir/fhir-portal-quickstart.md) instance in your workspace.

The MedTech service persists the data to the FHIR store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

Once the FHIR service is provisioned, you must give MedTech permission to read and write to the FHIR service. This permission enables the data to be persisted in FHIR store using the system-managed identity. See details on how to assign the role to the MedTech service from the [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

### Process the data

When the relevant services are instanced and provisioned, you can send the event data from the device to MedTech through the Event Hubs. The process is:

#### Send data from your device to Event Hubs

Because you've already configured your device, you're now ready to send the event data to Event Hubs for asynchronous routing.

#### Sending data from the Event Hubs to the MedTech service

Now that the event data is parked at Event Hubs, MedTech service can read that data.

#### Checking the data against customer data mappings

Before you send the event data to FHIR, you'll probably want to verify the data.

### Verifying the data

Before the data can be handed off to FHIR, it must be verified and routed to its final destination using data mapping. The process is:

#### Data matches the customer data mappings

If the data matches the customer-supplied mapping, it will be become an observable resource in FHIR.

#### Data doesn't match the customer data mappings

If the data doesn't match or isn't authored properly, then the data is skipped and an error be generated.

### Using Metrics

You can use Metrics to determine whether the data followed correct device mappings and successfully went to FHIR. Metrics can also be used to display errors in the data flow, enabling you to troubleshoot your application.

#### Application complete

When you've successfully finished all of these procedures, your application is now reading device-generated data and creating [observable resources](https://www.hl7.org/fhir//observations.html) in FHIR.

## Next steps

This article described the basic steps to get started using the MedTech service. For information about deploying the MedTech service in the workspace, see

>[!div class="nextstepaction"]
>[Deploy MedTech service in the Azure portal](deploy-iot-connector-in-azure.md)
