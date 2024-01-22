---
title: What is the MedTech service? - Azure Health Data Services
description: Learn about the MedTech service, its features, functions, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: overview
ms.date: 10/19/2023
ms.author: jasteppe
---

# What is the MedTech service?

The MedTech service is a Platform as a Service (PaaS) within the Azure Health Data Services. The MedTech service enables you to ingest device data, transform it into a unified FHIR&reg; format, and store it in an enterprise-scale, secure, and compliant cloud environment. 

The MedTech service is built to help customers that are dealing with the challenge of gaining relevant insights from device data coming in from multiple and diverse sources. No matter the device or structure, the MedTech service normalizes that device data into a common format, allowing the end user to then easily capture trends, run analytics, and build Artificial Intelligence (AI) models. In the enterprise healthcare setting, the MedTech service is used in the context of remote patient monitoring, virtual health, and clinical trials.

The following video presents an overview of the MedTech service:
>
> [!VIDEO https://youtube.com/embed/_nMirYYU0pg]

## How the MedTech service works

The following diagram outlines the basic elements of how the MedTech service transforms device data into standardized [FHIR Observations](https://www.hl7.org/fhir/R4/observation.html) for persistence in the FHIR service.

:::image type="content" source="media/overview/what-is-simple-diagram.png" alt-text="Simple diagram showing the MedTech service." lightbox="media/overview/what-is-simple-diagram.png":::

The MedTech service processes device data in five stages:

1. **Ingest** - The MedTech service asynchronously reads the device message from the event hub at high speed.

2. **Normalize** - After the device message has been ingested, the MedTech service uses the device mapping to streamline and convert the device data into a normalized schema format.

3. **Group** - The normalized data is then grouped by parameters to prepare it for the next stage of processing. The parameters are: device identity, measurement type, time period, and (optionally) correlation ID.

4. **Transform** - When the normalized data is grouped, it's transformed through the FHIR destination mapping and is ready to become FHIR Observations.

5. **Persist** - After the transformation is done, the newly transformed data is sent to the FHIR service and persisted as FHIR Observations.

## Key features of the MedTech service

The MedTech service has many features that make it secure, configurable, scalable, and extensible.

### Secure

The MedTech service delivers your device data into FHIR service, ensuring that your data has unparalleled security and advanced threat protection. The FHIR service isolates your data in a unique database per API instance and protects it with multi-region failover. In addition, the MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets. 

### Configurable

The MedTech service can be customized and configured by using [device](overview-of-device-mapping.md) and [FHIR destination](overview-of-fhir-destination-mapping.md) mappings to define the filtering and transformation of your data into FHIR Observations.

Useful options could include:

* Link devices and consumers together for enhanced insights, trend captures, interoperability between systems, and proactive and remote monitoring.

* Update or create FHIR Observations according to existing or new mapping template types.

* Choose data terms that work best for your organization and provide consistency in device data ingestion.

* Customize, edit, test, and troubleshoot MedTech service device and FHIR destination mappings with the [Mapping debugger](how-to-use-mapping-debugger.md).

### Scalable

The MedTech service enables you to easily modify and extend the capabilities of the MedTech service to support new device mapping template types and FHIR resources.

### Integration

The MedTech service can also be integrated for ingesting device data from these wearables using our [open-source projects](git-projects.md): 

* Fitbit&#174;

* Apple&#174;

* Google&#174;

The following Microsoft solutions can use MedTech service for extra functionality:

* [**Azure IoT Hub**](../../iot-hub/iot-concepts-and-iot-hub.md) - enhances workflow and ease of use.

* [**Azure Machine Learning Service**](concepts-machine-learning.md) - helps build, deploy, and manage models, integrate tools, and increase open-source operability.

* [**Microsoft Power BI**](concepts-power-bi.md) - enables data visualization features.

* [**Microsoft Teams**](concepts-teams.md) - facilitates virtual visits.

## Next steps

[Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

[Choose a deployment method for the MedTech service](deploy-choose-method.md)

[Frequently asked questions about the MedTech service](frequently-asked-questions.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
