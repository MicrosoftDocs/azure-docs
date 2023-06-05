---
author: msmbaldwin
ms.service: key-vault
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin
# Used by articles that register native client applications in the B2C tenant.
---

Use the Azure PowerShell [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault) cmdlet to create a Key Vault in the resource group from the previous step. You will need to provide some information:

- Key vault name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each key vault must have a unique name. Replace \<your-unique-keyvault-name\> with the name of your key vault in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **EastUS**.

```azurepowershell-interactive
New-AzKeyVault -Name "<your-unique-keyvault-name>" -ResourceGroupName "myResourceGroup" -Location "EastUS"
```

The output of this cmdlet shows properties of the newly created key vault. Take note of the two properties listed below:

- **Vault Name**: The name you provided to the -Name parameter above.
- **Vault URI**: In the example, this is https://&lt;your-unique-keyvault-name&gt;.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.
