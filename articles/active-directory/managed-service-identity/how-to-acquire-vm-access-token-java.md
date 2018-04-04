---
title: How to use an Azure VM Managed Service Identity to acquire an access token using Java
description: Instructions for using an Azure VM MSI to acquire an OAuth access token using Java.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/28/2018
ms.author: daveba
---

# How to use an Azure VM Managed Service Identity (MSI) to acquire a token using Java

This article provides a code example for token acquisition using Java.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 

## Overview

A client application can request an MSI [app-only access token](../develop/active-directory-dev-glossary.md#access-token) for accessing a given resource. The token is [based on the MSI service principal](overview.md#how-does-it-work). As such, there is no need for the client to register itself to obtain an access token under its own service principal. The token is suitable for use as a bearer token in
[service-to-service calls requiring client credentials](../develop/active-directory-protocols-oauth-service-to-service.md).

## Get a token using Java

```java
import java.io.*;
import java.net.*;
import com.fasterxml.jackson.core.*;

class GetMSIToken {
    public static void main(String[] args) throws Exception {

        URL msiEndpoint = new URL("http://localhost:50342/oauth2/token?resource=https%3A%2F%2Fmanagement.azure.com%2F");
        HttpURLConnection con = (HttpURLConnection) msiEndpoint.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("Metadata", "true");

        if (con.getResponseCode()!=200) {
            throw new Exception("Error calling MSI Token endpoint.");
        }

        InputStream responseStream = con.getInputStream();

        JsonFactory factory = new JsonFactory();
        JsonParser parser = factory.createParser(responseStream);

        while(!parser.isClosed()){
            JsonToken jsonToken = parser.nextToken();

            if(JsonToken.FIELD_NAME.equals(jsonToken)){
                String fieldName = parser.getCurrentName();
                jsonToken = parser.nextToken();

                if("access_token".equals(fieldName)){
                    String accesstoken = parser.getValueAsString();
                    System.out.println("Access Token: " + accesstoken.substring(0,5)+ "..." + accesstoken.substring(accesstoken.length()-5));
                    return;
                }
            }
        }
    }
}  

```



## Related content

- To enable MSI on an Azure VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](qs-configure-portal-windows-vm.md).
- For information on handling token expiration and errors, see [Handling token expiration](how-to-acquire-vm-access-token-http.md#handling-token-expiration) and [Error Handling](how-to-acquire-vm-access-token-http.md#error-handling).










