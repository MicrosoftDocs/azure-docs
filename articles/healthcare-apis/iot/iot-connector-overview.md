---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 07/19/2022
ms.author: jasteppe
---

# What is the MedTech service?

## Overview

The MedTech service is an optional service of the Azure Health Data Services designed to ingest health data from multiple and disparate Internet of Medical Things (IoMT) devices and persisting the health data in a Fast Healthcare Interoperability Resources (FHIR&#174;) service.

The MedTech service is important because health data collected from patients and health care consumers can be fragmented from access across multiple systems, device types, and formats. Managing healthcare data can be difficult, however, trying to gain insight from the data can be one of the biggest barriers to population and personal wellness understanding and sustaining health.  


The MedTech service transforms device data into FHIR-based Observation resources and then persists the transformed messages into the Azure Health Data Services FHIR service. Allowing for a unified approach to health data access, standardization, and trend capture enabling the discovery of operational and clinical insights, connecting new device applications, and enabling new research projects.

Below is an overview of what the MedTech service does after IoMT device data is received. Each step will be further explained in the [The MedTech service data flows](./iot-data-flow.md) article.

> [!NOTE]
> Learn more about [Azure Event Hubs](../../event-hubs/index.yml) use cases, features and architectures.

:::image type="content" source="media/iot-data-flow/iot-data-flow.png" alt-text="Screenshot of IoMT data as it flows from IoT devices into an event hub. IoMT data is ingested by the MedTech service as it is normalized, grouped, transformed, and persisted in the FHIR service." lightbox="media/iot-data-flow/iot-data-flow.png":::

## Scalable

The MedTech service is designed out-of-the-box to support growth and adaptation to the changes and pace of healthcare by using autoscaling features. The service enables developers to modify and extend the capabilities to support more device mapping template types and FHIR resources.

## Configurable 

The MedTech service is configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings. The mappings instruct the filtering and transformation of your IoMT device messages into the FHIR format.

The different points for extension are:
* Normalization: Health data from disparate devices can be aligned and standardized into a common format to make sense of the data from a unified lens and capture trends.
* FHIR conversion: Health data is normalized and grouped by mapping commonalities to FHIR. Observations can be created or updated according to chosen or configured templates. Devices and health care consumers can be linked for enhanced insights and trend capture.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

## Extensible

The MedTech service may also be used with our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from the following wearables:
* Fitbit&#174;
* Apple&#174;
* Google&#174;

The MedTech service may also be used with the following Microsoft solutions to provide more functionalities and insights:
 * [Azure Machine Learning Service](./iot-connector-machine-learning.md)
 * [Microsoft Power BI](./iot-connector-power-bi.md)
 * [Microsoft Teams](./iot-connector-teams.md)
 
## Secure
The MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for granular security and access control of your MedTech service assets. 

## Next steps

In this article, you learned about the MedTech service. To learn about the MedTech service data flows and how to deploy the MedTech service in the Azure portal, see

>[!div class="nextstepaction"]
>[The MedTech service data flows](./iot-data-flow.md)

>[!div class="nextstepaction"]
>[Deploy the MedTech service using the Azure portal](./deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
