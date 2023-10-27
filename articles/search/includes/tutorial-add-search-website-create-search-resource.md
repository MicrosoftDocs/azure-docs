---
ms.topic: include
ms.date: 07/18/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom: devx-track-azurepowershell
---

Create a new search resource from the command line using either the Azure CLI or Azure PowerShell. You also retrieve a query key used for read-access to the index, and get the built-in admin key used for adding objects.

You must have [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azps-windows) installed on your device. If you aren't a local admin on your device, choose Azure PowerShell and use the `Scope` parameter to run as the current user.

> [!NOTE]
> This task doesn't require the Visual Studio Code extensions for Azure CLI and Azure PowerShell. Visual Studio Code recognizes the command line tools without the extensions.

### [**Azure CLI**](#tab/azure-cli)

1. In Visual Studio Code, under **Terminal**, select **New Terminal**.

1. Connect to Azure:

   ```azurecli
   az login
   ```

1. Before creating a new search service, list the existing services for your subscription:

   ```azurecli
   az resource list --resource-type Microsoft.Search/searchServices --output table
   ```

   If you have a service that you want to use, note the name, and then skip ahead to the next section.

1. Create a new search service. Use the following command as a template, substituting valid values for the resource group, service name, tier, region, partitions, and replicas. The following statement uses the "cognitive-search-demo-rg" resource group created in a previous step and specifies the "free" tier. If your Azure subscription already has a free search service, specify a billable tier such as "basic" instead.

   ```azurecli
   az search service create --name my-cog-search-demo-svc --resource-group cognitive-search-demo-rg --sku free --partition-count 1 --replica-count 1
   ```

1. Get a query key that grants read access to a search service. A search service is provisioned with two admin keys and one query key. Substitute valid names for the resource group and search service. Copy the query key to Notepad so that you can paste it into the client code in a later step:

   ```azurecli
   az search query-key list --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
   ```

1. Get a search service admin API key. An admin API key provides write access to the search service. Copy either one of the admin keys to Notepad so that you can use it in the bulk import step that creates and loads an index:

   ```azurecli
   az search admin-key show --resource-group cognitive-search-demo-rg --service-name my-cog-search-demo-svc
   ```

### [**PowerShell**](#tab/azure-ps)

1. In Visual Studio Code, under **Terminal**, select **New Terminal**.

1. Connect to Azure:

   ```powershell
   Connect-AzAccount
   ```

   If you have multiple tenants and subscriptions, add the `TenantID` and `SubscriptionID` [parameters for Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to the cmdlet.

1. Before creating a new search service, you can list existing search services for your subscription to see if there's one you want to use:

   ```powershell
   Get-AzResource -ResourceType Microsoft.Search/searchServices | ft
   ```

    If you have a service that you want to use, note the name, and then skip ahead to the next section.

1. Load the **Az.Search** module (you can omit `Scope` if you're a local administrator):

   ```powershell
   Install-Module -Name Az.Search -Scope CurrentUser
   ```

1. Create a new search service. Use the following cmdlet as a template, substituting valid values for the resource group, service name, tier, region, partitions, and replicas. The following statement uses the "cognitive-search-demo-rg" resource group created in a previous step and specifies the "free" tier. If your Azure subscription already has a free search service, specify a billable tier such as "basic" instead. For more information about this cmdlet, see [Manage your Azure AI Search service with PowerShell](/azure/search/search-manage-powershell).

   ```powershell
   New-AzSearchService -ResourceGroupName "cognitive-search-demo-rg"  -Name "my-cog-search-demo-svc" -Sku "free" -Location "West US" -PartitionCount 1 -ReplicaCount 1 -HostingMode Default
   ```

1. Get a query key and copy it to Notepad for a future step:

   ```powershell
   Get-AzSearchQueryKey -ResourceGroupName "cognitive-search-demo-rg" -ServiceName "my-cog-search-demo-svc"
   ```

1. Get the admin keys and copy either one to Notepad for a future step:

   ```powershell
   Get-AzSearchAdminKeyPair -ResourceGroupName "cognitive-search-demo-rg" -ServiceName "my-cog-search-demo-svc"
   ```

You now have an Azure AI Search resource and keys used for authenticating requests on connections to the endpoint.

---
