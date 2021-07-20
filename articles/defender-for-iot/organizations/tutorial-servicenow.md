---
title: Integrate ServiceNow with Azure Defender for IoT
description: In this tutorial, learn how to integrate ServiceNow with Azure Defender for IoT.
author: ElazarK
ms.author: v-ekrieg
ms.topic: tutorial
ms.date: 07/20/2021
ms.custom: template-tutorial
---

# Tutorial: Integrate ServiceNow with Azure Defender for IoT

This tutorial will help you to integrate the ServiceNow 

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Tutorial outline 
Required. Use the format provided in the list below.
-->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites


### Software RequirementsAccess to ServiceNow and Defender for IoT 

- ServiceNow Service Management version 3.0.2.

- Defender for IoT patch 2.8.11.1 or above.

> [!Note]
> If you are already working with a Defender for IoT and ServiceNow integration, and upgrade using the on-premises management console, pervious data received from Defender for IoT sensors should be cleared from ServiceNow.

### Architecture

- **On-premises management console architecture**: Set up an on-premises management console to communicate with one instance of ServiceNow. The on-premises management console pushes sensor data to the Defender for IoT application using REST API.

- **Sensor architecture**: If you want to set up your environment to include direct communication between sensors and ServiceNow, for each sensor define the ServiceNow Sync, Forwarding rules, and proxy configuration (if a proxy is needed).

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## [Section 1 heading]
<!-- Introduction paragraph -->

1. Sign in to the [<service> portal](url).
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->