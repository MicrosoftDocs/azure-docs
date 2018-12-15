---

title: How to use the Azure Active Directory Power BI Content Pack | Microsoft Docs
description: Learn how to use the Azure Active Directory Power BI Content Pack
services: active-directory
author: priyamohanram
manager: mtillman

ms.assetid: addd60fe-d5ac-4b8b-983c-0736c80ace02
ms.service: active-directory
ms.devlang:
ms.topic: conceptual
ms.tgt_pltfrm:
ms.workload: identity
ms.component: report-monitor
ms.date: 11/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---
# How to use the Azure Active Directory Power BI content pack

|  |
|--|
|Currently, the Azure AD Power BI content pack uses the Azure AD Graph APIs to retrieve data from your Azure AD tenant. As a result, you may see some disparity between the data available in the content pack and the data retrieved using the [Microsoft Graph APIs for reporting](concept-reporting-api.md). |
|  |

The Power BI content pack for Azure Active Directory (Azure AD) contains pre-built reports to help you understand how your users adopt and use Azure AD features. This allows you to gain insight into all the activities within your directory, using the rich visualization experience in Power BI. You can also create your own dashboard and share it with anyone in your organization. 

## Prerequisites

You need an Azure AD premium (P1/P2) license to use the content pack. 

## Install the content pack

Check out the [quickstart](quickstart-install-power-bi-content-pack.md) to install the Azure AD Power BI content pack.

### Reports included in this version of Azure AD logs Content Pack

The following reports are included in the Azure AD Power BI content pack. The reports contain data from the **last 30 days**.

**App Usage and trends report**:  This report gives you insight into the applications used in your organization. You can get a list of the most popular applications, or understand how an application you recently rolled out in your organization is being used. This allows you to track and improve usage over time.

**Sign-ins by location and users**: This report provides data on all the sign-ins performed using Azure Identity. With this report, you can drill down to individual sign-ins and answer questions like:

- Where did this user sign-in from?
- Which user has the most sign-ins and where do they sign-in from? 
- Was the sign-in successful?  
 
You can also filter results by selecting a specific date or location.

**Unique users per app**:  This report provides a view of all unique users using a given app. It only includes users who have “*successfully*” signed into an application.

**Device sign-ins**: This report helps you understand the various device profiles used within your organization and determine device policies based on usage. It provides data around the type of OS and browsers used to sign-in to applications, along with detailed information about the users including:

- User Name
- IP Address
- Location 
- Sign-in status 

**SSPR Funnel**: This report helps you understand how the SSPR tool is used within your organization. You can view how many password resets were attempted through the SSPR tool and how many of them were successful. You can also dig deeper into the password resets failures and understand why certain failures occurred. 

## Customize Azure AD Activity content pack

**Change Visualization**:  You can change a report visualization by clicking **Edit Report** and select the visualization you want.
 
![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/09.png) 
 
![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/10.png) 

**Include additional fields**:  You can add a field to the report or remove it by selecting the visual to which you want to add/remove the field. For example, you can add the “sign-in status” field to the table view as shown below. 
 
![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/11.png) 

**Pin visualizations to the dashboard**:  You can customize your dashboard by including your own visualizations to the report and pinning it to the dashboard. 

![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/13.png) 
 
**Sharing the dashboard**: You can also share the dashboard with the users in your organization. Once you share the report, users can see the fields you have selected in the report.
 
![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/14.png) 

## Schedule a daily refresh of your Power BI report

To schedule a daily refresh of your Power BI report, go to **Datasets** > **Settings** > **Schedule Refresh** and set it as shown below.
 
![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/15.png) 

## Update to newer version of content pack

If you want to update your content pack to a newer version:

- Download the new content pack and set it up using the instructions in this article.

- Once you have set it up, go to **Data Source** > **Settings** > **Data source credentials** and re-enter your credentials.

    ![Azure Active Directory Power BI Content Pack](./media/howto-power-bi-content-pack/16.png) 

Once you verify that the new version of the content pack works as expected, you can remove the old version if needed by deleting the underlying reports and datasets associated with that content pack.

## Still having issues? 

Check out our [troubleshooting guide](troubleshoot-content-pack.md). For general help with Power BI, check out these [help articles](https://powerbi.microsoft.com/documentation/powerbi-service-get-started/).
 
 
## Next steps

* [Install Power BI content pack](quickstart-install-power-bi-content-pack.md).
* [Troubleshoot content pack errors](troubleshoot-content-pack.md).
* [What are Azure AD reports?](overview-reports.md).
