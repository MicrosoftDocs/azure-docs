---
title: Debug Application Proxy applications - Azure Active Directory | Microsoft Docs
description: Debug issues with Azure Active Directory (Azure AD) Application Proxy applications.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 05/21/2019
ms.author: kenwith
ms.reviewer: japere
---

# Debug Application Proxy application issues 

This article helps you troubleshoot issues with Azure Active Directory (Azure AD) Application Proxy applications. If you're using the Application Proxy service for remote access to an on-premises web application, but you're having trouble connecting to the application, use this flowchart to debug application issues. 

## Before you begin

When troubleshooting Application Proxy issues, we recommend you start with the connectors. First, follow the troubleshooting flow in [Debug Application Proxy Connector issues](application-proxy-debug-connectors.md) to make sure Application Proxy connectors are configured correctly. If you're still having issues, return to this article to troubleshoot the application.  

For more information about Application Proxy, see:

- [Remote access to on-premises applications through Application Proxy](application-proxy.md)
- [Application Proxy connectors](application-proxy-connectors.md)
- [Install and register a connector](application-proxy-add-on-premises-application.md)
- [Troubleshoot Application Proxy problems and error messages](application-proxy-troubleshoot.md)

## Flowchart for application issues

This flowchart walks you through the steps for debugging some of the more common issues with connecting to the application. For details about each step, see the table following the flowchart.

![Flowchart showing steps for debugging an application](media/application-proxy-debug-apps/application-proxy-apps-debugging-flowchart.png)

| Step | Action | Description |
|---------|---------|---------|
|1 | Open a browser, access the app, and enter your credentials | Try using your credentials to sign in to the app, and check for any user-related errors, like [This corporate app can't be accessed](application-proxy-sign-in-bad-gateway-timeout-error.md). |
|2 | Verify user assignment to the app | Make sure your user account has permission to access the app from inside the corporate network, and then test signing in to the app by following the steps in [Test the application](application-proxy-add-on-premises-application.md#test-the-application). If sign-in issues persist, see [How to troubleshoot sign-in errors](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context).  |
|3 | Open a browser and try to access the app | If an error appears immediately, check to see that Application Proxy is configured correctly. For details about specific error messages, see [Troubleshoot Application Proxy problems and error messages](application-proxy-troubleshoot.md).  |
|4 | Check your custom domain setup or troubleshoot the error | If the page doesn't display at all, make sure your custom domain is configured correctly by reviewing [Working with custom domains](application-proxy-configure-custom-domain.md).<br></br>If the page doesn't load and an error message appears, troubleshoot the error by referring to  [Troubleshoot Application Proxy problems and error messages](application-proxy-troubleshoot.md). <br></br>If it takes longer than 20 seconds for an error message to appear, there could be connectivity issue. Go to the [Debug Application Proxy connectors](application-proxy-debug-connectors.md) troubleshooting article.  |
|5 | If issues persist, go to connector debugging | There could be a connectivity issue between the proxy and the connector or between the connector and the back end. Go to the [Debug Application Proxy connectors](application-proxy-debug-connectors.md) troubleshooting article. |
|6 | Publish all resources, check browser developer tools, and fix links | Make sure the publishing path includes all the necessary images, scripts, and style sheets for your application. For details, see [Add an on-premises app to Azure AD](application-proxy-add-on-premises-application.md#add-an-on-premises-app-to-azure-ad). <br></br>Use the browser's developer tools (F12 tools in Internet Explorer or Microsoft Edge) and check for publishing issues as described in [Application page does not display correctly](application-proxy-page-appearance-broken-problem.md). <br></br>Review options for resolving broken links in [Links on the page don't work](application-proxy-page-links-broken-problem.md). |
|7 | Check for network latency | If the page loads slowly, learn about ways to minimize network latency in [Considerations for reducing latency](application-proxy-network-topology.md#considerations-for-reducing-latency). | 
|8 | See additional troubleshooting help | If issues persist, find additional troubleshooting articles in the [Application Proxy troubleshooting documentation](application-proxy-troubleshoot.md). |

## Next steps


* [Publish applications on separate networks and locations using connector groups](application-proxy-connector-groups.md)
* [Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md)
* [Troubleshoot Application Proxy and connector errors](application-proxy-troubleshoot.md)
* [How to silently install the Azure AD Application Proxy Connector](application-proxy-register-connector-powershell.md)
