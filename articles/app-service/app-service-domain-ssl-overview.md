---
title: Custom Domains & SSL Overview
description: A technical roadmap for configuring custom domains and SSL/TLS in Azure App Service. Covers domain purchase, DNS mapping, certificate binding, and advanced security configurations.
keywords: Azure App Service, custom domain, SSL, TLS, HTTPS, DNS mapping, certificate binding, security configuration

ms.service: azure-app-service
ms.topic: overview
ms.date: 02/14/2025
ms.custom: mvc
ms.author: msangapu
author: msangapu-msft
#customer intent: As an Azure App Service user, I want to learn about custom domains and SSL, so I can configure it for my own apps.
---

# Azure App Service domain name & SSL journey

Building a secure and professional web presence with Azure App Service involves several important steps — from acquiring your domain name to ensuring your site is accessible via HTTPS. This guide is designed to be your main entry point into custom domains and SSL on Azure App Service.

A series of common scenarios are listed below. Each scenario is linked to detailed tutorials that provide step-by-step instructions, helping you move seamlessly from one step to the next. Use the table below to quickly identify your situation and find the right guidance for your domain name and SSL journey.

This document provides a technical roadmap for configuring custom domains and SSL/TLS on Azure App Service. The table below outlines common scenarios, the required actions, and links to detailed documentation for each step.

| **Scenario** | **Situation** | **Action** | **Reference** |
|--------------|---------------|------------|---------------|
| **1. Domain Acquisition** | No domain available; a domain must be acquired. | Purchase a domain via Azure and update DNS settings. | [Buy and Configure a Domain Name](https://learn.microsoft.com/en-us/azure/app-service/manage-custom-dns-buy-domain) |
| **2. DNS Mapping** | Domain available; needs mapping to App Service. | Update DNS records (A record/CNAME) to point to the App Service. | [Map an Existing Custom DNS Name to Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain?tabs=root%2Cazurecli) |
| **3. SSL/TLS Binding** | Domain mapped; requires HTTPS for secure communication. | Obtain and bind an SSL/TLS certificate to the domain. | [Secure a Custom Domain with TLS/SSL](https://learn.microsoft.com/en-us/azure/app-service/tutorial-secure-domain-certificate) |
| **4. Certificate Management** | Ongoing management and renewal of SSL certificates. | Purchase, manage, and renew certificates within Azure. | [Buy and Manage App Service Certificates](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate?tabs=apex%2CRBAC) |
| **5. SSL Certificate Binding** | Certificate available; binding required to enforce HTTPS. | Bind the certificate via the Azure portal. | [Add a TLS/SSL Certificate in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-bindings) |
| **6. Protocol Fundamentals** | Need to understand encryption protocols for secure communications. | Study the technical details and evolution of TLS/SSL. | [Overview of TLS/SSL in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview-tls) |
| **7. Advanced Integration** | Advanced scenarios: code-level integration or mutual authentication required. | Integrate SSL/TLS in application code; configure mutual TLS if needed. | [Use a TLS/SSL Certificate in Your Application Code](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate-in-code?tabs=linux) <br><br> [Configure TLS Mutual Authentication in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-configure-tls-mutual-auth?tabs=azureportal%2Cflask) |
| **8. Global Optimization** | App serves a global audience; high availability is critical. | Implement Azure Traffic Manager for efficient traffic distribution. | [Use Traffic Manager with a Custom Domain for Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-domain-traffic-manager) |
| **9. Domain Migration** | Domain is managed externally; migration to Azure is desired. | Update DNS and transfer domain management to Azure App Service. | [Migrate an Active Domain to Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/manage-custom-dns-migrate-domain) |

Use this roadmap to identify your current configuration requirements and refer to the appropriate guide for detailed, step-by-step instructions.