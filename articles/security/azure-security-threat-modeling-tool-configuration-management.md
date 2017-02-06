---
  title: Configuration Management: Threat Modeling Tool | Microsoft Docs
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
  ms.date: 02/06/2017
  ms.author: rodsan
---

# Security Frame: Configuration Management | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| Web Application | <ul><li>[Implement Content Security Policy (CSP), and disable inline javascript](#csp-js)</li><li>[Enable browser's XSS filter](#xss-filter)</li><li>[ASP.NET applications must disable tracing and debugging prior to deployment](#trace-deploy)</li><li>[Access third party javascripts from trusted sources only](#js-trusted)</li><li>[Ensure that authenticated ASP.NET pages incorporate UI Redressing or clickjacking defenses](#ui-defenses)</li><li>[Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web Applications](#cors-aspnet)</li><li>[Enable ValidateRequest attribute on ASP.NET Pages](#validate-aspnet)</li><li>[Use locally-hosted latest versions of JavaScript libraries](#local-js)</li><li>[Disable automatic MIME sniffing](#mime-sniff)</li><li>[Remove standard server headers on Windows Azure Web Sites to avoid fingerprinting](#standard-finger)</li></ul> |
| Database | <ul><li>[Configure a Windows Firewall for Database Engine Access](#firewall-db)</li></ul> |
| Web API | <ul><li>[Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web API](#cors-api)</li><li>[Encrypt sections of Web API's configuration files that contain sensitive data](#config-sensitive)</li></ul> |
| IoT Device | <ul><li>[Ensure that all admin interfaces are secured with strong credentials](#admin-strong)</li><li>[Ensure that unknown code cannot execute on devices](#unknown-exe)</li><li>[Encrypt OS and additional partitions of IoT Device with Bitlocker](#partition-iot)</li><li>[Ensure that only the minimum services/features are enabled on devices](#min-enable)</li></ul> |
| IoT Field Gateway | <ul><li>[Encrypt OS and additional partitions of IoT Field Gateway with Bitlocker](#field-bitlocker)</li><li>[Ensure that the default login credentials of the field gateway are changed during installation](#default-change)</li></ul> |
| IoT Cloud Gateway | <ul><li>[Ensure that the Cloud Gateway implements a process to keep the connected devices firmware up to date](#cloud-firmware)</li></ul> |
| Machine Trust Boundary | <ul><li>[Ensure that devices have end point security controls configured as per organizational policies](#controls-policies)</li></ul> |
| Azure Storage | <ul><li>[Ensure secure management of Azure storage access keys](#secure-keys)</li><li>[Ensure that only trusted origins are allowed if CORS is enabled on Azure storage](#cors-storage)</li></ul> |
| WCF | <ul><li>[Enable WCF's service throttling feature](#throttling)</li><li>[WCF-Information disclosure through metadata](#info-metadata)</li></ul> | 

# Mitigations

## <a id="csp-js"></a>Implement Content Security Policy (CSP), and disable inline javascript

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="xss-filter"></a>Enable browser's XSS filter

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="trace-deploy"></a>ASP.NET applications must disable tracing and debugging prior to deployment

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="js-trusted"></a>Access third party javascripts from trusted sources only

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="ui-defenses"></a>Ensure that authenticated ASP.NET pages incorporate UI Redressing or clickjacking defenses

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cors-aspnet"></a>Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web Applications

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="validate-aspnet"></a>Enable ValidateRequest attribute on ASP.NET Pages

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="local-js"></a>Use locally-hosted latest versions of JavaScript libraries

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="mime-sniff"></a>Disable automatic MIME sniffing

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="standard-finger"></a>Remove standard server headers on Windows Azure Web Sites to avoid fingerprinting

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="firewall-db"></a>Configure a Windows Firewall for Database Engine Access

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cors-api"></a>Ensure that only trusted origins are allowed if CORS is enabled on ASP.NET Web API

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="config-sensitive"></a>Encrypt sections of Web API's configuration files that contain sensitive data

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="admin-strong"></a>Ensure that all admin interfaces are secured with strong credentials

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Device | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="unknown-exe"></a>Ensure that unknown code cannot execute on devices

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Device | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="partition-iot"></a>Encrypt OS and additional partitions of IoT Device with Bitlocker

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Device | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="min-enable"></a>Ensure that only the minimum services/features are enabled on devices

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Device | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="field-bitlocker"></a>Encrypt OS and additional partitions of IoT Field Gateway with Bitlocker

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Field Gateway | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="default-change"></a>Ensure that the default login credentials of the field gateway are changed during installation

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Field Gateway | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cloud-firmware"></a>Ensure that the Cloud Gateway implements a process to keep the connected devices firmware up to date

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Cloud Gateway | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="controls-policies"></a>Ensure that devices have end point security controls configured as per organizational policies

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Machine Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="secure-keys"></a>Ensure secure management of Azure storage access keys

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cors-storage"></a>Ensure that only trusted origins are allowed if CORS is enabled on Azure storage

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="throttling"></a>Enable WCF's service throttling feature

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="info-metadata"></a>WCF-Information disclosure through metadata

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |
