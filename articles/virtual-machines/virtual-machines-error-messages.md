---
title: Azure Virtual Machine Error Messages
description: 
services: virtual-machines
documentationcenter: ''
author: xujing-ms
manager: timlt
editor: ''

ms.assetid: ''
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 3/17/2017
ms.author: xujing

---
# Azure Virtual Machine Error Messages
This article describes the common error codes and messages you encounter when managing an Azure Virtual Machine(VM).  

>[!NOTE]
>Leave comments on this page for error meesgae feedback or through [Azure feedback](https://feedback.azure.com/forums/216843-virtual-machines) with #azerrormessage tag.
>
>

## Error Response Format 
Azure VM uses the following JSON format for error response. The error response consists of a status code, error code, and error message. If the VM deployment is created through a template, then the error is split between a top level error code and inner level error code. The most inner level of error message is often the root cause of failure. 
```json
{
  "status": "status code",
  "error": {
    "code":"Top level error code",
    "message":"Top level error message",
    "details":[
     {
      "code":"Inner evel error code",
      "message":"Inner level error message"
     }
    ]
   }
}
```

## Common Virtual Machine Management Error

This section lists the common error messages for managing your virtual machine



|  Error Code  |  Error Message  | Description |
|  :------| :-------------|  :--------- |
