---
title: Manage Azure Service Fabric Mesh Application Secrets | Microsoft Docs
description: Manage application Secrets so you can securely create and deploy a Service Fabric Mesh application.
services: service-fabric-mesh
keywords: secrets
author: aljo-microsoft
ms.author: aljo
ms.date: 4/2/2019
ms.topic: conceptual
ms.service: service-fabric-mesh
manager: chackdan
#Customer intent: As a developer, I need to securely deploy Secrets to my Service Fabric Mesh application.
---

# Manage Service Fabric Mesh Application Secrets
Service Fabric Mesh supports Secrets as Azure resources. A Service Fabric Mesh secret can be any sensitive text information such as storage connection strings, passwords, or other values that should be stored and transmitted securely. This article shows how to use the Service Fabric Secure Store Service to deploy and maintain Secrets.

A Mesh application Secret consists of:
* A **Secrets** resource, which is a container that stores text secrets. Secrets contained within the **Secrets** resource are stored and transmitted securely.
* One or more **Secrets/Values** resources that are stored in the **Secrets** resource container. Each **Secrets/Values** resource is distinguished by a version number. You cannot modify a version of a **Secrets/Values** resource, only append a new version.

Managing Secrets consists of the following steps:
1. Declare a Mesh **Secrets** resource in an Azure Resource Model YAML or JSON file using inlinedValue kind and SecretsStoreRef contentType definitions.
2. Declare Mesh **Secrets/Values** resources in an Azure Resource Model YAML or JSON file that will be stored in the **Secrets** resource (from step 1).
3. Modify Mesh application to reference Mesh secret values.
4. Deploy or rolling upgrade the Mesh application to consume secret values.
5. Use Azure "az" CLI commands for Secure Store Service lifecycle management.

## Declare a Mesh Secrets resource
A Mesh Secrets resource is declared in an Azure Resource Model JSON or YAML file using inlinedValue kind definition. The Mesh Secrets resource supports Secure Store Service sourced secrets. 
>
The following is an example of how to declare Mesh Secrets resources in a JSON file:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "WestUS",
      "metadata": {
        "description": "Location of the resources (e.g. westus, eastus, westeurope)."
      }
    }
  },
  "sfbpHttpsCertificate": {
      "type": "string",
      "metadata": {
        "description": "Plain Text Secret Value that your container ingest"
      }
  },
  "resources": [
    {
      "apiVersion": "2018-07-01-preview",
      "name": "sfbpHttpsCertificate.pfx",
      "type": "Microsoft.ServiceFabricMesh/secrets",
      "location": "[parameters('location')]", 
      "dependsOn": [],
      "properties": {
        "kind": "inlinedValue",
        "description": "SFBP Application Secret",
        "contentType": "text/plain",
      }
    }
  ]
}
```
The following is an example of how to declare Mesh Secrets resources in a YAML file:
```yaml
    services:
      - name: helloWorldService
        properties:
          description: Hello world service.
          osType: linux
          codePackages:
            - name: helloworld
              image: myapp:1.0-alpine
              resources:
                requests:
                  cpu: 2
                  memoryInGB: 2
              endpoints:
                - name: helloWorldEndpoint
                  port: 8080
          secrets:
            - name: MySecret.txt
            description: My Mesh Application Secret
            secret_type: inlinedValue
            content_type: SecretStoreRef
            value: mysecret
    replicaCount: 3
    networkRefs:
      - name: mynetwork
