---
title: Azure Container Apps image pull from Azure Container Registry with managed identity
description: Set up Azure Container Apps to authenticate Azure Container Registry image pulls with managed identity
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-bicep
ms.topic: how-to
ms.date: 02/03/2025
ms.author: cshoe
zone_pivot_groups: container-apps-azure-portal-console-bicep
---

# Azure Container Apps image pull with managed identity

You can pull images from private repositories in Microsoft Azure Container Registry using managed identities for authentication to avoid the use of administrative credentials.

You can use a user-assigned or system-assigned managed identity to authenticate with Azure Container Registry.
- With a user-assigned managed identity, you create and manage the identity outside of Azure Container Apps. It can be assigned to multiple Azure resources, including Azure Container Apps.
- With a system-assigned managed identity, the identity is created and managed by Azure Container Apps. It is tied to your container app and is deleted when your app is deleted.
- When possible, you should use a user-assigned managed identity to pull images.

Container Apps checks for a new version of the image whenever a container is started. In Docker or Kubernetes terminology, Container Apps sets each container's image pull policy to `always`.

::: zone pivot="portal"

This article describes how to use the Azure portal to configure your container app to use user-assigned and system-assigned managed identities to pull images from private Azure Container Registry repositories.

## User-assigned managed identity

The following steps describe the process to configure your container app to use a user-assigned managed identity to pull images from private Azure Container Registry repositories.

1. Create a container app with a public image.
1. Add the user-assigned managed identity to the container app.
1. Create a container app revision with a private image and the user-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull.
- Your Azure Container Registry must allow ARM audience tokens for authentication in order to use managed identity to pull images.
    Use the following command to check if ARM tokens are allowed to access your ACR:

    ```azurecli
    az acr config authentication-as-arm show -r <REGISTRY>
    ```

    If ARM tokens are disallowed, you can allow them with the following command:

    ```azurecli
    az acr config authentication-as-arm update -r <REGISTRY> --status enabled
    ```
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
    | **Container app name** | Enter a container app name. |
    | **Location** | Select a location. |
    | **Create Container App Environment** | Create a new or select an existing environment. |

1. Select the **Review + Create** button at the bottom of the **Create Container App** page.
1. Select the **Create** button at the bottom of the **Create Container App** window.

Allow a few minutes for the container app deployment to finish. When deployment is complete, select **Go to resource**.

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

A new revision will be created and deployed. The portal will automatically attempt to add the `acrpull` role to the user-assigned managed identity. If the role isn't added, you can add it manually.

You can verify that the role was added by checking the identity from the **Identity** pane of the container app page.

1. Select **Identity** from the left menu.
1. Select the **User assigned** tab.
1. Select the user-assigned managed identity.
1. Select **Azure role assignments** from the menu on the managed identity resource page.
1. Verify that the `acrpull` role is assigned to the user-assigned managed identity.

### Create a container app with a private image

If you don't want to start by creating a container app with a public image, you can also do the following.

1. Create a user-assigned managed identity.
1. Add the `acrpull` role to the user-assigned managed identity.
1. Create a container app with a private image and the user-assigned managed identity.

This method is typical in Infrastructure as Code (IaC) scenarios.

### Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

>[!WARNING]
>Deleting the resource group will delete all the resources in the group. If you have other resources in the group, they will also be deleted. If you want to keep the resources, you can delete the container app instance and the container app environment.

1. Select your resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name in the confirmation dialog.
1. Select **Delete**.
    The process to delete the resource group may take a few minutes to complete.

## System-assigned managed identity

The method for configuring a system-assigned managed identity in the Azure portal is the same as configuring a user-assigned managed identity. The only difference is that you don't need to create a user-assigned managed identity. Instead, the system-assigned managed identity is created when you create the container app.

The method to configure a system-assigned managed identity in the Azure portal is:

1. Create a container app with a public image.
1. Create a container app revision with a private image and the system-assigned managed identity.

### Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- A private Azure Container Registry containing an image you want to pull. See [Create a private Azure Container Registry](/azure/container-registry/container-registry-get-started-portal#create-a-container-registry).

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
    | **Container app name** | Enter a container app name. |
    | **Deployment source** | Leave this set to **Container image**. |
    | **Region** | Select a region. |
    | **Container Apps Environment** | Select an existing environment or select **Create new**. For more information see [Azure Container Apps environments](environment.md) |

1. Select **Next : Container >**.
1. In the **Container** tab, enable **Use quickstart image**. Leave **Quickstart image** set to **Simple hello world container**.
1. Select the **Review + Create** button at the bottom of the **Create Container App** page.
1. Select the **Create** button at the bottom of the **Create Container App** page.

Allow a few minutes for the container app deployment to finish. When deployment is complete, select **Go to resource**.

### Edit and deploy a revision

Edit the container to use the image from your private Azure Container Registry, and configure the authentication to use system-assigned identity.

1. In **Application**, select **Containers**.
1. In the *Containers* page, select **Edit and deploy**.
1. Select the *simple-hello-world-container* container from the list.
1. In the *Edit a container* page, do the following actions.

    | Setting | Action |
    |---|---|
    |**Name**| Enter the container app name. |
    |**Image source**| Select **Azure Container Registry**. |
    |**Subscription** | Select your Azure subscription. |
    |**Registry**| Select your container registry. |
    |**Image**| Enter the image name. |
    |**Image tag**| Enter the image tag. |
    |**Authentication type**| Select **Managed identity**. |
    |**Managed identity**| Select **System assigned**. |

1. Select **Save** at the bottom of the page.
1. Select **Create** at the bottom of the **Create and deploy new revision** page
1. After a few minutes, select **Refresh** on the **Revision management** page to see the new revision.

A new revision will be created and deployed. The portal will automatically attempt to add the `acrpull` role to the system-assigned managed identity. If the role isn't added, you can add it manually.

You can verify that the role was added by checking the identity in the **Identity** pane of the container app page.

1. Select **Identity** from the left menu.
1. Select the **System assigned** tab.
1. Select **Azure role assignments**.
1. Verify that the `acrpull` role is assigned to the system-assigned managed identity.

### Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

>[!WARNING]
>Deleting the resource group will delete all the resources in the group. If you have other resources in the group, they will also be deleted. If you want to keep the resources, you can delete the container app instance and the container app environment.

1. Select your resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name in the confirmation dialog.
1. Select **Delete**.
    The process to delete the resource group may take a few minutes to complete. 

::: zone-end
::: zone pivot="console"

This article describes how to configure your container app to use managed identities to pull images from a private Azure Container Registry repository using Azure CLI and Azure PowerShell.

## Prerequisites

| Prerequisite | Description |
|--------------|-------------|
| Azure account | An Azure account with an active subscription. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/). |
| Azure CLI | If using Azure CLI, [install the Azure CLI](/cli/azure/install-azure-cli) on your local machine. |
| Azure PowerShell | If using PowerShell, [install the Azure PowerShell](/powershell/azure/install-azure-powershell) on your local machine. Ensure that the latest version of the Az.App module is installed by running the command `Install-Module -Name Az.App`. |
|Azure Container Registry | A private Azure Container Registry containing an image you want to pull. [Quickstart: Create a private container registry using the Azure CLI](/azure/container-registry/container-registry-get-started-azure-cli) or [Quickstart: Create a private container registry using Azure PowerShell](/azure/container-registry/container-registry-get-started-powershell)|

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

