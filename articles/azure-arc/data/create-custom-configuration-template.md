---
title: Create custom configuration templates
description: Create custom configuration templates
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dinethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 06/27/2021
ms.topic: how-to
---
[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

# Create custom configuration templates


One of required parameters during deployment of a data controller, whether in direct mode or indirect mode, is the ```--profile-name``` parameter. Currently, the available list of built-in profiles can be found via running the query:
```
az arcdata dc config list
```
These profiles are template JSON files that have various settings for the Azure Arc data controller such as docker registry and repository settings, storage classes for data and logs, storage size for data and logs, security, service type etc. and can be customized to your environment. 

### Create custom.json file

Run the ```az arcdata dc config init``` command to initiate a control.json file with pre-defined settings based on your distribution of kubernetes cluster.
For instance, a template control.json file for a kubernetes cluster based on upstream kubeadm can be created as follows:
```
az arcdata dc config init --source azure-arc-kubeadm --path custom
```
The created control.json file can be edited in any editor such as Visual Studio Code to customize the settings appropriate for your environment.

### Use custom control.json file for deploying Azure Arc data controller using azdata CLI

Once the template file is updated, the file can be applied during Azure Arc data controller create as follows:
```
az arcdata dc create --path ./custom --namespace arc --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect

#Example:
#az arcdata dc create --path ./custom --namespace arc --name arc --subscription 1e5ff510-76cf-44cc-9820-82f2d9b51951 --resource-group my-resource-group --location eastus --connectivity-mode indirect
```

### Use custom control.json file for deploying Azure Arc data controller using Azure portal

From the Azure Arc data controller create screen, select "Configure custom template" under Custom template. This will invoke a blade to provide custom settings. In this blade, you can either type in the values for the various settings, or upload a pre-configured control.json file directly. 

After ensuring the values are correct, click Apply to proceed with the Azure Arc data controller deployment.





