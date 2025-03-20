---
title: Enable platform API Center portal - Azure API Center - VS Code extension
description: Enable enterprise developers to view the enterprise's API Center portal including API definitions using the Visual Studio Code Extension for Azure API Center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 03/20/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable an API catalog so that app developers in my organization can discover and consume the APIs in my organization's API center without needing to manage the API inventory itself.
---

# Enable and view Azure API Center portal - VS Code extension

[!INCLUDE [api-center-availability-all-tiers](../includes/api-center-availability-all-tiers.md)]

This article shows how to provide enterprise developers access to the Azure API Center portal in the Visual Studio Code extension for [Azure API Center](overview.md). Using the portal, developers can discover APIs in your Azure API center, view API definitions, and optionally generate API clients when they don't have access to manage the API center itself or add APIs to the inventory. Access to the API Center portal is managed using Microsoft Entra ID and Azure role-based access control.

> [!TIP]
> The Visual Studio Code extension provides more features for API developers who have permissions to manage an Azure API center. For example, API developers can register APIs in the API center directly or using CI/CD pipelines. [Learn more](build-register-apis-vscode-extension.md) 

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription, and permissions to grant access to data in your API center. 

### For app developers

* [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center)

    
The following Visual Studio Code extension is optional:

* [Microsoft Kiota extension](https://marketplace.visualstudio.com/items?itemName=ms-graph.kiota) - to generate API clients

## Steps for API center administrators to enable access to API Center portal

The following sections provide steps for API center administrators to enable enterprise developers to access the API Center portal.

### Create Microsoft Entra app registration

[!INCLUDE [api-center-portal-app-registration](includes/api-center-portal-app-registration.md)]

### Enable sign-in to API Center portal by Microsoft Entra users and groups 

Enterprise developers must sign in with a Microsoft account to see the API Center portal for your API center. If needed, [add or invite developers](/entra/external-id/b2b-quickstart-add-guest-users-portal) to your Microsoft Entra tenant. 

[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]
### For API center administrators
## Steps for enterprise developers to access the API Center portal 

Developers can follow these steps to connect and sign in to view a API Center portal using the Visual Studio Code extension. Settings to connect to the API center need to be provided by the API center administrator.

### Connect to an API center

1. Install the pre-release version of the [Azure API Center extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=apidev.azure-api-center) for Visual Studio Code. 

1. In Visual Studio Code, in the Activity Bar on the left, select API Center.

    :::image type="content" source="media/enable-api-center-portal-vscode-extension/api-center-activity-bar.png" alt-text="Screenshot of the API Center icon in the Activity Bar.":::

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Connect to an API Center** and hit **Enter**.
1. Answer the prompts to input the following information:
    1. The runtime URL of your API center, in the format `<service name>.data.<region>.azure-apicenter.ms` (don't prefix with `https://`). Example: `contoso-apic.data.eastus.azure-apicenter.ms`. This runtime URL appears on the **Overview** page of the API center in the Azure portal.
    1. The application (client) ID from the app registration configured by the administrator in the previous section.
    1. The directory (tenant) ID from the app registration configured by the administrator in the previous section.

    > [!TIP]
    > An API center administrator needs to provide these connection details to developers, or provide a direct link in the following format:  
    > `vscode://apidev.azure-api-center?clientId=<Client ID>&tenantId=<tenant ID>&runtimeUrl=<service-name>.data.<region>.azure-apicenter.ms`

    After you connect to the API center, the name of the API center appears in the API Center portal. 

1. To view the APIs in the API center, under the API center name, select **Sign in to Azure**. Sign-in is allowed with a Microsoft account that is assigned the **Azure API Center Data Reader** role in the API center. 

    :::image type="content" source="media/enable-api-center-portal-vscode-extension/api-center-pane-initial.png" alt-text="Screenshot of API Center portal in VS Code extension." :::

1. After signing in, select **APIs** to list the APIs in the API center. Expand an API to explore its versions and definitions.

    :::image type="content" source="media/enable-api-center-portal-vscode-extension/api-center-pane-apis.png" alt-text="Screenshot of API Center portal with APIs in VS Code extension." :::

1. Repeat the preceding steps to connect to more API centers, if access is configured.

### Discover and consume APIs in the API Center portal

The API Center portal helps enterprise developers discover API details and start API client development. Developers can access the following features by right-clicking on an API definition in the API Center portal:

* **Export API specification document** - Export an API specification from a definition and then download it as a file
* **Generate API client** - Use the Microsoft Kiota extension to generate an API client for their favorite language
* **Generate Markdown** - Generate API documentation in Markdown format
* **OpenAPI documentation** - View the documentation for an API definition and try operations in a Swagger UI (only available for OpenAPI definitions)


## Troubleshooting

### Error: Cannot read properties of undefined (reading 'nextLink')

Under certain conditions, a user might encounter the following error message after signing into the API Center portal and expanding the APIs list for an API center:

`Error: Cannot read properties of undefined (reading 'nextLink')`

Check that the user is assigned the **Azure API Center Data Reader** role in the API center. If necessary, reassign the role to the user. Then, refresh the API Center portal in the Visual Studio Code extension.

### Unable to sign in to Azure

If users who have been assigned the **Azure API Center Data Reader** role can't complete the sign-in flow after selecting **Sign in to Azure** in the API Center portal, there might be a problem with the configuration of the connection.

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
