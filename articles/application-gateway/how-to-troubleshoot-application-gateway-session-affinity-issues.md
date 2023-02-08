---
title: Troubleshoot session affinity issues
titleSuffix: Azure Application Gateway
description: This article provides information on how to troubleshoot session affinity issues in Azure Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 01/24/2022
ms.author: greglin
---

# Troubleshoot Azure Application Gateway session affinity issues

Learn how to diagnose and resolve session affinity issues with Azure Application Gateway.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview

The cookie-based session affinity feature is useful to keep a user session on the same server. By using gateway-managed cookies, the Application Gateway can direct subsequent traffic from a user session to the same server for processing. This is important in cases where session state is saved locally on the server for a user session. Session affinity is also known as sticky sessions.

> [!NOTE]
> Application Gateway v1 issues a cookie called ARRAffinity, which is used to direct traffic to the same backend pool member.  In Application Gateway v2, this cookie has been renamed to ApplicationGatewayAffinity.  For the purposes of this document, ApplicationGatewayAffinity will be used as an example, ARRAffinity can be substituted in where applicable for Application Gateway v1 instances.

## Possible problem causes

The problem in maintaining cookie-based session affinity may happen due to the following main reasons:

- “Cookie-based Affinity” setting is not enabled
- Your application cannot handle cookie-based affinity
- Application is using cookie-based affinity but requests still bouncing between backend servers

### Check whether the "Cookie-based Affinity” setting is enabled

Sometimes the session affinity issues might occur when you forget to enable “Cookie based affinity” setting. To determine whether you have enabled the “Cookie based affinity” setting on the HTTP Settings tab in the Azure portal, follow the instructions:

