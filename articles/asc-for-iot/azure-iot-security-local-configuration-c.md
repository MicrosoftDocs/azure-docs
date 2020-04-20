---
title: Security agent local configuration (C)
description: Learn about Azure Security Center for agent local configurations for C.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 2cf6a49b-5d35-491f-abc3-63ec24eb4bc2
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2019
ms.author: mlottner
---

# Understanding the LocalConfiguration.json file - C agent

The Azure Security Center for IoT security agent uses configurations from a local configuration file.
The security agent reads the configuration once,  at agent start-up.
The configuration found in the local configuration file contains authentication configuration and other agent related configurations.
The file contains configurations in "Key-Value" pairs in JSON notation and the configurations get populated when the agent is installed.

By default, the file is located at: /var/ASCIoTAgent/LocalConfiguration.json

Changes to the configuration file take place when the agent is restarted.

## Security agent configurations for C

| Configuration Name | Possible values | Details |
|:-----------|:---------------|:--------|
| AgentId | GUID | The agent Unique identifier |
| TriggerdEventsInterval | ISO8601 string | Scheduler interval for triggered events collection |
| ConnectionTimeout | ISO8601 string | Time period before the connection to IoThub gets timed out |
| Authentication | JsonObject | Authentication configuration. This object contains all the information needed for authentication against IoTHub |
| Identity | "DPS", "SecurityModule", "Device" | Authentication identity - DPS if authentication is made through DPS, SecurityModule if authentication is made via security module credentials or device if authentication is made with Device credentials |
| AuthenticationMethod | "SasToken", "SelfSignedCertificate" | the user secret for authentication - Choose SasToken if the use secret is a Symmetric key, choose self signed certificate if the secret is a self signed certificate  |
| FilePath | Path to file (string) | Path to the file that contains the authentication secret |
| HostName | string | The host name of the azure iot hub. usually <my-hub>.azure-devices.net |
| DeviceId | string | The ID of the device (as registered in Azure IoT Hub) |
| DPS | JsonObject | DPS related configurations |
| IDScope | string | ID scope of DPS |
| RegistrationId | string  | DPS device registration ID |
| Logging | JsonObject | Agent logger related configurations |
| SystemLoggerMinimumSeverity | 0 <= number <= 4 | log messages equal and above this severity will be logged to /var/log/syslog (0 is the lowest severity) |
| DiagnosticEventMinimumSeverity | 0 <= number <= 4 | log messages equal and above this severity will be sent as diagnostic events (0 is the lowest severity) |

## Security agent configurations code example

```JSON
{
    "Configuration" : {
        "AgentId" : "b97faf0a-0f57-471f-9dab-46a8e1764946",
        "TriggerdEventsInterval" : "PT2M",
        "ConnectionTimeout" : "PT30S",
        "Authentication" : {
            "Identity" : "Device",
            "AuthenticationMethod" : "SasToken",
            "FilePath" : "/path/to/my/SymmetricKey",
            "DeviceId" : "my-device",
            "HostName" : "my-iothub.azure-devices.net",
            "DPS" : {
                "IDScope" : "",
                "RegistrationId" : ""
            }
        },
        "Logging": {
            "SystemLoggerMinimumSeverity": 0,
            "DiagnoticEventMinimumSeverity": 2
        }
    }
}
```

## Next steps

- Read the Azure Security Center for IoT service [Overview](overview.md)
- Learn more about Azure Security Center for IoT [Architecture](architecture.md)
- Enable the Azure Security Center for IoT [service](quickstart-onboard-iot-hub.md)
- Read the Azure Security Center for IoT service [FAQ](resources-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand security [alerts](concept-security-alerts.md)
