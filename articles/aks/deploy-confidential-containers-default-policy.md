---
title: Deploy an AKS cluster with Confidential Containers (preview)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with Confidential Containers (preview) and a default security policy by using the Azure CLI.
ms.topic: quickstart
ms.date: 11/09/2023
ms.custom: devx-track-azurecli, ignite-fall-2023, mode-api, devx-track-linux
---

# Deploy an AKS cluster with Confidential Containers and a default policy

In this article, you'll use the Azure CLI to deploy an Azure Kubernetes Service (AKS) cluster and configure Confidential Containers (preview) with a default security policy. You'll then deploy an application as a Confidential container. To learn more, read the [overview of AKS Confidential Containers][overview-confidential-containers].

In general, getting started with AKS Confidential Containers involves the following steps.

* Deploy or upgrade an AKS cluster using the Azure CLI
* Add an annotation to your pod YAML manifest to mark the pod as being run as a confidential container
* Add a security policy to your pod YAML manifest
* Enable enforcement of the security policy
* Deploy your application in confidential computing

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.169 or later.

- The `confcom` Confidential Container Azure CLI extension 0.3.0 or later. This is required to generate a [security policy][confidential-containers-security-policy].

- Register the `Preview` feature in your Azure subscription.

- AKS supports Confidential Containers (preview) on version 1.25.0 and higher.

- A workload identity and a federated identity credential. The workload identity credential enables Kubernetes applications access to Azure resources securely with Microsoft Entra ID based on annotated service accounts. If you aren't familiar with Microsoft Entra Workload ID, see the [Microsoft Entra Workload ID overview][entra-id-workload-identity-overview] and review how [Workload Identity works with AKS][aks-workload-identity-overview].

- The identity you're using to create your cluster has the appropriate minimum permissions. For more information about access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][cluster-access-and-identity-options].

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

- Confidential containers on AKS provide a sidecar open source container for attestation and secure key release. The sidecar integrates with a Key Management Service (KMS), like Azure Key Vault, for releasing a key to the container group after validation is completed. Deploying an [Azure Key Vault Managed HSM][azure-key-vault-managed-hardware-security-module] (Hardware Security Module) is optional but recommended to support container-level integrity and attestation. See [Provision and activate a Managed HSM][create-managed-hsm] to deploy Managed HSM.

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

### Install the confcom Azure CLI extension

To install the confcom extension, run the following command:

```azurecli-interactive
az extension add --name confcom
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name confcom
```

### Register the KataCcIsolationPreview feature flag

