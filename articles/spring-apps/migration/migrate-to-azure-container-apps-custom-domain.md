---
title: Custom Domain with TLS/SSL in Azure Container Apps
description: Describes the settings required for a custom domain with TLS/SSL in Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 08/19/2025
ms.update-cycle: 1095-days
ms.custom: devx-track-java, devx-track-extended-java
---

# Custom domain with TLS/SSL in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

Migrating your custom domain with TLS/SSL from Azure Spring Apps to Azure Container Apps involves several steps to ensure a smooth transition. This article walks you through the process, covering client traffic, inter-application traffic, and traffic to external services.

## Prerequisites

- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli).
- An existing TLS/SSL certificate - for example, a certificate stored in [Azure KeyVault](/azure/key-vault/certificates/certificate-scenarios).
- (Optional) An existing Azure Storage Account if you want to load certificate into the trust store from Azure storage file share. For more information, see [Create an Azure storage account](../../storage/common/storage-account-create.md).

## Client traffic to the application

By default, all inbound traffic in container app uses HTTPS unless you enable HTTP traffic manually, which you can do by using the following command:

```azurecli
az containerapp ingress update \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --allow-insecure
```

For more information on configuring ingress for your app, see [Configure Ingress for your app in Azure Container Apps](../../container-apps/ingress-how-to.md?pivots=azure-cli).

### Custom domain

To secure custom Domain Name System (DNS) names in Azure Container Apps, you can add digital security certificates. This supports secure communication among your apps.

If you need to secure your custom domain in Azure Container Apps, you can use a private certificate that is free of charge and easy to use. For more information, see [Custom domain names and free managed certificates in Azure Container Apps](../../container-apps/custom-domains-managed-certificates.md?pivots=azure-cli).

If you have a private certificate stored locally, you can upload it. For more information, see [Custom domain names and bring your own certificates in Azure Container Apps](../../container-apps/custom-domains-certificates.md).

If your certificate is from Azure Key Vault, you can import certificates to Azure Container Apps directly. For more information, see [Import certificates from Azure Key Vault to Azure Container Apps](../../container-apps/key-vault-certificates-manage.md).

If you want to continue using the original certificate and domain name from Azure Spring Apps, you can upload the certificate to container apps or Azure Key Vault. Also, you can update the A record or CNAME in your DNS provider to redirect the original domain name to the container app IP or URL.

### Enabling mTLS between client and container apps

To enable mutual TLS (mTLS) between the client and container apps, use the following steps:

1. Use the following command to export the container app configuration in YAML format:

   ```azurecli
   az containerapp show \
       --resource-group "my-resource-group" \
       --name "my-app" \
       --output yaml > app.yaml
   ```

1. Update the `clientCertificateMode` value in **app.yaml**, as shown in the following example:

   ```yaml
   properties:
     configuration:
       ingress:
         clientCertificateMode: require
   ```

   You can set this property to one of the following values:

   - `require`: The client certificate is required for all requests to the container app.
   - `accept`: The client certificate is optional. If the client certificate isn't provided, the request is still accepted.
   - `ignore`: The client certificate is ignored.

1. Use the following command to apply the `clientCertificateMode` change to the container app:

   ```azurecli
   az containerapp update \
       --resource-group "my-resource-group" \
       --name "my-app" \
       --yaml app.yaml
   ```

For more information, see [Configure client certificate authentication in Azure Container Apps](../../container-apps/client-certificate-authorization.md).

You need to handle client certificate verification in your code.

## Inter-application traffic

Traffic between different container apps in the same app environment uses HTTP by default - for example, `http://<app-name>`. To secure this traffic, you can enable peer-to-peer encryption by using the following
commands:

```azurecli
# enable when creating the container app
az containerapp env create \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --location "location" \
    --enable-peer-to-peer-encryption

# enable for the existing container app
az containerapp env update \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --enable-peer-to-peer-encryption
```

After you enable peer-to-peer-encryption, one container app can access other container apps using HTTPS with mTLS - for example, `https://<app-name>`. The certificate used in mTLS is system-assigned.

