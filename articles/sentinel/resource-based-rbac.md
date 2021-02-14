---
title: Implement resource-based RBAC in Azure Sentinel | Microsoft Docs
description: This article explains how to implement resource, role-based access control (resource-based RBAC) for Azure Sentinel to provide access to specific resources only, without the entire Azure Sentinel experience.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/14/2021
ms.author: bagol

---

# Resource-based RBAC for Azure Sentinel

Use resource and role-based access control (resource-based RBAC) to provide access to specific resources only, without the entire Azure Sentinel experience.

Typically, users who have access to the Azure Sentinel workspace also have access to all its resources. Resource-based roles are used to enable users who don't otherwise have access to Azure Sentinel with access to specific users.

For example, granting access to specific resources only may be helpful for non-security operations users (non-SOC users) who need to view specific logs in order to do their jobs.

## Implementing resource-base RBAC

1. In Azure Monitor, enable resource-based RBAC as described in the [Azure Monitor documentation](/azure/azure-monitor/platform/manage-access).

1. [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) for each team of users who needs to access your resources without the entire Azure Sentinel environment. Assign [log reader permissions](/azure/azure-monitor/platform/manage-access#resource-permissions) for the team members.

1. Assign resources to the resource team groups you created, and tag events with the relevant resource IDs. When Azure resources send data to Azure Sentinel, the log records are automatically tagged with the resource ID of the data source.

    > [!TIP]
    > We recommend that you group the resource under the resource group you created for the purpose. If you can't, make sure that your team has log reader permissions directly to the resources you want them to access.
    >

Team members now have access to the logs they require via Azure Sentinel's **Logs** or **Workbooks** area.

## Tag events from collector VMs

When events are collected using [Common Event Format (CEF](connect-common-event-format.md) or [Syslog](connect-syslog.md), a collector VM is used to collect events from multiple source systems.

For example, when a Syslog collector VM listens for the sources sending Syslog events, and forwards them to Azure Sentinel, the collector VM resource ID is assigned to all the events they forward.

If you have multiple teams, make sure that you have separate collector VMs processing the events for each separate team. For example, separating your VMs ensures that Syslog events that belong to Team A are collected using the collector VM A.

> [!TIP]
> When using an on-premises VM or another cloud collector VM, you can ensure that it has a resource ID by implementing [Azure Arc](/azure/azure-arc/servers/overview).
>
> To scale your VM environment, consider creating a [VM scale set](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854) to collect your CEF and Sylog logs.

## Resource RBAC for custom collection

When collecting using the [Log Analytics data collector API](/azure/azure-monitor/platform/data-collector-api), you can assign to events with a resource ID using a the HTTP [*x-ms-AzureResourceId*](/azure/azure-monitor/platform/data-collector-api#request-headers) request header.

If you are using resource-based RBAC and want the events collected by API to be available to specific users, use the resource ID of the resource group you [created for your users](#implementing-resource-base-rbac).

## Next steps

For more information, see [Roles and permissions in Azure Sentinel](roles.md).
