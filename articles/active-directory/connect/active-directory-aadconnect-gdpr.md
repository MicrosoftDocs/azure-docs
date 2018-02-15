---
title: 'Azure AD Connect and General Data Protection Regulation | Microsoft Docs'
description: This document describes how to obtain GDPR compliancy with Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/15/2018
ms.author: billmath
---

# Azure AD Connect and GDPR compliance

General Data Protection Regulation compliance for Azure AD Connect installations can be reached in two ways:

1.	Upon request, extract data for a person and remove data from that person from the installations
2.	Ensure no data is retained beyond 48 hours.

The advice the Azure AD Connect team recommends the second option.  The reason being, is that, it is by far the easiest to implement and maintain.

An Azure AD Connect sync server stores the following data that is in scope for GDPR compliance:
1.	Data about a person in the **Azure AD Connect database**
2.	Data in the **Windows Event log** files that may contain information about a person
3.	Data in the **Azure AD Connect installation log files** that may contain about a person

To be GDPR compliant, Azure AD Connect customers should use the following guidelines:
1.	Delete the contents of the folder that contains the Azure AD Connect installation log files on a regular basis – at least every 48 hours
2.	This product may also create Event Logs.  To learn more about Event Logs logs, please see the [documentation here](https://msdn.microsoft.com/library/windows/desktop/aa385780.aspx).

Data about a person is automatically removed from the Azure AD Connect database when that person’s data is removed from the source system where it originated from. No specific action from administrators is required to be GDPR compliant.  However, it does require that the Azure AD Connect data is synced with your data source at least every two days.

## Delete the contents of the Azure AD Connect installation log file folder
Regularly check the contents of **c:\programdata\aadconnect** and delete the contents of this folder – with the exception of the **PersistedState.Xml** file, as this file is used to maintain the state of the previous installation of Azure A Connect and is used when an upgrade installation is performed. This file does not contain any data about a person and should not be deleted.

>[!IMPORTANT]
>Do not delete the PersistedState.xml file.  This file contains no user information and maintains the state of the previous installation.

You can either review and delete these files using Windows Explorer or you can use a script like the following to perform the necessary actions:

![](media\active-directory-aadconnect-gdpr\gdpr1.png)

### Schedule this script to run every 48 hours
Use the following steps to schedule the script to run every 48 hours.

1.	Save the script in a file with the extension **&#46;PS1**, then open the Control Panel and click on **Systems and Security**.
    ![System](media\active-directory-aadconnect-gdpr\gdpr2.png)

2.	Under the Administrative Tools heading, click on **Schedule Tasks**.
    ![Task](media\active-directory-aadconnect-gdpr\gdpr3.png)

3.	In Task Scheduler, right click on **Task Schedule Library** and click on **Create Basic task…**
    ![Create](media\active-directory-aadconnect-gdpr\gdpr4.png)

4.	Enter the name for the new task and click **Next**.
    ![Name](media\active-directory-aadconnect-gdpr\gdpr5.png)

5.	Select **Daily** for the task trigger and click on **Next**.
    ![Daily](media\active-directory-aadconnect-gdpr\gdpr6.png)

6.	Set the recurrence to **2 days** and click **Next**.
    ![Days](media\active-directory-aadconnect-gdpr\gdpr7.png)

7.	Select **Start a program** as the action and click on **Next**.

    ![](media\active-directory-aadconnect-gdpr\gdpr8.png)

8.	Type **PowerShell** in the box for the Program/script, and in box labeled **Add arguments (optional)**, enter the full path to the script that you created earlier, then click **Next**.

    ![Add](media\active-directory-aadconnect-gdpr\gdpr9.png)

9.	The next screen shows a summary of the task you are about to create. Verify the values and click **Finish** to create the task.
    ![Finish](media\active-directory-aadconnect-gdpr\gdpr10.png)


## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).