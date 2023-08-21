---
title: "Monitor Azure Communication Services direct routing"
ms.author: bobazile
ms.date: 06/22/2023
author: boris-bazilevskiy
manager: rcole
audience: ITPro
ms.topic: troubleshooting
ms.service: azure-communication-services
description: Learn how to monitor Azure Communication Services direct routing configuration, including Session Border Controllers, cloud components, and Telecom trunks.
---

# Monitor direct routing

This article describes how to monitor your direct routing configuration.

The ability to make and receive calls by using direct routing involves the following components:

- Session Border Controllers (SBCs)
- Direct routing components in the Microsoft Cloud
- Telecom trunks

If you have difficulties troubleshooting issues, you can open a support case with your SBC vendor or Microsoft.

Microsoft is working on providing more tools for troubleshooting and monitoring. Check the documentation periodically for updates.

## Monitoring availability of Session Border Controllers using Session Initiation Protocol (SIP) OPTIONS messages

Azure Communication Services direct routing uses SIP OPTIONS sent by the Session Border Controller to monitor SBC health. There are no actions required from the Azure administrator to enable the SIP OPTIONS monitoring. 

## Monitor with Azure portal and SBC logs

In some cases, especially during the initial pairing, there might be issues related to misconfiguration of the SBCs or the direct routing service.

You can use the following tools to monitor your configuration:  

- Azure portal
- SBC logs

In the direct routing section of Azure portal, you can check [SBC connection status](../direct-routing-provisioning.md#session-border-controller-connection-status).
If calls can be made, you can also check [Azure monitors logs](../../analytics/logs/voice-and-video-logs.md) that provide descriptive SIP error codes

SBC logs also is a great source of data for troubleshooting. Reach out to your SBC vendor's documentation on how to configure and collect those logs.

## Next steps

- [Troubleshoot direct routing connectivity](./troubleshoot-tls-certificate-sip-options.md)
- [Troubleshoot outbound calling](./troubleshoot-outbound-calls.md)