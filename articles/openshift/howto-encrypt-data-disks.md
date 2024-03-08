---
title: Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO)
description: Bring your own key (BYOK) / Customer-managed key (CMK) deploy instructions for Azure Red Hat OpenShift
ms.topic: article
ms.date: 02/24/2021
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.custom: devx-track-azurecli
keywords: encryption, byok, aro, cmk, openshift, red hat
# Customer intent: My security policies dictate that data at rest must be encrypted. Beyond this, the key used to encrypt data must be able to be changed at-will by a person authorized to do so.
---

# Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO) (preview)

Azure Storage uses server-side encryption (SSE) to automatically [encrypt](../storage/common/storage-service-encryption.md) your data when it is persisted to the cloud. By default, data is encrypted with Microsoft platform-managed keys. For additional control over encryption keys, you can supply your own customer-managed keys to encrypt data in your Azure Red Hat OpenShift clusters.

> [!NOTE]
> At this stage, support exists only for encrypting ARO persistent volumes with customer-managed keys. This feature is not presently available for master or worker node operating system disks.

> [!IMPORTANT]
> ARO preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they are excluded from the service-level agreements and limited warranty. ARO previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use.

## Before you begin
This article assumes that:

* You have a pre-existing ARO cluster at OpenShift version 4.4 (or greater).

* You have the **oc** OpenShift command-line tool, base64 (part of coreutils) and the **az** Azure CLI installed.

* You are logged in to your ARO cluster using **oc** as a global cluster-admin user (kubeadmin).

* You are logged in to the Azure CLI using **az** with an account authorized to grant "Contributor" access in the same subscription as the ARO cluster.

## Limitations

* Availability for customer-managed key encryption is region-specific. To see the status for a specific Azure region, check [Azure regions][supported-regions].
* If you wish to use Ultra Disks, you must first enable them on your subscription before getting started.

## Declare Cluster & Encryption Variables
You should configure the variables below to whatever may be appropriate for your the ARO cluster in which you wish you enable customer-managed encryption keys:
```
aroCluster="mycluster"             # The name of the ARO cluster that you wish to enable CMK on. This may be obtained from **az aro list -o table**
buildRG="mycluster-rg"             # The name of the resource group used when you initially built the ARO cluster. This may be obtained from **az aro list -o table**
desName="aro-des"                  # Your Azure Disk Encryption Set name. This must be unique in your subscription.
vaultName="aro-keyvault-1"         # Your Azure Key Vault name. This must be unique in your subscription.
vaultKeyName="myCustomAROKey"      # The name of the key to be used within your Azure Key Vault. This is the name of the key, not the actual value of the key that you will rotate.
```

## Obtain your subscription ID
Your Azure subscription ID is used multiple times in the configuration of CMK. Obtain it and store it as a variable:
```azurecli-interactive
# Obtain your Azure Subscription ID and store it in a variable
subId="$(az account list -o tsv | grep True | awk '{print $3}')"
```

## Create an Azure Key Vault instance
An Azure Key Vault instance must be used to store your keys. Create a new Key Vault with purge protection enabled. Then, create a new key within the vault to store your own custom key:

```azurecli-interactive
# Create an Azure Key Vault resource in a supported Azure region
az keyvault create -n $vaultName -g $buildRG --enable-purge-protection true -o table

# Create the actual key within the Azure Key Vault
az keyvault key create --vault-name $vaultName --name $vaultKeyName --protection software -o jsonc
```

## Create an Azure disk encryption set

The Azure Disk Encryption Set is used as the reference point for disks in ARO. It is connected to the Azure Key Vault we created in the previous step and will pull customer-managed keys from that location.

```azurecli-interactive
# Retrieve the Key Vault Id and store it in a variable
keyVaultId="$(az keyvault show --name $vaultName --query [id] -o tsv)"

# Retrieve the Key Vault key URL and store it in a variable
keyVaultKeyUrl="$(az keyvault key show --vault-name $vaultName --name $vaultKeyName  --query [key.kid] -o tsv)"

# Create an Azure disk encryption set
az disk-encryption-set create -n $desName -g $buildRG --source-vault $keyVaultId --key-url $keyVaultKeyUrl -o table
```

## Grant the Disk Encryption Set access to Key Vault
Use the disk encryption set we created in the prior steps and grant the disk encryption set access to Azure Key Vault:

```azurecli-interactive
# First, find the disk encryption set's Azure Application ID value.
desIdentity="$(az disk-encryption-set show -n $desName -g $buildRG --query [identity.principalId] -o tsv)"

# Next, update the Key Vault security policy settings to allow access to the disk encryption set.
az keyvault set-policy -n $vaultName -g $buildRG --object-id $desIdentity --key-permissions wrapkey unwrapkey get -o table

# Now, ensure the Disk Encryption Set can read the contents of the Azure Key Vault.
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc
```

### Obtain other IDs required for role assignments
We need to allow the ARO cluster to use the disk encryption set to encrypt the persistent volume claims (PVCs) in the ARO cluster. To do this, we will create a new Managed Service Identity (MSI). We will also set other permissions for the ARO MSI and for the Disk Encryption Set.

