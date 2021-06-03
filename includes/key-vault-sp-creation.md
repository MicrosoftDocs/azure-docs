---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

The simplest way to authenticate a cloud-based application is with a managed identity; see [Authenticate to Key Vault](../articles/key-vault/general/authentication.md) for details.

For the sake of simplicity however, this quickstart creates a desktop application, which requires the use of a service principal and an access control policy. Your service principal requires a unique name in the format "http://&lt;my-unique-service-principal-name&gt;".

Create a service principal using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command:

```azurecli
az ad sp create-for-rbac --skip-assignment -n "http://<my-unique-service-principal-name>" --sdk-auth
```

This operation will return a series of key / value pairs.

```console
{
  "clientId": "7da18cae-779c-41fc-992e-0527854c6583",
  "clientSecret": "b421b443-1669-4cd7-b5b1-394d5c945002",
  "subscriptionId": "443e30da-feca-47c4-b68f-1636b75e16b3",
  "tenantId": "35ad10f1-7799-4766-9acf-f2d946161b77",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```