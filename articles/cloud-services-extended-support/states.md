---
title: Available States for Azure Cloud Services (extended support)
description: Available Power and Provisioning States for Azure Cloud Services (extended support)
ms.topic: article
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.date: 04/05/2022

---
# Available Provisioning and Power States for Azure Cloud Services (extended support)

## Available Provisioning States for Azure Cloud Services (extended support)

This table lists the different Provisioning states for Cloud Services (extended support) resource. 

| Status |  Description | 
|---|---|
|Creating|The CSES resource is in the process of creating|
|Updating|The CSES resource is in the state of being updated|
|Failed|The CSES resource is unable to achieve the status requested in the deployment|
|Succeeded|The CSES resource is successfully deployed with the latest deployment request|
|Deleting|The CSES resource is in the process of deleting|

## Available Role Instance/Power States for Azure Cloud Services (extended support)

This table lists the different power states for Cloud Services (extended support) instances. 

|State|Details|
|---|---|
|Started|The Role Instance is healthy and is currently running|
|Stopping|The Role Instance is in the process of getting stopped|
|Stopped|The Role Instance is in the Stopped State|
|Unknown|The Role Instance is either in the process of creating or is not ready to service the traffic|
|Starting|The Role Instance is in the process of moving to healthy/running state|
|Busy|The Role Instance is not responding|
|Destroyed|The Role instance is destroyed|


## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
