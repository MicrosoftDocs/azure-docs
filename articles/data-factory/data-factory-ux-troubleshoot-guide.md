---
title: Troubleshoot Azure Data Factory UX
description: Learn how to troubleshoot Azure Data Factory UX issues.
services: data-factory
author: ceespino
ms.service: data-factory
ms.topic: troubleshooting
ms.date: 09/02/2020
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
1. Select **Allow all cookies** option 

    ![Allow All Cookies in Chrome](media/data-factory-ux-troubleshoot-guide/chrome-allow-all-cookies.png)
1. Refresh ADF UX and try again.

#### Only allow ADF UX to use cookies
If you do not want to allow all cookies, you can optionally just allow ADF UX:
1. Visit **chrome://settings/cookies**.
1. Select **add** under **Sites that can always use cookies** option 

    ![Add ADF UX to allowed sites](media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-1.png)
1. Add **adf.azure.com** site, check **all cookies** option, and save. 

    ![Allow all cookies from ADF UX site](media/data-factory-ux-troubleshoot-guide/chrome-only-adf-cookies-2.png)
1. Refresh ADF UX and try again.

### Microsoft Edge

1. Visit **edge://settings/content/cookies** in your browser.
1. Ensure **Allow sites to save and read cookie data** is enabled and that **Block third-party cookies** option is disabled 

    ![Allow all cookies in Edge](media/data-factory-ux-troubleshoot-guide/edge-allow-all-cookies.png)
1. Refresh ADF UX and try again.

#### Only allow ADF UX to use cookies

If you do not want to allow all cookies, you can optionally just allow ADF UX:

1. Visit **edge://settings/content/cookies**.
1. Under **Allow** section, select **Add** and add **adf.azure.com** site. 

    ![Add ADF UX to allowed sites](media/data-factory-ux-troubleshoot-guide/edge-allow-adf-cookies.png)
1. Refresh ADF UX and try again.

## Connection failed on ADF UX

Sometimes you would see "Connection failed" errors on ADF UX similar to the screenshot below after clicking **Test Connection**, **Preview**, etc.

![Connection failed](media/data-factory-ux-troubleshoot-guide/connection-failed.png)

In this case, you can first try the same operation with InPrivate browsing mode in your browser.

If it’s still not working, in the browser, press F12 to open **Developer Tools**. Go to the **Network** tab, check **Disable Cache**, retry the failed operation, and find the failed request (in red).

![Failed request](media/data-factory-ux-troubleshoot-guide/failed-request.png)

Then find the **host name** (in this case, **dpnortheurope.svc.datafactory.azure.com**) from the **Request URL** of the failed request.

Type the **host name** directly in the address bar of your browser. If you see 404 in the browser, this usually means your client side is ok and the issue is at ADF service side. File a support ticket with the **Activity ID** from the ADF UX error message.

![Resource not found](media/data-factory-ux-troubleshoot-guide/status-code-404.png)

If not or you see similar error below in the browser, this usually means you have some client-side issue. Further follow the troubleshooting steps.

![Client-side error](media/data-factory-ux-troubleshoot-guide/client-side-error.png)

Open **Command Prompt** and type **nslookup dpnortheurope.svc.datafactory.azure.com**. A normal response should look like below:

![Command response 1](media/data-factory-ux-troubleshoot-guide/command-response-1.png)

If you see a normal DNS response, further contact your local IT support to check the firewall settings on whether HTTPS connection to this host name is blocked or not. If the issue could not be resolved, file a support ticket with the **Activity ID** from the ADF UX error message.

If you see anything else than this, this usually means there is something wrong with your DNS server when resolving the DNS name. Usually changing ISP could be a possible workaround to try. If the issue persists, you could further try **nslookup datafactory.azure.com** and **nslookup azure.com** to see at which level your DNS resolution is failed and submit all information to your local IT support or your ISP for troubleshooting. If they believe the issue is still at Microsoft side, file a support ticket with the **Activity ID** from the ADF UX error message.

![Command response 2](media/data-factory-ux-troubleshoot-guide/command-response-2.png)

## Next steps

For more troubleshooting help, try these resources:

* [Data Factory blog](https://azure.microsoft.com/blog/tag/azure-data-factory/)
* [Data Factory feature requests](https://feedback.azure.com/forums/270578-data-factory)
* [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
* [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
* [Azure videos](https://azure.microsoft.com/resources/videos/index/)
* [Microsoft Q&A question page](https://docs.microsoft.com/answers/topics/azure-data-factory.html)
