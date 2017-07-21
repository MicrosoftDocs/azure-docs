---
title: Azure Container Instances tutorial - Deploy app | Microsoft Docs
description: Azure Container Instances tutorial - Deploy app
services: container-instances
documentationcenter: ''
author: neilpeterson
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
ms.author: nepeters
---

# Deploy a container group

Azure Container Instances support the deployment of multiple containers onto a single host using a *container group*. This document walks through running a multi-contianer group with an Azure Resource Manager (ARM) template.

## Configure the ARM template

Create a file name `azuredeploy.json` and copy the following json template into it. 

In this sample, a container group with two containers and a public IP address is defined. The first container of the group will run an internet facing application. The second container, the side-car, makes an HTTP request to the main web application via the group's local network. In a real application, the sidecar could be expanded to trigger an alert if it received a HTTP response code other than 200 OK. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
  },
  "variables": {
    "containerGroupName": "myContainerGroup",
    "image1": "neilpeterson/nepetersv1",
    "image2": "neilpeterson/kubectl-proxy-sidecar"
  },
    "resources": [
      {
        "name": "myContainerGroup",
        "type": "Microsoft.Container/containerGroups",
        "apiVersion": "2017-04-01-preview",
        "location": "[resourceGroup().location]",
        "properties": {
          "containers": [
            {
              "name": "image1",
              "properties": {
                "image": "[variables('image1')]",
                "ports": [
                  {
                    "port": 80
                  }
                ]
              }
            },
            {
              "name": "image2",
              "properties": {
                "image": "[variables('image2')]"
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
          }
        }
      }
    ],
    "outputs": {
      "containerIPv4Address": {
        "type": "string",
        "value": "[reference(resourceId('Microsoft.Container/containerGroups/', 'myContainerGroup')).ipAddress.ip]"
      }
    }
  }
```

To use a private container image registry, add an object to the json with the following format. A complete example can be seen in the [ACI GitHub Repo](https://github.com/Microsoft/azure-cseries-preview/blob/master/templates/201-privateregistry/azuredeploy.json).

```json
"imageRegistryCredentials": [
    {
    "server": "[parameters('imageRegistryLoginServer')]",
    "username": "[parameters('imageRegistryUsername')]",
    "password": "[parameters('imageRegistryPassword')]"
    }
]
```

## Deploy the template

Create a resource group with the [az group create](/cli/azure/group#create) command.

```azurecli-interactive
az group create --name myResourceGroup --location westus
```

Deploy the template with the [az group deployment create](/cli/azure/group/deployment#create) command.

```bash
az group deployment create --name myContainerGroup --resource-group myResourceGroup --template-file azuredeploy.json
```

Within a few seconds, you will receive an initial response from ARM. 

## View deployment state

To view the state of the deployment, use the `az container show` command. This will return the provisioned public IP address over which the application can be accessed.

```bash
az container show --name myContainerGroup --resource-group myResourceGroup
```

## View logs   

View the log output of a container using the `az container logs` command. The `--container-name` argument specifies the container from which to pull logs. In this example, the first container is specified. 

```bash
az container logs --name myContainerGroup --container-name aci-tutorial-app --resource-group myResourceGroup
```

Output:

```bash
Server running...
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET / HTTP/1.1" 200 1663
172.17.0.1 - - [17/Jul/2017:18:25:50 +0000] "GET /favicon.ico HTTP/1.1" 404 19
```

To see the logs for the side-car container, run the same command specifying the second container name.

```bash
az container logs --name myContainerGroup --container-name aci-tutorial-sidecar --resource-group myResourceGroup
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

As you can see, the sidecar is periodically making a HTTP request to the main web application via the group's local network to ensure that it is running.

## Next steps

This document covered the steps needed for deploying a multi-container Azure container instance. For an end to end Azure Container Instances experience, see the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
[Azure Container Instances ttorial]: ./container-instances-tutorial-prepare-app.md