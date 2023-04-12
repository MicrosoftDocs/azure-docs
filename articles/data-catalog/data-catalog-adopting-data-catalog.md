---
title: Approach and process for adopting Azure Data Catalog
description: This article presents an approach and process for organizations considering adopting Azure Data Catalog, including defining a vision, identifying key business use cases, and choosing a pilot project.
ms.service: data-catalog
ms.topic: conceptual
ms.date: 12/14/2022
---

# Approach and process for adopting Azure Data Catalog

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

This article helps you get started adopting **Azure Data Catalog** in your organization. To successfully adopt **Azure Data Catalog**, focus on three key items: define your vision, identify key business use cases within your organization, and choose a pilot project.

## Introducing the Azure Data Catalog

Within the world of work, people's expectations of how they should be able to find expert information about data assets have changed. Today, with the widespread workplace use of social media tools such as Yammer, people expect to be able to quickly get assistance and advice on a wide range of topics. **Azure Data Catalog** helps businesses and teams consolidate information about enterprise data assets in a central repository. Data consumers can discover these data assets and gain knowledge contributed by subject matter experts.

This article presents an approach to getting started using **Azure Data Catalog**. The article describes a typical Data Catalog adoption plan for the fictitious company called Adventure Works.

**What is Azure Data Catalog?**

