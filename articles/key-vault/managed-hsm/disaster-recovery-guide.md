---
title: What to do if there if an Azure service disruption that affects Managed HSM - Azure Key Vault | Microsoft Docs
description: Learn what to do f there is an Azure service disruption that affects Managed HSM.
services: key-vault
author: amitbapat

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 09/15/2020
ms.author: ambapat
---

# Managed HSM disaster recovery

You may wish to create an exact replica of your HSM if the original is lost or unavailable due to any of the below reasons:

- It was deleted and then purged.
- A catastrophic failure in the region resulted in all member partitions being destroyed.

You can re-create the HSM instance in same or different region if you have the following:
- The [Security Domain](security-domain.md) of the source HSM.
- The private keys (at least quorum number) that encrypt the security domain.
- The most recent full HSM [backup](backup-restore.md) from the source HSM.

Here are the steps of the disaster recovery procedure:

1. Create a new HSM Instance.
1. Activate "Security Domain recovery". A new RSA key pair (Security Domain Exchange Key) will be generated for Security Domain transfer and sent in response, which will be downloaded as a SecurityDomainExchangeKey (public key).
1. Create and then upload the "Security Domain Transfer File". You will need the private keys that encrypt the security domain. The private keys are used locally, and never transferred anywhere in this process.
1. Take a backup of the new HSM. A backup is required before any restore, even when the HSM is empty. Backups allow for easy roll-back.
1. Restore the recent HSM backup from the source HSM

The contents of your key vault are replicated within the region and to a secondary region at least 150 miles away but within the same geography. This feature maintains high durability of your keys and secrets. See the [Azure paired regions](../../best-practices-availability-paired-regions.md) document for details on specific region pairs.

## Create a new managed HSM

Use the `az keyvault create` command to create a Managed HSM. This script has three mandatory parameters: a resource group name, an HSM name, and the geographic location.

You must provide the following inputs to create a Managed HSM resource:

- The name for the HSM.
- The resource group where it will be placed in your subscription.
- The Azure location.
- A list of initial administrators.

The example below creates an HSM named **ContosoMHSM**, in the resource group  **ContosoResourceGroup**, residing in the **East US 2** location, with **the current signed in user** as the only administrator.

```azurecli-interactive
oid=$(az ad signed-in-user show --query objectId -o tsv)
az keyvault create --hsm-name "ContosoMHSM" --resource-group "ContosoResourceGroup" --location "East US 2" --administrators $oid
```

> [!NOTE]
> The create command can take a few minutes. Once it returns successfully, you are ready to activate your HSM.

The output of this command shows properties of the Managed HSM that you've created. The two most important properties are:

* **name**: In the example, the name is ContosoMHSM. You'll use this name for other Key Vault commands.
* **hsmUri**: In the example, the URI is 'https://contosohsm.managedhsm.azure.net.' Applications that use your HSM through its REST API must use this URI.

Your Azure account is now authorized to perform any operations on this Managed HSM. As of yet, nobody else is authorized.

## Activate the Security Domain recovery mode

In the normal create process, we initialize and download a new Security Domain at this point. However, since we are executing a disaster recovery procedure, we request the HSM to enter Security Domain Recovery Mode and download a Security Domain Exchange Key. The Security Domain Exchange Key is an RSA public key that will be used to encrypt the security domain before uploading it to the HSM. The corresponding private key is protected inside the HSM, to keep your Security Domain contents safe during the transfer.

```azurecli-interactive
az keyvault security-domain init-recovery --hsm-name ContosoMHSM2 --sd-exchange-key ContosoMHSM2-SDE.cer
```

## Upload Security Domain to destination HSM

For this step you will need following:
- The Security Domain Exchange Key you downloaded in previous step.
- The Security Domain of the source HSM.
- At least quorum number of private keys that were used to encrypt the security domain.

The `az keyvault security-domain upload` command performs following operations:

- Decrypt the source HSM's Security Domain with the private keys you supply. 
- Create a Security Domain Upload blob encrypted with the Security Domain Exchange Key we downloaded in the previous step and then
- Upload the Security Domain Upload blob to the HSM to complete security domain recovery

In the example below, we use the Security Domain from the **ContosoMHSM**, the 2 of the corresponding private keys, and upload it to **ContosoMHSM2**, which is waiting to receive a Security Domain. 

```azurecli-interactive
az keyvault security-domain upload --hsm-name ContosoMHSM2 --sd-exchange-key ContosoMHSM-SDE.cer --sd-file ContosoMHSM-SD.json --sd-wrapping-keys cert_0.key cert_1.key
```

Now both the source HSM (ContosoMHSM) and the destination HSM (ContosoMHSM2) have the same security domain. We can now restore a full backup from the source HSM into the destination HSM.

## Create a backup (as a restore point) of your new HSM

It is always a good idea to take a full backup before you execute a full HSM restore, so that you have a restore point in case something goes wrong with the restore.

To create an HSM backup, you will need the following
- A storage account where the backup will be stored
- A blob storage container in this storage account where the backup process will create a new folder to store encrypted backup

We use `az keyvault backup` command to the HSM backup in the storage container **mhsmbackupcontainer**, which is in the storage account **ContosoBackup** for the example below. We create a SAS token that expires in 30 minutes and provide that to Managed HSM to write the backup.

```azurecli-interactive
end=$(date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ')
skey=$(az storage account keys list --query '[0].value' -o tsv --account-name ContosoBackup)
sas=$(az storage container generate-sas -n mhsmbackupcontainer --account-name ContosoBackup --permissions crdw --expiry $end --account-key $skey -o tsv)
az keyvault backup start --hsm-name ContosoMHSM2 --storage-account-name ContosoBackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas

```

## Restore backup from source HSM

For this step you need the following:

- The storage account and the blob container where the source HSM's backups are stored.
- The folder name from where you want to restore the backup. If you create regular backups, there will be many folders inside this container.


```azurecli-interactive
end=$(date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ')
skey=$(az storage account keys list --query '[0].value' -o tsv --account-name ContosoBackup)
sas=$(az storage container generate-sas -n mhsmdemobackupcontainer --account-name ContosoBackup --permissions rl --expiry $end --account-key $skey -o tsv)
az keyvault restore start --hsm-name ContosoMHSM2 --storage-account-name ContosoBackup --blob-container-name mhsmdemobackupcontainer --storage-container-SAS-token $sas --backup-folder mhsm-ContosoMHSM-2020083120161860
```

Now you have completed a full disaster recovery process. The contents of the source HSM when the backup was taken are copied to the destination HSM, including all the keys, versions, attributes, tags, and role assignments.

## Next steps

- Learn more about Security Domain see [About Managed HSM Security Domain](security-domain.md)
- Follow [Managed HSM best practices](best-practices.md)
