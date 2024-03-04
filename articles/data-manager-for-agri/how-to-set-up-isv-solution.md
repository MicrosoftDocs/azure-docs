---
title: Use ISV solutions with Data Manager for Agriculture.
description: Learn how to use APIs from a third-party solution
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 02/14/2023
ms.custom: template-how-to
---

# Working with an ISV solution

Follow the following guidelines to install and use an ISV solution.

## Install an ISV solution

1. Once you've installed an instance of Azure Data Manager for Agriculture from Azure portal, navigate to Settings ->Solutions tab on the left hand side in your instance.
2. You'll be able to view the list of available Solutions. Select the solution of your choice and click on Add button against it.
3. You'll be navigated to Azure Marketplace page for the Solution. 
4. Click on Contact Me CTA and the ISV partner will contact you to help with next steps of installation. 
5. To edit an installed Solution, click on the edit icon against the Solution in Solutions page. You'll be redirected to Azure Marketplace from where you can contact the ISV partner by clicking on Contact Me.
6. To delete an installed Solution, click on the delete icon against the Solution in Solutions page and you'll be redirected to Azure Marketplace from where you can Contact the ISV partner by clicking on Contact Me.

## Use an ISV solution

Once you've installed an ISV solution, use the below steps to understand how to make API calls from your application. Integration (request/response) is done through APIs asynchronously.

A high level view of how you can create a new request and get responses from the ISV partners solution:

:::image type="content" source="./media/3p-solutions-new.png" alt-text="Screenshot showing access flow for ISV API.":::

1. You make an API call for a PUT request with the required parameters (for example Job ID, Farm details)
    * The Data Manager API receives this request and authenticates it.  If the request is invalid, you get an error code back.
2. If the request is valid, the Data Manager creates a PUT request to ISV Partners solution API.
3. The ISV solution then makes a GET request to the weather service in data manager that is required for processing.
4. The ISV solution completes the processing the request and submits a response back to the Data Manager.
    * If there's any error when this request is submitted, then you may have to verify the configuration and parameters. If you're unable to resolve the issue then contact us at madma@microsoft.com
5. Now you make a call to Data Manager using the Job ID to get the final response.
    *  If the request processing is completed by the ISV Solution, you get the insight response back.  
    * If the request processing is still in progress, you'll get the  message “Processing in progress”

Once all the request/responses are successfully processed, the status of the request is closed. This final output of the request will be stored in Data Manager for Agriculture. You must ensure that you're submitting requests within the pre-defined thresholds.  

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).