---
title: Azure Attestation claim rule functions
description: Learn about claim rule concepts for Azure Attestation policy and the improvements made to the policy language.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: claim rules
---

# Claim rule functions supported in policy version 1.2+

Azure Attestation policy language is updated to enable querying of the incoming evidence in a JSON format. This article explains all the improvements made to the policy language.

One new operator and six functions are introduced in this policy version.

## Functions

Attestation evidence, which was earlier processed to generate specific incoming claims, is now made available to the policy writer in the form of a JSON input. The policy language is also updated to use functions to extract the information. As specified in [Azure Attestation claim rule grammar](claim-rule-grammar.md), the language supports the following three value types and an implicit assignment operator:

- Boolean
- Integer
- String
- Claim property access

You can use the new function call expression to process the incoming claim set. Use the function call expression with a claim property. It's structured as:

```JSON
value=FunctionName((Expression (, Expression)*)?))
```

The function call expression starts with the name of the function, followed by parentheses that contain zero or more arguments separated by commas. Because the arguments of the function are expressions, the language allows specifying a function call as an argument to another function. The arguments are evaluated from left to right before the evaluation of the function begins.

The following functions are implemented in the policy language.

## JmesPath function

JmesPath is a query language for JSON. It specifies several operators and functions that you can use to search data in a JSON document. The search always returns a valid JSON as output. The JmesPath function is structured as:

```JSON
JmesPath(Expression, Expression)
```

### Argument constraints

The function requires exactly two arguments. The first argument must evaluate a non-empty JSON as a string. The second argument must evaluate to a non-empty valid JmesPath query string.

### Evaluation

The JmesPath expression represented by the second argument is evaluated against JSON data represented by the first argument, which returns the resultant JSON as a string.

### Effect of read-only arguments on result

The resultant JSON string is read-only if either of the input arguments are retrieved from read-only claims.

### Usage example

The following example illustrates the concept.

#### Literal arguments (Boolean, integer, string)

Consider the following rule:

```JSON
=>add(type="JmesPathResult", value=JmesPath("{\"foo\": \"bar\"}", "foo"));
```

During the evaluation of this rule, the JmesPath function is evaluated. The evaluation boils down to evaluating JmesPath query *foo* against the JSON *{ "foo" :  "bar" }.* The result of this search operation is a JSON value *"bar".* So, the evaluation of the rule adds a new claim with type *"JmesPathResult"* and string value *"bar"* to the incoming claim set.

The backslash character is used to escape the double quotation-mark character within the literal string that represents the JSON data.

#### Arguments constructed from claims

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: {type="JsonData", value="{\"values\": [0,1,2,3,4]}"}
Claim2: {type="JmesPathQuery", value="values[2]"}
```

A JmesPath query can be written as:

```JSON
c1:[type="JsonData"] && c2:[type=="JmesPathQuery"] =>
add(type="JmesPathResult", value=JmesPath(c1.value, c2.value));
```

The evaluation of the JmesPath function boils down to evaluating the JmesPath query *values[2]* against the JSON *{"values":[0,1,2,3,4]}*. So, the evaluation of the rule adds a new claim with type *"JmesPathResult"* and string value *"2"* to the incoming claim set. So, the incoming set is updated as:

```JSON
Claim1: {type="JsonData", value="{\"values\": [0,1,2,3,4]}"}
Claim2: {type="JmesPathQuery", value="values[2]"}
Claim3: {type="JmesPathQuery", value="2"}
```

## JsonToClaimValue function

JSON specifies six types of values:

- Number (can be integer or a fraction)
- Boolean
- String
- Object
- Array
- Null

The policy language only supports four types of claim values:

- Integer
- Boolean
- String
- Set

In the policy language, a JSON value is represented as a string claim whose value is equal to the string representation of the JSON value. The **JsonToClaimValue** function is used to convert JSON values to claim values that the policy language supports. The function is structured as:

```JSON
JsonToClaimValue(Expression)
```

### Argument constraints

The function requires exactly one argument, which must evaluate to a valid JSON as a string.

### Evaluation

Here's how each type of the six JSON values is converted to a claim value:

- **Number**: If the number is an integer, the function returns a claim value with the same integer value. If the number is a fraction, an error is generated.
- **Boolean**: The function returns a claim value with the same Boolean value.
- **String**: The function returns a claim value with the same string value.
- **Object**: The function doesn't support JSON objects. If the argument is a JSON object, an error is generated.
- **Array**: The function only supports arrays of primitive (number, Boolean, string, and null) types. Such an array is converted to a set that contains a claim with the same type but with values created by converting the JSON values from the array. If the argument to the function is an array of non-primitive (object and array) types, an error is generated.
- **Null**: If the input is a JSON null, the function returns an empty claim value. If such a claim value is used to construct a claim, the claim is an empty claim. If a rule attempts to add or issue an empty claim, no claim is added to the incoming or the outgoing claim set. In other words, a rule attempting to add or issue an empty claim results in a no-op.

### Effect of read-only arguments on result

The resultant claim values are read-only if the input argument is read-only.

### Usage example

The following example illustrates the concept.

#### JSON number/Boolean/string

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="JsonIntegerData", value="100" }
Claim2: { type="JsonBooleanData", value="true" }
Claim1: { type="JsonStringData", value="abc" }
```

