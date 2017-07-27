---
title: Azure log integration FAQ | Microsoft Docs
description: This FAQ answers questions about Azure log integration.
services: security
documentationcenter: na
author: TomShinder
manager: MBaldwin
editor: TerryLanfear

ms.assetid: d06d1ac5-5c3b-49de-800e-4d54b3064c64
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/26/2017
ms.author: TomSh
ms.custom: azlog

---
# Azure log integration frequently asked questions (FAQ)
This FAQ answers questions about Azure log integration, a service that enables you to integrate raw logs from your Azure resources into your on-premises Security Information and Event Management (SIEM) systems. This integration provides a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events associated with your applications.

## Is the Azure Log Integration software free?
Yes. There is no charge for the Azure Log Integration software.

## Where is Azure Log Integration available?

It is currently available in Azure commercial and Azure Government and not available in China, or Germany.

## How can I see the storage accounts from which Azure Log integration is pulling Azure VM logs from?
Run the command **azlog source list**.

## How can I tell which subscription the Azure Log integration logs are from?

In the case of Audit logs that are placed in the AzureResourcemanagerJson directories the subscription ID is in the log file name. This is also true for logs in the AzureSecurityCenterJson folder. For example:

20170407T070805_2768037.0000000023.**1111e5ee-1111-111b-a11e-1e111e1111dc**.json

Azure Active Directory audit logs include the tenant ID as part of the name.

Diagnostic logs read from an Event Hub do not include the subscription ID as part of the name but instead include the friendly name specified as part of the creation of the Event Hub source. 

## How can I update the proxy configuration?
If your proxy setting does not allow Azure storage access directly, open the **AZLOG.EXE.CONFIG** file in **c:\Program Files\Microsoft Azure Log Integration**. Update the file to include the **defaultProxy** section with the proxy address of your organization. After update is done, stop and start the service using commands **net stop azlog** and **net start azlog**.

    <?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.net>
        <connectionManagement>
          <add address="*" maxconnection="400" />
        </connectionManagement>
        <defaultProxy>
          <proxy usesystemdefault="true"
          proxyaddress=http://127.0.0.1:8888
          bypassonlocal="true" />
        </defaultProxy>
      </system.net>
      <system.diagnostics>
        <performanceCounters filemappingsize="20971520" />
      </system.diagnostics>   

## How can I see the subscription information in Windows events?
Append the **subscriptionid** to the friendly name while adding the source.

    Azlog source add <sourcefriendlyname>.<subscription id> <StorageName> <StorageKey>  
The event XML has the metadata as shown below, including the subscription id.

![Event XML][1]

## Error messages
### When running command **azlog createazureid**, why do I get the following error?
Error:

  *Failed to create AAD Application - Tenant 72f988bf-86f1-41af-91ab-2d7cd011db37 - Reason = 'Forbidden' - Message = 'Insufficient privileges to complete the operation.'*

**Azlog createazureid** attempts to create a service principal in all the Azure AD tenants for the subscriptions on which the Azure login has access to. If your Azure login is only a Guest user in that Azure AD tenant, then the command fails with ‘Insufficient privileges to complete the operation.’ Request Tenant admin to add your account as a user in the tenant.

### When running command **azlog authorize**, why do I get the following error?
Error:

  *Warning creating Role Assignment - AuthorizationFailed: The client janedo@microsoft.com' with object id 'fe9e03e4-4dad-4328-910f-fd24a9660bd2' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/70d95299-d689-4c97-b971-0d8ff0000000'.*

**Azlog authorize** command assigns the role of Reader to the Azure AD service principal (created with **Azlog createazureid**) to the subscriptions provided. If the Azure login is not a Co-Administrator or an Owner of the subscription, it fails with ‘Authorization Failed’ error message. Azure role-based access control (RBAC) of Co-Administrator or Owner is needed to complete this action.

## Where can I find the definition of the properties in audit log?
See:

* [Audit operations with Resource Manager](../azure-resource-manager/resource-group-audit.md)
* [List the management events in a subscription in Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931934.aspx)

## Where can I find details on Azure Security Center alerts?
See [Managing and responding to security alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md).

## How can I modify what is collected with VM diagnostics?
See [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../virtual-machines/windows/ps-extensions-diagnostics.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for details on how to Get, Modify, and Set the Azure Diagnostics in Windows *(WAD)* configuration. Following is a sample:

### Get the WAD config
    -AzureRmVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient
    $publicsettings = (Get-AzureRmVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient).PublicSettings
    $encodedconfig = (ConvertFrom-Json -InputObject $publicsettings).xmlCfg
    $xmlconfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encodedconfig))
    Write-Host $xmlconfig

    $xmlconfig | Out-File -Encoding utf8 -FilePath "d:\WADConfig.xml"

### Modify the WAD Config
The following example is a configuration where only EventID 4624 and EventId 4625 are collected from the security event log. Microsoft Antimalware events are collected from the System event log. See [Consuming Events](https://msdn.microsoft.com/library/windows/desktop/dd996910(v=vs.85) for details on the use of XPath expressions.

    <WindowsEventLog scheduledTransferPeriod="PT1M">
        <DataSource name="Security!*[System[(EventID=4624 or EventID=4625)]]" />
        <DataSource name="System!*[System[Provider[@Name='Microsoft Antimalware']]]"/>
    </WindowsEventLog>

### Set the WAD configuration
    $diagnosticsconfig_path = "d:\WADConfig.xml"
    Set-AzureRmVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient -DiagnosticsConfigurationPath $diagnosticsconfig_path -StorageAccountName log3121 -StorageAccountKey <storage key>

After making changes, check the storage account to ensure that the correct events are collected.

If you run into any issues during the installation and configuration, please open a [support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request), select **Log Integration** as the service for which you are requesting support.

### Can I use Azure Log integration to integrate Network Watcher logs into my SIEM?

Network watcher generates large quantities of logging information and these logs are not meant to be sent to a SIEM. The only supported destination for Network Watcher logs is a storage account. Azlog does not support reading these logs and making them available to a SIEM

<!--Image references-->
[1]: ./media/security-azure-log-integration-faq/event-xml.png
