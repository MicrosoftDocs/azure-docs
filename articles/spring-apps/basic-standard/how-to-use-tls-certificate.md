---
title: Use TLS/SSL Certificates in Your Application in Azure Spring Apps
titleSuffix: Azure Spring Apps
description: Use TLS/SSL certificates in an application.
author: KarlErickson
ms.author: karler
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 08/01/2024
ms.custom: devx-track-java
---

# Use TLS/SSL certificates in your application in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article shows you how to use public certificates in Azure Spring Apps for your application. Your app might act as a client and access an external service that requires certificate authentication, or it might need to perform cryptographic tasks.

When you let Azure Spring Apps manage your TLS/SSL certificates, you can maintain the certificates and your application code separately to safeguard your sensitive data. Your app code can access the public certificates you add to your Azure Spring Apps instance.

## Prerequisites

- An application deployed to Azure Spring Apps. See [Quickstart: Deploy your first application in Azure Spring Apps](./quickstart.md), or use an existing app.
- Either a certificate file with **.crt**, **.cer**, **.pem**, or **.der** extension, or a deployed instance of Azure Key Vault with a private certificate.

## Import a certificate

You can choose to import your certificate into your Azure Spring Apps instance from either Key Vault or use a local certificate file.

### Import a certificate from Key Vault

You need to grant Azure Spring Apps access to your key vault before you import your certificate.

Azure Key Vault offers two authorization systems: [Azure role-based access control](../../role-based-access-control/overview.md) (Azure RBAC), which operates on Azure's [control and data planes](../../azure-resource-manager/management/control-plane-and-data-plane.md), and the *access policy model*, which operates on the data plane alone.

Use the following steps to grant access:

#### [Access policies](#tab/accessPolicies)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Key vaults**, then select the key vault you import your certificate from.
1. In the navigation pane, select **Access policies**, then select **Create**.
1. Select **Certificate permissions**, then select **Get** and **List**.

   :::image type="content" source="media/how-to-use-tls-certificate/grant-key-vault-permission.png" alt-text="Screenshot of the Azure portal that shows the Create an access policy page with Permission pane showing and Get and List permissions highlighted." lightbox="media/how-to-use-tls-certificate/grant-key-vault-permission.png":::

1. Under **Principal**, select **Azure Spring Cloud Resource Provider**.

   :::image type="content" source="media/how-to-use-tls-certificate/select-service-principal.png" alt-text="Screenshot of the Azure portal that shows the Create an access policy page Principal tab with Azure Spring Cloud Resource Provider highlighted." lightbox="media/how-to-use-tls-certificate/select-service-principal.png":::

1. Select **Review + Create**, then select **Create**.

#### [RBAC](#tab/RBAC)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Key vaults**, then select the key vault you import your certificate from.
1. In the navigation pane, select **Access control (IAM)**, then select **Add role assignment**.
1. Search for **Certificate**, then select the role named **Key Vault Certificate User**.

   :::image type="content" source="media/how-to-use-tls-certificate/grant-key-vault-permission-rbac.png" alt-text="Screenshot of the Azure portal that shows the Add role assignment page with Key Vault Certificate User highlighted." lightbox="media/how-to-use-tls-certificate/grant-key-vault-permission-rbac.png":::

1. Under **Members**, select **Select members**. Search for *Azure Spring Cloud Resource Provider*, select the provider, and then select **Select**.

   :::image type="content" source="media/how-to-use-tls-certificate/select-service-principal-rbac.png" alt-text="Screenshot of the Azure portal that shows the Add role assignment page with the Select members pane showing." lightbox="media/how-to-use-tls-certificate/select-service-principal-rbac.png":::

1. Select **Review + assign**.

---

After you grant access to your key vault, you can import your certificate using the following steps:

1. Go to your service instance.

1. From the left navigation pane of your instance, select **TLS/SSL settings**.

1. Select **Import Key Vault Certificate** in the **Public Key Certificates** section.

1. Select your key vault in the **Key vaults** section, select your certificate in the **Certificate** section, and then select **Select**.

1. Provide a value for **Certificate name**, select **Enable auto sync** if needed, and then select **Apply**. For more information, see the [Auto sync certificate](./how-to-custom-domain.md#auto-sync-certificate) section of [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md).

After you  successfully import your certificate, you see it in the list of Public Key Certificates.

> [!NOTE]
> The Azure Key Vault and Azure Spring Apps instances should be in the same tenant.

### Import a local certificate file

You can import a certificate file stored locally using these steps:

1. Go to your service instance.
1. From the left navigation pane of your instance, select **TLS/SSL settings**.
1. Select **Upload public certificate** in the **Public Key Certificates** section.

After you successfully import your certificate, you see it in the list of Public Key Certificates.

## Load a certificate

To load a certificate into your application in Azure Spring Apps, start with these steps:

1. Go to your application instance.
1. From the left navigation pane of your app, select **Certificate management**.
1. Select **Add certificate** to choose certificates accessible for the app.

:::image type="content" source="media/how-to-use-tls-certificate/load-certificate.png" alt-text="Screenshot of the Azure portal that shows the Certificate management page with the Add certificate button highlighted." lightbox="media/how-to-use-tls-certificate/load-certificate.png":::

### Load a certificate from code

Your loaded certificates are available in the **/etc/azure-spring-cloud/certs/public** folder. Use the following Java code to load a public certificate in an application in Azure Spring Apps.

```java
CertificateFactory factory = CertificateFactory.getInstance("X509");
FileInputStream is = new FileInputStream("/etc/azure-spring-cloud/certs/public/<certificate name>");
X509Certificate cert = (X509Certificate) factory.generateCertificate(is);

// use the loaded certificate
```

### Load a certificate into the trust store

For a Java application, you can choose **Load into trust store** for the selected certificate. The certificate is automatically added to the Java default TrustStores to authenticate a server in TLS/SSL authentication.

The following log from your app shows that the certificate is successfully loaded.

```output
Load certificate from specific path. alias = <certificate alias>, thumbprint = <certificate thumbprint>, file = <certificate name>
```

## Next steps

- [Enable ingress-to-app Transport Layer Security](./how-to-enable-ingress-to-app-tls.md)
- [Access Config Server and Service Registry](how-to-access-data-plane-azure-ad-rbac.md)
