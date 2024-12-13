---
title: Enable platform API catalog - Azure API Center - VS Code extension
description: Enable enterprise developers to view the enterprise's platform API catalog including API definitions using the Visual Studio Code Extension for Azure API Center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 09/27/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable an API catalog so that app developers in my organization can discover and consume the APIs in my organization's API center without needing to manage the API inventory itself.
---

# Enable and view Azure API Center platform API catalog 

This article shows how to provide enterprise developers access to the Azure API Center platform API catalog (preview) in the Visual Studio Code extension for [Azure API Center](overview.md). Using the platform API catalog, developers can discover APIs in your Azure API center, view API definitions, and optionally generate API clients when they don't have access to manage the API center itself or add APIs to the inventory. Access to the platform API catalog is managed using Microsoft Entra ID and Azure role-based access control.

> [!TIP]
> The Visual Studio Code extension provides more features for API developers who have permissions to manage an Azure API center. For example, API developers can register APIs in the API center directly or using CI/CD pipelines. [Learn more](build-register-apis-vscode-extension.md) 

## Prerequisites

### For API center administrators

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription, and permissions to grant access to data in your API center. 

### For app developers

* [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)

    > [!IMPORTANT]
    > Currently, access to the platform API catalog is available only in the extension's pre-release version. [!INCLUDE [vscode-extension-prerelease-features](includes/vscode-extension-prerelease-features.md)]
    
The following Visual Studio Code extension is optional:

* [Microsoft Kiota extension](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota) - to generate API clients

## Steps for API center administrators to enable access to catalog

The following sections provide steps for API center administrators to enable enterprise developers to access the platform API catalog.

### Create Microsoft Entra app registration

First, configure an app registration in your Microsoft Entra ID tenant. The app registration enables the Visual Studio Code extension for Azure API Center to access the platform API catalog on behalf of a signed-in user.

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID** > **App registrations**.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *platform-api-catalog*
    * Under **Supported account types**, select **Accounts in this organizational directory (Single tenant)**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and set the URI to the runtime URI of your API center. For example, `https://<service name>.data.<region>.azure-apicenter.ms`. Example: `https://contoso-apic.data.eastus.azure-apicenter.ms`.
    * Select **Register**.

    > [!TIP]
    > You can use the same app registration for access to more API centers. In **Redirect URI**, continue to add redirect URIs for other API centers that you want to appear in the platform API catalog.
1. On the **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**. You set these values later when you connect to the API center from the Visual Studio Code extension. 
1. In the left menu, under **Manage**, select **Authentication** > **+ Add a platform**.
1. On the **Configure platforms** page, select **Mobile and desktop applications**.
1. On the **Configure Desktop + devices** page, enter the following redirect URI and select **Configure**:

    `https://vscode.dev/redirect`
      
1. In the left menu, under **Manage**, select **API permissions** > **+ Add a permission**. 
1. On the **Request API permissions** page, do the following:
    1. Select the **APIs my organization uses** tab. 
    1. Search for and select **Azure API Center**. You can also search for and select application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`. 
    1. In **Select permissions** page, select **user_impersonation**.
    1. Select **Add permissions**. 

    The Azure API Center permissions appear under **Configured permissions**.

    :::image type="content" source="media/enable-platform-api-catalog-vscode-extension/configure-app-permissions.png" alt-text="Screenshot of required permissions in Microsoft Entra ID app registration in the portal." :::

### Enable sign-in to platform API catalog by Microsoft Entra users and groups 

Enterprise developers must sign in with a Microsoft account to see the platform API catalog for your API center. If needed, [add or invite developers](/entra/external-id/b2b-quickstart-add-guest-users-portal) to your Microsoft Entra tenant. 

Then, to enable sign-in, assign the **Azure API Center Data Reader** role to users or groups in your tenant, scoped to your API center.

> [!IMPORTANT]
> By default, you and other administrators of the API center don't have access to APIs in the API Center extension's platform API catalog. Be sure to assign the **Azure API Center Data Reader** role to yourself and other administrators.  

For detailed prerequisites and steps to assign a role to users and groups, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). Brief steps follow:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Access control (IAM)** > **+ Add role assignment**.
1. In the **Add role assignment** pane, set the values as follows:
    * On the **Role** page, search for and select **Azure API Center Data Reader**. Select **Next**.
    * On the **Members** page, In **Assign access to**, select **User, group, or service principal** > **+ Select members**.
    * On the **Select members** page, search for and select the users or groups to assign the role to. Click **Select** and then **Next**.
    * Review the role assignment, and select **Review + assign**.
1. Repeat the preceding steps to enable sign-in to the platform API catalog for more API centers.

> [!NOTE]
> To streamline access configuration for new users, we recommend that you assign the role to a Microsoft Entra group and configure a dynamic group membership rule. To learn more, see [Create or update a dynamic group in Microsoft Entra ID](/entra/identity/users/groups-create-rule).

## Steps for enterprise developers to access the platform API catalog 

Developers can follow these steps to connect and sign in to view a platform API catalog using the Visual Studio Code extension. Settings to connect to the API center need to be provided by the API center administrator.

### Connect to an API center

1. Install the pre-release version of the [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center) for Visual Studio Code. 

1. In Visual Studio Code, in the Activity Bar on the left, select API Center.

    :::image type="content" source="media/enable-platform-api-catalog-vscode-extension/api-center-activity-bar.png" alt-text="Screenshot of the API Center icon in the Activity Bar.":::

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Connect to an API Center** and hit **Enter**.
1. Answer the prompts to input the following information:
    1. The runtime URL of your API center, in the format `<service name>.data.<region>.azure-apicenter.ms` (don't prefix with `https://`). Example: `contoso-apic.data.eastus.azure-apicenter.ms`. This runtime URL appears on the **Overview** page of the API center in the Azure portal.
    1. The application (client) ID from the app registration configured by the administrator in the previous section.
    1. The directory (tenant) ID from the app registration configured by the administrator in the previous section.

    > [!TIP]
    > An API center administrator needs to provide these connection details to developers, or provide a direct link in the following format:  
    > `vscode://apidev.azure-api-center?clientId=<Client ID>&tenantId=<tenant ID>&runtimeUrl=<service-name>.data.<region>.azure-apicenter.ms`

    After you connect to the API center, the name of the API center appears in the API Center platform API catalog. 

