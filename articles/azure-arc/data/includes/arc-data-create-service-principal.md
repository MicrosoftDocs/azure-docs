---
author: MikeRayMSFT
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: include
ms.date: 10/15/2018
ms.author: mikeray
---

Follow these commands to create your metrics upload service principal:

> [!NOTE]
> Creating a service principal requires [certain permissions in Azure](/azure/active-directory/develop/howto-create-service-principal-portal#permissions-required-for-registering-an-app).

To create a service principal, update the following example. Replace `<ServicePrincipalName>` with the name of your service principal and run the command:

```console
az ad sp create-for-rbac --name <ServicePrincipalName>
``` 

If you created the service principal earlier, and just need to get the current credentials, run the following command to reset the credential.

```console
az ad sp credential reset --name <ServicePrincipalName>
```

For example, to create a service principal named `azure-arc-metrics`, run the following command

```
az ad sp create-for-rbac --name azure-arc-metrics
```

Example output:

```output
"appId": "2e72adbf-de57-4c25-b90d-2f73f126e123",
"displayName": "azure-arc-metrics",
"name": "http://azure-arc-metrics",
"password": "5039d676-23f9-416c-9534-3bd6afc78123",
"tenant": "72f988bf-85f1-41af-91ab-2d7cd01ad1234"
```

Save the `appId`, `password`, and `tenant` values in an environment variable for use later. 

::: zone pivot="client-operating-system-windows-command"

```console
SET SPN_CLIENT_ID=<appId>
SET SPN_CLIENT_SECRET=<password>
SET SPN_TENANT_ID=<tenant>
```

::: zone-end

::: zone pivot="client-operating-system-macos-and-linux"

```console
export SPN_CLIENT_ID='<appId>'
export SPN_CLIENT_SECRET='<password>'
export SPN_TENANT_ID='<tenant>'
```

::: zone-end

::: zone pivot="client-operating-system-powershell"

```console
$Env:SPN_CLIENT_ID="<appId>"
$Env:SPN_CLIENT_SECRET="<password>"
$Env:SPN_TENANT_ID="<tenant>"
```

::: zone-end