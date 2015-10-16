<properties
	pageTitle="Azure AD Connect Sync: Understanding Declarative Provisioning Expressions | Microsoft Azure"
	description="Explains the declarative provisioning expressions."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2015"
	ms.author="markusvi"/>


# Azure AD Connect Sync: Understanding Declarative Provisioning Expressions

The Azure Active Directory Connect Synchronization Service (Azure AD Connect Sync) builds on the declarative provisioning first introduced in Forefront Identity Manager 2010 to allow you to implement your complete identity integration business logic without the need to write code.

An essential part of declarative provisioning is the expression language used in attribute flows. The language used is a subset of Microsoft® Visual Basic® for Applications (VBA). This language is used in Microsoft Office and users with experience of VBScript will also recognize it. The Declarative Provisioning Expression Language is only using functions and is not a structured language; there are no methods or statements. Functions will instead be nested to express program flow.

For more details, see [Welcome to the Visual Basic for Applications language reference for Office 2013](https://msdn.microsoft.com/library/gg264383(v=office.15).aspx).

The attributes are strongly typed. A function which expects a single-value string attribute will not accept multi-valued or attributes of a different type. It is also case sensitive. Both function names and attribute names must have proper casing or an error will be thrown





## Language definitions and Identifiers

- Functions have a name followed by arguments in brackets: FunctionName(<<argument 1>>,<<argument N>>).
- Attributes are identified by square brackets: [attributeName]
- Parameters are identified by percent signs: %ParameterName%
- String constants are surrounded by quotes: E.g. “Contoso”
- Numeric values are expressed without quotes and expected to be decimal. Hexadecimal values are prefixed with &H. E.g. 98052, &HFF
- Boolean values are expressed with constants: True, False.
- Built-in constants are expressed with only their name: NULL, CRLF, IgnoreThisFlow


## Operators

The following operators can be used:

- **Comparison**: <, <=, <>, =, >, >=
- **Mathematics**: +, -, *, -
- **String**: & (concatenate)
- **Logical**: && (and), || (or)
- **Evaluation order**: ( )



Operators are evaluated left to right. 2*(5+3) is not the same as 2*5+3.<br>
The brackets ( ) are used to change the evaluation order.





## Parameters

A parameter is defined either by a Connector or by an administrator using PowerShell. Parameters will usually contain values which will be different from system to system, e.g. the name of the domain the user is located in. These can be used in attribute flows.

The Active Directory Connector provided the following parameters for inbound Synchronization Rules:


| Domain.Netbios | Domain.FQDN | Domain.LDAP |
| Forest.Netbios | Forest.FQDN | Forest.LDAP |


The system provides the following parameter:

Connector.ID

An example which will populate the metaverse attribute domain with the netbios name of the domain where the user is located.

domain <- %Domain.Netbios%

## Common scenarios

### Length of attributes

String attributes are by default set to be indexable and the maximum length is 448 characters. If you are working with string attributes which might contain more, then make sure to include the following in the attribute flow:

`attributeName <- Left([attributeName],448)`

### Changing the userPrincipalSuffix

The userPrincipalName attribute in Active Directory is not always known by the users and might not be suitable as the login ID. The AAD Sync installation guide allows picking a different attribute, e.g. mail. But in some cases the attribute must be calculated. For example the company Contoso has two AAD directories, one for production and one for testing. They want the users in their test tenant to just change the suffix in the login ID.userPrincipalName <- Word([userPrincipalName],1,"@") & "@contosotest.com"

In this expression we take everything left of the first @-sign (Word) and concatenate with a fixed string.





### Convert a multi-value to a single-value

Some attributes in Active Directory are multi-valued in the schema even though they look single valued in Active Directory Users and Computers. An example is the description attribute.

In this expression in case the attribute has a value, we take the first item (Item) in the attribute, remove leading and trailing spaces (Trim), and then keep the first 448 characters (Left) in the string.



## Advanced concept

### NULL vs IgnoreThisFlow

For inbound Synchronization Rules, the constant **NULL** should always be used. This indicates that the flow has no value to contribute and another rule can contribute a value. If no rule contributed a value, then the metaverse attribute is removed.

For outbound Synchronization Rules there are two different constants to use: NULL and IgnoreThisFlow. Both indicates that the attribute flow has nothing to contribute, but the difference is what happens when no other rule has anything to contribute either. If there is an existing value in the connected directory, a NULL will stage a delete on the attribute removing it while IgnoreThisFlow will keep the existing value.



#### ImportedValue

The function ImportedValues is different than all other functions since the attribute name must be enclosed in quotes rather than square brackets: ImportedValue(“proxyAddresses”).

Usually during synchronization an attribute will use the expected value, even if it hasn’t been exported yet or an error was received during export (“top of the tower”). An inbound synchronization will assume that an attribute which hasn’t yet reached a connected directory will eventually reach it. In some cases it is important to only synchronize a value which has been confirmed by the connected directory and in this case the function ImportedValue is used (“hologram and delta import tower”).

An example of this can be found in the out-of-box Synchronization Rule In from AD – User Common from Exchange where in Hybrid Exchange the value added by Exchange online should only be synchronized if it has been confirmed the value was exported successfully:


`proxyAddresses <- RemoveDuplicates(Trim(ImportedValues(“proxyAddresses”)))`

For a complete list of functions, see [Azure AD Connect Sync: Functions Reference](active-directory-aadconnectsync-functions-reference.md)


## Additional Resources

* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)

<!--Image references-->