Register the `KataCcIsolationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Deploy a new cluster

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
   * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Standard_DC8as_cc_v5][DC8as-series] VMs.
   * **--enable-workload-identity**: Enables creating a Microsoft Entra Workload ID enabling pods to use a Kubernetes identity.
   * **--enable-oidc-issuer**: Enables OpenID Connect (OIDC) Issuer, which allows Microsoft Entra ID or other cloud provider identity and access management platform, to discover the API server's public signing keys.

   The following example updates the cluster named *myAKSCluster* and creates a single system node pool in the *myResourceGroup*:

   ```azurecli-interactive
   az aks create --resource-group myResourceGroup --name myAKSCluster --kubernetes-version <1.25.0 and above> --os-sku AzureLinux --node-vm-size Standard_DC4as_cc_v5 --node-count 1 --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
   ```

   After a few minutes, the command completes and returns JSON-formatted information about the cluster. The cluster created in the previous step has a single node pool. In the next step, we add a second node pool to the cluster.

2. When the cluster is ready, get the cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Add a user node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup* using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--workload-runtime**: Specify *KataCcIsolation* to enable the Confidential Containers feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
   * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
   * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Standard_DC8as_cc_v5][DC8as-series] VMs.

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name nodepool2 --cluster-name myAKSCluster --node-count 2 --os-sku AzureLinux --node-vm-size Standard_DC4as_cc_v5 --workload-runtime KataCcIsolation
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
   * **--workload-runtime**: Specify *KataCcIsolation* to enable the feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
   * **--os-sku**: **AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
   * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Standard_DC8as_cc_v5][DC8as-series] VMs.

   The following example adds a user node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name nodepool2 –-cluster-name myAKSCluster --node-count 2 --os-sku AzureLinux --node-vm-size Standard_DC4as_cc_v5 --workload-runtime KataCcIsolation
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Run the [az aks update][az-aks-update] command to enable Confidential Containers (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. When the cluster is ready, get the cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Configure container

Before you configure access to the Azure Key Vault and secret, and deploy an application as a Confidential container, you need to complete the configuration of the workload identity.

To configure the workload identity, perform the following steps described in the [Deploy and configure workload identity][deploy-and-configure-workload-identity] article:

* Retrieve the OIDC Issuer URL
* Create a managed identity
* Create Kubernetes service account
* Establish federated identity credential

## Deploy a trusted application with kata-cc and attestation container

The following steps configure end-to-end encryption for Kafka messages using encryption keys managed by [Azure Managed Hardware Security Modules][azure-managed-hsm] (mHSM). The key is only released when the Kafka consumer runs within a Confidential Container with Azure attestation secret provisioning container injected into the pod.

This configuration is basedon the following four components:

* Kafka Cluster: A simple Kafka cluster deployed in the Kafka namespace on the cluster.
* Kafka Producer: A Kafka producer running as a vanilla Kubernetes pod that sends encrypted user-configured messages using a public key to a Kafka topic.
* Kafka Consumer: A Kafka consumer pod running with the kata-cc runtime, equipped with a secure key release container to retrieve the private key for decrypting Kafka messages and render the messages to web UI.

For this preview release, we recommend for test and evaluation purposes to either create or use an existing Azure Key Vault Premium tier resource to support storing keys in a hardware security module (HSM). We don't recommend using your production key vault. If you don't have an Azure Key Vault, see [Create a key vault using the Azure CLI][provision-key-vault-azure-cli].

1. Grant the managed identity you created earlier, and your account, access to the key vault. [Assign][assign-key-vault-access-cli] both identities the **Key Vault Crypto Officer** and **Key Vault Crypto User** Azure RBAC roles.

   >[!NOTE]
   >The managed identity is the value you assigned to the `USER_ASSIGNED_IDENTITY_NAME` variable.

   >[!NOTE]
   >To add role assignments, you must have `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [Key Vault Data Access Administrator (preview)][key-vault-data-access-admin-rbac], [User Access Administrator][user-access-admin-rbac],or [Owner][owner-rbac].

   Run the following command to set the scope:

    ```azurecli-interactive
    AKV_SCOPE=`az keyvault show --name <AZURE_AKV_RESOURCE_NAME> --query id --output tsv` 
    ```

   Run the following command to assign the **Key Vault Crypto Officer** role.

    ```azurecli-interactive
    az role assignment create --role "Key Vault Crypto Officer" --assignee "${USER_ASSIGNED_IDENTITY_NAME}" --scope $AKV_SCOPE
    ```

   Run the following command to assign the **Key Vault Crypto User** role.

    ```azurecli-interactive
    az role assignment create --role "Key Vault Crypto User" --assignee "${USER_ASSIGNED_IDENTITY_NAME}" --scope $AKV_SCOPE
    ``````

1. This example requires the following producer and consumer YAML files. Copy the following YAML manifest and save it as `producer.yaml`.

    ```yml
    apiVersion: v1
    kind: Pod
    metadata:
      name: kafka-producer
      namespace: kafka
    spec:
      containers:
        - image: "fishersnpregistry.azurecr.io/kafka-producer-bugbash:1.0"
          name: kafka-producer
          command:
            - /produce
          env:
            - name: TOPIC
              value: kafka-demo-topic
            - name: MSG
              value: "Azure Confidential Computing"
            - name: PUBKEY
              value: |-
                -----BEGIN PUBLIC KEY-----
                MIIBojAN***AE=
                -----END PUBLIC KEY-----
          resources:
            limits:
              memory: 1Gi
              cpu: 200m
    ```

   Copy the following YAML manifest and save it as `consumer.yaml`.

    ```yml
    apiVersion: v1
    kind: Pod
    metadata:
      name: kafka-golang-consumer
      namespace: kafka
      labels:
        azure.workload.identity/use: "true"
        app.kubernetes.io/name: kafka-golang-consumer
    spec:
      serviceAccountName: workload-identity-sa
      runtimeClassName: kata-cc
      containers:
        - image: "fishersnpregistry.azurecr.io/aasp:v1.0"
          imagePullPolicy: Always
          name: aasp
          env:
            - name: AaspSideCarArgs
              value: ewogICAgImNlcnRjYWNoZSI6IHsKCQkiZW5kcG9pbnRfdHlwZSI6ICJMb2NhbFRISU0iLAoJCSJlbmRwb2ludCI6ICIxNjkuMjU0LjE2OS4yNTQvbWV0YWRhdGEvVEhJTS9hbWQvY2VydGlmaWNhdGlvbiIKCX0gIAp9
          command:
            - /bin/aasp
          volumeMounts:
            - mountPath: /opt/confidential-containers/share/kata-containers/reference-info-base64d
              name: endor-loc
        - image: "fishersnpregistry.azurecr.io/kafka-consumer-bugbash:1.2"
          imagePullPolicy: Always
          name: kafka-golang-consumer
          env:
            - name: SkrClientKID
              value: kafka-encryption-demo
            - name: SkrClientMAAEndpoint
              value: sharedeus2.eus2.test.attest.azure.net
            - name: SkrClientAKVEndpoint
              value: ""
            - name: TOPIC
              value: kafka-demo-topic
          command:
            - /consume
          ports:
            - containerPort: 3333
              name: kafka-consumer
          resources:
            limits:
              memory: 1Gi
              cpu: 200m
      volumes:
        - name: endor-loc
          hostPath:
            path: /opt/confidential-containers/share/kata-containers/reference-info-base64d
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: consumer
      namespace: kafka
    spec:
      type: LoadBalancer
      selector:
        app.kubernetes.io/name: kafka-golang-consumer
      ports:
        - protocol: TCP
          port: 80
          targetPort: kafka-consumer
    ```

1. Create a Kafka namespace by running the following command:

    ```bash
    kubectl create namespace kafka
    ```

1. Install the Kafka cluster in the Kafka namespace by running the following command::

    ```bash
    kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
    ```

1. Run the following command to apply the `Kafka` cluster CR file.

    ```bash
    kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n kafka
    ```

1. Generate the security policy for the Kafka consumer YAML manifest and obtain the hash of the security policy. Set `WORKLOAD_MEASUREMENT` to the hash of the security policy by running the following command:

    ```bash
    export WORKLOAD_MEASUREMENT=$(az confcom katapolicygen -y consumer.yaml -j genpolicy-debug-settings.json --print-policy | base64 --decode | sha256sum | cut -d' ' -f1)

    ```

    >[!NOTE]
    >If `az confcom katapolicygen` returns an error, run the following commands and try again:
    >
    >`az extension remove --name confcom`
    >`$ az extension add --source https://acccliazext.blob.core.windows.net/confcom/confcom-0.3.13-py3-none-any.whl -y`

