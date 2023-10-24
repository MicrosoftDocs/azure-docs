---
title: Confidential Containers (preview) with Azure Kubernetes Service (AKS)
description: Learn about and deploy confidential Containers (preview) on an Azure Kubernetes Service (AKS) cluster to maintain security and protect sensitive information.
ms.topic: article
ms.date: 10/24/2023
---

# Confidential Containers (preview) with Azure Kubernetes Service (AKS)

To help secure and protect your container workloads from untrusted or potentially malicious code, as part of our Zero trust cloud architecture, AKS includes Confidential Containers (preview) on Azure Kubernetes Service. Confidential Containers is based on Kata Confidential Containers and hardware-based encryption, to encrypt container memory that prevents data in memory during computation from being in clear text, readable format, and ensures data integrity. You can gain trust in the container memory encryption being enforced by hardware through attestation.

Together with [Pod Sandboxing][pod-sandboxing-overview], you can run sensitive workloads at this isolation level in Azure to protect your data and workloads from:

* Your AKS cluster admin
* The AKS control plane & daemon sets
* The cloud and host operator
* The AKS worker node operating system
* Another pod running on the same VM node
* Helps application owners enforce application security requirements (for example, deny access to Azure tenant admin, Kubernetes admin, etc).
* Access from Cloud Service Providers (CSPs)

With other security measures or data protection controls, as part of your overall architecture, these capabilities help you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand the Confidential Containers feature, and how to implement and configure the following:

* Deploy or upgrade an AKS cluster using the Azure CLI
* Add an annotation to your pod YAML to mark the pod as being run as a confidential container
* Add a security policy to your pod YAML
* Enable enforcement of the security policy
* Deploy your application confidentially

## Supported scenarios

Confidential Containers (preview) are appropriate for deployment scenarios that involve sensitive data, for instance, personally identifiable information (PII) or any data with strong security needed for regulatory compliance. Some examples of common scenarios with containers are:

- Privacy preserving big data analytics using Apache Spark analytics job for fraud pattern recognition in the financial sector.
- Running self-hosted GitHub runners to secure code signing as part of Continuous Integration and Continuous Deployment (CI/CD) DevOps practices.
- Machine Learning inferencing and training of ML models, using an encrypted data set from a trusted source and only decrypting inside a confidential container environment, for purposes of privacy preserving ML inference.
- Building big data clean rooms for ID matching as part of multi-party computation in industries like retail with digital advertising.
- Building confidential computing zero trust landing zones to meet privacy regulations for application migrations to cloud.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later.
- 
- The `ConfCom` Confidential Container Security Policy Generator Azure CLI extension 2.62.2 or later.

- Register the `Preview` feature in your Azure subscription.

- AKS supports Confidential Containers (preview) on version 1.25.0 and higher.

- To create a Microsoft Entra ID workload identity and configure a federated identity credential, see their [Preqequisites][entra-id-workload-identity-prerequisites] for role assignment.

- The identity you're using to create your cluster has the appropriate minimum permissions. For more information about access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][cluster-access-and-identity-options].

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

- Confidential containers on AKS provide a sidecar open source container for attestation and secure key release. The sidecar integrates with a Key Management Service (KMS), like Azure Key Vault, for releasing a key to the container group after validation has been completed. Deploying an [Azure Key Vault Managed HSM][azure-key-vault-managed-hardware-security-module] (Hardware Security Module) is optional but recommended to support container-level integrity and attestation. See [Provision and activate a Managed HSM][create-managed-hsm] to deploy Managed HSM.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

### Register the KataCcIsolationPreview feature flag

