---
title: "Quickstart - Configure single sign-on for Applications Using Azure Spring Apps Enterprise tier"
description: Describes single sign-on configuration for Azure Spring Apps Enterprise tier.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Configure single sign-on for applications using Azure Spring Apps Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to configure single sign-on for applications running on Azure Spring Apps Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Apps Enterprise tier. For more information, see [View Azure Spring Apps Enterprise tier Offer in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

## Prepare single sign-on credentials

To configure single sign-on for the application, you'll need to prepare credentials. The following sections describe steps for an existing provider or provisioning an Application Registration with Azure Active Directory.

### Use an existing provider

Follow these steps to configure single sign-on using an existing Identity Provider. If you're provisioning an Azure Active Directory App Registration, continue on to [Register with Azure Active Directory](#create-and-configure-an-application-registration-with-azure-active-directory).

1. Your existing identity provider must be configured to allow redirects back to Spring Cloud Gateway and API Portal. Spring Cloud Gateway has a single URI to allow re-entry to the gateway. API Portal has two URIs for supporting the user interface and underlying API. Retrieve these URIs using the following commands and add them to your single sign-on provider's configuration:

   ```azurecli
   GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   echo "https://${GATEWAY_URL}/login/oauth2/code/sso"
   echo "https://${PORTAL_URL}/oauth2-redirect.html"
   echo "https://${PORTAL_URL}/login/oauth2/code/sso"
   ```

1. Obtain the `Client ID` and `Client Secret` for your identity provider.

1. Obtain the `Issuer URI` for your identity provider. The provider needs to be configured with an issuer URI which is the URI that it asserts as its Issuer Identifier. For example, if the `issuer-uri` provided is "https://example.com", then an OpenID Provider Configuration Request will be made to "https://example.com/.well-known/openid-configuration". The result is expected to be an OpenID Provider Configuration Response.

> [!NOTE]
> Only authorization servers supporting OpenID Connect Discovery protocol can be used.

1. The Identity Service application will use the public JSON Web Keys (JWK) to verify JSON Web Tokens (JWT) issued by your single sign-on identity provider's authorization server. Obtain the `JWK URI` for your identity provider for use later. The `JWK URI` typically takes the form `${ISSUER_URI}/keys` or `${ISSUER_URI}/<version>/keys`.

### Create and configure an application registration with Azure Active Directory

To register the application with Azure Active Directory, follow these steps. If you're using an existing provider's credentials, continue on to [Deploy the Identity Service Application](#deploy-the-identity-service-application).

1. Create an Application registration with Azure Active Directory and save the output using the following command:

   ```azurecli
   az ad app create --display-name <app-registration-name> > ad.json
   ```

1. Retrieve the Application ID and collect the client secret using the following commands:

   ```azurecli
   APPLICATION_ID=$(cat ad.json | jq -r '.appId')
   az ad app credential reset --id ${APPLICATION_ID} --append > sso.json
   ```

1. Use the following command to assign a Service Principal to the Application Registration:

   ```azurecli
   az ad sp create --id ${APPLICATION_ID}
   ```

1. Retrieve the URLs for Spring Cloud Gateway and API Portal and add the necessary Reply URLs to the Active Directory App Registration using the following command:

   ```azurecli
   APPLICATION_ID=$(cat ad.json | jq -r '.appId')

   GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   az ad app update \
       --id ${APPLICATION_ID} \
       --reply-urls "https://${GATEWAY_URL}/login/oauth2/code/sso" "https://${PORTAL_URL}/oauth2-redirect.html" "https://${PORTAL_URL}/login/oauth2/code/sso"
   ```

1. The application's `Client ID` is needed for later. Save the output from the following command to be used later:

   ```bash
   cat sso.json | jq -r '.appId'
   ```

1. The Application's `Client Secret` is needed for later. Save the output from the following command to be used later:

   ```bash
   cat sso.json | jq -r '.password'
   ```

1. The `Issuer URI` is needed for later. Save the output from the following command to be used later:

   ```bash
   TENANT_ID=$(cat sso.json | jq -r '.tenant')
   echo "https://login.microsoftonline.com/${TENANT_ID}/v2.0"
   ```

1. The Identity Service application will use the public JSON Web Keys (JWK) to verify JSON Web Tokens (JWT) issued by Active Directory. Retrieve the `JWK URI` from the output of the following command:

   ```bash
   TENANT_ID=$(cat sso.json | jq -r '.tenant')
   echo "https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys"
   ```

## Deploy the Identity Service application

To complete the single sign-on experience, deploy the Identity Service application. The Identity Service application provides a single route to aid in identifying the user. For these steps make sure that the terminal is in the project folder before running any commands.

1. Create the `identity-service` application using the following command:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Enable externalized configuration for the identity service by binding to Application Configuration Service using the following command:

   ```azurecli
   az spring application-configuration-service bind \
       --resource-group <resource-group-name> \
       --app identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Enable service discovery and registration for the identity service by binding to Service Registry using the following command:

   ```azurecli
   az spring service-registry bind \
       --resource-group <resource-group-name> \
       --app identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Deploy the identity service using the following command:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern identity/default \
       --source-path apps/acme-identity \
       --env "JWK_URI=<jwk-uri>"
   ```

1. Route requests to the identity service using the following command:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name identity-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name identity-service \
       --routes-file azure/routes/identity-service.json
   ```

## Configure single sign-on for Spring Cloud Gateway

Spring Cloud Gateway can be configured to authenticate requests via single sign-on. To configure Spring Cloud Gateway to use single sign-on follow these steps.

1. Configure Spring Cloud Gateway to use single sign-on using the following command:

   ```azurecli
   GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --api-description "ACME Fitness Store API" \
       --api-title "ACME Fitness Store" \
       --api-version "v1.0" \
       --server-url "https://${GATEWAY_URL}" \
       --allowed-origins "*" \
       --client-id <client-id> \
       --client-secret <client-secret> \
       --scope "openid,profile" \
       --issuer-uri <issuer-uri>
   ```

1. Instruct the cart service application to use Spring Cloud Gateway for authentication by providing necessary environment variables using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "AUTH_URL=https://${GATEWAY_URL}" "CART_PORT=8080"
   ```

1. Instruct the order service application to use Spring Cloud Gateway for authentication by providing necessary environment variables using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "AcmeServiceSettings__AuthUrl=https://${GATEWAY_URL}"
   ```

1. Retrieve the URL for Spring Cloud Gateway using the following command:

   ```bash
   echo "https://${GATEWAY_URL}"
   ```

   The above URL can be opened in a browser, use this to explore the updated application. The Log In function will now work, allowing items to be added to the cart and orders to be placed. After logging in, the customer information button will display the logged in username:

   :::image type="content" source="media/quickstart-configure-single-sign-on-enterprise/login_success.png" alt-text="Screenshot of ACME Fitness Store app showing a logged in user.":::

## Configure single sign-on for API Portal

API Portal can be configured to use single sign-on to require authentication before exploring APIs. Use the following commands to configure single sign-on for API Portal:

   ```azurecli
   PORTAL_URL=$(az spring api-portal show \
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

Retrieve the URL for API Portal using the following commands:

   ```azurecli
   PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   echo "https://${PORTAL_URL}"
   ```

The above URL can be opened in a browser, use this to explore the application APIs. This time, you'll be directed to sign on before exploring APIs.

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
