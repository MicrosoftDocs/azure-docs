---
title: Work with Azure Sentinel incidents in many workspaces at once | Microsoft Docs
description:  How to view incidents in multiple workspaces concurrently in Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/20/2020
ms.author: yelevin

---
# Work with incidents in many workspaces at once 

 To take full advantage of Azure Sentinel’s capabilities, Microsoft recommends using a single-workspace environment. However, there are some use cases that require having several workspaces, in some cases – for example, that of a [Managed Security Service Provider (MSSP)](./multiple-tenants-service-providers.md) and its customers – across multiple tenants. **Multiple Workspace View** lets you see and work with security incidents across several workspaces at the same time, even across tenants, allowing you to maintain full visibility and control of your organization’s security responsiveness.

## Entering Multiple Workspace View

When you open Azure Sentinel, you are presented with a list of all the workspaces to which you have access rights, across all selected tenants and subscriptions. To the left of each workspace name is a checkbox. Clicking the name of a single workspace will bring you into that workspace. To choose multiple workspaces, click all the corresponding checkboxes, and then click the **Multiple Workspace View** button at the top of the page.

> [!IMPORTANT]
> Multiple Workspace View currently supports a maximum of 10 concurrently displayed workspaces. 
> 
> If you check more than 10 workspaces, a warning message will appear.

Note that in the list of workspaces, you can see the directory, subscription, location, and resource group associated with each workspace. The directory corresponds to the tenant.

   ![Choose multiple workspaces](./media/multiple-workspace-view/workspaces.png)

## Working with incidents

In **Multiple Workspace View**, only the **Incidents** screen is available for now. It looks and functions in most ways like the regular **Incidents** screen. There are a few important differences, though:

   ![View incidents in multiple workspaces](./media/multiple-workspace-view/incidents.png)

- The counters at the top of the page - *Open incidents*, *New incidents*, *In progress*, etc. - show the numbers for all of the selected workspaces collectively.

- You'll see incidents from all of the selected workspaces and directories (tenants) in a single unified list. You can filter the list by workspace and directory, in addition to the filters from the regular **Incidents** screen.

- You'll need to have read and write permissions on all the workspaces from which you've selected incidents. If you have only read permissions on some workspaces, you'll see warning messages if you select incidents in those workspaces. You won't be able to modify those incidents or any others you've selected together with those (even if you do have permissions for the others).

- If you choose a single incident and click **View full details** or **Investigate**, you will from then on be in the data context of that incident's workspace and no others.

## Next steps
In this document, you learned how to view and work with incidents in multiple Azure Sentinel workspaces concurrently. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

