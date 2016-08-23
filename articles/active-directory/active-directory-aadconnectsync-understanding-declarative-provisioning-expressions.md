<properties
	pageTitle="Azure AD Connect sync: Understanding Declarative Provisioning Expressions | Microsoft Azure"
	description="Explains the declarative provisioning expressions."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/23/2016"
	ms.author="markusvi;andkjell"/>


# Azure AD Connect sync: Understanding Declarative Provisioning Expressions
Azure AD Connect sync builds on declarative provisioning first introduced in Forefront Identity Manager 2010 to allow you to implement your complete identity integration business logic without the need to write compiled code.

An essential part of declarative provisioning is the expression language used in attribute flows. The language used is a subset of Microsoft® Visual Basic® for Applications (VBA). This language is used in Microsoft Office and users with experience of VBScript will also recognize it. The Declarative Provisioning Expression Language is only using functions and is not a structured language; there are no methods or statements. Functions are instead nested to express program flow.

For more details, see [Welcome to the Visual Basic for Applications language reference for Office 2013](https://msdn.microsoft.com/library/gg264383.aspx).

The attributes are strongly typed. A function will only accept attributes of the correct type. It is also case sensitive. Both function names and attribute names must have proper casing or an error will be thrown

## Language definitions and Identifiers

- Functions have a name followed by arguments in brackets: FunctionName(argument 1,argument N).
- Attributes are identified by square brackets: [attributeName]
- Parameters are identified by percent signs: %ParameterName%
- String constants are surrounded by quotes: E.g. "Contoso" (Note: must use straight quotes "" and not smart quotes  “”)
- Numeric values are expressed without quotes and expected to be decimal. Hexadecimal values are prefixed with &H. E.g. 98052, &HFF
- Boolean values are expressed with constants: True, False.
- Built-in constants and literals are expressed with only their name: NULL, CRLF, IgnoreThisFlow

### Functions
Declarative provisioning use many functions to enable the possibility to transform attribute values. These can be nested so the result from one function is passed in to another function.

`Function1(Function2(Function3()))`

The complete list of functions can be found in the [function reference](active-directory-aadconnectsync-functions-reference.md).

### Parameters
A parameter is defined either by a Connector or by an administrator using PowerShell to set these. Parameters will usually contain values which will be different from system to system, e.g. the name of the domain the user is located in. These can be used in attribute flows.

The Active Directory Connector provided the following parameters for inbound Synchronization Rules:

| Parameter Name | Comment |
| --- | --- |
| Domain.Netbios | Netbios format of the domain currently being imported, for example FABRIKAMSALES |
| Domain.FQDN | FQDN format of the domain currently being imported, for example sales.fabrikam.com |
| Domain.LDAP | LDAP format of the domain currently being imported, for example DC=sales,DC=fabrikam,DC=com |
| Forest.Netbios | Netbios format of the forest name currently being imported, for example FABRIKAMCORP |
| Forest.FQDN | FQDN format of the forest name currently being imported, for example fabrikam.com |
| Forest.LDAP | LDAP format of the forest name currently being imported, for example DC=fabrikam,DC=com |

The system provides the following parameter, which is used to get the identifier of the Connector currently running:

`Connector.ID`

An example which will populate the metaverse attribute domain with the netbios name of the domain where the user is located:

`domain` <- `%Domain.Netbios%`

### Operators
The following operators can be used:

- **Comparison**: <, <=, <>, =, >, >=
- **Mathematics**: +, -, \*, -
- **String**: & (concatenate)
- **Logical**: && (and), || (or)
- **Evaluation order**: ( )

Operators are evaluated left to right and have the same evaluation priority. That is, the \* (multiplier) is not evaluated before - (subtraction). 2\*(5+3) is not the same as 2\*5+3. The brackets ( ) are used to change the evaluation order when a left to right evaluation order isn't appropriate.

## Multi-valued attributes

### Attribute flows for multi-valued attributes
The functions can operate on both single-valued and multi-valued attributes. For multi-valued attributes, the function operates over every value and applies the same function to every value.

For example:  
`Trim([proxyAddresses])` Do a Trim of every value in the proxyAddress attribute.  
`Word([proxyAddresses],1,"@") & "@contoso.com"` For every value with an @-sign, replace the domain with \@contoso.com.  
`IIF(InStr([proxyAddresses],"SIP:")=1,NULL,[proxyAddresses])` Look for the SIP-address and remove it from the values.

### Merging attribute values
In the attribute flows there is a setting to determine if multi-valued attributes should be merged from several different Connectors. The default value is **Update**, which indicates that the sync rule with highest precedence should win.

![Merge Types](./media/active-directory-aadconnectsync-understanding-declarative-provisioning-expressions/mergetype.png)  

There is also **Merge** and **MergeCaseInsensitive**. These options allow you to merge values from different sources. For example it can be used to merge the member or proxyAddresses attribute from several different forests. When you use this option, all sync rules in scope for an object must use the same merge type. You cannot define **Update** from one Connector and **Merge** from another. If you try, you will get an error.

The difference between **Merge** and **MergeCaseInsensitive** is how to process duplicate attribute values. The sync engine makes sure duplicate values are not inserted into the target attribute. With **MergeCaseInsensitive** duplicate values with only a difference in case are not going to be present. For example, you will not see both "SMTP:bob@contoso.com" and "smtp:bob@contoso.com" in the target attribute. **Merge** is only looking at the exact values and multiple values where there only is a difference in case might be present.

The option **Replace** is the same as **Update**, but it is not used.

## Additional Resources

[Azure AD Connect sync: Functions Reference](active-directory-aadconnectsync-functions-reference.md)
[Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
[Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
