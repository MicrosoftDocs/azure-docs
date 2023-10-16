---
title: Move Azure Virtual Desktop resources between regions - Azure
description: How to move Azure Virtual Desktop resources between regions.
author: Heidilohr
ms.topic: how-to
ms.date: 05/13/2022
ms.author: helohr
manager: femila
---
# Move Azure Virtual Desktop resource between regions

In this article, we'll tell you how to move Azure Virtual Desktop resources between Azure regions.

>[!NOTE]
>This process doesn't perform an actual resource move. Instead, you delete the old resources and recreate them in the region you want to move the resources to. We recommend you test this process before using it on production workloads to understand how it will impact your deployment.
>
> The information in this article applies to all Azure Virtual Desktop resources, including host pools, application groups, scaling plans, and workspaces.

## Important information

When you move Azure Virtual Desktop resources between regions, these are some things you should keep in mind:

- When exporting resources, you must move them as a set. All resources associated with a specific host pool have to stay together. A host pool and its associated application groups need to be in the same region.

- Workspaces and their associated application groups also need to be in the same region.

- Scaling plans and the host pools they are assigned to also need to be in the same region.

- All resources to be moved have to be in the same resource group. Template exports require having resources in the same group, so if you want them to be in a different location, you'll need to modify the exported template to change the location of its resources.

- Once you're done moving your resources to a new region, you must delete the original resources. The resource ID of your resources won't change during the moving process, so there will be a name conflict with your old resources if you don't delete them.

- Existing session hosts attached to a host pool that you move will stop working. You'll need to recreate the session hosts in the new region.

## Export a template

The first step to move your resources is to create a template that contains everything you want to move to the new region.

To export a template:

1. In the Azure portal, go to **Resource Groups**, then select the resource group that contains the resources you want to move.

2. Once you've selected the resource group, go to **Overview** > **Resources** and select all the resources you want to move.

3. Select the **...** button in the upper right-hand corner of the **Resources** tab. Once the drop-down menu opens, select **Export template**.

4. Select **Download** to download a local copy of the generated template.

5. Right-click the zip file and select **Extract All**.

## Modify the exported template

Next, you'll need to modify the template to include the region you're moving your resources to.

To modify the template you exported:

1. Open the template.json file you extracted from the zip folder and a text editor of your choice, such as Notepad.

2. In each resource inside the template file, find the "location" property and modify it to the location you want to move them to. For example, if your deployment's currently in the East US region but you want to move it to the West US region, you'd change the "eastus" location to "westus." Learn more about which Azure regions you can use at [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/#geographies).

3. If you are moving a host pool, remove the "publicNetworkAccess" parameter, if present.

## Delete original resources

Once you have the template ready, you'll need to delete the original resources to prevent name conflicts.

To delete the original resources:

1. Go back to the **Resources** tab mentioned in [Export a template](#export-a-template) and select all the resources you exported to the template.

2. Next, select the **...** button again, then select **Delete** from the drop-down menu.

3. If you see a message asking you to confirm the deletion, select **Confirm**.

4. Wait a few minutes for the resources to finish deleting. Once you're done, they should disappear from the resource list.

## Deploy the modified template

Finally, you'll need to deploy your modified template in the new region.

To deploy the template:

1. In the Azure portal, search for and select **Deploy a custom template**.
2. In the custom deployment menu, select **Build your own template in the editor**.
3. Next, select **Load file** and upload your modified template file. 
   
   >[!NOTE]
   > Make sure to upload the template.json file, not the parameters.json file.

4. When you're done uploading the template, select **Save**.
5. In the next menu, select **Review + create**.
6. Under **Instance details**, make sure the **Region** shows the region you changed the location to in [Modify the exported template](#modify-the-exported-template). If not, select the correct region from the drop-down menu.
7. If everything looks correct, select **Create**.
8. Wait a few minutes for the template to deploy. Once it's finished, the resources should appear in your resource list.

## Next steps

- Find out which Azure regions are currently available at [Azure Geographies](https://azure.microsoft.com/global-infrastructure/geographies/#overview).

- See [our Azure Resource Manager templates for Azure Virtual Desktop](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates) for more templates you can use in your deployments after you move your resources.

