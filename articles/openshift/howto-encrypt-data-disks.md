---
title: Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO)
description: Bring your own key (BYOK) / Customer-managed key (CMK) deploy instructions for Azure Red Hat OpenShift
ms.topic: article
ms.date: 02/24/2021
author: stuartatmicrosoft
ms.author: stkirk
ms.service: azure-redhat-openshift
keywords: encryption, byok, aro, openshift, red hat
# Customer intent: My security policies dictate that data at rest must be encrypted. Beyond this, the key used to encrypt data must be able to be changed at-will by a person authorized to do so.
---

# Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO) (preview)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft platform-managed keys that includes OS and data disks. For more control over encryption keys, you can supply customer-managed keys to encrypt data in your Azure Red Hat OpenShift clusters.

> [!NOTE]
> At this stage, support exists only for encrypting ARO persistent volumes with customer-managed keys. This feature is not presently available for operating system disks.

> [!IMPORTANT]
> ARO preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. ARO previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

## Before you begin
This article assumes that:

* You have a pre-existing ARO cluster at OpenShift version 4.4 (or greater).

* You have the 'oc' OpenShift command-line tool, base64 (part of core utils) and the 'az' Azure CLI installed.

* You're logged in to your ARO cluster using *oc* as a global cluster-admin user (kubeadmin).

* You're logged in to the Azure CLI using *az* with an account authorized to grant "Contributor" access in the same subscription as the ARO cluster.

## Limitations

* Availability for customer-managed key encryption is region-specific. To see the status for a specific Azure region, check [Azure regions][supported-regions].
* If you're using Ultra Disks, enable Ultra Disks on your subscription before getting started.

## Create an Azure Key Vault instance
An Azure Key Vault instance must be used to store your keys. Create a new Key Vault with purge protection and soft delete enabled. Then, create a new key within the vault to store your own custom key:

```azurecli-interactive
# Create an Azure Key Vault resource in a supported Azure region
az keyvault create -n $vaultName -g $buildRG --enable-purge-protection true -o table
# Create the actual key within the Azure Key Vault
az keyvault key create --vault-name $vaultName --name $vaultKeyName --protection software -o jsonc
```

## Create an Azure disk encryption set

The Azure disk encryption set is used as the reference point for disks in ARO. It's connected to the Azure Key Vault we created in the previous step and will pull customer-managed keys from that location.

```azurecli-interactive
# Retrieve the Key Vault Id and store it in a variable
keyVaultId="$(az keyvault show --name $vaultName --query [id] -o tsv)"

# Retrieve the Key Vault key URL and store it in a variable
keyVaultKeyUrl="$(az keyvault key show --vault-name $vaultName --name $vaultKeyName  --query [key.kid] -o tsv)"

# Create an Azure disk encryption set
az disk-encryption-set create -n $desName -g $myRG --source-vault $keyVaultId --key-url $keyVaultKeyUrl -o table
```

## Grant the disk encryption set access to Key Vault
Use the disk encryption set we created in the prior steps and grant the disk encryption set access to Azure Key Vault:

```azurecli-interactive
# First, find the disk encryption set's AppId value.
desIdentity="$(az disk-encryption-set show -n $desName -g $myRG --query [identity.principalId] -o tsv)"

# Next, update the Key Vault security policy settings to allow access to the disk encryption set.
az keyvault set-policy -n $vaultName -g $myRG --object-id $desIdentity --key-permissions wrapkey unwrapkey get -o table

# Now, ensure the disk encryption set can read the contents of the Azure Key Vault.
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc
```

### Obtain other IDs required for role assignments
We need to allow the ARO cluster to use the disk encryption set to encrypt the persistent volume claims (PVCs) in the ARO cluster. To do this, we'll create a new Managed Service Identity (MSI). We'll also set other permissions for the ARO MSI and for the disk encryption set.
```
# First, get the application ID of the service principal used in the ARO cluster.
aroSPAppId="$(oc get secret azure-credentials -n kube-system -o jsonpath='{.data.azure_client_id}' | base64 --decode)"

# Next, get the object ID of the service principal used in the ARO cluster.
aroSPObjId="$(az ad sp show --id $aroSPAppId -o tsv --query [objectId])"

# Set the name of the ARO Managed Service Identity. 
msiName="$aroCluster-msi"

# Create the Managed Service Identity (MSI) required for disk encryption.
az identity create -g $myRG -n $msiName -o jsonc

# Get the ARO Managed Service Identity application ID.
aroMSIAppId="$(az identity show -n $msiName -g $myRG -o tsv --query [clientId])"

# Get the resource ID for the disk encryption set and the Key Vault resource group.
myRGResourceId="$(az group show -n $myRG -o tsv --query [id])"
```

### Implement other role assignments required for BYOK/CMK encryption
Apply the required role assignments using the variables obtained in the previous step:

