---
author: craigshoemaker
ms.service: container-apps
ms.topic:  include
ms.date: 09/05/2023
ms.author: cshoe
---
1. In Visual Studio Code, right-click the `main.bicep` file and select **Deploy Bicep File**. Set or select the following in the prompts:

    |Prompt|Setting|
    |--|--|
    |Name for deployment|Select the default name.|
    |Subscription|Select the pricing subscription.|
    |Select Resource Group|Create or select an existing resource group.|
    |Select a parameter file|Select **None**.|
     

1. Watch the results in the terminal **Output** window. This includes the link to the Azure deployment, viewable in the Azure portal. 
1. View deploy log for the resource group in the Azure portal. Select **Settings -> Deployments** then select the deployment name you entered in a previous step. 