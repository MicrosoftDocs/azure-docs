---
title: View and manage alerts for StorSimple 8000 series device
description: Describes StorSimple alert conditions and severity, how to configure alert notifications, and how to use the StorSimple Device Manager service to manage alerts.
author: alkohli
ms.service: storsimple
ms.topic: how-to
ms.date: 03/14/2019
ms.author: alkohli

---
# Use the StorSimple Device Manager service to view and manage StorSimple alerts

## Overview

The **Alerts** blade in the StorSimple Device Manager service provides a way for you to review and clear StorSimple device–related alerts on a real-time basis. From this blade, you can centrally monitor the health issues of your StorSimple devices and the overall Microsoft Azure StorSimple solution.

This tutorial describes common alert conditions, alert severity levels, and how to configure alert notifications. Additionally, it includes alert quick reference tables, which enable you to quickly locate a specific alert and respond appropriately.

![Alerts page](./media/storsimple-8000-manage-alerts/configure-alerts-email11.png)

## Common alert conditions

Your StorSimple device generates alerts in response to a variety of conditions. The following are the most common types of alert conditions:

* **Hardware issues** – These alerts tell you about the health of your hardware. They let you know if firmware upgrades are needed, if a network interface has issues, or if there is a problem with one of your data drives.
* **Connectivity issues** – These alerts occur when there is difficulty in transferring data. Communication issues can occur during transfer of data to and from the Azure storage account or due to lack of connectivity between the devices and the StorSimple Device Manager service. Communication issues are some of the hardest to fix because there are so many points of failure. You should always first verify that network connectivity and Internet access are available before continuing on to more advanced troubleshooting. For help with troubleshooting, go to [Troubleshoot with the Test-Connection cmdlet](storsimple-8000-troubleshoot-deployment.md).
* **Performance issues** – These alerts are caused when your system isn’t performing optimally, such as when it is under a heavy load.

In addition, you might see alerts related to security, updates, or job failures.

## Alert severity levels

Alerts have different severity levels, depending on the impact that the alert situation will have and the need for a response to the alert. The severity levels are:

* **Critical** – This alert is in response to a condition that is affecting the successful performance of your system. Action is required to ensure that the StorSimple service is not interrupted.
* **Warning** – This condition could become critical if not resolved. You should investigate the situation and take any action required to clear the issue.
* **Information** – This alert contains information that can be useful in tracking and managing your system.

## Configure alert settings

You can choose whether you want to be notified by email of alert conditions for each of your StorSimple devices. Additionally, you can identify other alert notification recipients by entering their email addresses in the **Other email recipients** box, separated by semicolons.

> [!NOTE]
> You can enter a maximum of 20 email addresses per device.

After you enable email notification for a device, members of the notification list will receive an email message each time a critical alert occurs. The messages will be sent from *storsimple-alerts-noreply\@mail.windowsazure.com* and will describe the alert condition. Recipients can click **Unsubscribe** to remove themselves from the email notification list.

#### To enable email notification of alerts for a device
1. Go to your StorSimple Device Manager service. From the list of devices, select and click the device that you wish to configure.
2. Go to **Settings** > **General** for the device.

   ![Alerts blade](./media/storsimple-8000-manage-alerts/configure-alerts-email2.png)
   
2. In the **General settings** blade, go to **Alert settings** and set the following:
   
   1. In the **Send email notification** field, select **YES**.
   2. In the **Email service administrators** field, select **YES** to have the service administrator and all co-administrators receive the alert notifications.
   3. In the **Other email recipients** field, enter the email addresses of all other recipients who should receive the alert notifications. Enter names in the format *someone\@somewhere.com*. Use semicolons to separate the email addresses. You can configure a maximum of 20 email addresses per device. 
      
3. To send a test email notification, click **Send test email**. The StorSimple Device Manager service will display status messages as it forwards the test notification.

    ![Alert settings](./media/storsimple-8000-manage-alerts/configure-alerts-email3.png)

4. You see a notification when the test email is sent. 
   
    ![Alerts test notification email sent](./media/storsimple-8000-manage-alerts/configure-alerts-email4.png)
   
   > [!NOTE]
   > If the test notification message can't be sent, the StorSimple Device Manager service will display an appropriate error message. Wait a few minutes, and then try to send your test notification message again. 

5. Once you have completed the configuration, click **Save**. When prompted for confirmation, click **Yes**.

     ![Alerts test notification email sent](./media/storsimple-8000-manage-alerts/configure-alerts-email5.png)

