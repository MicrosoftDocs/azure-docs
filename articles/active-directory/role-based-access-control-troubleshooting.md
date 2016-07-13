<properties
	pageTitle="Role based access control troubleshooting | Microsoft Azure"
	description="Get help with issues or questions about Role Based Access Control resources."
	services="azure-portal"
	documentationCenter="na"
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="kgremban"/>

# Role-Based Access Control troubleshooting

## Introduction

[Role-Based Access Control](role-based-access-control-configure.md) is a powerful feature that allows you to delegate fine-grained access to resources in Azure. This means you can feel confident granting a specific person the right to use exactly what they need, and no more. However, at times the resource model for Azure resources can be complicated and it can be difficult to understand exactly what you are granting permissions to.

This document will let you know what to expect when using some of the roles in the Azure portal. These three roles cover all resource types:

- Owner  
- Contributor  
- Reader  

Owners and contributors both have full access to the management experience, but a contributor can’t give access to other users or groups. Things get a little more interesting with the reader role, so that’s where we’ll spend some time. See the [Role-Based Access Control get-started article](role-based-access-control-configure.md) for details on how to grant access.

## App service workloads

### Write access capabilities

If you grant a user read-only access to a single web app, some features are disabled that you might not expect. The following management capabilities require **write** access to a web app (either Contributor or Owner), and won’t be available in any read-only scenario.

- Commands (e.g. start, stop, etc.)
- Changing settings like general configuration, scale settings, backup settings, and monitoring settings
- Accessing publishing credentials and other secrets like app settings and connection strings
- Streaming logs
- Diagnostic logs configuration
- Console (command prompt)
- Active and recent deployments (for local git continuous deployment)
- Estimated spend
- Web tests
- Virtual network (only visible to a reader if a virtual network has previously been configured by a user with write access).

If you can't access any of these tiles, you'll need to ask your administrator for Contributor access to the web app.

### Dealing with related resources

Web apps are complicated by the presence of a few different resources that interplay. Here is a typical resource group with a couple websites:

![Web app resource group](./media/role-based-access-control-troubleshooting/website-resource-model.png)

As a result, if you grant someone access to just the web app, much of the functionality on the website blade in the Azure portal will be disabled.

These items require **write** access to the **App Service plan** that corresponds to your website:  

- Viewing the web app’s pricing tier (Free or Standard)  
- Scale configuration (number of instances, virtual machine size, autoscale settings)  
- Quotas (storage, bandwidth, CPU)  

These items require **write** access to the whole **Resource group** that contains your website:  

- SSL Certificates and bindings (This is because SSL certificates can be shared between sites in the same resource group and geo-location)  
- Alert rules  
- Autoscale settings  
- Application insights components  
- Web tests  

## Virtual machine workloads

Much like with web apps, some features on the virtual machine blade require write access to the virtual machine, or to other resources in the resource group.

Virtual machines are related to Domain names, virtual networks, storage accounts, and alert rules.

These items require **write** access to the **Virtual machine**:

- Endpoints  
- IP addresses  
- Disks  
- Extensions  

These require **write** access to both the **Virtual machine**, and the **Resource group** (along with the Domain name) that it is in:  

- Availability set  
- Load balanced set  
- Alert rules  

If you can't access any of these tiles, you'll need to ask your administrator for Contributor access to the Resource group.

## See more
- [Role Based Access Control](role-based-access-control-configure.md): Get started with RBAC in the Azure portal.
- [Built-in roles](role-based-access-built-in-roles.md): Get details about the roles that come standard in RBAC.
- [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md): Learn how to create custom roles to fit your access needs.
- [Create an access change history report](role-based-access-control-access-change-history-report.md): Keep track of changing role assignments in RBAC.
