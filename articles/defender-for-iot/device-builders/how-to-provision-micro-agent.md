---
title: Provision the Microsoft Defender for IoT micro agent using DPS
description: Learn how to provision the Microsoft Defender for IoT micro agent using DPS. 
ms.date: 12/22/2022
ms.topic: how-to
---

# Provision the Microsoft Defender for IoT micro agent using DPS

This article explains how to provision the standalone Microsoft Defender for IoT micro agent using [Azure IoT Hub Device Provisioning Service](../../iot-dps/about-iot-dps.md) with [X.509 certificate attestation](../../iot-dps/concepts-x509-attestation.md).

To learn how to configure the Microsoft Defender for IoT micro agent for Edge devices see [Create and provision IoT Edge devices at scale](../../iot-edge/how-to-provision-devices-at-scale-linux-tpm.md)

## Prerequisites

- An Azure account with an active subscription. For more information, see [Create an Azure account](https://azure.microsoft.com/free).

- An [IoT hub](../../iot-hub/iot-hub-create-through-portal.md).

- [IoT Hub Device Provisioning Service](../../iot-dps/quick-setup-auto-provision.md).

## Provision

1. In the [Azure portal](https://portal.azure.com), go to your instance of the IoT Hub device provisioning service.

1. Under **Settings**, select **Manage enrollments**.

1. Select **Add individual enrollment**, and then complete the steps to configure the enrollment:

    - In the **Mechanism** field, select **X.509** at the identity attestation Mechanism and choose your CA.
  
1. Navigate into your destination IoT Hub.

1. [Create a new module](tutorial-create-micro-agent-module-twin.md) issued by the same certificate.

1. [Configure the micro agent to use the created module](tutorial-standalone-agent-binary-installation.md#authenticate-using-a-module-identity-connection-string) (note that the device does not have to exist yet).

1. Navigate back to DPS and [provision the device through DPS](../../iot-dps/quick-create-simulated-device-x509.md).

1. Navigate to the configured device in the destination IoT Hub.

1. Create a new module for the device issued by the same CA authenticator.

1. Run the agent that you configured in step 4 to confirm it connects to the device.

> [!NOTE]
> When using this procedure, while you don't need the device to exist before configuring the agent, you do need to know the device name in advance in order to issue the certificate for the final module correctly.

## Next steps

[Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md)

[Configure pluggable Authentication Modules (PAM) to audit sign-in events (Preview)](configure-pam-to-audit-sign-in-events.md)