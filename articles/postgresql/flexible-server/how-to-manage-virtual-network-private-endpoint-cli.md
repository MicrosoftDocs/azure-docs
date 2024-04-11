---
title: Manage virtual networks with Private Link - CLI
description: Create an Azure Database for PostgreSQL - Flexible Server instance with public access by using the Azure CLI, and add private networking to the server based on Azure Private Link.
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 03/12/2024
---


# Create and manage virtual networks with Private Link for Azure Database for PostgreSQL - Flexible Server by using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server supports two types of mutually exclusive network connectivity methods to connect to your Azure Database for PostgreSQL flexible server instance. The two options are:

* Public access through allowed IP addresses. You can further secure that method by using [Azure Private Link](./concepts-networking-private-link.md)-based networking with Azure Database for PostgreSQL flexible server. The feature is in preview.
* Private access through virtual network integration.

This article focuses on creating an Azure Database for PostgreSQL flexible server instance with public access (allowed IP addresses) by using the Azure portal. You can then help secure the server by adding private networking based on Private Link technology.

You can use [Private Link](../../private-link/private-link-overview.md) to access the following services over a private endpoint in your virtual network:

* Azure platform as a service (PaaS) services, such as Azure Database for PostgreSQL flexible server
* Customer-owned or partner services that are hosted in Azure

Traffic between your virtual network and a service traverses the Microsoft backbone network, which eliminates exposure to the public internet.



## Prerequisites

To add an Azure Database for PostgreSQL flexible server instance to a virtual network by using Private Link, you need:

1.  A [virtual network](../../virtual-network/quick-create-portal.md#create-a-virtual-network). The virtual network and subnet should be in the same region and subscription as your Azure Database for PostgreSQL flexible server instance.

    Be sure to remove any locks (**Delete** or **Read only**) from your virtual network and all subnets before you add a server to the virtual network, because locks might interfere with operations on the network and DNS. You can reset the locks after server creation.


2. You need to sign in to your account using the [az login](/cli/azure/reference-index#az-login) command. Note the **ID** property, which refers to **Subscription ID** for your Azure account.

    ```azurecli
    az login
    ```

3.  Select the specific subscription under your account using [az account set](/cli/azure/account#az-account-set) command. Make a note of the **ID** value from the **az login** output to use as the value for **subscription** argument in the command. If you have multiple subscriptions, choose the appropriate subscription in which the resource should be billed. To get all your subscription, use [az account list](/cli/azure/account#az-account-list).

    ```azurecli
    az account set --subscription <subscription id>
    ```

## Create an Azure Database for PostgreSQL flexible server instance with a private endpoint

1. Create virtual network, private endpoint, private DNS zone and link it

   You can follow this Azure networking [doc](../../private-link/create-private-endpoint-cli.md) to complete these steps.

2. Create PostgreSQL Flexible Server with no public access

    ```azurecli

    az postgres flexible-server create --resource-group <resource_group_name> --name <server_name> --public-access 'None'
    ```

3. Approve the specified private endpoint connection created in first step associated with a PostgreSQL flexible server.

    ```azurecli
    az postgres flexible-server private-endpoint-connection approve -g <resource_group> -s <server_name> -n <connection_name>        --description "Approve connection"
    ```

## Next steps

* Learn more about [networking in Azure Database for PostgreSQL flexible server with Private Link](./concepts-networking-private-link.md).
* Understand more about [virtual network integration in Azure Database for PostgreSQL flexible server](./concepts-networking-private.md).