```azurecli-interactive
# Ensure the Azure Disk Encryption Set can read the contents of the Azure Key Vault.
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc

# Assign the MSI AppID 'Reader' permission over the disk encryption set & Key Vault resource group.
az role assignment create --assignee $aroMSIAppId --role Reader --scope $myRGResourceId -o jsonc

# Assign the ARO Service Principal 'Contributor' permission over the disk encryption set & Key Vault Resource Group.
az role assignment create --assignee $aroSPObjId --role Contributor --scope $myRGResourceId -o jsonc
```

## Create a k8s Storage Class for encrypted Premium & Ultra disks (optional)
Generate storage classes to be used for BYOK/CMK for Premium_LRS and UltraSSD_LRS disks:
```
# Premium Disks
cat > managed-premium-encrypted-byok.yaml<< EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-premium-encrypted-byok
provisioner: kubernetes.io/azure-disk
parameters:
  skuname: Premium_LRS
  kind: Managed
  diskEncryptionSetID: "/subscriptions/subId/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/desName"
  resourceGroup: myRG
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF

# Ultra Disks
cat > managed-ultra-encrypted-byok.yaml<< EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-ultra-encrypted-byok
provisioner: kubernetes.io/azure-disk
parameters:
  skuname: UltraSSD_LRS
  kind: Managed
  diskEncryptionSetID: "/subscriptions/subId/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/desName"
  resourceGroup: myRG
  cachingmode: None
  diskIopsReadWrite: "2000"  # minimum value: 2 IOPS/GiB
  diskMbpsReadWrite: "320"   # minimum value: 0.032/GiB
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
```
### Set up your Storage Class configuration
Substitute the variables that are unique to your ARO cluster into the two storage class configuration files:
```
# Insert your current active subscription ID into the configuration
sed -i "s/subId/$subId/g" managed-premium-encrypted-byok.yaml
sed -i "s/subId/$subId/g" managed-ultra-encrypted-byok.yaml

# Replace the name of the Resource Group which contains the disk encryption set and Key Vault
sed -i "s/myRG/$myRG/g" managed-premium-encrypted-byok.yaml
sed -i "s/myRG/$myRG/g" managed-ultra-encrypted-byok.yaml

# Replace the name of the disk encryption set
sed -i "s/desName/$desName/g" managed-premium-encrypted-byok.yaml
sed -i "s/desName/$desName/g" managed-ultra-encrypted-byok.yaml
```
Next, run this deployment in your ARO cluster to apply the storage class configuration:
```
# Update cluster with the new storage classes
oc apply -f managed-premium-encrypted-byok.yaml
oc apply -f managed-ultra-encrypted-byok.yaml
```
## Test encryption with customer-managed keys
To check if your cluster is using a customer-managed key for PVC encryption, we'll create a persistent volume claim using the appropriate storage class. The code snippet below creates a pod and mounts a persistent volume claim using Standard disks
```
# Create a pod which uses a persistent volume claim referencing the new storage class
cat > test-pvc.yaml<< EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mypod-with-byok-encryption-pvc
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: managed-premium-encrypted-byok
  resources:
    requests:
      storage: 1Gi
---
kind: Pod
apiVersion: v1
metadata:
  name: mypod-with-byok-encryption
spec:
  containers:
  - name: mypod-with-byok-encryption
    image: nginx:1.15.5
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
        claimName: mypod-with-byok-encryption-pvc
EOF
```
### Apply the test pod configuration file
Execute the commands below to apply the test Pod configuration and return the UID of the new persistent volume claim. The UID will be used to verify the disk is encrypted using BYOK/CMK.
```
# Apply the test pod configuration file and set the PVC UID as a variable to query in Azure later.
pvcUid="$(oc apply -f test-pvc.yaml -o json | jq -r '.items[0].metadata.uid')"

# Determine the full Azure Disk name.
pvName="$(oc get pv pvc-$pvcUid -o json |jq -r '.spec.azureDisk.diskName')"
```
### Verify PVC disk is configured with "EncryptionAtRestWithCustomerKey" 
The Pod should create a persistent volume claim that references the BYOK/CMK storage class. Running the following command will validate that the PVC has been deployed as expected:
```azurecli-interactive
# Describe the OpenShift cluster-wide persistent volume claims
oc describe pvc

# Verify with Azure that the disk is encrypted with a customer-managed key
az disk show -n $pvName -g $myRG -o json --query [encryption]
```

## Next steps

<!-- LINKS - external -->

<!-- LINKS - internal -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[best-practices-security]: /azure/aks/operator-best-practices-cluster-security
[byok-azure-portal]: /azure/storage/common/storage-encryption-keys-portal
[customer-managed-keys]: /azure/virtual-machines/windows/disk-encryption#customer-managed-keys
[key-vault-generate]: /azure/key-vault/key-vault-manage-with-cli2
[supported-regions]: /azure/virtual-machines/windows/disk-encryption#supported-regions