## View and track alerts

The StorSimple Device Manager service summary blade provides you with a quick glance at the number of alerts on your devices, arranged by severity level.

![Alerts dashboard](./media/storsimple-8000-manage-alerts/device-summary4.png)

Clicking the severity level opens the **Alerts** blade. The results include only the alerts that match that severity level.

Clicking an alert in the list provides you with additional details for the alert, including the last time the alert was reported, the number of occurrences of the alert on the device, and the recommended action to resolve the alert. If it is a hardware alert, it will also identify the hardware component.

![Hardware alert example](./media/storsimple-8000-manage-alerts/configure-alerts-email14.png)

You can copy the alert details to a text file if you need to send the information to Microsoft Support. After you have followed the recommendation and resolved the alert condition on-premises, you should clear the alert from the device by selecting the alert in the **Alerts** blade and clicking **Clear**. To clear multiple alerts, select each alert, click any column except the **Alert** column, and then click **Clear** after you have selected all the alerts to be cleared. Note that some alerts are automatically cleared when the issue is resolved or when the system updates the alert with new information.

When you click **Clear**, you will have the opportunity to provide comments about the alert and the steps that you took to resolve the issue. Some events will be cleared by the system if another event is triggered with new information. In that case, you will see the following message.

![Clear alert message](./media/storsimple-manage-alerts/admin_alerts_system_clear.png)

## Sort and review alerts

You may find it more efficient to run reports on alerts so that you can review and clear them in groups. Additionally, the **Alerts** blade can display up to 250 alerts. If you have exceeded that number of alerts, not all alerts will be displayed in the default view. You can combine the following fields to customize which alerts are displayed:

* **Status** – You can display either **Active** or **Cleared** alerts. Active alerts are still being triggered on your system, while cleared alerts have been either manually cleared by an administrator or programmatically cleared because the system updated the alert condition with new information.
* **Severity** – You can display alerts of all severity levels (critical, warning, information), or just a certain severity, such as only critical alerts.
* **Source** – You can display alerts from all sources, or limit the alerts to those that come from either the service or one or all of the devices.
* **Time range** – By specifying the **From** and **To** dates and time stamps, you can look at alerts during the time period that you are interested in.

![Alerts list](./media/storsimple-8000-manage-alerts/configure-alerts-email11.png)

## Alerts quick reference

The following tables list some of the Microsoft Azure StorSimple alerts that you might encounter, as well as additional information and recommendations where available. StorSimple device alerts fall into one of the following categories:

