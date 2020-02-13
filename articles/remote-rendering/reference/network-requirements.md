---
title: Network requirements
description: Network requirements and best network practices for optimal experience
author: FlorianBorn71
ms.author: flborn
ms.date: 02/13/2020
ms.topic: reference
---

# Network requirements
A stable, low-latency network connection to an Azure data center is critical for a good user experience in Azure Remote Rendering. Poor network conditions can result in dropped connections, unstable, jittery, or “jumping” holograms, and noticeable lag when updating the server-side scene graph.

## Guidelines for network connectivity
The exact network requirements depend on your specific use case, such as the number and frequency of modifications to the remote scene graph as well as the complexity of the rendered view, but there are a number of guidelines to ensure that your experience is as good as possible:

* Your internet connectivity needs to support at least **50 Mbps downstream** and **10 Mbps upstream** consistently, assuming there is no competing traffic on the network. We recommend higher rates for better experiences.
* Using the **5-GHz Wi-Fi band** will usually produce better results than the 2.4-GHz Wi-Fi band, though both should work.
* If there are other Wi-Fi networks nearby, avoid using Wi-Fi channels in use by these other networks. You can use a network scanning tools like [WifiInfoView](https://www.nirsoft.net/utils/wifi_information_view.html) to verify whether the channels your Wi-Fi network uses are free of competing traffic.
* Strictly **avoid using Wi-Fi repeaters** or LAN-over-powerline forwarding.
* **Avoid competing bandwidth-intense traffic** – such as video or game streaming – on the same Wi-Fi network
* Having **good Wi-Fi signal strength** is essential. If possible, stay close to your Wi-Fi access point and avoid obstacles between your client device and the access points. 
* Make sure that you always connect to the **nearest Azure data center** that is supported by Azure Remote Rendering. Usually, the closer the data center, the lower the network latency, which has a huge effect on hologram stability.

## Network performance tests without running Azure Remote Rendering
If you want to get an initial understanding of whether the quality of your network connectivity is sufficient to run Azure Remote Rendering, there are existing online tools that you can use. We strongly recommend running these online tools from a reasonably powerful laptop connected to the same Wi-Fi as the device that you are planning to run your Azure Remote Rendering client application on. Results obtained from running the tests on a mobile phone or HoloLens2 are usually less useful, as they have proven to show significant variation on low-powered endpoint devices. The location at which you place the laptop should be roughly at the same place at which you expect to use the device that runs your Azure Remote Rendering client application.
Here are a few simple steps for a quick test of your network connectivity:
1. **Run www.speedtest.net to get data on the overall latency and upstream/downstream bandwidth of your network connection.**
Let the tool pick a default server (usually that is the one closest to you) and run the test. While the server will not be the Azure data center that Azure Remote Rendering will connect to, the resulting data is still useful to understand the performance of your internet connection and Wi-Fi.
   * **Minimum requirement** for Azure Remote Rendering: 40 Mbps downstream and 5 Mbps upstream.
   * **Recommended** for Azure Remote Rendering: 100 Mbps downstream and 10 Mbps upstream.
We recommend running the test multiple times and taking the worst results.
1. **Use www.azurespeed.com to measure the latency to the nearest Azure data center.** Open the website and select the Azure data center supported by Azure Remote Rendering that is closest to you (see [supported regions](regions.md)). Select **“Latency Test”** and let the results stabilize for 30 seconds.
   * **Minimum requirement** for Azure Remote Rendering: Latency should consistently be less than 100 ms.
   * **Recommended** for Azure Remote Rendering: Latency should consistently be less than 70 ms.

While low latency is not a guarantee that Azure Remote Rendering will work well on your network, we have usually seen it perform fine in situations where these tests passed successfully.
If you are encountering artifacts such as unstable, jittery, or jumping holograms when running Azure Remote Rendering, please refer to the [Troubleshooting Guide](../resources/troubleshoot.md).
