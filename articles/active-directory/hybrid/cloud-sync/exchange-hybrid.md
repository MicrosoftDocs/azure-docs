---
title: 'Exchange hybrid writeback with cloud sync'
description: This article describes how to enable exchange hybrid writeback scenarios.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/15/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---




# Exchange hybrid writeback with cloud sync (Public Preview)

An Exchange hybrid deployment offers organizations the ability to extend the feature-rich experience and administrative control they have with their existing on-premises Microsoft Exchange organization to the cloud. A hybrid deployment provides the seamless look and feel of a single Exchange organization between an on-premises Exchange organization and Exchange Online. 

 :::image type="content" source="media/exchange-hybrid/exchange-hybrid.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="media/exchange-hybrid/exchange-hybrid.png":::

This scenario is now supported in cloud sync.  Cloud sync detects the Exchange on-premises schema attributes and then "writes back" the exchange on-line attributes to your on-premises AD environment.

For more information on Exchange Hybrid deployments, see [Exchange Hybrid](/exchange/exchange-hybrid)

## Prerequisites
Before deploying Exchange Hybrid with cloud sync you must meet the following prerequisites.

 - The [provisioning agent](what-is-provisioning-agent.md) must be version 1.1.1107.0 or later.
 - Your on-premises Active Directory must be extended to contain the Exchange schema.
      - To extend your schema for Exchange see [Prepare Active Directory and domains for Exchange Server](/exchange/plan-and-deploy/prepare-ad-and-domains?view=exchserver-2019&preserve-view=true)
     >[!NOTE]
     >If your schema has been extended after you have installed the provisioning agent, you will need to restart it in order to pick up the schema changes.

## How to enable
Exchange Hybrid Writeback is disabled by default.  

 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 3.  Click on an existing configuration.
 4.  At the top, select **Properties**.  You should see Exchange hybrid writeback disabled.
 5.  Select the pencil next to **Basic**. 
   :::image type="content" source="media/exchange-hybrid/exchange-hybrid-1.png" alt-text="Screenshot of the basic properties." lightbox="media/exchange-hybrid/exchange-hybrid-1.png":::
 
 6. On the right, place a check in **Exchange hybrid writeback** and click **Apply**. 
   :::image type="content" source="media/exchange-hybrid/exchange-hybrid-2.png" alt-text="Screenshot of enabling Exchange writeback." lightbox="media/exchange-hybrid/exchange-hybrid-2.png":::
 
 >[!NOTE]
 >If the checkbox for **Exchange hybrid writeback** is disabled, it means that the schema has not been detected.  Verify that the prerequisites are met and that you have re-started the provisioning agent.

## Attributes synchronized
Cloud sync writes Exchange On-line attributes back to users in order to enable Exchange hybrid scenarios.  The following table is a list of the attributes and the mappings.

|Microsoft Entra attribute|AD attribute|Object Class|Mapping Type|
|-----|-----|-----|-----|
|cloudAnchor|msDS-ExternalDirectoryObjectId|User, InetOrgPerson|Direct| 
|cloudLegacyExchangeDN|proxyAddresses|User, Contact, InetOrgPerson|Expression| 
|cloudMSExchArchiveStatus|msExchArchiveStatus|User, InetOrgPerson|Direct| 
|cloudMSExchBlockedSendersHash|msExchBlockedSendersHash|User, InetOrgPerson|Expression|
|cloudMSExchSafeRecipientsHash|msExchSafeRecipientsHash|User, InetOrgPerson|Expression| 
|cloudMSExchSafeSendersHash|msExchSafeSendersHash|User, InetOrgPerson|Expression| 
|cloudMSExchUCVoiceMailSettings|msExchUCVoiceMailSettings|User, InetOrgPerson|Expression| 
|cloudMSExchUserHoldPolicies|msExchUserHoldPolicies|User, InetOrgPerson|Expression| 


## Provisioning on-demand
Provisioning on-demand with Exchange hybrid writeback requires two steps.  You need to first provision or create the user.  Exchange online then populates the necessary attributes on the user.  Then cloud sync can then "write back" these attributes to the user.  The steps are:

- Provision and sync the initial user - this brings the user into the cloud and allows them to be populated with Exchange online attributes.
- Write back exchange attributes to Active Directory - this writes the Exchange online attributes to the user on-premises.

Provisioning on-demand with Exchange hybrid use the following steps


 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 3. Under **Configuration**, select your configuration.
 4. On the left, select **Provision on demand**.
 5. Enter the distinguished name of a user and select the **Provision** button.
 6. A success screen appears with four green check marks. 
    :::image type="content" source="media/exchange-hybrid/exchange-hybrid-3.png" alt-text="Screenshot of the initial Exchange writeback." lightbox="media/exchange-hybrid/exchange-hybrid-3.png":::
 
 7. Click **Next**.  On the **Writeback exchange attributes to Active Directory** tab, the synchronization starts.  
 8. You should see the success details.
    :::image type="content" source="media/exchange-hybrid/exchange-hybrid-4.png" alt-text="Screenshot of Exchange attributes being written back." lightbox="media/exchange-hybrid/exchange-hybrid-4.png":::
   
    >[!NOTE]
    >This final step may take up to 2 minutes to complete.

## Exchange hybrid writeback using MS Graph	
You can use MS Graph API to enable Exchange hybrid writeback.  For more information, see [Exchange hybrid writeback with MS Graph](how-to-inbound-synch-ms-graph.md#exchange-hybrid-writeback-public-preview)

## Next steps

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Connect cloud sync?](what-is-cloud-sync.md)
