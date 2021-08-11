---
title: Authenticate playbooks to Azure Sentinel | Microsoft Docs
description:  Learn how to give your playbooks access to Azure Sentinel and authorization to take remedial actions.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2021
ms.author: yelevin
---
# Authenticate playbooks to Azure Sentinel

The way Logic Apps works, it has to connect separately and authenticate independently to every resource of every type that it interacts with, including to Azure Sentinel itself. Logic Apps uses [specialized connectors](/connectors/connector-reference/) for this purpose, with each resource type having its own connector. This document explains the types of connection and authentication in the [Logic Apps Azure Sentinel connector](/connectors/azuresentinel/), that playbooks can use to interact with Azure Sentinel in order to have access to the information in your workspace's tables.

This document, along with our guide to [using triggers and actions in playbooks](playbook-triggers-actions.md), is a companion to our other playbook documentation - [Tutorial: Use playbooks with automation rules in Azure Sentinel](tutorial-respond-threats-playbook.md).

For an introduction to playbooks, see [Automate threat response with playbooks in Azure Sentinel](automate-responses-with-playbooks.md).

For the complete specification of the Azure Sentinel connector, see the [Logic Apps connector documentation](/connectors/azuresentinel/).

## Authentication

The Azure Sentinel connector in Logic Apps, and its component triggers and actions, can operate on behalf of any identity that has the necessary permissions (read and/or write) on the relevant workspace. The connector supports multiple identity types:

- [Managed identity (Preview)](#authenticate-with-managed-identity)
- [Azure AD user](#authenticate-as-an-azure-ad-user)
- [Service principal (Azure AD application)](#authenticate-as-a-service-principal-azure-ad-application)

    ![Authentication Options](media/authenticate-playbooks-to-sentinel/auth-methods.png)

### Permissions required

| Roles \ Connector components | Triggers | "Get" actions | Update incident,<br>add a comment |
| ------------- | :-----------: | :------------: | :-----------: |
| **[Azure Sentinel Reader](../role-based-access-control/built-in-roles.md#azure-sentinel-reader)** | &#10003; | &#10003; | &#10007; |
| **Azure Sentinel [Responder](../role-based-access-control/built-in-roles.md#azure-sentinel-responder)/[Contributor](../role-based-access-control/built-in-roles.md#azure-sentinel-contributor)** | &#10003; | &#10003; | &#10003; |
| 

[Learn more about permissions in Azure Sentinel](./roles.md).

### Authenticate with managed identity

This authentication method allows you to give permissions directly to the playbook (a Logic App workflow resource), so that Azure Sentinel connector actions taken by the playbook will operate on the playbook's behalf, as if it were an independent object with its own permissions on Azure Sentinel. Using this method lowers the number of identities you have to manage. 

To authenticate with managed identity:
   > [!NOTE]
   > Note: To assign roles to the managed identity, you must be signed in with a user that is assigned a role that has role assignments write permission, such as Owner or User Access Administrator at the scope of the Azure Sentinel workspace.

1. [Enable managed identity](../logic-apps/create-managed-service-identity.md#enable-system-assigned-identity-in-azure-portal) on the Logic Apps workflow resource. To summarize:

    - On the logic app menu, under **Settings**, select **Identity**. Select **System assigned > On > Save**. When Azure prompts you to confirm, select **Yes**.

    - Your logic app can now use the system-assigned identity, which is registered with Azure AD and is represented by an object ID.

1. Give that identity access to the Azure Sentinel workspace: 
    * Go to **Azure Sentinel workspace -> Settings -> Workspace settings -> Access control (IAM)**.
    * On the top panel click on **Add -> Add role assignment**. If the **Add role assignment** option is disabled, you don't have permissions to assign roles.
    * In the new panel opened, assign the right role: [Azure Sentinel Responder](../role-based-access-control/built-in-roles.md#azure-sentinel-responder) (if playbook has steps which update incidents or watchlists) or [Azure Sentinel Reader](../role-based-access-control/built-in-roles.md#azure-sentinel-reader) role (if playbook only gets incidents). Learn more about the available [roles in Azure Sentinel](./roles.md).
    * Under **Assign access to**, choose **Logic App**.
    * Select the subscription where the playbook is under and select the playbook name.
    * Click save.
    
    
1. Enable the managed identity authentication method in the Azure Sentinel Logic Apps connector:

    1. In the Logic Apps designer, add an Azure Sentinel Logic Apps connector step. If the connector is already enabled for an existing connection, click the **Change connection** link.

        ![Change connection](media/authenticate-playbooks-to-sentinel/change-connection.png)

    1. In the resulting list of connections, select **Add new** at the bottom. 

    1. Create a new connection by selecting **Connect with managed identity (preview)**.

        ![Managed identity option](media/authenticate-playbooks-to-sentinel/auth-methods-msi-choice.png)

    1. Fill in a name for this connection, select **System-assigned managed identity** and select **Create**.

        ![Connect with managed identity](media/authenticate-playbooks-to-sentinel/auth-methods-msi.png)

### Authenticate as an Azure AD user

To make a connection, select **Sign in**. You will be prompted to provide your account information. Once you have done so, follow the remaining instructions on the screen to create a connection.

### Authenticate as a service principal (Azure AD application)

Service principals can be created by registering an Azure AD application. It is **preferable** to use a registered application as the connector's identity, instead of using a user account, as you will be better able to control permissions, manage credentials, and enable certain limitations on the use of the connector.

To use your own application with the Azure Sentinel connector, perform the following steps:

1. Register the application with Azure AD and create a service principal. [Learn how](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).

1. Get credentials (for future authentication).

    In the registered application blade, get the application credentials for signing in:

    - **Client ID**: under **Overview**
    - **Client secret**: under **Certificates & secrets**.

1. Grant permissions to the Azure Sentinel workspace.

    In this step, the app will get permission to work with Azure Sentinel workspace.

    1. In the Azure Sentinel workspace, go to **Settings** -> **Workspace Settings** -> **Access control (IAM)**

    1. Select **Add role assignment**.

    1. Select the role you wish to assign to the application. For example, to allow the application to perform actions that will make changes in the Sentinel workspace, like updating an incident, select the **Azure Sentinel Contributor** role. For actions which only read data, the **Azure Sentinel Reader** role is sufficient. [Learn more about the available roles in Azure Sentinel](./roles.md).

    1. Find the required application and save. By default, Azure AD applications aren't displayed in the available options. To find your application, search for the name and select it.

1. Authenticate

    In this step we use the app credentials to authenticate to the Sentinel connector in Logic Apps.

    - Select **Connect with Service Principal**.

        ![Service principal option](media/authenticate-playbooks-to-sentinel/auth-methods-spn-choice.png)

    - Fill in the required parameters (can be found in the registered application blade)
        - **Tenant**: under **Overview**
        - **Client ID**: under **Overview**
        - **Client Secret**: under **Certificates & secrets**
        
        ![Connect with service principal](media/authenticate-playbooks-to-sentinel/auth-methods-spn.png)

### Manage your API connections

Every time an authentication is created for the first time, a new Azure resource of type API Connection is created. The same API connection can be used in all the Azure Sentinel actions and triggers in the same Resource Group.

All the API connections can be found in the **API connections** blade (search for *API connections* in the Azure portal).

You can also find them by going to the **Resources** blade and filtering the display by type *API Connection*. This way allows you to select multiple connections for bulk operations.

In order to change the authorization of an existing connection, enter the connection resource, and select **Edit API connection**.

## Next steps

In this article, you learned about the different methods of authenticating a Logic Apps-based playbook to Azure Sentinel.
- Learn more about how to [use triggers and actions in playbooks](playbook-triggers-actions.md).
