---
title: Update service principal credentials
description: Update credential for a service principal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: AbdullahMSFT
ms.author: amamun
ms.reviewer: mikeray
ms.date: 04/16/2024
ms.topic: how-to
---

# Update service principal credentials

This article explains how to update the secrets in the data controller.

For example, if you:

- Deployed the data controller using a specific set of values for service principal tenant ID, client ID, and client secret
- Change one or more of these values

You need to update the secrets in the data controller. 

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

   The `kubectl edit` command opens the credentials .yml file in the default editor. 


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
     authority: <authority id>
     clientId: <client id>
     clientSecret: <client secret>==
     tenantId: <tenant id>
   kind: Secret
   metadata:
     creationTimestamp: "2020-12-02T05:02:04Z"
     name: upload-service-principal-secret
     namespace: arc
     resourceVersion: "7235659"
     selfLink: /api/v1/namespaces/arc/secrets/upload-service-principal-secret
     uid: <globally unique identifier>
   type: Opaque
   ```

   Edit the values for `clientID`, `clientSecret` and/or `tenantID` as appropriate. 

> [!NOTE]
>The values need to be base64 encoded. 
Do not edit any other properties.

If an incorrect value is provided for `clientId`, `clientSecret`, or `tenantID` the command returns an error message as follows in the `control-xxxx` pod/controller container logs:

```output
YYYY-MM-DD HH:MM:SS.mmmm | ERROR | [AzureUpload] Upload task exception: A configuration issue is preventing authentication - check the error message from the server for details.You can modify the configuration in the application registration portal. See https://aka.ms/msal-net-invalid-client for details. Original exception: AADSTS7000215: Invalid client secret is provided.
```

## Related content

- [Create service principal](upload-metrics-and-logs-to-azure-monitor.md#create-service-principal)
