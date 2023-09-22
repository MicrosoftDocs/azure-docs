---
title: 'Tutorial: Configure Apache Ambari email notifications in Azure HDInsight'
description: This article describes how to use SendGrid with Apache Ambari for email notifications.
ms.service: hdinsight
ms.topic: tutorial
ms.date: 05/25/2023

#Customer intent: As a HDInsight user, I want to configure Apache Ambari to send email notifications.
---

# Tutorial: Configure Apache Ambari email notifications in Azure HDInsight

In this tutorial, you'll configure Apache Ambari email notifications using SendGrid as an example. [Apache Ambari](./hdinsight-hadoop-manage-ambari.md) simplifies the management and monitoring of an HDInsight cluster by providing an easy to use web UI and REST API. Ambari is included on HDInsight clusters, and is used to monitor the cluster and make configuration changes. [SendGrid](https://sendgrid.com/solutions/) is a free cloud-based email service that provides reliable transactional email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy. Azure customers can unlock 25,000 free emails each month.

> [!NOTE]
> SendGrid is not mandatory to configure Apache Ambari email notifications. You can also use other third party email box. For example, outlook, gmail and so on.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Obtain Sendgrid Username
> * Configure Apache Ambari email notifications

## Prerequisites

* A SendGrid email account. See [How to Send Email Using SendGrid with Azure](https://docs.sendgrid.com/for-developers/partners/microsoft-azure-2021#create-a-twilio-sendgrid-accountcreate-a-twilio-sendgrid-account) for instructions.

* An HDInsight cluster. See [Create Apache Hadoop clusters using the Azure portal](./hdinsight-hadoop-create-linux-clusters-portal.md).

> [!NOTE]
> Users can no logner set passwords for their SendGrid account, so we need use apikey to send email.

## Obtain SendGrid apikey

1. From the [Azure portal](https://portal.azure.com), navigate to your SendGrid resource.

1. From the Overview page, click **Open SaaS Account on publisher’s site**, to go the SendGrid webpage for your account.

    :::image type="content" source="./media/apache-ambari-email/azure-portal-sendgrid-manage.png" alt-text="SendGrid overview in azure portal":::

1. From the left menu, navigate to your **Settings** and then **API Keys**.

    :::image type="content" source="./media/apache-ambari-email/sendgrid-dashboard-navigation.png" alt-text="SendGrid dashboard navigation":::

1. Click **Create API Key** to create an apikey and copy the apikey as smtp password in later use.

    :::image type="content" source="./media/apache-ambari-email/sendgrid-account-details.png" alt-text="SendGrid account details":::

## Configure Ambari e-mail notification

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/alerts`, where `CLUSTERNAME` is the name of your cluster.

1. From the **Actions** drop-down list, select **Manage Notifications**.

1. From the **Manage Alert Notifications** window, select the **+** icon.

    :::image type="content" source="./media/apache-ambari-email/azure-portal-create-notification.png" alt-text="Screenshot shows the Manage Alert Notifications dialog box.":::

1. From the **Create Alert Notification** dialog, provide the following information:

    |Property |Description |
    |---|---|
    |Name|Provide a name for the notification.|
    |Groups|Configure as desired.|
    |Severity|Configure as desired.|
    |Description|Optional.|
    |Method|Leave at **EMAIL**.|
    |Email To|Provide e-mail(s) to receive notifications, separated by a comma.|
    |SMTP Server|`smtp.sendgrid.net`|
    |SMTP Port|25 or 587 (for unencrypted/TLS connections).|
    |Email From|Provide an email address. The address doesn't need to be authentic.|
    |Use authentication|Select this check box.|
    |Username|Use "apikey" directly if using SendGrid|
    |Password|Provide the password you copied when you created the SendGrid apikey in Azure.|
    |Password Confirmation|Reenter password.|
    |Start TLS|Select this check box|

    :::image type="content" source="./media/apache-ambari-email/ambari-create-alert-notification.png" alt-text="Screenshot shows the Create Alert Notification dialog box.":::

    Select **Save**. You'll return to the **Manage Alert Notifications** window.

1. From the **Manage Alert Notifications** window, select **Close**.

## FAQ

### No appropriate protocol error if the TLS checkbox is checked

If you select **Start TLS** from the **Create Alert Notification** page, and you receive a *"No appropriate protocol"* exception in the Ambari server log:

1. Go to the Apache Ambari UI.
2. Go to **Alerts > ManageNotifications > Edit (Edit Notification)**.
3. Select **Add Property**.
4. Add the new property, `mail.smtp.ssl.protocols` with a value of `TLSv1.2`.




## Next steps

In this tutorial, you learned how to configure Apache Ambari email notifications using SendGrid. Use the following to learn more about Apache Ambari:

* [Manage HDInsight clusters by using the Apache Ambari Web UI](./hdinsight-hadoop-manage-ambari.md)

* [Create an alert notification](https://docs.cloudera.com/HDPDocuments/Ambari-latest/managing-and-monitoring-ambari/content/amb_create_an_alert_notification.html)
