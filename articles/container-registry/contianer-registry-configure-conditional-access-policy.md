---
title: Configure conditional access to your Azure Container Registry
description: Learn how to configure conditional access to your Azure container registry by using Azure CLI and Azure Portal.
ms.topic: how-to
ms.date: 09/13/2021
ms.custom: devx-track-azurepowershell
ms.author: tejaswikolli
ms.reviewer: cegraybl 
---


# Prerequisites

* What is [Conditional Access Policy](conditional-access/overview.md)
* [Conditional Access Policy Conditions](conditional-access/overview.md#common-signals)
* [Conditional Access Policy Decisions](/azure/active-directory/conditional-access/overview.md#common-decisions)


# About the Conditional Access Policy

The [Conditional Access Policy](/azure/active-directory/conditional-access/overview.md) is designed to enforce strong authentication based on the location, the trusted and compliant devices, user assigned roles, authorization method and the client applications. 

The policy enables the security to meet the organizations compliance requirements and keep the data and user accounts safe.

# Azure Container Registry (ACR) introduces the conditional access policy

You can refer to the container registry's Conditional Access Policy in the Azure built-in policy definitions.

[!INCLUDE [azure-policy-reference-rp-containerreg](../../includes/policy/reference/byrp/microsoft.containerregistry.md)]. 

* You can enable or disable [policy enforcement](../governance/policy/concepts/assignment-structure.md#enforcement-mode) at any time.
* Enable conditional policy using the [Azure portal](../governance/policy/assign-policy-portal.md)
* Enable conditional policy using [Azure CLI](../governance/policy/assign-policy-azurecli.md)

# Enable conditional access policy in ACR - portal

You can enable registry's conditional policy in the [Azure portal](https://portal.azure.com). 

>* Sign in to the Azure portal as a global administrator, security 
>* Navigate to your **Resource Group**> **Azure Container Registry** > **Security** > **Conditional Access**.
>* Use the filters to limit compliance states or to search for policies.
>* Select **New policy**.
>* Give your policy a meaningful standard name. 
>* Under **Assignments**, select **Users and groups**.
>* Under **Include**, select **All users**.
>* Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts.
>* Select **Done**.
>* Under Cloud apps or actions > Include, select All Azure services
>* Under Exclude, select any Azure services that don't require multi-factor authentication.
>* Under Access controls > Grant, select Grant access, Require multi-factor authentication, and choose Select.
>* Confirm your settings and set Enable policy to Report-only.
>* Select Create to create to enable your policy.


# Enable conditional access in ACR - Azure CLI

You can use Azure CLI version 2.0.76 or later, run `az --version` to find the version. To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

 Run the [az policy assignment list](/cli/azure/policy/assignment#az-policy-assignment-list) command in the CLI to get the policy IDs of the Azure Container Registry policies that are applied:

```azurecli
az policy assignment list --query "[?contains(displayName,'Container Registries')].{name:displayName, ID:id}" --output table
```


## Clean up resources

To remove the assignment created, use the following command:

```azurecli-interactive
az policy assignment delete --name 'audit-vm-manageddisks' --scope '/subscriptions/<subscriptionID>/<resourceGroupName>'
```


## Next steps

To learn more about assigning policies to validate that new resources are compliant, continue to the

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)


