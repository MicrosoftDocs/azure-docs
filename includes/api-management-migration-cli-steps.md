---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 08/09/2024
ms.author: danlep
---

Run the following Azure CLI commands, setting variables where indicated with the name of your API Management instance and the name of the resource group in which it was created.

> [!NOTE]
> The following script is written for the bash shell. To run the script in PowerShell, prefix the variable name with the `$` character when setting the variables. Example: `$APIM_NAME=...`.

```azurecli
APIM_NAME={name of your API Management instance}
# In PowerShell, use the following syntax: $APIM_NAME={name of your API Management instance}
RG_NAME={name of your resource group}
# Get resource ID of API Management instance
APIM_RESOURCE_ID=$(az apim show --name $APIM_NAME --resource-group $RG_NAME --query id --output tsv)
# Call REST API to migrate to stv2 and preserve VIP address
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "PreserveIp"}'
# Alternate call to migrate to stv2 and change VIP address
# az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "NewIp"}'
```  