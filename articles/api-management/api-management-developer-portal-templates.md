<properties 
	pageTitle="How to customize the Azure API Management developer portal using templates | Microsoft Azure" 
	description="Learn how to customize the Azure API Management developer portal using templates." 
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
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>


# How to customize the Azure API Management developer portal using templates

Azure API Management provides several customization features to allow administrators to [customize the look and feel of the developer portal](api-management-customize-portal.md), as well as customize the content of the developer portal pages using a set of templates that configure the content of the pages themselves. Using [DotLiquid](http://dotliquidmarkup.org/) syntax, and a provided set of localized string resources, icons, and page controls, you have great flexibility to configure the content of the pages as you see fit using these templates.

## Developer portal templates overview

Developer portal templates are managed in the developer portal by administrators of the API Management service instance. To manage developer templates, navigate to your API Management service instance in the Azure Classic Portal and click **Browse**.

![Developer portal][api-management-browse]

If you are already in the publisher portal, you can access the developer portal by clicking **Developer portal**.

![Developer portal menu][api-management-developer-portal-menu]

To access the developer portal templates, click the customize icon on the left to display the customization menu, and click **Templates**.

![Developer portal templates][api-management-customize-menu]

The templates list displays several categories of templates covering the different pages in the developer portal. Each template is different, but the steps to edit them and publish the changes are the same. To edit a template, click the name of the template.

![Developer portal templates][api-management-templates-menu]

Clicking a template takes you to the developer portal page that is customizable by that template. In this example the **Product list** template is displayed. The **Product list** template controls the area of the screen indicated by the red rectangle. 

![Products list template][api-management-developer-portal-templates-overview]

Some templates, like the **User Profile** templates, customize different parts of the same page. 

![User profile templates][api-management-user-profile-templates]

The editor for each developer portal template has two sections displayed at the bottom of the page. The left-hand side displays the editing pane for the template, and the right-hand side displays the data model for the template. 

The template editing pane contains the markup that controls the appearance and behavior of the corresponding page in the developer portal. The markup in the template uses the [DotLiquid](http://dotliquidmarkup.org/) syntax. One popular editor for DotLiquid is [DotLiquid for Designers](https://github.com/dotliquid/dotliquid/wiki/DotLiquid-for-Designers). Any changes made to the template during editing are displayed in real-time in the browser, but are not visible to your customers until you [save](#to-save-a-template) and [publish](#to-publish-a-template) the template.

![Template markup][api-management-template]

The **Template data** pane provides a guide to the data model for the entities that are available for use in a particular template. It provides this guide by displaying the live data that are currently displayed in the developer portal. You can expand the template panes by clicking the rectangle in the upper-right corner of the **Template data** pane.

![Template data model][api-management-template-data]

In the previous example there are two products displayed in the developer portal that were retrieved from the data displayed in the **Template data** pane, as shown in the following example.

	{
		"Paging": {
			"Page": 1,
			"PageSize": 10,
			"TotalItemCount": 2,
			"ShowAll": false,
			"PageCount": 1
		},
		"Filtering": {
			"Pattern": null,
			"Placeholder": "Search products"
		},
		"Products": [
			{
				"Id": "56ec64c380ed850042060001",
				"Title": "Starter",
				"Description": "Subscribers will be able to run 5 calls/minute up to a maximum of 100 calls/week.",
				"Terms": "",
				"ProductState": 1,
				"AllowMultipleSubscriptions": false,
				"MultipleSubscriptionsCount": 1
			},
			{
				"Id": "56ec64c380ed850042060002",
				"Title": "Unlimited",
				"Description": "Subscribers have completely unlimited access to the API. Administrator approval is required.",
				"Terms": null,
				"ProductState": 1,
				"AllowMultipleSubscriptions": false,
				"MultipleSubscriptionsCount": 1
			}
		]
	}

The markup in the **Product list** template processes the data to provide the desired output by iterating through the collection of products to display information and a link to each individual product. Note the `<search-control>` and `<page-control>` elements in the markup. These control the display of the searching and paging controls on the page. `ProductsStrings|PageTitleProducts` is a localized string reference that contains the `h2` header text for the page. For a list of string resources, page controls, and icons available for use in developer portal templates, see [API Management developer portal templates reference](https://msdn.microsoft.com/library/azure/mt697540.aspx).

	<search-control></search-control>
	<div class="row">
	    <div class="col-md-9">
	        <h2>{% localized "ProductsStrings|PageTitleProducts" %}</h2>
	    </div>
	</div>
	<div class="row">
	    <div class="col-md-12">
		{% if products.size > 0 %}
		<ul class="list-unstyled">
		{% for product in products %}
			<li>
				<h3><a href="/products/{{product.id}}">{{product.title}}</a></h3>
				{{product.description}}
			</li>	
		{% endfor %}
		</ul>
		<paging-control></paging-control>
		{% else %}
		{% localized "CommonResources|NoItemsToDisplay" %}
		{% endif %}
		</div>
	</div>

## To save a template

To save a template, click save in the template editor.

![Save template][api-management-save-template]

Saved changes are not live in the developer portal until they are published.

## To publish a template

Saved templates can be published either individually, or all together. To publish an individual template, click publish in the template editor.

![Publish template][api-management-publish-template]

Click **Yes** to confirm and make the template live on the developer portal.

![Confirm publish][api-management-publish-template-confirm]

To publish all currently unpublished template versions, click **Publish** in the templates list. Unpublished templates are designated by an asterisk following the template name. In this example, the **Product list** and **Product** templates are being published.

![Publish templates][api-management-publish-templates]

Click **Publish customizations** to confirm.

![Confirm publish][api-management-publish-customizations]

Newly published templates are effective immediately in the developer portal.

## To revert a template to the previous version

To revert a template to the previous published version, click revert in the template editor.

![Revert template][api-management-revert-template]

Click **Yes** to confirm.

![Confirm][api-management-revert-template-confirm]

The previously published version of a template is live in the developer portal once the revert operation is complete.

## To restore a template to the default version

Restoring templates to their default version is a two-step process. First the templates must be restored, and then the restored versions must be published.

To restore a single template to the default version click restore in the template editor.

![Revert template][api-management-reset-template]

Click **Yes** to confirm.

![Confirm][api-management-reset-template-confirm]

To restore all templates to their default versions, click **Restore default templates** on the template list.

![Restore templates][api-management-restore-templates]

The restored templates must then be published individually or all at once by following the steps in [To publish a template](#to-publish-a-template).

## Developer portal templates reference

For reference information for developer portal templates, string resources, icons, and page controls, see [API Management developer portal templates reference](https://msdn.microsoft.com/library/azure/mt697540.aspx).

## Watch a video overview

Watch the following video to see how to add a discussion board and ratings to the API and operation pages in the developer portal using templates.

> [AZURE.VIDEO adding-developer-portal-functionality-using-templates-in-azure-api-management]


[api-management-customize-menu]: ./media/api-management-developer-portal-templates/api-management-customize-menu.png
[api-management-templates-menu]: ./media/api-management-developer-portal-templates/api-management-templates-menu.png
[api-management-developer-portal-templates-overview]: ./media/api-management-developer-portal-templates/api-management-developer-portal-templates-overview.png
[api-management-template]: ./media/api-management-developer-portal-templates/api-management-template.png
[api-management-template-data]: ./media/api-management-developer-portal-templates/api-management-template-data.png
[api-management-developer-portal-menu]: ./media/api-management-developer-portal-templates/api-management-developer-portal-menu.png
[api-management-browse]: ./media/api-management-developer-portal-templates/api-management-browse.png
[api-management-user-profile-templates]: ./media/api-management-developer-portal-templates/api-management-user-profile-templates.png
[api-management-save-template]: ./media/api-management-developer-portal-templates/api-management-save-template.png
[api-management-publish-template]: ./media/api-management-developer-portal-templates/api-management-publish-template.png
[api-management-publish-template-confirm]: ./media/api-management-developer-portal-templates/api-management-publish-template-confirm.png
[api-management-publish-templates]: ./media/api-management-developer-portal-templates/api-management-publish-templates.png
[api-management-publish-customizations]: ./media/api-management-developer-portal-templates/api-management-publish-customizations.png
[api-management-revert-template]: ./media/api-management-developer-portal-templates/api-management-revert-template.png
[api-management-revert-template-confirm]: ./media/api-management-developer-portal-templates/api-management-revert-template-confirm.png
[api-management-reset-template]: ./media/api-management-developer-portal-templates/api-management-reset-template.png
[api-management-reset-template-confirm]: ./media/api-management-developer-portal-templates/api-management-reset-template-confirm.png
[api-management-restore-templates]: ./media/api-management-developer-portal-templates/api-management-restore-templates.png







