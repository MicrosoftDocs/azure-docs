<properties 
   pageTitle="View and manage StorSimple Virtual Array alerts | Microsoft Azure"
   description="Describes StorSimple Virtual Array alert conditions and severity, and how to use the StorSimple Manager service to manage alerts."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="02/10/2016"
   ms.author="v-sharos" />

# Use the StorSimple Manager service to view and manage StorSimple Virtual Array alerts

## Overview

The **Alerts** tab in the StorSimple Manager service provides a way for you to review and clear StorSimple Virtual Array–related alerts on a real-time basis. From this tab, you can centrally monitor the health issues of your StorSimple  Virtual Arrays (also known as StorSimple on-premises virtual devices) and the overall Microsoft Azure StorSimple solution.

This tutorial describes how to configure alert notifications, common alert conditions, alert severity levels, and how to view and track alerts. 

![Alerts page](./media/storsimple-ova-manage-alerts/alerts1.png)

## Configure alert settings

You can choose whether you want to be notified by email of alert conditions for each of your StorSimple virtual devices. Additionally, you can identify other alert notification recipients by entering their email addresses in the **Other email recipients** box, separated by semicolons.

>[AZURE.NOTE] You can enter a maximum of 20 email addresses per virtual device.

After you enable email notification for a virtual device, members of the notification list will receive an email message each time a critical alert occurs. The messages will be sent from *storsimple-alerts-noreply@mail.windowsazure.com* and will describe the alert condition. Recipients can click **Unsubscribe** to remove themselves from the email notification list.

#### To enable email notification of alerts for a virtual device

1. Go to **Devices** > **Configuration** for the virtual device. Go to the **Alert settings** section.

    ![alert settings](./media/storsimple-ova-manage-alerts/alerts2.png)

2. Under **Alert settings**, set the following:

    1. In the **Send email notification** field, select **YES**.

    2. In the **Email service administrators** field, select **YES** if you wish to have the service administrator and all co-administrators receive the alert notifications.

    3. In the **Other email recipients** field, enter the email addresses of all other recipients who should receive the alert notifications. Enter names in the format *someone@somewhere.com*. Use semicolons to separate the email addresses. You can configure a maximum of 20 email addresses per virtual device. 

        ![alerts notification configuration](./media/storsimple-ova-manage-alerts/alerts3.png)

3. At the bottom of the page, click **Save** to save your configuration.

4. To send a test email notification, click the arrow icon next to **Send test email**. The StorSimple Manager service will display status messages as it forwards the test notification. 

5. When the following message appears, click **OK**. 

    ![Alerts test notification email sent](./media/storsimple-ova-manage-alerts/alerts4.png)

    >[AZURE.NOTE] If the test notification message can't be sent, the StorSimple Manager service will display an appropriate message. Click **OK**, wait a few minutes, and then try to send your test notification message again. 

    The test notification message will be similar to the following.

    ![Alerts test email example](./media/storsimple-ova-manage-alerts/alerts5.png)

## Common alert conditions

Your StorSimple Virtual Array generates alerts in response to a variety of conditions. The following are the most common types of alert conditions:

- **Connectivity issues** – These alerts occur when there is difficulty in transferring data. Communication issues can occur during transfer of data to and from the Azure storage account or due to lack of connectivity between the virtual devices and the StorSimple Manager service. Communication issues are some of the hardest to fix because there are so many points of failure. You should always first verify that network connectivity and Internet access are available before continuing on to more advanced troubleshooting. For information about ports and firewall settings, go to [StorSimple Virtual Array system requirements](storsimple-ova-system-requirements.md). For help with troubleshooting, go to [Troubleshoot with the Test-Connection cmdlet](storsimple-troubleshoot-deployment.md).

- **Performance issues** – These alerts are caused when your system isn’t performing optimally, such as when it is under a heavy load.

In addition, you might see alerts related to security, updates, or job failures.

## Alert severity levels

Alerts have different severity levels, depending on the impact that the alert situation will have and the need for a response to the alert. The severity levels are:

- **Critical** – This alert is in response to a condition that is affecting the successful performance of your system. Action is required to ensure that the StorSimple service is not interrupted.

- **Warning** – This condition could become critical if not resolved. You should investigate the situation and take any action required to clear the issue.

- **Information** – This alert contains information that can be useful in tracking and managing your system.

## View and track alerts

The StorSimple Manager service dashboard provides you with a quick glance at the number of alerts on your virtual devices, arranged by severity level.

![Alerts dashboard](./media/storsimple-ova-manage-alerts/alerts6.png)

Clicking the severity level opens the **Alerts** tab. The results include only the alerts that match that severity level.

![Alerts report scoped to alert type](./media/storsimple-ova-manage-alerts/alerts7.png)

Clicking an alert in the list provides you with additional details for the alert, including the last time the alert was reported, the number of occurrences of the alert on the device, and the recommended action to resolve the alert.

You can copy the alert details to a text file if you need to send the information to Microsoft Support. After you have followed the recommendation and resolved the alert condition on-premises, you should clear the alert from by selecting the alert in the **Alerts** tab and clicking **Clear**. To clear multiple alerts,  for each error that you want to clear, click any column except the **Alert** column, and then click **Clear**. Note that some alerts are automatically cleared when the issue is resolved or when the system updates the alert with new information.

When you click **Clear**, you will have the opportunity to provide comments about the alert and the steps that you took to resolve the issue. 

![alert comments](./media/storsimple-ova-manage-alerts/clear-alert.png)

Click the check icon ![check-icon](./media/storsimple-ova-manage-alerts/check-icon.png) to save your comments.

Some events will be cleared by the system if another event is triggered with new information. In that case, you will see the following message.

![Clear alert message](./media/storsimple-ova-manage-alerts/alerts8.png)

## Sort and review alerts

You may find it more efficient to run reports on alerts so that you can review and clear them in groups. Additionally, the **Alerts** tab can display up to 250 alerts. If you have exceeded that number of alerts, not all alerts will be displayed in the default view. You can combine the following fields to customize which alerts are displayed:

- **Status** – You can display either **Active** or **Cleared** alerts. Active alerts are still being triggered on your system, while cleared alerts have been either manually cleared by an administrator or programmatically cleared because the system updated the alert condition with new information.

- **Severity** – You can display alerts of all severity levels (critical, warning, information), or just a certain severity, such as only critical alerts.

- **Source** – You can display alerts from all sources, or limit the alerts to those that come from either the service or one or all the virtual devices.

- **Time range** – By specifying the **From** and **To** dates and time stamps, you can look at alerts during the time period that you are interested in.

## Next steps

- [Learn about the StorSimple Virtual Array](storsimple-ova-overview.md).


