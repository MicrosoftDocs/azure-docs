---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2025
ms.author: glenga
---

+ [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): creates your function app.
+ [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): creates a serverless Flex Consumption hosting plan for your app.
+ [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageaccounts): creates an Azure Storage account, which is required by Functions.
+ [**Microsoft.Insights/components**](/azure/templates/microsoft.insights/components): creates an Application Insights instance for monitoring your app. 
+ [**Microsoft.OperationalInsights/workspaces**](/azure/templates/microsoft.operationalinsights/workspaces): creates a workspace required by Application Insights.
+ [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/microsoft.managedidentity/userassignedidentities): creates a user-assigned managed identity that's used by the app to authenticate with other Azure services using Microsoft Entra. 
+ [**Microsoft.Authorization/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments): creates role assignments to the user-assigned managed identity, which provide the app with least-privilege access when connecting to other Azure services.