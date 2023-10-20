---
title: Use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters (Preview)
description: Learn how to use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.custom: devx-track-azurecli
ms.topic: article
ms.date: 09/26/2023
---

# Use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters (Preview)

Azure Kubernetes Service (AKS) and its underlying container model provide increased scalability and manageability for cloud native applications. With AKS, you can launch flexible software applications according to the runtime needs of your system. However, this flexibility can introduce new challenges.

In these application environments, using signed container images helps verify that your deployments are built from a trusted entity and that images haven't been tampered with since their creation. Image Integrity is a service that allows you to add an Azure Policy built-in definition to verify that only signed images are deployed to your AKS clusters.

> [!NOTE]
> Image Integrity is a feature based on [Ratify][ratify]. On an AKS cluster, the feature name and property name is `ImageIntegrity`, while the relevant Image Integrity pods' names contain `Ratify`.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install].
* `aks-preview` CLI extension version 0.5.96 or later.
* Ensure that the Azure Policy add-on for AKS is enabled on your cluster. If you don't have this add-on installed, see [Install Azure Policy add-on for AKS](../governance/policy/concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-aks).
* An AKS cluster enabled with OIDC Issuer. To create a new cluster or update an existing cluster, see [Configure an AKS cluster with OIDC Issuer](./use-oidc-issuer.md).
* The `EnableImageIntegrityPreview` and `AKS-AzurePolicyExternalData` feature flags registered on your Azure subscription. Register the feature flags using the following commands:
  
    1. Register the `EnableImageIntegrityPreview` and `AKS-AzurePolicyExternalData` feature flags using the [`az feature register`][az-feature-register] command.

        ```azurecli-interactive
        # Register the EnableImageIntegrityPreview feature flag
        az feature register --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"

        # Register the AKS-AzurePolicyExternalData feature flag
        az feature register --namespace "Microsoft.ContainerService" --name "AKS-AzurePolicyExternalData"
        ```

        It may take a few minutes for the status to show as *Registered*.

    2. Verify the registration status using the [`az feature show`][az-feature-show] command.

        ```azurecli-interactive
        # Verify the EnableImageIntegrityPreview feature flag registration status
        az feature show --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"

        # Verify the AKS-AzurePolicyExternalData feature flag registration status
        az feature show --namespace "Microsoft.ContainerService" --name "AKS-AzurePolicyExternalData"
        ```

    3. Once the status shows *Registered*, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`][az-provider-register] command.

        ```azurecli-interactive
        az provider register --namespace Microsoft.ContainerService
        ```

## Considerations and limitations

* Your AKS clusters must run Kubernetes version 1.26 or above.
* You shouldn't use this feature for production Azure Container Registry (ACR) registries or workloads.
* Image Integrity supports a maximum of 200 unique signatures concurrently cluster-wide.
* Notation is the only supported verifier.
* Audit is the only supported verification policy effect.

## How Image Integrity works

:::image type="content" source="./media/image-integrity/aks-image-integrity-architecture.png" alt-text="Screenshot showing the basic architecture for Image Integrity." lightbox="./media/image-integrity/aks-image-integrity-architecture.png":::

Image Integrity uses Ratify, Azure Policy, and Gatekeeper to validate signed images before deploying them to your AKS clusters. Enabling Image Integrity on your cluster deploys a `Ratify` pod. This `Ratify` pod performs the following tasks:

1. Reconciles certificates from Azure Key Vault per the configuration you set up through `Ratify` CRDs.
2. Accesses images stored in ACR when validation requests come from [Azure Policy](../governance/policy/concepts/policy-for-kubernetes.md). To enable this experience, Azure Policy extends Gatekeeper, an admission controller webhook for [Open Policy Agent (OPA)](https://www.openpolicyagent.org/).
3. Determines whether the target image is signed with a trusted cert and therefore considered as *trusted*.
4. `AzurePolicy` and `Gatekeeper` consume the validation results as the compliance state to decide whether to allow the deployment request.

## Enable Image Integrity on your AKS cluster

> [!NOTE]
> Image signature verification is a governance-oriented scenario and leverages [Azure Policy](../governance/policy/concepts/policy-for-kubernetes.md) to verify image signatures on AKS clusters at-scale. We recommend using AKS's Image Integrity built-in Azure Policy initiative, which is available in [Azure Policy's built-in definition library](../governance/policy/samples/built-in-policies.md#kubernetes).

### [Azure CLI](#tab/azure-cli)

* Create a policy assignment with the AKS policy initiative *`[Preview]: Use Image Integrity to ensure only trusted images are deployed`* using the [`az policy assignment create`][az-policy-assignment-create] command.

    ```azurecli-interactive
    export SCOPE="/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}"
    export LOCATION=$(az group show -n ${RESOURCE_GROUP} --query location -o tsv)

    az policy assignment create --name 'deploy-trustedimages' --policy-set-definition 'af28bf8b-c669-4dd3-9137-1e68fdc61bd6' --display-name 'Audit deployment with unsigned container images' --scope ${SCOPE} --mi-system-assigned --role Contributor --identity-scope ${SCOPE} --location ${LOCATION}
    ```

    The `Ratify` pod deploys after you enable the feature.

> [!NOTE]
> The policy deploys the Image Integrity feature on your cluster when it detects any update operation on the cluster. If you want to enable the feature immediately, you need to create a policy remediation using the [`az policy remediation create`][az-policy-remediation-create] command.
>
> ```azurecli-interactive
> assignment_id=$(az policy assignment show -n 'deploy-trustedimages' --scope ${SCOPE} --query id -o tsv)
> az policy remediation create  -a "$assignment_id" --definition-reference-id deployAKSImageIntegrity -n remediation -g ${RESOURCE_GROUP}
> ```

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to the Azure Policy service named **Policy**.
2. Select **Definitions**.
3. Under **Categories**, select **Kubernetes**.
4. Choose the policy you want to apply. In this case, select **[Preview]: Use Image Integrity to ensure only trusted images are deployed** > **Assign**.
5. Set the **Scope** to the resource group where your AKS cluster is located.
6. Select **Review + create** > **Create** to submit the policy assignment.

---

## Set up verification configurations

For Image Integrity to properly verify the target signed image, you need to set up `Ratify` configurations through K8s [CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) using `kubectl`.

In this article, we use a self-signed CA cert from the official Ratify documentation to set up verification configurations. For more examples, see [Ratify CRDs](https://ratify.dev/docs/1.0/ratify-configuration).

1. Create a `VerifyConfig` file named `verify-config.yaml` and copy in the following YAML:

    ```YAML
    apiVersion: config.ratify.deislabs.io/v1beta1
    kind: CertificateStore
    metadata:
      name: certstore-inline
    spec:
      provider: inline
      parameters:
        value: |
          -----BEGIN CERTIFICATE-----
          MIIDQzCCAiugAwIBAgIUDxHQ9JxxmnrLWTA5rAtIZCzY8mMwDQYJKoZIhvcNAQEL
          BQAwKTEPMA0GA1UECgwGUmF0aWZ5MRYwFAYDVQQDDA1SYXRpZnkgU2FtcGxlMB4X
          DTIzMDYyOTA1MjgzMloXDTMzMDYyNjA1MjgzMlowKTEPMA0GA1UECgwGUmF0aWZ5
          MRYwFAYDVQQDDA1SYXRpZnkgU2FtcGxlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
          MIIBCgKCAQEAshmsL2VM9ojhgTVUUuEsZro9jfI27VKZJ4naWSHJihmOki7IoZS8
          3/3ATpkE1lGbduJ77M9UxQbEW1PnESB0bWtMQtjIbser3mFCn15yz4nBXiTIu/K4
          FYv6HVdc6/cds3jgfEFNw/8RVMBUGNUiSEWa1lV1zDM2v/8GekUr6SNvMyqtY8oo
          ItwxfUvlhgMNlLgd96mVnnPVLmPkCmXFN9iBMhSce6sn6P9oDIB+pr1ZpE4F5bwa
          gRBg2tWN3Tz9H/z2a51Xbn7hCT5OLBRlkorHJl2HKKRoXz1hBgR8xOL+zRySH9Qo
          3yx6WvluYDNfVbCREzKJf9fFiQeVe0EJOwIDAQABo2MwYTAdBgNVHQ4EFgQUKzci
          EKCDwPBn4I1YZ+sDdnxEir4wHwYDVR0jBBgwFoAUKzciEKCDwPBn4I1YZ+sDdnxE
          ir4wDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAgQwDQYJKoZIhvcNAQEL
          BQADggEBAGh6duwc1MvV+PUYvIkDfgj158KtYX+bv4PmcV/aemQUoArqM1ECYFjt
          BlBVmTRJA0lijU5I0oZje80zW7P8M8pra0BM6x3cPnh/oZGrsuMizd4h5b5TnwuJ
          hRvKFFUVeHn9kORbyQwRQ5SpL8cRGyYp+T6ncEmo0jdIOM5dgfdhwHgb+i3TejcF
          90sUs65zovUjv1wa11SqOdu12cCj/MYp+H8j2lpaLL2t0cbFJlBY6DNJgxr5qync
          cz8gbXrZmNbzC7W5QK5J7fcx6tlffOpt5cm427f9NiK2tira50HU7gC3HJkbiSTp
          Xw10iXXMZzSbQ0/Hj2BF4B40WfAkgRg=
          -----END CERTIFICATE-----
    ---
    apiVersion: config.ratify.deislabs.io/v1beta1
    kind: Store
    metadata:
      name: store-oras
    spec:
      name: oras
    ---
    apiVersion: config.ratify.deislabs.io/v1beta1
    kind: Verifier
    metadata:
      name: verifier-notary-inline
    spec:
      name: notation
      artifactTypes: application/vnd.cncf.notary.signature
      parameters:
        verificationCertStores:  # certificates for validating signatures
          certs: # name of the trustStore
            - certstore-inline # name of the certificate store CRD to include in this trustStore
        trustPolicyDoc: # policy language that indicates which identities are trusted to produce artifacts
          version: "1.0"
          trustPolicies:
            - name: default
              registryScopes:
                - "*"
              signatureVerification:
                level: strict
              trustStores:
                - ca:certs
              trustedIdentities:
                - "*"
    ```

2. Apply the `VerifyConfig` to your cluster using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f verify-config.yaml
    ```

