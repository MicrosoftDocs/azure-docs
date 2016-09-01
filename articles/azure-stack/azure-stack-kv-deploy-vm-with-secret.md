# Tenant can deploy a VM by retrieving the password that is stored in Key Vault #

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Stack Key Vault and reference the value in other Resource Manager templates. You include only a reference to the secret in your template so the secret is never exposed, and you do not need to manually enter
the value for the secret each time you deploy the resources. You specify which users or service principals can access the secret.

## Reference a secret with static id ##

You reference the secret from within a parameters file which passes values to your template. You reference the secret by passing the resource identifier of the key vault and the name of the secret. In this example, the key vault secret must already exist, and you are using a static value for it resource id.

    "parameters": {
    "adminPassword": {
    "reference": {
    "keyVault": {
    "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
    },
    "secretName": "sqlAdminPassword"
    

**Tip:**

----------
The parameter that accepts the secret should be a *securestring*.

