---
title: Connect your Alsid for Active Directory to Azure Sentinel | Microsoft Docs
description: Learn how to use the Alsid for Active Directory connector to pull Alsid logs into Azure Sentinel. View Alsid data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/03/2021
ms.author: yelevin
---
# Connect your Alsid for Active Directory (AD) to Azure Sentinel

> [!IMPORTANT]
> The Alsid for Active Directory connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Alsid for AD solution to Azure Sentinel. The Alsid for Active Directory data connector allows you to easily connect your Alsid for AD logs with Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. Integration between Alsid for AD and Azure Sentinel makes use of a Syslog server with the Log Analytics agent installed. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have write permission on the Azure Sentinel workspace.

- Your Alsid for AD solution must be configured to export logs via Syslog.

## Send Alsid for AD logs to Azure Sentinel via the Syslog agent

Configure Alsid for AD to forward Syslog messages to your Azure Sentinel workspace via the Syslog agent.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **Alsid for Active Directory (Preview)** connector, and then **Open connector page**.

1. Follow the instructions on the **Alsid for Active Directory** connector page:

    1. Configure a Syslog server

        1. If you don't already have one, create a Linux Syslog server for Alsid for AD to send logs to. Azure Sentinel supports the **rsyslog** and **syslog-ng** daemons. 

        1. Configure your Syslog server to output Alsid for AD logs in a separate file.

    1. Configure Alsid for AD to send logs to your Syslog server

        1. On your **Alsid for AD** portal, go to *System*, *Configuration* and then *Syslog*. From there you can create a new Syslog alert toward your Syslog server. For the remote server, use the IP address of the Linux machine you installed the Linux agent on.

        1. Check that the logs are correctly gathered on your server in a separate file (to do this, you can use the **Test the configuration** button in the *Syslog* alert configuration in Alsid for AD).

    1. Install and onboard the Log Analytics agent for Linux

        - Choose an Azure Linux VM or a non-Azure Linux machine (physical or virtual). Follow the links and instructions on the screen. See [Configure your Linux machine or appliance](connect-syslog.md#configure-your-linux-machine-or-appliance) for further details.

    1. Configure the logs to be collected by the Log Analytics agent

        - Select the facilities and severities in the workspace advanced settings configuration.

            1. Click the **Open your workspace advanced settings configuration >** link on the connector page.

            1. In the **Advanced settings** screen, select **Data** and then **Custom Logs**.

            1. Mark the **Apply below configuration to my linux machines** check box, and click **Add**.

            1. Click **Choose File** to upload a sample Alsid for AD Syslog file from the Linux machine running the Syslog server, and click **Next**.

            1. Check that **Set record delimiter** is set to **New line** and click **Next**.

            1. Select **Linux** and enter the file path to the Syslog file, click **+** and then **Next**.

            1. In the Name field type *AlsidForADLog* before the _CL suffix, then click **Done**.
    
It may take up to 20 minutes before your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under **Custom Logs** in the *AlsidForADLog_CL* table.

This data connector depends on a parser based on a Kusto Function to work as expected. Use the following steps to set up the **afad_parser** Kusto Function to use in queries and workbooks.

1. From the Azure Sentinel navigation menu, select **Logs**.

1. Copy the following query and paste it into the query window.
    ```kusto
    let CodenameTable=datatable(Codename: string, Explanation: string) [
    "test-checker-codename", "This is a test checker",
    "", "Not an alert",
    "C-ADM-ACC-USAGE", "Recent use of the default administrator account",
    "C-UNCONST-DELEG", "Dangerous delegation",
    "C-PASSWORD-DONT-EXPIRE", "Accounts with never expiring passwords",
    "C-USERS-CAN-JOIN-COMPUTERS", "Users allowed to join computers to the domain",
    "C-CLEARTEXT-PASSWORD", "Potential clear-text password",
    "C-PROTECTED-USERS-GROUP-UNUSED", "Protected Users group not used",
    "C-PASSWORD-POLICY", "Weak password policies are applied on users",
    "C-GPO-HARDENING", "Domain without computer-hardening GPOs",
    "C-LAPS-UNSECURE-CONFIG", "Local administrative account management",
    "C-AAD-CONNECT", "Verify permissions related to AAD Connect accounts",
    "C-AAD-SSO-PASSWORD", "Verify AAD SSO account password last change",
    "C-GPO-SD-CONSISTENCY", "Verify sensitive GPO objects and files permissions",
    "C-DSHEURISTICS", "Domain using a dangerous backward-compatibility configuration",
    "C-DOMAIN-FUNCTIONAL-LEVEL", "Domains have an outdated functional level",
    "C-DISABLED-ACCOUNTS-PRIV-GROUPS", "Disabled accounts in privileged groups",
    "C-DCSHADOW", "Rogue domain controllers",
    "C-DC-ACCESS-CONSISTENCY", "Domain controllers managed by illegitimate users",
    "C-DANGEROUS-TRUST-RELATIONSHIP", "Dangerous trust relationship",
    "C-DANGEROUS-SENSITIVE-PRIVILEGES", "Dangerous sensitive privileges",
    "C-DANG-PRIMGROUPID", "User Primary Group ID",
    "C-BAD-PASSWORD-COUNT", "Brute-force attack detection",
    "C-ADMINCOUNT-ACCOUNT-PROPS", "AdminCount attribute set on standard users",
    "C-ACCOUNTS-DANG-SID-HISTORY", "Accounts having a dangerous SID History attribute",
    "C-ABNORMAL-ENTRIES-IN-SCHEMA", "Dangerous rights in AD's schema",
    "C-GPOLICY-DISABLED-UNLINKED", "Unlinked, disabled or orphan GPO",
    "C-KERBEROS-CONFIG-ACCOUNT", "Kerberos configuration on user account",
    "C-KRBTGT-PASSWORD", "KDC password last change",
    "C-LAPS-UNSECURE-CONFIG", "Local administrative account management",
    "C-NATIVE-ADM-GROUP-MEMBERS", "Native administrative group members",
    "C-NETLOGON-SECURITY", "Unsecured configuration of Netlogon protocol",
    "C-OBSOLETE-SYSTEMS", "Computers running an obsolete OS",
    "C-PASSWORD-NOT-REQUIRED", "Account that might have an empty password",
    "C-PKI-WEAK-CRYPTO", "Use of weak cryptography algorithms into Active Directory PKI",
    "C-PRE-WIN2000-ACCESS-MEMBERS", "Accounts using a pre-Windows 2000 compatible access control",
    "C-PRIV-ACCOUNTS-SPN", "Privileged accounts running Kerberos services",
    "C-REVER-PWD-GPO", "Reversible passwords in GPO",
    "C-ROOTOBJECTS-SD-CONSISTENCY", "Root objects permissions allowing DCSync-like attacks",
    "C-SDPROP-CONSISTENCY", "Ensure SDProp consistency",
    "C-SENSITIVE-CERTIFICATES-ON-USER", "Ensure SDProp consistency",
    "C-SLEEPING-ACCOUNTS", "Sleeping accounts",
    "C-USER-PASSWORD", "User account using old password",
    "C-USERS-REVER-PWDS", "Reversible passwords"
    ];
    let Common = AlsidForADLog_CL
    | parse RawData with
                         Time:datetime  " "
                         Host:string  " "
                         Product:string "["
                         PID:int "]: \""
                         MessageType:int "\" \""
                         AlertID:int "\" \""
                         Forest:string "\" \""
                         Domain:string "\" "
                         DistinctPart:string;
    let Deviances = Common
    | where MessageType == 0 | parse DistinctPart with "\""
                         Codename:string "\" \""
                         Severity:string "\" \""
                         ADObject:string "\" \""
                         DevianceID:string "\" \""
                         ProfileID:string "\" \""
                         ReasonCodename:string "\" \""
                         EventID:string "\""
                         Attributes:string "\r\n";
    let Changes = Common
    | where MessageType == 1
    | parse kind=regex DistinctPart with "\""
                         ADObject:string "\" \""
                         EventID:string "\" \""
                         EventType:string "\" "
                         Attributes:string "\r?\n";
    union Changes, Deviances
    | project-away DistinctPart, Product, _ResourceId, _SubscriptionId
    | lookup kind=leftouter CodenameTable on Codename;
    ```

1. Click the **Save** drop-down, and click **Save**. In the **Save** panel,

    1. Under **Name**, enter **afad_parser**.

    1. Under **Save as**, choose **Function**.

    1. Under **Function Alias**, enter **afad_parser**.

    1. Under **Category**, enter **Functions**.

    1. Click **Save**.

    Function Apps typically take between 10 and 15 minutes to activate.

Now you're ready to query Alsid for AD data, by entering `afad_parser` in the top line of the query window.

See the **Next steps** tab in the connector page for more query samples.

## Next steps

In this document, you learned how to connect Alsid for AD to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
