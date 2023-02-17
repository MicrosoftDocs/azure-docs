---
title: Build, sign, and verify images using Notation in Azure Kubernetes Service (AKS)
description: Learn how to build, sign, and verify images using Notation in AKS.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 02/16/2023
---

# Build, sign, and verify images using Notation in Azure Kubernetes Service (AKS) (Preview)



[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* Azure CLI version x.x.x or later. Run `az --version` to find the current version. If you need to install or upgrade, see [Install Azure CLI](../../cli/azure/install-azure-cli.md).
* The Azure Policy add-on for AKS. If you don't have this add-on installed, see [Install Azure Policy add-on for AKS](../governance/policy/concepts/policy-for-kubernetes#install-azure-policy-add-on-for-aks).
* An AKS cluster enabled with OIDC Issuer. To create a new cluster or update an existing cluster, see [Configure an AKS cluster with OIDC Issuer](/cluster-configuration#oidc-issuer).
* The `EnableImageIntegrityPreview` feature flag registered on your Azure subscription. Register the feature flag using the following commands:
  
    1. Register the `EnableImageIntegrityPreview` feature flag using the [`az feature register`](https://learn.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-register) command.

        ```azurecli
        az feature register --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

        It may take a few minutes for the status to show as *Registered*.

    2. Verify the registration status using the [`az feature show`](https://learn.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-show) command.

        ```azurecli
        az feature show --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

    3. Once that status shows *Registered*, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`](https://learn.microsoft.com/cli/azure/provider?view=azure-cli-latest#az-provider-register) command.

        ```azurecli
        az provider register --namespace Microsoft.ContainerService
        ```

## Limitations

* Your AKS clusters must run Kubernetes version 1.24 or above.
* You shouldn't use this feature for production ACR registries or workloads.
* A maximum of 200 unique signatures are supported concurrently cluster-wide.
* Notation is the only supported verifier.
* Audit is the only supported verification policy effect.

## User flow

1. Store the signing certificate in AKV.
2. Build and sign image with Notation.
3. Create AKS cluster.
4. Assign the Image Integrity policy initiative.
5. Create identity with AKV and ACR permissions.
6. Create federated credential to bind with the Ratify add-on service account.
7. Dispatch Ratify Verify Config through CRDs.
8. Deploy application on AKS cluster.
9. If image wasn't signed with a trusted cert, the policy will show non-compliant.


## Next steps

