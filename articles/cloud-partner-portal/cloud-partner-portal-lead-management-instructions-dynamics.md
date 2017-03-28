---
title: Lead Management Instructions for Dynamics CRM online on Azure Marketplace  | Microsoft Docs
description: This article guides publishers step by step as to how to set up their lead management with Dynamics CRM online.
services: cloud-partner-portal
documentationcenter: ''
author: Bigbrd
manager: hamidm

ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: brdi
ms.robots: NOINDEX, NOFOLLOW
---

# Lead Management Instructions for Dynamics CRM online

This document provides you with instructions on how to setup your Dynamics CRM Online system so that Microsoft can provide you with sales leads.

> [!NOTE]
> **User permissions required for performing the following steps:**
> You need to be an admin on your Dynamics CRM Online instance to install a solution and 
> you need to be a tenant admin to create a new service account for lead service.

**Installing the solution:** <br/>
1. Download [Microsoft Marketplace Lead Writer solution](https://testdriveaccount.blob.core.windows.net/testdrivecon/MicrosoftMarketplacesLeadIntegrationSolution_1_0_0_0_target_CRM_6.1_managed.zip) and save it locally.

2. Go to Dynamics CRM online settings.  <br/>
(If you don’t see the options like in the image below, then you don’t have the required permissions) <br/>
![Dynamics setup image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline1.png)

3.	Click on Import, and select the solution that you downloaded in step 1.  <br/>
![Dynamics import image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline2.png)

4.	Finish installing the solution.

**User permissions:** <br/>
We need you to share service account information with us so that we can authorize to write leads into your Dynamics CRM instance. The steps below walk you through how to create the service account and permissions to assign. <br/>
1.	Go to [Microsoft Office 365 Admin Portal](https://go.microsoft.com/fwlink/?LinkId=225975).

2.	Click on “Admin” tile: <br/>
![Dynamics admin setup image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline3.png)

3.	Click on “Add a user”.<br/>
![Dynamics add user image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline4.png)

4.	Create a new user for the lead writer service. Please ensure following 
*  Provide a password and uncheck “Make this user change their password when they first sign in”
* 	Select the role to be “User (no administrator access)”
* 	Select product license as shown below. (You will be charged for the license you select; the solution will work with Dynamics CRM Online Basic license as well) <br/>
![Dynamics add user image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline5.png)

5.  Go to Dynamics CRM online go to Settings->Security.<br/>
![Dynamics security settings image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline6.png)

6.  Select the user that you created in Step 4, click on Manage Roles in the top ribbon, and assign the role as Microsoft Marketplace Lead Writer shown below: <br/>
![Dynamics manage roles image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline7.png)<br/>

This role is created by the solution that you imported and has permissions to only write the leads and to know solution version for ensuring compatibility.

7.  For Dynamics 365 8.2, additional permission are required for the Microsoft Marketplace Lead Writer role created by the solution that you imported. While in Security, select Security Roles and find the role for Microsoft Marketplace Lead Writer, choose that role and change the setting for create/read/write for the User Entity UI Settings in the Core Records tab shown below: <br/>
![Dynamics security roles image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline10.jpg)<br/>
![Dynamics manage security roles image](./media/cloud-partner-portal-lead-management-instructions-dynamics/crmonline11.jpg)<br/>


Finally, plug in your access information into the **Url**, **User Name**, and **Password** fields on the Cloud Partner Portal.