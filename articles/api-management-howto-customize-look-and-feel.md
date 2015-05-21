<properties 
	pageTitle="How to customize the look and feel of the developer portal in Azure API Management" 
	description="How to customize the look and feel of the developer portal in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="sdanie"/>

# How to customize the look and feel of the developer portal in Azure API Management

The colors, fonts, sizes, spacings and other aspects of the developer portal's look and feel are defined by style rules. Sets of these rules exist for each structural element of a page - the header, the menu, the content body, page title, etc. In this how-to, you will learn how to modify the style rules.

To edit style rules, click on **Appearance** from the **Developer portal** menu in the Publisher portal. Then click on **Begin customization** to enable the styling editor.

Your browser will switch to a hidden page within the developer portal that contains samples of content, with examples for all styling rules used anywhere on the site. To open the styling editor, move your cursor over the thin gray vertical line on the left-most part of the page. The editor toolbar should appear as below: 

![Customization toolbar][api-management-customization-toolbar]

There are two main modes for editing style rules - **Edit all rules** displays a list of all the style rules used anywhere; while **Pick element** allows you to select an element from the page you are on and will display styles only for that particular element.

In this section, we would like to change the styling of only a specific element - for example, the page headers. Click the **Pick element** option from the styling editor toolbar and then click on **Select an element to customize**. Elements will now become highlighted as you hover over them to signify the element's styles you would see if you click on it. 

Move the mouse over the text representing the page title in the header and click on it. A set of named and categorized styling rules will appear within the styling editor.

Each rule represents a styling property of the selected element. For example, for the header text selected above, the size of the text is in @font-size-h1 while the name of the font with alternatives is in @headings-font-family.

> If you're familiar with [bootstrap][http://getbootstrap.com/], these rules are in fact [LESS variables][http://getbootstrap.com/css/] within the bootstrap theme used by the developer portal.

Let's change the color of the heading text now! Select the entry in the **@headings-color** field and type #000000. This is the hex code for the color black. As you do this, you will see that a square color indicator will appear at the end of the text box. If you click on this indicator, a color picker will allow you to choose a color.

![Color picker][api-management-customization-toolbar-color-picker]

When you are done with making changes to the styles of the selected element click on **Preview Changes** to see the results on the screen. At this time they are only visible to Administrators. To make these changes visible to everyone, click on **Publish** button in the styling editor and confirm the changes.

![Publish form][api-management-customization-toolbar-publish-form]

> To change the style rules that apply to any other element on the page follow the same procedure as you did for the header - click on **Pick an element** from the styling editor, select the element you are interested in, and start modifying the values of the style rules displayed on the screen.


[Next steps]: #next-steps

[Management Portal]: https://manage.windowsazure.com/

[api-management-customization-toolbar]: ./media/api-management-howto-customize-look-and-feel/api-management-customization-toolbar.png
[api-management-customization-toolbar-color-picker]: ./media/api-management-howto-customize-look-and-feel/api-management-customization-toolbar-color-picker.png
[api-management-customization-toolbar-publish-form]: ./media/api-management-howto-customize-look-and-feel/api-management-customization-toolbar-publish-form.png
