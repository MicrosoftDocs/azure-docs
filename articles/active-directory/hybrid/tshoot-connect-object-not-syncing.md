---
title: Troubleshoot an object that is not synchronizing to Azure AD | Microsoft Docs'
description: Troubleshoot why an object is not synchronizing to Azure AD.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2018
ms.component: hybrid
ms.author: billmath
---
# Troubleshoot an object that is not synchronizing to Azure AD

If an object is not synchronizing as expected to Azure AD, then it can be because of several reasons. If you have received an error email from Azure AD or you see the error in Azure AD Connect Health, then read [troubleshoot export errors](tshoot-connect-sync-errors.md) instead. But if you are troubleshooting a problem where the object is not in Azure AD, then this topic is for you. It describes how to find errors in the on-premises component Azure AD Connect sync.

>[!IMPORTANT]
>For Azure Active Directory (AAD) Connect deployment with version 1.1.749.0 or higher, use the [troubleshooting task](tshoot-connect-objectsync.md) in the wizard to troubleshoot object synchronization issues. 

To find the errors, you are going to look at a few different places in the following order:

1. The [operation logs](#operations) for finding errors identified by the sync engine during import and synchronization.
2. The [connector space](#connector-space-object-properties) for finding missing objects and synchronization errors.
3. The [metaverse](#metaverse-object-properties) for finding data-related problems.

Start [Synchronization Service Manager](how-to-connect-sync-service-manager-ui.md) before you begin these steps.

## Operations
The operations tab in the Synchronization Service Manager is where you should start your troubleshooting. The operations tab shows the results from the most recent operations.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/operations.png)  

The top half shows all runs in chronological order. By default, the operations log keeps information about the last seven days, but this setting can be changed with the [scheduler](how-to-connect-sync-feature-scheduler.md). You want to look for any run that does not show a success status. You can change the sorting by clicking the headers.

The **Status** column is the most important information and shows the most severe problem for a run. Here is a quick summary of the most common statuses in order of priority to investigate (where * indicate several possible error strings).

| Status | Comment |
| --- | --- |
| stopped-* |The run could not complete. For example, if the remote system is down and cannot be contacted. |
| stopped-error-limit |There are more than 5,000 errors. The run was automatically stopped due to the large number of errors. |
| completed-\*-errors |The run completed, but there are errors (fewer than 5,000) that should be investigated. |
| completed-\*-warnings |The run completed, but some data is not in the expected state. If you have errors, then this message is usually only a symptom. Until you have addressed errors, you should not investigate warnings. |
| success |No issues. |

When you select a row, the bottom updates to show the details of that run. To the far left of the bottom, you might have a list saying **Step #**. This list only appears if you have multiple domains in your forest where each domain is represented by a step. The domain name can be found under the heading **Partition**. Under **Synchronization Statistics**, you can find more information about the number of changes that were processed. You can click the links to get a list of the changed objects. If you have objects with errors, those errors show up under **Synchronization Errors**.

### Troubleshoot errors in operations tab
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/errorsync.png)  
When you have errors, both the object in error and the error itself are links that provide more information.

Start by clicking the error string (**sync-rule-error-function-triggered** in the picture). You are first presented with an overview of the object. To see the actual error, click the button **Stack Trace**. This trace provides debug level information for the error.

You can right-click in the **call stack information** box, choose **select all**, and **copy**. You can then copy the stack and look at the error in your favorite editor, such as Notepad.

* If the error is from **SyncRulesEngine**, then the call stack information first has a list of all attributes on the object. Scroll down until you see the heading **InnerException =>**.  
  ![Sync Service Manager](./media/tshoot-connect-object-not-syncing/errorinnerexception.png)  
  The line after shows the error. In the picture above, the error is from a custom Sync Rule Fabrikam created.

If the error itself does not give enough information, then it is time to look at the data itself. You can click the link with the object identifier and continue troubleshooting the [connector space imported object](#cs-import).

## Connector space object properties
If you do not have any errors found in the [operations](#operations) tab, then the next step is to follow the connector space object from Active Directory, to the metaverse, and to Azure AD. In this path, you should find where the problem is.

### Search for an object in the CS

In **Synchronization Service Manager**, click **Connectors**, select the Active Directory Connector, and **Search Connector Space**.

In **Scope**, select **RDN** (when you want to search on the CN attribute) or **DN or anchor** (when you want to search on the distinguishedName attribute). Enter a value and click **Search**.  
![Connector Space search](./media/tshoot-connect-object-not-syncing/cssearch.png)  

If you do not find the object you are looking for, then it might have been filtered with [domain-based filtering](how-to-connect-sync-configure-filtering.md#domain-based-filtering) or [OU-based filtering](how-to-connect-sync-configure-filtering.md#organizational-unitbased-filtering). Read the [configure filtering](how-to-connect-sync-configure-filtering.md) topic to verify that the filtering is configured as expected.

Another useful search is to select the Azure AD Connector, in **Scope** select **Pending Import**, and select the **Add** checkbox. This search gives you all synchronized objects in Azure AD that cannot be associated with an on-premises object.  
![Connector Space search orphan](./media/tshoot-connect-object-not-syncing/cssearchorphan.png)  
Those objects have been created by another sync engine or a sync engine with a different filtering configuration. This view is a list of **orphan** objects no longer managed. You should review this list and consider removing these objects using the [Azure AD PowerShell](https://aka.ms/aadposh) cmdlets.

### CS Import
When you open a cs object, there are several tabs at the top. The **Import** tab shows the data that is staged after an import.  
![CS object](./media/tshoot-connect-object-not-syncing/csobject.png)    
The **Old Value** shows what currently is stored in Connect and the **New Value** what has been received from the source system and has not been applied yet. If there is an error on the object, then changes are not processed.

**Error**  
![CS object](./media/tshoot-connect-object-not-syncing/cssyncerror.png)  
The **Synchronization Error** tab is only visible if there is a problem with the object. For more information, see [troubleshoot synchronization errors](#troubleshoot-errors-in-operations-tab).

### CS Lineage
The lineage tab shows how the connector space object is related to the metaverse object. You can see when the Connector last imported a change from the connected system and which rules applied to populate data in the metaverse.  
![CS lineage](./media/tshoot-connect-object-not-syncing/cslineage.png)  
In the **Action** column, you can see there is one **Inbound** sync rule with the action **Provision**. That indicates that as long as this connector space object is present, the metaverse object remains. If the list of sync rules instead shows a sync rule with direction **Outbound** and **Provision**, it indicates that this object is deleted when the metaverse object is deleted.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/cslineageout.png)  
You can also see in the **PasswordSync** column that the inbound connector space can contribute changes to the password since one sync rule has the value **True**. This password is then sent to Azure AD through the outbound rule.

From the lineage tab, you can get to the metaverse by clicking [Metaverse Object Properties](#mv-attributes).

At the bottom of all tabs are two buttons: **Preview** and **Log**.

### Preview
The preview page is used to synchronize one single object. It is useful if you are troubleshooting some custom sync rules and want to see the effect of a change on a single object. You can select between **Full sync** and **Delta sync**. You can also select between **Generate Preview**, which only keeps the change in memory, and **Commit Preview**, which updated the metaverse and stages all changes to target connector spaces.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/preview.png)  
You can inspect the object and which rule applied for a particular attribute flow.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/previewresult.png)

### Log
The Log page is used to see the password sync status and history. For more information, see [Troubleshoot password hash synchronization](tshoot-connect-password-hash-synchronization.md).

## Metaverse object properties
It is usually better to start searching from the source Active Directory [connector space](#connector-space). But you can also start searching from the metaverse.

### Search for an object in the MV
In **Synchronization Service Manager**, click **Metaverse Search**. Create a query you know finds the user. You can search for common attributes, such as accountName (sAMAccountName) and userPrincipalName. For more information, see [Metaverse search](how-to-connect-sync-service-manager-ui-mvsearch.md).
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/mvsearch.png)  

In the **Search Results** window, click the object.

If you did not find the object, then it has not yet reached the metaverse. Continue to search for the object in the Active Directory [connector space](#connector-space-object-properties). There could be an error from synchronization that is blocking the object from coming to the metaverse or there might be a filter applied.

### MV Attributes
On the attributes tab, you can see the values and which Connector contributed it.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/mvobject.png)  

If an object is not synchronizing, then look at the following attributes in the metaverse:
- Is the attribute **cloudFiltered** present and set to **true**? If it is, then it has been filtered according to the steps in [attribute based filtering](how-to-connect-sync-configure-filtering.md#attribute-based-filtering).
- Is the attribute **sourceAnchor** present? If not, do you have an account-resource forest topology? If an object is identified as a linked mailbox (the attribute **msExchRecipientTypeDetails** has the value 2), then the sourceAnchor is contributed by the forest with an enabled Active Directory account. Make sure the master account has been imported and synchronized correctly. The master account must be listed in the [connectors](#mv-connectors) for the object.

### MV Connectors
The Connectors tab shows all connector spaces that have a representation of the object.  
![Sync Service Manager](./media/tshoot-connect-object-not-syncing/mvconnectors.png)  
You should have a connector to:

- Each Active Directory forest the user is represented in. This representation can include foreignSecurityPrincipals and Contact objects.
- A connector in Azure AD.

If you are missing the connector to Azure AD, then read [MV attributes](#mv-attributes) to verify the criteria for being provisioned to Azure AD.

This tab also allows you to navigate to the [connector space object](#connector-space-object-properties). Select a row and click **Properties**.

## Next steps
Learn more about the [Azure AD Connect sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
