---
title: 'Azure AD Connect: Troubleshoot object synchronization'
description: Learn how to troubleshoot issues with object synchronization by using the troubleshooting task.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Troubleshoot object synchronization with Azure AD Connect sync

This article provides steps for troubleshooting issues with object synchronization by using the troubleshooting task. To see how troubleshooting works in Azure AD Connect, watch a [short video](https://aka.ms/AADCTSVideo).

## Troubleshooting task

For Azure AD Connect deployments of version 1.1.749.0 or later, use the troubleshooting task in the wizard to troubleshoot object sync issues. For earlier versions, you can [troubleshoot manually](tshoot-connect-object-not-syncing.md).

### Run the troubleshooting task in the wizard

To run the troubleshooting task:

1. Open a new Windows PowerShell session on your Azure AD Connect server by using the Run as Administrator option.
1. Run `Set-ExecutionPolicy RemoteSigned` or `Set-ExecutionPolicy Unrestricted`.
1. Start the Azure AD Connect wizard.
1. Go to **Additional Tasks** > **Troubleshoot**, and then select **Next**.
1. On the **Troubleshooting** page, select **Launch** to start the troubleshooting menu in PowerShell.
1. In the main menu, select **Troubleshoot Object Synchronization**.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch11.png" alt-text="Screenshot that shows the Troubleshoot object sync option highlighted in Azure AD Connect.":::

### Troubleshoot input parameters

The troubleshooting task requires the following input parameters:

- **Object Distinguished Name**: The distinguished name of the object that needs troubleshooting.
- **AD Connector Name**: The name of the Windows Server Active Directory (Windows Server AD) forest where the object resides.
- Azure Active Directory (Azure AD) tenant Hybrid Identity Administrator credentials.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch1.png" alt-text="Screenshot that shows the credentials dialog on a PowerShell terminal background.":::

### Understand the results of the troubleshooting task

The troubleshooting task performs the following checks:

- Detect user principal name (UPN) mismatch if the object is synced to Azure AD.
- Check whether object is filtered due to domain filtering.
- Check whether object is filtered due to organizational unit (OU) filtering.
- Check whether object sync is blocked due to a linked mailbox.
- Check whether the object is in a dynamic distribution group that isn't intended to be synced.

The rest of the article describes specific results that are returned by the troubleshooting task. In each case, the task provides an analysis followed by recommended actions to resolve the issue.

## Detect UPN mismatch if the object is synced to Azure AD

Check for the UPN mismatch issues that are described in the next sections.

### UPN suffix is not verified with the Azure AD tenant

When the UPN or alternate login ID suffix isn't verified with the Azure AD tenant, Azure AD replaces the UPN suffixes with the default domain name `onmicrosoft.com`.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch2.png" alt-text="Screenshot that shows an example of an unverified UPN suffix error in PowerShell.":::

### Azure AD tenant DirSync feature SynchronizeUpnForManagedUsers is disabled

When the Azure AD tenant DirSync feature SynchronizeUpnForManagedUsers is disabled, Azure AD doesn't allow sync updates to the UPN or alternate login ID for licensed user accounts that use managed authentication.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch4.png" alt-text="Screenshot that shows an example of a UPN sync for managed users error in PowerShell.":::

## Object is filtered due to domain filtering

Check for the domain filtering issues that are described in the next sections.

### Domain is not configured to sync

The object is out of scope because the domain hasn't been configured. In the example in the following figure, the object is out of sync scope because the domain that it belongs to is filtered from sync.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch5.png" alt-text="Screenshot that shows an example of an error caused by a domain that's not in sync scope.":::

### Domain is configured to sync but is missing run profiles or run steps

The object is out of scope because the domain is missing run profiles or run steps. In the example in the following figure, the object is out of sync scope because the domain that it belongs to is missing run steps for the Full Import run profile.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch6.png" alt-text="Screenshot that shows an example of an error caused by missing run steps.":::

## Object is filtered due to OU filtering

The object is out of sync scope because of the OU filtering configuration. In the example in the following figure, the object belongs to `OU=NoSync,DC=bvtadwbackdc,DC=com`.  This OU is not included in the sync scope.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch7.png" alt-text="Screenshot that shows an example of an OU filtering error in PowerShell.":::

## Linked mailbox issue

A linked mailbox is supposed to be associated with an external primary account that's located in a different trusted account forest. If the primary account doesn't exist, Azure AD Connect doesn't sync the user account that corresponds to the linked mailbox in the Exchange forest to the Azure AD tenant.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch12.png" alt-text="Screenshot that shows an example of a linked mailbox error in PowerShell.":::

## Dynamic distribution group issue

Due to various differences between on-premises Windows Server AD and Azure AD, Azure AD Connect doesn't sync dynamic distribution groups to the Azure AD tenant.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch13.png" alt-text="Screenshot that shows an example of a dynamic distribution group error in PowerShell.":::

## HTML report

In addition to analyzing the object, the troubleshooting task generates an HTML report that includes everything that's known about the object. The HTML report can be shared with the support team for further troubleshooting if needed.

:::image type="content" source="media/tshoot-connect-objectsync/objsynch8.png" alt-text="Screenshot that shows an example of an HTML report in PowerShell.":::

## Next steps

Learn more about [integrating your on-premises identities with Azure Active Directory](../whatis-hybrid-identity.md).
