---
title: Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO)
description: Bring your own key (BYOK) / Customer-managed key (CMK) deploy instructions for Azure Red Hat OpenShift
services: azure red hat openshift
ms.topic: article
ms.date: 02/18/2021

---

# Encrypt persistent volume claims with a customer-managed key (CMK) on Azure Red Hat OpenShift (ARO)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft platform-managed keys which includes OS and data disks. For additional control over encryption keys, you can supply customer-managed-keys to use for encryption at rest in your Azure Red Hat OpenShift clusters.

This article details how to set up encryption for ARO persistent volumes with customer-managed keys. Support for encryption with customer managed key of master/worker node OS disks is not yet available.

## Before you begin
This article assumes that:

* You have a pre-existing ARO cluster at OpenShift version 4.5 (or greater).

* You have 'jq', 'oc', and the 'az' Azure CLI installed.

* You are logged in to your ARO cluster using *oc* as a global cluster-admin user (kubeadmin)

* You are logged in to the Azure CLI using *az* with an account authorized to grant "Contributor" access in the same subscription as the ARO cluster

## Limitations

* Availability for customer-managed key encryption is region-specific. To see the status for a specific Azure region, check [Azure regions][supported-regions].
* Available only in regions where BYOK/CMK is supported.
* Ultra disks must be enabled on your subscription prior to use.

## Declare Cluster & Encryption Variables
You should configure the variables below to whatever may be appropriate for your the ARO cluster in which you wish you enable BYOK/CMK:
```azurecli-interactive
aroCluster="mycluster"             # The name of the ARO cluster that you wish to enable BYOK/CMK on. This can be obtained from *az aro list -o table*
buildRG="mycluster-rg"             # The name of the resource group used when you initially built the ARO cluster. This can be obtained from *az aro list -o table*
desName="aro-des"                  # Your Azure Disk Encryption Set name. This must be unique in your subscription.
vaultName="aro-keyvault-1"         # Your Azure Key Vault name. This must be unique in your subscription.
vaultKeyName="myCustomAROKey"      # The name of the key to be used within your Azure Key Vault. This is the name of the key, not the actual value of the key that you will rotate.
```

## Obtain your subscription ID
Your Azure subscription ID is used multiple times in the configuration of BYOK/CMK. Obtain it and store it as a variable:
```azurecli-interactive
# Obtain your Azure Subscription ID and store it in a variable
subId="$(az account list -o tsv | grep True | awk '{print $3}')"
```

## Create an Azure Key Vault instance
An Azure Key Vault instance must be used to store your keys. Create a new *Key Vault* instance (with purge protection) and create a *new key* within the vault to store your own custom key:

```azurecli-interactive
# Create an Azure Key Vault resource in a supported Azure region
az keyvault create -n $vaultName -g $buildRG --enable-purge-protection true -o table

# Create the actual key within the Azure Key Vault
az keyvault key create --vault-name $vaultName --name $vaultKeyName --protection software -o jsonc
```

## Create an Azure Disk Encryption Set instance
The Azure Disk Encryption Set will be used as a reference point for disks in ARO. It is connected to the Azure Key Vault which was created and will obtain customer-managed keys from that location.
```azurecli-interactive
# Retrieve the Key Vault Id and store it in a variable
keyVaultId="$(az keyvault show --name $vaultName --query [id] -o tsv)"

# Retrieve the Key Vault key URL and store it in a variable
keyVaultKeyUrl="$(az keyvault key show --vault-name $vaultName --name $vaultKeyName  --query [key.kid] -o tsv)"

# Create an Azure Disk Encryption Set
az disk-encryption-set create -n $desName -g $buildRG --source-vault $keyVaultId --key-url $keyVaultKeyUrl -o table
```

## Grant the Azure Disk Encryption Set access to Key Vault
Use the *Azure Disk Encryption Set* you created in the prior steps and grant the resource access to the Azure Key Vault:

```azurecli-interactive
# Determine the Azure Disk Encryption Set AppId value and set it a variable
desIdentity="$(az disk-encryption-set show -n $desName -g $buildRG --query [identity.principalId] -o tsv)"

# Update keyvault security policy settings to allow access to the disk encryption set
az keyvault set-policy -n $vaultName -g $buildRG --object-id $desIdentity --key-permissions wrapkey unwrapkey get -o table

# Ensure the Azure Disk Encryption Set can read the contents of the Azure Key Vault
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc
```

