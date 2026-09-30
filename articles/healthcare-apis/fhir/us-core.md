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
- [US Core 7.0.0](http://hl7.org/fhir/us/core/STU7/)

The FHIR service doesn't store any profiles from implementation guides by default. You need to load them into the FHIR service. Follow [storing profiles instructions](./store-profiles-in-fhir.md) to store the relevant profiles for your desired US Core version. The open source sample [UploadFIG](https://github.com/brianpos/UploadFIG) can also be used to upload implementation guides to your FHIR server.

## US Core 6.1.0
US Core 6.1.0 introduces several new operations, including `$docref` and `$expand`. For more information about these operations, see the following articles:
- [`$docref` operation in FHIR service](./fhir-docref.md)
- [`$expand` operation in FHIR service](./fhir-expand.md)

### US Core 6 test data
Reference [sample test data](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/USCore6-test-data) that can be used for US Core 6 testing.  




## US Core 7.0.0

### US Core 7 test data
Reference [sample test data](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/USCore7-test-data) that can be used for US Core 7 testing.  

Note: Samples are open-source code, and you should review the information and licensing terms on GitHub before using it. They aren't part of the Azure Health Data Service and aren't supported by Microsoft Support.   

### Troubleshooting
**How do I avoid a package resolution error when uploading US Core 7?**  
If you're using [UploadFIG](https://github.com/brianpos/UploadFIG) to upload US Core 7 profiles, you might encounter a package resolution error, as one of the packages needed for US Core 7 (VSAC package) isn't yet available in the tool. To work around this issue, you can upload the required VSAC package to the tool cache following these steps:
1. Download the VSAC package: 
Download the us.nlm.vsac package version 0.18.0 from the FHIR package registry at https://packages2.fhir.org/packages/us.nlm.vsac. 
2. Prepare the VSAC package: During the US Core upload process, UploadFIG utility might encounter a package resolution error when attempting to retrieve the VSAC package from the registry. To avoid this issue, the VSAC package must be preloaded into the local UploadFIG utility cache.  
    1. Package downloaded at step 2 has name `us.nlm.vsac-0.18.0.tgz`  
    1. Rename it to `us.nlm.vsac_0_18_0.tgz`  
    1. Create this folder if it doesn’t exist: `C:\Users\<YourUser>\AppData\Local\Temp\UploadFIG\PackageCache`
    1. Copy the renamed package into the UploadFIG cache directory (folder created in the last step) 
3. Continue with the rest of the steps using UploadFIG to upload US Core 7 profiles.






[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]