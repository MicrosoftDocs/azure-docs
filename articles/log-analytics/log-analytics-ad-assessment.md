<properties
	pageTitle="Active Directory Assessment | Microsoft Azure"
	description="You can use the Active Directory Assessment solution to assess the risk and health of your server environments on a regular interval."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/20/2016"
	ms.author="banders"/>

# Active Directory Assessment

You can use the Active Directory Assessment solution to assess the risk and health of your server environments on a regular interval. They provide a prioritized list of recommendations specific to your deployed server infrastructure. Recommendations are categorized across six focus areas which helps your quickly understand the risk and health of your infrastructure and to help you easily take action to decrease risk and improve health.

The recommendations made are based on the knowledge and experiences gained by Microsoft engineers from based on thousands of customer visits. Each recommendation provides guidance about why each issue might matter to you and how to implement the suggested changes.

You can choose focus areas that are most important to your organization and track your progress toward running a risk free and healthy environment.

## Installing and configuring the solution
Use the following information to install and configure the solutions.

### Prerequisites

- The Active Directory Assessment solution requires .NET Framework 4 installed on each computer that has an OMS agent.


### Configuration

- Add the Active Directory Assessment solution to your OMS workspace using the process described in [Add solutions](log-analytics-add-solutions.md).  There is no further configuration required.


When you install the solution, the AdvisorAssessment.exe file is added to monitored servers. Configuration data is read and then the data is sent to the OMS service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. When assessments are completed, summary information for focus areas are shown on the **Assessment** dashboard for the infrastructure in your environment. By using the information on the **AD Assessment** dashboard, you can view and then take recommended actions for your server infrastructure.

![image of SQL Assessment tile](./media/log-analytics-ad-assessment/ad-tile.png)

![image of SQL Assessment dashboard](./media/log-analytics-ad-assessment/ad-assessment.png)





## Assessment data collection details

The following table shows data collection methods and other details about how data is collected for AD Assessment.

| platform | Direct Agent | SCOM agent | Azure Storage | SCOM required? | SCOM agent data sent via management group | collection frequency |
|---|---|---|---|---|---|---|
|Windows|![Yes](./media/log-analytics-ad-assessment/oms-bullet-green.png)|![Yes](./media/log-analytics-ad-assessment/oms-bullet-green.png)|![No](./media/log-analytics-ad-assessment/oms-bullet-red.png)|	![No](./media/log-analytics-ad-assessment/oms-bullet-red.png)|![Yes](./media/log-analytics-ad-assessment/oms-bullet-green.png)|	7 days|



## AD Assessment solutions FAQ

*How often does an assessment run?*
- The assessment runs every 7 days.

*Is there a way to configure how often the assessment runs?*
- Not at this time.

*If another server for is discovered after I’ve added an assessment solution, will it be assessed?*
- Yes, once it is discovered it is assessed from then on, every 7 days.

*If a server is decommissioned, when will it be removed from the assessment?*
- If a server does not submit data for 3 weeks, it is removed.

*What is the name of the process that does the data collection?*
- AdvisorAssessment.exe

*How long does it take for data to be collected?*
- The actual data collection on the server takes about 1 hour. It may take longer on servers that have a large number of Active Directory servers.

*What type of data is collected?*
- The following types of data are collected:
    - WMI
    - Registry
    - Performance counters

*Is there a way to configure when data is collected?*
- Not at this time.

*Why display only the top 10 recommendations?*
- Instead of giving you an exhaustive overwhelming list of tasks, we recommend that you focus on addressing the prioritized recommendations first. After you address them, additional recommendations will become available. If you prefer to see the detailed list, you can view all recommendations using the OMS log search.

*Is there a way to ignore a recommendation?*
- Yes, see [Ignore recommendations](#ignore-recommendations) section below.

## Understanding how recommendations are prioritized

Every recommendation made is given a weighting value that identifies the relative importance of the recommendation. Only the ten most important recommendations are shown.

### How weightings are calculated

Weightings are aggregate values based on three key factors:

- The *probability* that an issue identified will cause problems. A higher probability equates to a larger overall score for the recommendation.

- The *impact* of the issue on your organization if it does cause a problem. A higher impact equates to a larger overall score for the recommendation.

- The *effort* required to implement the recommendation. A higher effort equates to a smaller overall score for the recommendation.

The weighting for each recommendation is expressed as a percentage of the total score available for each focus area. For example, if a recommendation in the Security and Compliance focus area has a score of 5%, implementing that recommendation will increase your overall Security and Compliance score by 5%.

### Focus areas

**Security and Compliance** - Safeguard the reputation of your organization by defending yourself from security threats and breaches, enforcing corporate policies, and meeting technical, legal and regulatory compliance requirements.

**Availability and Business Continuity** - Keep your services available and your business profitable by ensuring the resiliency of your infrastructure and by having the right level of business protection in the event of a disaster.

**Performance and Scalability** - Help your organization to grow and innovate by ensuring that your IT environment can meet current performance requirements and can respond quickly to changing business needs.

**Upgrade, Migration and Deployment** - Position your IT department to be the key driver of change and innovation, by taking full advantage of new enabling technologies to unlock more business value for organizational units, workforce and customers.

**Operations and Monitoring** - Lower your IT maintenance budget by streamlining your IT operations and implementing a comprehensive preventative maintenance program to maximize business performance.

**Change and Configuration Management** - Protect the day-to-day operations of your organization and ensure that changes won't negatively affect the business by establishing change control procedures and by tracking and auditing system configurations.

### Should you aim to score 100% in every focus area?

Not necessarily. The recommendations made are based on the knowledge and experiences gained by Microsoft engineers across thousands of customer visits. However, no two server infrastructures are the same, and specific recommendations may be more or less relevant to you. For example, some security recommendations might be less relevant if your virtual machines are not exposed to the Internet. Some availability recommendations may be less relevant for services that provide low priority ad hoc data collection and reporting. Issues that are important to a mature business may be less important to a start-up. You may want to identify which focus areas are your priorities and then look at how your scores change over time.

Every recommendation made includes guidance about why the recommendation might be important. You should use this guidance to evaluate whether implementing the recommendation is appropriate for you, given the nature of your IT services and the business needs of your organization.

## Use assessment focus area recommendations

Before you can use an assessment solution in OMS, you must have the solution installed. To read more about installing solutions, see [Add solutions](log-analytics-add-solutions.md). After it is installed, you can view the summary of recommendations by using the Assessment tile on the Overview page in OMS.

You can summary compliance assessments for your infrastructure and then drill-into recommendations.

![image of Assessment recommendations](./media/log-analytics-ad-assessment/ad-focus.png)



### To view recommendations for a focus area and take corrective action

1. On the **Overview** page, click the **Assessment** tile for your server infrastructure.

2. On the **Assessment** page, review the summary information in one of the focus area blades and then click one to view recommendations for that focus area.

3. On any of the focus area pages, you can view the prioritized recommendations made for your environment. Click a recommendation to view its details about why the recommendation is made and it appears under **Affected Objects**.

4. Take corrective actions suggested in **Suggested Actions**. When the item has been addressed, later assessments will record that recommended actions were taken and your compliance score will increase. Corrected items appear as **Passed Objects**.

## Ignore recommendations

If you have recommendations that you want to ignore, you can create a text file that OMS will use to prevent recommendations from appearing in your assessment results.

### To identify recommendations that you might want to ignore

1.	Sign in to your workspace and open Log Search. Use the following queries to list recommendations that have failed for computers in your environment.

    ```
    Type=ADAssessmentRecommendation RecommendationResult=Failed | select  Computer, RecommendationId, Recommendation | sort  Computer
    ```

    ![failed recommendations](./media/log-analytics-ad-assessment/ad-failed-recommendations.png)

2.	Choose recommendations that you want to ignore. You’ll use the values for RecommendationId in the next procedure.


### To create and use an IgnoreRecommendations.txt text file

1.	Create a file named IgnoreRecommendations.txt.
2.	Paste or type each RecommendationId for each recommendation that you want OMS to ignore on a separate line and then save and close the file.
3.	Put the file in the following folder on each computer where you want OMS to ignore recommendations.
    - On computers with the Microsoft Monitoring Agent (connected directly or through Operations Manager) - *SystemDrive*:\Program Files\Microsoft Monitoring Agent\Agent
    - On the Operations Manager management server - *SystemDrive*:\Program Files\Microsoft System Center 2012 R2\Operations Manager\Server

### To verify that recommendations are ignored

1.	After the next scheduled assessment run, by default every 7 days, the specified recommendations are marked Ignored and will not appear on the assessment dashboard.
2.	You can use the following Log Search queries to list all the ignored recommendations.

    ```
    Type=ADAssessmentRecommendation RecommendationResult=Ignored | select  Computer, RecommendationId, Recommendation | sort  Computer
    ```

3.	If you decide later that you want to see ignored recommendations, remove any IgnoreRecommendations.txt files, or you can remove RecommendationIDs from them.


## Next steps
- [Search logs](log-analytics-log-searches.md)
