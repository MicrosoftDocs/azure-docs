---
title: Configure SSL policy on Azure Application Gateway | Microsoft Docs
description: This page provides instructions to configure SSL Policy on Azure Application Gateway
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/11/2017
ms.author: gwallace

---

# Configure SSL policy on Application Gateway

Learn how to configure SSL policy on Application Gateway. You can select from a list of ex

## Get available SSL options

The `Get-AzureRMApplicationGatewayAvailableSslOptions` cmdlet provides a listing of available pre-defined policies, available cipher suites, and protocols that can be configured. The following example shows an example output from running the cmdlet.

```
DefaultPolicy: AppGwSslPolicy20150501
PredefinedPolicies:
    /subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20150501
    /subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20170401
    /subscriptions/147a22e9-2356-4e56-b3de-1f5842ae4a3b/resourceGroups//providers/Microsoft.Network/ApplicationGatewayAvailableSslOptions/default/Applic
ationGatewaySslPredefinedPolicy/AppGwSslPolicy20170401S

AvailableCipherSuites:
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
    TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
    TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
    TLS_DHE_RSA_WITH_AES_256_CBC_SHA
    TLS_DHE_RSA_WITH_AES_128_CBC_SHA
    TLS_RSA_WITH_AES_256_GCM_SHA384
    TLS_RSA_WITH_AES_128_GCM_SHA256
    TLS_RSA_WITH_AES_256_CBC_SHA256
    TLS_RSA_WITH_AES_128_CBC_SHA256
    TLS_RSA_WITH_AES_256_CBC_SHA
    TLS_RSA_WITH_AES_128_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
    TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
    TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
    TLS_DHE_DSS_WITH_AES_256_CBC_SHA
    TLS_DHE_DSS_WITH_AES_128_CBC_SHA
    TLS_RSA_WITH_3DES_EDE_CBC_SHA
    TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA

AvailableProtocols:
    TLSv1_0
    TLSv1_1
    TLSv1_2
```

### AppGwSslPolicy20150501


|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20150501        |
|MinProtocolVersion     | TLSv1_0        |
|CipherSuites     |TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_DHE_RSA_WITH_AES_128_GCM_SHA256<br> TLS_DHE_RSA_WITH_AES_256_CBC_SHA<br> TLS_DHE_RSA_WITH_AES_128_CBC_SHA<br> TLS_RSA_WITH_AES_256_GCM_SHA384<br> TLS_RSA_WITH_AES_128_GCM_SHA256<br> TLS_RSA_WITH_AES_256_CBC_SHA256<br> TLS_RSA_WITH_AES_128_CBC_SHA256<br> TLS_RSA_WITH_AES_256_CBC_SHA<br> TLS_RSA_WITH_AES_128_CBC_SHA<br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384<br>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256<br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384<br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256<br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA<br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA<br> TLS_DHE_DSS_WITH_AES_256_CBC_SHA256<br> TLS_DHE_DSS_WITH_AES_128_CBC_SHA256<br> TLS_DHE_DSS_WITH_AES_256_CBC_SHA<br> TLS_DHE_DSS_WITH_AES_128_CBC_SHA<br> TLS_RSA_WITH_3DES_EDE_CBC_SHA<br>TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA |

## AppGwSslPolicy20170401

|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20170401        |
|MinProtocolVersion     | TLSv1_0        |
|CipherSuites     |TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_RSA_WITH_AES_128_GCM_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA256 <br> TLS_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_128_CBC_SHA |

## AppGwSslPolicy20170401S

|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20170401        |
|MinProtocolVersion     | TLSv1_2        |
|CipherSuites     |TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_RSA_WITH_AES_128_GCM_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA256 <br> TLS_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_128_CBC_SHA |

