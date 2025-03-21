---
title: Update managed resources
description: Describes how to work on resources in the managed resource group for an Azure managed application.
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 08/29/2024
---

# Work with resources in the managed resource group for Azure managed application

This article describes how to update resources that are deployed as part of a managed application. As the publisher of a managed application, you have management access to resources in the managed resource group in the customer's Azure tenant. To update these resources, you need to sign in to the customer's subscription, find the managed resource group associated with a managed application, and access the resources in the managed resource group. For more information about permissions, see [Publisher and customer permissions](./overview.md#publisher-and-customer-permissions).

This article assumes you deployed the managed application in the [Managed Web Application (IaaS) with Azure management services](https://github.com/Azure/azure-managedapp-samples/tree/master/Managed%20Application%20Sample%20Packages/201-managed-web-app) sample project. That managed application includes a **Standard_D1_v2** virtual machine. If you didn't deploy that managed application, you can still use this article to become familiar with the steps for updating a managed resource group.

The following image shows the deployed managed application.

![Deployed managed application](./media/update-managed-resources/deployed.png)

In this article, you use Azure CLI to:

- Identify the managed application.
- Identify the managed resource group.
- Identify the virtual machine resource in the managed resource group.
- Change the virtual machine size, either to a smaller size if not utilized, or a larger to support more load.
- Assign a policy to the managed resource group that specifies the allowed locations.

## Get managed application and managed resource group

To get the managed applications in a resource group, use the following commands. Replace `<resourceGroupName>` with your resource group name.

```azurecli-interactive
az managedapp list --query "[?contains(resourceGroup,'<resourceGroupName>')]"
```

To get the ID of the managed resource group, use:

```azurecli-interactive
az managedapp list --query "[?contains(resourceGroup,'<resourceGroupName>')].{ managedResourceGroup:managedResourceGroupId }"
```

## Resize VMs in managed resource group

To see the virtual machines in the managed resource group, provide the name of the managed resource group. Replace `<mrgName>` with your managed resource group's name.

```azurecli-interactive
az vm list -g <mrgName> --query "[].{VMName:name,OSType:storageProfile.osDisk.osType,VMSize:hardwareProfile.vmSize}"
```

To update the size of the VMs, use:

```azurecli-interactive
az vm resize --size Standard_D2_v2 --ids $(az vm list -g <mrgName> --query "[].id" -o tsv)
```

After the operation completes, verify the application is running on Standard D2 v2.

![Managed application using Standard D2 v2](./media/update-managed-resources/upgraded.png)

## Apply policy to managed resource group

Get the managed resource group and assign a policy at that scope. The policy **e56962a6-4747-49cd-b67b-bf8b01975c4c** is a built-in policy to specify allowed locations.

```azurecli-interactive
managedGroup=$(az managedapp show --name <app-name> --resource-group <resourceGroupName> --query managedResourceGroupId --output tsv)

az policy assignment create --name locationAssignment --policy e56962a6-4747-49cd-b67b-bf8b01975c4c --scope $managedGroup --params '{
                            "listofallowedLocations": {
                                "value": [
                                    "northeurope",
                                    "westeurope"
                                ]
                            }
                        }'
```

To see the allowed locations, use:

```azurecli-interactive
az policy assignment show --name locationAssignment --scope $managedGroup --query parameters.listofallowedLocations.value
```

The policy assignment appears in the portal.

![View policy assignment](./media/update-managed-resources/assignment.png)

## Next steps

- For an introduction to managed applications, see [Azure Managed Applications overview](overview.md).
- For sample projects, see [Sample projects for Azure managed applications](sample-projects.md).
