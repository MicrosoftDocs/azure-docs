---
title: Enable security and DNS audits for Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to enable security audits to centralize the logging of events for analysis and alerts in Microsoft Entra Domain Services
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 662362c3-1a5e-4e94-ae09-8e4254443697
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: justinha 
ms.custom: devx-track-azurepowershell

---
# Enable security and DNS audits for Microsoft Entra Domain Services

Microsoft Entra Domain Services security and DNS audits let Azure stream events to targeted resources. These resources include Azure Storage, Azure Log Analytics workspaces, or Azure Event Hub. After you enable security audit events, Domain Services sends all the audited events for the selected category to the targeted resource.

You can archive events into Azure storage and stream events into security information and event management (SIEM) software (or equivalent) using Azure Event Hubs, or do your own analysis and using Azure Log Analytics workspaces from the Microsoft Entra admin center.

## Security audit destinations

You can use Azure Storage, Azure Event Hubs, or Azure Log Analytics workspaces as a target resource for Domain Services security audits. These destinations can be combined. For example, you could use Azure Storage for archiving security audit events, but an Azure Log Analytics workspace to analyze and report on the information in the short term.

The following table outlines scenarios for each destination resource type.

> [!IMPORTANT]
> You need to create the target resource before you enable Domain Services security audits. You can create these resources using the Microsoft Entra admin center, Azure PowerShell, or the Azure CLI.

| Target Resource | Scenario |
|:---|:---|
|Azure Storage| This target should be used when your primary need is to store security audit events for archival purposes. Other targets can be used for archival purposes, however those targets provide capabilities beyond the primary need of archiving. <br /><br />Before you enable Domain Services security audit events, first [Create an Azure Storage account](/azure/storage/common/storage-account-create).|
|Azure Event Hubs| This target should be used when your primary need is to share security audit events with additional software such as data analysis software or security information & event management (SIEM) software.<br /><br />Before you enable Domain Services security audit events, [Create an event hub using Microsoft Entra admin center](/azure/event-hubs/event-hubs-create)|
|Azure Log Analytics Workspace| This target should be used when your primary need is to analyze and review secure audits from the Microsoft Entra admin center directly.<br /><br />Before you enable Domain Services security audit events, [Create a Log Analytics workspace in the Microsoft Entra admin center.](/azure/azure-monitor/logs/quick-create-workspace)|

## Enable security audit events using the Microsoft Entra admin center

To enable Domain Services security audit events using the Microsoft Entra admin center, complete the following steps.

> [!IMPORTANT]
> Domain Services security audits aren't retroactive. You can't retrieve or replay events from the past. Domain Services can only send events that occur after security audits are enabled.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Global Administrator.
1. Search for and select **Microsoft Entra Domain Services**. Choose your managed domain, such as *aaddscontoso.com*.
1. In the Domain Services window, select **Diagnostic settings** on the left-hand side.
1. No diagnostics are configured by default. To get started, select **Add diagnostic setting**.

    ![Add a diagnostic setting for Microsoft Entra Domain Services](./media/security-audit-events/add-diagnostic-settings.png)

1. Enter a name for the diagnostic configuration, such as *aadds-auditing*.

    Check the box for the security or DNS audit destination you want. You can choose from a Log Analytics workspace, an Azure Storage account, an Azure event hub, or a partner solution. These destination resources must already exist in your Azure subscription. You can't create the destination resources in this wizard.
    * **Azure Log Analytic workspaces**
        * Select **Send to Log Analytics**, then choose the **Subscription** and **Log Analytics Workspace** you want to use to store audit events.
    * **Azure storage**
        * Select **Archive to a storage account**, then choose **Configure**.
        * Select the **Subscription** and the **Storage account** you want to use to archive audit events.
        * When ready, choose **OK**.
    * **Azure event hubs**
        * Select **Stream to an event hub**, then choose **Configure**.
        * Select the **Subscription** and the **Event hub namespace**. If needed, also choose an **Event hub name** and then **Event hub policy name**.
        * When ready, choose **OK**.
    * **Partner solution**
        * Select **Send to partner solution**, then choose the **Subscription** and **Destination** you want to use to store audit events.


