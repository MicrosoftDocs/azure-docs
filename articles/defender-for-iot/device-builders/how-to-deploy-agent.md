---
title: Select and deploy security agents
description: Learn about how select and deploy Defender for IoT security agents on IoT devices.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Select and deploy a security agent on your IoT device

Defender for IoT provides reference architectures for security agents that monitor and collect data from IoT devices.
To learn more, see [Security agent reference architecture](security-agent-architecture.md).

Agents are developed as open-source projects, and are available in two flavors: <br> [C](https://aka.ms/iot-security-github-c), and [C#](https://aka.ms/iot-security-github-cs).

In this article, you learn how to:
- Compare security agent flavors
- Discover supported agent platforms
- Choose the right agent flavor for your solution

## Understand security agent options

Every Defender for IoT security agent flavor offers the same set of features, and supports similar configuration options.

The C-based security agent has a lower memory footprint, and is the ideal choice for devices with fewer available resources.

|     | C-based security agent | C#-based security agent |
| --- | ----------- | --------- |
| **Open-source** | Available under [MIT license](https://en.wikipedia.org/wiki/MIT_License) in [GitHub](https://aka.ms/iot-security-github-c) | Available under [MIT license](https://en.wikipedia.org/wiki/MIT_License) in [GitHub](https://aka.ms/iot-security-github-cs) |
| **Development language**    | C | C# |
| **Supported Windows platforms?** | No | Yes |
| **Windows prerequisites** | --- | [WMI](/windows/desktop/wmisdk/) |
| **Supported Linux platforms?** | Yes, x64 and x86 | Yes, x64 only |
| **Linux prerequisites** | libunwind8, libcurl3, uuid-runtime, auditd, audispd-plugins | libunwind8, libcurl3, uuid-runtime, auditd, audispd-plugins, sudo, netstat, iptables |
| **Disk footprint** | 10.5 MB | 90 MB |
| **Memory footprint (on average)** | 5.5 MB | 33 MB |
| **[Authentication](concept-security-agent-authentication-methods.md) to IoT Hub** | Yes | Yes |
| **Security data [collection](how-to-agent-configuration.md#supported-security-events)** | Yes | Yes |
| **Event aggregation** | Yes | Yes |
| **Remote configuration through [Defender-IoT-micro-agent twin](concept-security-module.md)** | Yes | Yes |

## Security agent installation guidelines

For **Windows**:
The Install SecurityAgent.ps1 script must be executed from an Administrator PowerShell window.

For **Linux**:
The InstallSecurityAgent.sh must be run as superuser. We recommend prefixing the installation command with "sudo".

## Choose an agent flavor

Answer the following questions about your IoT devices to select the correct agent:

- Are you using _Windows Server_ or _Windows IoT Core_?

    [Deploy a C#-based security agent for Windows](how-to-deploy-windows-cs.md).

- Are you using a Linux distribution with x86 architecture?

    [Deploy a C-based security agent for Linux](how-to-deploy-linux-c.md).

- Are you using a Linux distribution with x64 architecture?

    Both agent flavors can be used. <br>
    [Deploy a C-based security agent for Linux](how-to-deploy-linux-c.md) and/or
    [Deploy a C#-based security agent for Linux](how-to-deploy-linux-cs.md).

Both agent flavors offer the same set of features and support similar configuration options.
See [Security agent comparison](how-to-deploy-agent.md#understand-security-agent-options) to learn more.

## Supported platforms

The following list includes all currently supported platforms.

|Defender for IoT agent |Operating System |Architecture |
|--------------|------------|--------------|
|C|Ubuntu 16.04 |    x64|
|C|Ubuntu 18.04 |    x64, ARMv7|
|C|Debian 9 |    x64, x86|
|C#|Ubuntu 16.04     |x64|
|C#|Ubuntu 18.04    |x64, ARMv7|
|C#|Debian 9    |x64|
|C#|Windows Server 2016|    X64|
|C#|Windows 10 IoT Core, build 17763    |x64|
|

## Next steps

To learn more about configuration options, continue to the how-to guide for agent configuration.
> [!div class="nextstepaction"]
> [Agent configuration how to guide](./how-to-agent-configuration.md)