**Azure Data Catalog** is a fully managed service in Azure and an enterprise-wide information (metadata) catalog that enables self-service data source discovery. With Data Catalog, you register, discover, annotate, and connect to data assets. Data Catalog is designed to manage disparate information assets to make them easy to find data assets, understand them, and connect to them. It reduces the time to gain insights from available data and increases the value to organizations. To learn more, see [Microsoft Azure Data Catalog](https://azure.microsoft.com/services/data-catalog/).

## Azure Data Catalog adoption plan

An **Azure Data Catalog** adoption plan describes how the benefits of using the service are communicated to stakeholders and users, and what kind of training you provide to users. One key success driver to adopt Data Catalog is how effectively you communicate the value of the service to users and stakeholders. The primary audiences in an initial adoption plan are the users of the service. No matter how much buy-in you get from stakeholders, if the users, or customers, of your Data Catalog offering don't incorporate it into their usage, the adoption won't be successful. Therefore, this article assumes you have stakeholder buy-in, and focuses on creating a plan for user adoption of Data Catalog.
An effective adoption plan successfully engages people in what is possible with Data Catalog and gives them the information and guidance to achieve it. Users need to understand the value that Data Catalog provides to help them succeed in their jobs. When people see how Data Catalog can help them achieve more results with data, the value of adopting Data Catalog becomes clear. Change is hard, so an effective plan needs to take the challenges of change into account.

An adoption plan helps you communicate what is critical for people to succeed and achieve their goals. A typical plan explains how Data Catalog is going to make users' lives easier, and includes the following parts:

* **Vision Statement** - It helps concisely discuss the adoption plan with users, and stakeholders. It's your elevator pitch.
* **Pilot team and Influencers** - Learning from a pilot team and influencers help you refine how to introduce teams and users to Data Catalog. Influencers can peer coach fellow users. It also helps you identify blockers and drivers to adoption.
* **Plan for Communications and Buzz** - It helps users to understand how Data Catalog can help them, and can foster organic adoption within teams, and ultimately the entire organization.
* **Training Plan** - Comprehensive training generally leads to adoption success and favorable results.

Here are some tips to define an **Azure Data Catalog** adoption plan.

## Define your Data Catalog project vision

The first step to define an **Azure Data Catalog** adoption plan is to write an aspirational description of what you are trying to accomplish. It's best to keep the vision statement fairly broad, yet concise enough to define specific short-term, and long-term goals.

Here are some tips to help you define your vision:

* **Identify the key deployment driver** - Think about the specific data source management needs from the business that can be addressed with Data Catalog. It helps you state the top advantages of using Data Catalog. For example, there may be common data sources that all new employees need to learn about and use, or important and complex data sources that only a few key people deeply understand. **Azure Data Catalog** can help make these data sources easy to discover and understand, so that these well-known pain points can be addressed directly and early in the adoption of the service.
* **Be crisp and clear** - A clear understanding of the vision gets everyone on the same page about the value Data Catalog brings to the organization, and how the vision supports organizational goals.
* **Inspire people to want to use Data Catalog** - Your vision, and communication plan should inspire folks to recognize that Data Catalog can benefit them to find and connect to data sources to achieve more with data.
* **Specify goals and timeline** - It ensures your adoption plan has specific, achievable deliverables. A timeline keeps everyone focused, and allows for checkpoints to measure success.

Here's an example vision statement for a Data Catalog adoption plan for the fictitious company called Adventure Works:

**Azure Data Catalog** empowers the Adventure Works Finance team to collaborate on key data sources, so every team member can easily find and use the data they need and can share their knowledge with the team as a whole.

Once you have a crisp vision statement, you should identify a suitable pilot project for Data Catalog. Generally, there are several scenarios for Data Catalog, so the next section provides some tips to identify relevant uses cases.

## Identify Data Catalog business use cases

To identify use cases that are relevant to Data Catalog, engage with experts from various business units to identify relevant use cases and business issues to solve. Review existing challenges people have identifying and understanding data assets. For example, do teams learn about data assets only after asking several people in the organization who has relevant data sources?

It's best to choose use cases that represent low hanging fruit: cases that are important yet have a high likelihood of success if solved with Data Catalog.

Here are some tips to identify use cases:

* **Define the goals of the team** - How does the team achieve their goals? Don't focus on Data Catalog yet since you want to be objective at this stage. Remember it's about the business results, not about the technology.
* **Define the business problem** - What are the issues faced by the team regarding finding and learning about data assets? For example, information about important data sources may be found in Excel workbooks in a network folder, and the team may spend much time locating the workbooks.
* **Understand team culture related to change** - Many adoption challenges relate to resistance to change rather than the implementation of a new tool. How a team responds to change is important when identifying use cases since the existing process could be in place because "this is how we've always done it" or "if it isn't broken, why fix it?". Adopting any new tool or process is always easiest when the people affected understand the value to be realized from the change, and appreciate the importance of the problems to be solved.
* **Keep focus related to data assets** - When discussing the business problems a team faces, you need to "cut through the weeds", and focus on what's relevant to using enterprise data assets more effectively.

Here are some example use cases related to Data Catalog:

### Example use cases

* **Register central high-value data sources** - IT manages data sources used across the organization. IT can get started with Data Catalog by registering and annotating common enterprise data sources.
* **Register team-based data sources** - Different teams have useful, line-of-business data sources. Get started with **Azure Data Catalog** by identifying and registering key data sources used by many different teams, and capture the team's tribal knowledge in **Azure Data Catalog** annotations.
* **Self-service business intelligence** - Teams spend much time combining data from multiple sources. Register and annotate data sources in a central location to eliminate a manual data source discovery process.

To read more about Data Catalog scenarios, see [Azure Data Catalog common scenarios](data-catalog-common-scenarios.md).

Once you identify some use cases for Data Catalog, common scenarios should emerge. The next section discusses how to identify your first pilot project based on a use case.

## Choose a Data Catalog pilot project

A key success factor is to simplify, and start small. A well-defined pilot with a constrained scope helps keep the project moving forward without getting bogged down with a project that is too complex, or which has too many participants. But it's also important to include a mix of users, from early adopters to skeptics. Users who embrace the solution help you refine your future communication and buzz plan. Skeptics help you identify and address blocking issues. As skeptics become champions, you can use their feedback to identify success drivers.

Your pilot plan should phase in business goals that you want to achieve with Data Catalog. As you learn from the initial pilot, you can expand your user base. An initial closed pilot is good to establish measurable success, but the ultimate goal is for organic or viral growth. With organic growth of Data Catalog, users are in control of their own data usage, and can influence and encourage others to adopt and contribute to the catalog.

### Target the right team

When you choose your pilot project, select a team with the most appealing scenarios that solves an existing business problem. For example, a business analyst creates reports from a SQL Server database. The problem is that they became aware of the data source only after talking to several colleagues. Finally, after wasting time trying to find which data sources to use, they found out about an Excel workbook, which contains a description of each data source. Although the Excel workbook adequately describes the tables that they need, they would have quickly found these data sources if they were registered and annotated in **Azure Data Catalog**.

### Identify data heroes

Your first pilot project should have a few individuals who produce data and consume data so that the team has balanced representation.

**Data Producers** are people with expertise about data sources. For example, David in another team has worked extensively with key Adventure Works data sources. Prior to the adoption of **Azure Data Catalog**, David has created an Excel workbook to capture information about Adventure Works data sources.

**Data Consumers** are people with expertise on the use of the data to solve business problems. For example, Nancy is a business analyst uses Adventure Works SQL Server data sources to analyze data.

One of the business problems that **Azure Data Catalog** solves is to connect **Data Producers** to **Data Consumers**. It does so by serving as a central repository for information about enterprise data sources. David registers Adventure Works and SQL Server data sources in Data Catalog. Using crowdsourcing any user who discovers this data source can share her opinions on the data, in addition to using the data they've discovered. For example, Nancy discovers the data sources by searching the catalog, and shares her specialized knowledge about the data.  Now, others in the organization benefit from shared knowledge by searching the data catalog.

* To learn more about registering data sources, see [Register data sources](data-catalog-how-to-register.md).
* To learn more about discovering data sources, see [Search data sources](data-catalog-how-to-discover.md).

### Start small and focused

For most enterprise pilot projects, you should seed the catalog with high-value data sources so that business users can quickly see the value of Data Catalog. IT is a good place to start identifying common data sources that would be of interest to your pilot team. For supported data sources, such as SQL Server, we recommend using the **Azure Data Catalog** data source registration tool. With the data source registration tool, you can register a wide range of data sources including SQL Server and Oracle databases, and SQL Server Reporting Services reports. For a complete list of current data sources, see [Azure Data Catalog supported data sources](data-catalog-dsr.md).

Once you have identified and registered key data sources, it's possible to also import data source descriptions stored in other locations. The Data Catalog API allows developers to load descriptions and annotations from another location, such as the Excel Workbook that David created and maintains.

The next section describes an example project from the Adventure Works company.

### An example project

For this example, Nancy the Business Analyst, creates reports for her team, using data from a SQL Server database. The problem is that they became aware of the data source only after talking to several colleagues. They would have quickly found these data sources if they were registered and annotated in a central location such as **Azure Data Catalog**.

To illustrate how easily Nancy and her team can find high-value data, you use the data source registration tool to populate the Catalog with information (metadata) about the data sources. This way the information about the database is available to the team and the enterprise, not just a few individuals. Once data sources are registered in Data Catalog, Nancy and her team can easily use them. The result is a more comprehensive and relevant data catalog for her team and the enterprise. As more teams adopt Data Catalog, business data sources become easier to find and use; thus, enabling a more data-centric culture to achieve more with your data.

To learn more about the data source registration tool, see [Get started with Azure Data Catalog](data-catalog-get-started.md).

As part of the pilot project, Nancy's team also uses data sources that are described in an Excel workbook that David and is colleagues maintain. Since other teams in the enterprise also use Excel workbooks to describe data sources, the IT team decides to create a tool to migrate the Excel workbook to Data Catalog. By using the Data Catalog REST API to import existing annotations, the pilot project team can have a complete data catalog consisting of metadata extracted from the data sources using the data source registration tool, complete with information previously documented by data producers and consumers, without the need for manual re-entry. As the enterprise data catalog grows, the organization can use the data source registration tool for common data sources, and the Data Catalog API for custom sources and uncommon scenarios.

> [!NOTE]
> We wrote a sample tool that uses the **Azure Data Catalog** API to migrate an Excel workbook to Data Catalog. To learn about the Data Catalog API and the sample tool, [download the Ad Hoc workbook code sample](https://github.com/Azure-Samples/data-catalog-dotnet-excel-register-data-assets), and check out the [Azure Data Catalog REST API](/rest/api/datacatalog/) documentation.

After the pilot project is in place, it's time to execute your Data Catalog adoption plan.

### Execute

At this point you have identified use cases for Data Catalog, and you've identified your first project. In addition, you've registered the key Adventure Works data sources and have added information from the existing Excel workbook using the tool that IT built. Now it's time to work with the pilot team to start the Data Catalog adoption process.

Here are some tips to get you started:

* **Create excitement** - Business users get excited if they believe that **Azure Data Catalog** makes their lives easier. Try to make the conversation around the solution and the benefits it provides, not the technology.
* **Facilitate change** - Start small and communicate the plan to business users. To be successful, it's crucial to involve users from the beginning so that they influence the outcome and develop a sense of ownership about the solution.
* **Groom early adopters** - Early adopters are business users that are passionate about what they do, and excited to evangelize the benefits of **Azure Data Catalog** to their peers.
* **Target training** - Business users don't need to know everything about Data Catalog, so target training to address specific team goals. Focus on what users do, and how some of their tasks might change, to incorporate **Azure Data Catalog** into their daily routine.
* **Be willing to fail** - If the pilot isn't achieving the desired results, reevaluate, and identify areas to change - fix problems in the pilot before moving on to a larger scope.

Before your pilot team jumps into using Data Catalog, schedule a kick-off meeting to discuss expectations for the pilot project, and provide initial training.

### Set expectations

Setting expectations and goals helps business users focus on specific deliverables. To keep the project on track, assign regular (for example: daily or weekly based on the scope and duration of the pilot) homework assignments. One of the most valuable capabilities of Data Catalog is crowdsourcing data assets so that business users can benefit from knowledge of enterprise data. A great homework assignment is for each pilot team member to register or annotate at least one data source they've used. See [Register a data source](data-catalog-how-to-register.md) and [How to annotate data sources](data-catalog-how-to-annotate.md).

Meet with the team on a regular schedule to review some of the annotations. Good annotations about data sources are at the heart of a successful Data Catalog adoption because they provide meaningful data source insights in a central location. Without good annotations, knowledge about data sources remains scattered throughout the enterprise. See [How to annotate data sources](data-catalog-how-to-annotate.md).

And, the ultimate test of the project is whether users can discover and understand the data sources they need to use. Pilot users should regularly test the catalog to ensure that the data sources they use for their day to day work are relevant. When a required data source is missing or not properly annotated, this should serve as a reminder to register more data sources or to provide more annotations. This practice doesn't only add value to the pilot effort but also builds effective habits that carry over to other teams after the pilot is complete.

### Provide training

Training should be enough to get the users started, and tailored to the specific goals and experience level of the pilot team members. To get started with training, you can follow the steps in the [Get started with Azure Data Catalog](data-catalog-get-started.md) article. In addition, you can download the [Azure Data Catalog Pilot Project Training presentation](https://github.com/Azure-Samples/data-catalog-dotnet-get-started/blob/master/Azure%20Data%20Catalog%20Training.pptx?raw=true). This PowerPoint presentation should help you get started introducing Data Catalog to your pilot team members.

## Conclusion

Once your pilot team is running fairly smoothly and you've achieved your initial goals, you should expand Data Catalog adoption to more teams. Apply and refine what you learned from your pilot project to expand Data Catalog throughout your organization.

The early adopters who participated in the pilot can be helpful to communicate about the benefits of adopting Data Catalog. They can share with other teams how Data Catalog helped their team solve business problems, discover data sources more easily, and share insights about the data sources they use. For example, early adopters on the Adventure Works pilot team could show others how easy it's to find information about Adventure Works data assets that were once hard to find and understand.

This article was about getting started with **Azure Data Catalog** in your organization. We hope you were able to start a Data Catalog pilot project, and expand Data Catalog throughout your organization.

## Next steps

[Create an Azure Data Catalog](data-catalog-get-started.md)
