---
title: 'Azure AD Connect: Declarative Provisioning Expressions | Microsoft Docs'
description: Explains the declarative provisioning expressions.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.assetid: e3ea53c8-3801-4acf-a297-0fb9bb1bf11d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/18/2017
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect sync: Understanding Declarative Provisioning Expressions
Azure AD Connect sync builds on declarative provisioning first introduced in Forefront Identity Manager 2010. It allows you to implement your complete identity integration business logic without the need to write compiled code.

An essential part of declarative provisioning is the expression language used in attribute flows. The language used is a subset of Microsoft® Visual Basic® for Applications (VBA). This language is used in Microsoft Office and users with experience of VBScript will also recognize it. The Declarative Provisioning Expression Language is only using functions and is not a structured language. There are no methods or statements. Functions are instead nested to express program flow.

For more details, see [Welcome to the Visual Basic for Applications language reference for Office 2013](https://msdn.microsoft.com/library/gg264383.aspx).

The attributes are strongly typed. A function only accepts attributes of the correct type. It is also case-sensitive. Both function names and attribute names must have proper casing or an error is thrown.

## Language definitions and Identifiers
* Functions have a name followed by arguments in brackets: FunctionName(argument 1, argument N).
* Attributes are identified by square brackets: [attributeName]
* Parameters are identified by percent signs: %ParameterName%
* String constants are surrounded by quotes: For example, "Contoso" (Note: must use straight quotes "" and not smart quotes “”)
* Numeric values are expressed without quotes and expected to be decimal. Hexadecimal values are prefixed with &H. For example, 98052, &HFF
* Boolean values are expressed with constants: True, False.
* Built-in constants and literals are expressed with only their name: NULL, CRLF, IgnoreThisFlow

### Functions
Declarative provisioning uses many functions to enable the possibility to transform attribute values. These functions can be nested so the result from one function is passed in to another function.

`Function1(Function2(Function3()))`

The complete list of functions can be found in the [function reference](reference-connect-sync-functions-reference.md).

### Parameters
A parameter is defined either by a Connector or by an administrator using PowerShell. Parameters usually contain values that are different from system to system, for example the name of the domain the user is located in. These parameters can be used in attribute flows.

The Active Directory Connector provided the following parameters for inbound Synchronization Rules:

| Parameter Name | Comment |
| --- | --- |
| Domain.Netbios |Netbios format of the domain currently being imported, for example FABRIKAMSALES |
| Domain.FQDN |FQDN format of the domain currently being imported, for example sales.fabrikam.com |
| Domain.LDAP |LDAP format of the domain currently being imported, for example DC=sales,DC=fabrikam,DC=com |
| Forest.Netbios |Netbios format of the forest name currently being imported, for example FABRIKAMCORP |
| Forest.FQDN |FQDN format of the forest name currently being imported, for example fabrikam.com |
| Forest.LDAP |LDAP format of the forest name currently being imported, for example DC=fabrikam,DC=com |

The system provides the following parameter, which is used to get the identifier of the Connector currently running:  
`Connector.ID`

Here is an example that populates the metaverse attribute domain with the netbios name of the domain where the user is located:  
`domain` <- `%Domain.Netbios%`

### Operators
The following operators can be used:

* **Comparison**: <, <=, <>, =, >, >=
* **Mathematics**: +, -, \*, -
* **String**: & (concatenate)
* **Logical**: && (and), || (or)
* **Evaluation order**: ( )

Operators are evaluated left to right and have the same evaluation priority. That is, the \* (multiplier) is not evaluated before - (subtraction). 2\*(5+3) is not the same as 2\*5+3. The brackets ( ) are used to change the evaluation order when left to right evaluation order isn't appropriate.

## Multi-valued attributes
The functions can operate on both single-valued and multi-valued attributes. For multi-valued attributes, the function operates over every value and applies the same function to every value.

For example:  
`Trim([proxyAddresses])` Do a Trim of every value in the proxyAddress attribute.  
`Word([proxyAddresses],1,"@") & "@contoso.com"` For every value with an @-sign, replace the domain with @contoso.com.  
`IIF(InStr([proxyAddresses],"SIP:")=1,NULL,[proxyAddresses])` Look for the SIP-address and remove it from the values.

## Next steps
* Read more about the configuration model in [Understanding Declarative Provisioning](concept-azure-ad-connect-sync-declarative-provisioning.md).
* See how declarative provisioning is used out-of-box in [Understanding the default configuration](concept-azure-ad-connect-sync-default-configuration.md).
* See how to make a practical change using declarative provisioning in [How to make a change to the default configuration](how-to-connect-sync-change-the-configuration.md).

**Overview topics**

* [Azure AD Connect sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)

**Reference topics**

* [Azure AD Connect sync: Functions Reference](reference-connect-sync-functions-reference.md)

