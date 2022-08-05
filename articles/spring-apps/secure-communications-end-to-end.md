---
title: App status in Azure Spring Apps
description: Learn the app status categories in Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 08/05/2022
ms.author: asirveda
ms.custom: devx-track-java
---

# Secure communications end-to-end for Spring Boot apps in a Zero Trust environment

Today, we are excited to announce the general availability of all the features to secure communications end-to-end for Spring Boot apps – in a Zero Trust environment. You can secure communications end-to-end or terminate transport-level security at any communication point for Spring Boot apps. You can also automate the provisioning and configuration for all the Azure resources needed for securing communications.

Implementing secure communications as part of your solution architecture can be challenging. Many customers manually rotate their certificates or create their own solutions to automate provisioning and configuration. Even then, there is still data exfiltration risk – say unauthorized copying or transfer of data from server systems. With Azure Spring Cloud, all of this is handled for you; there is no need to figure out the difficult details. Azure Spring Cloud abstracts away most of the complexity, leaving secure communications as configurable and automatable options in the service.

“Implementing end-to-end encryption and Zero Trust has been at the top of the list of security requirements for our new API platform. Neither requirement was ever achievable on our old platform. Azure Spring Cloud, and its built-in integrations with services like Azure Key Vault and Managed Identities, will finally help us to meet those requirements in an easily automated and manageable way.” – Claus Lund, Infrastructure Engineering Lead, National Life Group

“For Liantis, having secure end-to-end communications is a non-negotiable in our line of business dealing with very sensitive financial, medical, and payroll data. Again, Azure Spring Cloud delivers on its promise to abstract most of the complexity, reduce the operational overhead associated with certificate provisioning, configuration, and certificate rotation in a seamless way using a simple and straightforward integration with Azure Key Vault.” - Kurt Roggen, Infrastructure and Security Architect, Liantis

## Secure Internet communications

The TLS/SSL protocol establishes identity and trust and encrypts communications of all types, making secure communications possible - particularly Web traffic carrying commerce data and personally identifiable information.

You can use any type of SSL certificate – certificates issued by a certificate authority, extended validation certificate, wildcard certificates with support for any number of sub-domains, or self-signed certificates for dev and testing environments.

## Zero Trust – securely load certificates

Based on the principle of "never trust, always verify and credential-free", Zero Trust helps to secure all communications by eliminating unknown and un-managed certificates, and only trust certificates that are shared by verifying identity prior to granting access to those certificates.

To securely load certificates from Azure Key Vault, Spring Boot apps use managed identities and Azure role-based access control, and Azure Spring Cloud uses a provider service principal and Azure role-based access control. This secure loading is powered using the Azure Key Vault JCA (Java Cryptography Architecture) Provider.

With Azure Key Vault:

You control the storage and distribution of certificates to reduce accidental leakage.
Applications and services can securely access certificates. Key Vault uses Azure role-based access control to lock down access to only those requiring access, such as an admin of course, but also for apps using the principle of least privilege. Applications and service authenticate and authorize, using Azure Active Directory and Azure role-based access control, to access certificates.
You can monitor the access and use of certificates in Key Vault through its full audit trail.

Secure communications end-to-end or terminate TLS at any point

As illustrated in the diagram below, there are several segments of communications through:

Network access points such as Azure Front Door, Azure App Gateway, F5 BIG-IP Local Traffic Manager, Azure API Management, and Apigee API Management
Spring Boot apps and
Backend systems such as databases, messaging and eventing systems, and app cache.

You can secure communications end-to-end or terminate transport-level security at any communication point for Spring Boot apps.

:::image type="content" source="media/secure-communications-end-to-end/architecture-diagram.jpg" alt-text="Diagram showing the architecture of end-to-end secure communications for Spring Boot apps." lightbox="media/secure-communications-end-to-end/architecture-diagram.jpg":::

## Securing communications into Azure Spring Cloud

Segment 1 represents securing communications from consumers - like browsers, mobile phones, desktops, kiosks, or network access points like Azure Front Door, Azure App Gateway, F5 BIG-IP Local Traffic Manager, Azure API Management, and Apigee API Management - to the ingress controller in Azure Spring Cloud.

By default, segment 1 is secured using a Microsoft-supplied SSL certificate for the *.azuremicroservices.io domain. You can apply your own SSL certificate in Azure Key Vault by binding a custom domain to your app in Azure Spring Cloud. No code is necessary.

