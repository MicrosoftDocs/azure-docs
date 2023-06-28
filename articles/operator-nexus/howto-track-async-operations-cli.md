---
title: Tracking Asynchronous Operations Using Azure CLI
description: Instructions for how an asynchronous operation status may be discovered, tracked, and used to determine completion.
author: bryan-strassner
ms.author: bstrassner
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/09/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Tracking asynchronous operations using Azure CLI

Some Azure CLI operations are asynchronous. To track the status of an asynchronous operation, the `operationStatuses` resource can be used. Asynchronous commands can be run with a `--debug` flag enabled. When `--debug` is specified, the progress of the request can be monitored. The operation status URL can be found by examining the `Azure-AsyncOperation` or `Location` header on the HTTP response to the creation request.

```output
... many lines of logged information ...

urllib3.connectionpool: https://management.azure.com:443 "PUT /subscriptions/.../resourceGroups/.../providers/Microsoft.NetworkCloud/clusters/.../metricsConfigurations/default?api-version=2022-12-12-preview HTTP/1.1" 201 926
cli.azure.cli.core.util: Response status: 201
cli.azure.cli.core.util: Response headers:

... several lines of http headers of the response ...

cli.azure.cli.core.util:     'Azure-AsyncOperation': 'https://management.azure.com/subscriptions/.../providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/12312312-1231-1231-1231-123123123123*99399E995...?api-version=2022-12-12-preview'

... remaining http headers of the response and more lines of logging ...
```

Using the value from before:
`https://management.azure.com/subscriptions/.../providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/12312312-1231-1231-1231-123123123123*99399E995...?api-version=2022-12-12-preview`, an Azure CLI `az rest` call can be issued to retrieve the operation status.

```sh
az rest -m get -u "https://management.azure.com/subscriptions/.../providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/12312312-1231-1231-1231-123123123123*99399E995...?api-version=2022-12-12-preview"
```

This request will return an operation status result that can be requeried using the same command until the status reaches a final state of `Succeeded` or `Failed`. At this point, the requested operation has ceased.

```json
{
  "endTime": "2023-02-08T17:38:31.2042934Z",
  "error": {},
  "id": "subscriptions/.../providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/12312312-1231-1231-1231-123123123123*99399E995...?api-version=2022-12-12-preview",
  "name": "12312312-1231-1231-1231-123123123123*99399E995...",
  "properties": null,
  "resourceId": "subscriptions/.../resourceGroups/.../providers/Microsoft.NetworkCloud/clusters/.../metricsConfigurations/default?api-version=2022-12-12-preview",
  "startTime": "2023-02-08T17:38:24.7576911Z",
  "status": "Succeeded"
}
```
