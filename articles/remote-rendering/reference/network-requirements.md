---
title: Network requirements
description: Network requirements and best network practices for optimal experience
author: florianborn71
ms.author: flborn
ms.date: 02/13/2020
ms.topic: reference
---

# Network requirements

A stable, low-latency network connection to an Azure data center is critical for a good user experience in Azure Remote Rendering. Poor network conditions can result in dropped connections, unstable, jittery, or 'jumping' holograms, and noticeable lag when updating the server-side scene graph.

## Guidelines for network connectivity

The exact network requirements depend on your specific use case, such as the number and frequency of modifications to the remote scene graph as well as the complexity of the rendered view, but there are a number of guidelines to ensure that your experience is as good as possible:

* Your internet connectivity needs to support at least **40 Mbps downstream** and **5 Mbps upstream** consistently for a single user session of Azure Remote Rendering, assuming there is no competing traffic on the network. We recommend higher rates for better experiences. With more users on the same network, these requirements scale up correspondingly.
* Using the **5-GHz Wi-Fi band** will usually produce better results than the 2.4-GHz Wi-Fi band, though both should work.
* If there are other Wi-Fi networks nearby, avoid using Wi-Fi channels in use by these other networks. You can use network scanning tools like [WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html) to verify whether the channels your Wi-Fi network uses, are free of competing traffic.
* Strictly **avoid using Wi-Fi repeaters** or LAN-over-powerline forwarding.
* **Avoid competing bandwidth-intense traffic** – such as video or game streaming – on the same Wi-Fi network.
* Having **good Wi-Fi signal strength** is essential. If possible, stay close to your Wi-Fi access point and avoid obstacles between your client device and the access points.
* Make sure that you always connect to the **nearest Azure data center** for your [region](regions.md). The closer the data center, the lower the network latency, which has a huge effect on hologram stability.

> [!NOTE]
> The downstream bandwidth is mostly consumed by the video stream, which in turn is split between color- and depth information (both 60 Hz, stereo).

## Network performance tests

If you want to get an initial understanding of whether the quality of your network connectivity is sufficient to run Azure Remote Rendering, there are existing online tools that you can use. We strongly recommend running these online tools from a reasonably powerful laptop connected to the same Wi-Fi as the device that you are planning to run your Azure Remote Rendering client application on. Results obtained from running the tests on a mobile phone or HoloLens2 are usually less useful, as they have proven to show significant variation on low-powered endpoint devices. The location at which you place the laptop should be roughly at the same place at which you expect to use the device that runs your Azure Remote Rendering client application.

Here are a few simple steps for a quick test of your network connectivity:

1. **Run a network testing tool like www.speedtest.net to get data on the overall latency and upstream/downstream bandwidth of your network connection.**
Pick a server closest to you and run the test. While the server will not be the Azure data center that Azure Remote Rendering will connect to, the resulting data is still useful to understand the performance of your internet connection and Wi-Fi.
   * **Minimum requirement** for Azure Remote Rendering: Approx. 40 Mbps downstream and 5 Mbps upstream.
   * **Recommended** for Azure Remote Rendering: Approx. 100 Mbps downstream and 10 Mbps upstream.
We recommend running the test multiple times and taking the worst results.
1. **Use a tool like www.azurespeed.com that measures latency to Azure data centers**. Select the Azure data center supported by Azure Remote Rendering that is closest to you (see [supported regions](regions.md)) and run a **latency test**. If there is variation in the numbers you see, give the results some time to stabilize.
   * **Minimum requirement** for Azure Remote Rendering: Latency should consistently be less than 100 ms.
   * **Recommended** for Azure Remote Rendering: Latency should consistently be less than 70 ms.

While low latency is not a guarantee that Azure Remote Rendering will work well on your network, we have usually seen it perform fine in situations where these tests passed successfully.
If you are encountering artifacts such as unstable, jittery, or jumping holograms when running Azure Remote Rendering, refer to the [troubleshooting guide](../resources/troubleshoot.md).

## Next steps

* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
