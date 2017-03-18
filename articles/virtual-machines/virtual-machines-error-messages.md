---
title: Azure Virtual Machine Error Messages
description: 
services: virtual-machines
documentationcenter: ''
author: ''
manager: timlt
editor: ''

ms.assetid: 332583b6-15a3-4efb-80c3-9082587828b0
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 3/17/2017
ms.author: xujing

---
# Azure Virtual Machine Error Messages
This article describes the common error codes and messages you encounter when managing an Azure Virtual Machine(VM).  

## Error Response Format 
Azure VM uses the following JSON format for error response.
```json
{
  "status": "statuscode",
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

|  State   | Abrev. |   Capital   | Capital since | Population | Largest Population? |
| :------- | :----: | :---------- | :-----------: | ---------: | :-----------------: |
| Alabama  |   AL   | Montgomery  |     1846      |     205764 |         No          |
| Alaska   |   AK   | Juneau      |     1906      |      31275 |         No          |
| Arizona  |   AZ   | Phoenix     |     1889      |    1445632 |         Yes         |
| Arkansas |   AR   | Little Rock |     1821      |     193524 |         Yes         |

1. If you have an Enterprise Agreement subscription, you can [deploy VMs from specific Marketplace images](#deploy-a-vm-using-the-azure-marketplace) that are pre-configured with Azure Hybrid Use Benefit.
2. Without an Enterprise Agreement, you can [upload a custom VM](#upload-a-windows-vhd) and [deploy using a Resource Manager template](#deploy-a-vm-via-resource-manager) or [Azure PowerShell](#detailed-powershell-deployment-walkthrough).

## Deploy a VM using the Azure Marketplace
For customers with [Enterprise Agreement subscriptions](https://www.microsoft.com/Licensing/licensing-programs/enterprise.aspx), images are available in the Marketplace pre-configured with Azure Hybrid Use Benefit. These images can be deployed directly from the Azure portal, Resource Manager templates, or Azure PowerShell, for example. Images in the Marketplace are noted by the `[HUB]` name as follows:

![Azure Hybrid Use Benefit images in Azure Marketplace](./media/virtual-machines-windows-hybrid-use-benefit/ahub-images-portal.png)

You can deploy these images directly from the Azure portal. For use in Resource Manager templates and with Azure PowerShell, view the list of images as follows:
