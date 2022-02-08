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

IoT connector is an optional service of the Azure Healthcare APIs designed to ingest health data from multiple and disparate Internet of Medical Things (IoMT) devices and persisting the health data in a FHIR service.

The IoT connector is important because health data collected from patients and health care consumers can be fragmented from access across multiple systems, device types, and formats. Managing healthcare data can be difficult, however, trying to gain insight from the data can be one of the biggest barriers to population and personal wellness understanding as well as sustaining health.  


IoT connector transforms device data into Fast Healthcare Interoperability Resources (FHIR®)-based Observation resources and then persists the transformed messages into the Azure Healthcare APIs FHIR service. Allowing for a unified approach to health data access, standardization, and trend capture enabling the discovery of operational and clinical insights, connecting new device applications, and enabling new research projects.

Below is an overview of each step IoT connector does once IoMT device data is received. Each step will be further explained in the [IoT connector data flow](./iot-data-flow.md) article.

> [!NOTE]
> Learn more about [Azure Event Hubs](../../event-hubs/index.yml) use cases, features and architectures.

:::image type="content" source="media/iot-data-flow/iot-data-flow.png" alt-text="IoMT data flows from IoT devices into an event hub. IoMT data is ingested by IoT connector as it is normalized, grouped, transformed, and persisted in the FHIR service." lightbox="media/iot-data-flow/iot-data-flow.png":::

## Scalable

IoT connector is designed out-of-the-box to support growth and adaptation to the changes and pace of healthcare by using autoscaling features. The service enables developers to modify and extend the capabilities to support additional device mapping template types and FHIR resources.

## Configurable 

IoT connector is configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings. The mappings instruct the filtering and transformation of your IoMT device messages into the FHIR format.

The different points for extension are:
* Normalization: Health data from disparate devices can be aligned and standardized into a common format to make sense of the data from a unified lens and capture trends.
* FHIR conversion: Health data is normalized and grouped by mapping commonalities to FHIR. Observations can be created or updated according to chosen or configured templates. Devices and health care consumers can be linked for enhanced insights and trend capture.

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
IoT connector uses Azure [Resource-based Access Control](../../role-based-access-control/overview.md) and [Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) for granular security and access control of your IoT connector assets. 

## Next steps

For more information about IoT connector data flow, see:

>[!div class="nextstepaction"]
>[IoT connector data flow](./iot-data-flow.md)

For more information about deploying IoT connector, see:

>[!div class="nextstepaction"]
>[Deploying IoT connector in the Azure portal](./deploy-iot-connector-in-azure.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.