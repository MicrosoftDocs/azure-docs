---
title: Security agent local configuration (C)
description: Learn about Defender  for agent local configurations for C.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Understanding the LocalConfiguration.json file - C agent

The Defender  for IoT security agent uses configurations from a local configuration file.
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
| Identity | "DPS", "SecurityModule", "Device" | Authentication identity - DPS if authentication is made through DPS, SecurityModule if authentication is made via Defender-IoT-micro-agentcredentials or device if authentication is made with Device credentials |
| AuthenticationMethod | "SasToken", "SelfSignedCertificate" | the user secret for authentication - Choose SasToken if the use secret is a Symmetric key, choose self-signed certificate if the secret is a self-signed certificate  |
| FilePath | Path to file (string) | Path to the file that contains the authentication secret |
| HostName | string | The host name of the Azure IoT hub. usually \<my-hub\>.azure-devices.net |
| DeviceId | string | The ID of the device (as registered in Azure IoT Hub) |
| DPS | JsonObject | DPS related configurations |
| IDScope | string | ID scope of DPS |
| RegistrationId | string  | DPS device registration ID |
| Logging | JsonObject | Agent logger related configurations |
| SystemLoggerMinimumSeverity | 0 <= number <= 4 | log messages equal and above this severity will be logged to /var/log/syslog (0 is the lowest severity) |
| DiagnosticEventMinimumSeverity | 0 <= number <= 4 | log messages equal and above this severity will be sent as diagnostic events (0 is the lowest severity) |

## Security agent configurations code example

```json
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

- Read the Defender for IoT service [Overview](overview.md)
- Learn more about Defender for IoT [Agent-based solution architecture](architecture-agent-based.md)
- Enable the Defender for IoT [service](quickstart-onboard-iot-hub.md)
- Read the Defender for IoT service [FAQ](resources-agent-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand security [alerts](concept-security-alerts.md)
