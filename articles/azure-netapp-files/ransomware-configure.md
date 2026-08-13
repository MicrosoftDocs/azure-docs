---
title: Configure advanced ransomware protection for Azure NetApp Files volumes
description: Configuring ransomware protection for your Azure NetApp Files creates an added layer of security at the data storage level, alerting you to suspected ransomware attacks based on AI-generated profiles of your volume workloads. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/05/2026
ms.author: anfdocs
---
# Configure advanced ransomware protection for Azure NetApp Files volumes 

Ransomware attacks pose a huge threat to the integrity and reliability of data. Azure NetApp Files' advanced ransomware protection adds a line of defense at the storage level for your data. Advanced ransomware protection uses machine learning to develop a profile of your volumes, alerting you of perceived threats. Advanced ransomware protection is available to Azure NetApp Files at no additional cost. 

Advanced ransomware protection builds its profile based on many inputs, including but not limited to: 

* File extension types in the volume
* Data entropy patterns in the volume
* IOPS patterns in the volume

With this data, advanced ransomware protection monitors your volumes for patterns and extension types that deviate from observed patterns, marking them as ransomware threats. Advanced ransomware protection builds a profile from machine learning and continues to refine its understanding of your workloads based on usage patterns. Advanced ransomware protection hones this profile based on your inputs, learning as you respond to threats.

Advanced ransomware protection's alert mechanisms enable you to stay vigilant in preventing ransomware attacks on your data and maintaining the resiliency of your workload.

## How advanced ransomware protection works

When advanced ransomware protection detects suspicious activity, Azure NetApp Files automatically creates a protected recovery snapshot of the affected volume and sends an alert. These snapshots provide recovery points that you can use to restore data following a confirmed ransomware event. The service manages anti-ransomware snapshots, and they're separate from user-created snapshots. The service automatically adjusts snapshot retention based on threat status and service policies. You can't reduce retention periods but you can extend them when a threat remains under investigation or is confirmed as ransomware activity.


## Ransomware protection snapshots

Advanced ransomware protection in Azure NetApp Files protects your data by taking automated protection snapshots.

* The service automatically creates protection snapshots when it detects suspicious activity.
* Protection snapshot creation can occur before an attack is confirmed.
* Snapshots provide recovery points for recovery from ransomware attacks.
* The service manages snapshot retention, and it might vary according to threat status.
* The presence of a snapshot doesn't necessarily mean ransomware is confirmed.


## Considerations 

