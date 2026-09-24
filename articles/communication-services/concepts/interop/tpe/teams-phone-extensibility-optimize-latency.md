---
title: Lowest latency best practices for Teams Phone extensibility
titleSuffix: An Azure Communication Services article
description: Best practices for CCaaS developers and Teams administrators to achieve the lowest call latency and call signaling overhead in Teams Phone extensibility solutions.
author: adriansynal-msft
manager: chpalm
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.date: 08/24/2026
ms.topic: best-practice
ms.author: adriansynal
ms.custom: general_availability
services: azure-communication-services
---

# Lowest latency best practices for Teams Phone extensibility

This article describes the best practices that CCaaS developers and Microsoft 365 Teams tenant administrators can apply to achieve the lowest possible call setup latency, first response latency, and signaling overhead in Teams Phone extensibility (TPE) solutions.

Teams Phone extensibility spans three platforms: **Teams Phone**, which owns the phone number, the resource account, and public switched telephone network (PSTN) connectivity; **Azure Communication Services**, which delivers the incoming call notification, hosts Call Automation, and powers the agent client; and the **CCaaS ISV application**, which decides what to do with the call. Latency accumulates across all three. Neither party can fix it alone.

This article separates every recommendation by the actor who can act on it. Sections prefixed **CCaaS Developer** are for the independent software vendor (ISV) building on Azure Communication Services. Sections prefixed **Teams Admin** are for the Microsoft 365 tenant, Teams voice, and network administrators at the customer.

> [!NOTE]
> This article assumes you're familiar with the call flows in [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md) and the provisioning model in [Teams Phone extensibility provisioning](./teams-phone-extensibility-provisioning.md).

## Understand the TPE latency budget

Before you optimize anything, agree on what you're measuring. A TPE inbound call has four distinct, independently measurable phases. Optimizing the wrong phase produces no perceived improvement for the caller.

| Phase | Measured from and to | Who owns it | Primary levers |
|---|---|---|---|
| **Time to notify** | PSTN call arrives at the Teams resource account, to `IncomingCall` notification received by the CCaaS application | Teams Phone, Azure Communication Services, Event Grid, and the ISV's ingress path | Notification delivery path; ingress hops; auto attendant and call queue hops in front of the application |
| **Time to answer** | `IncomingCall` received, to `AnswerCall` request sent | CCaaS ISV application, almost entirely | Compute warm-up, business logic on the answer path, authentication, database lookups |
| **Time to connect** | `AnswerCall` sent, to `CallConnected` event received | Azure Communication Services Call Automation | Platform-side; minimized by using the native TPE inbound path rather than re-originating the call |
| **Time to first audio** | `CallConnected`, to first audio byte played to the caller | CCaaS ISV application and its AI or IVR stack | Media streaming setup, text-to-speech and dialog start latency, prompt strategy |

The sum of these four phases is what a caller experiences as **first response latency**, the silence between the last ring and the first word of your greeting. Separately, the agent experiences **time to audio on answer**, the gap between accepting the call in the CCaaS client and being able to hear the caller.

> [!IMPORTANT]
> Measure per phase, not end to end. Teams place the entire delay on one component when in practice it's usually distributed. Instrument all four boundaries with a shared correlation identifier. Use the `correlationId` from the `IncomingCall` payload so that ISV-side and platform-side timings can be joined and compared.

## CCaaS Developer best practices

### CCaaS Developer: Host the answer path on always-on, preprovisioned compute

An incoming call rings for only **30 seconds**. Your endpoint has that entire window, and no more, to receive the `IncomingCall` notification and issue `AnswerCall`. Compute that scales to zero, such as a serverless function app on a consumption plan, can spend most or all of that window cold-starting, and the call goes unanswered.

Run the notification handler on always-on compute with enough warm capacity to absorb bursts until scale-out catches up:

- Azure App Service with **Always On** enabled.
- Azure Functions on a plan that keeps **always-ready (prewarmed) instances**.
- Azure Container Apps with a **minimum replica count greater than zero**.
- Azure Kubernetes Service with sufficient baseline capacity.

Reactive scale-out isn't sufficient on its own. A burst of concurrent calls arrives faster than an autoscaler can respond, and the resulting timeouts translate directly into missed calls.

For more information, see [Incoming call concepts](../../call-automation/incoming-call-notification.md#best-practices).

### CCaaS Developer: Keep the answer path short and move business logic off it

Every hop between the notification arriving and `AnswerCall` being issued is spent from the same 30-second budget, and each one adds to time to answer, the phase you control most directly.

- **Minimize intermediary hops.** Gateways, web application firewalls, API management layers, and service meshes on the answer path each add round trips. Where a security control is mandatory, place it as close to the handler as possible and confirm that it isn't performing TLS termination and re-encryption serially.
- **Answer first, then validate.** Move noncritical work off the answer path, including CRM and customer-record lookups, spam scoring, operating-hours checks, skill-based routing calculations, and analytics writes. Answer the call, start the greeting, and perform those lookups concurrently while the caller is hearing audio.
- **Make validations asynchronous.** If a lookup must gate routing, run it in parallel with `AnswerCall` rather than in series before it.
- **Cache aggressively on the hot path.** Resource account to queue mappings, tenant configuration, and routing tables change rarely. Serve them from memory, not from a database round trip per call.

For more information, see [Incoming call concepts](../../call-automation/incoming-call-notification.md#best-practices).

### CCaaS Developer: Tune the Event Grid retry policy for real-time calls

By default, Event Grid retries undelivered events with exponential backoff for up to 24 hours. Because a call rings for only 30 seconds, every retry after that window is wasted signaling that can never result in an answered call. Under load, those retries compete with live traffic.

On the event subscription, under **Additional Features**, set the following values.

| Setting | Recommended value | Why |
|---|---|---|
| Max Event Delivery Attempts | **2** | A third attempt lands outside the ring window. |
| Event Time to Live | **1 minute** | Prevents delivery of events for calls that already ended. |

For more information, see [Incoming call concepts](../../call-automation/incoming-call-notification.md#best-practices) and [Event Grid message delivery and retry](/azure/event-grid/delivery-and-retry).

### CCaaS Developer: Filter event subscriptions so you only receive the calls you handle

Without filtering, every `IncomingCall` raised on the Azure Communication Services resource is delivered to every subscriber. In redirect scenarios, a single PSTN call can also raise **two** `IncomingCall` events, one for the PSTN leg and one for the Azure Communication Services identity. That second event causes redundant processing and, if unguarded, routing loops.

Use Event Grid advanced filters on the event subject to scope delivery to the resource accounts and number ranges that a given application instance owns. Filtering reduces both signaling volume and the amount of work your handler discards.

For more information, see [Call routing options with Call Automation and Event Grid](../../call-automation/incoming-call-notification.md#call-routing-options-with-call-automation-and-event-grid).

### CCaaS Developer: Acknowledge callbacks immediately with a bare 200 OK

Acknowledge first, process afterward. Return a standard `200 OK` or `202 Accepted` as soon as you durably accept the event, and perform all handling asynchronously. Detailed response bodies are unnecessary, and building them delays the acknowledgment, which in turn affects the platform's retry and backoff behavior on the mid-call webhook channel.

Design guidance for the handler itself:

- **Be idempotent.** Events are delivered at least once. Deduplicate on the CloudEvent `id` combined with `data.callConnectionId` or `data.incomingCallContext`.
- **Tolerate out-of-order delivery.** Ordering isn't guaranteed. Your state machine shouldn't assume that intermediate events always precede terminal ones, and it shouldn't issue extra API calls purely to reconstruct ordering.
- **Never return `429` or other non-2xx codes as deliberate back-pressure.** Throttle internally with a queue instead. Returning an error code causes retries or dropped events, both of which cost latency.
- **Cache the OpenID Connect signing keys.** Mid-call callbacks carry a signed JSON Web Token with a short lifetime, and a new token is minted per event. Validate against a cached JSON Web Key Set document rather than fetching it per request, so that token validation doesn't add a network round trip to every acknowledgment.
- **Reconcile rather than wait.** If an expected result event doesn't arrive within a reasonable window, reconcile state with `GET /callConnections/{callConnectionId}` and `GET /callConnections/{callConnectionId}/participants` instead of stalling the call.

For more information, see [Call Automation webhook events](../../call-automation/call-automation.md#call-automation-webhook-events) and [Secure a webhook endpoint](../../../how-tos/call-automation/secure-webhook-endpoint.md).

### CCaaS Developer: Choose the right mid-call action for routing to the agent

The action you choose to get the caller to an agent determines both how many legs remain on the call and how much ongoing signaling your application must process.

| Action | Effect on your application's leg | Use in TPE |
|---|---|---|
| `AddParticipant` | Your application stays on the call and retains full mid-call control. | **Recommended** for adding CCaaS agents. This action is the supported and forward-compatible pattern for TPE. |
| `TransferCallToParticipant` | Your application's leg is removed when the transfer succeeds, so it stops receiving mid-call events and stops relaying media. | **Conditional.** Lowest ongoing overhead, but you lose the ability to control the call with the Call Automation SDKs. Use it only when the IVR is genuinely finished and no further mid-call control, recording control, or context injection is required. |
| `Redirect` | Forwards the call without answering it. | **Not recommended for CCaaS**, and not supported for on-behalf-of scenarios. Although it skips the answer step, it isn't the supported TPE routing pattern. |

For more information, see [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md) and [Build an interactive voice response bot](../../../quickstarts/tpe/teams-phone-extensibility-interactive-voice-response.md).

### CCaaS Developer: Use bidirectional audio streaming for conversational AI

The single largest contributor to time to first audio in an AI-driven IVR is usually the dialog start. Request-response patterns built on repeated `Play` and `Recognize` cycles introduce a full round trip per conversational turn.

Bidirectional audio streaming delivers raw audio over a WebSocket in 20-millisecond packets at 50 frames per second, in both directions, which is the documented low-latency path for building human-like interactive voice agents. Combine it with these patterns:

- **Start media setup in parallel with signaling** rather than waiting for the call to be fully connected before beginning to establish the media path.
- **Begin streaming as early as the platform allows**, so that the first synthesized audio frame is ready the moment the caller can hear it.
- **Stream synthesized speech incrementally** instead of waiting for the complete utterance to be generated before playback begins.
- **Keep a short, pre-rendered opening prompt** so that the caller hears something immediately while the model produces the first dynamic response.

For more information, see [Audio streaming overview](../../call-automation/audio-streaming-concept.md).

### CCaaS Developer: Keep AI processing in-platform rather than round-tripping media

Connecting an Azure AI services resource directly to your Azure Communication Services resource with a managed identity lets `Play` (text-to-speech and Speech Synthesis Markup Language) and `Recognize` (speech-to-text) run without your application extracting, forwarding, and reinjecting media streams. Removing that hop removes an entire network round trip per turn.

Similarly, use **real-time transcription** rather than building your own audio extraction and speech-to-text pipeline when your requirement is a transcript rather than custom model inference.

For more information, see [Connect Azure Communication Services to Azure AI services](../../call-automation/azure-communication-services-azure-cognitive-services-integration.md) and [Real-time transcription](../../call-automation/real-time-transcription.md).

### CCaaS Developer: Initialize the agent client before the call arrives

On the agent side, work done at call time is work that the agent waits through. Move it to page load or application start.

- **Acquire identities and access tokens up front.** Acquire identities and tokens before you start calls, such as when the webpage loads or the application starts, rather than at the moment a call needs to be placed or answered.
- **Create one `CallAgent` per `CallClient`, once, and reuse it.** Creating the `CallAgent` registers the user with the signaling service, which makes fast incoming-call delivery possible. Creating multiple call agents on the same client, or with the same identity on the same page, is a documented cause of `Failed to create callAgent` and breaks that registration.
- **Implement token refresh correctly.** Expired tokens cause failed call setup and missed incoming-call notifications because the signaling connection that delivers `IncomingCallReceived` depends on a valid token.
- **Warm up device permissions early.** Stream acquisition delay, the time the browser takes to return `getUserMedia()`, is one of the two documented root causes of slow call setup on the client. Resolve microphone permission and enumerate devices before the first call, not during it.

For more information, see [Service limits](../../service-limits.md#identity), [Call setup issues](../../../resources/troubleshooting/voice-video-calling/call-setup-issues/overview.md), and [Call setup takes too long](../../../resources/troubleshooting/voice-video-calling/call-setup-issues/call-setup-takes-too-long.md).

### CCaaS Developer: Design around the documented timeouts and concurrency limits

Failing fast well inside the platform timeouts produces a better caller experience than hanging until the platform gives up, and it avoids wasted signaling on operations that can no longer succeed.

| Operation | Documented timeout |
|---|---|
| 1:1 call establishment | 85 seconds |
| PSTN call establishment | 115 seconds |
| Call transfer operation | 60 seconds |
| Reconnect or remove participant | 120 seconds |
| Add or remove modality | 40 seconds |

Also plan around the default limit of **two concurrent outbound calls per phone number**. At contact center scale, exceeding it produces `429` responses and retry loops. Either request a limit increase or distribute outbound dialing across multiple numbers and resource accounts.

Follow the documented throttling patterns generally: reduce the number of operations per request, reduce request frequency, and never retry a `429` immediately.

For more information, see [Service limits](../../service-limits.md#calling-sdk-timeouts), [PSTN call limitations](../../service-limits.md#pstn-call-limitations), and [Throttling patterns and architecture](../../service-limits.md#throttling-patterns-and-architecture).

### CCaaS Developer: Understand what the Azure Communication Services data location does and doesn't affect

> [!IMPORTANT]
> The **Data Location** geography that you choose when you create an Azure Communication Services resource governs where data is retained at rest. It's a data residency and compliance control. It isn't a call-routing control, and moving the resource to a different geography doesn't by itself shorten the media or signaling path.

Microsoft states that data "may transit or be processed in other geographies" precisely because "these global endpoints are necessary to provide a high-performance, low-latency experience to end-users no matter their location." One practical consequence is that Event Grid system topics for Azure Communication Services are global rather than geo-pinned, so you can't force notification delivery to originate from a particular region.

> [!WARNING]
> When your application triggers recording through Call Automation, Azure Communication Services stores the recording file temporarily, in the same geography that you selected as the resource's **Data Location**, for **24 hours**, and then deletes it. Recording retrieval latency and egress follow that geography. This temporary storage is a convenience for retrieval, not a compliance boundary and not a retention solution. You're responsible for retrieving each recording within that window and storing it where your customers' data sovereignty, residency, and retention obligations are met. To keep recordings in a region that you control from the outset, configure [Bring your own storage](../../../quickstarts/call-automation/call-recording/bring-your-own-storage.md) so that Azure Communication Services writes them directly to your own Azure Storage account.

What actually reduces latency is the placement of your components. Deploy the notification handler, the Call Automation control-plane service, and the AI and IVR services close to your callers and close to the Microsoft network edge that serves them. In multiregion contact centers, deploy regionally and route calls to the nearest regional deployment rather than concentrating all call handling in a single Azure region.

For more information, see [Region availability and data residency](../../privacy.md#data-residency) and [Call Recording overview](../../voice-video-calling/call-recording.md).

### CCaaS Developer: Prefer server-initiated outbound calls where the flow allows it

A client-initiated on-behalf-of outbound call places the call from the agent's client by using `onBehalfOfOptions`, which itself raises an `IncomingCall` notification to your control-plane application, which must then answer and add the target. That round trip through your webhook is on the critical path.

When the call doesn't need to originate from the agent's client interface, such as for outbound campaigns, callbacks, scheduled dials, and automated notifications, use the Call Automation `CreateCall` API directly from the server. Doing so removes the client round trip and the associated notification hop entirely.

Reserve the on-behalf-of client flow for agent-initiated dialing where the caller ID of the resource account and client-side call control are required.

For more information, see [Place outbound calls with Call Automation for Teams Phone extensibility](../../../quickstarts/tpe/teams-phone-extensibility-server-outbound-call.md).

### CCaaS Developer: Verify that the callback endpoint's network path is unobstructed

The callback URI must be a public endpoint with a valid HTTPS certificate, DNS name, and the correct firewall ports open. TLS handshake failures, slow certificate chain resolution, and DNS problems all cause retries before the first successful delivery.

Allow the documented ranges rather than discovering them by failure.

| Purpose | Endpoints and ranges | Ports |
|---|---|---|
| Call Automation media | `52.112.0.0/14`, `52.122.0.0/15`, `2603:1063::/38` | UDP 3478-3481 |
| Call Automation callback URLs | `*.lync.com`, `*.teams.cloud.microsoft`, `*.teams.microsoft.com`, plus the preceding ranges | TCP 443 and 80, UDP 443 |
| Calling SDK media (TURN and media processor) | `20.202.0.0/16` | UDP 3478-3481, TCP 443 |
| Calling SDK signaling and telemetry | `*.skype.com`, `*.microsoft.com`, `*.azure.net`, `*.azure.com`, `*.office.com` | TCP 443 and 80 |

Enable Event Grid delivery-failure logging so that silent delivery problems surface as data rather than as dropped calls.

```kusto
AegDeliveryFailureLogs
| limit 10
| where Message has "incomingCall"
```

For more information, see [Secure a webhook endpoint](../../../how-tos/call-automation/secure-webhook-endpoint.md) and [Network requirements](../../voice-video-calling/network-requirements.md#firewall-configuration).

## Teams Admin best practices

### Teams Admin: Meet the published network quality targets

Every downstream optimization is bounded by the underlying network. Validate each site against the thresholds that Microsoft uses to classify a media stream as poor, measured between the customer's network edge and the Microsoft network edge.

| Metric | Classified as poor when |
|---|---|
| Round-trip time | Greater than 500 ms |
| Jitter | Greater than 30 ms |
| Packet loss rate | Greater than 0.1% |

Only one metric needs to break the threshold for the stream to be classified as poor. Classification requires more than 500 packets in the stream.

Also constrain hop count to **three to five hops from client to network edge, and three hops from the ISP to the Microsoft network edge**. Use Network Planner in the Teams admin center to model per-site bandwidth and connectivity requirements before rollout rather than after complaints.

For more information, see [Stream classification in Call Quality Dashboard](/microsoftteams/stream-classification-in-call-quality-dashboard), [Quality of Service in Teams](/microsoftteams/qos-in-teams), and [Network Planner](/microsoftteams/network-planner).

### Teams Admin: Egress locally and eliminate network hairpins

Local DNS resolution and local internet egress are, in Microsoft's words, "of critical importance for reducing connection latency," and you must implement them together. Backhauling branch traffic to a central datacenter before it reaches the internet sends real-time media on a detour and can land it at a Microsoft front door far from the user.

- **Egress at the user's location** in preference to regional egress, and use regional egress in preference to forced tunneling to headquarters.
- **Provision local DNS resolvers in branch locations.** A distant or busy resolver adds name-resolution latency to every connection setup, and DNS-based service selection steers users to whichever Microsoft entry point is nearest the resolver, not the user.
- **Remove intermediate security stacks from the media path.** A hairpin through a cloud access broker or a centralized web gateway "introduces latency and potential redirection to a geographically distant endpoint."
- **Confirm that your ISP peers directly with the Microsoft Global Network** near each user population.

For more information, see [Microsoft 365 network connectivity principles](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles).

### Teams Admin: Let media traffic use UDP and bypass inspection

Real-time media uses the Microsoft 365 **Optimize** category, which is deliberately narrow and UDP-only. Any configuration that forces media onto TCP, terminates TLS, or inspects packets adds latency. Microsoft explicitly lists these configurations as untested and unsupported.

| Category | Endpoints | Ports | Requirement |
|---|---|---|---|
| Optimize (ID 11), Teams media | `52.112.0.0/14`, `52.122.0.0/15`, `2603:1063::/38` | **UDP 3478-3481** | Optimize Required |
| Allow (ID 12), Teams signaling | `*.teams.microsoft.com` and the preceding ranges | TCP 443 and 80, UDP 443 | Allow Required |

Specifically:

- **Don't force protocol downgrade.** Microsoft lists "forcing downgrade or failover of protocols (such as UDP to TCP)" as a known-bad configuration. TCP 443 is a fallback path, not an equivalent one.
- **Bypass TLS decryption, deep packet inspection, and content filtering** for Microsoft 365 domains.
- **Don't block QUIC or WebSocket.** If a WebSocket connection can't be established, Teams falls back to HTTP long polling, which the documentation states "results in increased bandwidth and latency."
- **Bypass the corporate proxy** for Microsoft 365 traffic by using proxy auto-configuration files delivered by Web Proxy Auto-Discovery or Group Policy.
- **Maintain NAT session persistence and size NAT pools correctly.** Firewalls that remap UDP bindings mid-session, or that exhaust the NAT pool, force reconnection and renegotiation.
- **Use the Microsoft 365 endpoints web service** to keep allow lists current. Microsoft states that selectively allowing only part of the published set causes connectivity and service incidents.

For more information, see [Microsoft 365 URLs and IP address ranges](/microsoft-365/enterprise/urls-and-ip-address-ranges), [Microsoft 365 network connectivity principles](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles), and [Prepare your organization's network for Teams](/microsoftteams/prepare-network).

### Teams Admin: Implement QoS end to end with DSCP marking

Enable the tenant setting **Insert Quality of Service (QoS) markers for real-time media traffic** in the Teams admin center, because client-side Differentiated Services Code Point (DSCP) marking doesn't take effect without it. Combine client marking with router port-based access control list tagging, which is the Microsoft stated best practice.

| Traffic type | Client source port range | Protocol | DSCP value | DSCP class |
|---|---|---|---|---|
| Audio | 50,000-50,019 | TCP/UDP | **46** | Expedited Forwarding (EF) |
| Video | 50,020-50,039 | TCP/UDP | 34 | Assured Forwarding (AF41) |
| Application and screen sharing | 50,040-50,059 | TCP/UDP | 18 | Assured Forwarding (AF21) |
| Calling and meetings signaling | 50,070-50,089 (not configurable) | UDP | **40** | Class Selector 5 (CS5) |

Marking signaling traffic (CS5) matters as much as marking audio for a contact center. Signaling delay is what shows up as slow call setup and slow transfer, even when audio quality is fine once connected.

Validate that markings survive the path. Capture packets at the network egress point and confirm that DSCP values aren't stripped or rewritten by an intermediate device. An unvalidated QoS policy is frequently a no-op.

For more information, see [Implement Quality of Service in Microsoft Teams](/microsoftteams/qos-in-teams).

### Teams Admin: Place Direct Routing SBCs close to a Microsoft PSTN hub

When a session border controller (SBC) resolves `sip.pstnhub.microsoft.com`, Azure DNS returns the primary datacenter assigned to that SBC. "The assignment is based on performance metrics of the data centers and geographical proximity to the SBC." The physical and network placement of the SBC directly determines signaling round-trip time.

- **Configure the three fully qualified domain names in the documented order.** Try `sip.pstnhub.microsoft.com` first. Use `sip2` and `sip3` for failover only; they map to other continents. An SBC that habitually reaches a secondary name adds intercontinental round trips to every call.
- **Host or peer the SBC near a published Microsoft datacenter.** SIP proxy and media processor locations include North America (US South Central, US West, US East), Europe (UK South, France Central, Amsterdam, Dublin), Asia (Singapore), Japan (JP East and West), Australia (AU East and Southeast), and Latin America (Brazil South).
- **Deploy regional SBCs for multiregion contact centers** rather than routing all regions through one central SBC.
- **Provision at least two ports per concurrent call** to avoid port exhaustion, which causes setup failures and renegotiation delays.

For more information, see [Plan Direct Routing](/microsoftteams/direct-routing-plan).

### Teams Admin: Override the SBC media relay location when the automatic choice is wrong

Direct Routing assigns the Microsoft media relay datacenter for a trunk automatically, based on the **public IP address of the SBC**, and always tries to pick the datacenter closest to it. That inference is only as good as the geolocation of the IP address block. If your SBC sits in Frankfurt but its public IP address comes from a US-registered range, every call on that trunk is relayed through a US datacenter and back, which is a permanent, invisible transatlantic round trip on the media path.

The `-MediaRelayRoutingLocationOverride` parameter on [Set-CsOnlinePSTNGateway](/powershell/module/microsoftteams/set-csonlinepstngateway#-mediarelayroutinglocationoverride), and on [New-CsOnlinePSTNGateway](/powershell/module/microsoftteams/new-csonlinepstngateway) at trunk creation, lets you pin the media relay location manually.

```powershell
# Inspect what is configured today
Get-CsOnlinePSTNGateway -Identity sbc1.contoso.com |
    Select-Object Identity, MediaBypass, MediaRelayRoutingLocationOverride

# Pin the media relay location for an SBC physically located in Germany
Set-CsOnlinePSTNGateway -Identity sbc1.contoso.com -MediaRelayRoutingLocationOverride DE

# Set it at trunk creation time
New-CsOnlinePSTNGateway -Fqdn sbc2.contoso.com -SipSignalingPort 5067 -Enabled $true `
    -MediaRelayRoutingLocationOverride DE

# Clear the override and return to automatic selection
Set-CsOnlinePSTNGateway -Identity sbc1.contoso.com -MediaRelayRoutingLocationOverride $null
```

> [!CAUTION]
> Use this parameter only with evidence. Microsoft guidance is explicit: "We only recommend setting this parameter if the call logs clearly indicate that automatic assignment of the datacenter for media path does not assign the closest to the SBC datacenter." A wrong override is worse than no override, because it defeats the automatic selection permanently and for every call on that trunk. Confirm the misassignment first, in the Direct Routing health dashboard or in [call detail records and Call Quality Dashboard media path data](/microsoftteams/direct-routing-monitor-and-troubleshoot), before you set it, and reverify afterward.

- **The value is a two-letter ISO 3166-1 alpha-2 code**, not an Azure region and not a Microsoft 365 geography. Examples are `DE`, `GB`, `US`, `SG`, `JP`, `AU`, `BR`, and `IN`. For the complete list of accepted codes, see [Direct Routing media path codes](/microsoftteams/direct-routing-country-codes).
- **It's per trunk.** Set it on each SBC whose public IP geolocation is misleading, typically SBCs hosted by a global carrier, behind an anycast or cloud provider address, or reached through a corporate NAT that egresses in another country/region.
- **Symptoms that justify investigating** include consistently high media round-trip time on one trunk while other trunks in the same tenant are healthy, a media path that traverses a continent that the call has no business visiting, or a recently renumbered or rehomed SBC whose latency regressed without any topology change.
- **Fix the root cause where you can.** Correcting the geolocation registration of the SBC's public IP address block with the address owner is a better long-term fix than an override, because it also improves `sip.pstnhub.microsoft.com` DNS resolution for signaling, which the override doesn't change.

> [!NOTE]
> `-MediaRelayRoutingLocationOverride` influences the media relay datacenter only. It doesn't change which SIP proxy the SBC signals to, doesn't change voice route selection, and doesn't change which SBC is chosen for a call. To influence those, use SBC placement, name configuration, and voice route priority as described in the preceding sections.

For more information, see [Set-CsOnlinePSTNGateway](/powershell/module/microsoftteams/set-csonlinepstngateway#-mediarelayroutinglocationoverride) and [Direct Routing media path codes](/microsoftteams/direct-routing-country-codes).

### Teams Admin: Keep every paired SBC healthy so that it isn't demoted in routing

Direct Routing uses SIP OPTIONS messages from the SBC to monitor health, and "this collected information is taken into consideration when routing decisions are made." An SBC is considered healthy only if it sent OPTIONS within the last **3 minutes**. The default send interval is every **1 minute**.

An SBC with a broken or unconfigured OPTIONS keep-alive is **demoted in route selection**. Every call then silently fails over to a backup SBC first, often one in a different region, which adds setup latency on every single call while appearing to work correctly.

- Verify that SIP OPTIONS status is **Active**, not "warning - no options" or "warning - not configured", for every SBC in the Direct Routing health dashboard.
- Monitor the **30-day TLS certificate expiry warning**. Certificates must chain to a Microsoft Trusted Root Program certification authority with a minimum 2,048-bit key and the Server Authentication enhanced key usage.
- Watch **concurrent calls capacity** against `MaxConcurrentSessions`. An SBC at capacity forces failover.
- Use only **SBCs certified for Direct Routing**. Microsoft runs daily compatibility tests only against certified firmware.

For more information, see [Direct Routing health dashboard](/microsoftteams/direct-routing-health-dashboard), [Monitor and troubleshoot Direct Routing](/microsoftteams/direct-routing-monitor-and-troubleshoot), and [Session Border Controllers certified for Direct Routing](/microsoftteams/direct-routing-border-controllers).

### Teams Admin: Order voice routes so that the nearest SBC is tried first

Voice routes are evaluated by priority, but **SBCs within a single route are tried in random order**. Configuring several equal-priority SBCs across regions therefore doesn't guarantee that the closest one is used. Roughly half the calls take the long path.

Give the geographically nearest, lowest-latency SBC the highest priority for each number pattern, and place remote SBCs on lower-priority routes that are used only for failover.

One optimization is built in and worth knowing. On call forward or transfer of an inbound PSTN call, if the ingress SBC is also a valid egress SBC, its priority is ignored and it's always tried first, which keeps transferred calls on the same SBC instead of round-tripping to another one.

For more information, see [Configure voice routing for Direct Routing](/microsoftteams/direct-routing-voice-routing).

### Teams Admin: Understand where media bypass applies and where it doesn't

Media bypass keeps media between the SBC and the Teams client rather than routing it through Teams Phone, which "shortens the path of media traffic and reduces the number of hops in transit." Without it, a Frankfurt SBC can send media on an unnecessary round trip through Amsterdam or Dublin and back.

> [!IMPORTANT]
> Media processors are always in the path for Teams voice applications, including auto attendants, call queues, and call park. A call that is being served by a Teams voice application doesn't benefit from media bypass on that leg. Because TPE inbound calls arrive at a Teams resource account, plan on media traversing a media processor for the TPE portion of the call. Media bypass remains valuable for the tenant's other Teams Phone traffic, and for direct agent-to-agent and agent-to-PSTN calls that aren't served by a voice application.

- **Enable media bypass** with `Set-CsOnlinePSTNGateway -MediaBypass $true` where the Teams client and SBC are colocated on the same network and the SBC has a reachable public IP address.
- **Use Local Media Optimization** instead when SBCs sit behind private or network address translated addresses, or when you're centralizing many branch trunks behind one SBC. Local Media Optimization keeps media on the corporate subnet by using the SBC's internal address for on-network users and its external address for off-network users.
- If media bypass with public SBC addresses is already working, Microsoft states that you don't need to move to Local Media Optimization.
- When the client can't reach the SBC directly, the Microsoft **transport relay** relays Real-time Transport Protocol traffic without transcoding, which preserves the no-transcode benefit. Allow UDP 50,000-59,999 between the transport relay and the SBC.

For more information, see [Plan for media bypass with Direct Routing](/microsoftteams/direct-routing-plan-media-bypass) and [Local Media Optimization for Direct Routing](/microsoftteams/direct-routing-media-optimization).

### Teams Admin: Avoid unnecessary transcoding on the SBC leg

Transcoding happens at the media processor. For example, SILK is used between the Teams client and the media processor, and G.711 is used between the media processor and the SBC. Each transcode adds processing work and therefore delay.

- Supported codecs on the SBC leg are **SILK, G.711, G.722, and G.729**. You can force a specific codec by excluding the undesirable ones from the SBC's Session Description Protocol offer.
- Prefer a wideband codec that both legs support, so that the media processor forwards rather than converts wherever possible.
- The leg between the Teams client and the media processor uses SILK or G.722, selected automatically. This leg isn't administrator-configurable.
- Use **RFC 2833** for dual-tone multifrequency (DTMF) signaling. In-band DTMF isn't supported, and garbled tones force IVR reprompts, which is user-visible latency even though it isn't network latency.

For more information, see [Plan Direct Routing](/microsoftteams/direct-routing-plan) and [Direct Routing infrastructure requirements](../../telephony/direct-routing-infrastructure.md#media-traffic-codecs).

### Teams Admin: Minimize the number of hops in front of the CCaaS application

Every auto attendant menu, call queue, and transfer between them is a transition that adds call setup time before the CCaaS application ever receives the `IncomingCall` notification. Teams enforces a hard ceiling of **25 transitions** per call. After the twenty-fifth, the call is disconnected.

- **Route directly to the resource account associated with the CCaaS application** wherever the routing decision can be made by the ISV's IVR instead of by a Teams auto attendant. Duplicating the same menu in both places adds a hop for no benefit.
- **Nest voice applications without resource accounts.** Microsoft states that this approach is recommended. Only the first voice application that answers needs a licensed resource account, and it makes routing flows easier to understand and manage.
- **Put the most common options first** in any menu that remains, and keep menus to **five options or fewer**.
- **Avoid pointing a service number directly at a call queue** unless the queue is staffed 24 hours a day. Queues have no off-hours or holiday handling, which forces a workaround hop anyway.
- Keep greetings short. Audio that the caller must listen through before reaching the application is indistinguishable from latency, from the caller's point of view.

For more information, see [Design call flows for auto attendants and call queues](/microsoftteams/aa-cq-design-call-flows), [Nesting auto attendants and call queues](/microsoftteams/aa-cq-plan-nesting), and [Plan for third-party voice agents](/microsoftteams/aa-cq-plan-third-party-voice-agents).

### Teams Admin: Plan around configuration propagation delays

Changes that affect routing aren't instantaneous. Schedule them outside contact center peak hours and validate afterward, because a half-propagated change produces intermittent misrouting that looks like a latency regression.

| Change | Propagation time |
|---|---|
| Network sites, subnets, and regions, which affect media bypass, Local Media Optimization, Location-Based Routing, and emergency calling | Up to **4 hours** |
| Adding an SBC or changing a voice route | Approximately **5 minutes** |
| Moving an SBC name to another resource | Approximately **1 hour**, or requires an SBC restart |

For more information, see [Network settings for cloud voice features](/microsoftteams/cloud-voice-network-settings).

> [!NOTE]
> Location-Based Routing isn't a latency control. Microsoft explicitly cautions: "You shouldn't use Location-Based Routing to dynamically route PSTN calls based on the location of the user. To do so may cause unintended results." Location-Based Routing is a regulatory toll-bypass control. It does share the network region, site, and subnet topology that media bypass and Local Media Optimization depend on, so building that topology accurately benefits several features at once. However, don't deploy Location-Based Routing expecting a latency improvement. See [Plan Location-Based Routing](/microsoftteams/location-based-routing-plan).

## Measure and prove your improvements

If you don't measure optimizations, you might end up arguing about them instead of confirming them. Use each tool for the job it's designed for.

| Tool | Actor | Use it for |
|---|---|---|
| [Call Summary](/azure/azure-monitor/reference/tables/acscallsummary) and [Call Diagnostics](/azure/azure-monitor/reference/tables/acscalldiagnostics) logs | CCaaS Developer | Per-call timeline of Azure Communication Services events and metrics. Join on `correlationId` to attribute delay to a specific phase. TPE calls can be distinguished from standard Azure Communication Services calls. |
| [Media quality statistics](../../voice-video-calling/media-quality-sdk.md) and [User Facing Diagnostics](../../voice-video-calling/user-facing-diagnostics.md) | CCaaS Developer | Live per-second jitter, round-trip time, and packet loss from the agent client, plus actionable degradation signals. |
| Event Grid `AegDeliveryFailureLogs` | CCaaS Developer | Detecting notification delivery failures and slow acknowledgments before they become dropped calls. |
| [Call Quality Dashboard](/microsoftteams/quality-of-experience-review-guide) | Teams Admin | Organization-wide trend analysis. Poor Stream Rate is the headline key performance indicator. Segment by building and subnet to find the sites that need network work. |
| [Real-Time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality) | Teams Admin | Troubleshooting a call that is happening right now, with device, network, and connectivity telemetry updated live. |
| [Direct Routing health dashboard](/microsoftteams/direct-routing-health-dashboard) | Teams Admin | Network effectiveness ratio, SIP OPTIONS status, concurrent call capacity, and certificate expiry per SBC. |
| Teams admin center Best Practice Configurations dashboard | Teams Admin | Identifying locations that don't follow the Microsoft recommended network configuration. |

> [!TIP]
> Establish a baseline before you change anything. Capture at least a week of measurements at 10-minute intervals and evaluate at the 90th percentile, and then remeasure the same way after each change. Contact center traffic is bursty enough that averages hide the problem that callers actually experience.

## Related content

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility provisioning](./teams-phone-extensibility-provisioning.md)
- [Teams Phone capabilities](./teams-phone-extensibility-capabilities.md)
- [Cost and connectivity options](./teams-phone-extensibility-connectivity-cost.md)
- [Teams Phone extensibility troubleshooting](./teams-phone-extensibility-troubleshooting.md)
- [Incoming call concepts](../../call-automation/incoming-call-notification.md)
- [Audio streaming overview](../../call-automation/audio-streaming-concept.md)
- [Network requirements for Azure Communication Services](../../voice-video-calling/network-requirements.md)
- [Prepare your organization's network for Microsoft Teams](/microsoftteams/prepare-network)
- [Implement Quality of Service in Microsoft Teams](/microsoftteams/qos-in-teams)
- [Plan Direct Routing](/microsoftteams/direct-routing-plan)
- [Plan for media bypass with Direct Routing](/microsoftteams/direct-routing-plan-media-bypass)
- [Microsoft 365 network connectivity principles](/microsoft-365/enterprise/microsoft-365-network-connectivity-principles)
