---
title: Azure Health Data Services monthly releases
description: This article provides details about the Azure Health Data Services monthly features and enhancements.
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/03/2023
ms.author: kavitagaddam 
ms.custom: references_regions
---

# Release notes: Azure Health Data Services

> Azure Health Data Services is Generally Available. 
>
>For more information about Azure Health Data Services Service Level Agreements, see [SLA for Azure Health Data Services](https://azure.microsoft.com/support/legal/sla/health-data-services/v1_1/).

Azure Health Data Services is a set of managed API services based on open standards and frameworks for the healthcare industry. They enable you to build scalable and secure healthcare solutions by bringing protected health information (PHI) datasets together and connecting them end-to-end with tools for machine learning, analytics, and AI. This document provides details about the features and enhancements made to Azure Health Data Services including the different service types (FHIR service, DICOM service, and MedTech service) that seamlessly work with one another.

## July 2023
#### Azure Health Data Services

#### FHIR Service
**Bug Fix: Continous retry on Import operation**
We observed an issue where $import kept on retrying when NDJSON file size is greater than 2GB. The issue is fixed, for details visit [3342](https://github.com/microsoft/fhir-server/pull/3342).

**Bug Fix: Patient and Group level export job restart on interruption**
Patient and Group level exports on interruption would restart from the beginning. Bug is fixed to restart the export jobs from the last sucessfully completed page of results. For more details visit [3205](https://github.com/microsoft/fhir-server/pull/3205).


## June 2023
#### Azure Health Data Services

#### FHIR Service 

**Feature Enhancement: Incremental Import**
$Import operation now supports new capability of "Incremental Load" mode, which is optimized for periodically loading data into the FHIR service. 

With Incremental Load mode, customers can:
1.	Perform concurrent ingestion of data while simultaneously executing API CRUD operations on the FHIR server.
1.	Ingest versioned FHIR resources.
1.	Maintain the lastUpdated field value in FHIR resources during ingestion.

> [!IMPORTANT]
> Incremental import mode is currently in public preview
> Preview APIs and SDKs are provided without a service-level agreement. We recommend that you don't use them for production workloads. Some features might not be supported, or they might have constrained capabilities.
> For more information, review [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For details on Incremental Import, visit [Import Documentation](./../healthcare-apis/fhir/configure-import-data.md).

**Feature Enhancement: Reindex operation provides job status at resource level**

Reindex operation supports determining the status of the reindex operation with help of API call `GET {{FHIR_URL}}/_operations/reindex/{{reindexJobId}}`.
Details per resource, on the number of completed reindexed resources can be obtained with help of the new field, added in the response- "resourceReindexProgressByResource". For details, visit [3286](https://github.com/microsoft/fhir-server/pull/3286).

**Bug Fix: FHIR Search Query optimization of complex queries**

We have seen issues where complex FHIR queries with Reference Search Parameters would time out. Issue is fixed by updating the SQL query generator to use an INNER JOIN for Reference Search Parameters. For details, visit [#3295](https://github.com/microsoft/fhir-server/pull/3295).

**Bug Fix: Metadata endpoint URL in capability statement is relative URL**

Per FHIR specification, metadata endpoint URL in capability statement needs to be an absolute URL. For details on the FHIR specification, visit [Capability Statement](https://www.hl7.org/fhir/capabilitystatement-definitions.html#CapabilityStatement.url). This fix addresses the issue, for details visit [3265](https://github.com/microsoft/fhir-server/pull/3265).


#### DICOM Service

**Retrieve rendered image is GA**

[Rendered images](dicom/dicom-services-conformance-statement.md#retrieve-rendered-image-for-instance-or-frame) can now be retrieved from the DICOM service by using the new rendered endpoint.  This API allows a DICOM instance or frame to be accessed in a consumer format (`jpeg` or `png`), a capability that can simplify scenarios such as a client application displaying an image preview.  


**Fixed issue where DICOM events and Change Feed may miss changes**

The DICOM Change Feed API could previously return results that incorrectly skipped pending changes when the DICOM server was under load. Identical calls to the Change Feed resource could have resulted in new change events appearing in the middle of the result set. For example, if the first call returned sequence numbers `1`, `2`, `3`, and `5`, then the second identical call could have incorrectly returned `1`, `2`, `3`, `4`, and `5`. This behavior also impacted the DICOM events sent to Azure Event Grid System Topics, and could have resulted in missing events in downstream event handlers. For more details, see [#2611](https://github.com/microsoft/dicom-server/pull/2611).

#### MedTech service 

**Encounter identifiers included in the device message**

Customers can now include encounter identifiers in the device message so that they can look up the corresponding FHIR encounter and link it to the observation created in the FHIR transformation. This look up feature is supported in OSS and was an ask from customers for the PaaS MedTech service.


## May 2023
#### Azure Health Data Services

#### FHIR Service 

**SMART on FHIR : Fixed clinical scope mapping for applications**

This bug fix addresses issue with clinical scope not interpreted correctly for backend applications. 
For more details, visit [#3250](https://github.com/microsoft/fhir-server/pull/3250)

**Addresses duplicate key error when passed in request parameters and body**

This bug fix handles the issue, when using the POST {resourcetype}/search endpoint to query FHIR resources, the server returns 415 Unsupported Media Type. This issue is due to repeating a query parameter in the URL query string and the request body. This fix considers all the query parameters from request and body as input. For more details, visit [#3232](https://github.com/microsoft/fhir-server/pull/3232)

## April 2023
#### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in West Central US region.

#### FHIR Service 

**Fixed performance for Search Queries with identifiers**

This bug fix addresses timeout issues observed for search queries with identifiers, by leveraging OPTIMIZE clause.
For more details, visit [#3207](https://github.com/microsoft/fhir-server/pull/3207)

**Fixed transient issues associated with loading custom search parameters**

This bug fix addresses the issue, where the FHIR service would not load the latest SearchParameter status in event of failure.
For more details, visit [#3222](https://github.com/microsoft/fhir-server/pull/3222)

## March 2023
#### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in Japan East region.


## February 2023
#### FHIR  service

**Introduction of _till parameters and throughput improvement by 50x**

_till parameter is introduced as optional parameter and allows you to export resources that have been modified till the specified time. 
This feature improvement is applicable to System export, for more information on export, visit [FHIR specification](https://hl7.org/fhir/uv/bulkdata/export/index.html)

Also visit [Export your FHIR data by invoking the $export command on the FHIR service | Microsoft Learn](./../healthcare-apis/fhir/export-data.md)


**Fixed issue for Chained search with :contains modifier results with no resources are returned**

This bug-fix addresses the issue and identified resources, per search criteria with :contains modifier are returned. 

For more details, visit  [#2990](https://github.com/microsoft/fhir-server/pull/2990) 



**Provide the ability to tweak continuation token size limit with header.**


Previous to this change, during pagination Cosmos DB continuation token had a  default limit of 3Kb. With this change, customers can send Cosmos DB Continuation Token limit in the header. Valid range is set to 1-3 Kb. Header value that can be used to send this value is x-ms-documentdb-responsecontinuationtokenlimitinkb

For more details, visit  [#2971](https://github.com/microsoft/fhir-server/pull/2971/files) and [Overview of search in Azure API for FHIR | Microsoft Learn](./../healthcare-apis/azure-api-for-fhir/overview-of-search.md)


**Fixed issue related to HTTP Status code 500 was encountered when :not modifier was used with chained searches**

This bug-fix addresses the issue. Identified resources are returned per search criteria with :contains modifier . for more details on bug fix visit  [#3041](https://github.com/microsoft/fhir-server/pull/3041) 


**Versioning policy enabled at resource level still required If-match header for transaction requests.**

Bug fix addresses the issue and versioned policy at resource level does not require if-match header, for more details on bug fix visit  [#2994](https://github.com/microsoft/fhir-server/pull/2994)




#### MedTech service

**Mapping Debugger released in public-preview**

The MedTech service's new Mapping Debugger is a self-service tool that is used for creating, updating, and troubleshooting the MedTech service device and FHIR destination mappings. It enables you to easily view and make inline adjustments in real-time, without ever having to leave the Azure portal. 

For more information, visit [How to use the MedTech service Mapping debugger - Azure Health Data Services | Microsoft Learn](./../healthcare-apis/iot/how-to-use-mapping-debugger.md)



**Error Message released in private-preview**

The MedTech service now has an error message feature that allows you to easily view any errors generated, as well as the message that caused each error. You can now understand the context behind any errors without manual effort. For more info on error logs, visit [Troubleshoot errors using the MedTech service logs - Azure Health Data Services | Microsoft Learn](./../healthcare-apis/iot/troubleshoot-errors-logs.md)





#### DICOM service

**New DICOM Event Types are GA**

[DICOM Events](events/events-message-structure.md#dicom-events-message-structure) are now generally available in the HDS workspace-level event subscriptions.  These new event types enable event-driven workflows in medical imaging applications by subscribing to events for newly created and deleted DICOM images.


**Validation errors included with the FailedSOPSequence**

Previously, DICOM validation failures returned by the Store (STOW) API have lacked the detail necessary to diagnose and resolve problems.  The latest API changes improve the error messages by including additional details about the specific attributes that failed validation and the reason for the failures.  See the [conformance statement](dicom/dicom-services-conformance-statement.md#store-response-payload) for details.


#### Toolkit and Samples Open Source


Two new sample apps have been released in the open source samples repo: [Azure-Samples/azure-health-data-services-samples: Samples for using the Azure Health Data Services (github.com)](https://github.com/Azure-Samples/azure-health-data-services-samples)






## January 2023

#### Azure Health Data Services

**Azure Health Data services General Available (GA) in new regions**

General availability (GA) of Azure Health Data services in France Central, North Central US and Qatar Central Regions.


#### DICOM service

**Added support for `ModalitiesInStudy` attribute**

The DICOM service now supports `ModalitiesInStudy` as a [searchable attribute](dicom/dicom-services-conformance-statement.md#searchable-attributes) at the Study, Series, and Instance level.  Support for this attribute allows for the list of modalities in a study to be returned more efficiently, without needing to query each series independently.  


**Added support for `NumberOfStudyRelatedInstances` and `NumberOfSeriesRelatedInstances` attributes**

Two new attributes for returning the count of Instances in a Study or Series are available in Search [responses](dicom/dicom-services-conformance-statement.md#additional-series-tags).  



#### Toolkit and Samples Open Source


**New sample app has been released**

One new sample app has been released in the [Health Data Services samples repo](https://github.com/Azure-Samples/azure-health-data-services-samples)


## **December 2022**


#### DICOM service


 **DICOM Events available in public preview**

Azure Health Data Services [Events](events/events-overview.md) now include a public preview of [two new event types](events/events-message-structure.md#dicom-events-message-structure) for the DICOM service.  These new event types enable applications that use Event Grid to use event-driven workflows when DICOM images are created or deleted.


## **November 2022**
#### FHIR service

**Fixed the Error generated when resource is updated using if-match header and PATCH**

Bug is now fixed and Resource will be updated if matches the Etag header. For details , see [#2877](https://github.com/microsoft/fhir-server/issues/2877)


#### Toolkit and Samples Open Source


**Azure Health Data Services Toolkit is released**

The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit), which was previously in a pre-release state, is now in **Public Preview** . The toolkit is open-source project and allows customers to more easily customize and extend the functionality of their Azure Health Data Services implementations. The NuGet packages of the toolkit are available for download from the NuGet gallery, and you can find links to them from the repo documentation. 

## **October 2022**
#### MedTech service


 **Added Deploy to Azure button**

 Customers can now deploy the MedTech service fully, including Event Hubs, AHDS workspace, FHIR service, MedTech service, and managed identity roles, all by clicking the "Deploy to Azure" button. [Deploy the MedTech service using an Azure Resource Manager template](./iot/deploy-new-arm.md)



**Added the Dropped Event Metrics**

Customers can now determine if their mappings are working as intended, as they can now see dropped events as a metric to ensure that data is flowing through accurately. 


## **September 2022**

#### Azure Health Data Services 

**Fixed issue where Querying with :not operator was returning more results than expected** 

The issue is now fixed and querying with :not operator should provide correct results. For more information, see [#2790](https://github.com/microsoft/fhir-server/pull/2785). 



#### FHIR Service 


**Provided an Error message for failure in export resulting from long time span**

With failure in export job due to a long time span, customer will see `RequestEntityTooLarge` HTTP status code. For more information, see [#2790](https://github.com/microsoft/fhir-server/pull/2790).

**Fixed issue in a query sort, where functionality throws an error when chained search is performed with same field value.**

The functionality now returns a response. For more information, see [#2794](https://github.com/microsoft/fhir-server/pull/2794). 

**Fixed issue where Server doesn't indicate `_text` not supported**

 When passed as URL parameter,`_text` returns an error in response when using the `Prefer` heading with `value handling=strict`. For more information, see [#2779](https://github.com/microsoft/fhir-server/pull/2779).

**Added a Verbose error message for invalid resource type**

Verbose error message is added when resource type is invalid or empty for `_include` and `_revinclude` searches. For more information, see [#2776](https://github.com/microsoft/fhir-server/pull/2776).

#### DICOM service


**Export is Generally Available (GA)**

The export feature for the DICOM service is now generally available. Export enables a user-supplied list of studies, series, and/or instances to be exported in bulk to an Azure Storage account. Learn more about the [export feature](dicom/export-dicom-files.md).

**Improved deployment performance**  

Performance improvements have cut the time to deploy new instances of the DICOM service by more than 55% at the 50th percentile.

**Reduced strictness when validating STOW requests**

Some customers have run into issues storing DICOM files that do not perfectly conform to the specification.  To enable those files to be stored in the DICOM service, we have reduced the strictness of the validation performed on STOW. 

The service will now accept the following: 
* DICOM UIDs that contain trailing whitespace 
* IS, DS, SV, and UV VRs that are not valid numbers
* Invalid private creator tags

#### Toolkit and Samples Open Source

**The [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit) is now in the public preview.** 

The toolkit is open-source and allows to easily customize and extend the functionality of their Azure Health Data Services implementations.  

## **August 2022**

#### FHIR service

**Azure Health Data services availability expands to new regions**

 Azure Health Data services is now available in the following regions:  Central India, Korea Central, and Sweden Central.  
 
**`$import` is Generally Available.**

 `$import` API is now generally available in Azure Health Data Services API version 2022-06-01. See [Executing the import](./../healthcare-apis/fhir/import-data.md) by invoking the `$import` operation on FHIR service in Azure Health Data Services.

**`$convert-data` updated by adding STU3-R4 support.**

`$convert-data` added support for FHIR STU3-R4 conversion. See [Data conversion for Azure API for FHIR](./../healthcare-apis/azure-api-for-fhir/convert-data.md). 

  
**Analytics pipeline now supports data filtering.**

 Data filtering is now supported in FHIR to data lake pipeline. See [FHIR-Analytics-Pipelines_Filter FHIR data](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Filter%20FHIR%20data%20in%20pipeline.md) microsoft/FHIR-Analytics-Pipelines github.com. 


**Analytics pipeline now supports FHIR extensions.**

Analytics pipeline can process FHIR extensions to generate parquet data. See [FHIR-Analytics-Pipelines_Process](https://github.com/microsoft/FHIR-Analytics-Pipelines/blob/main/FhirToDataLake/docs/Process%20FHIR%20extensions.md) in pipeline.md at main.


**Fixed issue related to History bundles being sorted with the oldest version first.** 

We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per FHIR specification, the sorting of versions defaults to the oldest version last.This bug fix, addresses FHIR server behavior for sorting history bundle. <br><br>We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP GET command utilized for retrieving history. <br><br>For example: `<server URL>/_history?_sort=_lastUpdated` <br><br>For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689).

**Fixed issue where Queries were not providing consistent result count after appended with `_sort` operator.**
The issue is now fixed and queries should provide consistent result count, with and without sort operator. 


#### MedTech service


**Added New Metric Chart** 

Customers can now see predefined metrics graphs in the MedTech landing page, complete with alerts to ease customers' burden of monitoring their MedTech service.  

**Availability of Diagnostic Logs**

There are now pre-defined queries with relevant logs for common issues so that customers can easily debug and diagnose issues in their MedTech service.

#### DICOM service


**Modality worklists (UPS-RS) is Generally Available (GA)**.  

The modality worklists (UPS-RS) service is now generally available. Learn more about the [worklists service](./../healthcare-apis/dicom/dicom-services-conformance-statement.md). 

## July 2022

#### FHIR service


**(Open Source) History bundles were sorted with the oldest version first.**
We've recently identified an issue with the sorting order of history bundles on FHIR® server. History bundles were sorted with the oldest version first. Per [FHIR specification](https://hl7.org/fhir/http.html#history), the sorting of versions defaults to the oldest version last. This bug fix, addresses FHIR server behavior for sorting history bundle.<br /><br />We understand if you would like to keep the sorting per existing behavior (oldest version first). To support existing behavior, we recommend you append `_sort=_lastUpdated` to the HTTP `GET` command utilized for retrieving history. <br /><br />For example: `<server URL>/_history?_sort=_lastUpdated` <br /><br />For more information, see [#2689](https://github.com/microsoft/fhir-server/pull/2689). 


### MedTech service 

**Improvements to documentations for Events and MedTech and availability zones.**

Tested and enhanced usability and functionality. Added new documents to enable customers to better take advantage of the new improvements. See [Consume Events with Logic Apps](./../healthcare-apis/events/events-deploy-portal.md) and [Deploy Events Using the Azure portal](./../healthcare-apis/events/events-deploy-portal.md). 


**One touch launch Azure MedTech deploy.**

[Deploy the MedTech Service in the Azure portal](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md)

#### DICOM service

#### **Features**

**DICOM Service availability expands to new regions.**

The DICOM Service is now available in the following [regions](https://azure.microsoft.com/global-infrastructure/services/): Southeast Asia, Central India, Korea Central, and Switzerland North. 

**Fast retrieval of individual DICOM frames**

For DICOM images containing multiple frames, performance improvements have been made to enable fast retrieval of individual frames (60 KB frames as fast as 60 MS). These improved performance characteristics enable workflows such as [viewing digital pathology images](https://microsofthealth.visualstudio.com/DefaultCollection/Health/_git/marketing-azure-docs?version=GBmain&path=%2Fimaging%2Fdigital-pathology%2FDigital%20Pathology%20using%20Azure%20DICOM%20service.md&_a=preview), which require rapid retrieval of individual frames. 

## June 2022

#### FHIR service

**Fixed issue with Export Job not being queued for execution.**
Fixes issue with export job not being queued due to duplicate job definition caused due to reference to container URL. For more information, see [#2648](https://github.com/microsoft/fhir-server/pull/2648). 

**Fixed issue related to Queries not providing consistent result count after appended with the `_sort` operator.**

Fixes the issue with the help of distinct operator to resolve inconsistency and record duplication in response.  For more information, see [#2680](https://github.com/microsoft/fhir-server/pull/2680). 


## May 2022

#### FHIR service

**Removes SQL retry on upsert**

Removes retry on SQL command for upsert. The error still occurs, but data is saved correctly in success cases. For more information, see [#2571](https://github.com/microsoft/fhir-server/pull/2571). 

**Added handling for SqlTruncate errors**

Added a check for SqlTruncate exceptions and tests. In particular, exceptions and tests will catch SqlTruncate exceptions for Decimal type based on the specified precision and scale. For more information, see [#2553](https://github.com/microsoft/fhir-server/pull/2553). 

#### DICOM service

**DICOM service supports cross-origin resource sharing (CORS)**

DICOM service now supports [CORS](./../healthcare-apis/dicom/configure-cross-origin-resource-sharing.md). CORS allows you to configure settings so that applications from one domain (origin) can access resources from a different domain, known as a cross-domain request. 

**DICOMcast supports Private Link**

DICOMcast has been updated to support Azure Health Data Services workspaces that have been configured to use [Private Link](./../healthcare-apis/healthcare-apis-configure-private-link.md). 

**UPS-RS supports Change and Retrieve work item**  

Modality worklist (UPS-RS) endpoints have been added to support Change and Retrieve operations for work items. 

**API version is now required as part of the URI**

All REST API requests to the DICOM service must now include the API version in the URI. For more information, see [API versioning for DICOM service](./../healthcare-apis/dicom/api-versioning-dicom-service.md). 

**Index the first value for DICOM tags that incorrectly specify multiple values**

Attributes that are defined to have a single value but have specified multiple values will now be leniently accepted. The first value for such attributes will be indexed.

## April 2022

#### FHIR service


** Added FHIRPath Patch**
FHIRPath Patch was added as a feature to both the Azure API for FHIR. This implements FHIRPath Patch as defined on the [HL7](http://hl7.org/fhir/fhirpatch.html) website. 


**Handles invalid header on versioned update**

 When the versioning policy is set to "versioned-update", we required that the most recent version of the resource is provided in the request's if-match header on an update. The specified version must be in ETag format. Previously, a 500 would be returned if the version was invalid or in an incorrect format. This update now returns a 400 Bad Request. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 


**Bulk import in public preview**
The bulk-import feature enables importing FHIR data to the FHIR server at high throughput using the $import operation. It's designed for initial data load into the FHIR server. For more information, see [Bulk-import FHIR data (Preview)](./../healthcare-apis/fhir/import-data.md). 


**Added back the core to resource path**

 Part of the path to a string resource was accidentally removed in the versioning policy. This fix adds it back in. For more information, see [PR #2470](https://github.com/microsoft/fhir-server/pull/2470). 



#### DICOM service


**Reduced the strictness of validation applied to incoming DICOM files** 

When value representation (VR) is a decimal string (DS)/ integer string (IS), `fo-dicom` serialization treats value as a number. Customer DICOM files could be old and contains invalid numbers. Our service blocks such file upload due to the serialization exception. For more information, see [PR #1450](https://github.com/microsoft/dicom-server/pull/1450). 

**Correctly parse a range of input in the content negotiation headers**

Currently, WADO with Accept: multipart/related; type=application/dicom will throw an error. It will accept Accept: multipart/related; type="application/dicom", but they should be equivalent. For more information, see [PR #1462](https://github.com/microsoft/dicom-server/pull/1462). 


**Fixed an issue where parallel upload of images in a study could fail under certain circumstances**

Handle race conditions during parallel instance inserts in the same study. For more information, see [PR #1491](https://github.com/microsoft/dicom-server/pull/1491) and [PR #1496](https://github.com/microsoft/dicom-server/pull/1496). 

## March 2022

#### Azure Health Data Services 

**Private Link is now available**
With Private Link, you can access Azure Health Data Services securely from your VNet as a first-party service without having to go through a public Domain Name System (DNS). For more information, see [Configure Private Link for Azure Health Data Services](./../healthcare-apis/healthcare-apis-configure-private-link.md).   

### FHIR service

**FHIRPath Patch operation available**
|This new feature enables you to use the FHIRPath Patch operation on FHIR resources. For more information, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](./../healthcare-apis/fhir/fhir-rest-api-capabilities.md). 


**SQL timeout that returns 408 status code**
Previously, a SQL timeout would return a 500. Now a timeout in SQL will return a FHIR OperationOutcome with a 408 status code. For more information, see [PR #2497](https://github.com/microsoft/fhir-server/pull/2497). 

**Fixed issue related to duplicate resources in search with `_include`**
Fixed issue where a single resource can be returned twice in a search that has `_include`. For more information, see [PR #2448](https://github.com/microsoft/fhir-server/pull/2448). 


**Fixed issue PUT creates on versioned update**
Fixed issue where creates with PUT resulted in an error when the versioning policy is configured to `versioned-update`. For more information, see [PR #2457](https://github.com/microsoft/fhir-server/pull/2457). 

**Invalid header handling on versioned update**

 Fixed issue where invalid `if-match` header would result in an HTTP 500 error. Now an HTTP Bad Request is returned instead. For more information, see [PR #2467](https://github.com/microsoft/fhir-server/pull/2467). 

#### MedTech service

**The Events feature within Health Data Services is now generally available (GA).**

 The Events feature allows customers to receive notifications and triggers when FHIR observations are created, updated, or deleted. For more information, see [Events message structure](./../healthcare-apis/events/events-message-structure.md) and [What are events?](./../healthcare-apis/events/events-overview.md). 

**Events documentation for Azure Health Data Services**
Updated docs to allow for better understanding, knowledge, and help for Events as it went GA. Updated troubleshooting for ease of use for the customer. 

**One touch deploy button for MedTech service launch in the portal**
Enables easier deployment and use of MedTech service for customers without the need to go back and forth between pages or interfaces.  

## January 2022


**Export FHIR data behind firewalls**
This new feature enables exporting FHIR data to storage accounts behind firewalls. For more information, see [Configure export settings and set up a storage account](./././fhir/configure-export-data.md). 

**Deploy Azure Health Data Services with Azure Bicep**
This new feature enables you to deploy Azure Health Data Services using Azure Bicep. For more information, see [Deploy Azure Health Data Services using Azure Bicep](deploy-healthcare-apis-using-bicep.md). 

#### DICOM service


**Customers can define their own query tags using the Extended Query Tags feature**

With Extended Query Tags feature, customers now efficiently query non-DICOM metadata for capabilities like multi-tenancy and cohorts. It's available for all customers in Azure Health Data Services.  

## December 2021

#### Azure Health Data Services 


**Quota details for support requests**
We've updated the quota details for customer support requests with the latest information. 

**Local RBAC documentation updated **

We've updated the local RBAC documentation to clarify the use of the secondary tenant and the steps to disable it. 

**Deploy and configure Azure Health Data Services using scripts**

We've started the process of providing PowerShell, CLI scripts, and ARM templates to configure app registration and role assignments. Scripts for deploying Azure Health Data Services will be available after GA. 

#### FHIR service


**Added Publisher to `CapabilityStatement.name`**

You can now find the publisher in the capability statement at `CapabilityStatement.name`. [#2319](https://github.com/microsoft/fhir-server/pull/2319) 


**Log `FhirOperation` linked to anonymous calls to Request metrics**

 We weren't logging operations that didn’t require authentication. We extended the ability to get `FhirOperation` type in `RequestMetrics` for anonymous calls. [#2295](https://github.com/microsoft/fhir-server/pull/2295) 

**Fixed 500 error when `SearchParameter` Code is null**

Fixed an issue with `SearchParameter` if it had a null value for Code, the result would be a 500. Now it will result in an  `InvalidResourceException` like the other values do. [#2343](https://github.com/microsoft/fhir-server/pull/2343)
 
**Returned `BadRequestException` with valid message when input JSON body is invalid**

For invalid JSON body requests, the FHIR server was returning a 500 error. Now we'll return a `BadRequestException` with a valid message instead of 500. [#2239](https://github.com/microsoft/fhir-server/pull/2239) 


**Handled SQL Timeout issue**

If SQL Server timed out, the PUT `/resource{id}` returned a 500 error. Now we handle the 500 error and return a timeout exception with an operation outcome. [#2290](https://github.com/microsoft/fhir-server/pull/2290) 

## November 2021

#### FHIR service

#### **Feature enhancements**

**Process Patient-everything links**

We've expanded the Patient-everything capabilities to process patient links [#2305](https://github.com/microsoft/fhir-server/pull/2305). For more information, see [Patient-everything in FHIR](./../healthcare-apis/fhir/patient-everything.md#processing-patient-links) documentation. 

**Added software name and version to capability statement.**
In the capability statement, the software name now distinguishes if you're using Azure API for FHIR or Azure Health Data Services. The software version will now specify which open-source [release package](https://github.com/microsoft/fhir-server/releases) is live in the managed service [#2294](https://github.com/microsoft/fhir-server/pull/2294). Addresses: [#1778](https://github.com/microsoft/fhir-server/issues/1778) and [#2241](https://github.com/microsoft/fhir-server/issues/2241) 


**Compress continuation tokens**

In certain instances, the continuation token was too long to be able to follow the [next link](./../healthcare-apis/fhir/overview-of-search.md#pagination) in searches and would result in a 404. To resolve this, we compressed the continuation token to ensure it stays below the size limit [#2279](https://github.com/microsoft/fhir-server/pull/2279). Addresses issue [#2250](https://github.com/microsoft/fhir-server/issues/2250). 

**FHIR service autoscale**

The [FHIR service autoscale](./fhir/fhir-service-autoscale.md) is designed to provide optimized service scalability automatically to meet customer demands when they perform data transactions in consistent or various workloads at any time. It's available in all [regions](https://azure.microsoft.com/global-infrastructure/services/) where the FHIR service is supported. 


**Resolved 500 error when the date was passed with a time zone.**

This fix addresses a 500 error when a date with a time zone was passed into a datetime field [#2270](https://github.com/microsoft/fhir-server/pull/2270). 


**Resolved issue when posting a bundle with incorrect Media Type returned a 500 error.**

Previously when posting a search with a key that contains certain characters, a 500 error is returned. This fixes issue [#2264](https://github.com/microsoft/fhir-server/pull/2264) and addresses [#2148](https://github.com/microsoft/fhir-server/issues/2148). 

#### DICOM service

**Content-Type header now includes transfer-syntax.**

This enhancement enables the user to know which transfer syntax is used in case multiple accept headers are being supplied. 

## October 2021

#### Azure Health Data Services 

**Test Data Generator tool**

We've updated Azure Health Data Services GitHub samples repo to include a [Test Data Generator tool](https://github.com/microsoft/healthcare-apis-samples/blob/main/docs/HowToRunPerformanceTest.md) using Synthea data. This tool is an improvement to the open source [public test projects](https://github.com/ShadowPic/PublicTestProjects), based on Apache JMeter that can be deployed to Azure AKS for performance tests. 

#### FHIR service



**Added support for [_sort](././../healthcare-apis/fhir/overview-of-search.md#search-result-parameters) on strings and dateTime.**
[#2169](https://github.com/microsoft/fhir-server/pull/2169)  


**Fixed issue where [Conditional Delete](././../healthcare-apis/fhir/fhir-rest-api-capabilities.md#conditional-delete) could result in an infinite loop.**[#2269](https://github.com/microsoft/fhir-server/pull/2269) 


**Resolved 500 error possibly caused by a malformed transaction body in a bundle POST.** We've added a check that the URL is populated in the [transaction bundle](././..//healthcare-apis/fhir/fhir-features-supported.md#rest-api) requests.**[#2255](https://github.com/microsoft/fhir-server/pull/2255) 

#### **DICOM service**


**Regions**

**South Brazil and Central Canada.** For more information about Azure regions and availability zones, see [Azure services that support availability zones](https://azure.microsoft.com/global-infrastructure/services/). 


**Extended Query tags**
DateTime (DT) and Time (TM) Value Representation (VR) types 


**Implemented fix to workspace names.**
Enabled DICOM service to work with workspaces that have names beginning with a letter. 



## September 2021

#### FHIR service



**Added support for conditional patch**

 
[Conditional patch](./././azure-api-for-fhir/fhir-rest-api-capabilities.md#patch-and-conditional-patch)
[#2163](https://github.com/microsoft/fhir-server/pull/2163)

 
Added conditional patch audit event.  [#2213](https://github.com/microsoft/fhir-server/pull/2213) 

**Allow JSON patch in bundles**


Allows for search history bundles with Patch requests. [#2156](https://github.com/microsoft/fhir-server/pull/2156) 


Enabled JSON patch in bundles using Binary resources. [#2143](https://github.com/microsoft/fhir-server/pull/2143) 


Added new audit event [OperationName subtypes](./././azure-api-for-fhir/enable-diagnostic-logging.md#audit-log-details) [#2170](https://github.com/microsoft/fhir-server/pull/2170) 



**Running a reindex job**

 
Added [boundaries for reindex](./././azure-api-for-fhir/how-to-run-a-reindex.md#performance-considerations) parameters. 
[#2103](https://github.com/microsoft/fhir-server/pull/2103)


Updated error message for reindex parameter boundaries[#2109](https://github.com/microsoft/fhir-server/pull/2109)


Added final reindex count check.[#2099](https://github.com/microsoft/fhir-server/pull/2099)

**Bug fixes** 


Wider catch for exceptions during applying patch [#2192](https://github.com/microsoft/fhir-server/pull/2192)


Fix history with PATCH in STU3[#2177](https://github.com/microsoft/fhir-server/pull/2177) 

**Custom search bugs** 


Addresses the delete failure with Custom Search parameters [#2133](https://github.com/microsoft/fhir-server/pull/2133) 


Added retry logic while Deleting Search parameter [#2121](https://github.com/microsoft/fhir-server/pull/2121)


Set max item count in search options in SearchParameterDefinitionManager [#2141](https://github.com/microsoft/fhir-server/pull/2141)


Better exception if there's a bad expression in a search parameter [#2157](https://github.com/microsoft/fhir-server/pull/2157)

**Resolved SQL batch reindex if one resource fails** 
Updates SQL batch reindex retry logic [#2118](https://github.com/microsoft/fhir-server/pull/2118) 

**GitHub issues closed** 


Unclear error message for conditional create with no ID [#2168](https://github.com/microsoft/fhir-server/issues/2168) 

#### **DICOM service**

**Implemented fix to resolve QIDO paging-ordering issues**  [#989](https://github.com/microsoft/dicom-server/pull/989) 


#### **MedTech service**


**MedTech service normalized improvements with calculations to support and enhance health data standardization.** 

See [Use device mappings](./../healthcare-apis/iot/how-to-use-device-mappings.md) and [CalculatedContent](./../healthcare-apis/iot/how-to-use-calculatedcontent-mappings.md)  




## Next steps


In this article, you learned about the features and enhancements made to Azure Health Data Services. For more information about the known issues with Azure Health Data Services, see

>[!div class="nextstepaction"]
>[Known issues: Azure Health Data Services](known-issues.md)

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
