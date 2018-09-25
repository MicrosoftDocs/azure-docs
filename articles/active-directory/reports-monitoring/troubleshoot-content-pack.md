---

title: 'Troubleshooting Azure Active Directory Activity logs content pack errors | Microsoft Docs'
description: Provides you with a list of error messages of the Azure Active Directory Activity content pack and steps to fix them.
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: ffce7eb1-99da-4ea7-9c4d-2322b755c8ce
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 01/15/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Troubleshooting Azure Active Directory Activity logs content pack errors 

|  |
|--|
|Currently, the Azure AD Power BI content pack uses the Azure AD Graph APIs to retrieve data from your Azure AD tenant. As a result, you may see some disparity between the data available in the content pack and the data retrieved using the [Microsoft Graph APIs for reporting](concept-reporting-api.md). |
|  |

When working with the Power BI Content Pack for Azure Active Directory Preview, it is possible that you run into the following errors: 

- [Refresh failed](troubleshoot-content-pack.md#refresh-failed) 
- [Failed to update data source credentials](troubleshoot-content-pack.md#failed-to-update-data-source-credentials) 
- [Importing of data is taking too long](troubleshoot-content-pack.md#importing-of-data-is-taking-too-long) 
 
This article provides you with information about the possible causes and how to fix these errors.
 
## Refresh failed 
 
**How this error is surfaced**: Email from Power BI or failed status in the refresh history. 


| Cause | How to fix |
| ---   | ---        |
| Refresh failure errors can be caused when the credentials of the users connecting to the content pack have been reset but not updated in the connection settings of the content pack. | In Power BI, locate the dataset corresponding to the Azure Active Directory Activity logs dashboard (Azure Active Directory Activity logs), choose schedule refresh, and then enter your Azure AD credentials. |
| A refresh can fail due to data issues in the underlying content pack. | File a support ticket. For more information, see [How to get support for Azure Active Directory](../fundamentals/active-directory-troubleshooting-support-howto.md).|
 
 
## Failed to update data source credentials 
 
**How this error is surfaced**: In Power BI, when you are connecting to the Azure Active Directory Activity logs (preview) content pack. 

| Cause | How to fix |
| ---   | ---        |
| The connecting user is not a global admin or a security reader or a security admin. | Use an account that is either a global admin or a security reader or a security admin to access the content packs. |
| Your tenant is not a Premium tenant or doesn't have at least one user with Premium license File. | File a support ticket. For more information, see [How to get support for Azure Active Directory](../fundamentals/active-directory-troubleshooting-support-howto.md).|
 

 

## Importing of data is taking too long 
 
**How this error is surfaced**: In Power BI, once you have connected your content pack, the data import process starts to prepare your dashboard for Azure Active Directory Activity log. You see the message: “*Importing data...*”  

| Cause | How to fix |
| ---   | ---        |
| Depending on the size of your tenant, this step could take anywhere from a few mins to 30 minutes. | Just be patient. If the message does not change to showing your dashboard within an hour, please file a support ticket. For more information, see [How to get support for Azure Active Directory](../fundamentals/active-directory-troubleshooting-support-howto.md).|

## Next steps

To install the Power BI Content Pack for Azure Active Directory Preview, click [here](https://powerbi.microsoft.com/blog/azure-active-directory-meets-power-bi/).


