---
title: Troubleshoot RBAC in Azure | Microsoft Docs
description: Troubleshoot issues with Azure role-based access control (RBAC).
services: azure-portal
documentationcenter: na
author: rolyon
manager: mtillman

ms.assetid: df42cca2-02d6-4f3c-9d56-260e1eb7dc44
ms.service: role-based-access-control
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/23/2018
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: seohack1
---
# Troubleshoot RBAC in Azure

This article answers common questions about role-based access control (RBAC), so that you know what to expect when using the roles in the Azure portal and can troubleshoot access problems.

## Web app features that require write access

If you grant a user read-only access to a single web app, some features are disabled that you might not expect. The following management capabilities require **write** access to a web app (either Contributor or Owner), and aren’t available in any read-only scenario.

* Commands (like start, stop, etc.)
* Changing settings like general configuration, scale settings, backup settings, and monitoring settings
* Accessing publishing credentials and other secrets like app settings and connection strings
* Streaming logs
* Diagnostic logs configuration
* Console (command prompt)
* Active and recent deployments (for local git continuous deployment)
* Estimated spend
* Web tests
* Virtual network (only visible to a reader if a virtual network has previously been configured by a user with write access).

If you can't access any of these tiles, you need to ask your administrator for Contributor access to the web app.

## Web app resources that require write access

Web apps are complicated by the presence of a few different resources that interplay. Here is a typical resource group with a couple of websites:

![Web app resource group](./media/troubleshooting/website-resource-model.png)

As a result, if you grant someone access to just the web app, much of the functionality on the website blade in the Azure portal is disabled.

These items require **write** access to the **App Service plan** that corresponds to your website:  

* Viewing the web app’s pricing tier (Free or Standard)  
* Scale configuration (number of instances, virtual machine size, autoscale settings)  
* Quotas (storage, bandwidth, CPU)  

These items require **write** access to the whole **Resource group** that contains your website:  

* SSL Certificates and bindings (SSL certificates can be shared between sites in the same resource group and geo-location)  
* Alert rules  
* Autoscale settings  
* Application insights components  
* Web tests  

## Virtual machine features that require write access

Similar to web apps, some features on the virtual machine blade require write access to the virtual machine, or to other resources in the resource group.

Virtual machines are related to Domain names, virtual networks, storage accounts, and alert rules.

These items require **write** access to the **Virtual machine**:

* Endpoints  
* IP addresses  
* Disks  
* Extensions  

These require **write** access to both the **Virtual machine**, and the **Resource group** (along with the Domain name) that it is in:  

* Availability set  
* Load balanced set  
* Alert rules  

If you can't access any of these tiles, ask your administrator for Contributor access to the Resource group.

## Azure Functions and write access

Some features of [Azure Functions](../azure-functions/functions-overview.md) require write access. For example, if a user is assigned the Reader role, they will not be able to view the functions within a function app. The portal will display **(No access)**.

![Function apps no access](./media/troubleshooting/functionapps-noaccess.png)

A reader can click the **Platform features** tab and then click **All settings** to view some settings related to a function app (similar to a web app), but they can't modify any of these settings.

## RBAC changes are not being detected

Azure Resource Manager sometimes caches configurations and data to improve performance. When creating or deleting role assignments, it can take up to 30 minutes for changes to take effect. If you are using the Azure portal, Azure PowerShell, or Azure CLI, you can force a refresh of your role assignment changes by signing out and signing in. If you are making role assignment changes with REST API calls, you can force a refresh by refreshing your access token.

## Next steps
* [Manage access using RBAC and the Azure portal](role-assignments-portal.md)
* [View activity logs for RBAC changes](change-history-report.md)

