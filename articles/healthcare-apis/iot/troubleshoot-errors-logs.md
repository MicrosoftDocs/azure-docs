---
title: Troubleshoot errors using the MedTech service logs - Azure Health Data Services
description: Learn how to troubleshoot and fix MedTech service error using the service logs.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 06/02/2023
ms.author: jasteppe
---

# Troubleshoot errors using the MedTech service logs

This article provides troubleshooting steps and fixes for errors found in the MedTech service logs. 

> [!TIP]
> Having access to MedTech service logs is essential for troubleshooting and assessing the overall health and performance of your MedTech service. 
>  
> To learn how to access the MedTech service logs, see [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md).

## MedTech service error severity

This property represents the severity of the occurred error. Here's a list of possible values for this property:

|Severity|Description|
|--------|-----------|
|Nonblocking|An issue exists in the data flow process, but processing of device messages doesn't stop.|
|Blocking|An issue exists in the data flow process, and no device messages are expected to process.|

## Operation being performed by the MedTech service

This property represents the operation being performed by the MedTech service when the error occurred. An operation generally represents the data flow stage in which a device message is processed. The data flow stage is displayed in the error logs as **OperationName**. Here's a list of possible values for this property:

|OperationName|Description|
|-------------|-----------|
|Normalization|The data flow stage where the device message gets normalized.|
|FHIRConversion|The data flow stage where the grouped-normalized data is transformed into an Observation resource.|

> [!NOTE]
> To learn about the MedTech service device message data transformation, see [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md).

## MedTech service health check exceptions and fixes

Health checks are performed automatically and periodically to check whether a MedTech service can normalize and transform device messages. If a health check didn't pass, then a HealthCheckException occurs and is logged.
	
In the MedTech service logs, a health check failure is logged with a **LogType** of **HealthCheckException**, and the failed health check's name is logged in the **Message**.
	
The health checks' names are listed in the following table, and the fixes for any of their failures are described below the table:

