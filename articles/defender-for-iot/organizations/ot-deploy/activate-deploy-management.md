---
title: Activate and set up an on-premises management console - Microsoft Defender for IoT 
description: Learn how to activate and set up an on-premises management console when deploying your Microsoft Defender for IoT system for OT network monitoring.
ms.date: 05/17/2023
ms.topic: install-set-up-deploy
---

# Activate and set up an on-premises management console

This article is one in a series of articles describing the [deployment path](air-gapped-deploy.md) for a Microsoft Defender for IoT on-premises management console for air-gapped OT sensors.

:::image type="content" source="../media/deployment-paths/management-activate.png" alt-text="Diagram of a progress bar with Activate and initial setup highlighted." border="false":::

When working in an air-gapped or hybrid operational technology (OT) environment with multiple sensors, use an on-premises management console to configure settings and view data in a central location for all connected OT sensors.

This article describes how to activate your on-premises management console and configure settings for an initial deployment.

## Prerequisites

Before performing the procedures in this article, you need to have:

- An [on-premises management console installed](install-software-on-premises-management-console.md)

- Access to the on premises management console as one of the [privileged users supplied during installation](install-software-on-premises-management-console.md#users)

- An SSL/TLS certificate. We recommend using a CA-signed certificate, and not a self-signed certificate. For more information, see [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

- Access to the Azure portal as a [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user

- A Defender for IoT OT plan. For more information, see [Add an OT plan to your Azure subscription](../how-to-manage-subscriptions.md#add-an-ot-plan-to-your-azure-subscription).

    When you add a plan, you're given the option of downloading an activation file for your on-premises management console. Either use the file you'd downloaded then, or use the steps in this article to download it afresh.

## Sign in to your on-premises management console

During the [software installation process](install-software-on-premises-management-console.md#users), you'll have received a set of credentials for privileged access. We recommend using the **Support** credentials when signing into the on-premises management console for the first time.

For more information, see [Default privileged on-premises users](../roles-on-premises.md#default-privileged-on-premises-users).

In a browser, go to the on-premises management console's IP address, and enter the username and password.

> [!NOTE]
> If you forgot your password, select **Password recovery** to reset the password. For more information, see [Recover a privileged user password](../how-to-manage-the-on-premises-management-console.md#recover-a-privileged-user-password).
>

## Activate the on-premises management console

Activate your on-premises management console using a downloaded file from the Azure portal. Either use an activation file you'd downloaded when [adding your plan](../how-to-manage-subscriptions.md#add-an-ot-plan-to-your-azure-subscription), or use the steps in this procedure to download the activation file afresh.

**To download the activation file**:

1. In Defender for IoT in the Azure portal, select **Plans and pricing**.

    > [!NOTE]
    > If you'd prefer to start in the on-premises management console, you'll see a message prompting you to take action for a missing activation file after signing into the on-premises management console for the first time.
    >
    > In the message bar, select the **Take action** link. An **Activation** dialog shows the number of monitored and licensed devices. <br><br>Since you're just starting the deployment, both of these values should be **0**. <br>        <br> Select the link to the **Azure portal** to jump to Defender for IoT's **Plans and pricing** page in the Azure portal.     |

1. In the **Plans** grid, select your subscription.

    If you don't see the subscription that you're looking for, make sure that you're viewing the Azure portal with the correct subscriptions selected. For more information, see [Manage Azure portal settings](../../../azure-portal/set-preferences.md).

1. In the toolbar, select **Download on-premises management console activation file**. The activation file downloads.

    [!INCLUDE [root-of-trust](../includes/root-of-trust.md)]

**To activate your on-premises management console**:

1. If you haven't yet, sign into your on-premises management console. In the **Activation** dialog, select **CHOOSE FILE** and select the downloaded activation file.

    A confirmation message appears to confirm that the file's been uploaded successfully.

> [!NOTE]
> You'll need to upload a new activation file in specific cases, such as if you purchase a new license for a different site size after having uploaded your initial activation file.
>
> For more information, see [Upload a new activation file](../how-to-manage-the-on-premises-management-console.md#upload-a-new-activation-file).

### Activation files for legacy OT plans

Starting June 1, 2023, Microsoft Defender for IoT licenses for OT monitoring are available for purchase only in the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/Home), and OT sensors are onboarded to Defender for IoT based on your licensed site sizes.

Existing customers can continue to use any legacy OT plan, with no changes in functionality. If you're working with a legacy OT plan, and you select multiple subscriptions in the **Plans and pricing** page before downloading your activation file, the activation file is associated with all selected subscriptions and the number of devices licensed defined at the time of download.

## Deploy an SSL/TLS certificate

The following procedures describe how to deploy an SSL/TLS certificate on your OT sensor. We recommend using CA-signed certificates in production environments.

The requirements for SSL/TLS certificates are the same for OT sensors and on-premises management consoles. For more information, see:

- [SSL/TLS certificate requirements for on-premises resources](../best-practices/certificate-requirements.md)
- [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md)

**To upload a CA-signed certificate**:

1. Sign into your on-premises management console and select **System settings** > **SSL/TLS Certificates**.

1. In the **SSL/TLS Certificates** dialog, select **Add Certificate**.

1. In the **Import a trusted CA-signed certificate** area, enter a certificate name and optional [passphrase](../best-practices/certificate-requirements.md#supported-characters-for-keys-and-passphrases), and then upload your CA-signed certificate files.

1. (Optional) Clear the **Enable certificate validation** option to avoid validating the certificate against a CRL server.

1. Select **SAVE** to save your certificate settings.

For more information, see [Troubleshoot certificate upload errors](../how-to-manage-the-on-premises-management-console.md#troubleshoot-certificate-upload-errors).

## Next steps

> [!div class="step-by-step"]
> [« Install Microsoft Defender for IoT on-premises management console software](install-software-on-premises-management-console.md)

> [!div class="step-by-step"]
> [Connect OT network sensors to the on-premises management console »](connect-sensors-to-management.md)
