---
title: Authentication methods for Azure Security Center for IoT Preview| Microsoft Docs
description: Learn about the different authentication methods available when using the Azure Security Center for IoT service.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 10b38f20-b755-48cc-8a88-69828c17a108
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---

# Security agent authentication methods 

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains the different authentication methods you can use with the AzureIoTSecurity agent to authenticate with the IoT Hub.

For each device onboarded to Azure Security Center (ASC) for IoT in the IoT Hub, a security module is required. To authenticate the device, ASC for IoT can use one of two methods. Choose the method that works best for your existing IoT solution. 

> [!div class="checklist"]
> * Security Module option
> * Device option

## Authentication methods

The two methods for the AzureIoTSecurity agent to perform authentication:

 - **Module** authentication mode<br>
   The Module is authenticated independently of the device twin.
   Use this authentication type if you would like the security agent to use a dedicated authentication method through security module (symmetric key only).
		
 - **Device** authentication mode<br>
    In this method, the security agent first authenticates with the device identity. After the initial authentication, the ASC for IoT agent performs a **REST** call to the IoT Hub using the REST API with the authentication data of the device. The ASC for IoT agent then requests the security module authentication method and data from the IoT Hub. In the final step, the ASC for IoT agent performs an authentication against the ASC for IoT module.
    
    Use this authentication type if you would like the security agent to reuse an existing device authentication method (self-signed certificate or symmetric key).	

See [Security agent installation parameters](#security-agent-installation-parameters) to learn how to configure.
								
## Authentication methods known limitations

- **Module** authentication mode only supports symmetric key authentication.
- CA-Signed certificate is not supported by **Device** authentication mode.  

## Security agent installation parameters

When [deploying a security agent](how-to-deploy-agent.md), authentication details must be provided as arguments.
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
- [Deploy security agent](how-to-deploy-agent.md)
- [Access raw security data](how-to-security-data-access.md)
