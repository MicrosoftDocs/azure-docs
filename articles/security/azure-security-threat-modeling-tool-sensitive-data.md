---
  title: Sensitive Data: Threat Modeling Tool | Microsoft Docs
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

# Security Frame: Sensitive Data | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| Machine Trust Boundary | <ul><li>[Ensure that binaries are obfuscated if they contain sensitive information](#binaries-info)</li><li>[Consider using Encrypted File System (EFS) is used to protect confidential user-specific data](#efs-user)</li><li>[Ensure that sensitive data stored by the application on the file system is encrypted](#filesystem)</li></ul> | 
| Web Application | <ul><li>[Ensure that sensitive content is not cached on the browser](#cache-browser)</li><li>[Encrypt sections of Web App's configuration files that contain sensitive data](#encrypt-data)</li><li>[Explicitly disable the autocomplete HTML attribute in sensitive forms and inputs](#autocomplete-input)</li><li>[Ensure that sensitive data displayed on the user screen is masked](#data-mask)</li></ul> | 
| Database | <ul><li>[Implement dynamic data masking to limit sensitive data exposure non privileged users](#dynamic-users)</li><li>[Ensure that passwords are stored in salted hash format](#salted-hash)</li><li>[ Ensure that sensitive data in database columns is encrypted](#db-encrypted)</li><li>[Ensure that database-level encryption (TDE) is enabled](#tde-enabled)</li><li>[Ensure that database backups are encrypted](#backup)</li></ul> | 
| Web API | <ul><li>[Ensure that sensitive data relevant to Web API is not stored in browser's storage](#api-browser)</li></ul> | 
| Azure Document DB | <ul><li>[Encrypt sensitive data stored in DocumentDB](#encrypt-docdb)</li></ul> | 
| Azure IaaS VM Trust Boundary | <ul><li>[Use Azure Disk Encryption to encrypt disks used by Virtual Machines](#disk-vm)</li></ul> | 
| Service Fabric Trust Boundary | <ul><li>[Encrypt secrets in Service Fabric applications](#fabric-apps)</li></ul> | 
| Dynamics CRM | <ul><li>[Perform security modeling and use Business Units/Teams where required](#modeling-teams)</li><li>[Minimize access to share feature on critical entities](#entities)</li><li>[Train users on the risks associated with the Dynamics CRM Share feature and good security practices](#good-practices)</li><li>[Include a development standards rule proscribing showing config details in exception management](#exception-mgmt)</li></ul> | 
| Dynamics CRM Mobile Client | <ul><li>[Ensure a device management policy is in place that requires a use PIN and allows remote wiping](#pin-remote)</li></ul> | 
| Azure Storage | <ul><li>[Use Azure Storage Service Encryption (SSE) for Data at Rest (Preview)](#sse-preview)</li><li>[Use Client-Side Encryption to store sensitive data in Azure Storage](#client-storage)</li></ul> | 
| Mobile Client | <ul><li>[Encrypt sensitive or PII data written to phones local storage](#pii-phones)</li><li>[Obfuscate generated binaries before distributing to end users](#binaries-end)</li></ul> | 
| WCF | <ul><li>[ Set clientCredentialType to Certificate or Windows](#cert)</li><li>[WCF-Security Mode is not enabled](#security)</li></ul> | 

# Mitigations

## <a id="binaries-info"></a>Ensure that binaries are obfuscated if they contain sensitive information

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Machine Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="efs-user"></a>Consider using Encrypted File System (EFS) is used to protect confidential user-specific data

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Machine Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="filesystem"></a>Ensure that sensitive data stored by the application on the file system is encrypted

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Machine Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cache-browser"></a>Ensure that sensitive content is not cached on the browser

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="encrypt-data"></a>Encrypt sections of Web App's configuration files that contain sensitive data

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="autocomplete-input"></a>Explicitly disable the autocomplete HTML attribute in sensitive forms and inputs

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="data-mask"></a>Ensure that sensitive data displayed on the user screen is masked

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="dynamic-users"></a>Implement dynamic data masking to limit sensitive data exposure non privileged users

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="salted-hash"></a>Ensure that passwords are stored in salted hash format

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="db-encrypted"></a>Ensure that sensitive data in database columns is encrypted

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="tde-enabled"></a>Ensure that database-level encryption (TDE) is enabled

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="backup"></a>Ensure that database backups are encrypted

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="api-browser"></a>Ensure that sensitive data relevant to Web API is not stored in browser's storage

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="encrypt-docdb"></a>Encrypt sensitive data stored in DocumentDB

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Document DB | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="disk-vm"></a>Use Azure Disk Encryption to encrypt disks used by Virtual Machines

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure IaaS VM Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="fabric-apps"></a>Encrypt secrets in Service Fabric applications

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Service Fabric Trust Boundary | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="modeling-teams"></a>Perform security modeling and use Business Units/Teams where required

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="entities"></a>Minimize access to share feature on critical entities

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="good-practices"></a>Train users on the risks associated with the Dynamics CRM Share feature and good security practices

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="exception-mgmt"></a>Include a development standards rule proscribing showing config details in exception management

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="pin-remote"></a>Ensure a device management policy is in place that requires a use PIN and allows remote wiping

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM Mobile Client | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="sse-preview"></a>Use Azure Storage Service Encryption (SSE) for Data at Rest (Preview)

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="client-storage"></a>Use Client-Side Encryption to store sensitive data in Azure Storage

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Storage | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="pii-phones"></a>Encrypt sensitive or PII data written to phones local storage

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Mobile Client | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="binaries-end"></a>Obfuscate generated binaries before distributing to end users

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Mobile Client | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="cert"></a>Set clientCredentialType to Certificate or Windows

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="security"></a>WCF-Security Mode is not enabled

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |