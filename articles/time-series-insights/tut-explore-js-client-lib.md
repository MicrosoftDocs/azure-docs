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
# Customer intent: As a developer, I want learn about the TSI JavaScript library, so I can use them in my own apps.
---

# Tutorial: Explore the Time Series Insights JavaScript client library

This tutorial will guide you through an exploration of the Time Series Insights (TSI) JavaScript client library, and the related programming models. The topics discussed will provide you with opportunities to experiment, and gain a deeper understanding of how the library makes it easy to both access data from your TSI environment, and use chart  controls to render and visualize the data. The goal is to provide you with enough details, that you can use the library in your own web application.

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
This tutorial will make heavy use of the "Developer Tools" feature (also known as F12 or DevTools), found in most web browsers such as [Edge](/microsoft-edge/devtools-guide), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [FireFox](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools), and other modern browsers. If you're not already familiar, you may want to explore this feature in your browser before continuing. 

## TSI sample application overview

Throughout this tutorial, we will be using the Time Series Insights sample application to explore the TSI JavaScript library. The sample application is a Single-Page web Application (SPA), which showcases the use of the library for querying and visualizing data from a sample TSI environment. Fundamentally, the library provides an abstraction for two important categories :
- the TSI environment REST APIs used for querying data
- the charting controls used for rendering data in a web page

TODO: Stuff to integrate below:
- Talk about the structure of the HTML downloaded from the SPA web app. 
- Talk about the fact that it uses a couple of additional CSS files for styling, uses DIVs for formatting/placement, and uses TSClient.js library to make API calls and render UX/controls.

1. Navigate to the [Time Series Insights sample application](https://tsiclientsample.azurewebsites.net/)
   ![TSI Client Sample sign-in prompt](media/tut-explore-js-client-lib/tcs-sign-in.png)

2. Click the "Log in" button. You can use either an enterprise/organization account (Azure Active Directory) or a personal account (Microsoft Account, or MSA). If this is the first time you've used the application with a given account, you'll also be prompted to give your consent to the application. Consent allows the application to sign in under your account, and access the TSI APIs to retreive data.  
   ![TSI Client Sample consent prompt](media/tut-explore-js-client-lib/tcs-sign-in-consent.png)

3. After successful sign-in, you should see the a page similar to the following, containing several styles of charts, populated with TSI data:
   ![TSI Client Sample main page after sign-in](media/tut-explore-js-client-lib/main-after-sign-in.png)





## Exploring the pie, line, and bar charts

First, lets look at some of the standard chart controls as demonstrated in the TSI Client Sample application. 

1.   

Go through the steps from the video.

## Exploring states and events

Go through teh steps from the video.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * 1
> * 2
> * 3
> * 4

As discussed, the TSI Sample application uses a demo data set. To learn more about how you can create your own TSI environment and data set, advance to the next article below.

> [!div class="nextstepaction"]
> [Plan your Azure Time Series Insights environment](time-series-insights-environment-planning.md)


