---
  title: Communication Security: Threat Modeling Tool | Microsoft Docs
  description: mitigations for threats exposed in the Threat Modeling Tool 
  services: ''
  documentationcenter: ''
  author: rodsan
  manager: rodsan
  editor: rodsan

  ms.assetid: 
  ms.service: security
  ms.workload: na
  ms.tgt_pltfrm: na
  ms.devlang: na
  ms.topic: article
  ms.date: 02/04/2017
  ms.author: rodsan
---

# Security Frame: Communication Security | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| Azure Event Hub | <ul><li>[Secure communication to Event Hub using SSL/TLS](#comm-ssltls)</li></ul> |
| Dynamics CRM | <ul><li>[Check service account privileges and check that the custom Services or ASP.NET Pages respect CRM's security](#priv-aspnet)</li></ul> |
| Azure Data Factory | <ul><li>[Use Data managent gateway while connecting On Prem SQL Server to Azure Data Factory](#sqlserver-factory)</li></ul> |
| Identity Server | <ul><li>[Ensure that all traffic to Identity Server is over HTTPS connection](#identity-https)</li></ul> |
| Web Application | <ul><li>[Verify X.509 certificates used to authenticate SSL, TLS, and DTLS connections](#x509-ssltls)</li><li>[Configure SSL certificate for custom domain in Azure App Service](#ssl-appservice)</li><li>[Force all traffic to Azure App Service over HTTPS connection](#appservice-https)</li><li>[Enable HTTP Strict Transport Security (HSTS)](#http-hsts)</li></ul> |
| Database | <ul><li>[Ensure SQL server connection encryption and certificate validation](#sqlserver-validation)</li><li>[Force Encrypted communication to SQL server](#encrypted-sqlserver)</li></ul> |
| Azure Storage | <ul><li>[Ensure that communication to Azure Storage is over HTTPS](#comm-storage)</li><li>[Validate MD5 hash after downloading blob if HTTPS cannot be enabled](#md5-https)</li><li>[Use SMB 3.0 compatible client to ensure in-transit data encryption to Azure File Shares](#smb-shares)</li></ul> |
| Mobile Client | <ul><li>[Implement Certificate Pinning](#cert-pinning)</li></ul> |
| WCF | <ul><li>[Enable HTTPS - Secure Transport channel](#https-transport)</li><li>[WCF: Set Message security Protection level to EncryptAndSign](#message-protection)</li><li>[WCF: Use a least-privileged account to run your WCF service](#least-account-wcf)</li></ul> |
| Web API | <ul><li>[Force all traffic to Web APIs over HTTPS connection](#webapi-https)</li></ul> |
| Azure Redis Cache | <ul><li>[Ensure that communication to Azure Redis Cache is over SSL](#redis-ssl)</li></ul> |
| IoT Field Gateway | <ul><li>[Secure Device to Field Gateway communication](#device-field)</li></ul> |
| IoT Cloud Gateway | <ul><li>[Secure Device to Cloud Gateway communication using SSL/TLS](#device-cloud)</li></ul> |

# Mitigations

## <a id="comm-ssltls"></a>Secure communication to Event Hub using SSL/TLS

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Event Hub | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="priv-aspnet"></a>Check service account privileges and check that the custom Services or ASP.NET Pages respect CRM's security

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="sqlserver-factory"></a>Use Data managent gateway while connecting On Prem SQL Server to Azure Data Factory

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Data Factory | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="identity-https"></a>Ensure that all traffic to Identity Server is over HTTPS connection

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Identity Server | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="x509-ssltls"></a>Verify X.509 certificates used to authenticate SSL, TLS, and DTLS connections

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="ssl-appservice"></a>Configure SSL certificate for custom domain in Azure App Service

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="appservice-https"></a>Force all traffic to Azure App Service over HTTPS connection

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="http-hsts"></a>Enable HTTP Strict Transport Security (HSTS)

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="sqlserver-validation"></a>Ensure SQL server connection encryption and certificate validation

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="encrypted-sqlserver"></a>Force Encrypted communication to SQL server

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="comm-storage"></a>Ensure that communication to Azure Storage is over HTTPS

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="md5-https"></a>Validate MD5 hash after downloading blob if HTTPS cannot be enabled

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="smb-shares"></a>Use SMB 3.0 compatible client to ensure in-transit data encryption to Azure File Shares

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cert-pinning"></a>Implement Certificate Pinning

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Mobile Client | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="https-transport"></a>Enable HTTPS - Secure Transport channel

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="message-protection"></a>WCF: Set Message security Protection level to EncryptAndSign

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="least-account-wcf"></a>WCF: Use a least-privileged account to run your WCF service

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="webapi-https"></a>Force all traffic to Web APIs over HTTPS connection

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="redis-ssl"></a>Ensure that communication to Azure Redis Cache is over SSL

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Redis Cache | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="device-field"></a>Secure Device to Field Gateway communication

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Field Gateway | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="device-cloud"></a>Secure Device to Cloud Gateway communication using SSL/TLS

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Cloud Gateway | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |
