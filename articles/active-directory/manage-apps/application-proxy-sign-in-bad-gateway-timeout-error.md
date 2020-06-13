---
title: Can't access this Corporate Application error with App Proxy app
description: How to resolve common access issues with Azure AD Application Proxy applications.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 05/21/2019
ms.author: kenwith
ms.reviewer: asteen
ms.collection: M365-identity-device-management
---

# "Can't Access this Corporate Application" error when using an Application Proxy application

This article helps you troubleshoot common issues for the "This corporate app can't be accessed" error on an Azure AD Application Proxy application.

## Overview

When you see this error, find the status code on the error page. That code is likely one of the following status codes:

- **Gateway Timeout**: The Application Proxy service is unable to reach the connector. This error typically indicates a problem with the connector assignment, connector itself, or the networking rules around the connector.
- **Bad Gateway**: The connector is unable to reach the backend application. This error could indicate a misconfiguration of the application.
- **Forbidden**: The user is not authorized to access the application. This error can happen either when the user is not assigned to the application in Azure Active Directory, or if on the backend the user does not have permission to access the application.

To find the code, look at the text at the bottom left of the error message for the “Status Code” field. Also look for any additional tips at the bottom of the page.

![Example: Gateway timeout error](./media/application-proxy-sign-in-bad-gateway-timeout-error/connection-problem.png)

For details on how to troubleshoot the root cause of these errors and more details on suggested fixes, see the corresponding section below.

## Gateway Timeout errors

A gateway timeout occurs when the service tries to reach the connector and is unable to within the timeout window. This error is typically caused by an application assigned to a Connector Group with no working connectors, or some ports required by the Connector are not open.

## Bad Gateway errors

A bad gateway error indicates that the connector is unable to reach the backend application. make sure that you have published the correct application. Common mistakes that cause this error are:

- A typo or mistake in the internal URL
- Not publishing the root of the application. For example, publishing <http://expenses/reimbursement> but trying to access <http://expenses>
- Problems with the Kerberos Constrained Delegation (KCD) configuration
- Problems with the backend application

## Forbidden errors

If you see a forbidden error, the user has not been assigned to the application. This error could be either in Azure Active Directory or on the backend application.

To learn how to assign users to the application in Azure, see the [configuration documentation](application-proxy-add-on-premises-application.md#test-the-application).

If you confirm the user is assigned to the application in Azure, check the user configuration in the backend application. If you are using Kerberos Constrained Delegation/Integrated Windows Authentication, see the KCD Troubleshoot page for guidelines.

## Check the application's internal URL

As a first quick step, double check and fix the internal URL by opening the application through **Enterprise Applications**, then selecting the **Application Proxy** menu. Verify the internal URL is the one used from your on premises network to access the application.

## Check the application is assigned to a working Connector Group

To verify the application is assigned to a working Connector Group:

1. Open the application in the portal by going to **Azure Active Directory**, clicking on **Enterprise Applications**, then **All Applications.** Open the application, then select **Application Proxy** from the left menu.
1. Look at the Connector Group field. If there are no active connectors in the group, you see a warning. If you don’t see any warnings, move on to verify all [required ports](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectivity-ports-how-to) are allowed.
1. If the wrong Connector Group is showing, use the drop-down to select the correct group, and confirm you no longer see any warnings. If the intended Connector Group is showing, click the warning message to open the page with Connector management.
1. From here, there are a few ways to drill in further:

   - Move an active Connector into the group: If you have an active Connector that should belong to this group and has line of sight to the target backend application, you can move the Connector into the assigned group. To do so, click the Connector. In the “Connector Group” field, use the drop-down to select the correct group, and click save.
   - Download a new Connector for that group: From this page, you can get the link to [download a new Connector](https://download.msappproxy.net/Subscription/d3c8b69d-6bf7-42be-a529-3fe9c2e70c90/Connector/Download). Install the Connector on a machine with direct line of sight to the backend application. Typically, the Connector is installed on the same server as the application. Use the download Connector link to download a connector onto the target machine. Next, click the Connector, and use the “Connector Group” drop-down to make sure it belongs to the right group.
   - Investigate an inactive Connector: If a connector shows as inactive, it is unable to reach the service. This error is typically due to some required ports being blocked. To solve this issue, move on to verify all required ports are allowed.

After using these steps to ensure the application is assigned to a group with working Connectors, test the application again. If it is still not working, continue to the next section.

## Check all required ports are open

To verify that all required ports are open, see the [documentation on opening ports](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectivity-ports-how-to). If all the required ports are open, move to the next section.

## Check for other Connector Errors

If none of the above resolve the issue, the next step is to look for issues or errors with the Connector itself. You can see some common errors in the [Troubleshoot document](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-troubleshoot#connector-errors).

You can also look directly at the Connector logs to identify any errors. Many of the error messages share specific recommendations for fixes. To view the logs, see the [connectors documentation](application-proxy-connectors.md#under-the-hood).

## Additional Resolutions

If the above didn’t fix the problem, there are a few different possible causes. To identify the issue:

If your application is configured to use Integrated Windows Authentication (IWA), test the application without single sign-on. If not, move to the next paragraph. To check the application without single sign-on, open your application through **Enterprise Applications,** and go to the **Single Sign-On** menu. Change the drop-down from “Integrated Windows Authentication” to “Azure AD single sign-on disabled”.

Now open a browser and try to access the application again. You should be prompted for authentication and get into the application. If you are able to authenticate, the problem is with the Kerberos Constrained Delegation (KCD) configuration that enables the single sign-on. For more information, see the KCD Troubleshoot page.

If you continue to see the error, go to the machine where the Connector is installed, open a browser and attempt to reach the internal URL used for the application. The Connector acts like another client from the same machine. If you can’t reach the application, investigate why that machine is unable to reach the application, or use a connector on a server that is able to access the application.

If you can reach the application from that machine, to look for issues or errors with the Connector itself. You can see some common errors in the [Troubleshoot document](application-proxy-troubleshoot.md#connector-errors). You can also look directly at the Connector logs to identify any errors. Many of our error messages be able to share more specific recommendations for fixes. To learn how to view the logs, see [our connectors documentation](application-proxy-connectors.md#under-the-hood).

## Next steps

[Understand Azure AD Application Proxy connectors](application-proxy-connectors.md)
