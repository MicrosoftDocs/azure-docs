---
title: Integrate external monitoring solution with Azure Stack | Microsoft Docs
description: Learn how to integrate Azure Stack with an external monitoring solution in your datacenter.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: article
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: thoroet

---
# Integrate external monitoring solution with Azure Stack

For external monitoring of the Azure Stack infrastructure, you need to monitor the Azure Stack software, the physical computers, and the physical network switches. Each of these areas offers a method to retrieve health and alert information:

- Azure Stack software offers a REST-based API to retrieve health and alerts. The use of software-defined technologies such as Storage Spaces Direct, storage health and alerts are part of software monitoring.
- Physical computers can make health and alert information available via the baseboard management controllers (BMCs).
- Physical network devices can make health and alert information available via the SNMP protocol.

Each Azure Stack solution ships with a hardware lifecycle host. This host runs the Original Equipment Manufacturer (OEM) hardware vendor’s monitoring software for the physical servers and network devices. If desired, you can bypass these monitoring solutions and directly integrate with existing monitoring solutions in your datacenter.

> [!IMPORTANT]
> The external monitoring solution you use must be agentless. You can't install third-party agents inside Azure Stack components.

The following diagram shows traffic flow between an Azure Stack integrated system, the hardware lifecycle host, an external monitoring solution, and an external ticketing/data collection system.

![Diagram showing traffic between Azure Stack, monitoring, and ticketing solution.](media/azure-stack-integrate-monitor/MonitoringIntegration.png)  

This article explains how to integrate Azure Stack with external monitoring solutions such as System Center Operations Manager and Nagios. It also includes how to work with alerts programmatically by using PowerShell or through REST API calls.

## Integrate with Operations Manager

You can use Operations Manager for external monitoring of Azure Stack. The System Center Management Pack for Microsoft Azure Stack enables you to monitor multiple Azure Stack deployments with a single Operations Manager instance. The management pack uses the Health resource provider and Update resource provider REST APIs to communicate with Azure Stack. If you plan to bypass the OEM monitoring software that's running on the hardware lifecycle host, you can install vendor management packs to monitor physical servers. You can also use Operations Manager network device discovery to monitor network switches.

The management pack for Azure Stack provides the following capabilities:

- You can manage multiple Azure Stack deployments
- There's support for Azure Active Directory (Azure AD) and Active Directory Federation Services (AD FS)
- You can retrieve and close alerts
- There's a Health and a Capacity dashboard
- Includes Auto Maintenance Mode detection for when patch and update (P&U) is in progress
- Includes Force Update tasks for deployment and region
- You can add custom information to a region
- Supports notification and reporting

You can download the System Center Management Pack for Microsoft Azure Stack and the associated [user guide](https://www.microsoft.com/en-us/download/details.aspx?id=55184), or directly from Operations Manager.

For a ticketing solution, you can integrate Operations Manager with System Center Service Manager. The integrated product connector enables bi-directional communication that allows you to close an alert in Azure Stack and Operations Manager after you resolve a service request in Service Manager.

The following diagram shows integration of Azure Stack with an existing System Center deployment. You can automate Service Manager further with System Center Orchestrator or Service Management Automation (SMA) to run operations in Azure Stack.

![Diagram showing integration with OM, Service Manager, and SMA.](media/azure-stack-integrate-monitor/SystemCenterIntegration.png)

## Integrate with Nagios

A Nagios monitoring plugin was developed together with the partner Cloudbase solutions, which is available under the permissive free software license – MIT (Massachusetts Institute of Technology).

The plugin is written in Python and leverages the health resource provider REST API. It offers basic functionality to retrieve and close alerts in Azure Stack. Like the System Center management pack, it enables you to add multiple Azure Stack deployments and to send notifications.

The plugin works with Nagios Enterprise and Nagios Core. You can download it [here](https://exchange.nagios.org/directory/Plugins/Cloud/Monitoring-AzureStack-Alerts/details). The download site also includes installation and configuration details.

### Plugin parameters

Configure the plugin file “Azurestack_plugin.py” with the following parameters:

| Parameter | Description | Example |
|---------|---------|---------|
| *arm_endpoint* | Azure Resource Manager (administrator) endpoint |https://adminmanagement.local.azurestack.external |
| *api_endpoint* | Azure Resource Manager (administrator) endpoint  | https://adminmanagement.local.azurestack.external |
| *Tenant_id* | Admin subscription ID | Retrieve via the administrator portal or PowerShell |
| *User_name* | Operator subscription username | operator@myazuredirectory.onmicrosoft.com |
| *User_password* | Operator subscription password | mypassword |
| *Client_id* | Client | 0a7bdc5c-7b57-40be-9939-d4c5fc7cd417* |
| *region* |  Azure Stack region name | local |
|  |  |

*The PowerShell GUID that’s provided is universal. You can use it for each deployment.

## Use PowerShell to monitor health and alerts

If you're not using Operations Manager, Nagios, or a Nagios-based solution, you can use PowerShell to enable a broad range of monitoring solutions to integrate with Azure Stack.

1. To use PowerShell, make sure that you have [PowerShell installed and configured](azure-stack-powershell-configure-quickstart.md) for an Azure Stack operator environment. Install PowerShell on a local computer that can reach the Resource Manager (administrator) endpoint (https://adminmanagement.[region].[External_FQDN]).

2. Run the following commands to connect to the Azure Stack environment as an Azure Stack operator:

   ```PowerShell  
    Add-AzureRMEnvironment -Name "AzureStackAdmin" -ArmEndpoint https://adminmanagement.[Region].[External_FQDN]

   Add-AzureRmAccount -EnvironmentName "AzureStackAdmin"
   ```

3. Use commands such as the following examples to work with alerts:
   ```PowerShell
    #Retrieve all alerts
    Get-AzsAlert

    #Filter for active alerts
    $Active=Get-AzsAlert | Where {$_.State -eq "active"}
    $Active

    #Close alert
    Close-AzsAlert -AlertID "ID"

    #Retrieve resource provider health
    Get-AzsRPHealth

    #Retrieve infrastructure role instance health
    $FRPID=Get-AzsRPHealth|Where-Object {$_.DisplayName -eq "Capacity"}
    Get-AzsRegistrationHealth -ServiceRegistrationId $FRPID.RegistrationId

    ```

## Learn more

For information about built-in health monitoring, see [Monitor health and alerts in Azure Stack](azure-stack-monitor-health.md).

## Next steps

[Security integration](azure-stack-integrate-security.md)
