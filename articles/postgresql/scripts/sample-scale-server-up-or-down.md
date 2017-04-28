---
title: "Azure CLI Script-Scale Azure Database for PostgreSQL | Microsoft Docs"
description: "Azure CLI Script Sample - Scale Azure Database for PostgreSQL server to a different performance level after querying the metrics."
services: postgresql
author: salonisonpal
ms.author: salonis
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: postgresql-database
ms.tgt_pltfrm: portal
ms.devlang: azurecli
ms.topic: article
ms.date: 04/30/2017
---
# Monitor and scale a single PostgreSQL server using Azure CLI
This sample CLI script scales a single Azure Database for PostgreSQL server to a different performance level after querying the metrics. 

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

## Sample script
```azurecli
#!/bin/bash
# Set an admin login and password for your database
adminlogin=ServerAdmin
password=ChangeYourAdminPassword1

# the logical server name has to be unique in the system
servername=server-$RANDOM

# Create a resource group
az group create \
--name myResourceGroup \
--location westus

# Create a PostgreSQL server in the resource group
az postgres server create \
--name $servername \
--resource-group myResourceGroup \
--location westus \
--admin-user $adminlogin \
--admin-password $password \
--performance-tier Standard \
--compute-units 100 \

# Monitor usage metrics
<need to update>

# Scale up the server to provision more Compute Units
az postgres server update \
--resource-group myResourceGroup \
--name $servername \
--compute-units 400
```

## Clean up deployment
After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.
```azurecli
az group delete --name myResourceGroup
```

## Next steps
- For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
- Additional Azure Database for PostgreSQL CLI script samples can be found in the [Azure Database for PostgreSQL documentation](../sample-scripts-azure-cli.md).
- For more information on scaling, see [Service Tiers](../concepts-service-tiers.md) and [Compute Units and Storage Units](../concepts-compute-unit-and-storage.md).