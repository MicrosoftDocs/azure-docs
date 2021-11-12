---
title: HEART Analytics Workbook
description: Overview of HEART analytics workbook and its setup
ms.topic: conceptual
ms.date: 11/11/2021

---

# HEART Overview
This workbook uses click analytics auto-collection plugin to understand usage in a wholistic manner. The HEART framework was originally introduced by Google. In this workbook, we are using a metrics based approach to understand the product usage and uncover key questions to build a user centric product. 


# Framework Dimensions
HEART is an acronym standing for Happiness, Engagement, Adoption, Retention and Task Success and the measurement framework was originally introduced by Google. The measurement framework focuses on 5 customer experience dimensions: 

 

- Happiness: Measure of user attitude  
- Engagement: Level of user involvement 
- Adoption: Gaining new users 
- Retention: Rate at which users return  
- Task Success: Productivity empowerment 

 

Even though these dimensions are measured independently, they drive and interact with each other (As shown in below image)  

**Highlights**:  
- Adoption, engagement, and retention form a user activity funnel with only a portion of the users that adopting the tool getting retained. 
- Task success is the driver that progresses users down the funnel and moves them down the funnel from adoption to retention. 
- Happiness is an outcome of the other dimensions and not a stand-alone measurement. Users who have progressed down the funnel and are showing higher level of activity should be happier.   

  ![Heart Funnel](./media/usage-overview/heartfunnel.png)
  

# Getting Started
 Users can set up the [Click Analytics Auto-collection plugin](./javascript-click-analytics-plugin.md) via npm. (Note: This is a mandatory step to leverage the workbook). 

 

Once the plugin is configured, the next step is to open the workbook in the gallery. The workbook will be shown in the section titled **"Product Analytics using the Click Analytics Plugin"**. 

Users will notice that there are 7 workbooks in this section (image 1).  

 

The structure of the workbook is designed in a manner that users can use the master workbook which is designed in a tabbed manner to embed rest of the 6 workbooks  or individually use the workbook specific to the HEART dimension. We will walk through the workbook titled **"HEART Analytics - All Sections"**. 

![Workbooktabs](./media/usage-overview/heartworkbooktemplates.png)  

The first step after accessing the workbook would be validate that the telemetry has been correctly implemented and we are getting the data as expected to light up the metrics accurately. That can be done using the "Development Requirements" tab on the workbook as shown (image 2).  

# Workbook Structure
The workbook has visuals depicting metric trends for different HEART dimensions split over 8 tabs. The tabs in the workbook have descriptions on metric descriptions and how to interpret each of them. 

We recommend reading through the content in each tab to get a detailed understanding of interpretation within each tab. A brief description of the tabs can be seen below: 

- **Summary Tab** - Usage Funnel metrics giving a high level view of visits, interactions and repeat usage. 
- **Adoption** - This tab helps understand what is the penetration among the target audience, acquisition velocity and total user base*. 
- **Engagement** -  Frequency , Depth and Breadth of Usage. 
- **Retention** - Repeat Usage 
- **Task Success** - Enabling understanding of user flows and their time distributions. 
- **Happiness** -  We recommend using a survey tool to measure CSAT/NSAT over a 5 point scale. In this tab, we have provided the likelihood of happiness by using usage and performance metrics. 
- **Feature Metrics** - Enables understanding of HEART metrics at feature granularity. 

# FAQs 

 

 

# Additional Resources 

 

 
