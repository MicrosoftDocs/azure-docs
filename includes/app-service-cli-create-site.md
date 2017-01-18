## Create an App Service Site with Azure CLI 2.0

> [!NOTE]
> This article assumes that you have followed the [installation steps](https://github.com/azure/azure-cli#installation) for the Azure CLI 2.0.

> [!TIP]
> If you are familiar with Docker, you can use the [Azure CLI 2.0 Docker container](https://github.com/azure/azure-cli#docker-versioned) to complete these steps.

### Configuring Azure CLI 2.0

After you have installed the Azure CLI 2.0 commandline, you must configure it and select which subscription to use when running the commands.

**Command**

```cli
az configure
```

**Output**

```text
Welcome to the Azure CLI! This command will guide you through logging in and setting some default values.

Your global settings can be found at C:\Users\<username>\.azure\config
Your current settings can be found at C:\Users\<username>\.azure\context_config\default
Your current configuration is as follows:

[context]
cloud = AzureCloud

Do you wish to change your global settings? (y/N):
```

#### Login

**Command**

```cli
az login
```

**Output**

```text
To sign in, use a web browser to open the page https://aka.ms/devicelogin and enter the code ######### to authenticate.
```

> [!TIP]
> There is a possible scenario where you may have multiple Azure Subscriptions in your account. You can list these subscriptions using the following command:
> ```cli
> az account list --query '[].{Name:name,SubscriptionId:id}' -o table
> ```
>
> If you have access to multiple subscriptions, the following command will allow you to set the CLI tools to switch between those accounts.
> ```cli
> az account set --subscription <subscription-id>
> ```

### Create a Resource Group

> [!TIP]
> In order to successfully deploy an Resource Group, ensure that you are selecting a valid region. You can list available regions using the following command:
>
> ```cli
> az account list-locations --query '[].{Name:name}' -o table
> ```

| Token | Description |
|---|---|
| resource-group-name | The name to provide to the resource group |
| resource-group-location | The region in which to create your resource group.  |

```cli
az group create -n <resource-group-name> -l <resource-group-location>
```

### Create an App Service Plan

> [!TIP]
> In order to successfully deploy an App Service App, ensure that you are selecting a valid region. You can list available regions using the following command:
>
> ```cli
> az appservice list-locations --query '[].{Name:name}' -o table
> ```

**Command**

| Token | Description |
|---|---|
| plan-name | The name to give the App Service Plan |
| resource-group-name | The region you wish to deploy the App Service  |

```cli
az appservice plan create -g <resource-group-name> -n <plan-name>
```

**Output**

```text
{
  "adminSiteName": null,
  "geoRegion": "<resource-group-location>",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>",
  "kind": "app",
  "location": "<resource-group-location>",
  "maximumNumberOfWorkers": 3,
  "name": "<plan-name>",
  "numberOfSites": 0,
  "perSiteScaling": false,
  "reserved": false,
  "resourceGroup": "<resource-group-name>",
  "serverFarmWithRichSkuName": "<plan-name>",
  "sku": {
    "capacity": 1,
    "family": "B",
    "name": "B1",
    "size": "B1",
    "tier": "Basic"
  },
  "status": "Ready",
  "subscription": "<subscription-id>",
  "tags": null,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
}
```

### Create an App Service Site

| Token | Description |
|---|---|
| app-name | The name to give to the App Service Site |
| plan-name | The name to give the App Service Plan |
| resource-group-name | The region you wish to deploy the App Service |

**Command**

```cli
az appservice web create -n <app-name> -p <plan-name> -g <resource-group-name>
```

**Output**

```text
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "defaultHostName": "<app-name>.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "<app-name>.azurewebsites.net",
    "<app-name>.scm.azurewebsites.net"
  ],
  "gatewaySiteName": null,
  "hostNameSslStates": [
    {
      "name": "<app-name>.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "virtualIp": null
    },
    {
      "name": "<app-name>.scm.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "virtualIp": null
    }
  ],
  "hostNames": [
    "<app-name>.azurewebsites.net"
  ],
  "hostNamesDisabled": false,
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>",
  "isDefaultContainer": null,
  "kind": "app",
  "lastModifiedTimeUtc": "2017-01-17T19:22:15.870000",
  "location": "<resource-group-location>",
  "maxNumberOfWorkers": null,
  "microService": "WebSites",
  "name": "<app-name>",
  "outboundIpAddresses": "23.99.58.14,23.99.60.163,23.99.57.5,23.99.60.173",
  "premiumAppDeployed": null,
  "repositorySiteName": "<app-name>",
  "resourceGroup": "<resource-group-name>",
  "scmSiteAlsoStopped": false,
  "serverFarmId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/serverfarms/<plan-name>",
  "siteConfig": null,
  "siteName": "<app-name>",
  "state": "Running",
  "tags": null,
  "targetSwapSlot": null,
  "trafficManagerHostNames": null,
  "type": "Microsoft.Web/sites",
  "usageState": "Normal"
}
```