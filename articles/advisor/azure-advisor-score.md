---
title: Optimize Azure workloads by using Advisor score
description: Use Azure Advisor score to get the most out of Azure.
ms.topic: article
ms.date: 09/09/2020

---

# Optimize Azure workloads by using Advisor score

## Introduction to Advisor score

Azure Advisor provides best practice recommendations for your workloads. These recommendations are personalized and actionable to help you:

* Improve the posture of your workloads and optimize your Azure deployments.
* Proactively prevent top issues by following best practices.
* Assess your Azure workloads against the five pillars of the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/).

As a core feature of Advisor, Advisor score can help you achieve these goals effectively and efficiently.

To get the most out of Azure, it's crucial to understand where you are in your workload optimization journey. You need to know which services or resources are consumed well and which are not. Further, you'll want to know how to prioritize your actions, based on recommendations, to maximize the outcome.

It's also important to track and report the progress you're making in this optimization journey. With Advisor score, you can easily do all these things with the new gamification experience.

As your personalized cloud consultant, Azure Advisor continually assesses your usage telemetry and resource configuration to check for industry best practices. Advisor then aggregates its findings into a single score. With this score, you can tell at a glance if you're taking the necessary steps to build reliable, secure, and cost-efficient solutions.

The Advisor score consists of an overall score, which can be further broken down into five category scores. One score for each category of Advisor represents the five pillars of the Well-Architected Framework.

You can track the progress you make over time by viewing your overall score and category score with daily, weekly, and monthly trends. You can also set benchmarks to help you achieve your goals.

