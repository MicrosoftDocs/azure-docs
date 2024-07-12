---
ms.assetid: 
title: Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance
description: This quickstart describes how to migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: quickstart
---

# Quickstart: Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance

This quickstart provides the process of migration from Operations Manager on-premises to Azure Monitor SCOM Managed Instance.

## Prerequisites

1. Verify that your current Operations Manager agent version is supported to multi-homed with SCOM Managed Instance.  

    >[!Note]
    >Agent versions 2022 and 2019 are supported.
2. Deploy a SCOM Managed Instance instance.

3. Configure user roles and permissions in SCOM Managed Instance.

4. Import management packs and overrides from your current Operations Manager environment.

5. Configure Run-As account for management packs.  

6. If you use multiple management servers in SCOM Managed Instance, deploy a small set of pilot agents and verify failover behavior between management servers in SCOM Managed Instance.  

7. Identify an application or service that is currently monitored by Operations Manager on-premises. Multihome its agents to start reporting to SCOM Managed Instance and Operations Manager on-premises and perform the following steps:

    - Verify that you see the same monitoring data for the service in both your current Operations Manager environment and SCOM Managed Instance.
    - Configure groups.
    - Configure notification subscriptions.
    - Configure reporting.
    - Configure Dashboards.
    - Configure agent-specific settings.
    - Configure Agent primary and failover management server.

   Repeat the service-based migration according to step 6 for each application/service.

8. Configure and verify connectors.
   For example: Configure and verify connectors for ITSM tools and automation.  

9. Once all the monitoring data, reporting, notification, connectors, permissions, and groups are verified in SCOM Managed Instance, uninstall agent configuration for the old Operations Manager environment.  

>[!Note]
>Overrides target a specific instance of a class and may not work after migration of management packs, as instance ID might change between management groups. Group membership configured on specific instances might not work either.

Provided the migration details for the following artifacts as an example:

- Management Packs and Overrides 
- Dashboard
- User roles and permissions 
- Notification subscriptions 
- Groups 
- 1P Integrations 
- Agent mapping and configuration

