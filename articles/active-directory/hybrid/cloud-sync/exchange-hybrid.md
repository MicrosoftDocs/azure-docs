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
ms.date: 06/07/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---




# Exchange hybrid writeback with cloud sync

An Exchange hybrid deployment offers organizations the ability to extend the feature-rich experience and administrative control they have with their existing on-premises Microsoft Exchange organization to the cloud. A hybrid deployment provides the seamless look and feel of a single Exchange organization between an on-premises Exchange organization and Exchange Online. 

 :::image type="content" source="media/exchange-hybrid/exchange-hybrid.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="media/exchange-hybrid/exchange-hybrid.png":::

This scenario is now supported in cloud sync.  Cloud sync detects the Exchange on-premises schema attributes and then "writes back" the exchange on-line attributes to your on-premises AD environment.

For more information on Exchange Hybrid deployments, see [Exchange Hybrid](/exchange/exchange-hybrid)

## Prerequisites
Before deploying Exchange Hybrid with cloud sync, you need to ensure that the [provisioning agent](what-is-provisioning-agent.md) must be version 1.1.1107.0 or later.

## How to enable
Exchange Hybrid Writeback is disabled by default.  

 1.  In the Azure portal, select **Azure Active Directory**.
 2.  On the left, select **Azure AD Connect**.
 3.  On the left, select **Cloud sync**.
 4.  Click on an existing configuration.
 5.  At the top, select **Properties**.  You should see Exchange hybrid writeback disabled.
 6.  Select the pencil next to **Basic**. 
 
   :::image type="content" source="media/exchange-hybrid/exchange-hybrid-1.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="media/exchange-hybrid/exchange-hybrid-1.png":::
 7. On the right, place a check in **Exchange hybrid writeback** and click **Apply**.
   
   :::image type="content" source="media/exchange-hybrid/exchange-hybrid-2.png" alt-text="Conceptual image of exchange hybrid scenario." lightbox="media/exchange-hybrid/exchange-hybrid-2.png":::

## Attributes synchronized
Cloud sync writes Exchange On-line attributes back to users and groups in order to enable Exchange hybrid scenarios.  The following table is a list of the attributes and the mappings.

|Azure AD attribute|AD attribute|Object Class|Mapping Type|
|-----|-----|-----|-----|
|cloudAnchor|msDS-ExternalDirectoryObjectId|User, InetOrgPerson|Direct| 
|cloudLegacyExchangeDN|proxyAddresses|User, Group, Contact, InetOrgPerson|Expression| 
|cloudMSExchArchiveStatus|msExchArchiveStatus|User, InetOrgPerson|Direct| 
|cloudMSExchBlockedSendersHash|msExchBlockedSendersHash|User, InetOrgPerson|Expression|
|cloudMSExchSafeRecipientsHash|msExchSafeRecipientsHash|User, InetOrgPerson|Expression| 
|cloudMSExchSafeSendersHash|msExchSafeSendersHash|User, InetOrgPerson|Expression| 
|cloudMSExchUCVoiceMailSettings|msExchUCVoiceMailSettings|User, InetOrgPerson|Expression| 
|cloudMSExchUserHoldPolicies|msExchUserHoldPolicies|User, InetOrgPerson|Expression| 


## Provisioning on-demand
Provisioning on-demand with Exchange hybrid writeback requires two steps.  You need to first provision or create the user.  Exchange online then populates the necessary attributes on the user or group.  Then cloud sync can then be "write back" these attributes to the user or group.  The steps are:

- Provision and synch the initial user or group - this brings the user/group into the cloud and allows them to be populated with Exchange online attributes.
- Writeback exchange attributes to Active Directory - this writes the Exchange online attributes to the user/group on-premises.

Provisioning on-demand with Exchange hybrid use the following steps


 1. In the Azure portal, select **Azure Active Directory**.
 2. On the left, select **Azure AD Connect**.
 3. On the left, select **Cloud sync**.
 4. Under **Configuration**, select your configuration.
 5. On the left, select **Provision on demand**.
 6. Enter the distinguished name of a user and select the **Provision** button.
 7. A success screen appears with four green check marks. 
 8. Click **Next**.  On the **Writeback exchange attributes to Active Directory** tab, the synchronization starts.  
 9. You should see the success details.

## API for schema detection
Prior to enabling and using Exchange hybrid writeback, cloud sync needs to determine whether or not the on-premises Active Directory has been extended to include the Exchange schema.  The refresh can be done automatically by restarting the provisioning agent or manually using an API call.

You can use the [directoryDefinition:discover](/graph/api/directorydefinition-discover?view=graph-rest-beta&tabs=http&preserve-view=true) to initiate schema discovery. 

```
POST https://graph.microsoft.com/beta/servicePrincipals/{id}/synchronization/jobs/{jobId}/schema/directories/{directoryId}/discover
```
Things to remember when using the API to refresh or discover the schema.
 - The job id needs to be the AD2AADProvisioning job id
 - The directory id needs to be AD directory id

## Next steps

- [What is provisioning?](../what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)