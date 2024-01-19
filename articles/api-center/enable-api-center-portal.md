---
title: Enable API Center portal - Azure API Center
description: Enable the API Center portal, an automatically generated website that enables discovery of your API inventory.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/19/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable a portal for developers in my organization to discover the APIs in my organization's API center.
---

# Enable the API Center portal

This article shows how to enable the *API Center portal*, an automatically generated website that developers can you to discover the APIs in your API center. The portal is hosted by Azure at a unique URL and restricts access to data in your API center using Azure role-based access control.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in a Microsoft Entra tenant associated with your Azure subscription. 

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!TIP]
    > Azure CLI command examples in this article are formatted for the bash shell. If you're using PowerShell or another shell environment, you might need to adjust the examples for your environment.


## Create Microsoft Entra app registration

First configure an app registration in your Microsoft Entra ID tenant for the API Center portal. The app registration enables the portal to access data from your API center on behalf of a signed-in user.


#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to **App registrations** to register an app in the Microsoft identity platform.
1. Select **+ New registration**. 
1. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *api-center-portal*
    * Under **Supported account types**, make a selection for your scenario, such as **Accounts in any organizational directory**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and enter the following URL, substituting your API center name and region where indicated:

        `https://<apiCenterName>.portal.<region>.azure-apicenter.ms`

        Example: `https://contoso-apic.portal.westeurope.azure-apicenter.ms`

    * Select **Register**.
1. On the **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**. You use these values when you configure the identity provider for the portal in your API center.
      
1. On the **API permissions** page, select **+ Add a permission**. 
    1. On the **Request API permissions** page, select the **APIs my organization uses** tab. Search for and select **Azure API Center**. 
    1. On the **Request permissions** page, select **user_impersonation**.
    1. Select **Add permissions**. 

    The Azure API Center permissions appear under **Configured permissions**.

    :::image type="content" source="media/enable-api-center-portal/configure-app-permissions.png" alt-text="Screenshot of required permissions in Microsoft Entra app registration in the portal." lightbox="media/enable-api-center-portal/configure-app-permissions.png":::

#### [Azure CLI](#tab/cli)

Use the [az ad app create](/cli/azure/ad/app#az-ad-app-create) command to create an app registration in your Microsoft Entra tenant.

1. Create a file named `manifest.json` with the following content. This specifies the required permissions for the API Center portal:

    ```json
    [
      {
        "resourceAccess": [
          {
            "id": "44327351-3395-414e-882e-7aa4a9c3b25d",
            "type": "Scope"
          }
        ],
        "resourceAppId": "c3ca1a77-7a87-4dba-b8f8-eea115ae4573"
      }
    ]
    ```

1. Run the following command to create the app registration in your Microsoft Entra tenant, substituting `<name>` with a meaningful name for the app registration, such as *api-center-portal*:

    ```azurecli
    # Create the app registration and get the object ID for use in next step
    objectID=$(az ad app create \
        --display-name <name> --required-resource-accesses @manifest.json \
        --query 'id' --output tsv)
    ```    

1. Run the [az rest](/cli/azure/reference-index#az-rest) command to set the SPA redirect URI for the app registration, substituting `<apiCenterName>` and `<region>` with your API center name and region:

    ```azurecli
    az rest --method PATCH \
        --uri 'https://graph.microsoft.com/v1.0/applications/'$objectID \
         --body '{"spa":{"redirectUris":["https://<apiCenterName>.<region>.azure-apicenter.ms"]}}'
    ```
---

## Configure Microsoft Entra ID provider for API Center portal

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **API Center portal**, select **Portal settings**.
1. Select **Identity provider** > **Start set up**.
1. On the **Set up user sign-in with Microsoft Entra ID** page, set the values as follows:
    * In **Client ID**, enter the **Application (client) ID** of the app registration you created in the previous section.
    * In **Tenant ID**, enter the **Directory (tenant) ID** of the app registration.
    * Select **Save + publish**.

    :::image type="content" source="media/enable-api-center-portal/set-up-sign-in-portal.png" alt-text="Screenshot of the Identity provider settings in the API Center portal." lightbox="media/enable-api-center-portal/set-up-sign-in-portal.png":::

1. To view the API Center portal, on the **Portal settings** page, select **View API Center portal**.


#### [Azure CLI](#tab/cli)

```azurecli

```

---

After you configure the identity provider, the portal is published at the following URL that you can share with developers in your organization: `https://<apiCenterName>.<region>.azure-apicenter.ms`.

:::image type="content" source="media/enable-api-center-portal/api-center-portal-home.png" alt-text="Screenshot of the API Center portal home page.":::

While the portal URL is publicly accessible, users must sign in to see the APIs in your API center. To enable access for users and groups, see the following section.

> [!NOTE]
> You must also configure access for yourself and others who are responsible for managing the API center.  

> [!TIP]
> By default, the name of the portal is based on the name of your API center. You can customize the website name in the **Portal settings** > **Site settings** page in the Azure portal.

## Enable access to portal data by Microsoft Entra users and groups 

Access to the data in the API Center portal is controlled by Azure role-based access control. Enable access for users and groups by assigning them the **Azure API Center Data Reader** role, scoped to your API center.

#### [Portal](#tab/portal)

For detailed prerequisites and steps to assign the **Azure API Center Data Reader** role to users and groups, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). Brief steps follow:


1. In the [portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Access control (IAM)** > **Add role assignment**.
1. In the **Add role assignment** pane, set the values as follows:
    * On the **Role** page, search for and select **Azure API Center Data Reader**. Select **Next**.
    * On the **Members** page, In **Assign access to**, select **User, group, or service principal** > **+ Select members**.
    * on the **Select members** page, search for and select the users or groups to assign the role to. Click **Select** and then **Next**.
    * Review the role assignment, and select **Review + assign**.


#### [Azure CLI](#tab/cli)

For detailed prerequisites and steps to assign the **Azure API Center Data Reader** role to users and groups, see [Assign Azure roles using Azure CLI](../role-based-access-control/role-assignments-cli.md). The following commands assign the role to a user or group:


```azurecli
# Get resource ID of the API center
apicID=$(az apic service show --name <apiCenterName> \
    --resource-group <resourceGroupName> \
    --query 'id' --output tsv)

# Set variable for user or group to assign role to.
Example: "denise@contoso.com", or principal ID of a security group
assignee="<userNameOrGroupPrincipalID>"


# Assign the role to the user or group, scoped to API center
az role assignment create --assignee $assignee \
    --role "Azure API Center Data Reader" \
    --scope "${apicID:1}"
```
---

After you configure access to the portal, users and groups can sign in to the portal and view the APIs in your API center.


## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [What is Azure role-based access control (RBAC)?](../role-based-access-control/overview.md)
* To learn about rules to determine group membership in Microsoft Entra ID, see [Create or update a dynamic group in Microsoft Entra ID](/entra/identity/users/groups-create-rule)