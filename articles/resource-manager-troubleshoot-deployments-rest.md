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
   ms.date="03/21/2016"
   ms.author="tomfitz"/>

# Troubleshooting resource group deployments with Azure Resource Manager REST API

> [AZURE.SELECTOR]
- [Portal](resource-manager-troubleshoot-deployments-portal.md)
- [PowerShell](resource-manager-troubleshoot-deployments-powershell.md)
- [Azure CLI](resource-manager-troubleshoot-deployments-cli.md)
- [REST API](resource-manager-troubleshoot-deployments-rest.md)

If you've received an error when deploying resources to Azure, you need to troubleshoot what went wrong. The REST API provides operations that enable you to find the errors and determine potential fixes.

You can troubleshoot your deployment by looking at either the audit logs, or the deployment operations. This topic shows both methods.

You can avoid some errors by validating your template and infrastructure prior to deployment. For more information, see [Deploy a resource group with Azure Resource Manager template](resource-group-template-deploy.md).

When deploying resources through the REST API, you can specify the type of debugging information that you would like to retain for later troubleshooting.. You can set the **debugSetting** to log information about the
.
## Troubleshoot with REST API

1. Deploy your resources with the [Create a template deployment](https://msdn.microsoft.com/library/azure/dn790564.aspx) operation. Set the **debugSetting** property in JSON request to log
request and/or response information. 

        PUT https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/microsoft.resources/deployments/{deployment-name}?api-version={api-version}

2. Get information about a deployment with the [Get information about a template deployment](https://msdn.microsoft.com/library/azure/dn790565.aspx) operation.

        GET https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/microsoft.resources/deployments/{deployment-name}?api-version={api-version}

3. Get information about deployment operations with the [List all template deployment operations](https://msdn.microsoft.com/library/azure/dn790518.aspx) operation. The response will include request and/or 
response information based on what you specified in the **debugSetting** property during deployment.

        GET https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/microsoft.resources/deployments/{deployment-name}/operations?$skiptoken={skiptoken}&api-version={api-version}

4. Get events from the audit logs for the deployment with the [List the management events in a subscription](https://msdn.microsoft.com/library/azure/dn931934.aspx) operation.

        GET https://management.azure.com/subscriptions/{subscription-id}/providers/microsoft.insights/eventtypes/management/values?api-version={api-version}&$filter={filter-expression}&$select={comma-separated-property-names}


## Next steps

- To learn about using the audit logs to monitor other types of actions, see [Audit operations with Resource Manager](resource-group-audit.md).
- To validate your deployment prior to executing it, see [Deploy a resource group with Azure Resource Manager template](resource-group-template-deploy.md).