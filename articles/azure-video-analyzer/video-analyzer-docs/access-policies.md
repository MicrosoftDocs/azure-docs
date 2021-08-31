---
title: Azure Video Analyzer access policies
description: This article explains how Azure Video Analyzer uses JWT tokens in access policies to secure videos. 
ms.topic: reference
ms.date: 06/01/2021

---

# Access policies

Access policies define the permissions and duration of access to a given Video Analyzer video resource. These access policies allow for greater control and flexibility by allowing 3rd party (Non AAD Clients) JWT tokens to provide authorization to client API’s that enable: 

- access to Video Metadata. 
- access to Video streaming. 

## Access Policy definition

```json
"name": "accesspolicyname1", 
"properties": { 
    "role": "Reader", 
    "authentication": { 
        "@type": "#Microsoft.VideoAnalyzer.JwtAuthentication", 
        "issuers": [ 
            "issuer1", 
            "issuer2" 
        ], 
        "audiences": [ 
            "audience1" 
        ], 
        "claims": [ 
            { 
                "name":"claimname1", 
                "value":"claimvalue1" 
            }, 
            { 
                "name":"claimname2", 
                "value":"claimvalue2" 
            } 
        ], 
        "keys": [ 
            { 
                "@type": "#Microsoft.VideoAnalyzer.RsaTokenKey", 
                "alg": "RS256", 
                "kid": "123", 
                "n": "YmFzZTY0IQ==", 
                "e": "ZLFzZTY0IQ==" 
            }, 
            { 
                "@type": "#Microsoft.VideoAnalyzer.EccTokenKey", 
                "alg": "ES256", 
                "kid": "124", 
                "x": "XX==", 
                "y": "YY==" 
            } 
        ] 
    } 
} 
```

> [!NOTE] 
> Only one key type is required. 

### Roles

Currently only reader role is supported.

### Issuer Matching Rules

Multiple issues can be specified in the policy, single issuer can be specified in the token.  Issuer matches if the token issuer is among the issuers specified in the policy.

### Audience Matching Rules

If the audience value is ${System.Runtime.BaseResourceUrlPattern} for the video resource, then the audience that is provided in the JWT token must match the base resource URL. If not, then the token audience must match the audience from the access policy.

### Claims Matching Rules

Multiple claims can be specified in the access policy and in the JWT token.  All the claims form an access policy must be provided in the token to pass validation, however, the JWT token can have additional claims that are not listed in the access policy.

### Keys

Two types of keys are supported these are the RSA and the ECC types.

[RSA](https://wikipedia.org/wiki/RSA_(cryptosystem))

* @type- \#Microsoft.VideoAnalyzer.RsaTokenKey
* alg - Algorithm.  Can be 256, 384 or 512 
* kid - Key ID
* n - Modulus
* e - Public Exponent 

[ECC](https://wikipedia.org/wiki/Elliptic-curve_cryptography)        

* @type- \#Microsoft.VideoAnalyzer.EccTokenKey
* alg - Algorithm.  Can be 256, 384 or 512
* kid - Key ID
* x - Coordinate value.
* y - Coordinate value.

### Token validation Process

Customers must create their own JWT tokens and will be validated using the following method:

- From the list of policies that match the Key ID we validate:
  - Token signature
  - Token expiration
  - Issuer
  - Audience
  - Additional claims

### Policy Audience and Token Matching Examples:

| **Policy Audience**                      | Requested URL                         | Token URL                            | Result |
| ---------------------------------------- | ------------------------------------- | ------------------------------------ | ------ |
| (Any literal)                            | (ANY)                                 | (Match)                              | Grant  |
| (Any Literal)                            | (ANY)                                 | (Not Match)                          | Deny   |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos                   | https://fqdn/videos/*                | Grant  |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos                   | https://fqdn/videos/{videoName}      | Deny   |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{videoName}       | https://fqdn/vid*                    | Grant  |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{videoName}       | https://fqdn/videos/*                | Grant  |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{videoName}       | https://fqdn/videos/{baseVideoName}* | Grant  |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{videoName}       | https://fqdn/videos/{videoName}      | Grant  |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{videoName}Suffix | https://fqdn/videos/{videoName}      | Deny   |
| ${System.Runtime.BaseResourceUrlPattern} | https://fqdn/videos/{otherVideoName}  | https://fqdn/videos/{videoName}      | Deny   |

> [!NOTE]  
> Video Analyzer supports a maximum of 20 policies.  ${System.Runtime.BaseResourceUrlPattern} allows for greater flexibility to access specific resources by using one access policy and multiple tokens.  These tokens then allow access to different Video Analyzer resources based on the audience. 

## Creating an Access Policy

There are two ways to create an access policy.

### In the Azure portal

1. Log into the Azure portal and navigate to your Resource Group where your Video Analyzer account is located.
2. Select the Video Analyzer resource.
3. Under Video Analyzer select Access Policies

   :::image type="content" source="./media/access-policies/access-policies-menu.png" alt-text="Access Policies menu in Azure portal":::
4. Click on new and enter the following:

   - Access policy name - any name
   - Issuer - must match the JWT Token Issuer 
   - Audience - Audience for the JWT Token -- ${System.Runtime.BaseResourceUrlPattern} is the default. 
   - Key Type - kty 
   - Algorithm - alg
   - Key ID - kid 
   - N / X value 
   - E / Y Value 

   :::image type="content" source="./media/access-policies/access-policies-portal.png" alt-text="Access Policy in Azure portal":::
5. Click `Save`.

### Create Access Policy via API

See Azure Resource Manager (ARM) API 

## Next steps

[Overview](overview.md)