Register the `KataCcIsolationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name KataCcIsolationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## What to consider

The following are considrations with this preview of Confidential Containers (preview):

* You'll notice an increase in pod startup time compared to runc pods and kernel-isolated pods.
* Resource requests from pod manifests are being ignored by the Kata container. It's not recommended to specify resource requests.
* Pulling container images from a private container registry or referencing container images originating from a private container registry in a Confidential Containers pod manifest is not supported in this release.
* ConfigMaps and secrets values cannot be changed if setting using the environment variable method after the pod is deployed.
* Updates to secrets and ConfigMaps are not reflected in the guest.
* Ephemeral containers and other troubleshooting methods require a policy modification and redeployment. This includes `exec` in container
log output from containers. `stdio` (ReadStreamRequest and WriteStreamRequest) is enabled.
* Cronjob deployment type is not supported by the policy generator tool.
* Due to container measurements being encoded in the security policy, it's not recommended to use the `latest` tag when specifying containers. This is also a restriction with the policy generator tool.
* Services, Load Balancers, and EndpointSlices only support the TCP protocol.
* All containers in all pods on the clusters must be configured to `imagePullPolicy: Always`.
* The policy generator only supports pods that use IPv4 addresses.
* Version 1 container images are not supported.
* Resource requests from pod YAML manifest are ignored by the Kata container. Containerd does not pass requests to the shim. Use resource `limit` instead of resource `requests` to allocate memory or CPU resources for workloads or containers.
* The local container filesystem is backed by VM memory. Writing to the container filesystem (including logging) can fill up the memory provided to the pod. This can result in potential pod crashes.
* v1 container images are not supported.
* Pod termination logs are not supported. While pods may write termination logs to `/dev/termination-log` or to a custom location if specified in the pod manifest, the host/kubelet can't read those logs. Changes from guest to that file are not reflected on the host.

It's important you understand the memory and processor resource allocation behavior in this release.

* CPU: The shim assigns one vCPU to the base OS inside the pod. If no resource `limits` are specified, the workloads don't have separate CPU shares assigned, the vCPU is then shared with that workload. If CPU limits are specified, CPU shares are explicitly allocated for workloads.
* Memory: The Kata-CC handler uses 2GB memory for the UVM OS and X MB memory for containers based on resource `limits` if specified (resulting in a 2GB VM when no limit is given, w/o implicit memory for containers). The Kata handler uses 256MB base memory for the UVM OS and X MB memory when resource `limits` are specified. If limits are unspecified, an implicit limit of 1,792 MB is added (resulting in a 2GB VM when no limit is given, with 1,792 MB implicit memory for containers).

## Deploy a new cluster

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: Specify *KataCcIsolation* to enable the Confidential Containers feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

   ```azurecli-interactive
   az aks create --resource-group myResourceGroup --name myManagedCluster –kubernetes-version <1.25.0 and above> --os-sku AzureLinux --workload-runtime <kataCcIsolation> --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
   ```

   After a few minutes, the command completes and returns JSON-formatted information about the cluster. The cluster created in the previous step has a single node pool. In the next step, we add a second node pool to the cluster.

2. When the cluster is ready, get the cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Add a node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup* using the [az aks nodepool add][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name myManagedCluster –-cluster-name myCluster --node-count 2 --os-sku Azurelinux SKU --node-vm-size <VM sizes capable of nested SNP VM> 
    ```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Deploy to an existing cluster

To use this feature with an existing AKS cluster, the following requirements must be met:

