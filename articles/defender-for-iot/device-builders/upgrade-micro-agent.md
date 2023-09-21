---
title: Upgrade the Microsoft Defender for IoT micro agent
description: Learn how to upgrade your Defender for IoT micro agent for device builders.
ms.date: 02/20/2022
ms.topic: how-to
---

# Upgrade the Microsoft Defender for IoT micro agent

This article describes how to upgrade a Microsoft Defender for IoT micro agent with the latest software version.

For more information, see our [release notes for device builders](release-notes.md).

## Upgrade a micro agent from version 4.2.* to 4.6.2

When upgrading the micro agent from version 4.2.* to 4.6.2, you would first need to remove the package and then reinstall it.

**Standalone micro agent:**

1. Remove the current package. Run:

    ```bash
    sudo apt-get remove defender-iot-micro-agent
    ```

1. Ensure that you've upgraded the apt. Run:

    ```bash
    sudo apt-get update
    ```

1. Install the Defender for IoT micro agent on Debian or Ubuntu-based Linux distributions. Run:

    ```bash
    sudo apt-get install defender-iot-micro-agent
    ```

**Micro agent for Edge:**

1. Remove the current package. Run:

    ```bash
    sudo apt-get remove defender-iot-micro-agent-edge
    ```

1. Ensure that you've upgraded the apt. Run:

    ```bash
    sudo apt-get update
    ```

1. Install the Defender for IoT micro agent on Debian or Ubuntu-based Linux distributions. Run:

    ```bash
    sudo apt-get install defender-iot-micro-agent-edge
    ```

## Upgrade a standalone micro agent

1. Ensure that you've upgraded the apt. Run:

    ```bash
    sudo apt-get update
    ```

1. Install the Defender for IoT micro agent on Debian or Ubuntu-based Linux distributions. Run:

    ```bash
    sudo apt-get install defender-iot-micro-agent
    ```

## Upgrade a micro agent for Edge

1. Ensure that you've upgraded the apt. Run:

    ```bash
    sudo apt-get update
    ```

1. Install the Defender for IoT micro agent on Debian or Ubuntu-based Linux distributions for Edge. Run:

    ```bash
    sudo apt-get install defender-iot-micro-agent-edge
    ```

## Upgrade a standalone micro agent from a legacy version

This section is relevant specifically when upgrading a micro agent from version 3.13.1 or lower to version 4.1.2 or higher.

In version 4.1.2, the standalone micro agent directory changed to align with standard Linux installation directory structures. This change requires customers to reauthenticate the micro agent and modify the connection string location.

1. Upgrade your micro agent as described [above](#upgrade-a-standalone-micro-agent).

1. Reauthenticate your micro agent. For more information, see [Authenticate the micro agent](tutorial-standalone-agent-binary-installation.md#authenticate-the-micro-agent).

## Install a specific version of the micro agent

Specify a version number in your command to install the specified micro agent version.

Use the following command syntax:

```bash
sudo apt-get install defender-iot-micro-agent=<version>
```

## Next steps

For more information, see:

- [Install Defender for IoT micro agent for Edge](how-to-install-micro-agent-for-edge.md)

- [Tutorial: Create a DefenderforIoTMicroAgent module twin](tutorial-create-micro-agent-module-twin.md)
