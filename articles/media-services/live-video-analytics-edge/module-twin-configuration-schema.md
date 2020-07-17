---
title: Module twin JSON schema - Azure
description: This topic describes module twin JSON schema of Live Video Analytics on IoT Edge.
ms.topic: conceptual
ms.date: 04/27/2020

---
# Module twin JSON schema

Device twins are JSON documents that store device state information including metadata, configurations, and conditions. Azure IoT Hub maintains a device twin for each device that you connect to IoT Hub. For detailed explanation, see [Understand and use module twins in IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins)

This topic describes module twin JSON schema of Live Video Analytics on IoT Edge.

> [!NOTE]
> To be authorized to access Media Services resources and the Media Services API, you must first be authenticated. For more information, see [Accessing the Azure Media Services API](../latest/media-services-apis-overview.md#accessing-the-azure-media-services-api).

## Module twin properties

Live Video Analytics on IoT Edge exposes the following module twin properties. 

|Property |Required |Dynamic |Description |
|---|---|---|---|
|applicationDataDirectory |Yes |No |Path to a mounted volume for persisting configuration. |
|azureMediaServicesArmId |Yes |No |Unique Azure Resource Manage identifier for the Media Services Account.|
|aadTenantId |Yes |No |Customer Azure AD Tenant ID.|
|aadServicePrincipalAppId |Yes |Yes |Customer created Azure AD AppId.|
|aadServicePrincipalCertificate |Yes<sup>*</sup>  |Yes |Customer created Azure AD AppId certificate.|
|aadServicePrincipalPassword |Yes<sup>*</sup>  |Yes |Customer created Azure AD AppId password.|
|aadEndpoint |No |No |Cloud-specific Azure AD endpoint. <br/>Default: `https://login.microsoftonline.com` |
|aadResourceId |No |No |Cloud-specific Azure AD audience/resource ID <br/>Default: `https://management.core.windows.net/` |
|armEndpoint |No |No |Cloud-specific Azure Resource Manage endpoint. <br/>Default: `https://management.azure.com/` |
|diagnosticsLevel |No |Yes |Events verbosity: <br/>Information &#x02758; Warning &#x02758; Error &#x02758; Critical &#x02758; None |
|diagnosticsEventsOutputName |No |Yes |Hub output for diagnostics events. <br/>(Empty means diagnostics are not published)|
|operationalEventsOutputName|No|Yes|Hub output for operational events.<br/>(Empty means operational events are not published)
|logLevel|No|Yes|One of the following: <br/>&#x000B7; Verbose<br/>&#x000B7; Information (Default)<br/>&#x000B7; Warning<br/>&#x000B7; Error<br/>&#x000B7; None|
|logCategories|No|Yes|A comma-separated list of the following: Application, MediaPipeline, Events <br/>Default: Application, Events|
|debugLogsDirectory|No|Yes|Directory for debug logs. If present logs are generated, if not present debug logs are disabled.

<sup>*</sup>You MUST provide either service principal certificate or password. 

Dynamic properties can be updated without the restarting the module. You can obtain the values for several of these properties by following the instruction in the [Getting access to Media Services API](../latest/access-api-cli-how-to.md) article. 

See the article on [Monitoring and logging](monitoring-logging.md) for more information about the role of the optional diagnostics settings.

```
{ 
    "properties.desired": { 
        // Required 
        "applicationDataDirectory": "/var/lib/azuremediaservices", 
        "azureMediaServicesArmId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<rgname>/providers/microsoft.media/mediaservices/<ams_account>", 
        "aadTenantId": "00000000-0000-0000-0000-000000000000", 
        "aadServicePrincipalAppId": "00000000-0000-0000-0000-000000000000", 
        "aadServicePrincipalPassword": "{Service principal password}", 

        // Optional API Access 
        "aadEndpoint": "https://<aad-endpoint>", 
        "aadResourceId": "https://management.core.windows.net/", 
        "armEndpoint": "https://management.azure.com/", 
        
        // Optional Diagnostics 
        "diagnosticsEventsOutputName": "lvaEdgeDiagnostics",
        "operationalEventsOutputName": "lvaEdgeOperational",
        "logLevel": "Information",
        "logCategories": "Application,Events"
    } 
} 
```

## Next steps

[Direct methods](direct-methods.md)
