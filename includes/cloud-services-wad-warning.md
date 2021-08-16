---
author: tanmaygore
ms.author: tagore
ms.service: cloud-services
ms.topic: include
ms.date: 11/25/2018
---
> [!WARNING]
> When you enable diagnostics for an existing role, any extensions that you have already set are disabled when the package is deployed. These include:
>
> * Microsoft Monitoring Agent Diagnostics
> * Microsoft Azure Security Monitoring
> * Microsoft Antimalware                 
> * Microsoft Monitoring Agent
> * Microsoft Service Profiler Agent      
> * Windows Azure Domain Extension        
> * Windows Azure Diagnostics Extension   
> * Windows Azure Remote Desktop Extension
> * Windows Azure Log Collector
>
> You can reset your extensions via the Azure portal or PowerShell after you deploy the updated role.
>
