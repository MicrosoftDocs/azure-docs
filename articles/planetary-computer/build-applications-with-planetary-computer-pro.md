---
title: PLACEHOLDER Build and Use Applications with Microsoft Planetary Computer Pro
description: "Learn the basics of how to connect Microsoft Planetary Computer Pro (MPC Pro) to applications or build your application on top of MPC Pro's API services."
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: concept-article #Don't change.
ms.date: 04/29/2025

#customer intent: As a developer, I want to understand how to build applications that integrate with Microsoft Planetary Computer Pro so that I can create solutions leveraging geospatial data at scale.

---

# PLACEHOLDER Building applications with Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro (MPC Pro) offers powerful APIs and services that enable developers to build applications that can access, analyze, and visualize large-scale geospatial datasets. This article provides an overview of the application development options available with MPC Pro and key concepts for integrating with its services.

## Prerequisites

- Azure account with an active subscription
- Access to a Microsoft Planetary Computer Pro [GeoCatalog resource](./deploy-geocatalog-resource.md)
- Basic understanding of geospatial data concepts and [STAC specification](./stac-overview.md)
- Development experience with Python, JavaScript, or other programming languages

## Application integration approaches

MPC Pro supports multiple integration approaches depending on your application's requirements. You can build applications that access MPC Pro's data and services in several ways:

### Direct API integration

The primary way to integrate with MPC Pro is through its REST APIs. MPC Pro provides a comprehensive set of APIs that conform to the STAC API specification, allowing you to:

- Search and discover geospatial datasets
- Access metadata about collections and items
- Retrieve and visualize raster and vector data
- Process geospatial data at scale

These APIs support standard authentication mechanisms including Microsoft Entra ID, enabling secure access to your resources.

### Client libraries and SDKs

MPC Pro offers client libraries and SDKs for popular programming languages, simplifying the integration process:

- **Python SDK**: Provides high-level interfaces for searching, accessing, and processing geospatial data
- **JavaScript Library**: Enables web applications to interact with MPC Pro services
- **REST API Clients**: Auto-generated clients for various languages based on OpenAPI specifications

These libraries abstract away many complexities of working with the underlying APIs, allowing you to focus on building your application logic.

### GIS application connectivity

MPC Pro integrates with popular Geographic Information System (GIS) applications, including:

- **ArcGIS Pro**: Connect directly to MPC Pro from ESRI's professional desktop GIS application
- **QGIS**: Access MPC Pro collections through QGIS plugins
- **Web-based mapping libraries**: Integrate with Leaflet, Mapbox GL, or OpenLayers

For specific integration guidance with ArcGIS Pro, see [Connect ArcGIS Pro to Microsoft Planetary Computer Pro](./create-connection-arcgispro.md).

## Authentication and authorization

All applications that interact with MPC Pro must authenticate properly. MPC Pro uses Microsoft Entra ID (formerly Azure AD) for authentication and Role-Based Access Control (RBAC) for authorization.

### Authentication options

- **User authentication**: For applications that operate on behalf of a signed-in user
- **Service principal**: For daemon or service-to-service scenarios
- **Managed identities**: For applications running on Azure services

The recommended approach depends on your application scenario:

- For web applications with user interactions, implement user authentication
- For background services or API-to-API communications, use service principals or managed identities

For detailed authentication guidance, see [Set up application authentication for MPC Pro](./application-authentication.md).

## Data access patterns

When building applications with MPC Pro, consider these common data access patterns:

### Search and discovery

Applications typically need to search for relevant data before processing it. The STAC API enables powerful search capabilities:

```python
# Example of searching for Landsat imagery
from planetary_computer import api

# Search for Landsat imagery over Seattle from 2022
items = api.search(
    collections=["landsat-c2-l2"],
    bbox=[-122.33, 47.5, -122.0, 47.75],
    datetime="2022-01-01/2022-12-31",
    query={"eo:cloud_cover": {"lt": 20}}
)
```

### Data visualization

Many applications need to visualize geospatial data on maps. MPC Pro provides tile services that enable efficient rendering:

```javascript
// Example of adding an MPC Pro layer to a web map
import { Map } from 'maplibre-gl';

const map = new Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [-122.33, 47.61],
  zoom: 11
});

// Add MPC Pro tile layer
map.on('load', () => {
  map.addSource('landsat', {
    type: 'raster',
    tiles: [
      'https://your-geocatalog.geocatalog.eastus.azureplanetary.microsoft.com/collections/landsat-c2-l2/items/{item_id}/tiles/{z}/{x}/{y}'
    ],
    tileSize: 256
  });
  
  map.addLayer({
    id: 'landsat-layer',
    type: 'raster',
    source: 'landsat',
    paint: {}
  });
});
```

### Analysis and processing

MPC Pro enables processing of geospatial data at scale:

- **Cloud-optimized data formats**: Access data efficiently using Cloud-Optimized GeoTIFFs (COGs), GeoParquet, and more
- **Distributed computing**: Process large datasets using Azure's computational resources
- **Raster and vector operations**: Perform common geospatial operations on both raster and vector data

## Application patterns and examples

Here are some common application patterns built on MPC Pro:

### Web mapping application

Create interactive web maps that visualize geospatial data from MPC Pro:

1. Implement user authentication using Microsoft Entra ID
2. Use MPC Pro's search API to find relevant data
3. Visualize data using tile services and web mapping libraries
4. Enable interactive analysis through client-side or server-side processing

### Data processing pipeline

Build automated workflows that process geospatial data:

1. Use MPC Pro APIs to search for and identify new data
2. Process data using Azure compute services
3. Store results back in MPC Pro or other data stores
4. Trigger notifications or additional workflows based on processing results

### Mobile field collection application

Create mobile apps that combine MPC Pro data with field-collected information:

1. Cache relevant MPC Pro data for offline use
2. Collect field observations with geolocation
3. Synchronize and merge field data with MPC Pro datasets
4. Perform analysis that combines multiple data sources

## Best practices

When building applications with MPC Pro, consider these best practices:

- **Optimize data access**: Use filtering and spatial queries to limit data retrieval to what's needed
- **Implement caching**: Cache frequently accessed data to improve performance
- **Consider scale**: Design for the volume of data you'll be processing
- **Handle authentication properly**: Securely manage tokens and implement token refresh
- **Implement error handling**: Account for network issues and API rate limits

## Related content

- [STAC specification overview](./stac-overview.md)
- [Connect ArcGIS Pro to Microsoft Planetary Computer Pro](./create-connection-arcgispro.md)
- [Manage access to Microsoft Planetary Computer Pro](./manage-access.md)
- [Deploy a GeoCatalog resource](./deploy-geocatalog-resource.md)