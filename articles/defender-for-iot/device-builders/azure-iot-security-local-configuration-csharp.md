---
title: Defender for IoT security agent local configuration (C#)
description: Learn more about the Defender for IoT security service, security agent local configuration file for C#.
ms.custom: devx-track-csharp
ms.topic: conceptual
ms.date: 03/28/2022 
---

# Understanding the local configuration file (C# agent)

The Defender for IoT security agent uses configurations from a local configuration file.

The security agent reads the configuration file once, when the agent starts running. Configurations found in the local configuration file contain both authentication configuration and other agent related configurations.

The C# security agent uses multiple configuration files:

- **General.config** - Agent related configurations.
- **Authentication.config** - Authentication related configuration (including authentication details).
- **SecurityIotInterface.config** - IoT related configurations.

The configuration files contain the default configuration. Authentication configuration is populated during agent installation and changes to the configuration file are made when the agent is restarted.

## Configuration file location

For Linux:

- Operating system configuration files are located in `/var/ASCIoTAgent`.

For Windows:

- Operating system configuration files are located within the directory of the security agent.

### General.config configurations

| Configuration Name | Possible values | Details |
|:-----------|:---------------|:--------|
| **agentId** | GUID | Agent unique identifier |
| **readRemoteConfigurationTimeout** | TimeSpan | Time period for fetching remote configuration from IoT Hub. If the agent can't fetch the configuration within the specified time, the operation will time out.|
| **schedulerInterval** | TimeSpan | Internal scheduler interval. |
| **producerInterval** | TimeSpan | Event producer worker interval. |
| **consumerInterval** | TimeSpan | Event consumer worker interval. |
| **highPriorityQueueSizePercentage** | 0 < number < 1 | The portion of total cache dedicated for high priority messages. |
| **logLevel** | "Off", "Fatal", "Error", "Warning", "Information", "Debug"  | Log messages equal and above this severity are logged to debug console (Syslog in Linux). |
| **fileLogLevel** |  "Off", "Fatal", "Error", "Warning", "Information", "Debug"| Log messages equal and above this severity are logged to file (Syslog in Linux). |
| **diagnosticVerbosityLevel** | "None", "Some", "All", | Verbosity level of diagnostic events. None - diagnostic events are not sent. Some - Only diagnostic events with high importance are sent. All - all logs are also sent as diagnostic events. |
| **logFilePath** | Path to file | If fileLogLevel > Off, logs are written to this file. |
| **defaultEventPriority** | "High", "Low", "Off" | Default event priority. |

### General.config example

```xml
<?xml version="1.0" encoding="utf-8"?>
<General>
  <add key="agentId" value="da00006c-dae9-4273-9abc-bcb7b7b4a987" />
  <add key="readRemoteConfigurationTimeout" value="00:00:30" />
  <add key="schedulerInterval" value="00:00:01" />
  <add key="producerInterval" value="00:02:00" />
  <add key="consumerInterval" value="00:02:00" />
  <add key="highPriorityQueueSizePercentage" value="0.5" />
  <add key="logLevel" value="Information" />
  <add key="fileLogLevel" value="Off"/>
  <add key="diagnosticVerbosityLevel" value="Some" />
  <add key="logFilePath" value="IotAgentLog.log" />
  <add key="defaultEventPriority" value="Low"/>
</General>
```

### Authentication.config

| Configuration name | Possible values | Details |
|:-----------|:---------------|:--------|
| **moduleName** | string | Name of the Defender-IoT-micro-agent identity. This name must correspond to the module identity name in the device. |
| **deviceId** | string | ID of the device (as registered in Azure IoT Hub). |
| **schedulerInterval** | TimeSpan string | Internal scheduler interval. |
| **gatewayHostname** | string | Host name of the Azure Iot Hub. Usually \<my-hub\>.azure-devices.net |
| **filePath** | string - path to file | Path to the file that contains the authentication secret.|
| **type** | "SymmetricKey", "SelfSignedCertificate" | The user secret for authentication. Choose *SymmetricKey* if the user secret is a Symmetric key, choose *self-signed certificate* if the secret is a self-signed certificate. |
| **identity** | "DPS", "Module", "Device" | Authentication identity - DPS if authentication is made through DPS, Module if authentication is made using module credentials, or device if authentication is made using device credentials.
| **certificateLocationKind** |  "LocalFile", "Store" | LocalFile if the certificate is stored in a file, store if the certificate is located in a certificate store. |
| **idScope** | string | ID scope of DPS |
| **registrationId** | string  | DPS device registration ID. |


### Authentication.config example

```xml
<?xml version="1.0" encoding="utf-8"?>
<Authentication>
  <add key="moduleName" value="azureiotsecurity"/>
  <add key="deviceId" value="d1"/>
  <add key="gatewayHostname" value=""/>
  <add key="filePath" value="c:\p-dps-d1.pfx"/>
  <add key="type" value="SelfSignedCertificate" />                     <!-- SymmetricKey, SelfSignedCertificate-->
  <add key="identity" value="DPS" />                 <!-- Device, Module, DPS -->
  <add key="certificateLocationKind" value="LocalFile" />  <!-- LocalFile, Store -->
  <add key="idScope" value="0ne0005335B"/>
  <add key="registrationId" value="d1"/>
</Authentication>
```

### SecurityIotInterface.config

| Configuration Name | Possible values | Details |
|:-----------|:---------------|:--------|
| **transportType** | "Ampq" "Mqtt" | IoT Hub transport type. |


### SecurityIotInterface.config example

```xml
<ExternalInterface>
  <add key="facadeType"  value="Microsoft.Azure.Security.IoT.Agent.Common.SecurityIoTHubInterface, Security.Common" />
  <add key="transportType" value="Amqp"/>
</ExternalInterface>
```

## Next steps

- Read the Defender for IoT service [Overview](overview.md)
- Learn more about Defender for IoT [Agent-based solution architecture](architecture-agent-based.md)
- Enable the Defender for IoT [service](quickstart-onboard-iot-hub.md)
- Read the Defender for IoT service [FAQ](resources-agent-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand security [alerts](concept-security-alerts.md)
