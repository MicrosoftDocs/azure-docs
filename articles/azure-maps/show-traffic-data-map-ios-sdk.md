---
title: Show traffic data on iOS maps
titleSuffix: Microsoft Azure Maps
description: This article describes how to display traffic data on a map using the Microsoft Azure Maps iOS SDK.
author: dubiety
ms.author: yuchungchen 
ms.date: 07/21/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Show traffic data on the map in the iOS SDK (Preview)

Flow data and incidents data are the two types of traffic data that can be displayed on the map. This guide shows you how to display both types of traffic data. Incidents data consists of point and line-based data for things such as constructions, road closures, and accidents. Flow data shows metrics about the flow of traffic on the road.

## Prerequisites

Complete the [Create an iOS app] quickstart. Code blocks from this quickstart can be inserted into the `viewDidLoad` function of `ViewController`.

## Show traffic on the map

There are two types of traffic data available in Azure Maps:

- Incident data - consists of point and line-based data for things such as construction, road closures, and accidents.
- Flow data - provides metrics on the flow of traffic on the roads. Often, traffic flow data is used to color the roads. The colors are based on how much traffic is slowing down the flow, relative to the speed limit, or another metric. There are four values that can be passed into the traffic `flow` option of the map.

    |Flow enum           | Description                             |
    | :----------------- | :-------------------------------------- |
    | `TrafficFlow.none` | Doesn't display traffic data on the map |
    | `TrafficFlow.relative` | Shows traffic data that's relative to the free-flow speed of the road |
    | `TrafficFlow.relativeDelay` | Displays areas that are slower than the average expected delay |
    | `TrafficFlow.absolute` | Shows the absolute speed of all vehicles on the road |

The following code shows how to display traffic data on the map.

```swift
// Show traffic on the map using the traffic options.
map.setTrafficOptions([
    .incidents(true),
    .flow(.relative)
])
```

The following screenshot shows the above code rendering real-time traffic information on the map.

:::image type="content" source="./media/ios-sdk/show-traffic-data-map-ios/ios-show-traffic.png" alt-text="Map showing real-time traffic information.":::

## Get traffic incident details

Details about a traffic incident are available within the properties of the feature used to display the incident on the map. Traffic incidents are added to the map using the Azure Maps traffic incident vector tile service. The format of the data in these vector tiles can be found in the [Vector Incident Tiles] article on the TomTom site. The following code adds a delegate to the map. This delegate handles a click event, retrieves the traffic incident feature that was selected and displays an alert with some of the details.

```swift
// Show traffic information on the map.
map.setTrafficOptions([
    .incidents(true),
    .flow(.relative)
])

// Add the delegate to handle taps on traffic incidents only.
map.events.addDelegate(self, for: [.trafficIncidentLayerId])
```

```swift
extension ShowDetailedTrafficViewController: AzureMapDelegate {
    func azureMap(_ map: AzureMap, didTapOn features: [Feature]) {
        guard let feature = features.first else {
            // No features provided.
            return
        }

        // Get the incident's type based on icon_category_[idx] property.
        let iconCategoryKeys = ["icon_category"] + (0...9).map { "icon_category_\($0)" }
        let title = iconCategoryKeys
            .compactMap { feature.properties[$0] as? Int }
            .last
            .map { IncidentCategory(categoryNumber: $0).description }

        // Get the incident's description based on description_[idx] property.
        let descriptionKeys = ["description"] + (0...9).map { "description_\($0)" }
        let message = descriptionKeys
            .compactMap { feature.properties[$0] as? String }
            .last
            .map { $0.capitalized }

        // Show an alert with the details.
        let alert = UIAlertController(title: title ?? "Traffic Incident", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            alert.dismiss(animated: true)
        })
        present(alert, animated: true)
    }
}
```

The following screenshot shows the above code rendering real-time traffic information on the map with an alert displaying the incident details.

:::image type="content" source="./media/ios-sdk/show-traffic-data-map-ios/ios-traffic-details.png" alt-text="Map showing real-time traffic information with a toast message displaying incident details.":::