![Screenshot that shows the Advisor Score page.](https://user-images.githubusercontent.com/41593141/195171041-3eacca75-751a-4407-bad0-1cf7b21c42ff.png)

## Interpret an Advisor score

Advisor displays your overall Advisor score and a breakdown for Advisor categories, in percentages. A score of 100% in any category means all your resources assessed by Advisor follow the best practices that Advisor recommends. On the other end of the spectrum, a score of 0% means that none of your resources assessed by Advisor follow Advisor's recommendations. Using these score grains, you can easily achieve the following flow:

* **Advisor score** helps you baseline how your workload or subscriptions are doing based on an Advisor score. You can also see the historical trends to understand what your trend is.
* **Score by category** for each recommendation tells you which outstanding recommendations will improve your score the most. These values reflect both the weight of the recommendation and the predicted ease of implementation. These factors help to make sure you can get the most value with your time. They also help you with prioritization.
* **Category score impact** for each recommendation helps you prioritize your remediation actions for each category.

The contribution of each recommendation to your category score is shown clearly on the **Advisor score** page in the Azure portal. You can increase each category score by the percentage point listed in the **Potential score increase** column. This value reflects both the weight of the recommendation within the category and the predicted ease of implementation to address the potentially easiest tasks. Focusing on the recommendations with the greatest score impact will help you make the most progress with time.

![Screenshot that shows the Advisor score impact.](https://user-images.githubusercontent.com/41593141/195171044-6a45fa99-a291-49f3-8914-2b596771e63b.png)

If any Advisor recommendations aren't relevant for an individual resource, you can postpone or dismiss those recommendations. They'll be excluded from the score calculation with the next refresh. Advisor will also use this input as additional feedback to improve the model.

## How is an Advisor score calculated?

Advisor displays your category scores and your overall Advisor score as percentages. A score of 100% in any category means all your resources, *assessed by Advisor*, follow the best practices that Advisor recommends. On the other end of the spectrum, a score of 0% means that none of your resources, assessed by Advisor, follows Advisor recommendations.

**Each of the five categories has a highest potential score of 100.** Your overall Advisor score is calculated as a sum of each applicable category score, divided by the sum of the highest potential score from all applicable categories. For most subscriptions, that means Advisor adds up the score from each category and divides by 500. But *each category score is calculated only if you use resources that are assessed by Advisor*.

### Advisor score calculation example

* **Single subscription score:** This example is the simple mean of all Advisor category scores for your subscription. If the Advisor category scores are - **Cost** = 73, **Reliability** = 85, **Operational excellence** = 77, and **Performance** = 100, the Advisor score would be (73 + 85 + 77 + 100)/(4x100) = 0.84% or 84%.
* **Multiple subscriptions score:** When multiple subscriptions are selected, the overall Advisor scores generated are weighted aggregate category scores. Here, each Advisor category score is aggregated based on resources consumed by subscriptions. After Advisor has the weighted aggregated category scores, Advisor does a simple mean calculation to give you an overall score for subscriptions.

### Scoring methodology

The calculation of the Advisor score can be summarized in four steps:

1. Advisor calculates the *retail cost of impacted resources*. These resources are the ones in your subscriptions that have at least one recommendation in Advisor.
1. Advisor calculates the *retail cost of assessed resources*. These resources are the ones monitored by Advisor, whether they have any recommendations or not.
1. For each recommendation type, Advisor calculates the *healthy resource ratio*. This ratio is the retail cost of impacted resources divided by the retail cost of assessed resources.
1. Advisor applies three additional weights to the healthy resource ratio in each category:

   * Recommendations with greater impact are weighted heavier than recommendations with lower impact.
   * Resources with long-standing recommendations will count more against your score.
   * Resources that you postpone or dismiss in Advisor are removed from your score calculation entirely.

Advisor applies this model at an Advisor category level to give an Advisor score for each category. **Security** uses a [secure score](../defender-for-cloud/secure-score-security-controls.md) model. A simple average produces the final Advisor score.

## Advisor score FAQs

### How often is my score refreshed?

Your score is refreshed at least once per day.

### Why do some recommendations have the empty "-" value in the category score impact column?

Advisor doesn't immediately include new recommendations or recommendations with recent changes in the scoring model. After a short evaluation period, typically a few weeks, they're included in the score.

### Why is the Cost score impact greater for some recommendations even if they have lower potential savings?

Your **Cost** score reflects both your potential savings from underutilized resources and the predicted ease of implementing those recommendations. For example, extra weight is applied to impacted resources that have been idle for a longer time, even if the potential savings is lower.

### Why don't I have a score for one or more categories or subscriptions?

Advisor generates a score only for the categories and subscriptions that have resources that are assessed by Advisor.

### What if a recommendation isn't relevant?

If you dismiss a recommendation from Advisor, it will be omitted from the calculation of your score. Dismissing recommendations also helps Advisor improve the quality of recommendations.

### Why did my score change?

Your score can change if you remediate impacted resources by adopting the best practices that Advisor recommends. If you or anyone with permissions on your subscription has modified or created new resources, you might also see fluctuations in your score. Your score is based on a ratio of the cost-impacted resources relative to the total cost of all resources.

### How does Advisor calculate the retail cost of resources on a subscription?

Advisor uses the pay-as-you-go rates published on [Azure pricing](https://azure.microsoft.com/pricing/). These rates don't reflect any applicable discounts. The rates are then multiplied by the quantity of usage on the last day the resource was allocated. Omitting discounts from the calculation of the resource cost makes Advisor scores comparable across subscriptions, tenants, and enrollments where discounts might vary.

### Do I need to view the recommendations in Advisor to get points for my score?

No. Your score reflects whether you adopt best practices that Advisor recommends, even if you adopt those best practices proactively and never view your recommendations in Advisor.

### Does the scoring methodology differentiate between production and dev-test workloads?

No, not for now. But you can dismiss recommendations on individual resources if those resources are used for development and test and the recommendations don't apply.

### Can I compare scores between a subscription with 100 resources and a subscription with 100,000 resources?

The scoring methodology is designed to control for the number of resources on a subscription and service mix. Subscriptions with fewer resources can have higher or lower scores than subscriptions with more resources.

### What does it mean when I see "Coming soon" in the score impact column?

This message means that the recommendation is new, and we're working on bringing it to the Advisor score model. After this new recommendation is considered in a score calculation, you'll see the score impact value for your recommendation.

### Does my score depend on how much I spend on Azure?

No. Your score isn't necessarily a reflection of how much you spend. Unnecessary spending will result in a lower **Cost** score.

## Access Advisor Score

In the left pane, under the **Advisor** section, see **Advisor score**.

![Screenshot that shows the Advisor Score entry point.](https://user-images.githubusercontent.com/41593141/195171046-f0db9b6c-b59f-4bef-aa33-6a5c2ace18c0.png)


## Next steps

For more information about Advisor recommendations, see:

* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
