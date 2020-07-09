---
title: Azure AD Connect - LargeObject errors caused by userCertificate attribute | Microsoft Docs
description: This topic provides the remediation steps for LargeObject errors caused by userCertificate attribute.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: 146ad5b3-74d9-4a83-b9e8-0973a19828d9
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 07/13/2017
ms.subservice: hybrid
ms.author: billmath
ms.custom: seohack1
ms.collection: M365-identity-device-management
---

# Azure AD Connect sync: Handling LargeObject errors caused by userCertificate attribute

Azure AD enforces a maximum limit of **15** certificate values on the **userCertificate** attribute. If Azure AD Connect exports an object with more than 15 values to Azure AD, Azure AD returns a **LargeObject** error with message:

>*"The provisioned object is too large. Trim the number of attribute values on this object. The operation will be retried in the next synchronization cycle..."*

The LargeObject error may be caused by other AD attributes. To confirm it is indeed caused by the userCertificate attribute, you need to verify against the object either in on-premises AD or in the [Synchronization Service Manager Metaverse Search](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-service-manager-ui-mvsearch).

To obtain the list of objects in your tenant with LargeObject errors, use one of the following methods:

 * If your tenant is enabled for Azure AD Connect Health for sync, you can refer to the [Synchronization Error Report](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health-sync) provided.
 
 * The notification email for directory synchronization errors that is sent at the end of each sync cycle has the list of objects with LargeObject errors. 
 * The [Synchronization Service Manager Operations tab](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-service-manager-ui-operations) displays the list of objects with LargeObject errors if you click the latest Export to Azure AD operation.
 
