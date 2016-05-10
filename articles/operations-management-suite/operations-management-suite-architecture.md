<properties 
   pageTitle="Operations Management Suite (OMS) architecture | Microsoft Azure"
   description="Microsoft Operations Management Suite (OMS) is Microsoft's cloud based IT management solution that helps you manage and protect your on-premises and cloud infrastructure.  This article identifies the different services included in OMS and provides links to their detailed content."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/09/2016"
   ms.author="bwren" />

# OMS architecture

[Operations Management Suite (OMS)](https://azure.microsoft.com/documentation/services/operations-management-suite/) is a collection of cloud based services for managing your on-premise and cloud environments.  This article describes the different on-premise and cloud components of OMS and their high level cloud computing architecture.  You can refer to the documentation for each service for further details.

## Log Analytics

The following diagram shows the relationship between the different OMS components used by [Log Analytics](https://azure.microsoft.com/documentation/services/log-analytics/).  The following sections provide a description of each component in the diagram.

![Log Analytics high level architecture](media/operations-management-suite-architecture/log-analytics.png)

## OMS workspace

The data and resources managed by Log Analytics are organized in an OMS Workspace. You can think of the workspace as a unique OMS environment with its own data repository and its own set of data sources.  You may create multiple workspaces in your subscription to support multiple environments such as production and test.

## OMS repository

All data collected by Log Analytics is stored in the OMS repository which is hosted in Azure.  Each OMS workspace has its own OMS repository.  

## OMS portal

OMS has a web based portal that you can use to manage OMS resources, add and configure OMS solutions, and view and analyze data in the OMS repository.

## Connected sources

Connected Sources generate data collected into the OMS repository.  There are currently three types of connected sources supported as described below.

### Agents

An agent is a Windows or Linux computer connected directly to OMS.  Agents download configurations for data sources and solutions and deliver their data to Log Analytics to be stored in the OMS repository.  [Windows computers](log-analytics-windows-agents.md) connect directly to Log Analytics by installing the Microsoft Management Agent (MMA) which is the same agent used to connect System Center Operations Manager (SCOM).  [Linux computers](log-analytics-Linux-gents.md) can connect with the Operations Management Suite Agent for Linux which is currently in public preview.


## Next steps

- Learn about [Log Analytics](http://azure.microsoft.com/documentation/services/log-analytics).
- Learn about [Azure Automation](https://azure.microsoft.com/documentation/articles/automation-intro).
- Learn about [Azure Backup](http://azure.microsoft.com/documentation/services/backup).
- Learn about [Azure Site Recovery](http://azure.microsoft.com/documentation/services/site-recovery).