* Attack reports are retained for 30 days.  
* Ransomware threat notifications are sent in the Azure Activity log.  
* It’s recommended that you enable no more than 10 volumes per Azure subscription with advanced ransomware protection to mitigate performance issues. If you want to enable more than 10 volumes per Azure subscription, raise an Azure support request. For more information, see [Request limit increase](azure-netapp-files-resource-limits.md#request-limit-increase).
* It's recommended you increase QoS capacity by 5 to 10 percent due to potential performance impacts of advanced ransomware protection. The scale of the impact can vary based on the configurations across your Azure NetApp Files deployment.
* Anti-ransomware snapshots and anti-ransomware periodic backups serve different purposes:
    * Anti-ransomware snapshots provide rapid recovery points for ransomware events.
    * Anti-ransomware periodic snapshots provide protection against ransomware events and broader data-loss scenarios.
    * Snapshots reside in the volumes. To protect your volumes against complete loss, offload snapshots to backup by using [Azure NetApp Files backup](backup-introduction.md) or other data protection solutions.

    Depending on configuration, you can use both mechanisms together as part of a layered data protection strategy.

* Marking an alert as a false positive helps Advanced Ransomware Protection refine its behavioral profile for the workload and can reduce future false-positive notifications for similar activity patterns.
* Azure NetApp Files advanced ransomware protection is suited for the following workloads:
    * Images and video
    * Windows or Linux home directories   
    You can create files with extensions that weren't detected in the learning period. This increases the possibility of false positives in this workload. Examples of this are extensions involving health care records and Electronic Design Automation (EDA) data.
* Azure NetApp Files advanced ransomware protection is not suited for the following workloads:
    * Test/Development workloads – these have a high frequency of file create/delete (hundreds of thousands of files in few seconds)
    * Threat detection recognizes an unusual surge in file create, rename, or delete activity as ransomware activity.  If a legitimate application displays this type of file activity, it will likely be identified as ransomware activity.
    * Workloads where the application/host encrypts data.  Advanced ransomware protection analyzes incoming data as encrypted or unencrypted. If the application itself is encrypting the data, then the effectiveness of advanced ransomware protection is reduced. However, it can still detect ransomware based on file activity (delete, overwrite, or create, or create or rename with a new file extension) and file type.


## Enable advanced ransomware protection on a new volume

1. Follow the workflow to create a new [NFS](azure-netapp-files-create-volumes.md), [SMB](azure-netapp-files-create-volumes-smb.md), or [dual-protocol](create-volumes-dual-protocol.md) volume.
1. In the **Advanced Ransomware Protection** field of the Basics tab, select **Enabled**.
1. After you create the volume, you can confirm your settings in the volume overview. If you've enabled ransomware protection, the **Advanced Ransomware Protection** shows as enabled. 


## Enable advanced ransomware protection for existing volumes

1. Navigate to the volume for which you want to enable advanced ransomware protection.
1. Select **Advanced Ransomware Protection** under the **Storage services** menu in the sidebar. 
1. Select **Enable Protection** 

    :::image type="content" source="./media/ransomware-configure/enable-protection.png" alt-text="Screenshot of enabling ransomware protection." lightbox="./media/ransomware-configure/enable-protection.png":::

1. Click **Yes** to confirm enabling ransomware protection.

    :::image type="content" source="./media/ransomware-configure/confirm-enable-protection.png" alt-text="Screenshot to confirm enabling ransomware protection." lightbox="./media/ransomware-configure/confirm-enable-protection.png":::

1. Ensure that the protection state is **Enabled**.

    :::image type="content" source="./media/ransomware-configure/enable-protection-state.png" alt-text="Screenshot of the state of ransomware protection." lightbox="./media/ransomware-configure/enable-protection-state.png":::

## Respond to ransomware threats  

> [!NOTE]
> The system might create recovery snapshots when it first detects suspicious activity, even if it doesn't confirm ransomware activity. The presence of an anti-ransomware snapshot doesn't necessarily mean a ransomware attack happened.

1. Select **Advanced Ransomware Protection** under the **Storage services** menu in the sidebar. 
1. Suspected attacks are displayed under **Active threats**. Expand each threat to view the suspect files.  

    :::image type="content" source="./media/ransomware-configure/ransomware-threats.png" alt-text="Screenshot of ransomware threats." lightbox="./media/ransomware-configure/ransomware-threats.png":::

1. If you know the files are **not** an active threat, mark the active threat as a **False positive**. 

    If you believe the files are a threat, select **Threat**. You can then [revert the volume](snapshots-revert-volume.md) based on the last snapshot captured before the threat.
1. Once you've resolved the threat, you can view archived ransomware reports on the same page. Reports are archived for 30 days. 

## Pause ransomware protection  

1. Navigate to the volume for which you want to pause ransomware protection. Select **Advanced Ransomware Protection** under the Storage services menu in the sidebar. 
1. Select **Pause Protection**. 
1. To enable protection again, return to the volume’s Advanced Ransomware Protection menu then select **Resume Protection**.  
<!-- Confirm the status of your ransomware protection in the Volume overview? -->

## Disable ransomware protection  

1. Navigate to the volume for which you want to pause ransomware protection. Select Advanced Ransomware Protection under the Storage services menu in the sidebar. 
1. Select **Disable Ransomware Protection**. 
<!-- Confirm the status of your ransomware protection in the Volume overview? -->