## Filter traffic incidents

On a typical day in most major cities, there can be an overwhelming number of traffic incidents, however, depending on your scenario, it may be desirable to filter and display a subset of these incidents. When setting traffic options, there are `incidentCategoryFilter` and `incidentMagnitudeFilter` options that take in an array of incident category or magnitude enumerators.

The following table shows all the traffic incident categories that can be used within the `incidentCategoryFilter` option.

| Category enum               | Description |
|-----------------------------|-------------|
| `IncidentCategory.unknown`  | An incident that either doesn't fit any of the defined categories or hasn't yet been classified. |
| `IncidentCategory.accident` | Traffic accident. |
| `IncidentCategory.fog`      | Fog that reduces visibility, likely reducing traffic flow, and possibly increasing the risk of an accident. |
| `IncidentCategory.dangerousConditions` | Dangerous situation on the road, such as an object on the road. |
| `IncidentCategory.rain` | Heavy rain that may be reducing visibility, making driving conditions difficult, and possibly increasing the risk of an accident. |
| `IncidentCategory.ice`      | Icy road conditions that may make driving difficult or dangerous. |
| `IncidentCategory.jam`      | Traffic jam resulting in slower moving traffic. |
| `IncidentCategory.laneClosed` | A road lane is closed. |
| `IncidentCategory.roadClosed` | A road is closed. |
| `IncidentCategory.roadWorks` | Road works/construction in this area. |
| `IncidentCategory.wind` | High winds that may make driving difficult for vehicles with a large side profile or high center of gravity. |
| `IncidentCategory.flooding` | Flooding occurring on road. |
| `IncidentCategory.detour` | Traffic being directed to take a detour. |
| `IncidentCategory.cluster` | A cluster of traffic incidents of different categories. Zooming in the map results in the cluster breaking apart into its individual incidents. |

The following table shows all the traffic incident magnitudes that can be used within the `incidentMagnitudeFilter` option.

| Magnitude enum     | Description |
|--------------------|-------------|
| `IncidentMagnitude.unknown` | An incident who's magnitude hasn't yet been classified. |
| `IncidentMagnitude.minor` | A minor traffic issue that is often just for information and has minimal impact to traffic flow. |
| `IncidentMagnitude.moderate` | A moderate traffic issue that has some impact on traffic flow. |
| `IncidentMagnitude.major` |  A major traffic issue that has a significant impact to traffic flow. |

The following filters traffic incidents such that only moderate traffic jams and incidents with dangerous conditions are displayed on the map.

```swift
map.setTrafficOptions([
    .incidents(true),
    .incidentMagnitudeFilter([.moderate]),
    .incidentCategoryFilter([.jam, .dangerousConditions])
])
```

The following screenshot shows a map of moderate traffic jams and incidents with dangerous conditions.

:::image type="content" source="./media/ios-sdk/show-traffic-data-map-ios/ios-traffic-incident-filters.png" alt-text="Map of moderate traffic jams and incidents with dangerous conditions.":::

> [!NOTE]
> Some traffic incidents may have multiple categories assigned to them. If an incident has any category that matches any option passed into `incidentCategoryFilter`, it will be displayed. The primary incident category may be different from the categories specified in the filter and thus display a different icon.

## Additional information

The following articles describe different ways to add data to your map:

- [Add a tile layer]
- [Add a symbol layer]
- [Add a bubble layer]
- [Add a line layer]
- [Add a polygon layer]

[Add a bubble layer]: add-bubble-layer-map-ios.md
[Add a line layer]: add-line-layer-map-ios.md
[Add a polygon layer]: add-polygon-layer-map-ios.md
[Add a symbol layer]: add-symbol-layer-ios.md
[Add a tile layer]: add-tile-layer-map-ios.md
[Create an iOS app]: quick-ios-app.md
[Vector Incident Tiles]: https://developer.tomtom.com/traffic-api/traffic-api-documentation-traffic-incidents/vector-incident-tiles
