---
title: Move a schedule to another region
description: This article explains how to move a top level schedule to another Azure region.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 05/09/2022
ms.custom: UpdateFrequency2
---
# Move a schedule to another region

In this article, you'll learn how to move a schedule by using an Azure Resource Manager (ARM) template. 

DevTest Labs supports two types of schedules.

- Schedules apply only to compute virtual machines (VMs): schedules are stored as microsoft.devtestlab/schedules resources, and often referred to as top level schedules, or simply schedules. 

- Lab schedules apply only to DevTest Labs (DTL) VMs: lab schedules. They are stored as microsoft.devtestlab/labs/schedules resources. This type of schedule is not covered in this article.

In this article, you'll learn how to:
> [!div class="checklist"]
> >
> - Export an ARM template that contains your schedules. 
> - Modify the template by adding or updating the target region and other parameters.
> - Delete the resources in the source region.

## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.
- For preview features, ensure that your subscription is allowlisted for the target region.
- Ensure a Compute VM exists in the target region.

## Move an existing schedule
There are two ways to move a schedule:

 - Manually recreate the schedules on the moved VMs. This process can be time consuming and error prone. This approach is most useful when you have a few schedules and VMs.
 - Export and redeploy the schedules by using ARM templates.

Use the following steps to export and redeploy your schedule in another Azure region by using an ARM template:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Go to the source resource group that held your VMs.

3. On the **Resource Group Overview** page, under **Resources**, select **Show hidden types**.

4. Select all resources with the type **microsoft.devtestlab/schedules**.
 
5. Select **Export template**.

    :::image type="content" source="./media/how-to-move-schedule-to-new-region/move-compute-schedule.png" alt-text="Screenshot that shows the hidden resources in a resource group, with schedules selected.":::

6. On the **Export resource group template** page, select **Deploy**.

7. On the **Custom deployment** page, select **Edit template**.
 
8. In the template code, change all instances of `"location": "<old location>"` to `"location": "<new location>"` and then select **Save**.

9. On the **Custom deployment** page, enter values that match the target VM:

   |Name|Value|
   |----|----|
   |**Subscription**|Select an Azure subscription.|
   |**Resource group**|Select the resource group name. |
   |**Region**|Select a location for the lab schedule. For example, **Central US**. |
   |**Schedule Name**|Must be a globally unique name. |
   |**VirtualMachine_xxx_externalId**|Must be the target VM. |
 
    :::image type="content" source="./media/how-to-move-schedule-to-new-region/move-schedule-custom-deployment.png" alt-text="Screenshot that shows the custom deployment page, with new location values for the relevant settings.":::

    >[!IMPORTANT]
    >Each schedule must have a globally unique name; you will need to change the schedule name for the new location.

10. Select **Review and create** to create the deployment.

11. When the deployment is complete, verify that the new schedule is configured correctly on the new VM.

## Discard or clean up

Now you can choose to clean up the original schedules if they're no longer used. Go to the original schedule resource group (where you exported templates from in step 5 above) and delete the schedule resource.

## Next steps

In this article, you moved a schedule from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move a DevTest Labs to another region](./how-to-move-labs.md).
- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md).
