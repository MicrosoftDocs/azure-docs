---
title: Configuring Bring Your Own Key (BYOK) / Customer-managed Key (CMK) encryption on Azure Red Hat OpenShift (ARO)
description: Bring your own key (BYOK) / Customer-managed Key (CMK) deploy instructions for Azure Red Hat OpenShift
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 02/24/2021
author: stkirk
ms.author: stkirk
keywords: aro, openshift, az aro, red hat, cli, encryption, byok, cmk, keys
# Customer intent: My security policies dictate that data at rest must be encrypted. Beyond this, the key used to encrypt data must be able to be changed at-will by a person authorized to do so.

---

# Configuring Bring Your Own Key (BYOK) / Customer-managed Key (CMK) encryption on Azure Red Hat OpenShift (ARO)

Azure Storage encrypts all data in a storage account at rest. By default, data on the operating system and data disks is encrypted using Microsoft platform-managed keys. For more security surrounding persistent volumes, you can supply customer-managed encryption keys for persistent volume encryption in your Azure Red Hat OpenShift clusters.

## Before you begin
This article assumes that:

* You have a pre-existing ARO cluster at version 4.4 (or greater)

* You have the 'oc' OpenShift command-line tool, base64 (part of coreutils) and the 'az' Azure CLI installed

* You are logged in to your ARO cluster using *oc* as a global cluster-admin user (kubeadmin)

* You are logged in to the Azure CLI using *az* with an account authorized to grant "Contributor" access in the same subscription as the ARO cluster

> [!NOTE]
> At this stage, support exists only for encrypting ARO persistent volumes with customer-managed keys. This feature is not presently available for master/worker node operating system disks.

## Declare Cluster & Encryption Variables
Configure the variables below to whatever may be appropriate for your ARO cluster:
```
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
The Azure Disk Encryption Set will be used as a reference point for disks in ARO. It is connected to the Azure Key Vault and will obtain customer-managed keys from that location.
```azurecli-interactive
# Retrieve the Key Vault Id and store it in a variable
keyVaultId="$(az keyvault show --name $vaultName --query [id] -o tsv)"

# Retrieve the Key Vault key URL and store it in a variable
keyVaultKeyUrl="$(az keyvault key show --vault-name $vaultName --name $vaultKeyName  --query [key.kid] -o tsv)"

# Create an Azure Disk Encryption Set
az disk-encryption-set create -n $desName -g $buildRG --source-vault $keyVaultId --key-url $keyVaultKeyUrl -o table
```

## Assign required policies to the Azure Key Vault for the Azure Disk Encryption Set
Use the *Azure Disk Encryption Set* you created in the prior steps and grant the resource access to the Azure Key Vault:

```azurecli-interactive
# Determine the Azure Disk Encryption Set AppId value and set it a variable
desIdentity="$(az disk-encryption-set show -n $desName -g $buildRG --query [identity.principalId] -o tsv)"

# Update keyvault security policy settings to allow access to the disk encryption set
az keyvault set-policy -n $vaultName -g $buildRG --object-id $desIdentity --key-permissions wrapkey unwrapkey get -o table
```

## Obtain other IDs required for role assignments
The Managed Service Identity (MSI) must be created and other permissions must also be set:
```
# Obtain the Application ID of the service principal used in the ARO cluster
aroSPAppId="$(oc get secret azure-credentials -n kube-system -o jsonpath='{.data.azure_client_id}' | base64 --decode)"

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

## Implement other role assignments required for BYOK/CMK encryption
Apply the required role assignments using the variables obtained in the previous step:
```azurecli-interactive
# Ensure the Azure Disk Encryption Set can read the contents of the Azure Key Vault
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId -o jsonc

# Assign the MSI AppID 'Reader' permission over the Azure Disk Encryption Set & Key Vault Resource Group
az role assignment create --assignee $aroMSIAppId --role Reader --scope $buildRGResourceId -o jsonc

# Assign the ARO Service Principal 'Contributor' permission over the Azure Disk Encryption Set & Key Vault Resource Group
az role assignment create --assignee $aroSPObjId --role Contributor --scope $buildRGResourceId -o jsonc
```

> [!NOTE]
> If you receive an error message for any of the above role assignments, allow time for the Azure resources to be fully created and try the role assignment once again.

## Create the k8s Storage Class to be used for encrypted Premium & Ultra disks
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
## Perform variable substitution within the Storage Class configuration
Substitute the variables that are unique to your ARO cluster into the two storage class configuration files:
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
Verifying that customer-managed keys are enabled requires creating a persistent volume claim that utilizes the appropriate storage class. The code below will create a small Pod that will also mount a persistent volume claim using Standard disks.
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
Execute the commands below to apply the test Pod configuration and return the UID of the new persistent volume claim. The UID will be used to verify the disk is encrypted using BYOK/CMK.
```
# Apply the test pod configuration file and set the PVC UID as a variable to query in Azure later
pvcUid="$(oc apply -f test-pvc.yaml -o jsonpath='{.items[0].metadata.uid}')"

# Determine the full Azure Disk name
pvName="$(oc get pv pvc-$pvcUid -o jsonpath='{.spec.azureDisk.diskName}')"
```
## Verify PVC disk is configured with "EncryptionAtRestWithCustomerKey" 
The Pod should create a persistent volume claim that references the BYOK/CMK storage class. Running the following command will validate that the PVC has been deployed as expected:
```azurecli-interactive
# Describe the OpenShift cluster-wide persistent volume claims
oc describe pvc

# Verify with Azure that the disk is encrypted with a customer-managed key
az disk show -n $pvName -g $buildRG -o json --query [name,encryption]
```

## Limitations

* BYOK/CMK is only currently available in GA and Preview in certain [Azure regions][supported-regions]
* BYOK/CMK persistent volume disk encryption supported with ARO 4.4 + Kubernetes version 1.17 and above   
* BYOK/CMK operating system disk encryption is not presently available
* Available only in regions where BYOK/CMK is supported
* [Ultra disks must be enabled](disks-enable-ultra-ssd.md) on your subscription prior to use

## Next steps

<!-- LINKS - external -->

<!-- LINKS - internal -->
[best-practices-security]: /azure/aks/operator-best-practices-cluster-security
[byok-azure-portal]: /azure/storage/common/storage-encryption-keys-portal
[customer-managed-keys]: /azure/virtual-machines/windows/disk-encryption#customer-managed-keys
[key-vault-generate]: /azure/key-vault/key-vault-manage-with-cli2
[supported-regions]: /azure/virtual-machines/windows/disk-encryption#supported-regions