1. Copy the Bash script to prepare encryption key for the workload.   This value needs to match the `SkrClientMAAEndpoint` from the `consumer.yaml` manifest file. Save the file as `setup-key.sh`.

    ```bash
    #!/bin/bash

    # --------------------------------------------------------------------------------------------
    # Copyright (c) Microsoft Corporation. All rights reserved.
    # Licensed under the MIT License. See License.txt in the project root for license information.
    # --------------------------------------------------------------------------------------------
    
    
    set -e
    
    # This script creates a RSA key in MHSM with a release policy, then downloads
    # the public key and saves the key info
    
    if [ $# -ne 2 ] ; then
    	echo "Usage: $0 <KEY_NAME> <AZURE_AKV_RESOURCE_ENDPOINT>"
    	exit 1
    fi
    
    KEY_NAME=$1
    AZURE_AKV_RESOURCE_ENDPOINT=$2
    
    key_vault_name=$(echo "$AZURE_AKV_RESOURCE_ENDPOINT" | cut -d. -f1)
    echo "Key vault name is ${key_vault_name}"
    
    if [[ $(curl https://$AZURE_AKV_RESOURCE_ENDPOINT) ]] 2>/dev/null; then
    	echo "......MHSM endpoint OK"
    else
    	echo "Azure akv resource endpoint doesn't exist. Please refer to documentation instructions to set it up first:"
    	exit 1
    fi
    
    if [[ -z "${MAA_ENDPOINT}" ]]; then
    	echo "Error: Env MAA_ENDPOINT is not set. Please set up your own MAA instance or select from a region where MAA is offered (e.g. sharedeus2.eus2.attest.azure.net):"
    	echo ""
    	echo "https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/?products=azure-attestation"
    	exit 1
    fi
    
    if [[ -z "${MANAGED_IDENTITY}" ]]; then
    	echo "Error: Env MANAGED_IDENTITY is not set. Please assign principal ID of the managed identity that will have read access to the key. To create a managed identity:"
    	echo "az identity create -g <resource-group-name> -n <identity-name>"
    	exit 1
    fi
    
    policy_file_name="${KEY_NAME}-release-policy.json"
    
    echo { \"anyOf\":[ { \"authority\":\"https://${MAA_ENDPOINT}\", \"allOf\":[ > ${policy_file_name}
    echo '{"claim":"x-ms-attestation-type", "equals":"sevsnpvm"},' >> ${policy_file_name}
    
    if [[ -z "${WORKLOAD_MEASUREMENT}" ]]; then
    	echo "Warning: Env WORKLOAD_MEASUREMENT is not set. To better protect your key, consider adding it to your key release policy"
    else
    	echo {\"claim\":\"x-ms-sevsnpvm-hostdata\", \"equals\":\"${WORKLOAD_MEASUREMENT}\"}, >> ${policy_file_name}
    fi
    
    
    echo {\"claim\":\"x-ms-compliance-status\", \"equals\":\"azure-signed-katacc-uvm\"}, >> ${policy_file_name}
    echo {\"claim\":\"x-ms-sevsnpvm-is-debuggable\", \"equals\":\"false\"}, >> ${policy_file_name}
    
    echo '] } ], "version":"1.0.0" }' >> ${policy_file_name}
    echo "......Generated key release policy ${policy_file_name}"
    
    # Create RSA key
    az keyvault key create --id https://$AZURE_AKV_RESOURCE_ENDPOINT/keys/${KEY_NAME} --ops wrapKey unwrapkey encrypt decrypt --kty RSA-HSM --size 3072 --exportable --policy ${policy_file_name}
    echo "......Created RSA key in ${AZURE_AKV_RESOURCE_ENDPOINT}"
    
    
    # # Download the public key
    public_key_file=${KEY_NAME}-pub.pem
    rm -f ${public_key_file}
    
    if [[ "$AZURE_AKV_RESOURCE_ENDPOINT" == *".vault.azure.net" ]]; then
        az keyvault key download --vault-name ${key_vault_name} -n ${KEY_NAME} -f ${public_key_file}
    	echo "......Downloaded the public key to ${public_key_file}"
    elif [[ "$AZURE_AKV_RESOURCE_ENDPOINT" == *".managedhsm.azure.net" ]]; then
    
        az keyvault key download --hsm-name ${key_vault_name} -n ${KEY_NAME} -f ${public_key_file}
    	echo "......Downloaded the public key to ${public_key_file}"
    fi
    
    # generate key info file
    key_info_file=${KEY_NAME}-info.json
    echo {  > ${key_info_file}
    echo \"public_key_path\": \"${public_key_file}\", >> ${key_info_file}
    echo \"kms_endpoint\": \"$AZURE_AKV_RESOURCE_ENDPOINT\", >> ${key_info_file}
    echo \"attester_endpoint\": \"${MAA_ENDPOINT}\" >> ${key_info_file}
    echo }  >> ${key_info_file}
    echo "......Generated key info file ${key_info_file}"
    echo "......Key setup successful!"
    ```