|HealthCheck|
|-----------|
|[CredentialStore:IsCustomerFacingMiCredentialBundlePresent](#credentialstoreiscustomerfacingmicredentialbundlepresent)|
|[ExternalEventHub:IsAuthenticated](#externaleventhubisauthenticated)|
|[FhirService:IsAuthenticated](#fhirserviceisauthenticated)|

> [!NOTE]
> While a **HealthCheckException** is a blocking issue, it can be transient and may resolve itself with no intervention.

### CredentialStore:IsCustomerFacingMiCredentialBundlePresent

**Description**: Checks if a MedTech service’s system-assigned managed identity has been enabled or if a user-assigned managed identity is configured.

**Severity**: Blocking

**Fix**: Follow the fix described in [ManagedIdentityCredentialNotFound](#managedidentitycredentialnotfound).

### ExternalEventHub:IsAuthenticated

**Description**: Checks that the event hub is valid and that the MedTech service has receiving access to it.

**Severity**: Blocking

**Fix**: Ensure that your event hub is valid by following the fix described in [InvalidEventHubException](#invalideventhubexception). Then, ensure that your MedTech service has receiving access to your event hub by following the fix described in [UnauthorizedAccessEventHubException](#unauthorizedaccesseventhubexception).

### FhirService:IsAuthenticated

**Description**: Checks that the FHIR&reg; destination is valid and that the MedTech service has write access to it.

**Severity**: Blocking

**Fix**: Ensure that your FHIR destination is valid by following the fix described in [InvalidFhirServiceException](#invalidfhirserviceexception). Then, ensure that your MedTech service has write access to your FHIR destination by following the fix described in [UnauthorizedAccessFhirServiceException](#unauthorizedaccessfhirserviceexception).

## MedTech service errors and fixes

If an error occurs while normalizing or transforming device messages, then it's logged. 

In the MedTech service logs, the error's name is logged in the **LogType**.

The errors' names are listed in the following table, and the fixes for them are provided below the table:

|LogType|
|-------|
|[CorrelationIdNotDefinedException](#correlationidnotdefinedexception)|
|[FhirDataMappingException](#fhirdatamappingexception)|
|[FhirResourceNotFoundException](#fhirresourcenotfoundexception)|
|[IncompatibleDataException](#incompatibledataexception)|
|[InvalidDataFormatException](#invaliddataformatexception)|
|[InvalidEventHubException](#invalideventhubexception)|
|[InvalidFhirServiceException](#invalidfhirserviceexception)|
|[InvalidQuantityFhirValueException](#invalidquantityfhirvalueexception)|
|[InvalidTemplateException](#invalidtemplateexception)|
|[ManagedIdentityCredentialNotFound](#managedidentitycredentialnotfound)|
|[MultipleResourceFoundException](#multipleresourcefoundexception)|
|[NormalizationDataMappingException](#normalizationdatamappingexception)|
|[PatientDeviceMismatchException](#patientdevicemismatchexception)|
|[ResourceIdentityNotDefinedException](#resourceidentitynotdefinedexception)|
|[TemplateExpressionException](#templateexpressionexception)|
|[TemplateNotFoundException](#templatenotfoundexception)|
|[UnauthorizedAccessEventHubException](#unauthorizedaccesseventhubexception)|
|[UnauthorizedAccessFhirServiceException](#unauthorizedaccessfhirserviceexception)|

### CorrelationIdNotDefinedException

**Description**: If a CorrelationIdExpression (which is the expression to parse the correlation identifier from the device message) is specified in the device mapping, then this error occurs when the correlation identifier isn’t present in a device message, or when the CorrelationIdExpression isn’t configured correctly in the device mapping. **Note**: The CorrelationIdExpression is *optional*. This error occurs when grouping measurements that share the same device, type, and correlation identifier into a single FHIR Observation resource.

**Severity**: Blocking

**Fix**:

* If the CorrelationIdExpression is needed: Ensure that your device messages contain the correlation identifier. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the `correlationIdExpression` value in the device mapping exists and correctly references the correlation identifier’s key in your device messages.

* If the CorrelationIdExpression isn't needed: On the Azure portal, go to the **Device mapping** blade of your MedTech service, and remove the line containing `correlationIdExpression` in the device mapping.

### FhirDataMappingException

**Description**: An error occurred while transforming normalized data with the FHIR destination mapping. This error occurs when a template that corresponds to the normalized data isn't defined in the FHIR destination mapping.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Device mapping** blade and the **Destination** blade of your MedTech service, and ensure that, for each template in the device mapping, there's a template with the same `typeName` value in the FHIR destination mapping. Also, fix any validation errors that are shown when editing and saving the FHIR destination mapping in the **Destination** blade.

### FhirResourceNotFoundException

**Description**: This error occurs when a FHIR resource with the identifier given in the device message can't be found in the FHIR destination. If the FHIR resource’s type is Patient, then the error might be that the Device FHIR resource with the device identifier given in the device message doesn't reference a Patient FHIR resource. The FHIR resource’s type (for example, Device, Patient, Encounter, or Observation) is specified in the error message. **Note**: This error can only occur when the MedTech service’s resolution type is set to **Lookup**.

**Severity**: Nonblocking

**Fix**: Ensure that your device messages contain the identifier for the FHIR resource that has the type specified in the error message. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the `{FHIR resource’s type specified in the error message}IdExpression` (for example, `deviceIdExpression`) value in the device mapping exists and correctly references the identifier’s key in your device messages.

### IncompatibleDataException

**Description**: There's an incompatibility between the device message and the device mapping (for example, a required property might be missing or blank in the device message and/or in the device mapping). The device mapping property with the error is specified in the error message.

**Severity**: Nonblocking

**Fix**: Ensure that your device messages contain:
 
* The key that is referenced by the device mapping property specified in the error message.

* A nonblank value for the key. 

Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the device mapping property specified in the error message has a value that correctly references the corresponding key in your device messages.

### InvalidDataFormatException

**Description**: A device message isn't in a format that can be parsed into a JSON object.

**Severity**: Nonblocking

**Fix**: Ensure that your device messages are in JSON format. One way to confirm JSON format is to use an online JSON validator.

### InvalidEventHubException

**Description**: The event hub is invalid for one of these reasons:

* At least one of the event hub details (Event Hubs namespace, event hub name, or consumer group) is incorrectly formatted or doesn't exist. The Event Hubs namespace should contain the event hub, and the event hub should contain the consumer group.

* More than one service is reading from the event hub consumer group.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Event Hubs** blade of your MedTech service, and ensure that all the fields for the event hub details are filled in. To ensure that only your MedTech service reads from the consumer group, either:

* Go through your services and ensure that your MedTech service is the only service that accesses the [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups).

* Go to your event hub in the Azure portal, create a new consumer group that only your MedTech service accesses, go to the **Event Hubs** blade of your MedTech service, and select your new consumer group in the **Consumer group** field.

### InvalidFhirServiceException

**Description**: The FHIR destination is invalid because it's incorrectly formatted, doesn't exist, or isn't a FHIR service in Azure Health Data Services.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Destination** blade of your MedTech service, and ensure that the **FHIR server** field is correctly filled in.

### InvalidQuantityFhirValueException

**Description**: The value with a Quantity resource data type is invalid (for example, it might be in a format that isn’t supported). The value with the error is specified in the error message.

**Severity**: Nonblocking

**Fix**: Ensure that the values in your device messages are in supported datatypes according to the [FHIR Quantity.value specifications](https://build.fhir.org/datatypes-definitions.html#Quantity.value).

### InvalidTemplateException

**Description**: There's an error with a template in the device mapping or the FHIR destination mapping. Errors include:

* A template’s template type (represented by the `templateType` property) is missing or has a blank value.

* A template (represented by the `template` property) under the root collection template doesn't have a JSON object, which is identified by braces `{}`, as its value.
 
* A template’s type (represented by the `typeName` property) is missing or has a blank value.

* More than one template in a mapping has the same type (has the same value for its `typeName` property). 

The template’s type and line with the error are specified in the error message.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Device mapping** blade (if error is in the device mapping) or the **Destination** blade (if error is in the FHIR destination mapping) of your MedTech service, and correct the template specified in the error message.

### ManagedIdentityCredentialNotFound

**Description**: When the MedTech service is connecting to the event hub, the MedTech service’s system-assigned managed identity is disabled or doesn't exist, or a user-assigned managed identity isn't configured for the MedTech service. **Note**: This error might occur if the MedTech service was deployed using a misconfigured Azure Resource Manager (ARM) template.

**Severity**: Blocking

**Fix**: The fix depends on the type of managed identity that you'd like to use. The difference between a system-assigned and a user-assigned managed identity can be reviewed at [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). **Note**: The MedTech service supports only one identity: either a system-assigned managed identity or a single user-assigned managed identity.  

If you'd like to use a system-assigned managed identity:

1. If you're deploying a MedTech service using an ARM template, ensure that your MedTech service resource in the ARM template has an `identity` property containing the `type` value of `"SystemAssigned"` (see example ARM template in the *azuredeploy.json* file on [GitHub](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.healthcareapis/workspaces/iotconnectors-with-iothub)).

2. On the Azure portal, go to the **Identity** blade of your MedTech service, go to the **System assigned** tab, and ensure the following:
   * The **Status** is set to **On**.
   * The **Azure role assignments** show that your event hub has an **Azure Event Hubs Data Receiver** role assigned to your MedTech service’s system-assigned managed identity. If not, follow these [instructions](deploy-manual-portal.md#grant-resource-access-to-the-medtech-service-system-managed-identity). 

If you'd like to use a user-assigned managed identity:

1. Ensure that you have a user-assigned managed identity. If not, create one using the [Azure portal](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) or an [ARM template](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-arm#create-a-user-assigned-managed-identity-3).

2. If you're deploying a MedTech service using an ARM template, ensure that your MedTech service resource in the ARM template has an `identity` property containing 1) the `type` value of `"userAssigned"` and 2) a `userAssignedIdentities` value that includes your user-assigned managed identity's name (see example at [Assign a user-assigned managed identity to an Azure VM](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md#assign-a-user-assigned-managed-identity-to-an-azure-vm)).

3. On the Azure portal, go to the **Identity** blade of your MedTech service, go to the **User assigned** tab, and ensure that your user-assigned managed identity is shown. If not, add your user-assigned managed identity (see example at [Assign a user-assigned managed identity to an existing VM](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#assign-a-user-assigned-managed-identity-to-an-existing-vm)).

4. On the Azure portal, go to your event hub, and assign the **Azure Event Hubs Data Receiver** role to your MedTech service's user-assigned managed identity (see [instructions](deploy-manual-portal.md#grant-resource-access-to-the-medtech-service-system-managed-identity), but use the user-assigned managed identity instead of the system-assigned managed identity).

### MultipleResourceFoundException

**Description**: Multiple FHIR resources with the same identifier, which is taken from the device message, are found in the FHIR destination, but only one FHIR resource should have been found. The FHIR resource’s type (for example, Device, Patient, Encounter, or Observation) is specified in the error message.

**Severity**: Nonblocking

**Fix**: Ensure that an identifier isn't assigned to more than one FHIR resource that has the type specified in the error message.

### NormalizationDataMappingException

**Description**: An error occurred while normalizing a device message with the device mapping.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Device mapping** blade of your MedTech service, and fix any validation errors that are shown when editing and saving the device mapping.

### PatientDeviceMismatchException

**Description**: A Device resource in the FHIR destination references a Patient FHIR resource with an identifier that doesn’t match the patient identifier given in the device message (meaning, the device is linked to another patient).

**Severity**: Nonblocking

**Fix**: Ensure that a patient identifier isn't assigned to more than one device.

### ResourceIdentityNotDefinedException

**Description**: This error occurs when the FHIR resource’s identifier isn’t present in a device message, or when the expression to parse the FHIR resource’s identifier from the device message isn’t configured in the device mapping. The FHIR resource’s type (for example, Device, Patient, Encounter, or Observation) is specified in the error message. **Note**: This error can only occur when the MedTech service’s resolution type is set to **Create**.

**Severity**: Nonblocking

**Fix**: Ensure that your device messages contain the identifier for the FHIR resource that has the type specified in the error message. Also, on the Azure portal, go to the **Device mapping** blade of your MedTech service, and ensure that the `{FHIR resource’s type specified in the error message}IdExpression` (for example, `deviceIdExpression`) value in the device mapping exists and correctly references the identifier’s key in your device messages.

### TemplateExpressionException

**Description**: There's an error with an expression in a template within the device mapping. Errors include:

* A required expression is missing.

* An expression’s language (represented by the `language` property) isn't supported. All template types support expressions in JSONPath; only the [CalculatedContent](how-to-use-calculatedcontent-templates.md) template type supports expressions in JMESPath.

* An expression’s value (represented by the `value` property) is incorrectly formatted as per the syntax of the expression’s language. 

The expression and line with the error are specified in the error message.

**Severity**: Blocking

**Fix**: On the Azure portal, go to the **Device mapping** blade of your MedTech service, and correct the expression specified in the error message within the device mapping.

### TemplateNotFoundException

**Description**: A template in the device mapping doesn't have a matching template with the same type within the FHIR destination mapping. The template’s type is specified in the error message.

**Severity**: Nonblocking

**Fix**: On the Azure portal, go to the **Device mapping** blade and the **Destination** blade of your MedTech service, and ensure that, for each template in the device mapping, there's a template with the same `typeName` value within the FHIR destination mapping.

### UnauthorizedAccessEventHubException

**Description**: The MedTech service is missing receiving access to the event hub.

**Severity**: Blocking

**Fix**: On the Azure portal, go to your event hub, and assign the **Azure Event Hubs Data Receiver** role to your MedTech service (see [instructions](deploy-manual-portal.md#grant-resource-access-to-the-medtech-service-system-managed-identity)).

### UnauthorizedAccessFhirServiceException

**Description**: The MedTech service is missing write access to the FHIR destination.

**Severity**: Blocking

**Fix**: On the Azure portal, go to your FHIR service, and assign the **FHIR Data Writer** role to your MedTech service (see [instructions](deploy-manual-portal.md#grant-resource-access-to-the-medtech-service-system-managed-identity)).

> [!NOTE]
> If you're not able to fix your MedTech service issue using this troubleshooting guide, you can open an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket attaching copies of your device message and [device and FHIR destination mappings](how-to-use-mapping-debugger.md#overview-of-the-mapping-debugger) to your request to better help with issue determination.

## Next steps

[Frequently asked questions about the MedTech service](frequently-asked-questions.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
