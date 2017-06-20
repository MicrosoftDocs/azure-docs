---

title: How to use the Azure Active Directory Power BI Content Pack | Microsoft Docs
description: Learn how to use the Azure Active Directory Power BI Content Pack
services: active-directory
author: MarkusVi
manager: femila

ms.assetid: addd60fe-d5ac-4b8b-983c-0736c80ace02
ms.service: active-directory
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/04/2017
ms.author: markvi

---
# How to use the Azure Active Directory Power BI Content Pack

Understanding how your users adopt and use Azure Active Directory features is critical for you as an IT admin. It allows you to plan your IT infrastructure and communication to increase usage and to get the most out of AAD features. Power BI Content Pack for Azure Active Directory gives you the ability to further analyze your data to understand how you can use this data to gather richer insights into what’s going on with their Azure Active Directory for the various capabilities you heavily rely on.  With the integration of Azure Active Directory APIs into Power BI, you can easily download the pre-built content packs and gain insights to all the activities within your Azure Active Directory using rich visualization experience Power BI offers. You can create your own dashboard and share it easily with anyone in your organization. 

This topic provides you with step-by-step instructions on how to install and use the content pack in your environment.

## Installation  

**To install the Power BI Content Pack:**

1. Log into [Power BI](https://app.powerbi.com/groups/me/getdata/services) with your Power BI Account (this is the same account as your O365 or Azure AD Account).

2. At the bottom of the left navigation pane, select **Get Data**.

    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/01.png)
 
3. In the **Services** box, click **Get**.
   
    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/02.png)

4.	Search for **Azure Active Directory**.

    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/03.png)
 
5.	When prompted, type your Azure AD Tenant ID, and then click **Next**.

    > [!TIP] 
    > A quick way to get the Tenant Id for your Office 365 / Azure AD tenant is to login to the Azure AD Portal, drill down to the directory and copy the ID from the following URL: https://manage.windowsazure.com/woodgroveonline.com#Workspaces/ActiveDirectoryExtension/Directory/<tenantid>/directoryQuickStart

    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/04.png) 

6.	Click **Sign-in**. 
 
    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/05.png) 



7.	Enter your username and password, and then click **Sign in**.
 
    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/06.png) 

8.	On the app consent dialog, click **Accept**.
 
9.	When your Azure Active Directory Activity logs dashboard has been created, click it.
 
    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/08.png) 

## What can I do with this content pack?

Before we jump into what you can do with this content pack, here’s quick preview of the various reports in the content pack. Report data goes back to the **last 30 days**.

### Reports included in this version of Azure Active Directory logs Content Pack

**App Usage and Trend report**:  Get insights into the apps used in your organization and which ones are being used the most and when. You can use this report to gather insights into how an app you recently rolled out in your organization is being used or find out which apps are popular. By doing this, you can improve usage if you see if the app is not being used.

**Sign-ins by location and users**: Get insights into all the sign-ins performed using Azure Identity and gives insights into the identity of the users. With this, you can dig deeper into individual sign-ins and answer questions like:

- From where did this user sign-ins?
- Which user has the most sign-ins and where do they sign-in from? 
- Was the sign-in successful?  
 
You can drill into details by clicking on a specific date or location.

**Unique users per app**:  Get a view of all unique users using a given app. This includes only users who have “*successfully*” signed into an application.

**Device sign-ins**: Get a view of the type of OS and browsers are being used by users in your organization with detailed information on the users including:

- User Name
- IP Address
- Location 
- Sign-in status 

With this report, you can understand the various device profiles used within your organization and determine device policies based on what’s used

**SSPR Funnel**: Get an understanding on how password resets are being done in your organization. Get a peek into how many password resets were attempted through the SSPR tool and how many of them were successful. Dig deeper into the Password resets failure using the SSPR funnel and understand why certain failures occurred. This report gives a deeper understanding of how the SSPR tool is used within your organization so you can make the right decisions.

## Customizing Azure AD Activity content pack

**Change Visualization**:  You can change a report visualization by clicking **Edit Report** and select the visualization you want.
 
![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/09.png) 
 
![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/10.png) 

**Include additional fields**:  You can add a field to the report or remove it by selecting the visual to which you want to add/remove the field. In the example below, I am adding “sign-in status” field to the table view. 
 
![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/11.png) 

**Pin visualizations to your dashboard**:  You can customize your dashboard and include your own visualizations to the report and pin it to the dashboard. In the example below, I added a new filter called “Sign-in Status” and included it in the report. I also changed the visualization from bar chart to a line chart and can pin this new visual to the dashboard.

![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/12.png) 

![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/13.png) 
 

 


**Sharing your dashboard**: Once you have created the content you want, you can share the dashboard with the users in your organization. Please remember that once you share the report, they can see the fields you have selected in the report.
 
![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/14.png) 



## Scheduling a daily refresh of your Power BI report

To schedule a daily refresh of your Power BI report, go to **Datasets > Settings > Schedule Refresh** and set it as shown below.
 
![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/15.png) 

## Updating to newer version of content pack

If you want to update your content pack to get a newer version:

- Download the new content pack and set it up as per instructions listed in this article.

- Once you have set it up, go to **Data Source > Settings > Data source credentials** and re-enter your credentials as shown below

    ![Azure Active Directory Power BI Content Pack](./media/active-directory-reporting-power-bi-content-pack-how-to/16.png) 

As soon as the new version of the content pack is working, you can remove the old version if needed by deleting the underlying reports and datasets associated with that content pack.

## Still having issues? 

Check out our [troubleshooting guide](active-directory-reporting-troubleshoot-content-pack.md). For general help with Power BI, check out these [help articles](https://powerbi.microsoft.com/en-us/documentation/powerbi-service-get-started/).
 


## Next steps

- For more information about Azure Active Directory Identity Protection, see [Azure Active Directory Identity Protection](active-directory-identityprotection.md).

