---
title: Problem creating a Microsoft Entra application proxy application
description: How to troubleshoot issues creating Application Proxy applications in the Microsoft Entra admin center
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: asteen
---

# Problem creating an Application Proxy application 

Below are some of the common issues people face when creating a new application proxy application.

## Recommended documents 

To learn more about creating an Application Proxy application through the Admin Portal, see [Publish applications using Microsoft Entra application proxy](application-proxy-add-on-premises-application.md).

If you are following the steps in that document and are getting an error creating the application, see the error details for information and suggestions for how to fix the application. Most error messages include a suggested fix. 

## Specific things to check

To avoid common errors, verify:

-   You are an administrator with permission to create an Application Proxy application

-   The internal URL is unique

-   The external URL is unique

-   The URLs start with http or https, and end with a “/”

-   The URL should be a domain name and not an IP address

The error message should display in the top right corner when you create the application. You can also select the notification icon to see the error messages.

   ![Notification prompt](./media/application-proxy-config-problem/error-message.png)

## Next steps
[Enable Application Proxy in the Microsoft Entra admin center](application-proxy-add-on-premises-application.md)
