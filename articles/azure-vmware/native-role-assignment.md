---
title: Configure AVS Identities Role Assignments Manually
description: Learn how to configure role assignments manually for Azure VMware Solution Generation 2 private clouds to ensure correct identity permissions.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 8/28/2025
#customer intent: As a cloud administrator, I want to configure the correct role assignments for Azure VMware Solution Generation 2 private clouds so that my private cloud can operate properly in my subscription.
---

# Configure Azure VMware Solution Gen 2 identities role assignments manually

This article describes the steps required to ensure the correct role assignments are in place for your private cloud. These role assignments are automatically created when the private cloud is deployed, but you may need to configure them manually if the assignments are missing or were deleted.  

## Summary

- Create a role assignment to give the **“Avs Fleet Rp”** service principal the **AVS Orchestrator** role on the target resource group for the private cloud.  
- Create a role assignment to give the **“AzS VIS Prod App”** service principal the **AVS on Fleet VIS Role** on the target resource group for the private cloud.  

## Detailed steps

### Assign **AVS Orchestrator** role to *Avs Fleet Rp*

1. Navigate to the **Resource Group** targeted for private cloud deployment and select **Access Control (IAM)**.  
2. Select **Add role assignment**.  
3. Search for and select **AVS Orchestrator Role**, then click **Next**.  
4. Select the **Avs Fleet Rp** application.  
5. Confirm that the role assignment is configured as **permanent**, then click **Review + assign**.  
6. Go to the **Role assignments** tab and search for **Avs Fleet Rp**. Confirm that the **AVS Orchestrator Role** assignment exists for the **Avs Fleet Rp** application.  

### Assign **AVS on Fleet VIS Role** to *AzS VIS Prod App*

1. Navigate to the **Resource Group** targeted for private cloud deployment and select **Access Control (IAM)**.  
2. Select **Add role assignment**.  
3. Search for and select **AVS on Fleet VIS Role**, then click **Next**.  
4. Select the **AzS VIS Prod App** application.  
5. Confirm that the role assignment is configured as **permanent**, then click **Review + assign**.  
6. Go to the **Role assignments** tab and search for **AzS VIS Prod App**. Confirm that the **AVS on Fleet VIS Role** assignment exists for the **AzS VIS Prod App** application.  

## Validation

To validate the configuration:  

- Ensure that **Avs Fleet Rp** has the **AVS Orchestrator Role** assigned in the private cloud’s resource group.  
- Ensure that **AzS VIS Prod App** has the **AVS on Fleet VIS Role** assigned in the private cloud’s resource group.  

Both assignments are required for the private cloud to operate correctly.  

## Next steps

- Learn more about [Azure VMware Solution Gen 2 private cloud design considerations](native-network-design-consideration.md).  
- Review [Creating an Azure VMware Gen 2 private cloud](native-create-azure-vmware-virtual-network-private-cloud.md).  
