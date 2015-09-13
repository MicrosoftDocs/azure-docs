<properties
   pageTitle="Developer Service Publishing Guide - Deploying the Offer"
   description="Detailed instructions on how to deploy a developer service offering."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="en-us"
   ms.topic="Deploy a Developer Service offer"
   ms.tgt_pltfrm="Azure"
   ms.workload=""
   ms.date="09/13/2015"
   ms.author="hascipio"/>

# Developer Service On-boarding Guide - Publishing your offer

## Previous Steps
- [Build a Resource Provider][2]
- [Deploy Resource Provider as Azure Website][1]

## Push to staging

* Navigate to publisher portal. Go to “Publish” tab and click on “Push to Staging”. It will pop-up a box and ask for subscriptions you want to white list for Staged offer. Add the pay-as-you-go subscription you create in earlier.

## Test the staged offer  

* Once you push to staging, it takes around 15 mins for the offer to be staged. Once the offer status is changed to “Staged”, you can see your staged offer under all the whitelisted subscriptions in the portal.
* Go through the all the customer scenarios (Purchase\Upgrade\Delete etc.)
* Make sure the Marketing content is as required and filled by you before pushing to staging.

## Notify On-boarding team

* Once you are done with testing, notify the on-boarding team for validation. On-boarding team will test the customer scenarios and also validate the Marketing content.

## Push to Production

* Request for approval once on-boarding team notifies
* Once the offer goes live, test the customer scenarios to validate all the contracts work properly.

[1]:(marketplace-publishing-dev-services-deploy-resourceprovider-as-azurewebsites)
[2]:(marketplace-publishing-dev-services-create-resource-provider)
