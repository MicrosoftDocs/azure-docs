---
title: Set up data access control for Split Experimentation Workspace (preview)
description: This article provides information about setting up data access control for Split Experimentation Workspace (preview).
ms.author: malev
author: maud-lv
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/01/2024
---

# Set up data access control for Split Experimentation Workspace (preview)

Split Experimentation in Azure App Configuration (preview) uses Microsoft Entra to authorize requests for Split Experimentation Workspace resources. Microsoft Entra also enables the use of custom roles to grant permissions to security principals.

## Data access control overview

All requests made to Split Experimentation Workspace must be authorized. To set up an access control policy, create a new Microsoft Entra Application registration or use an existing one. The registered application provides the authentication policy, security principles, role definitions, etc., for allowing access to Split Experimentation Workspace.

Optionally, a single Microsoft Entra Enterprise Application may be used to control access to multiple Split Experimentation workspaces.

To set up the Access Control policy for Split Experimentation Workspace, a control plane operation is needed. Split Experimentation only requires the application ID to set up the access policy. The said Entra application is owned and fully controlled by the customer. The application must be in the same Microsoft Entra tenant, in which the Split Experimentation Workspace resource is provisioned or considered to be provisioned.

With Microsoft Entra, access to a resource is set up in a two-step process:

1. The security principal's identity is authenticated, and an OAuth 2.0 token is issued. The resource name used to request a token is `https://login.microsoftonline.com/<tenantID>`, where `<tenantID>` matches the Microsoft Entra tenant ID to which the service principal belongs. Ensure the scope is `api://{Entra application ID>/.default`, where `<Entra application ID>` matches the application ID linked as access policy to the Split Experimentation Workspace resource.
1. The token is passed as part of a request to the App Configuration service to authorize access to the specified resource.

### Register an application

Register a new app or use an existing Microsoft Entra application registration to run your experimentation.

To register a new app:

1. Go to **Identity** > **Applications** > **App registrations**.

    :::image type="content" source="media/data-access/app-registration.png" alt-text="Screenshot of the Microsoft Entra admin center showing the App registrations page.":::

1. Enter a **Name** for your app, and under **Supported account types**, select **Accounts in this organizational directory only**.

> [!NOTE]
> The application must be in the same Microsoft Entra tenant in which the Split Experimentation Workspace is provisioned or considered to be provisioned. Only a basic registration is needed at this point. Read more on this topic at [Register an application](/entra/identity-platform/quickstart-register-app).

### Enable Entra application to be used as audience

Configure the application ID URI to allow the Entra application to be used as global audience/scope when requesting an authentication token.

1. Open your app in the Azure portal and under **Overview**, get the **Application ID URI**.

    :::image type="content" source="media/data-access/get-application-id-uri.png" alt-text="Screenshot of the app in the Azure portal.":::

1. Back in the Microsoft Entra admin center, in **Identity** > **Applications** > **App registrations**, open your application by selecting its **Display name**.
1. In the pane that opens, select **Expose an API** and Ensure the **Application ID URI** value is: `api://<Entra application ID>` where `Entra application ID` must be the same Microsoft Entra application ID.

    :::image type="content" source="media/data-access/app-registration.png" alt-text="Screenshot of the Microsoft Entra admin center showing the App registrations page.":::

### Allow users to request access to Split Experimentation from Azure portal

The Azure portal user interface is effectively the UX for Split Experimentation Workspace. It interacts with the Split Experimentation data plane to set up Metrics, Create/Update/Archive/Delete experiments, Get experiment results, etc.

You must preauthorize the Azure portal Split UI to achieve that.

#### Add scope

In the Microsoft Entra admin center, go to your app and open the **Expose an API** left menu, then select **Add a Scope**.

:::image type="content" source="media/data-access/add-scope.png" alt-text="Screenshot of the Microsoft Entra admin center showing how to add a scope.":::

1. Under **Who can consent?**, select **Admins and users**.
1. Enter an **Admin consent display name** and an **Admin consent description**.

#### Authorize Split Experimentation Resource Provider ID

1. Staying in the **Expose an API** menu, scroll down to **Authorized client applications** > **Add a client application** and enter the Client ID corresponding to the Split Experimentation Resource Provider ID: *d3e90440-4ec9-4e8b-878b-c89e889e9fbc*.

    :::image type="content" source="media/data-access/add-split-resource-provider-id.png" alt-text="Screenshot of the Microsoft Entra admin center showing how to authorize the Split Experimentation Resource Provider ID.":::

1. Select **Add application**.

#### Add authorization roles

Split Experimentation workspace supports well-known roles to scope access control. Add the following roles in the Entra application.

1. Go to the **App roles** menu and select **Create app role**.
1. Select or enter the following information in the pane that opens to create a first role:

    - **Display name**: enter *ExperimentationDataOwner*
    - **Allowed member types**: select **Both (Users/Groups + Applications)**
    - **Value** enter **ExperimentationDataOwner**
    - **Description**: enter *Read-write access to Experimentation Workspace*
    - **Do you want to enable this app role?**: Check this box.

    :::image type="content" source="media/data-access/create-app-role.png" alt-text="Screenshot of the Microsoft Entra admin center showing how to create an app role.":::

1. Create a second role:

    - **Display name**: enter *ExperimentationDataReader*
    - **Allowed member types**: select **Both (Users/Groups + Applications)**
    - **Value** enter **ExperimentationDataReader**
    - **Description**: enter *Read-only access to Experimentation Workspace*
    - **Do you want to enable this app role?**: Check this box.

### Configure user and role assignments

#### Choose an assignment requirement option

1. Go to the **Overview** menu and select the link under to **Managed application in local directory**
1. Open **Manage** > **Properties** and select your preferred option for the **Assignment required** setting.
    - **Yes**: means that only the entries explicitly defined under **Users and Groups** in the enterprise application can obtain a token and therefore access the associated Split Experimentation Workspace. This is the recommended option.
    - **No**: means that everyone in the same Entra tenant can obtain tokens and therefore may be allowed, via the Split Experimentation control plane opt-in setting, to access the associated Split Experimentation Workspace.

    :::image type="content" source="media/data-access/assignment-required.png" alt-text="Screenshot of the Microsoft Entra admin center showing how to require an assignment.":::

#### Assign users and groups

1. Go to the **Users and groups** menu and select **Add user/group**

    :::image type="content" source="media/data-access/assign-users.png" alt-text="Screenshot of the Microsoft Entra admin center showing how to assign roles to users.":::
1. Select a user or a group and select one of the roles you created for the Split Experimentation Workspace. 

## Related content

- Learn about [troubleshooting Split Experimentation Workspace](troubleshoot.md).
