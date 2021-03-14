---
title: Coarse Relocalization
description: Learn about using Coarse relocalization to find anchors near you.
author: msftradford
manager: MehranAzimi-msft
services: azure-spatial-anchors

ms.author: parkerra
ms.date: 01/28/2021
ms.topic: conceptual
ms.service: azure-spatial-anchors
ms.custom: devx-track-csharp
---
# Coarse relocalization

Coarse relocalization is a feature that enables large-scale localization by providing an approximate but fast answer to the question: *Where is my device now / What content should I be observing?* The response isn't precise, but instead is in the form: *You're close to these anchors; try locating one of them*.

Coarse relocalization works by tagging anchors with various on-device sensor readings that are later used for fast querying. For outdoor scenarios, the sensor data is typically the GPS (Global Positioning System) position of the device. When GPS is not available or unreliable (such as indoors), the sensor data consists of the WiFi access points and Bluetooth beacons in range. The collected sensor data contributes to maintaining a spatial index used by Azure Spatial Anchors to quickly determine which anchors are in proximity of your device.

## When to use coarse relocalization

If you are planning to handle more than 35 spatial anchors in a space larger than a tennis court, you will likely benefit from coarse relocalization spatial indexing.

The fast look-up of anchors enabled by coarse relocalization is designed to simplify the development of applications backed by world-scale collections of (say, millions of geo-distributed) anchors. The complexity of spatial indexing is all hidden away, allowing you to focus on your application logic. All the anchor heavy-lifting is done for you behind the scenes by Azure Spatial Anchors.

## Using coarse relocalization

The typical workflow to create and query Azure Spatial Anchors with coarse relocalization is:
1.  Create and configure a sensor fingerprint provider to collect sensor data of your choice.
2.  Start an Azure Spatial Anchor Session and create anchors. Because sensor fingerprinting is enabled, the anchors are spatially indexed by coarse relocalization.
3.  Query surrounding anchors using coarse relocalization, using the dedicated search criteria in the Azure Spatial Anchor session.

You can refer to the corresponding following tutorial to set up coarse relocalization in your application:
* [Coarse Relocalization in Unity](../how-tos/set-up-coarse-reloc-unity.md)
* [Coarse Relocalization in Objective-C](../how-tos/set-up-coarse-reloc-objc.md)
* [Coarse Relocalization in Swift](../how-tos/set-up-coarse-reloc-swift.md)
* [Coarse Relocalization in Java](../how-tos/set-up-coarse-reloc-java.md)
* [Coarse Relocalization in C++/NDK](../how-tos/set-up-coarse-reloc-cpp-ndk.md)
* [Coarse Relocalization in C++/WinRT](../how-tos/set-up-coarse-reloc-cpp-winrt.md)

## Sensors and platforms

### Platform availability

The types of sensor data that you can send to the anchor service are:

* GPS position: latitude, longitude, altitude.
* Signal strength of WiFi access points in range.
* Signal strength of Bluetooth beacons in range.

The table below summarizes the availability of the sensor data on supported platforms, along with any platform-specific caveats:

|                 | HoloLens | Android | iOS |
|-----------------|----------|---------|-----|
| **GPS**         | NO<sup>1</sup>  | YES<sup>2</sup> | YES<sup>3</sup> |
| **WiFi**        | YES<sup>4</sup> | YES<sup>5</sup> | NO  |
| **BLE beacons** | YES<sup>6</sup> | YES<sup>6</sup> | YES<sup>6</sup>|


<sup>1</sup> An external GPS device can be associated with HoloLens. Contact [our support](../spatial-anchor-support.md) if you would be willing to use HoloLens with a GPS tracker.<br/>
<sup>2</sup> Supported through [LocationManager][3] APIs (both GPS and NETWORK)<br/>
<sup>3</sup> Supported through [CLLocationManager][4] APIs<br/>
<sup>4</sup> Supported at a rate of approximately one scan every 3 seconds <br/>
<sup>5</sup> Starting with API level 28, WiFi scans are throttled to 4 calls every 2 minutes. From Android 10, the throttling can be disabled from the Developer settings menu. For more information, see the [Android documentation][5].<br/>
<sup>6</sup> Limited to [Eddystone][1] and [iBeacon][2]

### Which sensor to enable

The choice of sensor is specific to the application you are developing and the platform.
The following diagram provides a starting point on which combination of sensors can be enabled depending on the localization scenario:

![Diagram of enabled sensors selection](media/coarse-relocalization-enabling-sensors.png)

The following sections give more insights on the advantages and limitations for each sensor type.

### GPS

GPS is the go-to option for outdoor scenarios.
When using GPS in your application, keep in mind that the readings provided by the hardware are typically:

* asynchronous and low frequency (less than 1 Hz).
* unreliable / noisy (on average 7-m standard deviation).

In general, both the device OS and Azure Spatial Anchors will do some filtering and extrapolation on the raw GPS signal in an attempt to mitigate these issues. This extra-processing requires time for convergence, so for best results you should try to:

* create one sensor fingerprint provider as early as possible in your application
* keep the sensor fingerprint provider alive between multiple sessions
* share the sensor fingerprint provider between multiple sessions

Consumer-grade GPS devices are typically imprecise. A study by [Zandenbergen and Barbeau (2011)][6] reports the median accuracy of mobile phones with assisted GPS (A-GPS) to be around 7 meters - quite a large value to be ignored! To account for these measurement errors, the service treats the anchors as probability distributions in GPS space. As such, an anchor is now the region of space that most likely (that is, with more than 95% confidence) contains its true, unknown GPS position.

The same reasoning is applied when querying with GPS. The device is represented as another spatial confidence region around its true, unknown GPS position. Discovering nearby anchors translates into simply finding the anchors with confidence regions *close enough* to the device's confidence region, as illustrated in the image below:

![Selection of anchor candidates with GPS](media/coarse-reloc-gps-separation-distance.png)

### WiFi

On HoloLens and Android, WiFi signal strength can be a good option to enable indoor coarse relocalization.
Its advantage is the potential immediate availability of WiFi access points (common in, e.g.,  office spaces or shopping malls) with no extra set-up needed.

> [!NOTE]
> iOS does not provide any API to read WiFi signal strength, and as such cannot be used for WiFi-enabled coarse relocalization.

When using WiFi in your application, keep in mind that the readings provided by the hardware are typically:

* asynchronous and low frequency (less than 0.1 Hz).
* potentially throttled at the OS level.
* unreliable / noisy (on average 3-dBm standard deviation).

Azure Spatial Anchors will attempt to build a filtered WiFi signal strength map during a session in an attempt to mitigate these issues. For best results you should try to:

* create the session well before placing the first anchor.
* keep the session alive for as long as possible (that is, create all anchors and query in one session).

### Bluetooth beacons
<a name="beaconsDetails"></a>

Carefully deploying bluetooth beacons is a good solution for large scale indoor coarse relocalization scenarios, where GPS is absent or inaccurate. It is also the only indoor method that is supported on all three platforms.

Beacons are typically versatile devices, where everything - including UUIDs and MAC addresses - can be configured. Azure Spatial Anchors expects beacons to be uniquely identified by their UUIDs. Failing to ensure this uniqueness will most likely cause incorrect results. For best results you should:

* assign unique UUIDs to your beacons.
* deploy them in a way that covers your space uniformly, and so that at least 3 beacons are reachable from any point in space.
* pass the list of unique beacon UUIDs to the sensor fingerprint provider

Radio signals such as bluetooth are affected by obstacles and can interfere with other radio signals. For these reasons it can be difficult to guess whether your space is uniformly covered. To guarantee a better customer experience we recommend that you manually test the coverage of your beacons. This can be done by walking around your space with candidate devices and an application showing bluetooth in range. While testing the coverage, make sure that you can reach at least 3 beacons from any strategic position of your space. Setting up too many beacons can result in more interference between them and will not necessarily improve coarse relocalization accuracy.

Bluetooth beacons typically have a coverage of 80 meters if no obstacles are present in the space.
This means that for a space that has no big obstacles, one could deploy beacons on a grid pattern every 40 meters.

A beacon running out of battery will affect the results negatively, so make sure you monitor your deployment periodically for low or dead batteries.

Azure Spatial Anchors will only track Bluetooth beacons that are in the known beacon proximity UUIDs list. Malicious beacons programmed to have allow-listed UUIDs can negatively impact the quality of the service though. For that reason, you will obtain best results in curated spaces where you can control their deployment.

### Sensors accuracy

The accuracy of the GPS signal, both on anchor creation as well as during queries, has a large influence over the set of returned anchors. In contrast, queries based on WiFi / beacons will consider all anchors that have at least one access point / beacon in common with the query. In that sense, the result of a query based on WiFi / beacons is mostly determined by the physical range of the access points / beacons, and environmental obstructions.
The table below estimates the expected search space for each sensor type:

| Sensor      | Search space radius (approx.) | Details |
|-------------|:-------:|---------|
| GPS         | 20 m - 30 m | Determined by the GPS uncertainty among other factors. The reported numbers are estimated for the median GPS accuracy of mobile phones with A-GPS, that is 7 meters. |
| WiFi        | 50 m - 100 m | Determined by the range of the wireless access points. Depends on the frequency, transmitter strength, physical obstructions, interference, and so on. |
| BLE beacons |  70 m | Determined by the range of the beacon. Depends on the frequency, transmission strength, physical obstructions, interference, and so on. |

<!-- Reference links in article -->
[1]: https://developers.google.com/beacons/eddystone
[2]: https://developer.apple.com/ibeacon/
[3]: https://developer.android.com/reference/android/location/LocationManager
[4]: https://developer.apple.com/documentation/corelocation/cllocationmanager?language=objc
[5]: https://developer.android.com/guide/topics/connectivity/wifi-scan
[6]: https://www.cambridge.org/core/journals/journal-of-navigation/article/positional-accuracy-of-assisted-gps-data-from-highsensitivity-gpsenabled-mobile-phones/E1EE20CD1A301C537BEE8EC66766B0A9
