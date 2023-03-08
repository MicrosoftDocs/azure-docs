---
title: Tutorial - Send shortener links through SMS with Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use the Azure URL Shortener sample to send short links through SMS.
author: ddematheu2
manager: shahen
services: azure-communication-services
ms.author: dademath
ms.date: 03/8/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: sms
---

# Send shortener links through SMS with Azure Communication Services

SMS messages are limited to only 160 characters. Image trying to send to a customer a link to their profile. The link might easily be longer than 160 characters. Might contain query parameters for the user’s profile, cookie information, etc. It is a necessity to leverage a URL shortener to help you ensure you stay within the 160 character limit.

In this document we will outline the process of integrating Azure Communication Services with the Azure URL Shortener, an open source service that enables you to easily create, manage and monitor shortened links.

## To-do
- guidance on how to ensure that links deliver (custom domains, verify number, etc.)

## Pre-requisites

-	An active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
-	An active Azure Communication Services resource. For more information, see [Create an Azure Communication Services resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
-	An Azure Communication Services phone number. [Get a phone number](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number).
-	Deployed [AzUrlShortener](https://github.com/microsoft/AzUrlShortener). Click [Deploy to Azure](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener) button for quick deploy.
    -  [*Optional*] Deploy the [Admin web app](https://github.com/microsoft/AzUrlShortener/blob/main/src/Cloud5mins.ShortenerTools.TinyBlazorAdmin/README.md) to manage and monitor links in UI.
-	For this tutorial, we will be leveraging an Azure Function serve as an endpoint we can call to request SMS to be sent with a shortened URL. You could always use an existing service, different framework like express or just run this as a Node.JS console app. To follow this instructions to set up an [Azure Function for TypeScript](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-typescript).

## Architecture overview

In this tutorial our focus will be in setting up a middleware that orchestrates requests to send SMS and the shortening of URLs through the Azure URL Shortener service. It will interact with Azure Communication Services to complete the sending of the SMS.

![Diagram for architecture overview](./media/url-shortener/url-shortener-architecture.png)

## Set up the Azure Function

To get started, you will need to create a new Azure Function. You can do this by following the steps in the [Azure Functions documentation](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-typescript). If you are not using an Azure Function and instead are using a different framework, skip this step and continue to the next section.

## Configure query parameters

Now that we have created our function, we will not configure the query parameters we will use to trigger it. The function will expect a phone number and a URL. The phone number is used as the recipient of the SMS message. The URL is the link we want to shorten and send to the recipient.

```typescript

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumber = req.query.phoneNumber;
    let url =  req.query.url;

};

export default httpTrigger;

```

## Shorten the URL

Now that we have the phone number and URL, we can use the Azure URL Shortener service to shorten the URL. Ensure you have [deployed](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener) this service already. The service contains several endpoints, but for this tutorial we will focus on the `UrlCreate` endpoint. We will use the `fetch` method to place a `POST` request to the Azure URL Shortener service with the URL we want to shorten. The service will return a JSON object with the shortened URL. We will store this in a variable called `shortUrl`. In the snippet below, insert the endpoint of your deployed Azure URL Shortener service. For information on how to to get the endpoint, see [Validate the deployment](https://github.com/microsoft/AzUrlShortener/wiki/How-to-deploy-your-AzUrlShortener#validate-the-deployment).

```typescript

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumber = req.query.phoneNumber;
    let url =  req.query.url;
    const body =  JSON.stringify({ "Url": url})

    await fetch("<URL SHORTENER SERVICE ENDPOINT>/api/UrlCreate", {
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

Now that we have the shortened URL, we can use Azure Communication Services to send the SMS. We will use the `send` method from the `SmsClient` class from the `@azure/communication-sms` package. This method will send the SMS to the phone number we provided in the query parameters. The SMS will contain the shortened URL. For more information on how to send SMS, see [Send SMS](https://docs.microsoft.com/azure/communication-services/quickstarts/telephony-sms/send?pivots=programming-language-javascript).

You will need to swap in the information for your Azure Communication Services resource including your connection string and the phone number you got as part of the pre-requisites. For more information on how to get your connection string, see [Get a connection string](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp#create-a-communication-resource).


```typescript

import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { SmsClient }  from "@azure/communication-sms"

// This code retrieves your connection string
// from an environment variable.
const connectionString = <INSERT YOUR AZURE COMMUNICATION SERVICES CONNECTION STRING>;

// Instantiate the SMS client.
const smsClient = new SmsClient(connectionString);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumber = req.query.phoneNumber;
    let url =  req.query.url;
    context.log(phoneNumber + url)
    const body =  JSON.stringify({ "Url": url})

    await fetch("https://dademathshortenertool-2aden-fa.azurewebsites.net/api/UrlCreate", {
      method: 'POST',
      body: body
    })
    .then(res => res.json())
    .then(async data => {
      const response = data["ShortUrl"]
      context.log(response)
      const sendResults = await smsClient.send({
        from: <INSRET YOUR AZURE COMMUNICATION SERVICES PHONE NUMBER>,
        to: [phoneNumber],
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

You can now run your Azure Function locally by pressing `F5` in Visual Studio Code or by running the following command in the terminal:

```bash

func host start

```

Then using a tool like [Postman](https://www.postman.com/), you can test your function by making a `POST` request to the endpoint of your Azure Function. You will need to provide the phone number and URL as query parameters. For example, if your Azure Function is running locally, you can make a request to `http://localhost:7071/api/<FUNCTION NAME>?phoneNumber=%2B15555555555&url=https://www.microsoft.com`. You should receive a response with the shortened URL and a status of `Success`.

## Deploy to Azure

To deploy your Azure Function, you can follow [step by step instructions](https://learn.microsoft.com/azure/azure-functions/create-first-function-vs-code-csharp?pivots=programming-language-javascript#sign-in-to-azure).

Once deployed, you can access the function through a similar method as you did when testing locally. You will need to provide the phone number and URL as query parameters. For example, if your Azure Function is deployed to Azure, you can make a request to `https://<YOUR AZURE FUNCTION NAME>.azurewebsites.net/api/<FUNCTION NAME>?phoneNumber=%2B15555555555&url=https://www.microsoft.com`. You should receive a response with the shortened URL and a status of `Success`.

## Next steps

- Add a [custom domain](https://github.com/microsoft/AzUrlShortener/wiki/How-to-Add-a-Custom-Domain) for your shortened URLs.