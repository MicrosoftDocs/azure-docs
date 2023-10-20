---
title: 'How to configure SMTP settings within Azure Managed Grafana'
titleSuffix: Azure Managed Grafana
description: Learn how to configure SMTP settings to generate email notifications for Azure Managed Grafana
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to
ms.date: 02/01/2023
---

# Configure SMTP settings

In this guide, you learn how to configure SMTP settings to generate email alerts in Azure Managed Grafana. Notifications alert users when some given scenarios occur on a Grafana dashboard.

SMTP settings can be enabled on an existing Azure Managed Grafana instance via the Azure Portal and the Azure CLI. Enabling SMTP settings while creating a new instance is currently not supported.

## Prerequisites

To follow the steps in this guide, you must have:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create a new instance](quickstart-managed-grafana-portal.md).
- An SMTP server. If you don't have one yet, you may want to consider using [Twilio SendGrid's email API for Azure](https://azuremarketplace.microsoft.com/marketplace/apps/sendgrid.tsg-saas-offer).

## Enable and configure SMTP settings

Follow these steps to activate SMTP settings, enable email notifications and configure an email contact point in Azure Managed Grafana.

### [Portal](#tab/azure-portal)

  1. In the Azure portal, open your Grafana instance and under **Settings**, select **Configuration**.
  1. Select the **Email Settings** tab.
         :::image type="content" source="media/smtp-settings/find-settings.png" alt-text="Screenshot of the Azure platform. Selecting the SMTP settings tab.":::
  1. Toggle **SMTP Settings** on, so that **Enable** is displayed.
  1. SMTP settings appear. Fill out the form with the following configuration:

        | Parameter      | Example               | Description                                                                                                                                |
        |----------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
        | Host           | test.sendgrid.net:587 | Enter the SMTP server hostname with port.                                                                                                  |
        | User           | admin                 | Enter the name of the user of the SMTP authentication.                                                                                     |
        | Password       | password              | Enter password of the SMTP authentication. If the password contains "#" or ";" wrap it within triple quotes.                               |
        | From Address   | user@domain.com       | Enter the email address used when sending out emails.                                                                                      |
        | From Name      | Azure Managed Grafana Notification | Enter the name used when sending out emails. Default is "Azure Managed Grafana Notification" if parameter isn't given or empty. |
        | Skip Verify    | Disable                 |This setting controls whether a client verifies the server's certificate chain and host name. If **Skip Verify** is **Enable**, client accepts any certificate presented by the server and any host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks unless custom verification is used. Default is **Disable** (toggled off). [More information](https://pkg.go.dev/crypto/tls#Config).                              |
        | StartTLS Policy | OpportunisticStartTLS | There are three options. [More information](https://pkg.go.dev/github.com/go-mail/mail#StartTLSPolicy).<br><ul><li>**OpportunisticStartTLS** means that SMTP transactions are encrypted if STARTTLS is supported by the SMTP server. Otherwise, messages are sent in the clear. It's the default setting.</li><li>**MandatoryStartTLS** means that SMTP transactions must be encrypted. SMTP transactions are aborted unless STARTTLS is supported by the SMTP server.</li><li>**NoStartTLS** means encryption is disabled and messages are sent in the clear.</li></ul>          |

  1. Select **Save** to save the SMTP settings. Updating may take a couple of minutes.

       :::image type="content" source="media/smtp-settings/save-updated-settings.png" alt-text="Screenshot of the Azure platform. Email Settings tab with new data.":::

  1. Once the process has completed, the message "Updating the selections. Update successful" is displayed in the Azure **Notifications**. In the **Overview** page, the provisioning state of the instance turns to **Updating**, and then **Succeeded** once the update is complete.

### [Azure CLI](#tab/azure-cli)

1. Azure Managed Grafana CLI extension 1.1 or above is required to enable or update SMTP settings. To update your extension, run `az extension update --name amg`.
1. Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to configure SMTP settings for a given Azure Managed Grafana instance. Replace the placeholders with information from your own instance.

    ```azurecli
    az grafana update --resource-group <resource-group> \
        --name <azure-managed-grafana-name> \
        --smtp enabled \
        --from-address <from-address> \
        --from-name <from-name> \
        --host "<host>" \
        --user <user> \
        --password "<password>" \
        --start-tls-policy <start-TLS-policy> \
        --skip-verify <true-or-false> \
    ```

    | Parameter            | Example                            | Description                                                                                                                      |
    |----------------------|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
    | `--resource-group`   | my-resource-group                  | Enter the name of the Azure Managed Grafana instance's resource group.                                                           |
    | `--name`             | my-azure-managed-grafana           | Enter the name of the Azure Managed Grafana instance.                                                                            |
    | `--smtp`             | enabled                            | Enter **enabled** to disable SMTP settings.                                                                                      |
    | `--from-address`     | user@domain.com                    | Enter the email address used when sending out emails.                                                                            |
    | `--from-name`        | Azure Managed Grafana Notification | Enter the name used when sending out emails. Default is "Azure Managed Grafana Notification" if parameter isn't given or empty.    |
    | `--host`             | test.sendgrid.net:587              | Enter the SMTP server hostname with port.                                                                                        |
    | `--user`             | admin                              | Enter the name of the user of the SMTP authentication.                                                                           |
    | `--password`         | password                           | Enter password of the SMTP authentication. If the password contains "#" or ";" wrap it within triple quotes.                     |
    | `--start-tls-policy` | OpportunisticStartTLS              | The StartTLSPolicy setting of the SMTP configuration. There are three options. [More information](https://pkg.go.dev/github.com/go-mail/mail#StartTLSPolicy).<br><ul><li>**OpportunisticStartTLS** means that SMTP transactions are encrypted if STARTTLS is supported by the SMTP server. Otherwise, messages are sent in the clear. This is the default setting.</li><li>**MandatoryStartTLS** means that SMTP transactions must be encrypted. SMTP transactions are aborted unless STARTTLS is supported by the SMTP server.</li><li>**NoStartTLS** means encryption is disabled and messages are sent in the clear.</li></ul>  |
    | `--skip-verify`      | false                              |This setting controls whether a client verifies the server's certificate chain and host name. If **--skip-verify** is **true**, client accepts any certificate presented by the server and any host name in that certificate. In this mode, TLS is susceptible to machine-in-the-middle attacks unless custom verification is used. Default is **false**. [More information](https://pkg.go.dev/crypto/tls#Config).                      |

---

> [!TIP]
> Here are some tips for properly configuring SMTP:
>- When using a business email account such as Office 365, you may need to contact your email administrator to enable SMTP AUTH (for example, [enable-smtp-auth-for-specific-mailboxes](/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission#enable-smtp-auth-for-specific-mailboxes)). You should be able to create an app password afterwards and use it as the SMTP *password* setting.
>- When using a personal email account such as Outlook or Gmail, you should create an app password and use it as the SMTP *password* setting. Note that your account won't work for email notification if it's configured with multi-factor authentication.
>- It's recommended that you verify the SMTP configurations to be working as expected before applying them to your Managed Grafana workspace. For example, you can use an open source tool such as [swaks (Swiss Army Knife for SMTP)](https://github.com/jetmore/swaks) to send a test email using the SMTP configurations by running the following command in a terminal window:
>     ```bash
>     # fill in all the empty values for the following parameters
>     host="" # SMTP host name with port separated by a ":", e.g. smtp.office365.com:587
>     user="" # email address, e.g. team1@microsoft.com
>     password="" # password
>     fromAddress="" # source email address (usually the same as user above), e.g. team1@contoso.com
>     toAddress="" # destination email address, e.g. team2@contoso.com
>     ehlo="" # grafana endpoint, e.g. team1-ftbghja6ekeybng8.wcus.grafana.azure.com
>
>     header="Subject:Test"
>     body="Testing!"
>     
>     # test SMTP connection by sending an email
>     swaks --auth -tls \
>         --server $host \
>         --auth-user $user \
>         --auth-password $password \
>         --from $fromAddress \
>         --to $toAddress \
>         --ehlo $ehlo \
>         --header $header \
>         --body $body
>     ```

## Configure Grafana contact points and send a test email

Configuring Grafana contact points is done in the Grafana portal:

  1. In your Azure Managed Grafana workspace, in **Overview**, select the **Endpoint** URL.
  1. Go to **Alerting > Contact points**.
  1. Select **New contact point** or **Edit contact point** to update an existing contact point.

       :::image type="content" source="media/smtp-settings/contact-points.png" alt-text="Screenshot of the Grafana platform. Updating contact points.":::

  1. Add or update the **Name**, and **Contact point type**.
  1. Enter a destination email under **Addresses**, and select **Test**.
  1. Select **Send test notification** to send the notification with the predefined test message or select **Custom** to first edit the message.
  1. A notification "Test alert sent" is displayed, meaning that the email setup has been successfully configured. The test email has been sent to the provided email address. If there is a misconfiguration, an error message is shown instead.

## Disable SMTP settings

To disable SMTP settings, follow these steps.

### [Portal](#tab/azure-portal)

1. In the Azure portal, go to **Configuration > Email Settings** and toggle **SMTP Settings** off, so that **Disable** is displayed.
1. Select **Save** to validate and start updating the Azure Managed Grafana instance.

### [Azure CLI](#tab/azure-cli)

1. Azure Managed Grafana CLI extension 1.1 or above is required to disable SMTP settings. To update your extension, run `az extension update --name amg`.
1. Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to configure SMTP settings for a given Azure Managed Grafana instance. Replace the placeholders with information from your own instance.

    ```azurecli
    az grafana update --resource-group <resource-group> \
        --name <azure-managed-grafana-name> \
        --smtp disabled
    ```

    | Parameter            | Example                            | Description                                                            |
    |----------------------|------------------------------------|------------------------------------------------------------------------|
    | `--resource-group`   | my-resource-group                  | Enter the name of the Azure Managed Grafana instance's resource group. |
    | `--name`             | my-azure-managed-grafana           | Enter the name of the Azure Managed Grafana instance.                  |
    | `--smtp`             | disabled                           | Enter **disabled** to disable SMTP settings.                           |

---

> [!NOTE]
> When a users disables SMTP settings, all SMTP credentials are removed from the backend. Azure Managed Grafana will not persist SMTP credentials when disabled.

## Grafana alerting error messages

Within the Grafana portal, you can find a list of all Grafana alerting error messages that occurred in **Alerting > Notifications**.

The following are some common error messages you may encounter:

- "Authentication failed: The provided authorization grant is invalid, expired, or revoked". Grafana couldn't connect to the SMTP server. Check if the password entered in the SMTP settings in the Azure portal is correct.
- "Failed to sent test alert: SMTP not configured". SMTP is disabled. Open the Azure Managed Grafana instance in the Azure portal and enable SMTP settings.

## Next steps

In this how-to guide, you learned how to configure Grafana SMTP settings. To learn how to create reports and email them to recipients, see [Create dashboards](how-to-use-reporting-and-image-rendering.md).
