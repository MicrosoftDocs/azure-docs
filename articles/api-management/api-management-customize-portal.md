<properties
	pageTitle="Customize the developer portal in Azure API Management | Microsoft Azure"
	description="Learn how to customize the developer portal in Azure API Management."
	services="api-management"
	documentationCenter=""
	authors="steved0x"
	manager="erikre"
	editor=""/>

<tags
	ms.service="api-management"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/25/2016"
	ms.author="sdanie"/>

# Customize the developer portal in Azure API Management

This guide shows you how to modify the look and feel of the developer portal in Azure API Management for consistency with your brand.

## <a name="change-page-headers"> </a>Change the text or logo in the page header

One of the key aspects of portal customization is replacing the text at the top of all pages with your company name or logo.

Content within the developer portal is modified via the publisher portal, which is accessed through the Azure Classic Portal. To reach the API publisher portal, click **Manage** in the Azure Classic Portal for your API Management service.

![Publisher portal][api-management-management-console]

The developer portal is based on a content management system or CMS. The header that appears on every page is a special type of content known as a widget. To edit the contents of that widget, click **Widgets** from the **Developer Portal** menu on the left, and then select the **Header** widget from the list.

![Widgets header][api-management-widgets-header]

The contents of the header is editable from within the **Body** field. Change the text to "Fabrikam Developer Portal", and then click **Save** at the bottom of the page.

Now you should be able to see the new header on every page within the developer portal.

> To open the developer portal while in the publisher portal, click **Developer portal** in the top bar.

## <a name="change-headers-styling"> </a>Change the styling of the headers

The colors, fonts, sizes, spacings, and other style-related elements of any page on the portal are defined by style rules. To edit the styles, click **Appearance** from the **Developer portal** menu in the publisher portal, and then click **Begin customization** to enable the styling editor.

Your browser switches to a hidden page within the developer portal that contains samples of content, with examples for all styling rules used anywhere on the site. To open the styling editor, move your cursor over the thin gray vertical line on the left-most part of the page. The editor toolbar should appear.

![Customization toolbar][api-management-customization-toolbar]

There are two main modes of editing styling rules - **Edit all rules** displays a list of all the style rules used anywhere, while **Pick element** allows you to select an element from the page you are on and displays styles only for that element.

In this section, we want to change the styling of only the headers. Click the **Pick element** option from the styling editor toolbar, and then click **Select an element to customize**. Elements now become highlighted as you hover over them with the mouse to signify what element's styles you would start editing if you clicked. Move the mouse over the text that represents the company name in the header ("Fabrikam Developer Portal" if you followed the instructions in the previous section), and then click it. A set of named and categorized styling rules appears within the styling editor.

Each rule represents a styling property of the selected element. For example, for the header text selected above, the size of the text is in @font-size-h1 while the name of the font with alternatives is in @headings-font-family.

> If you're familiar with [bootstrap][], these rules are in fact [LESS variables][] within the bootstrap theme used by the developer portal.

Let's change the color of the heading text. Select the entry in the **@headings-color** field and type **#000000**. This is the hex code for the color black. As you do this, you see that a square color indicator appears at the end of the text box. If you click this indicator, a color picker lets you to choose a color.

![Color picker][api-management-customization-toolbar-color-picker]

When you are done making changes to the styles of the selected element, click **Preview Changes** to see the results on the screen. At this time, they are visible only to administrators. To make these changes visible to everyone, click the **Publish** button in the styling editor and confirm the changes.

![Publish menu][api-management-customization-toolbar-publish-form]

> To change the style rules that apply to any other element on the page, follow the same procedure as you did for the header. Click **Pick an element** from the styling editor, select the element you are interested in, and start modifying the values of the style rules displayed on the screen.

## <a name="edit-page-contents"> </a>Edit the contents of a page

The developer portal consists of automatically generated pages like APIs, Products, Applications, Issues, and manually written content. Because it is based on a content management system, you can create such content as necessary.

To see the list of all existing content pages, click **Content** from the **Developer portal** menu in the publisher portal.

![Manage content][api-management-customization-manage-content]

Click the **Welcome** page to edit what is displayed on the home page of the developer portal. Make the changes you want, preview them if necessary, and then click **Publish Now** to make them visible to everyone.

> The home page uses a special layout that allows it to display a banner at the top. This banner is not editable from the **Content** section. To edit this banner, click **Widgets** from the **Developer portal** menu, select **Home page** from the **Current Layer** drop-down list, and then open the **Banner** item under the **Featured section**. The contents of this widget are editable just like any other page.

## <a name="next-steps"> </a>Next steps

-	Check out the other topics in the [Get started with advanced API configuration][] tutorial.

[Change the text/logo in the page headers]: #change-page-headers
[Change the styling of the headers]: #change-headers-styling
[Edit the contents of a page]: #edit-page-contents
[Next steps]: #next-steps

[Azure Classic Portal]: https://manage.windowsazure.com/

[api-management-management-console]: ./media/api-management-customize-portal/api-management-management-console.png
[api-management-widgets-header]: ./media/api-management-customize-portal/api-management-widgets-header.png
[api-management-customization-toolbar]: ./media/api-management-customize-portal/api-management-customization-toolbar.png
[api-management-customization-toolbar-color-picker]: ./media/api-management-customize-portal/api-management-customization-toolbar-color-picker.png
[api-management-customization-toolbar-publish-form]: ./media/api-management-customize-portal/api-management-customization-toolbar-publish-form.png
[api-management-customization-manage-content]: ./media/api-management-customize-portal/api-management-customization-manage-content.png


[Get started with advanced API configuration]: api-management-get-started-advanced.md
[bootstrap]: http://getbootstrap.com/
[LESS variables]: http://getbootstrap.com/css/