Next, set the following environment variables. Replace the placeholders surrounded by `<>` with your values.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="<YOUR_RESOURCE_GROUP_NAME>"
LOCATION="<YOUR_LOCATION>"
CONTAINERAPPS_ENVIRONMENT="<YOUR_ENVIRONMENT_NAME>"
REGISTRY_NAME="<YOUR_REGISTRY_NAME>"
CONTAINERAPP_NAME="<YOUR_CONTAINERAPP_NAME>"
IMAGE_NAME="<YOUR_IMAGE_NAME>"
```

# [PowerShell](#tab/powershell)

```azurepowershell
$ResourceGroupName = '<RESOURCE_GROUP_NAME>'
$Location = '<LOCATION>'
$ContainerAppsEnvironment = '<ENVIRONMENT_NAME>'
$RegistryName = '<REGISTRY_NAME>'
$ContainerAppName = '<CONTAINERAPP_NAME>'
$ImageName = '<IMAGE_NAME>'
```

---

If you already have a resource group, skip this step. Otherwise, create a resource group.

# [Bash](#tab/bash)

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

# [PowerShell](#tab/powershell)

```azurepowershell
New-AzResourceGroup -Location $Location -Name $ResourceGroupName
```

---

### Create a container app environment

If the environment doesn't exist, run the following command:

# [Bash](#tab/bash)

To create the environment, run the following command:

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

# [PowerShell](#tab/powershell)

A Log Analytics workspace is required for the Container Apps environment. The following commands create a Log Analytics workspace and save the workspace ID and primary shared key to variables.

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
1. If you're using PowerShell, assign a `acrpull` role for your registry to the managed identity. The Azure CLI automatically makes this assignment.
1. Create a container app with the image from the private registry that is authenticated with the user-assigned managed identity.

### Create a user-assigned managed identity

# [Bash](#tab/bash)

Create a user-assigned managed identity. Before you run the following command, replace the *\<PLACEHOLDERS\>* with the name of your managed identity. 

```azurecli
IDENTITY="<YOUR_IDENTITY_NAME>"
```

```azurecli
az identity create \
  --name $IDENTITY \
  --resource-group $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

Create a user-assigned managed identity. Before you run the following command, replace the *\<PLACEHOLDERS\>* with the name of your managed identity. 

```azurepowershell
$IdentityName = '<YOUR_IDENTITY_NAME>'
```

```azurepowershell
New-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName -Location $Location
```

---

# [Bash](#tab/bash)

Get the identity's resource ID.

```azurecli
IDENTITY_ID=$(az identity show \
  --name $IDENTITY \
  --resource-group $RESOURCE_GROUP \
  --query id \
  --output tsv)
```

# [PowerShell](#tab/powershell)

Get the identity's resource and principal ID. 

```azurepowershell
$IdentityId = (Get-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName).Id
$PrincipalId = (Get-AzUserAssignedIdentity -Name $IdentityName -ResourceGroupName $ResourceGroupName).PrincipalId
```

Get the registry's resource ID. Before you run the following command, replace the *\<placeholders\>* with the resource group name for your registry.

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

# [Bash](#tab/bash)

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
  --registry-server "${REGISTRY_NAME}.azurecr.io" \
  --image "${REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:latest"
```

# [PowerShell](#tab/powershell)

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
    UserAssignedIdentity = @($IdentityId)
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

# [PowerShell](#tab/powershell)

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
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 80 \
  --ingress external
```

# [PowerShell](#tab/powershell)

```powershell
$ImageParams = @{
    Name = "my-container-app"
    Image = "mcr.microsoft.com/k8se/quickstart:latest"
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

Update the container app with the image from your private container registry and add a system-assigned identity to authenticate the Azure Container Registry pull. You can also include other settings necessary for your container app, such as ingress, scale and Dapr settings.

# [Bash](#tab/bash)

Set the registry server and turn on system-assigned managed identity in the container app.

```azurecli
az containerapp registry set \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --identity system \
  --server "${REGISTRY_NAME}.azurecr.io"
```

```azurecli
az containerapp update \
  --name $CONTAINERAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image "${REGISTRY_NAME}.azurecr.io/${IMAGE_NAME}:latest"
