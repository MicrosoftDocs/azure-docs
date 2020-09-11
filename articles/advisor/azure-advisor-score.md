---
title: Optimize Azure workloads using Advisor score
description: Use Advisor score to get the most out of Azure
ms.topic: article
ms.date: 09/09/2020

---

# Advisor score to get the most out of Azure

## Introduction to Advisor score

Azure Advisor provides best practice recommendations for your workloads. These recommendations are personalized and actionable to help you:
* Improve the posture of your workloads and optimize your Azure deployments
* Proactively prevent top issues by following best practices
* Assess your Azure workloads against the five pillars of the [Microsoft Azure Well-Architected Framework](https://docs.microsoft.com/azure/architecture/framework/)

As a core feature of Advisor, the **Advisor score** is devised to help you achieve these goals effectively and efficiently. 

To get the most out of Azure, it's crucial to understand where you are in your workload optimization journey, which services/resources are consumed well and which are not. Further, you'll want to know how to prioritize your actions, based on recommendations, to maximize the outcome. It's also important to track and report the progress you're making in this optimization journey. With **Advisor score**, you can easily do all these things with our new gamification experience. As your personalized cloud consultant, Azure Advisor continually assesses your usage telemetry and resource configuration to check for industry best practices. Advisor then aggregates its findings into a single score so you can tell, at a glance, if you’re taking the necessary steps to build reliable, secure, and cost-efficient solutions. 
The Advisor score consists of an overall score, which can be further broken down into five category scores, one for each category of Azure Advisor which represents the five pillars of the Well-Architected Framework. 
You can track the progress you make over time by viewing your overall score and category score with daily, weekly, and monthly trend, and you can set benchmarks to help you achieve your goals. 

 ![Advisor score experience](./media/advisor-score-1.png)

## How to consume Advisor score
Advisor displays your overall Advisor score and breakdown for Advisor categories, in percentages. A score of 100% in any category means all your resources assessed by Advisor follow the best practices that Advisor recommends. On the other end of the spectrum, a score of 0% means that none of your resources assessed by Advisor follow Advisor’s recommendations. Using these score grains you can easily achieve below flow:
* **Advisor score** to help you Baseline how your workload/subscriptions are doing based on Advisor score. You can also see the historical trends to understand what your trend is.
* **Advisor Category scores** to help you understand which categories need more attention and helps you with prioritization
* **Potential Score increase** of each recommendation to help you prioritize your remediation actions for each category

The contribution of each recommendation to your score is shown clearly on the overview page in the Azure portal. You can increase your score by adopting the best practices, and you can prioritize the recommendations that have greatest **potential score increase** to make the fastest progress with the time you have.  

![Advisor score impact](./media/advisor-score-2.png)

Because Advisor’s scoring methodology applies extra weight to more expensive resources with long-standing recommendations, you can make the most progress by remediating the resources with the highest retail cost first. 
In case any of Advisor recommendations are not relevant for an individual resource, you can dismiss those recommendations to exclude them from the score calculation and send feedback to Advisor to improve its recommendations. 

## How is Advisor score calculated?
Advisor displays your category scores and your overall Advisor score as percentages. A score of 100% in any category means all your resources, *assessed by Advisor*, follow the best practices that Advisor recommends. On the other end of the spectrum, a score of 0% means that none of your resources, assessed by Advisor, follow Advisor’s recommendations. 
**Each of the five categories has a highest potential score of 100.** Your overall Advisor score is calculated as a sum of each applicable category score, divided by the sum of the highest potential score from all applicable categories. For most subscriptions, that means Advisor adds up the score from each category and divide by 500. However, **each category score is calculated only if you use resources that are assessed by Advisor.**

### Scoring methodology: 
The calculation of the Advisor score can be summarized in four steps:
1. Advisor calculates the **daily retail cost of impacted resources**, which are the resources on your subscriptions that have at least one recommendation in Advisor.
2. Advisor calculates the **daily retail cost of assessed resources**, which are the resources that are monitored by Advisor, whether they have any recommendations or not. 
3. For each recommendation type, Advisor calculates the **healthy resource ratio**, which is the cost of impacted resources divided by the cost of assessed resources.
4. Advisor applies three additional weights to the healthy resource ratio in each category:
* Recommendations with greater impact are weighted heavier than those with lower impact.
* Resources with long-standing recommendations will count more against your score.
* Resources that you dismiss in Advisor are removed from your score calculation entirely. 
    
Advisor applies this model at an Advisor category level (Security uses [Secure Score](https://docs.microsoft.com/azure/security-center/secure-score-security-controls#introduction-to-secure-score) model), giving us Advisor score for each category and further a simple average produces the final Advisor score.


## Advisor score FAQ
* **How often is my score refreshed?**
Your score is refreshed at least once per day. 
* **Do I need to view the recommendations in Advisor to get point for my score?**
No. Your score reflects whether you adopt best practices that Advisor recommends, even if you never view those recommendations in Advisor and adopt best practices proactively.  
* **How do Advisor calculate the daily retail cost of resources on a subscription?**
Advisor uses the *pay as you go* rates published on the Azure.com pricing page, which does not reflect any applicable discounts, multiplied by the quantity of usage on the last day the resource was allocated. Omitting discounts from the calculation of the resource cost makes Advisor score comparable across subscriptions, tenants, and enrollments where discounts may vary. 
* **What if a recommendation is not relevant?**
If you dismiss a recommendation from Advisor, it will be omitted from the calculation of your score. Dismissing recommendations also help Advisor improve the quality of recommendations.
* **Why did my score change?** 
You score can change if you remediate impacted resources by adopting the best practices that Advisor recommends. If you or anyone with permissions on your subscription has modified or created new resources, you might also see fluctuations in your score because your score is based on a ratio of the cost impacted resources relative to the total cost of all resources.
* **Does my score depend on how much I spend on Azure?**
No. The score is designed to control for the size of a subscription and service mix. 
* **Does the scoring methodology differentiate between production and dev-test workloads?**
No, not for now, but you can dismiss recommendations on individual resources if those resources are used for development and test and the recommendation does not apply.
* **Can I compare scores between a subscription with 100 resources and a subscription with 100,000 resources?**
The scoring methodology is designed to control for number of resources on a subscription and service mix, so subscriptions with fewer resources can have higher or lower scores than subscriptions with more resources. 

## How to access Advisor
Advisor score is in public preview in Azure portal. You have to go to Advisor section and you will find Advisor score as the 2nd menu item in the left nav. 

![Advisor Score entry-point](./media/advisor-score-3.png)

## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