1. Obtain the resource ID of the managed identity you created earlier. `setup-key.sh` relies on the identity. Run the following command to create a variable for the managed identity ID.

    ```bash
    export MANAGED_IDENTITY="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'id' -otsv)"
    ```

1. Set the `MAA_ENDPOINT` environmental variable to the Microsoft Azure Attestation endpoint value by running the following command. The attestation URL is the Attest URI of the attestation provider containing the attestation policy, which looks like this: `https://MyAttestationProvider.wus.attest.azure.net`.

   Run the [az attestation show][az-attestation-show] command to retrieve attestation provider properties such as status and AttestURI:

    ```azurecli-interactive
    az attestation show --name "myattestationprovider" --resource-group "MyResourceGroup"
    ```

   This command displays values like the following output:

    ```output
    Id:/subscriptions/MySubscriptionID/resourceGroups/MyResourceGroup/providers/Microsoft.Attestation/attestationProviders/MyAttestationProvider
    Location: MyLocation
    ResourceGroupName: MyResourceGroup
    Name: MyAttestationProvider
    Status: Ready
    TrustModel: AAD
    AttestUri: https://MyAttestationProvider.us.attest.azure.net
    Tags:
    TagsTable:
    ```

   ```bash
   export MAA_ENDPOINT="MyAttestationProvider.wus.attest.azure.net"
   ```