* [Cloud connectivity alerts](#cloud-connectivity-alerts)
* [Cluster alerts](#cluster-alerts)
* [Disaster recovery alerts](#disaster-recovery-alerts)
* [Hardware alerts](#hardware-alerts)
* [Job failure alerts](#job-failure-alerts)
* [Locally pinned volume alerts](#locally-pinned-volume-alerts)
* [Networking alerts](#networking-alerts)
* [Performance alerts](#performance-alerts)
* [Security alerts](#security-alerts)
* [Support package alerts](#support-package-alerts)

### Cloud connectivity alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Connectivity to <*cloud credential name*> cannot be established. |Cannot connect to the storage account. |It looks like there might be a connectivity issue with your device. Please run the `Test-HcsmConnection` cmdlet from the Windows PowerShell Interface for StorSimple on your device to identify and fix the issue. If the settings are correct, the issue might be with the credentials of the storage account for which the alert was raised. In this case, use the `Test-HcsStorageAccountCredential` cmdlet to determine if there are issues that you can resolve.<ul><li>Check your network settings.</li><li>Check your storage account credentials.</li></ul> |
| We have not received a heartbeat from your device for the last <*number*> minutes. |Cannot connect to device. |It looks like there is a connectivity issue with your device. Please use the `Test-HcsmConnection` cmdlet from the Windows PowerShell Interface for StorSimple on your device to identify and fix the issue or contact your network administrator. |

### StorSimple behavior when cloud connectivity fails

What happens if cloud connectivity fails for my StorSimple device running in production?

If cloud connectivity fails on your StorSimple production device, then depending on the state of your device, the following can occur:

* **For the local data on your device**: For some time, there will be no disruption and reads will continue to be served. However, as the number of outstanding IOs increases and exceeds a limit, the reads could start to fail.

    Depending on the amount of data on your device, the writes will also continue to occur for the first few hours after the disruption in the cloud connectivity. The writes will then slow down and eventually start to fail if the cloud connectivity is disrupted for several hours. (There is temporary storage on the device for data that is to be pushed to the cloud. This area is flushed when the data is sent. If connectivity fails, data in this storage area will not be pushed to the cloud, and IO will fail.)
* **For the data in the cloud**: For most cloud connectivity errors, an error is returned. Once the connectivity is restored, the IOs are resumed without the user having to bring the volume online. In rare instances, user intervention may be required to bring back the volume online from the Azure portal.
* **For cloud snapshots in progress**: The operation is retried a few times within 4-5 hours and if the connectivity is not restored, the cloud snapshots will fail.

### Cluster alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Device failed over to <*device name*>. |Device is in maintenance mode. |Device failed over due to entering or exiting maintenance mode. This is normal and no action is needed. After you have acknowledged this alert, clear it from the alerts page. |
| Device failed over to <*device name*>. |Device firmware or software was just updated. |There was a cluster failover due to an update. This is normal and no action is needed. After you have acknowledged this alert, clear it from the alerts page. |
| Device failed over to <*device name*>. |Controller was shut down or restarted. |Device failed over because the active controller was shut down or restarted by an administrator. No action is needed. After you have acknowledged this alert, clear it from the alerts page. |
| Device failed over to <*device name*>. |Planned failover. |Verify that this was a planned failover. After you have taken appropriate action, clear this alert from the alerts page. |
| Device failed over to <*device name*>. |Unplanned failover. |StorSimple is built to automatically recover from unplanned failovers. If you see a large number of these alerts, contact Microsoft Support. |
| Device failed over to <*device name*>. |Other/unknown cause. |If you see a large number of these alerts, contact Microsoft Support. After the issue is resolved, clear this alert from the alerts page. |
| A critical device service reports status as failed. |Datapath service failure. |Contact Microsoft Support for assistance. |
| Virtual IP address for network interface <*DATA #*> reports status as failed. |Other/unknown cause. |Sometimes temporary conditions can cause these alerts. If this is the case, then this alert will be automatically cleared after some time. If the issue persists, contact Microsoft Support. |
| Virtual IP address for network interface <*DATA #*> reports status as failed. |Interface name: <*DATA #*> IP address `<IP address>` cannot be brought online because a duplicate IP address was detected on the network. |Ensure that the duplicate IP address is removed from the network or reconfigure the interface with a different IP address. |

### Disaster recovery alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Recovery operations could not restore all of the settings for this service. Device configuration data is in an inconsistent state for some devices. |Data inconsistency detected after disaster recovery. |Encrypted data on the service is not synchronized with that on the device. Authorize the device <*device name*> from StorSimple Device Manager to start the synchronization process. Use the Windows PowerShell Interface for StorSimple to run the `Restore-HcsmEncryptedServiceData` on device <*device name*> cmdlet, providing the old password as an input to this cmdlet to restore the security profile. Then run the `Invoke-HcsmServiceDataEncryptionKeyChange` cmdlet to update the service data encryption key. After you have taken appropriate action, clear this alert from the alerts page. |

### Hardware alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Hardware component <*component ID*> reports status as <*status*>. | |Sometimes temporary conditions can cause these alerts. If so, this alert will be automatically cleared after some time. If the issue persists, contact Microsoft Support. |
| Passive controller malfunctioning. |The passive (secondary) controller is not functioning. |Your device is operational, but one of your controllers is malfunctioning. Try restarting that controller. If the issue is not resolved, contact Microsoft Support. |

### Job failure alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Backup of <*source volume group ID*> failed. |Backup job failed. |Connectivity issues could be preventing the backup operation from successfully completing. If there are no connectivity issues, you may have reached the maximum number of backups. Delete any backups that are no longer needed and retry the operation. After you have taken appropriate action, clear this alert from the alerts page. |
| Clone of <*source backup element IDs*> to <*destination volume serial numbers*> failed. |Clone job failed. |Refresh the backup list to verify that the backup is still valid. If the backup is valid, it is possible that cloud connectivity issues are preventing the clone operation from successfully completing. If there are no connectivity issues, you may have reached the storage limit. Delete any backups that are no longer needed and retry the operation. After you have taken appropriate action to resolve the issue, clear this alert from the alerts page. |
| Restore of <*source backup element IDs*> failed. |Restore job failed. |Refresh the backup list to verify that the backup is still valid. If the backup is valid, it is possible that cloud connectivity issues are preventing the restore operation from successfully completing. If there are no connectivity issues, you may have reached the storage limit. Delete any backups that are no longer needed and retry the operation. After you have taken appropriate action to resolve the issue, clear this alert from the alerts page. |

### Locally pinned volume alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Creation of local volume <*volume name*> failed. |The volume creation job has failed. <*Error message corresponding to the failed error code*>. |Connectivity issues could be preventing the space creation operation from successfully completing. Locally pinned volumes are thickly provisioned and the process of creating space involves spilling tiered volumes to the cloud. If there are no connectivity issues, you may have exhausted the local space on the device. Determine if space exists on the device before retrying this operation. |
| Expansion of local volume <*volume name*> failed. |The volume modification job has failed due to <*error message corresponding to the failed error code*>. |Connectivity issues could be preventing the volume expansion operation from successfully completing. Locally pinned volumes are thickly provisioned and the process of extending the existing space involves spilling tiered volumes to the cloud. If there are no connectivity issues, you may have exhausted the local space on the device. Determine if space exists on the device before retrying this operation. |
| Conversion of volume <*volume name*> failed. |The volume conversion job to convert the volume type from locally pinned to tiered failed. |Conversion of the volume from type locally pinned to tiered could not be completed. Ensure that there are no connectivity issues preventing the operation from completing successfully. For troubleshooting connectivity issues go to [Troubleshoot with the Test-HcsmConnection cmdlet](storsimple-8000-troubleshoot-deployment.md#troubleshoot-with-the-test-hcsmconnection-cmdlet).<br>The original locally pinned volume has now been marked as a tiered volume since some of the data from the locally pinned volume has spilled to the cloud during the conversion. The resultant tiered volume is still occupying local space on the device that cannot be reclaimed for future local volumes.<br>Resolve any connectivity issues, clear the alert and convert this volume back to the original locally pinned volume type to ensure all the data is made available locally again. |
| Conversion of volume <*volume name*> failed. |The volume conversion job to convert the volume type from tiered to locally pinned failed. |Conversion of the volume from type tiered to locally pinned could not be completed. Ensure that there are no connectivity issues preventing the operation from completing successfully. For troubleshooting connectivity issues go to [Troubleshoot with the Test-HcsmConnection cmdlet](storsimple-8000-troubleshoot-deployment.md#troubleshoot-with-the-test-hcsmconnection-cmdlet).<br>The original tiered volume now marked as a locally pinned volume as part of the conversion process continues to have data residing in the cloud, while the thickly provisioned space on the device for this volume can no longer be reclaimed for future local volumes.<br>Resolve any connectivity issues, clear the alert and convert this volume back to the original tiered volume type to ensure local space thickly provisioned on the device can be reclaimed. |
| Nearing local space consumption for local snapshots of <*volume group name*> |Local snapshots for the backup policy might soon run out of space and be invalidated to avoid host write failures. |Frequent local snapshots alongside a high data churn in the volumes associated with this backup policy group are causing local space on the device to be consumed quickly. Delete any local snapshots that are no longer needed. Also, update your local snapshot schedules for this backup policy to take less frequent local snapshots, and ensure that cloud snapshots are taken regularly. If these actions are not taken, local space for these snapshots might soon be exhausted and the system will automatically delete them to ensure that host writes continue to be processed successfully. |
| Local snapshots for <*volume group name*> have been invalidated. |The local snapshots for <*volume group name*> have been invalidated and then deleted because they were exceeding the local space on the device. |To ensure this does not recur in the future, review the local snapshot schedules for this backup policy and delete any local snapshots that are no longer needed. Frequent local snapshots alongside a high data churn in the volumes associated with this backup policy group might cause local space on the device to be consumed quickly. |
| Restore of <*source backup element IDs*> failed. |The restore job has failed. |If you have locally pinned or a mix of locally pinned and tiered volumes in this backup policy, refresh the backup list to verify that the backup is still valid. If the backup is valid, it is possible that cloud connectivity issues are preventing the restore operation from successfully completing. The locally pinned volumes that were being restored as part of this snapshot group do not have all of their data downloaded to the device, and, if you have a mix of tiered and locally pinned volumes in this snapshot group, they will not be in sync with each other. To successfully complete the restore operation, take the volumes in this group offline on the host and retry the restore operation. Note that any modifications to the volume data that were performed during the restore process will be lost. |

### Networking alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Could not start StorSimple service(s). |Datapath error |If the problem persists, contact Microsoft Support. |
| Duplicate IP address detected for 'Data0'. | |The system has detected a conflict for IP address '10.0.0.1'. The network resource 'Data0' on the device *\<device1>* is offline. Ensure that this IP address is not used by any other entity in this network. To troubleshoot network issues, go to [Troubleshoot with the Get-NetAdapter cmdlet](storsimple-8000-troubleshoot-deployment.md#troubleshoot-with-the-get-netadapter-cmdlet). Contact your network administrator for help resolving this issue. If the problem persists, contact Microsoft Support. |
| IPv4 (or IPv6) address for 'Data0' is offline. | |The network resource 'Data0' with IP address '10.0.0.1.' and prefix length '22' on the device *\<device1>* is offline. Ensure that the switch ports to which this interface is connected are operational. To troubleshoot network issues, go to [Troubleshoot with the Get-NetAdapter cmdlet](storsimple-8000-troubleshoot-deployment.md#troubleshoot-with-the-get-netadapter-cmdlet). |
| Could not connect to the authentication service. |Datapath error |The URLthat is used to authenticate is not reachable. Ensure that your firewall rules include the URL patterns specified for the StorSimple device. For more information on URL patterns in Azure portal, go to https:\//aka.ms/ss-8000-network-reqs. If using Azure Government Cloud, go to the URL patterns in https:\//aka.ms/ss8000-gov-network-reqs.|

### Performance alerts

| Alert text | Event | More information / recommended actions | |
|:--- |:--- |:--- | --- |
| The device load has exceeded <*threshold*>. |Slower than expected response times. |Your device reports utilization under a heavy input/output load. This could cause your device to not work as well as it should. Review the workloads that you have attached to the device, and determine if there are any that could be moved to another device or that are no longer necessary.|
| Could not start StorSimple service(s). |Datapath error |If the problem persists, contact Microsoft Support. |

### Security alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Microsoft Support session has begun. |Third-party accessed support session. |Please confirm this access is authorized. After you have taken appropriate action, clear this alert from the alerts page. |
| Password for <*element*> will expire in <*length of time*>. |Password expiration is approaching. |Change your password before it expires. |
| Security configuration information missing for <*element ID*>. | |The volumes associated with this volume container cannot be used to replicate your StorSimple configuration. To ensure that your data is safely stored, we recommend that you delete the volume container and any volumes associated with the volume container. After you have taken appropriate action, clear this alert from the alerts page. |
| <*number*> login attempts failed for <*element ID*>. |Multiple failed logon attempts. |Your device might be under attack or an authorized user is attempting to connect with an incorrect password.<ul><li>Contact your authorized users and verify that these attempts were from a legitimate source. If you continue to see large numbers of failed login attempts, consider disabling remote management and contacting your network administrator. After you have taken appropriate action, clear this alert from the alerts page.</li><li>Check that your Snapshot Manager instances are configured with the correct password. After you have taken appropriate action, clear this alert from the alerts page.</li></ul>For more information, go to [Change an expired device password](storsimple-snapshot-manager-manage-devices.md#change-an-expired-device-password). |
| One or more failures occurred while changing the service data encryption key. | |There were errors encountered while changing the service data encryption key. After you have addressed the error conditions, run the `Invoke-HcsmServiceDataEncryptionKeyChange` cmdlet from the Windows PowerShell Interface for StorSimple on your device to update the service. If this issue persists, contact Microsoft support. After you resolve the issue, clear this alert from the alerts page. |

### Support package alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Creation of support package failed. |StorSimple couldn't generate the package. |Retry this operation. If the issue persists, contact Microsoft Support. After you have resolved the issue, clear this alert from the alerts page. |

### Enclosure environment alerts

| Alert text | Event | More information / recommended actions |
|:--- |:--- |:--- |
| Hardware component Ambient temperature sensor reports status as failed.  | Enclosure type: Main enclosure | This alert is triggered when the ambient outside temperature around StorSimple is above an acceptable range. Check the ambient outside temperature or the airflow from the AC vent in the datacenter. When the temperature returns to normal, the alert is automatically cleared after some time has elapsed. If the issue persists, contact Microsoft support.   |

## Next steps

Learn more about [StorSimple errors and troubleshooting device deployment issues](storsimple-8000-troubleshoot-deployment.md).