1. To view the APIs in the API center, under the API center name, select **Sign in to Azure**. Sign-in is allowed with a Microsoft account that is assigned the **Azure API Center Data Reader** role in the API center. 

    :::image type="content" source="media/enable-platform-api-catalog-vscode-extension/api-center-pane-initial.png" alt-text="Screenshot of API Center platform API catalog in VS Code extension." :::

1. After signing in, select **APIs** to list the APIs in the API center. Expand an API to explore its versions and definitions.

    :::image type="content" source="media/enable-platform-api-catalog-vscode-extension/api-center-pane-apis.png" alt-text="Screenshot of API Center platform API catalog with APIs in VS Code extension." :::

1. Repeat the preceding steps to connect to more API centers, if access is configured.

### Discover and consume APIs in the catalog

The platform API catalog helps enterprise developers discover API details and start API client development. Developers can access the following features by right-clicking on an API definition in the platform API catalog:

* **Export API specification document** - Export an API specification from a definition and then download it as a file
* **Generate API client** - Use the Microsoft Kiota extension to generate an API client for their favorite language
* **Generate Markdown** - Generate API documentation in Markdown format
* **OpenAPI documentation** - View the documentation for an API definition and try operations in a Swagger UI (only available for OpenAPI definitions)


## Troubleshooting

### Error: Cannot read properties of undefined (reading 'nextLink')

Under certain conditions, a user might encounter the following error message after signing into the API Center platform API catalog and expanding the APIs list for an API center:

`Error: Cannot read properties of undefined (reading 'nextLink')`

Check that the user is assigned the **Azure API Center Data Reader** role in the API center. If necessary, reassign the role to the user. Then, refresh the API Center platform API catalog in the Visual Studio Code extension.

### Unable to sign in to Azure

If users who have been assigned the **Azure API Center Data Reader** role can't complete the sign-in flow after selecting **Sign in to Azure** in the platform API catalog, there might be a problem with the configuration of the connection.

Check the settings in the app registration you configured in Microsoft Entra ID. Confirm the values of the application (client) ID and the directory (tenant) ID in the app registration and the runtime URL of the API center. Then, set up the connection to the API center again.

### Unable to select Azure API Center permissions in Microsoft Entra ID app registration

If you're unable to request API permissions to Azure API Center in your Microsoft Entra app registration for the API Center portal, check that you are searching for **Azure API Center** (or application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`). 

If the app isn't present, there might be a problem with the registration of the **Microsoft.ApiCenter** resource provider in your subscription. You might need to re-register the resource provider. To do this, run the following command in the Azure CLI:

```azurecli
az provider register --namespace Microsoft.ApiCenter
```

After re-registering the resource provider, try again to request API permissions.


## Related content

* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Best practices for Azure RBAC](../role-based-access-control/best-practices.md)
* [Register a resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider)
