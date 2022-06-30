---
title: Code Samples - Validate Passwords using Azure AD Password Requirements.
description: Code samples to validate passwords using Azure AD password requirements .
services: active-directory
author: spetteway
manager: vslopes
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: sample
ms.date: 06/30/2022
ms.author: spetteway
ms.reviewer: 
---

# Codes Samples - Validate Passwords using Azure Active Directory Password Requirements
The following code samples are examples to validate passwords against the Azure AD password requirements.

## Azure AD Password Requirements
For more information regarding Azure AD password policies, refer to [Password policies and account restrictions in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-policy). 
| Property | Requirements |
| --- | --- |
| Characters allowed |<ul><li>A – Z</li><li>a - z</li><li>0 – 9</li> <li>@ # $ % ^ & * - _ ! + = [ ] { } &#124; \ : ' , . ? / \` ~ " ( ) ; < ></li> <li>blank space</li></ul> |
| Characters not allowed | Unicode characters. |
| Password restrictions |<ul><li>A minimum of 8 characters and a maximum of 256 characters.</li><li>Requires three out of four of the following:<ul><li>Lowercase characters.</li><li>Uppercase characters.</li><li>Numbers (0-9).</li><li>Symbols (see the previous password restrictions).</li></ul></li></ul> |

## Python Sample
In this Python sample, we are validating whether the password meets the length requirement and has 3 out of the 4 of the required character sets.

```Python
# This Sample Code is provided for the purpose of illustration only and is not intended to be used 
# in a production environment. THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" 
# WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED 
# WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE. We grant You a nonexclusive, 
# royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code 
# form of the Sample Code, provided that You agree: (i) to not use Our name, logo, or trademarks to 
# market Your software product in which the Sample Code is embedded; (ii) to include a valid copyright 
# notice on Your software product in which the Sample Code is embedded; and (iii) to indemnify, hold 
# harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys’ 
# fees, that arise or result from the use or distribution of the Sample Code.

# This sample script is not supported under any Microsoft standard support program or service. 
# The sample script is provided AS IS without warranty of any kind. Microsoft further disclaims 
# all implied warranties including, without limitation, any implied warranties of merchantability 
# or of fitness for a particular purpose. The entire risk arising out of the use or performance of 
# the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, 
# or anyone else involved in the creation, production, or delivery of the scripts be liable for any 
# damages whatsoever (including, without limitation, damages for loss of business profits, business 
# interruption, loss of business information, or other pecuniary loss) arising out of the use of or 
# inability to use the sample scripts or documentation, even if Microsoft has been advised of the 
# possibility of such damages 

import string


lower = string.ascii_lowercase
upper = string.ascii_uppercase
symbol ='@#$%^&*-_!+=[]{}|\:\',.?/`~"();<> '
digits = '013456789'

validChars = set(lower + upper + symbol + digits)

def validatePassword(password: str) -> bool:
    """Return True if password meets requirements, False otherwise.
    """

    charSetCounter = {
    lower : 0,
    upper : 0,
    symbol : 0,
    digits : 0
    }
    
    # Check password length
    if len(password) < 8 or len(password) > 256:
        return False

    # 1. Check to see if password has 3 out of 4 character sets
    # 2. Ensure no invalid characters
    for char in password:
        for charSet in charSetCounter:
            if char in charSet:
                charSetCounter[charSet] += 1
            if char not in validChars:
                return False

    # Set counter to 0 and increment if chatSetCounter values are eq to 0
    zeroCounter = 0
    for val in charSetCounter.values():
        if val == 0:
            zeroCounter += 1

    # if counter is greater than 1, return False
    print(charSetCounter)
    if zeroCounter > 1:
        return False
    print(charSetCounter)
    return True
```

## Regex Sample

This Regex example matches when 3 out of 4 of the required character sets are present. Please refer to [Regular Expression Language - Quick Reference](/dotnet/standard/base-types/regular-expression-language-quick-reference) for more information on the categories that can be used to define regular expressions. You can also use a regex tool such as [regex 101](https://regex101.com/) for testing with syntax highlighting and explanation.

```regex
# This Sample Code is provided for the purpose of illustration only and is not intended to be used 
# in a production environment. THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" 
# WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED 
# WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE. We grant You a nonexclusive, 
# royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code 
# form of the Sample Code, provided that You agree: (i) to not use Our name, logo, or trademarks to 
# market Your software product in which the Sample Code is embedded; (ii) to include a valid copyright 
# notice on Your software product in which the Sample Code is embedded; and (iii) to indemnify, hold 
# harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys’ 
# fees, that arise or result from the use or distribution of the Sample Code.

# This sample script is not supported under any Microsoft standard support program or service. 
# The sample script is provided AS IS without warranty of any kind. Microsoft further disclaims 
# all implied warranties including, without limitation, any implied warranties of merchantability 
# or of fitness for a particular purpose. The entire risk arising out of the use or performance of 
# the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, 
# or anyone else involved in the creation, production, or delivery of the scripts be liable for any 
# damages whatsoever (including, without limitation, damages for loss of business profits, business 
# interruption, loss of business information, or other pecuniary loss) arising out of the use of or 
# inability to use the sample scripts or documentation, even if Microsoft has been advised of the 
# possibility of such damages 

((?=.*\d)(?=.*[a-z])(?=.*[@#$%^&*\-_!+=[\]{}|\\:',.?\/`~"(\);<>])|(?=.*\d)(?=.*[A-Z])(?=.*[@#$%^&*\-_!+=[\]{}|\\:',.?\/`~"(\);<>])|
(?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[@#$%^&*\-_!+=[\]{}|\\:',.?\/`~"(\);<>])(?=.*[A-Z])).{8,256}|
```

