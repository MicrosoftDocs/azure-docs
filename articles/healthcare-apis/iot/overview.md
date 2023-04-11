---
title: What is the MedTech service? - Azure Health Data Services
description: In this article, you'll learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 04/10/2023
ms.author: jasteppe
---

# What is the MedTech service?

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an introductory overview of the MedTech service. The MedTech service is a Platform as a Service (PaaS) within the Azure Health Data Services. The MedTech service that enables you to ingest device data, transform it into a unified FHIR format, and store it in an enterprise-scale, secure, and compliant cloud environment. 

The MedTech service was built to help customers that were dealing with the challenge of gaining relevant insights from device data coming in from multiple and diverse sources. No matter the device or structure, the MedTech service normalizes that device data into a common format, allowing the end user to then easily capture trends, run analytics, and build Artificial Intelligence (AI) models. In the enterprise healthcare setting, the MedTech service is used in the context of remote patient monitoring, virtual health, and clinical trials.

The following video presents an overview of the MedTech service:
>
> [!VIDEO https://youtube.com/embed/_nMirYYU0pg]

## How the MedTech service works

The following diagram outlines the basic elements of how the MedTech service transforms device data into standardized [FHIR Observations](https://www.hl7.org/fhir/R4/observation.html) in Azure.

:::image type="content" source="media/overview/what-is-simple-diagram.png" alt-text="Simple diagram showing the MedTech service." lightbox="media/overview/what-is-simple-diagram.png":::

### Deployment

In order to implement the MedTech service, you need to have these Azure resources available:

* An Azure subscription.
* A resource group.
* An Azure Event Hubs namespace containing an event hub.
* An Azure Health Data service workspace. 

With the resources in place, you can now deploy the MedTech service and the FHIR service within the workspace. Granting the required MedTech service system-assigned managed identity permissions to the event hub and FHIR service creates the final configurations required to receive and process device data.

### Devices

After the deployments are completed, high-velocity and low-velocity device data can be collected from a wide range of JSON-compatible IoT devices, systems, and formats.

### Event hub

Device data is sent from a device over the Internet to an event hub to hold it temporarily in Azure. The event hub can asynchronously process millions of data points per second, eliminating data traffic jams, making it possible to easily handle huge amounts of information in real-time.

### The MedTech service

When the device data has been loaded into event hub, the MedTech service can then process it in five stages to transform the device data into a unified FHIR format.

These stages are:

1. **Ingest** - The MedTech service asynchronously loads the device data from the event hub at high speed.

2. **Normalize** - After the device data has been ingested, the MedTech service uses the device mapping to streamline and convert it into a normalized schema format.

3. **Group** - The normalized data is then grouped by parameters to prepare it for the next stage of processing. The parameters are: device identity, measurement type, time period, and (optionally) correlation ID.

4. **Transform** - When the normalized data is grouped, it's transformed through the FHIR destination mapping and is ready to become FHIR Observations.

5. **Persist** - After the transformation is done, the new data is sent to FHIR service and persisted as FHIR Observations.

### FHIR service

The MedTech service data processing is complete when the new FHIR Observations are successfully persisted into the FHIR service and ready for use.

## Key features of the MedTech service

The MedTech service has many features that make it secure, configurable, scalable, and extensible.

### Secure

The MedTech service delivers your device data into FHIR service, ensuring that your data has unparalleled security and advanced threat protection. The FHIR service isolates your data in a unique database per API instance and protects it with multi-region failover. In addition, the MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets. 

### Configurable

The MedTech service can be customized and configured by using [device](how-to-configure-device-mappings.md) and [FHIR destination](how-to-configure-fhir-mappings.md) mappings to define the filtering and transformation of your data into FHIR Observations.

Useful options could include:

- Link devices and consumers together for enhanced insights, trend captures, interoperability between systems, and proactive and remote monitoring.

- Update or create FHIR Observations according to existing or new mapping template types.

- Choose data terms that work best for your organization and provide consistency in device data ingestion.

- Customize, edit, test, and troubleshoot MedTech service device and FHIR destination mappings with the [Mapping debugger](how-to-use-mapping-debugger.md) tool.

### Scalable

The MedTech service enables you to easily modify and extend the capabilities of the MedTech service to support new device mapping template types and FHIR resources.

### Integration

The MedTech service may also be integrated into our [open-source projects](git-projects.md) for ingesting device data from these wearables:

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

To learn about how the MedTech service processes device data, see

> [!div class="nextstepaction"]
> [Overview of the MedTech service device data processing stages](overview-of-device-message-processing-stages.md)

To learn about the different deployment methods for the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

To learn about the MedTech service frequently asked questions (FAQs), see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
