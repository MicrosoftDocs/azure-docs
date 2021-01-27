---
title: Connect </MFR NAME> </PRODUCT NAME> data to Azure Sentinel| Microsoft Docs
description: Learn how to use the </MFR NAME> </PRODUCT NAME> data connector to pull </PRODUCT NAME> logs into Azure Sentinel. View </PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/27/2021
ms.author: yelevin

---
# Connect your Google Workspace to Azure Sentinel 



The Google Workspace connector allows you to easily connect all your Google Workspace solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Google Workspace and Azure Sentinel makes use of REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Google Workspace 

Google Workspace can integrate and export logs directly to Azure Sentinel.
1. In the Azure Sentinel portal, click Data connectors and select Google Workspace and then Open connector page.

2. Follow the steps described in the "Configuration" section of the connector page.


## Find your data

After a successful connection is established, the data appears in Log Analytics under GWorkspace_ReportsAPI_admin_CL, GWorkspace_ReportsAPI_calendar_CL, GWorkspace_ReportsAPI_drive_CL, GWorkspace_ReportsAPI_login_CL, GWorkspace_ReportsAPI_mobile_CL, GWorkspace_ReportsAPI_token_CL,GWorkspace_ReportsAPI_user_accounts_CL.

## Validate connectivity
It may take upwards of 20 minutes until your logs start to appear in Log Analytics.