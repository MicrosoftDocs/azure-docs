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
| IoT Device | <ul><li>[Store Cryptographic Keys securely on IoT Device](#keys-iot)</li></ul> | 
| IoT Cloud Gateway | <ul><li>[Generate a random symmetric key of sufficient length for authentication to IoT Hub](#random-hub)</li></ul> | 
| Dynamics CRM Mobile Client | <ul><li>[Ensure a device management policy is in place that requires a use PIN and allows remote wiping](#pin-remote)</li></ul> | 

Ensure that binaries are obfuscated if they contain sensitive information    Machine Trust Boundary    Sensitive Data   

 Ensure that sensitive content is not cached on the browser    Web Application    Sensitive Data   
 Encrypt sections of Web App's configuration files that contain sensitive data    Web Application    Sensitive Data   
 Explicitly disable the autocomplete HTML attribute in sensitive forms and inputs    Web Application    Sensitive Data   
 Ensure that sensitive data displayed on the user screen is masked    Web Application    Sensitive Data   

 Implement dynamic data masking to limit sensitive data exposure non privileged users    Database    Sensitive Data   
 Ensure that passwords are stored in salted hash format    Database    Sensitive Data   
 Ensure that sensitive data in database columns is encrypted    Database    Sensitive Data   
 Ensure that database-level encryption (TDE) is enabled    Database    Sensitive Data   
 Ensure that database backups are encrypted    Database    Sensitive Data  

Ensure that sensitive data relevant to Web API is not stored in browser's storage    Web API    Sensitive Data   

 Encrypt sensitive data stored in DocumentDB    Azure Document DB    Sensitive Data   

 Use Azure Disk Encryption to encrypt disks used by Virtual Machines    Azure IaaS VM Trust Boundary    Sensitive Data   

 Encrypt secrets in Service Fabric applications    Service Fabric Trust Boundary    Sensitive Data   

 Perform security modelling and use Business Units/Teams where required    Dynamics CRM    Sensitive Data   
 Minimise access to share feature on critical entities    Dynamics CRM    Sensitive Data   
 Train users on the risks associated with the Dynamics CRM Share feature and good security practices    Dynamics CRM    Sensitive Data   
 Include a development standards rule proscribing showing config details in exception management outs...    Dynamics CRM    Sensitive Data   

 Consider using Encrypted File System (EFS) is used to protect confidential user-specific data    Machine Trust Boundary    Sensitive Data   
 Ensure that sensitive data stored by the application on the file system is encrypted    Machine Trust Boundary    Sensitive Data  

Use Azure Storage Service Encryption (SSE) for Data at Rest (Preview)    Azure Storage    Sensitive Data   
 Use Client-Side Encryption to store sensitive data in Azure Storage    Azure Storage    Sensitive Data   

 Encrypt sensitive or PII data written to phones local storage    Mobile Client    Sensitive Data   
Obfuscate generated binaries before distributing to end users
  Mobile Client    Sensitive Data   
 
 Set clientCredentialType to Certificate or Windows    WCF    Sensitive Data   
 WCF-Security Mode is not enabled    WCF    Sensitive Data  




# Mitigations

## <a id="cipher-length"></a>Use only approved symmetric block ciphers and key lengths

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |