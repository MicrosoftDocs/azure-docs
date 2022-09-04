---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 08/25/2022
ms.author: v-smcevoy
---

# What is MedTech service?

## Overview

MedTech service in Azure Health Data Services is a Platform as a service (PaaS) that enables you to gather data from diverse medical devices and convert it into a Fast Healthcare Interoperability Resources (FHIR&#174;) service format. MedTech service's device data translation capabilities make it possible to transform a wide variety of data into a unified FHIR format that provides secure health data management in a cloud environment.

MedTech service is important because healthcare data can be difficult to access or lost when it comes from diverse or incompatible devices, systems, or formats. If medical information isn't easy to access, it may have a negative impact on gaining clinical insights and a patient's health and wellness. The ability to translate many types of medical device data into a unified FHIR format enables MedTech service to successfully link devices, health data, labs, and remote in-person care to support the clinician, care team, patient, and family. As a result, this capability can facilitate the discovery of important clinical insights and trend capture. It can also help make connections to new device applications and enable advanced research projects.

## How MedTech service works

The following diagram outlines the basic elements of how MedTech service transforms medical device data into a standardized FHIR resource in the cloud.

:::image type="content" source="./media/iot-what-is/what-is-simple-diagram.png" alt-text="Simple diagram showing MedTech service." lightbox="./media/iot-what-is/what-is-simple-diagram.png":::

These elements are:

### Deployment

In order to implement MedTech service, you need to have an Azure subscription and set up a workspace and namespace to deploy three Azure services: MedTech service, FHIR service, and Event Hubs service. This creates the PaaS configuration required to receive and process data from Internet of Medical Things (IoMT) devices.

### Devices

After the PaaS deployment is completed, high-velocity and low-velocity patient medical data can be collected from a wide range of JSON-compatible IoMT devices, systems, and formats.

### Event Hubs service

 IoMT data is then sent from a device over the Internet to Event Hubs service to hold it temporarily in the cloud. The event hub can asynchronously process millions of data points per second, eliminating data traffic jams, making it possible to easily handle huge amounts of information in real time.

### MedTech service

When device data has been loaded into Event Hubs service, MedTech service is able to pick it up and convert it into a unified FHIR format in five stages.

These stages are:

1. **Ingest** - MedTech service asynchronously loads the device data from the event hub at very high speed.

2. **Normalize** - After the data has been ingested, MedTech service uses device mapping to streamline and process it into a normalized schema format.

3. **Group** - The normalized data is then grouped by parameters to prepare it for the next stage of processing. The parameters are: device identity, measurement type, time period, and (optionally) correlation id.

4. **Transform** - When the normalized data is grouped, it is transformed through FHIR destination mapping templates and is ready to become FHIR Observation resources.

5. **Persist** - After the transformation is done, the new data is sent to FHIR service and persisted as an Observation resource.

### FHIR service

MedTech service data processing is complete when the new FHIR Observation resource is successfully persisted and saved into the FHIR service. Now it's ready for use by the care team, clinician, laboratory, or research facility.

## Key features of MedTech service

MedTech service has many features that make it very secure, configurable,  scalable, and extensible.

### Secure

MedTech service delivers your data to FHIR service in Azure Health Data Services, ensuring that your Protected Personal Health Information (PHI) has unparalleled security and advanced threat protection. The FHIR service isolates your data in a unique database per API instance and protects it with multi-region failover. In addition, MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets. 

### Configurable

Your MedTech service can be customized and configured by using [Device](./how-to-use-device-mappings.md) and [FHIR destination](./how-to-use-fhir-mappings.md) mappings to define the filtering and transformation of your data into FHIR Observation resources.

Useful options could include:

- Linking Devices and health care consumers together for enhanced insights, trend capture, interoperability between systems, and proactive and remote monitoring.

- Observations that can be created or updated according to existing or new templates.

- Being able to choose Health data terms that work best for your organization and provide consistency in device data ingestion. For example, you could have either "hr" or "heart rate" or "Heart Rate" to define heart rate information.

- Facilitating customization, editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings with The [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) open-source tool.

### Scalable

The MedTech service has special autoscaling features that enable developers to easily modify and extend the capabilities to support new device mapping template types and FHIR resources.

### Extensible

The MedTech service may also be integrated into our [open-source projects](./iot-git-projects.md) for ingesting IoMT device data from these wearables:

- Fitbit&#174;

- Apple&#174;

- Google&#174;

The following Microsoft solutions can leverage MedTech service for additional functionality:

- [**Microsoft Azure IoT Hub**](../../iot-hub/iot-concepts-and-iot-hub.md) - enhances workflow and ease of use.

- [**Azure Machine Learning Service**](./iot-connector-machine-learning.md) - helps build, deploy, and manage models, integrate tools, and increase open-source operability.

- [**Microsoft Power BI**](./iot-connector-power-bi.md) - enables data visualization features.

- [**Microsoft Teams**](./iot-connector-teams.md) - facilitates virtual visits.

## Next steps

In this article, you learned about the MedTech service. To learn more about the MedTech service data flow and how to deploy the MedTech service in the Azure portal, see

>[!div class="nextstepaction"]
>[The MedTech service data flows](./iot-data-flow.md)

>[!div class="nextstepaction"]
>[Deploy the MedTech service using the Azure portal](./deploy-iot-connector-in-azure.md)

>[!div class="nextstepaction"]
>[Frequently asked questions about the MedTech service](./iot-connector-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
