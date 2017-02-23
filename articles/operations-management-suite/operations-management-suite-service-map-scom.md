---
title: Service Map integration with System Center Operations Manager | Microsoft Docs
description: Service Map is an Operations Management Suite (OMS) solution that automatically discovers application components on Windows and Linux systems and maps the communication between services.  This article provides details for using Service Map to automatically create Distributed Application Diagrams in SCOM.
services: operations-management-suite
documentationcenter: ''
author: daveirwin1
manager: jwhit
editor: tysonn

ms.assetid: e8614a5a-9cf8-4c81-8931-896d358ad2cb
ms.service: operations-management-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/21/2017
ms.author: bwren;dairwin

---

# Service Map integration with System Center Operations Manager Integration
Operations Management Suite (OMS) Service Map automatically discovers application components on Windows and Linux systems and maps the communication between services. It allows you to view your servers as you think of them – as interconnected systems that deliver critical services. Service Map shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required other than installation of an agent.  For more details, see the [Service Map Documentation](operations-management-suite-service-map.md).

With this preview of integration between Service Map and System Center Operations Manager (SCOM), you can automatically create Distributed Application Diagrams in SCOM based on dynamic dependency maps in Service Map.

# Prerequisites
1.	A SCOM management group managing a set of servers.
2.	An OMS Workspace with the Service Map solution enabled.
3.	A set of servers (at least one) that are both being managed by SCOM and sending data to Service Map.  Windows and Linux servers are supported.
4.	A Service Principal with access to the Azure Subscription that is associated with the OMS Workspace.  See the Appendix for more information on Service Principals.

# Installing Service Map Management Pack
The integration between SCOM and Service Map is enabled by importing the Microsoft.SystemCenter.ServiceMap Management Pack Bundle (Microsoft.SystemCenter.ServiceMap.mpb).  The bundle contains the following Management Packs:
* Microsoft ServiceMap Application Views
* Microsoft System Center ServiceMap Internal
* Microsoft System Center ServiceMap Overrides
* Microsoft System Center ServiceMap

# Configuring the Service Map Integration
1. After installing the ServiceMap management pack, there will be a new node, Service Map, under the Operations Management Suite in the Administration pane.
2. Click “Add workspace” in the Service Map Overview pane to open the configuration wizard.

    ![SCOM Configuration Wizard](media/oms-service-map/scom-configuration.png)

3. The first step in the wizard is Connection Configuration to configure a Service Principal Name. Enter the Tenant ID, Application ID (or Username or ClientID), and Password of the Service Principal.  Please refer to the Appendix section on how to create a Service Principal.

    ![SCOM Config SPN](media/oms-service-map/scom-config-spn.png)

4. The next step is to select the Azure Subscription, Azure Resource Group (the one containing the OMS Workspace), and OMS Workspace.

    ![SCOM Config Workspace](media/oms-service-map/scom-config-workspace.png)

5. The next step is to configure the Service Map Servers Group with the servers you would like to sync between SCOM and Service Map.  Click the Add/Remove Servers… button. Note that for the integration to build a Distributed Application Diagram for a server, the server must: 1) be managed by SCOM, 2) be managed by Service Map, and 3) be listed in the Service Map Servers Group.

    ![SCOM Config Group](media/oms-service-map/scom-config-group.png)

6. Optional - Select the Management Server resource pool to communicate with OMS and click “Add Workspace”.

    ![SCOM Config Resource Pool](media/oms-service-map/scom-config-pool.png)

7. Please note that it will take a minute to configure and register the OMS workspace. Once this is configured, SCOM will initiate the first Service Map sync from OMS.

    ![SCOM Config Resource Pool](media/oms-service-map/scom-config-success.png)

**Note:** The default sync interval is set to 60 minutes. Users can configure overrides to change the sync interval. Users can also add servers to the Service Map Servers Group manually through the Authoring pane (Authoring pane --> Groups, then search for "Service Map Servers Group"). The server maps for those servers will be synced with the next sync (based on the sync interval configured).

# Monitoring Service Map
Once the OMS workspace is connected, a new folder Service Map will show up in the Monitoring pane of the SCOM console.
![SCOM Monitoring](media/oms-service-map/scom-monitoring.png)

The Service Map folder has three nodes:
## All Alerts:
This shows all the alerts about the communication between SCOM and Service Map solution in OMS.

**Note:** These are not OMS alerts being surfaced in SCOM.
## Servers:
This will have the list of monitored servers configured to sync from Service Map.

![SCOM Monitoring Servers](media/oms-service-map/scom-monitoring-servers.png)

## Server Dependency Views:
This view will have the list of all servers synced from Service Map. Users can click on any server to view its Distributed Application Diagram.

![SCOM Distributed Application Diagram](media/oms-service-map/scom-dad.png)

# Edit/Delete Workspace:
Users can Edit or delete the configured workspace through the Service Map Overview pane (Administration pane --> Operations Management Suite --> Service Map).  Note that you can configure only one OMS Workspace for now.

![SCOM Edit Workspace](media/oms-service-map/scom-edit-workspace.png)

# Configuring Rules and Overrides:
A Rule **_Microsoft.SystemCenter.ServiceMap.Import.Rule**_ is created to periodically fetch information from Service Map.  Users can configure Overrides of this rule to change sync timings.
Authoring pane --> Rules --> Microsoft.SystemCenter.ServiceMapImport.Rule

![SCOM Overrides](media/oms-service-map/scom-overrides.png)
* **Enabled** – enable/disable automatic updates 
* **IntervalSeconds** – the time between updates.  Default is 1 hour. Users can change the value here if they want to sync server maps more frequently.
* **TimeoutSeconds** – how long before the request times out 
* **TimeWindowMinutes** – how wide is the query for data.  Default is a 60-minute wide window. 
The maximum value is 1 hour (the maximum that Service Map allows).

# Known Issues/Limitations:
In the current design:
1. While users can add servers to “Service Map Servers Group” manually through the authoring pane, the maps for those servers will be synced from Service Map only during the next sync cycle (60 minutes by default. Users can override the sync timing.). 
2. Users can connect to a single OMS workspace.

# Appendix
## Creating A Service Principal
The following links will take you to official Azure documentation about three different ways to create a Service Principal.
* [Create Service Principal with PowerShell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Create Service Principal with Azure CLI](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal-cli)
* [Create Service Principal with Azure Portal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal)

## Feedback
Do you have any feedback for us about Service Map or this documentation?  Please visit our [User Voice page](https://feedback.azure.com/forums/267889-log-analytics/category/184492-service-map), where you can suggest features or vote up existing suggestions.