* Follow the steps to [register the KataCcIsolationPreview](#register-the-kataccisolationpreview-feature-flag) feature flag.
* Verify the cluster is running Kubernetes version 1.25.0 and higher.
* [Enable workload identity][upgrade-cluster-enable-workload-identity] on the cluster if it isn't already.

Use the following command to enable Confidential Containers (preview) by creating a node pool to host it.

1. Add a node pool to your AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--workload-runtime**: Specify *kataCcIsolation* to enable the feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: **AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
   * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Standard_DC8as_cc_v5][DC8as-series] VMs.

   The following example adds a node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name myManagedCluster –-cluster-name myCluster --node-count 2 --os-sku Azurelinux SKU --node-vm-size <VM sizes capable of nested SNP VM> 
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Run the [az aks update][az-aks-update] command to enable Confidential Containers (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Configure container

Before you configure access to the Azure Key Vault Managed HSM and secret, and deploy an application as a Confidential container, you need to complete the configuration of the workload identity. To configure the workload identity, perform the following steps described in the [Deploy and configure workload identity][deploy-and-configure-workload-identity] article:

* Retrieve the OIDC Issuer URL
* Create a managed identity
* Create Kubernetes service account
* Establish federated identity credential

1. Set an access policy for the managed identity to access the Key Vault secret using the following commands.

    ```azurecli-interactive
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -otsv)"
    ```

    ```azurecli-interactive
    az keyvault set-policy --name "${KEYVAULT_NAME}" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

1. Configure the application to be deployed as a Confidential container (preview) by copying the following YAML file and save it as `myapplication.yml`.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
      labels:
        azure.workload.identity/use: "true"
    spec:
      runtimeClassName: kata-cc
      serviceAccountName: workload-identity-sa
      selector:
        matchLabels:
          app: nginx
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx
        spec:
          labels:
            azure.workload.identity/use: "true"
          serviceAccountName: workload-identity-sa
          containers:
          - name: nginx
            image: nginx:1.14.2
            resources:
              limits:
                memory: "512Mi"
                cpu: "60m"
            ports:
            - containerPort: 80
          - name: SecretKeyRelease
            image: <tbd>/aasp:1
            command:
              - "/skr.sh"
            env: 
              - name: SkrSideCarArgs
                value: ewogICAiY2VydGNhY2hlIjogewogICAgICAiZW5kcG9pbnQiOiAiYW1lcmljYXMuYWNjY2FjaGUuYXp1cmUubmV0IiwKICAgICAgInRlZV90eXBlIjogIlNldlNucFZNIiwKICAgICAgImFwaV92ZXJzaW9uIjogImFwaS12ZXJzaW9uPTIwMjAtMTAtMTUtcHJldmlldyIKICAgfSAgICAgIAp9
            resources:
              limits:
                memory: "512Mi"
                cpu: "60m"
    ```

## Create the security policy

The Security Policy document describes all the calls to agent’s ttrpc APIs that are expected for creating and managing a Confidential pod. The *genpolicy* application/tool can be used to generate the policy data for the pod, together with the common rules and the default values – in a Rego format text document.

The main input to genpolicy is a standard Kubernetes (K8s) YAML file, that is provided by you. The tool has support for automatic Policy generation based on K8s DaemonSet, Deployment, Job, Pod, ReplicaSet, ReplicationController, and StatefulSet input YAML files. The following is an example executing this tool:

```bash
genpolicy -y my-pod.yaml 
```

To see other command line options, run the command with the `--help` argument.

You can adjust the behavior of this app by making changes to the `genpolicy-settings.json` file.

On successful execution, genpolicy creates the Policy document, encodes it in *base64* format, and adds it to the YAML file as an annotation, similar to:

```output
io.katacontainers.config.agent.policy: cGFja2FnZSBhZ2VudF9wb2xpY3kKCmlt <…>
```

To print out information about the actions undertaken by the application while it computes the Policy, set genpolicy’s RUST_LOG environment variable by running the following command:

```bash
RUST_LOG=info genpolicy -y my-pod.yaml 
```

For example, the app downloads the container image layers for each of the containers specified by the input YAML file, and calculates the dm-verity root hash value for each of the layers. Depending on the speed of the download from the container image repository, these actions might take a few minutes to complete.

## Complete the configuration

1. Generate the deployment policy by running the following command. Replace `<path to pod yaml>` with the name of the manifest saved in the previous step.

    ```bash
    az confcom katapolicygen -y myapplication.yml
    ```

1. Upload keys to your Managed HSM instance with a key release policy. Once the Azure Key Vault resource is ready and the deployment policy is generated, you can import `RSA-HSM` or `oct-HSM` keys into it using the `importkey` tool placed under `<parent_repo_dir>/tools/importkey. A fake encryption key is used in the following command to see the key get released. To import the key into AKV/mHSM, use the following command:

    ```bash
    go run /tools/importkey/main.go -c myapplication.yml -kh encryptionKey
    ```

  Upon successful import, you should see something similar to the following:

    ```output
    [34 71 33 117 113 25 191 84 199 236 137 166 201 103 83 20 203 233 66 236 121 110 223 2 122 99 106 20 22 212 49 224]
    https://accmhsm.managedhsm.azure.net/keys/doc-sample-key-release/8659****0cdff08
    {"version":"0.2","anyOf":[{"authority":"https://sharedeus2.eus2.test.attest.azure.net","allOf":[{"claim":"x-ms-sevsnpvm-hostdata","equals":"aaa7***7cc09d"},{"claim":"x-ms-compliance-status","equals":"azure-compliant-uvm"},{"claim":"x-ms-sevsnpvm-is-debuggable","equals":"false"}]}]}
    ```

1. Run the following commands to verify the key has been successfully imported:

    ```azurecli-interactive
    az account set --subscription "Subscription ID"
    ```

   ```azurecli-interactive
   az keyvault key list --hsm-name <Name of HSM> -o table
   ```

1. Deploy the application by running the following command:

    ```bash
    kubectl apply -f myapplication
    ```

1. To verify the application is running in isolation from parent and any other pods deployed on the cluster, run the following command. (Run command to view secrets to verify it is working from the pod).

## Cleanup

When you're finished evaluating this feature, to avoid Azure charges, clean up your unnecessary resources. If you deployed a new cluster as part of your evaluation or testing, you can delete the cluster using the [az aks delete][az-aks-delete] command.

```azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster 
```

If you enabled Confidential Containers (preview) on an existing cluster, you can remove the pod(s) using the [kubectl delete pod][kubectl-delete-pod] command.

```bash
kubectl delete pod pod-name
```

## Next steps

* Learn more about [Azure Dedicated hosts][azure-dedicated-hosts] for nodes with your AKS cluster to use hardware isolation and control over Azure platform maintenance events.

<!-- EXTERNAL LINKS -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/

<!-- INTERNAL LINKS -->
[pod-sandboxing-overview]: use-pod-sandboxing.md
[azure-key-vault-managed-hardware-security-module]: ../key-vault/managed-hsm/overview.md
[create-managed-hsm]: ../key-vault/managed-hsm/quick-create-cli.md
[upgrade-cluster-enable-workload-identity]: workload-identity-deploy-cluster.md#update-an-existing-aks-cluster
[deploy-and-configure-workload-identity]: workload-identity-deploy-cluster.md
[entra-id-workload-identity-prerequisites]: ../active-directory/workload-identities/workload-identity-federation-create-trust-user-assigned-managed-identity.md
[cluster-access-and-identity-options]: concepts-identity.md
[DC8as-series]: ../virtual-machines/dcasccv5-dcadsccv5-series.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add