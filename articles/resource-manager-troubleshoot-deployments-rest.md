<properties
   pageTitle="Troubleshooting deployments with REST API | Microsoft Azure"
   description="Describes how to use the Azure Resource Manager REST API to detect and fix issues from Resource Manager deployment."
   services="azure-resource-manager,virtual-machines"
   documentationCenter=""
   tags="top-support-issue"
   authors="tfitzmac"
   manager="timlt"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-multiple"
   ms.workload="infrastructure"
   ms.date="03/18/2016"
   ms.author="tomfitz"/>

# Troubleshooting resource group deployments with Azure Resource Manager REST API

> [AZURE.SELECTOR]
- [Portal](resource-manager-troubleshoot-deployments-portal.md)
- [PowerShell](resource-manager-troubleshoot-deployments-powershell.md)
- [Azure CLI](resource-manager-troubleshoot-deployments-cli.md)
- [REST API](resource-manager-troubleshoot-deployments-rest.md)

You've tried deploying resources to Azure, but it did not succeed. Now, you need to troubleshoot what went wrong. Whether you deployed your resources through the REST API or one of the other methods (Azure Portal, Azure PowerShell, Azure CLI,
or code), the REST API provides operations that enable you to find the errors and determine potential fixes.

You can troubleshoot your deployment by looking at either the audit logs, or the deployment operations. Both methods are shown in this topic.

When deploying resources through the REST API, you can specify the type of debugging information that you would like to retain for later troubleshooting.. You can set the **debugSetting** to log information about the
request and response. For information about how to use this property, see [Create a template deployment](https://msdn.microsoft.com/library/dn790564.aspx).

## Troubleshoot with REST API

1. To get information about a deployment, either retrieve a particular deployment or a list of all of the deployments for a resource group. For full descriptions of these commands,
see - [Get information about a template deployment](https://msdn.microsoft.com/library/azure/dn790565.aspx) and
[List all template deployments in a resource group](https://msdn.microsoft.com/library/azure/dn848363.aspx).
2. To get information about deployment operations, see [List all template deployment operations](https://msdn.microsoft.com/library/azure/dn790518.aspx) and 
[Get information about a template deployment operation](https://msdn.microsoft.com/library/azure/dn790519.aspx).



## Next steps

- To learn about using the audit logs to monitor other types of actions, see [Audit operations with Resource Manager](resource-group-audit.md).
