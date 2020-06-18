---
title: Integrate logs with ArcSight using Azure Monitor  | Microsoft Docs
description: Learn how to integrate Azure Active Directory logs with ArcSight using Azure Monitor
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: b37bef0d-982e-4e28-86b2-6c61ca524ae1
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 04/19/2019
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---

# Integrate Azure Active Directory logs with ArcSight using Azure Monitor

[Micro Focus ArcSight](https://software.microfocus.com/products/siem-security-information-event-management/overview) is a security information and event management (SIEM) solution that helps you detect and respond to security threats in your platform. You can now route Azure Active Directory (Azure AD) logs to ArcSight using Azure Monitor using the ArcSight connector for Azure AD. This feature allows you to monitor your tenant for security compromise using ArcSight.  

In this article, you learn how to route Azure AD logs to ArcSight using Azure Monitor. 

## Prerequisites

To use this feature, you need:
* An Azure event hub that contains Azure AD activity logs. Learn how to [stream your activity logs to an event hub](quickstart-azure-monitor-stream-logs-to-event-hub.md). 
* A configured instance of ArcSight Syslog NG Daemon SmartConnector (SmartConnector) or ArcSight Load Balancer. If the events are sent to ArcSight Load Balancer, they are consequently sent to the SmartConnector by the Load Balancer.

Download and open the [configuration guide for ArcSight SmartConnector for Azure Monitor Event Hub](https://community.microfocus.com/t5/ArcSight-Connectors/SmartConnector-for-Microsoft-Azure-Monitor-Event-Hub/ta-p/1671292). This guide contains the steps you need to install and configure the ArcSight SmartConnector for Azure Monitor. 

## Integrate Azure AD logs with ArcSight

1. First, complete the steps in the **Prerequisites** section of the configuration guide. This section includes the following steps:
    * Set user permissions in Azure, to ensure there's a user with the **owner** role to deploy and configure the connector.
    * Open ports on the server with Syslog NG Daemon SmartConnector, so it's accessible from Azure. 
    * The deployment runs a Windows PowerShell script, so you must enable PowerShell to run scripts on the machine where you want to deploy the connector.

2. Follow the steps in the **Deploying the Connector** section of configuration guide to deploy the connector. This section walks you through how to download and extract the connector, configure application properties and run the deployment script from the extracted folder. 

3. Use the steps in the **Verifying the Deployment in Azure** to make sure the connector is set up and functions correctly. Verify the following:
    * The requisite Azure functions are created in your Azure subscription.
    * The Azure AD logs are streamed to the correct destination. 
    * The application settings from your deployment are persisted in the Application Settings in Azure Function Apps. 
    * A new resource group for ArcSight is created in Azure, with an Azure AD application for the ArcSight connector and storage accounts containing the mapped files in CEF format.

4. Finally, complete the post-deployment steps in the **Post-Deployment Configurations** of the configuration guide. This section explains how to perform additional configuration if you are on an App Service Plan to prevent the function apps from going idle after a timeout period, configure streaming of resource logs from the event hub, and update the SysLog NG Daemon SmartConnector keystore certificate to associate it with the newly created storage account.

5. The configuration guide also explains how to customize the connector properties in Azure, and how to upgrade and uninstall the connector. There is also a section on performance improvements, including upgrading to an [Azure Consumption plan](https://azure.microsoft.com/pricing/details/functions) and configuring an ArcSight Load Balancer if the event load is greater than what a single Syslog NG Daemon SmartConnector can handle.

## Next steps

[Configuration guide for ArcSight SmartConnector for Azure Monitor Event Hub](https://community.microfocus.com/t5/ArcSight-Connectors/SmartConnector-for-Microsoft-Azure-Monitor-Event-Hub/ta-p/1671292)