```

# [PowerShell](#tab/powershell)

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

# [Bash](#tab/bash)

```azurecli
az group delete --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzResourceGroup -Name $ResourceGroupName -Force
```

---

::: zone-end
::: zone pivot="bicep"

This article describes how to use a Bicep template to configure your container app to use user-assigned managed identities to pull images from private Azure Container Registry repositories.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you can [create one for free](https://azure.microsoft.com/free/).
- If using Azure CLI, [install the Azure CLI](/cli/azure/install-azure-cli) on your local machine.
- If using PowerShell, [install the Azure PowerShell](/powershell/azure/install-azure-powershell) on your local machine. Ensure that the latest version of the Az.App module is installed by running the command `Install-Module -Name Az.App`.
- A private Azure Container Registry containing an image you want to pull. To create a container registry and push an image to it, see [Quickstart: Create a private container registry using the Azure CLI](/azure/container-registry/container-registry-get-started-azure-cli) or [Quickstart: Create a private container registry using Azure PowerShell](/azure/container-registry/container-registry-get-started-powershell)

[!INCLUDE [container-apps-create-cli-steps.md](../../includes/container-apps-create-cli-steps.md)]

### Install Bicep

If you don't have Bicep installed, you can install it as follows.

# [Bash](#tab/bash)

```azurecli
az bicep install
```

If you do have Bicep installed, make sure you have the latest version.

```azurecli
az bicep upgrade
```

For more information, see [Installing Bicep](/azure/azure-resource-manager/bicep/install).

# [PowerShell](#tab/powershell)

You must manually install Bicep for any use other than Azure CLI. For more information, see [Installing Bicep](/azure/azure-resource-manager/bicep/install#install-manually).

---

### Set environment variables

Next, set the following environment variables. Replace placeholders surrounded by `<>` with your values.

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="<RESOURCE_GROUP_NAME>"
LOCATION="<LOCATION>"
REGISTRY_NAME="<REGISTRY_NAME>"
IMAGE_NAME="<IMAGE_NAME>"
IMAGE_TAG="<IMAGE_TAG>"
BICEP_TEMPLATE="<BICEP_TEMPLATE>"
CONTAINERAPPS_ENVIRONMENT="<ENVIRONMENT_NAME>"
CONTAINER_NAME="<CONTAINER_NAME>"
CONTAINERAPP_NAME="<CONTAINERAPP_NAME>"
USER_ASSIGNED_IDENTITY_NAME="<USER_ASSIGNED_IDENTITY_NAME>"
LOG_ANALYTICS_WORKSPACE_NAME="<LOG_ANALYTICS_WORKSPACE_NAME>"
APP_INSIGHTS_NAME="<APP_INSIGHTS_NAME>"
ACR_PULL_DEFINITION_ID="7f951dda-4ed3-4680-a7ca-43fe172d538d"
```

# [PowerShell](#tab/powershell)

```azurepowershell
$ResourceGroupName = '<RESOURCE_GROUP_NAME>'
$Location = '<LOCATION>'
$RegistryName = '<REGISTRY_NAME>'
$ImageName = '<IMAGE_NAME>'
$ImageTag = '<IMAGE_TAG>'
$BicepTemplate = '<BICEP_TEMPLATE>'
$ContainerAppsEnvironment = '<ENVIRONMENT_NAME>'
$ContainerName = '<CONTAINER_NAME>'
$ContainerAppName = '<CONTAINERAPP_NAME>'
$UserAssignedIdentityName = '<USER_ASSIGNED_IDENTITY_NAME>'
$LogAnalyticsWorkspaceName = '<LOG_ANALYTICS_WORKSPACE_NAME>'
$AppInsightsName = '<LOG_ANALYTICS_WORKSPACE_NAME>'
$AcrPullDefinitionId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'
```

---

