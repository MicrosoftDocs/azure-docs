<properties
	pageTitle="Use the Role-based Access Control (RBAC) Access Change History Report"
	description="Learn how to use the Role-based Access Control (RBAC) Access Change History Report."
	services="active-directory"
	documentationCenter=""
	authors="IHenkel"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="10/07/2015"
	ms.author="inhenk"/>

# Use the Role-based Access Control Access Change History Report
All access changes happening in your Azure subscriptions get logged in Azure events.

## Create a report with Azure PowerShell
To create a report of who granted/revoked what kind of access to/from whom on what scope within your Azure subscirptions use the following PowerShell command:

    Get-AzureAuthorizationChangeLog

## Create a report with Azure CLI
To create a report of who granted/revoked what kind of access to/from whom on what scope within your Azure subscirptions use the Azure command line interface (CLI) command:

    azure authorization changelog

> [AZURE.NOTE] Access changes can be queried for the past 90 days (in 15 day batches).

The following example lists all access changes in the subscription for the past 7 days.

![](./media/role-based-access-control-using-access-change-history-report/access-change-history.png)

## Export Access Change to a Spreadsheet
It is convenient to export access changes into a spreadsheet for review.

![](./media/role-based-access-control-using-access-change-history-report/change-history-spreadsheet.png)

## RBAC Topics
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
