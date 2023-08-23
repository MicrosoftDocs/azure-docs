---
author: msangapu-msft
ms.service: app-service
ms.devlang: powershell
ms.topic: quickstart
ms.date: 06/30/2022
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

This quickstart shows you how to deploy an ASP.NET app in a Windows image from [Microsoft Artifact Registry](https://mcr.microsoft.com/) to Azure App Service. 

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- <a href="/powershell/azure/install-az-ps" target="_blank">Azure PowerShell</a>.

## 1 - Connect to Azure

Sign into your Azure account by using the [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) command and following the prompt:

```azurepowershell-interactive
Connect-AzAccount
```

## 2 - Create a resource group

Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. To see all supported locations for App Service, run the [`Get-AzLocation`](/powershell/module/az.resources/get-azlocation) command.


```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
```
The command returns `Login Succeeded` once completed.

## 3 - Create your App Service Plan

Create a new App service Plan by using the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command.

The following example creates an App Service plan named `myAppServicePlan` in the **PremiumV3** pricing tier (`-Tier PremiumV3`). The `-HyperV` parameter specifies Windows container.

```azurepowershell-interactive
New-AzAppServicePlan -Name myAppServicePlan -Location eastus -ResourceGroupName myResourceGroup -Tier PremiumV3 -HyperV
```

## 4 - Create your web app

Create a new app by using the [New-AzWebApp](/powershell/module/az.websites/new-azwebapp) command:

```azurepowershell-interactive
New-AzWebApp -Name myWebApp -AppServicePlan myAppServicePlan -Location eastus -ResourceGroupName myResourceGroup -ContainerImageName mcr.microsoft.com/azure-app-service/windows/parkingpage:latest
```

- The Name parameter specifies the web app name.
- The AppServicePlan parameter specifies the App Service Plan Name.
- The Location parameter specifies the location.
- The ResourceGroupName parameter specifies the name of the Resource Group.
- The ContainerImageName parameter specifies a Container Image Name and optional tag.

The command might take a few minutes to complete. 

## 5 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows-powershell.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed will run in background mode.":::

## 6 - Clean up resources

Remove the resource group by using the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command:

```azurepowershell-interactive
Remove-AzResourceGroup myResourceGroup
```

## Next steps

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry every time it starts. If you rebuild your image, you just need to push it to your container registry, and the app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](../../tutorial-secure-domain-certificate.md)

> [!div class="nextstepaction"]
> [Migrate to Windows container in Azure](../../tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)

> [!div class="nextstepaction"]
> [Use Private Endpoints for App Service apps](../../networking/private-endpoint.md)

> [!div class="nextstepaction"]
> [Azure Monitor overview](/azure/azure-monitor/overview)

> [!div class="nextstepaction"]
> [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)

> [!div class="nextstepaction"]
> [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)

> [!div class="nextstepaction"]
> [Configure custom container](../../configure-custom-container.md)

> [!div class="nextstepaction"]
> [Multi-container app tutorial](../../tutorial-multi-container-app.md)
