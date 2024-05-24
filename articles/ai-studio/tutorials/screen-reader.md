---
title: Get started using Azure AI Studio with a screen reader
titleSuffix: Azure AI Studio
description: This quickstart guides you in how to get oriented and navigate Azure AI Studio with a screen reader.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: quickstart
ms.date: 5/21/2024
ms.reviewer: ailsaleen
ms.author: eur
author: eric-urban
---

# QuickStart: Get started using AI Studio with a screen reader

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

This article is for people who use screen readers such as [Microsoft's Narrator](https://support.microsoft.com/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1#WindowsVersion=Windows_11), JAWS, NVDA or Apple's Voiceover. In this quickstart, you'll be introduced to the basic structure of Azure AI Studio and discover how to navigate around efficiently. 

## Getting oriented in Azure AI Studio 

Most Azure AI Studio pages are composed of the following landmark structure: 

- Banner (contains Azure AI Studio app title, settings, and profile information)
    - Might sometimes contain a breadcrumb navigation element 
- Navigation
    - The contents of the navigation are different depending on whether you have selected a hub or project in the studio
- Main page content 
    - Usually contains a command toolbar 

For efficient navigation, it might be helpful to navigate by landmarks to move between these sections on the page.


## Navigation

The navigation is list of links divided into different sections. 

If you haven't yet created or selected a project, you can still explore content under the **Get started** (model catalog, model benchmarks, and AI Services) and **Management** (hubs and quota) sections.

Once you have created or selected a project, you can access more capabilities such as project playgrounds, tools (such as prompt flow and evaluation), and components (such as data and deployments). 

Once you have created or selected a project, you can also use the **Recent projects picker** button within the navigation to change project at any time.

For more information about the navigation, see [What is Azure AI Studio](../what-is-ai-studio.md).

## Projects 

To work within the Azure AI Studio, you must first [create a project](../how-to/create-projects.md): 
1. In [Azure AI Studio](https://ai.azure.com), select **Home** from the navigation.
1. Press the **Tab** key until you hear *New project* and select this button.  
1. Enter the information requested in the **Create a project** dialog.  

You then get taken to the project details page. 

## Using the playground 

The playground is where you can interact with models and experiment with different prompts and parameters. Different playgrounds are available depending on which model you would like to interact with.  

Once you have created or selected a project, go to the navigation landmark. Press the down arrow until you hear *Project playground*. Press the down arrow again until you hear a playground you would like to use.

### Chat playground structure 

In this mode, the playground is composed of the command toolbar and two main sections: one for configuring your system message and other parameters, and the other for chatting to the model. If you added your own data in the playground, the **Citations** pane also appears when selecting a citation as part of the model response. 

### Chat session pane  

The chat session pane is where you can chat to the model and test out your assistant. 
- After you send a message, the model might take some time to respond, especially if the response is long. You hear a screen reader announcement "Message received from the chatbot" when the model finishes composing a response.  

## Using prompt flow 

Prompt flow is a tool to create executable flows, linking LLMs, prompts, and Python tools through a visualized graph. You can use this to prototype, experiment, and iterate on your AI applications before deploying.  

Once you have created or selected a project, go to the navigation landmark. Press the down arrow until you hear *Prompt flow* and select this link.

The prompt flow UI in Azure AI Studio is composed of the following main sections: the command toolbar, flow (includes list of the flow nodes), files, and graph view. The flow, files, and graph sections each have their own H2 headings that can be used for navigation.


### Flow 

- This is the main working area where you can edit your flow, for example adding a new node, editing the prompt, selecting input data 
- You can also choose to work in code instead of the editor by navigating to the **Raw file mode** toggle button to view the flow in code. 
- Each node has its own H3 heading, which can be used for navigation.  

### Files 

- This section contains the file structure of the flow. Each flow has a folder that contains a flow.dag.yaml file, source code files, and system folders.  
- You can export or import a flow easily for testing, deployment, or collaborative purposes by navigating to the **Add** and **Zip and download all files** buttons.

### Graph view 

- The graph is a visual representation of the flow. This view isn't editable or interactive. 
- You hear the following alt text to describe the graph: "Graph view of [flow name] – for visualization only." We don't currently provide a full screen reader description for this graphical chart. To get all equivalent information, you can read and edit the flow by navigating to Flow, or by toggling on the Raw file view.  

 
## Evaluations  

Evaluation is a tool to help you evaluate the performance of your generative AI application. You can use this to prototype, experiment, and iterate on your applications before deploying.

### Creating an evaluation 

To review evaluation metrics, you must first create an evaluation.  

1. Once you have created or selected a project, go to the navigation landmark. Press the down arrow until you hear *Evaluation* and select this link.
1. Press the Tab key until you hear *new evaluation* and select this button.  
1. Enter the information requested in the **Create a new evaluation** dialog. Once complete, your focus is returned to the evaluations list. 

### Viewing evaluations 

Once you create an evaluation, you can access it from the list of evaluations.  

Evaluation runs are listed as links within the Evaluations grid. Selecting a link takes you to a dashboard view with information about your specific evaluation run. 

You might prefer to export the data from your evaluation run so that you can view it in an application of your choosing. To do this, select your evaluation run link, then navigate to the **Export result** button and select it. 

There's also a dashboard view provided to allow you to compare evaluation runs. From the main Evaluations list page, navigate to the **Switch to dashboard view** button. 

 
## Technical support for customers with disabilities 

Microsoft wants to provide the best possible experience for all our customers. If you have a disability or questions related to accessibility, contact the Microsoft Disability Answer Desk for technical assistance. The Disability Answer Desk support team is trained in using many popular assistive technologies. They can offer assistance in English, Spanish, French, and American Sign Language. Go to the Microsoft Disability Answer Desk site to find out the contact details for your region. 

If you're a government, commercial, or enterprise customer, contact the enterprise Disability Answer Desk. 

## Related content

* Learn how you can build generative AI applications in the [Azure AI Studio](../what-is-ai-studio.md).
* Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml).
