---
title: Azure CycleCloud Usage and Budget Tracking | Microsoft Docs
description: Set usage alerts and notifications for budget tracking with Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---
# Usage

Azure CycleCloud attempts to track cluster usage. It will monitor a number of resources, including instances and volumes, and use this to estimate runtime and charges per resource.

## Usage Alerts

CycleCloud allows you to set an alert per cluster that will display your usage and notify you if that usage exceeds a specified dollar amount.

To display your cluster usage, click on **Create New Alert** within the cluster to open the alert window. Enable the alert via the checkbox if you wish to track the spend for this particular cluster. Set a budget for the cluster, and use the dropdown to select whether the set budget is for the day or the month. Click **Save** to activate the alert. On the cluster page, you will see the current spend for the day or the month (depending on your selection).

> [!NOTE]
> Usage Alerts are informational only. Going over your budget will not stop or pause the instance. The spend amount per cluster is cumulative per time period selected.

![Usage Alert](~/images/usage_alert.png)

Current spend within budget:

![Current Spend Within Budget](~/images/within_budget.png)

Current spend with overage:

![Current Spend With Overage](~/images/over_budget.png)

## Notifications

If you wish to receive email or Slack notifications when your cluster exceeds the budget, enter one of the following:

* **User Name**: Emails the address associated with the user account.
* **Email Address**: Enter an email address for the alert.
* **Slack**: If you are using [Slack](https://slack.com/), you can set up a [webhook](https://api.slack.com/incoming-webhooks) to have notifications sent to a specific channel.

Add the alert recipient's information and click **Save**. To add additional recipients, click the **+**, or **-** to delete.

Notifications are sent out once per day.

To edit the alert, budget, or notification settings, click **Manage** from the alert line on the cluster page.

## Pricing

CycleCloud collects pricing for instances running in all cloud providers. The data is updated constantly throughout the day to provide accurate estimates.

Includes:

* Base price of VMs, including preview-only machine types, at standard "pay-as-you-go" rates
* Linux/Windows surcharges

Does NOT Include:

* Boot disks
* Attached disks

> [!NOTE]
> All usage and cost numbers are **approximations**.
