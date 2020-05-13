---
title: Clustering point data on a map | Microsoft Azure Maps
description: In this article, you'll learn how to cluster point data and render it on a map using the Microsoft Azure Maps Web SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
ms.custom: codepen
---

# Clustering point data

When visualizing many data points on the map, data points may overlap over each other. The overlap may cause the map may become unreadable and difficult to use. Clustering point data is the process of combining point data that are near each other and representing them on the map as a single clustered data point. As the user zooms into the map, the clusters break apart into their individual data points. When you work with large number of data points, use the clustering processes to improve your user experience.

<br/>

<iframe src="https://channel9.msdn.com/Shows/Internet-of-Things-Show/Clustering-point-data-in-Azure-Maps/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Enabling clustering on a data source

Enable clustering in the `DataSource` class by setting the `cluster` option to true. Set `ClusterRadius` to selects nearby points and combines them into a cluster. The value of `ClusterRadius` is in pixels. Use `clusterMaxZoom` to Specify a zoom level at which to disable the clustering logic. Here is an example of how to enable clustering in a data source.

```javascript
//Create a data source and enable clustering.
var datasource = new atlas.source.DataSource(null, {
	//Tell the data source to cluster point data.
	cluster: true,

	//The radius in pixels to cluster points together.
	clusterRadius: 45,

	//The maximum zoom level in which clustering occurs.
	//If you zoom in more than this, all points are rendered as symbols.
	clusterMaxZoom: 15
});
```

> [!TIP]
> If two data points are close together on the ground, it's possible the cluster will never break apart, no matter how close the user zooms in. To address this, you can set the `clusterMaxZoom` option to disable the clustering logic and simply display everything.

Here are additional methods that the `DataSource` class provides for clustering:

| Method | Return type | Description |
|--------|-------------|-------------|
| getClusterChildren(clusterId: number) | Promise&lt;Array&lt;Feature&lt;Geometry, any&gt; \| Shape&gt;&gt; | Retrieves the children of the given cluster on the next zoom level. These children may be a combination of shapes and subclusters. The subclusters will be features with properties matching ClusteredProperties. |
| getClusterExpansionZoom(clusterId: number) | Promise&lt;number&gt; | Calculates a zoom level at which the cluster will start expanding or break apart. |
| getClusterLeaves(clusterId: number, limit: number, offset: number) | Promise&lt;Array&lt;Feature&lt;Geometry, any&gt; \| Shape&gt;&gt; | Retrieves all points in a cluster. Set the `limit` to return a subset of the points, and use the `offset` to page through the points. |

## Display clusters using a bubble layer

A bubble layer is a great way to render clustered points. Use expressions to scale the radius and change the color based on the number of points in the cluster. If you display clusters using a bubble layer, then you should use a separate layer to render unclustered data points.

To display the size of the cluster on top of the bubble, use a symbol layer with text, and don't use an icon.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Basic bubble layer clustering" src="//codepen.io/azuremaps/embed/qvzRZY/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/qvzRZY/'>Basic bubble layer clustering</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Display clusters using a symbol layer

When visualizing data points, the symbol layer automatically hides symbols that overlap each other to ensure a cleaner user interface. This default behavior might be undesirable if you want to show the data points density on the map. However, these settings can be changed. To display all symbols, set the `allowOverlap` option of the Symbol layers `iconOptions` property to `true`. 

Use clustering to show the data points density while keeping a clean user interface. The sample below shows you how to add custom symbols and represent clusters and individual data points using the symbol layer.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Clustered Symbol layer" src="//codepen.io/azuremaps/embed/Wmqpzz/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/Wmqpzz/'>Clustered Symbol layer</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Clustering and the heat maps layer

Heat maps are a great way to display the density of data on the map. This visualization method can handle a large number of data points on its own. If the data points are clustered and the cluster size is used as the weight of the heat map, then the heat map can handle even more data. To achieve this option, set the `weight` option of the heat map layer to `['get', 'point_count']`. When the cluster radius is small, the heat map will look nearly identical to a heat map using the unclustered data points, but it will perform much better. However, the smaller the cluster radius, the more accurate the heat map will be, but with fewer performance benefits.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Cluster weighted Heat Map" src="//codepen.io/azuremaps/embed/VRJrgO/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/VRJrgO/'>Cluster weighted Heat Map</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Mouse events on clustered data points

When mouse events occur on a layer that contains clustered data points, the clustered data point return to the event as a GeoJSON point feature object. This point feature will have the following properties:

| Property name             | Type    | Description   |
|---------------------------|---------|---------------|
| `cluster`                 | boolean | Indicates if feature represents a cluster. |
| `cluster_id`              | string  | A unique ID for the cluster that can be used with the DataSource `getClusterExpansionZoom`, `getClusterChildren`, and `getClusterLeaves` methods. |
| `point_count`             | number  | The number of points the cluster contains.  |
| `point_count_abbreviated` | string  | A string that abbreviates the `point_count` value if it's long. (for example, 4,000 becomes 4K)  |

This example takes a bubble layer that renders cluster points and adds a click event. When the click event triggers, the code calculates and zooms the map to the next zoom level, at which the cluster breaks apart. This functionality is implemented using the `getClusterExpansionZoom` method of the `DataSource` class and the `cluster_id` property of the clicked clustered data point.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Cluster getClusterExpansionZoom" src="//codepen.io/azuremaps/embed/moZWeV/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/moZWeV/'>Cluster getClusterExpansionZoom</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Display cluster area 

The point data that a cluster represents is spread over an area. In this sample when the mouse is hovered over a cluster, two main behaviors occur. First, the individual data points contained in the cluster will be used to calculate a convex hull. Then, the convex hull will be displayed on the map to show an area.  A convex hull is a polygon that wraps a set of points like an elastic band and can be calculated using the `atlas.math.getConvexHull` method. All points contained in a cluster can be retrieved from the data source using the `getClusterLeaves` method.

<br/>

 <iframe height="500" style="width: 100%;" scrolling="no" title="Cluster area convex hull" src="//codepen.io/azuremaps/embed/QoXqWJ/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/QoXqWJ/'>Cluster area convex hull</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Aggregating data in clusters

Often clusters are represented using a symbol with the number of points that are within the cluster. But, sometimes it's desirable to customize the style of clusters with additional metrics. With cluster aggregates, custom properties can be created and populated using an [aggregate expression](data-driven-style-expressions-web-sdk.md#aggregate-expression) calculation.  Cluster aggregates can be defined in `clusterProperties` option of the `DataSource`.

The following sample uses an aggregate expression. The code calculates a count based on the entity type property of each data point in a cluster. When a user clicks on a cluster, a popup shows with additional information about the cluster.

<iframe height="500" style="width: 100%;" scrolling="no" title="Cluster aggregates" src="//codepen.io/azuremaps/embed/jgYyRL/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/jgYyRL/'>Cluster aggregates</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [DataSource class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [DataSourceOptions object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.datasourceoptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [atlas.math namespace](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.math?view=azure-iot-typescript-latest)

See code examples to add functionality to your app:

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add a symbol layer](map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a heat map layer](map-add-heat-map-layer.md)
