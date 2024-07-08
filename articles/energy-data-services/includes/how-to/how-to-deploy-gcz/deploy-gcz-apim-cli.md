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

1. Run the following command to add the `Geospatial Consumption Zone - Provider` API to Azure API Management:

    ```bash
    az apim api import --resource-group <resource-group-name> --service-name <apim-service-name> --path ignite-provider --specification-format OpenApi --specification-path gcz-openapi-provider.yaml
    ```

1. Run the following command to add the `Geospatial Consumption Zone - Transformer` API to Azure API Management:

    ```bash
    az apim api import --resource-group <resource-group-name> --service-name <apim-service-name> --path gcz/transformer/admin --specification-format OpenApi --specification-path gcz-openapi-transformer.yaml
    ```

1. Create a new file on your local computer named `gcz-provider-policy.xml` and paste the following policy:

    ```xml
    <policies>
        <!-- Throttle, authorize, validate, cache, or transform the requests -->
        <inbound>
            <base />
            <validate-azure-ad-token tenant-id="%tenant-id%" failed-validation-httpcode="401">
            <client-application-ids>
                <application-id>%client-id%</application-id>
            </client-application-ids>
        </inbound>
        <!-- Control if and how the requests are forwarded to services  -->
        <backend>
            <base />
        </backend>
        <!-- Customize the responses -->
        <outbound>
            <base />
        </outbound>
        <!-- Handle exceptions and customize error responses  -->
        <on-error>
            <base />
        </on-error>
    </policies>
    ```

1. Replace `%tenant-id%` with your Microsoft Entra ID tenant ID, and `%client-id%` with the Azure Data Manager for Energy client ID and save the file.

1. Run the following command to add the policy to the `Geospatial Consumption Zone - Provider` API:

    ```bash
    az apim api policy import --resource-group <resource-group-name> --service-name <apim-service-name> --api-id <api-id> --policy-format xml --policy-path gcz-provider-policy.xml
    ```

1. Run the following command to add the policy to the `Geospatial Consumption Zone - Transformer` API:

    ```bash
    az apim api policy import --resource-group <resource-group-name> --service-name <apim-service-name> --api-id <api-id> --policy-format xml --policy-path gcz-provider-policy.xml
    ```
