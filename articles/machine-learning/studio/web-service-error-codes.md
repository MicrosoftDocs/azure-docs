---
title: REST API error codes - Azure Machine Learning Studio | Microsoft Docs
description: These error codes could be returned by an operation on an Azure Machine Learning web service.
keywords: 
services: machine-learning
documentationcenter: ''
author: xiaoharper
ms.custom: seodec18
ms.author: amlstudiodocs

editor: cgronlun
ms.assetid: 0923074b-3728-439d-a1b8-8a7245e39be4
ms.service: machine-learning
ms.subservice: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 11/16/2016
---
 
# Azure Machine Learning Studio REST API Error Codes
 
The following error codes could be returned by an operation on an Azure Machine Learning Studio web service.
 
## BadArgument (HTTP status code 400)
 
Invalid argument provided.
 
This class of errors means an argument provided somewhere was invalid. This could be a credential or location of Azure storage to something passed to the web service. Please look at the error “code” field in the “details” section to diagnose which specific argument was invalid.
 
| Error code | User message |
| ---------- |--------------|
| BadParameterValue | The parameter value supplied does not satisfy the parameter rule on the parameter |
| BadSubscriptionId | The subscription Id that is used to score is not the one present in the resource |
| BadVersionCall | Invalid version parameter was passed during the API call: {0}. Check the API help page for passing the correct version and try again. |
| BatchJobInputsNotSpecified | The following required input(s) were not specified with the request: {0}. Please ensure all input data is specified and try again. |
| BatchJobInputsTooManySpecified | The request specified more inputs than defined in the service. List of accepted input(s): {0}. Please ensure all input data is specified correctly and try again. |
| BlobNameTooLong | Azure blob storage path provided for diagnostic output is too long: {0}. Shorten the path and try again. |
| BlobNotFound | Unable to access the provided Azure blob - {0}.  Azure error message: {1}. |
| ContainerIsEmpty | No Azure storage container name was provided. Provide a valid container name and try again. |
| ContainerSegmentInvalid | Invalid container name. Provide a valid container name and try again. |
| ContainerValidationFailed | Blob container validation failed with this error: {0}. |
| DataTypeNotSupported | Unsupported data type provided. Provide valid data type(s) and try again. |
| DuplicateInputInBatchCall | The batch request is invalid. Cannot specify both single and multiple input at the same time. Remove one of these items from the request and try again. |
| ExpiryTimeInThePast | Expiry time provided is in the past: {0}. Provide a future expiry time in UTC and try again. To never expire, set expiry time to NULL. |
| IncompleteSettings | Diagnostics settings are incomplete. |
| InputBlobRelativeLocationInvalid | No Azure storage blob name provided. Provide a valid blob name and try again. |
| InvalidBlob | Invalid blob specification for blob: {0}. Verify that connection string / relative path or SAS token specification is correct and try again. |
| InvalidBlobConnectionString | The connection string specified for one of the input/output blobs in invalid: {0}. Please correct this and try again. |
| InvalidBlobExtension | The blob reference: {0} has an invalid or missing file extension. Supported file extensions for this output type are: "{1}". |
| InvalidInputNames | Invalid service input name(s) specified in the request: {0}. Please map the input data to the correct service inputs and try again. |
| InvalidOutputOverrideName | Invalid output override name: {0}. The service does not have an output node with this name. Please pass in a correct output node name to override (case sensitivity applies). |
| InvalidQueryParameter | Invalid query parameter '{0}'. {1} |
| MissingInputBlobInformation | Missing Azure storage blob information. Provide a valid connection string and relative path or URI and try again. |
| MissingJobId | No job Id provided. A job Id is returned when a job was submitted for the first time. Verify the job Id is correct and try again. |
| MissingKeys | No Keys provided or one of Primary or Secondary Key is not provided. |
| MissingModelPackage | No model package Id or model package provided. Provide a valid model package Id or model package and try again. |
| MissingOutputOverrideSpecification | The request is missing the blob specification for output override {0}. Please specify a valid blob location with the request, or remove the output specification if no location override is desired. |
| MissingRequestInput | The web service expects an input, but no input was provided. Ensure valid inputs are provided based on the published input ports in the model and try again. |
| MissingRequiredGlobalParameters | Not all required web service parameter(s) provided. Verify the parameter(s) expected for the module(s) are correct and try again. |
| MissingRequiredOutputOverrides | When calling an encrypted service endpoint it is mandatory to pass in output overrides for all the service's outputs. Missing overrides at this time for these outputs: {0} |
| MissingWebServiceGroupId | No web service group Id provided. Provide a valid web service group Id and try again. |
| MissingWebServiceId | No web service Id provided. Provide a valid web service Id and try again. |
| MissingWebServicePackage | No web Service package provided. Provide a valid web service package and try again. |
| MissingWorkspaceId | No workspace Id provided. Provide a valid workspace Id and try again. |
| ModelConfigurationInvalid | Invalid model configuration in the model package. Ensure the model configuration contains output endpoint(s) definition, std error endpoint, and std out endpoint and try again. |
| ModelPackageIdInvalid | Invalid model package Id. Verify that the model package Id is correct and try again. |
| RequestBodyInvalid | No request body provided or error in deserializing the request body. |
| RequestIsEmpty | No request provided. Provide a valid request and try again. |
| UnexpectedParameter | Unexpected parameters provided. Verify all parameter names are spelled correctly, only expected parameters are passed, and try again. |
| UnknownError | Unknown error. |
| UserParameterInvalid | {0} |
| WebServiceConcurrentRequestRequirementInvalid | Cannot change concurrent requests requirements for {0} web service. |
| WebServiceIdInvalid | Invalid web service id provided. Web service id should be a valid guid. |
| WebServiceTooManyConcurrentRequestRequirement | Cannot set concurrent request requirement to more than {0}. |
| WebServiceTypeInvalid | Invalid web service type provided. Verify the valid web service type is correct and try again. Valid web service types: {0}. |
 