For more information, see the [Peer-to-peer encryption](../../container-apps/ingress-environment-configuration.md#peer-to-peer-encryption) section of [Configure ingress in an Azure Container Apps environment](../../container-apps/ingress-environment-configuration.md).

## Traffic to external services

This sample shows how to enable TLS and mTLS for traffic to external services by loading the certificate from Azure Key Vault using the `spring-cloud-azure-starter-keyvault-jca` library. Your Java project must use Spring Boot 3.1+ and include the following dependency in your **pom.xml** file:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-keyvault-jca</artifactId>
    <version>5.23.0</version>
</dependency>
```

### Load a certificate into the truststore from Key Vault with SSL bundle

Use the following steps to load a certificate into the truststore from Azure Key Vault using the `spring-cloud-azure-starter-keyvault-jca` library:

1. Generate or import certificates in Azure Key Vault. For more information, see [Create and import certificates in Azure Key Vault](/azure/key-vault/certificates/certificate-scenarios#creating-and-importing-certificates).

1. Enable managed identity in your container app. To enable managed identity in your container app, see [Managed identities in Azure Container Apps](../../container-apps/managed-identity.md).

1. Grant the `Key Vault Certificate User` role to the managed identity in your Key Vault. For more information, see [Best Practices for individual keys, secrets, and certificates role assignments](/azure/key-vault/general/rbac-guide#best-practices-for-individual-keys-secrets-and-certificates-role-assignments).

1. Add the following configuration to your **application.yml** file:

   ```yml
   spring:
     ssl:
       bundle:
         keyvault:
           tlsClientBundle:
             truststore:
               keyvault-ref: keyvault1
   cloud:
     azure:
       keyvault:
         jca:
           vaults:
             keyvault1:
               endpoint: ${KEY_VAULT_SSL_BUNDLES_KEYVAULT_URI_01}
               credential:
                 client-id: ${KEY_VAULT_SSL_BUNDLES_CLIENT_ID}  # Required for user-assigned managed identity
                 managed-identity-enabled: true
   ```

1. To apply the Key Vault SSL bundle, update your `RestTemplate` or `WebClient` bean configuration, as shown in the following example:

   ```java
   // For RestTemplate
   @Bean
   RestTemplate restTemplateWithTLS(RestTemplateBuilder restTemplateBuilder, SslBundles sslBundles) {
     return restTemplateBuilder.sslBundle(sslBundles.getBundle("tlsClientBundle")).build();
   }

   // For WebClient
   @Bean
   WebClient webClientWithTLS(WebClientSsl ssl) {
     return WebClient.builder().apply(ssl.fromBundle("tlsClientBundle")).build();
   }
   ```

### Enable mTLS communication

Use the following steps to set up mTLS for two-way authentication between client and server:

1. Generate or import both client and server certificates to Azure Key Vault. For more information, see [Create and import certificates in Azure Key Vault](/azure/key-vault/certificates/certificate-scenarios#creating-and-importing-certificates).

1. Enable managed identity for your container app. To enable managed identity in your container app, see [Managed identities in Azure Container Apps](../../container-apps/managed-identity.md).

1. Grant the `Key Vault Certificate User` role to the managed identity for both key vaults. For more information, see [Best Practices for individual keys, secrets, and certificates role assignments](/azure/key-vault/general/rbac-guide#best-practices-for-individual-keys-secrets-and-certificates-role-assignments).

1. Add the following configuration to your **application.yml** file for mTLS:

   ```yml
   spring:
     ssl:
       bundle:
         keyvault:
           mtlsClientBundle:
             key:
               alias: client
             for-client-auth: true
             keystore:
               keyvault-ref: keyvault2
             truststore:
               keyvault-ref: keyvault1
   cloud:
     azure:
       keyvault:
         jca:
           vaults:
             keyvault1:
               endpoint: ${KEY_VAULT_SSL_BUNDLES_KEYVAULT_URI_01}
               credential:
                 client-id: ${KEY_VAULT_SSL_BUNDLES_CLIENT_ID}  # Required for user-assigned managed identity
                 managed-identity-enabled: true
             keyvault2:
               endpoint: ${KEY_VAULT_SSL_BUNDLES_KEYVAULT_URI_02}
               credential:
                 client-id: ${KEY_VAULT_SSL_BUNDLES_CLIENT_ID}  # Required for user-assigned managed identity
                 managed-identity-enabled: true
   ```

1. To apply the Key Vault SSL bundle, update your `RestTemplate` or `WebClient` bean configuration, as shown in the following example:

   ```java
   // For RestTemplate
   @Bean
   RestTemplate restTemplateWithMTLS(RestTemplateBuilder restTemplateBuilder, SslBundles sslBundles) {
     return restTemplateBuilder.sslBundle(sslBundles.getBundle("mtlsClientBundle")).build();
   }

   // For WebClient
   @Bean
   WebClient webClientWithMTLS(WebClientSsl ssl) {
     return WebClient.builder().apply(ssl.fromBundle("mtlsClientBundle")).build();
   }
   ```

For more information on using the `spring-cloud-azure-starter-keyvault-jca` library in your Spring Boot application, see [Introducing Spring Cloud Azure Starter Key Vault JCA: Streamlined TLS and mTLS for Spring Boot](https://devblogs.microsoft.com/azure-sdk/introducing-spring-cloud-azure-starter-key-vault-jca-streamlined-tls-and-mtls-for-spring-boot/).

By following these steps, you can successfully migrate your custom domain with TLS/SSL from Azure Spring Apps to Azure Container Apps, maintaining secure and efficient communication across all traffic types.
