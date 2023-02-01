---
title: 'How to configure SMTP settings (preview) within Azure Managed Grafana'
titleSuffix: Azure Managed Grafana
description: Learn how to configure SMTP settings (preview) to generate email notifications for Azure Managed Grafana
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 02/01/2023
---

# Configure SMTP settings (preview)

In this guide, learn how to configure SMTP settings to generate email alerts in Azure Managed Grafana. Notifications alert users when some given scenarios occur on a Grafana dashboard.

> [!IMPORTANT]
> Email settings is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can enable access to Grafana Enterprise plugins by selecting a Grafana Enterprise plan when creating a new workspace, or you can add a Grafana Enterprise plan on an already-created Azure Managed Grafana instance.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).
- An SMTP server

## Enable and configure SMTP settings

To activate SMTP settings, enable email notifications and configure an email contact point in Azure Managed Grafana, follow the steps below.

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Configuration**.
  1. Select the **Email Settings (Preview)** tab
  1. Toggle **SMTP Settings** on, so that **Enable** is displayed.
  1. SMTP settings appear. Fill out the form with the following configuration:

        | Parameter      | Example               | Description                                                                                                                             |
        |----------------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
        | Host           | smtp.smtphost.net:01  | Enter the SMTP host. Default is localhost:25.                                                                                           |
        | User           | admin                 | Enter the name of the SMTP user.                                                                                                        |
        | Password       | password              | Enter the SMTP password.                                                                                                                |
        | From Address   | email@outlook.com     | Enter the email address used when sending out emails. Default is `admin@grafana.localhost`                                                |
        | From Name      | Grafana Monitoring    | Enter the name used when sending out emails. Default is Grafana.                                                                        |
        | Skip Verify    | Disable               | SSL verification for the SMTP server. This setting is set to **Disable** by default. Optionally select **Enable** to skip verification. |
        | StartTLSPolicy | OpportunisticStartTLS | From the drop-down menu, select **OpportunisticStartTLS**, **“MandatoryStartTLS”**, or **“NoStartTLS”**                             |

  1. Select **Save** to save the SMTP settings. Updating may take a couple of minutes. Once the process has completed, the message "Updating the selections. Update successful" is displayed in the Azure **Notifications**.

Once you've entered and saved new SMTP settings, in the **Overview** page, the provisioning state of the instance turns to **Provisioning**, and then **Succeeded** once the update is complete.

## Configure Grafana notifications and send a test email

To create or update notification settings, follow the steps below :

  1. In the Azure portal, open your Grafana instance
  1. Select **Alerting > Contact points**, where you will find all your new contact point.
  1. Optionally edit the contact point **Name**, and **Contact point type**
  1. Enter a destination email under **Addresses**, and select **Test**
  1. Select **Send test notification** to send the notification with the predefined test message or select **Custom** to first edit the message.
  1. A notification "Test alert sent" is displayed, meaning that the email set up has been successfully configured. The test email has been sent to the provided email address. In case of misconfiguration, an error message will be displayed instead.

## Disable SMTP settings

1. To disable SMTP settings, in the Azure portal, in **Configuration**, toggle **SMTP Settings** off, so that **Disable** is displayed.
1. Select **Save** to validate and start updating your Azure Managed Grafana instance.

> [!NOTE]
> When a users disables SMTP settings, all SMTP credentials are removed from the backend.

## Grafana alerting error messages

Within the Grafana portal, you can find a list of all Grafana alerting error messages in **Alerting > Notifications**.

Below are some common error messages you may encounter.

- "Authentication failed: The provided authorization grant is invalid, expired, or revoked". Grafana couldn't connect to the SMTP server. Check if the password entered in the SMTP settings in the Azure portal is correct.
- "Failed to sent test alert.: SMTP not configured". SMTP is disabled. Open the Azure Managed Grafana instance in the Azure portal and enable SMTP settings.

## Next steps

In this how-to guide, you learned how to configure Grafana SMTP settings. To learn how to create and configure Grafana dashboards, go to:

> [!div class="nextstepaction"]
> [Create dashboards](how-to-create-dashboards.md)
