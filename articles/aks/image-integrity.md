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
> Image Integrity is a feature based on [Ratify][ratify]. On an AKS cluster, the feature name and property name is `ImageIntegrity`, while the relevant Image Cleaner pods' names contain `Ratify`.

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI][azure-cli-install] or [Azure PowerShell][azure-powershell-install] and the `aks-preview` 0.5.96 or later CLI extension installed.
* The Azure Policy add-on for AKS. If you don't have this add-on installed, see [Install Azure Policy add-on for AKS](../governance/policy/concepts/policy-for-kubernetes#install-azure-policy-add-on-for-aks).
* An AKS cluster enabled with OIDC Issuer. To create a new cluster or update an existing cluster, see [Configure an AKS cluster with OIDC Issuer](/cluster-configuration#oidc-issuer).
* The `EnableImageIntegrityPreview` feature flag registered on your Azure subscription. Register the feature flag using the following commands:
  
    1. Register the `EnableImageIntegrityPreview` feature flag using the [`az feature register`][az-feature-register] command.

        ```azurecli
        az feature register --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

        It may take a few minutes for the status to show as *Registered*.

    2. Verify the registration status using the [`az feature show`][az-feature-show] command.

        ```azurecli
        az feature show --namespace "Microsoft.ContainerService" --name "EnableImageIntegrityPreview"
        ```

    3. Once that status shows *Registered*, refresh the registration of the `Microsoft.ContainerService` resource provider using the [`az provider register`][az-provider-register] command.

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

Enabling Image Integrity on your cluster also deploys a `Ratify` pod. This `Ratify` pod performs the following tasks: 1. Reconciles certificates from Azure Key Vault per the configuration you set up through `Ratify` CRDs. 2. Accesses images stored in ACR when validation requests come from `AzurePolicy`. 

`Ratify` will then determine whether the target image is signed with a trusted cert and therefore considered as *trusted*.`AzurePolicy` will consume the validation results as the compliance state to decide whether to allow the deployment request.

+Architect Diagram+

## Enable Image Integrity on your AKS cluster

> [!NOTE]
> Image signature verification is a governance-oriented scenario and it is closely working with the [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/policy-for-kubernetes). We recommend using AKS built-in policy to enable Image Integrity. Learn more about the [Image Integrity policy](TBDpolicylink) 

You can enable Image Integrity on your AKS cluster by creating a policy assigment through the following methods:

### [Azure CLI](#tab/azure-cli)

* Create a policy assignment with the AKS policy initiative *`[Preview]: Use Image Integrity to ensure only trusted images are deployed`* using the [`az policy assignment create`][az-policy-assignment-create] command.

    ```azurecli-interactive
    az policy assignment create --name 'deploy-trustedimages' --display-name 'Audit deployment with unsigned container images' --scope 'myResourceGroup' --policy '5dc99dae-cfb2-42cc-8762-9aae02b74e27'
    ```

    The `Ratify` pod is deployed after you enable the feature.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, navigate to the Azure Policy service named **Policy**.
2. Select **Definitions**.
3. Under **Categories**, select **Kubernetes**.
4. Choose the policy you want to apply. In this case, select **[Preview]: Use Image Integrity to ensure only trusted images are deployed** > **Assign**.
5. Set the **Scope** to the resource group where your AKS cluster is located.
6. Select **Parameters** and update the **Effect** to *deny* to block new deployments from violating the baseline initiative. You can add extra namespaces to exclude from validation. For this example, keep the default values.
7. Select **Review + create** > **Create** to submit the policy assignment.

---

## Set up verification configurations
For Image Integrity to properly verify the target signed image, you will need to set up `Ratify` configurations through K8s [CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#customresourcedefinitions) using natively supported `kubectl` commands.

> [!NOTE]
> Set up Image Integrity configurations through CRD is a temporary behavior of public preview. It is likely to change once GA.

Here's a sample CRD for you to try as a quickstart, see more examples at [Ratify CRDs](https://github.com/deislabs/ratify/blob/main/docs/reference/ratify-configuration.md)

First create an `VerifyConfig`. For example, save the following as `verify-config.yml`:
```yml
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
  name: notaryv2
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
And apply it to the cluster:

```bash
kubectl apply -f verify-config.yml
```

## Deploy two sample images to your AKS cluster

1. Deploy an unsigned image using the `kubectl run demo` command.

    ```azurecli-interactive
    kubectl run demo --image=ghcr.io/deislabs/ratify/notary-image:unsigned 
    ```

    Image Integrity verifies the image signature and denies the deployment since the image hasn't been signed and doesn't meet the deployment criteria.
   
3. Run a pod using a signed sample image using the `kubectl run demo` command.

    ```azurecli-interactive
    kubectl run demo --image=ghcr.io/deislabs/ratify/notary-image:signed 
    ```

    Image Integrity verifies the image signature and allows the deployment.

This is a quickstart sample, if you want to try your own image, follow the [guidance](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-sign-build-push#install-the-notation-cli-and-akv-plugin) for image signing.

## Disable Image Integrity

To stop using Image Integrity, you can disable it via the `--disable-image-integrity` flag:
```azurecli-interactive
az aks update -g myResourceGroup -n MyManagedCluster
  --disable-image-integrity
```

## Next steps

In this article, you learned [how to build and sign your own images.](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-sign-build-push#install-the-notation-cli-and-akv-plugin)
<!--- Internal links ---->

[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-policy-assignment-create]: /cli/azure/policy/assignment#az_policy_assignment_create

<!--- External links ---->

[ratify]: https://github.com/deislabs/ratify
