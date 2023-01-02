
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../../create-communication-resource.md)

## Get a phone number

To begin provisioning numbers, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services resource's main page.":::

### Search for Available Phone Numbers

Navigate to the **Phone Numbers** blade in the resource menu.

:::image type="content" source="../../media/manage-phone-azure-portal-phone-page.png" alt-text="Screenshot showing a Communication Services resource's phone page.":::

Press the **Get** button to launch the wizard. The wizard on the **Phone numbers** blade will walk you through a series of questions that helps you choose the phone number that best fits your scenario. 

You will first need to choose the **Country/region** where you would like to provision the phone number. After selecting the Country/region, you will then need to select the **Use case** which best suites your needs. 

:::image type="content" source="../../media/manage-phone-azure-portal-get-numbers.png" alt-text="Screenshot showing the Get phone numbers view.":::

### Select your phone number features

Configuring your phone number is broken down into two steps: 

1. The selection of the [number type](../../../concepts/telephony/plan-solution.md#phone-number-types-in-azure-communication-services)
2. The selection of the [number capabilities](../../../concepts/telephony/plan-solution.md#phone-number-capabilities-in-azure-communication-services)

You can select from two phone number types: **Local**, and **Toll-free**. When you've selected a number type, you can then choose the feature.

In our example, we've selected a **Toll-free** number type with **Make calls** and **Send and receive SMS** features.

:::image type="content" source="../../media/manage-phone-azure-portal-select-plans.png" alt-text="Screenshot showing the Select features view.":::

From here, click the **Next: Numbers** button at the bottom of the page to customize the phone number(s) you would like to provision.

### Customizing phone numbers

On the **Numbers** page, you will customize the phone number(s) which you'd like to provision.

:::image type="content" source="../../media/manage-phone-azure-portal-select-numbers-start.png" alt-text="Screenshot showing the Numbers selection page.":::

> [!NOTE]
> This quickstart is showing the **Toll-free** Number type customization flow. The experience may be slightly different if you have chosen the **Local** Number type, but the end-result will be the same.

Choose the **Area code** from the list of available Area codes and enter the quantity which you'd like to provision, then click **Search** to find numbers which meet your selected requirements. The phone numbers which meet your needs will be shown along with their monthly cost.

:::image type="content" source="../../media/manage-phone-azure-portal-found-numbers.png" alt-text="Screenshot showing the Numbers selection page with reserved numbers.":::

> [!NOTE]
> Availability depends on the Number type, location, and the features that you have selected.
> Numbers are reserved for a short time before the transaction expires. If the transaction expires, you will need to re-select the numbers.

To view the purchase summary and place your order, click the **Next: Summary** button at the bottom of the page.

### Purchase Phone Numbers

The summary page will review the Number type, Features, Phone Numbers, and Total monthly cost to provision the phone numbers.

> [!NOTE]
> The prices shown are the **monthly recurring charges** which cover the cost of leasing the selected phone number to you. Not included in this view is the **Pay-as-you-go costs** which are incurred when you make or receive calls. The price lists are [available here](../../../concepts/pricing.md). These costs depend on number type and destinations called. For example, price-per-minute for a call from a Seattle regional number to a regional number in New York and a call from the same number to a UK mobile number may be different.

Finally, click **Place order** at the bottom of the page to confirm.

:::image type="content" source="../../media/manage-phone-azure-portal-get-numbers-summary.png" alt-text="Screenshot showing the Summary page with the Number type, Features, Phone Numbers, and Total monthly cost shown.":::

## Find your phone numbers on the Azure portal

Navigate to your Azure Communication Services resource on the [Azure portal](https://portal.azure.com):

:::image type="content" source="../../media/manage-phone-azure-portal-start.png" alt-text="Screenshot showing a Communication Services Resource's main page.":::

Select the Phone Numbers blade in the menu to manage your phone numbers.

:::image type="content" source="../../media/manage-phone-azure-portal-phones.png" alt-text="Screenshot showing a Communication Services Resource's phone number page.":::

> [!NOTE]
> It may take a few minutes for the provisioned numbers to be shown on this page.


### Update Phone Number Capabilities

On the **Phone Numbers** page, you can select a phone number to configure it.

:::image type="content" source="../../media/manage-phone-azure-portal-capability-update.png" alt-text="Screenshot showing the update features page.":::

Select the features from the available options, then click **Save** to apply your selection.

### Release Phone Number

On the **Numbers** page, you can release phone numbers.

:::image type="content" source="../../media/manage-phone-azure-portal-release-number.png" alt-text="Screenshot showing the release phone numbers page.":::

Select the phone number that you want to release and then click on the **Release** button.