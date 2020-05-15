---
title: Azure CLI Script Deploy Sample
description: How to create a secure Service Fabric Linux cluster in Azure using the Azure Command Line Interface (CLI).
services: service-fabric
documentationcenter: 
author: athinanthny
manager: chackdan
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.topic: sample
ms.date: 01/18/2018
ms.author: atsenthi
ms.custom: mvc
---

# Create a secure Service Fabric Linux cluster in Azure

This command creates a self-signed certificate, adds it to a key vault and downloads the certificate locally.  The new certificate is used to secure the cluster when it deploys.  You can also use an existing certificate instead of creating a new one.  Either way, the certificate's subject name must match the domain that you use to access the Service Fabric cluster. This match is required to provide TLS for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain a TLS/SSL certificate from a CA for the `.cloudapp.azure.com` domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

If needed, install the [Azure CLI](/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

## Sample script

[!code-sh[main](../../../cli_scripts/service-fabric/create-cluster/create-cluster.sh "Deploy an application to a cluster")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group, cluster, and all related resources.

```azurecli
ResourceGroupName = "aztestclustergroup"
az group delete --name $ResourceGroupName
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az sf cluster create](https://docs.microsoft.com/cli/azure/sf/cluster?view=azure-cli-latest) | Creates a new Service Fabric cluster.  |

## Next steps

Additional Service Fabric CLI samples for Azure Service Fabric can be found in the [Service Fabric CLI samples](../samples-cli.md).