The [`AcrPull`](/azure/role-based-access-control/built-in-roles#acrpull) role grants your user-assigned managed identity permission to pull the image from the registry.

## Bicep template

Copy the following Bicep template and save it as a file with the extension `.bicep`.

```bicep
param environmentName string 
param logAnalyticsWorkspaceName string
param appInsightsName string
param containerAppName string 
param azureContainerRegistry string
param azureContainerRegistryImage string 
param azureContainerRegistryImageTag string
param acrPullDefinitionId string
param userAssignedIdentityName string
param location string = resourceGroup().location

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' = {
  name: userAssignedIdentityName
  location: location 
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, azureContainerRegistry, 'AcrPullTestUserAssigned')
  properties: {
    principalId: identity.properties.principalId  
    principalType: 'ServicePrincipal'
    // acrPullDefinitionId has a value of 7f951dda-4ed3-4680-a7ca-43fe172d538d
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', acrPullDefinitionId)
  }
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: any({
    retentionInDays: 30
    features: {
      searchVersion: 1
    }
    sku: {
      name: 'PerGB2018'
    }
  })
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource appEnvironment 'Microsoft.App/managedEnvironments@2022-06-01-preview' = {
  name: environmentName
  location: location
  properties: {
    daprAIInstrumentationKey: appInsights.properties.InstrumentationKey
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2022-06-01-preview' = {
  name: containerAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity.id}': {}
    }
  }
  properties: {
    environmentId: appEnvironment.id
    configuration: {
      ingress: {
        targetPort: 8080
        external: true
      }
      registries: [
        {
          server: '${azureContainerRegistry}.azurecr.io'
          identity: identity.id
        }
      ]
    }
    template: {
      containers: [
        {
          image: '${azureContainerRegistry}.azurecr.io/${azureContainerRegistryImage}:${azureContainerRegistryImageTag}'
          name: '${azureContainerName}'
          resources: {
            cpu: 1
            memory: '2Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

output location string = location
output environmentId string = appEnvironment.id
```

## Deploy the container app

Deploy your container app with the following command.

# [Bash](#tab/bash)

```azurecli
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file $BICEP_TEMPLATE \
  --parameters environmentName="${CONTAINERAPPS_ENVIRONMENT}" \
  logAnalyticsWorkspaceName="${LOG_ANALYTICS_WORKSPACE_NAME}" \
  appInsightsName="${APP_INSIGHTS_NAME}" \
  containerAppName="${CONTAINERAPP_NAME}" \
  azureContainerRegistry="${REGISTRY_NAME}" \
  azureContainerRegistryImage="${IMAGE_NAME}" \
  azureContainerRegistryImageTag="${IMAGE_TAG}" \
  azureContainerName="${CONTAINER_NAME}" \
  acrPullDefinitionId="${ACR_PULL_DEFINITION_ID}" \
  userAssignedIdentityName="${USER_ASSIGNED_IDENTITY_NAME}" \
  location="${LOCATION}"
```

# [PowerShell](#tab/powershell)

```azurepowershell
$params = @{
  environmentName = $ContainerAppsEnvironment
  logAnalyticsWorkspaceName = $LogAnalyticsWorkspaceName
  appInsightsName = $AppInsightsName
  containerAppName = $ContainerAppName
  azureContainerRegistry = $RegistryName
  azureContainerRegistryImage = $ImageName
  azureContainerRegistryImageTag = $ImageTag
  azureContainerName = $ContainerName
  acrPullDefinitionId = $AcrPullDefinitionId
  userAssignedIdentityName = $UserAssignedIdentityName
  location = $Location
}

New-AzResourceGroupDeployment `
  -ResourceGroupName $ResourceGroupName `
  -TemplateParameterObject $params `
  -TemplateFile $BicepTemplate `
  -SkipTemplateParameterPrompt
```

---

This command deploys the following.
- An Azure resource group.
- A Container Apps environment.
- A Log Analytics workspace associated with the Container Apps environment.
- An Application Insights resource for distributed tracing.
- A user-assigned managed identity.
- A container to store the image.
- A container app based on the image.

If you receive the error `Failed to parse '<YOUR_BICEP_FILE_NAME>', please check whether it is a valid JSON format`, make sure your Bicep template file has the extension `.bicep`.

## Additional resources

For more information, see the following.
- [Bicep format](/azure/templates/microsoft.app/containerapps?pivots=deployment-language-bicep)
- [Example Bicep templates](/azure/templates/microsoft.app/containerapps?pivots=deployment-language-bicep#quickstart-templates)
- [Using Managed Identity and Bicep to pull images with Azure Container Apps](https://azureossd.github.io/2023/01/03/Using-Managed-Identity-and-Bicep-to-pull-images-with-Azure-Container-Apps/)

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Managed identities in Azure Container Apps](managed-identity.md)