Evaluating rule:

```JSON
c:[type=="JsonIntegerData"] => add(type="IntegerResult", value=JsonToClaimValue(c.value));
c:[type=="JsonBooleanData"] => add(type="BooleanResult", value=JsonToClaimValue(c.value));
c:[type=="JsonStringData"] => add(type="StringResult", value=JsonToClaimValue(c.value));
```

Updated incoming claim set:

```JSON
Claim1: { type = "JsonIntegerData", value="100" } 
Claim2: { type = "IntegerResult", value="100" } 
Claim3: { type = "JsonBooleanData", value="true" } 
Claim4: { type = "BooleanResult", value="true" } 
Claim5: { type = "JsonStringData", value="abc" } 
Claim6: { type = "StringResult", value="abc" } 
```

#### JSON array

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="JsonData", value="[0, \"abc\", true]" }
```

Evaluating rule:

```JSON
c:[type=="JsonData"] => add(type="Result", value=JsonToClaimValue(c.value));
```

Updated incoming claim set:

```JSON
Claim1: { type="JsonData", value="[0, \"abc\", true]" }
Claim2: { type="Result", value=0 }
Claim3: { type="Result", value="abc" }
Claim4: { type="Result", value=true}
```

The type in the claims is the same and only the value differs. If multiple entries exist with the same value in the array, multiple claims are created.

#### JSON null

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="JsonData", value="null" }
```

Evaluating rule:

```JSON
c:[type=="JsonData"] => add(type="Result", value=JsonToClaimValue(c.value));
```

Updated incoming claim set:

```JSON
Claim1: { type="JsonData", value="null" }
```

The rule attempts to add a claim with the type *Result* and an empty value. Because it's not allowed, no claim is created, and the incoming claim set remains unchanged.

## IsSubsetOf function

This function is used to check if a set of claims is a subset of another set of claims. The function is structured as:

```JSON
IsSubsetOf(Expression, Expression)
```

### Argument constraints

This function requires exactly two arguments. Both arguments can be sets of any cardinality. The sets in policy language are inherently heterogeneous, so there's no restriction on which type of values can be present in the argument sets.

### Evaluation

The function checks if the set represented by the first argument is a subset of the set represented by the second argument. If so, it returns true. Otherwise, it returns false.

### Effect of read-only arguments on result

Because the function simply creates and returns a Boolean value, the returned claim value is always non-read-only.

### Usage example

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="Subset", value="abc" }
Claim2: { type="Subset", value=100 }
Claim3: { type="Superset", value=true }
Claim4: { type="Superset", value="abc" }
Claim5: { type="Superset", value=100 }
```

Evaluating rule:

```JSON
c1:[type == "Subset"] && c2:[type=="Superset"] => add(type="IsSubset", value=IsSubsetOf(c1.value, c2.value));
```

Updated incoming claim set:

```JSON
Claim1: { type="Subset", value="abc" }
Claim2: { type="Subset", value=100 }
Claim3: { type="Superset", value=true }
Claim4: { type="Superset", value="abc" }
Claim5: { type="Superset", value=100 }
Claim6: { type="IsSubset", value=true }
```

## AppendString function

This function is used to append two string values. The function is structured as:

```JSON
AppendString(Expression, Expression)
```

### Argument constraints

This function requires exactly two arguments. Both the arguments must evaluate string values. Empty string arguments are allowed.

### Evaluation

This function appends the string value of the second argument to the string value of the first argument and returns the resultant string value.

### Effect of read-only arguments on the result

The resultant string value is considered to be read-only if either one of the arguments is retrieved from read-only claims.

### Usage example

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="String1", value="abc" }
Claim2: { type="String2", value="xyz" }
```

