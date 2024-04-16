---
title: Enable API Center portal - Azure API Center
description: Enable the API Center portal, an automatically generated website that enables discovery of your API inventory.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 03/18/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable a portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Enable your API Center portal

This article shows how to enable your *API Center portal*, an automatically generated website that developers and other stakeholders in your organization can use to discover the APIs in your [API center](overview.md). The portal is hosted by Azure at a unique URL and restricts user access based on Azure role-based access control.

> [!IMPORTANT]
> The Azure-hosted API Center portal is experimental and will be removed from API Center in an upcoming release. You will have an option to self-host an API Center portal for API discovery in an upcoming release.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]




## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription, and permissions to grant access to data in your API center. 

## Create Microsoft Entra app registration

First configure an app registration in your Microsoft Entra ID tenant. The app registration enables the API Center portal to access data from your API center on behalf of a signed-in user.

1. In the [Azure portal](https://portal.azure.com), navigate to **Microsoft Entra ID** > **App registrations**.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *api-center-portal*
    * Under **Supported account types**, select **Accounts in this organizational directory (Single tenant)**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and enter the following URI, substituting your API center name and region where indicated:

        `https://<api-center-name>.portal.<region>.azure-apicenter.ms`

        Example: `https://contoso.portal.westeurope.azure-apicenter.ms`

    * Select **Register**.
1. On the **Overview** page, copy the **Application (client) ID**. You use this value when you configure the identity provider for the portal in your API center.
      
1. On the **API permissions** page, select **+ Add a permission**. 
    1. On the **Request API permissions** page, select the **APIs my organization uses** tab. Search for and select **Azure API Center**. You can also search for and select application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`. 
    1. On the **Request permissions** page, select **user_impersonation**.
    1. Select **Add permissions**. 

    The Azure API Center permissions appear under **Configured permissions**.

    :::image type="content" source="media/enable-api-center-portal/configure-app-permissions.png" alt-text="Screenshot of required permissions in Microsoft Entra ID app registration in the portal." lightbox="media/enable-api-center-portal/configure-app-permissions.png":::


## Configure Microsoft Entra ID provider for API Center portal

In your API center, configure the Microsoft Entra ID identity provider for the API Center portal.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **API Center portal**, select **Portal settings**.
1. Select **Identity provider** > **Start set up**.
1. On the **Set up user sign-in with Microsoft Entra ID** page, in **Client ID**, enter the **Application (client) ID** of the app registration that you created in the previous section.

    :::image type="content" source="media/enable-api-center-portal/set-up-sign-in-portal.png" alt-text="Screenshot of the Microsoft Entra ID provider settings in the API Center portal." lightbox="media/enable-api-center-portal/set-up-sign-in-portal.png":::

1. Select **Save + publish**. The Microsoft Entra ID provider appears on the **Identity provider** page.

1. To view the API Center portal, on the **Portal settings** page, select **View API Center portal**.

The portal is published at the following URL that you can share with developers in your organization: `https://<api-center-name>.<region>.azure-apicenter.ms`.

:::image type="content" source="media/enable-api-center-portal/api-center-portal-home.png" alt-text="Screenshot of the API Center portal home page.":::

## Customize portal name

By default, the name that appears on the upper left of the API Center portal is the name of your API center. You can customize this name.

1. In the Azure portal, go to the **Portal settings** > **Site profile** page.
1. Enter a new name in **Add a website name**.
1. Select **Save + publish**.

    :::image type="content" source="media/enable-api-center-portal/add-website-name.png" alt-text="Screenshot of adding a custom website name in the Azure portal.":::

    The new name appears after you refresh the API Center portal.

## Enable sign-in to portal by Microsoft Entra users and groups 

While the portal URL is publicly accessible, users must sign in to see the APIs in your API center. To enable sign-in, assign the **Azure API Center Data Reader** role to users or groups in your organization, scoped to your API center.

> [!IMPORTANT]
> By default, you and other administrators of the API center don't have access to APIs in the API Center portal. Be sure to assign the **Azure API Center Data Reader** role to yourself and other administrators.  

For detailed prerequisites and steps to assign a role to users and groups, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). Brief steps follow:

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

:::image type="content" source="media/enable-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::

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

In the Microsoft Entra app registration, review and, if needed, update the **Redirect URI** settings:

* Platform: **Single-page application (SPA)**
* URI: `https://<api-center-name>.portal.<region>.azure-apicenter.ms`. This value must be the URI shown for the Microsoft Entra ID provider for your API Center portal.

### Unable to select Azure API Center permissions in Microsoft Entra app registration

If you're unable to request API permissions to Azure API Center in your Microsoft Entra app registration for the API Center portal, check that you are searching for **Azure API Center** (or application ID `c3ca1a77-7a87-4dba-b8f8-eea115ae4573`). 

If the app isn't present, there might be a problem with the registration of the **Microsoft.ApiCenter** resource provider in your subscription. You might need to re-register the resource provider. To do this, run the following command in the Azure CLI:

```azurecli
az provider register --namespace Microsoft.ApiCenter
```

After re-registering the resource provider, try again to request API permissions.


## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [What is Azure role-based access control (RBAC)?](../role-based-access-control/overview.md)
* [Best practices for Azure RBAC](../role-based-access-control/best-practices.md)
* [Register a resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider)
