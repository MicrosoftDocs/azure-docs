---
title: Use Image Integrity to ensure only trusted images are deployed to your Azure Kubernetes Service (AKS) cluster
description: Learn how to use Image Integrity to ensure only trusted images are deployed to your Azure Kubernetes Service (AKS) cluster.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 07/10/2023
---

# Use Image Integrity to ensure only trusted images are deployed to your Azure Kubernetes Service (AKS) cluster (Preview)

Azure Kubernetes Service (AKS) and its underlying container model provide increased scalability and manageability for cloud native applications. It's easier than ever to launch flexible software applications according to the runtime needs of your system. This flexibility, however, can come with new challenges.  

In such environments, using signed container images can enable you to assure deployments are built from a trusted entity and verify images haven't been tampered with since their creation. Image Integrity is a service that allows you to add deploy-time policy enforcement to your AKS clusters to check whether the images are signed.

> [!NOTE]
> Image Integrity is a feature based on [Eraser](https://learn.microsoft.com/azure/aks/image-cleaner?tabs=azure-cli). On an AKS cluster, the feature name and property name is `ImageIntegrity`, while the relevant Image Cleaner pods' names contain `Eraser`.

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

* Your AKS clusters must run Kubernetes version 1.26 or above.
* You shouldn't use this feature for production ACR registries or workloads.
* A maximum of 200 unique signatures are supported concurrently cluster-wide.
* Notation is the only supported verifier.
* Audit is the only supported verification policy effect.

## How Image Integrity works

Enabling Image Integrity on your cluster also deploys a Ratify pod. This Ratify pod performs the following tasks:

1. Reconciles certificates from Azure Key Vault per the configuration you set up through Ratify CRDs.
2. Accesses images stored in ACR when validation requests comes from Gatekeeper.
3. Determines whether the target image is signed with a trusted cert and therefore considered as *trusted*.
4. Gatekeeper then consumes the validation results and returns the compliance state to Azure Policy for it to decide whether to allow the deployment request.

## Enable Image Integrity on your AKS cluster

> [!NOTE]
> Image signature verification is a governance-oriented scenario and is closely working with the Azure Policy. We recommend using AKS built-in policy to enable Image Integrity.

# [Azure CLI](#tab/azure-cli)

* Create a policy assignment with the AKS policy initiative *`[Preview]: Use Image Integrity to ensure only trusted images are deployed`* using the [`az policy assignment create`][az-policy-assignment-create] command.

    ```azurecli-interactive
    az policy assignment create --name 'deploy-trustedimages' --display-name 'Audit deployment with unsigned container images' --scope 'myResourceGroup' --policy '5dc99dae-cfb2-42cc-8762-9aae02b74e27'
    ```

    The `Ratify` pod is deployed after you enable the feature.

# [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to the Azure Policy service named **Policy**.
2. Select **Definitions**.
3. Under **Categories**, select **Kubernetes**.
4. Choose the policy you want to apply. In this case, select **[Preview]: Use Image Integrity to ensure only trusted images are deployed** > **Assign**.
5. Set the **Scope** to the resource group where your AKS cluster is located.
6. Select **Parameters** and update the **Effect** to *deny* to block new deployments from violating the baseline initiative. You can add extra namespaces to exclude from validation. For this example, keep the default values.
7. Select **Review + create** > **Create** to submit the policy assignment.

---

## Set up verification policy rules

## Deploy two sample images to your AKS cluster

1. Run a pod using a signed sample image using the `kubectl run demo` command.

    ```azurecli-interactive
    kubectl run demo --image=ghcr.io/deislabs/ratify/notary-image:signed 
    ```

    Image Integrity verifies the image signature and allows the deployment.

2. Deploy an unsigned image using the `kubectl run demo` command.

    ```azurecli-interactive
    kubectl run demo --image=ghcr.io/deislabs/ratify/notary-image:unsigned 
    ```

    Image Integrity verifies the image signature and denies the deployment since the image hasn't been signed and doesn't meet the deployment criteria.

## Disable Image Integrity

TBD

## Next steps

In this article, you learned how to use Image Integrity to ensure only trusted images are deployed to your AKS cluster.
