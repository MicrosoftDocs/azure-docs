---
title: Troubleshoot security agent start-up (Linux)
description: Troubleshoot working with Microsoft Defender for IoT security agents for Linux.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Security agent troubleshoot guide (Linux)

This article explains how to solve potential problems in the security agent start-up process.

Microsoft Defender for IoT agent self-starts immediately after installation. The agent start-up process includes reading local configuration, connecting to Azure IoT Hub, and retrieving the remote twin configuration. Failure in any one of these steps may cause the security agent to fail.

In this troubleshooting guide you'll learn how to:

- Validate if the security agent is running
- Get security agent errors
- Understand and remediate security agent errors

## Validate if the security agent is running

1. To validate that the security agent is running, wait a few minutes after installing the agent and run the following command.
     <br>

    **C agent**

    ```bash
    grep "ASC for IoT Agent initialized" /var/log/syslog
    ```

    **C# agent**

    ```bash
    grep "Agent is initialized!" /var/log/syslog
    ```

1. If the command returns an empty line, the security agent was unable to start successfully.

## Force stop the security agent

In cases where the security agent is unable to start, stop the agent with the following command, then continue to the error table below:

```bash
systemctl stop ASCIoTAgent.service
```

## Get security agent errors

1. Retrieve security agent error(s) by running the following command:

    ```bash
    grep ASCIoTAgent /var/log/syslog
    ```

1. The get security agent error command retrieves all logs created by the Defender for IoT agent. Use the following table to understand the errors and take the correct steps for remediation.

> [!Note]
> Error logs are shown in chronological order. Make sure to note the timestamp of each error to help your remediation.

## Restart the agent

1. After locating and fixing a security agent error, try to restart the agent by running the following command.

    ```bash
    systemctl restart ASCIoTAgent.service
    ```

1. Repeat the previous process to retrieve stop and retrieve the errors if the agent continues to fail the startup process.

## Understand security agent errors

Most of the Security agent errors are displayed in the following format:

```
Defender for IoT agent encountered an error! Error in: {Error Code}, reason: {Error sub code}, extra details: {error specific details}
```

| Error Code | Error sub code | Error details | Remediate C | Remediate C# |
|--|--|--|--|--|
| Local Configuration | Missing configuration | A configuration is missing in the local configuration file. The error message should state which key is missing. | Add the missing key to the /var/LocalConfiguration.json file, see the [cs-localconfig-reference](azure-iot-security-local-configuration-c.md) for details. | Add the missing key to the General.config file, see the [c#-localconfig-reference](azure-iot-security-local-configuration-csharp.md) for details. |
| Local Configuration | Cant Parse Configuration | A configuration value can't be parsed. The error message should state which key can't be parsed. A configuration value cannot be parsed either because the value isn't in the expected type, or the value is out of range. | Fix the value of the key in /var/LocalConfiguration.json file so that it matches the LocalConfiguration schema, see the [c#-localconfig-reference](azure-iot-security-local-configuration-csharp.md) for details. | Fix the value of the key in General.config file so that it matches the schema, see the [cs-localconfig-reference](azure-iot-security-local-configuration-c.md) for details. |
| Local Configuration | File Format | Failed to parse configuration file. | The configuration file is corrupted, download the agent and re-install. | - |
| Remote Configuration | Timeout | The agent could not fetch the azureiotsecurity module twin within the timeout period. | Make sure authentication configuration is correct and try again. | The agent couldn't fetch the azureiotsecurity module twin within timeout period. Make sure authentication configuration is correct and try again. |
| Authentication | File Not Exist | The file in the given path doesn't exist. | Make sure the file exists in the given path or go to the **LocalConfiguration.json** file and change the **FilePath** configuration. | Make sure the file exists in the given path or go to the **Authentication.config** file and change the **filePath** configuration. |
| Authentication | File Permission | The agent does not have sufficient permissions to open the file. | Give the **asciotagent** user read permissions on the file in the given path. | Make sure the file is accessible. |
| Authentication | File Format | The given file is not in the correct format. | Make sure the file is in the correct format. The supported file types are .pfx and .pem. | Make sure the file is a valid certificate file. |
| Authentication | Unauthorized | The agent was not able to authenticate against IoT Hub with the given credentials. | Validate authentication configuration in LocalConfiguration file, go through the authentication configuration and make sure all the details are correct, validate that the secret in the file matches the authenticated identity. | Validate authentication configuration in Authentication.config, go through the authentication configuration and make sure all the details are correct, then validate that the secret in the file matches the authenticated identity. |
| Authentication | Not Found | The device / module was found. | Validate authentication configuration - make sure the hostname is correct, the device exists in IoT Hub and has an azureiotsecurity twin module. | Validate authentication configuration - make sure the hostname is correct, the device exists in IoT Hub and has an azureiotsecurity twin module. |
| Authentication | Missing Configuration | A configuration is missing in the *Authentication.config* file. The error message should state which key is missing. | Add the missing key to the *LocalConfiguration.json* file. | Add the missing key to the *Authentication.config* file, see the [c#-localconfig-reference](azure-iot-security-local-configuration-csharp.md) for details. |
| Authentication | Cant Parse Configuration | A configuration value can't be parsed. The error message should state which key can't be parsed. A configuration value can not be parsed because either the value is not of the expected type, or the value is out of range. | Fix the value of the key in the **LocalConfiguration.json** file. | Fix the value of the key in **Authentication.config** file to match the schema, see the [cs-localconfig-reference](azure-iot-security-local-configuration-c.md) for details.|

## Next steps

- Read the Defender for IoT service [Overview](overview.md)
- Learn more about Defender for IoT [agent-based solution for device builders](architecture-agent-based.md)
- Enable the Defender for IoT [service](quickstart-onboard-iot-hub.md)
- Read the Defender for IoT service [Defender for IoT FAQ](resources-agent-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand security [alerts](concept-security-alerts.md)