## Obtain other IDs required for role assignments
The Managed Service Identity (MSI) must be created. Other permissions must also be set for the ARO MSI and for the Azure Disk Encryption Set:
```
# Obtain the Application ID of the service principal used in the ARO cluster
aroSPAppId="$(oc get secret azure-credentials -n kube-system -o json | jq -r .data.azure_client_id | base64 --decode)"

# Obtain the Object ID of the service principal used in the ARO cluster
aroSPObjId="$(az ad sp show --id $aroSPAppId -o tsv --query [objectId])"

# Set the name of the ARO Managed Service Identity 
msiName="$aroCluster-msi"

# Create the Managed Service Identity (MSI) required for disk encryption
az identity create -g $buildRG -n $msiName -o jsonc

# Determine the ARO Managed Service Identity AppId
aroMSIAppId="$(az identity show -n $msiName -g $buildRG -o tsv --query [clientId])"

# Determine the Resource ID for the Azure Disk Encryption Set and Azure Key Vault Resource Group
buildRGResourceId="$(az group show -n $buildRG -o tsv --query [id])"
```

## Implement additional role assignments required for BYOK/CMK encryption
Apply the required role assignments using the variables obtained in the previous step:
```azurecli-interactive
# Assign the MSI AppID 'Reader' permission over the Azure Disk Encryption Set & Key Vault Resource Group
az role assignment create --assignee $aroMSIAppId --role Reader --scope $buildRGResourceId -o jsonc

# Assign the ARO Service Principal 'Contributor' permission over the Azure Disk Encryption Set & Key Vault Resource Group
az role assignment create --assignee $aroSPObjId --role Contributor --scope $buildRGResourceId -o jsonc
```

## Create the k8s Storage Class to be used for encrypted Premium & Ultra disks
Generate a storage class to be used for Premium_LRS and UltraSSD_LRS disks which will also utilize the Azure Disk Encryption Set:
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
  diskEncryptionSetID: "/subscriptions/subId/resourceGroups/buildRG/providers/Microsoft.Compute/diskEncryptionSets/desName"
  resourceGroup: buildRG
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
  diskEncryptionSetID: "/subscriptions/subId/resourceGroups/buildRG/providers/Microsoft.Compute/diskEncryptionSets/desName"
  resourceGroup: buildRG
  cachingmode: None
  diskIopsReadWrite: "2000"  # minimum value: 2 IOPS/GiB
  diskMbpsReadWrite: "320"   # minimum value: 0.032/GiB
reclaimPolicy: Delete
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF
```
## Perform variable substitutions within the Storage Class configuration
Insert the variables which are unique to your ARO cluster into the two storage class configuration files just created:
```
# Insert your current active subscription ID into the configuration
sed -i "s/subId/$subId/g" managed-premium-encrypted-byok.yaml
sed -i "s/subId/$subId/g" managed-ultra-encrypted-byok.yaml

# Replace the name of the Resource Group which contains Azure Disk Encryption set and Key Vault
sed -i "s/buildRG/$buildRG/g" managed-premium-encrypted-byok.yaml
sed -i "s/buildRG/$buildRG/g" managed-ultra-encrypted-byok.yaml

# Replace the name of the Azure Disk Encryption Set
sed -i "s/desName/$desName/g" managed-premium-encrypted-byok.yaml
sed -i "s/desName/$desName/g" managed-ultra-encrypted-byok.yaml
```
Next, run this deployment in your ARO cluster to apply the storage class configuration:
```
# Update cluster with the new storage classes
oc apply -f managed-premium-encrypted-byok.yaml
oc apply -f managed-ultra-encrypted-byok.yaml
```
## Deploy a test Pod utilizing the BYOK/CMK disk encryption storage class
Verifying that customer-managed keys are enabled requires creating a persistent volume claim utilizing the appropriate storage class. The code below will create a small Pod which will also mount a persistent volume claim using Standard disks.
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
## Apply the Test Pod configuration file
The test pod configuration file is applied but concurrently the command also returns and sets as a variable the uid created for the persistent volume claim. We will use this to verify that the disk acting as the persistent volume within Azure is encrypted.
```
# Apply the test pod configuration file and set the PVC UID as a variable to query in Azure later
pvcUid="$(oc apply -f test-pvc.yaml -o json | jq -r '.items[0].metadata.uid')"

# Determine the full Azure Disk name
pvName="$(oc get pv pvc-$pvcUid -o json |jq -r '.spec.azureDisk.diskName')"
```
## Verify PVC disk is configured with "EncryptionAtRestWithCustomerKey" 
At this point, a Pod should be created which creates a persistent volume claim which references the BYOK/CMK storage class. Running the following command will validate that the PVC has been deployed as expected:
```azurecli-interactive
# Describe the OpenShift cluster-wide persistent volume claims
oc describe pvc

# Verify with Azure that the disk is encrypted with a customer-managed key
az disk show -n $pvName -g $buildRG -o json --query [encryption]
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
