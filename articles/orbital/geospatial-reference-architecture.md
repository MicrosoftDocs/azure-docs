---
title: 'End-to-end geospatial reference architecture' 
description: 'Concepts: shows how to architect end-to-end geospatial on Azure '
author: rovin-ms
ms.service: orbital
ms.topic: overview
ms.custom: public-preview
ms.date: 03/15/2022
ms.author: rovin-ms
# Customer intent: As a geospatial architect, I'd like to understand how to architecture a solution on Azure.
---
# End-to-end geospatial storage, analysis, and visualization

Geospatial data comes in a variety of forms and requires a wide range of capabilities to process, analyze and visualize the data. While Geographic Information System (GIS) is common, it also is largely not cloud-native. Most GIS run on the desktop which limits their scale and performance. While there have been advances in moving the data to the backend, these systems remain IaaS bound which makes them difficult to scale. Plus, the expertise required to be successful takes several months to learn.

This article will provide a high-level approach to use cloud-native capabilities along with some open-source software options and commercial options. Three personas will be considered. The personas are architects that are looking for a high-level flow without getting into the specifics of an implementation. The personas include the following:

- General geospatial architect. This architect is looking for a means to implement geospatial but may not have a background in GIS or Remote Sensing.
- OSS geospatial architect. This architect is dedicated to an open-source software (OSS) solution but takes advantage of the cloud for compute and storage.
- COTS geospatial architect. This architect is dedicated to COTS but also takes advantage of cloud compute and storage.

## Potential use cases

The solutions provided in these architectures apply to many use cases:

- Processing, storing, and providing access to large amounts of raster data, such as layers or climate data.
- Combining entity location data from ERP systems with GIS reference data or include vector data, arrays, point clouds, etc.
- Storing Internet of Things (IoT) telemetry from moving devices, and analyze in real time or in batch
- Running analytical geospatial queries.
- Embedding curated and contextualized geospatial data in web apps.
- Processing data from drones, aerial photography, satellite imagery, LiDAR, gridded model results etc.

## General geospatial architecture

Azure has many native geospatial capabilities. In this diagram and the ones that follow, you&#39;ll find high-level stages in which geospatial data undergoes. First, you have the data source, an ingestion step, a place where the data is stored, transformed, served, published, and finally consumed. Note the globe icon beside the services with native geospatial capabilities. Also, these diagrams are not to be considered linear processes. One may start in the Transforms column, Publish and Consume, and then create some additional derived datasets which requires going back to a previous column.

:::image type="icon" source="media/geospatial_overview.png" border="false":::

This architecture flow assumes that the data may be coming from databases, files or streaming sources and not stored in a native GIS format. Once the data is ingested with Azure Data Factory, or via Azure IoT, Event Hub and Stream Analytics, it could then be stored permanently in warm storage with Azure SQL, Azure SQL Managed Instance, Azure Database for PostgreSQL or Azure Data Lake. From there, the data can be transformed and processed in batch with Azure Batch or Synapse Spark Pool, of which both can be automated through the usage of an Azure Data Factory or Synapse pipeline. For real-time data, it can be further transformed or processed with Stream Analytics, Azure Maps or brought into context with Azure Digital Twins. Once the data is transformed, it can then once again be served for additional uses in Azure SQL DB or Azure Database for PostgreSQL, Synapse SQL Pool (for abstracted non-geospatial data), Cosmos DB or Azure Data Explorer. Once ready, the data can be queried directly through the data base API, but frequently a publish layer is used. The Azure Maps Data API would suffice for small datasets, otherwise a non-native service can be introduced based on OSS or COTS, for accessing the data through web services or desktop applications. Finally, the Azure Maps Web SDK hosted in Azure App Service would allow for geovisualization. Another option is to use Azure Maps in Power BI. Lastly, HoloLens and Azure Spatial Anchors can be used to view the data and place it in the real-world for virtual reality (VR) and augmented reality (AR) experiences.

It should be noted as well that many of these options are optional and could be supplemented with OSS to reduce cost while also maintaining scalability, or 3rd party tools to utilize their specific capabilities. The next session addresses this need.

## 3rd Party and OSS geospatial architecture

