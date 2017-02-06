---
  title: Input Validation: Threat Modeling Tool | Microsoft Docs
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

# Security Frame: Input Validation | Mitigations 
| Product/Service | Article |
| --------------- | ------- |
| IoT Device | <ul><li>[Store Cryptographic Keys securely on IoT Device](#keys-iot)</li></ul> | 
| IoT Cloud Gateway | <ul><li>[Generate a random symmetric key of sufficient length for authentication to IoT Hub](#random-hub)</li></ul> | 
| Dynamics CRM Mobile Client | <ul><li>[Ensure a device management policy is in place that requires a use PIN and allows remote wiping](#pin-remote)</li></ul> | 

Disable XSLT scripting for all transforms using untrusted style sheets    Web Application    Input Validation   
 Ensure that each page that could contain user controllable content opts out of automatic MIME sniffi...    Web Application    Input Validation   
 Harden or Disable XML Entity Resolution    Web Application    Input Validation   
 Applications utilizing http.sys perform URL canonicalization verification    Web Application    Input Validation   
 Ensure appropriate controls are in place when accepting files from users    Web Application    Input Validation   
 Ensure that type-safe parameters are used in Web Application for data access    Web Application    Input Validation   
 Use separate model binding classes or binding filter lists to prevent MVC mass assignment vulnerabil...    Web Application    Input Validation   
 Encode untrusted web output prior to rendering    Web Application    Input Validation   
 Perform input validation and filtering on all string type Model properties    Web Application    Input Validation  
 Sanitization should be applied on form fields that accept all characters e.g, rich text editor    Web Application    Input Validation   
 Do not assign DOM elements to sinks that do not have inbuilt encoding    Web Application    Input Validation  
 Validate all redirects within the application are closed or done safely    Web Application    Input Validation   
 Implement input validation on all string type parameters accepted by Controller methods    Web Application    Input Validation   
 Set upper limit timeout for regular expression processing to prevent DoS due to bad regular expressi...    Web Application    Input Validation   
 Avoid using Html.Raw in Razor views    Web Application    Input Validation   

 Do not use dynamic queries in stored procedures    Database    Input Validation  

Ensure that model validation is done on Web API methods    Web API    Input Validation   
 Implement input validation on all string type parameters accepted by Web API methods    Web API    Input Validation   
 Ensure that type-safe parameters are used in Web API for data access    Web API    Input Validation   

 Use parametrized SQL queries for DocumentDB    Azure Document DB    Input Validation   

WCF Input validation through Schema binding    WCF    Input Validation   
 WCF- Input validation through Parameter Inspectors    WCF    Input Validation  



# Mitigations

## <a id="cipher-length"></a>Use only approved symmetric block ciphers and key lengths

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |