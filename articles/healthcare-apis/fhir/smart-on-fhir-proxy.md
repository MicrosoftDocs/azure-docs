---
title: SMART on FHIR Proxy with the FHIR service in Azure Health Data Services
description: Learn how to enable SMART on FHIR proxy with the FHIR service in Azure Health Data Services.
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 05/18/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# SMART on FHIR Proxy

> [!IMPORTANT]
> The SMART on FHIR proxy is a legacy option for enabling SMART on FHIR functionality. It retires on September 21, 2026. Organizations should transition to the SMART on FHIR option, which uses the [SMART on FHIR v2 — Native IdP-Agnostic Sample](https://github.com/Azure-Samples/azure-health-data-and-ai-samples/tree/main/samples/smartonfhir-smartnative-v2). After September 21, 2026, applications relying on SMART on FHIR proxy report errors when accessing the FHIR service.

[SMART on FHIR](https://docs.smarthealthit.org/) is a standard for integrating apps with Electronic Health Record (EHR) systems, using the Fast Healthcare Interoperability Resources (FHIR) standard. The SMART on FHIR proxy is an option to enable SMART on FHIR functionality in the FHIR service. It provides a way for applications to authenticate and authorize with the FHIR service by using Microsoft Entra ID, and to access resources in a secure way.

## Step 1: Set admin consent for your client application

To use SMART on FHIR, first authenticate and authorize the app. The first time you use SMART on FHIR, also get administrative consent to let the app access your FHIR resources.

If you don't have an ownership role in the app, contact the app owner and ask them to grant admin consent for you in the app.

If you have administrative privileges, complete the following steps to grant admin consent to yourself directly. (You can also grant admin consent to yourself later when prompted in the app.) Use these same steps to add other users as owners, so they can view and edit the app registration.

To add yourself or another user as owner of an app:

1. In the Azure portal, go to Microsoft Entra ID.
1. In the left menu, select **App Registration**.
1. Search for the app registration you created, and then select it.
1. In the left menu, under **Manage**, select **Owners**.
1. Select **Add owners**, and then add yourself or the user you want to have admin consent.
1. Select **Save**.

## Step 2:  Enable the SMART on FHIR proxy

SMART on FHIR requires that `Audience` has an identifier URI equal to the URI of the FHIR service. The standard configuration of the FHIR service uses an `Audience` value of `https://fhir.azurehealthcareapis.com`. However, you can also set a value matching the specific URL of your FHIR service (for example `https://MYFHIRAPI.fhir.azurehealthcareapis.com`). This value is required when working with the SMART on FHIR proxy.

To enable the SMART on FHIR proxy in the **Authentication** settings for your FHIR instance, select the **SMART on FHIR proxy** check box.

The SMART on FHIR proxy acts as an intermediary between the SMART on FHIR app and Microsoft Entra ID. The authentication reply (the authentication code) must go to the SMART on FHIR proxy instead of the app itself. The proxy then forwards the reply to the app.

Because of this two-step relay of the authentication code, you need to set the reply URL (callback) for your Microsoft Entra client application to a URL that is a combination of the reply URL for the SMART on FHIR proxy, and the reply URL for the SMART on FHIR app. The combined reply URL takes the following form.

```http
https://MYFHIRAPI.azurehealthcareapis.com/AadSmartOnFhirProxy/callback/aHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMS9zYW1wbGVhcHAvaW5kZXguaHRtbA
```

In the reply, `aHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMS9zYW1wbGVhcHAvaW5kZXguaHRtbA` is a URL-safe, base64-encoded version of the reply URL for the SMART on FHIR app. For the SMART on FHIR app launcher, when the app is running locally, the reply URL is `https://localhost:5001/sampleapp/index.html`.

You can generate the combined reply URL by using a script like the following.

```PowerShell
$replyUrl = "https://localhost:5001/sampleapp/index.html"
$fhirServerUrl = "https://MYFHIRAPI.fhir.azurewebsites.net"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($ReplyUrl)
$encodedText = [Convert]::ToBase64String($bytes)
$encodedText = $encodedText.TrimEnd('=');
$encodedText = $encodedText.Replace('/','_');
$encodedText = $encodedText.Replace('+','-');

$newReplyUrl = $FhirServerUrl.TrimEnd('/') + "/AadSmartOnFhirProxy/callback/" + $encodedText
```

Add the reply URL to the public client application that you created previously for Microsoft Entra ID.

## Step 3:  Get a test patient

To test the FHIR service and the SMART on FHIR proxy, you need to have at least one patient in the database. If you didn't use the API yet, and you don't have data in the database, see [Access the FHIR service using REST Client](./../fhir/using-rest-client.md) to load a patient. Make a note of the ID of a specific patient.

## Step 4:  Download the SMART on FHIR app launcher

The open-source [FHIR Server for Azure repository](https://github.com/Microsoft/fhir-server) includes a simple SMART on FHIR app launcher and a sample SMART on FHIR app. In this tutorial, use this SMART on FHIR app launcher locally to test the setup.

You can clone the GitHub repository and go to the application by using the following commands.

```PowerShell
git clone https://github.com/Microsoft/fhir-server
cd fhir-server/samples/apps/SmartLauncher
```

The application needs a few configuration settings, which you can set in `appsettings.json`:

```json
{
    "FhirServerUrl": "https://MYFHIRAPI.fhir.azurehealthcareapis.com",
    "ClientId": "APP-ID",
    "DefaultSmartAppUrl": "/sampleapp/launch.html"
}
```

Use the `dotnet user-secrets` feature:

```PowerShell
dotnet user-secrets set FhirServerUrl https://MYFHIRAPI.fhir.azurehealthcareapis.com
dotnet user-secrets set ClientId <APP-ID>
```

Use the following command to run the application:

```PowerShell
dotnet run
```

## Step 5: Test the SMART on FHIR proxy

After you start the SMART on FHIR app launcher, point your browser to `https://localhost:5001`. You should see the following image:

:::image type="content" source="media/smart-on-fhir/smart-on-fhir-app-launcher.png" alt-text="Screenshot of the SMART on FHIR app launcher with launch context fields and launch button." lightbox="media/smart-on-fhir/smart-on-fhir-app-launcher.png":::

When you enter **Patient**, **Encounter**, or **Practitioner** information, the **Launch context** updates. When you're using the FHIR service, the launch context is simply a JSON document that contains information about patient, practitioner, and more. This launch context is base64 encoded and passed to the SMART on FHIR app as the `launch` query parameter. According to the SMART on FHIR specification, this variable is opaque to the SMART on FHIR app and passed on to the identity provider.

The SMART on FHIR proxy uses this information to populate fields in the token response. The SMART on FHIR app *can* use these fields to control which patient it requests data for, and how it renders the application on the screen. The SMART on FHIR proxy supports the following fields.

- `patient`
- `encounter`
- `practitioner`
- `need_patient_banner`
- `smart_style_url`

These fields provide guidance to the app, but they don't convey any security information. A SMART on FHIR application can ignore them.

The SMART on FHIR app launcher updates the **Launch URL** information at the bottom of the page. Select **Launch** to start the sample app, and you see something like the following screenshot.

:::image type="content" source="media/smart-on-fhir/smart-on-fhir-app.png" alt-text="Screenshot of the SMART on FHIR sample app interface after launch." lightbox="media/smart-on-fhir/smart-on-fhir-app.png":::

Inspect the token response to see how the launch context fields are passed on to the app.

## Related articles

[SMART on FHIR integration with FHIR Server](./smart-on-fhir.md)