## Mitigation options
Until the LargeObject error is resolved, other attribute changes to the same object cannot be exported to Azure AD. To resolve the error, you can consider the following options:

 * Upgrade Azure AD Connect to build 1.1.524.0 or after. In Azure AD Connect build 1.1.524.0, the out-of-box synchronization rules have been updated to not export attributes userCertificate and userSMIMECertificate if the attributes have more than 15 values. For details on how to upgrade Azure AD Connect, refer to article [Azure AD Connect: Upgrade from a previous version to the latest](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-upgrade-previous-version).

 * Implement an **outbound sync rule** in Azure AD Connect that exports a **null value instead of the actual values for objects with more than 15 certificate values**. This option is suitable if you do not require any of the certificate values to be exported to Azure AD for objects with more than 15 values. For details on how to implement this sync rule, refer to next section [Implementing sync rule to limit export of userCertificate attribute](#implementing-sync-rule-to-limit-export-of-usercertificate-attribute).

 * Reduce the number of certificate values on the on-premises AD object (15 or less) by removing values that are no longer in use by your organization. This is suitable if the attribute bloat is caused by expired or unused certificates. You can use the [PowerShell script available here](https://gallery.technet.microsoft.com/Remove-Expired-Certificates-0517e34f) to help find, backup, and delete expired certificates in your on-premises AD. Before deleting the certificates, it is recommended that you verify with the Public-Key-Infrastructure administrators in your organization.

 * Configure Azure AD Connect to exclude the userCertificate attribute from being exported to Azure AD. In general, we do not recommend this option since the attribute may be used by Microsoft Online Services to enable specific scenarios. In particular:
    * The userCertificate attribute on the User object is used by Exchange Online and Outlook clients for message signing and encryption. To learn more about this feature, refer to article [S/MIME for message signing and encryption](https://technet.microsoft.com/library/dn626158(v=exchg.150).aspx).

    * The userCertificate attribute on the Computer object is used by Azure AD to allow Windows 10 on-premises domain-joined devices to connect to Azure AD. To learn more about this feature, please refer to article [Connect domain-joined devices to Azure AD for Windows 10 experiences](https://docs.microsoft.com/azure/active-directory/active-directory-azureadjoin-devices-group-policy).

## Implementing sync rule to limit export of userCertificate attribute
To resolve the LargeObject error caused by the userCertificate attribute, you can implement an outbound sync rule in Azure AD Connect that exports a **null value instead of the actual values for objects with more than 15 certificate values**. This section describes the steps required to implement the sync rule for **User** objects. The steps can be adapted for **Contact** and **Computer** objects.

> [!IMPORTANT]
> Exporting null value removes certificate values previously exported successfully to Azure AD.

The steps can be summarized as:

1. Disable sync scheduler and verify there is no synchronization in progress.
3. Find the existing outbound sync rule for userCertificate attribute.
4. Create the outbound sync rule required.
5. Verify the new sync rule on an existing object with LargeObject error.
6. Apply the new sync rule to remaining objects with LargeObject error.
7. Verify there are no unexpected changes waiting to be exported to Azure AD.
8. Export the changes to Azure AD.
9. Re-enable sync scheduler.

### Step 1.	Disable sync scheduler and verify there is no synchronization in progress
Ensure no synchronization takes place while you are in the middle of implementing a new sync rule to avoid unintended changes being exported to Azure AD. To disable the built-in sync scheduler:
1. Start PowerShell session on the Azure AD Connect server.

2. Disable scheduled synchronization by running cmdlet: `Set-ADSyncScheduler -SyncCycleEnabled $false`

> [!Note]
> The preceding steps are only applicable to newer versions (1.1.xxx.x) of Azure AD Connect with the built-in scheduler. If you are using older versions (1.0.xxx.x) of Azure AD Connect that uses Windows Task Scheduler, or you are using your own custom scheduler (not common) to trigger periodic synchronization, you need to disable them accordingly.

1. Start the **Synchronization Service Manager** by going to START → Synchronization Service.

1. Go to the **Operations** tab and confirm there is no operation whose status is *“in progress.”*

### Step 2.	Find the existing outbound sync rule for userCertificate attribute
There should be an existing sync rule that is enabled and configured to export userCertificate attribute for User objects to Azure AD. Locate this sync rule to find out its **precedence** and **scoping filter** configuration:

1. Start the **Synchronization Rules Editor** by going to START → Synchronization Rules Editor.

2. Configure the search filters with the following values:

    | Attribute | Value |
    | --- | --- |
    | Direction |**Outbound** |
    | MV Object Type |**Person** |
    | Connector |*name of your Azure AD connector* |
    | Connector Object Type |**user** |
    | MV attribute |**userCertificate** |

3. If you are using OOB (out-of-box) sync rules to Azure AD connector to export userCertficiate attribute for User objects, you should get back the *“Out to AAD – User ExchangeOnline”* rule.
4. Note down the **precedence** value of this sync rule.
5. Select the sync rule and click **Edit**.
6. In the *“Edit Reserved Rule Confirmation”* pop-up dialog, click **No**. (Don’t worry, we are not going to make any change to this sync rule).
7. In the edit screen, select the **Scoping filter** tab.
8. Note down the scoping filter configuration. If you are using the OOB sync rule, there should exactly be **one scoping filter group containing two clauses**, including:

    | Attribute | Operator | Value |
    | --- | --- | --- |
    | sourceObjectType | EQUAL | User |
    | cloudMastered | NOTEQUAL | True |

### Step 3. Create the outbound sync rule required
The new sync rule must have the same **scoping filter** and **higher precedence** than the existing sync rule. This ensures that the new sync rule applies to the same set of objects as the existing sync rule and overrides the existing sync rule for the userCertificate attribute. To create the sync rule:
1. In the Synchronization Rules Editor, click the **Add new rule** button.
2. Under the **Description tab**, provide the following configuration:

    | Attribute | Value | Details |
    | --- | --- | --- |
    | Name | *Provide a name* | E.g., *“Out to AAD – Custom override for userCertificate”* |
    | Description | *Provide a description* | E.g., *“If userCertificate attribute has more than 15 values, export NULL.”* |
    | Connected System | *Select the Azure AD Connector* |
    | Connected System Object Type | **user** | |
    | Metaverse Object Type | **person** | |
    | Link Type | **Join** | |
    | Precedence | *Chose a number between 1 - 99* | The number chosen must not be used by any existing sync rule and has a lower value (and therefore, higher precedence) than the existing sync rule. |

3. Go to the **Scoping filter** tab and implement the same scoping filter the existing sync rule is using.
4. Skip the **Join rules** tab.
5. Go to the **Transformations** tab to add a new transformation using following configuration:

    | Attribute | Value |
    | --- | --- |
    | Flow Type |**Expression** |
    | Target Attribute |**userCertificate** |
    | Source Attribute |*Use the following expression*: `IIF(IsNullOrEmpty([userCertificate]), NULL, IIF((Count([userCertificate])> 15),AuthoritativeNull,[userCertificate]))` |
    
6. Click the **Add** button to create the sync rule.

### Step 4.	Verify the new sync rule on an existing object with LargeObject error
This is to verify that the sync rule created is working correctly on an existing AD object with LargeObject error before you apply it to other objects:
1. Go to the **Operations** tab in the Synchronization Service Manager.
2. Select the most recent Export to Azure AD operation and click on one of the objects with LargeObject errors.
3.	In the Connector Space Object Properties pop-up screen, click on the **Preview** button.
4. In the Preview pop-up screen, select **Full synchronization** and click **Commit Preview**.
5. Close the Preview screen and the Connector Space Object Properties screen.
6. Go to the **Connectors** tab in the Synchronization Service Manager.
7. Right-click on the **Azure AD** Connector and select **Run...**
8. In the Run Connector pop-up, select **Export** step and click **OK**.
9. Wait for Export to Azure AD to complete and confirm there is no more LargeObject error on this specific object.

### Step 5.	Apply the new sync rule to remaining objects with LargeObject error
Once the sync rule has been added, you need to run a full synchronization step on the AD Connector:
1. Go to the **Connectors** tab in the Synchronization Service Manager.
2. Right-click on the **AD** Connector and select **Run...**
3. In the Run Connector pop-up, select **Full Synchronization** step and click **OK**.
4. Wait for the Full Synchronization step to complete.
5. Repeat the above steps for the remaining AD Connectors if you have more than one AD Connectors. Usually, multiple connectors are required if you have multiple on-premises directories.

### Step 6.	Verify there are no unexpected changes waiting to be exported to Azure AD
1. Go to the **Connectors** tab in the Synchronization Service Manager.
2. Right-click on the **Azure AD** Connector and select **Search Connector Space**.
3. In the Search Connector Space pop-up:
    1. Set Scope to **Pending Export**.
    2. Check all 3 checkboxes, including **Add**, **Modify** and **Delete**.
    3. Click **Search** button to return all objects with changes waiting to be exported to Azure AD.
    4. Verify there are no unexpected changes. To examine the changes for a given object, double-click on the object.

### Step 7.	Export the changes to Azure AD
To export the changes to Azure AD:
1. Go to the **Connectors** tab in the Synchronization Service Manager.
2. Right-click on the **Azure AD** Connector and select **Run...**
4. In the Run Connector pop-up, select **Export** step and click **OK**.
5. Wait for Export to Azure AD to complete and confirm there are no more LargeObject errors.

### Step 8.	Re-enable sync scheduler
Now that the issue is resolved, re-enable the built-in sync scheduler:
1. Start PowerShell session.
2. Re-enable scheduled synchronization by running cmdlet: `Set-ADSyncScheduler -SyncCycleEnabled $true`

> [!Note]
> The preceding steps are only applicable to newer versions (1.1.xxx.x) of Azure AD Connect with the built-in scheduler. If you are using older versions (1.0.xxx.x) of Azure AD Connect that uses Windows Task Scheduler, or you are using your own custom scheduler (not common) to trigger periodic synchronization, you need to disable them accordingly.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).

