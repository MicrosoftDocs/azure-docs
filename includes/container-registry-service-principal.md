---
title: include file
description: include file
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: include
ms.date: 12/14/2018
ms.author: danlep
ms.custom: include file, devx-track-azurecli
---

## Create a service principal

To create a service principal with access to your container registry, run the following script in the [Azure Cloud Shell](../articles/cloud-shell/overview.md) or a local installation of the [Azure CLI](/cli/azure/install-azure-cli). The script is formatted for the Bash shell.

Before running the script, update the `ACR_NAME` variable with the name of your container registry. The `SERVICE_PRINCIPAL_NAME` value must be unique within your Azure Active Directory tenant. If you receive an "`'http://acr-service-principal' already exists.`" error, specify a different name for the service principal.

You can optionally modify the `--role` value in the [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] command if you want to grant different permissions. For a complete list of roles, see [ACR roles and permissions](https://github.com/Azure/acr/blob/master/docs/roles-and-permissions.md).

After you run the script, take note of the service principal's **ID** and **password**. Once you have its credentials, you can configure your applications and services to authenticate to your container registry as the service principal.

<!-- https://github.com/Azure-Samples/azure-cli-samples/blob/master/container-registry/create-registry/create-registry-service-principal-assign-role.sh -->
:::code language="azurecli" source="~/azure_cli_scripts/container-registry/create-registry/create-registry-service-principal-assign-role.sh" id="Create":::

### Use an existing service principal

To grant registry access to an existing service principal, you must assign a new role to the service principal. As with creating a new service principal, you can grant pull, push and pull, and owner access, among others.

The following script uses the [az role assignment create][az-role-assignment-create] command to grant *pull* permissions to a service principal you specify in the `SERVICE_PRINCIPAL_ID` variable. Adjust the `--role` value if you'd like to grant a different level of access.

<!-- https://github.com/Azure-Samples/azure-cli-samples/blob/master/container-registry/create-registry/create-registry-service-principal-assign-role.sh -->
:::code language="azurecli" source="~/azure_cli_scripts/container-registry/create-registry/create-registry-service-principal-assign-role.sh" id="Assign":::

<!-- LINKS - Internal -->
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
