Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@bmoore-msft 
bmoore-msft
/
azure-docs
Public
forked from MicrosoftDocs/azure-docs
Code
Pull requests
Actions
Projects
Security
Insights
Settings
azure-docs
/
articles
/
azure-resource-manager
/
bicep
/
linter-rule-outputs-should-not-contain-secrets.md
in
patch-15
 

Spaces

2

Soft wrap
1
---
2
title: Linter rule - outputs should not contain secrets
3
description: Linter rule - outputs should not contain secrets
4
ms.topic: conceptual
5
ms.date: 12/17/2021
6
---
7
​
8
# Linter rule - outputs should not contain secrets
9
​
10
This rule finds possible exposure of secrets in a template's outputs.
11
​
12
## Linter rule code
13
​
14
Use the following value in the [Bicep configuration file](bicep-config-linter.md) to customize rule settings:
15
​
16
`outputs-should-not-contain-secrets`
17
​
18
## Solution
19
​
20
Don't include any values in an output that could potentially expose secrets. For example, secure parameters of type secureString or secureObject, or [`list*`](./bicep-functions-resource.md#list) functions such as listKeys.
21
​
22
The output from a template is stored in the deployment history, so a user with read-only permissions could gain access to information otherwise not available with read-only permission.
23
​
24
The following example fails because it includes a secure parameter in an output value.
25
​
26
```bicep
27
@secure()
28
param secureParam string
29
​
30
output badResult string = 'this is the value ${secureParam}'
31
```
32
​
33
The following example fails because it uses a [`list*`](./bicep-functions-resource.md#list) function in an output.
34
​
35
```bicep
36
param storageName string
37
resource stg 'Microsoft.Storage/storageAccounts@2021-04-01' existing = {
38
  name: storageName
39
}
40
​
41
output badResult object = {
42
  value: stg.listKeys().keys[0].value
43
}
44
```
45
​
46
The following example fails because the output name contains 'password', indicating that it may contain a secret
47
​
48
```bicep
49
output accountPassword string = '...'
50
```
51
​
52
To fix it, you will need to remove the secret data from the output.  The recommended practice is to output the resourceId of the resource containing the secret and retrieve the secret when the resource needing the information is created or updated.  Secrets may also be stored in KeyVault for more complex deployment scenarios.

The following example shows a secure pattern for retrieving a storageAccount key from a module.
```bicep
output storageId string = stg.id
```
Which can be used in a subsequent deployment as sown in the following example
```bicep
someProperty: listKeys(myStorageModule.outputs.storageId.value, '2021-09-01').keys[0].value
```
53
​
54
## Silencing false positives
55
​
56
Sometimes this rule will alert on template outputs that do not actually contain secrets. For instance, not all [`list*`](./bicep-functions-resource.md#list) functions actually return sensitive data. In these cases, you can disable the warning for this line by adding `#disable-next-line outputs-should-not-contain-secrets` before the line with the warning.
57
​
58
```bicep
59
#disable-next-line outputs-should-not-contain-secrets // Does not contain a password
60
output notAPassword string = '...'
61
```
62
​
63
It is good practice to add a comment explaining why the rule does not apply to this line.
64
​
No file chosen
Attach files by dragging & dropping, selecting or pasting them.
@bmoore-msft
Commit changes
Commit summary
Create linter-rule-outputs-should-not-contain-secrets.md
Optional extended description
Add an optional extended description…
 Commit directly to the patch-15 branch.
 Create a new branch for this commit and start a pull request. Learn more about pull requests.
 
© 2022 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
