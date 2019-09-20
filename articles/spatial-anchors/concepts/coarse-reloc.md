---
title: Coarse Relocalization | Microsoft Docs
description: Coarse relocalization quickstart guide.  
author: bucurb
manager: dacoghl
services: azure-spatial-anchors

ms.author: bobuc
ms.date: 09/18/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Coarse relocalization

Coarse relocalization is a feature that provides an initial answer to the question: *Where is my device now / What content should I be observing?* The response is not precise, but instead is in the form: *You are close to these anchors, try locating one of them*.

Coarse relocalization works by associating various on-device sensor readings with both the creation and the querying of anchors. For outdoor scenarios, the sensor data is typically the GPS position of the device. When GPS is not available or unreliable (such as indoors), the sensor data consists in the WiFi access points and Bluetooth beacons in range. All collected sensor data contributes to maintaining a spatial index. The spatial index is leveraged by the anchor service to quickly determine the anchors that are within approximately 100 meters of your device. 

The fast look-up of anchors enabled by coarse relocalization simplifies the development of applications backed by world-scale collections of (say millions of geo-distributed) anchors. The complexity of anchor management is all hidden away, allowing you to focus more on your awesome application logic. All the anchor heavy-lifting is done for you behind the scenes by the service!

## Collected sensor data

The sensor data you can send to the anchor service is one of the following:

* GPS position: latitude, longitude, altitude.
* Signal strength of WiFi access points in range.
* Signal strength of Bluetooth beacons in range.

In general, your application will need to acquire device-specific permissions to access GPS, WiFi, or BLE data. Additionally, some of the sensor data above isn't available by design on certain platforms. To account for these situations, the collection of sensor data is optional and is turned off by default.

## Set up the sensor data collection

Let's start by creating a sensor fingerprint provider and making the session aware of it:

```csharp
// Create the sensor fingerprint provider
sensorProvider = new FusedLocationProvider();

// Create and configure the session
cloudSpatialAnchorSession = new CloudSpatialAnchorSession();

// Inform the session it can access sensor data from your provider
cloudSpatialAnchorSession.LocationProvider = sensorProvider;
```

Next, you'll need to decide which sensors you'd like to use for coarse relocalization. This decision is, in general, specific to the application you are developing, but the recommendations in the following table should give you a good starting point:


|             | Indoors | Outdoors |
|-------------|---------|----------|
| GPS         | Off | On |
| WiFi        | On | On (optional) |
| BLE beacons | On (optional with caveats, see below) | Off |


### Enabling GPS

Assuming your application already has permission to access the device's GPS position, you can configure Azure Spatial Anchors to use it:

```csharp
sensorProvider.Sensors.GeoLocationEnabled = true;
```

When using GPS in your application, keep in mind that the readings provided by the hardware are typically:

* asynchronous and low frequency (less than 1 Hz).
* unreliable / noisy (on average 7-m standard deviation).

In general, both the device OS and Azure Spatial Anchors will do some filtering and extrapolation on the raw GPS signal in an attempt to mitigate these issues. This extra-processing requires additional time for convergence, so for best results you should try to:

* create the sensor fingerprint provider as early as possible in your application
* keep the sensor fingerprint provider alive and share between multiple sessions

### Enabling WiFi

Assuming your application already has permission to access the device's WiFi state, you can configure Azure Spatial Anchors to use it:

```csharp
sensorProvider.Sensors.WifiEnabled = true;
```

When using WiFi in your application, keep in mind that the readings provided by the hardware are typically:

* asynchronous and low frequency (less than 0.1 Hz).
* potentially throttled at the OS level.
* unreliable / noisy (on average 3-dBm standard deviation).

Azure Spatial Anchors will attempt to build a filtered WiFi signal strength map during a session in an attempt to mitigate these issues. For best results you should try to:

* create the session well before placing the first anchor.
* keep the session alive for as long as possible (that is, create all anchors and query in one session).

### Enabling Bluetooth beacons

Assuming your application already has permission to access the device's Bluetooth state, you can configure Azure Spatial Anchors to use it:

```csharp
sensorProvider.Sensors.BluetoothEnabled = true;
```

Beacons are typically versatile devices, where everything - including UUIDs and MAC addresses - can be configured. This flexibility can be problematic for Azure Spatial Anchors that considers beacons to be uniquely identified by their UUIDs. Failing to ensure this uniqueness will most-likely translate into spatial wormholes. For best results you should:

* assign unique UUIDs to your beacons.
* deploy them - typically in a regular pattern, such as a grid.
* pass the list of unique beacon UUIDs to the sensor fingerprint provider:


