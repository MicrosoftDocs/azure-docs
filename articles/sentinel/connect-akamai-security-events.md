---
title: Connect your Akamai Security Events collector to Azure Sentinel | Microsoft Docs
description: Learn how to use the Akamai Security Events connector to pull Akamai solutions' security logs into Azure Sentinel. View Akamai data in workbooks, create alerts, and improve investigation.
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
# Connect your Akamai Security Events collector to Azure Sentinel

> [!IMPORTANT]
> The Akamai Security Events connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Akamai Security Events collector to Azure Sentinel. The Akamai Security Events data connector allows you to easily connect your Akamai logs with Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. Integration between the Akamai Security Events collector and Azure Sentinel makes use of CEF-formatted Syslog, a Linux-based log forwarder, and the Log Analytics agent. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

## Send Akamai Security Events logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your Akamai Security Events collector to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Akamai Security Events (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for sizing information, more detailed instructions, and in-depth explanation.

    1. Under **2. Forward Common Event Format (CEF) logs to Syslog agent** - Follow Akamai's instructions to [configure SIEM integration](https://developer.akamai.com/tools/integrations/siem) and to [set up a CEF connector](https://developer.akamai.com/tools/integrations/siem/siem-cef-connector). This connector receives security events from your Akamai solutions in near real time using the SIEM OPEN API, and converts them from JSON into CEF format.
    
        This configuration should include the following elements:
    
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – TCP 514 (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – CEF
        - Log types – all available

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

This data connector depends on a parser based on a Kusto Function to work as expected. Use the following steps to set up the **AkamaiSIEMEvent** Kusto Function to use in queries and workbooks.

1. From the Azure Sentinel navigation menu, select **Logs**.

1. Copy the following query and paste it into the query window.
    ```kusto
    CommonSecurityLog 
    | where DeviceVendor == 'Akamai'
    | where DeviceProduct == 'akamai_siem'
    | extend EventVendor = 'Akamai'
    | extend EventProduct = 'akamai_siem'
    | extend EventProductVersion = '1.0'
    | extend EventId = DeviceEventClassID
    | extend EventCategory = Activity
    | extend EventSeverity = LogSeverity
    | extend DvcAction = DeviceAction
    | extend NetworkApplicationProtocol = ApplicationProtocol
    | extend Ipv6Src = DeviceCustomIPv6Address2
    | extend RuleName = DeviceCustomString1
    | extend RuleMessages = DeviceCustomString2
    | extend RuleData = DeviceCustomString3
    | extend RuleSelectors = DeviceCustomString4
    | extend ClientReputation = DeviceCustomString5
    | extend ApiId = DeviceCustomString6
    | extend RequestId = DevicePayloadId
    | extend DstDvcHostname = DestinationHostName
    | extend DstPortNumber = DestinationPort
    | extend ConfigId = FlexString1
    | extend PolicyId = FlexString2
    | extend NetworkBytes = SentBytes
    | extend UrlOriginal = RequestURL
    | extend HttpRequestMethod = RequestMethod
    | extend SrcIpAddr = SourceIP
    | extend EventStartTime = datetime(1970-01-01) + tolong(extract(@'.*start=(.*?);', 1, AdditionalExtensions)) * 1s 
    | extend SlowPostAction = extract(@'.*AkamaiSiemSlowPostAction=(.*?);', 1, AdditionalExtensions)
    | extend SlowPostRate = extract(@'.*AkamaiSiemSlowPostRate=(.*?);', 1, AdditionalExtensions)
    | extend RuleVersions = extract(@'.*AkamaiSiemRuleVersions=,?(.*?);', 1, AdditionalExtensions)
    | extend RuleTags = extract(@'.*AkamaiSiemRuleTags=(.*?);', 1, AdditionalExtensions)
    | extend ApiKey = extract(@'.*AkamaiSiemApiKey=(.*?);', 1, AdditionalExtensions)
    | extend Tls = extract(@'.*AkamaiSiemTLSVersion=(.*?);', 1, AdditionalExtensions)
    | extend RequestHeaders = extract(@'.*AkamaiSiemRequestHeaders=;?(.*?);', 1, AdditionalExtensions)
    | extend ResponseHeaders = extract(@'.*AkamaiSiemResponseHeaders=(.*?);', 1, AdditionalExtensions)
    | extend HttpStatusCode = extract(@'.*AkamaiSiemResponseStatus=(.*?);', 1, AdditionalExtensions)
    | extend GeoContinent = extract(@'.*AkamaiSiemContinent=(.*?);', 1, AdditionalExtensions)
    | extend SrcGeoCountry = extract(@'.*AkamaiSiemCountry=(.*?);', 1, AdditionalExtensions)
    | extend SrcGeoCity = extract(@'.*AkamaiSiemCity=(.*?);', 1, AdditionalExtensions)
    | extend SrcGeoRegion = extract(@'.*AkamaiSiemRegion=(.*?);', 1, AdditionalExtensions)
    | extend GeoAsn = extract(@'.*AkamaiSiemASN=(\d+)', 1, AdditionalExtensions)
    | extend Custom = extract(@'.*AkamaiSiemCusomData=(.*?)', 1, AdditionalExtensions)
    | project TimeGenerated
            , EventVendor
            , EventProduct
            , EventProductVersion
            , EventStartTime
            , EventId
            , EventCategory
            , EventSeverity
            , DvcAction
            , NetworkApplicationProtocol
            , Ipv6Src
            , RuleName
            , RuleMessages
            , RuleData
            , RuleSelectors
            , ClientReputation
            , ApiId
            , RequestId
            , DstDvcHostname
            , DstPortNumber
            , ConfigId
            , PolicyId
            , NetworkBytes
            , UrlOriginal
            , HttpRequestMethod
            , SrcIpAddr
            , SlowPostAction
            , SlowPostRate
            , RuleVersions
            , RuleTags
            , ApiKey
            , Tls
            , RequestHeaders
            , ResponseHeaders
            , HttpStatusCode
            , GeoContinent
            , SrcGeoCountry
            , SrcGeoCity
            , SrcGeoRegion
            , GeoAsn
            , Custom
    ```

1. Click the **Save** drop-down, and click **Save**. In the **Save** panel,

    1. Under **Name**, enter **AkamaiSIEMEvent**.

    1. Under **Save as**, choose **Function**.

    1. Under **Function Alias**, enter **AkamaiSIEMEvent**.

    1. Under **Category**, enter **Functions**.

    1. Click **Save**.

    Function Apps typically take between 10 and 15 minutes to activate.

Now you're ready to query Akamai data, by entering `AkamaiSIEMEvent` in the top line of the query window.

See the **Next steps** tab in the connector page for more query samples.

## Next steps

In this document, you learned how to connect Akamai Security Events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.