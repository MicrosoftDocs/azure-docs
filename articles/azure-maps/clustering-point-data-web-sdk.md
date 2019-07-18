---
title: Clustering point data in Azure Maps | Microsoft Docs
description: How to cluster point data in the Web SDK
author: rbrundritt
ms.author: richbrun
ms.date: 03/27/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendleton
ms.custom: codepen
---

# Clustering point data

When visualizing many data points on the map, points overlap each other, the map looks cluttered and it becomes difficult to see and use. Clustering of point data can be used to improve this user experience. Clustering point data is the process of combining point data that are near each other and representing them on the map as a single clustered data point. As the user zooms into the map, the clusters break apart into their individual data points.

## Enabling clustering on a data source

Clustering can easily be enabled on the `DataSource` class by setting the `cluster` option to true. Additionally, the pixel radius to select nearby points to combine into a cluster can be set using the `clusterRadius` and a zoom level can be specified at which to disable the clustering logic using the `clusterMaxZoom` option. Here is an example of how to enable clustering in a data source.

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
> If two data points are close together on the ground, it is possible the cluster will never break apart, no matter how close the user zooms in. To address this, you can set the `clusterMaxZoom` option of the data source which specifies at the zoom level to disable the clustering logic and simply display everything.

The `DataSource` class also has the following methods related to clustering:

| Method | Return type | Description |
|--------|-------------|-------------|
| getClusterChildren(clusterId: number) | Promise&lt;Array&lt;Feature&lt;Geometry, any&gt; \| Shape&gt;&gt; | Retrieves the children of the given cluster on the next zoom level. These children may be a combination of shapes and subclusters. The subclusters will be features with properties matching ClusteredProperties. |
| getClusterExpansionZoom(clusterId: number) | Promise&lt;number&gt; | Calculates a zoom level at which the cluster will start expanding or break apart. |
| getClusterLeaves(clusterId: number, limit: number, offset: number) | Promise&lt;Array&lt;Feature&lt;Geometry, any&gt; \| Shape&gt;&gt; | Retrieves all points in a cluster. Set the `limit` to return a subset of the points, and use the `offset` to page through the points. |

## Display clusters using a bubble layer

A bubble layer is a great way to render clustered points as you can easily scale the radius and change the color them based on the number of points in the cluster by using an expression. When displaying clusters using a bubble layer, you should also use a separate layer for rendering unclustered data points. It is often nice to also be able to display the size of the cluster on top of the bubbles. A symbol layer with text and no icon can be used to achieve this behavior. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Basic bubble layer clustering" src="//codepen.io/azuremaps/embed/qvzRZY/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/qvzRZY/'>Basic bubble layer clustering</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Display clusters using a symbol layer

When visualizing the point data using the Symbol layer, by default it will automatically hide symbols that overlap each other to create a cleaner experience, however this may not be the desired experience if you want to see the density of data points on the map. Setting the `allowOverlap` option of the Symbol layers `iconOptions` property to `true` disables this experience but will result in all the symbols being displayed. Using clustering allows you to see the density of all the data while creating a nice clean user experience. In this sample, custom symbols will be used to represent clusters and individual data points.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Clustered Symbol layer" src="//codepen.io/azuremaps/embed/Wmqpzz/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/Wmqpzz/'>Clustered Symbol layer</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Clustering and the heat maps layer

Heat maps are a great way to display the density of data on the map. This visualization can handle a large number of data points on its own, but it can handle even more data if the data points are clustered and the cluster size is used as the weight of the heat map. Set the `weight` option of the heat map layer to `['get', 'point_count']` to achieve this. When the cluster radius is small, the heat map will look nearly identical to a heat map using the unclustered data points but will perform much better. However, the smaller the cluster radius, the more accurate the heat map will be but with less of a performance benefit.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Cluster weighted Heat Map" src="//codepen.io/azuremaps/embed/VRJrgO/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/VRJrgO/'>Cluster weighted Heat Map</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Mouse events on clustered data points

When mouse events occur on a layer that contain clustered data points, the clustered data point will be returned to the event as a GeoJSON point feature object. This point feature will have the following properties:

| Property name | Type | Description |
|---------------|------|-------------|
| cluster | boolean | Indicates if feature represents a cluster. |
| cluster_id | string | A unique ID for the cluster that can be used with the DataSource `getClusterExpansionZoom`, `getClusterChildren`, and `getClusterLeaves` methods. |
| point_count | number | The number of points the cluster contains. |
| point_count_abbreviated | string | A string that abbreviates the `point_count` value if it is long. (for example, 4,000 becomes 4K) |

This example takes a bubble layer that renders cluster points and adds a click event that when triggered, calculate, and zoom the map to the next zoom level at which the cluster will break apart using the `getClusterExpansionZoom` method of the `DataSource` class and the `cluster_id` property of the clicked clustered data point. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Cluster getClusterExpansionZoom" src="//codepen.io/azuremaps/embed/moZWeV/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/moZWeV/'>Cluster getClusterExpansionZoom</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Display cluster area 

The point data that a cluster represents is spread over an area. In this sample when the mouse is hovered over a cluster, the individual data points it contains (leaves) will be used to calculate a convex hull and displayed on the map to show the area. All points contained in a cluster can be retrieved from the data source using the `getClusterLeaves` method. A convex hull is a polygon that wraps a set of points like an elastic band and can be calculated using the `atlas.math.getConvexHull` method.

<br/>

 <iframe height="500" style="width: 100%;" scrolling="no" title="Cluster area convex hull" src="//codepen.io/azuremaps/embed/QoXqWJ/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/QoXqWJ/'>Cluster area convex hull</a> by Azure Maps
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
