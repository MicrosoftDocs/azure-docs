<properties
	pageTitle="Sharing and access control for Azure dashboards | Microsoft Azure"
	description="Learn how to manage sharing and access control for Azure dashboards."
	services="azure-resource-manager,azure-portal"
    keywords="portal,share,access"
	documentationCenter=""
	authors="adamabdelhamed"
	manager="dend"
	editor="dend"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/28/2016"
	ms.author="adamab"/>
    
# Sharing and access control for Azure dashboards

Access to the information displayed by most tiles in the portal are governed by Azure [Role Based Access Control](./active-directory/role-based-access-control-configure.md).  In order to seamlessly integrate dashboards into the ecosystem all published dashboards are implemented as Azure resources.  From an access control perspective dashboards are no different from a virtual machine or a storage account.  

Here is an example.  Let’s say you have an Azure subscription and various members of your team have been assigned the roles of **owner**, **contributor**, or **reader** of the subscription.  Users who are owners or contributors will be able to list, view, create, modify, or delete dashboards within the subscription.  Users who are readers will be able to list and view dashboards, but cannot modify or delete them.  Users with reader access will be able to make local edits to a published dashboard (e.g. when troubleshooting an issue), but will not be given the option to publish those changes back to the server.  They will have the option to make a private copy of the dashboard for themselves.  

Note that the individual tiles on the dashboard will enforce their own access control requirements based on the resources they are showing data for.  This means that you can design a dashboard that can be shared more broadly while still protecting the data on individual tiles.
