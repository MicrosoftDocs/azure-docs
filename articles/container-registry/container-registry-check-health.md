---
title: Check registry health
description: Learn how to run a quick diagnostic command to identify common problems when using an Azure container registry, including local Docker configuration and connectivity to the registry
ms.topic: article
ms.custom: devx-track-azurecli
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---
# Check the health of an Azure container registry

When using an Azure container registry, you might occasionally encounter problems. For example, you might not be able to pull a container image because of an issue with Docker in your local environment. Or, a network issue might prevent you from connecting to the registry. 

As a first diagnostic step, run the [az acr check-health][az-acr-check-health] command to get information about the health of the environment and optionally access to a target registry. This command is available in Azure CLI version 2.0.67 or later. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

For additional registry troubleshooting guidance, see:
* [Troubleshoot registry login](container-registry-troubleshoot-login.md)
* [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md)
* [Troubleshoot registry performance](container-registry-troubleshoot-performance.md)

## Run az acr check-health

The follow examples show different ways to run the `az acr check-health` command.

> [!NOTE]
> If you run the command in Azure Cloud Shell, the local environment is not checked. However, you can check the access to a target registry.

### Check the environment only

To check the local Docker daemon, CLI version, and Helm client configuration, run the command without additional parameters:

```azurecli
az acr check-health
```

### Check the environment and a target registry

To check access to a registry as well as perform local environment checks, pass the name of a target registry. For example:

```azurecli
az acr check-health --name myregistry
```

### Check registry access in a virtual network

To verify DNS settings to route to a private endpoint, pass the virtual network's name or resource ID. The resource ID is required when the virtual network is in a different subscription or resource group than the registry.

```azurecli
az acr check-health --name myregistry --vnet myvnet
```

## Error reporting

The command logs information to the standard output. If a problem is detected, it provides an error code and description. For more information about the codes and possible solutions, see the [error reference](container-registry-health-error-reference.md).

By default, the command stops whenever it finds an error. You can also run the command so that it provides output for all health checks, even if errors are found. Add the `--ignore-errors` parameter, as shown in the following examples:

```azurecli
# Check environment only
az acr check-health --ignore-errors

# Check environment and target registry; skip confirmation to pull image
az acr check-health --name myregistry --ignore-errors --yes
```

Sample output:

```azurecli
az acr check-health --name myregistry --ignore-errors --yes
```

```output
Docker daemon status: available
Docker version: Docker version 18.09.2, build 6247962
Docker pull of 'mcr.microsoft.com/mcr/hello-world:latest' : OK
ACR CLI version: 2.2.9
Helm version:
Client: &version.Version{SemVer:"v2.14.1", GitCommit:"5270352a09c7e8b6e8c9593002a73535276507c0", GitTreeState:"clean"}
DNS lookup to myregistry.azurecr.io at IP 40.xxx.xxx.162 : OK
Challenge endpoint https://myregistry.azurecr.io/v2/ : OK
Fetch refresh token for registry 'myregistry.azurecr.io' : OK
Fetch access token for registry 'myregistry.azurecr.io' : OK
```  

## Check if registry is configured with quarantine 

Once you enable a container registry to be quarantined, every image you publish to this repository will be quarantined. Any attempts to access or pull quarantined images will fail with an error. For more information, See [pull the quarantine image](https://github.com/Azure/acr/tree/main/docs/preview/quarantine#pull-the-quarantined-image).

## Next steps

For details about error codes returned by the [az acr check-health][az-acr-check-health] command, see the [Health check error reference](container-registry-health-error-reference.md).

See the [FAQ](container-registry-faq.yml) for frequently asked questions and other known issues about Azure Container Registry.





<!-- LINKS - internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-check-health]: /cli/azure/acr#az_acr_check_health
