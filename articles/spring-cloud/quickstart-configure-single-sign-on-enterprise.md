---
title: "Quickstart - Configure Single Sign-On for Applications Using Azure Spring Cloud Enterprise Tier"
description: Describes single sign-on configuration for Azure Spring Cloud Enterprise tier.
author: maly7
ms.author: 
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 
ms.custom: 
---
# Quickstart: Configure Single Sign-On for Applications Using Azure Spring Cloud Enterprise Tier

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to configure single sign-on for applications running on Azure Spring Cloud using the Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Cloud Enterprise Tier. For more information, see [View Azure Spring Cloud Enterprise Tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Cloud using the Enterprise Tier](./quickstart-deploy-enterprise.md).

## Prepare Single Sign-On Credentials

To configure Single Sign-On for the application, you will need to prepare credentials. The following sections describe steps for an existing provider or provisioning an Application Registration with Azure Active Directory.

### Use an Existing Provider

### Provision Azure Active Directory



## Deploy the Identity Service Application

To complete the single sign-on experience, deploy the identity service application following these steps. For these steps make sure that the terminal is in the project folder before running any commands.

1. Create the `identity-service` application using the following command:

    ```azurecli
    az spring-cloud app create \
        --resource-group <resource-group> \
        --name identity-service \
        --service <spring-cloud-service>
    ```

1. Enable externalized configuration for the identity service by binding to Application Configuration Service using the following command:

    ```azurecli
    az spring-cloud application-configuration-service bind \
        --resource-group <resource-group> \
        --app identity-service \
        --service <spring-cloud-service> 
    ```

1. Enable service discovery and registration for the identity service by binding to Service Registry using the following command:

    ```azurecli
    az spring-cloud service-registry bind \
        --resource-group <resource-group> \
        --app identity-service \
        --service <spring-cloud-service> 
    ```

1. Deploy the identity service using the following command:

    ```azurecli
    az spring-cloud app deploy \
        --resource-group <resource-group> \
        --name identity-service \
        --service <spring-cloud-service> \
        --config-file-pattern identity/default \
        --source-path apps/acme-identity \
        --env "JWK_URI=<jwk-uri>" 
    ```

1. Route requests to the identity service using the following command:

    ```azurecli
    az spring-cloud gateway route-config create \
        --resource-group <resource-group> \
        --name identity-routes \
        --service <spring-cloud-service> \
        --app-name identity-service \
        --routes-file azure/routes/identity-service.json
    ```

## Configure Single Sign-On for Spring Cloud Gateway

Spring Cloud Gateway can be configured to authenticate requests via Single Sign-On. To configure Spring Cloud Gateway to use Single Sign-On follow these steps.

1. Configure Spring Cloud Gateway to use Single Sign-On using the following command:
    ```azurecli
    GATEWAY_URL=$(az spring-cloud gateway show \
        --resource-group <resource-group> \
        --service <spring-cloud-service> | jq -r '.properties.url')

    az spring-cloud gateway update \
        --resource-group <resource-group> \
        --service <spring-cloud-service> \
        --api-description "ACME Fitness Store API" \
        --api-title "ACME Fitness Store" \
        --api-version "v1.0" \
        --server-url "https://${GATEWAY_URL}" \
        --allowed-origins "*" \
        --client-id <client-id> \
        --client-secret <client-secret> \
        --scope <scopes> \
        --issuer-uri <issuer-uri>
    ```

1. Instruct the cart service application to use Spring Cloud Gateway for authentication by providing necessary environment variables using the following command:

    ```azurecli
    az spring-cloud app update \
        --resource-group <resource-group> \
        --name cart-service \
        --service <spring-cloud-service> \
        --env "AUTH_URL=https://${GATEWAY_URL}" "CART_PORT=8080"
    ```

1. Instruct the order service application to use Spring Cloud Gateway for authentication by providing necessary environment variables using the following command:

    ```azurecli
    az spring-cloud app update \
        --resource-group <resource-group> \
        --name cart-service \
        --service <spring-cloud-service> \
        --env "AcmeServiceSettings__AuthUrl=https://${GATEWAY_URL}"    
    ```

1. Retrieve the URL for Spring Cloud Gateway using the following commands:

    ```azurecli
    GATEWAY_URL=$(az spring-cloud gateway show \
        --resource-group <resource-group> \
        --service <spring-cloud-service> | jq -r '.properties.url')

    echo "https://${GATEWAY_URL}"
    ```

    The above URL can be opened in a browser, use this to explore the deployed application. The Log In function will now work, allowing items to be added to the cart and orders to be placed.

## Configure Single Sign-On for API Portal

API Portal can be configured to use Single Sign-On to require authentication before exploring APIs. Use the following commands to configure Single Sign-On for API Portal:

    ```azurecli
    PORTAL_URL=$(az spring-cloud api-portal show \
        --resource-group <resource-group> \
        --service <spring-cloud-service> | jq -r '.properties.url')

    az spring-cloud api-portal update \
        --resource-group <resource-group> \
        --service <spring-cloud-service> \
        --client-id <client-id> \
        --client-secret <client-secret> \
        --scope "openid,profile,email" \
        --issuer-uri <issuer-uri>
    ```

Retrieve the URL for API Portal using the following commands:

    ```azurecli
    PORTAL_URL=$(az spring-cloud api-portal show \
        --resource-group <resource-group> \
        --service <spring-cloud-service> | jq -r '.properties.url')

    echo "https://${PORTAL_URL}"
    ```

The above URL can be opened in a browser, use this to explore the application APIs. This time you will be directed to sign on before exploring APIs.

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
