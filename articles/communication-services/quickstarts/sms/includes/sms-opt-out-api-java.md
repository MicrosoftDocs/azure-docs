---
title: Include file
description: Include file
services: azure-communication-services
author: dbasantes

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/06/2024
ms.topic: include
ms.custom: include file
ms.author: dbasantes
---

Get started with Azure Communication Services SMS Opt-out API by applying the following Java sample code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Java Development Kit (JDK) version 8 or above.
- An active Communication Services resource and connection string. See [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. See [Get a phone number](../../telephony/get-phone-number.md).

## Sample code to use Opt-Out API

This sample demonstrates how to use the Opt-Out Management API in Java to programmatically add, remove, or check opt-out entries.


```java
// Sample for Add action. Replace with Check or Remove as necessary.
public class App
{
    public static void main(String[] args) throws Exception
    {
        String connectionString = "endpoint=https://[CONTOSO].communication.azure.com/;accesskey=******";

        OptOutRequest payload = new OptOutRequest();
        payload.from = "+15551234567";
        payload.recipients = new ArrayList<Recipient>();
        payload.recipients.add(new Recipient("+15550112233"));

        SendOptOut(connectionString, payload);
    }

    public static void SendOptOutAdd(String connectionString, OptOutRequest payload) throws Exception
    {
        String apiVersion = "2024-12-10-preview";

        String[] arrOfStr = connectionString.split(";");
        String endpoint = arrOfStr[0].split("=")[1];
        String accessKey = arrOfStr[1].split("=")[1];
        String body = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT).writeValueAsString(payload);
        String dateHeaderName = "x-ms-date";
        DateTimeFormatter headerDateFormat = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH).withZone(ZoneId.of("GMT"));
        String dateHeader = headerDateFormat.format(Instant.now());
        String verb = "POST";
        URI uri = URI.create(endpoint + "sms/optouts:add?api-version==" + apiVersion);
        String hostName = uri.getHost();
        String pathAndQuery = uri.getPath() + "?" + uri.getQuery();
        String encodedHash = Base64.getEncoder().encodeToString(MessageDigest.getInstance("SHA-256").digest(body.getBytes(StandardCharsets.UTF_8)));
        String stringToSign = verb + '\n' + pathAndQuery + '\n' + dateHeader + ';' + hostName + ';' + encodedHash;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(Base64.getDecoder().decode(accessKey.getBytes()), "HmacSHA256"); 
        mac.init(secretKeySpec);
        String signature = Base64.getEncoder().encodeToString(mac.doFinal(stringToSign.getBytes()));
        String authHeader = "HMAC-SHA256 SignedHeaders=" + dateHeaderName + ";host;x-ms-content-sha256&Signature=" + signature;

        HttpClient client = HttpClients.custom().build();
        HttpUriRequest request = RequestBuilder
            .post(uri)
            .setHeader(HttpHeaders.CONTENT_TYPE, "application/json")
            .setHeader(dateHeaderName, dateHeader)
            .setHeader("x-ms-content-sha256", encodedHash)
            .setHeader("Authorization", authHeader)
            .setEntity(new StringEntity(body, "UTF-8"))
            .build();
        HttpResponse r = client.execute(request);
        HttpEntity entity = r.getEntity();
    }
}

public class OptOutRequest
{
    public String from;
    public ArrayList<Recipient> recipients;
}

public class Recipient
{
    public String to;
}
```
