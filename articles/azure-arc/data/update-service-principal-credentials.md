---
title: Update service principal credentials
description: Update credential for a service principal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Update service principal credentials

When the service principal credentials change, you need to update the secrets in the data controller.

For example, if you deployed the data controller using a specific set of values for service principal tenant ID, client ID, and client secret, and then change one or more of these values, you need to update the secrets in the data controller.  Following are the instructions to update Tenant ID, Client ID or the Client secret. 


## Background

The service principal was created at [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal). 

## Steps

1. Access the service principal secret in the default editor.

   ```console
   kubectl edit secret/upload-service-principal-secret -n <name of namespace>
   ```

   For example, to edit the service principal secret to a data controller in the `arc` namespace, run the following command:

   ```console
   kubectl edit secret/upload-service-principal-secret -n arc
   ```

   The `kubecl edit` command opens the credentials .yml file in the default editor. 


1. Edit the service principal secret. 

   In the default editor, replace the values in the data section with the updated credential information.

   For instance:

   ```console
   # Please edit the object below. Lines beginning with a '#' will be ignored,
   # and an empty file will abort the edit. If an error occurs while saving this file will be
   # reopened with the relevant failures.
   #
   apiVersion: v1
   data:
     authority: aHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29t
     clientId: NDNiNDcwYrFTGWYzOC00ODhkLTk0ZDYtNTc0MTdkN2YxM2Uw
     clientSecret: VFA2RH125XU2MF9+VVhXenZTZVdLdECXFlNKZi00Lm9NSw==
     tenantId: NzJmOTg4YmYtODZmMRFVBGTJLSATkxYWItMmQ3Y2QwMTFkYjQ3
   kind: Secret
   metadata:
     creationTimestamp: "2020-12-02T05:02:04Z"
     name: upload-service-principal-secret
     namespace: arc
     resourceVersion: "7235659"
     selfLink: /api/v1/namespaces/arc/secrets/upload-service-principal-secret
     uid: 7fb693ff-6caa-4a31-b83e-9bf22be4c112
   type: Opaque
   ```

   Edit the values for `clientID`, `clientSecret` and/or `tenantID` as appropriate. 

> [!NOTE]
>The values need to be base64 encoded. 
Do not edit any other properties.

If an incorrect value is provided for `clientId`, `clientSecret` or `tenantID` then you will see an error message as follows in the `control-xxxx` pod/controller container logs:

```output
YYYY-MM-DD HH:MM:SS.mmmm | ERROR | [AzureUpload] Upload task exception: A configuration issue is preventing authentication - check the error message from the server for details.You can modify the configuration in the application registration portal. See https://aka.ms/msal-net-invalid-client for details.  Original exception: AADSTS7000215: Invalid client secret is provided.
```



## Next steps

[Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal)
