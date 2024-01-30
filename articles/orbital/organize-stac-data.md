---
title: Organize spaceborne geospatial data with STAC - Azure Orbital Analytics
description: Create an implementation of SpatioTemporal Asset Catalog (STAC) creation to structure geospatial data.
author: taiyee
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 09/29/2022
ms.author: taiyee
---

# Organize spaceborne geospatial data with SpatioTemporal Asset Catalog (STAC)

This reference architecture shows an end-to-end implementation of [SpatioTemporal Asset Catalog (STAC)](https://stacspec.org) creation to structure geospatial data. In this document, we'll use the publicly available [National Agriculture Imagery Program (NAIP)](https://catalog.data.gov/dataset/national-agriculture-imagery-program-naip) data set using geospatial libraries on Azure. The architecture can be adapted to take data sets from other sources such as Satellite imagery providers, [Azure Orbital Ground Station (AOGS)](https://azure.microsoft.com/products/orbital/), or Bring Your Own Data (BYOD).

The implementation consists of four stages: Data acquisition, Metadata generation, Cataloging, and Data discovery via [STAC FastAPI](https://github.com/stac-utils/stac-fastapi). This article also shows how to build STAC based on a new data source or on bring-your-own-data. 

An implementation of this architecture is available on [GitHub](https://github.com/Azure/Azure-Orbital-STAC).

This article is intended for users with intermediate levels of skill in working with spaceborne geospatial data. Refer to the table in the [glossary](#glossary) for the definition of commonly used STAC terms. For more details visit the official [stacspec](https://stacspec.org/en) page.

## Scenario details

Spaceborne data collection is becoming increasingly common. There are various data providers of spatiotemporal assets such as Imagery, Synthetic Aperture Radar (SAR), Point Clouds, and so forth. Data providers don't have a standard way of providing users access to their spatiotemporal data. Users of spatiotemporal data are often burdened with building unique workflows for each different collection of data they want to consume. Developers are required to develop new tools and libraries to interact with the spatiotemporal data.

The STAC community has defined a specification to remove these complexities and spur common tooling. The STAC specification is a common language to describe geospatial information, so it can more easily be worked with, indexed, and discovered. There are many deployed products that are built on top of STAC and one such is [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/docs/overview/about) providing a multi-petabyte STAC catalog of global environmental data for sustainability research.

Our [sample solution](https://github.com/Azure/Azure-Orbital-STAC) uses open source tools such as STAC FastAPI, [pystac](https://github.com/stac-utils/pystac), [Microsoft Planetary Computer APIs](https://github.com/microsoft/planetary-computer-apis) and open standard geospatial libraries (listed in the [Components](#components) section) to run the solution on Azure.


### Potential use cases

STAC has become an industry standard to support how geospatial data should be structured and queried. It has been used in many production deployments for various use cases.

Here are a couple of examples:

- A satellite data provider company needs to make their data easy to discover and access. The provider builds STAC Catalogs to index all of its historic archive data sets and also the incoming refresh data on a daily basis. A web client UI is built on top of STAC APIs that allows users to browse the catalogs and search for their desired images based on the area of interest (AOI), date/time range, and other parameters.

- A geospatial data analysis company needs to build a database of spaceborne data including imagery, Digital Elevation Model (DEM), and 3D types that it has acquired from various data sources. The database will serve its geographic information system (GIS) analysis solution to aggregate different data sets for machine learning model-based object detection analysis. To support a standard data access layer, the company decides to implement an open source compatible STAC API interface for the GIS analysis solution to interact with the database in a scalable and performing way.


## Architecture

:::image type="content" source="media/stac-architecture.png" alt-text="Diagram of STAC architecture." lightbox="media/stac-architecture.png":::

Download a [Visio file](https://download.microsoft.com/download/5/6/4/564196b7-dd01-468a-af21-1da16489f298/stac_arch.vsdx) for this architecture.

### Dataflow 

:::image type="content" source="media/stac-data-flow.png" alt-text="STAC dataflow diagram." lightbox="media/stac-data-flow.png":::

Download a [Visio file](https://download.microsoft.com/download/5/6/4/564196b7-dd01-468a-af21-1da16489f298/stac_data_flow.vsdx) for this dataflow.

The following sections describe the four stages in the architecture.

**Data acquisition**

- Spaceborne data is provided by various data providers including [Airbus](https://oneatlas.airbus.com/home), [NAIP/USDA (via the Planetary Computer API)](https://planetarycomputer.microsoft.com/dataset/naip), and [Maxar](https://www.maxar.com). 
- In the sample solution we use the NAIP dataset provided by [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/docs/overview/about).

**Metadata generation**

- Data providers define the metadata describing provider, license terms, keywords, etc. This metadata forms the STAC Collection.
- Data providers may provide metadata describing the geospatial assets. In our sample, we use metadata provided by [NAIP](https://www.usgs.gov/centers/eros/science/national-agriculture-imagery-program-naip-data-dictionary) & [FGDC](https://www.fgdc.gov/metadata). More metadata is extracted from the assets using standard geospatial libraries. This metadata forms the STAC Items.
- This STAC Collection and Items are used to build the STAC Catalog that helps users discover the spatiotemporal assets using STAC APIs.

**Cataloging**

- STAC Catalog
  
  - STAC Catalog is a top-level object that logically groups other Catalog, Collection, and Item Objects. As part of the deployment of this solution, we create a STAC Catalog under which all the collections and items are organized.

- STAC Collection

  - It's a related group of STAC Items that is made available by a data provider.
  - Search queries for discovering the assets are scoped at the STAC Collection level.
  - It's generated for a data provider, NAIP in this case and this JSON metadata is uploaded to an Azure Storage container.
  - The upload of a [STAC Collection](https://stacspec.org/en/about/stac-spec/) metadata file triggers a message to Azure Service Bus.
  - The processor processes this metadata on Azure Kubernetes Cluster and ingests to the STAC Catalog database (PostgreSQL database). There are different processors for different data providers and each processor subscribes to the respective Service Bus Topic.

- STAC Item and asset
  - An asset that is to be cataloged (raster data in the form of [GeoTiff](https://www.ogc.org/standards/geotiff), [Cloud Optimized GeoTiff](https://www.cogeo.org/) and so forth). Metadata describing the asset and the metadata extracted from the asset is uploaded to the Storage Account under the appropriate storage container.
  - The asset(s) (GeoTiff) are then uploaded to the Storage Account under the appropriate storage container following the successful upload of their corresponding  metadata.
  - Each asset and its associated metadata uploaded to the Storage Account triggers a message to the Service Bus. This metadata forms the STAC Item in the catalog database.
  - The processor processes this metadata on Azure Kubernetes Cluster and ingests to the STAC Catalog database (PostgreSQL database).

**Data discovery**

- STAC API is based on open source STAC FastAPI. 
- STAC API layer is implemented on Azure Kubernetes Service and the APIs are exposed using [API Management Service](https://azure.microsoft.com/products/api-management/).
- STAC APIs are used to discover the geospatial data in your Catalog. These APIs are based on STAC specifications and understand the STAC metadata defined and indexed in the STAC Catalog database (PostgreSQL server).
- Based on the search criteria, you can quickly locate your data from a large dataset.
  - Querying the STAC Collection, Items & Assets:
    - A query is submitted by a user to look up one or more STAC Collection, Items & Assets through the STAC FastAPI.
    - STAC FastAPI queries the data in the PostgreSQL database to retrieve the STAC Collection, Items & references to Assets.
    - The result is served back to the user by the STAC FastAPI.

### Components

The following Azure services are used in this architecture.

- [Key Vault](../key-vault/general/basic-concepts.md) stores and controls access to secrets such as tokens, passwords, and API keys. Key Vault also creates and controls encryption keys and manages security certificates.
- [Service Bus](https://azure.microsoft.com/services/service-bus/) is part of a broader [Azure messaging](../service-bus-messaging/service-bus-messaging-overview.md) infrastructure that supports queueing, publish/subscribe, and more advanced integration patterns.
- [Azure Data Lake Storage](https://azure.microsoft.com/services/storage/data-lake-storage/) is dedicated to big data analytics, and is built on [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs).
- [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) enables Azure resources to securely communicate with each other, the internet, and on-premises networks.
- [Azure Database for PostgreSQL - Flexible Server](../postgresql/flexible-server/overview.md) is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. It has richer capabilities such as zone resilient high availability (HA), predictable performance, maximum control, custom maintenance window, cost optimization controls, and simplified developer experience suitable for your enterprise workloads.
- [API Management Services](https://azure.microsoft.com/services/api-management/) offers a scalable, multicloud API management platform for securing, publishing and analyzing APIs.
- [Azure Kubernetes Services](../aks/intro-kubernetes.md) offers the quickest way to start developing and deploying cloud-native apps, with built-in code-to-cloud pipelines and guardrails.
- [Container Registry](../container-registry/container-registry-intro.md) to store and manage your container images and related artifacts.
- [Virtual Machine](../virtual-machines/overview.md) (VM) gives you the flexibility of virtualization for a wide range of computing solutions. In a fully secured deployment, a user connects to a VM via Azure Bastion (described in the next item below) to perform a range of operations like copying files to storage accounts, running Azure CLI commands, and interacting with other services.  
- [Azure Bastion](../bastion/bastion-overview.md) enables you to securely and seamlessly RDP & SSH to your VMs in Azure virtual network, without the need of public IP on the VM, directly from the Azure portal, and without the need of any other client/agent or any piece of software.
- [Application Insights](../azure-monitor/app/app-insights-overview.md) provides extensible application performance management and monitoring for live web apps.
- [Log Analytics](../azure-monitor/logs/log-analytics-overview.md) is a tool to edit and run log queries from data collected by Azure Monitor logs and interactively analyze the results.

The following Geospatial libraries are also used:

- [GDAL](https://gdal.org/) is a library of tools for manipulating spaceborne data. GDAL works on raster and vector data types. It's a good tool to know if you're working with spaceborne data.
- [Rasterio](https://rasterio.readthedocs.io/en/latest/intro.html) is a module for raster processing. You can use it to read and write several different raster formats in Python. Rasterio is based on GDAL. When the module is imported, Python automatically registers all known GDAL drivers for reading supported formats.
- [Shapely](https://shapely.readthedocs.io/en/stable/manual.html#introduction) is a Python package for set-theoretic analysis and manipulation of planar features. It uses (via Python's ctypes module) functions from the widely deployed GEOS library.
- [pyproj](https://pyproj4.github.io/pyproj/stable/examples.html) performs cartographic transformations. It converts from longitude and latitude to native map projection x, y coordinates, and vice versa, by using [PROJ](https://proj.org/).

## Considerations

- The sample solution demonstrates STAC's core JSON support that is needed to interact with any geospatial data collection. While STAC standardizes metadata fields, naming conventions, query language, and catalog structure, users should additionally consider [STAC Extensions](https://stac-extensions.github.io/) to support metadata fields specific to their Assets.

- In the sample implementation, components that process the asset to extract metadata have a set number of replicas. Scaling this component allows you to process your assets faster. However, scaling isn't dynamic. If large number of assets to be cataloged, consider scaling these replicas.

### Adding a new data source

To catalog more data sources or to catalog your own data source, consider the following options.

- Define the STAC Collection for your data source. Search queries are scoped at the STAC Collection level. Consider how the user will search STAC Items and Assets in your collection.
- Generate the STAC Item metadata. More metadata may be derived from geospatial assets using standard tools and libraries. Define and implement the process to capture supplemental metadata for the assets that will be useful in making STAC items rich and in turn make discovery of data using APIs easier.
- Once this metadata (in the form STAC Collection and STAC Items) is available for a data source, this sample solution can be used to build your STAC Catalog using the same flow. The data once cataloged will be queryable using standard STAC APIs.
- The processor component of this architecture is extensible to include custom code that can be developed and run as containers in Azure Kubernetes Cluster. It's intended to provide a way for different representation of geospatial data to be cataloged as assets.

### Security

Security provides assurances against deliberate attacks and the abuse of your valuable data and systems. For more information, see [Overview of the security pillar](/azure/architecture/framework/security/overview).

- Azure Kubernetes Service [Container Security](../aks/concepts-security.md) implementation ensures the processors are built and run as containers are secure.
- API Management Service [Security baseline](../aks/concepts-security.md) provides recommendations on how to secure your cloud solutions on Azure.
- [Azure Database for PostgreSQL Security](../postgresql/flexible-server/concepts-security.md) covers in-depth the security at multiple layers when data is stored in PostgreSQL Flexible Server including data at rest and data in transit scenarios.

### Cost optimization

Cost optimization is about looking at ways to reduce unnecessary expenses and improve operational efficiencies. For more information, see [Overview of the cost optimization pillar](/azure/architecture/framework/cost/overview).

As this solution is intended for learning and development, we have used minimal configuration for the Azure resources. This minimal configuration runs a sample solution on a sample dataset.

Users can also adjust the configurations to meet their workload and scaling needs to be performant. For instance, you can swap Standard HDDs for Premium SSDs in your AKS cluster or scale API Management Services to premium SKUs.

### Performance efficiency

Performance efficiency is the ability of your workload to scale to meet the demands placed on it by users in an efficient manner. For more information, see [Performance efficiency pillar overview](/azure/architecture/framework/scalability/overview). Additionally, the following guidance can be useful in maximizing performance efficiency:

- [Monitor and tune](../postgresql/single-server/tutorial-monitor-and-tune.md) provides a way to monitor your data and tune your database to improvement performance.
- [Performance tuning a distributing application](/azure/architecture/performance/) walks through a few different scenarios, how to identify key metrics and improve performance.
- [Baseline architecture for an Azure Kubernetes Service (AKS) cluster](/azure/architecture/reference-architectures/containers/aks/baseline-aks) recommends baseline infrastructure architecture to deploy an Azure Kubernetes Service (AKS) cluster on Azure.
- [Improve the performance of an API by adding a caching policy in Azure API Management](/training/modules/improve-api-performance-with-apim-caching-policy/) is a training module on improving performance through Caching Policy.

## Deploy this scenario

We built a [sample solution](https://github.com/Azure/Azure-Orbital-STAC) that can be deployed into your subscription. This solution enables users to validate the overall data flow from STAC metadata, ingestion to discovering the assets using standard STAC APIs. The deployment instructions and the validation steps are documented in the [README](https://github.com/Azure/Azure-Orbital-STAC/blob/main/deploy/README.md) file.

At a high level, this deployment does the following:

- Deploys various infrastructure components such as Azure Kubernetes Services, Azure PostgreSQL Server, Azure Key Vault, Azure Storage account, Azure Service Bus, and so forth, in the private network.
- Deploys Azure API Management service and publishes the endpoint for STAC FastAPI.
- Packages the code and its dependencies, builds the Docker container images, and pushes them to Azure Container Registry.

    :::image type="content" source="media/stac-deploy.png" alt-text="Diagram of STAC deployment services." lightbox="media/stac-deploy.png":::

Download a [Visio file](https://download.microsoft.com/download/5/6/4/564196b7-dd01-468a-af21-1da16489f298/stac_deploy.vsdx) for this implementation.

## Next steps

If you want to start building this, we have put together a [sample solution](https://github.com/Azure/Azure-Orbital-STAC) discussed briefly above. Below are some useful links to get started on STAC & model implementation.

- [STAC Overview](https://github.com/radiantearth/stac-spec/blob/master/overview.md)
- [STAC tutorial](https://stacspec.org/en/tutorials/)
- [Microsoft Planetary Computer API](https://github.com/Microsoft/planetary-computer-apis)

## Related resources

- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/docs/overview/about) lets users apply the power of the cloud to accelerate environmental sustainability and Earth science. Many of the Planetary Computer components are also open source.
- [The STAC specification](https://stacspec.org/en)
- [STAC FastAPI](https://stac-utils.github.io/stac-fastapi/)
- [PySTAC](https://pystac.readthedocs.io/en/stable/)
- [PgSTAC](https://stac-utils.github.io/pgstac/pgstac/)
- [pyPgSTAC](https://stac-utils.github.io/pgstac/pypgstac/)
- [NAIP](https://datagateway.nrcs.usda.gov/GDGHome_DirectDownLoad.aspx)
- [FGDC](https://www.fgdc.gov/metadata)

## Glossary

|STAC term|Definition|
|----|---|
|Asset|Any file that represents spaceborne data captured in a certain space and time.|
|STAC Specification|Allows you to describe the geospatial data so it can be easily indexed and discovered.|  
|STAC Item|The core atomic unit, representing a single spatiotemporal asset as a GeoJSON feature plus metadata like datetime and reference links.|
|STAC Catalog|A simple, flexible JSON that provides a structure and organized the metadata like STAC items, collections and other catalogs.|
|STAC Collection|Provides additional information such as the extents, license, keywords, providers, and so forth, that describe STAC Items within the Collection.|
|STAC API|Provides a RESTful endpoint that enables search of STAC Items, specified in OpenAPI.|
