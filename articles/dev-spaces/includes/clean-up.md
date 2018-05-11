---
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---
## Clean Up
To completely delete an Azure Dev Space, including all the running services within it, use the `azds resource rm` command. Bear in mind that this action is irreversible.

The following example lists the Azure Dev Spaces in your active subscription, and then deletes the environment named 'myenv' that is in the resource group 'myenv-rg'.

```cmd
azds resource list
azds resource rm --name myenv --resource-group myenv-rg
```

