---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 03/25/2022
ms.author: jasteppe
---

# What is the MedTech service?

## Overview

MedTech service is an optional service of the Azure Health Data Services designed to ingest health data from multiple and disparate Internet of Medical Things (IoMT) devices and persisting the health data in a FHIR service.

MedTech service is important because health data collected from patients and health care consumers can be fragmented from access across multiple systems, device types, and formats. Managing healthcare data can be difficult, however, trying to gain insight from the data can be one of the biggest barriers to population and personal wellness understanding as well as sustaining health.  


MedTech service transforms device data into Fast Healthcare Interoperability Resources (FHIR®)-based Observation resources and then persists the transformed messages into Azure Health Data Services FHIR service. Allowing for a unified approach to health data access, standardization, and trend capture enabling the discovery of operational and clinical insights, connecting new device applications, and enabling new research projects.

Below is an overview of what the MedTech service does after IoMT device data is received. Each step will be further explained in the [MedTech service data flow](./iot-data-flow.md) article.

> [!NOTE]
> Learn more about [Azure Event Hubs](../../event-hubs/index.yml) use cases, features and architectures.

:::image type="content" source="media/iot-data-flow/iot-data-flow.png" alt-text="IoMT data flows from IoT devices into an event hub. IoMT data is ingested by the MedTech service as it is normalized, grouped, transformed, and persisted in the FHIR service." lightbox="media/iot-data-flow/iot-data-flow.png":::

## Scalable

MedTech service is designed out-of-the-box to support growth and adaptation to the changes and pace of healthcare by using autoscaling features. The service enables developers to modify and extend the capabilities to support additional device mapping template types and FHIR resources.

## Configurable 

MedTech service is configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings. The mappings instruct the filtering and transformation of your IoMT device messages into the FHIR format.

The different points for extension are:
* Normalization: Health data from disparate devices can be aligned and standardized into a common format to make sense of the data from a unified lens and capture trends.
* FHIR conversion: Health data is normalized and grouped by mapping commonalities to FHIR. Observations can be created or updated according to chosen or configured templates. Devices and health care consumers can be linked for enhanced insights and trend capture.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

## Extensible

MedTech service may also be used with our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from the following wearables:
* Fitbit&#174;
* Apple&#174;
* Google&#174;

MedTech service may also be used with the following Microsoft solutions to provide more functionalities and insights:
 * [Azure Machine Learning Service](./iot-connector-machine-learning.md)
 * [Microsoft Power BI](./iot-connector-power-bi.md)
 * [Microsoft Teams](./iot-connector-teams.md)
 
## Secure
MedTech service uses Azure [Resource-based Access Control](../../role-based-access-control/overview.md) and [Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md) for granular security and access control of your MedTech service assets. 

## Next steps

For more information about MedTech service data flow, see

>[!div class="nextstepaction"]
>[MedTech service data flow](./iot-data-flow.md)

For more information about deploying MedTech service, see

>[!div class="nextstepaction"]
>[Deploying MedTech service in the Azure portal](./deploy-iot-connector-in-azure.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.