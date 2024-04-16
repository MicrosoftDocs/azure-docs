---
title: Access Azure Health Data Services
description: This article describes the different ways to access Azure Health Data Services in your applications using tools and programming languages.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/06/2022
ms.author: chrupa
---

# Access Azure Health Data Services

In this article, you'll learn about the different ways to access Azure Health Data Services in your applications. After you've provisioned a FHIR service, DICOM service, or MedTech service, you can then access them in your applications using tools like Postman, cURL, REST Client in Visual Studio Code, and with programming languages such as Python and C#.

## Access the FHIR service

- [Access the FHIR service using Postman](././fhir/use-postman.md)
- [Access the FHIR service using cURL](././fhir/using-curl.md)
- [Access the FHIR service using REST Client](././fhir/using-rest-client.md)

## Access the DICOM service

- [Access the DICOM service using Python](dicom/dicomweb-standard-apis-python.md)
- [Access the DICOM service using cURL](dicom/dicomweb-standard-apis-curl.md)
- [Access the DICOM service using C#](dicom/dicomweb-standard-apis-c-sharp.md)

## Access MedTech service

The MedTech service works with the IoT Hub and Event Hubs in your subscription to receive message data, and the FHIR service to persist the data.

- [Receive device data through Azure IoT Hub](iot/device-data-through-iot-hub.md)
- [Access the FHIR service using Postman](fhir/use-postman.md)
- [Access the FHIR service using cURL](fhir/using-curl.md)
- [Access the FHIR service using REST Client](fhir/using-rest-client.md)


## Next steps

In this document, you learned about the tools and programming languages that you can use to access Azure Health Data Services in your applications. To learn how to deploy an instance of Azure Health Data Services using the Azure portal, see

>[!div class="nextstepaction"]
>[Deploy Azure Health Data Services workspace using the Azure portal](healthcare-apis-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.



