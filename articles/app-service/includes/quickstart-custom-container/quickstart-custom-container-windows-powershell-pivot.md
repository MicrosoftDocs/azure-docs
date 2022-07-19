---
author: msangapu-msft
ms.service: app-service
ms.devlang: powershell
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Azure Container Registry to Azure App Service. 

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- The <a href="/powershell/azure/install-az-ps" target="_blank">Azure PowerShell</a>.
- [Az PowerShell Module](/powershell/azure/install-az-ps#installation)
- [Docker for Windows](https://docs.docker.com/docker-for-windows/)

## 1 - Connect your Azure account

Sign into your Azure account by using the [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) command and following the prompt:

```azurepowershell-interactive
Connect-AzAccount
```

## 2 - Create a new resource group

Create a new Resource Group by using the [New-AzResourceGroup](/powershell/module/az.websites/myResourceGroup) command:

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "eastus"
```

## 3 - Create your App Service Plan

Create a new App service Plan by using the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command:

```azurepowershell-interactive
New-AzAppServicePlan -Name "myAppServicePlan" -Location "eastus" -ResourceGroupName "myResourceGroup" -Tier PremiumV3 -HyperV
```

## - Create container registry

Next, create a container registry in your new resource group with the [New-AzContainerRegistry][New-AzContainerRegistry] command.

The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. The following example creates a registry named "myContainerRegistry007." Replace *myContainerRegistry007* in the following command, then run it to create the registry:

```azurepowershell-interactive
$registry = New-AzContainerRegistry -ResourceGroupName "my-xenon-rg" -Name "myContainerRegistry0079" -EnableAdminUser -Sku Basic
```

## - Log in to registry

Before pushing and pulling container images, you must log in to your registry with the [Connect-AzContainerRegistry][connect-azcontainerregistry] cmdlet. The following example uses the same credentials you logged in with when authenticating to Azure with the `Connect-AzAccount` cmdlet.

> [!NOTE]
> In the following example, the value of `$registry.Name` is the resource name, not the fully qualified registry name.

```azurepowershell-interactive
Connect-AzContainerRegistry -Name $registry.Name
```

The command returns `Login Succeeded` once completed.
## - Push the image to registry

Before you can push an image to your registry, you must tag it with the fully qualified name of your registry login server. The login server name is in the format *\<registry-name\>.azurecr.io* (must be all lowercase), for example, *mycontainerregistry.azurecr.io*.

Tag the image using the [docker tag][docker-tag] command. Replace `<login-server>` with the login server name of your ACR instance.

```docker
docker tag mcr.microsoft.com/azure-app-service/windows/parkingpage:latest mycontainerregistry0079.azurecr.io/windows:latest
```

Finally, use [docker push][docker-push] to push the image to the registry instance. Replace `<login-server>` with the login server name of your registry instance. This example creates the **hello-world** repository, containing the `hello-world:v1` image.

```docker
docker push mycontainerregistry0079.azurecr.io/windows:latest
```

## Get registry credentials

In order to create the web app with a container image located in Azure Container Registry, you need to get the registry login credentials using [Get-AzContainerRegistryCredential]() as shown below:

```azurepowershell-interactive
$pass = Get-AzContainerRegistryCredential -ResourceGroupName "my-xenon-rg" -Name "myContainerRegistry0079"
```

The password is returned as plain text. You need to convert it to a secure string in order to access the registry in the create step.

```azurepowershell-interactive
    $securePassword = ConvertTo-SecureString $pass.password -AsPlainText -Force
```

##  - Create your web app

Create a new app by using the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command:

```azurepowershell-interactive
New-AzWebApp -Name "app" -AppServicePlan "PV3ASP" -Location "eastus" -ResourceGroupName "my-xenon-rg"  -ContainerRegistryUrl "mycontainerregistry0079.azurecr.io" -ContainerRegistryUser $pass.username -ContainerRegistryPassword $securePassword -ContainerImageName "mycontainerregistry0079.azurecr.io/windows:latest"
```

    - The Location parameter specifies
    - The ResourceGroupName parameter
    - The ContainerImageName parameter specifies a Container Image Name and optional tag, for example (image:tag).
    - Replace `<app-name>` with a name that's unique across all of Azure (*valid characters are `a-z`, `0-9`, and `-`*). A combination of your company name and an app identifier is a good pattern.

    The command might take a few minutes to complete. While running, it creates the App Service resource.


##  - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows-powershell.png" alt-text="Screenshot of the Windows App Service with PowerShell.":::

Note that the Host operating system appears in the footer, confirming we are running in a Windows container.

## 6 - Clean up resources

```azurepowershell-interactive
Remove-AzResourceGroup my-xenon-rg
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
