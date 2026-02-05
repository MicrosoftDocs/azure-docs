---
title: Deploy a community on Azure Virtual Enclaves
description: Deploy a community on Azure Virtual Enclaves.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 12/18/2024
ms.custom: references_regions
---

# Tutorial 1-1: Deploy a community on Azure Virtual Enclaves

⏱️ **Estimated time to complete:**
- Reading: 15 minutes
- Implementation: 45 minutes
- Total: 60 minutes

💡 **Complexity level:** Beginner

## Overview

Azure Virtual Enclaves is an Azure service that accelerates and streamlines the deployment and management of secure, isolated, and compliant cloud environments for the most sensitive mission workloads.

Communities are isolated hub networks that can securely and logically group several enclaves together for governance, management, and security purposes. A community owner can enable other communities or on-premises networks to connect through transit hub or endpoints.

In this tutorial, part one of eight, you prepare a monitored and secure network cloud environment in the Azure portal using Azure Virtual Enclaves. One [enclave](./what-enclave.md) contains web applications and is publicly accessible by routing traffic through a second enclave with a Web Application Gateway, Web Application Firewall, and a Public IP address. An [enclave endpoint](./what-enclave-endpoint.md) for the Web App and creating an [enclave connection](./what-enclave-connection.md) between the Web App enclave and second enclaves enables Web App access.

You learn how to:
  - Plan your community architecture and address space
  - Deploy a community for your enclaves
  - Understand hub-and-spoke topology benefits
  - Validate community deployment and networking
  - Monitor your community infrastructure

## Prerequisites

**Azure requirements:**
  - Azure subscription with appropriate quotas
  - Required Azure role permissions for Role Based Access Control (RBAC):
  - Contributor on subscription or resource group
  - User Access Administrator (for other RBAC assignments)
  - Azure CLI or PowerShell installed (optional, for validation)

**Knowledge:**
- Basic understanding of Azure networking concepts
- Familiarity with Azure Resource Manager
- Understanding of private IP addressing

## Before you begin

### Planning your community

Before creating your community, consider these important planning aspects:

#### Address space planning

Calculate the total IP space needed for all planned enclaves:

- **Estimate enclave count**: Plan for current needs plus 20-30% growth
- **Calculate required space**: Each enclave typically needs /16 to /24 CIDR
- **Avoid overlaps**: Ensure no overlap with on-premises networks or other Azure environments
- **Can't be changed**: Address space can't be modified after creation

**Example calculation:**
- Planning five enclaves, each with /16 CIDR (65,536 IPs each and 327,680 IPs total)
- Minimum community CIDR: /12 (1,048,576 IPs total)
- Recommended: /11 or /10 for growth buffer

**Address space size recommendations:**

| Deployment Size | Enclave Count | Recommended CIDR | Available IPs |
|-----------------|---------------|------------------|---------------|
| **Small** | 1-3 enclaves | /14 | 262,144 |
| **Medium** | 4-10 enclaves | /12 | 1,048,576 |
| **Large** | 11-25 enclaves | /11 | 2,097,152 |
| **Enterprise** | 26+ enclaves | /10 | 4,194,304 |

