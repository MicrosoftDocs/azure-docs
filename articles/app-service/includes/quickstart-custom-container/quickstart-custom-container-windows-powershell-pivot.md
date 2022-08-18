---
author: msangapu-msft
ms.service: app-service
ms.devlang: powershell
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

> [!NOTE]
> For information regarding running containerized applications in a serverless environment, please see [Container Apps](../../../container-apps/overview.md).
>

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Azure Container Registry to Azure App Service. 

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- <a href="/powershell/azure/install-az-ps" target="_blank">Azure PowerShell</a>.
- [Docker for Windows](https://docs.docker.com/docker-for-windows/)

## 1 - Setup

Sign into your Azure account by using the [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) command and following the prompt:

```azurepowershell-interactive
Connect-AzAccount
```

The variables below are needed for various commands used in the article. Update the variables per your specifications.

```powershell-interactive
$location = "eastus" # Azure region. Use Get-AzLocation to get all locations.
$appserviceplan = "PV3ASP" #App Service Plan name
$tier = "PremiumV3" #SKU 
$webappname = "myWebApp" #web app name
$resourcegroup = "myResourceGroup" #Name of Resource Group
$containerregistryname = "mycontainerregistry" #registry name (unique within Azure, with 5-50 alphanumeric characters)
$containerregistryURL = "myContainerregistry.azurecr.io" #registry URL
$containerimagename = "mycontainerregistry.azurecr.io/windows:latest" #container image name
```

## 2 - Create a new resource group

Create a new Resource Group by using the [New-AzResourceGroup](/powershell/module/az.websites/myResourceGroup) command:

```azurepowershell-interactive
New-AzResourceGroup -Name $resourcegroup -Location $location
```
## 3 - Create container registry

Next, create a container registry in your new resource group with the [New-AzContainerRegistry][New-AzContainerRegistry] command.

The following example creates a registry in the Basic SKU with Admin User enabled.

```azurepowershell-interactive
$registry = New-AzContainerRegistry -ResourceGroupName $resourcegroup -Name $containerregistryname -EnableAdminUser -Sku Basic
```

## 4 - Log in to registry

Before pushing and pulling container images, you must log in to your registry with the [Connect-AzContainerRegistry][connect-azcontainerregistry] cmdlet. The following example uses the same credentials you logged in with when authenticating to Azure with the `Connect-AzAccount` cmdlet.

> [!NOTE]
> In the following example, the value of `$registry.Name` is the resource name, not the fully qualified registry name.

```azurepowershell-interactive
Connect-AzContainerRegistry -Name $registry.Name
```

The command returns `Login Succeeded` once completed.
## 5 - Push the image to registry

Before you can push an image to your registry, you must tag it with the fully qualified name of your registry login server. The login server name is in the format *\<registry-name\>.azurecr.io* (must be all lowercase), for example, *mycontainerregistry.azurecr.io*.

Tag the image using the [docker tag][docker-tag] command. Replace `<login-server>` with the login server name of your ACR instance.

```docker
docker tag mcr.microsoft.com/azure-app-service/windows/parkingpage:latest mycontainerregistry.azurecr.io/windows:latest
```

Finally, use [docker push][docker-push] to push the image to the registry instance. Replace `<login-server>` with the login server name of your registry instance. This example creates the **hello-world** repository, containing the `hello-world:v1` image.

```docker
docker push mycontainerregistry.azurecr.io/windows:latest
```

## 6 - Get registry credentials

In order to create the web app with a container image located in Azure Container Registry, you need to get the registry login credentials using [Get-AzContainerRegistryCredential]() as shown below:

```azurepowershell-interactive
$pass = Get-AzContainerRegistryCredential -ResourceGroupName $resourcegroup -Name $containerregsitryname
```

You need to convert the password to a Secure String in order to access the registry in the create step.

```azurepowershell-interactive
$securePassword = ConvertTo-SecureString $pass.password -AsPlainText -Force
```

## 7 - Create your App Service Plan

Create a new App service Plan by using the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command:

```azurepowershell-interactive
New-AzAppServicePlan -Name $appserviceplan -Location $location -ResourceGroupName $resourcegroup -Tier $tier -HyperV
```


## 8 - Create your web app

Create a new app by using the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command:

```azurepowershell-interactive
New-AzWebApp -Name $webappname -AppServicePlan $appserviceplan -Location $location -ResourceGroupName $resourcegroup  -ContainerRegistryUrl $containerregistryURL -ContainerRegistryUser $pass.username -ContainerRegistryPassword $securePassword -ContainerImageName $containerimagename
```

- The Name parameter specifies the web app name.
- The AppServicePlan parameter specifies the App Service Plan Name.
- The Location parameter specifies the location.
- The ResourceGroupName parameter specifies the name of the Resource Group.
- The ContainerRegistryUrl parameter specifies the container registry URL.
- The ContainerRegistryUser parameter specifies the container registry username.
- The ContainerRegistryPassword parameter specifies the container registry password.
- The ContainerImageName parameter specifies a Container Image Name and optional tag, for example (image:tag).

The command might take a few minutes to complete. While running, it creates the App Service resource.

## 9 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows-powershell.png" alt-text="Screenshot of the Windows App Service with PowerShell.":::

Note that the Host operating system appears in the footer, confirming we are running in a Windows container.

## 10 - Clean up resources

```azurepowershell-interactive
Remove-AzResourceGroup myResourceGroup
```

## Next steps

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry every time it starts. If you rebuild your image, you just need to push it to your container registry, and the app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

> [!div class="nextstepaction"]
> [Configure custom container](../../configure-custom-container.md)

> [!div class="nextstepaction"]
> [Custom container tutorial](../../tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Multi-container app tutorial](../../tutorial-multi-container-app.md)
