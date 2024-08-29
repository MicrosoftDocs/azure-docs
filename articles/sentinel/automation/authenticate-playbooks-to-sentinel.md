---
title: Authenticate playbooks to Microsoft Sentinel | Microsoft Docs
description: Learn how to give your playbooks access to Microsoft Sentinel and authorization to take remedial actions.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a SOC engineer, I want to understand my options when authenticating from playbooks to Microsoft Sentinel.
---

# Authenticate playbooks to Microsoft Sentinel

Microsoft Sentinel playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise.

Azure Logic Apps must connect separately and authenticate independently to each resource, of each type, that it interacts with, including to Microsoft Sentinel itself. Logic Apps uses [specialized connectors](/connectors/connector-reference/) for this purpose, with each resource type having its own connector.

This article describes the types of connections and authentication supported for the Logic Apps [Microsoft Sentinel connector](/connectors/azuresentinel/). Playbooks can use supported authentication methods to interact with Microsoft Sentinel and access your Microsoft Sentinel data.

## Prerequisites

We recommend that you read the following articles before this one:

- [Automate threat response with Microsoft Sentinel playbooks](automate-responses-with-playbooks.md)
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md)
- [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md)


To give a managed identity access to other resources, like your Microsoft Sentinel workspace, your signed-in user must have a role with permissions to write role assignments, such as **Owner** or **User Access Administrator** of the Microsoft Sentinel workspace.

## Authentication

The Microsoft Sentinel connector in Logic Apps, and its component triggers and actions, can operate on behalf of any identity that has the necessary permissions (read and/or write) on the relevant workspace. The connector supports multiple identity types:

