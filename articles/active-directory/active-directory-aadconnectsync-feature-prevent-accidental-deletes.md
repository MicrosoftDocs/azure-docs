<properties
   pageTitle="Azure AD Connect sync: Prevent accidental deletes | Microsoft Azure"
   description="This topic describes the prevent accidental deletes (preventing accidental deletions) feature in Azure AD Connect."
   services="active-directory"
   documentationCenter=""
   authors="AndKjell"
   manager="msStevenPo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/09/2015"
   ms.author="andkjell"/>

# Prevent accidental deletes
This topic describes the prevent accidental deletes (preventing accidental deletions) feature in Azure AD Connect.

When installing Azure AD Connect, prevent accidental deletes will be enabled by default and configured to not allow an export with more than 500 deletes. This feature is designed to protect you from accidental configuration changes and changes to your on-premises directory which would effect a large number of users.

The default value of 500 objects can be changed with PowerShell using `Enable-ADSyncExportDeletionThreshold`. You should configure this value to fit your organization’s size. Since the sync scheduler will run every 3 hours, the value is the number of deletes seen within 3 hours.

With this feature enabled, if there are too many deletes staged to be exported to Azure AD, the export will not continue and you will receive an email like this:

![Accidental deletes email](./media/active-directory-aadconnectsync-feature-prevent-accidental-deletes/email.png)

If this was unexpected, then investigate and take corrective actions. To see which objects are about to be deleted, do the following:

1. Start **Synchronization Service** from the Start Menu.
2. Go to **Connectors**.
3. Select the Connector with type **Azure Active Directory**.
4. Under **Actions** to the right, select **Search Connector Space**.
5. In the pop-up under **Scope** select **Disconnected Since** and pick a time in the past. Click on **Search**. This will provide a view of all objects about to be deleted. By clicking on each item, you can get additional information about the object. You can also click on **Column Setting** to add additional attributes to be visible in the grid.

![Search Connector Space](./media/active-directory-aadconnectsync-feature-prevent-accidental-deletes/searchcs.png)

If all the deletes are desired, then do the following:

1. To temporarily disable this protection and let these deletes go through, run the PowerShell cmdlet: `Disable-ADSyncExportDeletionThreshold`
2. With the Azure Active Directory Connector still selected, select the action **Run** and select **Export**.
3. To re-enable the protection run the PowerShell cmdlet: `Enable-ADSyncExportDeletionThreshold`

## Next steps

To learn more on the configuration for Azure AD Connect sync, see [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md).