> [!TIP]
> Use the [Azure IP Address Calculator](https://www.subnet-calculator.com/cidr.php) to plan your address space.

#### Naming convention

Establish naming standards before deployment:

**Recommended naming pattern:**
- Format: `<organization>-<environment>-<purpose>`
- Examples:
  - `contoso-prod-main` - Production community
  - `fabrikam-dev-sandbox` - Development community
  - `northwind-test-validation` - Test community

**Additional naming considerations:**
- Keep names concise (3-24 characters)
- Use lowercase letters and hyphens
- Avoid special characters
- Document naming convention for team reference

#### Region selection

Choose the Azure region based on:

**Data residency requirements:**
- Regulatory compliance
- Data sovereignty requirements
- Industry-specific regulations

**Service availability:**
- Verify Azure Virtual Enclaves availability in region
- Check required Azure services are available
- Consider preview vs. GA features

**Performance and cost:**
- Proximity to users for lower latency
- Network egress costs
- Azure pricing variations by region

**Disaster recovery:**
- Plan for secondary region if needed
- Consider paired regions for Azure DR

> [!IMPORTANT]
> All enclaves within a community must be deployed in the same Azure region as the community. You can create communities in different regions and connect them together.

## Architecture considerations

### Hub-and-spoke topology

Communities create the hub and enclaves create the spokes for your hub-and-spoke network topology that provides several architectural benefits:

**Hub (Community) components:**
- **Azure Firewall**: Centralized traffic inspection and filtering
- **Virtual Network Gateway**: Connectivity to on-premises networks (optional)
- **Centralized Logging**: Configurable logging and monitoring
- **Shared services**: Monitoring, DNS, management resources
- **Policy enforcement**: Centralized governance and compliance

**Spoke (Enclave) components:**
- **Isolated virtual networks**: Separate network boundaries per enclave
- **Workload resources**: Application-specific Azure resources
- **Network Security Groups**: Subnet-level security controls
- **Private endpoints**: Secure connectivity to Azure PaaS services

**Benefits of hub-and-spoke topology:**

| Benefit | Description |
|---------|-------------|
| **Network isolation** | Each enclave is isolated with independent address space |
| **Centralized security** | Single point for traffic inspection and policy enforcement |
| **Cost optimization** | Shared infrastructure (firewall, VPN gateway) reduces costs |
| **Simplified management** | Centralized monitoring and governance |
| **Scalability** | Easily add new enclaves without affecting existing ones |
| **Controlled connectivity** | Explicit enclave connections required for inter-enclave traffic |

### Security by default

Communities provide multiple security layers:

**Network security:**
- Isolated network boundaries with Azure Firewall
- Deny network traffic by default
- Explicit allow rules through community and enclave endpoints
- Network traffic logging for audit and compliance

**Governance and compliance:**
- Centralized Azure Policy enforcement
- Built-in compliance frameworks
- Policy exemption workflows with approval
- Audit logging of all administrative actions

**Access controls:**
- Just-in-time (JIT) access for administrative operations
- Maintenance mode for temporary elevated access
- Role-based access control (RBAC) integration
- Managed identity support

**Monitoring and observability:**
- Log Analytics workspace integration
- Azure Monitor for metrics and alerts
- Azure Firewall threat intelligence
- Network flow logs and diagnostics

### Architecture diagram

The following diagram shows the high-level architecture of an Azure Virtual Enclaves community:

[ ![Diagram showing two example workloads linked to both the other Virtual Enclaves resources and their workload resource groups.](./media/mermaid-workloads-example.png) ](./media/mermaid-workloads-example.png#lightbox)

<!--
The mermaid definition for the above graph is in the what-workload.md file
-->

## Create a community in Azure Virtual Enclaves

### Prepare resource group

Before creating a community, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources.

> [!IMPORTANT]
> This tutorial uses `myResourceGroup` as a placeholder for the resource group name. You can optionally replace `myResourceGroup` with your own resource group name following your naming convention.

**Best practices for resource group:**
- Use descriptive names that indicate purpose and environment
- Apply tags for organization and cost tracking
- Ensure appropriate RBAC permissions are assigned
- Consider resource group location (should match community region)

### Deploy the community

Community deployments take approximately **30-45 minutes** to complete. Azure Virtual Enclaves creates several resources including networking, firewall, and monitoring infrastructure.

#### Step 1: Navigate to Azure Virtual Enclaves

In the **Azure Virtual Enclaves** page, select the **Communities** option in the left menu.

[ ![Screenshot showing the Azure portal homepage for Azure Virtual Enclaves with the Create a Community button.](./media/azure-virtual-enclaves-homepage.png) ](./media/azure-virtual-enclaves-homepage.png#lightbox)

#### Step 2: Start community creation

On the `Communities` page, select `Create`.

[ ![Screenshot showing the Azure Virtual Enclaves portal page with the communities list selected.](./media/tutorial-step-one-azure-virtual-enclaves-page-communities-list.png) ](./media/tutorial-step-one-azure-virtual-enclaves-page-communities-list.png#lightbox)

#### Step 3: Configure community settings

Enter the basic details for your community:

**Basic configuration:**
- **Subscription**: Select your Azure subscription
- **Resource Group**: `myResourceGroup` (or create new)
- **Community name**: `fabrikam` (or use your naming convention)
- **Region**: `East US` (choose based on your requirements)
- **Community address space**: `10.0.0.0/16`

**Understanding the configuration parameters:**

| Parameter | Description | Guidance |
|-----------|-------------|----------|
| **Subscription** | Azure subscription to bill resources | Use subscription with adequate quotas |
| **Resource Group** | Logical container for community resources | Create new or use existing |
| **Community name** | Unique identifier for the community | Follow naming convention, 3-24 characters |
| **Region** | Azure region for deployment | Can't be changed after creation |
| **Address space** | Private IP range for community | Must be RFC 1918, plan for growth |

**Address space guidance:**

Private IP address ranges (RFC 1918):
- `10.0.0.0/8` - Class A (16,777,216 addresses)
- `172.16.0.0/12` - Class B (1,048,576 addresses)
- `192.168.0.0/16` - Class C (65,536 addresses)

**For this tutorial:**
- Using `10.0.0.0/16` provides 65,536 IP addresses
- Sufficient for 3-5 enclaves with moderate-sized subnets
- Consider larger CIDR (for example, /14 or /12) for production to allow growth

> [!CAUTION]
> The community address space **cannot be changed** after deployment. Plan carefully and allocate sufficient space for future growth.

![Screenshot showing the create community screen with the basics inputs for the tutorial environment.](./media/tutorial-step-one-create-community-screen-basics-input.png)

#### Step 4: Review and create

Select `Review + create` and validate the details for your community are correct.

**Validation checks:**
- Verify subscription and resource group are correct
- Confirm community name follows naming convention
- Validate region matches requirements
- Check address space is appropriate size and doesn't overlap
- Review any validation warnings or errors

#### Step 5: Create

Select `Create` to begin deployment.

**What happens during deployment:**

The deployment process creates:
- **Virtual Network**: Hub virtual network with community address space
- **Azure Firewall**: Premium or Standard tier for traffic filtering
- **Firewall Policy**: Default rules and policies
- **Log Analytics Workspace**: For monitoring and diagnostics
- **Managed Resource Group**: Contains Azure-managed infrastructure
- **Diagnostic Settings**: Logs and metrics configuration
- **Network Security Groups**: Default security rules

**Monitoring deployment progress:**
- Track deployment status in Azure portal notifications
- Review deployment logs if issues occur
- Estimated time: 30-45 minutes
- Status shows "Running" then "Succeeded"

## Validate deployment

After the community deployment completes, perform these validation steps to ensure everything is configured correctly.

### Step 1: Check community status

1. Navigate to the community in Azure portal
2. Verify **Status** shows **Succeeded**
3. Review the **Overview** page for basic information

![Screenshot showing created community on its overview page.](./media/tutorial-step-one-community-overview-page.png)

**Key information to verify:**
- **Provisioning State**: Should be "Succeeded"
- **Resource Group**: Correct resource group listed
- **Location**: Matches selected region
- **Address Space**: Correct CIDR displayed
- **Managed Resource Group**: Created automatically

### Step 2: Verify network configuration

1. In the community overview, select **Managed Resource Group**
2. Review the resources created:

**Expected resources in managed resource group:**
- Virtual Network (virtual network) with community address space
- Azure Firewall or Firewall Policy
- Public IP address for firewall
- Route tables
- Network security groups

**Verify Virtual Network:**
- Navigate to the virtual network in the managed resource group
- Check address space matches your configuration
- Confirm subnets created for firewall and other components

### Step 3: Review monitoring setup

1. Navigate to **Diagnostic settings** in the community
2. Verify Log Analytics workspace connection

**Expected monitoring configuration:**
- Log Analytics workspace created or linked
- Diagnostic settings enabled for community
- Azure Firewall logs configured
- Metrics collection enabled

**Verify logging is working:**
Adjust the `ago(1hr)` if more time passed since the deployment.
```kusto
// Query to verify logs are flowing (run in Log Analytics)
AzureDiagnostics
| where TimeGenerated > ago(1h)
| where Category == "AzureFirewallApplicationRule" or Category == "AzureFirewallNetworkRule"
| summarize Count = count() by Category
| order by Count desc
```

### Step 4: Review RBAC and access

1. Navigate to **Access control (IAM)** in the community
2. Review role assignments

**Expected roles:**
- Your user account should have appropriate permissions
- Azure Virtual Enclaves service principal might have assignments
- Review inherited permissions from subscription/resource group

### Validation checklist

After deployment, confirm:

  - Community status shows **Succeeded**
  - Community managed resource group created with expected resources
  - Virtual Network configured with correct address space and subnets
  - Azure Firewall deployed and running
  - Log Analytics workspace connected
  - Diagnostic settings enabled
  - RBAC permissions are configured
  - No deployment errors in activity log

## Clean up resources

If you need to delete your community after completing this tutorial:

> [!WARNING]
> Deleting a community is **permanent** and **cannot be undone**. All enclaves, workloads, and resources within the community are deleted. Deletion is blocked if any of the workload resources groups contain resources to prevent accidental deletion.

**Before deleting:**
- Export any important configurations or data
- Document network settings for reference
- Notify team members of planned deletion
- Remove any dependencies (virtual network peering, connections)

**To delete a community:**

1. Navigate to Azure Virtual Enclaves in Azure portal
2. Select **Communities** from the left menu
3. Select the community to delete (for example, `fabrikam`)
4. Select **Delete** from the top menu
5. Type the community name to confirm deletion
6. Select **Delete**

![Screenshot showing the completed community in the Azure Virtual Enclaves portal page communities list.](./media/tutorial-step-one-azure-virtual-enclaves-page-communities-list-deployed.png)

**Alternative deletion via Azure CLI:**
```azurecli
# Delete community (replace with your values)
az resource delete \
  --resource-group myResourceGroup \
  --resource-type Microsoft.AVE/communities \
  --name fabrikam
```

**What gets deleted:**
- Community resource
- All enclaves within the community
- All workloads and workload resource groups (if they're empty)
- Managed resource groups
- Azure Firewall and associated resources
- Log Analytics workspace (if not shared)

**What is retained:**
- Resource group (if containing other resources)
- Any resources not managed by AVE
- Log Analytics data (based on retention settings)

## Troubleshooting

### Issue: Deployment fails with address space overlap error

**Symptom:**
Deployment fails with error message about address space conflicts

**Possible causes:**
- Address space overlaps with existing virtual network in subscription
- Address space conflicts with on-premises network
- Address space overlaps with virtual network peering connections

**Resolution steps:**
1. Review existing VNets in your subscription:
   ```azurecli
   az network vnet list --output table
   ```
2. Choose a different, nonoverlapping CIDR block
3. Verify with network team if using hybrid connectivity
4. Restart deployment with new address space

**Prevention:**
Maintain an IP address management (IPAM) spreadsheet documenting all allocated ranges

### Issue: Deployment takes longer than expected

**Symptom:**
Deployment running for more than 60 minutes

**Possible causes:**
- Azure region experiencing high load
- Complex firewall policy configurations
- Resource provider registration delays

**Resolution steps:**
1. Check Azure status page for service health issues
2. Review deployment logs in Activity Log
3. Contact Azure support if deployment exceeds 90 minutes
4. Don't cancel deployment unless explicitly advised

**Prevention:**
Deploy during off-peak hours when possible

### Issue: Can't access community after deployment

**Symptom:**
Community deployed but inaccessible in portal

**Possible causes:**
- Insufficient RBAC permissions
- Conditional Access policies blocking access
- Managed resource group permissions issue

**Resolution steps:**
1. Verify you have Reader or Contributor role on community
2. Check Conditional Access policies in Microsoft Entra ID
3. Request access from subscription administrator
4. Clear browser cache and retry

**Prevention:**
Ensure proper RBAC assignments before starting deployment

### Getting help

If you continue experiencing issues:

1. **Check the AVE troubleshooting guide**: [Troubleshooting guide](./troubleshoot.md)
2. **Review logs**: Check Activity Log for error messages
3. **Azure documentation**: Review [Azure Virtual Enclaves documentation](./index.yml)
4. **Contact support**: Create a support ticket with:
   - Subscription ID
   - Community resource ID
   - Timeline of deployment events
   - Error messages and screenshots
   - Deployment correlation ID

## Understanding community costs

Create an Azure Calculator estimate for your [community](https://aka.ms/ave/calc).

**Cost optimization tips:**
- Use Standard tier firewall for dev/test
- Configure log retention policies appropriately
- Monitor and right-size resources
- Use Microsoft Cost Management for tracking

## Next steps

Congratulations! You successfully deployed an Azure Virtual Enclaves community.

In the next tutorial, you'll learn how to create isolated enclaves within your community to host workloads.

> [Tutorial 1-2: Create enclaves inside a community](./1-2-create-enclaves-inside-community.md)

## Related content

- [What is a community?](./what-community.md)
- [What is an enclave?](./what-enclave.md)
- [Best practices for Azure Virtual Enclaves](./best-practices.md)
- [Azure Virtual Enclaves FAQs](./virtual-enclaves-faq.md)
- [Naming rules and restrictions](./name-rules-restrictions-azure-virtual-enclaves-resources.md)
- [Quotas and region availability](./quotas-region-availability-azure-virtual-enclaves.md)