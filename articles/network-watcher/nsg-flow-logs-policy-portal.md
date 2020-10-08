
# QuickStart: Deploy and manage NSG Flow Logs using Azure Policy 

## Overview
Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. In this article, we will use two built-in policies available for NSG Flow Logs to manage your flow logs setup. The first policy  flags any NSGs without flow logs enabled. The second policy automatically deploys Flow logs for NSGs without Flow logs enabled. 

## NSG Object property  
Flow Logs are currently enabled NSGs. This linkage is programmatically accessible, using the /flowlogs property of the NSG ARM objects. Thus, you can check if Flowlogs are enabled and retrieve the name of the Flowlog object using the property. This property is used in both the policies below. 

## Locate the policies
1. Go to the Azure portal – portal.azure.com 

Navigate to Azure Policy page by searching for Policy in the top search bar 
![Policy Home Page](./media/network-watcher-builtin-policy/1_policy-search.png)

2. Head over to the **Assignments** tab from the left pane

![Assignments Tab](./media/network-watcher-builtin-policy/2_assignments-tab.png)

3. Click on **Assign Policy** button 

![Assign Policy Button](./media/network-watcher-builtin-policy/3_assign-policy-button.png)

4. Hit the three dots menu under "Policy Definitions" to bring up the available policies

5. Use the Type filter and choose "Built-in". Then search for 'Flow log'
This should bring up the two built-in policies for Flow logs
![Policy List](./media/network-watcher-builtin-policy/4_filter-for-flow-log-policies.png)

6. Choose the policy you want to assign

- *"Flow log should be configured for every network security group"* is the audit policy that flags non-compliant NSGs i.e. NSGs without Flow logging enabled
- *"Deploy a flow log resource with target network security group"* is a policy with a deployment action, it enables Flow logs on all NSGs without Flow logs

There are separate instructions for each policy below.  

## Audit Policy 

### How the policy works

The policy checks all existing ARM objects of type “Microsoft.Network/networkSecurityGroups” i.e. it looks at all NSGs in a given scope, and checks for the existence of linked flowlogs via the flowlogs property. If the property doesn’t not exist, the NSG is flagged.

If you want to see the full definition of the policy, you can visit the [Defintions tab](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and search for "Flow logs" as shown below. Click

### Assignment

1. Fill in your policy details

- Scope: This is typically a subscription, you can also choose a management group or resource group as relevant to you.  
- Policy Definition: Should be chosen as shown above
- AssignmentName: Choose a descriptive name 

2. Click on "Review + Create" to review your assignment
This policy does not require any parameters. Since this is an audit policy, you do not need to fill the details in the "Remediation" tab.  

You should see something like the below. 

![Audit Policy Review](./media/network-watcher-builtin-policy/5_1_audit-policy-review.png)

### Results

To check the results, open the Compliance tab and search for the name of your Assignment.
You should see something like the below once your policy runs. In case your policy hasn't run, please wait for some time. 


## Deploy-If-not-exists Policy 

### Policy Structure

TK: <Insert huge DINE policy JSON>
For a given region, the policy checks all NSGs for the existence of a flow log. If the flow logs don’t exist, they are deployed. 
TK: Sync with Julio to get up to date on all the parameters. Especially the messy ones.
  
### Assignment
Insert complicated stuff 

### Results

========= Old crap below this ===================

### See the results of the policy
Click on the Compliance tab to see the state of the policy 
•	Search for the assignment name.
•	If you see “Not Started”, please wait for some time 
•	Else you should see the results 


Show 
•	Show state of RG after policy 

### Clean up. 
•	Delete assignment 

## Next steps 
•	Go deeper with ARM templates 
•	Learn more about Azure governance policies 
