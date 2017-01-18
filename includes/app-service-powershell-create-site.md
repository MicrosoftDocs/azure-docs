## Create an App Service Site with Azure CLI 2.0

> [NOTE]
> This article assumes that you have followed the [installation steps](https://github.com/azure/azure-cli#installation) for the Azure CLI 2.0.

> [TIP]
> If you are familiar with Docker, you can use the [Azure CLI 2.0 Docker container](https://github.com/azure/azure-cli#docker-versioned) to complete these steps.

### Configuring Azure CLI 2.0

After you have installed the Azure CLI 2.0 commandline, you must configure it and select which subscription to use when running the commands.

#### Login

**Command**

```powershell
Login-AzureRmAccount
```

**Output**

Sign in using the dialogue box which opens.

![Azure PowerShell login window](media/app-service-powershell-create-site/app-service-powershell-login-screen.png)

> [TIP]
> There is a possible scenario where you may have multiple Azure Subscriptions in your account. You can list these subscriptions using the following command:
> ```powershell
> Get-AzureRmSubscription | Format-Table SubscriptionName, SubscriptionId
> ```
>
> If you have access to multiple subscriptions, the following command will allow you to set the CLI tools to switch between those accounts.
> ```powershell
> Select-AzureRmSubscription -SubscriptionId <subscription-id>
> ```

### Create a Resource Group

> [Tip]
> In order to successfully deploy an Resource Group, ensure that you are selecting a valid region. You can list available regions using the following command:
>
> ```powershell
> Get-AzureRMLocation | Format-Table DisplayName
> ```

| Token | Description |
|---|---|
| resource-group-name | The name to provide to the resource group |
| resource-group-location | The region in which to create your resource group.  |

```powershell
New-AzureRMResourceGroup -Name <resource-group-name> -Location <resource-group-location>
```

### Create an App Service Plan

> [Tip]
> In order to successfully deploy an App Service App, ensure that you are selecting a valid region. You can list available regions using the following command:
>
> ```powershell
> Get-AzureRMLocation | ? { $_.Providers -contains "Microsoft.Web" } | Format-Table DisplayName
> ```

**Command**

| Token | Description |
|---|---|
| plan-name | The name to give the App Service Plan |
| resource-group-name | The region you wish to deploy the App Service |
| resource-group-location | The region in which to create your resource group. |

```powershell
New-AzureRmAppServicePlan -Name <plan-name> -ResourceGroupName <resource-group-name> -Location <resource-group-location>
```

**Output**

```text
Sku                       : Microsoft.Azure.Management.WebSites.Models.SkuDescription
ServerFarmWithRichSkuName : <plan-name>
WorkerTierName            :
Status                    : Ready
Subscription              : <subscription-id>
AdminSiteName             :
HostingEnvironmentProfile :
MaximumNumberOfWorkers    : 1
GeoRegion                 : <resource-group-location>
PerSiteScaling            : False
NumberOfSites             : 0
ResourceGroup             : <resource-group-name>
Id                        : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>
Name                      : <plan-name>
Location                  : <resource-group-location>
Type                      : Microsoft.Web/serverfarms
Tags                      :

```

### Create an App Service Site

| Token | Description |
|---|---|
| app-name | The name to give to the App Service Site |
| plan-name | The name to give the App Service Plan |
| resource-group-name | The region you wish to deploy the App Service |
| resource-group-location | The region in which to create your resource group. |

**Command**

```powershell
New-AzureRmWebApp -Name <app-name> -Location <resource-group-location> -AppServicePlan <plan-name> -ResourceGroupName <resource-group-name>
```

**Output**

```text
SiteName                  : <app-name>
State                     : Running
HostNames                 : {<app-name>.azurewebsites.net}
RepositorySiteName        : <app-name>
UsageState                : Normal
Enabled                   : True
EnabledHostNames          : {<app-name>.azurewebsites.net, <app-name>.scm.azurewebsites.net}
AvailabilityState         : Normal
HostNameSslStates         : {<app-name>.azurewebsites.net, <app-name>.scm.azurewebsites.net}
ServerFarmId              : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>
LastModifiedTimeUtc       : 1/18/2017 1:35:06 AM
SiteConfig                : Microsoft.Azure.Management.WebSites.Models.SiteConfig
TrafficManagerHostNames   :
PremiumAppDeployed        :
ScmSiteAlsoStopped        : False
TargetSwapSlot            :
HostingEnvironmentProfile :
MicroService              : WebSites
GatewaySiteName           :
ClientAffinityEnabled     : True
ClientCertEnabled         : False
HostNamesDisabled         : False
OutboundIpAddresses       : 23.99.3.91,23.99.3.100,23.99.3.101,23.99.3.151
ContainerSize             : 0
MaxNumberOfWorkers        :
CloningInfo               :
ResourceGroup             : <resource-group-name>
IsDefaultContainer        :
DefaultHostName           : <app-name>.azurewebsites.net
Id                        : /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>
Name                      : <app-name>
Location                  : <resource-group-location>
Type                      : Microsoft.Web/sites
Tags                      :
```