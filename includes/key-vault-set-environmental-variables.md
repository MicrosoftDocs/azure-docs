---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

The DefaultAzureCredential method in our application relies on three environmental variables: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID`. Set these variables to the clientId, clientSecret, and tenantId values that were returned in the "Create a service principal" step using the `export VARNAME=VALUE` format. (This method only sets the variables for your current shell and processes created from the shell; to permanently add these variables to your environment, edit your `/etc/environment ` file.) 

You will also need to save your key vault name as an environment variable called `KEY_VAULT_NAME`.

```console
export AZURE_CLIENT_ID=<your-clientID>

export AZURE_CLIENT_SECRET=<your-clientSecret>

export AZURE_TENANT_ID=<your-tenantId>

export KEY_VAULT_NAME=<your-key-vault-name>
````
