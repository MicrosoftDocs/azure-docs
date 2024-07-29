---
title: Self-host the API Center portal
description: How to self-host the API Center portal, a customer-managed website that enables discovery of the API inventory in your Azure API center.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 04/29/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable a portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Self-host your API Center portal

This article introduces the *API Center portal*, a website that developers and other stakeholders in your organization can use to discover the APIs in your [API center](overview.md). Deploy a reference implementation of the portal from the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository.

:::image type="content" source="media/enable-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::


## About the API Center portal

The API Center portal is a website that you can build and host to display the API inventory in your API center. The portal enables developers and other stakeholders in your organization to discover APIs and view API details. 

You can build and deploy a reference implementation of the portal using code in the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository. The portal uses the [Azure API Center data plane API](/rest/api/dataplane/apicenter/operation-groups) to retrieve data from your API center. User access to API information is based on Azure role-based access control.

The API Center portal reference implementation provides:

* A framework for publishing and maintaining a customer-managed API portal using GitHub Actions
* A portal platform that customers can modify or extend to meet their needs
* Flexibility to host on different infrastructures, including deployment to services such as Azure Static Web Apps.  

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription, and permissions to grant access to data in your API center. 

* To build and deploy the portal, you need a GitHub account and the following tools installed on your local machine:

    * [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    * [Vite package](https://www.npmjs.com/package/vite)

## Create Microsoft Entra app registration

First configure an app registration in your Microsoft Entra ID tenant. The app registration enables the API Center portal to access data from your API center on behalf of a signed-in user.

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID** > **App registrations**.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *api-center-portal*
    * Under **Supported account types**, select **Accounts in this organizational directory (Single tenant)**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and set the URI.

        * For local testing, set the URI to `https://localhost:5173`. 
        * For production, set the URI to the URI of your API Center portal deployment.
    * Select **Register**.
1. On the **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**. You set these values when you build the portal.
      
1. On the **API permissions** page, select **+ Add a permission**. 
    1. On the **Request API permissions** page, select the **APIs my organization uses** tab. Search for and select **Azure API Center**. You can also search for and select application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`. 
    1. On the **Request permissions** page, select **user_impersonation**.
    1. Select **Add permissions**. 

    The Azure API Center permissions appear under **Configured permissions**.

    :::image type="content" source="media/enable-api-center-portal/configure-app-permissions.png" alt-text="Screenshot of required permissions in Microsoft Entra ID app registration in the portal." lightbox="media/enable-api-center-portal/configure-app-permissions.png":::

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
    * Replace `<service name>` and `<region>` with the name of your API center and the region where it's deployed
    * Replace `<client ID>` and `<tenant ID>` with the **Application (client) ID** and **Directory (tenant) ID** of the app registration you created in the previous section.
    * Update the value of `title` to a name that you want to appear on the portal.

    ```json
    {
      "dataApiHostName": "<service name>.data.<region>.azure-apicenter.ms/workspaces/default",
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

1. Start the development server. The following command will start the portal in development mode running locally:

    ```bash
    npm start
    ```

    Browse to the portal at `https://localhost:5173`.

## Deploy to Azure

For steps to deploy the portal to Azure Static Web Apps, see the [API Center portal starter](https://github.com/Azure/APICenter-Portal-Starter.git) repository.


## Enable sign-in to portal by Microsoft Entra users and groups 

Users must sign in to see the APIs in your API center. To enable sign-in, assign the **Azure API Center Data Reader** role to users or groups in your organization, scoped to your API center.

> [!IMPORTANT]
> By default, you and other administrators of the API center don't have access to APIs in the API Center portal. Be sure to assign the **Azure API Center Data Reader** role to yourself and other administrators.  

For detailed prerequisites and steps to assign a role to users and groups, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). Brief steps follow:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Access control (IAM)** > **+ Add role assignment**.
1. In the **Add role assignment** pane, set the values as follows:
    * On the **Role** page, search for and select **Azure API Center Data Reader**. Select **Next**.
    * On the **Members** page, In **Assign access to**, select **User, group, or service principal** > **+ Select members**.
    * On the **Select members** page, search for and select the users or groups to assign the role to. Click **Select** and then **Next**.
    * Review the role assignment, and select **Review + assign**.

> [!NOTE]
> To streamline access configuration for new users, we recommend that you assign the role to a Microsoft Entra group and configure a dynamic group membership rule. To learn more, see [Create or update a dynamic group in Microsoft Entra ID](/entra/identity/users/groups-create-rule).

After you configure access to the portal, configured users can sign in to the portal and view the APIs in your API center.

> [!NOTE]
> The first user to sign in to the portal is prompted to consent to the permissions requested by the API Center portal app registration. Thereafter, other configured users aren't prompted to consent.

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

* [What is Azure role-based access control (RBAC)?](../role-based-access-control/overview.md)
* [Best practices for Azure RBAC](../role-based-access-control/best-practices.md)
* [Register a resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider)
