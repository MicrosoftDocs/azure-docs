---
title: Access Azure Health Data Services
description: Learn how to access the FHIR, DICOM, and MedTech services in Azure Health Data Services by using cURL, REST Client, and programming languages like Python and C# for efficient data management.
services: healthcare-apis
author: EXPEkesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.custom: devx-track-python
ms.topic: conceptual
ms.date: 04/29/2024
ms.author: kesheth
---

# Access Azure Health Data Services

After you deploy a FHIR&reg; service, DICOM&reg; service, or MedTech service, you can then access it in your applications by using tools like cURL, REST Client in Visual Studio Code, or with programming languages such as Python or C#.

## Access the FHIR service

- [Access the FHIR service by using cURL](././fhir/using-curl.md)
- [Access the FHIR service by using REST Client](././fhir/using-rest-client.md)

## Access the DICOM service

- [Access the DICOM service by using Python](dicom/dicomweb-standard-apis-python.md)
- [Access the DICOM service by using cURL](dicom/dicomweb-standard-apis-curl.md)
- [Access the DICOM service by using C#](dicom/dicomweb-standard-apis-c-sharp.md)

## Access the MedTech service

The MedTech service works with the IoT Hub and Event Hubs to receive message data, and works with the FHIR service to persist the data.

- [Receive device data through Azure IoT Hub](iot/device-data-through-iot-hub.md)
- [Access the FHIR service by using cURL](fhir/using-curl.md)
- [Access the FHIR service by using REST Client](fhir/using-rest-client.md)


## Next steps

[Deploy Azure Health Data Services workspace using the Azure portal](healthcare-apis-quickstart.md)

[!INCLUDE [FHIR and DICOM trademark statements](./includes/healthcare-apis-fhir-dicom-trademark.md)]
