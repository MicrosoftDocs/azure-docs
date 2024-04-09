---
title: Connect Microsoft Sentinel to Azure, Windows, and Microsoft services
description: Learn how to connect Microsoft Sentinel to Azure and Microsoft 365 cloud services and to Windows Server event logs.
author: yelevin
ms.topic: how-to
ms.date: 02/24/2023
ms.author: yelevin
---

# Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services

Microsoft Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Types of connections

Data connectors for Microsoft Sentinel are grouped into the following types of connectors:

- **API-based** connections
- **Diagnostic settings** connections, some of which are managed by Azure Policy
- **Windows agent**-based connections

See the [data connector reference](data-connectors-reference.md) to find available data connectors and their related information page. You'll find information that's unique to each connector like Log Analytics tables for data storage and a link to the installation instructions.

The following articles present information that is common to each group of connectors for Microsoft services.

- [API-based data connections](connect-services-api-based.md)
- [Diagnostic settings-based data connections](connect-services-diagnostic-setting-based.md)
- [Windows agent-based connections](connect-services-windows-based.md)

The following integrations are both more unique and popular, and are treated individually, with their own articles:

- [Amazon Web Services (AWS) CloudTrail](connect-aws.md)
- [Microsoft Entra ID](connect-azure-active-directory.md)
- [Azure Virtual Desktop](connect-azure-virtual-desktop.md)
- [Microsoft Defender XDR](connect-microsoft-365-defender.md)
- [Microsoft Defender for Cloud](connect-defender-for-cloud.md)
- [Microsoft Purview Information Protection](connect-microsoft-purview.md)
- [Windows DNS](connect-dns-ama.md)
- [Windows Security Events](connect-windows-security-events.md)


## Next steps

- Learn about [Microsoft Sentinel data connectors](connect-data-sources.md) in general.
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md).
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