## BadUserArgument (HTTP status code 400)
 
Invalid user argument provided.
 
| Error code | User message |
| ---------- |--------------|
| InputMismatchError | Input data does not match input port schema. |
| InputParseError | Parsing of input vector failed.  Verify the input vector has the correct number of columns and data types.  Additional details: {0}. |
| MissingRequiredGlobalParameters | Parameter(s) expected by the web service are missing. Verify all the required parameters expected by the web service are correct and try again. |
| UnexpectedParameter | Verify only the required parameters expected by the web service are passed and try again. |
| UserParameterInvalid | {0} |
 
## InvalidOperation (HTTP status code 400)
 
The request is invalid in the current context.
 
| Error code | User message |
| ---------- |--------------|
| CannotStartJob | The job cannot be started because it is in {0} state. |
| IncompatibleModel | The model is incompatible with the request version. The request version only supports single datatable output models. |
| MultipleInputsNotAllowed | The model does not allow multiple inputs. |
 
## LibraryExecutionError (HTTP status code 400)
 
Module execution encountered an internal library error.
 
 
## ModuleExecutionError (HTTP status code 400)
 
Module execution encountered an error.
 
 
## WebServicePackageError (HTTP status code 400)
 
Invalid web service package. Verify the web service package provided is correct and try again.
 
| Error code | User message |
| ---------- |--------------|
| FormatError | The web service package is malformed. Details: {0} |
| RuntimesError | The web service package graph is invalid. Details: {0} |
| ValidationError | The web service package graph is invalid. Details: {0} |
 
## Unauthorized (HTTP status code 401)
 
Request is unauthorized to access resource.
 
| Error code | User message |
| ---------- |--------------|
| AdminRequestUnauthorized | Unauthorized |
| ManagementRequestUnauthorized | Unauthorized |
| ScoreRequestUnauthorized | Invalid credentials provided. |
 
## NotFound (HTTP status code 404)
 
Resource not found.
 
| Error code | User message |
| ---------- |--------------|
| ModelPackageNotFound | Model package not found. Verify the model package Id is correct and try again. |
| WebServiceIdNotFoundInWorkspace | Web service under this workspace not found. There is a mismatch between the webServiceId and the workspaceId. Verify the web service provided is part of the workspace and try again. |
| WebServiceNotFound | Web service not found. Verify the web service Id is correct and try again. |
| WorkspaceNotFound | Workspace not found. Verify the workspace Id is correct and try again. |
 
## RequestTimeout (HTTP status code 408)
 
The operation could not be completed within the permitted time.
 
