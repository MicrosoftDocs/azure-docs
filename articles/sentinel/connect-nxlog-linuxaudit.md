---
title: Connect NXLog LinuxAudit data to Azure Sentinel | Microsoft Docs
description: Learn how to use the NXLog LinuxAudit data connector to pull LinuxAudit logs into Azure Sentinel. View LinuxAudit data in workbooks, create alerts, and improve investigation.
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
ms.date: 03/02/2021
ms.author: yelevin

---
# Connect your NXLog LinuxAudit to Azure Sentinel

> [!IMPORTANT]
> The NXLog LinuxAudit connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The [NXLog LinuxAudit](https://nxlog.co/documentation/nxlog-user-guide/im_linuxaudit.html) connector allows you to easily export Linux security events to Azure Sentinel in real time, giving you insight into domain name server activity throughout your organization. The NXLog LinuxAudit module supports custom audit rules and collects logs without auditd or any other user-space software. IP addresses and group/user IDs are resolved to their respective names making [Linux audit](https://nxlog.co/documentation/nxlog-user-guide/linux-audit.html) logs more intelligible to security analysts. Integration between NXLog LinuxAudit and Azure Sentinel is facilitated via REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect NXLog LinuxAudit

NXLog can be configured to send events in JSON format directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **NXLog LinuxAudit** connector.

1. Select **Open connector page**.

1. Follow the step-by-step instructions in the *NXLog User Guide* Integration topic [Microsoft Azure Sentinel](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) to configure forwarding via REST API.

## Find your data

After a successful connection is established, the data appears in **Logs** under the  **Custom Logs** section, in the *LinuxAudit_CL* table.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to use NXLog LinuxAudit to ingest Linux security events into Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.