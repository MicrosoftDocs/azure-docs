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
| Web Application | <ul><li>[Disable XSLT scripting for all transforms using untrusted style sheets](#disable-xslt)</li><li>[Ensure that each page that could contain user controllable content opts out of automatic MIME sniffing](#out-sniffing)</li><li>[Harden or Disable XML Entity Resolution](#xml-resolution)</li><li>[Applications utilizing http.sys perform URL canonicalization verification](#app-verification)</li><li>[Ensure appropriate controls are in place when accepting files from users](#controls-users)</li><li>[Ensure that type-safe parameters are used in Web Application for data access](#typesafe)</li><li>[Use separate model binding classes or binding filter lists to prevent MVC mass assignment vulnerability](#binding-mvc)</li><li>[Encode untrusted web output prior to rendering](#rendering)</li><li>[Perform input validation and filtering on all string type Model properties](#typemodel)</li><li>[Sanitization should be applied on form fields that accept all characters e.g, rich text editor](#richtext)</li><li>[Do not assign DOM elements to sinks that do not have inbuilt encoding](#inbuilt-encode)</li><li>[Validate all redirects within the application are closed or done safely](#redirect-safe)</li><li>[Implement input validation on all string type parameters accepted by Controller methods](#string-method)</li><li>[Set upper limit timeout for regular expression processing to prevent DoS due to bad regular expressions](#dos-expression)</li><li>[Avoid using Html.Raw in Razor views](#html-razor)</li></ul> | 
| Database | <ul><li>[Do not use dynamic queries in stored procedures](#stored-proc)</li></ul> | 
| Web API | <ul><li>[Ensure that model validation is done on Web API methods](#validation-api)</li><li>[Implement input validation on all string type parameters accepted by Web API methods](#string-api)</li><li>[Ensure that type-safe parameters are used in Web API for data access](#typesafe-api)</li></ul> | 
| Azure Document DB | <ul><li>[Use parametrized SQL queries for DocumentDB](#sql-docdb)</li></ul> | 
| WCF | <ul><li>[WCF Input validation through Schema binding](#schema-binding)</li><li>[WCF- Input validation through Parameter Inspectors](#parameters)</li></ul> | 

# Mitigations

## <a id="disable-xslt"></a>Disable XSLT scripting for all transforms using untrusted style sheets

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="out-sniffing"></a>Ensure that each page that could contain user controllable content opts out of automatic MIME sniffing

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="xml-resolution"></a>Harden or Disable XML Entity Resolution

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="app-verification"></a>Applications utilizing http.sys perform URL canonicalization verification

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="controls-users"></a>Ensure appropriate controls are in place when accepting files from users

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="typesafe"></a>Ensure that type-safe parameters are used in Web Application for data access

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="binding-mvc"></a>Use separate model binding classes or binding filter lists to prevent MVC mass assignment vulnerability

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="rendering"></a>Encode untrusted web output prior to rendering

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="typemodel"></a>Perform input validation and filtering on all string type Model properties

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="richtext"></a>Sanitization should be applied on form fields that accept all characters e.g, rich text editor

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="inbuilt-encode"></a>Do not assign DOM elements to sinks that do not have inbuilt encoding

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="redirect-safe"></a>Validate all redirects within the application are closed or done safely

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="string-method"></a>Implement input validation on all string type parameters accepted by Controller methods

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="dos-expression"></a>Set upper limit timeout for regular expression processing to prevent DoS due to bad regular expressions

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="html-razor"></a>Avoid using Html.Raw in Razor views

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web Application | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="stored-proc"></a>Do not use dynamic queries in stored procedures

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Database | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="validation-api"></a>Ensure that model validation is done on Web API methods

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="string-api"></a>Implement input validation on all string type parameters accepted by Web API methods

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="typesafe-api"></a>Ensure that type-safe parameters are used in Web API for data access

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Web API | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="sql-docdb"></a>Use parametrized SQL queries for DocumentDB

| #                       | #            |
| ----------------------- | ------------ |
| Component               | Azure Document DB | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="schema-binding"></a>WCF Input validation through Schema binding

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |

## <a id="parameters"></a>WCF- Input validation through Parameter Inspectors

| #                       | #            |
| ----------------------- | ------------ |
| Component               | WCF | 
| SDL Phase               | Build |  
| Applicable Technologies | Generic |
| Attributes              | N/A  |
| References              | N/A  |