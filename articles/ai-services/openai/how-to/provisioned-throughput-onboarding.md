---
title: Azure OpenAI Service Provisioned Throughput Units (PTU) onboarding
description: Learn about provisioned throughput units onboarding and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 07/23/2024
manager: nitinme
author: mrbullwinkle 
ms.author: mbullwin 
recommendations: false
---

# Provisioned throughput units onboarding

This article walks you through the process of onboarding to [Provisioned Throughput Units (PTU)](../concepts/provisioned-throughput.md). Once you complete the initial onboarding, we recommend referring to the PTU [getting started guide](./provisioned-get-started.md).

> [!NOTE]
> Provisioned Throughput Units (PTU) are different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.

## When to use provisioned throughput units (PTU)

You should consider switching from pay-as-you-go to provisioned throughput when you have well-defined, predictable throughput requirements. Typically, this occurs when the application is ready for production or has already been deployed in production and there's an understanding of the expected traffic. This will allow users to accurately forecast the required capacity and avoid unexpected billing.  

### Typical PTU scenarios

- An application that is ready for production or in production.
- Application has predictable capacity/usage expectations.
- Application has real-time/latency sensitive requirements.

> [!NOTE]
> In function calling and agent use cases, token usage can be variable. You should understand your expected Tokens Per Minute (TPM) usage in detail prior to migrating the workloads to PTU.

## Sizing and estimation: provisioned managed only

Determining the right amount of provisioned throughput, or PTUs, you require for your workload is an essential step to optimizing performance and cost. This section describes how to use the Azure OpenAI capacity planning tool. The tool provides you with an estimate of the required PTU to meet the needs of your workload.

### Estimate provisioned throughput and cost

