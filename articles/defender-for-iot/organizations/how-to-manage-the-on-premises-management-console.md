---
title: Maintain the on-premises management console from the GUI - Microsoft Defender for IoT
description: Learn about on-premises management console options like backup and restore, defining the host name, and setting up a proxy to sensors.
ms.date: 06/02/2022
ms.topic: how-to
---

# Maintain the on-premises management console

This article describes extra on-premises management console activities that you might perform outside of a larger deployment process.

[!INCLUDE [caution do not use manual configurations](includes/caution-manual-configurations.md)]

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- An on-premises management console [installed](ot-deploy/install-software-on-premises-management-console.md) and [activated](ot-deploy/activate-deploy-management.md).

- Access to the on-premises management console as an **Admin** user. Selected procedures and CLI access also requires a privileged user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- An [SSL/TLS certificate prepared](ot-deploy/create-ssl-certificates.md) if you need to update your sensor's certificate.

- If you're adding a secondary NIC, you'll need access to the CLI as a [privileged user](roles-on-premises.md#default-privileged-on-premises-users).

## Download software for the on-premises management console

You may need to download software for your on-premises management console if you're [installing Defender for IoT software](ot-deploy/install-software-on-premises-management-console.md) on your own appliances, or [updating software versions](update-ot-software.md).

In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, use one of the following options:

- For a new installation or standalone update, select **Getting started** > **On-premises management console**.

   - For a new installation, select a version in the **Purchase an appliance and install software** area, and then select **Download**.
   - For an update, select your update scenario in the **On-premises management console** area and then select **Download**.

- If you're updating your on-premises management console together with connected OT sensors, use the options in the **Sites and sensors** page > **Sensor update (Preview)** menu.

## Add a secondary NIC after installation

Enhance security to your on-premises management console by adding a secondary NIC dedicated for attached sensors within an IP address range. When you use a secondary NIC, the first is dedicated for end-users, and the secondary supports the configuration of a gateway for routed networks.

This procedure describes how to add a secondary NIC after [installing your on-premises management console](ot-deploy/install-software-on-premises-management-console.md).

**To add a secondary NIC**:

1. Sign into your on-premises management console via SSH to access the [CLI](../references-work-with-defender-for-iot-cli-commands.md), and run:

    ```bash
    sudo cyberx-management-network-reconfigure
    ```

1. Enter the following responses to the following questions:

    :::image type="content" source="media/tutorial-install-components/network-reconfig-command.png" alt-text="Screenshot of the required answers to configure your appliance. ":::

    | Parameters | Response to enter |
    |--|--|
    | **Management Network IP address** | `N` |
    | **Subnet mask** | `N` |
    | **DNS** | `N` |
    | **Default gateway IP Address** | `N` |
    | **Sensor monitoring interface** <br>Optional. Relevant when sensors are on a different network segment.| `Y`, and select a possible value |
    | **An IP address for the sensor monitoring interface** | `Y`, and enter an IP address that's  accessible by the sensors|
    | **A subnet mask for the sensor monitoring interface** | `Y`, and enter an IP address that's  accessible by the sensors|
    | **Hostname** | Enter the hostname |

1. Review all choices and enter `Y` to accept the changes. The system reboots.

## Upload a new activation file

You'd activated your on-premises management console as part of your deployment.

You may need to reactivate your on-premises management console as part of maintenance procedures, such as if the total number of monitored devices exceeds the number of [committed devices you'd previously defined](how-to-manage-subscriptions.md#onboard-a-defender-for-iot-plan-for-ot-networks).

> [!TIP]
> If your OT sensors detect more devices than you have defined as committed devices in your OT plan, your on-premises management console will show a warning message, prompting you to update the number of committed devices. Make sure that you update your activation file after updating the OT plan with the new number of committed devices.
>

**To upload a new activation file to your on-premises management console**:

1. In Defender for IoT on the Azure portal, select **Plans and pricing** > **Download on-premises management console activation file**.

   Save your downloaded file in a location that's accessible from the on-premises management console.

   [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Sign into your on-premises management console and select **System Settings** > **Activation**.

1. In the **Activation** dialog, select **CHOOSE FILE** and browse to the activation file you'd downloaded earlier.

1. Select **Close** to save your changes.

## Manage SSL/TLS certificates

If you're working with a production environment, you'd deployed a [CA-signed SSL/TLS certificate](ot-deploy/activate-deploy-management.md#deploy-an-ssltls-certificate) as part of your on-premises management console deployment. We recommend using self-signed certificates only for testing purposes.

The following procedures describe how to deploy updated SSL/TLS certificates, such as if the certificate has expired.

# [Deploy a CA-signed certificate](#tab/ca-signed)

**To deploy a CA-signed certificate**:

1. Sign into your on-premises management console and select **System Settings** > **SSL/TLS Certificates**.

1. In the **SSL/TLS Certificates** dialog, select **+ Add Certificate** and enter the following values:

   | Parameter  | Description  |
   |---------|---------|
   | **Certificate Name**     |   Enter your certificate name.      |
   | **Passphrase** - *Optional*    |  Enter a passphrase.       |
   | **Private Key (KEY file)**     |  Upload a Private Key (KEY file).       |
   | **Certificate (CRT file)**     | Upload a Certificate (CRT file).        |
   | **Certificate Chain (PEM file)** - *Optional*    |  Upload a Certificate Chain (PEM file).       |

   For example:

   :::image type="content" source="media/how-to-deploy-certificates/management-ssl-certificate.png" alt-text="Screenshot of importing a trusted CA certificate." lightbox="media/how-to-deploy-certificates/management-ssl-certificate.png":::

   If the upload fails, contact your security or IT administrator. For more information, see [SSL/TLS certificate requirements for on-premises resources](best-practices/certificate-requirements.md) and [Create SSL/TLS certificates for OT appliances](ot-deploy/create-ssl-certificates.md).

1. Select the **Enable Certificate Validation** option to turn on system-wide validation for SSL/TLS certificates with the issuing [Certificate Authority](ot-deploy/create-ssl-certificates.md#create-a-ca-signed-ssltls-certificate) and [Certificate Revocation Lists](ot-deploy/create-ssl-certificates.md#verify-crl-server-access).

    If this option is turned on and validation fails, communication between relevant components is halted, and a validation error is shown on the sensor. For more information, see [CRT file requirements](best-practices/certificate-requirements.md#crt-file-requirements).

1. Select **Save** to save your changes.

# [Create and deploy a self-signed certificate](#tab/windows)

Each on-premises management console is installed with a self-signed certificate that we recommend you use only for testing purposes. In production environments, we recommend that you always use a CA-signed certificate.

Self-signed certificates lead to a less secure environment, as the owner of the certificate can't be validated and the security of your system can't be maintained.

To create a self-signed certificate, download the certificate file from your on-premises management console and then use a certificate management platform to create the certificate files you'll need to upload back to the on-premises management console.

**To create a self-signed certificate**:

1. Go to the on-premises management console's IP address in a browser.

[!INCLUDE [self-signed-certificate](includes/self-signed-certificate.md)]

When you're done, use the following procedures to validate your certificate files:

- [Verify CRL server access](ot-deploy/create-ssl-certificates.md#verify-crl-server-access)
- [Import the SSL/TLS certificate to a trusted store](ot-deploy/create-ssl-certificates.md#import-the-ssltls-certificate-to-a-trusted-store)
- [Test your SSL/TLS certificates](ot-deploy/create-ssl-certificates.md#test-your-ssltls-certificates)

**To deploy a self-signed certificate**:

1. Sign into your on-premises management console and select **System settings** > **SSL/TLS Certificates**.

1. In the **SSL/TLS Certificates** dialog, keep the default **Locally generated self-signed certificate (insecure, not recommended)** option selected.

1. Select **I CONFIRM** to acknowledge the warning.

1. Select the **Enable certificate validation** option to validate the certificate against a [CRL server](ot-deploy/create-ssl-certificates.md#verify-crl-server-access). The certificate is checked once during the import process.

   If this option is turned on and validation fails, communication between relevant components is halted, and a validation error is shown on the sensor. For more information, see [CRT file requirements](best-practices/certificate-requirements.md#crt-file-requirements).

1. Select **Save** to save your certificate settings.

---

### Troubleshoot certificate upload errors

[!INCLUDE [troubleshoot-ssl](includes/troubleshoot-ssl.md)]

## Change the name of the on-premises management console

The default name of your on-premises management console is **Management console**, and is shown in the on-premises management console GUI and troubleshooting logs.

To change the name of your on-premises management console:

1. Sign into your on-premises management console and select the name on the bottom-left, just above the version number.

1. In the **Edit management console configuration** dialog, enter your new name. The name must have a maximum of 25 characters. For example:

    :::image type="content" source="media/how-to-manage-the-on-premises-management-console/change-name.png" alt-text="Screenshot of how to change the name of your on-premises management console.":::

1. Select **Save** to save your changes.

## Recover a privileged user password

If you no longer have access to your on-premises management console as a [privileged user](roles-on-premises.md#default-privileged-on-premises-users), recover access from the Azure portal.

**To recover privileged user access**:

1. Go to the sign-in page for your on-premises management console and select **Password Recovery**.

1. Select the user that you want to recover access for, either the **Support** or **CyberX** user.

1. Copy the identifier that's displayed in the **Password Recovery** dialog to a secure location.

1. Go to Defender for IoT in the Azure portal, and make sure that you're viewing the subscription that was used to onboard the OT sensors currently connected to the on-premises management console.

1. Select **Sites and sensors** > **More actions** > **Recover an on-premises management console password**.

1. Enter the secret identifier you'd copied earlier from your on-premises management console and select **Recover**.

    A `password_recovery.zip` file is downloaded from your browser.

   [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. In the **Password Recovery** dialog on the on-premises management console, select **Upload** and select the `password_recovery.zip` file you'd downloaded.

Your new credentials are displayed.

## Edit the host name

The on-premises management console's hostname must match the hostname configured in the organizational DNS server.

**To edit the hostname saved on the on-premises management console**:

1. Sign into the on-premises management console and select **System Settings**.

1. In the **Management console networking** area, select **Network**.

1. Enter the new hostname and select **SAVE** to save your changes.

## Define VLAN names

VLAN names aren't synchronized between an OT sensor and the on-premises management console. If you've [defined VLAN names on your OT sensor](how-to-control-what-traffic-is-monitored.md#customize-a-vlan-name), we recommend that you define identical VLAN names on the on-premises management console.

**To define VLAN names**:

1. Sign into the on-premises management console and select **System Settings**.

1. In the **Management console networking** area, select **VLAN**.

1. In the **Edit VLAN Configuration** dialog, select **Add VLAN** and then enter your VLAN ID and name, one at a time.

1. Select **SAVE** to save your changes.

## Configure SMTP mail server settings

Define SMTP mail server settings on your on-premises management console so that you configure the on-premises management console to send data to other servers and partner services.

For example, you'll need an SMTP mail server configured to set up mail forwarding and configure [forwarding alert rules](how-to-forward-alert-information-to-partners.md).

**Prerequisites**:

Make sure you can reach the SMTP server from the on-premises management console.

**To configure an SMTP server on your on-premises management console**:

1. Sign into your on-premises management console as a [privileged user](roles-on-premises.md#default-privileged-on-premises-users) via SSH/Telnet.

1. Run:

    ```bash
    nano /var/cyberx/properties/remote-interfaces.properties
    ```

1. Enter the following SMTP server details as prompted:

   - `mail.smtp_server`
   - `mail.port`. The default port is `25`.
   - `mail.sender`

## Next steps

For more information, see:

- [Update OT system software](update-ot-software.md)
- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Troubleshoot the on-premises management console](how-to-troubleshoot-on-premises-management-console.md)
