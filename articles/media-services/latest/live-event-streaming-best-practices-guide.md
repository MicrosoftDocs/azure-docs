---
title: Media Services live streaming best practices guide 
description: This article describes best practices for achieving low-latency live streams with Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 02/14/2022
ms.author: inhenkel
---

# Media Services live streaming best practices guide

Customers often ask how they can reduce the latency of their live stream. There are many factors that
determine the end-to-end latency of a stream. Here are some that you should consider:

1. Delays on the contribution encoder side. When customers use an
    encoding software such as OBS Studio, Wirecast, or others to send an
    RTMP live stream to Media Services. Settings on this software is critical in affecting the end-to-end latency of a live
    stream.

2. Delays in the live streaming pipeline within Azure Media Services.

3. CDN performance

4. Buffering algorithms of the video player and network conditions on
    the client side

5. Timing of provisioning

## Contribution encoder

As a customer, you are in control of the settings of the source encoder
settings before the RTMP stream reaches Media Services. Here are some
recommendations for the settings that would give you the lowest possible
latency:

1. **Pick the same region physically** **closest to your contribution
    encoder for your Media Services account.** This will ensure
    that you have a great network connection to the Media Services
    account.

2. **Use a consistent fragment size.** We recommend a GOP size of 2
    seconds. The default on some encoders, such as OBS, is 8 seconds.
    Make sure that you change this setting.

3. **Use the GPU encoder if your encoding software allows you to do
    that.** This would allow you to offload CPU work to the GPU.

4. **Use an encoding profile that is optimized for low-latency.** For
    example, with OBS Studio, if you use the Nvidia H.264 encoder, you
    may see the “zero latency” preset.

5. **Send content that is no higher in resolution than what you plan to
    stream.** For example, if you're using 720p standard encoding live
    events, you a stream that is already at 720p.

6. **Keep your framerate at 30fps or lower unless using pass-through
    live events.** While we support 60 fps input for live events, our
    encoding live event output is still not above 30 fps.

## Configuration of the Azure Media Services live event

Here are some configurations that will help you reduce the latency in
our pipeline:

1. **Use the ‘LowLatency’ StreamOption on the live event.**

2. **We recommend that you choose CMAF output for both HLS and DASH
    playback.** This allows you to share the same fragments for both
    formats. It increases your cache hit ratio when CDN is used. For example:
  

| Type  | Format  | URL example  |
|---------|---------|---------|
|HLS CMAF (recommended)     | format=m3u8-cmaf        | `https://amsv3account-usw22.streaming.media.azure.net/21b17732-0112-4d76-b526-763dcd843449/ignite.ism/manifest(format=m3u8-cmaf)`        |
| MPEG-DASH CMAF (recommended) | format=mpd-time-cmaf | `https://amsv3account-usw22.streaming.media.azure.net/21b17732-0112-4d76-b526-763dcd843449/ignite.ism/manifest(format=mpd-time-cmaf)` |

3. **If you must choose TS output, use an HLS packing ratio of 1.** This
allows us to pack only one fragment into one HLS segment. You won't
get the full benefits of LL-HLS in native Apple players. 

## Player optimizations

**When choosing and configuring a video player, make sure you use settings that are optimized for lower latency.**

Media Services supports different streaming protocols outputs – DASH,
HLS with TS output and HLS with CMAF fragments. Depending on the
player’s implementation, buffering decisions impact the latency a
viewer observes. Poor network conditions or default algorithms that
favor quality and stability of playback could cause players to decide to
buffer more content upfront to prevent interruptions during playback.
These buffers before and during the playback sessions would add to the
end-to-end latency.

When Azure Media Player is used, the *Low Latency Heuristics* profile
optimizes the player to have the lowest possible latency on the player
side.

## CDN choice

Streaming endpoints are the origin servers that deliver the live and VOD
streaming content to the CDN or to the customer directly. If a live
event expects a large audience, or the audience is geographically
located far away from the streaming endpoint (origin) serving the
content, it's *important* for the customer to shield the origin using a
Content Delivery Network (CDN).

We recommend using Azure CDN which is provided by Verizon (Standard or
Premium). We've optimized the integration experience so that a
customer could configure this CDN with a single select in the Azure portal. Be sure to turn on Origin Shield and Streaming Optimizations for
your CDN endpoint whenever you start your streaming endpoint.

Our customers also have good experiences bringing their own CDN. Ensure that measures are taken on the CDN to shield the origin from
excessive traffic.

## Streaming endpoint scaling

> [!NOTE] 
> A **standard streaming endpoint/origins** is a *shared* resource
that allows customers with low traffic volumes to stream content at
a lower cost. You would **not** use a standard streaming endpoint to
scale streaming units if you expect large traffic volumes or you plan to
use a CDN.

A **premium streaming endpoint/origin** offers more flexibility and
isolation for customers to scale by adding or removing *dedicated*
streaming units. A *streaming unit* is a compute resource allocated to a
streaming endpoint. Each streaming unit can stream approximately 200
Mbps of traffic.

While you can concurrently stream many live events at once using
the same streaming endpoint, the maximum default streaming units needed
for one streaming endpoint is 10. You can open a support ticket to
request more than the default 10.

## Determine the premium streaming units needed

There are three steps to determine the number of streaming endpoints and
streaming units needed:

1. Determine the total egress needed.

