---
title: Enable API Center portal - Azure API Center
description: Enable the API Center portal, an automatically generated website that enables discovery of your API inventory.
author: dlepow
ms.service: api-center
ms.topic: how-to
ms.date: 01/17/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable a portal for developers in my organization to discover the APIs in my organization's API center.
---

# Enable the API Center portal

This article shows how to enable the *API Center portal*, an automatically generated website that enables discovery of the APIs in your API center. The portal is hosted by Azure at a unique URL and restricts access using Azure role-based access control.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Permissions to create an app registration in the Microsoft Entra tenant associated with your Azure subscription. 

* For Azure CLI:
    [!INCLUDE [include](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!NOTE]
    > All Azure CLI commands in this article are formatted for the bash shell. If you're using PowerShell or another shell environment, you might need to adjust the formatting for your environment.


## Configure Microsoft Entra app registration

First configure an app registration in your Microsoft Entra ID tenant for the API Center portal. The app registration is used to enable the portal to access data from your API center on behalf of a signed-in user.


#### [Portal](#tab/portal)

1. In the [portal](https://portal.azure.com), navigate to App registrations to register an app in the Microsoft identity platform.
1. Select **New registration**. On the **Register an application** page, set the values as follows:
    
    * Set **Name** to a meaningful name such as *api-center-portal*
    * Under **Supported account types**, make a selection for your scenario, such as **Accounts in any organizational directory**. 
    * In **Redirect URI**, select **Single-page application (SPA)** and enter the following URL, substituting your API center name and region where indicated:

        `https://<apiCenterName>.portal.<region>.azure-apicenter.ms`
    * Select **Register**.
1. On the **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**. You'll use these values when you enable the portal in your API center.

    > [!NOTE]
    > The **Application (client) ID** is also known as the **client ID**.        
1. On the **API permissions** page, select **Add a permission**. 
    1. On the **Request API permissions** page, select the **APIs my organization uses** tab. Search for and select **Azure API Center**. 
    1. On the **Request permissions** page, select **user_impersonation**.
    1. Select **Add permissions**. 

    The Azure API Center permissions appear under **Configured permissions**.

    :::image type="content" source="media/enable-api-center-portal/configure-app-permissions.png" alt-text="Screenshot of require
d permissions in Microsoft Entra app registration in the portal.":::


#### [Azure CLI](#tab/cli)

Use the [az ad app create](/cli/azure/ad/app#az-ad-app-create) command to create an app registration in your Microsoft Entra tenant.

1. Create a file named `manifest.json` with the following content to specify the required permissions for the API Center portal:

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

1. Run the following command to create the app registration in your Microsoft Entra tenant, substituting `<name>` with a meaningful name for the app registration:

    ```azurecli
    objectID=$(az ad app create --display-name <name> --required-resource-accesses @manifest.json --query 'id' --output tsv)
    ```    

1. Run the [az rest](/cli/azure/rest) command to set the SPA redirect URI for the app registration, substituting `<apiCenterName>` and `<region>` with your API center name and region:

    ```azurecli
    az rest --method PATCH --uri 'https://graph.microsoft.com/v1.0/applications/'$objectID --body '{"spa":{"redirectUris":["https://<apiCenterName>.<region>.eastus.azure-apicenter.ms"]}}'
    ```

## Enable the portal in your API center

#### [Portal](#tab/portal)


#### [Azure CLI](#tab/cli)

```azurecli

```


After you enable the portal, it's hosted at the following URL that you can share with developers in your organization: `https://<apiCenterName>.<region>.eastus.azure-apicenter.ms`

While the portal itself is publicly accessible, users must sign in to see the APIs in your API center. To enable access for users and groups, see the following section.

## Enable access to portal data by Microsoft Entra users and groups 

Access to the data API Center portal is controlled by Azure role-based access control. Enable access for users and groups by assigning them the **Azure API Center Data Reader** role, scoped to your API center.

#### [Portal](#tab/portal)

For prerequisites and steps to assign the **Azure API Center Data Reader** role to users and groups, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).


1. In the [portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Access control (IAM)** > **Add role assignment**.
1. In the **Add role assignment** pane, set the values as follows:
    * On the **Role** page, search for and select **Azure API Center Data Reader**. Select **Next**.
    * On the **Members** page, In **Assign access to**, select **User, group, or service principal** > **+ Select members**.
    * on the **Select members** page, search for and select the users or groups to assign the role to. Click **Select** and then **Next**.
    * Review the role assignment, and select **Review + assign**.


#### [Azure CLI](#tab/cli)

For prerequisites and steps to assign the **Azure API Center Data Reader** role to users and groups, see [Assign Azure roles using Azure CLI](../role-based-access-control/role-assignments-cli.md). The following commands assign the role to a user or group:


```azurecli
# Get resource ID of the API center
apicID=$(az apic service show --name <apiCenterName> --resource-group <resourceGroupName> --query 'id')


# Set variable for user or group to assign role to - for example, "denise@contoso.com", or principal ID of a security group
assignee="<userOrGroupPrincipalName>"


# Assign the role to the user or group
az role assignment create --assignee $assignee \
    --role "Azure API Center Data Reader" \
    --scope $apicID
```


### 


## Related content

* [Azure CLI reference for API Center](/cli/azure/apic) 
* [What is Azure role-based access control (RBAC)?](../role-based-access-control/overview.md)