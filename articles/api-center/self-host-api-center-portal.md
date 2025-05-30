---
title: Self-host the API Center portal
description: How to self-host the API Center portal, a customer-managed website that enables discovery of the API inventory in your Azure API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 03/04/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to self-host a portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Self-host your API Center portal

This article shows how to self-host the *API Center portal*, a website that developers and other stakeholders in your organization can use to discover the APIs in your [API center](overview.md). Deploy a reference implementation of the portal from the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository.

:::image type="content" source="media/self-host-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::

> [!TIP]
> New! You can now set up an Azure-managed version of the API Center portal. For more information, see [Set up the API Center portal](set-up-api-center-portal.md).

## About self-hosting the portal

You can build and deploy a reference implementation of the portal using code in the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository. The portal uses the [Azure API Center data plane API](/rest/api/dataplane/apicenter/operation-groups) to retrieve data from your API center. 

The API Center portal reference implementation provides:

* A framework for publishing and maintaining a customer-managed API portal using GitHub Actions
* A portal platform that customers can modify or extend to meet their needs
* Flexibility to host on different infrastructures, including deployment to services such as Azure Static Web Apps.  

> [!NOTE]
> When you self-host the API Center portal, you become its maintainer and you're responsible for its upgrades. Azure support is limited.

[!INCLUDE [api-center-portal-prerequisites](includes/api-center-portal-prerequisites.md)]

* To build and deploy the portal, you need a GitHub account and the following tools installed on your local machine:

    * [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    * [Vite package](https://www.npmjs.com/package/vite)

## Create Microsoft Entra app registration

[!INCLUDE [api-center-portal-app-registration](includes/api-center-portal-app-registration.md)]

> [!NOTE]
> When you're self-hosting the portal and want to test it locally before deploying to Azure, set the redirect URI in the app registration to `https://localhost:5173`. 

## Configure local environment

Follow these steps to build and test the API Center portal locally.

1. Clone the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository to your local machine.

    ```bash
    git clone https://github.com/Azure/APICenter-Portal-Starter.git
    ```
1. Change to the `APICenter-Portal-Starter` directory.

    ```bash
    cd APICenter-Portal-Starter
    ```
1. Check out the main branch.

    ```bash
    git checkout main
    ```  
1. To configure the service, copy or rename the `public/config.example` file to `public/config.json`.
1. Then edit the `public/config.json` file to point to your service. Update the values in the file as follows:
    1. Replace `<service name>` and `<location>` with the name of your API center and the location where it's deployed
    1. Replace `<client ID>` and `<tenant ID>` with the **Application (client) ID** and **Directory (tenant) ID** of the app registration you created in the previous section.
    1. Update the value of `title` to a name that you want to appear in the top bar of the portal.

    ```json
    {
      "dataApiHostName": "<service name>.data.<location>.azure-apicenter.ms/workspaces/default",
      "title": "API portal",
      "authentication": {
          "clientId": "<client ID>",
          "tenantId": "<tenant ID>",
          "scopes": ["https://azure-apicenter.net/user_impersonation"],
          "authority": "https://login.microsoftonline.com/"
      }
    }
    ```

1. Install required packages.

    ```bash
    npm install
    ```

1. Start the development server. The following command starts the portal in development mode running locally:

    ```bash
    npm start
    ```

    Browse to the portal at `https://localhost:5173`.

## Deploy to Azure

For steps to deploy the portal to Azure Static Web Apps, see the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository.

## Enable sign-in to portal by Microsoft Entra users and groups 


[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]

## Troubleshooting

### Error: "You are not authorized to access this portal"

Under certain conditions, a user might encounter the following error message after signing into the API Center portal with a configured user account:

`You are not authorized to access this portal. Please contact your portal administrator for assistance.`
`

First, confirm that the user is assigned the **Azure API Center Data Reader** role in your API center.

If the user is assigned the role, there might be a problem with the registration of the **Microsoft.ApiCenter** resource provider in your subscription, and you might need to re-register the resource provider. To do this, run the following command in the Azure CLI:

```azurecli
az provider register --namespace Microsoft.ApiCenter
```

### Unable to sign in to portal

If users who have been assigned the **Azure API Center Data Reader** role can't complete the sign-in flow after selecting **Sign in** in the API Center portal, there might be a problem with the configuration of the Microsoft Entra ID identity provider.

In the Microsoft Entra app registration, review and, if needed, update the **Redirect URI** settings to ensure that the URI matches the URI of the API Center portal deployment.

### Unable to select Azure API Center permissions in Microsoft Entra app registration

If you're unable to request API permissions to Azure API Center in your Microsoft Entra app registration for the API Center portal, check that you are searching for **Azure API Center** (or application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`). 

If the app isn't present, there might be a problem with the registration of the **Microsoft.ApiCenter** resource provider in your subscription. You might need to re-register the resource provider. To do this, run the following command in the Azure CLI:

```azurecli
az provider register --namespace Microsoft.ApiCenter
```

After re-registering the resource provider, try again to request API permissions.

## Support policy

Provide feedback, request features, and get support for the API Center portal reference implementation in the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository.

## Related content

* [Set up the API Center portal](set-up-api-center-portal.md)
* [What is Azure role-based access control (RBAC)?](../role-based-access-control/overview.md)
* [Best practices for Azure RBAC](../role-based-access-control/best-practices.md)
* [Register a resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider)
