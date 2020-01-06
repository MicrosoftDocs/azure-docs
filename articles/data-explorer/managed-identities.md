---
title: How to configure managed identities for Azure Data Explorer cluster
description: Learn how to configure managed identities for Azure Data Explorer cluster.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/27/2019
---

# How to configure managed identities for Azure Data Explorer cluster

> [!Important]
> Managed identities for Azure Data Explorer will not behave as expected if your app is migrated across subscriptions/tenants. The app will need to obtain a new identity, which can > be done by disabling and re-enabling the feature. See Removing an identity below. Downstream resources will also need to have access policies updated to use the new identity.

This topic shows you how to create a managed identity for Azure Data Explorer clusters. A managed identity from Azure Active Directory allows your cluster to easily access other AAD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in AAD, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

Your cluster can be assigned a **system-assigned identity** that is tied to your cluster, and is deleted if your cluster is deleted. A cluster can only have one system-assigned identity.

## Adding a system-assigned identity

Creating a cluster  with a system-assigned identity requires an additional property to be set on the cluster.

<!--
### Using the Azure portal

To set up a managed identity in the portal, you will first create an application as normal and then enable the feature.

1. Create an app in the portal as you normally would. Navigate to it in the portal.

2. If using a function app, navigate to **Platform features**. For other app types, scroll down to the **Settings** group in the left navigation.

3. Select **Identity**.

4. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    ![Managed identity in App Service](media/app-service-managed-service-identity/msi-blade-system.png)
-->

### Using C#

To set up a managed identity using the Azure Data Explorer C# client, you will need to use the Azure Data Explorer NuGet package:

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install the [Microsoft.IdentityModel.Clients.ActiveDirectory NuGet package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.
* To run the following example, you need an Azure Active Directory (Azure AD) application and service principal that can access resources. To create a free Azure AD application and add role assignment at the subscription level, see [Create an Azure AD application](/azure/active-directory/develop/howto-create-service-principal-portal). You also need the directory (tenant) ID, application ID, and client secret.

1. Create or update your cluster by with the `Identity` property:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);
    
    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);
    
    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };
    
    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var location = "Central US";
    var skuName = "Standard_D13_v2";
    var tier = "Standard";
    var capacity = 5;
    var sku = new AzureSku(skuName, tier, capacity);
    var identity = new Identity(IdentityType.SystemAssigned);
    var cluster = new Cluster(location, sku, identity: identity);
    await kustoManagementClient.Clusters.CreateOrUpdateAsync(resourceGroupName, clusterName, cluster);
    ```
    
2. Run the following command to check whether your cluster was successfully created with an identity:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was created, and should have the following properties:
   
    ```csharp
    var principalId = cluster.Identity.PrincipalId;
    var tenantId = cluster.Identity.TenantId;
    ```

    Where `PrincipalId` and `TenantId` are replaced with GUIDs. The tenantId property identifies what AAD tenant the identity belongs to. The principalId is a unique identifier for the cluster's new identity. Within AAD, the service principal has the same name that you gave to your App Service or Azure Functions instance.

<!--

### Using the Azure CLI

To set up a managed identity using the Azure CLI, you will need to use the `az webapp identity assign` command against an existing application. You have three options for running the examples in this section:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block below.
- [Install the latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.31 or later) if you prefer to use a local CLI console. 

The following steps will walk you through creating a web app and assigning it an identity using the CLI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account that is associated with the Azure subscription under which you would like to deploy the application:

    ```azurecli-interactive
    az login
    ```
2. Create a web application using the CLI. For more examples of how to use the CLI with App Service, see [App Service CLI samples](../app-service/samples-cli.md):

    ```azurecli-interactive
    az group create --name myResourceGroup --location westus
    az appservice plan create --name myPlan --resource-group myResourceGroup --sku S1
    az webapp create --name myApp --resource-group myResourceGroup --plan myPlan
    ```

3. Run the `identity assign` command to create the identity for this application:

    ```azurecli-interactive
    az webapp identity assign --name myApp --resource-group myResourceGroup
    ```
-->

<!--
### Using Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following steps will walk you through creating a web app and assigning it an identity using Azure PowerShell:

1. If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzAccount` to create a connection with Azure.

2. Create a web application using Azure PowerShell. For more examples of how to use Azure PowerShell with App Service, see [App Service PowerShell samples](../app-service/samples-powershell.md):

    ```azurepowershell-interactive
    # Create a resource group.
    New-AzResourceGroup -Name myResourceGroup -Location $location
    
    # Create an App Service plan in Free tier.
    New-AzAppServicePlan -Name $webappname -Location $location -ResourceGroupName myResourceGroup -Tier Free
    
    # Create a web app.
    New-AzWebApp -Name $webappname -Location $location -AppServicePlan $webappname -ResourceGroupName myResourceGroup
    ```

3. Run the `Set-AzWebApp -AssignIdentity` command to create the identity for this application:

    ```azurepowershell-interactive
    Set-AzWebApp -AssignIdentity $true -Name $webappname -ResourceGroupName myResourceGroup 
    ```
-->

### Using an Azure Resource Manager template

An Azure Resource Manager template can be used to automate deployment of your Azure resources. To learn more about deploying to Azure Data Explorer, see [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](create-cluster-database-resource-manager.md).

Any resource of type `Microsoft.Kusto/clusters` can be created with an identity by including the following property in the resource definition:
```json
"identity": {
    "type": "SystemAssigned"
}    
```

Adding the system-assigned type tells Azure to create and manage the identity for your cluster.

For example, a cluster might look like the following json:

```json
{
    "apiVersion": "2019-09-07",
    "type": "Microsoft.Kusto/clusters",
    "name": "[variables('clusterName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "SystemAssigned"
    },
    "properties": {
        "trustedExternalTenants": [],
        "virtualNetworkConfiguration": null,
        "optimizedAutoscale": null,
        "enableDiskEncryption": false,
        "enableStreamingIngest": false,
    }
}
```

When the cluster is created, it has the following additional properties:
```json
"identity": {
    "type": "SystemAssigned",
    "tenantId": "<TENANTID>",
    "principalId": "<PRINCIPALID>"
}
```

Where `<TENANTID>` and `<PRINCIPALID>` are replaced with GUIDs. The tenantId property identifies what AAD tenant the identity belongs to. The principalId is a unique identifier for the cluster's new identity. Within AAD, the service principal has the same name that you gave to your App Service or Azure Functions instance.


## Removing an identity

A system-assigned identity can be removed by disabling the feature in the same way that it was created:

```json
"identity": {
    "type": "None"
}
```

Removing a system-assigned identity in this way will also delete it from AAD. System-assigned identities are also automatically removed from AAD when the cluster resource is deleted.
