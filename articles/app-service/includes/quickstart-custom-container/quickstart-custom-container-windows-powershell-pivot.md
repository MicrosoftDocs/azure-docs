---
author: msangapu-msft
ms.service: azure-app-service
ms.devlang: powershell
ms.topic: quickstart
ms.date: 002/14/2025
ms.author: msangapu
---

[Azure App Service](../../overview.md) provides predefined application stacks on Windows, like ASP.NET or Node.js, that run on IIS. The preconfigured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions. They let developers fully customize the containers and give containerized applications full access to Windows functionality.

This quickstart shows you how to deploy an ASP.NET app in a Windows image from [Microsoft Artifact Registry](https://mcr.microsoft.com/) to Azure App Service.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- [Azure PowerShell](/powershell/azure/install-az-ps).

## Connect to Azure

Sign into your Azure account by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and following the prompt:

```azurepowershell-interactive
Connect-AzAccount
```

## Create a resource group

Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. To see all supported locations for App Service, run the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location eastus
```

The command returns `Login Succeeded`.

## Create your App Service Plan

Create a new App service Plan by using the [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan) command.

The following example creates an App Service plan named `myAppServicePlan` in the **PremiumV3** pricing tier (`-Tier PremiumV3`). The `-HyperV` parameter specifies Windows container.

```azurepowershell-interactive
New-AzAppServicePlan -Name myAppServicePlan -Location eastus -ResourceGroupName myResourceGroup -Tier PremiumV3 -HyperV
```

## Create your web app

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

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

:::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows-powershell.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed runs in background mode." lightbox="../../media/quickstart-custom-container/browse-custom-container-windows-powershell.png":::

## Clean up resources

Remove the resource group by using the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command:

```azurepowershell-interactive
Remove-AzResourceGroup myResourceGroup
```

## Related content

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry each time it starts. If you rebuild your image, just push it to your container registry. The app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

- [Configure custom container](../../configure-custom-container.md)
- [How to use managed identities for App Service and Azure Functions](../../overview-managed-identity.md)
- [Application monitoring for Azure App Service overview](/azure/azure-monitor/app/azure-web-apps)
- [Azure Monitor overview](/azure/azure-monitor/overview)
- [Secure with custom domain and certificate](../../tutorial-secure-domain-certificate.md)
- [Integrate your app with an Azure virtual network](../../overview-vnet-integration.md)
- [Use Private Endpoints for App Service apps](../../networking/private-endpoint.md)
- [Use Azure Container Registry with Private Link](/azure/container-registry/container-registry-private-link)
- [Migrate to Windows container in Azure](../../tutorial-custom-container.md)
- [Deploy a container with Azure Pipelines](../../deploy-container-azure-pipelines.md)
- [Deploy a container with GitHub Actions](../../deploy-container-github-action.md)
