---
title: Connectivity modes and requirements
description: Explains Azure Arc enabled data services connectivity options for from your environment to Azure
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: conceptual
---

# Connectivity Modes and Requirements

## Connectivity Modes

Depending on the situation, there are multiple options for the degree of connectivity from your environment to Azure.  Customer requirements based on company policy, government regulation, or the availability of network connectivity to Azure may determine the desired connectivity mode.

|**Consideration**|**Indirectly Connected**|**Directly Connected**|**Never Connected**|
|---|---|---|---|
|**Typical use cases**|Corporate data centers that don’t allow connectivity in or out of the data region of the data center due to company or regulatory compliance policies or out of concerns of external attacks or data exfiltration.  Examples: Financials, health care, government. Edge site locations where the edge site doesn’t typically have connectivity to the Internet (oil/gas & military field applications) or has intermittent connectivity with long periods of outages (stadiums, cruise ships)|Multi-cloud. Edge site locations where Internet connectivity is typically present and allowed (retail stores, manufacturing) Corporate data centers with more permissive policies for connectivity to/from their data region of the datacenter.|Truly “in the cave” scenarios like CIA/NSA levels of secrecy – no data under any circumstances can come or go from the data environment.|
|**How data is sent to Azure**|There are three options for customers:<br><br> 1) Data is exported out of the data region by an automated process that has connectivity to both the secure data region and Azure.<br><br>2) Data is exported out by an automated process within the data region, automatically copied to a less secure region, and an automated process in the less secure region uploads the data to Azure.<br><br>3) Data is manually exported by a user within the secure region, manually brought out of the secure region, and manually uploaded to Azure. <br><br>The first two options are a continuous process so there is minimal delay in the transfer of data to Azure subject only to the available connectivity to Azure.|Data is automatically and continuously sent to Azure via Azure Arc enabled Kubernetes integration.|Data is never sent to Azure.  Data is only sent locally to the Azure ARM control plane on Azure Stack/RT.|
|**Architecture diagram**||||

## Connectivity Requirements

Some functionality requires a connection to Azure.

All communication with Azure is always initiated from your environment. This is true even for operations, which are initiated by a user in the Azure portal.  In that case, there is effectively a task, which is queued up in Azure.  The agent in your environment initiates the communication with Azure to see what tasks are in the queue and reports back the status/completion/fail.

|**Type of Data**|**Direction**|**Required/Optional**|**Mode Required**|**Notes**|
|---|---|---|---|---|
|**Container images**|Microsoft Container Registry -> Customer|Required|Indirect or direct|Container images are the method for distributing the software.  In an environment which can connect to the Microsoft Container Registry (MCR) over the internet, the container images can be pulled directly from MCR.  In the event that the deployment environment doesn’t have direct connectivity, you can pull the images from MCR and push them to a private container registry in the deployment environment.  At deployment time you can configure the deployment process to pull from the private container registry instead of MCR. This also applies to automated updates.|
|**Resource inventory**|Customer environment -> Azure|Required|Indirect or direct|An inventory of data controllers, database instances (PostgreSQL and SQL) is kept in Azure for billing purposes and also for purposes of creating an inventory of all data controllers and database instances in one place which is especially useful if you have more than one environment with Azure Arc data services.  As instances are provisioned, deprovisioned, scaled out/in, scaled up/down the inventory is updated in Azure.|
|**Billing telemetry data**|Customer environment -> Azure|Required|Indirect or direct|Utilization of database instances must be sent to Azure for billing purposes.  Utilization here means the number of cores per hour that are used by each database instance, the pricing tier (business critical, general purpose, dev/test).|
|**Azure RBAC**|Customer environment -> Azure -> Customer Environment|Optional|Direct only|If you want to use Azure for RBAC then connectivity must be established with Azure at all times.  If you don’t want to use Azure for RBAC then local K8s RBAC can be used.|
|**Azure Active Directory**|Customer environment -> Azure -> Customer environment|Optional (maybe additional cost)|Direct only|If you want to use Azure AD then connectivity must be established with Azure at all times. If you don’t want to use Azure AD for authentication, you can us ADFS over AD.|
|**Monitoring data and logs**|Customer environment -> Azure|Optional (maybe additional cost)|Indirect or direct|If you want to send the locally collected monitoring data and logs to Azure Monitor for aggregating data across multiple environments into one place and also to take advantage of Azure Monitor services like alerts, using the data in Azure Machine Learning, etc.|
|**Backups/Restore**|Customer environment -> Azure -> Customer environment|Optional (additional cost)|Direct only|If you want to be able to send backups that are taken locally to Azure Backup for long-term, offsite retention of backups and bring them back to the local environment for restore.|
|**Security services (Advanced Threat Protection, Vulnerability Assessment)**|Customer environment -> Azure -> Customer environment|Optional  (additional cost)|Direct only||
|**Provisioning and configuration changes from Azure portal**|Customer environment -> Azure -> Customer environment|Optional|Direct only|Provisioning and configuration changes can be done locally using Azure Data Studio or the azdata CLI.  You only need this if you want to also be able to provision and make configuration changes from the Azure portal.|