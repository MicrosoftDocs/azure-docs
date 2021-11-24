---
title: Get started with the IoT connector - Azure Healthcare APIs
description: This document describes how to get started with the IoT connector in Azure Healthcare APIs.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 11/24/2021
ms.author: zxue
---

# Get Started with the IOT connector

This article outlines the basic steps to get started with the IoT connector in [Azure Healthcare APIs](../healthcare-apis-overview.md). 

As a prerequisite, you'll need an Azure subscription and have been granted proper permissions to create Azure resource groups and deploy Azure resources. You can follow all the steps, or skip some if you have an existing environment. Also, you can combine all the steps and complete them in PowerShell, Azure CLI, and REST API scripts.

[![Get Started with DICOM](media/get-started-with-iot.png)](media/get-started-with-iot.png#lightbox)

## Create a workspace in your Azure Subscription

You can create a workspace from the [Azure portal](../healthcare-apis-quickstart.md) or using PowerShell, Azure CLI and Rest API]. You can find scripts from the [Healthcare APIs samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts).

> [!NOTE]
> There are limits to the number of workspaces and the number of IoT connector instances you can create in each Azure subscription.

## Create the FHIR service and an Event Hub

The IoT connector works with the Azure Event Hub and the FHIR service. You can create a new [FHIR service](../fhir/get-started-with-fhir.md) or use an existing one in the same or different workspace. Similarly, you can create a new [Event Hub](../../event-hubs/event-hubs-create.md) or use an existing one.


## Create a IoT connector in the workspace

You can create a IoT connector from the [Azure portal](deploy-iot-connector-in-azure.md) or using PowerShell, Azure CLI, or REST API. You can find scripts from the [Healthcare APIs samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts).

Optionally, you can create a [FHIR service](../fhir/fhir-portal-quickstart.md) and [DICOM service](../dicom/deploy-dicom-services-in-azure.md) in the workspace.

## Assign roles to allow IoT to access Event Hub

By design, the IoT connector retrieves data from the specified Event Hub using the system-managed identity. For more information on how to assign the role to the IoT connector from [Event Hub](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-iot-connector-access).

## Assign roles to allow IoT to access FHIR service

The IoT connector persists the data to the FHIR store using the system-managed identity. See details on how to assign the role to the IoT connector from the [FHIR service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md#accessing-the-iot-connector-from-the-fhir-service).

## Sending data to the IoT connector

You can send data to the Event Hub, which is associated with the IoT connector. If you don't see any data in the FHIR store, check the mappings and role assignments for the IoT connector.

## IoT connector mappings, data flow, ML, Power BI, and Teams notifications

You can find more details on IoT connector mappings, data flow, machine-learning service, Power BI, and Teams notifications in the [IoT connector](iot-connector-overview.md) documentation.

## Next steps

This article described the basic steps to get started using the IoT connector. For information about deploying the IoT connector in the workspace, see

>[!div class="nextstepaction"]
>[Deploy IoT connector in the Azure portal](deploy-iot-connector-in-azure.md)