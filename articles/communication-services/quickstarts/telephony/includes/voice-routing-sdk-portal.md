---
title: include file
description: A quickstart on how to use Azure portal to configure direct routing.
services: azure-communication-services
author: boris-bazilevskiy

ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 02/20/2023
ms.topic: include
ms.custom: include file
ms.author: nikuklic
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource. [Create a Communication Services resource](../../../quickstarts/create-communication-resource.md).
- Fully qualified domain name (FQDN) and port number of a Session Border Controller (SBC) in operational telephony system.
- Verified domain name of the SBC

1. In the left navigation, select Direct routing under Voice Calling - PSTN and then select Configure from the Session Border Controller tab.

2. Enter a fully qualified domain name (FQDN) and signaling port for the SBC.
    - Domain part of your SBC FQDN must be verified before you can add it to your direct routing configuration. See [Validate domain ownership](#validate-domain-ownership) 
    - SBC certificate must match the name; wildcard certificates are supported.
    - The `*.onmicrosoft.com` and `*.azure.com` domains can’t be used for the FQDN of the SBC.

    For the full list of requirements, refer to [Azure direct routing infrastructure requirements](./direct-routing-infrastructure.md).

   :::image type="content" source="../media/voice-routing/add-session-border-controller.png" alt-text="Screenshot of Adding Session Border Controller.":::

3. When you're done, select Next.

    If everything is set up correctly, you should see an exchange of OPTIONS messages between Microsoft and your Session Border Controller. Use your SBC monitoring/logs to validate the connection.

## Updating existing configuration

## Removing a direct routing configuration


> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/communication/Azure.Communication.PhoneNumbers/README.md#siproutingclient).