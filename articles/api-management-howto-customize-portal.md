# Customizing the developer portal in Azure API Management

This guide shows you how to modify the look and feel of the developer portal for better consistency with your brand.

## In this topic

-	[Change the text/logo in the page headers][]
-	[Change the styling of the headers][]
-	[Edit the contents of a page][]
-	[Next steps][]




## <a name="change-page-headers"> </a>Change the text/logo in the page headers

One of the key aspects of portal customization you may want to do is replacing the text that is shown on all page headers with your company name or logo.

Developer portal content is modified via the API Management console, which is accessed through the Azure management portal. To reach the API Management console, click **Management Console** in the Azure Portal for your API Management service.

![api-management-management-console][]

The developer portal is based on the Orchard content management system. The header that appears on every page is a special type of content known as a widget. To edit the contents of that widget click **Widgets** from the **Developer Portal** menu on the left, and then select the **Header** widget from the list.

//image of selecting widgets and then header//
![api-management-create-api][]

The contents of the header are editable from within the **Body** field. Change the text to "Fabrikam Developer Portal" and click **Save** at the bottom of the page.

Now you should be able to see the new header on every page within the developer portal.

> To open the developer portal while in the management console, click on **Developer portal** in the top bar.

## <a name="change-headers-styling"> </a>Change the styling of the headers

The colors, fonts, sizes, spacings and other style-related elements of any page on the portal are defined by style rules. To edit the styles click on **Appearance** from the **Developer portal** menu in the Management console. Then click on **Begin customization** to enable the styling editor.

Your browser will switch to the developer portal, to a special hidden page that contains samples of content exemplifying all styling rules used anywhere on the site. To open the styling editor, move your cursor over the thin gray vertical line on the left-most part of the page. The editor toolbar should appear.

//image of minimized and open toolbar//

There are two main modes of editing styling rules - **Edit all rules** displays a list of all the style rules used anywhere; while **Pick element** allows you to select an element from the page you are on and will display styles only for this element.

In this section we would like to change the styling only of the headers. Click the **Pick element** option from the styling editor toolbar and then click on **Select an element to customize**. Elements will now become highlighted as you hover over them with the mouse to signify what element's styles you would see if you click. Move the mouse over the text representing the company name in the header ("Fabrikam Developer Portal" if you followed the instructions in the previous section) and click on it. A set of named and categorized styling rules will appear within the styling editor.

Each rule represents a styling property of the selected element. For example, for the header text selected above, the size of the text is in @font-size-h1 while the name of the font with alternatives is in @headings-font-family.

> If you are a developer, these rules are in fact LESS variables for a Bootstrap-based theme for the developer portal.

Let's change the color of the heading text. Select the entry in the **@headings-color** field and type #000000. This is the hex code for the color black. As you do this you will see that a square color indicator will appear at the end of the text box. If you click it a color picker will allow you create/pick any color of your choosing.

//image of color picker appearing//

When you are done with making changes to the styles of the selected element click on **Preview Changes** to see the results on the screen. At this time they are only visible to logged in administrator users. To make them visible to everyone, click on **Publish** from the styling editor and confirm the changes. They will become visible to all visitors of the developer portal momentarily.

//image of publish menu//

> To change the style rules that apply to any other element on the page follow the same procedure as you did for the header - click on **Pick an element** from the styling editor, select the element you are interested in, and start modifying the values of the style rules displayed on the screen.


## <a name="edit-page-contents"> </a>Edit the contents of a page

The developer portal consists of automatically generated pages like APIs, Products, Applications, Issues and manually written content. Since it is based on a content management system you can create such content as necessary.

To see the list of all existing content pages click on **Content** from the **Developer portal** menu in the Management console.

//image of content page//

Click on the "Welcome" page to edit what is displayed on the home page of the developer portal. Make the changes you would like, preview them if necessary, and then click on **Publish Now** to make them visible to everyone.

> The home page uses a special layout which allows it to display a banner at the top. This banner is not editable from the Content section. To edit this banner click on **Widgets** from the **Developer portal** menu, then select **Home page** from the **Current Layer** drop-down and then open the **Banner** item under the Featured section. The contents of this widget are editable just like any other page.

