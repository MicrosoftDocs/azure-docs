---
title: Quickstart article for Machine Learning Server | Microsoft Docs
description: This sample describes the article in 115 to 145 characters. Validate using Gauntlet toolbar check icon. Use SEO kind of action verbs here.
services: machine-learning
author: garyericson
ms.author: garye
manager: jhubbard
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: get-started-article
ms.date: 08/28/2017
---

# The H1 heading is the article title that shows on the web
Once sentence into intro about Machine Learning. Intro paragraph to explain the intent of this Quickstart, and time it takes. You can finish this Quickstart in about five minutes.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Machine Learning Server
1. Fill in the details:

   ![This image is a screenshot. Put alt-text here.](media/doc-template-quickstart/1-machine-learning-image.png)

This table is the kind of table to use following a screenshot to describe how to fill in the form seen in the screenshot. 

Setting|Suggested value|Description
---|---|---
Server name |*example-name*|Choose a unique name that identifies your Azure Machine Learning server.
Subscription|*Your subscription*|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
Resource Group|*myresourcegroup*| You may make a new resource group name, or use an existing one from your subscription.
Server admin login |*mylogin*| Make your own login account to use when connecting to the server. 

  > [!IMPORTANT]
  > The server admin login and password that you specify here are required to log in to the server and its databases later in this Quickstart. Remember or record this information for later use.

## Example command using a bash shell comment

A code block you could use.
```bash
tool --switch1 value2 --switch2 value2
```

The table describes the switched used in the preceding command: 

tool parameter |Suggested value|Description
---|---|---
--switch1 | *given value* | Specify the first parameter to use with the tool.
--switch1 | *given value* | Specify the first parameter to use with the tool.

Example tool output:
```bash
Something happened. 
```

> [!TIP]
> You can put a tip or important message here.


## Clean up resources
Clean up the resources you created in the quickstart either by deleting the [Azure resource group](../../azure-resource-manager/resource-group-overview.md), which includes all the resources in the resource group, or by deleting the one server resource if you want to keep the other resources intact.

> [!TIP]
> Other Quickstarts in this collection build upon this quick start. If you plan to continue on to work with subsequent quickstarts, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete resources created by this quickstart in the Azure portal.

To delete the entire resource group including the newly created server:
1.	Locate your resource group in the Azure portal. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of your resource group, such as our example **myresourcegroup**.
2.	On your resource group page, click **Delete**. Then type the name of your resource group, such as our example **myresourcegroup**, in the text box to confirm deletion, and then click **Delete**.

Or instead, to delete the newly created server:
1.	Locate your server in the Azure portal, if you do not have it open. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you created.
2.	On the **Overview** page, click the **Delete** button on the top pane.
3.	Confirm the server name you want to delete.
 
## Next steps
> [!div class="nextstepaction"]
> [What article is next in sequence](./doc-template-quickstart.md)
