---
title: No working connector group found for an Application Proxy app
description: Address problems you might encounter when there is no working Connector in a Connector Group for your application with the Azure AD Application Proxy
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
ms.date: 05/21/2018
ms.author: kenwith
ms.reviewer: asteen
ms.collection: M365-identity-device-management
---

# No working connector group found for an Application Proxy application

This article helps to resolve the common issues faced when there is not a connector detected for an Application Proxy application integrated with Azure Active Directory.

## Overview of steps
If there is no working Connector in a Connector Group for your application, there are a few ways to resolve the problem:

-   If you have no connectors in the group, you can:

    -   Download a new Connector on the right on premises server, and assign it to this group

    -   Move an active Connector into the group

-   If you have no active connectors in the group, you can:

    -   Identify the reason your Connector is inactive and resolve

    -   Move an active Connector into the group

To figure out the issue, open the “Application Proxy” menu in your Application, and look at the Connector Group warning message. If there are no connectors in the group, the warning message specifies the group needs at least one Connector. If you have no active Connectors, the warning message explains that. It is common to have inactive Connectors. 

   ![Connector group selection in Azure portal](./media/application-proxy-connectivity-no-working-connector/no-active-connector.png)

For details on each of these options, see the corresponding section below. The instructions assume that you are starting from the Connector management page. If you are looking at the error message above, you can go to this page by clicking on the warning message. You can also get to the page by going to **Azure Active Directory**, clicking on **Enterprise Applications**, then **Application Proxy.**

   ![Connector group management in Azure portal](./media/application-proxy-connectivity-no-working-connector/app-proxy.png)

## Download a new Connector

To download a new Connector, use the “Download Connector” button at the top of the page.

Install the connector on a machine with direct line of sight to the backend application. Typically, the connector is installed on the same server as the application. After downloading, the Connector should appear in this menu. click the Connector, and use the “Connector Group” drop-down to make sure it belongs to the right group. Save the change.

   ![Download the connector from the Azure portal](./media/application-proxy-connectivity-no-working-connector/download-connector.png)
   
## Move an Active Connector

If you have an active Connector that should belong to the group and has line of sight to the target backend application, you can move the Connector into the assigned group. To do so, click the Connector. In the “Connector Group” field, use the drop-down to select the correct group, and click Save.

## Resolve an inactive Connector

If the only Connectors in the group are inactive, they are likely on a machine that does not have all the necessary ports unblocked.

see the ports Troubleshoot document for details on investigating this problem.

## Next steps
[Understand Azure AD Application Proxy connectors](application-proxy-connectors.md)


