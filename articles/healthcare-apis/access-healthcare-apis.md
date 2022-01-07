---
title: Access Azure Healthcare APIs
description: This article describes the different ways for accessing the services in your applications using tools and programming languages.
services: healthcare-apis
author: SteveWohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 01/06/2022
ms.author: zxue
---

# Access Healthcare APIs

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn about the different ways to access the services in your applications. After you've provisioned a FHIR service, DICOM service, or IoT connector, you can then access them in your applications using tools like Postman, cURL, REST Client in Visual Studio Code, and with programming languages such as Python and C#.

## Access the FHIR service

- [Access the FHIR service using Postman](././fhir/use-postman.md)
- [Access the FHIR service using cURL](././fhir/using-curl.md)
- [Access the FHIR service using REST Client](././fhir/using-rest-client.md)

## Access the DICOM service

- [Access the DICVOM service using Python](dicom/dicomweb-standard-apis-python.md)
- [Access the DICOM service using cURL](dicom/dicomweb-standard-apis-curl.md)
- [Access the DICOM service using C#](dicom/dicomweb-standard-apis-c-sharp.md)

## Access IoT connector

The IoT connector works with the IoT Hub and Event Hubs in your subscription to receive message data, and the FHIR service to persist the data.

- [Receive device data through Azure IoT Hub](iot/device-data-through-iot-hub.md)
- [Access the FHIR service using Postman](fhir/use-postman.md)
- [Access the FHIR service using cURL](fhir/using-curl.md)
- [Access the FHIR service using REST Client](fhir/using-rest-client.md)


## Next steps

In this document, you learned about the tools and programming languages that you can use to access the services in your applications. To learn how to deploy an instance of the Healthcare APIs service using the Azure portal, see

>[!div class="nextstepaction"]
>[Deploy Healthcare APIs (preview) workspace using Azure portal](healthcare-apis-quickstart.md)