2. Divide the total egress by 200, which is the maximum Mbps each streaming unit can stream.

### Determine the total egress needed

Determine the total egress needed by using the following formula.

*Total egress needed = average bandwidth x number of concurrent viewers
x percent* *handled by the streaming endpoint.*

Let’s take a look at each of the multipliers in turn.

**Average bandwidth.** What is the *average* bitrate you plan to stream?
In other words, if you're going to have multiple bitrates available
what bit rate is the average of all the bitrates you're planning for?
You can estimate this using one of the following methods:

For a live event that *includes encoding*:

  - If you don’t know what your *average* bandwidth is going to be, you
    could use our top bitrates as an estimate. Our *top* bitrates are:
    
      - 5.5Mbps for the 1080p encoded live events, therefore, your
        average bitrate is going to be somewhere around 3.5Mbps.

  - Look at the encoding preset used for encoding the live event, for
    example, the AdaptiveStreaming(H.264) preset. See this [output
    example](encode-autogen-bitrate-ladder.md#output).

For a live event that is simply using pass-through and not encoding:

  - Check the encoding bitrate ladder used by your local encoder.

**Number of concurrent viewers.** How many concurrent viewers are
expected? This could be hard to estimate, but do your best based on your
customer data. Are you streaming a conference to a global audience? Are
you planning to live stream to sell a set of products to your customers?

**Percent of traffic** **handled by** **the streaming endpoint.** This
can also be expressed as “the percent of traffic NOT handled by the CDN”
since that is the number that actually goes into the formula. So, with
that in mind, what is the CDN offload you expect? If the CDN is expected
to handle 90% of the live traffic, then only 10% of the traffic would be
expected on the streaming endpoint. The number used in the formula is
.10 which is the percentage of traffic expected on the streaming
endpoint.

### Determine the number of premium streaming units needed

Premium streaming units needed = Average bandwidth x \# of viewers x
Percentage of traffic not handled by the CDN / 200 Mbps

### Example

You've recently released a new product and want to present it to your
established customers. You want low latency because you don’t want to
frustrate your already busy audience, so you'll use premium streaming
endpoints and a CDN.

You have approximately 100,000 customers, but they probably aren’t all
going to watch your live event. You guess that in the best case, only 1%
of them will attend, which brings your expected concurrent viewers to
1,000.

*Number of concurrent users =* *1,000*

You've decided that you're going to use Media Services to encode your
live stream and won't be using pass-through. You don’t know what the
average bandwidth is going to be, but you do know that you'll deliver
in 1080p (*top* bitrate of 5.5 Mbps), so your *average* bandwidth is
estimated to be 3.5 Mbps for your calculations.

*Average bandwidth =* *3.5*

Since your audience is dispersed worldwide, you expect that the CDN will
handle most (90%) of the live traffic. Therefore, the premium streaming
endpoints will only handle 10% of the traffic.

*Percent handled by the streaming endpoint =* *10% = 0.1*

Using the formula provided above:

*Total egress needed = average bandwidth x number of concurrent viewers
x percent handled by the streaming endpoint.*

*total egress needed* = 3.5 x 1,000 x 0.1

*total egress needed* = 350 Mbps

Dividing the total egress by 200 you determine that you need 1.75
premium streaming units.

*premium streaming units needed* = *total egress needed*/200Mpbs

*premium streaming units needed* = 1.75

We'll round up this number to 2, giving us 2 units needed.

### Use the portal to estimate your needs

The Azure portal can help you simplify the calculations. On the
streaming page, you can use the calculator provided to see the estimated
audience reach when you change the average bandwidth, CDN hit ratio and
number of streaming units. 

1. From the media services account page, select **Steaming endpoints** from
    the menu.

2. Add a new streaming endpoint by selecting **Add streaming endpoint**.

3. Give the streaming endpoint a name.

4. Select **Premium streaming endpoint** for the streaming endpoint type.

5. Since you're just getting an estimate at this point, don’t start
    the streaming endpoint after creation. Select **No**.

6. Select *Standard Verizon* or *Premium Verizon* for your CDN pricing
    tier. The profile name will change accordingly. Leave the name as it
    is for this exercise.

7. For the CDN profile, select **Create New**.

8. Select **Create**. Once the endpoint has been deployed, the streaming
    endpoints screen will appear.

9. Select the streaming endpoint you just created. The streaming
    endpoint screen will appear with audience reach estimates.

10. The default setting for the streaming endpoint with 1 streaming unit
    shows that it's estimated to stream to 571 concurrent viewers at
    3.5 Mbps using 90% of the CDN and 10% of the streaming endpoint.

11. Change the percentage of the **Egress source** from 90% from CDN cache
    to 0%. The calculator will estimate that you'll be able to stream
    to 57 concurrent viewers at 3.5 Mbps at 200 Mbps **without** a CDN.

12. Now change the **Egress source** back to 90%.

13. Then, change the **streaming units** to 2. The calculator will estimate
    that you'll be able to stream to 1143 concurrent viewers at
    3.5 Mbps with 4000Mpbs with the CDN handling 90% of the traffic.

14. Select **Save**.

15. You can start the streaming endpoint and try sending traffic to it.
    The metrics at the bottom of the screen will track actual traffic.

## Timing

You may want to provision streaming units 1 hour ahead of the expected
peak usage to ensure streaming units are ready.
