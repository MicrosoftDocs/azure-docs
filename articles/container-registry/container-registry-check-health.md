---
title: Check health of an Azure container registry
description: Learn how to run a quick diagnostic command to identify common problems when using an Azure container registry, including local Docker configuration and connectivity to the registry
services: container-registry
author: dlepow
ms.service: container-registry
ms.topic: article
ms.date: 06/25/2019
ms.author: danlep
---
# Check the health of an Azure container registry

When using an Azure container registry, you might occasionally encounter problems. For example, you might not be able to pull a container image because of an issue with Docker in your local environment. Or, a network issue might prevent you from connecting to the registry. 

As a first diagnostic step, use the [az acr check-health][az-acr-check-health] command to get information about the health of the environment and optionally connectivity to a target registry. This command is available in Azure CLI version 2.0.67 or later. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Run `az acr check-health`

The follow examples show different ways to run the `az acr check-health` command.

> [!NOTE]
> If you run the command in Azure Cloud Shell, the local environment is not checked. However, you can check the health of a target registry.

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

## Error reporting

The command reports problems to the standard output. For each problem, it provides an error code and description. For more information about the codes and possible solutions, see [Error reference](#error-reference) later in this article
.

By default, the command stops when it first encounters a problem. You can also run the command so that it provides output only when all health checks are complete. Add the `--ignore-errors` parameter, as shown in the following examples:

```azurecli
# Check environment only
az acr check-health --ignore-errors

# Check environment and target registry
az acr check-health --name myregistry --ignore-errors
```        

## Error reference

Following are details about error codes returned by the [az acr check-health][az-acr-check-health] command. For each error, possible solutions are listed.

### DOCKER_COMMAND_ERROR

This error means that Docker client for CLI could not be found. As a result, the following additional checks are not run: finding Docker version, evaluating Docker daemon status, and running a Docker pull command.

*Potential solutions*: Install Docker client; add Docker path to the system variables.

### DOCKER_DAEMON_ERROR

This error means that the Docker daemon status is unavailable, or that it could not be reached using the CLI. As a result, Docker operations (such as `docker login` and `docker pull`) are unavailable through the CLI.

*Potential solutions*: Restart Docker daemon, or validate that it is properly installed.

### DOCKER_VERSION_ERROR

This error means that CLI was not able to run the command `docker --version`.

*Potential solutions*: Try running the command manually, make sure you have the latest CLI version, and investigate the error message.

### DOCKER_PULL_ERROR

This error means that the CLI was not able to pull a sample image to your environment.

*Potential solutions*: Validate that all components necessary to pull an image are running properly.

### HELM_COMMAND_ERROR

This error means that Helm client could not be found by the CLI, which precludes other Helm operations.

*Potential solutions*: Verify that Helm client is installed, and that its path is added to the system environment variables.

### HELM_VERSION_ERROR

This error means that the CLI was unable to determine the Helm version installed. This can happen if the Azure CLI version (or if the Helm version) being used is obsolete.

*Potential solutions*: Update to the latest Azure CLI version or to the recommended Helm version; run the command manually and investigate the error message.

### CONNECTIVITY_DNS_ERROR

This error means that the DNS for the given registry login server was pinged but did not respond, which means it is unavailable. This can indicate some connectivity issues. Alternatively, the registry might not exist, the user might not have the permissions on the registry (to retrieve its login server properly), or the target registry is in a different cloud than the one used in the Azure CLI.

*Potential solutions*: Validate connectivity; verify spelling of the registry, and that registry exists; verify that the user has the right permissions on it and that the registry's cloud is the same that is used in the Azure CLI.

### CONNECTIVITY_FORBIDDEN_ERROR

This error means that the challenge endpoint for the given registry responded with a 403 Forbidden HTTP status. This error means that users don't have access to the registry, most likely because of a virtual network configuration.

*Potential solutions*: Remove virtual network rules, or add the current client IP address to the allowed list.

### CONNECTIVITY_CHALLENGE_ERROR

This error means that the challenge endpoint of the target registry did not issue a challenge.

*Potential solutions*: Try again after some time. If the error persists, open an issue at https://aka.ms/acr/issues.

### CONNECTIVITY_AAD_LOGIN_ERROR

This error means that the challenge endpoint of the target registry issued a challenge, but the registry does not support Azure Active Directory authentication.

*Potential solutions*: Try a different way to authenticate, for example, with admin credentials. If users need  to authenticate using Azure Active Directory, open an issue at https://aka.ms/acr/issues.

### CONNECTIVITY_REFRESH_TOKEN_ERROR

This error means that the registry login server did not respond with a refresh token, so access to the target registry was denied. This error can occur if the user does not have the right permissions on the registry or if the user credentials for the  Azure CLI are stale.

*Potential solutions*: Verify if the user has the right permissions on the registry; run `az login` to refresh permissions, tokens, and credentials.

### CONNECTIVITY_ACCESS_TOKEN_ERROR

This error means that the registry login server did not respond with an access token, so that the access to the target registry was denied. This error can occur if the user does not have the right permissions on the registry or if the user credentials for the Azure CLI are stale.

*Potential solutions*: Verify if the user has the right permissions on the registry; run `az login` to refresh permissions, tokens, and credentials.

### LOGIN_SERVER_ERROR

This error means that the CLI was unable to find the login server of the given registry, and no default suffix was found for the current cloud. This error can occur if the registry does not exist, if the user does not have the right permissions on the registry, if the registry's cloud and the current Azure CLI cloud do not match, or if the Azure CLI version is obsolete.

*Potential solutions*: Verify that the spelling is correct and that the registry exists; verify that user has the right permissions on the registry, and that the clouds of the registry and the CLI environment match; update Azure CLI to the latest version.

## Next steps

See the [FAQ](container-registry-faq.md) for frequently asked questions and other known issues about Azure Container Registry.





<!-- LINKS - internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-check-health]: /cli/azure/acr#az-acr-check-health
