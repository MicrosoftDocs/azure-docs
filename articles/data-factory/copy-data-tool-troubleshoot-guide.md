---
title: Troubleshoot Copy Data tool in Azure Data Factory 
description: Learn how to troubleshoot Copy Data tool issues in Azure Data Factory.
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: troubleshooting
ms.date: 07/28/2020
ms.author: yexu
---

# Troubleshoot Copy Data tool in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for Copy Data tool in Azure Data Factory.

## Common errors and messages

### Error code: Unable to validate in Copy Data tool

- **Symptoms**: In the first step of Copy Data tool, you encounter the warning message of "Unable to Validate".
- **Causes**: This could happen when all third-party cookies are disabled.
- **Resolution**: 
    - Use Internet Explorer or Microsoft Edge browser.
    - If you are using Chrome browser, follow instructions below to add Cookies exception for *microsoftonline.com* and *windows.net*.
        1.	Open the Chrome browser.
        2.	Click the wrench or three lines on the right (Customize and control Google Chrome).
        3.	Click **Settings**.
        4.	Search **Cookies** or go to **Privacy** under Advanced Settings.
        5.	Select **Content Settings**.	
        6.	Cookies should be set to **allow local data to be set (recommended)**.
        7.	Click **Manage exceptions**. Under **hostname pattern** enter the following, and make sure **Allow** is the behavior set.
            - login.microsoftonline.com
            - login.windows.net
        8.	Close the browser and relaunch.
    - If you are using Firefox browser, follow instructions below to add Cookies exception.
        1. From the Firefox menu, go to **Tools** > **Options**.
        2. Under **Privacy** > **History**, your may see that the current setting is **Use Custom settings for history**.
        3. In **Accept third-party cookies**, your current setting might be **Never**, then you should click **Exceptions** on the right to add the following sites.
            - https://login.microsoftonline.com
            - https://login.windows.net
        4.	Close the browser and relaunch. 


### Error code: Unable to open login page and enter password

- **Symptoms**: Copy Data tool redirects you to login page, but login page doesn't show up successfully.
- **Causes**: This issue could happen if you changed the network environment from office network to home network. There are some caches in browsers. 
- **Resolution**: 
    1.	Close the browser and try again. Go to the next step if the issue still exists.   
    2.	If you are using Internet Explorer browser, try to open it in private mode (Press "Ctrl" + "Shift" + "P"). If you are using Chrome browser, try to open it in incognito mode (Press "Ctrl" + "shift" + "N"). Go to the next step if the issue still exists. 
    3.	Try to use another browser. 


## Next steps

For more troubleshooting help, try these resources:
*  [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
*  [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
*  [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
*  [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
*  [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
*  [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
*  [ADF mapping data flows Performance Guide](concepts-data-flow-performance.md)
