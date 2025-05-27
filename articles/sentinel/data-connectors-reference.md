---
title: Find your Microsoft Sentinel data connector | Microsoft Docs
description: Learn about specific configuration steps for Microsoft Sentinel data connectors.
author: cwatson-cat
ms.topic: reference
ms.date: 11/18/2024
ms.custom: linux-related-content
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to find and deploy the appropriate data connectors for Microsoft Sentinel so that I can integrate and monitor various security data sources effectively.

---

# Find your Microsoft Sentinel data connector

This article lists all supported, out-of-the-box data connectors and links to each connector's deployment steps.

> [!IMPORTANT]
> - Noted Microsoft Sentinel data connectors are currently in **Preview**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

Data connectors are available as part of the following offerings:

- Solutions: Many data connectors are deployed as part of [Microsoft Sentinel solution](sentinel-solutions.md) together with related content like analytics rules, workbooks, and playbooks. For more information, see the [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md).

- Community connectors: More data connectors are provided by the Microsoft Sentinel community and can be found in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Documentation for community data connectors is the responsibility of the organization that created the connector.

- Custom connectors: If you have a data source that isn't listed or currently supported, you can also create your own, custom connector. For more information, see [Resources for creating Microsoft Sentinel custom connectors](create-custom-connector.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Data connector prerequisites

[!INCLUDE [data-connector-prereq](includes/data-connector-prereq.md)]

Azure Monitor agent (AMA) based data connectors require an internet connection from the system where the agent is installed. Enable port 443 outbound to allow a connection between the system where the agent is installed and Microsoft Sentinel.

## Syslog and Common Event Format (CEF) connectors

Log collection from many security appliances and devices are supported by the data connectors **Syslog via AMA** or **Common Event Format (CEF) via AMA** in Microsoft Sentinel. To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). These steps include installing the Microsoft Sentinel solution for a security appliance or device from the **Content hub** in Microsoft Sentinel. Then, configure the **Syslog via AMA** or **Common Event Format (CEF) via AMA** data connector that's appropriate for the Microsoft Sentinel solution you installed. Complete the setup by configuring the security device or appliance. Find instructions to configure your security device or appliance in one of the following articles:

- [CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-cef-device.md)
- [Syslog via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion](unified-connector-syslog-device.md)

Contact the solution provider for more information or where information is unavailable for the appliance or device.

## Custom Logs via AMA connector

Filter and ingest logs in text-file format from network or security applications installed on Windows or Linux machines by using the **Custom Logs via AMA connector** in Microsoft Sentinel. For more information, see the following articles:

- [Collect logs from text files with the Azure Monitor Agent and ingest to Microsoft Sentinel](/azure/sentinel/connect-custom-logs-ama?tabs=portal)
- [Custom Logs via AMA data connector - Configure data ingestion to Microsoft Sentinel from specific applications](/azure/sentinel/unified-connector-custom-device)

[comment]: <> (DataConnector includes end)

[!INCLUDE [connector-details](includes/connector-details.md)]


[!INCLUDE [deprecated-connectors](includes/deprecated-connectors.md)]

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)
