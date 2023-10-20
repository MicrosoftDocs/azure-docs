---
title: Use TLS/SSL certificates in your application in Azure Spring Apps
titleSuffix: Azure Spring Apps
description: Use TLS/SSL certificates in an application.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 10/08/2021
ms.custom: devx-track-java, event-tier1-build-2022
---

# Use TLS/SSL certificates in your application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use public certificates in Azure Spring Apps for your application. Your app may act as a client and access an external service that requires certificate authentication, or it may need to perform cryptographic tasks.  

When you let Azure Spring Apps manage your TLS/SSL certificates, you can maintain the certificates and your application code separately to safeguard your sensitive data. Your app code can access the public certificates you add to your Azure Spring Apps instance.

> [!NOTE]
> Azure CLI and Terraform support and samples will be coming soon to this article.

## Prerequisites

- An application deployed to Azure Spring Apps. See [Quickstart: Deploy your first application in Azure Spring Apps](./quickstart.md), or use an existing app.
- Either a certificate file with *.crt*, *.cer*, *.pem*, or *.der* extension, or a deployed instance of Azure Key Vault with a private certificate.

## Import a certificate

You can choose to import your certificate into your Azure Spring Apps instance from either Key Vault or use a local certificate file.

### Import a certificate from Key Vault

You need to grant Azure Spring Apps access to your key vault before you import your certificate using these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Key vaults**, then select the Key Vault you'll import your certificate from.
1. In the left navigation pane, select **Access policies**, then select **Create**.
1. Select **Certificate permissions**, then select **Get** and **List**.

   :::image type="content" source="media/use-tls-certificates/grant-key-vault-permission.png" alt-text="Screenshot of Azure portal 'Create an access policy' page with Permission pane showing and Get and List permissions highlighted." lightbox="media/use-tls-certificates/grant-key-vault-permission.png":::

1. Under **Principal**, select your **Azure Spring Cloud Resource Provider**.

   :::image type="content" source="media/use-tls-certificates/select-service-principal.png" alt-text="Screenshot of Azure portal 'Create an access policy' page with Principal pane showing and Azure Spring Apps Resource Provider highlighted." lightbox="media/use-tls-certificates/select-service-principal.png":::

1. Select **Review + Create**, then select **Create**.

After you grant access to your key vault, you can import your certificate using these steps:

1. Go to your service instance.
1. From the left navigation pane of your instance, select **TLS/SSL settings**.
1. Select **Import Key Vault Certificate** in the **Public Key Certificates** section.
1. Select your Key Vault in **Key vault** and the certificate in **Certificate**, then **Select** and **Apply**.
1. When you have successfully imported your certificate, you'll see it in the list of Public Key Certificates.

> [!NOTE]
> The Azure Key Vault and Azure Spring Apps instances should be in the same tenant.

### Import a local certificate file

You can import a certificate file stored locally using these steps:

1. Go to your service instance.
1. From the left navigation pane of your instance, select **TLS/SSL settings**.
1. Select **Upload public certificate** in the **Public Key Certificates** section.
1. When you've successfully imported your certificate, you'll see it in the list of Public Key Certificates.

## Load a certificate

To load a certificate into your application in Azure Spring Apps, start with these steps:

1. Go to your application instance.
1. From the left navigation pane of your app, select **Certificate management**.
1. Select **Add certificate** to choose certificates accessible for the app.

:::image type="content" source="media/use-tls-certificates/load-certificate.png" alt-text="Screenshot of Azure portal 'Certificate management' page with 'Add certificate' button highlighted." lightbox="media/use-tls-certificates/load-certificate.png":::

### Load a certificate from code

Your loaded certificates are available in the */etc/azure-spring-cloud/certs/public* folder. Use the following Java code to load a public certificate in an application in Azure Spring Apps.

```java
CertificateFactory factory = CertificateFactory.getInstance("X509");
FileInputStream is = new FileInputStream("/etc/azure-spring-cloud/certs/public/<certificate name>");
X509Certificate cert = (X509Certificate) factory.generateCertificate(is);

// use the loaded certificate
```

### Load a certificate into the trust store

For a Java application, you can choose **Load into trust store** for the selected certificate. The certificate will be automatically added to the Java default TrustStores to authenticate a server in SSL authentication.

The following log from your app shows that the certificate is successfully loaded.

```output
Load certificate from specific path. alias = <certificate alias>, thumbprint = <certificate thumbprint>, file = <certificate name>
```

## Next steps

- [Enable ingress-to-app Transport Layer Security](./how-to-enable-ingress-to-app-tls.md)
- [Access Config Server and Service Registry](./how-to-access-data-plane-azure-ad-rbac.md)
