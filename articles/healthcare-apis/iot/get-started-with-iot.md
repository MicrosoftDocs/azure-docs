---
title: Get started with the MedTech service in Azure Health Data Services
description: This document describes how to get started with the MedTech service in Azure Health Data Services.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 07/12/2022
ms.author: v-smcevoy
ms.custom: mode-api
---

# Get started with MedTech service in Azure Health Data Services

This article outlines the basic steps to get started with MedTech service in [Azure Health Data Services](../healthcare-apis-overview.md). MedTech service processes data that has been sent to an Event Hubs from a medical device, then MedTech service saves the data to the Fast Healthcare Interoperability Resources (FHIR&#174;) service as observation resources. This process makes it possible to link the FHIR service observation to patient and device resources.

The following diagram shows the four development steps of the data flow needed to get MedTech service to receive data from a device and send it to FHIR service.

- Step 1 introduces the subscription and permissions prerequisites needed.

- Step 2 shows how Azure services are provisioned for MedTech services.

- Step 3 represents the flow of sending data from devices to Event Hubs and MedTech service.

- Step 4 demonstrates the path of verifying data sent to FHIR service.  

[![MedTech service data flow diagram.](media/get-started-with-iot.png)](media/get-started-with-iot.png#lightbox)

Follow these four steps and you'll be able to deploy MedTech service effectively:

## Step 1: Prerequisites for using Azure Health Data Services

Before you can begin sending data from a device, you need to determine if you have the appropriate Azure subscription and Azure RBAC (Role-Based Access Control) roles. If you already have the appropriate subscription and roles, you can skip this step.

- If you don't have an Azure subscription, see [Subscription decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/)

- You must have the appropriate RBAC roles for the subscription resources you want to use. The roles required for a user to complete the provisioning would be Contributor AND User Access Administrator OR Owner. The Contributor role allows the user to provision resources, and the User Access Administrator role allows the user to grant access so resources can send data between them. The Owner role can perform both. For more information, see [Azure role-based access control](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/considerations/roles).

## Step 2: Provisioning services and obtaining permissions

After obtaining the required prerequisites, you must create a workspace and provision instances of MedTech service, FHIR service, and Event Hubs service. You must also give Event Hubs permission to read data from your device and give MedTech service permission to read and write to FHIR service.

### Creating a workspace

You must first create a resource group to contain the deployed instances of workspace, FHIR service, MedTech service, and Event Hubs service. Resources can't be deployed directly to your Azure Subscription, and a [workspace](../workspace-overview.md) is required as a container for Azure Health Data Services. After you create a workspace from the [Azure portal](../healthcare-apis-quickstart.md), deploy MedTech service and FHIR service to the workspace. Event Hubs service instances are provisioned in a namespace that is associated with a resource.

> [!NOTE]
> There are limits to the number of workspaces and the number of MedTech service instances you can create in each Azure subscription. For more information, see [IoT Connector FAQs](iot-connector-faqs.md).

### Provision a MedTech service instance in the workspace

The provisioning process can be done in any order, but you need to create a workspace first.

You must provision a MedTech service instance from the [Azure portal](deploy-iot-connector-in-azure.md) in your workspace. You can make the provisioning process easier and more efficient by automating everything with Azure PowerShell, Azure CLI, or Azure REST API. You can find automation scripts at the [Azure Health Data Services samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts) website.

### Provision an Event Hubs service instance to a namespace

In order to provision an Event Hubs service, an Event Hubs namespace must first be provisioned, because Event Hubs namespaces are logical containers for Event Hubs. The Event Hubs service and Event Hubs namespace need to be provisioned in the same Azure subscription. See [Event Hubs](../../event-hubs/event-hubs-create.md) for more information.

Once Event Hubs is provisioned, you must give permission to Event Hubs to read data from the device. Then, MedTech service can retrieve data from the Event Hubs using a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md). This managed identity is assigned an Azure Event Hubs data receiver role. For more information on how to assign the managed-identity role to MedTech service from Event Hubs, see [Granting MedTech service access](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-the-medtech-service-access).

### Provision a FHIR service instance to the same workspace

You must provision a [FHIR service](../fhir/fhir-portal-quickstart.md) instance in your workspace. MedTech service persists the data to FHIR service store using the system-managed identity. See details on how to assign the role to MedTech service from [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

Once FHIR service is provisioned, you must give MedTech service permission to read and write to FHIR service. This permission enables the data to be persisted in the FHIR service store using the system-managed identity. See details on how to assign the role to MedTech service from [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-medtech-service-from-the-fhir-service).

## Step 3: Sending the data

When the relevant services are instanced and provisioned, you can send event data from the device to MedTech service using Event Hubs. The event data is routed in the following manner:

- Data is sent from your device to Event Hubs.

- After the data is received by Event Hubs, MedTech service will be able to read the data. However, before you send the data on to FHIR, it's a good practice to use data mapping to verify the information.

## Step 4: Verifying the data

You can verify that the data is correct by using data mapping. If the data matches the customer-supplied mapping, it will become an observable resource in FHIR service. If the data doesn't match or isn't authored properly, then the data is skipped and an error is generated.

### Metrics

You can use Metrics to determine whether the data followed correct device mappings and successfully went to FHIR service. Metrics can also be used to display errors in the data flow, enabling you to troubleshoot your MedTech service instance.

## Summary

When you've successfully finished all these steps, your MedTech service instance is now able to take device-generated data and use it to create [observable resources](https://www.hl7.org/fhir//observations.html) in FHIR service.

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and used with their permission.

## Next steps

This article only described the basic steps needed to get started using MedTech service. For information about deploying MedTech service in the workspace, see

>[!div class="nextstepaction"]
>[Deploy MedTech service in the Azure portal](deploy-iot-connector-in-azure.md)
