---
title: Quickstart - Configure single sign-on for applications using the Azure Spring Apps Enterprise plan
description: Describes single sign-on configuration for the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Quickstart: Configure single sign-on for applications using the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to configure single sign-on for applications running on the Azure Spring Apps Enterprise plan.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for the Azure Spring Apps Enterprise plan. For more information, see [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Prepare single sign-on credentials

To configure single sign-on for the application, you need to prepare credentials. The following sections describe steps for using an existing provider or provisioning an application registration with Azure Active Directory.

### Use an existing provider

Follow these steps to configure single sign-on using an existing Identity Provider. If you're provisioning an Azure Active Directory App Registration, skip ahead to the following section, [Create and configure an application registration with Azure Active Directory](#create-and-configure-an-application-registration-with-azure-active-directory).

1. Configure your existing identity provider to allow redirects back to Spring Cloud Gateway for VMware Tanzu and API portal for VMware Tanzu. Spring Cloud Gateway has a single URI to allow re-entry to the gateway. API portal has two URIs for supporting the user interface and underlying API. The following commands retrieve these URIs that you add to your single sign-on provider's configuration.

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   export PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   echo "https://${GATEWAY_URL}/login/oauth2/code/sso"
   echo "https://${PORTAL_URL}/oauth2-redirect.html"
   echo "https://${PORTAL_URL}/login/oauth2/code/sso"
   ```

1. Obtain the `Client ID` and `Client Secret` for your identity provider.

1. Obtain the `Issuer URI` for your identity provider. You must configure the provider with an issuer URI, which is the URI that it asserts as its Issuer Identifier. For example, if the `issuer-uri` provided is `https://example.com`, then an OpenID Provider Configuration Request is made to `https://example.com/.well-known/openid-configuration`. The result is expected to be an OpenID Provider Configuration Response.

   > [!NOTE]
   > You can only use authorization servers that support OpenID Connect Discovery protocol.

1. Obtain the `JWK URI` for your identity provider for use later. The `JWK URI` typically takes the form `${ISSUER_URI}/keys` or `${ISSUER_URI}/<version>/keys`. The Identity Service application uses the public JSON Web Keys (JWK) to verify JSON Web Tokens (JWT) issued by your single sign-on identity provider's authorization server.

### Create and configure an application registration with Azure Active Directory

To register the application with Azure Active Directory, follow these steps. If you're using an existing provider's credentials, skip ahead to the following section, [Deploy the Identity Service application](#deploy-the-identity-service-application).

1. Use the following command to create an application registration with Azure Active Directory and save the output:

   ```azurecli
   az ad app create --display-name <app-registration-name> > ad.json
   ```

1. Use the following command to retrieve the application ID and collect the client secret:

   ```azurecli
   export APPLICATION_ID=$(cat ad.json | jq -r '.appId')
   az ad app credential reset --id ${APPLICATION_ID} --append > sso.json
   ```

1. Use the following command to assign a Service Principal to the application registration:

   ```azurecli
   az ad sp create --id ${APPLICATION_ID}
   ```

1. Use the following commands to retrieve the URLs for Spring Cloud Gateway and API portal, and add the necessary Reply URLs to the Active Directory App Registration.

   ```azurecli
   export APPLICATION_ID=$(cat ad.json | jq -r '.appId')

   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   export PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   az ad app update \
       --id ${APPLICATION_ID} \
       --web-redirect-uris "https://${GATEWAY_URL}/login/oauth2/code/sso" "https://${PORTAL_URL}/oauth2-redirect.html" "https://${PORTAL_URL}/login/oauth2/code/sso"
   ```

1. Use the following command to retrieve the application's `Client ID`. Save the output to use later in this quickstart.

   ```bash
   cat sso.json | jq -r '.appId'
   ```

1. Use the following command to retrieve the application's `Client Secret`. Save the output to use later in this quickstart.

   ```bash
   cat sso.json | jq -r '.password'
   ```

1. Use the following command to retrieve the `Issuer URI`. Save the output to use later in this quickstart.

   ```bash
   export TENANT_ID=$(cat sso.json | jq -r '.tenant')
   echo "https://login.microsoftonline.com/${TENANT_ID}/v2.0"
   ```

1. Retrieve the `JWK URI` from the output of the following command. The Identity Service application uses the public JSON Web Keys (JWK) to verify JSON Web Tokens (JWT) issued by Active Directory.

   ```bash
   export TENANT_ID=$(cat sso.json | jq -r '.tenant')
   echo "https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys"
   ```

## Deploy the Identity Service application

To complete the single sign-on experience, use the following steps to deploy the Identity Service application. The Identity Service application provides a single route to aid in identifying the user. 

1. Navigate to the project folder.

1. Use the following command to create the `identity-service` application:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following command to enable externalized configuration for the identity service by binding to Application Configuration Service:

   ```azurecli
   az spring application-configuration-service bind \
       --resource-group <resource-group-name> \
       --app identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following command to enable service discovery and registration for the identity service by binding to Service Registry:

   ```azurecli
   az spring service-registry bind \
       --resource-group <resource-group-name> \
       --app identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following command to deploy the identity service:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern identity/default \
       --source-path apps/acme-identity \
       --build-env BP_JVM_VERSION=17 \
       --env "JWK_URI=<jwk-uri>"
   ```

1. Use the following command to route requests to the identity service:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name identity-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name identity-service \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/identity-service.json
   ```

## Configure single sign-on for Spring Cloud Gateway

You can configure Spring Cloud Gateway to authenticate requests using single sign-on. To configure Spring Cloud Gateway to use single sign-on, follow these steps:

1. Use the following commands to configure Spring Cloud Gateway to use single sign-on:

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --api-description "Fitness Store API" \
       --api-title "Fitness Store" \
       --api-version "v1.0" \
       --server-url "https://${GATEWAY_URL}" \
       --allowed-origins "*" \
       --client-id <client-id> \
       --client-secret <client-secret> \
       --scope "openid,profile" \
       --issuer-uri <issuer-uri>
   ```

1. Instruct the cart service application to use Spring Cloud Gateway for authentication. Use the following command to provide the necessary environment variables:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "AUTH_URL=https://${GATEWAY_URL}" "CART_PORT=8080"
   ```

1. Instruct the order service application to use Spring Cloud Gateway for authentication. Use the following command to provide the necessary environment variables:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "AcmeServiceSettings__AuthUrl=https://${GATEWAY_URL}"
   ```

1. Use the following command to retrieve the URL for Spring Cloud Gateway:

   ```bash
   echo "https://${GATEWAY_URL}"
   ```

   You can open the output URL in a browser to explore the updated application. The Log In function is now operational, allowing you to add items to the cart and place orders. After you sign in, the customer information button displays the signed-in username.

## Configure single sign-on for API portal

You can configure API portal for VMware Tanzu to use single sign-on to require authentication before exploring APIs. Use the following commands to configure single sign-on for API portal:

```azurecli
export PORTAL_URL=$(az spring api-portal show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

az spring api-portal update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> \
    --client-id <client-id> \
    --client-secret <client-secret> \
    --scope "openid,profile,email" \
    --issuer-uri <issuer-uri>
```

Use the following commands to retrieve the URL for API portal:

```azurecli
export PORTAL_URL=$(az spring api-portal show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

echo "https://${PORTAL_URL}"
```

You can open the output URL in a browser to explore the application APIs. You're directed to sign on before exploring APIs.

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

Continue on to any of the following optional quickstarts:

- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
