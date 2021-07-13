---
title: FAQs about IoT connector in Azure Healthcare APIs
description: Get answers to frequently asked questions about IoT connector
services: healthcare-apis
author: ginalee-dotcom
ms.service: healthcare-apis
ms.topic: reference
ms.date: 06/12/2021
ms.author: ginle
---

# Frequently asked questions about IoT connector

This section covers some of the frequently asked questions about Healthcare APIs IoT connector.

### What FHIR version do you support?

Azure IoT Connector for FHIR (preview) currently supports only FHIR version R4, and is visible only on R4 instances of the FHIR service.

### Can I configure scaling capacity for Azure IoT Connector for FHIR (preview)?

Since Azure IoT Connector for FHIR is free of charge during public preview, its scaling capacity is fixed and limited. Azure IoT Connector for FHIR configuration available in public preview is expected to provide a throughput of about 200 messages per second. Some form of resource capacity configuration will be made available in General Availability (GA).

### Why can't I install Azure IoT Connector for FHIR (preview) when Private Link is enabled on Azure API for FHIR?

Azure IoT Connector for FHIR doesn't support Private Link capability at this time. Hence, if you have Private Link enabled on Azure API for FHIR, you can't install Azure IoT Connector for FHIR and vice-versa. This limitation is expected to go away when Azure IoT Connector for FHIR is available for General Availability (GA).