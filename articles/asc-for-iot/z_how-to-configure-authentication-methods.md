---
title: How to configure authentication methods for Azure IoT Security Preview| Microsoft Docs
description: Learn about the different authentication methods available when using the Azure IoT Security service.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 10b38f20-b755-48cc-8a88-69828c17a108
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2019
ms.author: mlottner

---

# Configure authentication methods

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to configure authentication methods you can use with the Azure IoT Security agent to authenticate with the ASC IoT Hub.

See [Security agent authentication methods](concept-security-agent-authentication-methods.md) to learn more about the different authentication methods and choose the best authentication method for your organization. 

## Security agent Configuration 

When using the install security agent script, the following configuration is performed automatically. To edit the security agent authentication manually, edit the config file. 

### C# Configuration

To use **Security Module authentication mode**, edit (Authentication.config) with the following parameters:

```json
  <Authentication>
    <add key="deviceId" value=""/>
    <add key="gatewayHostname" value=""/>
    <add key="filePath" value=""/>
    <add key="type" value=""/>
    <add key="identity" value=""/>
    <add key="certificateLocationKind" value="" />
  </Authentication>
```

|Parameter|Description|Options|
|---------|---------------|---------------|
|**identity**|Authentication mode| **SecurityModule** or **Device**|
|**type**|Authentication type|**SymmetricKey** or **SelfSignedCertificate**|
|**filePath**|Absolute full path for the file containing the certificate or the symmetric key| |
|**gatewayHostname**|FQDN of the IoT Hub|Note - this field is only required when identity=Device|
|**deviceId**|Device ID|Note -  this field is only required when identity=Device|
|**certificateLocationKind**|Certificate storage location|Local file or certificate store|
|

### C Configuration

To use **Security Module authentication mode**, edit LocalConfiguration.json with the following parameters:

"Authentication" : {
"Identity" : "",
"AuthenticationMethod" : "",
"FilePath" : "",
"DeviceId" : "",
"HostName" : ""
}
					
## IoT Hub authentication configuration 


## See also
- [Understanding Azure IoT Security](overview.md)
- [Installation for Windows](quickstart-windows-installation.md)
- [Azure IoT Security alerts](alerts.md)
- [Data Access](data-access.md)
