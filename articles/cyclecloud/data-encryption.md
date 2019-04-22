---
title: Azure CycleCloud Data Encryption | Microsoft Docs
description: Generate encryption keys and encrypt your files within Azure CycleCloud.
author: KimliW
ms.date: 10/19/2018
ms.author: adjohnso
---

# Data Encryption

Azure CycleCloud can encrypt files using strong AES 256-bit encryption. The encryption is
performed using the standard Java Cryptography Architecture (JCA) security library
provided with the Oracle Java Runtime Environment, which provides strong, standards-based
encryption tools that avoid the pitfalls of weak encryption. The SecureRandom class
ensures that cryptographically secure random keys are generated and used for the
encryption of data. When uploading data, encryption is performed in parallel as to
minimize the impact on transfer performance.

Users can generate or import encryption keys and use them to encrypt data when uploading
to Azure Block Storage. CycleCloud also provides
a way to export the encryption keys for backup purposes. Administrative users may specify
a key backup script, which can be run at scheduled intervals to backup keys to a secure
location. The cycle_server account and the key backup script must be secured in
such a way that will not lead to a security breach.

## Add an Encryption Key

There are two ways to add an encryption key to your data: you can import an existing key, or you can generate one within CycleCloud.

### Generating an Encryption Key

Open the Transfer Manager dashboard by clicking on **Data**, then **Transfer Manager**. The Encryption Key is located in the upper right corner, under your account name:

![Encryption Key](~/images/encryption_key.png)

Click the green **+** to open the Encryption Key window.

Give your key a unique name, then click save. A short progress bar will appear as the key is created, and the window will close. On the Transfer Manager dashboard, the name of key you just generated will be displayed in the Encryption Key window.

To remove or change the key, use the dropdown button next to the Encryption Key name and select **None**.

### Importing an Existing Key

To use an existing key, click the green **+** next to the Encryption Key name.

In the Encryption Key window, click **show**. Paste the contents of the key in the text box, then click **Save**. On the Transfer Manager dashboard, the name of key you just imported will be displayed in the Encryption Key window.

To remove or change the key, use the dropdown button next to the Encryption Key name and select **None**.

## Encrypting Files

There are three ways to specify files are to be encrypted:

* Edit Endpoint: In the Transfer Manager, click the Endpoint dropdown and select **Edit Endpoint**. Select, import, or generate an encryption key to use for the endpoint, then click **Save**.
* Data Transfer Manager: Upper right corner of the Transfer Manager (as shown above)
* Advanced Transfer: Select the file(s) to be transferred and click the arrow with the clock. **Show** the Advanced section, and select, create, or import the encryption key to use.

> [!NOTE]
> Adding or changing an encryption key via the Data Transfer Manager or Advanced Transfer methods will override the default options for the specific transfer you are doing.

## Azure Disk Encryption

It is possible to encryption your Azure IaaS VMs with CycleCloud using the [encryption extension](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-overview). Currently, only Windows OS virtual machines can utilize this feature (Linux support is coming in a future release). To enable encryption add these parameters to the node:

``` ini
[[node my-virutal-machine]]
  Encryption.KeyVaultUrl = https://my-keyvault.vault.azure.net/
  Encryption.KeyVaultResourceId = /subscriptions/my-subscription-id/resourceGroups/my-resourcegroup/providers/Microsoft.KeyVault/vaults/my-keyvault
  Encryption.KeyEncryptionKeyURL = https://my-keyvault.vault.azure.net/keys/my-key-encryption-key/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The `KeyEncryptioinKeyURL` is only required if you are going to use a key to encrypt the auto-generated disk encryption keys.

> [!NOTE]
> You will have to set up your keys and vaults in the Azure Portal before using this feature. Remember to enable your vault for disk encryption!
