---
title: Manage NSG flow logs by using Azure Policy 
titleSuffix: Azure Network Watcher
description: Learn how to use built-in policies to manage the deployment of Azure Network Watcher NSG flow logs.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/30/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Manage NSG flow logs by using Azure Policy

Azure Policy helps you enforce organizational standards and assess compliance at scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management.

In this article, you learn how to use two built-in policies to manage your setup of network security group (NSG) flow logs. The first policy flags any network security group that doesn't have flow logs enabled. The second policy automatically deploys flow logs to network security groups that don't have flow logs enabled.

To learn more about Azure Policy, see [What is Azure Policy?](../governance/policy/overview.md) and [Quickstart: Create a policy assignment to identify non-compliant resources](../governance/policy/assign-policy-portal.md).

## Locate the policies

1. Go to the [Azure portal](https://portal.azure.com).

2. Go to the Azure Policy page by entering **policy** on the top search bar and then selecting **Policy**.

   ![Screenshot that shows searching for Azure Policy in the Azure portal.](./media/network-watcher-builtin-policy/1_policy-search.png)

3. On the left pane, select **Assignments**.

   ![Screenshot that shows the selection for opening the page for assignments in the Azure portal.](./media/network-watcher-builtin-policy/2_assignments-tab.png)

4. Select **Assign Policy**.

   ![Screenshot that shows the button for assigning a policy.](./media/network-watcher-builtin-policy/3_assign-policy-button.png)

5. Select the three dots under **Policy Definitions** to show available policies.

6. For the **Type** filter, select **Built-in**. Then enter **flow log** in the search box.

   The two built-in policies for flow logs appear.

   ![Screenshot that shows a list of policy definitions.](./media/network-watcher-builtin-policy/4_filter-for-flow-log-policies.png)

7. Choose the policy that you want to assign:

   - **Deploy a flow log resource with target network security group** is the policy with a deployment action. It enables flow logs on all network security groups that don't have flow logs.
   - **Flow log should be configured for every network security group** is the audit policy that flags non-compliant network security groups (network security groups that don't have flow logging enabled).

## Audit policy

The audit policy checks all existing Azure Resource Manager objects of type `Microsoft.Network/networkSecurityGroups`. That is, it looks at all network security groups in a scope, and it checks for the existence of linked flow logs via the flow logs property of the network security group. If the property doesn't exist, the policy flags the network security group.

To get the full definition of the policy, go to the [Definitions tab](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and search for **flow logs** to find the policy.

### Assignment

1. Fill in your policy details:

   - **Scope**: A subscription is a common choice. You can also choose a management group or resource group as relevant to you.  
   - **Policy definition**: This definition is for the policy that you assigned earlier.
   - **Assignment name**: Choose a descriptive name.

2. Select **Review + create** to review your assignment.

   The policy doesn't require any parameters. As you're assigning an audit policy, you don't need to fill in the details on the **Remediation** tab.

   Select **Create** when you're finished.

   ![Screenshot that shows the tab for reviewing and creating an audit policy.](./media/network-watcher-builtin-policy/5_1_audit-policy-review.png)

### Results

To check the results, open the **Compliance** tab and search for the name of your assignment. Something similar to the following screenshot should appear after your policy runs. In case your policy hasn't run, wait for some time.

![Screenshot that shows audit policy results.](./media/network-watcher-builtin-policy/7_1_audit-policy-results.png)

## Deploy-if-not-exists policy

The deploy-if-not-exists policy checks all existing Azure Resource Manager objects of type `Microsoft.Network/networkSecurityGroups`. That is, it looks at all network security groups in a scope, and it checks for the existence of linked flow logs via the flow logs property of the network security group. If the property doesn't exist, the policy deploys a flow log.

To get the full definition of the policy, go to the [Definitions tab](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and search for **flow logs** to find the policy.

### Assignment

1. Fill in your policy details:

   - **Scope**: A subscription is a common choice. You can also choose a management group or resource group as relevant to you.  
   - **Policy definition**: This definition is for the policy that you assigned earlier.
   - **Assignment name**: Choose a descriptive name.

2. Add policy parameters.

   Network Watcher is a regional service. These parameters allow the policy action of deploying flow logs to be executed:

   - **NSG Region**: Azure region at which you're targeting the policy.
   - **Storage id**: Full resource ID of the storage account. This storage account should be in the same region as the network security group.
   - **Network Watchers RG**: Name of the resource group that contains your Network Watcher resource. If you haven't renamed it, you can enter **NetworkWatcherRG**, which is the default Network Watcher resource group.
   - **Network Watcher name**: Name of the regional Network Watcher service. Format: **networkwatcher_\<region\>**. Example: **networkwatcher_eastus2**.

   ![Screenshot that shows parameters for the deploy-if-not-exists policy.](./media/network-watcher-builtin-policy/5_2_1_dine-policy-details-alt.png)

3. Add remediation details:

   - Select the **Create a remediation task** checkbox if you want the policy to affect existing resources.
   - The **Create a Managed Identity** checkbox should be selected already.
   - For **Managed identity location**, select the same location that you used earlier.

   You need Contributor or Owner permission to use this policy. If you have either of these permissions, no errors should appear.

   ![Screenshot that shows details for deploy-if-not-exists policy remediation.](./media/network-watcher-builtin-policy/5_2_2_dine-remediation.png)

4. Select **Review + create** to review your assignment. Select **Create** when you're finished.

   ![Screenshot that shows the tab for reviewing and creating a deploy-if-not-exists policy.](./media/network-watcher-builtin-policy/5_2_3_dine-review.png)

### Results

To check the results, open the **Compliance** tab and search for the name of your assignment. Something similar to the following screenshot should appear after your policy runs. In case your policy hasn't run, wait for some time.

![Screenshot that shows deploy-if-not-exists policy results.](./media/network-watcher-builtin-policy/7_2_dine-policy-results.png)  

## Next steps

- To learn more about NSG flow logs, see [Flow logs for network security groups](./network-watcher-nsg-flow-logging-overview.md).
- To learn about using built-in policies with traffic analytics, see [Manage traffic analytics by using Azure Policy](./traffic-analytics-policy-portal.md).
- To learn how to use an Azure Resource Manager template to deploy flow logs and traffic analytics, see [Configure NSG flow logs by using an Azure Resource Manager template](./quickstart-configure-network-security-group-flow-logs-from-arm-template.md).
