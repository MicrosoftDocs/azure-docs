---
title: Azure Log Integration FAQ | Microsoft Docs
description: This article answers questions about Azure Log Integration.
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
ms.workload8: na
ms.date: 05/28/2019
ms.author: barclayn
ms.custom: azlog

---
# Azure Log Integration FAQ

This article answers frequently asked questions (FAQ) about Azure Log Integration.

>[!IMPORTANT]
> The Azure Log integration feature will be deprecated by 06/15/2019. AzLog downloads were disabled on Jun 27, 2018. For guidance on what to do moving forward review the post [Use Azure monitor to integrate with SIEM tools](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/) 

Azure Log Integration is a Windows operating system service that you can use to integrate raw logs from your Azure resources into your on-premises security information and event management (SIEM) systems. This integration provides a unified dashboard for all your assets, on-premises or in the cloud. You can then aggregate, correlate, analyze, and alert for security events associated with your applications.

The preferred method for integrating Azure logs is by using your SIEM vendor's Azure Monitor connector and following these [instructions](../azure-monitor/platform/stream-monitoring-data-event-hubs.md). However, if your SIEM vendor doesn't provide a connector to Azure Monitor, you may be able to use Azure Log Integration as a temporary solution (if your SIEM is supported by Azure Log Integration) until such a connector is available.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Is the Azure Log Integration software free?

Yes. There is no charge for the Azure Log Integration software.

## Where is Azure Log Integration available?

It is currently available in Azure Commercial and Azure Government and is not available in China or Germany.

## How can I see the storage accounts from which Azure Log Integration is pulling Azure VM logs?

Run the command **AzLog source list**.

## How can I tell which subscription the Azure Log Integration logs are from?

In the case of audit logs that are placed in the **AzureResourcemanagerJson** directories, the subscription ID is in the log file name. This is also true for logs in the **AzureSecurityCenterJson** folder. For example:

20170407T070805_2768037.0000000023.**1111e5ee-1111-111b-a11e-1e111e1111dc**.json

Azure Active Directory audit logs include the tenant ID as part of the name.

Diagnostic logs that are read from an event hub do not include the subscription ID as part of the name. Instead, they include the friendly name specified as part of the creation of the event hub source. 

## How can I update the proxy configuration?

If your proxy setting does not allow Azure storage access directly, open the **AZLOG.EXE.CONFIG** file in **c:\Program Files\Microsoft Azure Log Integration**. Update the file to include the **defaultProxy** section with the proxy address of your organization. After the update is done, stop and start the service by using the commands **net stop AzLog** and **net start AzLog**.

    <?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.net>
        <connectionManagement>
          <add address="*" maxconnection="400" />
        </connectionManagement>
        <defaultProxy>
          <proxy usesystemdefault="true"
          proxyaddress="http://127.0.0.1:8888"
          bypassonlocal="true" />
        </defaultProxy>
      </system.net>
      <system.diagnostics>
        <performanceCounters filemappingsize="20971520" />
      </system.diagnostics>   

## How can I see the subscription information in Windows events?

Append the subscription ID to the friendly name while adding the source:

    Azlog source add <sourcefriendlyname>.<subscription id> <StorageName> <StorageKey>  
The event XML has the following metadata, including the subscription ID:

![Event XML][1]

## Error messages
### When I run the command ```AzLog createazureid```, why do I get the following error?

Error:

  *Failed to create AAD Application - Tenant 72f988bf-86f1-41af-91ab-2d7cd011db37 - Reason = 'Forbidden' - Message = 'Insufficient privileges to complete the operation.'*

The **azlog createazureid** command attempts to create a service principal in all the Azure AD tenants for the subscriptions that the Azure login has access to. If your Azure login is only a guest user in that Azure AD tenant, the command fails with "Insufficient privileges to complete the operation." Ask the tenant admin to add your account as a user in the tenant.

### When I run the command **azlog authorize**, why do I get the following error?

Error:

  *Warning creating Role Assignment - AuthorizationFailed: The client janedo\@microsoft.com' with object id 'fe9e03e4-4dad-4328-910f-fd24a9660bd2' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/70d95299-d689-4c97-b971-0d8ff0000000'.*

The **azlog authorize** command assigns the role of reader to the Azure AD service principal (created with **azlog createazureid**) to the provided subscriptions. If the Azure login is not a co-administrator or an owner of the subscription, it fails with an "Authorization Failed" error message. Azure Role-Based Access Control (RBAC) of co-administrator or owner is needed to complete this action.

## Where can I find the definition of the properties in the audit log?

See:

* [Audit operations with Azure Resource Manager](../azure-resource-manager/resource-group-audit.md)
* [List the management events in a subscription in the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931934.aspx)

## Where can I find details on Azure Security Center alerts?

See [Managing and responding to security alerts in Azure Security Center](../security-center/security-center-managing-and-responding-alerts.md).

## How can I modify what is collected with VM diagnostics?

For details on how to get, modify, and set the Azure Diagnostics configuration, see [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](../virtual-machines/windows/ps-extensions-diagnostics.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

The following example gets the Azure Diagnostics configuration:

    Get-AzVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient
    $publicsettings = (Get-AzVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient).PublicSettings
    $encodedconfig = (ConvertFrom-Json -InputObject $publicsettings).xmlCfg
    $xmlconfig = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encodedconfig))
    Write-Host $xmlconfig

    $xmlconfig | Out-File -Encoding utf8 -FilePath "d:\WADConfig.xml"

The following example modifies the Azure Diagnostics configuration. In this configuration, only event ID 4624 and event ID 4625 are collected from the security event log. Microsoft Antimalware for Azure events are collected from the system event log. For details on the use of XPath expressions, see [Consuming Events](https://msdn.microsoft.com/library/windows/desktop/dd996910(v=vs.85)).

    <WindowsEventLog scheduledTransferPeriod="PT1M">
        <DataSource name="Security!*[System[(EventID=4624 or EventID=4625)]]" />
        <DataSource name="System!*[System[Provider[@Name='Microsoft Antimalware']]]"/>
    </WindowsEventLog>

The following example sets the Azure Diagnostics configuration:

    $diagnosticsconfig_path = "d:\WADConfig.xml"
    Set-AzVMDiagnosticsExtension -ResourceGroupName AzLog-Integration -VMName AzlogClient -DiagnosticsConfigurationPath $diagnosticsconfig_path -StorageAccountName log3121 -StorageAccountKey <storage key>

After you make changes, check the storage account to ensure that the correct events are collected.

If you have any issues during the installation and configuration, please open a [support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Select **Log Integration** as the service for which you are requesting support.

## Can I use Azure Log Integration to integrate Network Watcher logs into my SIEM?

Azure Network Watcher generates large quantities of logging information. These logs are not meant to be sent to a SIEM. The only supported destination for Network Watcher logs is a storage account. Azure Log Integration does not support reading these logs and making them available to a SIEM.

<!--Image references-->
[1]: ./media/security-azure-log-integration-faq/event-xml.png
