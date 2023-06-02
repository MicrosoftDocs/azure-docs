---
title: Activate and set up an OT network sensor - Microsoft Defender for IoT 
description: Learn how to activate and set up a Microsoft Defender for IoT OT network sensor.
ms.date: 01/22/2023
ms.topic: install-set-up-deploy
---

# Activate and set up your OT network sensor

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to activate and set up an OT sensor for the first time.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

## Prerequisites

To perform the procedures in this article, you need:

- An OT sensor [onboarded](../onboard-sensors.md) to Defender for IoT in the Azure portal and [installed](install-software-ot-sensor.md) or [purchased](../ot-pre-configured-appliances.md).

- The sensor's activation file, which was downloaded after [onboarding your sensor](../onboard-sensors.md). You need a unique activation file for each OT sensor you deploy.

    [!INCLUDE [root-of-trust](../includes/root-of-trust.md)]

- A SSL/TLS certificate. We recommend using a CA-signed certificate, and not a self-signed certificate. For more information, see [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

- Access to the OT sensor as an **Admin** user, or as one of the [privileged users supplied during installation](install-software-ot-sensor.md#credentials)

    If you purchased a [preconfigured sensor](../ot-pre-configured-appliances.md), you're prompted to generate a password when signing in for the first time.

This step is performed by your deployment teams.

## Sign in to your OT sensor

If you installed software on a sensor appliance yourself, you'll have received a set of credentials for privileged access during the [software installation process](install-software-ot-sensor.md#credentials). If you purchased pre-configured appliances, your credentials will have been delivered with the appliance.

We recommend using the **Support** credentials when signing into the OT sensor for the first time. For more information, see [Default privileged on-premises users](../roles-on-premises.md#default-privileged-on-premises-users).

**To sign in to your OT sensor**:

1. In a browser, go to the OT sensor's IP address, and enter the username and password.

    > [!NOTE]
    > If you forgot your password, select **Reset Password**. For more information, see [Investigate password failure at initial sign-in](../how-to-troubleshoot-sensor.md#investigate-password-failure-at-initial-sign-in).
    >

    If you're working with a pre-configured appliance, you're prompted to enter a new password.

1. Select **Login** to continue with the deployment wizard.

## Confirm network settings

The first time you sign in to your OT network sensors, you're prompted to confirm the OT sensor's network settings. These network settings were configured during installation or when you purchased a preconfigured OT sensor.

**In the deployment wizard's *Sensor network settings* page**:

1. Confirm or enter the following details for your OT sensor:

    - **IP address**:     Changing the IP address may require you to sign in again.
    - **Subnet mask**
    - **Default gateway**
    - **DNS**
    - **Hostname** (optional). If defined, make sure that the hostname matches the name that's configured in your organization's DNS server.

1. If you're connecting via a proxy, select **Enable Proxy**, and then enter the following details for your proxy server

    - **Proxy host**
    - **Proxy port**
    - **Proxy username** (optional)

1. Select **Next** to continue in the **Activation** screen.

## Activate the OT sensor

Activate your OT sensor to connect it to your [Azure subscription and OT plan](../how-to-manage-subscriptions.md) and enforce the configured number of committed devices.

**In the deployment wizard's *Sensor Activation* screen**:

1. Select **Upload** to upload the activation file you'd downloaded after [onboarding your sensor to Azure](../onboard-sensors.md).

    Make sure that the confirmation message includes the name of the sensor that you're deploying.

1. Select the **Approve these terms and conditions** option, and then select **Activate** to continue in the **Certificates** screen.

> [!NOTE]
> Both cloud-connected and locally-managed sensors remain activated for as long as your Azure subscription with your Defender for IoT plan is active. You may need to [re-activate your sensor](../how-to-manage-individual-sensors.md#upload-a-new-activation-file) in specific cases, such as if you're changing from a locally-managed sensor to a cloud-connected sensor.
>

## Deploy an SSL/TLS certificate

The following procedures describe how to deploy an SSL/TLS certificate on your OT sensor. We recommend that you use a [CA-signed certificate](create-ssl-certificates.md) for all production environments.

If you're working on a testing environment, you can also use the self-signed certificate that's generated during installation. For more information, see [Manage SSL/TLS certificates](../how-to-manage-individual-sensors.md#manage-ssltls-certificates).

**In the deployment wizard's *SSL/TLS Certificate* screen**:

1. Select **Import trusted CA certificate (recommended)** to deploy a CA-signed certificate.

    Enter the certificates name and passphrase, and then select **Upload** to upload your private key file, certificate file, and an optional certificate chain file.

    You may need to refresh the page after uploading your files.

1. Select **Enable certificate validation** to force your sensor to validate the certificate against a certificate revocation list (CRL), as [configured in your certificate](../best-practices/certificate-requirements.md#crt-file-requirements).

1. Select **Save** to open your OT sensor console.

For more information, see [Troubleshoot certificate upload errors](../how-to-manage-individual-sensors.md#troubleshoot-certificate-upload-errors).

## Next steps

> [!div class="step-by-step"]
> [« Validate after installing software](post-install-validation-ot-software.md)

> [!div class="step-by-step"]
> [Configure proxy settings on an OT sensor »](../connect-sensors.md)