```

## Declare Mesh Secrets/Values resources
Mesh Secrets/Values resources have a dependency on the Mesh Secrets resources defined in the previous step.

Regarding the relationship between "resources" section "value:" and "name:" fields: the second part of the "name:" string delimited by a colon is the version number used for a secret, and the name before the colon needs to match the Mesh secret value for which it has a dependency. For example, for element ```name: mysecret:1.0```, the version number is 1.0 and the name ```mysecret``` must match the previously defined ```"value": "mysecret"```.

>
The following is an example of how to declare Mesh Secrets/Values resources in a JSON file:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "WestUS",
      "metadata": {
        "description": "Location of the resources (e.g. westus, eastus, westeurope)."
      }
    }
  },
  "sfbpHttpsCertificate": {
      "type": "string",
      "metadata": {
        "description": "Plain Text Secret Value that your container ingest"
      }
  },
  "resources": [
    {
      "apiVersion": "2018-07-01-preview",
      "name": "sfbpHttpsCertificate.pfx",
      "type": "Microsoft.ServiceFabricMesh/secrets",
      "location": "[parameters('location')]", 
      "dependsOn": [],
      "properties": {
        "kind": "inlinedValue",
        "description": "SFBP Application Secret",
        "contentType": "text/plain",
      }
    },
    {
      "apiVersion": "2018-07-01-preview",
      "name": "sfbpHttpsCertificate.pfx/2019.02.28",
      "type": "Microsoft.ServiceFabricMesh/secrets/values",
      "location": "[parameters('location')]",
      "dependsOn": [
        "Microsoft.ServiceFabricMesh/secrets/sfbpHttpsCertificate.pfx"
      ],
      "properties": {
        "value": "[parameters('sfbpHttpsCertificate')]"
      }
    }
  ],
}
```
The following is an example of how to declare Mesh Secrets/Values resources in a YAML file:
```yaml
    services:
      - name: helloWorldService
        properties:
          description: Hello world service.
          osType: linux
          codePackages:
            - name: helloworld
              image: myapp:1.0-alpine
              resources:
                requests:
                  cpu: 2
                  memoryInGB: 2
              endpoints:
                - name: helloWorldEndpoint
                  port: 8080
          Secrets:
            - name: MySecret.txt
            description: My Mesh Application Secret
            secret_type: inlinedValue
            content_type: SecretStoreRef
            value: mysecret
            - name: mysecret:1.0
            description: My Mesh Application Secret Value
            secret_type: value
            content_type: text/plain
            value: "P@ssw0rd#1234"
    replicaCount: 3
    networkRefs:
      - name: mynetwork
```

## Modify Mesh application to reference Mesh Secret values
Service Fabric Mesh applications need to be aware of the following two strings in order to consume Secure Store Service Secret values:
1. Microsoft.ServiceFabricMesh/Secrets.name contains the name of the file, and will contain the Secrets value in plaintext.
2. The Windows or Linux environment variable "Fabric_SettingPath" contains the directory path to where files containing Secure Store Service Secrets values will be accessible. This is "C:\Settings" for Windows-hosted and "/var/settings" for Linux-hosted Mesh applications respectively.

## Deploy or use a rolling upgrade for Mesh application to consume Secret values
Creating Secrets and/or versioned Secrets/Values is limited to resource model declared deployments. The only way to create these resources is by passing a resource model JSON or YAML file using the **az mesh deployment** command as follows:

```azurecli-interactive
az mesh deployment create –-<template-file> or --<template-uri>
```

## Azure CLI commands for Secure Store Service lifecycle management

### Create a new Secrets resource
```azurecli-interactive
az mesh deployment create –-<template-file> or --<template-uri>
```
Pass either **template-file** or **template-uri** (but not both).

For example:
- az mesh deployment create --c:\MyMeshTemplates\SecretTemplate1.txt
- az mesh deployment create --https:\//www.fabrikam.com/MyMeshTemplates/SecretTemplate1.txt

### Show a Secret
Returns the description of the secret (but not the value).
```azurecli-interactive
az mesh secret show --Resource-group <myResourceGroup> --secret-name <mySecret>
```

### Delete a Secret

- A secret cannot be deleted while it is being referenced by a Mesh application.
- Deleting a Secrets resource deletes all Secrets/Resources versions.
  ```azurecli-interactive
  az mesh secret delete --Resource-group <myResourceGroup> --secret-name <mySecret>
  ```

### List Secrets in Subscription
```azurecli-interactive
az mesh secret list
```
### List Secrets in Resource Group
```azurecli-interactive
az mesh secret list -g <myResourceGroup>
```
### List all Versions of a Secret
```azurecli-interactive
az mesh secretvalue list --Resource-group <myResourceGroup> --secret-name <mySecret>
```

### Show Secret Version Value
```azurecli-interactive
az mesh secretvalue show --Resource-group <myResourceGroup> --secret-name <mySecret> --version <N>
```

### Delete Secret Version Value
```azurecli-interactive
az mesh secretvalue delete --Resource-group <myResourceGroup> --secret-name <mySecret> --version <N>
```

## Next steps 
To learn more about Service Fabric Mesh, read the overview:
- [Service Fabric Mesh overview](service-fabric-mesh-overview.md)