1. Select the log categories you want included for the particular target resource. If you send the audit events to an Azure Storage account, you can also configure a retention policy that defines the number of days to retain data. A default setting of *0* retains all data and doesn't rotate events after a period of time.

    You can select different log categories for each targeted resource within a single configuration. This ability lets you choose which logs categories you want to keep for Log Analytics and which logs categories you want to archive, for example.

1. When done, select **Save** to commit your changes. The target resources start to receive Domain Services audit events soon after the configuration is saved.

## Enable security and DNS audit events using Azure PowerShell

To enable Domain Services security and DNS audit events using Azure PowerShell, complete the following steps. If needed, first [install the Azure PowerShell module and connect to your Azure subscription](/powershell/azure/install-azure-powershell).

> [!IMPORTANT]
> Domain Services audits aren't retroactive. You can't retrieve or replay events from the past. Domain Services can only send events that occur after audits are enabled.

1. Authenticate to your Azure subscription using the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet. When prompted, enter your account credentials.

    ```azurepowershell
    Connect-AzAccount
    ```

1. Create the target resource for the audit events.

    * **Azure Log Analytic workspaces** - [Create a Log Analytics workspace with Azure PowerShell](/azure/azure-monitor/logs/powershell-workspace-configuration).
    * **Azure storage** - [Create a storage account using Azure PowerShell](/azure/storage/common/storage-account-create?tabs=azure-powershell)
    * **Azure event hubs** - [Create an event hub using Azure PowerShell](/azure/event-hubs/event-hubs-quickstart-powershell). You may also need to use the [New-AzEventHubAuthorizationRule](/powershell/module/az.eventhub/new-azeventhubauthorizationrule) cmdlet to create an authorization rule that grants Domain Services permissions to the event hub *namespace*. The authorization rule must include the **Manage**, **Listen**, and **Send** rights.

        > [!IMPORTANT]
        > Ensure you set the authorization rule on the event hub namespace and not the event hub itself.

1. Get the resource ID for your Domain Services managed domain using the [Get-AzResource](/powershell/module/az.resources/get-azresource) cmdlet. Create a variable named *$aadds.ResourceId* to hold the value:

    ```azurepowershell
    $aadds = Get-AzResource -name aaddsDomainName
    ```

1. Configure the Azure Diagnostic settings using the [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting) cmdlet to use the target resource for Microsoft Entra Domain Services audit events. In the following examples, the variable *$aadds.ResourceId* is used from the previous step.

    * **Azure storage** - Replace *storageAccountId* with your storage account name:

        ```powershell
        Set-AzDiagnosticSetting `
            -ResourceId $aadds.ResourceId `
            -StorageAccountId storageAccountId `
            -Enabled $true
        ```

    * **Azure event hubs** - Replace *eventHubName* with the name of your event hub and *eventHubRuleId* with your authorization rule ID:

        ```powershell
        Set-AzDiagnosticSetting -ResourceId $aadds.ResourceId `
            -EventHubName eventHubName `
            -EventHubAuthorizationRuleId eventHubRuleId `
            -Enabled $true
        ```

    * **Azure Log Analytic workspaces** - Replace *workspaceId* with the ID of the Log Analytics workspace:

        ```powershell
        Set-AzureRmDiagnosticSetting -ResourceId $aadds.ResourceId `
            -WorkspaceID workspaceId `
            -Enabled $true
        ```

## Query and view security and DNS audit events using Azure Monitor

Log Analytic workspaces let you view and analyze the security and DNS audit events using Azure Monitor and the Kusto query language. This query language is designed for read-only use that boasts power analytic capabilities with an easy-to-read syntax. For more information to get started with Kusto query languages, see the following articles:

* [Azure Monitor documentation](/azure/azure-monitor/)
* [Get started with Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-tutorial)
* [Get started with log queries in Azure Monitor](/azure/azure-monitor/logs/get-started-queries)
* [Create and share dashboards of Log Analytics data](/azure/azure-monitor/visualize/tutorial-logs-dashboards)

The following sample queries can be used to start analyzing audit events from Domain Services.

