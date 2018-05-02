---
title: Explore the Time Series Insights JavaScript client library
description: Learn about the Time Series Insights JavaScript client library and related programming model.
documentationcenter: ''
services: time-series-insights
author: BryanLa
manager: timlt
editor: ''
tags: 

ms.assetid: 
ms.service: time-series-insights
ms.workload: na
ms.tgt_pltfrm: 
ms.devlang: na
ms.topic: tutorial
ms.date: 05/09/2018
ms.author: bryanla
# Customer intent: As a developer, I want learn about the TSI JavaScript client library, so I can use the APIs in my own applications.
---

# Tutorial: Explore the Time Series Insights JavaScript client library

This tutorial guides you through an exploration of the Time Series Insights (TSI) JavaScript client library, and the related programming model. The topics discussed provide you with opportunities to experiment, gain a deeper understanding of how to access TSI data, and use chart controls to render and visualize data. The goal is to provide you with enough details, that you can use the library in your own web application.

In this tutorial, you learn about:

> [!div class="checklist"]
> * The TSI Sample application 
> * 2
> * 3
> * 4

<!-->
[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.3 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure. 
-->

## Prerequisites

<!--
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
-->
This tutorial makes heavy use of the "Developer Tools" feature (also known as DevTools or F12), found in most browsers such as [Edge](/microsoft-edge/devtools-guide), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [FireFox](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools), and other modern web browsers. If you're not already familiar, you may want to explore this feature in your browser before continuing. 

## The Time Series Insights Sample Application

Throughout this tutorial, the Time Series Insights Sample Application is used to explore the source code behind the application, including the TSI JavaScript client library. The application is a Single-Page web Application (SPA), showcasing the use of the library for querying and visualizing data from a sample TSI environment. 

1. Navigate to the [Time Series Insights sample application](https://tsiclientsample.azurewebsites.net/). You see a page similar to the following, prompting you for sign-in:
   ![TSI Client Sample sign-in prompt](media/tut-explore-js-client-lib/tcs-sign-in.png)

2. Click the "Log in" button. You can use either an enterprise/organization account (Azure Active Directory) or a personal account (Microsoft Account, or MSA). The first time you use the application with a given account, you are prompted to give your consent to the application. Consent allows the application to sign in under your account, and access the TSI APIs to retrieve data on your behalf.  
   ![TSI Client Sample consent prompt](media/tut-explore-js-client-lib/tcs-sign-in-consent.png)

3. After successful sign-in, you should see a page similar to the following, containing several styles of charts, populated with TSI data. Also note your user account and the "log out" link in the upper right:
   ![TSI Client Sample main page after sign-in](media/tut-explore-js-client-lib/tcs-main-after-signin.png)

### Page source and structure

First let's view the HTML and JavaScript source code behind the page that rendered in your browser. We won't walk through all of the elements, but you learn about the major sections of the code, giving you a sense of what the page is doing:

1. Open "Developer Tools" in your browser, and inspect the HTML elements that make up the current page, also known as the HTML or DOM tree.

2. Expand the `<head>` and `<body>` elements similar to the layout in the following image, and notice:
   - Under **\<head\>**, elements that pull in additional files to assist in the functioning of the page:
     - the \<script\> element for referencing the Azure Active Directory Authentication Library (`adal.min.js`) - also known as ADAL, this is a JavaScript library that provides OAuth 2.0 authentication (sign-in) and token acquisition for accessing APIs.

       >[!NOTE]
       > The source code for the ADAL JavaScript library is available from the [azure-activedirectory-library-for-js repository](https://github.com/AzureAD/azure-activedirectory-library-for-js).

     - \<link\> elements for style sheets (`sampleStyles.css`, `tsiclient.css`) - used to control page styling details, such as colors, fonts, spacing, etc.
     - the \<script\> element for referencing the TSI Client library (`tsiclient.js`) - a JavaScript library used by the page to call TSI APIs and render chart controls on the page.
   - Under **\<body\>**, elements that define the layout of items on the page. You can think of the `<div>` elements as "containers" for content, specifying the ordering and placement on the page. The visual styling and all other attributes are specified in the style sheet files (CSS):
     - the first \<div\> contains the "Log In" dialog (`id="loginModal"`).
     - the second \<div\> controls the placement of the items on the main page:
       - a header row, used for status messages and sign-in information near the top of the page (`class="header"`).
       - the remainder of the page body elements, including all of the charts (`class="chartsWrapper"`).
     - a \<script\> section, which contains all of the JavaScript used to control the page.

   [![TSI Client Sample with DevTools](media/tut-explore-js-client-lib/tcs-devtools-callouts-head-body.png)](media/tut-explore-js-client-lib/tcs-devtools-callouts-head-body.png#lightbox)

3. As mentioned, the `<div class="chartsWrapper">` element is used to lay out the main page body. Expand this element, and you'll find the `<div>` elements used to position the sample chart controls. You will notice there are actually several pairs of `<div>` elements, one pair for each chart example:
   - The first contains a title (`class="rowOfCardsTitle"`), which summarizes what the chart(s) illustrate. For example: "Static Line Charts With Full Size Legends"
   - The second is a parent (`class="rowOfCards"`), which contains additionl child `<div>` elements that position the actual chart control(s)

  ![Viewing the body divs](media/tut-explore-js-client-lib/tcs-devtools-callouts-body-divs.png)

4. Expand the `<script>` element, under the second `<div>` element of the `<body>` element. You will see the page level JavaScript, that is used for authentication and rendering of the controls on the page:

  ![Viewing the body script](media/tut-explore-js-client-lib/tcs-devtools-callouts-body-script.png)

### TSI Client JavaScript library

Although we won't review it in detail, fundamentally the TSI Client library provides an abstraction for two important categories:

- Wrapper methods for calling the TSI Query APIs. These are REST APIs that allow you to query for TSI aggregates, and are organized under the `TsiClient.Server` namespace of the library. 
- Methods for creating and populating several types of charting controls. These are used for rendering the TSI aggregate data in a web page, and are organized under the `TsiClient.UX` namespace of the library. 

In the following sections, we will explore the JavaScript source code. There you will see the programming model and API patterns take shape through the use of these methods discussed.

## Authentication

## Pie, line, and bar charts

First, lets look at some of the standard chart controls as demonstrated in the TSI Client Sample application. 

TODO: Go through the steps from the video.

## States and events

TODO: Go through the steps from the video.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * 1
> * 2
> * 3
> * 4

As discussed, the TSI Sample application uses a demo data set. To learn more about how you can create your own TSI environment and data set, advance to the following article.

> [!div class="nextstepaction"]
> [Plan your Azure Time Series Insights environment](time-series-insights-environment-planning.md)


