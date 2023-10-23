---

title: 'Troubleshoot audit data of verified domain change '
description: Provides you with information that will appear in the Microsoft Entra activity logs when you change a users verified domain.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: troubleshooting
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/01/2022
ms.author: sarahlipsey
ms.collection: M365-identity-device-management
---

# Troubleshoot: Audit data on verified domain change 


## I have a lot of changes to my users and I'm not sure what the cause of it is.

### Symptoms

I check the Microsoft Entra audit logs, and see multiple user updates occurring in my Microsoft Entra tenant. These **Update User** events don't display **Actor** information, which causes uncertainty as to what/who triggered the mass changes to users. 

### Cause

 A common reason behind mass object changes is a non-synchronous backend operation called **ProxyCalc**.  **ProxyCalc** is the logic that determines the appropriate **UserPrincipalName** and **Proxy Addresses** that are updated in Microsoft Entra users, groups, or contacts. The design behind **ProxyCalc** is to ensure that all **UserPrincipalName** and **Proxy Addresses** are consistent in Microsoft Entra ID at any time. **ProxyCalc** must be triggered by an explicit change like a verified domain change and doesn't perpetually run in the background as a task. 

  

#### What does UserPrincipalName consistency mean? 

For cloud-only users, consistency means that the **UserPrincipalName** is set to a verified domain suffix. When an inconsistent **UserPrincipalName** is processed, **ProxyCalc** will convert it to the default onmicrosoft.com suffix, for example: username@Contoso.onmicrosoft.com 

For synchronized users, consistency means that the **UserPrincipalName** is set to a verified domain suffix and match the on-premises **UserPrincipalName** value (ShadowUserPrincipalName). When an inconsistent **UserPrincipalName** is processed, **ProxyCalc** will revert to the same value as the **ShadowUserPrincipalName** or, in case that domain suffix has been removed from the tenant, will convert it to the default *.onmicrosoft.com domain suffix. 

  

#### What does Proxy Address consistency mean? 

For cloud-only users, consistency means that the Proxy Addresses match a verified domain suffix. When an inconsistent Proxy Address is processed, **ProxyCalc** will convert it to the default *.onmicrosoft.com domain suffix, for example: SMTP:username@Contoso.onmicrosoft.com 

For synchronized users, consistency means that the Proxy Addresses match the on-premises Proxy Address(es) value(s) (i.e ShadowProxyAddresses). **ProxyAddresses** are expected to be in sync with **ShadowProxyAddresses**. If the synchronized user has an Exchange license assigned, then the Proxy Addresses must match the on-premises Proxy Address(es) value(s) and must also match a verified domain suffix. In this scenario, **ProxyCalc** will sanitize the inconsistent Proxy Address with an unverified domain suffix and will be removed from the object in Microsoft Entra ID. If that unverified domain is verified later, **ProxyCalc** will recompute and add the Proxy Address from **ShadowProxyAddresses** back to the object in Microsoft Entra ID.  

> [!NOTE]
> For synchronized objects, to avoid **ProxyCalc** logic from calculating unexpected results, it is best to set Proxy Addresses to a Microsoft Entra verified domain on the On-Premises object.  

  
One of the admin tasks that could trigger **ProxyCalc** is whenever there’s a verified domain change. This task occurs every time a verified domain is added/removed from a Microsoft Entra tenant, which internally triggers **ProxyCalc**.  

For example, if you add a verified domain Fabrikam.com to your Contoso.onmicrosoft.com tenant, this action will trigger a ProxyCalc operation on all objects in the tenant. This event will be captured in the Microsoft Entra audit logs as **Update User** events preceded by an **Add verified domain** event. On the other hand, if Fabrikam.com was removed from the Contoso.onmicrosoft.com tenant, then all the **Update User** events will be preceded by a **Remove verified domain** event.   

#### Notes:

ProxyCalc doesn't cause changes to certain objects that: 

- don't have an active Exchange license 
- have **MSExchRemoteRecipientType** set to Null 
- aren't considered a shared resource. Shared Resource is when **CloudMSExchRecipientDisplayType** contains one of the following values: **MailboxUser (shared)**, **PublicFolder**, **ConferenceRoomMailbox**, **EquipmentMailbox**, **ArbitrationMailbox**, **RoomList**, **TeamMailboxUser**, **Group mailbox**, **Scheduling mailbox**, **ACLableMailboxUser**, **ACLableTeamMailboxUser** 
  
 In order to build more correlation between these two disparate events, Microsoft is working on updating the **Actor** info in the audit logs to identify these changes as triggered by a verified domain change. This action will help check when the verified domain change event took place and started to mass update the objects in their tenant. 

Additionally, in most cases, there are no changes to users as their **UserPrincipalName** and **Proxy Addresses** are consistent, so we're working to display in Audit Logs only those updates that caused an actual change to the object. This action will prevent noise in the audit logs and help admins correlate the remaining user changes to verified domain change event as explained above. 

## Next Steps

[Microsoft Entra Connect Sync service shadow attributes](../hybrid/connect/how-to-connect-syncservice-shadow-attributes.md)
