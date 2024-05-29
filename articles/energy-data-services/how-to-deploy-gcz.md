---
title: Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy
description: Learn how to deploy Geospatial Consumption Zone on top of your Azure Data Manager for Energy instance.
ms.service: energy-data-services
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.reviewer: 
ms.author: eihaugho
author: EirikHaughom
ms.date: 05/11/2024
---
# Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy

This guide shows you how to deploy the OSDU Admin UI on top of your Azure Data Manager for Energy (ADME) instance.

## Description

The OSDU Geospatial Consumption Zone (GCZ) is a service that enables enhanced management and utilization of geospatial data. The GCZ streamlines the handling of location-based information. It abstracts away technical complexities, allowing software applications to access geospatial data without needing to deal with intricate details. By providing ready-to-use map services, the GCZ facilitates seamless integration with OSDU-enabled applications.

## Create an App Registration in Entra ID


## Setup

::: zone pivot="Azure Kubernetes Service (AKS) "

[!INCLUDE [Azure Kubernetes Service (AKS)](includes/how-to/deploy-gcz-aks.md)]

::: zone-end

::: zone pivot="Windows Virtual Machine (VM)"

[!INCLUDE [Windows Virtual Machine](includes)]

::: zone-end

## Publish GCZ API's publicly (optional)

## Testing the GCZ

## Next steps
After you have a successful deployment of GCZ, you can:

- 

You can also ingest data into your Azure Data Manager for Energy instance:

- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md).
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md).
    
## References

For information about Geospatial Consumption Zone, see [OSDU GitLab](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/tree/master).
For other deployment methods (Azure Kubernetes Service), see [GCZ Kubernetes Deployment Guide](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/blob/master/docs/deployment/kubernetes/README.md#gcz---kubernetes-deployment-guide).
