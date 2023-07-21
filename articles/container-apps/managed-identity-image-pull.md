---
title: Azure Container Apps image pull from Azure Container Registry with managed identity
description: Set up Azure Container Apps to authenticate Azure Container Registry image pulls with managed identity
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 09/16/2022
ms.author: v-wellsjason
zone_pivot_groups: container-apps-interface-types
---

# Azure Container Apps image pull with managed identity

You can pull images from private repositories in Microsoft Azure Container Registry  using managed identities for authentication to avoid the use of administrative credentials.  You can use a system-assigned or user-assigned managed identity to authenticate with Azure Container Registry.  

With a system-assigned managed identity, the identity is created and managed by Azure Container Apps.  The identity is tied to your container app and is deleted when your app is deleted.   With a user-assigned managed identity, you create and manage the identity outside of Azure Container Apps.  It can be assigned to multiple Azure resources, including Azure Container Apps.

::: zone pivot="azure-portal"

This article describes how to use the Azure portal to configure your container app to use user-assigned and system-assigned managed identities to pull images from private Azure Container Registry repositories.

## User-assigned managed identity

The following steps describe the process to configure your container app to use a user-assigned managed identity to pull images from private Azure Container Registry repositories.

1. Create a container app with a public image.
1. Add the user-assigned managed identity to the container app.
1. Create a container app revision with a private image and the system-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull.
- Create a user-assigned managed identity. For more information, see [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

### Create a container app 

Use the following steps to create a container app with the default quickstart image.

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
1. Select the **Create** button at the bottom of the **Create Container App** window.

Allow a few minutes for the container app deployment to finish.  When deployment is complete, select **Go to resource**.

### Add the user-assigned managed identity

1. Select **Identity** from the left menu.
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
     >[!NOTE]
     > If the administrative credentials are not enabled on your Azure Container Registry registry, you will see a warning message displayed and you will need to enter the image name and tag information manually.
 
1. Select **Save**.
1. Select **Create** from the **Create and deploy new revision** page.

A new revision will be created and deployed.  The portal will automatically attempt to add the `acrpull` role to the user-assigned managed identity.  If the role isn't added, you can add it manually.  

You can verify that the role was added by checking the identity from the **Identity** pane of the container app page.

1. Select **Identity** from the left menu.
1. Select the **User assigned** tab.
1. Select the user-assigned managed identity.
1. Select **Azure role assignments** from the menu on the managed identity resource page.
1. Verify that the `acrpull` role is assigned to the user-assigned managed identity.

### Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

>[!WARNING]
>Deleting the resource group will delete all the resources in the group.  If you have other resources in the group, they will also be deleted. If you want to keep the resources, you can delete the container app instance and the container app environment.

1. Select your resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name  in the confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group may take a few minutes to complete.

## System-assigned managed identity

The method for configuring a system-assigned managed identity in the Azure portal is the same as configuring a user-assigned managed identity.  The only difference is that you don't need to create a user-assigned managed identity.  Instead, the system-assigned managed identity is created when you create the container app.

The method to configure a system-assigned managed identity in the Azure portal is:

1. Create a container app with a public image.
1. Create a container app revision with a private image and the system-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull. See [Create a private Azure Container Registry](../container-registry/container-registry-get-started-portal.md#create-a-container-registry).

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

Allow a few minutes for the container app deployment to finish.  When deployment is complete, select **Go to resource**.

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
    >[!NOTE]
    > If the administrative credentials are not enabled on your Azure Container Registry registry, you will see a warning message displayed and you will need to enter the image name and tag information manually.

1. Select **Save** at the bottom of the page.
1. Select **Create** at the bottom of the **Create and deploy new revision** page
1. After a few minutes, select **Refresh**  on the **Revision management** page to see the new revision.

A new revision will be created and deployed.  The portal will automatically attempt to add the `acrpull` role to the system-assigned managed identity.  If the role isn't added, you can add it manually.  

You can verify that the role was added by checking the identity in the **Identity** pane of the container app page.

1. Select **Identity** from the left menu.
1. Select the **System assigned** tab.
1. Select **Azure role assignments**.
1. Verify that the `acrpull` role is assigned to the system-assigned managed identity.

### Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

>[!WARNING]
>Deleting the resource group will delete all the resources in the group.  If you have other resources in the group, they will also be deleted. If you want to keep the resources, you can delete the container app instance and the container app environment.

1. Select your resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name in the confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group may take a few minutes to complete. 

::: zone-end
::: zone pivot="command-line"

This article describes how to configure your container app to use managed identities to pull images from a private Azure Container Registry repository using Azure CLI and Azure PowerShell.

## Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| Azure account | An Azure account with an active subscription. If you don't have one, you can  [can create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | If using Azure CLI, [install the Azure CLI](/cli/azure/install-azure-cli) on your local machine. |
| Azure PowerShell | If using PowerShell, [install the Azure PowerShell](/powershell/azure/install-azure-powershell) on your local machine. Ensure that the latest version of the Az.App module is installed by running the command `Install-Module -Name Az.App`. |
|Azure Container Registry | A private Azure Container Registry containing an image you want to pull. [Quickstart: Create a private container registry using the Azure CLI](../container-registry/container-registry-get-started-azure-cli.md) or [Quickstart: Create a private container registry using Azure PowerShell](../container-registry/container-registry-get-started-powershell.md)|

## Setup

First, sign in to Azure from the CLI or PowerShell. Run the following command, and follow the prompts to complete the authentication process.


# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

---

# [Azure CLI](#tab/azure-cli)

Install the Azure Container Apps extension for the CLI.

```azurecli
az extension add --name containerapp --upgrade
```

# [Azure PowerShell](#tab/azure-powershell)

You must have the latest Az PowerShell module installed.  Ignore any warnings about modules currently in use.

```azurepowershell
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
```

Now install the Az.App module.

```azurepowershell
Install-Module -Name Az.App
```

---

Now that the current extension or module is installed, register the `Microsoft.App` namespace and the `Microsoft.OperationalInsights` provider if you haven't register them before.

# [Azure CLI](#tab/azure-cli)

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

# [Azure CLI](#tab/azure-cli)

Next, set the following environment variables. Replace the *\<PLACEHOLDERS\>* with your own values.

```azurecli
RESOURCE_GROUP="<YOUR_RESOURCE_GROUP_NAME>"
LOCATION="<YOUR_LOCATION>"
CONTAINERAPPS_ENVIRONMENT="<YOUR_ENVIRONMENT_NAME>"
REGISTRY_NAME="<YOUR_REGISTRY_NAME>"
CONTAINERAPP_NAME="<YOUR_CONTAINERAPP_NAME>"
IMAGE_NAME="<YOUR_IMAGE_NAME>"
```

# [Azure PowerShell](#tab/azure-powershell)

Next, set the following environment variables. Replace the *\<Placeholders\>* with your own values.

```azurepowershell
$ResourceGroupName = '<YourResourceGroupName>'
$Location = '<YourLocation>'
$ContainerAppsEnvironment = '<YourEnvironmentName>'
$RegistryName = '<YourRegistryName>'
$ContainerAppName = '<YourContainerAppName>'
$ImageName = '<YourImageName>'
```

---

If you already have a resource group, skip this step. Otherwise, create a resource group.

# [Azure CLI](#tab/azure-cli)

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

### Create a container app environment

If the environment doesn't exist, run the following command:

# [Azure CLI](#tab/azure-cli)

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

Continue to the next section to configure user-assigned managed identity or skip to the [System-assigned managed identity](#system-assigned-managed-identity-1) section.

## User-assigned managed identity

Follow this procedure to configure user-assigned managed identity:

1. Create a user-assigned managed identity.
1. If you're using PowerShell, assign a `acrpull` role for your registry to the managed identity.  The Azure CLI automatically makes this assignment.
1. Create a container app with the image from the private registry that is authenticated with the user-assigned managed identity.

### Create a user-assigned managed identity

# [Azure CLI](#tab/azure-cli)

Create a user-assigned managed identity. Replace the *\<PLACEHOLDERS\>* with the name of your managed identity.  

```azurecli
IDENTITY="<YOUR_IDENTITY_NAME>"
```

```azurecli
az identity create \
  --name $IDENTITY \
  --resource-group $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

Create a user-assigned managed identity. Replace  the *\<Placeholders\>* with the name of your managed identity.  

```azurepowershell
$IdentityName = '<YourIdentityName>'
```

```azurepowershell
New-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName -Location $Location
```

---

# [Azure CLI](#tab/azure-cli)

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

Create the `acrpull` role assignment for the identity.

```azurepowershell
New-AzRoleAssignment -ObjectId $PrincipalId -Scope $RegistryId -RoleDefinitionName acrpull
```

---

### Create a container app

Create your container app with your image from the private registry authenticated with the identity.

# [Azure CLI](#tab/azure-cli)

Copy the identity's resource ID to paste into the *\<IDENTITY_ID\>* placeholders in the command below. If your image tag isn't `latest`, replace 'latest' with your tag.

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

# [Azure CLI](#tab/azure-cli)

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

# [Azure CLI](#tab/azure-cli)

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

Update the container app with the image from your private container registry and add a system-assigned identity to authenticate the Azure Container Registry pull.  You can also include other settings necessary for your container app, such as ingress, scale and Dapr settings.  

# [Azure CLI](#tab/azure-cli)

Set the registry server and turn on system-assigned managed identity in the container app.

```azurecli
az containerapp registry set \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --identity system \
  --server "$REGISTRY_NAME.azurecr.io"
```

```azurecli
az containerapp update \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image "$REGISTRY_NAME.azurecr.io/$IMAGE_NAME:latest"
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
    Image = $RegistryName + ".azurecr.io/" + $ImageName + ":latest"
}
$TemplateObj = New-AzContainerAppTemplateObject @ImageParams

$AppArgs = @{
    Name = 'my-container-app'
    Location = $Location
    ResourceGroupName = $ResourceGroupName
    ConfigurationRegistry = $CredentialObject
    IdentityType = 'SystemAssigned'
    TemplateContainer = $TemplateObj
    IngressTargetPort = 80
    IngressExternal = $true
}
Update-AzContainerApp @AppArgs
```

---

### Clean up

>[!CAUTION]
> The following command deletes the specified resource group and all resources contained within it. If resources outside the scope of this quickstart exist in the specified resource group, they will also be deleted.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---


::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managed identities in Azure Container Apps](managed-identity.md)
