#Policies

In Azure API Management, policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. Popular Statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.

Policies are applied inside the proxy which sits between the API consumer and the managed API. The proxy receives all requests and usually forwards them unaltered to the underlying API. However a policy can apply changes to both the inbound request and outbound response.

##How to configure policies
Policies can be configured at the scope of a [Product][], [API][], [Operation][] or a combination thereof. To configure a policy, navigate to the Policies editor in the Publisher Portal.

![policies-menu][]

The policies editor consists of three main sections: the policy scope (top), the policy definition where policies are edited (left) and the statements list (right):

![policies-editor][]

[Product]: ./apimanagement-howto-add-products
[API]: ./apimanagement-howto-add-apis 
[Operation]: ./apimanagement-howto-add-operations

To begin configuring a policy you must first select the scope at which the policy should apply. In the screenshot below the 15 Day Free Trial product is selected. Note that the square symbol next to the policy name indicates that a policy is already applied at this level.

![policies-scope][]

Since a policy has already been applied, the configuration is shown in the definition view.

![policies-configure][]

The policy is displayed readonly at first. In order to edit the definition click the Configure Policy action.

![policies-edit][]

The policy definition is a simple XML document that describes a sequence of inbound and outbound statements. The XML can be edited directly in the definition window. A list of statements is provided to the right and statements applicable to the current scope are enabled and highlighted; as demonstrated by the Limit Call Rate statement in the screenshot above.

Clicking an enabled statement will add the appropriate XML at the location of the cursor in the definition view. 

For example, to add a new statement to restrict incoming requests to specified IP addresses, place the cursor just inside the content of the "inbound" XML element and click the Restrict caller IPs statement.

![policies-restrict][]

This will add an XML snippet to the "inbound" element that provides guidance on how to configure the statement.

	<ip-filter action="allow | forbid">
		<address>address</address>
		<address-range from="address" to="address"/>
	</ip-filter>

To limit inbound requests and accept only those from an IP address of 1.2.3.4 modify the XML as follows:

	<ip-filter action="allow">
		<address>1.2.3.4</address>
	</ip-filter>

![policies-save][]

When complete configuring the statements for the policy, click Save and the changes will be propagated to the API Management proxy immediately.

#TODO - explain inbound/outbound/base

#TODO - recalculate effective policy



[policies-menu]: ./media/api-management-howto-policies/api-management-policies-menu.png
[policies-editor]: ./media/api-management-howto-policies/api-management-policies-editor.png
[policies-scope]: ./media/api-management-howto-policies/api-management-policies-scope.png
[policies-configure]: ./media/api-management-howto-policies/api-management-policies-configure.png
[policies-edit]: ./media/api-management-howto-policies/api-management-policies-edit.png
[policies-restrict]: ./media/api-management-howto-policies/api-management-policies-restrict.png
[policies-save]: ./media/api-management-howto-policies/api-management-policies-save.png