| Error code | User message |
| ---------- |--------------|
| RequestCanceled | Request was canceled by the client. |
| ScoreRequestTimeout | Execution request timed out. |
 
## Conflict (HTTP status code 409)
 
Resource already exists.
 
| Error code | User message |
| ---------- |--------------|
| ModelOutputMetadataMismatch | Invalid output parameter name. Try using the metadata editor module to rename columns and try again. |
 
## MemoryQuotaViolation (HTTP status code 413)
 
The model had exceeded the memory quota assigned to it.
 
| Error code | User message |
| ---------- |--------------|
| OutOfMemoryLimit | The model consumed more memory than was appropriated for it. Maximum allowed memory for the model is {0} MB. Please check your model for issues. |
 
## InternalError (HTTP status code 500)
 
Execution encountered an internal error.
 
| Error code | User message |
| ---------- |--------------|
| AdminAuthenticationFailed |  |
| BackendArgumentError |  |
| BackendBadRequest |  |
| ClusterConfigBlobMisconfigured |  |
| ContainerProcessTerminatedWithSystemError | The container process crashed with system error |
| ContainerProcessTerminatedWithUnknownError | The container process crashed with unknown error |
| ContainerValidationFailed | Blob container validation failed with this error: {0}. |
| DeleteWebServiceResourceFailed |  |
| ExceptionDeserializationError |  |
| FailedGettingApiDocument |  |
| FailedStoringWebService |  |
| InvalidMemoryConfiguration | InvalidMemoryConfiguration, ConfigValue: {0} |
| InvalidResourceCacheConfiguration |  |
| InvalidResourceDownloadConfiguration |  |
| InvalidWebServiceResources |  |
| MissingTaskInstance | No arguments provided. Verify that valid arguments are passed and try again. |
| ModelPackageInvalid |  |
| ModuleExecutionFailed |  |
| ModuleLoadFailed |  |
| ModuleObjectCloneFailed |  |
| OutputConversionFailed |  |
| PortDataTypeNotSupported | Port id={0} has an unsupported data type: {1}. |
| ResourceDownload |  |
| ResourceLoadFailed |  |
| ServiceUrisNotFound |  |
| SwaggerGeneration | Swagger generation failed, Details: {0} |
| UnexpectedScoreStatus |  |
| UnknownBackendErrorResponse |  |
| UnknownError |  |
| UnknownJobStatusCode | Unknown job status code {0}. |
| UnknownModuleError |  |
| UpdateWebServiceResourceFailed |  |
| WebServiceGroupNotFound |  |
| WebServicePackageInvalid | InvalidWebServicePackage, Details: {0} |
| WorkerAuthorizationFailed |  |
| WorkerUnreachable |  |
 
## InternalErrorSystemLowOnMemory (HTTP status code 500)
 
Execution encountered an internal error. System low on memory. Please try again.
 
 
## ModelPackageFormatError (HTTP status code 500)
 
Invalid model package. Verify the model package provided is correct and try again.
 
 
## WebServicePackageInternalError (HTTP status code 500)
 
Invalid web service package. Verify the web package provided is correct and try again.
 
| Error code | User message |
| ---------- |--------------|
| ModuleError | The web service package graph is invalid. Details: {0} |
 
## InitializingContainers (HTTP status code 503)
 
The request cannot execute as the containers are being initialized.
 
 
## ServiceUnavailable (HTTP status code 503)
 
Service is temporarily unavailable.
 
| Error code | User message |
| ---------- |--------------|
| NoMoreResources | No resources available for request. |
| RequestThrottled | Request was throttled for {0} endpoint. The maximum concurrency for the endpoint is {1}. |
| TooManyConcurrentRequests | Too many concurrent requests sent. |
| TooManyHostsBeingInitialized | Too many hosts being initialized at the same time. Consider throttling / retrying. |
| TooManyHostsBeingInitializedPerModel | Too many hosts being initialized at the same time. Consider throttling / retrying. |
 
## GatewayTimeout (HTTP status code 504)
 
The operation could not be completed within the permitted time.
 
| Error code | User message |
| ---------- |--------------|
| BackendInitializationTimeout | The web service initialization could not be completed within the permitted time. |
| BackendScoreTimeout | The web service request execution could not be completed within the permitted time. |
 
