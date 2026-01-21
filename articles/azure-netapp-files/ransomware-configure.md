---
title: Configure advanced ransomware protection for Azure NetApp Files volumes
description: Configuring ransomware protection for your Azure NetApp Files creates an added layer of security at the data storage level, alerting you to suspected ransomware attacks based on AI-generated profiles of your volume workloads. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/20/2026
ms.author: anfdocs
ms.custom: references_regions
---
# Configure advanced ransomware protection for Azure NetApp Files volumes (preview)

Ransomware attacks pose a huge threat to the integrity and reliability of data. Azure NetApp Files' advanced ransomware protection adds a line of defense at the storage level for your data. Advanced ransomware protection uses machine learning to develop a profile of your volumes, alerting you of perceived threats. Advanced ransomware protection is available to Azure NetApp Files at no additional cost. 

Advanced ransomware protection builds its profile based on three inputs: 

* File extension types in the volume
* Data entropy patterns in the volume
* I/OPS patterns in the volume

With this data, advanced ransomware protection monitors your volumes for patterns and extension types that deviate from observed pattern, marking them as ransomware threats. Advanced ransomware protection builds a profile from machine learning and continues to refine its understanding of your workloads based on usage patterns. Advanced ransomware protection hones this profile based on your inputs, learning as you respond to threats.

Advanced ransomware protection's alert mechanisms enable you to stay vigilant in preventing ransomware attacks on your data and maintaining the resiliency of your workload. If a threat is detected, Azure NetApp Files creates a point-in-time snapshot of the volume. You can then evaluate the threat and, if necessary, restore the volume based on the snapshot, ensuring the continuity and safety of your data.  

## Considerations 

* Advanced ransomware protection is only available for newly created volumes. You must enable protection when you create the volume. 
* Attack reports are retained for 30 days.  
* Ransomware threat notifications are sent in the Azure Activity log.  
* It’s recommended that you enable no more than five volumes per Azure region with advanced ransomware protection to mitigate performance issues. 
* It's recommended you increase QoS capacity by 5 to 10 percent due to potential performance impacts of advanced ransomware protection. The scale of the impact can vary based on the configurations across your Azure NetApp Files deployment.  

## Supported regions 

- Australia Central 
- Australia Central 2 
- Australia East 
- Australia Southeast 
- Brazil South 
- Brazil Southeast 
- Canada Central 
- Canada East 
- Central India 
- Central US 
- East Asia 
- East US 
- East US 2 
- France Central 
- Germany North 
- Germany West Central 
- Israel Central 
- Italy North 
- Japan East 
- Korea Central 
- Korea South 
- New Zealand North 
- North Central US 
- North Europe 
- Norway East 
- Qatar Central 
- South Africa North 
- South Central US 
- Southeast Asia 
- Spain Central 
- Sweden Central 
- Switzerland North 
- Switzerland West 
- UAE Central 
- UAE North 
- UK South 
- UK West 
- West Europe 
- West US 
- West US 2 
- West US 3 

## Register the feature 

Advanced ransomware protection is currently in preview. You must register the feature before using it for the first time. 

1.  Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFAntiRansomware
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFAntiRansomware
    ```

You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Enable advanced ransomware protection on a new volume

1. Follow the workflow to create a new [NFS](azure-netapp-files-create-volumes.md), [SMB](azure-netapp-files-create-volumes-smb.md), or [dual-protocol](create-volumes-dual-protocol.md) volume.
1. In the **Advanced Ransomware Protection** field of the Basics tab, select **Enabled**.
1. After you create the volume, you can confirm your settings in the volume overview. If you've enabled ransomware protection, the **Advanced Ransomware Protection** shows as enabled. 

## Respond to ransomware threats  

1. Select **Advanced Ransomware Protection** under the **Storage services** menu in the sidebar. 
1. Suspected attacks are displayed under **Active threats**. Expand each threat to view the suspect files.  

    :::image type="content" source="./media/ransomware-configure/ransomware-threats.png" alt-text="Screenshot of ransomware threats." lightbox="./media/ransomware-configure/ransomware-threats.png":::

1. If you know the files are **not** an active threat, mark the files as a **False positive**. 

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
