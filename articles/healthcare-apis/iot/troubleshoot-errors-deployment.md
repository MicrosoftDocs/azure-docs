---
title: Troubleshoot MedTech service deployment errors - Azure Health Data Services
description: Learn how to troubleshoot and fix MedTech service deployment errors.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: troubleshooting
ms.date: 07/21/2023
ms.author: jasteppe
---

# Troubleshoot MedTech service deployment errors

This article provides troubleshooting steps and fixes for MedTech service deployment errors.

> [!TIP]
> Having access to MedTech service metrics and logs is essential for troubleshooting and assessing the overall health and performance of your MedTech service. Check out these MedTech service articles to learn how to enable, configure, and use these MedTech service monitoring features:
>  
> [How to use the MedTech service monitoring and health checks tabs](how-to-use-monitoring-and-health-checks-tabs.md) 
>
> [How to configure the MedTech service metrics](how-to-configure-metrics.md)
>
> [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

## MedTech service resource errors and fixes

Here's a list of errors that can be found in the Azure Resource Manager (ARM) API or Azure portal and fixes for these errors:

|Error|
|------|
|[The maximum number of resource type iotconnectors has been reached.](#the-maximum-number-of-resource-type-iotconnectors-has-been-reached)|
|[Invalid deviceMapping mapping. Validation errors: {LIST_OF_ERRORS}.](#invalid-devicemapping-mapping-validation-errors-list_of_errors)|
|[fullyQualifiedEventHubNamespace is null, empty, or formatted incorrectly.](#fullyqualifiedeventhubnamespace-is-null-empty-or-formatted-incorrectly)|
|[Ancestor resources must be fully provisioned before a child resource can be provisioned.](#ancestor-resources-must-be-fully-provisioned-before-a-child-resource-can-be-provisioned)|
|[The location property of child resources must match the location property of parent resources.](#the-location-property-of-child-resources-must-match-the-location-property-of-parent-resources)|

### The maximum number of resource type iotconnectors has been reached

**Displayed**: ARM API and Azure portal

**Description**: MedTech service subscription quota is reached (default is 10 MedTech services per workspace and 10 workspaces per subscription).

**Fix**: Perform one of these options:

* Delete one of the existing instances of the MedTech service. 

* Use a different subscription that hasn't reached the subscription quota. 

* Request a subscription quota increase - [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/).

### Invalid deviceMapping mapping. Validation errors: {LIST_OF_ERRORS}

**Displayed**: ARM API and Azure portal

**Description**: The device mapping provided in the MedTech service provisioning request is invalid.

**Fix**:
* If you're deploying a MedTech service using an ARM template, correct the errors in the mapping JSON provided in the `properties.deviceMapping` property.
* If you're deploying a MedTech service using the Azure portal, correct the errors in the mapping JSON provided in the [**Device mapping** tab](deploy-manual-portal.md#configure-the-device-mapping-tab).

### fullyQualifiedEventHubNamespace is null, empty, or formatted incorrectly

**Displayed**: ARM API

**Description**: The MedTech service's Event Hubs Namespace provided in the provisioning request isn't valid.

**Fix**: Update the MedTech service's `properties.ingestionEndpointConfiguration.fullyQualifiedEventHubNamespace` property to the correct format in your ARM template. The format should be `{EVENTHUB_NAMESPACE}.servicebus.windows.net`.

### Ancestor resources must be fully provisioned before a child resource can be provisioned

**Displayed**: ARM API

**Description**: The parent workspace is still provisioning.

**Fix**: Wait until the parent workspace provisioning has completed and submit the provisioning request again.

### The location property of child resources must match the location property of parent resources

**Displayed**: ARM API

**Description**: The MedTech service's location provided in the provisioning request is different from the parent workspace's location.

**Fix**: Set the `location` property of the MedTech service in your ARM template to the same value as the parent workspace's `location` property.

## FHIR destination resource errors and fixes

Here's a list of errors that can be found in the Azure Resource Manager (ARM) API or Azure portal and fixes for these errors:

|Error|
|-----|
|[The maximum number of resource type iotconnectors/fhirdestinations has been reached.](#the-maximum-number-of-resource-type-iotconnectorsdestinations-has-been-reached)|
|[The fhirServiceResourceId provided is invalid.](#the-fhirserviceresourceid-provided-is-invalid)|
|[Ancestor resources must be fully provisioned before a child resource can be provisioned.](#ancestor-resources-must-be-fully-provisioned-before-a-child-resource-can-be-provisioned-1)|
|[The location property of child resources must match the location property of parent resources.](#the-location-property-of-child-resources-must-match-the-location-property-of-parent-resources-1)|

### The maximum number of resource type iotconnectors/destinations has been reached

**Displayed**: ARM API and Azure portal

**Description**: MedTech service's FHIR&reg; destination resource quota is reached (default is one per MedTech service).

**Fix**: Delete the existing instance of the MedTech service's FHIR destination resource. Only one FHIR destination resource is permitted per MedTech service.

### The fhirServiceResourceId provided is invalid

**Displayed**: ARM API

**Description**: The FHIR destination's resource ID provided in the provisioning request isn't a valid resource ID for an instance of the FHIR service.

**Fix**: Ensure the resource ID in the `properties.fhirServiceResourceId` property of your ARM template is formatted correctly, and make sure the resource ID is for the FHIR service instance. The format should be: `/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP_NAME}/providers/Microsoft.HealthcareApis/workspaces/{WORKSPACE_NAME}/fhirservices/{FHIR_SERVICE_NAME}`

### Ancestor resources must be fully provisioned before a child resource can be provisioned

**Displayed**: ARM API

**Description**: The parent workspace or the parent MedTech service is still provisioning.

**Fix**: Wait until the parent workspace or the parent MedTech service provisioning completes, then submit the provisioning request again.

### The location property of child resources must match the location property of parent resources

**Displayed**: ARM API

**Description**: The FHIR destination resource's location provided in the provisioning request is different from the parent MedTech service's location.

**Fix**: Set the `location` property of the FHIR destination in your ARM template to the same value as the parent MedTech service's `location` property.

> [!NOTE]
> If you're not able to fix your MedTech service issue using this troubleshooting guide, you can open an [Azure Technical Support](https://azure.microsoft.com/support/create-ticket/) ticket attaching copies of your device message and [device and FHIR destination mappings](how-to-use-mapping-debugger.md#overview-of-the-mapping-debugger) to your request to better help with issue determination.

## Next steps

[Frequently asked questions about the MedTech service](frequently-asked-questions.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
