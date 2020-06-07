---
title: Security agent authentication methods
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
ms.date: 07/23/2019
ms.author: mlottner
---

# Security agent authentication methods

This article explains the different authentication methods you can use with the AzureIoTSecurity agent to authenticate with the IoT Hub.

For each device onboarded to Azure Security Center for IoT in the IoT Hub, a security module is required. To authenticate the device, Azure Security Center for IoT can use one of two methods. Choose the method that works best for your existing IoT solution.

> [!div class="checklist"]
> * SecurityModule option
> * Device option

## Authentication methods

The two methods for the AzureIoTSecurity agent to perform authentication:

- **SecurityModule** authentication mode<br>
The agent is authenticated using the security module identity independently of the device identity.
Use this authentication type if you would like the security agent to use a dedicated authentication method through security module (symmetric key only).

- **Device** authentication mode<br>
In this method, the security agent first authenticates with the device identity. After the initial authentication, the Azure Security Center for IoT agent performs a **REST** call to the IoT Hub using the REST API with the authentication data of the device. The Azure Security Center for IoT agent then requests the security module authentication method and data from the IoT Hub. In the final step, the Azure Security Center for IoT agent performs an authentication against the Azure Security Center for IoT module.

Use this authentication type if you would like the security agent to reuse an existing device authentication method (self-signed certificate or symmetric key).

See [Security agent installation parameters](#security-agent-installation-parameters) to learn how to configure.

## Authentication methods known limitations

- **SecurityModule** authentication mode only supports symmetric key authentication.
- CA-Signed certificate is not supported by **Device** authentication mode.

## Security agent installation parameters

When [deploying a security agent](how-to-deploy-agent.md), authentication details must be provided as arguments.
These arguments are documented in the following table.

|Linux Parameter Name | Windows Parameter Name | Shorthand Parameter |Description|Options|
|---------------------|---------------|---------|---------------|---------------|
|authentication-identity|AuthenticationIdentity|aui|Authentication identity| **SecurityModule** or **Device**|
|authentication-method|AuthenticationMethod|aum|Authentication method|**SymmetricKey** or **SelfSignedCertificate**|
|file-path|FilePath|f|Absolute full path for the file containing the certificate or the symmetric key| |
|host-name|HostName|hn|FQDN of the IoT Hub|Example: ContosoIotHub.azure-devices.net|
|device-id|DeviceId|di|Device ID|Example: MyDevice1|
|certificate-location-kind|CertificateLocationKind|cl|Certificate storage location|**LocalFile** or **Store**|
|

When using the install security agent script, the following configuration is performed automatically. To edit the security agent authentication manually, edit the config file.

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
