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

When using an Azure container registry, you might occasionally encounter problems. For example, you might not be able to pull a container image because of an issue with Docker in your local environment. Or, you might not be able to connect to the registry because of a network connectivity problem. 

As a first diagnostic step, use the [az acr check-health][az-acr-check-health] command to get information about the health of the environment and optionally connectivity to a target registry. To run the command, use Azure CLI version 2.0.67 or later. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

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

If found, problems are reported to the standard output. By default, the command stops when it first encounters a problem. For each problem, an error code and description are provided. For more information about the codes and possible solutions, see [Error reference](#error-reference) later in this article.

To run the command so that it provides output only when all health checks are complete, add the `--ignore-errors` parameter. For example:

```azurecli
# Check environment only
az acr check-health --ignore-errors

# Check environment and target registry
az acr check-health --name myregistry --ignore-errors
```        

## Error reference

Following are details about error codes returned by the [az acr check-health][az-acr-check-health] command. For each error, possible solutions are listed.

### DOCKER_COMMAND_ERROR

This error means that Docker client for CLI could not be found, which precludes finding Docker version, evaluating Docker daemon status and ensuring Docker pull command can be run.

*Potential solutions*: installing Docker client; adding Docker path to the system variables.

### DOCKER_DAEMON_ERROR

This error means that the Docker daemon status is unavailable, or that it could not be reached using the CLI. This means that Docker operations (e.g., login, pull) will be unavailable through the CLI.

*Potential solutions*: Restart Docker daemon, or validate that it is properly installed.

### DOCKER_VERSION_ERROR

This error means that CLI was not able to run the command `Docker --version`.

*Potential solutions*: try running the command manually, make sure you have the latest CLI version, and investigate the error message.

### DOCKER_PULL_ERROR

This error means that the CLI was not able to pull a sample image to your environment.

*Potential solutions*: validate that all components necessary to pull an image are running properly.

### HELM_COMMAND_ERROR

This error means that Helm client could not be found by the CLI, which precludes other Helm operations.

*Potential solutions*: verify that Helm client is installed, and that its path is added to the system environment variables.

### HELM_VERSION_ERROR

This error means that the CLI was unable to determine the Helm version installed. This can happen if the Azure CLI version (or if the Helm version) being used is obsolete.

*Potential solutions*: update to the latest Azure CLI version or to the recommended Helm version; run the command manually and investigate the error message.

### CONNECTIVITY_DNS_ERROR

This error means that the DNS for the given registry login server was pinged but did not respond, which means it is unavailable. This can indicate some connectivity issues. This can also mean that the registry does not exist, that the user does not have the permissions on the registry (to retrieve its login server properly), or that the target registry is in a different cloud than the one being used in the Azure CLI.

*Potential solutions*: validate connectivity; verify spelling of the registry, and that registry exists; verify that the user has the right permissions on it and that the registry's cloud is the same that is being used on Azure CLI.

### CONNECTIVITY_FORBIDDEN_ERROR

This means that the challenge endpoint for the given registry responded with a 403 Forbidden HTTP status. This means that users don't have access to the registry, most likely due to a VNET configuration.

*Potential solutions*: remove virtual network rules or add the current client IP address to the allowed list.

### CONNECTIVITY_CHALLENGE_ERROR

This error means that the challenge endpoint of the target registry did not issue a challenge.

*Potential solutions*: try again after some time. If error persists, please open an issue at https://aka.ms/acr/issues.

### CONNECTIVITY_AAD_LOGIN_ERROR

This error means that the challenge endpoint of the target registry issued a challenge, but the registry does not support Azure Active Directory authentication.

*Potential solutions*: try a different way to authenticate, for example, with admin credentials. In case the user wants to authenticate using Azure Active Directory, please open an issue at https://aka.ms/acr/issues.

### CONNECTIVITY_REFRESH_TOKEN_ERROR

This means that the registry login server did not respond with a refresh token, which means that the access to the target registry was denied. This can happen if the user does not have the right permissions on the registry or if the user credentials for Azure CLI are obsolete.

*Potential solutions*: verify if the user has the right permissions on the registry; run `az login` to refresh permissions, tokens and credentials.

### CONNECTIVITY_ACCESS_TOKEN_ERROR

This means that the registry login server did not respond with an access token, which means that the access to the target registry was denied. This can happen if the user does not have the right permissions on the registry or if the user credentials for Azure CLI are obsolete.

*Potential solutions*: verify if the user has the right permissions on the registry; run `az login` to refresh permissions, tokens and credentials.

### LOGIN_SERVER_ERROR

This means that the CLI was unable to find the login server of the given registry, and no default suffix was found for the current cloud. This can happen if the registry does not exist, if the user does not have the right permissions on the registry, if the registry's cloud and the current Azure CLI cloud do not match, or if the Azure CLI version is obsolete.

*Potential solutions*: verify that the spelling is correct and that the registry exist; verify if user has the right permissions on the registry, and that the clouds of the registry and the CLI environment match; update Azure CLI to the latest version.

## Next steps

See the [FAQ](Docker-registry-faq.md) for frequently asked questions and other known issues about Azure Container Registry.





<!-- LINKS - internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-check-health]: /cli/azure/acr#az-acr-check-health
