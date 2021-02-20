---
title: Store secrets in a key vault in Azure DevTest Labs | Microsoft Docs
description: Learn how to store secrets in an Azure Key Vault and use them while creating a VM, formula, or an environment. 
ms.topic: article
ms.date: 06/26/2020
---

# Store secrets in a key vault in Azure DevTest Labs
You may need to enter a complex secret when using Azure DevTest Labs: password for your Windows VM, public SSH key for your Linux VM, or personal access token to clone your Git repo through an artifact. Secrets are usually long and have random characters. Therefore, entering them can be tricky and inconvenient, especially if you use the same secret multiple times.

To solve this problem and also keep your secrets in a safe place, DevTest Labs supports storing secrets in an [Azure key vault](../key-vault/general/overview.md). When a user saves a secret for the first time, the DevTest Labs service automatically creates a key vault in the same resource group that contains the lab and stores the secret in the key vault. DevTest Labs creates a separate key vault for each user. 

Please note that lab user will need to first create a lab virtual machine before they can create a secret in the key vault. This is because DevTest Lab service needs to associate the lab user with a valid user document before they are allowed to create and store secrets in their key vault. 


## Save a secret in Azure Key Vault
To save your secret in Azure Key Vault, do the following steps:

1. Select **My secrets** on the left menu.
2. Enter a **name** for the secret. You see this name in the drop-down list when creating a VM, formula, or an environment. 
3. Enter the secret as the **value**.

    ![Store secret](media/devtest-lab-store-secrets-in-key-vault/store-secret.png)

## Use a secret from Azure Key Vault
When you need to enter a secret to create a VM, formula, or an environment, you can either enter a secret manually or select a saved secret from the key vault. To use a secret stored in your key vault, do the following actions:

1. Select **Use a saved secret**. 
2. Select your secret from the drop-down list for **Pick a secret**. 

    ![Use secret in VM](media/devtest-lab-store-secrets-in-key-vault/secret-store-pick-a-secret.png)

## Use a secret in an Azure Resource Manager template
You can specify your secret name in an Azure Resource Manager template that's used to create a VM as shown in the following example:

![Use secret in formula or environment](media/devtest-lab-store-secrets-in-key-vault/secret-store-arm-template.png)

## Next steps

- [Create a VM using the secret](devtest-lab-add-vm.md) 
- [Create a formula using the secret](devtest-lab-manage-formulas.md)
- [Create an environment using the secret](devtest-lab-create-environment-from-arm.md)