To get a quick estimate for your workload, open the capacity planner in the [Azure OpenAI Studio](https://oai.azure.com). The capacity planner is under **Management** > **Quotas** > **Provisioned**.

The **Provisioned** option and the capacity planner are only available in certain regions within the Quota pane, if you don't see this option setting the quota region to *Sweden Central* will make this option available. Enter the following parameters based on your workload.

| Input | Description |
|---|---|
|Model | OpenAI model you plan to use. For example: GPT-4 |
| Version | Version of the model you plan to use, for example 0614 |
| Peak calls per min | The number of calls per minute that are expected to be sent to the model |
| Tokens in prompt call | The number of tokens in the prompt for each call to the model. Calls with larger prompts will utilize more of the PTU deployment. Currently this calculator assumes a single prompt value so for workloads with wide variance, we recommend benchmarking your deployment on your traffic to determine the most accurate estimate of PTU needed for your deployment. |
| Tokens in model response | The number of tokens generated from each call to the model. Calls with larger generation sizes will utilize more of the PTU deployment. Currently this calculator assumes a single prompt value so for workloads with wide variance, we recommend benchmarking your deployment on your traffic to determine the most accurate estimate of PTU needed for your deployment. |

After you fill in the required details, select **Calculate** button in the output column.

The values in the output column are the estimated value of PTU units required for the provided workload inputs. The first output value represents the estimated PTU units required for the workload, rounded to the nearest PTU scale increment. The second output value represents the raw estimated PTU units required for the workload. The token totals are calculated using the following equation: `Total = Peak calls per minute * (Tokens in prompt call + Tokens in model response)`.

:::image type="content" source="../media/how-to/provisioned-onboarding/capacity-calculator.png" alt-text="Screenshot of the Azure OpenAI Studio landing page." lightbox="../media/how-to/provisioned-onboarding/capacity-calculator.png":::

> [!NOTE]
> The capacity planner is an estimate based on simple input criteria. The most accurate way to determine your capacity is to benchmark a deployment with a representational workload for your use case.

## Verify quota availability

Provisioned throughput deployments are sized in units called Provisioned Throughput Units (PTUs). PTU quota is granted to a subscription regionally and limits the total number of PTUs that can be deployed in that region across all models and versions.

Creating a new deployment requires available (unused) quota to cover the desired size of the deployment. For example: If a subscription has the following in South Central US:

- Total PTU Quota = 500 PTUs
- Deployments:
    * 100 PTUs: GPT-4o, `2024-05-13`
    * 100 PTUs: GPT-4, `0613`

Then 200 PTUs of quota are considered used, and there are 300 PTUs available for use to create new deployments.

## View available quota

From Azure AI Studio select **Quota** in the left hand navigation bar, and then select **Azure OpenAI Provisioned**

:::image type="content" source="../media/provisioned/quota-alternate.png" alt-text="Screenshot of new quota UI for Azure OpenAI provisioned." lightbox="../media/provisioned/quota-alternate.png":::

Here, you can view the quota granted in the selected subscription/region, and how much is used. For example, the screenshot above shows that 100 out of 200 PTUs of quota are used in South Central US. This means that 100 are available for use in creating new deployments.

By selecting the small arrow to the left of the quota name **Provisioned Managed Throughput Unit**, you can expand it to show the deployments contributing to the usage. In the example above, the “gpt-4-chatbot" deployment in the “Production-Deployments” resource is the deployment using 100 PTUs of the quota.

Select the **Request Quota** link on the right-hand side to request a new quota limit for a subscription and region.

## Create Azure OpenAI resources

Provisioned Throughput deployments are created via Azure OpenAI resource objects within Azure. You must have an Azure OpenAI resource in each region you intend to create a deployment. Use the Azure portal to [create your resources](./create-resource.md), if required. You can also navigate directly to the resource creation dialog by following the link in AI Studio, then select **Create new Azure OpenAI resource**.

:::image type="content" source="../media/provisioned/create.png" alt-text="Screenshot of new quota UI for Azure OpenAI provisioned create resource." lightbox="../media/provisioned/create.png":::

> [!NOTE]
> Azure OpenAI resources can be used with all types of Azure OpenAI deployments. There is no requirement to create dedicated resource just for your provisioned deployment.

## Create provisioned throughput deployments

1. Launch [Azure AI Studio](https://ai.azure.com/)
2. Select the Azure OpenAI resource in the desired region, then select **Deployments** in the left-hand navigation bar.

    :::image type="content" source="../media/provisioned/deployments.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/deployments.png":::

3. Select **Deploy base model**, then select the desired model.

    :::image type="content" source="../media/provisioned/select-model.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/select-model.png":::

4. Enter deployment information:

    :::image type="content" source="../media/provisioned/deploy-model.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/deploy-model.png":::

    - Provide the deployment name and model version.
    - Specify the Deployment Type as **Provisioned Managed**. This is what indicates a provisioned, instead of a standard deployment.
    - Note the message reminding you to purchase an Azure Reservation to obtain a discount for a term commitment.

5. Evaluate capacity availability.

    Azure regions have differing amounts of capacity available for provisioned deployments, and the capacity can change dynamically as customers scale up and down their provisioned deployments. If a region has less capacity available than your available quota, the following message will appear to show you how much capacity is available to deploy this model and version.

    :::image type="content" source="../media/provisioned/capacity.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/capacity.png":::

6. Choose the size of your deployment and select **Deploy**

    Use the slider to select the number of PTUs for this deployment. The slider moves in increments based on the model (for example some models are deployed in 50 PTU increments vs. 100 PTU increments).

    Once you’ve selected your PTUs, you can update other settings such as the Content Filter, and then select Deploy to create your deployment.

7. If there's insufficient capacity, choose another region.

    If you select more PTUs than are available as service capacity, you're given the option to choose a resource in a region that has available quota and capacity.

    :::image type="content" source="../media/provisioned/insufficient-capacity.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/insufficient- capacity.png":::

    Selecting **See other regions** brings up a dialog where you can select alternative regions with both available quota and capacity for this model. Select a new resource and the deployment dialog will redisplay with the new resource so that you can continue your deployment.

    :::image type="content" source="../media/provisioned/different-region.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/different-region.png":::

## Purchase an Azure Reservation to receive term discounts

The following is a summary of the steps to purchase an Azure reservation. Detailed documentation on purchasing and managing reservations can be found [here](TODO:aka.ms link to the Azure reservations doc that will be published in a separate PR).

Azure Reservations are purchased from the Azure portal, not from AI or Azure OpenAI Studio.

Before proceeding with a reservation purchase, ensure that the user and subscription are set up properly to purchase a reservation.

To buy a reservation:  

- You must have owner role or reservation purchaser role on an Azure subscription.  

- For Enterprise subscriptions, the Reserved Instances policy option must be enabled in the [Azure portal](/azure/cost-management-billing/manage/direct-ea-administration#view-and-manage-enrollment-policies). If the setting is disabled, you must be an EA Admin to enable it.  

- Direct Enterprise customers can update the Reserved Instances policy settings in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the Policies menu to change settings.  

- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure OpenAI reservations.  

1. Navigate to the reservation section of the Azure portal by searching for "Reservations" in the top search bar, then select **Reservations**.

    :::image type="content" source="../media/provisioned/reservations.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/reservations.png":::

2. Select **+Add** on the reservation portal

    :::image type="content" source="../media/provisioned/reservations-pane.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/reservations-pane.png":::

3. Select **Azure OpenAI** from the reservation catalog.

    :::image type="content" source="../media/provisioned/purchase.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/purchase.png":::

4. Choose the reservation product details and add to cart.

    :::image type="content" source="../media/provisioned/select-purchase.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/select-purchase.png":::

    - Select the reservation scope. This identifies the deployments that will be included in the discount. Options include: 

        - Resource Group
        - Single Subscription
        - Management Group (a user-selectable list of subscriptions)
        - Shared (all subscriptions in a billing account)

    - Choose the reservation product:
        - Region
        - Term (one month or one year)
        - Billing frequency (Monthly or Up-front)

    - Choose the PTUs to purchase
        - The Recommended Quantity is based on historical data on the hourly PTUs that have been generated by the deployments in the selected scope.
    - Add to cart

5. Complete the purchase(Select **View Cart**)

    :::image type="content" source="../media/provisioned/purchase-reservation.png" alt-text="Screenshot of new quota UI for Azure OpenAI deployments screen." lightbox="../media/provisioned/purchase-reservation.png":::

    Review/correct the content and review/purchase the reservation.

## Next steps

- [Provisioned Throughput Units (PTU) getting started guide](./provisioned-get-started.md)
- [Provisioned Throughput Units (PTU) concepts](../concepts/provisioned-throughput.md)
