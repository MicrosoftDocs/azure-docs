---
title: Secure communications end-to-end for Spring Boot apps in a Zero Trust environment
titleSuffix: Azure Spring Apps
description: Describes how to secure communications end-to-end or terminate transport-level security at any communication point for Spring Boot apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 08/15/2022
ms.author: asirveda
ms.custom: devx-track-java
---

# Secure communications end-to-end for Spring Boot apps in a Zero Trust environment

This article describes how to secure communications end-to-end for Spring Boot apps in a Zero Trust environment. You can secure communications end-to-end or terminate transport-level security at any communication point for Spring Boot apps. You can also automate the provisioning and configuration for all the Azure resources needed for securing communications.

Implementing secure communications as part of your solution architecture can be challenging. Many customers manually rotate their certificates or create their own solutions to automate provisioning and configuration. Even then, there's still data exfiltration risk, such as unauthorized copying or transfer of data from server systems. With Azure Spring Apps, these details are handled for you. Azure Spring Apps abstracts away most of the complexity, leaving secure communications as configurable and automatable options in the service.

## Secure internet communications

The TLS/SSL protocol establishes identity and trust, and encrypts communications of all types. TLS/SSL makes secure communications possible, particularly web traffic carrying commerce and customer data.

You can use any type of TLS/SSL certificate. For example, you can use certificates issued by a certificate authority, extended validation certificates, wildcard certificates with support for any number of subdomains, or self-signed certificates for dev and testing environments.

## Load certificates security with Zero Trust

Zero Trust is based on the principle of "never trust, always verify, and credential-free". Zero Trust helps to secure all communications by eliminating unknown and unmanaged certificates. Zero Trust involves trusting only certificates that are shared by verifying identity prior to granting access to those certificates. For more information, see the [Zero Trust Guidance Center](/security/zero-trust/).

To securely load certificates from [Azure Key Vault](../key-vault/index.yml), Spring Boot apps use [managed identities](../active-directory/managed-identities-azure-resources/overview.md) and [Azure role-based access control (RBAC)](../role-based-access-control/index.yml). Azure Spring Apps uses a provider [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) and Azure role-based access control. This secure loading is powered using the Azure Key Vault Java Cryptography Architecture (JCA) Provider. For more information, see [Azure Key Vault JCA client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-jca).

With Azure Key Vault, you control the storage and distribution of certificates to reduce accidental leakage. Applications and services can securely access certificates. Key Vault uses Azure role-based access control to lock down access to only those requiring access, such as an admin, but also apps, using the principle of least privilege. Applications and services authenticate and authorize, using Azure Active Directory and Azure role-based access control, to access certificates. You can monitor the access and use of certificates in Key Vault through its full audit trail.

## Secure communications end-to-end or terminate TLS at any point

As illustrated in the diagram below, there are several segments of communications through the following components:

- Network access points such as Azure Front Door
- Azure App Gateway
- F5 BIG-IP Local Traffic Manager
- Azure API Management
- Apigee API Management Spring Boot apps and Backend systems such as databases, messaging and eventing systems, and app cache.

You can secure communications end-to-end or terminate transport-level security at any communication point for Spring Boot apps.

:::image type="content" source="media/secure-communications-end-to-end/architecture-diagram.jpg" alt-text="Diagram showing the architecture of end-to-end secure communications for Spring Boot apps." lightbox="media/secure-communications-end-to-end/architecture-diagram.jpg":::

The following sections describe this architecture in more detail.

### Segment 1: Secure communications into Azure Spring Apps

The first segment (segment 1 in the diagram) represents communications from consumers to the ingress controller in Azure Spring Apps. These consumers include browsers, mobile phones, desktops, kiosks, or network access points like Azure Front Door, Azure App Gateway, F5 BIG-IP Local Traffic Manager, Azure API Management, and Apigee API Management.

By default, this segment is secured using a Microsoft-supplied TLS/SSL certificate for the `*.azuremicroservices.io` domain. You can apply your own TLS/SSL certificate in Azure Key Vault by binding a custom domain to your app in Azure Spring Apps. No code is necessary. For more information, see [Tutorial: Map an existing custom domain to Azure Spring Apps](how-to-custom-domain.md).

### Segment 2: Secure communications from ingress controller to apps

The next segment (segment 2 in the diagram) represents communications from the Azure Spring Apps ingress controller to any app on Azure Spring Apps. You can enable TLS/SSL to secure traffic from the ingress controller to an app that supports HTTPS. For more information, see [Enable ingress-to-app TLS for an application](how-to-enable-ingress-to-app-tls.md).

