---
title: 'Tutorial: Configure Apache Ambari email notifications in Azure HDInsight'
description: This article describes how to use SendGrid with Apache Ambari for email notifications.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: tutorial
ms.date: 03/06/2020

#Customer intent: As a HDInsight user, I want to configure Apache Ambari to send email notifications.
---

# Tutorial: Configure Apache Ambari email notifications in Azure HDInsight

In this tutorial, you will configure Apache Ambari email notifications using SendGrid. [Apache Ambari](./hdinsight-hadoop-manage-ambari.md) simplifies the management and monitoring of an HDInsight cluster by providing an easy to use web UI and REST API. Ambari is included on HDInsight clusters, and is used to monitor the cluster and make configuration changes. [SendGrid](https://sendgrid.com/solutions/) is a free cloud-based email service that provides reliable transactional email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy. Azure customers can unlock 25,000 free emails each month.

For more information about the Ambari UI, see [Manage HDInsight clusters by using the Apache Ambari Web UI](./hdinsight-hadoop-manage-ambari.md).

> [!div class="checklist"]
> * Configure Apache Ambari email notifications

## Prerequisites

* A SendGrid email account. See [How to Send Email Using SendGrid with Azure](https://docs.microsoft.com/azure/sendgrid-dotnet-how-to-send-email) for instructions.

# 


## Next steps

[Create an alert notification](https://docs.cloudera.com/HDPDocuments/Ambari-latest/managing-and-monitoring-ambari/content/amb_create_an_alert_notification.html)