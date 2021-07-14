---
title: Azure direct routing provisioning and configuration - Azure Communication Services
description: Learn how to add a Session Border Controller and configure voice routing for Azure Communication Services direct routing
author: boris-bazilevskiy
manager: nmurav
services: azure-communication-services

ms.author: bobazile
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Session Border Controllers and voice routing
Azure Communication Services direct routing enables you to connect your existing telephony infrastructure to Azure. The article lists the high-level steps required for connecting a supported Session Border Controller (SBC) to direct routing and how voice routing works for the enabled Communication resource. 

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]
 
For information about whether Azure Communication Services direct routing is the right solution for your organization, see [Azure telephony concepts](./telephony-concept.md). For information about prerequisites and planning your deployment, see [Communication Services direct routing infrastructure requirements](./sip-interface-infrastructure.md).

## Connect the SBC with Azure Communication Services

### Configure using Azure portal 
1. In the left navigation, select Direct routing under Voice Calling - PSTN and then select Configure from the Session Border Controller tab.
1. Enter a fully qualified domain name and signaling port for the SBC.
 
If you are using Office 365, make sure the domain part of the SBC’s FQDN is different from the domain you registered in Office 365 admin portal under Domains. 
- For example, if `contoso.com` is a registered domain in O365, you cannot use `sbc.contoso.com` for Communication Services. But you can use an upper-level domain if one does not exist in O365: you can create an `acs.contoso.com` domain and use FQDN `sbc.acs.contoso.com` as an SBC name.
- SBC certificate must match the name; wildcard certificates are supported.
- The *.onmicrosoft.com domain cannot be used for the FQDN of the SBC.
For the full list of requirements, refer to [Azure direct routing infrastructure requirements](./sip-interface-infrastructure.md).

   :::image type="content" source="../media/direct-routing-provisioning/add-session-border-controller.png" alt-text="Adding Session Border Controller.":::
- When you are done, click Next.
If everything set up correctly, you should see exchange of OPTIONS messages between Microsoft and your Session Border Controller, user your SBC monitoring/logs to validate the connection.

## Voice routing considerations

Azure Communication Services direct routing has a routing mechanism that allows a call to be sent to a specific Session Border Controller (SBC) based on the called number pattern.
When you add a direct routing configuration to a resource, all calls made from this resource’s instances (identities) will try a direct routing trunk first. The routing is based on a dialed number and a match in voice routes configured for the resource. If there is a match, the call goes through the direct routing trunk. If there is no match, the next step is to process the alternateCallerId parameter of callAgent.startCall method. If the resource is enabled for Voice Calling (PSTN) and has at least one number purchased from Microsoft, and if alternateCallerId matches one of a purchased number for the resource, the call is routed through the Voice Calling (PSTN) using Microsoft infrastructure. If alternateCallerId parameter does not match any of the purchased numbers, the call will fail. The diagram below demonstrates the Azure Communication Services voice routing logic.

:::image type="content" source="../media/direct-routing-provisioning/voice-routing-diagram.png" alt-text="Communication Services outgoing voice routing.":::

## Voice routing examples
The following examples display voice routing in a call flow.

### One route example:
If you created one voice route with a pattern `^\+1(425|206)(\d{7})$` and added `sbc1.contoso.biz` and `sbc2.contoso.biz` to it, then when the user makes a call to `+1 425 XXX XX XX` or `+1 206 XXX XX XX`, the call is first routed to SBC `sbc1.contoso.biz` or `sbc2.contoso.biz`. If neither SBC is available, the call is dropped.

### Two routes example:
If you created one voice route with a pattern `^\+1(425|206)(\d{7})$` and added `sbc1.contoso.biz` and `sbc2.contoso.biz` to it, and then created a second route with the same pattern with `sbc3.contoso.biz` and `sbc4.contoso.biz`. In this case, when the user makes a call to `+1 425 XXX XX XX` or `+1 206 XXX XX XX`, the call is first routed to SBC `sbc1.contoso.biz` or `sbc2.contoso.biz`. If both sbc1 and sbc2 are unavailable, the route with lower priority will be tried (`sbc3.contoso.biz` and `sbc4.contoso.biz`). If none of the SBCs of the second route are available, the call is dropped.

### Three routes example:
If you created one voice route with a pattern `^\+1(425|206)(\d{7})$` and added `sbc1.contoso.biz` and `sbc2.contoso.biz` to it, and then created a second route with the same pattern with `sbc3.contoso.biz` and `sbc4.contoso.biz`, and created a third route with `^+1(\d[10])$` with `sbc5.contoso.biz`. In this case, when the user makes a call to `+1 425 XXX XX XX` or `+1 206 XXX XX XX`, the call is first routed to SBC `sbc1.contoso.biz` or `sbc2.contoso.biz`. If both sbc1 nor sbc2 are unavailable, the route with lower priority will be tried (`sbc3.contoso.biz` and `sbc4.contoso.biz`). If none of the SBCs of a second route are available, the third route will be tried; if sbc5 is also not available, the call is dropped. Also, if a user dials `+1 321 XXX XX XX`, the call goes to `sbc5.contoso.biz`, and it is not available, the call is dropped.

> [!NOTE]
> In all examples, while the higher voice route has higher priority, the SBCs in a route are tried in random order.

> [!NOTE]
> In all the examples, if the dialed number does not match the pattern, the call will be dropped unless there is a purchased number exist for the communication resource, and this number was used as `alternateCallerId` in the application. 

## Configure voice routing 

### Configure using Azure portal

:::image type="content" source="../media/direct-routing-provisioning/voice-routing-configuration.png" alt-text="Communication Services outgoing voice routing configuration.":::

Give your Voice Route a name, specify the number pattern using regular expressions, and select SBC for that pattern. 
Here are some examples of basic regular expressions:
- `^\+\d+$` - matches a telephone number with one or more digits that starts with a plus
- `^+1(\d[10])$` - matches a telephone number with a ten digits after a `+1`
- `^\+1(425|206)(\d{7})$` - matches a telephone number that starts with `+1425` or with `+1206` followed by seven digits
- `^\+0?1234$` - matches both `+01234` and `+1234` telephone numbers.

For more information about regular expressions, see [.NET regular expressions overview](/dotnet/standard/base-types/regular-expressions).

You can select multiple SBCs for a single pattern. In such a case, the routing algorithm will choose them in random order. You may also specify the exact number pattern more than once. The higher row will have higher priority, and if all SBCs associated with that row are not available next row will be selected. This way, you create complex routing scenarios.

## Delete direct routing configuration

### Delete using Azure portal

#### To delete a Voice Route:
1. In the left navigation, go to Direct routing under Voice Calling - PSTN and then select the Voice Routes tab.
1. Select route or routes you want to delete using a checkbox.
1. Select Remove.

#### To delete an SBC:
1. In the left navigation, go to Direct routing under Voice Calling - PSTN.
1. On a Session Border Controllers tab, select Configure.
1. Clear the FQDN and port fields for the SBC that you want to remove, select Next.
1. On a Voice Routes tab, review voice routing configuration, make changes if needed. select Save.

> [!NOTE]
> When you remove SBC associated with a voice route, you can choose a different SBC for the route on the Voice Routes tab. The voice route without an SBC will be deleted.

## Next steps

### Conceptual documentation

- [Session Border Controllers certified for Azure Communication Services direct routing](./certified-session-border-controllers.md)
- [Pricing](../pricing.md)

### Quickstarts

- [Call to Phone](../../quickstarts/voice-video-calling/pstn-call.md)
