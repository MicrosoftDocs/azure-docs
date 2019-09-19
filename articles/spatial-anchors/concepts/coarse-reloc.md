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

Azure Spatial Anchors can be configured to associate on-device, positioning sensor data with the anchors you create. For outdoor scenarios, the sensor data is typically the GPS position of the device. To account for cases where GPS is either not available or too unreliable (such as indoors), Azure Spatial Anchors also records the WiFi access points and Bluetooth beacons in range of an anchor. As a result, the service can index the anchors on their sensor data and quickly determine whether there are any anchors nearby your device. 

## Collected sensor data

Whenever possible, Azure Spatial Anchors will associate the following sensor data with every anchor:

* GPS position: latitude, longitude, altitude.
* Signal strength of WiFi access points in range.
* Signal strength of Bluetooth beacons in range.

In general, your application will need to acquire device-specific permissions to access GPS, WiFi, or BLE data. Additionally, some of the sensor data above isn't available by design on certain platforms. To account for these situations, the collection of sensor data is optional and is turned off by default.

## Set up the sensor data collection

Start by creating a sensor fingerprint provider and making the session aware of it:

```csharp
// Create the sensor fingerprint provider
sensorProvider = new FusedLocationProvider();

// Create and configure the session
cloudSpatialAnchorSession = new CloudSpatialAnchorSession();

// Inform the session it can access sensor data from your provider
cloudSpatialAnchorSession.LocationProvider = sensorProvider;
```

At this point, the session will attempt to associate sensor data with any anchors you create. However, as none of the sensors have been explicitly turned-on, your anchors won't have sensor data associated with them.

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

// Choose a maximum distance between your device and the returned anchor, i.e. anchor visibility radius
nearDeviceCriteria.DistanceInMeters = 5;

// Cap the number of anchors returned
nearDeviceCriteria.MaxResultCount = 25;

anchorLocateCriteria = new AnchorLocateCriteria();
anchorLocateCriteria.NearDevice = nearDeviceCriteria;
```

At the moment, DistanceInMeters only applies to GPS measurements. In addition to that, given that GPS readings come with quite a large measurement uncertainty, DistanceInMeters is only enforced probabilistically. Specifically, it will determine the service to prune-out anchors that have a 95% chance or more to be further away from the device than DistanceInMeters.
 
Keep in mind that higher values for either MaxResultCount or DistanceInMeters will negatively affect performance. Try to set them to sensible values that make sense for your application.

Finally, you'll need to tell the session to use the sensor-based look-up:

```csharp
cloudSpatialAnchorSession.CreateWatcher(anchorLocateCriteria);
```

## Expected results

The following table summarizes the expected search space for each of the sensors:

| Sensor      | Search space radius (approx.) | Details |
|-------------|:-------:|---------|
| GPS         | 20 m - 30 m | Determined by the GPS uncertainty and visibility radius among other factors. Reported numbers are estimated for a typical 7-m GPS standard deviation and 5-m visibility radius. |
| WiFi        | 50 m - 100 m | Determined by the range of the wireless access points. Depends on the frequency, transmitter strength, physical obstructions, interference, and so on. |
| BLE beacons |  70 m | Determined by the range of the beacon. Depends on the frequency, transmission strength, physical obstructions, interference, and so on. |


## Per-platform support

The following table summarizes the sensor data collected on each of the supported platforms, along with any platform-specific caveats:


|             | HoloLens | Android | iOS |
|-------------|----------|---------|-----|
| GPS         | N/A | Supported through [LocationManager](https://developer.android.com/reference/android/location/LocationManager) APIs (both GPS and NETWORK) | Supported through [CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager?language=objc) APIs |
| WiFi        | Supported at a rate of approximately one scan every 3 seconds | Supported. However from API level 28, WiFi scans are throttled to 4 calls every 2 minutes. From Android 10, the throttling can be disabled from the Developer settings menu. For more information, see the [Android documentation](https://developer.android.com/guide/topics/connectivity/wifi-scan). | N/A - no public API |
| BLE beacons | Limited to [Eddystone](https://developers.google.com/beacons/eddystone) and [iBeacon](https://developer.apple.com/ibeacon/) | Limited to [Eddystone](https://developers.google.com/beacons/eddystone) and [iBeacon](https://developer.apple.com/ibeacon/) | Limited to [Eddystone](https://developers.google.com/beacons/eddystone) and [iBeacon](https://developer.apple.com/ibeacon/) |
