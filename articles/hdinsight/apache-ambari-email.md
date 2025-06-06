---
title: 'Tutorial: Configure Apache Ambari email notifications in Azure HDInsight'
description: This article describes how to use SendGrid with Apache Ambari for email notifications.
ms.service: azure-hdinsight
ms.topic: tutorial
ms.date: 06/15/2024
author: apurbasroy
ms.author: apsinhar
ms.reviewer: sairamyeturi
#Customer intent: As an Azure HDInsight user, I want to configure Apache Ambari to send email notifications.
---

# Tutorial: Configure Apache Ambari email notifications in Azure HDInsight

In this tutorial, you configure Apache Ambari email notifications by using SendGrid as an example. [Apache Ambari](./hdinsight-hadoop-manage-ambari.md) simplifies the management and monitoring of an Azure HDInsight cluster by providing an easy-to-use web UI and REST API. Ambari is included on HDInsight clusters and is used to monitor the cluster and make configuration changes. [SendGrid](https://sendgrid.com/solutions/) is a free cloud-based email service that provides reliable transactional email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy. Azure customers can unlock 25,000 free emails each month.

> [!NOTE]
> SendGrid isn't mandatory to configure Ambari email notifications. You can also use other third-party email apps, like Outlook and Gmail.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Obtain a SendGrid username.
> * Configure Ambari email notifications.

## Prerequisites

* A SendGrid email account. See [How to send email by using SendGrid with Azure](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021#create-a-twilio-sendgrid-accountcreate-a-twilio-sendgrid-account) for instructions.
* An HDInsight cluster. See [Create Apache Hadoop clusters by using the Azure portal](./hdinsight-hadoop-create-linux-clusters-portal.md).

> [!NOTE]
> Users can no longer set passwords for their SendGrid accounts. You need to use an API key to send email.

## Obtain a SendGrid API key

1. In the [Azure portal](https://portal.azure.com), go to your SendGrid resource.

1. On the **Overview** page, select **Open SaaS Account on publisher’s site** to go to the SendGrid webpage for your account.

    :::image type="content" source="./media/apache-ambari-email/azure-portal-sendgrid-manage.png" alt-text="Screenshot that shows a SendGrid overview in the Azure portal.":::

1. On the left menu, go to **Settings** and then select **API Keys**.

    :::image type="content" source="./media/apache-ambari-email/sendgrid-dashboard-navigation.png" alt-text="Screenshot that shows SendGrid dashboard navigation.":::

1. Select **Create API Key** to create an API key. Copy the API key as an SMTP password to use later.

    :::image type="content" source="./media/apache-ambari-email/sendgrid-account-details.png" alt-text="Screenshot that shows SendGrid account details.":::

## Configure Ambari e-mail notification

1. Use a web browser to go to `https://CLUSTERNAME.azurehdinsight.net/#/main/alerts`, where `CLUSTERNAME` is the name of your cluster.

1. In the **Actions** dropdown list, select **Manage Notifications**.

1. On the **Manage Alert Notifications** pane, select the **+** icon.

    :::image type="content" source="./media/apache-ambari-email/azure-portal-create-notification.png" alt-text="Screenshot that shows the Manage Alert Notifications dialog box.":::

1. In the **Create Alert Notification** dialog, provide the following information:

    |Property |Description |
    |---|---|
    |**Name**|Provide a name for the notification.|
    |**Groups**|Configure as desired.|
    |**Severity**|Configure as desired.|
    |**Description**|Optional.|
    |**Method**|Leave as **EMAIL**.|
    |**Email To**|Provide emails to receive notifications, separated by a comma.|
    |**SMTP Server**|`smtp.sendgrid.net`|
    |**SMTP Port**|Use 25 or 587, for unencrypted/Transport Layer Security (TLS) connections.|
    |**Email From**|Provide an email address. The address doesn't need to be authentic.|
    |**Use authentication**|Select this checkbox.|
    |**Username**|Use `apikey` directly if you use SendGrid.|
    |**Password**|Provide the password that you copied when you created the SendGrid API key in Azure.|
    |**Password Confirmation**|Reenter password.|
    |**Start TLS**|Select this checkbox.|

    :::image type="content" source="./media/apache-ambari-email/ambari-create-alert-notification.png" alt-text="Screenshot that shows the Create Alert Notification dialog.":::

1. Select **Save** to return to the **Manage Alert Notifications** pane.

1. On the **Manage Alert Notifications** pane, select **Close**.

## FAQ

This section describes a problem that you might encounter.

### No appropriate protocol error if the Start TLS checkbox is selected

If you select the **Start TLS** checkbox in the **Create Alert Notification** dialog and you receive a `No appropriate protocol` exception in the Ambari server log:

1. Go to the Ambari UI.
1. Go to **Alerts** > **ManageNotifications** > **Edit (Edit Notification)**.
1. Select **Add Property**.
1. Add the new property **mail.smtp.ssl.protocols** with a value of **TLSv1.2**.

## Related content

In this tutorial, you learned how to configure Ambari email notifications by using SendGrid. To learn more about Ambari, see the following articles:

* [Manage HDInsight clusters by using the Apache Ambari web UI](./hdinsight-hadoop-manage-ambari.md)
* [Create an alert notification](https://docs.cloudera.com/HDPDocuments/Ambari-latest/managing-and-monitoring-ambari/content/amb_create_an_alert_notification.html)
