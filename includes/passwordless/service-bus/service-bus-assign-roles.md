---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

When developing locally, make sure that the user account that connects to Azure Service Bus has the correct permissions. You'll need the [Azure Service Bus Data Owner](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner) role in order to send and receive messages. To assign yourself this role, you'll need the User Access Administrator role, or another role that includes the `Microsoft.Authorization/roleAssignments/write` action. You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. Learn more about the available scopes for role assignments on the [scope overview](/azure/role-based-access-control/scope-overview) page.

The following example assigns the `Azure Service Bus Data Owner` role to your user account, which provides full access to Azure Service Bus resources. In a real scenario, follow the [Principle of Least Privilege](/azure/active-directory/develop/secure-least-privileged-access) to give users only the minimum permissions needed for a more secure production environment.

### Azure built-in roles for Azure Service Bus
For Azure Service Bus, the management of namespaces and all related resources through the Azure portal and the Azure resource management API is already protected using the Azure RBAC model. Azure provides the below Azure built-in roles for authorizing access to a Service Bus namespace:

- [Azure Service Bus Data Owner](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner): Enables data access to Service Bus namespace and its entities (queues, topics, subscriptions, and filters)
- [Azure Service Bus Data Sender](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-sender): Use this role to give the send access to Service Bus namespace and its entities.
- [Azure Service Bus Data Receiver](../../../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver): Use this role to give the receive access to Service Bus namespace and its entities.

If you want to create a custom role, see [Rights required for Service Bus operations](../../../articles/service-bus-messaging/service-bus-sas.md#rights-required-for-service-bus-operations).

> [!IMPORTANT]
> In most cases, it will take a minute or two for the role assignment to propagate in Azure. In rare cases, it may take up to eight minutes. If you receive authentication errors when you first run your code, wait a few moments and try again.

1. In the Azure portal, locate your service bus namespace using the main search bar or left navigation.

2. On the overview page, select **Access control (IAM)** from the left-hand menu.	

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="media/service-bus-assign-roles/add-role.png" alt-text="A screenshot showing how to assign a role.":::    

5. Use the search box to filter the results to the desired role. For this example, search for `Azure Service Bus Data Owner` and select the matching result. Then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Azure AD username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog. 

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

