---
title: "Azure Operator Nexus: How to create and manage IP prefixes"
description: Learn to create, view, list, update, and delete IP prefixes and IP prefix rules.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/28/2024
ms.custom: template-how-to
---

# Overview

This article explains the main management operations for IP prefixes and IP prefix rules in Azure Operator Nexus.


## IP prefixes

### Create an IP prefix


To create an IP Prefix resource, follow these steps: 

1.  Specify the properties and rules of the IP Prefix resource. You can use the following azcli command as a reference: 

    ```azurecli
az networkfabric ipprefix create \
  --resource-group myResourceGroup \
  --name myIpPrefix \
  --location eastus \
  --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=10.10.10.0/28 sequenceNumber=10 \
  --ip-prefix-rules action=Permit condition=EqualTo networkPrefix=20.20.20.0/24 sequenceNumber=20
```

    Hello



