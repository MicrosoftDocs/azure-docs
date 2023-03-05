---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 02/27/2023
ms.author: jasteppe
---

# What is the MedTech service?

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an introductory overview of the MedTech service. The MedTech service in Azure Health Data Services is a Platform as a service (PaaS) that enables you to gather data from diverse devices and convert it into a FHIR service format. The MedTech service's device data translation capabilities make it possible to transform a wide variety of data into a unified FHIR format that provides secure data management in a cloud environment.

The MedTech service is important because data can be difficult to access or lost when it comes from diverse or incompatible devices, systems, or formats. If this information isn't easy to access, it may have a negative effect on gaining key insights and capturing trends. The ability to transform many types of device data into a unified FHIR format enables the MedTech service to successfully link device data with other datasets to support the end user. As a result, this capability can facilitate the discovery of important clinical insights and trend capture. It can also help make connections to new device applications and enable advanced research projects.

## How the MedTech service works

The following diagram outlines the basic elements of how the MedTech service transforms device data into a standardized FHIR resource in the cloud.

:::image type="content" source="media/overview/what-is-simple-diagram.png" alt-text="Simple diagram showing the MedTech service." lightbox="media/overview/what-is-simple-diagram.png":::

These elements are:

### Deployment

In order to implement the MedTech service, you need to have an Azure subscription, set up a workspace, and set up a namespace to deploy three Azure services: MedTech service, FHIR service, and Event Hubs service. This setup creates the PaaS configuration required to receive and process data from Internet of Things (IoT) devices.

### Devices

After the PaaS deployment is completed, high-velocity and low-velocity data can be collected from a wide range of JSON-compatible IoMT devices, systems, and formats.

### Event Hubs service

 IoT data is then sent from a device over the Internet to Event Hubs service to hold it temporarily in the cloud. The event hub can asynchronously process millions of data points per second, eliminating data traffic jams, making it possible to easily handle huge amounts of information in real-time.

### The MedTech service

When the device data has been loaded into Event Hubs service, the MedTech service can then process it in five stages to convert the data into a unified FHIR format.

These stages are:

1. **Ingest** - The MedTech service asynchronously loads the device data from the event hub at high speed.

2. **Normalize** - After the data has been ingested, the MedTech service uses device mapping to streamline and translate it into a normalized schema format.

3. **Group** - The normalized data is then grouped by parameters to prepare it for the next stage of processing. The parameters are: device identity, measurement type, time period, and (optionally) correlation ID.

4. **Transform** - When the normalized data is grouped, it's transformed through FHIR destination mapping templates and is ready to become FHIR Observation resources.

5. **Persist** - After the transformation is done, the new data is sent to FHIR service and persisted as an Observation resource.

### FHIR service

The MedTech service data processing is complete when the new FHIR Observation resource is successfully persisted, saved into the FHIR service, and ready for use.

## Key features of the MedTech service

The MedTech service has many features that make it secure, configurable,  scalable, and extensible.

### Secure

The MedTech service delivers your data to FHIR service in Azure Health Data Services, ensuring that your data has unparalleled security and advanced threat protection. The FHIR service isolates your data in a unique database per API instance and protects it with multi-region failover. In addition, the MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets. 

### Configurable

The MedTech service can be customized and configured by using [device](how-to-configure-device-mappings.md) and [FHIR destination](how-to-configure-fhir-mappings.md) mappings to define the filtering and transformation of your data into FHIR Observation resources.

Useful options could include:

- Linking devices and consumers together for enhanced insights, trend capture, interoperability between systems, and proactive and remote monitoring.

- FHIR observation resources that can be created or updated according to existing or new templates.

- Being able to choose data terms that work best for your organization and provide consistency in device data ingestion.

- Facilitating customization, editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings with The [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper) open-source tool.

### Scalable

The MedTech service enables developers to easily modify and extend the capabilities of the MedTech service to support new device mapping template types and FHIR resources.

### Integration

The MedTech service may also be integrated into our [open-source projects](git-projects.md) for ingesting IoMT device data from these wearables:

- Fitbit&#174;

- Apple&#174;

- Google&#174;

The following Microsoft solutions can use MedTech service for extra functionality:

- [**Microsoft Azure IoT Hub**](../../iot-hub/iot-concepts-and-iot-hub.md) - enhances workflow and ease of use.

- [**Azure Machine Learning Service**](concepts-machine-learning.md) - helps build, deploy, and manage models, integrate tools, and increase open-source operability.

- [**Microsoft Power BI**](concepts-power-bi.md) - enables data visualization features.

- [**Microsoft Teams**](concepts-teams.md) - facilitates virtual visits.

## Next steps

In this article, you learned about the MedTech service and its capabilities.

To learn about how the MedTech service processes device messages, see

> [!div class="nextstepaction"]
> [Understand the MedTech service device message data transformation](understand-service.md)

To learn about the different deployment methods for the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

To learn about the MedTech service frequently asked questions (FAQs), see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
