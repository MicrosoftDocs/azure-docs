---
title: include file
description: include file
author: ddematheu2
manager: shahen
services: azure-communication-services
ms.author: dademath
ms.date: 03/29/2023
ms.topic: include
ms.service: azure-communication-services
---

## Pre-requisites

-	An active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
-	An active Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource).
-	An Azure Communication Services phone number. [Get a phone number](../../quickstarts/telephony/get-phone-number). You will need to [verify your phone number](../../quickstarts/sms/apply-for-toll-free-verification) so it can send messages with URLs. 
-	Deployed [AzUrlShortener](https://github.com/microsoft/AzUrlShortener). Click [Deploy to Azure](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener) button for quick deploy.
    -  [*Optional*] Deploy the [Admin web app](https://github.com/microsoft/AzUrlShortener/blob/main/src/Cloud5mins.ShortenerTools.TinyBlazorAdmin/README.md) to manage and monitor links in UI.
-	For this tutorial, we will be leveraging an Azure Function serve as an endpoint we can call to request SMS to be sent with a shortened URL. You could always use an existing service, different framework like express or just run this as a Node.JS console app. To follow this instructions to set up an [Azure Function for TypeScript](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-typescript).

## Architecture overview

In this tutorial our focus will be in setting up a middleware that orchestrates requests to send SMS and the shortening of URLs through the Azure URL Shortener service. It will interact with Azure Communication Services to complete the sending of the SMS.

![Diagram for architecture overview](../media/url-shortener/url-shortener-architecture.png)

## Set up the Azure Function

To get started, you will need to create a new Azure Function. You can do this by following the steps in the [Azure Functions documentation](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-typescript). If you are not using an Azure Function and instead are using a different framework, skip this step and continue to the next section.

Once the Azure Function is setup, go to the `local.settings.json` file and add three additional values which we will use to store the Azure Communication Services connection string, phone number and URL Shortener endpoint. This are all values you generated from the pre-requisites above.

```json

{
    "IsEncrypted": false,
    "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ACS_CONNECTIONSTRING": "<ACS CONNECTION STRING>",
    "ACS_PHONE_NUMBER": "<ACS PHONE NUMBER>", // Ex. +15555555555
    "URL_SHORTENER": "<URL SHORTENER ENDPOINT>" // Ex. https://<Azure Function URL>/api/UrlCreate
    }
}

```

## Configure query parameters

Now that we have created our function, we will not configure the query parameters we will use to trigger it. The function will expect a phone number and a URL. The phone number is used as the recipient of the SMS message. The URL is the link we want to shorten and send to the recipient.

```typescript

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumber = req.query.phoneNumber; // get phone number query parameter
    let url =  req.query.url; // get url to shorten query parameter

};

export default httpTrigger;

```

## Shorten the URL

Now that we have the phone number and URL, we can use the Azure URL Shortener service to shorten the URL. Ensure you have [deployed](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener) this service already. The service contains several endpoints, but for this tutorial we will focus on the `UrlCreate` endpoint. We will use the `fetch` method to place a `POST` request to the Azure URL Shortener service with the URL we want to shorten. The service will return a JSON object with the shortened URL. We will store this in a variable called `shortUrl`. In the snippet below, insert the endpoint of your deployed Azure URL Shortener service. For information on how to to get the endpoint, see [Validate the deployment](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener#validate-the-deployment).

```typescript

const urlShortener = process.env.URL_SHORTENER

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumberTo = req.query.phoneNumber; // get phone number query parameter
    let urlToShorten =  req.query.url; // get url to shorten query parameter
    const body =  JSON.stringify({ "Url": url})

    await fetch(urlShortener, {
      method: 'POST',
      body: body
    })
    .then(res => res.json())
    .then(async data => {
      const shortUrl = data["ShortUrl"]
      context.log(shortUrl)
      }
    })
};

export default httpTrigger;

```

## Send SMS

Now that we have the shortened URL, we can use Azure Communication Services to send the SMS. We will use the `send` method from the `SmsClient` class from the `@azure/communication-sms` package. This method will send the SMS to the phone number we provided in the query parameters. The SMS will contain the shortened URL. For more information on how to send SMS, see [Send SMS](../../quickstarts/telephony-sms/send?pivots=programming-language-javascript).

You will need to swap in the information for your Azure Communication Services resource including your connection string and the phone number you got as part of the pre-requisites. For more information on how to get your connection string, see [Get a connection string](../../quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp#create-a-communication-resource).


```typescript

import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { SmsClient }  from "@azure/communication-sms"

// This code retrieves your connection string
// from an environment variable.
const connectionString =  process.env.ACS_CONNECTIONSTRING
const phoneNumberFrom = process.env.ACS_PHONE_NUMBER
const urlShortener = process.env.URL_SHORTENER

// Instantiate the SMS client.
const smsClient = new SmsClient(connectionString);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumberTo = req.query.phoneNumber; // get phone number query parameter
    let urlToShorten =  req.query.url; // get url to shorten query parameter
    context.log(phoneNumber + url)
    const body =  JSON.stringify({ "Url": urlToShorten})

    await fetch(urlShortener, {
      method: 'POST',
      body: body
    })
    .then(res => res.json())
    .then(async data => {
      const response = data["ShortUrl"]
      context.log(response)
      const sendResults = await smsClient.send({
        from: phoneNumberFrom,
        to: [phoneNumberTo],
        message: "Join your scheduled appointment here: " + url
      }, {
        enableDeliveryReport: true
      });

      // Individual messages can encounter errors during sending.
      // Use the "successful" property to verify the status.
      for (const sendResult of sendResults) {
        if (sendResult.successful) {
          console.log("Success: ", sendResult);
        } else {
          console.error("Something went wrong when trying to send this message: ", sendResult);
        }
      }

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: sendResults
      };
    })

};

export default httpTrigger;

```

## Test locally

>[!NOTE]
> You will need to [verify your phone number](../../quickstarts/sms/apply-for-toll-free-verification) to send SMS messages with URLs. Once you have submitted your verification application, it might take a couple days for the phone number to be enabled to send URLs before it gets full verified (full verification takes 5-6 weeks). For more information on toll-free number verification, see [Apply for toll-free verification](../../quickstarts/sms/apply-for-toll-free-verification).

You can now run your Azure Function locally by pressing `F5` in Visual Studio Code or by running the following command in the terminal:

```bash

func host start

```

Then using a tool like [Postman](https://www.postman.com/), you can test your function by making a `POST` request to the endpoint of your Azure Function. You will need to provide the phone number and URL as query parameters. For example, if your Azure Function is running locally, you can make a request to `http://localhost:7071/api/<FUNCTION NAME>?phoneNumber=%2B15555555555&url=https://www.microsoft.com`. You should receive a response with the shortened URL and a status of `Success`.

## Deploy to Azure

To deploy your Azure Function, you can follow [step by step instructions](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-csharp?pivots=programming-language-javascript#sign-in-to-azure).

Once deployed, you can access the function through a similar method as you did when testing locally. You will need to provide the phone number and URL as query parameters. For example, if your Azure Function is deployed to Azure, you can make a request to `https://<YOUR AZURE FUNCTION NAME>.azurewebsites.net/api/<FUNCTION NAME>?phoneNumber=%2B15555555555&url=https://www.microsoft.com`. You should receive a response with the shortened URL and a status of `Success`.
