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

# Configure SSL policy versions and cipher suites on Application Gateway

Learn how to configure SSL policy versions and cipher suites on Application Gateway. You can select from a list of predefined policies that contain different configurations of SSL policy versions and enabled cipher suites. You also have the ability to define a custom SSL policy based on your requirements.

* [Get available SSL options](#get-available-ssl-options)
* [List pre-defined SSL Policies](#predefined-ssl-policies)
* [Configure a custom SSL policy](#configure-a-custom-ssl-policy)

## Get available SSL options

The `Get-AzureRMApplicationGatewayAvailableSslOptions` cmdlet provides a listing of available pre-defined policies, available cipher suites, and protocol versions that can be configured. The following example shows an example output from running the cmdlet.

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

## List pre-defined SSL Policies

Application gateway comes with 3 pre-defined policies that can be used. The `Get-AzureRmApplicationGatewaySslPredefinedPolicy` cmdlet retrieves these policies. Each policy has different protocol versions and cipher suites enabled. These pre-defined policies can be used to quickly configure an SSL policy on your application gateway. By default **AppGwSslPolicy20170401** is selected if no specific SSL policy is defined.

* [AppGwSslPolicy20150501](#appgwsslpolicy20150501)
* [AppGwSslPolicy20170401](#appgwsslpolicy20170401)
* [AppGwSslPolicy20170401S](#appgwsslpolicy20170401s)

### AppGwSslPolicy20150501


|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20150501        |
|MinProtocolVersion     | TLSv1_0        |
|CipherSuites     |TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_DHE_RSA_WITH_AES_128_GCM_SHA256<br> TLS_DHE_RSA_WITH_AES_256_CBC_SHA<br> TLS_DHE_RSA_WITH_AES_128_CBC_SHA<br> TLS_RSA_WITH_AES_256_GCM_SHA384<br> TLS_RSA_WITH_AES_128_GCM_SHA256<br> TLS_RSA_WITH_AES_256_CBC_SHA256<br> TLS_RSA_WITH_AES_128_CBC_SHA256<br> TLS_RSA_WITH_AES_256_CBC_SHA<br> TLS_RSA_WITH_AES_128_CBC_SHA<br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384<br>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256<br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384<br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256<br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA<br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA<br> TLS_DHE_DSS_WITH_AES_256_CBC_SHA256<br> TLS_DHE_DSS_WITH_AES_128_CBC_SHA256<br> TLS_DHE_DSS_WITH_AES_256_CBC_SHA<br> TLS_DHE_DSS_WITH_AES_128_CBC_SHA<br> TLS_RSA_WITH_3DES_EDE_CBC_SHA<br>TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA |

### AppGwSslPolicy20170401

|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20170401        |
|MinProtocolVersion     | TLSv1_0        |
|CipherSuites     |TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_RSA_WITH_AES_128_GCM_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA256 <br> TLS_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_128_CBC_SHA |

### AppGwSslPolicy20170401S

|Property  |Value  |
|---------|---------|
|Name     | AppGwSslPolicy20170401        |
|MinProtocolVersion     | TLSv1_2        |
|CipherSuites     |TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA <br> TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 <br> TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 <br> TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA <br> TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_256_GCM_SHA384 <br> TLS_RSA_WITH_AES_128_GCM_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA256 <br> TLS_RSA_WITH_AES_128_CBC_SHA256 <br> TLS_RSA_WITH_AES_256_CBC_SHA <br> TLS_RSA_WITH_AES_128_CBC_SHA |

## Configure a custom SSL policy

The following example sets a custom SSL policy on an application gateway. It sets the minimum protocol version to `TLSv1_1` and enables the following cipher suites:

* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256

> [!IMPORTANT]
> At least one cipher suite from the following list must be selected when configuring a custom SSL policy. Application gateway uses RSA SHA256 cipher suites for backend management.
> * TLS_RSA_WITH_AES_128_GCM_SHA256
> * TLS_RSA_WITH_AES_256_CBC_SHA256
> * TLS_RSA_WITH_AES_128_CBC_SHA256

```powershell
# get an application gateway resource
$gw = Get-AzureRmApplicationGateway -Name AdatumAppGateway -ResourceGroup AdatumAppGatewayRG

# set the SSL policy on the application gateway
Set-AzureRmApplicationGatewaySslPolicy -ApplicationGateway $gw -PolicyType Custom -MinProtocolVersion TLSv1_1 -CipherSuite "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384", "TLS_RSA_WITH_AES_128_GCM_SHA256"
```

