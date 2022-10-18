---
title: Related GitHub projects for the MedTech service - Azure Health Data Services
description: MedTech service has a robust open-source (GitHub) library for ingesting device messages from popular wearable devices.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: reference
ms.date: 05/25/2022
ms.author: jasteppe
---
# Open-source projects

Check out our open-source projects on GitHub that provide source code and instructions to deploy services for various uses with the MedTech service.

> [!IMPORTANT]
> Links to OSS projects on the GitHub website are for informational purposes only and do not constitute an endorsement or guarantee of any kind.  You should review the information and licensing terms on the OSS projects on GitHub before using it.  

## MedTech service GitHub projects

### FHIR integration

* [microsoft/iomt-fhir](https://github.com/microsoft/iomt-fhir): Open-source version of the Azure Health Data Services MedTech service managed service. Can be used with any Fast Healthcare Interoperability Resources (FHIR&#174;) service that supports [FHIR R4&#174;](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491)

### Device and FHIR destination mappings

* [IoMT Connector Data Mapper](https://github.com/microsoft/iomt-fhir/tree/master/tools/data-mapper): Tool for editing, testing, and troubleshooting MedTech service Device and FHIR destination mappings. Export mappings for uploading to the MedTech service in the Azure portal or use with the open-source version.

### Wearables integration

Fitbit

* [microsoft/fitbit-on-fhir](https://github.com/microsoft/FitbitOnFHIR): Bring Fitbit&#174; data to a FHIR service.

HealthKit

* [microsoft/healthkit-on-fhir](https://github.com/microsoft/healthkit-on-fhir): Bring Apple&#174; HealthKit&#174; data to a FHIR service.

* [microsoft/healthkit-to-fhir](https://github.com/microsoft/healthkit-to-fhir): Provides a simple way to create FHIR Resources from HKObjects

Fit on FHIR

* [microsoft/fit-on-fhir](https://github.com/microsoft/fit-on-fhir): Bring Google Fit&#174; data to a FHIR service.

Health Data Sync

* [microsoft/health-data-sync](https://github.com/microsoft/health-data-sync): A Swift&#174; library that simplifies and automates the export of HealthKit data to an external store.

## Next steps
Learn how to deploy the MedTech service in the Azure portal

>[!div class="nextstepaction"]
>[Deploy the MedTech service managed service](deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
