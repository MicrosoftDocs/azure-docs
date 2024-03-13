---
title: Use ISV solutions with Data Manager for Agriculture.
description: Learn how to use APIs from a third-party solution
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 09/01/2023
ms.custom: template-how-to
---

# Working with an ISV solution

Follow the following guidelines to install and use an ISV solution.

## Install an ISV solution

1. Once you've installed an instance of Azure Data Manager for Agriculture from Azure portal, navigate to Settings ->Solutions tab on the left hand side in your instance. Ensure you have application admin permission. 
2. Click on **Add** to view the list of Solutions available for installation. Select the solution of your choice and click on **Add** button against it.
> [!NOTE]
>
>If a Solution has only private plans, you will see **Contact Us** button which will take you to Marketplace page for Solution.
>
3. You are navigated to the plan selection pane where you have to give the following inputs:
    1. Click on **Authorize** button to give consent to the Solution Provider to create app needed for Solution installation.
    2. Object ID. See [here](#identify-object-id-of-the-solution) to find your Object ID
    3. Select plan of your choice
4. Select the Terms and Conditions checkbox and click on Add.
5. The Solution is deployed on your ADMA instance and role assignment will be handled from the backend. 

## Edit an installed Solution

 To edit an installed Solution, click on the edit icon against the Solution in Solutions page. You are redirected to plan selection pane to modify your plan. If it's a solution with private plans, you are redirected to Azure Marketplace from where you can contact the ISV partner by clicking on **Contact Me**.

## Delete an installed Solution

 To delete an installed Solution, click on the delete icon against the Solution in Solutions page and confirm the same on the popup. If it's a Solution with private plans, you'll be redirected to Azure Marketplace from where you can Contact the ISV partner by clicking on Contact Me.

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
    * If the request processing is still in progress, you get the  message “Processing in progress”

Once all the request/responses are successfully processed, the status of the request is closed. This final output of the request is stored in Data Manager for Agriculture. You must ensure that you're submitting requests within the predefined thresholds.  

## Identify Object ID of the Solution
 
1. Navigate to Enterprise Applications page in Azure portal. 
2. Use the **Application ID** mentioned in the Solution Plan selection pane and filter the Applications.
3. Copy the **Object ID**

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).