---
title: How to configure permissions for Azure Managed Grafana Preview
description: How to configure permissions for Azure Managed Grafana  
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to 
ms.date: 3/31/2022 
---

# How to configure permissions for Azure Managed Grafana Preview

By default, Managed Grafana grants a Log Analytics Reader access role for all resources within a subscription. It means that Managed Grafana can access and search all monitoring data and access monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

In this article, you will learn how to manually edit permissions for a specific resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An Azure Managed Grafana workspace. If you don't have one yet, [create a workspace](/how-to-permissions.md).
- An Azure resource with monitoring data and write permissions, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner)

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Manually assign permissions for a Managed Grafana workspace to access data in Azure

To edit permissions for a specific resource, follow these steps:

1. Open a resource that contains the monitoring data you want to visualize. In this example, we are configuring an Application Insights resource.
1. Select **Access Control (IAM)**.
1. Under **Grant access to this resource**, select **Add role assignment**.
1. The portal lists various roles you can give to your Managed Grafana resource. Select a role. For instance, **Monitoring Reader**.
1. Select **Next**.
1. For **Assign access to**, select **Managed Identity**.
1. Select **Select Members**.
1. Select the **Subscription** containing your Managed Grafana workspace
1. Select a **Managed identity** from the options in the dropdown list
1. Select your Managed Grafana workspace.
1. Select **Save** to complete the role assignment.

## Next steps

> [!div class="nextstepaction"]
> [How to configure data source plugins for Azure Managed Grafana with Managed Identity](./how-to-data-source-plugins-managed-identity.md)
