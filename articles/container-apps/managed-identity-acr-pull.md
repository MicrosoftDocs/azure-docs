---
title: Azure Container Apps image pull from Azure Container Registry with managed identity
description: Set up Azure Container Apps to authenticate Azure Container Registry image pulls with managed identity
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 08/31/2022
ms.author: v-bcatherine
zone_pivot_groups: azure-cli-or-portal
---

# Azure Container Apps image pull from Azure Container Registry with managed identity

You can pull images from private repositories in Azure Container Registry (ACR) using managed identities to avoid the use of administrative credentials.

::: zone pivot="azure-portal"

This article describes how use the Azure portal to configure your container app to use user-assigned and system-assigned managed identities to pull images from private ACR repositories.

## User-assigned managed identity

To configure a user-assigned managed identity, you must first create a user-assigned managed identity. For more information, see [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

This is the work flow to configure a container app to use a user-assigned managed identity:

1. Create a container app with a public image.
1. Add the user-assigned managed identity to the container app.
1. Create a container app revision with a private image and the system-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull.
- Create a user-assigned managed identity.

### Create container 

Follow these steps to create a container app with the default quickstart image.

1. Navigate to the portal **Home** page.
1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.
1. In the *Basics* tab, do the following actions.

| Setting | Action |
|---|---|
| **Subscription** | Select your Azure subscription. |
| **Resource group** | Select an existing resource group or create a new one. |
| **Container app name** |  Enter a container app name. |
| **Location** | Select a location. |
| **Create Container App Environment** | Create a new or select an existing environment. |

1. Select the **Review + Create** button at the bottom of the **Create Container App** page.
1. Select the **Create** button at the bottom of the **Create Container App** page.

It will take a few minutes for the container app to be deployed. When deployment is complete, select **Go to resource**.

### Add the user-assigned managed identity

1. Select Identity from the left menu.
1. Select the **User assigned** tab.
1. Select the **Add user assigned managed identity** button.
1. Select your subscription.
1. Select the identity you created.
1. Select **Add**.
 
### Create a container app revision 

Create a container app revision with a private image and the system-assigned managed identity.

1. Select **Revision Management** from the left menu.
1. Select **Create new revision**.
1. Select the container image from the **Container Image** table.
1. Enter the information in the *Edit a container* dialog.

  |Field|Action|
  |-----|------|
  |**Name**|Enter a name for the container.|
  |**Image source**|Select **Azure Container Registry**.|
  |**Authentication**|Select **Managed Identity**.|
  |**Identity**|Select the identity you created from the drop-down menu.|
  |**Registry**|Select the registry you want to use from the drop-down menu.|
  |**Image**|Enter the name of the image you want to use.|
  |**Image Tag**|Enter the name and tag of the image you want to pull.|

 :::image type="content" source="media/managed-identity/screenshot-edit-a-container-user-assigned-identity.png" alt-text="Screen shot of the Edit a container dialog entering user assigned managed identity.":::
 
1. Select **Save**.
1. Select **Create** from the **Create and deploy new revision** page.

A new revision will be created and deployed.

## System-assigned managed identity

The method for configuring a system-assigned managed identity in the Azure portal is the same as configuring a user-assigned managed identity.  The only difference is that you don't need to create a user-assigned managed identity.  Instead, the system-assigned managed identity is created when you create the container app.

The method to configure a system-assigned managed identity in the Azure portal is:

1. Create a container app with a public image.
1. Create a container app revision with a private image and the system-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull.

### Create a container app

Follow these steps to create a container app with the default quickstart image.

1. Navigate to the portal **Home** page.
1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.
1. In the **Basics** tab, do the following actions.

| Setting | Action |
|---|---|
| **Subscription** | Select your Azure subscription. |
| **Resource group** | Select an existing resource group or create a new one. |
| **Container app name** |  Enter a container app name. |
| **Location** | Select a location. |
| **Create Container App Environment** | Create a new or select an existing environment. |

1. Select the **Review + Create** button at the bottom of the **Create Container App** page.
1. Select the **Create** button at the bottom of the **Create Container App** page.

It will take a few minutes for the container app to be deployed. When deployment is complete, select **Go to resource**.

### Edit and deploy a revision

Edit the container to use the image from your private Azure Container Registry, and configure the authentication to use system-assigned identity.

1. The **Containers** from the side menu on the left.
1. Select **Edit and deploy**.
1. Select the *simple-hello-world-container* container from the list.

    | Setting | Action |
    |---|---|
    |**Name**| Enter the container app name. |
    |**Image source**| Select **Azure Container Registry**. |
    |**Authentication**| Select **Managed identity**. |
    |**Identity**| Select **System assigned**. |
    |**Registry**| Enter the Registry name. |
    |**Image**| Enter the image name. |
    |**Image tag**| Enter the tag. |

:::image type="content" source="media/managed-identity/screenshot-edit-a-container-system-assigned-identity.png" alt-text="Screen shot Edit a container with system-assigned managed identity.":::

1. Select **Save** at the bottom of the page.
1. Select **Create** at the bottom of the **Create and deploy new revision** page
1. After a few minutes, select **Refresh**  on the **Revision management** page to see the new revision.

::: zone-end
::: zone pivot="azure-cli"

This article describes how to configure your container app to use managed identities to pull images from a private ACR repository using Azure CLI, Azure PowerShell and via a resource template.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull.
- If using Azure CLI, install the latest version of Azure CLI.
- If using PowerShell, install the latest version of the Azure PowerShell Az.App module.
- If using user-assigned managed identity, create a user-assigned managed identity.


## Setup

First, sign in to Azure from the CLI or PowerShell. Run the following command, and follow the prompts to complete the authentication process.

# [Bash](#tab/bash)

```azurecli
az login
```

Now that the current extension or module is installed, register the `Microsoft.App` namespace and the `Microsoft.OperationalInsights` provider if you haven't register them before.


# [Bash](#tab/bash)

```azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.App
Register-AzResourceProvider -ProviderNamespace Microsoft.OperationalInsights
```

---

Next, set the following environment variables. Replace the *\<placeholders\>* with your own values.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="<YOUR_RESOURCE_GROUP_NAME>"
LOCATION="<YOUR_LOCATION>"
CONTAINERAPPS_ENVIRONMENT="<YOUR_ENVIRONMENT_NAME>"
REGISTRY_NAME="<YOUR_REGISTRY_NAME>"
CONTAINERAPP_NAME="<YOUR_CONTAINERAPP_NAME>"
IMAGE_NAME="<YOUR_IMAGE_NAME>"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$ResourceGroupName = '<YourResourceGroupName>'
$Location = '<YourLocation>'
$ContainerAppsEnvironment = '<YourEnvironmentName>'
$RegistryName = '<YourRegistryName>'
$ContainerAppName = '<YourContainerAppName>'
$ImageName = '<YourFullImageName>'
```

---

If you already have a resource group, skip this step. Otherwise, create a resource group.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---

### Create an environment

If the environment doesn't exist, run the following command:

# [Bash](#tab/bash)

To create the environment, run the following command:

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [Azure PowerShell](#tab/azure-powershell)

A Log Analytics workspace is required for the Container Apps environment.  The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to  variables.

```azurepowershell
$WorkspaceArgs = @{
    Name = 'myworkspace'
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    PublicNetworkAccessForIngestion = 'Enabled'
    PublicNetworkAccessForQuery = 'Enabled'
}
New-AzOperationalInsightsWorkspace @WorkspaceArgs
$WorkspaceId = (Get-AzOperationalInsightsWorkspace -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).CustomerId
$WorkspaceSharedKey = (Get-AzOperationalInsightsWorkspaceSharedKey -ResourceGroupName $ResourceGroupName -Name $WorkspaceArgs.Name).PrimarySharedKey
```

To create the environment, run the following command:

```azurepowershell
$EnvArgs = @{
    EnvName = $ContainerAppsEnvironment
    ResourceGroupName = $ResourceGroupName
    Location = $Location
    AppLogConfigurationDestination = 'log-analytics'
    LogAnalyticConfigurationCustomerId = $WorkspaceId
    LogAnalyticConfigurationSharedKey = $WorkspaceSharedKey
}

New-AzContainerAppManagedEnv @EnvArgs
```

---

Continue to the next section to configure user-assigned managed identity or skip to the [System-assigned managed identity](#system-assigned-managed-identity) section.

## User-assigned managed identity

Follow this procedure to configure user-assigned managed identity:

1. Create a user-assigned managed identity.
1. If you are using PowerShell, assign a acrpull role for your registry to the managed identity.  If you are using the Azure CLI, it will do this automatically.
1. Create a container app with the image from the private registry that is authenticated with the user-assigned managed identity.

### Create a user-assigned managed identity

Create a user-assigned managed identity. Replace  the *\<placeholders\>* with the name of your managed identity.  

# [Bash](#tab/bash)

```azurecli
IDENTITY="<YOUR_IDENTITY_NAME>"
```

```azurecli
az identity create \
  --name $IDENTITY \
  --resource-group $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$IdentityName = '<YourIdentityName>'
```

```azurepowershell
New-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName -Location $Location
```

---

# [Bash](#tab/bash)

Get identity's resource ID.

```azurecli
IDENTITY_ID=`az identity show \
  --name $IDENTITY \
  --resource-group $RESOURCE_GROUP \
  --query id`
```

# [Azure PowerShell](#tab/azure-powershell)

Get the identity's resource and principal ID. 

```azurepowershell
$IdentityId = (Get-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName).Id
$PrincipalId = (Get-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName).PrincipalId
```

Get the registry's resource ID.  Replace the *\<placeholders\>* with the resource group name for your registry.

```azurepowershell
$RegistryId = (Get-AzContainerRegistry -ResourceGroupName <RegistryResourceGroup> -Name $RegistryName).Id
```

Create the acrpull role assignment for the identity.

```azurepowershell
New-AzRoleAssignment -ObjectId $PrincipalId -Scope $RegistryId -RoleDefinitionName acrpull
```

---

### Create a container app

Create your container app with your image from the private registry authenticated with the identity.

# [Bash](#tab/bash)

Copy the identity's resource id to paste into the *\<IDENTITY_ID\>* placeholders in the command below.

```azurecli
echo $IDENTITY_ID
```

```azurecli
az containerapp create \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --user-assigned <IDENTITY_ID> \
  --registry-identity <IDENTITY_ID> \
  --registry-server "$REGISTRY_NAME.azurecr.io" \
  --image "$REGISTRY_NAME.azurecr.io/$IMAGE_NAME:latest"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$CredentialArgs = @{
    Server = $RegistryName + '.azurecr.io'
    Identity = $IdentityId
}
$CredentialObject = New-AzContainerAppRegistryCredentialObject @CredentialArgs
$ImageParams = @{
    Name = 'my-container-app'
    Image = $RegistryName + '.azurecr.io/' + $ImageName + ':latest'
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams
$EnvId = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).Id

$AppArgs = @{
    Name = 'my-container-app'
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    ConfigurationRegistry = $CredentialObject
    IdentityType = 'UserAssigned'
    IdentityUserAssignedIdentity = @{ $IdentityId = @{ } }
    TemplateContainer = $TemplateObj
    IngressTargetPort = 80
    IngressExternal = $true
}
New-AzContainerApp @AppArgs
```

---

### Clean up

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

## System-assigned managed identity

To configure a system-assigned identity, you'll need to:

1. Create a container app with a public image.
1. Assign a system-assigned managed identity to the container app.
1. Update the container app with the private image.

### Create a container app

Create a container with a public image.  

# [Bash](#tab/bash)

```azurecli
az containerapp create \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 80 \
  --ingress external
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
$ImageParams = @{
    Name = "my-container-app"
    Image = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams
$EnvId = (Get-AzContainerAppManagedEnv -EnvName $ContainerAppsEnvironment -ResourceGroupName $ResourceGroupName).Id

$AppArgs = @{
    Name = "my-container-app"
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ManagedEnvironmentId = $EnvId
    IdentityType = "SystemAssigned"
    TemplateContainer = $TemplateObj
    IngressTargetPort = 80
    IngressExternal = $true

}
New-AzContainerApp @AppArgs
```

---

### Update the container app

Update the container app with the image from your private container registry and add a system-assigned identity to authenticate the ACR pull.  You can also include other settings necessary for your container app, such as ingress, scale and Dapr settings.

<!--
```azurecli
az containerapp identity assign \
  --name my-container-app \
  --resource-group $RESOURCE_GROUP \
  --identity-type system-assigned
```
-->

# [Bash](#tab/bash)

Set the registry server and turn on system-assigned managed identity in the container app.

```azurecli
az containerapp registry set \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --identity system \
  --server "$REGISTRY_NAME.azurecr.io"
```

Update the container app with the image from your private registry.  Replace the \<TAG\> placeholders with your image's tag value.

```azurecli
az containerapp update \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image '$REGISTRY_NAME.azurecr.io/$IMAGE_NAME:latest'
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
$CredentialArgs = @{
    Server = $RegistryName + '.azurecr.io'
    Identity = 'system'
}
$CredentialObject = New-AzContainerAppRegistryCredentialObject @CredentialArgs
$ImageParams = @{
    Name = 'my-container-app'
    Image = $RegistryName + ".azurecr.io/"$ImageName + ":latest"
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams

$AppArgs = @{
    Name = 'my-container-app'
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ConfigurationRegistry $CredentialObject
    IdentityType = 'SystemAssigned'
    TemplateContainer = $TemplateObj
    IngressTargetPort = 80
    IngressExternal = $true

}
New-AzContainerApp @AppArgs

```

---

### Clean up

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

## Configure a managed identity with a template

When assigning a managed identity to a registry, use the managed identity resource ID for a user-assigned identity, or "system" for the system-assigned identity. For more information about using managed identities, see, [Managed identities in Azure Container Apps Preview](managed-identity.md).

```json
{
    "identity": {
        "type": "SystemAssigned,UserAssigned",
        "userAssignedIdentities": {
            "<IDENTITY1_RESOURCE_ID>": {}
        }
    }
    "properties": {
        "configuration": {
            "registries": [
            {
                "server": "myacr1.azurecr.io",
                "identity": "<IDENTITY1_RESOURCE_ID>"
            },
            {
                "server": "myacr2.azurecr.io",
                "identity": "system"
            }]
        }
        ...
    }
}
```

For more information about configuring user-assigned identities, see [Add a user-assigned identity](managed-identity.md#add-a-user-assigned-identity).

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managed identities in Azure Container Apps](managed-identity.md)