This pattern takes the approach of using Azure native geospatial capabilities while at the same time taking advantage of some 3rd party tools and OSS tools.

The most significant difference between this approach and the previous flow diagram is the use of FME on from Safe Software, Inc. which can be acquired from the Azure Marketplace. FME allows geospatial architects to integrate various type of geospatial data which includes CAD (for Azure Maps Creator), GIS, BIM, 3D, point clouds, LIDAR, etc. There are 450+ integration options, and can speed up the creation of many data transformations through its functionality. Implementation, however, is based on the usage of a virtual machine, and has therefore limits in its scaling capabilities. The automation of FME transformations might be reached using FME API calls with the use of Azure Data Factory and/or with Azure Functions. Once the data is loaded in Azure SQL, for example, it can then be served in GeoServer and published as a Web Feature Service (vector) or Web Mapping Tile Service (raster) and visualized in Azure Maps web SDK or analyzed with QGIS for the desktop along with the other [Azure Maps base maps](https://docs.microsoft.com/en-us/azure/azure-maps/supported-map-styles#:~:text=Azure%20Maps%20supported%20built-in%20map%20styles%201%20blank,high_contrast_dark%208%20high_contrast_light%209%20Map%20style%20accessibility.%20).

:::image type="icon" source="media/geospatial_3rd_oss.png" border="false":::

## COTS geospatial architecture: Esri with static and streaming sources

The next approach we&#39;ll look at uses commercial GIS as the basis for the solution. Esri&#39;s technology, available from the Azure Marketplace, will be the foundation for this architecture, although other commercial software can fit the same patterns. As before, the sources, ingestion, (raw) store, Load/Serve largely remain the same. The data can also be transformed with ArcGIS Pro on a standalone computer (VM) or as part of a larger solution with [Azure Virtual Desktop](https://azure.microsoft.com/en-us/services/virtual-desktop/). The data can be published via [ArcGIS Enterprise](https://enterprise.arcgis.com/en/) or with the ArcGIS Enterprise on Kubernetes (Azure Kubernetes Service). Imagery can be processed on IaaS with ArcGIS Image as part of the ArcGIS Enterprise deployment. The data can be consumed in web apps hosted in Azure App Service with the ArcGIS JavaScript SDK, an ArcGIS Pro end user, ArcGIS Runtime mobile SDK, or with ArcGIS for Power BI. Likewise, users can consume the data with ArcGIS Online.

:::image type="icon" source="media/geospatial_esri_static.png" border="false":::

## COTS geospatial imagery architecture: Esri&#39;s ArcGIS Image and Azure Orbital

The next architecture involves Azure Orbital and Esri&#39;s ArcGIS Image. With this end-to-end flow, Azure Orbital allows you to schedule contacts with satellites and downlink the data into a VM or stream to Azure Event Hub. Besides direct streamed satellite data, drone or other imagery data can be brought on the platform, and processed. The raw data can be stored in Azure NetApp Files, an Azure Storage account (blob), or in a database such as Azure Database for PostgreSQL. Depending on the satellite and sensor platform, the data is transformed from Level 0 to Level 2 dataset , see [NASA Data Processing Levels](https://earthdata.nasa.gov/collaborate/open-data-services-and-software/data-information-policy/data-levels). To which level is required, is dependent on the satellite and sensor. Next, ArcGIS Pro can transform the data into a Mosaic Dataset. The Mosaic Dataset is then turned into an image service with ArcGIS Enterprise (on VMs or Kubernetes). ArcGIS Image Server can serve the data directly as an image service or a user can consume the image service via [ArcGIS Image for ArcGIS Online](https://www.esri.com/en-us/cp/arcgis-image-for-arcgis-online/overview?adumkts=integrated_marketing&amp;aduc=advertising&amp;adum=ppc&amp;aduSF=bing&amp;utm_Source=advertising&amp;aduca=dg_arcgis_image_for_arcgis_online&amp;aduco=olp_visualization&amp;adut=ppcbrand&amp;adupt=lead_gen&amp;sf_id=7015x000000STNjAAO&amp;ef_id=:G:s&amp;s_kwcid=AL!8948!3!!e!!o!!arcgis%20image%20for%20arcgis%20online&amp;_bk=arcgis%20image%20for%20arcgis%20online&amp;_bt=&amp;_bm=e&amp;_bn=o&amp;_bg=1306220144341354&amp;gclid=815d41bc28b312920c8b23ba5ef1bb14&amp;gclsrc=3p.ds&amp;msclkid=815d41bc28b312920c8b23ba5ef1bb14&amp;utm_source=bing&amp;utm_medium=cpc&amp;utm_campaign=DG%20ArcGIS%20Image%20-%20Brand%20-%20PPC%20-%20Phrase&amp;utm_term=arcgis%20image%20for%20arcgis%20online&amp;utm_content=Brand).

:::image type="icon" source="media/geospatial_esri_image.png" border="false":::

## COTS/OSS geospatial imagery architecture: Azure Space to Analysis Ready Dataset

When Analysis Ready Datasets are made available through APIs that enable search and query capabilities, like with Microsoft&#39;s Planetary Computer, there is no need to first download the data from a satellite. However, if low lead times are required for imagery, acquiring the data directly from Azure Space is ideal because a satellite operator or mission driven organization can schedule a contact with a satellite via Azure Orbital. The process for going from Level 0 to Level 2 Analysis Ready Dataset varies by the satellite and the imagery products. Multiple tools and intermediate steps are often required. Azure Batch or another compute resource can process the data in a cluster and store the resulting data. The data may go through multiple steps before it is ready for being used in ArcGIS or QGIS or some other geovisualization tool. For example, once the data is in a [Cloud Optimized GeoTIFF](https://www.cogeo.org/) (COG) format, it is served up via a Storage Account or Azure Data Lake and made accessible and queryable via the [STAC API](https://stacspec.org/), which can be deployed on Azure as a service, with AKS among others. Alternatively, the data is published as a Web Mapping Tile Service with GeoServer. Consumers can then access the data in ArcGIS Pro or QGIS or via a web app with Azure Maps or Esri&#39;s mobile and web SDKs.

:::image type="icon" source="media/geospatial_space_ard.png" border="false":::

## Components

- [Azure](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-about)Event Hubs is a fully managed streaming platform for big data. This platform as a service (PaaS) offers a partitioned consumer model. Multiple applications can use this model to process the data stream at the same time.
- [Azure Orbital](https://azure.microsoft.com/en-us/services/orbital/) is a fully managed, cloud-based ground station as a service that allows you to streamline your operations by ingesting space data directly into Azure.
- [Azure](https://docs.microsoft.com/en-us/azure/data-factory/introduction)[Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/introduction) is an integration service that works with data from disparate data stores. You can use this fully managed, serverless platform to create, schedule, and orchestrate data transformation workflows.
- [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) is a fully managed NoSQL database service for modern app development.
- [Azure Synapse Analytics](https://docs.microsoft.com/en-us/azure/synapse-analytics/overview-what-is) is an enterprise analytics service that accelerates time to insight across data warehouses and big data systems.
- [Azure Digital Twins](https://azure.microsoft.com/en-us/services/digital-twins/) is a platform as a service offering that enabled the creation of twin graphs based on digital models of entire environments, which could be buildings, factories, farms, energy networks, railways, stadiums, or entire cities.
- [Azure Virtual Desktop](https://azure.microsoft.com/en-us/services/virtual-desktop/) is a desktop and app virtualization service that runs on the cloud.
- [Azure Databricks](https://docs.microsoft.com/en-us/azure/databricks/getting-started/concepts) is a data analytics platform. Its fully managed Spark clusters process large streams of data from multiple sources. Azure Databricks can transform geospatial data at large scale for use in analytics and data visualization.
- [Azure Batch](https://azure.microsoft.com/en-us/services/batch/) allows you to run large-scale parallel and high-performance computing jobs.
- [Azure](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)[Data Lake Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction) is a scalable and secure data lake for high-performance analytics workloads. This service can manage multiple petabytes of information while sustaining hundreds of gigabits of throughput. The data typically comes from multiple, heterogeneous sources and can be structured, semi-structured, or unstructured.
- [Azure SQL Database](https://azure.microsoft.com/en-us/products/azure-sql/database/) is a PaaS version of SQL Server and is an intelligent, scalable, relational database service.
- [Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/overview) is a fully managed relational database service that&#39;s based on the community edition of the open-source [PostgreSQL](https://www.postgresql.org/) database engine.
- [PostGIS](https://www.postgis.net/)is an extension for the PostgreSQL database that integrates with GIS servers. PostGIS can run SQL location queries that involve geographic objects.
- [Power BI](https://docs.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview) is a collection of software services and apps. You can use Power BI to connect unrelated sources of data and create visuals of them.
- The [Azure Maps visual for Power BI](https://docs.microsoft.com/en-us/azure/azure-maps/power-bi-visual-getting-started) provides a way to enhance maps with spatial data. You can use this visual to show how location data affects business metrics.
- [App Service](https://docs.microsoft.com/en-us/azure/app-service/) and its [Web Apps](https://docs.microsoft.com/en-us/azure/app-service/overview) feature provide a framework for building, deploying, and scaling web apps. The App Service platform offers built-in infrastructure maintenance, security patching, and scaling.
- [GIS data APIs in Azure Maps](https://docs.microsoft.com/en-us/azure/azure-maps/create-data-source-web-sdk#geojson-data-source) store and retrieve map data in formats like GeoJSON and vector tiles.
- [Azure Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview) is a fast, fully managed data analytics service that can work with [large volumes of data](https://docs.microsoft.com/en-us/azure/data-explorer/engine-v3). This service originally focused on time series and log analytics. It now also handles diverse data streams from applications, websites, IoT devices, and other sources. [Geospatial functionality](https://azure.microsoft.com/updates/adx-geo-updates/) in Azure Data Explorer provides options for rendering map data.
- [Azure NetApp Files](https://azure.microsoft.com/en-us/services/netapp/) is an enterprise-class, high-performance, metered file Network Attached Storage (NAS) service.
- [Quantum GIS](https://www.qgis.org/en/site/) is a free and open-source desktop GIS that supports editing, analysis, geovisualization of geospatial data.
- [ArcGIS Enterprise](https://enterprise.arcgis.com/en/get-started/latest/windows/what-is-arcgis-enterprise-.htm) is a platform for mapping and geovisualization, analytics and data management which hosts data, applications, and custom low-code/no-code applications. It works along with the desktop GIS called ArcGIS Pro or ArcGIS Desktop (not included here because it has been supplanted by ArcGIS Pro).
- [ArcGIS Pro](https://www.esri.com/en-us/arcgis/products/arcgis-pro/overview) is Esri&#39;s professional desktop GIS application. It allows power users to explore, geovisualize, and analyze data. It includes 2D and 3D capabilities and runs best on Azure High Performance Compute VMs such as the NV series. The use of ArcGIS can be scaled using Azure Virtual Desktop.
- [ArcGIS Image for ArcGIS Online](https://www.esri.com/en-us/cp/arcgis-image-for-arcgis-online/overview?adumkts=integrated_marketing&amp;aduc=advertising&amp;adum=ppc&amp;aduSF=bing&amp;utm_Source=advertising&amp;aduca=dg_arcgis_image_for_arcgis_online&amp;aduco=olp_scalability&amp;adut=ppcbrand&amp;adupt=lead_gen&amp;sf_id=7015x000000STNjAAO&amp;ef_id=:G:s&amp;s_kwcid=AL!8948!3!!e!!o!!arcgis%20image%20for%20arcgis%20online&amp;_bk=arcgis%20image%20for%20arcgis%20online&amp;_bt=&amp;_bm=e&amp;_bn=o&amp;_bg=1306220144341354&amp;gclid=1f10b314439b15d18aa0d111519c6122&amp;gclsrc=3p.ds&amp;msclkid=1f10b314439b15d18aa0d111519c6122&amp;utm_source=bing&amp;utm_medium=cpc&amp;utm_campaign=DG%20ArcGIS%20Image%20-%20Brand%20-%20PPC%20-%20Phrase&amp;utm_term=arcgis%20image%20for%20arcgis%20online&amp;utm_content=Brand) is an extension to ArcGIS Online (SaaS) which allows for geovisualization, hosting, publishing, and analysis.
- [STAC](https://stacspec.org/) API specification allows you to query and retrieve raster data via a catalog.

Although not shown in the diagrams above, Azure Monitor, Log Analytics and Key Vault would also be part of a broader solution.

- Azure [Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/overview) collects data on environments and Azure resources. This diagnostic information is helpful for maintaining availability and performance. Two data platforms make up Monitor:
  - [Azure Monitor Logs](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs) records and stores log and performance data.
  - [Azure Monitor Metrics](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/data-platform-metrics) collects numerical values at regular intervals.
- Azure [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview) is an Azure portal tool that runs queries on Monitor log data. Log Analytics also provides features for charting and statistically analyzing query results.
- [Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/overview) stores and controls access to secrets such as tokens, passwords, and API keys. Key Vault also creates and controls encryption keys and manages security certificates.

## Alternatives

- Various Spark libraries are available for working with geospatial data on Azure Databricks and Synapse Spark Pools. See these libraries:
  - [Apache Sedona (GeoSpark)](http://sedona.apache.org/)
  - [GeoPandas](https://geopandas.org/)
  - [GeoTrellis](https://geotrellis.io/)

But [other solutions also exist for processing and scaling geospatial workloads with Azure Databricks](https://databricks.com/blog/2019/12/05/processing-geospatial-data-at-scale-with-databricks.html).

- Other Python libraries to consider include [PySAL](http://pysal.org/), [Rasterio](https://rasterio.readthedocs.io/en/latest/intro.html), [WhiteboxTools](https://www.whiteboxgeo.com/manual/wbt_book/intro.html), [Turf.js](https://turfjs.org/), [Pointpats](https://pointpats.readthedocs.io/en/latest/), [Raster Vision](https://docs.rastervision.io/en/0.13/), [EarthPy](https://earthpy.readthedocs.io/en/latest/index.html), [Planetary Computer](https://planetarycomputer.microsoft.com/), [PDAL](https://pdal.io/), etc.

- [Vector tiles](https://github.com/mapbox/vector-tile-spec) provide an efficient way to display GIS data on maps. A solution could use PostGIS to dynamically query vector tiles. This approach works well for simple queries and result sets that contain well under 1 million records. But in the following cases, a different approach may be better:
  - Your queries are computationally expensive.
  - Your data doesn&#39;t change frequently.
  - You&#39;re displaying large data sets.

In these situations, consider using [Tippecanoe](https://github.com/mapbox/tippecanoe) to generate vector tiles. You can run Tippecanoe as part of your data processing flow, either as a container or with [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview). You can make the resulting tiles available through APIs.

- Like Event Hubs, [Azure IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/about-iot-hub) can ingest large amounts of data. But IoT Hub also offers bi-directional communication capabilities with devices. If you receive data directly from devices but also send commands and policies back to devices, consider IoT Hub instead of Event Hubs.

## Considerations

The following considerations, based on the [Microsoft Azure Well-Architected Framework](https://docs.microsoft.com/en-us/azure/architecture/framework/index), apply to this solution:

### Availability

- [Event Hubs spreads failure risk across clusters](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-geo-dr).
  - Use a namespace with availability zones turned on to spread risk across three physically separated facilities.
  - Consider using the geo-disaster recovery feature of Event Hubs. This feature replicates the entire configuration of a namespace from a primary to a secondary namespace.
- See [business continuity features that Azure Database for PostgreSQL offers](https://docs.microsoft.com/en-us/azure/postgresql/concepts-business-continuity). These features cover a range of recovery objectives.
- [App Service diagnostics](https://docs.microsoft.com/en-us/azure/app-service/overview-diagnostics) alerts you to problems in apps, such as downtime. Use this service to identify, troubleshoot, and resolve issues like outages.
- Consider using [App Service to back up application files](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/basic-web-app#availability). But be careful with backed-up files, which include app settings in plain text. Those settings can contain secrets like connection strings.

### Scalability

This solution&#39;s implementation meets these conditions:

- Processes up to 10 million data sets per day. The data sets include batch or streaming events.
- Stores 100 million data sets in an Azure Database for PostgreSQL database.
- Queries 1 million or fewer data sets at the same time. A maximum of 30 users run the queries.

The environment uses this configuration:

- An Azure Databricks cluster with four F8s\_V2 worker nodes.
- A memory-optimized instance of Azure Database for PostgreSQL.
- An App Service plan with two Standard S2 instances.

Consider these factors to determine which adjustments to make for your implementation:

- Your data ingestion rate.
- Your volume of data.
- Your query volume.
- The number of parallel queries you need to support.

You can scale Azure components independently:

- Event Hubs automatically scales up to meet usage needs. But take steps to [manage throughput units](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-scalability#throughput-units) and [optimize partitions](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-scalability#partitions).
- Data Factory handles large amounts of data. Its [serverless architecture supports parallelism at different levels](https://docs.microsoft.com/en-us/azure/data-factory/copy-activity-performance#copy-performance-and-scalability-achievable-using-adf).
- [Data Lake Storage is scalable by design](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction#scalability).
- Azure Database for PostgreSQL offers [high-performance horizontal scaling](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-hyperscale-portal).
- [Azure Databricks clusters resize as needed](https://databricks.com/blog/2018/05/02/introducing-databricks-optimized-auto-scaling.html).
- [Azure Data Explorer can elastically scale to terabytes of data in minutes](https://azure.microsoft.com/services/data-explorer/).
- [App Service web apps scale up and out](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/basic-web-app?tabs=cli#scalability).

The [autoscale feature of Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-overview) also provides scaling functionality. You can configure this feature to add resources to handle increases in load. It can also remove resources to save money.

### Security

- Protect vector tile data. Vector tiles embed coordinates and attributes for multiple entities in one file. If you generate vector tiles, use a dedicated set of tiles for each permission level in your access control system. With this approach, only users within each permission level have access to that level&#39;s data file.
- To improve security, use Key Vault in these situations:
  - [To manage keys that Event Hubs uses to encrypt data](https://docs.microsoft.com/en-us/azure/event-hubs/configure-customer-managed-key).
  - [To store credentials that Data Factory uses in pipelines](https://docs.microsoft.com/en-us/azure/data-factory/how-to-use-azure-key-vault-secrets-pipeline-activities).
  - [To secure application settings and secrets that your App Service web app uses](https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references).
- See [Security in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/overview-security) for information on how App Service helps secure web apps. Also consider these points:
  - See how to [get the certificate that your app needs if it uses a custom domain name](https://azure.microsoft.com/updates/azure-app-service-ssl-certificates-available-for-purchase/).
  - See how to [redirect HTTP requests for your app to the HTTPS port](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-bindings#enforce-https).
  - Learn about [best practices for authentication in web apps](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/basic-web-app?tabs=cli#authentication).

### Pricing

- To estimate the cost of implementing this solution, see a sample [cost profile](https://azure.com/e/dcb9fc8b3dba4785aa93eb1e9871528f). This profile is for a single implementation of the environment described in [Scalability considerations](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/data/geospatial-data-processing-analytics-azure#scalability). It doesn&#39;t include the cost of Azure Data Explorer.
- To adjust the parameters and explore the cost of running this solution in your environment, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Related resources

#### Related architectures

- [Big data analytics with Azure Data Explorer](https://docs.microsoft.com/en-us/azure/architecture/solution-ideas/articles/big-data-azure-data-explorer)
- [Health data consortium on Azure](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/data/azure-health-data-consortium)
- [DataOps for the modern data warehouse](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/data-warehouse/dataops-mdw)
- [Azure Data Explorer interactive analytics](https://docs.microsoft.com/en-us/azure/architecture/solution-ideas/articles/interactive-azure-data-explorer)

#### Related guides

- [Geospatial data processing and analytics](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/data/geospatial-data-processing-analytics-azure)
- [Compare the machine learning products and technologies from Microsoft - Azure Databricks](https://docs.microsoft.com/en-us/azure/architecture/data-guide/technology-choices/data-science-and-machine-learning#azure-databricks)
- [Machine learning operations (MLOps) framework to scale up machine learning lifecycle with Azure Machine Learning](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/mlops/mlops-technical-paper)
- [Azure Machine Learning decision guide for optimal tool selection](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/mlops/aml-decision-tree)
- [Monitor Azure Databricks](https://docs.microsoft.com/en-us/azure/architecture/databricks-monitoring/)