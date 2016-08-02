<properties 
	pageTitle="How to use properties in Azure API Management policies" 
	description="Learn how to use properties in Azure API Management policies." 
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


# How to use properties in Azure API Management policies

API Management policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of statements that are executed sequentially on the request or response of an API. Policy statements can be constructed using literal text values, policy expressions, and properties. 

Each API Management service instance has a properties collection of key/value pairs that are global to the service instance. These properties can be used to manage constant string values across all API configuration and policies. Each property has the following attributes.


| Attribute | Type            | Description                                                                                             |
|-----------|-----------------|---------------------------------------------------------------------------------------------------------|
| Name      | string          | The name of the property. It may contain only letters, digits, period, dash, and underscore characters. |
| Value     | string          | The value of the property. It may not be empty or consist only of whitespace.                           |
| Secret    | boolean         | Determines whether the value is a secret and should be encrypted or not.                                |
| Tags      | array of string | Optional tags that when provided can be used to filter the property list.                               |

Properties are configured in the publisher portal on the **Properties** tab. In the following example, three properties are configured.

![Properties][api-management-properties]

Property values can contain literal strings and [policy expressions](https://msdn.microsoft.com/library/azure/dn910913.aspx). The following table shows the previous three sample properties and their attributes. The value of `ExpressionProperty` is a policy expression that returns a string containing the current date and time. The property `ContosoHeaderValue` is marked as a secret, so its value is not displayed.

| Name               | Value                      | Secret | Tags    |
|--------------------|----------------------------|--------|---------|
| ContosoHeader      | TrackingId                 | False  | Contoso |
| ContosoHeaderValue | ••••••••••••••••••••••     | True   | Contoso |
| ExpressionProperty | @(DateTime.Now.ToString()) | False  |         |

## To use a property

To use a property in a policy, place the property name inside a double pair of braces like `{{ContosoHeader}}`, as shown in the following example.

	<set-header name="{{ContosoHeader}}" exists-action="override">
      <value>{{ContosoHeaderValue}}</value>
    </set-header>

In this example, `ContosoHeader` is used as the name of a header in a `set-header` policy, and `ContosoHeaderValue` is used as the value of that header. When this policy is evaluated during a request or response to the API Management gateway, `{{ContosoHeader}}` and `{{ContosoHeaderValue}}` are replaced with their respective property values.

Properties can be used as complete attribute or element values as shown in the previous example, but they can also be inserted into or combined with part of a literal text expression as shown in the following example: `<set-header name = "CustomHeader{{ContosoHeader}}" ...>`

Properties can also contain policy expressions. In the following example, the `ExpressionProperty` is used.

	<set-header name="CustomHeader" exists-action="override">
		<value>{{ExpressionProperty}}</value>
	</set-header>

When this policy is evaluated, `{{ExpressionProperty}}` is replaced with its value: `@(DateTime.Now.ToString())`. Since the value is a policy expression, the expression is evaluated and the policy proceeds with its execution.

You can test this out in the developer portal by calling an operation that has a policy with properties in scope. In the following example, an operation is called with the two previous example `set-header` policies with properties. Note that the response contains two custom headers that were configured using policies with properties.

![Developer portal][api-management-send-results]

If you look at the [API Inspector trace](api-management-howto-api-inspector.md) for a call that includes the two previous sample policies with properties, you can see the two `set-header` policies with the property values inserted as well as the policy expression evaluation for the property that contained the policy expression.

![API Inspector trace][api-management-api-inspector-trace]

Note that while property values can contain policy expressions, property values can't contain other properties. If text containing a property reference is used for a property value, such as `Property value text {{MyProperty}}`, that property reference won't be replaced and will be included as part of the property value.

## To create a property

To create a property, click **Add property** on the **Properties** tab.

![Add property][api-management-properties-add-property-menu]

**Name** and **Value** are required values. If this property value is a secret, check the **This is a secret** checkbox. Enter one or more optional tags to help with organizing your properties, and click **Save**.

![Add property][api-management-properties-add-property]

When a new property is saved, the **Search property** textbox is populated with the name of the new property and the new property is displayed. To display all properties, clear the **Search property** textbox and press enter.

![Properties][api-management-properties-property-saved]

For information on creating a property using the REST API, see [Create a property using the REST API](https://msdn.microsoft.com/library/azure/mt651775.aspx#Put).

## To edit a property

To edit a property, click **Edit** beside the property to edit.

![Edit property][api-management-properties-edit]

Make any desired changes, and click **Save**. If you change the property name, any policies that reference that property are automatically updated to use the new name.

![Edit property][api-management-properties-edit-property]

For information on editing a property using the REST API, see [Edit a property using the REST API](https://msdn.microsoft.com/library/azure/mt651775.aspx#Patch).

## To delete a property

To delete a property, click **Delete** beside the property to delete.

![Delete property][api-management-properties-delete]

Click **Yes, delete it** to confirm.

![Confirm delete][api-management-delete-confirm]

>[AZURE.IMPORTANT] If the property is referenced by any policies, you will be unable to successfully delete it until you remove the property from all policies that use it.

For information on deleting a property using the REST API, see [Delete a property using the REST API](https://msdn.microsoft.com/library/azure/mt651775.aspx#Delete).

## To search and filter properties

The **Properties** tab includes searching and filtering capabilities to help you manage your properties. To filter the property list by property name, enter a search term in the **Search property** textbox. To display all properties, clear the **Search property** textbox and press enter.

![Search][api-management-properties-search]

To filter the property list by tag values, enter one or more tags into the **Filter by tags** textbox. To display all properties, clear the **Filter by tags** textbox and press enter.

![Filter][api-management-properties-filter]

## Next steps

-	Learn more about working with policies
	-	[Policies in API Management](api-management-howto-policies.md)
	-	[Policy reference](https://msdn.microsoft.com/library/azure/dn894081.aspx)
	-	[Policy expressions](https://msdn.microsoft.com/library/azure/dn910913.aspx)

## Watch a video overview

> [AZURE.VIDEO use-properties-in-policies]

[api-management-properties]: ./media/api-management-howto-properties/api-management-properties.png
[api-management-properties-add-property]: ./media/api-management-howto-properties/api-management-properties-add-property.png
[api-management-properties-edit-property]: ./media/api-management-howto-properties/api-management-properties-edit-property.png
[api-management-properties-add-property-menu]: ./media/api-management-howto-properties/api-management-properties-add-property-menu.png
[api-management-properties-property-saved]: ./media/api-management-howto-properties/api-management-properties-property-saved.png
[api-management-properties-delete]: ./media/api-management-howto-properties/api-management-properties-delete.png
[api-management-properties-edit]: ./media/api-management-howto-properties/api-management-properties-edit.png
[api-management-delete-confirm]: ./media/api-management-howto-properties/api-management-delete-confirm.png
[api-management-properties-search]: ./media/api-management-howto-properties/api-management-properties-search.png
[api-management-send-results]: ./media/api-management-howto-properties/api-management-send-results.png
[api-management-properties-filter]: ./media/api-management-howto-properties/api-management-properties-filter.png
[api-management-api-inspector-trace]: ./media/api-management-howto-properties/api-management-api-inspector-trace.png

