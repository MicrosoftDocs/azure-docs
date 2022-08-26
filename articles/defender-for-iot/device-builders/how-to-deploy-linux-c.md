---
title: Install & deploy Linux C agent
description: Learn how to install and deploy the Defender for IoT C-based security agent on Linux
ms.topic: conceptual
ms.date: 03/28/2022
---

# Deploy Defender for IoT C based security agent for Linux

This guide explains how to install and deploy the Defender for IoT C-based security agent on Linux.

- Install
- Verify deployment
- Uninstall the agent
- Troubleshoot

## Prerequisites

For other platforms and agent flavors, see [Choose the right security agent](how-to-deploy-agent.md).

1. To deploy the security agent, local admin rights are required on the machine you wish to install on (sudo).

1. [Create a Defender-IoT-micro-agent](quickstart-create-security-twin.md) for the device.

## Installation

To install and deploy the security agent, use the following workflow:

1. Download the most recent version to your machine from [GitHub](https://aka.ms/iot-security-github-c).

1. Extract the contents of the package and navigate to the _/src/installation_ folder.

1. Add running permissions to the **InstallSecurityAgent script** by running the following command:

   ```
   chmod +x InstallSecurityAgent.sh
   ```

1. Next, run:

   ```
   ./InstallSecurityAgent.sh -aui <authentication identity> -aum <authentication method> -f <file path> -hn <host name> -di <device id> -i
   ```

   See [How to configure authentication](concept-security-agent-authentication-methods.md) for more information about authentication parameters.

This script performs the following function:

1. Installs prerequisites.

1. Adds a service user (with interactive sign-in disabled).

1. Installs the agent as a **Daemon** - assumes the device uses **systemd** for service management.

1. Configures the agent with the authentication parameters provided.

For additional help, run the script with the –help parameter:

`./InstallSecurityAgent.sh --help`

### Uninstall the agent

To uninstall the agent, run the script with the –-uninstall parameter:

`./InstallSecurityAgent.sh -–uninstall`

## Troubleshooting

Check the deployment status by running:

`systemctl status ASCIoTAgent.service`

## Next steps

- Read the Defender for IoT service [Overview](overview.md)
- Learn more about Defender for IoT [What is agent-based solution for device builders](architecture-agent-based.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [Microsoft Defender for IoT agent frequently asked questions](resources-agent-frequently-asked-questions.md)
- Understand [security alerts](concept-security-alerts.md)
