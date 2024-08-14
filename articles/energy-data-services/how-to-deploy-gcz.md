---
title: Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy
description: Learn how to deploy Geospatial Consumption Zone on top of your Azure Data Manager for Energy instance.
ms.service: energy-data-services
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: eihaugho
author: EirikHaughom
ms.date: 05/11/2024
zone_pivot_groups: gcz-aks-or-windows
---

# Deploy Geospatial Consumption Zone

This guide shows you how to deploy the Geospatial Consumption Zone (GCZ) service integrated with Azure Data Manager for Energy (ADME).

> [!IMPORTANT]
> While the Geospatial Consumption Zone (GCZ) service is a graduated service in the OSDU Forum, it has limitations in terms of security and usage. We will deploy some additional services and policies to secure the environment, but encourage you to follow the service's development on the [OSDU Gitlab](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/wikis/home).

## Description

The OSDU Geospatial Consumption Zone (GCZ) is a service that enables enhanced management and utilization of geospatial data. The GCZ streamlines the handling of location-based information. It abstracts away technical complexities, allowing software applications to access geospatial data without needing to deal with intricate details. By providing ready-to-use map services, the GCZ facilitates seamless integration with OSDU-enabled applications.

## Create an App Registration in Microsoft Entra ID

To deploy the GCZ, you need to create an App Registration in Microsoft Entra ID. The App Registration is to authenticate the GCZ APIs with Azure Data Manager for Energy to be able to generate the cache of the geospatial data.

1. See [Create an App Registration in Microsoft Entra ID](/azure/active-directory/develop/quickstart-register-app) for instructions on how to create an App Registration.
1. Grant the App Registration permission to read the relevant data in Azure Data Manager for Energy. See [How to add members to an OSDU group](./how-to-manage-users.md#add-members-to-an-osdu-group-in-a-data-partition) for further instructions.

## Setup

There are two main deployment options for the GCZ service:
- **Azure Kubernetes Service (AKS)**: Deploy the GCZ service on an AKS cluster. This deployment option is recommended for production environments. It requires more setup, configuration, and maintenance. It also has some limitations in the provided container images.
- **Windows**: Deploy the GCZ service on a Windows. This deployment option recommended for development and testing environments, as it's easier to set up and configure, and requires less maintenance.

::: zone pivot="gcz-aks"

[!INCLUDE [Azure Kubernetes Service (AKS)](includes/how-to/how-to-deploy-gcz/deploy-gcz-on-aks.md)]

::: zone-end

::: zone pivot="gcz-windows"

[!INCLUDE [Windows](includes/how-to/how-to-deploy-gcz/deploy-gcz-on-windows.md)]

::: zone-end

## Publish GCZ APIs publicly (optional)

If you want to expose the GCZ APIs publicly, you can use Azure API Management (APIM).
Azure API Management allows us to securely expose the GCZ service to the internet, as the GCZ service doesn't yet have authentication and authorization built in.
Through APIM we can add policies to secure, monitor, and manage the APIs.

### Prerequisites

- An Azure API Management instance. If you don't have an Azure API Management instance, see [Create an Azure API Management instance](/azure/api-management/get-started-create-service-instance).
- The GCZ APIs are deployed and running.

> [!IMPORTANT]
> The Azure API Management instance will need to be injected into a virtual network that is routable to the AKS cluster to be able to communicate with the GCZ API's.

### Add the GCZ APIs to Azure API Management

#### Download the GCZ OpenAPI specifications

1. Download the two OpenAPI specification to your local computer.
    - [GCZ Provider](https://github.com/microsoft/adme-samples/blob/main/services/gcz/gcz-openapi-provider.yaml)
    - [GCZ Transformer](https://github.com/microsoft/adme-samples/blob/main/services/gcz/gcz-openapi-transformer.yaml)
1. Open each OpenAPI specification file in a text editor and replace the `servers` section with the corresponding IPs of the AKS GCZ Services' Load Balancer (External IP).

    ```yaml
    servers:
    - url: "http://<GCZ-Service-External-IP>/ignite-provider"
    ```

##### [Azure portal](#tab/portal)

[!INCLUDE [Azure portal](includes/how-to/how-to-deploy-gcz/deploy-gcz-apim-portal.md)]

##### [Azure CLI](#tab/cli)

[!INCLUDE [Azure CLI](includes/how-to/how-to-deploy-gcz/deploy-gcz-apim-cli.md)]

---

## Testing the GCZ service

1. Download the API client collection from the [OSDU GitLab](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/blob/master/docs/test-assets/postman/Geospatial%20Consumption%20Zone%20-%20Provider%20Postman%20Tests.postman_collection.json?ref_type=heads) and import it into your API client of choice (for example, Postman).
1. Add the following environment variables to your API client:
    - `PROVIDER_URL` - The URL to the GCZ Provider API.
    - `AMBASSADOR_URL` - The URL to the GCZ Transformer API.
    - `access_token` - A valid ADME access token.

1. To verify that the GCZ is working as expected, run the API calls in the collection.

## Next steps
After you have a successful deployment of GCZ, you can:

- Visualize your GCZ data using the GCZ WebApps from the [OSDU GitLab](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/tree/master/docs/test-assets/webapps?ref_type=heads).

> [!IMPORTANT]
> The GCZ WebApps are currently in development and does not support authentication. We recommend deploying the WebApps in a private network and exposing them using Azure Application Gateway or Azure Front Door to enable authentication and authorization.

You can also ingest data into your Azure Data Manager for Energy instance:

- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md).
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md).
    
## References

- For information about Geospatial Consumption Zone, see [OSDU GitLab](https://community.opengroup.org/osdu/platform/consumption/geospatial/).
