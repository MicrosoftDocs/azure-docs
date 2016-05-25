<properties 
	pageTitle="Policies in Azure API Management | Microsoft Azure" 
	description="Learn how to create, edit, and configure policies in API Management." 
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


#Policies in Azure API Management

In Azure API Management, policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. Popular Statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.

See the [Policy Reference][] for a full list of policy statements and their settings.

Policies are applied inside the gateway which sits between the API consumer and the managed API. The gateway receives all requests and usually forwards them unaltered to the underlying API. However a policy can apply changes to both the inbound request and outbound response.

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow][] and [Set variable][] policies are based on policy expressions. For more information, see [Advanced policies][] and [Policy expressions][].

## <a name="scopes"> </a>How to configure policies
Policies can be configured globally or at the scope of a [Product][], [API][] or [Operation][]. To configure a policy, navigate to the Policies editor in the publisher portal.

![Policies menu][policies-menu]

The policies editor consists of three main sections: the policy scope (top), the policy definition where policies are edited (left) and the statements list (right):

![Policies editor][policies-editor]

To begin configuring a policy you must first select the scope at which the policy should apply. In the screenshot below the **Starter** product is selected. Note that the square symbol next to the policy name indicates that a policy is already applied at this level.

![Scope][policies-scope]

Since a policy has already been applied, the configuration is shown in the definition view.

![Configure][policies-configure]

The policy is displayed read-only at first. In order to edit the definition click the **Configure Policy** action.

![Edit][policies-edit]

The policy definition is a simple XML document that describes a sequence of inbound and outbound statements. The XML can be edited directly in the definition window. A list of statements is provided to the right and statements applicable to the current scope are enabled and highlighted; as demonstrated by the **Limit Call Rate** statement in the screenshot above.

Clicking an enabled statement will add the appropriate XML at the location of the cursor in the definition view. 

>[AZURE.NOTE] If the policy that you want to add is not enabled, ensure that you are in the correct scope for that policy. Each policy statement is designed for use in certain scopes and policy sections. To review the policy sections and scopes for a policy, check the **Usage** section for that policy in the [Policy Reference][].

A full list of policy statements and their settings are available in the [Policy Reference][].

For example, to add a new statement to restrict incoming requests to specified IP addresses, place the cursor just inside the content of the `inbound` XML element and click the **Restrict caller IPs** statement.

![Restriction policies][policies-restrict]

This will add an XML snippet to the `inbound` element that provides guidance on how to configure the statement.

	<ip-filter action="allow | forbid">
		<address>address</address>
		<address-range from="address" to="address"/>
	</ip-filter>

To limit inbound requests and accept only those from an IP address of 1.2.3.4 modify the XML as follows:

	<ip-filter action="allow">
		<address>1.2.3.4</address>
	</ip-filter>

![Save][policies-save]

When complete configuring the statements for the policy, click **Save** and the changes will be propagated to the API Management gateway immediately.

##<a name="sections"> </a>Understanding policy configuration

A policy is a series of statements that execute in order for a request and a response. The configuration is divided appropriately into `inbound`, `backend`, `outbound`, and `on-error` sections as shown in the following configuration.

	<policies>
	  <inbound>
	    <!-- statements to be applied to the request go here -->
	  </inbound>
	  <backend>
	    <!-- statements to be applied before the request is forwarded to 
	         the backend service go here -->
	  </backend>
	  <outbound>
	    <!-- statements to be applied to the response go here -->
	  </outbound>
	  <on-error>
	    <!-- statements to be applied if there is an error condition go here -->
	  </on-error>
	</policies> 

If there is an error during the processing of a request, any remaining steps in the `inbound`, `backend`, or `outbound` sections are skipped and execution jumps to the statements in the `on-error` section. By placing policy statements in the `on-error` section you can review the error by using the `context.LastError` property, inspect and customize the error response using the `set-body` policy, and configure what happens if an error occurs. There are error codes for built-in steps and for errors that may occur during the processing of policy statements. For more information, see [Error handling in API Management policies](https://msdn.microsoft.com/library/azure/mt629506.aspx).

Since policies can be specified at different levels (global, product, api and operation) the configuration provides a way for you to specify the order in which the policy definition's statements execute with respect to the parent policy. 

Policy scopes are evaluated in the following order.

1. Global scope
2. Product scope
3. API scope
4. Operation scope

The statements within them are evaluated according to the placement of the `base` element, if it is present.

For example, if you have a policy at the global level and a policy configured for an API, then whenever that particular API is used both policies will be applied. API Management allows for deterministic ordering of combined policy statements via the base element. 

	<policies>
    	<inbound>
        	<cross-domain />
        	<base />
        	<find-and-replace from="xyz" to="abc" />
    	</inbound>
	</policies>

In the example policy definition above, the `cross-domain` statement would execute before any higher policies which would in turn, be followed by the `find-and-replace` policy.

If the same policy appears twice in the policy statement, the most recently evaluated policy is applied. You can use this to override policies that are defined at a higher scope. To see the policies in the current scope in the policy editor, click **Recalculate effective policy for selected scope**.

Note that global policy has no parent policy and using the `<base>` element in it has no effect. 

## Next steps

Check out following video on policy expressions.

> [AZURE.VIDEO policy-expressions-in-azure-api-management]

[Policy Reference]: api-management-policy-reference.md
[Product]: api-management-howto-add-products.md
[API]: api-management-howto-add-products.md#add-apis 
[Operation]: api-management-howto-add-operations.md

[Advanced policies]: https://msdn.microsoft.com/library/azure/dn894085.aspx
[Control flow]: https://msdn.microsoft.com/library/azure/dn894085.aspx#choose
[Set variable]: https://msdn.microsoft.com/library/azure/dn894085.aspx#set_variable
[Policy expressions]: https://msdn.microsoft.com/library/azure/dn910913.aspx

[policies-menu]: ./media/api-management-howto-policies/api-management-policies-menu.png
[policies-editor]: ./media/api-management-howto-policies/api-management-policies-editor.png
[policies-scope]: ./media/api-management-howto-policies/api-management-policies-scope.png
[policies-configure]: ./media/api-management-howto-policies/api-management-policies-configure.png
[policies-edit]: ./media/api-management-howto-policies/api-management-policies-edit.png
[policies-restrict]: ./media/api-management-howto-policies/api-management-policies-restrict.png
[policies-save]: ./media/api-management-howto-policies/api-management-policies-save.png
