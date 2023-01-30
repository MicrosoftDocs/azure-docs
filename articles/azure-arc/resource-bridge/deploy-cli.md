---
title: Deploy Arc resource bridge (preview) by using Azure CLI commands
description: Learn how to use Azure CLI commands to manage your Azure Arc resource bridge (preview) deployment.
ms.date: 01/30/2023
ms.topic: overview
---

# Deploy Arc resource bridge (preview) by using Azure CLI commands

Arc resource bridge can be deployed using Azure CLI commands. These commands are executed in the order shown here.

This topic provides a brief description of these commands, with tips on how to use them.

## az arcappliance createconfig

Creates the configuration files used by Arc resource bridge. The credentials that are provided during `createconfig` (ex: vCenter credentials for VMware) are stored in a configuration file and locally within Arc resource bridge. The credentials should be a separate user account used only by Arc resource bridge with permission to view, create, delete and manage on-premise resources. If the credentials change, then the credentials on the bridge should be rotated.

The `createconfig` command features two modes: interactive and non-interactive. Interactive mode provides helpful prompts that explain the parameter and what to pass. It is initiated by passing only the three required parameters. Non-interactive mode allows you to pass all the parameters needed to create the configuration files without being prompted which saves time and is useful for automation scripts. Three configuration files are generated: resource.yaml, appliance.yaml and infra.yaml.  These files should be kept and stored in a secure location as they are required for maintenance of Arc resource bridge.

> [!NOTE]
> Azure Stack HCI and Hybrid AKS use different commands to create the Arc resource bridge configuration files.

## az arcappliance validate

Checks the configuration files for a valid schema, cloud and core validations (such as deployment host to SFS connectivity), network settings, and no proxy settings.  

## az arcappliance prepare

Downloads the OS images from Microsoft and uploads them to the on-premises cloud image gallery to prepare for the creation of the appliance VM.  This command can take up to 30 minutes to complete, depending on the network download speed. Please allow the command to complete before running additional commands.

## az arcappliance deploy

Deploys an on-premises instance of Arc resource bridge as an appliance VM, bootstrapped to be a Kubernetes management cluster. Gets all necessary pods into a running state.

## az arcappliance create

Creates Arc resource bridge in Azure as an ARM resource and establishes the connection between the ARM resource and on-premises appliance VM. This is the last step in the deployment process.  

## az arcappliance show

Gets the ARM resource information for Arc resource bridge. This is useful to monitor the status of the appliance. Successful appliance creation results in `ProvisioningState = Succeeded` and `Status = Running`.

## az arcappliance delete

Deletes the appliance VM and Azure resources. It does not clean up the OS image, which remains in the on-premises cloud gallery. If a deployment fails, you must run this command to clean up the environment before you attempt to deploy again.

> [!NOTE]
> A partner product may choose to deploy Arc resource bridge differently, by utilizing these commands in one automation script and incorporating additional provider-specific commands. For more information about installing Arc resource bridge as paired with a corresponding partner product, see:
>
> - [Azure Stack HCI VM Management through Arc resource bridge](/azure-stack/hci/manage/azure-arc-vm-management-prerequisites)
> - [Connect VMware vCenter Server to Azure with Arc resource bridge](../vmware-vsphere/quick-start-connect-vcenter-to-arc-using-script.md)
> - [Connect System Center Virtual Machine Manager (SCVMM) to Azure with Arc resource bridge](../system-center-virtual-machine-manager/quickstart-connect-system-center-virtual-machine-manager-to-arc.md#download-the-onboarding-script)

## Next steps

- Explore the full list of [Arc resource bridge commands and required parameters](/cli/azure/arcappliance).
- Get [troubleshooting tips for Arc resource bridge](troubleshoot-resource-bridge.md).