```csharp
sensorProvider.Sensors.KnownBeaconProximityUuids = new[]
{
    "22e38f1a-c1b3-452b-b5ce-fdb0f39535c1",
    "a63819b9-8b7b-436d-88ec-ea5d8db2acb0",
    . . .
};
```

Azure Spatial Anchors will only track Bluetooth beacons that are on the list. However, malicious beacons that have been programmed to have white-listed UUIDs can still negatively impact the quality of the service. For that reason, you should only use beacons in curated spaces where you can control the deployed beacons.

## Querying with sensor data

Once you have created anchors with associated sensor data, you can start retrieving them using the sensor readings reported by your device. You're no longer required to provide the service with a list of known anchors you're expecting to find - instead you just let the service know the location of your device as reported by its onboard sensors. The Spatial Anchors service will then figure-out the set of anchors close to your device and attempt to visually match them.

To have queries use the sensor data, start by creating a locate criteria:

```csharp
NearDeviceCriteria nearDeviceCriteria = new NearDeviceCriteria();

// Choose a maximum exploration distance between your device and the returned anchors
nearDeviceCriteria.DistanceInMeters = 5;

// Cap the number of anchors returned
nearDeviceCriteria.MaxResultCount = 25;

anchorLocateCriteria = new AnchorLocateCriteria();
anchorLocateCriteria.NearDevice = nearDeviceCriteria;
```

The `DistanceInMeters` parameter controls how far we'll explore the anchor graph to retrieve content. Assume for instance that you have populated some space with anchors at a constant density of 2 every meter. Furthermore, the camera on your device is  observing a single anchor and the service has successfully localized it. You are most likely interested in retrieving all the anchors you have placed nearby rather than the single anchor your are currently observing. Assuming the anchors you have placed are connected in a graph, the service can retrieve all the nearby anchors for you by following the edges in the graph. The amount of graph traversal done is controlled by `DistanceInMeters`; you will be given all the anchors connected to the one you have localized, that are closer than `DistanceInMeters`.
 
Keep in mind that large values for `MaxResultCount` may negatively affect performance. Try to set it to a sensible value that makes sense for your application.

Finally, you'll need to tell the session to use the sensor-based look-up:

```csharp
cloudSpatialAnchorSession.CreateWatcher(anchorLocateCriteria);
```

## Expected results

The following table summarizes the expected search space for each of the sensors:

| Sensor      | Search space radius (approx.) | Details |
|-------------|:-------:|---------|
| GPS         | 20 m - 30 m | Determined by the GPS uncertainty and visibility radius among other factors. The reported numbers are estimated for the median GPS accuracy of mobile phones with assisted GPS (A-GPS), which is around 7 meters according to the study by [Zandenbergen and Barbeau (2011)][6]. |
| WiFi        | 50 m - 100 m | Determined by the range of the wireless access points. Depends on the frequency, transmitter strength, physical obstructions, interference, and so on. |
| BLE beacons |  70 m | Determined by the range of the beacon. Depends on the frequency, transmission strength, physical obstructions, interference, and so on. |

## Per-platform support

The following table summarizes the sensor data collected on each of the supported platforms, along with any platform-specific caveats:


|             | HoloLens | Android | iOS |
|-------------|----------|---------|-----|
| GPS         | N/A | Supported through [LocationManager][3] APIs (both GPS and NETWORK) | Supported through [CLLocationManager][4] APIs |
| WiFi        | Supported at a rate of approximately one scan every 3 seconds | Supported. However from API level 28, WiFi scans are throttled to 4 calls every 2 minutes. From Android 10, the throttling can be disabled from the Developer settings menu. For more information, see the [Android documentation][5]. | N/A - no public API |
| BLE beacons | Limited to [Eddystone][1] and [iBeacon][2] | Limited to [Eddystone][1] and [iBeacon][2] | Limited to [Eddystone][1] and [iBeacon][2] |

<!-- Footnotes -->

<b id="f1">1.</b> T is around  ()

<!-- Reference links in article -->
[1]: https://developers.google.com/beacons/eddystone
[2]: https://developer.apple.com/ibeacon/
[3]: https://developer.android.com/reference/android/location/LocationManager
[4]: https://developer.apple.com/documentation/corelocation/cllocationmanager?language=objc
[5]: https://developer.android.com/guide/topics/connectivity/wifi-scan
[6]: https://www.cambridge.org/core/journals/journal-of-navigation/article/positional-accuracy-of-assisted-gps-data-from-highsensitivity-gpsenabled-mobile-phones/E1EE20CD1A301C537BEE8EC66766B0A9