### Sample query 1

View all the account lockout events for the last seven days:

```Kusto
AADDomainServicesAccountManagement
| where TimeGenerated >= ago(7d)
| where OperationName has "4740"
```

### Sample query 2

View all the account lockout events (*4740*) between June 3, 2020 at 9 a.m. and June 10, 2020 midnight, sorted ascending by the date and time:

```Kusto
AADDomainServicesAccountManagement
| where TimeGenerated >= datetime(2020-06-03 09:00) and TimeGenerated <= datetime(2020-06-10)
| where OperationName has "4740"
| sort by TimeGenerated asc
```

### Sample query 3

View account sign-in events seven days ago (from now) for the account named user:

```Kusto
AADDomainServicesAccountLogon
| where TimeGenerated >= ago(7d)
| where "user" == tolower(extract("Logon Account:\t(.+[0-9A-Za-z])",1,tostring(ResultDescription)))
```

### Sample query 4

View account sign-in events seven days ago from now for the account named user that attempted to sign in using a bad password (*0xC0000006a*):

```Kusto
AADDomainServicesAccountLogon
| where TimeGenerated >= ago(7d)
| where "user" == tolower(extract("Logon Account:\t(.+[0-9A-Za-z])",1,tostring(ResultDescription)))
| where "0xc000006a" == tolower(extract("Error Code:\t(.+[0-9A-Fa-f])",1,tostring(ResultDescription)))
```

### Sample query 5

View account sign-in events seven days ago from now for the account named user that attempted to sign in while the account was locked out (*0xC0000234*):

```Kusto
AADDomainServicesAccountLogon
| where TimeGenerated >= ago(7d)
| where "user" == tolower(extract("Logon Account:\t(.+[0-9A-Za-z])",1,tostring(ResultDescription)))
| where "0xc0000234" == tolower(extract("Error Code:\t(.+[0-9A-Fa-f])",1,tostring(ResultDescription)))
```

### Sample query 6

View the number of account sign-in events seven days ago from now for all sign-in attempts that occurred for all locked out users:

```Kusto
AADDomainServicesAccountLogon
| where TimeGenerated >= ago(7d)
| where "0xc0000234" == tolower(extract("Error Code:\t(.+[0-9A-Fa-f])",1,tostring(ResultDescription)))
| summarize count()
```

## Audit security and DNS event categories

Domain Services security and DNS audits align with traditional auditing for traditional AD DS domain controllers. In hybrid environments, you can reuse existing audit patterns so the same logic may be used when analyzing the events. Depending on the scenario you need to troubleshoot or analyze, the different audit event categories need to be targeted.

The following audit event categories are available:

| Audit Category Name | Description |
|:---|:---|
| Account Logon|Audits attempts to authenticate account data on a domain controller or on a local Security Accounts Manager (SAM).<br>-Logon and Logoff policy settings and events track attempts to access a particular computer. Settings and events in this category focus on the account database that is used. This category includes the following subcategories:<br>-[Audit Credential Validation](/windows/security/threat-protection/auditing/audit-credential-validation)<br>-[Audit Kerberos Authentication Service](/windows/security/threat-protection/auditing/audit-kerberos-authentication-service)<br>-[Audit Kerberos Service Ticket Operations](/windows/security/threat-protection/auditing/audit-kerberos-service-ticket-operations)<br>-[Audit Other Logon/Logoff Events](/windows/security/threat-protection/auditing/audit-other-logonlogoff-events)|
| Account Management|Audits changes to user and computer accounts and groups. This category includes the following subcategories:<br>-[Audit Application Group Management](/windows/security/threat-protection/auditing/audit-application-group-management)<br>-[Audit Computer Account Management](/windows/security/threat-protection/auditing/audit-computer-account-management)<br>-[Audit Distribution Group Management](/windows/security/threat-protection/auditing/audit-distribution-group-management)<br>-[Audit Other Account Management](/windows/security/threat-protection/auditing/audit-other-account-management-events)<br>-[Audit Security Group Management](/windows/security/threat-protection/auditing/audit-security-group-management)<br>-[Audit User Account Management](/windows/security/threat-protection/auditing/audit-user-account-management)|
| DNS Server|Audits changes to DNS environments. This category includes the following subcategories: <br>- [DNSServerAuditsDynamicUpdates (preview)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn800669(v=ws.11)#audit-and-analytic-event-logging)<br>- [DNSServerAuditsGeneral (preview)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn800669(v=ws.11)#audit-and-analytic-event-logging)| 
| Detail Tracking|Audits activities of individual applications and users on that computer, and to understand how a computer is being used. This category includes the following subcategories:<br>-[Audit DPAPI Activity](/windows/security/threat-protection/auditing/audit-dpapi-activity)<br>-[Audit PNP activity](/windows/security/threat-protection/auditing/audit-pnp-activity)<br>-[Audit Process Creation](/windows/security/threat-protection/auditing/audit-process-creation)<br>-[Audit Process Termination](/windows/security/threat-protection/auditing/audit-process-termination)<br>-[Audit RPC Events](/windows/security/threat-protection/auditing/audit-rpc-events)|
| Directory Services Access|Audits attempts to access and modify objects in Active Directory Domain Services (AD DS). These audit events are logged only on domain controllers. This category includes the following subcategories:<br>-[Audit Detailed Directory Service Replication](/windows/security/threat-protection/auditing/audit-detailed-directory-service-replication)<br>-[Audit Directory Service Access](/windows/security/threat-protection/auditing/audit-directory-service-access)<br>-[Audit Directory Service Changes](/windows/security/threat-protection/auditing/audit-directory-service-changes)<br>-[Audit Directory Service Replication](/windows/security/threat-protection/auditing/audit-directory-service-replication)|
| Logon-Logoff|Audits attempts to log on to a computer interactively or over a network. These events are useful for tracking user activity and identifying potential attacks on network resources. This category includes the following subcategories:<br>-[Audit Account Lockout](/windows/security/threat-protection/auditing/audit-account-lockout)<br>-[Audit User/Device Claims](/windows/security/threat-protection/auditing/audit-user-device-claims)<br>-[Audit IPsec Extended Mode](/windows/security/threat-protection/auditing/audit-ipsec-extended-mode)<br>-[Audit Group Membership](/windows/security/threat-protection/auditing/audit-group-membership)<br>-[Audit IPsec Main Mode](/windows/security/threat-protection/auditing/audit-ipsec-main-mode)<br>-[Audit IPsec Quick Mode](/windows/security/threat-protection/auditing/audit-ipsec-quick-mode)<br>-[Audit Logoff](/windows/security/threat-protection/auditing/audit-logoff)<br>-[Audit Logon](/windows/security/threat-protection/auditing/audit-logon)<br>-[Audit Network Policy Server](/windows/security/threat-protection/auditing/audit-network-policy-server)<br>-[Audit Other Logon/Logoff Events](/windows/security/threat-protection/auditing/audit-other-logonlogoff-events)<br>-[Audit Special Logon](/windows/security/threat-protection/auditing/audit-special-logon)|
|Object Access| Audits attempts to access specific objects or types of objects on a network or computer. This category includes the following subcategories:<br>-[Audit Application Generated](/windows/security/threat-protection/auditing/audit-application-generated)<br>-[Audit Certification Services](/windows/security/threat-protection/auditing/audit-certification-services)<br>-[Audit Detailed File Share](/windows/security/threat-protection/auditing/audit-detailed-file-share)<br>-[Audit File Share](/windows/security/threat-protection/auditing/audit-file-share)<br>-[Audit File System](/windows/security/threat-protection/auditing/audit-file-system)<br>-[Audit Filtering Platform Connection](/windows/security/threat-protection/auditing/audit-filtering-platform-connection)<br>-[Audit Filtering Platform Packet Drop](/windows/security/threat-protection/auditing/audit-filtering-platform-packet-drop)<br>-[Audit Handle Manipulation](/windows/security/threat-protection/auditing/audit-handle-manipulation)<br>-[Audit Kernel Object](/windows/security/threat-protection/auditing/audit-kernel-object)<br>-[Audit Other Object Access Events](/windows/security/threat-protection/auditing/audit-other-object-access-events)<br>-[Audit Registry](/windows/security/threat-protection/auditing/audit-registry)<br>-[Audit Removable Storage](/windows/security/threat-protection/auditing/audit-removable-storage)<br>-[Audit SAM](/windows/security/threat-protection/auditing/audit-sam)<br>-[Audit Central Access Policy Staging](/windows/security/threat-protection/auditing/audit-central-access-policy-staging)|
|Policy Change|Audits changes to important security policies on a local system or network. Policies are typically established by administrators to help secure network resources. Monitoring changes or attempts to change these policies can be an important aspect of security management for a network. This category includes the following subcategories:<br>-[Audit Audit Policy Change](/windows/security/threat-protection/auditing/audit-audit-policy-change)<br>-[Audit Authentication Policy Change](/windows/security/threat-protection/auditing/audit-authentication-policy-change)<br>-[Audit Authorization Policy Change](/windows/security/threat-protection/auditing/audit-authorization-policy-change)<br>-[Audit Filtering Platform Policy Change](/windows/security/threat-protection/auditing/audit-filtering-platform-policy-change)<br>-[Audit MPSSVC Rule-Level Policy Change](/windows/security/threat-protection/auditing/audit-mpssvc-rule-level-policy-change)<br>-[Audit Other Policy Change](/windows/security/threat-protection/auditing/audit-other-policy-change-events)|
|Privilege Use| Audits the use of certain permissions on one or more systems. This category includes the following subcategories:<br>-[Audit Non-Sensitive Privilege Use](/windows/security/threat-protection/auditing/audit-non-sensitive-privilege-use)<br>-[Audit Sensitive Privilege Use](/windows/security/threat-protection/auditing/audit-sensitive-privilege-use)<br>-[Audit Other Privilege Use Events](/windows/security/threat-protection/auditing/audit-other-privilege-use-events)|
|System| Audits system-level changes to a computer not included in other categories and that have potential security implications. This category includes the following subcategories:<br>-[Audit IPsec Driver](/windows/security/threat-protection/auditing/audit-ipsec-driver)<br>-[Audit Other System Events](/windows/security/threat-protection/auditing/audit-other-system-events)<br>-[Audit Security State Change](/windows/security/threat-protection/auditing/audit-security-state-change)<br>-[Audit Security System Extension](/windows/security/threat-protection/auditing/audit-security-system-extension)<br>-[Audit System Integrity](/windows/security/threat-protection/auditing/audit-system-integrity)|


## Event IDs per category

 Domain Services security and DNS audits record the following event IDs when the specific action triggers an auditable event:

| Event Category Name | Event IDs |
|:---|:---|
|Account Logon security|4767, 4774, 4775, 4776, 4777|
|Account Management security|4720, 4722, 4723, 4724, 4725, 4726, 4727, 4728, 4729, 4730, 4731, 4732, 4733, 4734, 4735, 4737, 4738, 4740, 4741, 4742, 4743, 4754, 4755, 4756, 4757, 4758, 4764, 4765, 4766, 4780, 4781, 4782, 4793, 4798, 4799, 5376, 5377|
|Detail Tracking security|None|
|DNS Server |513-523, 525-531, 533-537, 540-582|
|DS Access security|5136, 5137, 5138, 5139, 5141|
|Logon-Logoff security|4624, 4625, 4634, 4647, 4648, 4672, 4675, 4964|
|Object Access security|None|
|Policy Change security|4670, 4703, 4704, 4705, 4706, 4707, 4713, 4715, 4716, 4717, 4718, 4719, 4739, 4864, 4865, 4866, 4867, 4904, 4906, 4911, 4912|
|Privilege Use security|4985|
|System security|4612, 4621|

## Next steps

For specific information on Kusto, see the following articles:

* [Overview](/azure/data-explorer/kusto/query/) of the Kusto query language.
* [Kusto tutorial](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) to familiarize you with query basics.
* [Sample queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators) that help you learn new ways to see your data.
* Kusto [best practices](/azure/data-explorer/kusto/query/best-practices) to optimize your queries for success.
