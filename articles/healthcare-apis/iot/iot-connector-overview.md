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

MedTech service in Azure Health Data Services is a Platform as a service (PaaS) that enables you to gather data from medical devices and convert it to a standard Fast Healthcare Interoperability Resources (FHIR&#174;) service format. MedTech service has device data translation capabilities that make it possible to convert a wide variety of data into a unified FHIR format that can be used for secure health data management in a Protected Personal Health Information (PHI) cloud environment.

MedTech service is important because healthcare data can be difficult to access or even lost when it comes from diverse or incompatible devices, systems, or formats. If medical information isn't easy to access, it can have a negative impact on gaining clinical insights and a patient's health and wellness. The ability to translate many types of medical device data into one unified FHIR format enables MedTech service to successfully link devices, health data, labs, and remote in-person care to support the clinician, care team, patient, and family.

## How MedTech service works

This diagram outlines how five parts of MedTech service fit together to create a system that transforms device data into a standard FHIR resource in the cloud.

:::image type="content" source="./media/iot-what-is/what-is-simple-diagram.png" alt-text="Simple diagram showing MedTech service." lightbox="./media/iot-what-is/what-is-simple-diagram.png":::

### Deployment

In order to implement MedTech service, you need to  deploy three Azure services in the cloud: MedTech service, FHIR service, and Event Hubs service. This sets up the Platform as a service (PaaS) configuration required to receive data from Internet of Medical Things (IoMT) devices.

### Devices

Patient medical data can then be gathered from a wide variety of IoMT devices, systems, and formats. JSON is the only device data format supported at this time.

### Event Hubs service

 IoMT data is then sent to an Event Hubs service over the Internet, where the event hub asynchronously processes millions of messages per second. This eliminates data traffic jams and makes it possible to easily handle huge amounts of information in real time. 

### MedTech service

After device data is loaded into Event Hubs service, MedTech service can pick it up and begin its five stages of processing the data into a unified FHIR format.

Here are the five stages:

1. **Ingest** - MedTech service asynchronously loads the device data from the event hub at high speed.

2. **Normalize** - After the data has been ingested, it is processed into a normalized schema using device mapping.

3. **Group** - The normalized messages are then grouped into three different parameters so they are ready for the next stage of processing. The parameters are: device identity, measurement type, and time period.

4. **Transform** - The normalized and grouped messages are then transformed through FHIR destination mapping templates and are ready to become FHIR Observation resources.

5. **Persist** - After the data is normalized, grouped, and transformed into a unified format, it is sent to the FHIR service and persisted as an Observation resource.

### FHIR service

MedTech service data processing is complete when the new FHIR Observation resource is saved into the FHIR service. Now it's ready for use by the care team, clinician, or research facility.

## Key features

MedTech service has many key features that make it highly secure, very configurable, easily scalable, and has many extensible options.

### Secure

In MedTech service, your PHI has unparalleled security intelligence and advanced threat protection because your data is isolated to a unique database per API instance and protected with multi-region failover. In addition, MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for exceptional granular security and access control of your MedTech service assets. 

### Configurable

The MedTech service can be customized and configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings to define the filtering and transformation of your data into FHIR Observation resources.

Useful options could include:

- Observations can be created or updated according to existing or new templates.

- Devices and health care consumers can be linked for enhanced insights and trend capture.

- Health data can be aligned and standardized into whatever common format you prefer. For example, "hr" vs "heart rate" vs "Heart Rate" can be used to define heart rate.

- The [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) open-source tool can be used for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings.

### Scalable

The MedTech service uses uses autoscaling features that enable developers to easily modify and extend the capabilities to support new device mapping template types and FHIR resources.

### Extensible

The MedTech service may also be used with our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from the following wearables:

- Fitbit&#174;

- Apple&#174;

- Google&#174;

The following Microsoft solutions can be used with MedTech service to provide additional functionality:

- [**Azure Machine Learning Service**](./iot-connector-machine-learning.md) - helps build, deploy, and manage models, integrate tools, and increase open-source operability.

- [**Microsoft Power BI**](./iot-connector-power-bi.md) - enables data visualization features.

- [**Microsoft Teams**](./iot-connector-teams.md) - facilitates virtual visits.

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
