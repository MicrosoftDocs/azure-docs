## Set up Azure CLI for Azure DNS

### Before you begin

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* Install the latest version of the Azure CLI, available for Windows, Linux, or MAC. More information is available at [Install the Azure CLI](../articles/cli-install-nodejs.md).

### Sign in to your Azure account

Open a console window and authenticate with your credentials. For more information, see [Log in to Azure from the Azure CLI](../articles/xplat-cli-connect.md)

```azurecli
azure login
```

### Switch CLI mode

Azure DNS uses Azure Resource Manager. Make sure you switch CLI mode to use Azure Resource Manager commands.

```azurecli
azure config mode arm
```

### Select the subscription

Check the subscriptions for the account.

```azurecli
azure account list
```

Choose which of your Azure subscriptions to use.

```azurecli
azure account set "subscription name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```azurecli
azure group create -n myresourcegroup --location "West US"
```

### Register resource provider

The Azure DNS service is managed by the Microsoft.Network resource provider. Your Azure subscription must be registered to use this resource provider before you can use Azure DNS. This is a one-time operation for each subscription.

```azurecli
azure provider register --namespace Microsoft.Network
```

