---
title: Troubleshoot Azure Data Factory Portal | Microsoft Docs
description: Learn how to troubleshoot Azure Data Factory portal issues.
services: data-factory
author: ceespino
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 8/03/2020
ms.author: ceespino
ms.reviewer: daperlov
---

# Troubleshoot Azure Data Factory Portal Issues
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for Azure Data Factory portal.

## ADF Portal not loading

### **Third party cookies blocked.**

Officially supported web browsers for ADF are Microsoft Edge and Google Chrome

ADF portal uses browser Cookies to persist user session and enable interactive development and monitoring experiences. 
Sometimes it is possible that your browser blocks third party cookies  because you are using an incognito session or have an ad blocker enabled. This can cause issues when loading the portal, such as being redirected to a blank page, https://adf.azure.com/accesstoken.html or getting a warning message saying that third party cookies are blocked. To solve this problem please enable third-party cookies options on your browser using the following steps:

### Google Chrome

#### Allow all cookies

- Visit **chrome://settings/cookies** in your browser.
- Select **Allow all cookies** option ![Chrome-Allow-All-Cookies](media/data-factory-portal-troubleshoot-guide/chrome-allow-all-cookies.png)
- Refresh ADF portal and try again.

#### Only allow ADF portal to use cookies
If you do not want to allow all cookies, you can optionally just allow ADF portal:
- Please visit **chrome://settings/cookies**.
- Click **add** under **Sites that can always use cookies** option ![Chrome-Allow-ADF-Cookies](media/data-factory-portal-troubleshoot-guide/chrome-only-adf-cookies-1.png)
- Add **adf.azure.com** site, check **All cookies** option and save. ![Chrome-Allow-ADF-Cookies-2](media/data-factory-portal-troubleshoot-guide/chrome-only-adf-cookies-2.png)
- Refresh ADF portal and try again.


### Microsoft Edge

- Visit **edge://settings/content/cookies** in your browser.
- Ensure **Allow sites to save and read cookie data** is enabled and that **Block third-party cookies** option is disabled ![Edge-Allow-All-Cookies](media/data-factory-portal-troubleshoot-guide/edge-allow-all-cookies.png)
- Refresh ADF portal and try again.

#### Only allow ADF portal to use cookies

If you do not want to allow all cookies, you can optionally just allow ADF portal:

- Visit **edge://settings/content/cookies**.
- Under **Allow** section, click **Add** and add **adf.azure.com** site.![Edge-Allow-ADF-Cookies](media/data-factory-portal-troubleshoot-guide/edge-allow-adf-cookies.png)
- Refresh ADF portal and try again.

## Next steps

For more troubleshooting help, try these resources:

* [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
* [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
* [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
* [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
* [Azure videos](https://azure.microsoft.com/resources/videos/index/)
* [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
