---
title: Troubleshoot Azure Arc-enabled data services deployment - Active Directory
description: Introduction deployment (Active Directory)
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/15/2021
ms.topic: how-to
---

# Troubleshoot Arc-enabled data services Active Directory integration deployment 

This article describes how to troubleshoot and fix issues when you deploy Azure Arc-enabled data services with Active Directory integration. 

## Deployment stuck 

Sometime the deployment got stuck in the process when deploying an Active Directory integrated data controller in manual mode. 

### Verify 

Check if your keytab secret data is incorrect. In some cases, when the keytab file is created and after base64 encoding the file, it is as data in kubernetes secret. 

Ensure the base64 encoding is of the keytab original file content and not `klist –kte` output. 

### Solution

To fix this issue, create a new keytab file. Ensure the base64 encoding is correct. Make sure that the content of the Kubernetes secret is correct base64 encoded keytab content. Use the following command:  

```console
kubectl describe secret  <your secret name>   -n <your namespace>  
```

Edit the SQL Managed Instance specification file where `keytabSecret` is described. Update with the name of the new k8s keytab secret to update with correct keytab file. 

```console
kubectl describe pod  <your SQL MI pod>   -n <your namespace> 
```

## Next steps

[Scenario: View inventory of your instances in the Azure portal](view-arc-data-services-inventory-in-azure-portal.md)
