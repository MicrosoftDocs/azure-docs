---
title: How to configure authentication methods for ATP for IoT Preview| Microsoft Docs
description: Learn about the different authentication methods available when using the ATP for IoT service.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 10b38f20-b755-48cc-8a88-69828c17a108
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---

# Configure authentication methods

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to configure authentication methods you can use with the ATP for IoT agent to authenticate with the Azure IoT Hub.

See [Security agent authentication methods](concept-security-agent-authentication-methods.md) to learn more about the different authentication methods you can use with ATP for IoT and choose the best authentication method to select for your for your organization. 

## Security agent configuration 

When using the install security agent script, the following configuration is performed automatically. To edit the security agent authentication manually, edit the config file. 

### C# Configuration

To use **Security Module authentication mode**, edit (Authentication.config) with the following parameters:

```xml
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
|**identity**|Authentication mode| **Module** or **Device**|
|**type**|Authentication type|**SymmetricKey** or **SelfSignedCertificate**|
|**filePath**|Absolute full path for the file containing the certificate or the symmetric key| |
|**gatewayHostname**|FQDN of the IoT Hub||
|**deviceId**|Device ID||
|**certificateLocationKind**|Certificate storage location|**LocalFile** or **Store**|


### C Configuration

To use **Security Module authentication mode**, edit LocalConfiguration.json with the following parameters:

```json
"Authentication" : {
	"Identity" : "",
	"AuthenticationMethod" : "",
	"FilePath" : "",
	"DeviceId" : "",
	"HostName" : ""
}
```
					
## IoT Hub authentication configuration 


## See also
- [Overview](overview.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)
- [Access your security data](how-to-security-data-access.md)
