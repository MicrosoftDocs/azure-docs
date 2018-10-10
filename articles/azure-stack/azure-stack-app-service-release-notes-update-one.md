---
title: App Service on Azure Stack update 1 release notes | Microsoft Docs
description: Learn about what's in update one for App Service on Azure Stack, the known issues, and where to download the update.
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2018
ms.author: anwestg
ms.reviewer: sethm

---
# App Service on Azure Stack update 1 release notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and fixes in Azure App Service on Azure Stack Update 1 and any known issues. Known issues are divided into issues directly related to the deployment, update process, and issues with the build (post-installation).

> [!IMPORTANT]
> Apply the 1802 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service.
>
>

## Build reference

The App Service on Azure Stack Update 1 build number is **69.0.13698.9**

### Prerequisites

> [!IMPORTANT]
> New deployments of Azure App Service on Azure Stack now require a [three-subject wildcard certificate](azure-stack-app-service-before-you-get-started.md#get-certificates) due to improvements in the way in which SSO for Kudu is now handled in Azure App Service. The new subject is **\*.sso.appservice.\<region\>.\<domainname\>.\<extension\>**
>
>

Refer to the [Before You Get Started documentation](azure-stack-app-service-before-you-get-started.md) before beginning deployment.

### New features and fixes

Azure App Service on Azure Stack Update 1 includes the following improvements and fixes:

- **High Availability of Azure App Service** - The Azure Stack 1802 update enabled workloads to be deployed across fault domains. Therefore App Service infrastructure is able to be fault tolerant as it will be deployed across fault domains. By default all new deployments of Azure App Service has this capability however for deployments completed prior to Azure Stack 1802 update being applied refer to the [App Service Fault Domain documentation](azure-stack-app-service-fault-domain-update.md)

- **Deploy in existing virtual network** - Customers can now deploy App Service on Azure Stack within an existing virtual network. Deploying in an existing virtual network enables customers to connect to the SQL Server and File Server, required for Azure App Service, over private ports. During deployment, customers can select to deploy in an existing virtual network, however [must create subnets for use by App Service](azure-stack-app-service-before-you-get-started.md#virtual-network) prior to deployment.

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.

- **Updates to the following application frameworks and tools**:
    - Added **.Net Core 2.0** support
    - Added **Node.JS** versions:
        - 6.11.2
        - 6.11.5
        - 7.10.1
        - 8.0.0
        - 8.1.4
        - 8.4.0
        - 8.5.0
        - 8.7.0
        - 8.8.1
        - 8.9.0
    - Added **NPM** versions:
        - 3.10.10
        - 4.2.0
        - 5.0.0
        - 5.0.3
        - 5.3.0
        - 5.4.2
        - 5.5.1
    - Added **PHP** Updates:
        - 5.6.32
        - 7.0.26 (x86 and x64)
        - 7.1.12 (x86 and x64)
    - Updated **Git for Windows** to v 2.14.1
    - Updated **Mercurial** to v4.5.0

  - Added support for **HTTPS Only** feature within Custom Domain feature in the App Service Tenant Portal. 

  - Added validation of storage connection in the custom storage picker for Azure Functions 

#### Fixes

- When creating an offline deployment package, customers will no longer receive an access denied error message when opening the folder from the App Service installer

- Resolved issues when working in the Custom Domains feature in the App Service Tenant Portal.

- Prevent customers using reserved administrator names during setup

- Enabled App Service deployment with **domain joined** file server

- Improved retrieval of Azure Stack root certificate in script and now validate the root cert in the App Service installer.

- Fixed incorrect status being returned to Azure Resource Manager when a subscription is deleted that contained resources in the Microsoft.Web namespace.

### Known issues with the deployment process

- Certificate validation errors

Some customers have experienced issues when providing certificates to the App Service installer when deploying on an integrated system, due to overly restrictive validation in the installer. The App Service installer has been re-released, customers should [download the updated installer](https://aka.ms/appsvconmasinstaller). If you continue to experience issues validating certificates with the updated installer, contact support.

- Problem retrieving Azure Stack root certificate from integrated system.

An error in the Get-AzureStackRootCert.ps1 caused customers to fail to retrieve the Azure Stack root certificate when executing the script on a machine that does not have the root certificate installed. The script has also now been re-released, resolving this issue, and request customers [download the updated helper scripts](https://aka.ms/appsvconmashelpers). If you continue to experience issues retrieving the root certificate with the updated script, contact support.

### Known issues with the update process

- There are no known issues for the update of Azure App Service on Azure Stack Update 1.

### Known issues (post-installation)

- Slot Swap does not function

Site slot swap is broken in this release. To restore functionality, complete these steps:

1. Modify the ControllersNSG Network Security Group to **Allow** remote desktop connections to the App Service controller instances. Replace AppService.local with the name of the resource group you deployed App Service in.

    ```powershell
      Add-AzureRmAccount -EnvironmentName AzureStackAdmin

      $nsg = Get-AzureRmNetworkSecurityGroup -Name "ControllersNsg" -ResourceGroupName "AppService.local"

      $RuleConfig_Inbound_Rdp_3389 =  $nsg | Get-AzureRmNetworkSecurityRuleConfig -Name "Inbound_Rdp_3389"

      Set-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg `
        -Name $RuleConfig_Inbound_Rdp_3389.Name `
        -Description "Inbound_Rdp_3389" `
        -Access Allow `
        -Protocol $RuleConfig_Inbound_Rdp_3389.Protocol `
        -Direction $RuleConfig_Inbound_Rdp_3389.Direction `
        -Priority $RuleConfig_Inbound_Rdp_3389.Priority `
        -SourceAddressPrefix $RuleConfig_Inbound_Rdp_3389.SourceAddressPrefix `
        -SourcePortRange $RuleConfig_Inbound_Rdp_3389.SourcePortRange `
        -DestinationAddressPrefix $RuleConfig_Inbound_Rdp_3389.DestinationAddressPrefix `
        -DestinationPortRange $RuleConfig_Inbound_Rdp_3389.DestinationPortRange

      # Commit the changes back to NSG
      Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg
      ```

2. Browse to the **CN0-VM** under Virtual Machines in the Azure Stack Administrator portal and **click Connect** to open a remote desktop session with the controller instance. Use the credentials specified during the deployment of App Service.
3. Start **PowerShell as an Administrator** and execute the following script

    ```powershell
        Import-Module appservice

        $sm = new-object Microsoft.Web.Hosting.SiteManager

        if($sm.HostingConfiguration.SlotsPollWorkerForChangeNotificationStatus=$true)
        {
          $sm.HostingConfiguration.SlotsPollWorkerForChangeNotificationStatus=$false
        #  'Slot swap mode reverted'
        }
        
        # Confirm new setting is false
        $sm.HostingConfiguration.SlotsPollWorkerForChangeNotificationStatus
        
        # Commit Changes
        $sm.CommitChanges()

        Get-AppServiceServer -ServerType ManagementServer | ForEach-Object Repair-AppServiceServer
        
    ```

4. Close the remote desktop session.
5. Revert the ControllersNSG Network Security Group to **Deny** remote desktop connections to the App Service controller instances. Replace AppService.local with the name of the resource group you deployed App Service in.

    ```powershell

        Add-AzureRmAccount -EnvironmentName AzureStackAdmin

        $nsg = Get-AzureRmNetworkSecurityGroup -Name "ControllersNsg" -ResourceGroupName "AppService.local"

        $RuleConfig_Inbound_Rdp_3389 =  $nsg | Get-AzureRmNetworkSecurityRuleConfig -Name "Inbound_Rdp_3389"

        Set-AzureRmNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg `
          -Name $RuleConfig_Inbound_Rdp_3389.Name `
          -Description "Inbound_Rdp_3389" `
          -Access Deny `
          -Protocol $RuleConfig_Inbound_Rdp_3389.Protocol `
          -Direction $RuleConfig_Inbound_Rdp_3389.Direction `
          -Priority $RuleConfig_Inbound_Rdp_3389.Priority `
          -SourceAddressPrefix $RuleConfig_Inbound_Rdp_3389.SourceAddressPrefix `
          -SourcePortRange $RuleConfig_Inbound_Rdp_3389.SourcePortRange `
          -DestinationAddressPrefix $RuleConfig_Inbound_Rdp_3389.DestinationAddressPrefix `
          -DestinationPortRange $RuleConfig_Inbound_Rdp_3389.DestinationPortRange

        # Commit the changes back to NSG
        Set-AzureRmNetworkSecurityGroup -NetworkSecurityGroup $nsg
    ```
- Workers are unable to reach file server when App Service is deployed in an existing virtual network and the file server is only available on the private network.
 
If you chose to deploy into an existing virtual network and an internal IP address to connect to your file server, you must add an outbound security rule, enabling SMB traffic between the worker subnet and the file server. To do this, go to the WorkersNsg in the Admin Portal and add an outbound security rule with the following properties:
 * Source: Any
 * Source port range: *
 * Destination: IP Addresses
 * Destination IP address range: Range of IPs for your file server
 * Destination port range: 445
 * Protocol: TCP
 * Action: Allow
 * Priority: 700
 * Name: Outbound_Allow_SMB445

### Known issues for Cloud Admins operating Azure App Service on Azure Stack

Refer to the documentation in the [Azure Stack 1802 Release Notes](azure-stack-update-1802.md)

## Next steps

- For an overview of Azure App Service, see [Azure App Service on Azure Stack overview](azure-stack-app-service-overview.md).
- For more information about how to prepare to deploy App Service on Azure Stack, see [Before you get started with App Service on Azure Stack](azure-stack-app-service-before-you-get-started.md).