## <a name="next-steps"> </a>Next steps

TODO: link to the advance tutorial landing page with sublinks to each individual item.

[Create an API Management instance]: #create-service-instance
[Create an API]: #create-api
[Add an operation]: #add-operation
[Add the new API to a product]: #add-api-to-product
[Subscribe to the product that contains the API]: #subscribe
[Call an operation from the Developer Portal]: #call-operation
[View analytics]: #view-analytics
[Next steps]: #next-steps

[Configure API settings]: ./api-management-hotwo-create-apis/#configure-api-settings
[Responses]: ./api-management-howto-add-operations/#responses
[How create and publish a product]: ./api-management-howto-add-products

[Management Portal]: https://manage.windowsazure.com/

[api-management-management-console]: ./Media/api-management-get-started/api-management-management-console.png
[api-management-create-instance-menu]: ./Media/api-management-get-started/api-management-create-instance-menu.png
[api-management-create-instance-step1]: ./Media/api-management-get-started/api-management-create-instance-step1.png
[api-management-create-instance-step2]: ./Media/api-management-get-started/api-management-create-instance-step2.png
[api-management-instance-created]: ./Media/api-management-get-started/api-management-instance-created.png
[api-management-create-api]: ./Media/api-management-get-started/api-management-create-api.png
[api-management-add-new-api]: ./Media/api-management-get-started/api-management-add-new-api.png
[api-management-new-api-summary]: ./Media/api-management-get-started/api-management-new-api-summary.png
[api-management-myecho-operations]: ./Media/api-management-get-started/api-management-myecho-operations.png
[api-management-operation-signature]: ./Media/api-management-get-started/api-management-operation-signature.png
[api-management-list-products]: ./Media/api-management-get-started/api-management-list-products.png
[api-management-add-api-to-product]: ./Media/api-management-get-started/api-management-add-api-to-product.png
[api-management-add-myechoapi-to-product]: ./Media/api-management-get-started/api-management-add-myechoapi-to-product.png
[api-management-api-added-to-product]: ./Media/api-management-get-started/api-management-api-added-to-product.png
[api-management-developers]: ./Media/api-management-get-started/api-management-developers.png
[api-management-add-subscription]: ./Media/api-management-get-started/api-management-add-subscription.png
[api-management-add-subscription-window]: ./Media/api-management-get-started/api-management-add-subscription-window.png
[api-management-subscription-added]: ./Media/api-management-get-started/api-management-subscription-added.png
[api-management-developer-portal-menu]: ./Media/api-management-get-started/api-management-developer-portal-menu.png
[api-management-developer-portal-myecho-api]: ./Media/api-management-get-started/api-management-developer-portal-myecho-api.png
[api-management-developer-portal-myecho-api-console]: ./Media/api-management-get-started/api-management-developer-portal-myecho-api-console.png
[api-management-invoke-get]: ./Media/api-management-get-started/api-management-invoke-get.png
[api-management-invoke-get-response]: ./Media/api-management-get-started/api-management-invoke-get-response.png
[api-management-manage-menu]: ./Media/api-management-get-started/api-management-manage-menu.png
[api-management-dashboard]: ./Media/api-management-get-started/api-management-dashboard.png

[api-management-add-response]: ./Media/api-management-get-started/api-management-add-response.png
[api-management-add-response-window]: ./Media/api-management-get-started/api-management-add-response-window.png
[api-management-developer-key]: ./Media/api-management-get-started/api-management-developer-key.png
[api-management-mouse-over]: ./Media/api-management-get-started/api-management-mouse-over.png
[api-management-api-summary-metrics]: ./Media/api-management-get-started/api-management-api-summary-metrics.png
[api-management-analytics-overview]: ./Media/api-management-get-started/api-management-analytics-overview.png
[api-management-analytics-usage]: ./Media/api-management-get-started/api-management-analytics-usage.png
[api-management-]: ./Media/api-management-get-started/api-management-.png
[api-management-]: ./Media/api-management-get-started/api-management-.png