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
- [Verified domain name](../../../how-tos/telephony/domain-validation.md) of the SBC

## Adding a Session Border controller

1. In the left navigation, select Direct routing under Voice Calling - PSTN and then select Configure from the Session Border Controller tab.

2. Enter a fully qualified domain name (FQDN) and signaling port for the SBC.
    - Domain part of your SBC FQDN must be verified before you can add it to your direct routing configuration. See [prerequisites](#prerequisites) 
    - SBC certificate must match the name; wildcard certificates are supported.
    - The `*.onmicrosoft.com` and `*.azure.com` domains can’t be used for the FQDN of the SBC.

    For the full list of requirements, refer to [Azure direct routing infrastructure requirements](./direct-routing-infrastructure.md).

   :::image type="content" source="../media/voice-routing/add-session-border-controller.png" alt-text="Screenshot of Adding Session Border Controller.":::

3. When you're done, select Next.

    If everything is set up correctly, you should see an exchange of OPTIONS messages between Microsoft and your Session Border Controller. Use your SBC monitoring/logs to validate the connection.

## Creating Voice Routing rules

:::image type="content" source="../media/voice-routing/voice-routing-configuration.png" alt-text="Screenshot of outgoing voice routing configuration.":::

Give your voice route a name, specify the number pattern using regular expressions, and select SBC for that pattern. 
Here are some examples of basic regular expressions:
- `^\+\d+$` - matches a telephone number with one or more digits that start with a plus
- `^\+1(\d{10})$` - matches a telephone number with a ten digits after a `+1`
- `^\+1(425|206)(\d{7})$` - matches a telephone number that starts with `+1425` or with `+1206` followed by seven digits
- `^\+0?1234$` - matches both `+01234` and `+1234` telephone numbers.

For more information about regular expressions, see [.NET regular expressions overview](/dotnet/standard/base-types/regular-expressions).

You can select multiple SBCs for a single pattern. In such a case, the routing algorithm will choose them in random order. You may also specify the exact number pattern more than once. The higher row will have higher priority, and if all SBCs associated with that row aren't available next row will be selected. This way, you create complex routing scenarios.
## Updating existing configuration

## Removing a direct routing configuration

Follow the steps below to remove direct routing configuration:

### To delete a voice route:
1. In the left navigation, go to Direct routing under Voice Calling - PSTN and then select the Voice Routes tab.
1. Select route or routes you want to delete using a checkbox.
1. Select Remove.

### To delete an SBC:
1. In the left navigation, go to Direct routing under Voice Calling - PSTN.
1. On a Session Border Controllers tab, select Configure.
1. Clear the FQDN and port fields for the SBC that you want to remove, select Next.
1. On a Voice Routes tab, review voice routing configuration, make changes if needed. select Save.

> [!NOTE]
> When you remove SBC associated with a voice route, you can choose a different SBC for the route on the Voice Routes tab. The voice route without an SBC will be deleted.

> [!NOTE]
> More usage examples for SipRoutingClient can be found [here](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/communication/Azure.Communication.PhoneNumbers/README.md#siproutingclient).