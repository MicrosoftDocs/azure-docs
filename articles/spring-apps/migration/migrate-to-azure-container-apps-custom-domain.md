---
title: Custom Domain with TLS/SSL in Azure Container Apps
description: Describes the settings required for a custom domain with TLS/SSL in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
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

If your certificate is from Azure Key Vault, see [Import certificates from Azure Key Vault to Azure Container Apps](../../container-apps/key-vault-certificates-manage.md) for more information.

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

For more information, see the [Peer-to-peer encryption](../../container-apps/networking.md?tabs=workload-profiles-env%2Cazure-cli#peer-to-peer-encryption) section of [Networking in Azure Container Apps environment](../../container-apps/networking.md).

## Traffic to external services

### Reference a certificate from Key Vault and mount certificates in a volume

When you define a certificate, you create a reference to a certificate stored in Azure Key Vault. Azure Container Apps automatically retrieves the certificate value from Key Vault and makes it available as a secret in your container app.

To reference a certificate from Key Vault, you must first enable managed identity in your container app and grant the identity access to the Key Vault secrets.

To enable managed identity in your container app, see [Managed identities in Azure Container Apps](../../container-apps/managed-identity.md).

To grant access to a Key Vault certificate, add the role assignment `Key Vault Secrets User` in Key Vault for the managed identity you created. For more information, see [Best Practices for individual keys, secrets, and certificates role assignments](/azure/key-vault/general/rbac-guide#best-practices-for-individual-keys-secrets-and-certificates-role-assignments).

When you create a container app, certificates are defined using the `--secrets` parameter and using the following guidelines:

- The parameter accepts a space-delimited set of name/value pairs.
- Each pair is delimited by an equals sign (`=`).
- To specify a Key Vault reference, use the format `<certificate-name>=keyvaultref:<key-vault-secret-identifier-of-certificate>,identityref:<managed-identity-ID>`. For example, `my-cert=keyvaultref:https://mykeyvault.vault.azure.net/secrets/mycert,identityref:/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity`.

The following command provides an example:

```azurecli
az containerapp create \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --environment "my-environment-name" \
    --image <image_name> \
    --user-assigned "<user-assigned-identity-ID>" \
    --secrets "my-cert=keyvaultref:<key-vault-secret-identifier-of-certificate>,identityref:<user-assigned-identity-ID>"
    --secret-volume-mount "/mnt/cert"
```

Here, a certificate is declared in the `--secrets` parameter. Replace `<key-vault-secret-identifier-of-certificate>` with the Secret Identifier URI of your certificate in Key Vault. Replace `<user-assigned-identity-ID>` with the resource ID of the user assigned identity. For a system assigned identity, use `system` instead of the resource ID. The certificate mounted in a volume is named `my-cert` of type Secret. The volume is mounted at the path **/mnt/cert**. The application can then read the secrets as files in the volume mount.

For an existing container app, you can use following commands to reference a secret from Key Vault and mount it to a volume:

```azurecli
az containerapp secret set \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --secrets "my-cert=keyvaultref:<key-vault-secret-identifier-of-certificate>,identityref:<user-assigned-identity-ID>"

az containerapp update \
    --resource-group "my-resource-group" \
    --name "my-app" \
    --secret-volume-mount "/mnt/cert"
```

### Load a certificate from code

Your loaded certificates are available in your defined mounted path - for example, **/mnt/cert/my-cert**. Use the following Java code to load a certificate in an application in Azure Container Apps.

Because the certificate is mounted as a secret, its content is encoded in Base64, so you might need to decode it before use.

```java
try {
  byte[] encodedBytes = Files.readAllBytes(Paths.get("/mnt/cert/my-cert"));
  PKCS12PfxPdu pfx = new PKCS12PfxPdu(Base64.getDecoder().decode(encodedBytes));
  List<Certificate> certificates = new ArrayList<>();
  for (ContentInfo contentInfo : pfx.getContentInfos()) {
    if (contentInfo.getContentType().equals(PKCSObjectIdentifiers.encryptedData)) {
      PKCS12SafeBagFactory safeBagFactory = new PKCS12SafeBagFactory(contentInfo,
        new JcePKCSPBEInputDecryptorProviderBuilder().build("\0".toCharArray()));
      PKCS12SafeBag[] safeBags = safeBagFactory.getSafeBags();
      for (PKCS12SafeBag safeBag : safeBags) {
        Object bagValue = safeBag.getBagValue();
        if (bagValue instanceof X509CertificateHolder) {
          CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
          InputStream in = new ByteArrayInputStream(((X509CertificateHolder) bagValue).getEncoded());
          certificates.add(certFactory.generateCertificate(in));
        }
      }
    }
  }

  // use the loaded certificate in 'certificates'
} catch (PKCSException | CertificateException | IOException e) {
  // handle exception
}
```

In this sample code, you need to import [org.bouncycastle.bcpkix-lts8on](https://mvnrepository.com/artifact/org.bouncycastle/bcpkix-lts8on) to your project to parse the certificate data.

### Load a certificate into the trust store

Use the following steps to load a certificate:

1. Set up a storage account - for example, `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Storage/storageAccounts/mystorageaccount`.

1. Download and upload the JCA library. Get the latest version of the JCA library from the Maven repository [azure-security-keyvault-jca](https://mvnrepository.com/artifact/com.azure/azure-security-keyvault-jca) and upload the JAR file to a file share in the storage account - for example, **/jca/lib/azure-security-keyvault-jca.jar**.

1. Use the following steps to modify and upload a Java security configuration:

    1. Make a copy of the **java.security** file in your JDK. For Java version 8 or earlier, you can find the **java.security** file at **$JAVA_HOME/jre/lib/security/java.security**. For Java version 11 or later, you can find the **java.security** file at **$JAVA_HOME/conf/security**.

    1. Locate `security.provider.<#>=` property in the file and add the following line:

       ```text
       security.provider.<#>=com.azure.security.keyvault.jca.KeyVaultJcaProvider
       ```

       In this line, the number sign placeholder `<#>` represents one increment above the last number in the list - for example, `security.provider.14`.

    1. Upload the modified **java.security** file to a file share in the storage account - for example, **/jca/security/java.security**.

1. Upload the certificates that need to be loaded into the trust store to the file share in the storage account - for example, **/jca/truststore/**.

1. Add the volume mount. To add a volume mount for the JCA library and certificates in the container app, see [Tutorial: Create an Azure Files volume mount in Azure Container Apps](../../container-apps/storage-mounts-azure-files.md). You can mount it, for example, as **/mnt/jca/**.

1. Update your image with JCA-related parameters. Modify your Dockerfile as shown in the following example:

   ```dockerfile
   # filename: JAR.dockerfile

   FROM mcr.microsoft.com/openjdk/jdk:17-mariner

   ARG JAR_FILENAME

   COPY $JAR_FILENAME /opt/app/app.jar
   ENTRYPOINT ["java", "-Dsecurity.overridePropertiesFile=true", "-Djava.security.properties=/mnt/jca/security/java.security", \
       "--module-path", "/mnt/jca/lib", "--add-modules=com.azure.security.keyvault.jca", "-Djavax.net.ssl.trustStoreType=AzureKeyVault", \
       "-Dazure.cert-path.custom=/mnt/jca/truststore/", "-jar", "/opt/app/app.jar"]
   ```

1. Rebuild the image with the following command and then upload it to the container registry:

   ```azurecli
   docker build -t <image-name>:<image-tag> \
       -f JAR.dockerfile \
       --build-arg JAR_FILENAME=<path-to-jar> \
       .
   ```

1. Create or update your container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

For more information on using the JCA Provider for Azure Key Vault in your Java application, see [JCA Provider Example](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-jca#examples).

This method maintains consistency with the behavior of Azure Spring Apps. You can also use other ways to load certificates into the trust store.

By following these steps, you can successfully migrate your custom domain with TLS/SSL from Azure Spring Apps to Azure Container Apps, maintaining secure and efficient communication across all traffic types.
