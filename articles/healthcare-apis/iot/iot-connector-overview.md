---
title: What is IoT connector? - Azure Healthcare APIs
description: In this article, you'll learn about IoT connector, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 12/1/2021
ms.author: jasteppe
---

# What is IoT connector?

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

IoT connector is an optional service of the Azure Healthcare APIs that provides the capability to ingest message data from Internet of Medical Things (IoMT) devices and wearables. 

IoT connector transforms device data into Fast Healthcare Interoperability Resources (FHIR&#174;)-based [Observation](https://www.hl7.org/fhir/observation.html) resources and then persists the transformed messages into the Azure Healthcare APIs [FHIR service](../fhir/overview.md).

Below is an overview of each step IoT connector does once IoMT device data is received. Each step will be further explained in the [IoT connector data flow](./iot-data-flow.md) article.

> [!NOTE]
> Learn more about [Azure Event Hubs](/azure/event-hubs) use cases, features and architectures.

:::image type="content" source="media/iot-data-flow/iot-data-flow.png" alt-text="IoMT data flows from IoT devices into an event hub. IoMT data is ingested by IoT connector as it is normalized, grouped, transformed, and persisted in the FHIR service." lightbox="media/iot-data-flow/iot-data-flow.png":::

## Scalable

IoT connector is designed out-of-the-box to handle even the most demanding IoMT device message workloads by using autoscaling features. 

## Configurable 

IoT connector is configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings. The mappings instruct the filtering and transformation of your IoMT device messages into the FHIR format.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting IoT connector Device and FHIR destination mappings. Export mappings for uploading to IoT connector in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of IoT connector.

## Extensible

IoT connector may also be used with our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from the following wearables:
* Fitbit&#174;
* Apple&#174;
* Google&#174;

IoT connector may also be used with the following Microsoft solutions to provide more functionalities and insights:
 * [Azure Machine Learning Service](./iot-connector-machine-learning.md)
 * [Microsoft Power BI](./iot-connector-power-bi.md)
 * [Microsoft Teams](./iot-connector-teams.md)
 
## Secure
IoT connector uses Azure [Resource-based Access Control](/azure/role-based-access-control/overview) and [Managed Identities](/azure/active-directory/managed-identities-azure-resources/overview) for granular security and access control of your IoT connector assets. 

## Next steps

For more information about IoT connector data flow, see:

>[!div class="nextstepaction"]
>[IoT connector data flow](./iot-data-flow.md)

For more information about deploying IoT connector, see:

>[!div class="nextstepaction"]
>[Deploying IoT connector in the Azure portal](./deploy-iot-connector-in-azure.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