1. To generate an RSA asymmetric key pair (public and private keys), run the `setup-key.sh` script using the following command. The `<Azure Key Vault URL>` value should be `https://<your-unique-keyvault-name>.vault.azure.net`

    ```bash
    # <Azure Key Vault URL> should have the following format:
    # <Azure Key Vault Name>.vault.azure.net
    bash setup-key.sh "kafka-encryption-demo" <Azure Key Vault URL>
    ```

   Once the public key is downloaded, replace the `PUBKEY` environmental variable in the `producer.yaml` manifest with the public key.

1. To verify the keys have been successfully uploaded to the key vault, run the following commands:

    ```azurecli-interactive
    az account set --subscription <Subscription ID>
    az keyvault key list --vault-name <Name of vault> -o table
    ```

1. Deploy the `consumer` and `producer` YAML manifests using the files you saved earlier.

    ```bash
    kubectl apply –f consumer.yaml
    ```

    ```bash
    kubectl apply –f producer.yaml
    ```

1. Get the IP address of the web service using the following command:

    ```bash
    kubectl get svc consumer -n kafka 
    ```

Copy and paste the IP address of the consumer service into your browser and observe the decrypted messages. You should also attempt to run the consumer as a regular Kubernetes pod by removing the `aasp container` and `kata-cc runtime class` spec. Since you are not running the consumer with kata-cc runtime class, you no longer need the policy.

Remove the entire policy and observe the messages again in the browser after redeploying the workload. Messages appear as base64-encoded ciphertext because the private encryption key cannot be retrieved. The key cannot be retrieved because the consumer is no longer running in a confidential environment, and the `aasp container` is missing, preventing decryption of messages.

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
[kubectl-delete-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale

<!-- INTERNAL LINKS -->
[upgrade-cluster-enable-workload-identity]: workload-identity-deploy-cluster.md#update-an-existing-aks-cluster
[deploy-and-configure-workload-identity]: workload-identity-deploy-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[entra-id-workload-identity-overview]: ../active-directory/workload-identities/workload-identities-overview.md
[aks-workload-identity-overview]: workload-identity-overview.md
[cluster-access-and-identity-options]: concepts-identity.md
[DC8as-series]: ../virtual-machines/dcasccv5-dcadsccv5-series.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-delete]: /cli/azure/aks#az_aks_delete
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-install-cmd]: /cli/azure/aks#az-aks-install-cli
[overview-confidential-containers]: confidential-containers-overview.md
[azure-key-vault-managed-hardware-security-module]: ../key-vault/managed-hsm/overview.md
[create-managed-hsm]: ../key-vault/managed-hsm/quick-create-cli.md
[entra-id-workload-identity-prerequisites]: ../active-directory/workload-identities/workload-identity-federation-create-trust-user-assigned-managed-identity.md
[confidential-containers-security-policy]: ../confidential-computing/confidential-containers-aks-security-policy.md
[confidential-containers-considerations]: confidential-containers-overview.md#considerations
[azure-dedicated-hosts]: ../virtual-machines/dedicated-hosts.md
[azure-managed-hsm]: ../key-vault/managed-hsm/overview.md
[provision-key-vault-azure-cli]: ../key-vault/general/quick-create-cli.md
[assign-key-vault-access-cli]: ../key-vault/general/rbac-guide.md#assign-role
[key-vault-data-access-admin-rbac]: ../role-based-access-control/built-in-roles.md#key-vault-data-access-administrator-preview
[user-access-admin-rbac]: ../role-based-access-control/built-in-roles.md#user-access-administrator
[owner-rbac]: ../role-based-access-control/built-in-roles.md#owner
[az-attestation-show]: /cli/azure/attestation#az-attestation-show