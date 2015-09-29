

# Overview

Azure Resource Manager now allows you to control access through custom
policies. A policy represents one or more violations that can be applied
at the desired scope. A scope in this case can be a subscription,
resource group or an individual resource.

Policy is a default allow system. A policy is defined through a Policy
Definition and is applied through a Policy Assignment. Policy
Assignments lets you control the scope of where a policy can be applied.

In this article, we will explain the basic structure of the policy
definition language that you can use to create policies. Then we will
describe how you can apply these policies at different scopes and
finally we will show some examples on how you can achieve this through
REST API. PowerShell support will also be added shortly.

# Common Scenarios

One common scenario is to require departmental tags for chargeback
purpose. An organization might want to allow operations only when the
appropriate cost center is associated. Else they would deny the request.
This would help them charge the appropriate cost center for the
operations performed.

Another common scenario is that the organization might want to control
the locations where resources are created. Or they might want to control
access to the resources by allowing only certain types of resources to
be provisioned.

Similarly, an organization can control the service catalog or enforce
the desired naming conventions for the resources.

Using policies, these scenarios can easily achieved as described below.

# Policy Definition Language

Policy definition is created using JSON. It consists of one or more
conditions/logical operators which define the actions and an effect
which tells what happens when the conditions are fulfilled.

## Basic Structure

Basically, a policy contains the following:

**Condition/Logical operators:** It contains a set of conditions which
can be manipulated through a set of logical operators.

**Effect:** This describes what the effect will be when the condition is
satisfied – either deny or audit. An audit effect will emit a warning
event service log. For example – An admin can create a policy which says
audit if anyone creates a large VM. Then he can review these logs later.


		{
		“if” : {

		<condition> | <logical operator>
		},
		“then” : {
		“effect” : “deny | audit”
		 }
		}


## Logical Operators

The supported logical operators along with the syntax are listed below:

| Operator Name		| Syntax		 |
| :------------- | :------------- |
| Not			 | “not” : {&lt;condition&gt;}			 |
| And			| “allOf” : [ {&lt;condition&gt;},	{&lt;condition&gt;}] |
| Or						 | "anyOf" : [ {&lt;condition&gt;},{&lt;condition&gt;}] |


## Conditions

The supported conditions along with the syntax are listed below:

| Condition Name | Syntax				 |
| :------------- | :------------- |
| Equals			 | “equals” : “&lt;value&gt;”				|
| Like					| “like” : “&lt;value&gt;”					 |
| Contains			| “contains” : “&lt;value&gt;”|
| In						| “in” : [ “&lt;value1&gt;”,“&lt;value2&gt;” ]|
| ContainsKey	 | "containsKey" : "&lt;keyName&gt;" |


## Fields and Sources

The conditions are formed through the use of fields and sources. The
following fields and sources are supported:

		 Fields: name, kind, type, location, tags, tags.

		 Sources: action

Policy Definition Examples
--------------------------

Now let’s take a look how we will define the policy to achieve the
scenarios listed above.

### Chargeback: Require departmental tags

The below policy denies all request which don’t have a tag containing
“costCenter” key.

		{
		 	“if” : {
					 	“not” : {
											“field” : “tags”,
											“containsKey” : “costCenter”
						 		 }
				 	},
			“then” : {
								“effect” : “deny”
			 		}
		}


### Geo Compliance: Ensure resource locations

The below example shows a policy which will deny all requests outside of
the location North Europe or West Europe.

		{
			“if” : {
					“not” : {
								“field” : “location”,
								“in” : [“northeurope” , “westeurope”]
							}
					} ,
			“then” : {
					“effect” : “deny”
			}
	}



### Service Curation: Select the service catalog

The below example shows the use of source. It shows that actions only on
the services of type Microsoft.Resources/\*, Microsoft.Compute/\*,
Microsoft.Storage/\*, Microsoft.Network/\* are allowed. Anything else
will be denied.

	{
		“if” : {
				“not” : {
					“anyOf” : [
								{
									“source” :	“action”,
									“like” : “Microsoft.Resources/*”
								},
								{
									“source” :	“action”,
									“like” : “Microsoft.Compute/*”
								},
								{
									“source” : “action”,
									“like” : “Microsoft.Storage/*”
								},
								{
									“source” : “action”,
									“like” : “Microsoft.Network/*”
								}

							]
						}
					} ,
		“then” : {
					“effect” : “deny”
				 }
	}

### Naming Convention

The below example shows the use of wildcard which is supported by the
“like”. The condition states that if the name does match the mentioned pattern (namePrefix\*nameSuffix) then deny
the request.

	{
		“if” : {
				“not” : {
							“field” : “name”,
							“like” : “namePrefix*nameSuffix”
					}
			} ,
		“then” : {
					“effect” : “deny”
			}
	}

# Policy Assignment

Policies can be applied at different scopes like subscription, resource
groups and individual resources. Policies are inherited by all child
resources. So if a policy is applied to a resource group, it will be
applicable to all the resources in that resource group.

# Creating a Policy

This section provides detail on how a policy can be created using REST
API and PowerShell.

## Create Policy Definition with REST API

You can create a policy with the REST API for Policy. The REST API enables you to create, delete policies and get information about existing policies.

To create a new policy, run:

	PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}

Below is an example of how the request body would look like–

	{
		 "properties":{
								"policyType":"Custom",
								"description":"Test Policy",
								"policyRule":{
		 									“if” : {
												“not” : {
															“field” : “tags”,
															“containsKey” : “costCenter”
														}
												} ,
											“then” : {
													“effect” : “deny”
												}
									}
		 				},
		 "id":"/subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyDefinitions/testdefinition",
		 "type":"Microsoft.Authorization/policyDefinitions",
		 "name":"testdefinition"
	}


The policy-definition can be defined as one of the examples shown above.
For api-version use *2015-10-01-preview*. For examples and more details,
see REST API for Policy.

# Applying a Policy

## Policy Assignment with REST API

You can apply the policy definition at the desired scope through the REST API for policy assignment
The REST API enables you to create, delete policy assignments and get information about existing assignments.

To create a new policy assignment, run:

	PUT https://management.azure.com /subscriptions/{subscription-id}/providers/Microsoft.authorization/policyassignments/{policyAssignmentName}?api-version={api-version}

The {policy-assignment} is the name of the policy assignment. For
api-version use *2015-10-01-preview*. For examples and more details, see
REST API for Policy assignment.

Below is an example of how the request body would look like-

	{
	 		"properties":{
								"displayName":"VM_Policy_Assignment",
								"policyDefinitionId":"/subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyDefinitions/testdefinition",
								"scope":"/subscriptions/########-####-####-####-############"
	 					},
	 		"id":"/subscriptions/########-####-####-####-############/providers/Microsoft.Authorization/policyAssignments/VMPolicyAssignment",
	 		"type":"Microsoft.Authorization/policyAssignments",
	 		"name":"VMPolicyAssignment"
	}
