---
title: Add data to audit logs by using custom headers - Azure API for FHIR
description: This article describes how to add data to audit logs by using custom HTTP headers in Azure API for FHIR.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Add data to audit logs by using custom HTTP headers

In the Azure Fast Healthcare Interoperability Resources (FHIR) API, a user might want to include additional information in the logs, which comes from the calling system.

For example, when the user of the API is authenticated by an external system, that system forwards the call to the FHIR API. At the FHIR API layer, the information about the original user has been lost, because the call was forwarded. It might be necessary to log and retain this user information for auditing or management purposes. The calling system can provide user identity, caller location, or other necessary information in the HTTP headers, which will be carried along as the call is forwarded.

You can see this data flow in the following diagram:

:::image type="content" source="media/custom-headers/custom-headers-diagram.png" alt-text="Diagram of custom headers":::

You can use custom headers to capture several types of information. For example:

* Identity or authorization information
* Origin of the caller
* Originating organization
* Client system details (electronic health record, patient portal)

> [!IMPORTANT]
> Be aware that the information sent in custom headers is stored in a Microsoft internal logging system for 30 days after being available in Azure Log Monitoring. We recommend encrypting any information before adding it to custom headers. You should not pass any PHI information through customer headers.

You must use the following naming convention for your HTTP headers: X-MS-AZUREFHIR-AUDIT-AUDIT-\<name>.

These HTTP headers are included in a property bag that is added to the log. For example:

* X-MS-AZUREFHIR-AUDIT-USERID: 1234 
* X-MS-AZUREFHIR-AUDIT-USERLOCATION: XXXX
* X-MS-AZUREFHIR-AUDIT-XYZ: 1234

This information is then serialized to JSON when it's added to the properties column in the log. For example:

```json
{ "X-MS-AZUREFHIR-AUDIT-USERID" : "1234",
"X-MS-AZUREFHIR-AUDIT-USERLOCATION" : "XXXX",
"X-MS-AZUREFHIR-AUDIT-XYZ" : "1234" }
```
 
As with any HTTP header, the same header name can be repeated with different values. For example:

* X-MS-AZUREFHIR-AUDIT-USERLOCATION: HospitalA
* X-MS-AZUREFHIR-AUDIT-USERLOCATION: Emergency

When added to the log, the values are combined with a comma delimited list. For example:

{ "X-MS-AZUREFHIR-AUDIT-USERLOCATION" : "HospitalA, Emergency" }
 
You can add a maximum of 10 unique headers (repetitions of the same header with different values are only counted as one). The total maximum length of the value for any one header is 2048 characters.

If you're using the Firely C# client API library, the code looks something like this:

```C#
FhirClient client;
client = new FhirClient(serverUrl);
client.OnBeforeRequest += (object sender, BeforeRequestEventArgs e) =>
{
    // Add custom headers to be added to the logs
    e.RawRequest.Headers.Add("X-MS-AZUREFHIR-AUDIT-UserLocation", "HospitalA");
};
client.Get("Patient");
```
## Next steps
In this article, you learned how to add data to audit logs by using custom headers in the Azure API for FHIR. Next, learn about other additional settings you can configure in the Azure API for FHIR.
 
>[!div class="nextstepaction"]
>[Additional Settings](azure-api-for-fhir-additional-settings.md)