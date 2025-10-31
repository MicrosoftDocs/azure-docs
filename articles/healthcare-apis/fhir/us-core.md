---
title: US Core
description: Overview of US Core in Azure Health Data Services FHIR
author: evachen96
ms.author: evach
ms.service: azure-health-data-services
ms.topic: overview #Required; leave this attribute/value as-is.
ms.date: 10/10/2025

---

# US Core

The HL7 US Core Implementation Guide (US Core IG) is a set of rules and best practices that help healthcare providers share patient information safely and efficiently across the United States. The Azure Health Data Services FHIR server supports the following US Core versions:

- [US Core 3.1.1](https://hl7.org/fhir/us/core/STU3.1.1/index.html)
- [US Core 6.1.0](https://www.hl7.org/fhir/us/core/STU6.1/ImplementationGuide-hl7.fhir.us.core.html)

The FHIR service doesn't store any profiles from implementation guides by default. You need to load them into the FHIR service. Follow [storing profiles instructions](./store-profiles-in-fhir.md) to store the relevant profiles for your desired US Core version. 

## US Core 6.1.0
US Core 6.1.0 introduces several new operations, including `$docref` and `$expand`. For more information about these operations, see the following articles:
- [`$docref` operation in FHIR service](./fhir-docref.md)
- [`$expand` operation in FHIR service](./fhir-expand.md)

### US Core 6 test data
Reference [sample test data](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/USCore6-test-data) that can be used for US Core 6 testing.  

Note: Samples are open-source code, and you should review the information and licensing terms on GitHub before using it. They aren't part of the Azure Health Data Service and aren't supported by Microsoft Support.   

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]