A Spring Boot app can use Spring's approach to enable HTTPS, or the app can secure communications by using the Azure Key Vault Certificates Spring Boot Starter. For more information, see [Tutorial: Secure Spring Boot apps using Azure Key Vault certificates](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates).

You need the following three configuration steps to secure communications using a TLS/SSL certificate from an Azure Key Vault. No code is necessary.

1. Include the following Azure Key Vault Certificates Spring Boot Starter dependency in your *pom.xml* file:

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>azure-spring-boot-starter-keyvault-certificates</artifactId>
   </dependency>
   ```

1. Add the following properties to configure an app to load a TLS/SSL certificate from Azure Key Vault. Be sure to specify the URI of the Azure Key Vault and the certificate name.

   ```properties
   azure:
     keyvault:
       uri: ${KEY_VAULT_URI}
   
   server:
     ssl:
       key-alias: ${SERVER_SSL_CERTIFICATE_NAME}
       key-store-type: AzureKeyVault
   ```

1. Enable the app's managed identity, and then grant the managed identity with "Get" and "List" access to the Azure Key Vault. For more information, see [Enable system-assigned managed identity for an application in Azure Spring Apps](how-to-enable-system-assigned-managed-identity.md) and [Certificate Access Control](../key-vault/certificates/certificate-access-control.md).

### Segment 3: Secure communications from app to managed middleware

The next segment (segment 3 in the diagram) represents communications from any app to the managed Spring Cloud Config Server and Spring Cloud Service Registry in Azure Spring Apps. By default, this segment is secured using a Microsoft-supplied TLS/SSL certificate.

### Segment 4: Secure app to app communications

The next segment (segment 4 in the diagram) represents communications between an app to another app in Azure Spring Apps. You can use the Azure Key Vault Certificates Spring Boot Starter to configure the caller app to trust the TLS/SSL certificate supplied by an HTTPS-enabled called app. The receiver Spring Boot app can use Spring's approach to enable HTTPS, or the app can secure communications by using the Azure Key Vault Certificates Spring Boot Starter. For more information, see [Tutorial: Secure Spring Boot apps using Azure Key Vault certificates](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates).

### Segment 5: Secure app to external system communications

The next segment (segment 5 in the diagram) represents communications between an app running in Azure Spring Apps and external systems. You can use the Azure Key Vault Certificates Spring Boot Starter to configure the app running in Azure Spring Apps to trust the TLS/SSL certificate supplied by any external systems. For more information, see [Tutorial: Secure Spring Boot apps using Azure Key Vault certificates](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates).

### Implicitly load TLS/SSL certificates from Key Vault into an app

If your Spring code, Java code, or open-source libraries, such as OpenSSL, rely on the JVM default JCA chain to implicitly load certificates into the JVM's trust store, then you can import your TLS/SSL certificates from Key Vault into Azure Spring Apps and use those certificates within the app. For more information, see [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).

### Upload well known public TLS/SSL certificates for backend systems

For an app to communicate to backend services in the cloud or in on-premises systems, it may require the use of public TLS/SSL certificates to secure communication. You can upload those TLS/SSL certificates for securing outbound communications. For more information, see [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).

### Automate provisioning and configuration for securing communications

Using an ARM Template, Bicep, or Terraform, you can automate the provisioning and configuration of all the Azure resources mentioned above for securing communications.

## Build your solutions and secure communications

Azure Spring Apps is a fully managed service for Spring Boot applications. Azure Spring Apps abstracts away the complexity of infrastructure and Spring Cloud middleware management from users. You can focus on building your business logic and let Azure take care of dynamic scaling, patches, security, compliance, and high availability. With a few steps, you can provision Azure Spring Apps, create applications, deploy, and scale Spring Boot applications, and start securing communications in minutes.

Azure Spring Apps is jointly built, operated, and supported by Microsoft and VMware.

## Next steps

- [Deploy Spring microservices to Azure](/training/modules/azure-spring-cloud-workshop/)
- [Azure Key Vault Certificates Spring Cloud Azure Starter (GitHub.com)](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/spring-cloud-azure-starter-keyvault-certificates/pom.xml)
- [Azure Spring Apps reference architecture](reference-architecture.md)
- Migrate your [Spring Boot](/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps), [Spring Cloud](/azure/developer/java/migration/migrate-spring-cloud-to-azure-spring-apps), and [Tomcat](/azure/developer/java/migration/migrate-tomcat-to-azure-spring-apps) applications to Azure Spring Apps