[Here's](#supported-artifacts-for-migration) the complete list of supported artifacts.

## Migrate from on-premises to SCOM Managed Instance

Select the required artifact to view the migration details from on-premises to SCOM Managed Instance:

# [Management Packs and Overrides](#tab/mp-overrides)

1. Run the below script to create an inventory of all existing Management Packs deployed in Operations Manager: 

    ```powershell
    Get-SCOMManagementPack | Select-Object DisplayName, Name, Sealed, Version, LastModified | Sort-Object DisplayName | Format-Table
    ```

2. Export [unsealed Management Packs](/system-center/scom/manage-mp-import-remove-delete?#how-to-export-an-operations-manager-management-pack):

   ```powershell
   Get-SCOMManagementPack | Where{ $_.Sealed -eq $false } | Export-SCOMManagementPack -Path "C:\Temp\Unsealed Management Packs"
   ```

3. Import [Sealed Management Packs in SCOM Managed Instance](/system-center/scom/manage-mp-import-remove-delete?#importing-a-management-pack).

    - You must have a copy of any custom sealed Management Packs that you need to import. 

4. Import [unsealed (exported) Management Packs in SCOM Managed Instance](/system-center/scom/manage-mp-import-remove-delete?#import-a-management-pack-from-disk).

### Post migration validation

Follow these steps to validate the migration of Groups and Data collection.

1. **In Groups**: Go to **Authoring** workspace in the Operations Manager console and select **Groups**. Review the membership of any groups created by the Management Packs and verify that they've been populated with the correct objects. 

1. **In Data collection**: To verify that the intended objects are discovered, go to **Monitoring** in the Operations Manager console and review the views for each Management Pack.

    1. Verify that the state views are populated with the correct objects (Servers, Databases, Websites, and so on) and they're being monitored (Health State isn't **Unmonitored**).

    1. Check the performance views and verify that the performance data has been collected.

# [Dashboard](#tab/dashboard)

Operations Manager supports the following four types of data visualizations. 
Below is a quick summary of what can be migrated:

| Types of data visualizations | Can be migrated to SCOM Managed Instance | Recommendations |
|---|---|---|---|---|
| Dashboards/Views that are available in Management Pack | Yes | Operations console |
| Dashboards/Views created on Operations console | Yes | Operations console |
| Reports that are available in Management Pack | No | Power BI reports |
| Reports that are created on Operations console | No | Power BI reports |

- For Dashboards/Views that's available in Management Pack, you can view the data similar to the one in Operations Manager on-premises (as they're built into Management Pack).
- For Dashboards/Views created on the Operations console, you need to reconfigure custom dashboards and views in SCOM Managed Instance.
- For (SSRS) reports that are available in Management Pack and on the Operations console, you need to reconfigure all reports on Power BI as the Reporting Server doesn't exist in SCOM Managed Instance.  

# [User roles and permissions](#tab/userrole-permission)

>[!Note]
> No 1:1 mapping is permitted between user roles in SCOM Managed Instance to Operations Manager on-premises.

In SCOM Managed Instance, only two user roles are available, whereas Operations Manager on-premises has 10 user profile roles. For more information, see [Operations associated with user role profiles](/system-center/scom/manage-security-create-runas-account). 

Use the following mapping chart to provide access on SCOM Managed Instance with appropriate permissions:

### Mapping chart 

| Operations Manager on-premises  | SCOM Managed Instance |
|---------------------------------|-----------------------------------------------|
| Report Operator                 | Reader                                        |
| Read-Only Operator              | Reader                                        |
| Operator                        | Reader                                        |
| Advanced Operator               | Reader                                        |
| Application Monitoring Operator | Reader                                        |
| Author                          | Contributor                                   |
| Administrator                   | Contributor                                   |
| Report Security Administrator   | Contributor                                   |
| Read-only Administrator         | Contributor                                   |
| Delegated administrator         | Contributor                                   |

1. Export the list of user roles and users in each role. 

    ```powershell
    # This script will export the SCOM User Roles to CSV and Text File Format.
    # -----------------------------------------------
    # Outputs the file to the current users desktop
    # -----------------------------------------------
    $UserRoles = @()
    $UserRoleList = Get-SCOMUserRole
    Write-Output "Processing User Role:  "
    foreach ($UserRole in $UserRoleList)
    {
      Write-Output "    $UserRole"
      $UserRoles += New-Object -TypeName psobject -Property @{
        Name = $UserRole.Name;
        DisplayName = $UserRole.DisplayName;
        Description = $UserRole.Description;
        Users = ($UserRole.Users -join "; ");
      }
    }
    $UserRolesOutput = $UserRoles | Select-Object Name, DisplayName, Description, Users
    # Table Output
    $UserRolesOutput | Format-Table -AutoSize
    # CSV Output
    $UserRolesOutput | Export-CSV -Path "$env:USERPROFILE`\Desktop\UserRoles.csv" -NoTypeInformation
    # Text File Output
    $UserRolesOutput | Out-File "$env:USERPROFILE`\Desktop\UserRoles.txt" -Width 4096
    ```

2. With the exported list and mapping recommendations, manually add the users to the respective Azure (SCOM Managed Instance) user roles.

# [Notification subscriptions](#tab/notification-subscriptions)

SCOM Managed Instance supports the following notification channels:

- Emails
- SMS/Text

Export the **Notifications Internal Library** Management pack from the Operations Manager Management Group to migrate all your notification settings and import them to SCOM Managed Instance.

After you migrate the notification configuration to SCOM Managed Instance, copy the local files that are used in Command Channels to the same path on all Management Servers in the Notification Resource Pool. If you migrate from Operations Manager 2016, configuring Notification Channel requires more steps.

Metadata for all notifications/subscriptions is stored under the unsealed management pack. If you migrate the management pack, the notifications and subscriptions are also migrated.

Microsoft.SystemCenter.Notifications.Internal - 10.22.10113.0 - Notifications Internal Library

>[!Note]
>Notifications/Subscriptions depend on Run as account. Configure the accounts/profiles in a newer environment before you migrate the management pack.

# [Groups](#tab/groups)

Groups are migrated as part of Management Packs. For more information, see **step 5** in the **Management Packs and Overrides** tab.

# [1P Integrations](#tab/integrations)

The following integrations are supported:

- Service Manager 
- System Center Virtual Machine Manager
- Azure Monitor 

System Center Orchestrator to Azure Automation is the recommendation on Azure equivalent services.

# [Agent mapping and configuration](#tab/agent-mapping-config)

To migrate from System Center Operations Manager agent to SCOM Managed Instance, see [High level overview of upgrading agents and running two environments](/system-center/scom/deploy-upgrade-overview#high-level-overview-of-upgrading-agents-and-running-two-environments-1).

--- 

### Supported artifacts for migration

- Management Packs and Overrides 
- Dashboard
- User roles and permissions 
- Notification subscriptions 
- Groups 
- 1P Integrations 
- Agent mapping and configuration
- Gateways 
- Custom and 3P Solutions 

## Next steps

[Create a SCOM Managed Instance on Azure](create-operations-manager-managed-instance.md).