---
title: Manage firewall rules - Azure CLI - Azure Database for PostgreSQL - Flexible Server
description: Create and manage firewall rules for Azure Database for PostgreSQL - Flexible Server using Azure CLI command line.
author: sunilagarwal 
ms.author: sunila
ms.service: postgresql
ms.subservice: flexible-server
ms.devlang: azurecli
ms.topic: how-to
ms.date: 11/30/2021
ms.custom: devx-track-azurecli
---

# Create and manage Azure Database for PostgreSQL - Flexible Server firewall rules using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server supports two types of mutually exclusive network connectivity methods to connect to your flexible server. The two options are:

* Public access (allowed IP addresses)
* Private access (VNet Integration)

In this article, we will focus on creation of PostgreSQL server with **Public access (allowed IP addresses)** using Azure CLI and will provide an overview on Azure CLI commands you can use to create, update, delete, list, and show firewall rules after creation of server. With *Public access (allowed IP addresses)*, the connections to the PostgreSQL server are restricted to allowed IP addresses only. The client IP addresses need to be allowed in firewall rules. To learn more about it, refer to [Public access (allowed IP addresses)](./concepts-networking.md#public-access-allowed-ip-addresses). The firewall rules can be defined at the time of server creation (recommended) but can be added later as well.

## Launch Azure Cloud Shell

The [Azure Cloud Shell](../../cloud-shell/overview.md) is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

You'll need to sign in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **ID** property, which refers to **Subscription ID** for your Azure account.

```azurecli-interactive
az login
```

Select the specific subscription under your account using [az account set](/cli/azure/account#az-account-set) command. Make a note of the **ID** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

```azurecli
az account set --subscription <subscription id>
```

## Create firewall rule during flexible server create using Azure CLI

You can use the `az postgres flexible-server --public access` command to create the flexible server with *Public access (allowed IP addresses)* and configure the firewall rules during creation of flexible server. You can use the **--public-access** switch to provide the allowed IP addresses that will be able to connect to the server. You can provide single or range of IP addresses to be included in the allowed list of IPs. IP address range must be dash separated and does not contain any spaces. There are various options to create a flexible server using CLI as shown in the example below.

Refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters. For example, in the below commands you can optionally specify the resource group.

- Create a flexible server with public access and add client IP address to have access to the server
    ```azurecli-interactive
    az postgres flexible-server create --public-access <my_client_ip>
    ```
- Create a flexible server with public access and add the range of IP address to have access to this server

    ```azurecli-interactive
    az postgres flexible-server create --public-access <start_ip_address-end_ip_address>
    ```
- Create a flexible server with public access and allow applications from Azure IP addresses to connect to your flexible server
    ```azurecli-interactive
    az postgres flexible-server create --public-access 0.0.0.0
    ```
    > [!IMPORTANT]
    > This option configures the firewall to allow public access from Azure services and resources within Azure to this server including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
    >
- - Create a flexible server with public access and allow all IP address
    ```azurecli-interactive
    az postgres flexible-server create --public-access all
    ```
    >[!Note]
    > The above command will create a firewall rule with start IP address=0.0.0.0, end IP address=255.255.255.255 and no IP addresses will be blocked. Any host on the Internet can access this server. It is strongly recommended to use this rule only temporarily and only on test servers that do not contain sensitive data.
- Create a flexible server with public access and with no IP address
    ```azurecli-interactive
    az postgres flexible-server create --public-access none
    ```
    >[!Note]
    > we do not recommend to create a server without any firewall rules. If you do not add any firewall rules then no client will be able to connect to the server.
## Create and manage firewall rule after server create
The **az postgres flexible-server firewall-rule** command is used from the Azure CLI to create, delete, list, show, and update firewall rules.

Commands:
- **create**: Create an flexible server firewall rule.
- **list**: List the flexible server firewall rules.
- **update**: Update an flexible server firewall rule.
- **show**: Show the details of an flexible server firewall rule.
- **delete**: Delete an flexible server firewall rule.

Refer to the Azure CLI reference documentation <!--FIXME --> for the complete list of configurable CLI parameters. For example, in the below commands you can optionally specify the resource group.

### Create a firewall rule
Use the `az postgres flexible-server firewall-rule create` command to create new firewall rule on the server.
To allow access to a range of IP addresses, provide the IP address as the Start IP address and End IP address, as in this example. This command also expects Azure resource group name where server is located as a parameter. 
```azurecli-interactive
az postgres flexible-server firewall-rule create --name mydemoserver --resource-group testGroup --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.15
```

To allow access for a single IP address, just provide single IP address, as in this example.
```azurecli-interactive
az postgres flexible-server firewall-rule create --name mydemoserver  --resource-group testGroup  --start-ip-address 1.1.1.1
```

To allow applications from Azure IP addresses to connect to your flexible server, provide the IP address 0.0.0.0 as the Start IP, as in this example.
```azurecli-interactive
az postgres flexible-server firewall-rule create --name mydemoserver --resource-group testGroup --start-ip-address 0.0.0.0
```

> [!IMPORTANT]
> This option configures the firewall to allow public access from Azure services and resources within Azure to this server including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.
> 
Upon success, each create command output lists the details of the firewall rule you have created, in JSON format (by default). If there is a failure, the output shows error message text instead.

### List firewall rules 
Use the `az postgres flexible-server firewall-rule list` command to list the existing server firewall rules on the server. Notice that the server name attribute is specified in the **--name** switch. 
```azurecli-interactive
az postgres flexible-server firewall-rule list --name mydemoserver --resource-group testGroup
```
The output lists the rules, if any, in JSON format (by default). You can use the--output table** switch to output the results in a more readable table format.
```azurecli-interactive
az postgres flexible-server firewall-rule list --name mydemoserver --resource-group testGroup --output table
```

### Update a firewall rule
Use the `az postgres flexible-server firewall-rule update` command to update an existing firewall rule on the server. Provide the name of the existing firewall rule as input, as well as the start IP address and end IP address attributes to update.
```azurecli-interactive
az postgres flexible-server firewall-rule update --name mydemoserver --rule-name FirewallRule1 --resource-group testGroup --start-ip-address 13.83.152.0 --end-ip-address 13.83.152.1
```
Upon success, the command output lists the details of the firewall rule you have updated, in JSON format (by default). If there is a failure, the output shows error message text instead.

> [!NOTE]
> If the firewall rule does not exist, the rule is created by the update command.
### Show firewall rule details
Use the `az postgres flexible-server firewall-rule show` command to show the existing firewall rule details from the server. Provide the name of the existing firewall rule as input.
```azurecli-interactive
az postgres flexible-server firewall-rule show --name mydemoserver --rule-name FirewallRule1 --resource-group testGroup
```
Upon success, the command output lists the details of the firewall rule you have specified, in JSON format (by default). If there is a failure, the output shows error message text instead.

### Delete a firewall rule
Use the `az postgres flexible-server firewall-rule delete` command to delete an existing firewall rule from the server. Provide the name of the existing firewall rule.
```azurecli-interactive
az postgres flexible-server firewall-rule delete --name mydemoserver --rule-name FirewallRule1 --resource-group testGroup
```
Upon success, there is no output. Upon failure, error message text displays.

## Next steps
- Learn more about [Networking in Azure Database for PostgreSQL - Flexible Server](./concepts-networking.md)
- Understand more about [Azure Database for PostgreSQL - Flexible Server firewall rules](./concepts-networking.md#public-access-allowed-ip-addresses)
- [Create and manage Azure Database for PostgreSQL - Flexible Server firewall rules using the Azure portal](./how-to-manage-firewall-portal.md).
