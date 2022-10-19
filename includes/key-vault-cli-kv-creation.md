---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by Key Vault CLI quickstarts

---

Use the Azure CLI [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command to create a Key Vault in the resource group from the previous step. You will need to provide some information:

- Key vault name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each key vault must have a unique name. Replace \<your-unique-keyvault-name\> with the name of your key vault in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **EastUS**.

```azurecli
az keyvault create --name "<your-unique-keyvault-name>" --resource-group "myResourceGroup" --location "EastUS"
```

The output of this command shows properties of the newly created key vault. Take note of the two properties listed below:

- **Vault Name**: The name you provided to the --name parameter above.
- **Vault URI**: In the example, this is https://&lt;your-unique-keyvault-name&gt;.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.