- [Managed identity (Preview)](#authenticate-with-a-managed-identity). For example, use this method to lower the number of identities you need to manage.
- [Service principal (Microsoft Entra application)](#authenticate-as-a-service-principal-azure-ad-application). Registered applications provide an enhanced ability to control permissions, manage credentials, and enable certain limitations on the use of the connector.
- [Microsoft Entra user](#authenticate-as-an-azure-ad-user)

### Permissions required

Regardless of the authentication method, the following permissions are required by the authenticated identity to use various components of the Microsoft Sentinel connector. "Write" actions include actions like such as updating incidents or adding a comment.

| Roles | Use triggers | Use "Read" actions | Use "Write" actions|
| ------------- | :-----------: | :------------: | :-----------: |
| **[Microsoft Sentinel Reader](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader)** | &#10003; | &#10003; | **-** |
| **Microsoft Sentinel [Responder](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder)/[Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor)** | &#10003; | &#10003; | &#10003; |

For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md) and [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

<a name='authenticate-as-an-azure-ad-user'></a>


## Authenticate with a managed identity

Authenticating as a managed identity allows you to give permissions directly to the playbook, which is a Logic App workflow resource. Microsoft Sentinel connector actions taken by the playbook then operate on the playbook's behalf, as if it were an independent object with its own permissions on Microsoft Sentinel.

**To authenticate with a managed identity**:

1. Enable managed identity on the Logic Apps workflow resource. For more information, see [Enable system assigned identity in the Azure portal](/azure/logic-apps/create-managed-service-identity#enable-system-assigned-identity-in-azure-portal).

    Your logic app can now use the system-assigned identity, which is registered with Microsoft Entra ID and is represented by an object ID.

1. Use the following steps to grant that identity with access to your Microsoft Sentinel workspace:

    1. From the Microsoft Sentinel menu, select **Settings**.
    1. Select the **Workspace settings** tab. From the workspace menu, select **Access control (IAM)**.
    1. From the button bar at the top, select **Add** and choose **Add role assignment**. If the **Add role assignment** option is disabled, you don't have permissions to assign roles.
    1. In the new panel that appears, assign the appropriate role:

        - [**Microsoft Sentinel Responder**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder):  Playbook has steps that update incidents or watchlists
        - [**Microsoft Sentinel Reader**](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader):  Playbook only receives incidents

    1. Under **Assign access to**, select **Logic App**.
    1. Select the subscription the playbook belongs to, and then select the playbook name.
    1. Select **Save**.

    For more information, see [Give identity access to resources](/azure/logic-apps/create-managed-service-identity#give-identity-access-to-resources).

1. Enable the managed identity authentication method in the Microsoft Sentinel Logic Apps connector:

    1. In the Logic Apps designer, add a Microsoft Sentinel Logic Apps connector step. If the connector is already enabled for an existing connection, select the **Change connection** link. For example:

        ![Screenshot of the Change connection link.](../media/authenticate-playbooks-to-sentinel/change-connection.png)

    1. In the resulting list of connections, select **Add new**.

    1. Create a new connection by selecting **Connect with managed identity (preview)**. For example:

        ![Screenshot of the Connect with managed identity option.](../media/authenticate-playbooks-to-sentinel/auth-methods-msi-choice.png)

    1. Enter a name for this connection, select **System-assigned managed identity**, and then select **Create**.

        ![Screenshot of the Connect with managed identity link.](../media/authenticate-playbooks-to-sentinel/auth-methods-msi.png)

    1. Select **Create** to finish creating your connection.


<a name='authenticate-as-a-service-principal-azure-ad-application'></a>

## Authenticate as a service principal (Microsoft Entra application)

Create a service principal by registering a Microsoft Entra application. We recommend that you use a registered application as the connector's identity instead of a user account. 

**To use your own application with the Microsoft Sentinel connector**:

1. Register the application with Microsoft Entra ID and create a service principal. For more information, see [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal).

1. Get credentials for future authentication. In the registered application page, get the application credentials for signing in:

    - **Client ID**, under **Overview**
    - **Client secret**, under **Certificates & secrets**

1. Grant the app with permissions to work with the Microsoft Sentinel workspace:

    1. In the Microsoft Sentinel workspace, go to **Settings** > **Workspace Settings** > **Access control (IAM)**

    1. Select **Add role assignment**, and then select the role you wish to assign to the application. 

        For example, to allow the application to perform actions that make changes in the Microsoft Sentinel workspace, like updating an incident, select the **Microsoft Sentinel Contributor** role. For actions that only read data, the **Microsoft Sentinel Reader** role is sufficient.

    1. Find the required application and save your changes.

        By default, Microsoft Entra applications aren't displayed in the available options. To find your application, search for the name and select it.

1. Use the app credentials to authenticate to the Microsoft Sentinel connector in Logic Apps.

    1. In the Logic Apps designer, add a Microsoft Sentinel Logic Apps connector step. 

    1. If the connector is already enabled for an existing connection, select the **Change connection** link. For example:

        ![Screenshot of the Change connection link.](../media/authenticate-playbooks-to-sentinel/change-connection.png)

    1. In the resulting list of connections, select **Add new**, and then select **Connect with Service Principal**. For example:

        ![Screenshot of the Service principal option selected.](../media/authenticate-playbooks-to-sentinel/auth-methods-spn-choice.png)

    1. Enter the required parameter values, which are available in the registered application's details page:

        - **Tenant**: under **Overview**
        - **Client ID**: under **Overview**
        - **Client Secret**: under **Certificates & secrets**

        For example:

        ![Screenshot of the Connect with service principal parameters.](../media/authenticate-playbooks-to-sentinel/auth-methods-spn.png)

    1. Select **Create** to finish creating your connection.

## Authenticate as a Microsoft Entra user

To make a connection as a Microsoft Entra user:

1. In the Logic Apps designer, add a Microsoft Sentinel Logic Apps connector step. If the connector is already enabled for an existing connection, select the **Change connection** link. For example:

    ![Screenshot of the Change connection link.](../media/authenticate-playbooks-to-sentinel/change-connection.png)

1. In the resulting list of connections, select **Add new**, and then select **Sign in**.

    :::image type="content" source="../media/authenticate-playbooks-to-sentinel/auth-methods-sign-in.png" alt-text="Screenshot of the Sign in button selected."

1. Enter your credentials when prompted, and then follow the remaining instructions on the screen to create a connection.

## View and edit playbook API connections

API connections are used to connect Azure Logic Apps to other services, including Microsoft Sentinel. Each time a new authentication is made for a connector in Azure Logic Apps, a new **API connection** resource is created, containing the details provided when configuring access to the service. The same API connection can be used in all the Microsoft Sentinel actions and triggers in the same Resource Group.

**To view API connections**, do one of the following:

- In the Azure portal, search for *API connections*. Locate the API connection for your playbook using the following data:

    - **Display name**: The friendly name you give the connection every time you create one. 
    - **Status**: The API connection's status.
    - **Resource group**: API connections for Microsoft playbooks are created in the playbook (Azure Logic Apps) resource's resource group.

- In the Azure portal, view all resources and filter the view by **Type** = **API connector**. This method allows you to select, tag, and delete multiple connections at once.

**To change the authorization of an existing connection**, enter the connection resource, and select **Edit API connection**.

## Related content

For more information, see:

- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)