1. Log on to the [Azure portal](https://portal.azure.com/).

2. In the **left navigation** pane, click **All resources**. Click the application gateway name in the All resources blade. If the subscription that you selected already has several resources in it, you can enter the application gateway name in the **Filter by name…** box to easily access the application gateway.

3. Select **HTTP settings** tab under **SETTINGS**.

   ![Screenshot shows SETTINGS with H T T P settings selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-1.png)

4. Select the HTTP setting, and on the **Add HTTP setting** page, check if **Cookie based affinity** is enabled.

   ![Screenshot shows the gateway settings for an app gateway, including whether Cookie based affinity is selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-2.png)



You can also check the value of the “**CookieBasedAffinity**” is set to *Enabled*under "**backendHttpSettingsCollection**" by using one of the following methods:

- Run [Get-AzApplicationGatewayBackendHttpSetting](/powershell/module/az.network/get-azapplicationgatewaybackendhttpsetting) in PowerShell
- Look through the JSON file by using the Azure Resource Manager template

```
"cookieBasedAffinity": "Enabled", 
```

### The application cannot handle cookie-based affinity

#### Cause

The application gateway can only perform session-based affinity by using a cookie.

#### Workaround

If the application cannot handle cookie-based affinity, you must use an external or internal azure load balancer or another third-party solution.

### Application is using cookie-based affinity but requests still bouncing between backend servers

#### Symptom

You have enabled the Cookie-based Affinity setting, when you access the Application Gateway by using a short name URL in Internet Explorer, for example: `http://website` , the request is still bouncing between backend servers.

To identify this issue, follow the instructions:

1. Take a web debugger trace on the “Client” which is connecting to the application behind the Application Gateway(We are using Fiddler in this example).
    **Tip** If you don't know how to use the Fiddler, check the option "**I want to collect network traffic and analyze it using web debugger**" at the bottom.

2. Check and analyze the session logs, to determine whether the cookies provided by the client have the ApplicationGatewayAffinity details. If you don't find the ApplicationGatewayAffinity details, such as "**ApplicationGatewayAffinity=** *ApplicationGatewayAffinityValue*" within the cookie set, that means the client is not replying with the ApplicationGatewayAffinity cookie, which is provided by the Application Gateway.
    For example:

    ![Screenshot shows a session log with a single entry highlighted.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-3.png)

    ![Screenshot shows request headers for H T T P, including cookie information.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-4.png)

The application continues to try to set the cookie on each request until it gets reply.

#### Cause

This issue occurs because Internet Explorer and other browsers may not store or use the cookie with a short name URL.

#### Resolution

To fix this issue, you should access the Application Gateway by using a FQDN. For example, use [http://website.com](https://website.com/) or [http://appgw.website.com](http://website.com/) .

## Additional logs to troubleshoot

You can collect additional logs and analyze them to troubleshoot the issues related cookie-based session affinity

### Analyze Application Gateway logs

To collect the Application Gateway logs, follow the instructions:

Enable logging using the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), find your resource and then select **Diagnostic setting**.

   For Application Gateway, three logs are available: Access log, Performance log, and Firewall log.

2. To start to collect data, select **Add diagnostic setting**.

   ![Screenshot shows an application gateway with Diagnostics settings selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-5.png)

3. The **Diagnostic setting** page provides the settings for the diagnostic logs. In this example, Log Analytics stores the logs. You can also use event hubs and a storage account to save the diagnostic logs.

   ![Screenshot shows the Diagnostics settings pane with Log Analytics Configure selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-6.png)

4. Confirm the settings and then select **Save**.




### Use web debugger to capture and analyze the HTTP or HTTPS traffics

Web debugging tools like Fiddler, can help you debug web applications by capturing network traffic between the Internet and test computers. These tools enable you to inspect incoming and outgoing data as the browser receives/sends them. Fiddler, in this example, has the HTTP replay option that can help you troubleshoot client-side issues with web applications, especially for authentication kind of issue.

Use the web debugger of your choice. In this sample we will use Fiddler to capture and analyze http or https traffics, follow the instructions:

1. Download [Fiddler](https://www.telerik.com/download/fiddler).

    > [!NOTE]
    > Choose Fiddler4 if the capturing computer has .NET 4 installed. Otherwise, choose Fiddler2.

2. Right click the setup executable, and run as administrator to install.

    ![Screenshot shows the Fiddler setup program with a contextual menu with Run as administrator selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-12.png)

3. When you open Fiddler, it should automatically start capturing traffic (notice the Capturing at lower-left-hand corner). Press F12 to start or stop traffic capture.

    ![Screenshot shows the Fiddler Web Debugger with the Capturing indicator highlighted.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-13.png)

4. Most likely, you will be interested in decrypted HTTPS traffic, and you can enable HTTPS decryption by selecting **Tools** > **Fiddler Options**, and check the box " **Decrypt HTTPS traffic**".

    ![Screenshot shows Options in Fiddler with H T T P selected and Decrypt HTTPS traffic selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-14.png)

5. You can remove previous unrelated sessions before reproducing the issue by clicking  **X** (icon) > **Remove All** as follow screenshot: 

    ![Screenshot shows the X icon selected, which displays the Remove all option.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-15.png)

6. Once you have reproduced the issue, save the file for review by selecting **File** > **Save** > **All Sessions..**. 

    ![Screenshot shows the File Save All Sessions option selected.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-16.png)

7. Check and analyze the session logs to determine what the issue is.

    For examples:

- **Example A:** You find a session log that the request is sent from the client, and it goes to the public IP address of the Application Gateway, click this log to view the details.  On the right side, data in the bottom box is what the Application Gateway is returning to the client. Select the “RAW” tab and determine whether the client is receiving a "**Set-Cookie: ApplicationGatewayAffinity=** *ApplicationGatewayAffinityValue*." If there's no cookie, session affinity isn't set, or the Application Gateway isn't applying cookie back to the client.

   > [!NOTE]
   > This ApplicationGatewayAffinity value is the cookie-id, that the Application Gateway sets for the client to be sent to a particular backend server.

   ![Screenshot shows an example of details of a log entry with the Set-Cookie value highlighted.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-17.png)

- **Example B:** The next session log followed by the previous one is the client responding back to the Application Gateway, which has set the ApplicationGatewayAffinity. If the ApplicationGatewayAffinity cookie-id matches, the packet should be sent to the same backend server that was used previously. Check the next several lines of http communication to see whether the client's ApplicationGatewayAffinity cookie is changing.

   ![Screenshot shows an example of details of a log entry with a cookie highlighted.](./media/how-to-troubleshoot-application-gateway-session-affinity-issues/troubleshoot-session-affinity-issues-18.png)

> [!NOTE]
> For the same communication session, the cookie should not to change. Check the top box on the right side, select "Cookies" tab to see whether the client is using the cookie and sending it back to the Application Gateway. If not, the client browser isn't keeping and using the cookie for conversations. Sometimes, the client might lie.

 

## Next steps

If the preceding steps do not resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
