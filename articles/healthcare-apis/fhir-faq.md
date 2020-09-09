---
title: FAQs about FHIR services in Azure - Azure API for FHIR
description: Get answers to frequently asked questions about the Azure API for FHIR, such as the storage location of data behind FHIR APIs and version support.
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/03/2020
ms.author: matjazl
---

# Frequently asked questions about the Azure API for FHIR

## Azure API for FHIR

### What is FHIR?
The Fast Healthcare Interoperability Resources (FHIR - Pronounced "fire") is an interoperability standard intended to enable the exchange of healthcare data between different health systems. This standard was developed by the HL7 organization and is being adopted by healthcare organizations around the world. The most current version of FHIR available is R4 (Release 4). The Azure API for FHIR supports R4 and also supports the previous version STU3 (Standard for Trial Use 3). For more information on FHIR, visit [HL7.org](http://hl7.org/fhir/summary.html).

### Is the data behind the FHIR APIs stored in Azure?

Yes, the data is stored in managed databases in Azure. The Azure API for FHIR does not provide direct access to the underlying data store.

### What identity provider do you support?

We currently support Microsoft Azure Active Directory as the identity provider.

### What FHIR version do you support?

We support versions 4.0.0 and 3.0.1 on both the Azure API for FHIR (PaaS) and FHIR Server for Azure (open source).

For details, see [Supported features](fhir-features-supported.md). Read about what has changed between versions in the [version history for HL7 FHIR](https://hl7.org/fhir/R4/history.html).

### What's the difference between the open-source Microsoft FHIR Server for Azure and the Azure API for FHIR?

The Azure API for FHIR is a hosted and managed version of the open-source Microsoft FHIR Server for Azure. In the managed service, Microsoft provides all maintenance and updates. 

When you're running FHIR Server for Azure, you have direct access to the underlying services. But you're also responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

From a development standpoint, every feature is deployed to the open-source Microsoft FHIR Server for Azure first. Once it has been validated in open-source, it will be released to the PaaS Azure API for FHIR solution. The time between the release in open-source and PaaS depends on the complexity of the feature and other roadmap priorities. 

### What is SMART on FHIR?

SMART (Substitutable Medical Applications and Reusable Technology) on FHIR is a set of open specifications to integrate partner applications with FHIR Servers and other Health IT systems, such as Electronic Health Records and Health Information Exchanges. By creating a SMART on FHIR application, you can ensure that your application can be accessed and leveraged by a plethora of different systems.
Authentication and Azure API for FHIR. To learn more about SMART, visit [SMART Health IT](https://smarthealthit.org/).

## Azure IoT Connector for FHIR (preview)

### What is IoMT?
IoMT stands for Internet of Medical Things and it's a category of IoT devices that capture and exchange health and wellness data with other healthcare IT systems over a network. Some examples of IoMT devices include fitness and clinical wearables, monitoring sensors, activity trackers, point of care kiosks, or even a smart pill.

### How many Azure IoT Connector for FHIR (preview) do I need?
A single Azure IoT Connector for FHIR* can be used to ingest data from a large number of different types of devices. You may still decide to use different connectors for the following reasons:
- **Scale**: For public preview, Azure IoT Connector for FHIR resource capacity is fixed and expected to provide a throughput of about 200 messages per second. You may add more Azure IoT Connector for FHIR, if higher throughput is needed.
- **Device type**: You may setup a separate Azure IoT Connector for FHIR for each type of IoMT devices you have for device management reasons.

### Is there a limit on number of Azure IoT Connector for FHIR (preview) during public preview?
Yes, you can create only two Azure IoT Connector for FHIR per subscription while the feature is in public preview. This limit exists to prevent unexpected expense as the feature is available for free during the preview. On request this limit could be raised up to a maximum of five Azure IoT Connector for FHIR.

### What Azure regions Azure IoT Connector for FHIR (preview) feature is available during public preview?
Azure IoT Connector for FHIR is available in all Azure regions where Azure API for FHIR is available.

### Can I configure scaling capacity for Azure IoT Connector for FHIR (preview)?
Since Azure IoT Connector for FHIR is free of charge during public preview, its scaling capacity is fixed and limited. Azure IoT Connector for FHIR configuration available in public preview is expected to provide a throughput of about 200 messages per second. Some form of resource capacity configuration will be made available in General Availability (GA).

### What FHIR version does Azure IoT Connector for FHIR (preview) support?
Azure IoT Connector for FHIR currently supports only FHIR version R4. Hence, this feature is visible only on the R4 instances of Azure API for FHIR and Microsoft doesn't plan to support version STU3 at this time.

### Why can't I install Azure IoT Connector for FHIR (preview) when Private Link is enabled on Azure API for FHIR?
Azure IoT Connector for FHIR doesn't support Private Link capability at this time. Hence, if you have Private Link enabled on Azure API for FHIR, you can't install Azure IoT Connector for FHIR and vice-versa. This limitation is expected to go away when Azure IoT Connector for FHIR is available for General Availability (GA).

### What's the difference between the open-source IoMT FHIR Connector for Azure and Azure IoT Connector for FHIR (preview) feature of Azure API for FHIR service?
Azure IoT Connector for FHIR is a hosted and managed version of the open-source IoMT FHIR Connector for Azure. In the managed service, Microsoft provides all maintenance and updates.

When you're running IoMT FHIR Connector for Azure, you have direct access to the underlying resources. But you're also responsible for maintaining and updating the server and all required compliance work if you're storing PHI data.

From a development standpoint, every feature is deployed to the open-source IoMT FHIR Connector for Azure first. Once it has been validated in open-source, it will be released to the PaaS Azure IoT Connector for FHIR feature of Azure API for FHIR service. The time between the release in open-source and PaaS depends on the complexity of the feature and other road-map priorities.

## Next steps

In this article, you've read some of the frequently asked questions about the Azure API for FHIR. Read about the supported features in FHIR Server for Azure:
 
>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

*In the Azure portal, the Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

FHIR is the registered trademark of HL7 and is used with the permission of HL7.