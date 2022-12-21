---
title: Provision Microsoft Defender micro agent using DPS
description: Learn how to install, and authenticate the Microsoft Defender Micro agent for Edge.
ms.date: 02/08/2022
ms.topic: how-to
---

# Provision Microsoft Defender micro agent using DPS

This article explains how to provision the standalone Defender micro agent using [Azure IoT Hub Device Provisioning Service](https://learn.microsoft.com/azure/iot-dps/) with [X.509 certificate attestation](https://learn.microsoft.com/azure/iot-dps/concepts-x509-attestation).

To learn how to configure an Edge Defender micro agent please see [Create and provision IoT Edge devices at scale](https://learn.microsoft.com/azure/iot-edge/how-to-provision-devices-at-scale-linux-tpm?toc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fazure%2Fiot-dps%2Ftoc.json&bc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&view=iotedge-1.4&tabs=physical-device%2Cubuntu).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [IoT hub](https://learn.microsoft.com/azure/iot-hub/iot-hub-create-through-portal).

- [IoT Hub Device Provisioning Service](https://learn.microsoft.com/azure/iot-dps/quick-setup-auto-provision).

## Provision

1. In the [Azure portal](https://portal.azure.com), go to your instance of the IoT Hub device provisioning service.

1. Under Settings, select Manage enrollments.
1. Select Add individual enrollment, and then complete the steps to configure the enrollment:
    1. Choose X.509 at the identity attestation Mechanism and choose your CA.
1. Navigate into your destination IoT Hub.
1. Create a new module issued by the same certificate.
1. Configure the micro agent to use the created module (Note that the device does not have to exist yet).
1. Navigate back to DPS and provision the device through DPS.
1. Navigate to the configured device in the destination IoT Hub.
1. Create a new module for the device issued by the same CA authenticator.
1. Run the agent that you configured in step 4 to see it connects to the device.

> [!NOTE]
> Note that using this procedure, while you don't need the device to exists before configuring the agent, you do need to know the device name in advance in order to issue the certificate for the final module correctly.

## Next steps

> [Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md)

> [Configure pluggable Authentication Modules (PAM) to audit sign-in events (Preview)](configure-pam-to-audit-sign-in-events.md)
