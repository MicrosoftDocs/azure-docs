---
title: Azure Container Instances tutorial - Deploy app | Microsoft Docs
description: Azure Container Instances tutorial - Deploy app
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: 

ms.assetid: 
ms.service: container-instances
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2017
ms.author: seanmck
---

# Deploy a container group

Azure Container Instances support the deployment of multiple containers onto a single host using a *container group*. This document walks through the creation of an Azure Resource Manager (ARM) template defining a multi-container group, and deploying it to Azure Container Instances.

## Configure the ARM template

Create a faile name `azuredeploy.json` and copy the following json template into it. Pay particular attention to the `resources` section, which defines the container group, requests a public IP address for it, and provides a reference to the private Azure Container Registry where the container images are stored.

```json
"resources":[
        {
            "name": "aci-tutorial",
            "type": "Microsoft.Container/containerGroups",
            "apiVersion": "2017-04-01-preview",
            "location": "[resourceGroup().location]",
            "properties": {
                "containers": [
                    {
                        "name": "aci-tutorial-app",
                        "properties": {
                            "image": "[concat(parameters('imageRegistry'), '/aci-tutorial-app:v1]",
                            "ports": [
                                {
                                    "port": "80" 
                                }
                            ]
                        }
                    },
                    {
                        "name": "aci-tutorial-sidecar",
                        "properties": {
                            "image": "[concat(parameters('imageRegistry'), '/aci-tutorial-sidecar:v1]"                        
                        }
                    }
                ],
                "osType": "Linux",
                "ipAddress": {
                    "type": "Public",
                    "ports": [
                        {
                            "protocol": "tcp",
                            "port": "80" 
                        }
                    ]
                 },
                "imageRegistryCredentials": [
                  {
                    "server": "[parameters('imageRegistry')]",
                    "username": "[parameters('imageRegistryUsername')]",
                    "password": "[parameters('imageRegistryPassword')]"
                  }
                ]
            }
        }
  ]

```

The properties of the container registry are defined as template parameters in the `azuredeploy.parameters.json` file that is also available with the sample. Two parameters are required:

|Value|How to find|
|-----|-----------|
|Image registry login server URI|`az acr show --name <acrName>`|
|ARM ID of your Azure Key Vault|`az keyvault show --name <keyvaultName>`|


Create a file named `azuredeploy.parameters.json` and copy in the follwing json.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "imageRegistry": {
      "value": "acidemo.azurecr.io"
    },
    "imageRegistryUsername": {
      "value": "aciregistryusername"
    },
    "imageRegistryPassword": {
      "reference": {
        "keyVault": {
          "id": "/subscriptions/90c3d154-5f70-4d38-adea-9557ef27a699/resourceGroups/cseries-rg/providers/Microsoft.KeyVault/vaults/acikeyvault"
        },
        "secretName": "acrpassword"
      }
    }
  }
}
```

## Deploy the template

Deploy the template:

```bash
az group deployment create --name AciDeployment --resource-group myResourceGroup --template-file azuredeploy.json --parameters @azuredeploy.parameters.json
```

Within a few seconds, you will receive an initial response from ARM. To view the state of the deployment, use:

```bash
az group deployment show -n AciDeployment -g myResourceGroup
```

You can also view the state of your container group using:

```bash
az container show -n aci-tutorial -g myResourceGroup
```

Note the public IP address that has been provisioned for your container group.

## View the application and container logs

Once the deployment succeeds, you can open your browser to the IP address shown in the output of `az container show`.

You can also view the log output of the main application container and the sidecar.

Main app:

```bash
az container logs --name aci-tutorial --container-name aci-tutorial-app -g myResourceGroup
```

Output:

```bash
Server running...
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET /favicon.ico HTTP/1.1" 404 19
```

Sidecar:

```bash
az container logs --name aci-tutorial --container-name aci-tutorial-sidecar -g myResourceGroup
```

Output:

```bash
Every 3.0s: curl -I http://localhost                                                                                                                       Mon Jul 17 11:27:36 2017

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0  1663    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 1663
Content-Type: text/html; charset=utf-8
Last-Modified: Sun, 16 Jul 2017 02:08:22 GMT
Date: Mon, 17 Jul 2017 18:27:36 GMT
```

As you can see, the sidecar is periodically making a HTTP request to the main web application via the group's local network to ensure that it is running. In a real application, the sidecar could be expanded to trigger an alert if it received a HTTP response code other than 200 OK. 

## Next steps

This document covered the steps needed for deploying a multi-container Azure container instance. For an end to end Azure Container Instances experience, see the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
[Azure Container Instances ttorial]: ./container-instances-tutorial-prepare-app.md