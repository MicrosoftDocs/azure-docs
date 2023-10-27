---
author: rhurey
ms.service: azure-ai-speech
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: include
ms.date: 06/18/2021
ms.author: rhurey
---


Follow these steps to create a [custom subdomain name for Azure AI services](../../../cognitive-services-custom-subdomains.md) for your Speech resource.

> [!CAUTION]
> When you turn on a custom domain name, the operation is [not reversible](../../../cognitive-services-custom-subdomains.md#can-i-change-a-custom-domain-name). The only way to go back to the [regional name](../../../cognitive-services-custom-subdomains.md#is-there-a-list-of-regional-endpoints) is to create a new Speech resource.
>
> If your Speech resource has a lot of associated custom models and projects created via [Speech Studio](https://aka.ms/speechstudio/customspeech), we strongly recommend trying the configuration with a test resource before you modify the resource used in production.

# [Azure portal](#tab/portal)

To create a custom domain name using the Azure portal, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required Speech resource.
1. In the **Resource Management** group on the left pane, select **Networking**.
1. On the **Firewalls and virtual networks** tab, select **Generate Custom Domain Name**. A new right panel appears with instructions to create a unique custom subdomain for your resource.
1. In the **Generate Custom Domain Name** panel, enter a custom domain name. Your full custom domain will look like:
    `https://{your custom name}.cognitiveservices.azure.com`. 
    
    Remember that after you create a custom domain name, it _cannot_ be changed.
    
    After you've entered your custom domain name, select **Save**.
1. After the operation finishes, in the **Resource management** group, select **Keys and Endpoint**. Confirm that the new endpoint name of your resource starts this way: `https://{your custom name}.cognitiveservices.azure.com`.

# [PowerShell](#tab/powershell)

To create a custom domain name by using PowerShell, confirm that your computer has PowerShell version 7.x or later with the Azure PowerShell module version 5.1.0 or later. To see the versions of these tools, follow these steps:

1. In a PowerShell window, enter:

    `$PSVersionTable`

    Confirm that the `PSVersion` value is 7.x or later. To upgrade PowerShell, follow the instructions at [Installing various versions of PowerShell](/powershell/scripting/install/installing-powershell).

1. In a PowerShell window, enter:

    `Get-Module -ListAvailable Az`

    If nothing appears, or if that version of the Azure PowerShell module is earlier than 5.1.0, follow the instructions at [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell) to upgrade.

Before you proceed, run `Connect-AzAccount` to create a connection with Azure.

## Verify that a custom domain name is available

Check whether the custom domain that you want to use is available. 
The following code confirms that the domain is available by using the [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) operation in the Azure AI services REST API.

> [!NOTE]
> The following code will *not* work in Azure Cloud Shell.

```azurepowershell
$subscriptionId = "Your Azure subscription Id"
$subdomainName = "custom domain name"

# Select the Azure subscription that contains the Speech resource.
# You can skip this step if your Azure account has only one active subscription.
Set-AzContext -SubscriptionId $subscriptionId

# Prepare the OAuth token to use in the request to the Azure AI services REST API.
$Context = Get-AzContext
$AccessToken = (Get-AzAccessToken -TenantId $Context.Tenant.Id).Token
$token = ConvertTo-SecureString -String $AccessToken -AsPlainText -Force

# Prepare and send the request to the Azure AI services REST API.
$uri = "https://management.azure.com/subscriptions/" + $subscriptionId + `
    "/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18"
$body = @{
subdomainName = $subdomainName
type = "Microsoft.CognitiveServices/accounts"
}
$jsonBody = $body | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Authentication Bearer `
    -Token $token -Body $jsonBody | Format-List
```
If the desired name is available, you'll see a response like this:
```azurepowershell
isSubdomainAvailable : True
reason               :
type                 :
subdomainName        : my-custom-name
```
If the name is already taken, then you'll see the following response:
```azurepowershell
isSubdomainAvailable : False
reason               : Sub domain name 'my-custom-name' is already used. Please pick a different name.
type                 :
subdomainName        : my-custom-name
```
## Create your custom domain name

To turn on a custom domain name for the selected Speech resource, use the [Set-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/set-azcognitiveservicesaccount) cmdlet.

> [!CAUTION]
> After the following code runs successfully, you'll create a custom domain name for your Speech resource. Remember that this name *cannot* be changed.

```azurepowershell
$resourceGroup = "Resource group name where Speech resource is located"
$speechResourceName = "Your Speech resource name"
$subdomainName = "custom domain name"

# Select the Azure subscription that contains the Speech resource.
# You can skip this step if your Azure account has only one active subscription.
$subscriptionId = "Your Azure subscription Id"
Set-AzContext -SubscriptionId $subscriptionId

# Set the custom domain name to the selected resource.
# WARNING: THIS CANNOT BE CHANGED OR UNDONE!
Set-AzCognitiveServicesAccount -ResourceGroupName $resourceGroup `
    -Name $speechResourceName -CustomSubdomainName $subdomainName
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

This section requires the latest version of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Verify that the custom domain name is available

Check whether the custom domain that you want to use is free. Use the [Check Domain Availability](/rest/api/cognitiveservices/accountmanagement/checkdomainavailability/checkdomainavailability) method from the Azure AI services REST API.

Copy the following code block, insert your preferred custom domain name, and save to the file `subdomain.json`.

```json
{
    "subdomainName": "custom domain name",
    "type": "Microsoft.CognitiveServices/accounts"
}
```

Copy the file to your current folder or upload it to Azure Cloud Shell and run the following command. Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription ID.

```azurecli-interactive
az rest --method post --url "https://management.azure.com/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18" --body @subdomain.json
```
If the desired name is available, you'll see a response like this:
```json
{
  "isSubdomainAvailable": true,
  "reason": null,
  "subdomainName": "my-custom-name",
  "type": null
}
```

If the name is already taken, then you'll see the following response:
```json
{
  "isSubdomainAvailable": false,
  "reason": "Sub domain name 'my-custom-name' is already used. Please pick a different name.",
  "subdomainName": "my-custom-name",
  "type": null
}
```
## Turn on a custom domain name

To use a custom domain name with the selected Speech resource, use the [az cognitiveservices account update](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-update) command.

(If your Azure account has only one active subscription, you can skip this step.) Select the Azure subscription that contains the Speech resource. Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your Azure subscription ID.
```azurecli-interactive
az account set --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Set the custom domain name to the selected resource. Replace the sample parameter values with the actual ones and run the following command.

> [!CAUTION]
> After successful execution of the following command, you'll create a custom domain name for your Speech resource. Remember that this name *cannot* be changed.

```azurecli-interactive
az cognitiveservices account update --name my-speech-resource-name --resource-group my-resource-group-name --custom-domain my-custom-name
```

***
