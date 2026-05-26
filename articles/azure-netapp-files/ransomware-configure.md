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

Advanced ransomware protection's alert mechanisms enable you to stay vigilant in preventing ransomware attacks on your data and maintaining the resiliency of your workload. If a threat is detected, Azure NetApp Files creates a point-in-time snapshot of the volume. You can then evaluate the threat and, if necessary, restore the volume based on the snapshot, ensuring the continuity and safety of your data.  

## Considerations 

* Attack reports are retained for 30 days.  
* Ransomware threat notifications are sent in the Azure Activity log.  
* It’s recommended that you enable no more than 10 volumes per Azure subscription with advanced ransomware protection to mitigate performance issues. If you want to enable more than 10 volumes per Azure subscription, raise an Azure support request. For more information, see [Request limit increase](azure-netapp-files-resource-limits.md#request-limit-increase).
* It's recommended you increase QoS capacity by 5 to 10 percent due to potential performance impacts of advanced ransomware protection. The scale of the impact can vary based on the configurations across your Azure NetApp Files deployment.  
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
