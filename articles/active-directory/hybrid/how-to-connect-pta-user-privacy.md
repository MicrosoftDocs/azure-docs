---
title: User Privacy and Azure Active Directory Pass-through Authentication | Microsoft Docs
description: This article deals with Azure Active Directory (Azure AD) Pass-through Authentication and GDPR compliance.
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, GDPR, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/23/2018
ms.subservice: hybrid
ms.author: billmath
ms.custom: seohack1
ms.collection: M365-identity-device-management
---

# User Privacy and Azure Active Directory Pass-through Authentication


[!INCLUDE [Privacy](../../../includes/gdpr-intro-sentence.md)]

## Overview

Azure AD Pass-through Authentication creates the following log type, which can contain Personal Data:

- Azure AD Connect trace log files.
- Authentication Agent trace log files.
- Windows Event log files.

Improve user privacy for Pass-through Authentication in two ways:

1.	Upon request, extract data for a person and remove data from that person from the installations.
2.	Ensure no data is retained beyond 48 hours.

We strongly recommend the second option as it is easier to implement and maintain. Following are the instructions for each log type:

### Delete Azure AD Connect trace log files

Check the contents of **%ProgramData%\AADConnect** folder and delete the trace log contents (**trace-\*.log** files) of this folder within 48 hours of installing or upgrading Azure AD Connect or modifying Pass-through Authentication configuration, as this action may create data covered by GDPR.

>[!IMPORTANT]
>Don’t delete the **PersistedState.xml** file in this folder, as this file is used to maintain the state of the previous installation of Azure AD Connect and is used when an upgrade installation is done. This file will never contain any data about a person and should never be deleted.

You can either review and delete these trace log files using Windows Explorer or you can use the following PowerShell script to perform the necessary actions:

```
$Files = ((Get-Item -Path "$env:programdata\aadconnect\trace-*.log").VersionInfo).FileName 
 
Foreach ($file in $Files) { 
    {Remove-Item -Path $File -Force} 
}
```

Save the script in a file with the ".PS1" extension. Run this script as needed.

To learn more about related Azure AD Connect GDPR requirements, see [this article](reference-connect-user-privacy.md).

### Delete Authentication Agent event logs

This product may also create **Windows Event Logs**. To learn more, please read [this article](https://msdn.microsoft.com/library/windows/desktop/aa385780(v=vs.85).aspx).

To view logs related to the Pass-through Authentication Agent, open the **Event Viewer** application on the server and check under **Application and Service Logs\Microsoft\AzureAdConnect\AuthenticationAgent\Admin**.

### Delete Authentication Agent trace log files

You should regularly check the contents of **%ProgramData%\Microsoft\Azure AD Connect Authentication Agent\Trace** and delete the contents of this folder every 48 hours. 

>[!IMPORTANT]
>If the Authentication Agent service is running, you'll not be able to delete the current log file in the folder. Stop the service before trying again. To avoid user sign-in failures, you should have already configured Pass-through Authentication for [high availability](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability).

You can either review and delete these files using Windows Explorer or you can use the following script to perform the necessary actions:

```
$Files = ((Get-childitem -Path "$env:programdata\microsoft\azure ad connect authentication agent\trace" -Recurse).VersionInfo).FileName 
 
Foreach ($file in $files) { 
    {Remove-Item -Path $File -Force} 
}
```

To schedule this script to run every 48 hours follow these steps:

1.	Save the script in a file with the ".PS1" extension.
2.	Open **Control Panel** and click on **System and Security**.
3.	Under the **Administrative Tools** heading, click on “**Schedule Tasks**”.
4.	In **Task Scheduler**, right-click on “**Task Schedule Library**” and click on “**Create Basic task…**”.
5.	Enter the name for the new task and click **Next**.
6.	Select “**Daily**” for the **Task Trigger** and click **Next**.
7.	Set the recurrence to two days and click **Next**.
8.	Select “**Start a program**” as the action and click **Next**.
9.	Type “**PowerShell**” in the box for the Program/script, and in box labeled “**Add arguments (optional)**”, enter the full path to the script that you created earlier, then click **Next**.
10.	The next screen shows a summary of the task you are about to create. Verify the values and click **Finish** to create the task:
 
### Note about Domain controller logs

If audit logging is enabled, this product may generate security logs for your Domain Controllers. To learn more about configuring audit policies, read this [article](https://technet.microsoft.com/library/dd277403.aspx).

## Next steps
* [Review the Microsoft Privacy policy on Trust Center](https://www.microsoft.com/trustcenter)
* [**Troubleshoot**](tshoot-connect-pass-through-authentication.md) - Learn how to resolve common issues with the feature.