```azurecli-interactive
# First, get the Azure Application ID of the service principal used in the ARO cluster.
aroSPAppId="$(az aro show -n $aroCluster -g $buildRG -o tsv --query servicePrincipalProfile.clientId)"

# Next, get the object ID of the service principal used in the ARO cluster.
aroSPObjId="$(az ad sp show --id $aroSPAppId -o tsv --query [objectId])"

# Set the name of the ARO Managed Service Identity. 
msiName="$aroCluster-msi"

# Create the Managed Service Identity (MSI) required for disk encryption.
az identity create -g $buildRG -n $msiName -o jsonc

# Get the ARO Managed Service Identity Azure Application ID.
aroMSIAppId="$(az identity show -n $msiName -g $buildRG -o tsv --query [clientId])"

# Get the resource ID for the disk encryption set and the Key Vault resource group.
buildRGResourceId="$(az group show -n $buildRG -o tsv --query [id])"
```

### Implement other role assignments required for CMK encryption
Apply the required role assignments using the variables obtained in the previous step:

```azurecli-interactive
# Ensure the Azure Disk Encryption Set can read the contents of the Azure Key Vault.
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc

# Assign the MSI AppID 'Reader' permission over the disk encryption set & Key Vault resource group.
az role assignment create --assignee $aroMSIAppId --role Reader --scope $buildRGResourceId -o jsonc

# Assign the ARO Service Principal 'Contributor' permission over the disk encryption set & Key Vault Resource Group.
az role assignment create --assignee $aroSPObjId --role Contributor --scope $buildRGResourceId -o jsonc
```

## Create a k8s Storage Class for encrypted Premium & Ultra disks
Generate storage classes to be used for CMK for Premium_LRS and UltraSSD_LRS disks:

```azurecli-interactive
# Premium Disks
cat > managed-premium-encrypted-cmk.yaml<< EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-premium-encrypted-cmk
provisioner: kubernetes.io/azure-disk
parameters:
  skuname: Premium_LRS
  kind: Managed
  diskEncryptionSetID: "/subscriptions/$subId/resourceGroups/$buildRG/providers/Microsoft.Compute/diskEncryptionSets/$desName"
  resourceGroup: $buildRG
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF

# Ultra Disks
cat > managed-ultra-encrypted-cmk.yaml<< EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-ultra-encrypted-cmk
provisioner: kubernetes.io/azure-disk
parameters:
  skuname: UltraSSD_LRS
  kind: Managed
  diskEncryptionSetID: "/subscriptions/$subId/resourceGroups/$buildRG/providers/Microsoft.Compute/diskEncryptionSets/$desName"
  resourceGroup: $buildRG
  cachingmode: None
  diskIopsReadWrite: "2000"  # minimum value: 2 IOPS/GiB
  diskMbpsReadWrite: "320"   # minimum value: 0.032/GiB
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
```

Next, run this deployment in your ARO cluster to apply the storage class configuration:

```azurecli-interactive
# Update cluster with the new storage classes
oc apply -f managed-premium-encrypted-cmk.yaml
oc apply -f managed-ultra-encrypted-cmk.yaml
```

## Test encryption with customer-managed keys (optional)
To check if your cluster is using a customer-managed key for PVC encryption, we will create a persistent volume claim using the new storage class. The code snippet below creates a pod and mounts a persistent volume claim using Premium disks.
```
# Create a pod which uses a persistent volume claim referencing the new storage class
cat > test-pvc.yaml<< EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mypod-with-cmk-encryption-pvc
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: managed-premium-encrypted-cmk
  resources:
    requests:
      storage: 1Gi
---
kind: Pod
apiVersion: v1
metadata:
  name: mypod-with-cmk-encryption
spec:
  containers:
  - name: mypod-with-cmk-encryption
    image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
    volumeMounts:
    - mountPath: "/mnt/azure"
      name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: mypod-with-cmk-encryption-pvc
EOF
```
### Apply the test pod configuration file (optional)
Execute the commands below to apply the test Pod configuration and return the UID of the new persistent volume claim. The UID will be used to verify the disk is encrypted using CMK.
```azurecli-interactive
# Apply the test pod configuration file and set the PVC UID as a variable to query in Azure later.
pvcUid="$(oc apply -f test-pvc.yaml -o jsonpath='{.items[0].metadata.uid}')"

# Determine the full Azure Disk name.
pvName="$(oc get pv pvc-$pvcUid -o jsonpath='{.spec.azureDisk.diskName}')"
```
> [!NOTE]
> On occasion there may be a slight delay when applying role assignments within Microsoft Entra ID. Depending upon the speed that these instructions are executed, the command to "Determine the full Azure Disk name" may not succeed. If this occurs, review the output of **oc describe pvc mypod-with-cmk-encryption-pvc** to ensure that the disk was successfully provisioned. If the role assignment propagation has not completed you may need to *delete* and re-*apply* the Pod & PVC YAML.

### Verify PVC disk is configured with "EncryptionAtRestWithCustomerKey" (Optional)
The Pod should create a persistent volume claim that references the CMK storage class. Running the following command will validate that the PVC has been deployed as expected:
```azurecli-interactive
# Describe the OpenShift cluster-wide persistent volume claims
oc describe pvc

# Verify with Azure that the disk is encrypted with a customer-managed key
az disk show -n $pvName -g $buildRG -o json --query [encryption]
```

<!-- LINKS - external -->

<!-- LINKS - internal -->
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[best-practices-security]: ../aks/operator-best-practices-cluster-security.md
[byok-azure-portal]: ../storage/common/customer-managed-keys-configure-key-vault.md
[customer-managed-keys]: ../virtual-machines/disk-encryption.md#customer-managed-keys
[key-vault-generate]: ../key-vault/general/manage-with-cli2.md
[supported-regions]: ../virtual-machines/disk-encryption.md#supported-regions
