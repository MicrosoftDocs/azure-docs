---
title: Azure portal overview | Microsoft Docs 
description: The Azure portal is a graphical user interface that you can use to manage your Azure services. Learn how to navigate and find resources in the Azure portal.
services: azure-portal
keywords: portal
author: mgblythe
ms.author: mblythe
ms.date: 12/20/2019
ms.topic: conceptual

ms.service: azure-portal
manager:  mtillman
---
# Azure portal overview

This article introduces the Azure portal, identifies portal page elements, and helps you get familiar with the Azure portal management experience.

## What is the Azure portal?

The Azure portal is a web-based, unified console that provides an alternative to command-line tools. With the Azure portal, you can manage your Azure subscription using a graphical user interface. You can build, manage, and monitor everything from simple web apps to complex cloud deployments. Create custom dashboards for an organized view of resources. Configure accessibility options for an optimal experience.

The Azure portal is designed for resiliency and continuous availability. It has a presence in every Azure datacenter. This configuration makes the Azure portal resilient to individual datacenter failures and avoids network slow-downs by being close to users. The Azure portal updates continuously and requires no downtime for maintenance activities.

## Azure portal menu

You can choose the default mode for the portal menu. It can be docked or it can act as a flyout panel.

When the portal menu is in flyout mode, it's hidden until you need it. Select the menu icon to open or close the menu.

![Azure portal menu in flyout mode](./media/azure-portal-overview/azure-portal-overview-portal-menu-flyout.png)

If you choose docked mode for the portal menu, it will always be visible. You can collapse the menu to provide more working space.

![Azure portal menu in docked mode](./media/azure-portal-overview/azure-portal-overview-portal-menu-expandcollapse.png)

## Azure Home

As a new subscriber to Azure services, the first thing you see after you [sign in to the portal](https://portal.azure.com) is **Azure Home**. This page compiles resources that help you get the most from your Azure subscription. We have included links to free online courses, documentation, core services, and useful sites for staying current and managing change for your organization. For quick and easy access to work in progress, we also show a list of your most recently visited resources. You can’t customize this page, but you can choose whether to see **Azure Home** or **Azure Dashboard** as your default view. The first time you sign in, there’s a prompt at the top of the page where you can save your preference.

![Screenshot showing default view selector](./media/azure-portal-overview/azure-portal-default-view.png)

Both the Azure portal menu and the Azure default view can be changed in **Portal settings**. If you change your selection, the change is immediately applied.

![Screenshot showing default view selector](./media/azure-portal-overview/azure-portal-overview-portal-settings-menu-home.png)

## Azure Dashboard

Dashboards provide a focused view of the resources in your subscription that matter most to you. We’ve given you a default dashboard to get you started. You can customize this dashboard to bring the resources you use frequently into a single view. Any changes you make to the default view affect your experience only. However, you can create additional dashboards for your own use or publish your customized dashboards and share them with other users in your organization. For more information, see [Create and share dashboards in the Azure portal](../azure-portal/azure-portal-dashboards.md).

## Getting around the portal

It’s helpful to understand the basic portal layout and how to interact with it. Here, we’ll introduce the components of the user interface and some of the terminology we use to give instructions. For a more detailed tour of the portal, see the course lesson [Navigate the portal](https://docs.microsoft.com/learn/modules/tour-azure-portal/3-navigate-the-portal).

The Azure portal menu and page header are global elements that are always present. These persistent features are the “shell” for the user interface associated with each individual service or feature and the header provides access to global controls. The configuration page (sometimes referred to as a “blade”) for a resource may also have a resource menu to help you move between features.

The figure below labels the basic elements of the Azure portal, each of which are described in the following table.

![Screenshot showing full-screen portal view and key to UI elements](./media/azure-portal-overview/azure-portal-overview-portal-callouts.png)

![Screenshot showing expanded portal menu](./media/azure-portal-overview/azure-portal-overview-portal-menu-callouts.png)

|Key|Description
|:---:|---|
|1|Page header. Appears at the top of every portal page and holds global elements.|
|2| Global search. Use the search bar to quickly find a specific resource, a service, or documentation.|
|3|Global controls. Like all global elements, these features persist across the portal and include: Cloud Shell, subscription filter, notifications, portal settings, help and support, and send us feedback.|
|4|Your account. View information about your account, switch directories, sign out, or sign in with a different account.|
|5|Portal menu. The portal menu is a global element that helps you to navigate between services. Sometimes referred to as the sidebar, the portal menu mode can be changed in **Portal settings**.|
|6|Resource menu. Many services include a resource menu to help you manage the service. You may see this element referred to as the left pane.|
|7|Command bar. The controls on the command bar are contextual to your current focus.|
|8|Working pane.  Displays the details about the resource that is currently in focus.|
|9|Breadcrumb. You can use the breadcrumb links to move back a level in your workflow.|
|10|Master control to create a new resource in the current subscription. Expand or open the portal menu to find **+ Create a resource**. Search or browse the Azure Marketplace for the resource type you want to create.|
|11|Your favorites list. See [Add, remove, and sort favorites](../azure-portal/azure-portal-add-remove-sort-favorites.md) to learn how to customize the list.|

## Get started with services

If you’re a new subscriber, you’ll have to create a resource before there’s anything to manage. Select **+ Create a resource** to view the services available in the Azure Marketplace. You’ll find applications and services from hundreds of providers here, all certified to run on Azure.

We pre-populated your Favorites in the sidebar with links to commonly used services.  To view all available services, select **All services** from the sidebar.

> [!TIP]
> The quickest way to find a resource, service, or documentation is to use *Search* in the global header. Use the breadcrumb links to go back to previous pages.
>
Watch this video for a demo on how to use global search in the Azure portal.


> [!VIDEO https://www.youtube.com/embed/nZ7WwTZcQbo]

[How to use global search in the Azure portal](https://www.youtube.com/watch?v=nZ7WwTZcQbo)

## Next steps

* Learn more about where to run Azure portal in [Supported browsers and devices](../azure-portal/azure-portal-supported-browsers-devices.md)
* Stay connected on the go with [Azure mobile app](https://azure.microsoft.com/features/azure-portal/mobile-app/)
* Onboard and set up your cloud environment with the [Azure Quickstart Center](../azure-portal/azure-portal-quickstart-center.md)
