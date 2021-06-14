---
title: Service Principal Credential Rotation
description: Discover how to rotate service principal credentials in Azure Red Hat OpenShift (ARO).
author: swiencki
ms.author: b-swiencki
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 05/31/2021
#Customer intent: As an operator I need to rotate service principal credentials
---
# Service Principal Credential Rotation for your Azure Red Hat OpenShift (ARO) Cluster
The article provides the necessary detail to rotate service principal credentials in Azure Red Hat OpenShift clusters ([ARO](https://github.com/Azure/ARO-RP)).

## Before You Begin
The article assumes that there is an existing ARO cluster with the latest updates applied.

The minimum Azure CLI requirements to rotate service principal credentials within an ARO cluster is 2.24.0.

To check the version of Azure CLI run:
```azurecli-interactive
# Azure CLI version
az --version
```
To install or upgrade Azure CLI please follow [Install Azure
CLI](/cli/azure/install-azure-cli).

The following instructions use bash syntax.

## Service Principal Credential Rotation
>[!IMPORTANT]
>  Service principal credential rotation can take upwards of 2 hours depending on cluster state.

Service principal credential rotation has two methods:
 - [Automated service principal credential rotation](#Automated-Service-Principal-Credential-Rotation)
 - [User provided secret-id and client-secret service principal credential rotation](#User-Provided-secret-id-and-client-secret-Service-Principal-Credential-Rotation)

### Automated Service Principal Credential Rotation <a id="Automated-Service-Principal-Credential-Rotation"></a>
>[!IMPORTANT]
>  Automated service principal credential rotation requires the ARO cluster to be created with Azure CLI version 2.24.0 or greater.

Automated service principal credential rotation will check if the service principal exists and rotate or create a new service principal.

Automatically rotate service principal credentials with the following command:

```azurecli-interactive
# Automatically rotate service principal credentials
az aro update --refresh-credentials --name MyManagedCluster --resource-group MyResourceGroup
```

### User Provided secret-id and client-secret Service Principal Credential Rotation <a id="User-Provided-secret-id-and-client-secret-Service-Principal-Credential-Rotation"></a>


Manually rotate service principal credentials with user provided secret-id and client-secret with the following instructions:

Retrieve the service principal clientId (`--secret-id`) and set it as `SP_ID` environment variable.
```azurecli-interactive
# Retrieve the service principal clientId
SP_ID=$(az aro show --name MyManagedCluster --resource-group MyResourceGroup \
    --query servicePrincipalProfile.clientId -o tsv)
```
Generate a new secure secret (`--client-secret`) for the service principal using the `SP_ID` variable above. Store the new secure secret as `SP_SECRET` environment variable.
```azurecli-interactive
# Generate a new secure secret for the service principal
SP_SECRET=$(az ad sp credential reset --name $SP_ID --query password -o tsv)
```
Rotate service principal credentials using the above environment variables.
```azurecli-interactive
# Rotate service principal credentials
az aro update --secret-id $SP_ID --client-secret $SP_SECRET \
    --name MyManagedCluster --resource-group MyResourceGroup
```

## Troubleshoot
### Service Principal Expiration Date
Service principal credentials have a set expiration date of a year and should be rotated within that given timeframe.

If the expiration date has passed the following errors are possible:
```bash
Failed to refresh the Token for request to MyResourceGroup StatusCode=401
Original Error: Request failed. Status Code = '401'.
[with]
Response body: {"error":"invalid_client","error_description": The provided client secret keys are expired.
[or]
Response body: {"error":"invalid_client","error_description": Invalid client secret is provided.
```
To check the expiration date of service principal credentials run the following:
```azurecli-interactive
# Service principal expiry in ISO 8601 UTC format
SP_ID=$(az aro show --name MyManagedCluster --resource-group MyResourceGroup \
    --query servicePrincipalProfile.clientId -o tsv)
az ad sp credential list --id $SP_ID --query "[].endDate" -o tsv
```
If the service principal credentials are expired please update using one of the two credential rotation methods.

### Cluster AAD application contains a client secret with an empty description
When using [automated service principal credential rotation](#Automated-Service-Principal-Credential-Rotation) the following error occurs:
```bash
$ az aro update --refresh-credentials --name MyManagedCluster --resource-group MyResourceGroup

Cluster AAD application contains a client secret with an empty description.
Please either manually remove the existing client secret and run `az aro update --refresh-credentials`,
or manually create a new client secret and run `az aro update --client-secret <ClientSecret>`.
```
The cluster has not been created using Azure CLI 2.24.0 or greater. Use the [user provided secret-id and client-secret service principal credential rotation](#User-Provided-secret-id-and-client-secret-Service-Principal-Credential-Rotation) method instead.

### Azure CLI ARO Update Help
For more details please see the Azure CLI ARO update help command:
```azurecli-interactive
# Azure CLI ARO update help
az aro update -h
```
