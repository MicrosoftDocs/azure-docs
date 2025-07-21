---
title: "Include file"
description: "Include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 06/11/2025
ms.author: alexwolf
ms.custom: include file
---

When you develop locally, make sure that the user account that connects to Azure Service Bus has the correct permissions. You need the [Azure Service Bus Data Owner](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner) role in order to send and receive messages. To assign yourself this role, you need the User Access Administrator role, or another role that includes the `Microsoft.Authorization/roleAssignments/write` action.

You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. To learn more the available scopes for role assignments, see [Understand scope for Azure RBAC](../../../articles/role-based-access-control/scope-overview.md).

The following example assigns the `Azure Service Bus Data Owner` role to your user account, which provides full access to Azure Service Bus resources. In a real scenario, follow the [principle of least privilege](../../../articles/active-directory/develop/secure-least-privileged-access.md) to give users only the minimum permissions needed for a more secure production environment.

### Azure built-in roles for Azure Service Bus

For Azure Service Bus, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the Azure RBAC model. Azure provides the following Azure built-in roles for authorizing access to a Service Bus namespace:

- [Azure Service Bus Data Owner](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner): Enables data access to Service Bus namespace and its entities, including queues, topics, subscriptions, and filters. A member of this role can send and receive messages from queues or topics/subscriptions. 
- [Azure Service Bus Data Sender](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-sender): Use this role to give the `send` access to Service Bus namespace and its entities.
- [Azure Service Bus Data Receiver](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver): Use this role to give the `receive` access to Service Bus namespace and its entities.

If you want to create a custom role, see [Rights required for Service Bus operations](../../../articles/service-bus-messaging/service-bus-sas.md#rights-required-for-service-bus-operations).

<a name='add-azure-ad-user-to-azure-service-bus-owner-role'></a>

### Add Microsoft Entra user to Azure Service Bus Owner role

Add your Microsoft Entra user name to the **Azure Service Bus Data Owner** role at the Service Bus namespace level. This configuration allows an app that runs in the context of your user account to send messages to a queue or a topic. It can receive messages from a queue or a topic's subscription. 

> [!IMPORTANT]
> In most cases, it takes a minute or two for the role assignment to propagate in Azure. In rare cases, it might take up to **eight minutes**. If you receive authentication errors when you first run your code, wait a few moments and try again.

1. If you don't have the Service Bus Namespace page open in the Azure portal, locate your Service Bus namespace using the main search bar or left navigation.
1. On the **Overview** page, select **Access control (IAM)** from the left-hand menu.	
1. On the **Access control (IAM)** page, select the **Role assignments** tab.
1. Select **+ Add** from the top menu and then **Add role assignment**.

   :::image type="content" source="media/service-bus-assign-roles/add-role.png" alt-text="A screenshot showing how to assign a role.":::    

1. Use the search box to filter the results to the desired role. For this example, search for `Azure Service Bus Data Owner` and select the matching result. Then choose **Next**.
1. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.
1. In the dialog, search for your Microsoft Entra username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog. 
1. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.
