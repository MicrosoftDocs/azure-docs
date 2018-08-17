---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: ghogen
ms.author: ghogen
ms.date: "05/11/2018"
ms.topic: "include"
manager: douge
---
### Sign in to Azure CLI
Sign in to Azure. Type the following command in a terminal window:

```cmd
az login
```

> [!Note]
> If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).

#### If you have multiple Azure subscriptions...
You can view your subscriptions by running: 

```cmd
az account list
```
Locate the  subscription which has `isDefault: true` in the JSON output.
If this isn't the subscription you want to use, you can change the default subscription:

```cmd
az account set --subscription <subscription ID>
```
