[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include.md)]

Azure Communication Services is introducing a new user experience for purchasing phone numbers. This experience is currently being flighted, and you might be introduced to this experience when purchasing a phone number in Azure portal. If you have feedback on this experience, don't hesitate to give it through the **Give feedback** button on Azure portal extension.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../../create-communication-resource.md)

## Purchase a phone number

1. Navigate to your Communication Service resource in the [Azure portal](https://portal.azure.com). 
:::image type="content" source="../media/trial-phone-numbers/trial-overview.png" alt-text="Screenshot showing a Communication Services resource's main page." lightbox="./media/trial-phone-numbers/trial-overview.png":::

2. In the Communication Services resource overview, select on the "Phone numbers" option in the left-hand menu. 
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-start.png" alt-text="Screenshot showing a Communication Services resource's phone numbers page." lightbox="./media/trial-phone-numbers/get-phone-number-start.png":::

3. Select **Get** on the top left of the page to purchase your phone number. Selecting this launches our shopping wizard:
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-search.png" alt-text="Screenshot showing phone number shopping cart search wizard." lightbox="./media/phone-numbers-portal/get-phone-number-search.png":::

You'll first need to choose the **Country/region** where you would like to provision the phone number. Country availability is based on the billing location for your Azure subscription. More information on what numbers are available for each country can be found [here](../../../concepts/numbers/sub-eligibility-number-capability.md). Next you'll choose the [number type](../../../concepts/telephony/plan-solution.md#phone-number-types-in-azure-communication-services). You can select from two phone number types: **Local**, and **Toll-free**.

4. Select **Search** to pull up numbers that meet your selected criteria.
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-cart.png" alt-text="Screenshot showing phone number purchase page with available phone numbers." lightbox="./media/phone-numbers-portal/get-phone-number-cart.png":::

You also have various filters to search for the number that fits your needs, including:
- **Use case**: This is for whether you are using this number to call from an application (A2P) or from a human agent (P2P).
- **Calling**: This is for determining the Calling capabilities you would like for your phone number: Making calls and/or receiving calls. 
- **SMS**: This is for determining the SMS capabilities you would like for your phone number: Sending and/or receiving SMS messages.
- **Custom**: You can also add custom filters to get a certain prefix or set of digits in your phone number.

> [!NOTE]
> The prices shown are the **monthly recurring charges** which cover the cost of leasing the selected phone number to you. Not included in this view is the **Pay-as-you-go costs** which are incurred when you make or receive calls. The price lists are [available here](../../../concepts/pricing.md). These costs depend on number type and destinations called. For example, price-per-minute for a call from a Seattle regional number to a regional number in New York and a call from the same number to a UK mobile number may be different.

5. Once you find the phone number or numbers to your choosing, select **Add to cart** to hold the numbers in the Telephony cart. These numbers are held for 16 minutes before your cart is automatically cleared. 
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-cart2.png" alt-text="Screenshot showing phone number shopping cart with two phone numbers in the cart." lightbox="./media/phone-numbers-portal/get-phone-number-cart2.png":::

6. Select **Next** to review your purchase. To complete your purchase, select **Buy now**.
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-review.png" alt-text="Screenshot showing phone number shopping cart with two phone numbers in the cart." lightbox="./media/phone-numbers-portal/get-phone-number-review.png":::

7. You can find your purchased numbers back on the **Phone numbers** page. It might take a few minutes for the numbers to be provisioned. 
:::image type="content" source="../media/phone-numbers-portal/get-phone-number-purchased.png" alt-text="Screenshot showing phone number shopping cart with two phone numbers in the cart." lightbox="./media/phone-numbers-portal/get-phone-number-purchased.png":::


### Update Phone Number Capabilities

On the **Phone Numbers** page, you can select a phone number to configure it.

:::image type="content" source="../../media/manage-phone-azure-portal-capability-update.png" alt-text="Screenshot showing the update features page.":::

Select the features from the available options, then select **Save** to apply your selection.

### Release Phone Number

On the **Numbers** page, you can release phone numbers.

:::image type="content" source="../../media/manage-phone-azure-portal-release-number.png" alt-text="Screenshot showing the release phone numbers page.":::

Select the phone number that you want to release and then select on the **Release** button.