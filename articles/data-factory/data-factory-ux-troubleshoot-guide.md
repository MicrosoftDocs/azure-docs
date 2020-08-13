---
title: Troubleshoot Azure Data Factory UX
description: Learn how to troubleshoot Azure Data Factory UX issues.
services: data-factory
author: ceespino
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 8/03/2020
ms.author: ceespino
ms.reviewer: daperlov
---

# Troubleshoot Azure Data Factory UX Issues
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for Azure Data Factory UX.

## ADF UX not loading

> [!NOTE]
> The Azure Data Factory UX officially supports Microsoft Edge and Google Chrome. Using other web browsers may lead to unexpected or undocumented behavior.

### Third-party cookies blocked

ADF UX uses browser cookies to persist user session and enable interactive development and monitoring experiences. 
It is possible your browser blocks third-party cookies  because you are using an incognito session or have an ad blocker enabled. Blocking third-party cookies can cause issues when loading the portal, such as being redirected to a blank page, https://adf.azure.com/accesstoken.html, or getting a warning message saying that third-party cookies are blocked. To solve this problem, enable third-party cookies options on your browser using the following steps:

### Google Chrome

#### Allow all cookies

1. Visit **chrome://settings/cookies** in your browser.
1. Select **Allow all cookies** option ![Chrome-Allow-All-Cookies](media/data-factory-ux-troubleshoot-guide/chrome-allow-all-cookies.png)
1. Refresh ADF UX and try again.

#### Only allow ADF UX to use cookies
If you do not want to allow all cookies, you can optionally just allow ADF UX:
1. Visit **chrome://settings/cookies**.
1. Click **add** under **Sites that can always use cookies** option ![Add ADF UX to allowed sites](media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-1.png)
1. Add **adf.azure.com** site, check **all cookies** option, and save. ![Allow all cookies from ADF UX site](media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-2.png)
1. Refresh ADF UX and try again.


### Microsoft Edge

1. Visit **edge://settings/content/cookies** in your browser.
1. Ensure **Allow sites to save and read cookie data** is enabled and that **Block third-party cookies** option is disabled ![Allow all cookies in Edge](media/data-factory-ux-troubleshoot-guide/edge-allow-all-cookies.png)
1. Refresh ADF UX and try again.

#### Only allow ADF UX to use cookies

If you do not want to allow all cookies, you can optionally just allow ADF UX:

1. Visit **edge://settings/content/cookies**.
1. Under **Allow** section, click **Add** and add **adf.azure.com** site. ![Add ADF UX to allowed sites](media/data-factory-ux-troubleshoot-guide/edge-allow-adf-cookies.png)
1. Refresh ADF UX and try again.

## Next steps

For more troubleshooting help, try these resources:

* [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
* [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
* [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
* [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
* [Azure videos](https://azure.microsoft.com/resources/videos/index/)
* [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