## Deploy sample images to your AKS cluster

* Deploy a signed image using the `kubectl run demo` command.

    ```azurecli-interactive
    kubectl run demo-signed --image=ghcr.io/deislabs/ratify/notary-image:signed 
    ```

    The following example output shows that Image Integrity allows the deployment:

    ```output
    ghcr.io/deislabs/ratify/notary-image:signed
    pod/demo-signed created
    ```

If you want to use your own images, see the [guidance for image signing](../container-registry/container-registry-tutorial-sign-build-push.md).

## Disable Image Integrity

* Disable Image Integrity on your cluster using the [`az aks update`][az-aks-update] command with the `--disable-image-integrity` flag.

    ```azurecli-interactive
    az aks update -g myResourceGroup -n MyManagedCluster --disable-image-integrity
    ```

### Remove policy initiative

* Remove the policy initiative using the [`az policy assignment delete`][az-policy-assignment-delete] command.

    ```azurecli-interactive
    az policy assignment delete --name 'deploy-trustedimages'
    ```

## Next steps

In this article, you learned how to use Image Integrity to validate signed images before deploying them to your Azure Kubernetes Service (AKS) clusters. If you want to learn how to sign your own containers, see [Build, sign, and verify container images using Notary and Azure Key Vault (Preview)](../container-registry/container-registry-tutorial-sign-build-push.md).

<!--- Internal links ---->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-policy-assignment-create]: /cli/azure/policy/assignment#az_policy_assignment_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[az-policy-assignment-delete]: /cli/azure/policy/assignment#az_policy_assignment_delete
[az-policy-remediation-create]: /cli/azure/policy/remediation#az_policy_remediation_create

<!--- External links ---->
[ratify]: https://github.com/deislabs/ratify
[image-integrity-policy]: https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcf426bb8-b320-4321-8545-1b784a5df3a4
