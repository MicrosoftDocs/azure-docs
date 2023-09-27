---
title: Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile
description: Azure Communication Gateway optionally contains Mobile Control Point for anchoring Teams Phone Mobile calls in the Microsoft Cloud
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 04/17/2023
ms.custom: template-concept
---

# Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile

Mobile Control Point (MCP) is an IMS Application Server integrated into Azure Communications Gateway. It simplifies interworking with Microsoft Phone System (MPS) by minimizing the network adaptation needed in your mobile network to route calls into Microsoft Teams.

MCP queries MPS to determine whether the caller or callee is eligible for Teams Phone Mobile services.

* If the caller or callee is eligible, MCP adds MPS to the call path, so that MPS can provide Team Phone Mobile services.
* If the user isn't eligible or the call doesn't reach MPS, MCP ensures that native mobile calls continue to reach their target, although without Microsoft Teams services or alerting in Microsoft Teams clients.

For more information about the role MCP provides in a Teams Phone Mobile deployment (including call flows), see the Teams Phone Mobile documentation provided by your Microsoft representative.

## SIP signaling

MCP integrates with your IMS S-CSCF using an ISC interface. This interface is defined in 3GPP TS 23.218 and TS 23.228, with more detail provided in 3GPP TS 24.229. You can optionally deploy ISC gateway function at the edge of your IMS network to provide border control, similar to the border control provided by an IBCF.

MCP acts as a SIP proxy. It queries MPS to determine if a call involves a Teams Phone Mobile subscriber and updates the signaling on the call to route the call to MPS as required. It doesn't process media. 

MCP always queries MPS unless the call meets one of the following conditions:

* A mobile originating call has an X-MS-FMC header with any value.
* A call from a Teams client has an X-MS-FMC header with the value `APP`.
* A mobile terminating call has an X-MS-FMC header with the value `MT`.

These X-MS-FMC headers are added by MPS, and allow MCP to avoid creating loops where it continually queries MPS.

MCP determines whether a call is mobile originating or mobile terminating by using (in order of preference) the `sescase` parameter on the P-Served-User header, `term` or `orig` parameters on the top Route header or `term` or `orig` parameters in the URI of the Route header. If none of these parameters are present, MCP treats the call as mobile terminating. 

MCP determines the served subscriber for a mobile originating call from the URI in the P-Served-User header or P-Asserted-Identity header.
It determines the served subscriber from a mobile terminating call from the URI in the P-Served-User header or the Request-URI.

If MPS responds with an error or can't provide a number to use to route the call, MCP can't update the signaling, so the call doesn't receive Teams Phone Mobile services. MCP passes any SIP errors back into your mobile network.

MCP supports E.164 numbers and sip: and tel: URIs.

All traffic to MCP must use SIP over TLS.

## Invoking MCP for Teams Phone Mobile subscribers

Teams Phone Mobile subscribers require Initial Filter Criteria (iFC) configuration in the HSS to involve MCP at the appropriate points in the call: we recommend invoking it last in the originating iFC chain and first in the terminating iFC chain. Invoke MCP for all calls involving Teams Phone Mobile subscribers, except for CDIV calls.

The iFCs should use a hostname for MCP. MCP provides two hostnames, each prioritizing one region and allowing fallback to the other region. To find the hostnames:

1. Go to the **Overview** page for your Azure Communications Gateway resource.
1. In each **Service Location** section, find the **MCP hostname** field.

For example, you could use the following iFC (replacing *`<mcp-hostname>`* with one of the hostnames).

```xml
<InitialFilterCriteria>
    <Priority>0</Priority>
    <TriggerPoint>
        <ConditionTypeCNF>0</ConditionTypeCNF>
        <SPT>
            <ConditionNegated>0</ConditionNegated>
            <Group>0</Group>
            <Method>INVITE</Method>
        </SPT>
        <SPT>
            <ConditionNegated>1</ConditionNegated>
            <Group>0</Group>
            <SessionCase>4</SessionCase>
        </SPT>
    </TriggerPoint>
    <ApplicationServer>
        <ServerName>sip:<mcp-hostname>;transport=tcp;service=mcp</ServerName>
        <DefaultHandling>0</DefaultHandling>
    </ApplicationServer>
</InitialFilterCriteria>
```

## Next steps

- Learn about [preparing to deploying Integrated Mobile Control Point in Azure Communications Gateway](prepare-to-deploy.md)
- Learn how to [integrate Azure Communications Gateway with Integrated Mobile Control Point with your network](prepare-for-live-traffic-operator-connect.md)


