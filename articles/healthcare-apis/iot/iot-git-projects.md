---
title: Related GitHub Projects for Azure Healthcare APIs IoT connector
description: List all Open Source (GitHub) repositories for IoT connector
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: reference
ms.date: 10/18/2021
ms.author: jasteppe
---
# Open-Source Projects

Check out our open-source projects on GitHub that provide source code and instructions to deploy services for various uses with IoT connector. 

## IoT connector GitHub projects

#### Integration with IoT Hub and IoT Central

* [microsoft/iomt-fhir](https://github.com/microsoft/iomt-fhir): integration with IoT Hub or IoT Central to Fast Healthcare Interoperability Resources (FHIR&#174;) with data normalization and FHIR conversion of the normalized data
* Normalization: device data information is extracted into a common format for further processing
* FHIR Conversion: normalized and grouped data is mapped to FHIR. Observations are created or updated according to configured templates and linked to the device and patient.

#### Device and FHIR destination mappings authoring and troubleshooting

* [Tools to help build Device and FHIR destination mappings](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper): visualize the mapping configuration for normalizing the device input data and transform it to FHIR resources. Developers can use this tool to edit and test Device mappings and FHIR destination mappings. Export them for uploading to IoT connector in the Azure portal.

#### HealthKit and FHIR Integration

* [microsoft/healthkit-on-fhir](https://github.com/microsoft/healthkit-on-fhir): a Swift library that automates the export of Apple HealthKit Data to a FHIR service.

>[!div class="nextstepaction"]
>[Overview of Azure Healthcare APIs](../healthcare-apis-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7. 