Securing communications from ingress controller to apps

Segment 2 represents securing communications from Azure Spring Cloud’s ingress controller to any app on Azure Spring Cloud. You can enable TLS/SSL to secure traffic from the ingress controller to an app that supports HTTPS.

A Spring Boot app can use Spring’s approach to enable HTTPS or secure communications by using the Azure Key Vault Certificates Spring Boot Starter – in three configuration steps to secure communications using an SSL certificate from an Azure Key Vault. No code is necessary.

Step 1 – Include the Azure Key Vault Certificates Spring Boot Starter:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-boot-starter-keyvault-certificates</artifactId>
</dependency>
```

Step 2 – Configure an app to load an SSL certificate from Azure Key Vault by specifying the URI of the Azure Key Vault and the certificate name:

```properties
azure:
  keyvault:
    uri: ${KEY_VAULT_URI}

server:
  ssl:
    key-alias: ${SERVER_SSL_CERTIFICATE_NAME}
    key-store-type: AzureKeyVault
```

Step 3 – Enable the app’s managed identity and grant the managed identity with “Get” and “List” access to the Azure Key Vault

## Securing communications from app to managed middleware

Segment 3 represents communications from any app to the managed Spring Cloud Config Server and Spring Cloud Service Registry in Azure Spring Cloud. By default, segment 3 is secured using a Microsoft-supplied SSL certificate.

## Securing app to app communications

Segment 4 represents communications between an app to another app in Azure Spring Cloud.

You can configure the caller app using the Azure Key Vault Certificates Spring Boot Starter to trust the SSL certificate supplied by an HTTPS-enabled called app.

The receiver Spring Boot app can use Spring’s approach to enable HTTPS or secure communications by using the Azure Key Vault Certificates Spring Boot Starter.

## Securing app to external system communications

Segment 5 represents communications between an app running in Azure Spring Cloud and external systems. You can configure the app running in Azure Spring Cloud to trust the SSL certificate supplied by any external systems - using the Azure Key Vault Certificates Spring Boot Starter.

## Implicitly load SSL certificates from Key Vault into an app

If your Spring code, Java code, or open-source libraries, such as openssl,  rely on the JVM default JCA chain to implicitly load certificates into the JVM’s trust store, then you can import your SSL certificates from Key Vault into Azure Spring Cloud and use those certificates within the app.

## Upload well known public SSL certificates for backend systems

For an app to communicate to backend services in the cloud or in on-premises systems, it may require the use of public SSL certificates to secure communication. You can upload those SSL certificates for securing outbound communications.

## Automate provisioning and configuration for securing communications

Using an ARM Template, Bicep, or Terraform, you can automate the provisioning and configuration of all the Azure resources mentioned above for securing communications.

## Build your solutions and secure communications today!

Azure Spring Cloud is a fully managed service for Spring Boot applications. It abstracts away the complexity of infrastructure and Spring Cloud middleware management from users. So, you can focus on building your business logic and let Azure take care of dynamic scaling, patches, security, compliance, and high availability. With a few steps, you can provision Azure Spring Cloud, create applications, deploy, and scale Spring Boot applications, and start securing communications in minutes.

Azure Spring Cloud is jointly built, operated, and supported by Microsoft and VMware.

We will continue to bring more developer-friendly and enterprise-ready features to Azure Spring Cloud. We would love to hear how you are building impactful solutions using Azure Spring Cloud …

Deploy Spring Boot apps to Azure Spring Cloud and secure communications end-to-end!

## Get started today

Learn using an MS Learn module or self-paced workshop on GitHub
Deploy a distributed version of the Spring Petclinic application
Learn more about implementing solutions on Azure Spring Cloud

## Secure communications end-to-end for Spring Boot apps

Bind custom domain to an app in Azure Spring Cloud
Secure traffic from ingress controller to an app in Azure Spring Cloud
Azure Key Vault Certificates Spring Boot Starter
Azure Key Vault Certificates Spring Boot Starter (GitHub.com)
Azure Key Vault JCA (Java Cryptography Architecture) Provider

## Additional Resources

Deploy Spring Boot applications by leveraging enterprise best practices – Azure Spring Cloud Reference Architecture
Migrate your Spring Boot, Spring Cloud, and Tomcat applications to Azure Spring Cloud
Wire Spring applications to interact with Azure services
For feedback and questions, please e-mail us.
