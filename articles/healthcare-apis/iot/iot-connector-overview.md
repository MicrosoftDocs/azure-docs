---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 08/14/2022
ms.author: v-smcevoy
---

# What is MedTech service?

## Introduction

MedTech service in Azure Health Data Services is a Platform As A Service (PAAS) that enables you to gather data from medical services and devices and convert it to a standard Fast Healthcare Interoperability Resources (FHIR&#174;) service format. MedTech service has device data translation capabilities that make it possible to obtain a wide variety of data from different types of devices and medical systems and transforms the data into FHIR observation resources that can be used for Health data management in a Protected Personal Health Information (PHI) cloud environment. Azure's (PHI) - hype here - (Azure's?) ... supplies industry-leading advanced threat protection for your data.

MedTech service is important because healthcare data can be difficult to access, or even lost, when it comes from so many different systems, devices, and formats. If medical information isn't easy to access, it can have a negative impact on gaining clinical insights and patient health and wellness. MedTech's ability to translate many types of device data into one unified format, enabling successful linking of devices, health data, labs, and remote in-person care to support the clinician care team, patient, and family.

## How MedTech service works

This diagram outlines how five parts of MedTech service fit together to create a system that inputs device data and transforms it into a standard FHIR resource in the cloud.

:::image type="content" source="./media/iot-what-is/what-is-simple-diagram.png" alt-text="Simple diagram showing MedTech service." lightbox="./media/iot-what-is/what-is-simple-diagram.png":::

### Deployment

In order to run MedTech service, you need to  deploy three Azure services in the cloud: MedTech service, FHIR service, and Event Hubs service. This sets up the Platform As A Service (PAAS) configuration required to be able to receive data from Internet of Medical Things (IoMT) devices.

### Devices

Medical data can be gathered from a wide variety of IoMT devices and medical systems so it can be processed by NedTech service into a unified,  secure format.

### Event Hubs service

The first step is to send IoMT data to an Event Hubs service over the Internet. The Event Hubs asynchronously process millions of messages per second, eliminating data traffic jams. Once device data is loaded into Event Hubs service, MedTech service can pick it up and begin the five stages of processing.

### MedTech service

Here are the five stages: 

1. **Ingest** - MedTech loads the device data from Event Hubs asynchronously. The data must be in the JSON format

2. **Normalize** - Once the data has been ingested, it is processed into a normalized schema using device mapping.

3. **Group** - The normalized messages are grouped into three different parameters so they are ready for processing. The parameters are: device identity, measurement type, and time period.

4. **Transform** - The normalized and grouped messages are then transformed through FHIR destination mapping templates so they can become FHIR Observation resources.

5. **Persist** - After the data is transformed into a unified format, it is sent to the FHIR service and persisted as an Observation.

### FHIR service

MedTech service data processing is complete when the new Observation resource is saved into the FHIR service, where it's ready for use by the care team, clinician, or research facility.

## Key features

MedTech key features are: scalable, configurable, extensible, and secure.

### Scalable

The MedTech service is designed out-of-the-box to support growth and adaptation to the changes and pace of healthcare by using autoscaling features. The service enables developers to modify and extend the capabilities to support more device mapping template types and FHIR resources.

### Configurable 

The MedTech service is configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings. The mappings instruct the filtering and transformation of your IoMT device messages into the FHIR format.

The different points for extension are:
* Normalization: Health data from disparate devices can be aligned and standardized into a common format to make sense of the data from a unified lens and capture trends.
* FHIR conversion: Health data is normalized and grouped by mapping commonalities to FHIR. Observations can be created or updated according to chosen or configured templates. Devices and health care consumers can be linked for enhanced insights and trend capture.

> [!TIP]
> Check out the [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) tool for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the [open-source version](https://github.com/microsoft/iomt-fhir) of the MedTech service.

### Extensible

The MedTech service may also be used with our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from the following wearables:
* Fitbit&#174;
* Apple&#174;
* Google&#174;

The MedTech service may also be used with the following Microsoft solutions to provide more functionalities and insights:
 * [Azure Machine Learning Service](./iot-connector-machine-learning.md)
 * [Microsoft Power BI](./iot-connector-power-bi.md)
 * [Microsoft Teams](./iot-connector-teams.md)
 
### Secure
The MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for granular security and access control of your MedTech service assets. 

## Architecture overview

MedTech service has an architecture.

:::image type="content" source="./media/iot-get-started/get-started-with-iot.png" alt-text="Detailed diagram showing MedTech service deploy and run." lightbox="./media/iot-get-started/get-started-with-iot.png":::

It is in six parts.

## Next steps

In this article, you learned about the MedTech service. To learn more about the MedTech service data flow and how to deploy the MedTech service in the Azure portal, see

>[!div class="nextstepaction"]
>[The MedTech service data flows](./iot-data-flow.md)

>[!div class="nextstepaction"]
>[Deploy the MedTech service using the Azure portal](./deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