Evaluating rule:

```JSON
c:[type=="String1"] && c2:[type=="String2"] => add(type="Result", value=AppendString(c1.value, c2.value));
```

Updated incoming claim set:

```JSON
Claim1: { type="String1", value="abc" }
Claim2: { type="String2", value="xyz" }
Claim3: { type="Result", value="abcxyz" }
```

## NegateBool function

This function is used to negate a Boolean claim value. The function is structured as:

```JSON
NegateBool(Expression)
```

### Argument constraints

The function requires exactly one argument, which must evaluate a Boolean value.

### Evaluation

This function negates the Boolean value represented by the argument and returns the negated value.

### Effect of read-only arguments on the result

The resultant Boolean value is considered to be read-only if the argument is retrieved from a read-only claim.

### Usage example

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: { type="Input", value=true }
```

Evaluating rule:

```JSON
c:[type=="Input"] => add(type="Result", value=NegateBol(c.value));
```

Updated incoming claim set:

```JSON
Claim1: { type="Input", value=true }
Claim2: { type="Result", value=false }
```

## ContainsOnlyValue function

This function is used to check if a set of claims contains only a specific claim value. The function is structured as:

```JSON
ContainsOnlyValue(Expression, Expression)
```

### Argument constraints

This function requires exactly two arguments. The first argument can evaluate a heterogeneous set of any cardinality. The second argument must evaluate a single value of any type (Boolean, string, or integer) supported by the policy language.

### Evaluation

The function returns true if the set represented by the first argument isn't empty and only contains the value represented by the second argument. The function returns false if the set represented by the first argument is empty or contains any value other than the value represented by the second argument.

### Effect of read-only arguments on the result

Because the function simply creates and returns a Boolean value, the returned claim value is always non-read-only.

### Usage example

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: {type="Set", value=100}
Claim2: {type="Set", value=101}
```

Evaluating rule:

```JSON
c:[type=="Set"] => add(type="Result", value=ContainsOnlyValue(100));
```

Updated incoming claim set:

```JSON
Claim1: {type="Set", value=100}
Claim2: {type="Set", value=101}
Claim3: {type="Result", value=false}
```

## Not condition operator

The rules in the policy language start with an optional list of conditions that act as filtering criteria on the incoming claim set. The conditions can be used to identify if a claim is present in the incoming claim set. But there's no way of checking if a claim is absent. So, a new operator (!) is introduced that can be applied to the individual conditions in the conditions list. This operator changes the evaluation behavior of the condition from checking the presence of a claim to checking the absence of a claim.

### Usage example

Assume the following claims are available in the incoming claim set:

```JSON
Claim1: {type="Claim1", value=100}
Claim2: {type="Claim2", value=200}
```

Evaluating rule:

```JSON
![type=="Claim3"] => add(type="Claim3", value=300)
```

This rule effectively translates to: *If a claim with type "Claim3" is not present in the incoming claim set, add a new claim with type "Claim3" and value 300 to the incoming claim set.*

Updated incoming claim set:

```JSON
Claim1: {type="Claim1", value=100}
Claim2: {type="Claim2", value=200}
Claim3: {type="Claim2", value=300}
```

### Sample policy using policy version 1.2

Windows [implements Measured Boot](/windows/security/information-protection/secure-the-windows-10-boot-process) and, along with attestation, the protection that's provided is greatly enhanced. You can use it to detect and protect against vulnerable and malicious boot components securely and reliably. You can now use these measurements to build the attestation policy.

```
version=1.2;

authorizationrules { 
  => permit();
};


issuancerules
{

c:[type == "events", issuer=="AttestationService"] => add(type = "efiConfigVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_DRIVER_CONFIG' && ProcessedData.VariableGuid == '8BE4DF61-93CA-11D2-AA0D-00E098032B8C']"));

c:[type=="efiConfigVariables", issuer="AttestationPolicy"]=> issue(type = "secureBootEnabled", value = JsonToClaimValue(JmesPath(c.value, "[?ProcessedData.UnicodeName == 'SecureBoot'] | length(@) == `1` && @[0].ProcessedData.VariableData == 'AQ'")));
![type=="secureBootEnabled", issuer=="AttestationPolicy"] => issue(type="secureBootEnabled", value=false);

};
```
