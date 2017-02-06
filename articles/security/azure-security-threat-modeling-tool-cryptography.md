---
  title: Cryptography: Threat Modeling Tool | Microsoft Docs
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

# Security Frame: Cryptography | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| Web Application | <ul><li>[Use only approved symmetric block ciphers and key lengths](#cipher-length)</li><li>[Use approved block cipher modes and initialization vectors for symmetric ciphers](#vector-ciphers)</li><li>[Use approved asymmetric algorithms, key lengths, and padding](#padding)</li><li>[Use approved random number generators](#numgen)</li><li>[Do not use symmetric stream ciphers](#stream-ciphers)</li><li>[Use approved MAC/HMAC/keyed hash algorithms](#mac-hash)</li><li>[Use only approved cryptographic hash functions](#hash-functions)</li></ul> |
| Database | <ul><li>[Use strong encryption algorithms to encrypt data in the database](#strong-db)</li><li>[SSIS packages should be encrypted and digitally signed](#ssis-signed)</li><li>[Add digital signature to critical database securables](#securables-db)</li><li>[Use SQL server EKM to protect encryption keys](#ekm-keys)</li><li>[Use AlwaysEncrypted feature if encryption keys should not be revealed to Database engine](#keys-engine)</li></ul> |
| IoT Device | <ul><li>[Store Cryptographic Keys securely on IoT Device](#keys-iot)</li></ul> | 
| IoT Cloud Gateway | <ul><li>[Generate a random symmetric key of sufficient length for authentication to IoT Hub](#random-hub)</li></ul> | 
| Dynamics CRM Mobile Client | <ul><li>[Ensure a device management policy is in place that requires a use PIN and allows remote wiping](#pin-remote)</li></ul> | 
| Dynamics CRM Outlook Client | <ul><li>[Ensure a device management policy is in place that requires a PIN/password/auto lock and encrypts all data (e.g. Bitlocker)](#bitlocker)</li></ul> | 
| Identity Server | <ul><li>[Ensure that signing keys are rolled over when using Identity Server](#rolled-server)</li><li>[Ensure that cryptographically strong client id, client secret are used in Identity Server](#client-server)</li></ul> | 

# Mitigations

## <a id="cipher-length"></a>Use only approved symmetric block ciphers and key lengths

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="vector-ciphers"></a>Use approved block cipher modes and initialization vectors for symmetric ciphers

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="padding"></a>Use approved asymmetric algorithms, key lengths, and padding

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="numgen"></a>Use approved random number generators

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="stream-ciphers"></a>Do not use symmetric stream ciphers

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="mac-hash"></a>Use approved MAC/HMAC/keyed hash algorithms

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="hash-functions"></a>Use only approved cryptographic hash functions

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="strong-db"></a>Use strong encryption algorithms to encrypt data in the database

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="ssis-signed"></a>SSIS packages should be encrypted and digitally signed

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="securables-db"></a>Add digital signature to critical database securables

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="ekm-keys"></a>Use SQL server EKM to protect encryption keys

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="keys-engine"></a>Use AlwaysEncrypted feature if encryption keys should not be revealed to Database engine

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="keys-iot"></a>Store Cryptographic Keys securely on IoT Device

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Device | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="random-hub"></a>Generate a random symmetric key of sufficient length for authentication to IoT Hub

| #                       | #            |
| ----------------------- | ------------ |
| Component               | IoT Cloud Gateway | 
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

## <a id="bitlocker"></a>Ensure a device management policy is in place that requires a PIN/password/auto lock and encrypts all data (e.g. Bitlocker)

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Dynamics CRM Outlook Client | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="rolled-server"></a>Ensure that signing keys are rolled over when using Identity Server

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Identity Server | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="client-server"></a>Ensure that cryptographically strong client id, client secret are used in Identity Server

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Identity Server | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |