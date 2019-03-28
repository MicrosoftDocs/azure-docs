---
title: Authentication methods for ASC for IoT Preview| Microsoft Docs
description: Learn about the different authentication methods available when using the ASC for IoT service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 10b38f20-b755-48cc-8a88-69828c17a108
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---

# Security agent authentication methods 

> [!IMPORTANT]
> ASC for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains the different authentication methods you can use with the AzureIoTSecurity agent to authenticate with the IoT Hub.

For each device onboarded to ASC for IoT in the IoT Hub, a security module is required. To authenticate the device, ASC for IoT can use one of two methods. Choose the method that works best for your existing IoT solution. 

> [!div class="checklist"]
> * Security Module option
> * Device option

## Authentication methods

The two methods for the AzureIoTSecurity agent to perform authentication:

 - **Module** authentication mode<br>
   The Module is authenticated independently of the device twin.
   The information required for this type of authentication is defined in by the Authentication.config file for C# and the LocalConfiguration.json for C.
		
 - **Device** authentication mode<br>
    In this method, the Security agent first authenticates against the device. After the initial authentication, the ASC for IoT agent performs **Rest** call to the IoT Hub using the Rest API with the authentication data of the device. The ASC for IoT agent then requests the security module authentication method and data from the IoT Hub. In the final step, the ASC for IoT agent performs an authentication against the ASC for IoT module.	

See [Security agent installation parameters](#security-agent-installation-parameters) to learn how to configure.
								
## Authentication methods known limitations

- **Module** authentication mode only supports symmetric key authentication.
- CA-Signed certificate is not supported by **Device** authentication mode.  

## Security agent installation parameters

When [deploying a security agent](select-deploy-agent.md), authentication details must be provided as arguments.
These arguments are documented in the following table.


|Parameter|Description|Options|
|---------|---------------|---------------|
|**identity**|Authentication mode| **Module** or **Device**|
|**type**|Authentication type|**SymmetricKey** or **SelfSignedCertificate**|
|**filePath**|Absolute full path for the file containing the certificate or the symmetric key| |
|**gatewayHostname**|FQDN of the IoT Hub|Example: ContosoIotHub.azure-devices.net|
|**deviceId**|Device ID|Example: MyDevice1|
|**certificateLocationKind**|Certificate storage location|**LocalFile** or **Store**|


When using the install security agent script, the following configuration is performed automatically.

To edit the security agent authentication manually, edit the config file. 

## Change authentication method after deployment

When deploying a security agent with an installation script, a configuration file is automatically created.

To change authentication methods after deployment, manual editing of the configuration file is required.


### C#-based security agent

Edit _Authentication.config_ with the following parameters:

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

### C-based security agent

Edit _LocalConfiguration.json_ with the following parameters:

```json
"Authentication" : {
	"Identity" : "",
	"AuthenticationMethod" : "",
	"FilePath" : "",
	"DeviceId" : "",
	"HostName" : ""
}
```

## See also
- [Security agents overview](security-agent-architecture.md)
- [Deploy security agent](select-deploy-agent.md)
- [Access raw security data](how-to-security-data-access.md)
