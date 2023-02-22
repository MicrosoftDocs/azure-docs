---
title: Troubleshoot MedTech service error logs - Azure Health Data Services
description: This article assists troubleshooting and fixing MedTech service error logs.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.author: jasteppe
---

# Troubleshoot errors using the MedTech service logs

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides troubleshooting steps and fixes for errors found in the MedTech service logs. 

> [!TIP]
> Having access to MedTech service logs are essential for troubleshooting and assessing the overall health and performance of your MedTech service. 
>  
> To learn how to access the MedTech service logs, see [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

## MedTech service error severity

This property represents the severity of the occurred error. Here's a list of possible values for this property:

|Severity:|Description:|
|---------|------------|
|`Warning`|A minor issue exists in the data flow process, but processing of device messages doesn't stop.|
|`Critical`|A major issue exits in the data flow process, and no device messages are expected to process.|

## Operation being performed by the MedTech service

This property represents the operation being performed by the MedTech service when the error has occurred. An operation generally represents the data flow stage while processing a device message. The data flow stage is displayed in the error logs as `OperationName`. Here's a list of possible values for this property:

|OperationName:|Description:|
|--------------|------------|
|`Normalization`|Normalization is the data flow stage where the device message gets normalized.|
|`FHIRConversion`|FHIRConversion is the data flow stage where the grouped-normalized data is transformed into a FHIR Observation resource.|

> [!NOTE]
> To learn about the MedTech service device message data transformation, see [Understand the MedTech service device message data transformation](understand-service.md).

## MedTech service HealthCheckExceptions and fixes

Health checks are performed automatically and periodically to check whether a MedTech service can normalize and transform device message data. If one of the following health checks didn't pass, then a HealthCheckException occurs:

|Log error:|
|----------|
|[`CredentialStore:IsCustomerFacingMiCredentialBundlePresent`](#credentialstoreiscustomerfacingmicredentialbundlepresent)|
|[`ExternalEventHub:IsAuthenticated`](#externaleventhubisauthenticated)|
|[`FhirService:IsAuthenticated`](#fhirserviceisauthenticated)|

### CredentialStore:IsCustomerFacingMiCredentialBundlePresent

**Description**: Checks if a MedTech service’s system-assigned managed identity exists and is enabled.

**Fix**: Follow the fix described in [ManagedIdentityCredentialNotFound](#managedidentitycredentialnotfound).

### ExternalEventHub:IsAuthenticated

**Description**: Checks that the event hub is valid and that the MedTech service has receiving access to it.

**Fix**: Ensure that your event hub is valid by following the fix described in [InvalidEventHubException](#invalideventhubexception). Then, ensure that your MedTech service has receiving access to your event hub by following the fix described in [UnauthorizedAccessEventHubException](#unauthorizedaccesseventhubexception).

### FhirService:IsAuthenticated

**Description**: Checks that the FHIR destination is valid and that the MedTech service has write access to it.

**Fix**: Ensure that your FHIR destination is valid by following the fix described in [InvalidFhirServiceException](#invalidfhirserviceexception). Then, ensure that your MedTech service has write access to your FHIR destination by following the fix described in [UnauthorizedAccessFhirServiceException](#unauthorizedaccessfhirserviceexception).

## MedTech service errors and fixes

This table provides a list of errors that can be found in the MedTech service logs and fixes for those errors:

|Log error:|
|----------|
|[CorrelationIdNotDefinedException](#correlationidnotdefinedexception)|
|[FhirDataMappingException](#fhirdatamappingexception)|
|[FhirResourceNotFoundException](#fhirresourcenotfoundexception)|
|[IncompatibleDataException](#incompatibledataexception)|
|[InvalidDataFormatException](#invaliddataformatexception)|
|[InvalidEventHubException](#invalideventhubexception)|
|[InvalidFhirServiceException](#invalidfhirserviceexception)|
|[InvalidQuantityFhirValueException](#invalidquantityfhirvalueexception)|
|[InvalidTemplateException](#invalidtemplateexception)|
|[ManagedIdentityCredentialNotFound](#managedidentitycredentialnotfound)
|[MultipleResourceFoundException](#multipleresourcefoundexception)|
|[NormalizationDataMappingException](#normalizationdatamappingexception)|
|[PatientDeviceMismatchException](#patientdevicemismatchexception)|
|[ResourceIdentityNotDefinedException](#resourceidentitynotdefinedexception)|
|[TemplateExpressionException](#templateexpressionexception)|
|[TemplateNotFoundException](#templatenotfoundexception)|
|[UnauthorizedAccessEventHubException](#unauthorizedaccesseventhubexception)|
|[UnauthorizedAccessFhirServiceException](#unauthorizedaccessfhirserviceexception)|

### CorrelationIdNotDefinedException

**Description**: If a `CorrelationIdExpression` (for example, the expression to parse the correlation identifier from the device message) is specified in the device mappings, then this error occurs when the correlation identifier isn’t present in a device message, or when the `CorrelationIdExpression` isn’t configured correctly in the device mappings. **Note:** The `CorrelationIdExpression` is *optional*. This error occurs when grouping measurements that share the same device, type, and correlation identifier into a single FHIR Observation resource.

**Severity**: Critical

**Fix**:

* If the `CorrelationIdExpression` is needed: Ensure that your device messages contain the correlation identifier. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the `correlationIdExpression` value in the device mappings exists and correctly references the correlation identifier’s key in your device messages.

* If the `CorrelationIdExpression` isn't needed: On the Azure portal, go to the **Device mapping** blade of your MedTech service, and remove the line containing `correlationIdExpression` in the device mappings.

### FhirDataMappingException

**Description**: An error occurred while transforming normalized data with the FHIR destination mappings. This error occurs when a template that corresponds to the normalized data isn't defined in the FHIR destination mappings.

**Severity**: Critical

**Fix:** On the Azure portal, go to the **Device mapping** blade and the **Destination** blade of your MedTech service, and ensure that, for each template in the device mappings, there's a template with the same `typeName` value in the FHIR destination mappings. Also, fix any validation errors that are shown when editing and saving the FHIR destination mappings in the **Destination** blade.

### FhirResourceNotFoundException

**Description**: This error occurs when a FHIR resource with the identifier given in the device message can't be found in the FHIR destination. If the FHIR resource’s type is Patient, then the error may be that the `Device` FHIR resource with the device identifier given in the device message doesn't reference a `Patient` FHIR resource. The FHIR resource’s type (for example, `Device`, `Patient`, `Encounter`, or `Observation`) is specified in the error message. **Note:** This error occurs when the MedTech service’s resolution type is set to `Lookup`.

**Severity**: Warning

**Fix**: Ensure that your device messages contain the identifier for the FHIR resource that has the type specified in the error message. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the `FHIR resource’s type specified in the error message`IdExpression value in the device mappings exists and correctly references the identifier’s key in your device messages.

### IncompatibleDataException

**Description**: There's an incompatibility between the device message and the device mappings (for example, a required property may be missing or blank in the device message and/or in the device mappings. The device mappings property with the error is specified in the error message.

**Severity**: Warning

**Fix**: Ensure that your device messages contain 1) The key that is referenced by the device mappings property specified in the error message and 2) A non-blank value for the key. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the device mappings property specified in the error message has a value that correctly references the corresponding key in your device messages.

### InvalidDataFormatException

**Description**: |A device message isn't in a format that can be parsed into a JSON object.

**Severity**: Warning

**Fix**: Ensure that your device messages are in JSON format. One way to confirm JSON format is to use an online JSON validator.

### InvalidEventHubException

**Description**: The event hub is invalid for one of these reasons:

* At least one of the event hub details (for example, Event Hubs namespace, event hub name, or consumer group) is incorrectly formatted or doesn't exist. The Event Hubs namespace should contain the event hub, and the event hub should contain the consumer group.

* More than one service is reading from the event hub consumer group.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Event Hubs** blade of your MedTech service, and ensure that all the fields for the event hub details are filled in. To ensure that only your MedTech service reads from the consumer group, either:

* Go through your services and ensure that your MedTech service is the only service that accesses the consumer group.

* Go to your event hub in the Azure portal, create a new consumer group that only your MedTech service accesses, go to the Event Hubs blade of your MedTech service, and select your new consumer group in the **Consumer group** field.

### InvalidFhirServiceException

**Description**: The FHIR destination is invalid because it's incorrectly formatted, doesn't exist, or isn't a FHIR service in Azure Health Data Services.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Destination** blade of your MedTech service, and ensure that the **FHIR server** field is correctly filled in.

### InvalidQuantityFhirValueException

**Description**: The value with a `Quantity` FHIR data type is invalid (for example, it may be in a format that isn’t supported). The value with the error is specified in the error message.

**Severity**: Warning

**Fix**: Ensure that the values in your device messages are in supported `datatypes` according to the [FHIR Quantity.value specifications](https://build.fhir.org/datatypes-definitions.html).

### InvalidTemplateException

**Description**:There's an error with a template in the device mappings or the FHIR destination mappings. Errors include:

* A template’s template type (represented by the `templateType` property) is missing or has a blank value.

* A template (represented by the template property) under the root collection template doesn't have a JSON object, which is identified by braces `{}`, as its value.
 
* A template’s type (represented by the `typeName` property) is missing or has a blank value. 4) More than one template in the mappings has the same type (for example, has the same value for its `typeName` property). The template’s type and line with the error are specified in the error message.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Device mapping** blade (if error is in the device mappings) or the **Destination** blade (if error is in the FHIR destination mappings) of your MedTech service, and correct the template specified in the error message.

### ManagedIdentityCredentialNotFound

**Description**: When connecting to the event hub, the MedTech service’s system-assigned managed identity is disabled or doesn't exist. **Note**: The managed identity may be disabled or doesn't exist if the MedTech service was deployed using a misconfigured Azure Resource Manager (ARM) template.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Identity** blade of your MedTech service, and ensure the following: 

* The system-assigned managed identity’s **Status** is set to **On**.

* The Azure role assignments show that your event hub has an **Azure Event Hubs Data Receiver** role assigned to your MedTech service’s system-assigned managed identity (if not, follow these [step-by-step instructions](deploy-new-deploy.md#grant-access-to-the-device-message-event-hub)).

### MultipleResourceFoundException

**Description**: Multiple FHIR resources with the same identifier, which is taken from the device message, are found in the FHIR destination, but only one FHIR resource should have been found. The FHIR resource’s type (for example, `Device`, `Patient`, `Encounter`, or `Observation`) is specified in the error message.

**Severity**: Warning

**Fix**: Ensure that an identifier isn't assigned to more than one FHIR resource that has the type specified in the error message.

### NormalizationDataMappingException

**Description**: An error occurred while normalizing a device message with the device mappings.

**Severity**: Critical

**Fix**: Ensure that your device messages are in JSON format. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and fix any validation errors that are shown when editing and saving the device mappings.

### PatientDeviceMismatchException

**Description**: A `Device` FHIR resource in the FHIR destination references a `Patient` FHIR resource with an identifier that doesn’t match the patient identifier given in the device message (for example, the device is linked to another patient).

**Severity**: Warning

**Fix**: Ensure that a patient identifier isn't assigned to more than one device.

### ResourceIdentityNotDefinedException

**Description**: This error occurs when the FHIR resource’s identifier isn’t present in a device message, or when the expression to parse the FHIR resource’s identifier from the device message isn’t configured in the device mappings. The FHIR resource’s type (for example, `Device`, `Patient`, `Encounter`, or `Observation`) is specified in the error message. **Note:** This error occurs when the MedTech service’s resolution type is set to **Create**.

**Severity**: Warning

**Fix**: Ensure that your device messages contain the identifier for the FHIR resource that has the type specified in the error message. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the *FHIR resource’s type specified in the error message*`IdExpression` value in the device mappings exists and correctly references the identifier’s key in your device messages.

### TemplateExpressionException

**Description**: There's an error with an expression in a template in the device mappings. Errors include:

* A required expression is missing.

* An expression’s language (represented by the language property) isn't supported. All template types support expressions in JSONPath; only the CalculatedContent template type supports expressions in JMESPath.

* An expression’s value (represented by the value property) is incorrectly formatted as per the syntax of the expression’s language. The expression and line with the error are specified in the error message.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Device mapping** blade of your MedTech service, and correct the expression specified in the error message.

### TemplateNotFoundException

**Description**: A template in the device mappings doesn't have a matching template with the same type in the FHIR destination mappings. The template’s type is specified in the error message.

**Severity**: Critical

**Fix**: On the Azure portal, go to the **Device mapping** blade and the **Destination** blade of your MedTech service, and ensure that, for each template in the device mappings, there's a template with the same `typeName` value in the FHIR destination mappings.

### UnauthorizedAccessEventHubException

**Description**: The MedTech service is missing receiver access to the event hub.

**Severity**: Critical

### UnauthorizedAccessFhirServiceException

**Fix**: On the Azure portal, go to your event hub, and assign the **Azure Event Hubs Data Receiver** role to your MedTech service (see [step-by-step instructions](deploy-new-deploy.md#grant-access-to-the-device-message-event-hub)).

**Description**: The MedTech service is missing write access to the FHIR destination.

**Severity**: Critical

**Fix**: On the Azure portal, go to your FHIR service, and assign the FHIR Data Writer role to your MedTech service (see [step-by-step instructions](deploy-new-deploy.md#grant-access-to-the-fhir-service)).

> [!NOTE]
> If you're not able to fix your MedTech service issue using this troubleshooting guide, you can open an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket also attaching copies of the device message, [device mappings, and FHIR destination mappings](how-to-create-mappings-copies.md) to your request to better help with issue determination.

## Next steps

In this article, you learned how to troubleshoot and fix errors using the MedTech service logs. 

To learn about the MedTech service frequently asked question (FAQs), see

> [!div class="nextstepaction"]
> [Frequently asked questions about the MedTech service](frequently-asked-questions.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
