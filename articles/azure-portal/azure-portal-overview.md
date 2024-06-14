---
title: What is the Azure portal?
description: The Azure portal is a graphical user interface that you can use to manage your Azure services. Learn how to navigate and find resources in the Azure portal.
ms.date: 06/14/2024
ms.topic: overview
---

# What is the Azure portal?

The Azure portal is a web-based, unified console that lets you create and manage all your Azure resources. With the Azure portal, you can manage your Azure subscription using a graphical user interface. You can build, manage, and monitor everything from simple web apps to complex cloud deployments in the portal. For example, you can set up a new database, increase the compute power of your virtual machines, and monitor your monthly costs. You can review all available resources, and use guided wizards to create new ones.

The Azure portal is designed for resiliency and continuous availability. It has a presence in every Azure datacenter. This configuration makes the Azure portal resilient to individual datacenter failures and helps avoid network slowdowns by being close to users. The Azure portal updates continuously, and it requires no downtime for maintenance activities. You can access the Azure portal with [any supported browser](azure-portal-supported-browsers-devices.md).

In this topic, you learn about the different parts of the Azure portal.

## Home

By default, the first thing you see after you [sign in to the portal](https://portal.azure.com) is **Home**. This page compiles resources that help you get the most from your Azure subscription. Select **Create a resource** to quickly create a new resource in the current subscription, or choose a service to start working in. For quick and easy access to work in progress, we show a list of your most recently visited resources. We also include links to free online courses, documentation, and other useful resources.

## Portal elements and controls

The portal menu and page header are global elements that are always present in the Azure portal. These persistent features are the "shell" for the user interface associated with each individual service or feature. The header provides access to global controls. The working pane for a resource or service may also have a resource menu specific to that area.

The figure below labels the basic elements of the Azure portal, each of which are described in the following table. In this example, the current focus is a virtual machine, but the same elements generally apply, no matter what type of resource or service you're working with.

:::image type="content" source="media/azure-portal-overview/azure-portal-overview-portal-callouts.png" alt-text="Screenshot showing the full screen portal view and a key to UI elements." lightbox="media/azure-portal-overview/azure-portal-overview-portal-callouts.png":::

|Key|Description |
|:---:|---|
|1|**Page header**. Appears at the top of every portal page and holds global elements.|
|2|**Global search**. Use the search bar to quickly find a specific resource, a service, or documentation.|
|3|**Global controls**. Like all global elements, these controls persist across the portal. Global controls include Cloud Shell, Notifications, Settings, Support + Troubleshooting, and Feedback.|
|4|**Your account**. View information about your account, switch directories, sign out, or sign in with a different account.|
|5|**Portal menu**. This global element can help you to navigate between services. Sometimes referred to as the sidebar.|
|6|**Service menu**. Many services include a menu with commands that are contextual to the service or resource that you're working with. You may see also this element referred to as the resource menu, or sometimes as the left pane.|
|7|**Command bar**. These controls are contextual to your current focus.|
|8|**Working pane**. Displays details about the resource that is currently in focus.|
|9|**Breadcrumb**. Use the breadcrumb links to move back a level in your workflow.|

## Portal menu

The Azure portal menu lets you quickly get to key functionality and resource types. It's available from anywhere in the Azure portal.

:::image type="content" source="media/azure-portal-overview/azure-portal-menu.png" alt-text="Screenshot showing the Azure portal menu.":::

Useful commands in the portal menu include:

- **+ Create a resource**. An easy way to get started creating a new resource in the current subscription.
- **Favorites**. Your list of favorite Azure services. To learn how to customize this list, see [Add, remove, and sort favorites](../azure-portal/azure-portal-add-remove-sort-favorites.md).|

You can [choose a default mode for the portal menu](set-preferences.md#portal-menu-behavior): flyout or docked.

When the portal menu is in flyout mode, it's hidden until you need it. Select the menu icon to open or close the menu.

:::image type="content" source="media/azure-portal-overview/azure-portal-overview-portal-menu-flyout.png" alt-text="Screenshot of the Azure portal menu in flyout mode.":::

If you choose docked mode for the portal menu, it will always be visible. You can collapse the menu to provide more working space.

:::image type="content" source="media/azure-portal-overview/azure-portal-overview-portal-menu-expandcollapse.png" alt-text="Screenshot of the Azure portal menu in docked mode.":::

## Service menu

The service menu appears when you're working with an Azure service or resource. Commands in this menu 

## Dashboard

Dashboards provide a focused view of the resources in your subscription that matter most to you. We've given you a default dashboard to get you started. You can customize this dashboard to bring the resources you use frequently into a single view.

You can create other dashboards for your own use, or publish customized dashboards and share them with other users in your organization. For more information, see [Create and share dashboards in the Azure portal](../azure-portal/azure-portal-dashboards.md).

As noted earlier, you can [set your startup page to Dashboard](set-preferences.md#choose-a-startup-page) if you want to see your most recently used dashboard when you sign in to the Azure portal.

## Get started

If you're a new subscriber, you'll have to create a resource before there's anything to manage. Select **+ Create a resource** from the portal menu or **Home** page to view the services available in the Azure Marketplace. You'll find hundreds of applications and services from many providers here, all certified to run on Azure.

To view all available services, select **All services** from the sidebar.

> [!TIP]
> Often, the quickest way to get to a resource, service, or documentation is to use *Search* in the global header.

For more help getting started with Azure, explore the [Azure Quickstart Center](azure-portal-quickstart-center.md).

## Next steps

* Take the [Manage services with the Azure portal training module](/training/modules/tour-azure-portal/).
* Stay connected on the go with the [Azure mobile app](https://azure.microsoft.com/features/azure-portal/mobile-app/).
